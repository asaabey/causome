import json,pathlib,hashlib,shutil,collections
w=pathlib.Path('curation/workspace/sjogren-disease');dest=pathlib.Path('curation/examples/sjogren-disease/2026-10-17');(w/'handoff').mkdir(exist_ok=True);dest.mkdir(parents=True,exist_ok=True)
final='knowledge/diseases/sjogren-disease/candidates/sjogren-disease-summary-candidate-b62d8ddf75f2.json';b=json.load(open(final));seed=json.load(open(w/'first-map.json'));used={i for s in b['sources'] for i in s.get('identifiers',[]) if i.startswith('PMID:')}
papers=json.load(open(w/'scans/scan-cd6dc1b4b9485d1e527918dc/papers.json'))
dispositions=[]
for p in papers:
 selected=any(i in used for i in p['identifiers']);dispositions.append({'key':p['key'],'identifiers':p['identifiers'],'sourceContentSha256':hashlib.sha256(json.dumps(p,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest(),'digestConvention':'SHA256 of Python sort_keys compact UTF-8 JSON; distinct from CLI canonical hash','decision':'curated_bounded_findings' if selected else 'unprocessed','reason':'Selected abstract passages inspected and source-linked in final candidate; not full-paper certification' if selected else 'Retrieved only; no scientific screening or notice adjudication claimed','flags':p['flags'],'cycleDate':'2026-10-17'})
json.dump(dispositions,open(w/'handoff/paper-dispositions.json','w'),indent=2)
# Preserve exact provider queries without duplicating the large raw response cache.
coverage=[];manifest=[]
for scan in (w/'scans').iterdir():
 r=json.load(open(scan/'report.json'));resp=json.load(open(scan/'responses.json'));coverage.append({'runId':r['runId'],'window':r['window'],'counts':{k:r[k] for k in ['retrievedCount','uniqueCount','flaggedRecords']},'changes':len(r['changes']),'queries':[{'kind':x['kind'],'query':x['query']} for x in resp['responses']]})
 for f in scan.iterdir():
  manifest.append({'path':str(f),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'preservation':'reports durable; large papers/responses remain workspace-only'})
json.dump(coverage,open(w/'handoff/retrieval-coverage.json','w'),indent=2,ensure_ascii=False)
json.dump(manifest,open(w/'handoff/workspace-cache-manifest.json','w'),indent=2)
flags=collections.Counter(f for p in papers for f in p['flags'])
countselected=sum(x['decision']=='curated_bounded_findings' for x in dispositions)
sourcechecks={'date':'2026-10-17','checkedBy':'Codex agent, not independent/human reviewer','access':'Primary abstracts and Europe PMC bibliographic/publication-type/correction metadata. PMC1526588 Methods and Results additionally inspected. PMC11186761 XML retrieved but not full-text scientifically screened; trial claims use its inspected abstract.','failedAccess':[{'pmcid':x,'result':'Europe PMC fullTextXML HTTP 500; abstract fallback retained'} for x in ['PMC1413808','PMC8714705']],'selectedPmids':sorted(used),'selectedSourceFlags':{s['id']:s['flags'] for s in b['sources']},'limitations':['No selected record carried a notice flag in the inspected metadata; this is not an exhaustive publisher/Crossmark audit.','Scan flags on unprocessed papers remain unresolved and are preserved in the disposition ledger.'],'targetedQueries':['DOI:10.1186/ar1912','DOI:10.1073/pnas.0510837103','DOI:10.1007/s10238-020-00637-0','DOI:10.1002/art.40589','DOI:10.1002/art.40093','DOI:10.1016/j.ard.2025.08.014','DOI:10.1016/j.bbadis.2021.166302','TITLE:"Cellular basis of ectopic germinal center formation"','TITLE:"Induction of interferon-alpha by immune complexes"','TITLE:"ianalumab" AND FIRST_PDATE:[2022-01-01 TO 2026-10-17]','TITLE:"dazodalibep" AND FIRST_PDATE:[2023-01-01 TO 2026-10-17]','TITLE:"nipocalimab" AND TITLE:"Sj"','TITLE:"telitacicept" AND TITLE:"Sj"','EXT_ID:11232635','TITLE:"Subcellular distribution of aquaporin 5"','TITLE:"BAFF" AND TITLE:"transgenic" AND TITLE:"Sj"','TITLE:"nipocalimab" AND Sjogren','TITLE:"telitacicept" AND Sjogren','TITLE:"ianalumab" AND TITLE:"randomised" AND Sjogren','AUTH_LAST:Bave AND Sjogren AND interferon (no records)','DOI:10.1172/JCI14121','DOI:10.1002/art.20998']}
json.dump(sourcechecks,open(w/'research/source-check-provenance.json','w'),ensure_ascii=False,indent=2)
packet='summary-reviews/94a1db63c09b30d0cf5158dc8ca1b47b34e9efc07d0afa893c656eb9496c6494'
report=f'''# Sjögren disease — local curation handoff, 2026-10-17

Local candidate selected; independent scientific review remains pending. No public pointer, reviewer policy, schedule or commit was changed. Pre-existing edits to CURATION.md, curation/commands/curate.md and disease-backlog.md were preserved; only the matching backlog status was amended.

## Scope and identity

Label: Sjögren disease. Slug: sjogren-disease. Aliases: {', '.join(seed['diseaseAliases'])}. Primary disease, salivary epithelial activation, type I/II interferon, BAFF/B cells, anti-Ro/SSA and anti-La/SSB, ectopic germinal centres and glandular dysfunction. Human cultures/observations and mouse findings remain explicit. Dry eyes/mouth are present, with direct lacrimal mechanisms incompletely curated. Historical GC-biopsy cohort primary-only composition is unresolved. Dazodalibep trial evidence includes associated RA/SLE and is identified as mixed-population evidence, not a primary-only estimate. Symptomatic replacement treatments, mimics, comprehensive extraglandular/lymphoma mechanisms and diagnostic performance are excluded. Disease-modifying trial symptom endpoints are included with limitations. Evidence cutoff: **2026-10-17**.

Final graph: `{final}`

Candidate ID: `{b['id']}`. Manifest SHA256: `{b['manifest']['contentDigest']}`. Summary revision: `{b['scientificSummary']['revisionId']}`. Profile: `knowledge/diseases/sjogren-disease/disease.json`; previewCandidate names this exact snapshot. Route: `/diseases/sjogren-disease/`. Browser inspection server: `http://127.0.0.1:4327/diseases/sjogren-disease/` (4322–4326 were already occupied and preserved).

## Retrieval and source inspection

First scan `scan-89cc09c8609020610e684814`, 2000-01-01 through 2026-10-17: 663 records/unique records, 663 changes, 153 flagged. Foundational sources were absent, so aliases were expanded to explicit apostrophe forms and a broad reconciliation scan was run.

Second scan `scan-cd6dc1b4b9485d1e527918dc`: requested same date window with `--reconcile`; the broad literature query is intentionally undated. It retrieved 5007 rows across literature/notices, deduplicated to 3792 records, with 3129 changes and 840 flagged records. This is not a truncated >5000 single search: each constituent provider search passed the CLI's limit. Exact queries/windows and source snapshot/report locations are retained in `handoff/retrieval-coverage.json`; original outputs are `scans/<run-id>/report.json`, `report.md`, `papers.json`, `responses.json` under the workspace.

Of the broad scan records, {countselected} match curated source PMIDs; {len(papers)-countselected} remain **unprocessed**, not scientifically screened. Targeted Europe PMC DOI/title/PMID queries supplemented retrieval. Neither retrieval nor selecting sources establishes complete coverage. Flags by type: {dict(flags)}. Keep the full unprocessed/flagged queue in `handoff/paper-dispositions.json`; its explicitly labelled Python digest convention differs from CLI canonical hashing. Large raw provider caches remain workspace-only, indexed with byte sizes and SHA256 in `workspace-cache-manifest.json`.

Consensus discovery searches and fetched selected records are in `research/consensus-discovery.json` and `consensus-groom-fetch.json`. Exact primary abstracts, metadata and inspected quotations are in `research/primary-records.json`, `additional-records.json`, `first-map.json` and `research/therapy-source-checks.json`. Source checks were performed by the Codex agent on 2026-10-17; no human or independent check is implied. Abstracts dominate; PMC1526588 Methods/Results were additionally inspected. PMC1413808 and PMC8714705 full-text fetches returned HTTP 500. PMC11186761 XML was retrieved but the trial extraction used its inspected abstract. No selected source had a notice flag in inspected metadata; no exhaustive publisher/Crossmark audit was performed. See `research/source-check-provenance.json`.

## Graph, evidence and therapies

17 entities, 21 relationships, 31 claims/evidence items, 15 sources, 3 therapies, 2 contexts and 38 provisional assessments. All 17 Key players entities, including outcome chips, occur in the default consolidated view. The disease-activity outcome is present without inventing a biological arrow to it. Shared SLE identities include entity-ifn, entity-baff, entity-pdc, entity-b_cells, entity-debris and entity-complexes; disease-specific claims were authored separately. No unsupported plasmablast role was imported.

Initial seed: 25 findings (22 supporting, 2 qualifying, 1 contradicting). Full-candidate therapy proposal adds 8 claims. Final scientific correction removes the null-only BAFF/GC edge and its two standalone claims; their exact passages remain archived and the null/opposite findings are retained in claim-sjd-baff-ssa limitations. They are no longer counted as positive graph support. Qualification-only edges cannot be represented by the current schema (support is required), which is why the edge was removed rather than assigned a positive arrow. Therapy records explicitly qualify the ianalumab 300 mg null-crossing comparison and rituximab's negative primary endpoint; dazodalibep's ESSPRI composite is not standalone dryness efficacy. US Sjögren status is experimental, verified from dated sponsor development sources and primary trial records; no approved indication asserted. Phase III sponsor updates are retained as development status, not full peer-reviewed efficacy appraisal. Direct molecular targets BAFF-R/CD40L/CD20 are not separate biological nodes: mapped B-cell targets are explicitly indirect. Nipocalimab and telitacicept remain deferred, despite discovery of a telitacicept primary trial and a current nipocalimab sponsor update; global status and primary evidence are not fully appraised. Optional MALT-lymphoma branch was not added without direct inspected human evidence.

Authored inputs: `first-map.json`, `author.py`, `therapy-candidate.json`, `therapies.mjs`, `summary-input.json`. Normalized sources/extraction: `imports/seed-seed-febd004e3f59/`. Full proposal/diff: `proposals/proposal-d94346f89c96a8fe3f1ee32a/`. All automatic appraisal input/result directories are preserved under `appraisals/`. CLI automatic policy: `causome-auto-appraisal-v1`; no model adapter was configured or invoked. Manual agent source interpretation is not a held-out evaluation or calibration result.

## Scientific summary and review status

{b['scientificSummary']['paragraphs'][0]['text']}

{b['scientificSummary']['paragraphs'][1]['text']}

Exact portable packet: `{packet}/review.md`, `packet.json`, `feedback-template.json`. Packet digest: `94a1db63c09b30d0cf5158dc8ca1b47b34e9efc07d0afa893c656eb9496c6494`. Author-bound summary inputs are also preserved under `summaries/`.

Consensus current-literature search against the final explanation ran on 2026-10-17 with a 2024–2026 filter; raw query/results and fetched 2025 follicular/extrafollicular paper record are in `research/summary-current-literature-search.json`. It surfaced LAMP3/TLR7, ferroptosis, extrafollicular and other mechanisms for later screening. The fetched extrafollicular record did not include a primary abstract: **deferred, no claim added**. A new search against the corrected final packet is preserved in research/corrected-summary-search.json; the earlier search remains historical. Available Consensus tools returned paper records rather than an independent review report. Therefore the section 7 independent verdict is **not run / pending scientific review**; no consistency verdict, original external review or feedback receipt was fabricated. Source entailment, study independence, fuller lacrimal/T-cell/stromal coverage, full trial appraisals and domain review/calibration remain open.

## Actual checks and corrections

All checks dated 2026-10-17.

- `node scripts/validate-release.mjs <final path>`: exit 0, 17 entities/21 relationships.
- `pnpm validate`: exit 0, 104 candidates and registry profiles validated at this run.
- `pnpm curate preview --disease sjogren-disease --candidate {b['id']}`: exit 0; exact local selection, public pointer unchanged.
- `pnpm check`: exit 0; Astro checked 42 files with 0 errors/warnings/hints. Log: `check.log`.
- `pnpm build`: exit 0; 148 pages built. Log: `build.log`.
- `node --test tests/short-labels.test.mjs`: exit 0, 2 tests passed. Log: `short-labels-test.log`.
- `node .../browser-check.mjs`: exit 0. Desktop 1440x1000 and mobile 390x844: 17/17 graph nodes and Key players, complete summary match, portable review download bound to final ID, therapy search/inspector, no horizontal overflow or page errors. `browser-results.json`, `desktop.png`, `mobile.png`; desktop screenshot visually inspected. Existing UI unchanged; full benchmark suite not run.
- Corrected final science: BAFF/GC null comparison had been counted as positive association evidence. A new immutable proposal (proposals/proposal-415fc8b8505807d9ac7ef696) removed that edge, retained null findings in claim limitations/audit input, regenerated appraisals and reauthored/rechecked the summary. Qualification-only draft edge and orphan-claim validation failures were resolved by this supported representation. Earlier snapshots remain historical. Corrected authoring failures: an incorrect draft PMID lookup caused a KeyError before any seed was written; corrected to the actually retrieved PMID 11781351. Initial draft therapy validation exposed duplicate source ID, missing outcome assessment and stale appraisal categories; fixed using the preserved raw seed base, deduplicated trial source/new revision and an explicit outcome assessment before successful proposal. A failed scratch Python export of Consensus output was replaced with direct file patching; archived outputs are valid JSON.

Scientific independence is unresolved. Automatic scores are provisional and uncalibrated. Literature processing is incomplete. This is a reviewable local candidate, not an approved scientific release.
'''
(w/'handoff/report.md').write_text(report)
# Preserve all authored/audit inputs, excluding large raw scan caches and duplicate image data.
for name in ['first-map.json','author.py','therapy-candidate.json','therapies.mjs','summary-input.json','browser-check.mjs','browser-results.json','check.log','build.log','short-labels-test.log','handoff-create.py','correct-null.mjs','null-qualified-candidate.json','corrected-summary-input.json','final-validation.log']:
 shutil.copy2(w/name,dest/name)
for name in ['research','imports','proposals','appraisals','summaries','summary-reviews','handoff']:
 shutil.copytree(w/name,dest/name,dirs_exist_ok=True)
for scan in (w/'scans').iterdir():
 target=dest/'scan-reports'/scan.name;target.mkdir(parents=True,exist_ok=True)
 for name in ['report.json','report.md']:shutil.copy2(scan/name,target/name)
# Small screenshots retain the actual browser inspection artifact.
for name in ['desktop.png','mobile.png']:shutil.copy2(w/name,dest/name)
print('Durable handoff:',dest/'handoff/report.md','curated scan records',countselected,'unprocessed',len(papers)-countselected)
