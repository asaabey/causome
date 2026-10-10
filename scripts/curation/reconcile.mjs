import { contentDigest, validatePreview, collections, canonicalize } from '../validation.mjs';
import { assert, hash, safeSlug, validDate } from './io.mjs';
import { clearAppraisal } from './assessment.mjs';

export const outcomes = ['supporting', 'refining', 'qualifying', 'contradicting', 'superseding', 'novel', 'duplicate', 'non-contributory'];
const predicates = ['stimulates', 'produces', 'forms', 'contributes_to', 'is_associated_with', 'activates', 'inhibits', 'increases_availability_of', 'promotes_survival_of', 'differentiates_into', 'efficacy_on'];
const normalize = text => String(text).normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
const sourceIdentifiers = source => [...(source.identifiers ?? []), source.studyId, ...(source.url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/)?.slice(1).map(id => `PMID:${id}`) ?? [])].filter(Boolean).map(normalize);

export function resolveEntity(value, entities) {
  const key = normalize(value);
  const matches = entities.filter(item => [item.id, item.label, ...item.synonyms, ...item.externalIds.map(id => `${id.namespace}:${id.value}`)].some(alias => normalize(alias) === key));
  assert(matches.length === 1, matches.length ? `Ambiguous entity: ${value}` : `Unresolved entity: ${value}`);
  return matches[0].id;
}

export function validateExtraction(extraction, papers, base) {
  const errors = [], ids = new Set(), paperIndex = new Map(papers.map(item => [item.key, item]));
  if (!extraction || extraction.version !== 1 || extraction.diseaseId !== base.diseaseId || extraction.baseReleaseId !== base.id || extraction.baseContentDigest !== contentDigest(base) ||
      !['manual', 'model'].includes(extraction.mode) || typeof extraction.promptVersion !== 'string' || !extraction.promptVersion || typeof extraction.modelVersion !== 'string' || !extraction.modelVersion || !Array.isArray(extraction.findings) || !Array.isArray(extraction.newEntities)) return ['Invalid extraction envelope or stale named base'];
  const envelopeKeys = ['version', 'diseaseId', 'baseReleaseId', 'baseContentDigest', 'mode', 'promptVersion', 'modelVersion', 'findings', 'newEntities'];
  if (Object.keys(extraction).some(key => !envelopeKeys.includes(key))) errors.push('Extraction includes unsupported fields; scores and approvals cannot be supplied by an extractor');
  for (const entity of extraction.newEntities) {
    if (!safeSlug(entity.id) || !entity.label?.trim() || !entity.description?.trim() || !Array.isArray(entity.synonyms) || !Array.isArray(entity.externalIds) ||
        Object.keys(entity).some(key => !['id', 'label', 'description', 'synonyms', 'externalIds', 'entityClass'].includes(key))) errors.push('Invalid new canonical entity descriptor');
  }
  const entities = [...base.entities, ...extraction.newEntities];
  for (const finding of extraction.findings) {
    if (Object.keys(finding).some(key => !['id', 'paperKey', 'paperDigest', 'category', 'abstained', 'abstentionReason', 'predicate', 'causalInterpretation', 'limitations', 'text', 'quote', 'quoteLocation', 'studySystem', 'evidenceType', 'contextId', 'subject', 'object', 'sourceCheck', 'distinctFindingRationale'].includes(key))) errors.push(`${finding.id}: unsupported extraction fields`);
    const paper = paperIndex.get(finding.paperKey);
    if (!safeSlug(finding.id) || ids.has(finding.id)) errors.push('Extraction needs unique safe finding IDs');
    ids.add(finding.id);
    if (!paper || finding.paperDigest !== hash(paper)) errors.push(`${finding.id}: missing or changed source snapshot`);
    if (!outcomes.includes(finding.category)) errors.push(`${finding.id}: invalid reconciliation category`);
    if (finding.abstained === true) {
      if (typeof finding.abstentionReason !== 'string' || !finding.abstentionReason.trim()) errors.push(`${finding.id}: abstention requires a reason`);
      continue;
    }
    if (!predicates.includes(finding.predicate) || !['association', 'causal', 'mechanistic', 'hypothesis', 'interventional'].includes(finding.causalInterpretation)) errors.push(`${finding.id}: invalid predicate or interpretation`);
    if (finding.causalInterpretation === 'association' && finding.predicate !== 'is_associated_with') errors.push(`${finding.id}: association cannot be escalated to a causal predicate`);
    if (finding.predicate === 'is_associated_with' && finding.causalInterpretation !== 'association') errors.push(`${finding.id}: symmetric relationship must remain associative`);
    if (!Array.isArray(finding.limitations) || !finding.limitations.length || finding.limitations.some(item => typeof item !== 'string' || !item.trim())) errors.push(`${finding.id}: limitations are required`);
    for (const key of ['text', 'quote', 'quoteLocation', 'studySystem']) if (typeof finding[key] !== 'string' || !finding[key].trim()) errors.push(`${finding.id}: ${key} is required`);
    if (!paper?.abstract || !normalize(paper.abstract).includes(normalize(finding.quote ?? ''))) errors.push(`${finding.id}: citation passage is absent from the inspected source`);
    if (!['human_genetic', 'human_observational', 'human_in_vitro', 'animal_experiment', 'randomized_trial'].includes(finding.evidenceType)) errors.push(`${finding.id}: literature finding needs a study type`);
    if (!base.contexts.some(item => item.id === finding.contextId)) errors.push(`${finding.id}: unknown disease context`);
    try { const source = resolveEntity(finding.subject, entities), target = resolveEntity(finding.object, entities); if (source === target) errors.push(`${finding.id}: self-relationship is unsupported`); } catch (error) { errors.push(`${finding.id}: ${error.message}`); }
    if (finding.sourceCheck && (!finding.sourceCheck.checkedBy?.trim() || !validDate(finding.sourceCheck.checkedAt))) errors.push(`${finding.id}: invalid source-check record`);
    if (paper?.flags.some(flag => ['retracted', 'retraction-linked', 'concern-linked', 'expression-of-concern', 'retraction-notice'].includes(flag)) && ['supporting', 'novel'].includes(finding.category)) errors.push(`${finding.id}: flagged source cannot introduce supporting evidence`);
    if (paper?.flags.includes('secondary-or-commentary') && !['duplicate', 'non-contributory'].includes(finding.category)) errors.push(`${finding.id}: find and inspect the primary report before extracting a scientific claim from secondary literature`);
  }
  return errors;
}

const identity = (id, revision) => ({ id, revisionId: `${id}-${revision}`, status: 'candidate' });
const unassessed = (id, subjectId, contextId, model, revision) => ({ ...identity(id, revision), subjectId, contextId, scoringModelId: model,
  metricStatus: { mechanisticWeight: 'unassessed', evidenceConfidence: 'unassessed', therapeuticLeverage: 'unassessed' }, mechanisticWeight: null, evidenceConfidence: null, therapeuticLeverage: null,
  supportingClaimIds: [], qualifyingClaimIds: [], contradictingClaimIds: [], rationale: 'New candidate finding. Source interpretation, context and domain review are pending; no score was inferred.', reviewerDecision: null, reviewedAt: null });

export function reconcileExtraction({ base, extraction, papers, cutoff }) {
  const baseValidation = validatePreview(base);
  assert(baseValidation.valid, `Invalid base: ${baseValidation.errors.join('; ')}`);
  const errors = validateExtraction(extraction, papers, base);
  assert(!errors.length, errors.join('\n'));
  assert(validDate(cutoff) && cutoff >= base.evidenceCutoff, 'Evidence cutoff cannot precede the base');
  const binding = { reconciliationVersion: 'causome-reconciliation-v1', baseReleaseId: base.id, baseContentDigest: contentDigest(base), extractionDigest: hash(extraction), sourceDigest: hash(papers), cutoff };
  const proposalId = `proposal-${hash(binding).slice(0, 24)}`;
  const report = { version: 1, id: proposalId, diseaseId: base.diseaseId, ...binding, promptVersion: extraction.promptVersion, modelVersion: extraction.modelVersion, mode: extraction.mode,
    findings: [], pendingSourceChecks: [], warnings: [], candidate: null, publicationChanged: false, reviewRequired: true };
  for (const paper of papers.filter(item => item.flags.some(flag => ['retracted', 'retraction-linked', 'concern-linked', 'expression-of-concern'].includes(flag)))) {
    if (base.sources.some(source => sourceIdentifiers(source).some(id => paper.identifiers.map(normalize).includes(id)))) report.warnings.push(`${paper.key}: a source already used by the base is flagged; reconcile its existing claims before generating a candidate.`);
  }
  const candidate = structuredClone(base), revision = hash(binding).slice(0, 12);
  candidate.formatVersion = '0.3.0'; candidate.manifest.schemaVersion = '0.3.0';
  candidate.id = `${base.diseaseId}-candidate-${revision}`; candidate.revisionId = `${candidate.id}-r1`; candidate.changeSetRevision = proposalId;
  const publicBase = ['approved', 'published'].includes(base.status) && !base.illustrative;
  candidate.parentReleaseId = publicBase ? base.id : base.parentReleaseId;
  candidate.parentContentDigest = publicBase ? base.manifest.contentDigest : base.parentContentDigest;
  candidate.status = 'candidate'; candidate.createdAt = new Date(Math.max(Date.parse(base.createdAt), Date.parse(`${cutoff}T00:00:00.000Z`))).toISOString(); candidate.evidenceCutoff = cutoff;
  candidate.releaseNote = `Candidate reconciled against ${base.id} (${base.manifest.contentDigest}). ${extraction.findings.length} extracted findings; independent domain review is pending.`;
  for (const name of collections) for (const record of candidate[name]) record.status = 'candidate';
  for (const claim of candidate.claims) { claim.verification = 'source_checked'; claim.reviewDisposition = { decision: 'pending_domain_review', reviewerId: null, reviewedAt: null }; }
  for (const assessment of candidate.assessments) {
    const hadAppraisal = assessment.weightComponents || assessment.confidenceAppraisal || assessment.therapeuticAppraisal;
    clearAppraisal(assessment);
    if (hadAppraisal) assessment.rationale = 'Evidence changed during reconciliation. Earlier appraisals remain in the frozen base; this candidate requires a new editorial appraisal.';
  }
  for (const entity of extraction.newEntities) {
    assert(!candidate.entities.some(item => item.id === entity.id), `Entity already exists: ${entity.id}`);
    candidate.entities.push({ ...entity, ...identity(entity.id, revision), biologicalRoleClaimIds: [] });
  }
  const paperIndex = new Map(papers.map(item => [item.key, item]));
  let applied = 0;
  for (const finding of [...extraction.findings].sort((a, b) => a.id.localeCompare(b.id))) {
    if (finding.abstained || finding.category === 'non-contributory') { report.findings.push({ id: finding.id, outcome: 'non-contributory', reason: finding.abstentionReason ?? 'Curator marked non-contributory' }); continue; }
    const paper = paperIndex.get(finding.paperKey);
    let subjectId = resolveEntity(finding.subject, candidate.entities), objectId = resolveEntity(finding.object, candidate.entities);
    if (finding.predicate === 'is_associated_with' && subjectId > objectId) [subjectId, objectId] = [objectId, subjectId];
    const source = candidate.sources.find(item => sourceIdentifiers(item).some(id => paper.identifiers.map(normalize).includes(id)));
    const existing = candidate.claims.filter(claim => claim.subjectId === subjectId && claim.objectId === objectId && claim.predicate === finding.predicate && claim.contextId === finding.contextId && claim.evidenceItemIds.some(id => candidate.evidenceItems.find(item => item.id === id)?.sourceId === source?.id));
    if (existing.some(claim => normalize(claim.text) === normalize(finding.text))) { report.findings.push({ id: finding.id, outcome: 'duplicate', claimIds: existing.map(item => item.id) }); continue; }
    if (finding.category === 'duplicate' || (existing.length && !finding.distinctFindingRationale?.trim())) {
      report.warnings.push(`${finding.id}: potential duplicate; record a distinct-finding rationale or confirm the existing claim.`);
      report.findings.push({ id: finding.id, outcome: 'needs-reconciliation', claimIds: existing.map(item => item.id) });
      continue;
    }
    if (!finding.sourceCheck) { report.pendingSourceChecks.push(finding.id); continue; }
    assert(finding.sourceCheck.checkedAt <= cutoff, `${finding.id}: source check exceeds the evidence cutoff`);
    const sourceId = source?.id ?? `source-${hash(paper.identifiers).slice(0, 20)}`;
    if (source && paper.flags.length) source.flags = [...new Set([...(source.flags ?? []), ...paper.flags])].sort();
    if (!source) candidate.sources.push({ ...identity(sourceId, revision), title: paper.title, url: paper.url, kind: 'publication', studyId: paper.identifiers.find(id => id.startsWith('PMID:')) ?? paper.identifiers[0],
      citation: [paper.authors, paper.title, paper.journal, paper.publishedAt].filter(Boolean).join('. '), accessScope: paper.accessScope, identifiers: [...paper.identifiers], flags: [...paper.flags] });
    const evidenceId = `evidence-${hash({ paper: paper.key, finding: finding.id }).slice(0, 20)}`;
    assert(!candidate.evidenceItems.some(item => item.id === evidenceId), `${finding.id}: reused finding ID has changed content; use a distinct finding ID and rationale`);
    candidate.evidenceItems.push({ ...identity(evidenceId, revision), sourceId, summary: finding.text, location: finding.quoteLocation, retrievedAt: finding.sourceCheck.checkedAt, studySystem: finding.studySystem, evidenceType: finding.evidenceType });
    const claimId = `claim-${hash({ paper: paper.key, finding: finding.id }).slice(0, 20)}`;
    candidate.claims.push({ ...identity(claimId, revision), text: finding.text, subjectId, objectId, predicate: finding.predicate, contextId: finding.contextId, evidenceItemIds: [evidenceId], verification: 'source_checked', causalInterpretation: finding.causalInterpretation,
      limitations: finding.limitations, sourceCheckedAt: finding.sourceCheck.checkedAt, reviewDisposition: { decision: 'pending_domain_review', reviewerId: null, reviewedAt: null } });
    let edge = candidate.relationships.find(item => item.sourceId === subjectId && item.targetId === objectId && item.predicate === finding.predicate && item.contextId === finding.contextId);
    if (!edge) {
      assert(!['qualifying', 'contradicting', 'refining', 'superseding'].includes(finding.category), `${finding.id}: qualifying/challenging evidence needs an existing relationship`);
      const id = `relationship-${hash({ subjectId, objectId, predicate: finding.predicate, contextId: finding.contextId }).slice(0, 20)}`;
      edge = { ...identity(id, revision), sourceId: subjectId, targetId: objectId, predicate: finding.predicate, contextId: finding.contextId, assessmentId: `assessment-${id}`,
        directionality: finding.predicate === 'is_associated_with' ? 'symmetric' : 'directed', polarity: finding.predicate === 'is_associated_with' ? 'not_applicable' : finding.predicate === 'inhibits' ? 'negative' : 'positive', supportingClaimIds: [], qualifyingClaimIds: [], contradictingClaimIds: [] };
      candidate.relationships.push(edge);
      candidate.assessments.push(unassessed(edge.assessmentId, edge.id, finding.contextId, candidate.scoringModels[0].id, revision));
    }
    const category = ['qualifying', 'refining', 'superseding'].includes(finding.category) ? 'qualifyingClaimIds' : finding.category === 'contradicting' ? 'contradictingClaimIds' : 'supportingClaimIds';
    edge[category].push(claimId); edge.revisionId = `${edge.id}-${revision}`;
    candidate.assessments.find(item => item.id === edge.assessmentId)[category].push(claimId);
    for (const id of [subjectId, objectId]) {
      const entity = candidate.entities.find(item => item.id === id);
      if (extraction.newEntities.some(item => item.id === id)) entity.biologicalRoleClaimIds.push(claimId);
      if (!candidate.assessments.some(item => item.subjectId === id && item.contextId === finding.contextId)) candidate.assessments.push(unassessed(`assessment-${hash({ id, context: finding.contextId }).slice(0, 20)}`, id, finding.contextId, candidate.scoringModels[0].id, revision));
    }
    report.findings.push({ id: finding.id, outcome: finding.category, claimId, relationshipId: edge.id, sourceId }); applied++;
  }
  if (!applied || report.pendingSourceChecks.length || report.warnings.length) return report;
  // New biology stays in an explicit research view. Existing focused views and
  // their prominence are preserved; no extraction promotes a mediator to core.
  for (const context of candidate.contexts) {
    const edges = candidate.relationships.filter(item => item.contextId === context.id);
    if (!edges.length) continue;
    const entityIds = [...new Set(edges.flatMap(item => [item.sourceId, item.targetId]))];
    const layoutId = `layout-research-${context.id}`, viewId = `view-research-${context.id}`;
    candidate.layouts = candidate.layouts.filter(item => item.id !== layoutId);
    candidate.mapViews = candidate.mapViews.filter(item => item.id !== viewId);
    candidate.layouts.push({ ...identity(layoutId, revision), positions: entityIds.map((entityId, index) => ({ entityId, x: (index % 4) * 340, y: Math.floor(index / 4) * 240 })) });
    candidate.mapViews.push({ ...identity(viewId, revision), label: 'Research additions · domain review pending', contextId: context.id, entityIds, relationshipIds: edges.map(item => item.id),
      assessmentIds: candidate.assessments.filter(item => item.contextId === context.id && [...entityIds, ...edges.map(edge => edge.id)].includes(item.subjectId)).map(item => item.id), layoutId });
  }
  for (const name of collections) for (const record of candidate[name]) {
    const previous = base[name].find(item => item.id === record.id);
    if (previous && canonicalize(revisionContent(previous)) !== canonicalize(revisionContent(record))) record.revisionId = `${record.id}-${revision}`;
  }
  candidate.manifest.contentDigest = contentDigest(candidate);
  const validation = validatePreview(candidate);
  assert(validation.valid, `Reconciled candidate failed validation:\n${validation.errors.join('\n')}`);
  report.candidate = candidate;
  return report;
}

export function releaseDiff(before, after) {
  assert(before.diseaseId === after.diseaseId, 'Release comparison requires the same disease');
  const metadata = value => Object.fromEntries(Object.entries(value).filter(([key]) => !collections.includes(key)));
  const previousMetadata = metadata(before), currentMetadata = metadata(after);
  const metadataFields = [...new Set([...Object.keys(previousMetadata), ...Object.keys(currentMetadata)])].filter(key => canonicalize(previousMetadata[key]) !== canonicalize(currentMetadata[key]));
  return [...(metadataFields.length ? [{ collection: 'release', id: 'release-metadata', kind: 'changed', fields: metadataFields, before: previousMetadata, after: currentMetadata }] : []), ...collections.flatMap(collection => {
    const old = new Map(before[collection].map(item => [item.id, item])), next = new Map(after[collection].map(item => [item.id, item]));
    return [...new Set([...old.keys(), ...next.keys()])].sort().flatMap(id => {
      const previous = old.get(id), current = next.get(id);
      if (canonicalize(previous) === canonicalize(current)) return [];
      const fields = [...new Set([...Object.keys(previous ?? {}), ...Object.keys(current ?? {})])].filter(key => canonicalize(previous?.[key]) !== canonicalize(current?.[key]));
      return [{ collection, id, kind: !previous ? 'added' : !current ? 'removed' : 'changed', fields, before: previous ?? null, after: current ?? null }];
    });
  })];
}

const revisionContent = record => Object.fromEntries(Object.entries(record).filter(([key]) => !['revisionId', 'status'].includes(key)));
export function validateRevisionChanges(before, after) {
  return collections.flatMap(name => after[name].flatMap(record => {
    const previous = before[name].find(item => item.id === record.id);
    return previous && previous.revisionId === record.revisionId && canonicalize(revisionContent(previous)) !== canonicalize(revisionContent(record)) ? [`${record.id}: changed record content requires a new revision ID`] : [];
  }));
}
