import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { listDiseases, loadShortLabels, validateShortLabels } from '../scripts/curation/diseases.mjs';

const root = 'knowledge/diseases';

test('short labels name entities in each disease preview, so re-curation cannot leave them stale', () => {
  for (const profile of listDiseases(root)) {
    const labels = loadShortLabels(root, profile.id);
    if (!Object.keys(labels).length) continue;
    assert.ok(profile.previewCandidate, `${profile.id}: short labels without a preview candidate`);
    const candidate = JSON.parse(readFileSync(join(root, profile.id, 'candidates', `${profile.previewCandidate}.json`), 'utf8'));
    const ids = new Set(candidate.entities.map(entity => entity.id));
    for (const id of Object.keys(labels)) assert.ok(ids.has(id), `${profile.id}: short label for unknown entity ${id}`);
  }
});

test('short-label files reject malformed, untrimmed and overlong labels', () => {
  assert.deepEqual(validateShortLabels({ version: 1, labels: { 'entity-nets': 'NETs' } }), { 'entity-nets': 'NETs' });
  for (const file of [{ version: 2, labels: {} }, { version: 1, labels: [] }, { version: 1, labels: { 'entity-x': ' padded' } },
    { version: 1, labels: { 'entity-x': '' } }, { version: 1, labels: { 'entity-x': 'x'.repeat(25) } }, { version: 1, labels: { '../x': 'X' } }])
    assert.throws(() => validateShortLabels(file));
});
