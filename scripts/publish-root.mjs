import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { authenticateProposal, githubClient } from './github-approval.mjs';
import { validatePublication } from './validation.mjs';
import { storeRootRelease, storeSuccessorRelease } from './release-store.mjs';

try {
  const [pullNumber, commit, candidatePath] = process.argv.slice(2);
  if (!pullNumber || !commit || !candidatePath) throw new Error('Usage: pnpm publish:release <PR-number> <reviewed-head-SHA> <candidate-path>');
  if (execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' }).trim()) throw new Error('Run the protected publisher from a clean default-branch checkout');
  const repository = process.env.GITHUB_REPOSITORY;
  const frontendCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const client = githubClient({ repository, token: process.env.GITHUB_TOKEN });
  const { bundle, attestation } = await authenticateProposal({ client, repository, pullNumber: Number(pullNumber), commit, candidatePath, frontendCommit });
  const result = await validatePublication(bundle, { verifyAuthenticatedApproval: async () => true });
  if (!result.valid) throw new Error(result.errors.join('\n'));
  const store = bundle.parentReleaseId === null ? storeRootRelease : storeSuccessorRelease;
  store(resolve('knowledge/diseases', bundle.diseaseId), bundle, attestation);
  console.log(`Finalized immutable ${bundle.parentReleaseId === null ? 'root' : 'successor'} ${bundle.id} (${bundle.manifest.contentDigest}). Commit the release, attestation and current pointer through protected repository review.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
