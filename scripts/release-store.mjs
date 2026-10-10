import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, linkSync, unlinkSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { canonicalize, contentDigest, validatePreview, collections } from './validation.mjs';
import { reviewBinding, safeId } from './github-approval.mjs';
import { validateRevisionChanges } from './curation/reconcile.mjs';

const readJSON = path => JSON.parse(readFileSync(path, 'utf8'));

export function validateStoredRelease(bundle, attestation) {
  const preview = validatePreview(bundle);
  if (!preview.valid) throw new Error(preview.errors.join('\n'));
  if (!safeId(bundle.diseaseId) || !safeId(bundle.id) || bundle.illustrative ||
      !['approved', 'published'].includes(bundle.status) ||
      collections.some(name => bundle[name].some(item => !['approved', 'published'].includes(item.status))) ||
      bundle.claims.some(claim => claim.verification !== 'reviewed' || claim.reviewDisposition?.decision !== 'accepted')) {
    throw new Error('Public routing requires an approved, reviewed, self-contained disease release');
  }
  for (const [key, value] of Object.entries(reviewBinding(bundle))) {
    if (canonicalize(attestation?.[key]) !== canonicalize(value)) throw new Error(`Publication attestation mismatch: ${key}`);
  }
  if (attestation.version !== 1 || !/^[a-f0-9]{40}$/.test(attestation.frontendCommit) ||
      !/^[a-f0-9]{40}$/.test(attestation.reviewedCommit) || !/^[a-f0-9]{64}$/.test(attestation.policyDigest) ||
      !Array.isArray(attestation.approvals) || !attestation.approvals.length) throw new Error('Incomplete publication attestation');
}

/** Offline routing/integrity check. Live authenticated verification is a separate deployment gate. */
export function loadPublishedRelease(diseaseDirectory) {
  if (!existsSync(join(diseaseDirectory, 'current.json'))) throw new Error('No approved current root (current.json). Complete authenticated scientific publication first.');
  const current = readJSON(join(diseaseDirectory, 'current.json'));
  if (Object.keys(current).sort().join(',') !== 'contentDigest,releaseId' || !safeId(current.releaseId)) throw new Error('Invalid current-release pointer');
  const { bundle, attestation } = loadHistoricalRelease(diseaseDirectory, current.releaseId);
  if (bundle.id !== current.releaseId || contentDigest(bundle) !== current.contentDigest) throw new Error('Current pointer does not resolve to the exact immutable release');
  return { bundle, attestation };
}

/** Every ancestor resolves within this disease store, with its original bytes. */
export function loadHistoricalRelease(diseaseDirectory, releaseId, visited = new Set()) {
  if (!safeId(releaseId) || visited.has(releaseId)) throw new Error('Invalid release ID or cyclic lineage');
  visited.add(releaseId);
  const bundle = readJSON(join(diseaseDirectory, 'releases', `${releaseId}.json`));
  const attestation = readJSON(join(diseaseDirectory, 'releases', `${releaseId}.approval.json`));
  if (bundle.id !== releaseId) throw new Error('Stored release ID differs from its filename');
  validateStoredRelease(bundle, attestation);
  if (bundle.parentReleaseId !== null) {
    const parent = loadHistoricalRelease(diseaseDirectory, bundle.parentReleaseId, visited).bundle;
    if (parent.diseaseId !== bundle.diseaseId || parent.manifest.contentDigest !== bundle.parentContentDigest || parent.evidenceCutoff > bundle.evidenceCutoff || Date.parse(parent.createdAt) > Date.parse(bundle.createdAt)) throw new Error('Invalid or changed disease-release lineage');
    const revisions = validateRevisionChanges(parent, bundle);
    if (revisions.length) throw new Error(revisions.join('\n'));
  }
  return { bundle, attestation };
}

export function listPublishedReleases(diseaseDirectory) {
  if (!existsSync(join(diseaseDirectory, 'releases'))) return [];
  const releases = scientificRootPaths(diseaseDirectory).map(name => loadHistoricalRelease(diseaseDirectory, name.slice(0, -5)).bundle);
  if (releases.filter(item => item.parentReleaseId === null).length > 1) throw new Error('Multiple scientific roots are forbidden');
  return releases.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}

/** Called only after live approval verification; never changes reviewed content. */
export function storeRootRelease(diseaseDirectory, bundle, attestation) {
  validateStoredRelease(bundle, attestation);
  if (bundle.parentReleaseId !== null || bundle.parentContentDigest !== null) throw new Error('Root release must have null lineage');
  mkdirSync(join(diseaseDirectory, 'releases'), { recursive: true });
  const lock = join(diseaseDirectory, '.publication.lock');
  writeFileSync(lock, '', { flag: 'wx' });
  const created = [];
  const pointer = join(diseaseDirectory, 'current.json');
  const temporaryPointer = join(diseaseDirectory, '.current.pending.json');
  let pointerCreated = false;
  try {
    if (existsSync(pointer)) throw new Error('A current root already exists; use the exact-current successor workflow');
    // A public bundle without a pointer still counts as a root; reject orphaned roots.
    // The original illustrative regression fixture does not count as a scientific release.
    for (const path of scientificRootPaths(diseaseDirectory)) throw new Error(`An immutable scientific root already exists: ${path}`);
    const paths = [
      [join(diseaseDirectory, 'releases', `${bundle.id}.json`), bundle],
      [join(diseaseDirectory, 'releases', `${bundle.id}.approval.json`), attestation],
      [temporaryPointer, { releaseId: bundle.id, contentDigest: bundle.manifest.contentDigest }],
    ];
    for (const [path, value] of paths) {
      writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
      created.push(path);
    }
    // Atomic no-overwrite pointer creation; a concurrently created pointer wins.
    linkSync(temporaryPointer, pointer);
    pointerCreated = true;
    unlinkSync(temporaryPointer);
  } catch (error) {
    if (pointerCreated) unlinkSync(pointer);
    for (const path of created.reverse()) if (existsSync(path)) unlinkSync(path);
    throw error;
  } finally { unlinkSync(lock); }
}

/** Same authenticated gate as a root; exact-current parent checked under lock. */
export function storeSuccessorRelease(diseaseDirectory, bundle, attestation) {
  validateStoredRelease(bundle, attestation);
  if (!safeId(bundle.parentReleaseId)) throw new Error('A successor requires an exact parent release');
  const lock = join(diseaseDirectory, '.publication.lock');
  writeFileSync(lock, '', { flag: 'wx' });
  const created = [], pending = join(diseaseDirectory, '.current.pending.json');
  try {
    const current = loadPublishedRelease(diseaseDirectory).bundle;
    if (current.diseaseId !== bundle.diseaseId || current.id !== bundle.parentReleaseId || current.manifest.contentDigest !== bundle.parentContentDigest) throw new Error('Stale candidate base; approval must be renewed against the current release');
    const revisions = validateRevisionChanges(current, bundle);
    if (revisions.length) throw new Error(revisions.join('\n'));
    if (bundle.evidenceCutoff < current.evidenceCutoff || Date.parse(bundle.createdAt) < Date.parse(current.createdAt)) throw new Error('Successor chronology precedes its base');
    for (const [path, value] of [
      [join(diseaseDirectory, 'releases', `${bundle.id}.json`), bundle],
      [join(diseaseDirectory, 'releases', `${bundle.id}.approval.json`), attestation],
      [pending, { releaseId: bundle.id, contentDigest: bundle.manifest.contentDigest }],
    ]) { writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' }); created.push(path); }
    const fresh = loadPublishedRelease(diseaseDirectory).bundle;
    if (fresh.id !== current.id || fresh.manifest.contentDigest !== current.manifest.contentDigest) throw new Error('Current base changed during publication');
    renameSync(pending, join(diseaseDirectory, 'current.json'));
  } catch (error) {
    for (const path of created.reverse()) if (existsSync(path)) unlinkSync(path);
    throw error;
  } finally { unlinkSync(lock); }
}

function scientificRootPaths(directory) {
  return readdirSync(join(directory, 'releases')).filter(name => name.endsWith('.json') && !name.endsWith('.approval.json'))
    .filter(name => { const bundle = readJSON(join(directory, 'releases', name)); return !bundle.illustrative; });
}
