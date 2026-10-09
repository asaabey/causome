#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { validatePreview, validatePublication } from './validation.mjs';

const args = process.argv.slice(2);
const publication = args.includes('--publish');
const paths = args.filter(arg => !arg.startsWith('--'));
if (args.some(arg => arg.startsWith('--') && arg !== '--publish') || paths.length > 1) {
  console.error('Usage: node scripts/validate-release.mjs [bundle.json] [--publish]');
  process.exit(1);
}
const path = paths[0] ?? new URL('../knowledge/diseases/sle/candidates/sle-curated-candidate-001.json', import.meta.url);
try {
  const bundle = JSON.parse(await readFile(path, 'utf8'));
  const result = publication ? await validatePublication(bundle) : validatePreview(bundle);
  if (!result.valid) {
    console.error(`${publication ? 'Publication' : 'Preview'} validation failed:\n${result.errors.map(error => `- ${error}`).join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log(`Preview valid: ${bundle.id} (${bundle.entities.length} entities, ${bundle.relationships.length} relationships).`);
  }
} catch (error) {
  console.error(`Cannot validate release: ${error.message}`);
  process.exitCode = 1;
}
