import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function checkHealth(baseURL, expected, { fetchImpl = fetch, publication = true } = {}) {
  const base = new URL(baseURL.endsWith('/') ? baseURL : `${baseURL}/`);
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Expected an HTTP(S) site URL');
  const get = async path => {
    const response = await fetchImpl(new URL(path, base), { signal: AbortSignal.timeout(15_000), cache: 'no-store' });
    if (!response.ok) throw new Error(`Unhealthy route ${path}: HTTP ${response.status}`);
    return response.text();
  };
  const metadata = JSON.parse(await get('release.json'));
  if ((publication && metadata.mode !== 'publication') || metadata.releaseId !== expected.releaseId || metadata.contentDigest !== expected.contentDigest) throw new Error('Deployed release identity or publication mode differs from the launch artifact');
  const diseaseId = expected.diseaseId ?? 'sle';
  if (!/^[a-z0-9][a-z0-9-]*$/.test(diseaseId)) throw new Error('Invalid disease identity');
  const html = await get(`diseases/${diseaseId}/`);
  if (!html.includes('id="mechanism-outline"') || !html.includes(expected.contentDigest) || !html.includes(expected.releaseId)) throw new Error('Disease page is missing release identity or no-JavaScript outline');
  for (const [prefix, count] of [['entity', expected.entityCount], ['relationship', expected.relationshipCount]]) {
    if (count !== undefined && [...html.matchAll(new RegExp(`id="${prefix}-`, 'g'))].length !== count) throw new Error(`Incomplete static ${prefix} outline`);
  }
  if (expected.parentReleaseId) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(expected.parentReleaseId)) throw new Error('Invalid historical release identity');
    const historical = await get(`diseases/${diseaseId}/releases/${expected.parentReleaseId}/`);
    if (!historical.includes('id="mechanism-outline"') || !historical.includes(expected.parentReleaseId)) throw new Error('Historical release route is unhealthy');
  }
  for (const route of ['', 'methodology/', 'sources/']) {
    const page = await get(route);
    if (!page.includes('Main navigation') || !page.includes('<h1')) throw new Error(`Missing navigation or content on ${route || '/'}`);
  }
  return metadata;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [url, expectedPath = 'web/dist/release.json', mode] = process.argv.slice(2);
    if (!url) throw new Error('Usage: pnpm health <site-base-URL> [expected-release.json] [--preview]');
    const expected = JSON.parse(readFileSync(expectedPath, 'utf8'));
    const metadata = await checkHealth(url, expected, { publication: mode !== '--preview' });
    console.log(`Healthy ${metadata.mode}: ${metadata.releaseId} (${metadata.contentDigest})`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
