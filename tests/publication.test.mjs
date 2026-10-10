import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { contentDigest, collections, validatePublication } from '../scripts/validation.mjs';
import { approvalTemplate, reviewBinding, verifyReviewEvents, authenticateProposal, githubClient, sha256 } from '../scripts/github-approval.mjs';
import { verifyStoredApproval } from '../scripts/verify-publication.mjs';
import { loadPublishedRelease, storeRootRelease } from '../scripts/release-store.mjs';

const candidate = JSON.parse(readFileSync(new URL('../knowledge/diseases/sle/candidates/sle-curated-candidate-001.json', import.meta.url)));
const commit = 'a'.repeat(40), frontendCommit = 'b'.repeat(40);
const policy = { publicationEnabled: true, authorizedDomainReviewers: [{ id: 42, login: 'domain-reviewer' }], minimumIndependentApprovals: 1, allowAuthorApproval: false };
const pull = { state: 'open', draft: false, changed_files: 1, user: { id: 10 }, head: { sha: commit, repo: { full_name: 'test/atlas' } }, base: { ref: 'main', repo: { full_name: 'test/atlas' } } };

// Synthetic approval data lives only in tests, never in the knowledge store.
function approvedBundle() {
  const bundle = structuredClone(candidate);
  bundle.id = 'sle-root-test-001'; bundle.revisionId = 'sle-root-test-r1'; bundle.status = 'approved';
  for (const name of collections) for (const record of bundle[name]) record.status = 'approved';
  for (const claim of bundle.claims) {
    claim.verification = 'reviewed';
    claim.reviewDisposition = { decision: 'accepted', reviewerId: 'domain-reviewer', reviewedAt: '2026-10-10' };
  }
  bundle.manifest.contentDigest = contentDigest(bundle);
  return bundle;
}
function reviewFor(bundle) {
  return { id: 100, user: { id: 42, login: 'domain-reviewer', type: 'User' }, state: 'APPROVED',
    commit_id: commit, submitted_at: '2026-10-10T12:00:00Z', body: approvalTemplate(bundle) };
}
const verify = (bundle, overrides = {}) => verifyReviewEvents({ bundle, policy, pull, reviews: [reviewFor(bundle)], commit, ...overrides });
function receipt(bundle) {
  return { version: 1, repository: 'test/atlas', pullNumber: 1, candidatePath: 'knowledge/diseases/sle/candidates/root-test.json',
    reviewedCommit: commit, frontendCommit, policyCommit: frontendCommit, policyDigest: sha256(policy), proposalAuthorId: 10,
    ...reviewBinding(bundle), approvals: verify(bundle) };
}
function temporaryStore(t) {
  const directory = mkdtempSync(join(tmpdir(), 'causome-publication-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test('independent GitHub review binds exact revision, commit, content, scoring versions and warnings', async () => {
  const bundle = approvedBundle();
  assert.equal(verify(bundle)[0].reviewerId, 42);
  assert.deepEqual(await validatePublication(bundle, { verifyAuthenticatedApproval: async () => verify(bundle).length > 0 }), { valid: true, errors: [] });
});
test('disabled/empty policy, author, bot and unauthorized accounts cannot approve', () => {
  const bundle = approvedBundle();
  assert.throws(() => verify(bundle, { policy: { ...policy, publicationEnabled: false } }), /disabled/);
  assert.throws(() => verify(bundle, { policy: { ...policy, authorizedDomainReviewers: [] } }), /unconfigured/);
  assert.throws(() => verify(bundle, { policy: { ...policy, minimumIndependentApprovals: 0 } }), /unconfigured/);
  for (const user of [{ id: 10, login: 'domain-reviewer', type: 'User' }, { id: 42, login: 'domain-reviewer', type: 'Bot' }, { id: 42, login: 'wrong-name', type: 'User' }]) {
    assert.throws(() => verify(bundle, { reviews: [{ ...reviewFor(bundle), user }] }), /Missing authorized/);
  }
});
test('head changes, changed digest, missing warning acknowledgement and base mismatches fail', () => {
  const bundle = approvedBundle(), review = reviewFor(bundle);
  assert.throws(() => verify(bundle, { commit: 'c'.repeat(40) }), /exact head/);
  const changed = structuredClone(bundle); changed.entities[0].description += ' Changed.'; changed.manifest.contentDigest = contentDigest(changed);
  assert.throws(() => verify(changed, { reviews: [review] }), /Missing authorized/);
  for (const key of ['acknowledgedWarnings', 'revisionId', 'parentContentDigest', 'scoringModelVersions']) {
    const binding = reviewBinding(bundle); binding[key] = key === 'parentContentDigest' ? 'f'.repeat(64) : null;
    assert.throws(() => verify(bundle, { reviews: [{ ...review, body: `\`\`\`causome-approval\n${JSON.stringify(binding)}\n\`\`\`` }] }), /Missing authorized/);
  }
});
test('dismissed/stale reviews, later requested changes and duplicate events cannot satisfy approval counts', () => {
  const bundle = approvedBundle(), review = reviewFor(bundle);
  for (const later of ['DISMISSED', 'CHANGES_REQUESTED']) assert.throws(() => verify(bundle, { reviews: [review, { ...review, id: 101, state: later }] }), /Missing authorized|requested changes/);
  assert.throws(() => verify(bundle, { reviews: [{ ...review, commit_id: frontendCommit }] }), /Missing authorized/);
  assert.throws(() => verify(bundle, { policy: { ...policy, minimumIndependentApprovals: 2 }, reviews: [review, { ...review, id: 101 }] }), /Missing authorized/);
  assert.equal(verify(bundle, { reviews: [review, { ...review, id: 101, state: 'COMMENTED' }] }).length, 1);
});
test('every claim disposition must have an authenticated reviewer and valid review date', async () => {
  const bundle = approvedBundle(); bundle.claims[0].reviewDisposition.reviewerId = 'made-up'; bundle.manifest.contentDigest = contentDigest(bundle);
  assert.throws(() => verify(bundle), /not backed/);
  bundle.claims[0].reviewDisposition.reviewedAt = 'invalid'; bundle.manifest.contentDigest = contentDigest(bundle);
  assert.equal((await validatePublication(bundle, { verifyAuthenticatedApproval: async () => true })).valid, false);
});
test('immutable root and pointer isolate public routing from working-record edits', t => {
  const directory = temporaryStore(t), bundle = approvedBundle();
  storeRootRelease(directory, bundle, receipt(bundle));
  const before = readFileSync(join(directory, 'releases', `${bundle.id}.json`));
  mkdirSync(join(directory, 'candidates'));
  writeFileSync(join(directory, 'candidates', 'changed.json'), '{"invalid":"working content"}');
  assert.deepEqual(loadPublishedRelease(directory).bundle, bundle);
  assert.deepEqual(readFileSync(join(directory, 'releases', `${bundle.id}.json`)), before);
  assert.throws(() => storeRootRelease(directory, bundle, receipt(bundle)), /current root already exists/);
});
test('overwrites, orphan roots, unresolved pointers, path traversal and receipt edits are rejected', t => {
  const directory = temporaryStore(t), bundle = approvedBundle();
  assert.throws(() => loadPublishedRelease(directory), /No approved current root/);
  storeRootRelease(directory, bundle, receipt(bundle));
  const pointer = join(directory, 'current.json');
  writeFileSync(pointer, JSON.stringify({ releaseId: '../escape', contentDigest: bundle.manifest.contentDigest }));
  assert.throws(() => loadPublishedRelease(directory), /pointer/);
  writeFileSync(pointer, JSON.stringify({ releaseId: bundle.id, contentDigest: 'f'.repeat(64) }));
  assert.throws(() => loadPublishedRelease(directory), /exact immutable/);
  rmSync(pointer);
  assert.throws(() => storeRootRelease(directory, bundle, receipt(bundle)), /scientific root already exists/);
  const other = temporaryStore(t);
  assert.throws(() => storeRootRelease(other, bundle, { ...receipt(bundle), contentDigest: 'f'.repeat(64) }), /attestation mismatch/);
  assert.throws(() => storeRootRelease(other, candidate, receipt(bundle)), /approved/);
});
test('live API verifier reads protected policy and candidate at immutable commits; rejects trusted-file proposals', async () => {
  const bundle = approvedBundle(), candidatePath = 'knowledge/diseases/sle/candidates/root-test.json';
  const client = {
    get: async path => path === '' ? { default_branch: 'main' } : path.startsWith('/branches/') ? { commit: { sha: frontendCommit } }
      : path.includes('/check-runs') ? { check_runs: [{ id: 123, name: 'validate-build', head_sha: commit, app: { slug: 'github-actions' }, status: 'completed', conclusion: 'success' }] } : pull,
    list: async path => path.endsWith('/files') ? [{ filename: candidatePath, status: 'added' }] : [reviewFor(bundle)],
    jsonAt: async (path, sha) => { assert.equal(sha, path === candidatePath ? commit : frontendCommit); return path === candidatePath ? bundle : policy; },
  };
  const args = { client, repository: 'test/atlas', pullNumber: 1, commit, candidatePath, frontendCommit };
  assert.deepEqual((await authenticateProposal(args)).bundle, bundle);
  await assert.rejects(authenticateProposal({ ...args, frontendCommit: commit }), /trusted default/);
  await assert.rejects(authenticateProposal({ ...args, client: { ...client, list: async () => [{ filename: 'curation/policies/reviewers.json' }] } }), /trusted files/);
  await assert.rejects(authenticateProposal({ ...args, client: { ...client, get: async path => path.includes('/check-runs') ? { check_runs: [] } : client.get(path) } }), /Required authenticated check/);
});
test('GitHub errors fail closed and pagination includes later review decisions', async () => {
  const calls = [];
  const client = githubClient({ repository: 'test/atlas', token: 'synthetic-test-token', fetchImpl: async url => {
    calls.push(url); return { ok: true, json: async () => url.endsWith('page=1') ? Array.from({ length: 100 }, (_, id) => ({ id })) : [{ id: 101, state: 'DISMISSED' }] };
  } });
  assert.equal((await client.list('/pulls/1/reviews')).length, 101);
  assert.equal(calls.length, 2);
  const failing = githubClient({ repository: 'test/atlas', fetchImpl: async () => ({ ok: false, status: 403 }) });
  await assert.rejects(failing.get('/pulls/1'), /GitHub read failed/);
});

test('stored approval rechecks original policy, live decisions and required CI without rewriting receipts', async()=>{
 const bundle=approvedBundle(),attestation={...receipt(bundle),checks:[{name:'validate-build',eventId:123,commit}]};
 const client={get:async path=>path===''?{default_branch:'main'}:path.startsWith('/branches/')?{commit:{sha:frontendCommit}}:path.includes('/check-runs')?{check_runs:[{id:123,name:'validate-build',head_sha:commit,app:{slug:'github-actions'},status:'completed',conclusion:'success'}]}:pull,list:async()=>[reviewFor(bundle)],jsonAt:async path=>path===attestation.candidatePath?bundle:policy};
 assert.equal(await verifyStoredApproval({bundle,attestation,client,repository:'test/atlas'}),true);
 await assert.rejects(verifyStoredApproval({bundle,attestation,repository:'test/atlas',client:{...client,get:async path=>path.includes('/check-runs')?{check_runs:[]}:client.get(path)}}),/Required authenticated check/);
 assert.throws(()=>verify(bundle,{policy:{...policy,authorizedDomainReviewers:[{...policy.authorizedDomainReviewers[0],diseaseIds:['iga-nephropathy']}]}}),/Missing authorized/);
});
