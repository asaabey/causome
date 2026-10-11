import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { initializeDisease } from '../scripts/curation/diseases.mjs';
import { seedDisease } from '../scripts/curation/seed.mjs';
import { updateDiseases } from '../scripts/curation/update.mjs';
import { writeJSON, readJSON } from '../scripts/curation/io.mjs';
const originalProfile = readJSON('knowledge/diseases/iga-nephropathy/disease.json');
const seedInput = readJSON('curation/examples/iga-first-map.json');
const raw = (id, extra = {}) => ({ id, source: 'MED', title: 'Synthetic maintenance report', abstractText: 'A cultured-cell finding.', ...extra });
function setup(t, ids = ['alpha']) {
  const directory = mkdtempSync(join(tmpdir(), 'causome-update-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const root = join(directory, 'diseases'), workspace = join(directory, 'workspace'), bases = [];
  for (const id of ids) {
    const profile = { ...originalProfile, id, label: id, query: `TITLE_ABS:"${id}"` };
    const { bundle } = seedDisease(profile, { ...seedInput, id: `${id}-candidate` });
    initializeDisease(root, { ...profile, previewCandidate: bundle.id });
    writeJSON(join(root, id, 'candidates', `${bundle.id}.json`), bundle);
    bases.push(bundle);
  }
  return { root, workspace, bases };
}
const provider = records => ({ version: 'synthetic-update-v1', search: async () => records });

test('maintenance plans bind selected maps without network calls or workspace writes', async t => {
  const args = setup(t);
  const result = await updateDiseases({ ...args, to: '2026-11-10', plan: true,
    provider: { version: 'fixture', search: async () => { throw Error('Network must not be called'); } } });
  assert.equal(result.results[0].status, 'planned');
  assert.equal(result.results[0].baseReleaseId, args.bases[0].id);
  assert.equal(result.results[0].firstScanFrom, args.bases[0].evidenceCutoff);
  assert.equal(existsSync(args.workspace), false);
});

test('all-disease updates export deltas and preserve map files, profiles and publication pointers', async t => {
  const args = setup(t, ['alpha', 'beta']);
  const snapshots = args.bases.map(base => readFileSync(join(args.root, base.diseaseId, 'candidates', `${base.id}.json`)));
  const result = await updateDiseases({ ...args, to: '2026-11-10', provider: provider([raw('900000001')]) });
  assert.equal(result.complete, true); assert.equal(result.results.length, 2);
  for (const [index, item] of result.results.entries()) {
    assert.equal(item.status, 'evidence_to_screen'); assert.equal(item.newRecords, 1);
    assert.equal(readJSON(item.papers)[0].pmid, '900000001');
    assert.equal(readJSON(item.packet).processingComplete, false);
    assert.equal(item.window.from, args.bases[index].evidenceCutoff);
    assert.deepEqual(readFileSync(item.basePath), snapshots[index]);
    assert.equal(readJSON(join(args.root, item.diseaseId, 'disease.json')).previewCandidate, args.bases[index].id);
    assert.equal(existsSync(join(args.root, item.diseaseId, 'current.json')), false);
  }
  assert.equal(readJSON(result.report).cycleId, result.cycleId);
});

test('later cycles use overlap and empty deltas do not assert scientific review completion', async t => {
  const args = setup(t), source = provider([raw('900000001')]);
  await updateDiseases({ ...args, to: '2026-11-10', provider: source });
  const result = await updateDiseases({ ...args, to: '2026-12-10', provider: source });
  const item = result.results[0];
  assert.equal(item.successfulCursor, '2026-11-10');
  assert.equal(item.window.from, '2026-10-11');
  assert.equal(item.status, 'no_retrieval_changes');
  assert.deepEqual(readJSON(item.papers), []);
  assert.equal(readJSON(item.packet).processingComplete, false);
});

test('failed diseases keep their cursor while other diseases complete and retry packets remain separate', async t => {
  const args = setup(t, ['alpha', 'beta']);
  await updateDiseases({ ...args, to: '2026-11-10', provider: provider([]) });
  const failing = { version: 'synthetic-update-v1', search: async query => {
    if (query.includes('"alpha"')) throw Error('Synthetic provider outage');
    return [raw('900000002')];
  } };
  const result = await updateDiseases({ ...args, to: '2026-12-10', provider: failing });
  assert.equal(result.complete, false);
  assert.equal(result.results.find(item => item.diseaseId === 'alpha').status, 'incomplete');
  assert.equal(result.results.find(item => item.diseaseId === 'beta').status, 'evidence_to_screen');
  assert.equal(readJSON(join(args.workspace, 'alpha', 'state.json')).cursor, '2026-11-10');
  assert.equal(readJSON(join(args.workspace, 'beta', 'state.json')).cursor, '2026-12-10');
  const retry = await updateDiseases({ ...args, to: '2026-12-10', provider: provider([]) });
  assert.equal(retry.complete, true); assert.notEqual(retry.cycleId, result.cycleId);
  assert(existsSync(result.report)); assert(existsSync(retry.report));
});

test('initial refreshes of already-curated sources are separate; later changes identify affected claims', async t => {
  const args = setup(t), publication = seedInput.publications[0];
  let result = await updateDiseases({ ...args, to: '2026-11-10', provider: provider([publication]) });
  assert.equal(result.results[0].baselineRefreshes, 1);
  assert.equal(result.results[0].newRecords, 0);
  result = await updateDiseases({ ...args, to: '2026-12-10', provider: provider([{ ...publication, abstractText: `${publication.abstractText} A new correction.`, isRetracted: 'Y' }]) });
  const item = result.results[0];
  assert.equal(item.updatedRecords, 1);
  assert(item.affectedClaimIds.length > 0);
  assert(readJSON(item.papers)[0].flags.includes('retracted'));
});

test('unknown diseases and dates are rejected; new diseases are reported as requiring a first map', async t => {
  const args = setup(t);
  await assert.rejects(updateDiseases({ ...args, to: '2026-02-30', plan: true }), /cutoff/);
  await assert.rejects(updateDiseases({ ...args, disease: 'missing', plan: true }), /Unknown/);
  initializeDisease(args.root, { ...originalProfile, id: 'new-disease', label: 'New disease', previewCandidate: null });
  const result = await updateDiseases({ ...args, to: '2026-11-10', plan: true });
  assert.equal(result.results.find(item => item.diseaseId === 'new-disease').status, 'needs_initial_map');
  const selected = await updateDiseases({ ...args, disease: 'alpha', to: '2026-11-10', plan: true });
  assert.equal(selected.results.length, 1);
});
