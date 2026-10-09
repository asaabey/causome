import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contentDigest, validatePreview, validatePublication } from '../scripts/validation.mjs';
import { feedbackEdgeIds } from '../web/src/lib/graph/geometry.ts';

const candidate = JSON.parse(readFileSync(new URL('../knowledge/diseases/sle/candidates/sle-curated-candidate-001.json', import.meta.url)));
const mutate = fn => { const b = structuredClone(candidate); fn(b); b.manifest.contentDigest = contentDigest(b); return b; };
function rejects(fn, expected) { const result = validatePreview(mutate(fn)); assert.equal(result.valid, false); assert.match(result.errors.join('\n'), expected); }

test('scientific candidate has a bounded circuit, renal branch, visible BAFF and complete provenance', () => {
  assert.deepEqual(validatePreview(candidate), { valid: true, errors: [] });
  assert.equal(candidate.illustrative, false);
  assert.ok(candidate.entities.length >= 15 && candidate.entities.length <= 25);
  assert.ok(candidate.relationships.length >= 20 && candidate.relationships.length <= 40);
  assert.equal(candidate.therapies.length, 3);
  assert.ok(candidate.entities.some(e => e.label.includes('BLyS')));
  assert.ok(candidate.relationships.some(e => e.targetId === 'entity-kidney'));
  assert.ok(feedbackEdgeIds(candidate.relationships).size > 0);
  assert.ok(candidate.claims.every(c => c.verification === 'source_checked' && c.reviewDisposition.decision === 'pending_domain_review'));
  assert.ok(candidate.assessments.every(a => a.mechanisticWeight === null && a.evidenceConfidence === null));
  assert.ok(candidate.relationships.some(e => e.qualifyingClaimIds.length));
  assert.ok(candidate.therapies.some(t => t.contradictingClaimIds.length));
});
test('scientific candidates require study system, access scope and pending review disposition', () => {
  rejects(b => { delete b.evidenceItems[0].studySystem; }, /studySystem/);
  rejects(b => { delete b.sources[0].accessScope; }, /accessScope/);
  rejects(b => { delete b.claims[0].reviewDisposition; }, /reviewDisposition/);
  rejects(b => { b.entities[0].biologicalRoleClaimIds = []; }, /role claim/);
});
test('source checks cannot become human approval or reuse fixture placeholders', () => {
  rejects(b => { b.claims[0].verification = 'reviewed'; }, /pending review|domain-review disposition/);
  rejects(b => { b.claims[0].reviewDisposition.reviewerId = 'invented'; }, /pending review cannot/);
  rejects(b => { b.sources[0].kind = 'fixture_documentation'; }, /fixture documentation/);
  rejects(b => { b.sources[0].url = 'not a URL'; }, /invalid scientific source URL/);
  rejects(b => { b.evidenceItems[0].retrievedAt = '2099-01-01'; }, /retrieval exceeds/);
});
test('therapy verification, indications and target-specific claims cannot be dropped or swapped', () => {
  rejects(b => { delete b.therapies[0].indication; }, /indication/);
  rejects(b => { b.therapies[0].verificationSourceIds = ['source-bliss52']; }, /regulatory status evidence/);
  rejects(b => { b.therapies[0].supportingClaimIds = ['claim-tlr7-bcells']; }, /does not concern the therapy/);
  rejects(b => { b.therapies[0].directTargetIds = []; b.therapies[0].indirectTargetIds = []; }, /linked target/);
  rejects(b => { b.therapies[0].lastVerifiedAt = null; }, /Schema/);
  rejects(b => { b.relationships[0].qualifyingClaimIds = ['claim-tlr9-context']; }, /does not match the relationship/);
});
test('scientific candidate cannot publish even with a permissive approval callback', async () => {
  const result = await validatePublication(candidate, { verifyAuthenticatedApproval: async () => true });
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /pending domain review/);
  assert.match(result.errors.join('\n'), /unverified claim/);
});
