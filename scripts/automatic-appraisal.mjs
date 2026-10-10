import { confidenceCeiling, confidenceDimensions, weightComponents } from './scoring.mjs';

export const automaticAppraisalVersion = 'causome-auto-appraisal-v1';
const unique = values => [...new Set(values)].sort();
const adverseFlags = new Set(['retracted', 'retraction-linked', 'concern-linked', 'expression-of-concern']);
const functionalTypes = new Set(['human_genetic', 'human_in_vitro', 'animal_experiment', 'randomized_trial']);
const patientTypes = new Set(['human_genetic', 'human_observational', 'randomized_trial']);
const functionalInterpretations = new Set(['causal', 'mechanistic', 'interventional']);

/** Categories come from contextual edges, not text guesses or citation counts. */
export function assessmentClaimSets(bundle, assessment) {
  const subject = assessment.subjectId;
  const edge = bundle.relationships.find(item => item.id === subject);
  const relevant = claim => claim.contextId === assessment.contextId && (edge
    ? claim.subjectId === edge.sourceId && claim.objectId === edge.targetId && claim.predicate === edge.predicate
    : claim.subjectId === subject || claim.objectId === subject);
  const ids = new Set(bundle.claims.filter(relevant).map(claim => claim.id));
  const edges = bundle.relationships.filter(item => item.contextId === assessment.contextId &&
    (edge ? item.id === edge.id : item.sourceId === subject || item.targetId === subject));
  const collect = key => unique([...assessment[key], ...edges.flatMap(item => item[key])].filter(id => ids.has(id)));
  const contradictingClaimIds = collect('contradictingClaimIds');
  const qualifyingClaimIds = collect('qualifyingClaimIds').filter(id => !contradictingClaimIds.includes(id));
  const roles = edge ? [] : bundle.entities.find(item => item.id === subject)?.biologicalRoleClaimIds ?? [];
  const supportingClaimIds = unique([...collect('supportingClaimIds'), ...roles.filter(id => ids.has(id))])
    .filter(id => !qualifyingClaimIds.includes(id) && !contradictingClaimIds.includes(id));
  return { supportingClaimIds, qualifyingClaimIds, contradictingClaimIds };
}

function evidenceRows(bundle, ids, index) {
  if (index) return ids.flatMap(id => index.get(id) ?? []);
  return ids.flatMap(id => {
    const claim = bundle.claims.find(item => item.id === id);
    return (claim?.evidenceItemIds ?? []).flatMap(evidenceId => {
      const evidence = bundle.evidenceItems.find(item => item.id === evidenceId);
      const source = evidence && bundle.sources.find(item => item.id === evidence.sourceId);
      return evidence && source ? [{ claim, evidence, source }] : [];
    });
  });
}
const usable = row => ['publication', 'trial'].includes(row.source.kind) &&
  !(row.source.flags ?? []).some(flag => adverseFlags.has(flag) || flag === 'secondary-report');
const functional = row => usable(row) && functionalTypes.has(row.evidence.evidenceType) &&
  functionalInterpretations.has(row.claim.causalInterpretation) && row.claim.predicate !== 'is_associated_with';
const studyIds = rows => unique(rows.map(row => row.source.studyId ?? row.source.id));

function rowFor(bundle, assessment, index, supported) {
  const sets = assessmentClaimSets(bundle, assessment);
  const allIds = unique(Object.values(sets).flat());
  const allRows = evidenceRows(bundle, allIds, index);
  const rows = evidenceRows(bundle, sets.supportingClaimIds, index).filter(usable);
  const supportIds = unique(rows.map(row => row.claim.id));
  const functions = rows.filter(functional);
  const patients = rows.filter(row => patientTypes.has(row.evidence.evidenceType));
  const directFunctionalClaimIds = unique(functions.map(row => row.claim.id));
  const humanCausalClaimIds = unique(rows.filter(row => ['human_genetic', 'randomized_trial'].includes(row.evidence.evidenceType) &&
    ['causal', 'interventional'].includes(row.claim.causalInterpretation)).map(row => row.claim.id));
  const challenged = sets.contradictingClaimIds.length > 0 || allRows.some(row => (row.source.flags ?? []).some(flag => adverseFlags.has(flag)));
  const components = {};
  const component = (key, rating, rationale, claimIds = supportIds) => {
    components[key] = { rating: supportIds.length ? rating : null, rationale, claimIds };
  };
  const causal = functions.length ? challenged ? 1 : 2 : rows.some(row => ['hypothesis', 'causal', 'mechanistic', 'interventional'].includes(row.claim.causalInterpretation)) ? 1 : 0;
  component('causalConfidence', causal, functions.length
    ? 'Source-coded functional evidence supports a contextual contribution. Automatic rules cap this at 2/4, or 1/4 when contrary findings/source concerns remain unresolved; converging or independently corroborated human causation is not inferred.'
    : 'No qualifying direct functional support is established in the appraised set. An explicitly hypothesized/mechanistic interpretation gets at most 1/4; association alone gets 0/4. This is not a verdict that causation is absent.', challenged ? allIds : supportIds);

  const edge = bundle.relationships.find(item => item.id === assessment.subjectId);
  const supportedEdges = supported.filter(item => item.contextId === assessment.contextId);
  const branches = edge
    ? supportedEdges.filter(item => item.id !== edge.id && (item.sourceId === edge.targetId || item.targetId === edge.sourceId)).length
    : supportedEdges.filter(item => item.sourceId === assessment.subjectId).length;
  const influence = functions.length ? (edge ? branches ? 2 : 1 : branches > 1 ? 2 : 1) : 0;
  component('networkInfluence', influence, 'Context-local, functionally supported connections give a conservative topology proxy (0–2/4). Graph degree alone, associations and mixed-context paths cannot establish a major disease circuit.');

  const trials = rows.filter(row => row.evidence.evidenceType === 'randomized_trial' && row.claim.causalInterpretation === 'interventional');
  const outcomeTrials = trials.filter(row => bundle.entities.find(item => item.id === row.claim.objectId)?.entityClass === 'clinical_outcome');
  const perturbations = functions.filter(row => ['animal_experiment', 'human_in_vitro'].includes(row.evidence.evidenceType));
  const intervention = outcomeTrials.length ? 3 : trials.length ? 2 : perturbations.length ? 1 : 0;
  component('interventionalValidation', intervention, 'Only supporting, context-matched study tags and interventional claim types receive credit: functional preclinical perturbation 1, human randomized intervention 2, and a randomized interventional claim with a clinical-outcome object 3. Target coverage, genetic association and qualifying/negative trial findings do not receive intervention credit. Source interpretation remains unverified by these rules.');

  const context = bundle.contexts.find(item => item.id === assessment.contextId);
  component('diseaseCoverage', patients.length && context?.phenotype ? 1 : 0,
    'Automatic coverage is capped at 1/4 for patient evidence in an explicitly bounded phenotype. Cell/animal studies do not establish patient coverage, and broad coverage across subgroups or stages is not inferred.');

  const sources = [...new Map(rows.map(row => [row.source.id, row.source])).values()];
  const independent = sources.some(a => sources.some(b => a.id !== b.id && (a.studyId ?? a.id) !== (b.studyId ?? b.id) &&
    a.researchGroupId && b.researchGroupId && a.datasetFamilyId && b.datasetFamilyId &&
    a.researchGroupId !== b.researchGroupId && a.datasetFamilyId !== b.datasetFamilyId));
  const withinGroup = studyIds(rows).length > 1 && sources.some(a => sources.some(b => a.id !== b.id &&
    (a.studyId ?? a.id) !== (b.studyId ?? b.id) && a.researchGroupId && a.researchGroupId === b.researchGroupId));
  component('independentReplication', independent ? 2 : withinGroup ? 1 : 0,
    'Replication requires frozen research-group and dataset-family metadata, with distinct study identities. Multiple citations or evidence items alone receive no independence credit. Automatic ratings are capped at 2/4; absent metadata means corroboration is not established in this set.');

  const reasons = {
    humanEvidence: patients.length ? 'Contextual patient-study evidence is present; in-vitro human cells alone are not patient evidence.' : 'No qualifying patient-study support is established in this contextual set.',
    causalDesign: functions.length ? 'Functional study types and a non-associative causal interpretation are recorded; their semantic correctness still needs checking.' : 'No qualifying functional design is established; association does not imply causation.',
    quality: 'Conservatively limited: study controls, methods and bias have not been independently appraised. Access scope or a study-type label alone cannot establish adequate quality.',
    independence: independent ? 'Distinct study, group and dataset identifiers are frozen. Their actual non-overlap still requires source review.' : 'Independent groups and non-overlapping datasets are not established by the frozen metadata.',
    replication: independent || withinGroup ? 'Corroboration metadata exists; consistency and study independence still require review.' : 'Multiple citations alone do not establish replication.',
    directness: 'Conservatively limited to the recorded study system/context; whole-disease generalization is not established.',
    consistency: 'Conservatively limited: agreement across comparable studies and comprehensive literature coverage have not been independently checked.',
    contradictions: challenged ? 'Contradictory findings or adverse source notices are unresolved and retained.' : 'No contradiction is recorded in this bounded set; this does not establish absence of contradictory literature.',
  };
  const dimensions = Object.fromEntries(confidenceDimensions.map(key => [key, {
    rating: key === 'humanEvidence' && patients.length || key === 'causalDesign' && functions.length ? 'adequate' : 'limited',
    rationale: reasons[key], claimIds: ['humanEvidence', 'causalDesign'].includes(key) ? supportIds : allIds,
  }]));
  const confidenceAppraisal = { dimensions, predominantlyNonHuman: !patients.length, unresolvedMaterialContradiction: challenged,
    humanPrimaryGroups: unique(patients.map(row => row.source.researchGroupId).filter(Boolean)),
    humanDatasetFamilies: unique(patients.map(row => row.source.datasetFamilyId).filter(Boolean)),
    directFunctionalClaimIds, humanCausalClaimIds };
  const evidenceConfidence = rows.length ? confidenceCeiling(confidenceAppraisal) : 0;
  if (!rows.length) confidenceAppraisal.downgradeRationale = 'No usable contextual primary supporting evidence; confidence 0 describes this appraised set, not proof the mechanism is false.';
  return { assessmentId: assessment.id, rationale: `Automatic provisional appraisal (${automaticAppraisalVersion}). ${sets.supportingClaimIds.length} supporting, ${sets.qualifyingClaimIds.length} qualifying and ${sets.contradictingClaimIds.length} contradicting claims; ${studyIds(rows).length} distinct supporting study identifiers. Ratings use source-coded metadata, not an independent semantic check. ${supportIds.length ? 'Unknown quality and directness conservatively limit confidence to 1/4.' : 'Mechanistic weight remains unavailable because usable contextual support is insufficient.'}`,
    weightComponents: Object.fromEntries(weightComponents.map(key => [key, components[key]])), evidenceConfidence, confidenceAppraisal };
}

/** Pure and browser-safe; no model backend, network access or hidden evidence. */
export function automaticAssessmentWorksheet(base, { assessedAt = new Date().toISOString().slice(0, 10) } = {}) {
  const evidence = new Map(base.evidenceItems.map(item => [item.id, item]));
  const sources = new Map(base.sources.map(item => [item.id, item]));
  const index = new Map(base.claims.map(claim => [claim.id, claim.evidenceItemIds.flatMap(id => {
    const item = evidence.get(id), source = item && sources.get(item.sourceId);
    return item && source ? [{ claim, evidence: item, source }] : [];
  })]));
  const supported = base.relationships.filter(item => evidenceRows(base, item.supportingClaimIds, index).some(functional));
  return { version: 1, diseaseId: base.diseaseId, baseReleaseId: base.id, baseContentDigest: base.manifest.contentDigest,
    assessorId: automaticAppraisalVersion, assessorKind: 'system', method: 'rules', rulesVersion: automaticAppraisalVersion, assessedAt,
    limitations: 'Automatic conservative metadata appraisal. Source entailment, study quality, broad disease coverage, circuit causation and independent replication require review. Confidence is capped at 1/4 until explicit editorial appraisal; therapeutic categories describe curated target coverage, not efficacy. No calibration or human approval is asserted.',
    assessments: base.assessments.map(item => rowFor(base, item, index, supported)) };
}
