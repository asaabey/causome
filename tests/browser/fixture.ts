import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublishedRelease } from '../../scripts/release-store.mjs';
import type { ReleaseBundle } from '../../web/src/data/types';

export const fixture: ReleaseBundle = process.env.CAUSOME_BUILD_MODE === 'publication'
  ? loadPublishedRelease(resolve(process.env.CAUSOME_RELEASE_STORE ?? 'knowledge/diseases/sle')).bundle
  : JSON.parse(readFileSync(process.env.CAUSOME_CANDIDATE_PATH ?? `knowledge/diseases/sle/candidates/${JSON.parse(readFileSync('knowledge/diseases/sle/disease.json', 'utf8')).previewCandidate}.json`, 'utf8'));
