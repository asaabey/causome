import test from 'node:test';
import assert from 'node:assert/strict';
import { checkHealth } from '../scripts/health-check.mjs';

const expected = { releaseId: 'sle-root', contentDigest: 'a'.repeat(64), entityCount: 1, relationshipCount: 1 };
const pages = { 'release.json': JSON.stringify({ ...expected, mode: 'publication' }), 'diseases/sle/': `<h1>SLE</h1><section id="mechanism-outline"><article id="entity-a"></article><article id="relationship-a"></article></section>${expected.releaseId} ${expected.contentDigest}`, '': '<h1>Home</h1>Main navigation', 'methodology/': '<h1>Methodology</h1>Main navigation', 'sources/': '<h1>Sources</h1>Main navigation' };
const fetchFor = values => async url => { const path = new URL(url).pathname.replace('/atlas/', ''); return { ok: Object.hasOwn(values, path), status: 404, text: async () => values[path] }; };
test('health check verifies subpath routes, release identity and complete static outline', async () => {
  assert.equal((await checkHealth('https://example.test/atlas/', expected, { fetchImpl: fetchFor(pages) })).releaseId, expected.releaseId);
});
test('preview, wrong release, missing fallback and failed routes cannot pass public health checks', async () => {
  for (const changed of [
    { 'release.json': JSON.stringify({ ...expected, mode: 'preview' }) },
    { 'release.json': JSON.stringify({ ...expected, mode: 'publication', contentDigest: 'b'.repeat(64) }) },
    { 'diseases/sle/': '<h1>Empty</h1>' }, { 'sources/': 'Empty' },
  ]) await assert.rejects(checkHealth('https://example.test/atlas/', expected, { fetchImpl: fetchFor({ ...pages, ...changed }) }), /differs|missing|Missing/);
  const missing = { ...pages }; delete missing['methodology/'];
  await assert.rejects(checkHealth('https://example.test/atlas/', expected, { fetchImpl: fetchFor(missing) }), /Unhealthy/);
});
