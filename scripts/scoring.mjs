export const weightComponents = ['causalConfidence', 'networkInfluence', 'interventionalValidation', 'diseaseCoverage', 'independentReplication'];
export const confidenceDimensions = ['humanEvidence', 'causalDesign', 'quality', 'independence', 'replication', 'directness', 'consistency', 'contradictions'];
export const weightWeights = [35, 25, 20, 15, 5];
export const defaultRubric = {
  version: 'causome-scoring-v0.1', weights: Object.fromEntries(weightComponents.map((key, index) => [key, weightWeights[index]])),
  anchors: {
  "causalConfidence": [
    "Appraised evidence does not establish a causal role",
    "Indirect causal hypothesis",
    "Direct functional perturbation supports a contextual contribution",
    "Converging human and functional causal evidence",
    "Independently corroborated human causal evidence in the stated context"
  ],
  "networkInfluence": [
    "No supported role in the reviewed circuit",
    "One local downstream effect",
    "One supported branch or feedback connection",
    "Links multiple supported branches or sustains a major feedback loop",
    "Connects multiple branches and sustains the principal reviewed circuit"
  ],
  "interventionalValidation": [
    "No qualifying intervention evidence found in the appraised set",
    "Preclinical target perturbation",
    "Human target engagement or biomarker change",
    "Controlled human intervention links target modulation to a relevant disease outcome",
    "Independently corroborated controlled human outcomes with target attribution"
  ],
  "diseaseCoverage": [
    "No demonstrated coverage in the appraised set",
    "Rare or narrowly defined subgroup",
    "Multiple defined subgroups or one major phenotype",
    "Broad involvement across multiple major phenotypes",
    "Broad involvement across the major phenotypes and stages covered by the release"
  ],
  "independentReplication": [
    "No independent corroboration",
    "Replication within one research group or dataset family",
    "Two independent groups and non-overlapping datasets",
    "At least three independent groups across two evidence modalities",
    "At least three independent groups across human and functional modalities with consistent findings"
  ]
},
  rounding: 'nearest-5-half-up', boundaries: [20, 40, 60, 80],
  weightAreaRatios: [1, 1.5, 2, 3, 4], confidenceStyles: ['dotted', 'dashed', 'solid', 'double', 'heavy'],
};
const ordinal = value => value === null || (Number.isInteger(value) && value >= 0 && value <= 4);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
const uniqueStrings = value => Array.isArray(value) && value.every(nonempty) && new Set(value).size === value.length;
const stable = value => Array.isArray(value) ? `[${value.map(stable).join(',')}]` : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}` : JSON.stringify(value);

export function calculateWeight(components) {
  const ratings = weightComponents.map(key => components?.[key]?.rating);
  if (ratings.some(value => value === undefined || value === null)) return { raw: null, displayed: null, tier: null };
  if (!ratings.every(ordinal)) throw new Error('Weight components must be integers from 0 to 4 or null');
  const raw = ratings.reduce((sum, rating, index) => sum + rating * weightWeights[index], 0) / 4;
  return { raw, displayed: Math.floor(raw / 5 + .5) * 5, tier: Math.min(4, Math.floor(raw / 20)) };
}

export function evaluateCalibration(calibration, revisionId) {
  const errors = [];
  if (!calibration || calibration.modelRevisionId !== revisionId || !uniqueStrings(calibration.reviewerIds) || calibration.reviewerIds.length !== 2 ||
      !nonempty(calibration.selectionRationale) || !nonempty(calibration.limitations) || !Array.isArray(calibration.cases)) {
    return { valid: false, agreement: 0, agreeing: 0, total: 0, errors: ['Calibration needs the exact model revision, two independent reviewers, sample rationale, limitations and cases'] };
  }
  const ids = new Set(), subjects = new Set(), categories = new Set(), numericDimensions = new Set();
  let total = 0, agreeing = 0;
  for (const sample of calibration.cases) {
    const subject = `${sample.subjectId}|${sample.contextId}`;
    if (!nonempty(sample.id) || ids.has(sample.id) || !nonempty(sample.subjectId) || !nonempty(sample.contextId) || subjects.has(subject)) errors.push('Calibration requires unique case IDs and subject/context pairs');
    ids.add(sample.id); subjects.add(subject);
    categories.add(sample.category);
    if (!['strong', 'weak', 'contradictory', 'missing'].includes(sample.category) || !nonempty(sample.rationale) || !uniqueStrings(sample.claimIds)) errors.push(`${sample.id}: missing category, rationale or claim references`);
    for (const key of [...weightComponents, 'confidence']) {
      const a = sample.ratings?.[calibration.reviewerIds[0]]?.[key], b = sample.ratings?.[calibration.reviewerIds[1]]?.[key], adjudicated = sample.adjudicated?.[key];
      if (!ordinal(a) || !ordinal(b) || !ordinal(adjudicated)) { errors.push(`${sample.id}: incomplete paired/adjudicated ${key} ratings`); continue; }
      total++;
      if (a !== null && b !== null) numericDimensions.add(key);
      if ((a === null && b === null) || (a !== null && b !== null && Math.abs(a - b) <= 1)) agreeing++;
    }
  }
  if (subjects.size < 20) errors.push('Calibration requires at least 20 representative subjects/contexts');
  if (['strong', 'weak', 'contradictory', 'missing'].some(category => !categories.has(category))) errors.push('Calibration must cover strong, weak, contradictory and missing evidence');
  if ([...weightComponents, 'confidence'].some(key => !numericDimensions.has(key))) errors.push('Calibration must exercise numeric paired ratings for every component and confidence');
  const agreement = total ? agreeing / total : 0;
  if (agreement < .8) errors.push('Calibration agreement is below 80%');
  return { valid: !errors.length, agreement, agreeing, total, errors };
}

export function confidenceCeiling(appraisal) {
  if (!appraisal || confidenceDimensions.some(key => !appraisal.dimensions?.[key] || appraisal.dimensions[key].rating === 'unknown')) return null;
  const dimensions = appraisal.dimensions;
  if (dimensions.quality.rating === 'inadequate' || appraisal.unresolvedMaterialContradiction) return 1;
  if (['directness', 'consistency', 'quality'].some(key => dimensions[key].rating !== 'adequate')) return 1;
  if (appraisal.predominantlyNonHuman) return 2;
  if (appraisal.humanPrimaryGroups.length < 2 || appraisal.humanDatasetFamilies.length < 2 || !appraisal.directFunctionalClaimIds.length ||
      ['humanEvidence', 'independence', 'replication'].some(key => dimensions[key].rating !== 'adequate')) return 2;
  return appraisal.humanCausalClaimIds.length >= 2 && dimensions.causalDesign.rating === 'adequate' ? 4 : 3;
}

/** Target coverage in this snapshot, not a numerical efficacy or druggability score. */
export function therapeuticAppraisal(bundle, subjectId) {
  const edge = bundle.relationships.find(item => item.id === subjectId);
  const endpoints = edge ? [edge.sourceId, edge.targetId] : [subjectId];
  const linked = bundle.therapies.filter(item => [...item.directTargetIds, ...item.indirectTargetIds].some(id => endpoints.includes(id)));
  const direct = linked.filter(item => item.directTargetIds.some(id => endpoints.includes(id)));
  const category = direct.some(item => item.developmentStatus === 'approved') ? 'approved_direct_target'
    : direct.some(item => item.developmentStatus === 'experimental') ? 'experimental_direct_target'
    : direct.some(item => item.developmentStatus === 'withdrawn') ? 'withdrawn_direct_target'
    : direct.length ? 'unverified_direct_target' : linked.length ? 'indirect_intervention' : 'no_linked_intervention';
  return { category, scope: edge ? 'relationship_endpoints' : 'entity', therapyIds: linked.map(item => item.id),
    rationale: linked.length ? `${edge ? 'Endpoint target coverage only; this does not establish treatment efficacy on this relationship. ' : ''}Read each linked therapy’s indication context, jurisdiction, verification date, trial findings and limitations. Target coverage does not determine mechanistic weight.`
      : 'No intervention is curated for this subject in this bounded snapshot. This does not establish absence of therapies, druggability or treatment benefit.' };
}

export function validateScoring(bundle) {
  const errors = [], claims = new Map(bundle.claims.map(item => [item.id, item]));
  const evidenceFor = ids => (ids ?? []).flatMap(id => claims.get(id)?.evidenceItemIds ?? []).map(id => bundle.evidenceItems.find(item => item.id === id)).filter(Boolean);
  const relevant = (claim, subjectId, contextId) => {
    if (!claim || claim.contextId !== contextId) return false;
    const edge = bundle.relationships.find(item => item.id === subjectId);
    return edge ? claim.subjectId === edge.sourceId && claim.objectId === edge.targetId && claim.predicate === edge.predicate : claim.subjectId === subjectId || claim.objectId === subjectId;
  };
  const scopeClaims = (ids, subjectId, contextId, owner) => {
    for (const id of Array.isArray(ids) ? ids : []) if (!relevant(claims.get(id), subjectId, contextId)) errors.push(`${owner}: appraisal claim ${id} is outside the assessed subject/context`);
  };
  const checkClaims = (ids, owner, requireSome = false) => {
    if (!uniqueStrings(ids) || (requireSome && !ids.length)) { errors.push(`${owner}: appraisal needs claim references`); return; }
    for (const id of ids) if (!claims.has(id)) errors.push(`${owner}: unknown appraisal claim ${id}`);
  };
  for (const model of bundle.scoringModels) {
    if (model.provisional && (model.calibrated || stable(model.rubric) !== stable(defaultRubric))) errors.push(`${model.id}: provisional model requires the uncalibrated supported rubric`);
    if (model.provisional && ['approved', 'published'].includes(bundle.status)) errors.push(`${model.id}: provisional appraisals cannot be published`);
    if (model.calibrated) {
      if (stable(model.rubric) !== stable(defaultRubric)) errors.push(`${model.id}: unsupported or altered scoring rubric`);
      const calibration = evaluateCalibration(model.calibration, model.revisionId);
      errors.push(...calibration.errors.map(error => `${model.id}: ${error}`));
      for (const sample of Array.isArray(model.calibration?.cases) ? model.calibration.cases : []) {
        if (!bundle.entities.some(item => item.id === sample.subjectId) && !bundle.relationships.some(item => item.id === sample.subjectId)) errors.push(`${model.id}: calibration subject not frozen in release`);
        if (!bundle.contexts.some(item => item.id === sample.contextId)) errors.push(`${model.id}: calibration context not frozen in release`);
        checkClaims(sample.claimIds, sample.id, sample.category !== 'missing');
        scopeClaims(sample.claimIds, sample.subjectId, sample.contextId, sample.id);
      }
    } else if (model.calibration) errors.push(`${model.id}: calibration cannot be presented as accepted on an uncalibrated model`);
  }
  for (const assessment of bundle.assessments) {
    const model = bundle.scoringModels.find(item => item.id === assessment.scoringModelId);
    for (const metric of ['mechanisticWeight', 'evidenceConfidence']) {
      if ((assessment[metric] === null) !== (assessment.metricStatus[metric] === 'unassessed')) errors.push(`${assessment.id}: ${metric} status does not match its value`);
    }
    if (assessment.therapeuticLeverage !== null) errors.push(`${assessment.id}: numerical therapeutic leverage is not supported`);
    if (assessment.therapeuticAppraisal) {
      if (assessment.metricStatus.therapeuticLeverage !== 'categorical' || stable(assessment.therapeuticAppraisal) !== stable(therapeuticAppraisal(bundle, assessment.subjectId))) errors.push(`${assessment.id}: therapeutic category must match the frozen target records`);
    } else if (assessment.metricStatus.therapeuticLeverage !== 'unassessed') errors.push(`${assessment.id}: therapeutic category requires a target appraisal`);
    const scored = assessment.mechanisticWeight !== null || assessment.evidenceConfidence !== null;
    const provisional = model?.provisional === true && assessment.appraisalProvenance?.status === 'provisional';
    if (scored && !model?.calibrated && !provisional) errors.push(`${assessment.id}: assessed values require a calibrated model or an explicit provisional appraisal`);
    if (assessment.appraisalProvenance) {
      const provenance = assessment.appraisalProvenance;
      if (!provisional || !nonempty(provenance.assessorId) || !['agent', 'human'].includes(provenance.assessorKind) || !validDate(provenance.assessedAt) || !/^[a-f0-9]{64}$/.test(provenance.inputDigest ?? '') || !nonempty(provenance.baseReleaseId) || !/^[a-f0-9]{64}$/.test(provenance.baseContentDigest ?? '')) errors.push(`${assessment.id}: incomplete provisional appraisal provenance`);
      if (assessment.reviewerDecision !== null || assessment.reviewedAt !== null || assessment.reviewerId) errors.push(`${assessment.id}: provisional appraisal cannot claim independent review`);
    }
    if (provisional && ['approved', 'published'].includes(bundle.status)) errors.push(`${assessment.id}: provisional appraisal cannot be published`);
    if (assessment.weightComponents) {
      if (Object.keys(assessment.weightComponents).sort().join(',') !== [...weightComponents].sort().join(',')) errors.push(`${assessment.id}: weight requires exactly five components`);
      for (const key of weightComponents) {
        const component = assessment.weightComponents[key];
        if (!component || !ordinal(component.rating) || !nonempty(component.rationale)) errors.push(`${assessment.id}: invalid ${key} appraisal`);
        checkClaims(component?.claimIds, assessment.id, component?.rating !== null);
        scopeClaims(component?.claimIds, assessment.subjectId, assessment.contextId, assessment.id);
      }
      try {
        const weight = calculateWeight(assessment.weightComponents);
        if (assessment.mechanisticWeight !== weight.displayed || assessment.weightRaw !== weight.raw || assessment.weightTier !== weight.tier) errors.push(`${assessment.id}: aggregate weight, tier or rounding differs from components`);
      } catch (error) { errors.push(`${assessment.id}: ${error.message}`); }
    } else if (assessment.mechanisticWeight !== null) errors.push(`${assessment.id}: assessed weight requires all component appraisals`);
    if (assessment.evidenceConfidence !== null) {
      const appraisal = assessment.confidenceAppraisal;
      if (!appraisal || !Number.isInteger(assessment.evidenceConfidence) ||
          !['predominantlyNonHuman', 'unresolvedMaterialContradiction'].every(key => typeof appraisal[key] === 'boolean') ||
          !['humanPrimaryGroups', 'humanDatasetFamilies', 'directFunctionalClaimIds', 'humanCausalClaimIds'].every(key => uniqueStrings(appraisal[key]))) {
        errors.push(`${assessment.id}: incomplete confidence appraisal`); continue;
      }
      for (const key of confidenceDimensions) {
        const dimension = appraisal.dimensions?.[key];
        if (!dimension || !['adequate', 'limited', 'inadequate', 'unknown'].includes(dimension.rating) || !nonempty(dimension.rationale)) errors.push(`${assessment.id}: invalid confidence dimension ${key}`);
        checkClaims(dimension?.claimIds, assessment.id, dimension?.rating === 'adequate');
        scopeClaims(dimension?.claimIds, assessment.subjectId, assessment.contextId, assessment.id);
      }
      checkClaims(appraisal.directFunctionalClaimIds, assessment.id);
      checkClaims(appraisal.humanCausalClaimIds, assessment.id);
      scopeClaims(appraisal.directFunctionalClaimIds, assessment.subjectId, assessment.contextId, assessment.id);
      scopeClaims(appraisal.humanCausalClaimIds, assessment.subjectId, assessment.contextId, assessment.id);
      const primaryHuman = evidenceFor([...assessment.supportingClaimIds, ...assessment.qualifyingClaimIds]).filter(item => ['human_genetic', 'human_observational', 'randomized_trial'].includes(item.evidenceType));
      scopeClaims([...assessment.supportingClaimIds, ...assessment.qualifyingClaimIds, ...assessment.contradictingClaimIds], assessment.subjectId, assessment.contextId, assessment.id);
      const humanSources = primaryHuman.map(item => bundle.sources.find(source => source.id === item.sourceId)).filter(Boolean);
      if (assessment.evidenceConfidence >= 3 && (appraisal.humanPrimaryGroups.some(id => !humanSources.some(source => source.researchGroupId === id)) || appraisal.humanDatasetFamilies.some(id => !humanSources.some(source => source.datasetFamilyId === id)))) errors.push(`${assessment.id}: human independence labels need frozen primary-study group and dataset evidence`);
      if (assessment.evidenceConfidence > 2 && !primaryHuman.length) errors.push(`${assessment.id}: non-human evidence cannot exceed confidence tier 2`);
      for (const id of appraisal.directFunctionalClaimIds) if (!['causal', 'mechanistic', 'interventional'].includes(claims.get(id)?.causalInterpretation) || !evidenceFor([id]).some(item => ['human_genetic', 'human_in_vitro', 'animal_experiment', 'randomized_trial'].includes(item.evidenceType))) errors.push(`${assessment.id}: direct functional support needs a functional claim`);
      for (const id of appraisal.humanCausalClaimIds) if (!['causal', 'interventional'].includes(claims.get(id)?.causalInterpretation) || !evidenceFor([id]).some(item => ['human_genetic', 'randomized_trial'].includes(item.evidenceType))) errors.push(`${assessment.id}: human causal support needs human genetic or interventional evidence`);
      const ceiling = confidenceCeiling(appraisal);
      if (ceiling === null || assessment.evidenceConfidence > ceiling) errors.push(`${assessment.id}: confidence exceeds evidence/context ceiling`);
      if (ceiling !== null && assessment.evidenceConfidence < ceiling && !nonempty(appraisal.downgradeRationale)) errors.push(`${assessment.id}: confidence downgrade needs a rationale`);
    }
    if (scored && ['approved', 'published'].includes(bundle.status) && (assessment.reviewerDecision !== 'accepted' || !nonempty(assessment.reviewerId) || !validDate(assessment.reviewedAt))) errors.push(`${assessment.id}: public appraisal needs a dated reviewer decision`);
  }
  return errors;
}
