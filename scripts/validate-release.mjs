#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { listDiseases } from './curation/diseases.mjs';
import { join } from 'node:path';
import { validatePreview, validatePublication } from './validation.mjs';

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
