import json,hashlib,shutil
from pathlib import Path
w=Path('curation/workspace/atypical-hus');b=json.load(open('knowledge/diseases/atypical-hus/candidates/atypical-hus-summary-candidate-cd695231f272.json'));seed=json.load(open(w/'first-map.json'))
selected={p['id'] for p in seed['publications']}
papers=json.load(open(w/'scans/scan-f61e0f67d936697f9347ee03/papers.json'))
dispositions=[]
for p in papers:
 match=next((i for i in selected if 'PMID:'+i in p['identifiers']),None)
 dispositions.append({'key':p['key'],'identifiers':p['identifiers'],'sourceSnapshotSha256':hashlib.sha256(json.dumps(p,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest(),'disposition':'selected-primary-source-inspected' if match else 'unprocessed','reason':'Selected abstract supports bounded mapped findings; not full methodological appraisal' if match else 'Not scientifically screened in this bounded first-map run','flags':p['flags']})
(w/'paper-dispositions.json').write_text(json.dumps(dispositions,indent=2)+'\n')
checks={'date':'2026-10-17','candidate':b['id'],'digest':b['manifest']['contentDigest'],'checks':[{'command':c,'exitCode':0,'log':log} for c,log in [('node scripts/validate-release.mjs knowledge/diseases/atypical-hus/candidates/'+b['id']+'.json','candidate-validation.log'),('pnpm validate','registry-validation.log'),('pnpm check','check.log'),('pnpm build','build.log'),('node --test tests/short-labels.test.mjs','short-labels-test.log'),('node curation/workspace/atypical-hus/browser-smoke.mjs','browser-check.json')]],'scientificReview':'pending','calibration':'pending','externalOverallReview':'not run; Consensus search/fetch exposed but no create_thread tool'}
(w/'handoff/checks.json').write_text(json.dumps(checks,indent=2)+'\n')
counts={k:len(b[k]) for k in ['entities','relationships','claims','sources','evidenceItems','therapies','contexts','mapViews','assessments']}
text=f'''# aHUS local curation handoff — 2026-10-17

Local candidate selected; independent scientific review and calibration pending.

## Scope and coverage

Atypical haemolytic uraemic syndrome (`atypical-hus`), aliases aHUS, complement-mediated HUS, complement-mediated thrombotic microangiopathy and CM-TMA. Complement-mediated renal TMA with selected genetic, autoantibody, endothelial-assay, mouse and treatment evidence. Excludes STEC-HUS, TTP, secondary TMA, DGKE and cobalamin-related TMA. Evidence cutoff 2026-10-17. Six populated views separate antibody/cohort, genetics, endothelial assays, C3-mutant mice, factor H-mutant mice and uncontrolled eculizumab trials. The seventh context contains label/therapy claims and has no empty graph view. CFHR association and functional antibody assays share a labelled view but every evidence item identifies its system.

Query `(TITLE_ABS:"atypical hemolytic uremic syndrome" OR TITLE_ABS:"atypical haemolytic uraemic syndrome" OR TITLE_ABS:"complement-mediated thrombotic microangiopathy")`, indexing/update window 1998-01-01 through 2026-10-17. Successful run `scan-f61e0f67d936697f9347ee03`: 2255 retrieved, 2224 unique, 2224 changes, 620 flagged. Search is not complete scientific screening. Most records remain unprocessed, including provider notices. `paper-dispositions.json` retains all cache identities, source snapshot hashes and selected/unprocessed state. Selected sources were also retrieved directly using Europe PMC core targeted queries, retained in `sources/`; all source-check statements identify agent work. Eleven primary reports yield 20 seed findings: 15 supporting, 5 qualifying. Two copies of eculizumab findings support therapy records; these are not independent studies. Four label claims supply mechanism/indication provenance. No replication count inferred from citation volume.

Consensus MCP live search and fetch succeeded on 2026-10-17. Exact responses retained in `consensus-discovery.json` and `consensus-mechanisms.json`; fetched antibody and genetic papers and newer terminal-pathway mouse reports. The preliminary connectivity-test search was not retained, so it is not relied on as provenance. Primary claims use separately retrieved Europe PMC reports. Selected abstracts and metadata were inspected; PMC10634509 methods/results/discussion were additionally inspected. Several other Europe PMC full-text requests returned HTTP 500; PMC correction access encountered a browser challenge. Full-text access is not claimed for those sources. DailyMed Soliris and Ultomiris full labels were cached and selected indication/mechanism/safety sections inspected. Labels verify United States indications only.

## Exact candidate and retained inputs

`knowledge/diseases/atypical-hus/candidates/{b['id']}.json`

Manifest SHA-256: `{b['manifest']['contentDigest']}`.

Profile `knowledge/diseases/atypical-hus/disease.json`, selected preview `{b['id']}`. Counts: {json.dumps(counts)}.

Authored contract `first-map.json`, exact quotations/check provenance in its findings; original targeted source records in `sources/`; normalized `imports/` and full proposal inputs/diffs under `proposals/`; automatic provisional appraisal receipts under `appraisals/`; connected summary input `summary-input.json` and `summaries/`; exact portable packet `summary-reviews/938e2f2b2d4dedbc7fa30c282661a567b44be053e601c8581c39ff6062bc27ce/`. Summary revision `summary-cd695231f272`. Authoring/retrieval/staging/browser scripts retained. Scripts assume their original workspace path and repository-root working directory. No model adapter was used; extraction metadata is the CLI manual-source-check contract. Raw full scan responses and all-record papers remain workspace-only; reports are preserved under durable `scans/`.

## Scientific synthesis

{b['scientificSummary']['paragraphs'][0]['text']}

{b['scientificSummary']['paragraphs'][1]['text']}

## Validation and review

All commands in `handoff/checks.json` passed, exit 0. Candidate and registry integrity passed (89 candidate snapshots at this run). Type check: 42 Astro files, zero errors/warnings/hints. Production build: 134 pages. Short-label tests passed. Browser smoke inspected eight routes (disease, six views, curator), actual rendered nodes, no page errors, and the served Markdown packet's exact candidate/digest. Desktop/mobile captures retained; desktop page and graph visually inspected. Local preview http://127.0.0.1:4329/diseases/atypical-hus/ uses a separate preview server, preserving the existing port 4322 process.

Corrected authoring failures are not scientific validation: initial seed rejected unsupported enum/predicate spellings and an orphan C5 entity; corrected schema vocabulary and moved C5 to the label-supported proposal. Exact source abstract inequality signs were HTML-escaped in authored import metadata because the normalizer otherwise consumed text after literal P<0.001; original source records remain intact. No generated passage substituted. Single-arm human trials use the available human_observational evidence tag with explicit interventional interpretation and uncontrolled design in the text; randomized_trial would falsely label them. Initial context proposal rejected an orphan null-only C5aR renal claim; retained it as an explicit entity role and qualifying assessment, with no positive renal arrow in the factor H mouse view. Its automatic assessment category remains qualifying. A missing optional Python HTML-parser dependency was bypassed with standard-library HTML processing; no dependency changes.

External overall summary verdict NOT RUN. Consensus offers search/fetch and existing-thread reads, but no research-thread creation/dispatch tool is exposed in this session. Agent synthesis of retrieved papers is not an independent external verdict. No feedback receipt fabricated. Human domain approval, calibration and independent claim-level semantic verification remain pending/not run. Full browser regression/performance suites were not run for this data-only addition.

## Unresolved work

- Remaining retrieved records and 620 flagged records are not adjudicated. Selected cited primary reports had no retraction/concern/correction link in retrieved metadata; comment links for Noris and Legendre remain retained and not deeply appraised. Search date coverage is not a scientific reviewed-through checkpoint.
- Factor B original report has an erratum; correction could not be inspected and the branch is deferred. Ravulizumab adult original report also has an erratum; no original-trial effect estimate imported. Its US indication/mechanism comes from current labels. Pediatric and switch trial reports are discovery-only, not curated. THBD variants require modern pathogenicity appraisal before inclusion; no equal evidence strength asserted across backlog genes.
- Full endothelial injury, platelet consumption, mechanical hemolysis and acute kidney injury chain is not yet expanded. Pregnancy/infection triggers, plasma exchange, factor B/proximal inhibitors and comprehensive clinical management remain deferred. The map is a bounded initial candidate rather than a whole-disease completion claim.
- Variant reclassification (including CD46 A304V), genotype penetrance estimates, cohort overlap, complete methods and controls need independent appraisal. Null and qualifying findings remain explicit; abnormal culture deposition is not an active-disease diagnostic.
- No public current pointer, reviewer policy, publication, schedule or commit changed. Pre-existing unrelated workspace edits were preserved.
'''
(w/'handoff/report.md').write_text(text)
dest=Path('curation/examples/atypical-hus/initial-2026-10-17');dest.mkdir(parents=True,exist_ok=True)
for item in w.iterdir():
 if item.name in ['scans','cache','sources.json','state.json']:continue
 if item.is_dir():shutil.copytree(item,dest/item.name,dirs_exist_ok=True)
 else:shutil.copy2(item,dest/item.name)
scan=dest/'scans/scan-f61e0f67d936697f9347ee03';scan.mkdir(parents=True,exist_ok=True)
for n in ['report.md','report.json']:
 src=w/'scans/scan-f61e0f67d936697f9347ee03'/n
 if src.exists():shutil.copy2(src,scan/n)
back=Path('curation/disease-backlog.md');s=back.read_text().replace('| 1 | Atypical haemolytic uraemic syndrome | `atypical-hus` | Renal / complement | Not started |','| 1 | Atypical haemolytic uraemic syndrome | `atypical-hus` | Renal / complement | [Local candidate; scientific review pending](examples/atypical-hus/initial-2026-10-17/handoff/report.md) |')
s=s.replace('## 1. Atypical haemolytic uraemic syndrome\n','## 1. Atypical haemolytic uraemic syndrome\n\n- **Status:** Bounded local candidate selected 2026-10-17; independent scientific review pending. [Handoff and deferred branches](examples/atypical-hus/initial-2026-10-17/handoff/report.md).\n')
back.write_text(s)
print(dest,counts)
