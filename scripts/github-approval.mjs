import { createHash } from 'node:crypto';
import { canonicalize, contentDigest } from './validation.mjs';

export const sha256 = value => createHash('sha256').update(typeof value === 'string' ? value : canonicalize(value)).digest('hex');
export const safeId = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,100}$/.test(value);
const commitPattern = /^[a-f0-9]{40}$/;

// Conservative, deterministic warning inventory. The reviewer acknowledges the
// exact limitations already embedded in the bundle rather than a mutable report.
export function reviewBinding(bundle) {
  return {
    releaseId: bundle.id, revisionId: bundle.revisionId,
    changeSetRevision: bundle.changeSetRevision, contentDigest: contentDigest(bundle),
    parentReleaseId: bundle.parentReleaseId, parentContentDigest: bundle.parentContentDigest,
    scoringModelVersions: bundle.scoringModels.map(item => item.revisionId).sort(),
    acknowledgedWarnings: [
      bundle.parentReleaseId === null ? 'initial-synthesis-and-new-core-entities' : 'successor-synthesis-and-all-record-changes',
      ...bundle.evidenceItems.filter(item => item.evidenceType === 'animal_experiment').map(item => `non-human:${item.id}`),
      ...bundle.sources.filter(item => /abstract/i.test(item.accessScope ?? '')).map(item => `abstract-only:${item.id}`),
      ...bundle.claims.filter(item => item.causalInterpretation === 'hypothesis').map(item => `hypothesis:${item.id}`),
      ...bundle.therapies.map(item => `therapy-status:${item.id}`),
      ...bundle.therapies.filter(item => item.contradictingClaimIds?.length).map(item => `contradiction:${item.id}`),
      ...bundle.relationships.filter(item => item.contradictingClaimIds.length).map(item => `contradiction:${item.id}`),
      ...bundle.sources.flatMap(item => (item.flags ?? []).map(flag => `source-flag:${item.id}:${flag}`)),
      ...bundle.assessments.filter(item => item.mechanisticWeight !== null || item.evidenceConfidence !== null).map(item => `scored-assessment:${item.id}`),
    ].sort(),
  };
}

export function approvalTemplate(bundle) {
  return `\`\`\`causome-approval\n${JSON.stringify(reviewBinding(bundle), null, 2)}\n\`\`\``;
}

export function verifyReviewEvents({ bundle, policy, pull, reviews, commit }) {
  if (policy.publicationEnabled !== true || policy.allowAuthorApproval !== false ||
      !Number.isInteger(policy.minimumIndependentApprovals) || policy.minimumIndependentApprovals < 1 ||
      !Array.isArray(policy.authorizedDomainReviewers) || !policy.authorizedDomainReviewers.length) {
    throw new Error('Publication is disabled or the independent reviewer policy is unconfigured');
  }
  if (!commitPattern.test(commit) || pull.head?.sha !== commit || pull.draft ||
      pull.state !== 'open' || pull.base?.repo?.full_name !== pull.head?.repo?.full_name) {
    throw new Error('Review must target the exact head commit of an open, non-draft, same-repository proposal');
  }
  const authorized = new Map();
  for (const reviewer of policy.authorizedDomainReviewers) {
    if (!Number.isSafeInteger(reviewer.id) || reviewer.id < 1 || typeof reviewer.login !== 'string' || !reviewer.login) {
      throw new Error('Reviewer policy requires verified GitHub numeric IDs and logins');
    }
    if (authorized.has(reviewer.id)) throw new Error('Duplicate authorized reviewer');
    if (reviewer.diseaseIds !== undefined && (!Array.isArray(reviewer.diseaseIds) || !reviewer.diseaseIds.length || !reviewer.diseaseIds.every(safeId))) throw new Error('Invalid reviewer disease scopes');
    if (reviewer.diseaseIds && !reviewer.diseaseIds.includes(bundle.diseaseId)) continue;
    authorized.set(reviewer.id, reviewer.login.toLowerCase());
  }
  // Comments do not undo approval; a later dismissal or requested change does.
  const latest = new Map();
  for (const review of [...reviews].sort((a, b) => a.id - b.id)) {
    if (['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) latest.set(review.user?.id, review);
  }
  if ([...latest.values()].some(review => review.state === 'CHANGES_REQUESTED')) throw new Error('Unresolved requested changes prevent publication');
  const binding = canonicalize(reviewBinding(bundle));
  const approvals = [...latest.values()].filter(review => {
    if (review.state !== 'APPROVED' || review.commit_id !== commit || review.user?.type !== 'User' ||
        review.user.id === pull.user?.id || authorized.get(review.user.id) !== review.user.login?.toLowerCase() ||
        !Number.isSafeInteger(review.id) || !review.submitted_at || !Number.isFinite(Date.parse(review.submitted_at))) return false;
    const blocks = [...(review.body ?? '').matchAll(/```causome-approval\s*\n([\s\S]*?)\n```/g)];
    if (blocks.length !== 1) return false;
    try { return canonicalize(JSON.parse(blocks[0][1])) === binding; } catch { return false; }
  }).map(review => ({
    eventId: review.id, reviewerId: review.user.id, reviewerLogin: review.user.login,
    reviewedCommit: review.commit_id, reviewedAt: review.submitted_at,
  }));
  if (approvals.length < policy.minimumIndependentApprovals) throw new Error('Missing authorized independent approval bound to the exact content and warnings');
  for (const claim of bundle.claims) {
    const review = claim.reviewDisposition;
    if (!approvals.some(item => item.reviewerLogin.toLowerCase() === review?.reviewerId?.toLowerCase() &&
        item.reviewedAt.slice(0, 10) >= review.reviewedAt)) {
      throw new Error(`${claim.id}: claim disposition is not backed by an authenticated domain reviewer`);
    }
  }
  const reviewers = new Set(approvals.map(item => item.reviewerLogin.toLowerCase()));
  for (const assessment of bundle.assessments.filter(item => item.mechanisticWeight !== null || item.evidenceConfidence !== null)) {
    if (!approvals.some(item => item.reviewerLogin.toLowerCase() === assessment.reviewerId?.toLowerCase() && item.reviewedAt.slice(0, 10) >= assessment.reviewedAt)) throw new Error(`${assessment.id}: appraisal is not backed by an authenticated domain reviewer`);
  }
  for (const model of bundle.scoringModels.filter(item => item.calibrated)) {
    if (!model.calibration?.reviewerIds.every(id => reviewers.has(id.toLowerCase()))) throw new Error(`${model.id}: calibration requires both authenticated independent reviewers`);
  }
  return approvals;
}

export function githubClient({ repository, token, fetchImpl = fetch }) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) throw new Error('Expected an owner/repository identity');
  const get = async path => {
    const response = await fetchImpl(`https://api.github.com/repos/${repository}${path}`, {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: AbortSignal.timeout(30_000), redirect: 'error',
    });
    if (!response.ok) throw new Error(`GitHub read failed (${response.status}) for ${path}`);
    return response.json();
  };
  return {
    get,
    async list(path) {
      const items = [];
      for (let page = 1; page <= 100; page++) {
        const result = await get(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
        if (!Array.isArray(result)) throw new Error('Expected a paginated GitHub list');
        items.push(...result);
        if (result.length < 100) return items;
      }
      throw new Error('GitHub pagination limit exceeded; refusing incomplete approval verification');
    },
    async jsonAt(path, commit) {
      if (!commitPattern.test(commit) || !/^[a-zA-Z0-9_./-]+$/.test(path) || path.includes('..')) throw new Error('Unsafe commit or repository path');
      const file = await get(`/contents/${path}?ref=${commit}`);
      if (file.type !== 'file' || file.encoding !== 'base64' || typeof file.content !== 'string') throw new Error('Expected a regular GitHub JSON file');
      return JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    },
  };
}

export async function authenticateProposal({ client, repository, pullNumber, commit, candidatePath, frontendCommit }) {
  if (!Number.isSafeInteger(pullNumber) || pullNumber < 1) throw new Error('Expected a positive pull-request number');
  const candidateMatch = candidatePath?.match(/^knowledge\/diseases\/([a-z0-9][a-z0-9-]*)\/candidates\/[a-z0-9-]+\.json$/);
  if (!candidateMatch) throw new Error('Expected a safe disease candidate path');
  const candidateDirectory = `knowledge/diseases/${candidateMatch[1]}/candidates/`;
  const repo = await client.get('');
  const branch = await client.get(`/branches/${encodeURIComponent(repo.default_branch)}`);
  const policyCommit = branch.commit.sha;
  if (frontendCommit !== policyCommit) throw new Error('Publisher must run from the current trusted default-branch commit');
  const policy = await client.jsonAt('curation/policies/reviewers.json', policyCommit);
  const pull = await client.get(`/pulls/${pullNumber}`);
  if (pull.base?.ref !== repo.default_branch || pull.base?.repo?.full_name !== repository) throw new Error('Proposal must target the trusted default branch');
  const files = await client.list(`/pulls/${pullNumber}/files`);
  // Scientific proposals cannot change the publisher, policy, workflows or frontend.
  if (files.length !== pull.changed_files || files.some(file => !file.filename.startsWith(candidateDirectory) && !/^curation\/reviews\/[a-zA-Z0-9_./-]+$/.test(file.filename))) {
    throw new Error('Scientific proposal changes trusted files or has an incomplete file inventory');
  }
  if (!files.some(file => file.filename === candidatePath && file.status !== 'removed')) throw new Error('Candidate is not part of the reviewed change set');
  if (files.filter(file => file.filename.startsWith(candidateDirectory)).length !== 1) throw new Error('Review one candidate snapshot per scientific proposal');
  const bundle = await client.jsonAt(candidatePath, commit);
  if (bundle.diseaseId !== candidateMatch[1]) throw new Error('Candidate disease differs from its path');
  const reviews = await client.list(`/pulls/${pullNumber}/reviews`);
  const approvals = verifyReviewEvents({ bundle, policy, pull, reviews, commit });
  const checks = await verifyRequiredChecks(client, commit);
  // Recheck head and trusted policy after all paginated reads.
  const freshPull = await client.get(`/pulls/${pullNumber}`);
  const freshBranch = await client.get(`/branches/${encodeURIComponent(repo.default_branch)}`);
  if (freshPull.head.sha !== commit || freshPull.state !== 'open' || freshBranch.commit.sha !== policyCommit) throw new Error('Proposal or publication base changed during verification');
  return { bundle, attestation: {
    version: 1, repository, pullNumber, candidatePath, reviewedCommit: commit,
    proposalAuthorId: pull.user.id, policyCommit, policyDigest: sha256(policy),
    frontendCommit, ...reviewBinding(bundle), approvals, checks,
  } };
}

export async function verifyRequiredChecks(client, commit) {
  const runs = [];
  for (let page = 1; ; page++) {
    if (page > 100) throw new Error('Incomplete required-check inventory');
    const result = await client.get(`/commits/${commit}/check-runs?filter=latest&per_page=100&page=${page}`);
    if (!Array.isArray(result.check_runs)) throw new Error('Expected authenticated check runs');
    runs.push(...result.check_runs);
    if (result.check_runs.length < 100) break;
  }
  return ['validate-build'].map(name => {
    const run = runs.filter(item => item.name === name && item.head_sha === commit && item.app?.slug === 'github-actions').sort((a, b) => b.id - a.id)[0];
    if (!run || run.status !== 'completed' || run.conclusion !== 'success') throw new Error(`Required authenticated check is missing or unsuccessful: ${name}`);
    return { name, eventId: run.id, commit };
  });
}
