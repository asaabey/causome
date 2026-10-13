// Builds the manual-import publication file from Europe PMC core records.
// The JCI research letter has no abstract; its inspected PMC full-text body
// (open access, CC BY) is stored as the abstract with an explicit scope note.
import { readFileSync, writeFileSync } from 'node:fs';
const [jciXml, out] = process.argv.slice(2);
const get = async pmid => { const u = new URL('https://www.ebi.ac.uk/europepmc/webservices/rest/search'); u.search = new URLSearchParams({ query: `EXT_ID:${pmid} AND SRC:MED`, resultType: 'core', format: 'json' });
  const r = (await (await fetch(u)).json()).resultList.result[0]; if (r?.pmid !== pmid) throw Error(pmid); return r; };
const scope = 'Europe PMC abstract and bibliographic metadata inspected by an agent (Claude Opus 5.5) on 2026-10-12 (UTC); no full-text methods inspection';
const records = [];
for (const pmid of ['38804512', '40147632', '42015820', '17429054']) records.push({ ...(await get(pmid)), inspectedScope: scope });
const jci = await get('39820038');
const body = readFileSync(jciXml, 'utf8').replace(/<ref-list[\s\S]*?<\/ref-list>/, '').match(/<body>([\s\S]*?)<\/body>/)[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
records.push({ ...jci, abstractText: body, inspectedScope: 'Research letter without abstract: full PMC body text (PMC11870725, CC BY 4.0) inspected by an agent (Claude Opus 5.5) on 2026-10-12 (UTC) and stored in the abstract field; supplementary figures not inspected' });
writeFileSync(out, JSON.stringify({ version: 1, sourceKind: 'manual-import', checkedAt: '2026-10-12', records }, null, 2) + '\n');
console.log(records.map(r => `${r.pmid} ${r.title}`).join('\n'));
