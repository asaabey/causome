import { assert, hash, validDate } from './io.mjs';

export const PROVIDER_VERSION = 'europe-pmc-core-v1';
const plainText = value => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
export function normalizeDOI(value) {
  return String(value ?? '').trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '').toLowerCase();
}
export function normalizePaper(raw) {
  assert(raw && typeof raw.id === 'string' && typeof raw.source === 'string' && raw.title, 'Incomplete literature result');
  const doi = normalizeDOI(raw.doi);
  const pmid = raw.pmid ?? (raw.source === 'MED' ? raw.id : null);
  const identifiers = [...new Set([`${raw.source}:${raw.id}`, ...(pmid ? [`PMID:${pmid}`] : []), ...(doi ? [`DOI:${doi}`] : []), ...(raw.pmcid ? [`PMCID:${raw.pmcid}`] : [])])].sort();
  const types = raw.pubTypeList?.pubType ?? [];
  assert(Array.isArray(types), 'Invalid publication types');
  const notices = raw.commentCorrectionList?.commentCorrection ?? [];
  assert(Array.isArray(notices), 'Invalid correction links');
  const flags = [];
  if (raw.isRetracted === 'Y' || types.some(type => /retracted publication/i.test(type))) flags.push('retracted');
  if (types.some(type => /retraction of publication/i.test(type))) flags.push('retraction-notice');
  if (types.some(type => /erratum|correction/i.test(type))) flags.push('correction');
  if (/expression of concern/i.test(raw.title) || types.some(type => /expression of concern/i.test(type))) flags.push('expression-of-concern');
  if ((types.some(type => /review|meta[- ]?analysis|editorial|comment/i.test(type)) || /systematic review|meta[- ]analysis/i.test(raw.title))) flags.push('secondary-or-commentary');
  if (raw.source === 'PPR' || types.some(type => /preprint/i.test(type))) flags.push('preprint');
  return {
    key: doi ? `doi-${hash(doi).slice(0, 20)}` : `${raw.source.toLowerCase()}-${raw.id.toLowerCase()}`,
    identifiers, title: plainText(raw.title), authors: plainText(raw.authorString),
    publishedAt: raw.firstPublicationDate ?? null, journal: raw.journalInfo?.journal?.title ?? raw.journalTitle ?? null,
    abstract: plainText(raw.abstractText),
    url: pmid ? `https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(pmid)}/` : `https://europepmc.org/article/${encodeURIComponent(raw.source)}/${encodeURIComponent(raw.id)}`,
    doi: doi || null, pmid, pmcid: raw.pmcid ?? null,
    accessScope: raw.inspectedScope ?? (raw.abstractText ? 'Abstract and bibliographic metadata' : 'Bibliographic metadata only'),
    openAccess: raw.isOpenAccess === 'Y', license: raw.license ?? null,
    flags: [...new Set(flags)].sort(),
    relatedRecords: notices.map(item => ({ type: item.type ?? item.commentCorrectionType ?? 'unspecified', id: item.id ?? null, source: item.source ?? 'MED' })),
    providerVersion: PROVIDER_VERSION,
  };
}

export function scanQueries(profile, { from, to, reconcile = false, known = [] }) {
  assert(validDate(from) && validDate(to) && from <= to, 'Invalid search window');
  const dated = `(${profile.query})${reconcile ? '' : ` AND (CREATION_DATE:[${from} TO ${to}] OR UPDATE_DATE:[${from} TO ${to}])`}`;
  const queries = [
    { kind: 'literature', query: dated },
    { kind: 'notices', query: `(${profile.query}) AND (PUB_TYPE:"Retraction of Publication" OR PUB_TYPE:"Retracted Publication" OR PUB_TYPE:"Published Erratum" OR TITLE:"expression of concern")${reconcile ? '' : ` AND UPDATE_DATE:[${from} TO ${to}]`}` },
  ];
  // Refresh known records independently of disease words, so a notice/update
  // can be detected even when its title omits the disease's name.
  const pmids = [...new Set(known.flatMap(item => item.identifiers.filter(id => /^PMID:\d+$/.test(id))))];
  for (let offset = 0; offset < pmids.length; offset += 100) queries.push({ kind: 'known-record-refresh', query: `SRC:MED AND (${pmids.slice(offset, offset + 100).map(id => `EXT_ID:${id.slice(5)}`).join(' OR ')})` });
  const dois = [...new Set(known.flatMap(item => item.identifiers.filter(id => /^DOI:10\.\d{4,9}\/\S+$/.test(id))))];
  const quote = text => text.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
  for (let offset = 0; offset < dois.length; offset += 50) queries.push({ kind: 'known-doi-refresh', query: `(${dois.slice(offset, offset + 50).map(id => `DOI:"${quote(id.slice(4))}"`).join(' OR ')})` });
  return queries;
}

export function europePMC({ fetchImpl = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), maxRecords = 5000, retries = 3 } = {}) {
  return {
    version: PROVIDER_VERSION,
    async search(query) {
      const results = [], cursors = new Set();
      let cursor = '*';
      for (let page = 0; page < 100; page++) {
        assert(!cursors.has(cursor), 'Literature cursor did not advance');
        cursors.add(cursor);
        const url = new URL('https://www.ebi.ac.uk/europepmc/webservices/rest/search');
        url.search = new URLSearchParams({ query, format: 'json', resultType: 'core', pageSize: '100', cursorMark: cursor }).toString();
        let response, error;
        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            response = await fetchImpl(url, { signal: AbortSignal.timeout(30_000), redirect: 'error', headers: { Accept: 'application/json' } });
            if (response.ok) break;
            if (![408, 429, 500, 502, 503, 504].includes(response.status)) throw Object.assign(new Error(`Europe PMC HTTP ${response.status}`), { permanent: true });
            error = new Error(`Europe PMC HTTP ${response.status}`);
          } catch (caught) { error = caught; if (caught.permanent) throw caught; }
          if (attempt === retries) throw error;
          const delay = Number(response?.headers?.get?.('retry-after')) * 1000;
          await sleep(Number.isFinite(delay) && delay > 0 ? Math.min(delay, 30_000) : 500 * 2 ** attempt);
        }
        const payload = await response.json();
        assert(Number.isSafeInteger(payload.hitCount) && Array.isArray(payload.resultList?.result), 'Invalid Europe PMC response');
        assert(payload.hitCount <= maxRecords, `Search exceeds ${maxRecords} records; narrow the query/window. Cursor was not advanced.`);
        const batch = payload.resultList.result;
        results.push(...batch);
        assert(results.length <= maxRecords, 'Literature result budget exceeded');
        if (results.length >= payload.hitCount) return results;
        assert(batch.length > 0, 'Incomplete literature response: empty page before hit count');
        assert(typeof payload.nextCursorMark === 'string' && payload.nextCursorMark !== cursor, 'Incomplete literature response: missing next cursor');
        cursor = payload.nextCursorMark;
      }
      throw new Error('Literature page budget exceeded; refusing an incomplete scan');
    },
  };
}
