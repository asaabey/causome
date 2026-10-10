import { contentDigest, validatePreview, collections } from '../validation.mjs';
import { calculateWeight, defaultRubric, weightComponents, confidenceDimensions, therapeuticAppraisal } from '../scoring.mjs';
import { assert, hash, safeSlug, validDate } from './io.mjs';
import { automaticAssessmentWorksheet, assessmentClaimSets } from '../automatic-appraisal.mjs';

export function assessmentTemplate(base) {
  return { version: 1, diseaseId: base.diseaseId, baseReleaseId: base.id, baseContentDigest: contentDigest(base),
    assessorId: '', assessorKind: 'human', assessedAt: '', limitations: '',
    assessments: base.assessments.map(item => ({ assessmentId: item.id, rationale: '',
      weightComponents: Object.fromEntries(weightComponents.map(key => [key, { rating: null, rationale: '', claimIds: [] }])),
      evidenceConfidence: null,
      confidenceAppraisal: { dimensions: Object.fromEntries(confidenceDimensions.map(key => [key, { rating: 'unknown', rationale: '', claimIds: [] }])),
        predominantlyNonHuman: false, unresolvedMaterialContradiction: false, humanPrimaryGroups: [], humanDatasetFamilies: [], directFunctionalClaimIds: [], humanCausalClaimIds: [] } })) };
}

export function clearAppraisal(item) {
  item.mechanisticWeight = null; item.evidenceConfidence = null; item.therapeuticLeverage = null;
  item.metricStatus = { mechanisticWeight: 'unassessed', evidenceConfidence: 'unassessed', therapeuticLeverage: 'unassessed' };
  item.reviewerDecision = null; item.reviewedAt = null;
  for (const key of ['reviewerId', 'weightComponents', 'weightRaw', 'weightTier', 'confidenceAppraisal', 'appraisalProvenance', 'therapeuticAppraisal']) delete item[key];
}

/** Explicit editorial worksheet only. No scores are inferred from citation counts or extraction. */
export function assessCandidate(base, input) {
  assert(safeSlug(base.diseaseId), 'Appraisal disease ID must be a safe slug');
  assert(validatePreview(base).valid, 'Invalid appraisal base');
  assert(input.version === 1 && input.diseaseId === base.diseaseId && input.baseReleaseId === base.id && input.baseContentDigest === contentDigest(base), 'Appraisal worksheet has a stale or incorrect base');
  assert(typeof input.assessorId === 'string' && input.assessorId.trim() && ['human', 'agent', 'system'].includes(input.assessorKind) && validDate(input.assessedAt) && typeof input.limitations === 'string' && input.limitations.trim(), 'Appraisal needs an identified assessor, date and limitations');
  assert(input.assessedAt >= base.evidenceCutoff, 'Appraisal date precedes the evidence cutoff');
  const automatic = input.method === 'rules';
  if (automatic || input.assessorKind === 'system') assert(automatic && hash(input) === hash(automaticAssessmentWorksheet(base, { assessedAt: input.assessedAt })), 'Automatic worksheet must reproduce the supported rules and exact base');
  assert(Array.isArray(input.assessments) && input.assessments.length && new Set(input.assessments.map(item => item.assessmentId)).size === input.assessments.length, 'Appraisal rows must be nonempty and unique');
  const candidate = structuredClone(base), revision = hash(input).slice(0, 12);
  candidate.formatVersion = '0.3.0'; candidate.manifest.schemaVersion = '0.3.0';
  candidate.id = `${base.diseaseId}-appraised-candidate-${revision}`; candidate.revisionId = `${candidate.id}-r1`;
  candidate.status = 'candidate'; candidate.changeSetRevision = `appraisal-${hash(input)}`;
  candidate.createdAt = new Date(Math.max(Date.parse(base.createdAt), Date.parse(`${input.assessedAt}T00:00:00Z`))).toISOString();
  if (['approved', 'published'].includes(base.status)) { candidate.parentReleaseId = base.id; candidate.parentContentDigest = contentDigest(base); }
  candidate.releaseNote = `Provisional ${automatic ? 'automatic' : 'editorial'} appraisal of ${base.id}. ${input.limitations} Independent review and calibration remain pending.`;
  for (const name of collections) for (const item of candidate[name]) item.status = 'candidate';
  for (const claim of candidate.claims) { claim.verification = 'source_checked'; claim.reviewDisposition = { decision: 'pending_domain_review', reviewerId: null, reviewedAt: null }; }
  const modelId = `model-provisional-${revision}`;
  candidate.scoringModels.push({ id: modelId, revisionId: `${modelId}-r1`, status: 'candidate', label: automatic ? 'Automatic conservative appraisal' : 'Provisional contextual appraisal', calibrated: false, provisional: true, rubric: defaultRubric,
    description: `${automatic ? input.rulesVersion : 'Agent or human editorial draft using the explicit v0.1 anchors'}; not calibrated or independently reviewed. ${input.limitations}` });
  for (const assessment of candidate.assessments) {
    clearAppraisal(assessment);
    if (automatic) Object.assign(assessment, assessmentClaimSets(base, assessment));
    for (const key of ['supportingClaimIds', 'qualifyingClaimIds', 'contradictingClaimIds']) assessment[key] = assessment[key].filter(id => candidate.claims.find(item => item.id === id)?.contextId === assessment.contextId);
    assessment.scoringModelId = modelId; assessment.revisionId = `${assessment.id}-${revision}`;
    assessment.rationale = 'Awaiting explicit editorial appraisal in this revision.';
    assessment.therapeuticAppraisal = therapeuticAppraisal(candidate, assessment.subjectId);
    assessment.metricStatus.therapeuticLeverage = 'categorical';
  }
  for (const row of input.assessments) {
    assert(Object.keys(row).every(key => ['assessmentId', 'rationale', 'weightComponents', 'evidenceConfidence', 'confidenceAppraisal'].includes(key)), 'Unsupported appraisal field');
    const assessment = candidate.assessments.find(item => item.id === row.assessmentId);
    assert(assessment, `Unknown assessment ${row.assessmentId}`);
    assert(typeof row.rationale === 'string' && row.rationale.trim(), 'Appraisal needs a subject rationale');
    const weight = calculateWeight(row.weightComponents);
    Object.assign(assessment, { rationale: row.rationale, weightComponents: structuredClone(row.weightComponents),
      mechanisticWeight: weight.displayed, weightRaw: weight.raw, weightTier: weight.tier, evidenceConfidence: row.evidenceConfidence,
      confidenceAppraisal: structuredClone(row.confidenceAppraisal),
      appraisalProvenance: { status: 'provisional', assessorId: input.assessorId, assessorKind: input.assessorKind, assessedAt: input.assessedAt,
        inputDigest: hash(input), baseReleaseId: base.id, baseContentDigest: contentDigest(base),
        ...(automatic ? { method: 'rules', rulesVersion: input.rulesVersion } : {}) } });
    assessment.metricStatus.mechanisticWeight = weight.displayed === null ? 'unassessed' : 'assessed';
    assessment.metricStatus.evidenceConfidence = row.evidenceConfidence === null ? 'unassessed' : 'assessed';
  }
  candidate.manifest.contentDigest = contentDigest(candidate);
  const validation = validatePreview(candidate);
  assert(validation.valid, `Invalid editorial appraisal:\n${validation.errors.join('\n')}`);
  return candidate;
}

export function autoAssessCandidate(base, options) {
  assert(!base.illustrative, 'Automatic appraisal requires a scientific candidate, not an illustrative fixture');
  const input = automaticAssessmentWorksheet(base, options);
  return { input, candidate: assessCandidate(base, input) };
}
