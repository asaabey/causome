#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { readdirSync, existsSync } from 'node:fs';
import { listDiseases } from './curation/diseases.mjs';
import { join } from 'node:path';
import { validatePreview, validatePublication } from './validation.mjs';
import { feedbackTemplate, recordSummaryFeedback } from './curation/summary.mjs';
import { hash, safeSlug } from './curation/io.mjs';

const args = process.argv.slice(2);
const publication = args.includes('--publish');
const paths = args.filter(arg => !arg.startsWith('--'));
if (args.some(arg => arg.startsWith('--') && arg !== '--publish') || paths.length > 1) {
  console.error('Usage: node scripts/validate-release.mjs [bundle.json] [--publish]');
  process.exit(1);
}
const path = paths[0] ?? process.env.CAUSOME_CANDIDATE_PATH ?? new URL('../knowledge/diseases/sle/candidates/sle-curated-candidate-001.json', import.meta.url);
try {
  if (!paths.length && !process.env.CAUSOME_CANDIDATE_PATH && !publication) {
    let count = 0;
    for (const profile of listDiseases('knowledge/diseases')) {
      const directory = join('knowledge/diseases', profile.id, 'candidates');
      for (const filename of readdirSync(directory).filter(name => /^[a-z0-9-]+\.json$/.test(name))) {
        const bundle = JSON.parse(await readFile(join(directory, filename), 'utf8'));
        const result = validatePreview(bundle);
        if (!result.valid || bundle.diseaseId !== profile.id || filename !== `${bundle.id}.json`) throw new Error(`${filename}: ${result.errors.join('; ') || 'Candidate identity differs from registry/path'}`);
        count++;
      }
      const reviews = join('knowledge/diseases', profile.id, 'summary-reviews');
      if (existsSync(reviews)) for (const filename of readdirSync(reviews).filter(name => name.endsWith('.json'))) {
        const record = JSON.parse(await readFile(join(reviews, filename), 'utf8'));
        if (!safeSlug(record.candidateId)) throw new Error('Invalid summary feedback candidate ID');
        const base = JSON.parse(await readFile(join(directory, `${record.candidateId}.json`), 'utf8'));
        const input = Object.fromEntries(Object.keys(feedbackTemplate(base)).map(key => [key, record[key]]));
        const expected = recordSummaryFeedback(base, input);
        if (record.diseaseId !== profile.id || filename !== `${expected.id}.json` || hash(expected) !== hash(record)) throw new Error('Invalid summary feedback receipt');
      }
    }
    console.log(`Validated ${count} disease candidates and their registry profiles.`);
  } else {
  const bundle = JSON.parse(await readFile(path, 'utf8'));
  const result = publication ? await validatePublication(bundle) : validatePreview(bundle);
  if (!result.valid) {
    console.error(`${publication ? 'Publication' : 'Preview'} validation failed:\n${result.errors.map(error => `- ${error}`).join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log(`Preview valid: ${bundle.id} (${bundle.entities.length} entities, ${bundle.relationships.length} relationships).`);
  }
  }
} catch (error) {
  console.error(`Cannot validate release: ${error.message}`);
  process.exitCode = 1;
}
