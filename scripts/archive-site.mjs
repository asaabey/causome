import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { safeSlug } from './curation/io.mjs';
import { resolve } from 'node:path';
import { loadPublishedRelease } from './release-store.mjs';
import { archiveSite } from './site-artifact.mjs';

try {
  const metadata = JSON.parse(readFileSync('web/dist/release.json', 'utf8'));
  if (metadata.mode !== 'publication' || !safeSlug(metadata.diseaseId)) throw new Error('Archive requires an actual reviewed public build');
  const { bundle, attestation } = loadPublishedRelease(resolve(process.env.CAUSOME_RELEASE_STORE ?? `knowledge/diseases/${metadata.diseaseId}`));
  const record = await archiveSite({ siteDirectory: 'web/dist', outputDirectory: 'launch-artifacts', bundle, attestation,
    frontendBuildRevision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), lockfilePath: 'pnpm-lock.yaml' });
  console.log(`Archived ${bundle.id}: ${record.artifactDigest}`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
