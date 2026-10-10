import { createHash } from 'node:crypto';
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { gunzipSync } from 'node:zlib';
import * as tar from 'tar';

const MAX_BYTES = 50 * 1024 * 1024;
const MAX_FILES = 2000;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const safePath = path => typeof path === 'string' && /^[A-Za-z0-9_.\/-]+$/.test(path) &&
  !path.startsWith('/') && path.split('/').every(part => part && part !== '.' && part !== '..');
const safeReleaseId = id => typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,100}$/.test(id);

export function inventorySite(directory) {
  const root = resolve(directory), files = [];
  if (!lstatSync(root).isDirectory() || lstatSync(root).isSymbolicLink()) throw new Error('Site root must be a real directory');
  let bytes = 0;
  function walk(path) {
    for (const name of readdirSync(path).sort()) {
      const entry = join(path, name), stat = lstatSync(entry);
      if (stat.isSymbolicLink()) throw new Error('Site artifacts cannot contain links');
      if (stat.isDirectory()) walk(entry);
      else if (stat.isFile()) {
        const filePath = relative(root, entry).split('\\').join('/');
        if (!safePath(filePath)) throw new Error(`Unsafe site path: ${filePath}`);
        bytes += stat.size;
        if (bytes > MAX_BYTES || files.length >= MAX_FILES) throw new Error('Site exceeds the MVP artifact budget');
        files.push({ path: filePath, bytes: stat.size, sha256: digest(readFileSync(entry)) });
      } else throw new Error('Site artifacts require regular files');
    }
  }
  walk(root);
  return files;
}

function validateRecord(record) {
  if (record.version !== 1 || record.mode !== 'publication' || !safeReleaseId(record.releaseId) ||
      record.archiveFile !== `${record.releaseId}.tar.gz` || !/^[a-f0-9]{64}$/.test(record.artifactDigest ?? '') ||
      !/^[a-f0-9]{64}$/.test(record.contentDigest ?? '') || !Array.isArray(record.files) || !record.files.length ||
      !Number.isSafeInteger(record.entityCount) || record.entityCount < 1 || !Number.isSafeInteger(record.relationshipCount) || record.relationshipCount < 1 ||
      record.files.length > MAX_FILES) throw new Error('Invalid public artifact record');
  const files = new Map();
  let bytes = 0;
  for (const file of record.files) {
    if (!safePath(file.path) || files.has(file.path) || !Number.isSafeInteger(file.bytes) || file.bytes < 0 ||
        !/^[a-f0-9]{64}$/.test(file.sha256 ?? '')) throw new Error('Invalid or duplicate artifact file record');
    bytes += file.bytes;
    files.set(file.path, file);
  }
  if (bytes > MAX_BYTES || !files.has('release.json')) throw new Error('Invalid artifact size or missing release metadata');
  return files;
}

/** Reads the archive once; restoration consumes these same verified bytes. */
export async function verifySiteArchive(archivePath, record) {
  const expected = validateRecord(record);
  const stat = lstatSync(archivePath);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > MAX_BYTES) throw new Error('Invalid compressed artifact');
  const compressed = readFileSync(archivePath);
  if (digest(compressed) !== record.artifactDigest) throw new Error('Archive SHA-256 does not match the recorded artifact');
  const bytes = gunzipSync(compressed, { maxOutputLength: MAX_BYTES + 4 * 1024 * 1024 });
  const seen = new Set(), errors = [];
  let metadata;
  const parser = tar.t({ strict: true, onReadEntry(entry) {
    const path = entry.path.replace(/^\.\//, '');
    if (entry.type !== 'File' || !safePath(path) || !expected.has(path) || seen.has(path)) {
      errors.push(`Unexpected, duplicate or unsafe archive entry: ${entry.path} (${entry.type})`);
      return;
    }
    seen.add(path);
    const file = expected.get(path);
    if (entry.size !== file.bytes) errors.push(`Archive size differs: ${path}`);
    const hash = createHash('sha256'), chunks = [];
    entry.on('data', chunk => { hash.update(chunk); if (path === 'release.json' && file.bytes <= 16_384) chunks.push(chunk); });
    entry.on('end', () => {
      if (hash.digest('hex') !== file.sha256) errors.push(`Archive file hash differs: ${path}`);
      if (path === 'release.json') {
        try { metadata = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { errors.push('Invalid archived release metadata'); }
      }
    });
  } });
  await pipeline(Readable.from([bytes]), parser);
  if (seen.size !== expected.size) errors.push('Archive is missing recorded files');
  if (metadata?.mode !== 'publication' || metadata?.releaseId !== record.releaseId || metadata?.contentDigest !== record.contentDigest ||
      metadata?.entityCount !== record.entityCount || metadata?.relationshipCount !== record.relationshipCount) errors.push('Archived release identity differs from the artifact record');
  if (errors.length) throw new Error(errors.join('\n'));
  return { record, bytes };
}

export async function archiveSite({ siteDirectory, outputDirectory, bundle, attestation, frontendBuildRevision, lockfilePath }) {
  const site = resolve(siteDirectory), output = resolve(outputDirectory);
  const metadata = JSON.parse(readFileSync(join(site, 'release.json'), 'utf8'));
  if (metadata.mode !== 'publication' || metadata.releaseId !== bundle.id || metadata.contentDigest !== bundle.manifest.contentDigest) throw new Error('Only the matching public build can be archived for launch');
  const files = inventorySite(site);
  mkdirSync(output, { recursive: true });
  const staging = mkdtempSync(join(output, '.archive-'));
  const archiveFile = `${bundle.id}.tar.gz`;
  const archivePath = join(staging, archiveFile);
  const created = [];
  try {
    await tar.c({ gzip: true, file: archivePath, cwd: site, portable: true, strict: true }, files.map(file => file.path));
    const record = {
      version: 1, ...metadata, archiveFile, artifactDigest: digest(readFileSync(archivePath)), files,
      reviewedCommit: attestation.reviewedCommit, frontendBuildRevision,
      lockfileDigest: digest(readFileSync(lockfilePath)), node: process.version,
    };
    await verifySiteArchive(archivePath, record);
    for (const [path, content] of [
      [join(output, archiveFile), readFileSync(archivePath)],
      [join(output, `${bundle.id}.archive.json`), `${JSON.stringify(record, null, 2)}\n`],
    ]) {
      writeFileSync(path, content, { flag: 'wx' });
      created.push(path);
    }
    return record;
  } catch (error) {
    for (const path of created) rmSync(path);
    throw error;
  } finally { rmSync(staging, { recursive: true, force: true }); }
}

/** Restores into a fresh sibling directory and never overwrites a deployed site. */
export async function restoreSiteArchive(archivePath, record, destination) {
  const verified = await verifySiteArchive(archivePath, record);
  const target = resolve(destination), parent = dirname(target);
  mkdirSync(parent, { recursive: true });
  // Reserve the destination exclusively before extracting any bytes.
  mkdirSync(target);
  const staging = mkdtempSync(join(parent, '.restore-'));
  try {
    await pipeline(Readable.from([verified.bytes]), tar.x({ cwd: staging, strict: true, noMtime: true,
      filter: (path, entry) => entry.type === 'File' && safePath(path.replace(/^\.\//, '')),
    }));
    const actual = inventorySite(staging);
    const expected = [...record.files].sort((a, b) => a.path.localeCompare(b.path));
    const sorted = actual.sort((a, b) => a.path.localeCompare(b.path));
    if (sorted.length !== expected.length || sorted.some((file, index) => ['path', 'bytes', 'sha256'].some(key => file[key] !== expected[index][key]))) throw new Error('Restored bytes differ from the archive manifest');
    // The reserved directory is empty; replace only this operation's reservation.
    renameSync(staging, target);
    return record;
  } catch (error) {
    rmSync(staging, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
    throw error;
  }
}
