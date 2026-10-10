import { contentDigest, validatePreview, collections, summaryGraphDigest, canonicalize } from '../validation.mjs';
import { assert, hash, validDate, safeSlug } from './io.mjs';
import { draftSummary, summaryReviewText, summaryPromptVersion, summarySources } from '../disease-summary.mjs';

const text = value => typeof value === 'string' && value.trim().length > 0;
const only = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(key => keys.includes(key));
export function summaryTemplate(base, scope) {
  if (!base.scientificSummary) return draftSummary(base, scope);
  return { version: 1, diseaseId: base.diseaseId, baseReleaseId: base.id, baseContentDigest: contentDigest(base),
    scope: scope ?? base.scientificSummary.scope, authoredBy: { id: '', kind: 'human' }, authoredAt: new Date().toISOString().slice(0, 10),
    paragraphs: structuredClone(base.scientificSummary.paragraphs) };
}

export function attachSummary(base, input) {
  assert(validatePreview(base).valid && !base.illustrative, 'Summary requires a valid scientific snapshot');
  assert(safeSlug(base.diseaseId) && safeSlug(base.id), 'Summary disease and candidate identities must be safe slugs');
  assert(only(input, ['version', 'diseaseId', 'baseReleaseId', 'baseContentDigest', 'scope', 'authoredBy', 'authoredAt', 'paragraphs']) && input.version === 1 && input.diseaseId === base.diseaseId && input.baseReleaseId === base.id && input.baseContentDigest === contentDigest(base), 'Summary has unsupported fields or a stale/incorrect base');
  assert(text(input.scope) && validDate(input.authoredAt) && input.authoredAt >= base.evidenceCutoff && input.authoredAt <= new Date().toISOString().slice(0, 10), 'Summary needs scope and an actual authoring date at or after the evidence cutoff');
  assert(only(input.authoredBy, ['id', 'kind']) && text(input.authoredBy.id) && ['agent', 'human', 'system'].includes(input.authoredBy.kind), 'Summary needs the actual author identity and kind');
  assert(Array.isArray(input.paragraphs) && input.paragraphs.length >= 1 && input.paragraphs.length <= 2, 'Summary needs one or two paragraphs');
  for (const paragraph of input.paragraphs) {
    assert(only(paragraph, ['text', 'claimIds']) && text(paragraph.text) && !/[\r\n]/.test(paragraph.text) && paragraph.text.split(/\s+/).length <= 220, 'Each summary paragraph must be a single paragraph of at most 220 words');
    assert(Array.isArray(paragraph.claimIds) && paragraph.claimIds.length && new Set(paragraph.claimIds).size === paragraph.claimIds.length && paragraph.claimIds.every(id => base.claims.some(claim => claim.id === id)), 'Summary paragraphs need unique claim references from the named graph');
  }
  if (input.authoredBy.kind === 'system') {
    const expected = draftSummary(base, input.scope); expected.authoredAt = input.authoredAt;
    assert(hash(expected) === hash(input), 'System summaries must reproduce the extractive draft; edited text needs its actual agent/human author');
  }
  const candidate = structuredClone(base), revision = hash(input).slice(0, 12);
  candidate.id = `${base.diseaseId}-summary-candidate-${revision}`; candidate.revisionId = `${candidate.id}-r1`;
  assert(safeSlug(candidate.id), 'Use a disease slug of at most 70 characters for generated summary candidates');
  candidate.formatVersion = '0.3.0'; candidate.manifest.schemaVersion = '0.3.0';
  candidate.status = 'candidate'; candidate.changeSetRevision = `summary-${hash(input)}`;
  candidate.createdAt = new Date(Math.max(Date.parse(base.createdAt), Date.parse(`${input.authoredAt}T00:00:00Z`))).toISOString();
  if (['approved', 'published'].includes(base.status)) { candidate.parentReleaseId = base.id; candidate.parentContentDigest = contentDigest(base); }
  for (const name of collections) for (const item of candidate[name]) item.status = 'candidate';
  for (const claim of candidate.claims) { claim.verification = 'source_checked'; claim.reviewDisposition = { decision: 'pending_domain_review', reviewerId: null, reviewedAt: null }; }
  for (const assessment of candidate.assessments) { assessment.reviewerDecision = null; assessment.reviewedAt = null; delete assessment.reviewerId; }
  const revisionContent = record => Object.fromEntries(Object.entries(record).filter(([key]) => !['revisionId', 'status'].includes(key)));
  for (const name of collections) for (const record of candidate[name]) {
    const previous = base[name].find(item => item.id === record.id);
    if (canonicalize(revisionContent(previous)) !== canonicalize(revisionContent(record))) record.revisionId = `${record.id}-summary-${revision}`;
  }
  candidate.scientificSummary = { version: 1, revisionId: `summary-${revision}`, status: 'pending_external_review', scope: input.scope,
    paragraphs: structuredClone(input.paragraphs), authoredBy: structuredClone(input.authoredBy), authoredAt: input.authoredAt,
    evidenceCutoff: candidate.evidenceCutoff, graphContentDigest: summaryGraphDigest(candidate),
    baseReleaseId: base.id, baseContentDigest: contentDigest(base), inputDigest: hash(input) };
  candidate.releaseNote = `Overall scientific summary of ${base.id}; external current-literature review remains pending. ${base.releaseNote ?? ''}`;
  candidate.manifest.contentDigest = contentDigest(candidate);
  const result = validatePreview(candidate); assert(result.valid, result.errors.join('\n'));
  return candidate;
}

export function summaryPacket(base) {
  assert(validatePreview(base).valid && base.scientificSummary && !base.illustrative, 'Review packet needs a valid snapshot with an embedded summary');
  assert(safeSlug(base.diseaseId) && safeSlug(base.id), 'Review packet identities must be safe slugs');
  const summary = base.scientificSummary;
  const packet = { version: 1, diseaseId: base.diseaseId, candidateId: base.id, contentDigest: contentDigest(base), summaryRevisionId: summary.revisionId,
    summaryDigest: hash(summary), evidenceCutoff: base.evidenceCutoff, scope: summary.scope, paragraphs: summary.paragraphs,
    sources: summarySources(base), promptVersion: summaryPromptVersion, reviewText: summaryReviewText(base), status: 'pending_external_review' };
  return { ...packet, packetDigest: hash(packet) };
}

export function feedbackTemplate(base) {
  const packet = summaryPacket(base);
  return { version: 1, diseaseId: base.diseaseId, candidateId: base.id, contentDigest: contentDigest(base), summaryRevisionId: packet.summaryRevisionId,
    summaryDigest: packet.summaryDigest, packetDigest: packet.packetDigest,
    tool: '', recordedBy: '', checkedAt: '', literatureSearch: { performed: false, searchedThrough: null, coverage: '' },
    verdict: '', explanation: '', sourcesConsulted: [], issues: [], report: '' };
}

export function recordSummaryFeedback(base, input) {
  const expected = feedbackTemplate(base);
  assert(only(input, Object.keys(expected)), 'Feedback contains unsupported fields');
  for (const key of ['version', 'diseaseId', 'candidateId', 'contentDigest', 'summaryRevisionId', 'summaryDigest', 'packetDigest']) assert(input[key] === expected[key], 'Feedback is stale or belongs to another candidate/summary/packet');
  assert(text(input.tool) && text(input.recordedBy) && validDate(input.checkedAt) && input.checkedAt >= base.scientificSummary.authoredAt && input.checkedAt <= new Date().toISOString().slice(0, 10), 'Feedback needs tool, recorder and an actual check date');
  const search = input.literatureSearch;
  assert(only(search, ['performed', 'searchedThrough', 'coverage']) && typeof search.performed === 'boolean' && text(search.coverage), 'Record actual literature-search coverage and limitations');
  assert(search.performed ? validDate(search.searchedThrough) && search.searchedThrough <= input.checkedAt : search.searchedThrough === null, 'Search date must reflect actual search access');
  assert(['consistent_with_caveats', 'needs_revision', 'insufficient_evidence'].includes(input.verdict) && text(input.explanation) && text(input.report), 'Feedback needs a verdict, explanation and the actual external report');
  const sourceURL = url => { try { return typeof url === 'string' && ['http:', 'https:'].includes(new URL(url).protocol); } catch { return false; } };
  assert(Array.isArray(input.sourcesConsulted) && input.sourcesConsulted.every(sourceURL), 'Record actual consulted source URLs as HTTP(S)');
  assert(search.performed || input.verdict !== 'consistent_with_caveats', 'Without a literature search, current-science consistency remains insufficient or needs revision');
  assert(input.verdict !== 'consistent_with_caveats' || input.sourcesConsulted.length > 0, 'Current-science consistency needs the actual consulted sources');
  assert(input.verdict !== 'consistent_with_caveats' || search.searchedThrough >= base.evidenceCutoff, 'Consistency search coverage cannot predate the candidate evidence cutoff');
  assert(Array.isArray(input.issues), 'Feedback issues must be an array');
  for (const issue of input.issues) {
    assert(only(issue, ['severity', 'category', 'description', 'suggestedCorrection', 'sourceUrls']) && ['major', 'minor'].includes(issue.severity) && ['unsupported', 'omission', 'outdated', 'causal_overstatement', 'scope', 'other'].includes(issue.category) && text(issue.description) && text(issue.suggestedCorrection) && Array.isArray(issue.sourceUrls), 'Issue needs severity, category, description, correction and source URLs');
    assert(issue.sourceUrls.every(sourceURL), 'Feedback source URLs must be HTTP(S)');
  }
  assert(input.verdict !== 'consistent_with_caveats' || !input.issues.some(issue => issue.severity === 'major'), 'Major unresolved issues require revision or insufficient evidence');
  const id = `summary-feedback-${hash(input).slice(0, 24)}`;
  return { id, ...structuredClone(input), status: 'recorded_external_feedback', feedbackDigest: hash(input), publicationChanged: false };
}
