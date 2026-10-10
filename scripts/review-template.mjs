import { readFileSync } from 'node:fs';
import { approvalTemplate } from './github-approval.mjs';
import { validatePreview } from './validation.mjs';

const bundle = JSON.parse(readFileSync(process.argv[2] ?? 'knowledge/diseases/sle/candidates/sle-curated-candidate-001.json', 'utf8'));
const result = validatePreview(bundle);
if (!result.valid) { console.error(result.errors.join('\n')); process.exitCode = 1; }
else console.log(approvalTemplate(bundle));
