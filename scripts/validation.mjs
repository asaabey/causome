import Ajv from 'ajv';
import { createHash } from 'node:crypto';
import schema from '../schemas/release.schema.json' with { type: 'json' };
import { validateScoring } from './scoring.mjs';

const validateSchema = new Ajv({ allErrors: true, strict: true }).compile(schema);
export const collections = ['entities', 'relationships', 'claims', 'evidenceItems', 'sources', 'therapies', 'contexts', 'assessments', 'scoringModels', 'mapViews', 'layouts'];
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

export function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/** The manifest is derived, not part of the scientific/view content it hashes. */
export function contentDigest(bundle) {
  const { manifest: _manifest, ...content } = bundle;
  return createHash('sha256').update(canonicalize(content)).digest('hex');
}

/** Preview validation permits candidates but never skips source/reference checks. */
export function validatePreview(bundle) {
  const errors = [];
  if (!validateSchema(bundle)) {
    return { valid: false, errors: validateSchema.errors.map(error => `Schema ${error.instancePath || '/'}: ${error.message}`) };
  }
  const indexes = Object.fromEntries(collections.map(name => [name, new Map(bundle[name].map(record => [record.id, record]))]));
  if (bundle.formatVersion !== '0.3.0') {
    if (bundle.parentReleaseId !== null || bundle.parentContentDigest !== null) errors.push('Legacy root snapshots require null parent lineage');
    if (bundle.scoringModels.some(item => item.calibrated) || bundle.assessments.some(item => item.mechanisticWeight !== null || item.evidenceConfidence !== null || item.therapeuticLeverage !== null)) errors.push('Legacy root snapshots require unassessed scores');
    if (bundle.mapViews.some(item => item.groups?.length)) errors.push('Grouped views require format 0.3.0');
  }
  if ((bundle.parentReleaseId === null) !== (bundle.parentContentDigest === null) || bundle.parentReleaseId === bundle.id) errors.push('Parent ID and digest must be paired and cannot refer to this release');
  if (!validDate(bundle.evidenceCutoff) || !Number.isFinite(Date.parse(bundle.createdAt))) errors.push('Invalid release creation date or evidence cutoff');
  errors.push(...validateScoring(bundle));
  const allIds = new Set();
  for (const name of collections) {
    for (const record of bundle[name]) {
      if (allIds.has(record.id)) errors.push(`Duplicate ID: ${record.id}`);
      allIds.add(record.id);
    }
  }
  const reference = (collection, id, owner) => {
    if (!indexes[collection].has(id)) errors.push(`${owner}: missing ${collection} reference ${id}`);
  };
  const claimReferences = record => {
    for (const key of ['supportingClaimIds', 'qualifyingClaimIds', 'contradictingClaimIds']) {
      for (const id of record[key]) reference('claims', id, record.id);
    }
  };
  for (const entity of bundle.entities) {
    for (const id of entity.biologicalRoleClaimIds) {
      reference('claims', id, entity.id);
      const claim = indexes.claims.get(id);
      if (claim && claim.subjectId !== entity.id && claim.objectId !== entity.id) {
        errors.push(`${entity.id}: biological role claim ${id} does not involve the entity`);
      }
    }
  }
  if (bundle.formatVersion === '0.3.0') {
    const names = new Map(), external = new Map();
    for (const entity of bundle.entities) {
      for (const value of [entity.label, ...entity.synonyms]) {
        const key = value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
        if (names.has(key) && names.get(key) !== entity.id) errors.push(`${entity.id}: ambiguous normalized identity ${value}`);
        names.set(key, entity.id);
      }
      for (const identifier of entity.externalIds) {
        const key = `${identifier.namespace.toLowerCase()}:${identifier.value.toLowerCase()}`;
        if (external.has(key) && external.get(key) !== entity.id) errors.push(`${entity.id}: duplicate canonical external identity ${key}`);
        external.set(key, entity.id);
      }
    }
  }
  for (const edge of bundle.relationships) {
    reference('entities', edge.sourceId, edge.id);
    reference('entities', edge.targetId, edge.id);
    reference('contexts', edge.contextId, edge.id);
    reference('assessments', edge.assessmentId, edge.id);
    claimReferences(edge);
    if (edge.sourceId === edge.targetId) errors.push(`${edge.id}: self-relationships are unsupported in this contract`);
    if (edge.directionality === 'symmetric' && edge.sourceId > edge.targetId) {
      errors.push(`${edge.id}: symmetric endpoints must be in canonical ID order`);
    }
    const assessment = indexes.assessments.get(edge.assessmentId);
    if (assessment && (assessment.subjectId !== edge.id || assessment.contextId !== edge.contextId)) {
      errors.push(`${edge.id}: assessment does not match its subject and context`);
    }
    for (const claimId of [...edge.supportingClaimIds, ...edge.qualifyingClaimIds, ...edge.contradictingClaimIds]) {
      const claim = indexes.claims.get(claimId);
      if (claim && (claim.subjectId !== edge.sourceId || claim.objectId !== edge.targetId || claim.contextId !== edge.contextId || claim.predicate !== edge.predicate)) {
        errors.push(`${edge.id}: attached claim ${claimId} does not match the relationship`);
      }
    }
  }
  const symmetricPairs = new Set();
  for (const edge of bundle.relationships.filter(record => record.directionality === 'symmetric')) {
    const key = JSON.stringify([edge.sourceId, edge.targetId, edge.predicate, edge.contextId]);
    if (symmetricPairs.has(key)) errors.push(`${edge.id}: duplicate symmetric relationship`);
    symmetricPairs.add(key);
  }
  for (const claim of bundle.claims) {
    if (!indexes.therapies.has(claim.subjectId)) reference('entities', claim.subjectId, claim.id);
    reference('entities', claim.objectId, claim.id);
    reference('contexts', claim.contextId, claim.id);
    for (const id of claim.evidenceItemIds) reference('evidenceItems', id, claim.id);
    if (bundle.illustrative && (claim.verification !== 'unverified' || claim.causalInterpretation !== 'illustrative')) {
      errors.push(`${claim.id}: illustrative claims must remain explicitly unverified`);
    }
    if (!bundle.illustrative) {
      if (!['source_checked', 'reviewed'].includes(claim.verification) || claim.causalInterpretation === 'illustrative') errors.push(`${claim.id}: scientific candidate needs a source check`);
      const review = claim.reviewDisposition;
      if (!validDate(claim.sourceCheckedAt)) errors.push(`${claim.id}: invalid source-check date`);
      if (claim.sourceCheckedAt > bundle.evidenceCutoff) errors.push(`${claim.id}: source check exceeds evidence cutoff`);
      if (review?.decision === 'pending_domain_review' && (review.reviewerId !== null || review.reviewedAt !== null || claim.verification === 'reviewed')) errors.push(`${claim.id}: pending review cannot carry human approval`);
      if (claim.verification === 'reviewed' && (review?.decision !== 'accepted' || !review.reviewerId || !review.reviewedAt)) errors.push(`${claim.id}: reviewed claim needs a recorded domain-review disposition`);
      for (const id of claim.evidenceItemIds) {
        const evidence = indexes.evidenceItems.get(id);
        const source = evidence && indexes.sources.get(evidence.sourceId);
        if (source?.kind === 'fixture_documentation') errors.push(`${claim.id}: scientific candidate cannot cite fixture documentation`);
      }
    }
  }
  for (const evidence of bundle.evidenceItems) {
    reference('sources', evidence.sourceId, evidence.id);
    if (!validDate(evidence.retrievedAt)) errors.push(`${evidence.id}: invalid retrieval date`);
    if (!bundle.illustrative && evidence.retrievedAt > bundle.evidenceCutoff) errors.push(`${evidence.id}: retrieval exceeds evidence cutoff`);
  }
  if (!bundle.illustrative) {
    for (const entity of bundle.entities) if (!entity.biologicalRoleClaimIds.length) errors.push(`${entity.id}: scientific entity needs a role claim`);
    for (const source of bundle.sources) {
      try {
        if (new URL(source.url).protocol !== 'https:') errors.push(`${source.id}: scientific source needs an HTTPS URL`);
      } catch { errors.push(`${source.id}: invalid scientific source URL`); }
    }
  }
  for (const therapy of bundle.therapies) {
    for (const id of [...therapy.directTargetIds, ...therapy.indirectTargetIds]) reference('entities', id, therapy.id);
    reference('contexts', therapy.indicationContextId, therapy.id);
    for (const id of therapy.supportingClaimIds) reference('claims', id, therapy.id);
    for (const id of [...(therapy.qualifyingClaimIds ?? []), ...(therapy.contradictingClaimIds ?? [])]) reference('claims', id, therapy.id);
    for (const id of therapy.verificationSourceIds ?? []) reference('sources', id, therapy.id);
    if (!bundle.illustrative) {
      if (therapy.directTargetIds.length + therapy.indirectTargetIds.length === 0) errors.push(`${therapy.id}: therapy needs a linked target`);
      if (therapy.lastVerifiedAt > bundle.evidenceCutoff) errors.push(`${therapy.id}: verification exceeds evidence cutoff`);
      for (const id of [...therapy.supportingClaimIds, ...therapy.qualifyingClaimIds, ...therapy.contradictingClaimIds]) {
        const claim = indexes.claims.get(id);
        if (claim && claim.subjectId !== therapy.id) errors.push(`${therapy.id}: claim ${id} does not concern the therapy`);
      }
      if (therapy.developmentStatus === 'approved' && !therapy.verificationSourceIds.some(id => indexes.sources.get(id)?.kind === 'regulatory')) errors.push(`${therapy.id}: approved therapy needs regulatory status evidence`);
    }
    for (const id of therapy.trialSourceIds) {
      reference('sources', id, therapy.id);
      const source = indexes.sources.get(id);
      if (source && source.kind !== 'trial') errors.push(`${therapy.id}: ${id} is not a trial source`);
    }
  }
  if (bundle.formatVersion !== bundle.manifest.schemaVersion) errors.push('Manifest schema version does not match bundle format version');
  for (const context of bundle.contexts) {
    if (context.diseaseId !== bundle.diseaseId) errors.push(`${context.id}: disease does not match release`);
  }
  for (const assessment of bundle.assessments) {
    if (!indexes.entities.has(assessment.subjectId) && !indexes.relationships.has(assessment.subjectId)) {
      errors.push(`${assessment.id}: missing assessed subject ${assessment.subjectId}`);
    }
    reference('contexts', assessment.contextId, assessment.id);
    reference('scoringModels', assessment.scoringModelId, assessment.id);
    claimReferences(assessment);
  }
  for (const layout of bundle.layouts) {
    const positions = new Set();
    for (const position of layout.positions) {
      reference('entities', position.entityId, layout.id);
      if (positions.has(position.entityId)) errors.push(`${layout.id}: duplicate position for ${position.entityId}`);
      positions.add(position.entityId);
    }
  }
  for (const view of bundle.mapViews) {
    reference('contexts', view.contextId, view.id);
    reference('layouts', view.layoutId, view.id);
    const selected = new Map();
    for (const id of view.entityIds) reference('entities', id, view.id);
    for (const id of view.relationshipIds) reference('relationships', id, view.id);
    for (const id of view.assessmentIds) {
      reference('assessments', id, view.id);
      const assessment = indexes.assessments.get(id);
      if (!assessment) continue;
      if (assessment.contextId !== view.contextId) errors.push(`${view.id}: assessment ${id} has incompatible context`);
      if (selected.has(assessment.subjectId)) errors.push(`${view.id}: duplicate selected assessment for ${assessment.subjectId}`);
      selected.set(assessment.subjectId, id);
    }
    const positions = new Set(indexes.layouts.get(view.layoutId)?.positions.map(position => position.entityId));
    for (const id of [...view.entityIds, ...view.relationshipIds]) {
      if (!selected.has(id)) errors.push(`${view.id}: missing selected assessment for ${id}`);
    }
    for (const id of view.entityIds) if (!positions.has(id)) errors.push(`${view.id}: missing layout for ${id}`);
    for (const id of view.relationshipIds) {
      const edge = indexes.relationships.get(id);
      if (!edge) continue;
      if (!view.entityIds.includes(edge.sourceId) || !view.entityIds.includes(edge.targetId)) {
        errors.push(`${view.id}: relationship ${id} has an endpoint outside the view`);
      }
      if (edge.contextId !== view.contextId || selected.get(id) !== edge.assessmentId) {
        errors.push(`${view.id}: relationship ${id} has incompatible selected context or assessment`);
      }
    }
    const grouped = new Set(), groupIds = new Set();
    for (const group of view.groups ?? []) {
      if (groupIds.has(group.id)) errors.push(`${view.id}: duplicate group ID ${group.id}`);
      groupIds.add(group.id);
      for (const id of group.entityIds) {
        if (!view.entityIds.includes(id) || grouped.has(id)) errors.push(`${view.id}: group member ${id} is missing or duplicated`);
        grouped.add(id);
      }
    }
    const defaultHidden = new Set((view.groups ?? []).filter(group => group.collapsed).flatMap(group => group.entityIds));
    if (view.entityIds.every(id => defaultHidden.has(id))) errors.push(`${view.id}: grouped overview must leave at least one entity visible`);
  }
  if (bundle.formatVersion === '0.3.0') {
    const referencedClaims = new Set([...bundle.entities.flatMap(item => item.biologicalRoleClaimIds), ...bundle.relationships.flatMap(item => [...item.supportingClaimIds, ...item.qualifyingClaimIds, ...item.contradictingClaimIds]), ...bundle.therapies.flatMap(item => [...item.supportingClaimIds, ...(item.qualifyingClaimIds ?? []), ...(item.contradictingClaimIds ?? [])])]);
    const referencedEvidence = new Set(bundle.claims.flatMap(item => item.evidenceItemIds));
    const referencedSources = new Set([...bundle.evidenceItems.map(item => item.sourceId), ...bundle.therapies.flatMap(item => [...item.trialSourceIds, ...(item.verificationSourceIds ?? [])])]);
    for (const claim of bundle.claims) if (!referencedClaims.has(claim.id)) errors.push(`${claim.id}: orphan claim`);
    for (const evidence of bundle.evidenceItems) if (!referencedEvidence.has(evidence.id)) errors.push(`${evidence.id}: orphan evidence`);
    for (const source of bundle.sources) if (!referencedSources.has(source.id)) errors.push(`${source.id}: orphan source`);
    const support = [...bundle.entities.flatMap(item => item.biologicalRoleClaimIds), ...bundle.relationships.flatMap(item => item.supportingClaimIds), ...bundle.therapies.flatMap(item => item.supportingClaimIds)];
    for (const id of support) {
      const evidence = indexes.claims.get(id)?.evidenceItemIds.map(eid => indexes.evidenceItems.get(eid)).filter(Boolean) ?? [];
      if (evidence.length && evidence.every(item => indexes.sources.get(item.sourceId)?.flags?.some(flag => ['retracted', 'retraction-linked', 'concern-linked', 'expression-of-concern', 'retraction-notice'].includes(flag)))) errors.push(`${id}: flagged literature cannot be the sole supporting evidence`);
    }
  }
  if (bundle.manifest.contentDigest !== contentDigest(bundle)) errors.push('Manifest content digest does not match the snapshot');
  return { valid: errors.length === 0, errors };
}

/**
 * A protected publisher must inject an authenticated review verifier. A field in
 * submitted JSON can never confer approval. The local CLI has no such verifier
 * and intentionally cannot approve or publish scientific content.
 * The root publisher supplies this verifier after querying repository reviews.
 * The same authenticated gate applies to roots and successors; the store
 * additionally validates the exact current parent under a publication lock.
 */
export async function validatePublication(bundle, trustedWorkflow = {}) {
  const preview = validatePreview(bundle);
  const errors = [...preview.errors];
  if (!preview.valid) return { valid: false, errors };
  if (bundle.illustrative) errors.push('Illustrative content cannot be published as scientific knowledge');
  if (!['approved', 'published'].includes(bundle.status)) errors.push('Release must be approved before publication');
  for (const name of collections) {
    for (const record of bundle[name]) {
      if (!['approved', 'published'].includes(record.status)) errors.push(`${record.id}: unapproved record cannot be published`);
    }
  }
  for (const source of bundle.sources) {
    if (source.kind === 'fixture_documentation') errors.push(`${source.id}: fixture documentation is not scientific evidence`);
  }
  for (const claim of bundle.claims) {
    if (claim.verification !== 'reviewed' || claim.causalInterpretation === 'illustrative') {
      errors.push(`${claim.id}: unverified claim cannot be published`);
    }
    if (claim.reviewDisposition?.decision === 'pending_domain_review') errors.push(`${claim.id}: pending domain review cannot be published`);
    if (claim.reviewDisposition?.decision !== 'accepted' || !claim.reviewDisposition?.reviewerId || !validDate(claim.reviewDisposition?.reviewedAt) || claim.reviewDisposition.reviewedAt < claim.sourceCheckedAt) {
      errors.push(`${claim.id}: publication needs an accepted, dated domain-review disposition`);
    }
  }
  if (typeof trustedWorkflow.verifyAuthenticatedApproval !== 'function') {
    errors.push('Publication requires a trusted authenticated approval verifier; JSON approval fields are insufficient');
  } else {
    try {
      const approved = await trustedWorkflow.verifyAuthenticatedApproval({
        releaseId: bundle.id, revisionId: bundle.revisionId, changeSetRevision: bundle.changeSetRevision,
        contentDigest: contentDigest(bundle), parentReleaseId: bundle.parentReleaseId,
        parentContentDigest: bundle.parentContentDigest,
        scoringModelVersions: bundle.scoringModels.map(record => record.revisionId),
      });
      if (approved !== true) errors.push('Authenticated approval verification failed');
    } catch {
      errors.push('Authenticated approval verifier failed');
    }
  }
  return { valid: errors.length === 0, errors };
}
