import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { restoreSiteArchive, verifySiteArchive } from './site-artifact.mjs';

try {
  const [archive, recordPath, destination] = process.argv.slice(2);
  if (!archive || !recordPath) throw new Error('Usage: pnpm restore:site <archive.tar.gz> <archive-record.json> [new-destination-directory]');
  const record = JSON.parse(readFileSync(recordPath, 'utf8'));
  if (destination) {
    await restoreSiteArchive(archive, record, destination);
    console.log(`Restored exact artifact ${record.releaseId} to ${resolve(destination)} (${record.artifactDigest}).`);
  } else {
    await verifySiteArchive(archive, record);
    console.log(`Verified exact artifact ${record.releaseId} (${record.artifactDigest}).`);
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
