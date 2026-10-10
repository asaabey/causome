import { safeSlug } from './curation/io.mjs';
import { readFileSync } from 'node:fs';
import { loadPublishedRelease } from './release-store.mjs';

try {
  const diseaseId = process.argv[2] ?? 'sle';
  if (!safeSlug(diseaseId)) throw new Error('Invalid launch disease ID');
  const { bundle } = loadPublishedRelease(`knowledge/diseases/${diseaseId}`);
  const record = JSON.parse(readFileSync(`curation/launch/${diseaseId}.json`, 'utf8'));
  if (record.releaseId !== bundle.id || record.contentDigest !== bundle.manifest.contentDigest) throw new Error('Launch acceptance record must match the reviewed release ID and digest');
  for (const key of ['screenReader', 'walkthrough', 'stagingRedeployment', 'performance']) {
    const check = record[key];
    if (check?.status !== 'passed' || (key !== 'performance' && !check.reviewer) || !/^curation\/launch\/reports\/[a-zA-Z0-9_.-]+\.(md|json)$/.test(check.report ?? '')) throw new Error(`Launch gate pending: ${key}`);
    const report = readFileSync(check.report, 'utf8');
    if (report.trim().length < 100 || !report.includes(bundle.id) || !report.includes(bundle.manifest.contentDigest)) throw new Error(`Launch report is incomplete or belongs to another release: ${key}`);
  }
  console.log(`Recorded launch acceptance: ${bundle.id}`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
