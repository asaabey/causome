import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

try {
  const base = process.env.BASE_SHA;
  if (!/^[a-f0-9]{40}$/.test(base ?? '') || /^0+$/.test(base)) process.exit(0);
  const changed = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', base, 'HEAD', '--', 'knowledge/diseases/'], { encoding: 'utf8' }).trim().split('\n').filter(path => /^knowledge\/diseases\/[a-z0-9-]+\/candidates\//.test(path));
  if (changed.length > 1) { console.log('Multiple development candidates: validate and preview the registered atlas. Scientific publication reviews one snapshot at a time.'); process.exit(0); }
  if (changed.length === 1) {
    const path = changed[0];
    if (!/^knowledge\/diseases\/[a-z0-9-]+\/candidates\/[a-z0-9-]+\.json$/.test(path)) throw new Error('Invalid candidate path');
    if (!process.env.GITHUB_ENV) throw new Error('CI environment output is unavailable');
    appendFileSync(process.env.GITHUB_ENV, `CAUSOME_CANDIDATE_PATH=${path}\n`);
    console.log(`Preview and browser fixture bound to ${path}`);
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
