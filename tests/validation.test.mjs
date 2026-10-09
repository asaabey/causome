import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contentDigest, validatePreview, validatePublication } from '../scripts/validation.mjs';

const fixture = JSON.parse(readFileSync(new URL('../knowledge/diseases/sle/releases/sle-illustrative-001.json', import.meta.url), 'utf8'));
function changed(mutate) {
  const bundle = structuredClone(fixture);
  mutate(bundle);
  bundle.manifest.contentDigest = contentDigest(bundle);
  return bundle;
}
function invalid(mutate, pattern) {
  const result = validatePreview(changed(mutate));
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), pattern);
}

test('self-contained illustrative root validates for preview with null scores', () => {
  assert.deepEqual(validatePreview(fixture), { valid: true, errors: [] });
  assert.equal(fixture.entities.length, 5);
  assert.equal(fixture.relationships.length, 6);
  assert.ok(fixture.assessments.every(assessment => assessment.mechanisticWeight === null && assessment.evidenceConfidence === null));
});
test('missing IDs and source evidence fail schema validation', () => {
  invalid(bundle => { delete bundle.entities[0].id; }, /required property 'id'/);
  invalid(bundle => { bundle.claims[0].evidenceItemIds = []; }, /fewer than 1 items/);
});
test('duplicate stable IDs and unresolved nodes or sources fail integrity', () => {
  invalid(bundle => bundle.entities.push(structuredClone(bundle.entities[0])), /Duplicate ID/);
  invalid(bundle => { bundle.relationships[0].sourceId = 'missing'; }, /missing entities reference/);
  invalid(bundle => { bundle.evidenceItems[0].sourceId = 'missing'; }, /missing sources reference/);
});
test('therapy target and claim references must resolve inside the snapshot', () => {
  const therapy = {
    id: 'therapy-test', revisionId: 'therapy-test-r1', status: 'candidate',
    name: 'Test-only therapy', modality: 'test', directTargetIds: ['missing-target'], indirectTargetIds: [],
    mechanismOfAction: 'Unverified test assertion', indicationContextId: fixture.contexts[0].id,
    developmentStatus: 'unverified', trialSourceIds: [], supportingClaimIds: [fixture.claims[0].id], lastVerifiedAt: null,
  };
  invalid(bundle => { bundle.therapies.push(therapy); }, /missing entities reference missing-target/);
  invalid(bundle => { bundle.therapies.push({ ...therapy, directTargetIds: [fixture.entities[0].id], supportingClaimIds: ['missing-claim'] }); }, /missing claims reference missing-claim/);
});
test('symmetric relationships cannot carry causal polarity, arrows, or reversed endpoints', () => {
  invalid(bundle => { bundle.relationships[5].polarity = 'positive'; }, /Schema/);
  invalid(bundle => { bundle.relationships[5].directionality = 'directed'; }, /Schema/);
  invalid(bundle => { const edge = bundle.relationships[5]; [edge.sourceId, edge.targetId] = [edge.targetId, edge.sourceId]; }, /canonical ID order/);
});
test('root lineage and unassessed score invariants cannot be bypassed', () => {
  invalid(bundle => { bundle.parentReleaseId = 'earlier'; }, /Schema/);
  invalid(bundle => { bundle.parentContentDigest = 'f'.repeat(64); }, /Schema/);
  invalid(bundle => { bundle.assessments[0].mechanisticWeight = 0; }, /Schema/);
  invalid(bundle => { bundle.entities[0].evidenceConfidence = 2; }, /additional properties/);
});
test('selected context, assessment and layout must cover every displayed subject', () => {
  invalid(bundle => { bundle.mapViews[0].assessmentIds.shift(); }, /missing selected assessment/);
  invalid(bundle => { bundle.layouts[0].positions.shift(); }, /missing layout/);
  invalid(bundle => { bundle.assessments[0].contextId = 'missing'; }, /missing contexts reference/);
});
test('node inspection claims must concern the selected entity', () => {
  assert.ok(fixture.entities.every(entity => entity.biologicalRoleClaimIds.length > 0));
  invalid(bundle => { bundle.entities[0].biologicalRoleClaimIds = ['claim-demo-03']; }, /does not involve the entity/);
});
test('changing scientific or view content without updating the digest is rejected', () => {
  const bundle = structuredClone(fixture);
  bundle.entities[0].label = 'Changed';
  assert.match(validatePreview(bundle).errors.join('\n'), /digest/);
});
test('preview approval cannot publish illustrative, candidate or unverified content', async () => {
  const result = await validatePublication(fixture, { verifyAuthenticatedApproval: async () => true });
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /Illustrative/);
  assert.match(result.errors.join('\n'), /unapproved record/);
  assert.match(result.errors.join('\n'), /unverified claim/);
});
test('an author-written approved boolean cannot substitute for trusted review', async () => {
  const result = await validatePublication(fixture, { approved: true });
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /trusted authenticated approval verifier/);
});
