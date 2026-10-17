import pathlib,json,shutil,hashlib
D=pathlib.Path('curation/workspace/diffuse-systemic-sclerosis');dest=pathlib.Path('curation/examples/diffuse-systemic-sclerosis/2026-10-17');dest.mkdir(parents=True,exist_ok=True)
bpath=pathlib.Path('knowledge/diseases/diffuse-systemic-sclerosis/candidates/diffuse-systemic-sclerosis-summary-candidate-f7786448c91d.json');b=json.loads(bpath.read_text());profile=json.loads(pathlib.Path('knowledge/diseases/diffuse-systemic-sclerosis/disease.json').read_text());packet='summary-reviews/c91ddcc48d5161de1302c9304e3ab57cd73ff71c7886e5807e92dd5ebc258d87'
# Durable authored inputs, normalized source/extraction files, proposals, appraisals, packets and exact inspected text.
for f in D.iterdir():
 if f.is_file() and f.suffix in ['.json','.py','.mjs','.log','.png','.txt']:shutil.copy2(f,dest/f.name)
for name in ['imports','proposals','appraisals','summaries','summary-reviews']:
 if (D/name).exists():shutil.copytree(D/name,dest/name,dirs_exist_ok=True)
(dest/'research').mkdir(exist_ok=True);raw=[]
for f in (D/'research').iterdir():
 if not f.is_file():continue
 if f.suffix in ['.json','.txt','.log']:shutil.copy2(f,dest/'research'/f.name)
 else:raw.append({'path':str(f),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'status':'workspace-only raw cache; durable metadata, selected extracted source text and normalized imports retained'})
(dest/'raw-cache-manifest.json').write_text(json.dumps(raw,indent=2)+'\n')
scans=dest/'scan-reports';scans.mkdir(exist_ok=True)
for f in (D/'scans/scan-07c638fdb847dc96404f3f83').iterdir():
 if f.name!='papers.json' and f.is_file() and f.suffix in ['.json','.md']:shutil.copy2(f,scans/f.name)
# Full retrieval cache deliberately remains local; exact queue IDs/flags and dispositions are durable.
results=json.loads((D/'browser-results.json').read_text())
research_note={'checkedAt':'2026-10-17','candidateId':b['id'],'candidateDigest':b['manifest']['contentDigest'],'packet':packet,'tool':'Consensus MCP search + fetch','queries':'Exact discovery and final targeted queries are retained in research/consensus-*.json. An overlong summary-review query returned no papers and was replaced by three targeted queries.','outcome':'Literature discovery performed; independent overall review verdict NOT RUN / pending scientific review. Available search/fetch tools returned papers and records, not an independent assessment of the packet. No external consistency verdict or feedback receipt invented.','followUp':[{'doi':'10.1136/rmdopen-2022-002477','finding':'Fetched EUSTAR observational record found no statistically significant skin or FVC effectiveness; primary report appraisal and addition as trial-generalization qualification deferred.'},{'doi':'10.1093/rheumatology/kead343','finding':'Fetched Japanese inpatient record associated early ACEi with improved SRC composite outcome; primary report appraisal deferred.'}],'limitations':['No independent domain reviewer or calibration','No exhaustive literature screen','Mixed-subset SSc studies retain their context','Consensus records are discovery, not primary full-text inspection']}
for p in [D/'research/final-review-status.json',dest/'research/final-review-status.json']:p.write_text(json.dumps(research_note,indent=2)+'\n')
report=f'''# Diffuse cutaneous systemic sclerosis — local candidate handoff

Date / evidence cutoff: 2026-10-17. Local candidate selected; scientific review and score calibration remain pending.

## Final snapshot and preview

- Candidate: `{b['id']}`
- Path: `{bpath}`
- Manifest SHA-256: `{b['manifest']['contentDigest']}`
- Summary revision: `{b['scientificSummary']['revisionId']}`
- Profile: `knowledge/diseases/diffuse-systemic-sclerosis/disease.json`; previewCandidate binds the final ID.
- Local preview: http://127.0.0.1:4328/diseases/diffuse-systemic-sclerosis/ (built-site preview).
- Portable review: `{packet}/review.md`, `packet.json`, `feedback-template.json` in this durable directory.
- 31 entities, 44 relationships, 63 claims/evidence items, 22 sources, 6 therapies and 2 contexts. Default overview includes 31/31 entities and 44/44 relationships; desktop/mobile rendered 31 map nodes and 31 cloud entries. Source flags explicitly retain two correction-linked originals.
- Seed findings: 44 supporting, 4 qualifying, 0 contradicting. Therapy record contribution arrays retain 9 supporting and 6 qualifying claim references. These counts are bookkeeping, not evidence-strength or replication counts.

## Scope

{b['scientificSummary']['scope']}

Shared canonical identities reused where appropriate from CREST and other maps (pDC, CXCL4, interferon, IL-6, TGF-beta, dermal fibroblasts, myofibroblasts, ECM, skin fibrosis, endothelial cells, endothelin and ILD). Disease claims and assessments were authored separately. The diagram is a labelled cross-study synthesis, not one patient's sequence. It does not silently convert culture findings or transcriptomic ligand-receptor inference into proven human mechanisms.

## Retrieval and access

`pnpm curate list` confirmed no existing diffuse map before registration. Initial broad scan (2020-01-01 to 2026-10-17) failed because query exceeded 5,000 records; cursor did not advance. See `research/scan.log`.

Refined scan: `scan-07c638fdb847dc96404f3f83`, indexing/update window 2020-01-01–2026-10-17; 854 retrieved, 854 unique, 854 changes, 158 flagged records; exit 0. Exact profile query:

```text
{profile['query']}
```

This is an indexing/update-date window, not a publication-date census. Targeted primary-record searches and Consensus discovery supplied foundational earlier reports. Actual full normalized scan: `curation/workspace/diffuse-systemic-sclerosis/scans/scan-07c638fdb847dc96404f3f83/papers.json` (workspace-only). Durable `scan-reports/` and `research/scan-dispositions.json` retain report/query hashes, queue identifiers, titles, flags and dispositions. Seven scan records overlap the curated source set; 847 are explicitly unprocessed/deferred, not scientifically screened or declared irrelevant. Additional selected sources came from targeted retrieval. No completeness claim.

Primary records and exact cached text: `research/primary-records.json`, `research/*-metadata.json`, `research/*-inspected.txt`, source-check receipts and normalized `imports/`. Most access is abstract-level; selected immune-complex, CXCL4, IL-13, early untreated skin and SLS II full-text sections were inspected. Raw PDF/XML/HTML downloads are workspace-only and hash-listed in `raw-cache-manifest.json`; durable extracted text and authored quotations are preserved. Access failures/500s and publisher 403s occurred; downloading a record was never counted as inspected full text. No model extraction adapter was invoked; authored inputs and source checks are Codex agent work.

Consensus MCP was used for mechanism, null/qualifying evidence and current-literature discovery; actual query/result and selected fetched-paper records are in `research/consensus-*.json` and `research/fetch-*.json`. Final packet-oriented query plus three narrower searches are retained. Search/fetch returned literature, not an independent overall verdict: section 7 independent summary review is **not run / pending scientific review**, with no feedback receipt fabricated. See `research/final-review-status.json` for follow-up reports, including the observational EUSTAR null result.

## Inputs and revision history

- `first-map.json`, `author.py`, `research/source-checks.json`: 30-entity seed, 48 findings, 15 publications; exact quotations and dated agent checks.
- `imports/seed-seed-227c95ce692a/`: normalized papers and extraction used by seed.
- `therapies.mjs`, `therapy-candidate.json`, `research/therapy-source-checks.json`: six therapies, primary trial outcomes, US label/guideline provenance and explicit off-label/status limits.
- `notices.mjs`, `notices-candidate.json`: flags and provenance correction without rewriting old snapshots.
- `proposals/`, `appraisals/`, `summaries/`, `summary-input.json`, `summary-final-input.json`: immutable proposal/diff, automatic provisional appraisal and agent summary inputs.
- `seed.log` records a failed first seed: a qualifier-only edge lacked positive support. Corrected before any seed was written by attaching the negative renin finding to the supported renal-physiology association. `seed-corrected.log` succeeded; no invented supporting finding was added.

## Therapies and notice dispositions

Nintedanib and tocilizumab have verified US adult SSc-ILD indications for slowing pulmonary-function decline. No skin approval is asserted. Primary skin null endpoints, nintedanib missing-data sensitivity, and trial population limits remain explicit. Mycophenolate, cyclophosphamide and ACE inhibitors have guideline-supported uses; HSCT is restricted to selected severe early diffuse disease without advanced cardiorespiratory involvement. The schema has no off-label/procedure status: these four are `unverified` specifically for SSc-specific regulatory approval, with the reason visible in each record. Clinical outcomes used as indirect therapy endpoints are explicitly labelled as outcomes, not molecular targets. No dosing recommendation or treatment advice is supplied.

IL-13 original PMID 27113293 links to correction PMID 27283473: the publisher/PMC-indexed correction describes author affiliations/contributions; no scientific result change described. Tocilizumab PMID 32866440 links to corrections 33007286 and 33667402. The 2021 publisher correction changes the SSc-ILD subgroup tocilizumab mean FVC-percent change in table 3 to 0.1. The mapped overall-population 4.2 estimate and negative skin endpoint independently agree with the current US label. Details of the 2020 correction remain unresolved; journal abstract reports 210 randomized whereas the label reports 212. That denominator mismatch remains explicit in the final evidence context and source access scope. Do not use this handoff as a complete trial appraisal. Original notice metadata and the label text are preserved.

## Checks, all performed 2026-10-17

| Layer | Result / evidence |
| --- | --- |
| Exact candidate | PASS, exit 0: `node scripts/validate-release.mjs {bpath}`; `final-candidate-validation.log` |
| Registry | PASS, exit 0: `pnpm validate`; `final-registry-validation.log` |
| Local selection | PASS, exit 0: `pnpm curate preview --disease diffuse-systemic-sclerosis --candidate {b['id']}`; `final-preview.log` |
| Short labels | PASS, 2 tests, exit 0: `node --test tests/short-labels.test.mjs`; `short-labels-test.log` |
| Type/product check | PASS, exit 0: `pnpm check`; 42 Astro files, no errors/warnings/hints; `check.log` |
| Build | PASS, exit 0: `pnpm build`; 165 pages; `build.log` |
| Browser initial dev | FAILED: stale Vite optimized-dependency 504 prevented hydration; `browser.log`, `browser-diagnose.mjs`. Stopped only this task's dev process and served built output. |
| Browser built first run | Assertion FAILED: expected lowercase `approved`, actual display `APPROVED`; graph, coverage, summary and packet passed. `browser-built.log`. Corrected assertion to compare case-insensitively. |
| Browser final | PASS, exit 0: `node .../browser-check.mjs`; desktop 1440×1000 and mobile 390×844, 31/31 nodes/cloud entities, exact summary and portable packet, approved therapy inspector, no horizontal overflow or page errors. `browser-final.log`, `browser-results.json`, screenshots and inspector text. Screenshots visually inspected. |
| Scientific inspection | Agent primary-source inspection only; access limits, null results and correction uncertainty retained. Independent domain review and calibrated scoring PENDING. |
| External overall verdict | NOT RUN / PENDING: Consensus discovery ran, but no independent overall assessment returned through available search/fetch tools. |

## Scientific summary

{b['scientificSummary']['paragraphs'][0]['text']}

{b['scientificSummary']['paragraphs'][1]['text']}

## Remaining work

- Independent domain review, claim entailment appraisal and calibration; automatic scores are provisional, not calibrated probabilities or principal-circuit certification.
- Resolve original tocilizumab 2020 correction and randomized-denominator discrepancy; primary-appraise EUSTAR observational null and contemporary ACEi cohort discovered in final searches.
- Screen the 847 unprocessed scan records and 158 retrieval flags; expand targeted historical retrieval where needed. Reused datasets and overlapping cohorts require independence review.
- Broader HLA/genetic, B-cell, autoantigen-specific T-cell, functional receptor autoantibody, epithelial injury, matrix-stiffness, hypoxia and detailed renal ischaemia/RAAS/TMA pathways remain incompletely curated. The vascular culture route demonstrates activation; initiating endothelial injury/death is not established by it. Optional GI/cardiac/PAH and Raynaud/digital outcomes are not a comprehensive diffuse-disease map here.
- Evaluate omitted therapies and emerging cellular therapies separately; do not infer absence of treatments from this selected six-record set.

Backlog updated to the selected local candidate. Public pointers, reviewer policy, scheduling and publication were not advanced. No commit made. Pre-existing edits to CURATION.md, shared command workflow, backlog and graph CSS were preserved; concurrent global CSS edits were also left untouched.
'''
for folder in [D/'handoff',dest/'handoff']:
 folder.mkdir(exist_ok=True);(folder/'report.md').write_text(report)
# Hash durable packet (manifest excludes itself).
manifest=[{'path':str(p.relative_to(dest)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(dest.rglob('*')) if p.is_file() and p.name!='artifact-manifest.json'];(dest/'artifact-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(dest/'handoff/report.md');print('artifacts',len(manifest))
