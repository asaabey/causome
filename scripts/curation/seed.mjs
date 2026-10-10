import { contentDigest, validatePreview } from '../validation.mjs';
import { assert, hash, safeSlug, validDate } from './io.mjs';
import { normalizePaper } from './literature.mjs';
import { resolveEntity, validateExtraction } from './reconcile.mjs';

/** A first disease map is authored from source-checked findings, never copied from another disease. */
export function seedDisease(profile, input) {
  assert(input.version === 1 && safeSlug(input.id) && validDate(input.evidenceCutoff) && input.context && Array.isArray(input.entities) && Array.isArray(input.publications) && Array.isArray(input.findings), 'Invalid first-map input');
  const revision = hash(input).slice(0, 12), date = input.evidenceCutoff;
  const identity = id => ({ id, revisionId: `${id}-${revision}`, status: 'candidate' });
  const context = { ...input.context, ...identity(input.context.id), diseaseId: profile.id };
  const modelId = `scoring-${profile.id}-unassessed`;
  const papers = input.publications.map(normalizePaper).map(paper => ({ ...paper, firstSeenAt: date, lastCheckedAt: date, reviewedAt: null }));
  const entities = input.entities.map(entity => ({ ...entity, ...identity(entity.id), biologicalRoleClaimIds: [] }));
  const sources = papers.map(paper => ({ ...identity(`source-${paper.key}`), title: paper.title, url: paper.url, kind: 'publication', studyId: paper.identifiers.find(id => id.startsWith('PMID:')) ?? paper.identifiers[0],
    citation: [paper.authors, paper.title, paper.journal, paper.publishedAt].filter(Boolean).join('. '), accessScope: paper.accessScope, identifiers: [...paper.identifiers], flags: [...paper.flags] }));
  const claims = [], evidenceItems = [], relationships = [], assessments = [];
  const assessment = (subjectId, support = [], qualifying = [], contradicting = []) => ({ ...identity(`assessment-${hash({ subjectId, context: context.id }).slice(0, 20)}`), subjectId, contextId: context.id, scoringModelId: modelId,
    metricStatus: { mechanisticWeight: 'unassessed', evidenceConfidence: 'unassessed', therapeuticLeverage: 'unassessed' }, mechanisticWeight: null, evidenceConfidence: null, therapeuticLeverage: null,
    supportingClaimIds: [...support], qualifyingClaimIds: [...qualifying], contradictingClaimIds: [...contradicting], rationale: 'Source-checked candidate. Independent domain review and quantitative appraisal are pending.', reviewerDecision: null, reviewedAt: null });
  const findings = input.findings.map(finding => {
    const paper = papers.find(item => item.identifiers.includes(`PMID:${finding.pmid}`));
    assert(paper, `Missing inspected publication ${finding.pmid}`);
    assert(finding.sourceCheck && validDate(finding.sourceCheck.checkedAt) && finding.sourceCheck.checkedAt <= date, `${finding.id}: a dated source check is required`);
    let sourceId = resolveEntity(finding.subject, entities), targetId = resolveEntity(finding.object, entities);
    if (finding.predicate === 'is_associated_with' && sourceId > targetId) [sourceId, targetId] = [targetId, sourceId];
    const claimId = `claim-${finding.id}`, evidenceId = `evidence-${finding.id}`;
    claims.push({ ...identity(claimId), text: finding.text, subjectId: sourceId, objectId: targetId, predicate: finding.predicate, contextId: context.id,
      evidenceItemIds: [evidenceId], verification: 'source_checked', causalInterpretation: finding.causalInterpretation, limitations: finding.limitations, sourceCheckedAt: finding.sourceCheck.checkedAt,
      reviewDisposition: { decision: 'pending_domain_review', reviewerId: null, reviewedAt: null } });
    evidenceItems.push({ ...identity(evidenceId), sourceId: `source-${paper.key}`, summary: finding.text, location: finding.quoteLocation, retrievedAt: date, studySystem: finding.studySystem, evidenceType: finding.evidenceType });
    let edge = relationships.find(item => item.sourceId === sourceId && item.targetId === targetId && item.predicate === finding.predicate);
    if (!edge) {
      const id = `relationship-${hash({ sourceId, targetId, predicate: finding.predicate }).slice(0, 20)}`;
      edge = { ...identity(id), sourceId, targetId, predicate: finding.predicate, directionality: finding.predicate === 'is_associated_with' ? 'symmetric' : 'directed',
        polarity: finding.predicate === 'is_associated_with' ? 'not_applicable' : finding.predicate === 'inhibits' ? 'negative' : 'positive', contextId: context.id, assessmentId: assessment(id).id,
        supportingClaimIds: [], qualifyingClaimIds: [], contradictingClaimIds: [] };
      relationships.push(edge);
    }
    const category = ['qualifying', 'refining', 'superseding'].includes(finding.category) ? 'qualifyingClaimIds' : finding.category === 'contradicting' ? 'contradictingClaimIds' : 'supportingClaimIds';
    edge[category].push(claimId);
    if (category === 'supportingClaimIds') for (const id of [sourceId, targetId]) entities.find(item => item.id === id).biologicalRoleClaimIds.push(claimId);
    const { pmid, ...record } = finding;
    return { ...record, contextId: context.id, paperKey: paper.key, paperDigest: hash(paper) };
  });
  for (const entity of entities) assessments.push(assessment(entity.id, entity.biologicalRoleClaimIds));
  for (const edge of relationships) assessments.push(assessment(edge.id, edge.supportingClaimIds, edge.qualifyingClaimIds, edge.contradictingClaimIds));
  const layoutId = `layout-${profile.id}-overview`, viewId = `view-${profile.id}-overview`;
  const bundle = { id: input.id, revisionId: `${input.id}-r1`, formatVersion: '0.3.0', diseaseId: profile.id, title: profile.label, status: 'candidate', illustrative: false,
    ...(input.diseaseDescription ? { diseaseDescription: input.diseaseDescription } : {}), ...(input.diseaseAliases ? { diseaseAliases: input.diseaseAliases } : {}),
    parentReleaseId: null, parentContentDigest: null, createdAt: `${date}T00:00:00.000Z`, evidenceCutoff: date, changeSetRevision: `seed-${revision}`,
    releaseNote: input.releaseNote ?? 'Initial source-checked candidate. Scope and source interpretations require independent domain review; all scores are unassessed.',
    entities, relationships, claims, evidenceItems, sources, therapies: [], contexts: [context], assessments,
    scoringModels: [{ ...identity(modelId), label: 'Unassessed baseline', calibrated: false, description: 'No numerical scores. Calibration requires independent domain reviewers and representative paired appraisals.' }],
    layouts: [{ ...identity(layoutId), positions: input.positions ?? entities.map((entity, index) => ({ entityId: entity.id, x: index % 3 * 350, y: Math.floor(index / 3) * 240 })) }],
    mapViews: [{ ...identity(viewId), label: input.viewLabel ?? 'Source-linked mechanism candidate', contextId: context.id, entityIds: entities.map(item => item.id), relationshipIds: relationships.map(item => item.id), assessmentIds: assessments.map(item => item.id), layoutId, ...(input.groups?.length ? { groups: input.groups } : {}) }],
    manifest: { algorithm: 'sha256', schemaVersion: '0.3.0', contentDigest: '' } };
  bundle.manifest.contentDigest = contentDigest(bundle);
  const extraction = { version: 1, diseaseId: profile.id, baseReleaseId: bundle.id, baseContentDigest: bundle.manifest.contentDigest, mode: 'manual', promptVersion: 'causome-extraction-v1', modelVersion: 'manual-source-check-v1', newEntities: [], findings };
  const errors = [...validateExtraction(extraction, papers, bundle), ...validatePreview(bundle).errors];
  assert(!errors.length, errors.join('\n'));
  return { bundle, papers, extraction };
}
