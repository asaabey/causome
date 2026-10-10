import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalize, validatePublication } from './validation.mjs';
import { githubClient, verifyReviewEvents, verifyRequiredChecks, sha256 } from './github-approval.mjs';
import { loadPublishedRelease, loadHistoricalRelease } from './release-store.mjs';
import { listDiseases } from './curation/diseases.mjs';

/** Verify immutable receipt provenance and live review decisions; performs read-only API calls. */
export async function verifyStoredApproval({ bundle, attestation, client, repository, currentPolicyRequired = true }) {
  if (attestation.repository !== repository) throw new Error('Publication belongs to a different repository');
  const repo = await client.get(''), branch = await client.get(`/branches/${encodeURIComponent(repo.default_branch)}`);
  const originalPolicy = await client.jsonAt('curation/policies/reviewers.json', attestation.policyCommit);
  if (sha256(originalPolicy) !== attestation.policyDigest) throw new Error('Frozen approval policy differs from its attestation');
  const original = await client.jsonAt(attestation.candidatePath, attestation.reviewedCommit);
  if (canonicalize(original) !== canonicalize(bundle)) throw new Error('Archived release differs from authenticated proposal content');
  const pull = await client.get(`/pulls/${attestation.pullNumber}`);
  if (pull.user.id !== attestation.proposalAuthorId) throw new Error('Proposal author mismatch');
  const reviews = await client.list(`/pulls/${attestation.pullNumber}/reviews`);
  const approvals = verifyReviewEvents({ bundle, policy: originalPolicy, pull: { ...pull, state: 'open' }, reviews, commit: attestation.reviewedCommit });
  if (canonicalize(approvals) !== canonicalize(attestation.approvals)) throw new Error('Authenticated approval events differ from the immutable attestation');
  if (currentPolicyRequired) {
    const policy = await client.jsonAt('curation/policies/reviewers.json', branch.commit.sha);
    verifyReviewEvents({ bundle, policy, pull: { ...pull, state: 'open' }, reviews, commit: attestation.reviewedCommit });
  }
  if (!Array.isArray(attestation.checks) || !attestation.checks.some(check => check.name === 'validate-build' && check.commit === attestation.reviewedCommit && Number.isInteger(check.eventId))) throw new Error('Missing original authenticated CI receipt');
  await verifyRequiredChecks(client, attestation.reviewedCommit);
  const validation = await validatePublication(bundle, { verifyAuthenticatedApproval: async () => true });
  if (!validation.valid) throw new Error(validation.errors.join('\n'));
  const fresh = await client.get(`/branches/${encodeURIComponent(repo.default_branch)}`);
  if (fresh.commit.sha !== branch.commit.sha) throw new Error('Publication policy changed during verification');
  return true;
}

export async function verifyRegistry({ root = 'knowledge/diseases', repository = process.env.GITHUB_REPOSITORY, client } = {}) {
  const published = listDiseases(root).filter(profile => existsSync(resolve(root, profile.id, 'current.json')));
  if (!published.length) throw new Error('No approved current root (current.json). Complete authenticated scientific publication first.');
  client ??= githubClient({ repository, token: process.env.GITHUB_TOKEN });
  const verified = [];
  for (const profile of published) {
    const directory = resolve(root, profile.id); let target = loadPublishedRelease(directory), current = true;
    while (target) {
      await verifyStoredApproval({ ...target, client, repository, currentPolicyRequired: current });
      if (current) verified.push({ diseaseId: profile.id, releaseId: target.bundle.id, contentDigest: target.bundle.manifest.contentDigest });
      const parent = target.bundle.parentReleaseId;
      target = parent ? loadHistoricalRelease(directory, parent) : null; current = false;
    }
  }
  return verified;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyRegistry().then(records => console.log(`Authenticated publication: ${JSON.stringify(records)}`)).catch(error => { console.error(error.message); process.exitCode = 1; });
}
