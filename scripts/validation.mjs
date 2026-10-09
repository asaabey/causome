import Ajv from 'ajv';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const schema = JSON.parse(readFileSync(new URL('../schemas/release.schema.json', import.meta.url), 'utf8'));
const validateSchema = new Ajv({ allErrors: true, strict: true }).compile(schema);
const collections = ['entities', 'relationships', 'claims', 'evidenceItems', 'sources', 'therapies', 'contexts', 'assessments', 'scoringModels', 'mapViews', 'layouts'];

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
    for (const claimId of edge.supportingClaimIds) {
      const claim = indexes.claims.get(claimId);
      if (claim && (claim.subjectId !== edge.sourceId || claim.objectId !== edge.targetId || claim.contextId !== edge.contextId || claim.predicate !== edge.predicate)) {
        errors.push(`${edge.id}: supporting claim ${claimId} does not match the relationship`);
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
    reference('entities', claim.subjectId, claim.id);
    reference('entities', claim.objectId, claim.id);
    reference('contexts', claim.contextId, claim.id);
    for (const id of claim.evidenceItemIds) reference('evidenceItems', id, claim.id);
    if (bundle.illustrative && (claim.verification !== 'unverified' || claim.causalInterpretation !== 'illustrative')) {
      errors.push(`${claim.id}: illustrative claims must remain explicitly unverified`);
    }
  }
  for (const evidence of bundle.evidenceItems) reference('sources', evidence.sourceId, evidence.id);
  for (const therapy of bundle.therapies) {
    for (const id of [...therapy.directTargetIds, ...therapy.indirectTargetIds]) reference('entities', id, therapy.id);
    reference('contexts', therapy.indicationContextId, therapy.id);
    for (const id of therapy.supportingClaimIds) reference('claims', id, therapy.id);
    for (const id of therapy.trialSourceIds) {
      reference('sources', id, therapy.id);
      const source = indexes.sources.get(id);
      if (source && source.kind !== 'trial') errors.push(`${therapy.id}: ${id} is not a trial source`);
    }
  }
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
  }
  if (bundle.manifest.contentDigest !== contentDigest(bundle)) errors.push('Manifest content digest does not match the snapshot');
  return { valid: errors.length === 0, errors };
}

/**
 * A protected publisher must inject an authenticated review verifier. A field in
 * submitted JSON can never confer approval. The local CLI has no such verifier
 * and intentionally cannot approve or publish scientific content.
 * Successor lineage, repository overwrite protection and deployment belong to
 * the protected Milestone 3/4 publisher, not this preview implementation.
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
