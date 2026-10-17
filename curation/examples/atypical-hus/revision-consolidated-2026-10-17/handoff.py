import json,shutil,collections
from pathlib import Path
w=Path('curation/workspace/atypical-hus/revision-consolidated-2026-10-17');root=Path('curation/workspace/atypical-hus');profile=json.load(open('knowledge/diseases/atypical-hus/disease.json'));cid=profile['previewCandidate'];candidate=Path('knowledge/diseases/atypical-hus/candidates')/(cid+'.json');b=json.load(open(candidate));old='atypical-hus-summary-candidate-cd695231f272'
counts={k:len(b[k]) for k in ['entities','relationships','claims','sources','evidenceItems','therapies','contexts','mapViews','assessments']}
# Check that the displayed players form one connected disease explanation.
a={e['id']:set() for e in b['entities']}
for r in b['relationships']:a[r['sourceId']].add(r['targetId']);a[r['targetId']].add(r['sourceId'])
seen=set();stack=[next(iter(a))]
while stack:
 i=stack.pop()
 if i in seen:continue
 seen.add(i);stack.extend(a[i]-seen)
assert len(seen)==len(a)
(w/'handoff/coverage.json').write_text(json.dumps({'candidate':cid,'defaultView':b['mapViews'][0]['id'],'entities':len(a),'connectedEntities':len(seen),'wordCloudEntities':len(b['entities']),'defaultVisibleEntities':len(b['mapViews'][0]['entityIds']),'coverage':1,'hiddenEntities':[],'connectedComponents':1},indent=2)+'\n')
checks={'checkedAt':'2026-10-17','candidate':cid,'digest':b['manifest']['contentDigest'],'passed':[{'command':'node scripts/validate-release.mjs '+str(candidate),'exit':0,'log':'candidate-validation.log'},{'command':'pnpm check (includes pnpm validate)','exit':0,'log':'check.log'},{'command':'pnpm build (includes pnpm validate)','exit':0,'log':'build.log'},{'command':'node --test tests/short-labels.test.mjs','exit':0,'log':'short-labels-test.log'},{'command':'node '+str(w/'browser-check.mjs'),'exit':0,'log':'browser-check.json'}],'notRun':['Independent external overall scientific verdict: no Consensus research-thread creation tool exposed','Authenticated human domain review','Appraisal calibration','Full regression/performance suites (data/documentation change)']}
(w/'handoff/checks.json').write_text(json.dumps(checks,indent=2)+'\n')
packet='e152eb4704ce56748603699d95b634b8e6d5a3f076e41d0906545f3707af087b'
newchecks=json.load(open(w/'source-checks.json'))
sourceDispositions=[]
used={x['sourceId'] for x in newchecks}
for name in ['primary-records.json','additional-records.json','bridge-primary-records.json']:
 for p in json.load(open(w/'sources'/name)):
  src=next((s for s in b['sources'] if 'PMID:'+p['id'] in s['identifiers']),None)
  sourceDispositions.append({'id':p['id'],'title':p['title'],'decision':'mapped inspected primary evidence' if src and src['id'] in used else 'discovery only / deferred; not evidence in this revision','metadataFile':'sources/'+name,'notices':p.get('commentCorrectionList')})
(w/'paper-dispositions.json').write_text(json.dumps(sourceDispositions,indent=2)+'\n')
report=f'''# Consolidated aHUS map — 2026-10-17

Selected local candidate; independent scientific review and calibration pending.

## Result and scope

The previous default view showed only 3 of 18 word-cloud entities. This revision replaces six fragmented study views with one integrated disease overview: **29 of 29 cloud entities visible, 44 relationships, one connected component, no hidden groups**. Word-cloud clicks select the corresponding node without switching routes. All original claims are preserved with their text, exact evidence and study systems; the overview context expressly identifies the cross-study synthesis. Earlier candidates and their narrower views remain immutable history.

{b['diseaseDescription']}

Expanded pathways cover CFH/CFI/CD46 regulatory convergence, acquired anti-factor H antibodies and CFHR deficiency, C3/CFB susceptibility, C3/C5 convertases, C5, MAC and C5aR1, endothelial injury/repair and VWF, platelet activation/aggregation, fibrin/microthrombi and TMA, red-cell fragmentation/haemolysis, thrombocytopenia and renal dysfunction. The heme amplification route is shown with cell/biochemical limits. Trigger association is observed in a pediatric cohort; it is not a universal mechanistic cause. THBD biochemical regulation is separate from its disputed gene–disease association, with original support and later contradictory human findings both retained. Two existing US C5-inhibitor records and their target remain accessible on the overview.

## Exact artifact

Candidate `{cid}` at `{candidate}`.

Manifest SHA-256: `{b['manifest']['contentDigest']}`.

Base: `{old}`, digest `ca6d22f09c7c28172d54f6ec9ed5565b5cce5e130d88198a9867c8eb956e2ad8`. Evidence cutoff remains 2026-10-17; no search-completeness claim. Counts: {json.dumps(counts)}. The 59 claims include existing duplicated therapy assertions, so they are not 59 independent findings/studies. Summary revision `{b['scientificSummary']['revisionId']}`. Exact packet: `summary-reviews/{packet}/`.

## Retrieval and source checks

This is a same-day scope/completeness revision of the selected map, using the unresolved literature and targeted retrieval; no duplicate disease registration or reseeding. Earlier broad scan remains `scan-f61e0f67d936697f9347ee03` (2255 retrieved / 2224 unique / 620 flagged), with unprocessed queue and limitations in the initial handoff. No new broad-scan reviewed-through claim. Targeted Europe PMC title/DOI/identifier queries and exact core records are retained under `sources/targeted-queries.json`, `primary-records.json`, `additional-records.json` and `bridge-primary-records.json`. `paper-dispositions.json` identifies which reports contributed and which remain discovery-only. These title queries can return unrelated or later records; only explicitly selected eligible reports contribute.

Primary full text PMC2118613 was retrieved as XML and inspected for endothelial binding, glomerular microthrombi, red-cell fragmentation, platelet counts and renal function. Exact quotations and dated agent checks for every new assertion are in `source-checks.json`; `sources/PMC2118613.xml` and `.txt` preserve the retrieved material. Other new reports were inspected at abstract/core-metadata level, except the later THBD report whose publisher-indexed primary methods/results/discussion were inspected and whose exact conclusion excerpt and web retrieval are retained. Old pathway-background quotations reference the previously cached primary PMC10634509 full text; its retained copy is in the initial durable packet. These background bridges are identified as such, rather than new independent perturbation results. Existing Soliris pharmacologic mechanism text supplies the regulatory C5-to-terminal-pathway bridge; current label receipts remain in the initial packet. No new therapy-status assertion or new jurisdiction.

The factor B correction is now inspected through indexed primary correction text: Fig. 2 residue Lys323 placement and Tyr344 label were corrected; authors state their conclusions are unaffected. No structural-residue claim was added. Exact correction retrieval is retained in `sources/notices-and-thbd-web.json` and its disposition in `source-checks.json`. Original notice flags are preserved. The correction endpoint and some older PMC endpoints intermittently returned browser challenges/HTTP 500; successful XML/indexed text retrieval, rather than bypassing access limits, supplied the cited material. New primary reports have comment links retained where returned; these do not establish correction/retraction and are not claimed fully adjudicated.

No model adapter or new independent reviewer was used. All source checks and synthesis are Codex agent work. Existing normalized input/quotation files remain in `../initial-2026-10-17/`; this revision retains the exact staged successor, its proposal/diff, appraisal inputs/results, summary inputs/packet, source checks and scripts. Scripts assume their original workspace paths and repository-root working directory.

## Scientific summary

{b['scientificSummary']['paragraphs'][0]['text']}

{b['scientificSummary']['paragraphs'][1]['text']}

## Verification

Candidate integrity passed. `pnpm check` passed, including registry validation and 42 Astro files with zero errors/warnings/hints. Production build passed: 138 pages. Short-label checks passed. Browser checks passed on desktop 1600×1100 and mobile 390×844: all 29 cloud entries clicked; each selected a visible node without changing the overview; all 44 relationships rendered; no overlapping node boxes or page errors; no mobile horizontal overflow; C5 therapy-target selection worked; served review Markdown bound the exact selected candidate/digest. Desktop screenshot visually inspected. Exact commands/results/logs in `handoff/checks.json` and `browser-check.json`. Coverage and connectedness in `coverage.json`.

The full overview is zoomable; fitting all 29 players necessarily reduces label size. The word cloud, selection inspector and focus controls remain ways to inspect individual players. No graph UI or source-scoring implementation changed.

Corrected authoring failures: a local quote matcher initially treated literal comparison signs as HTML and discarded a matching full-text span; narrowed HTML stripping to actual tag names. An initial proposal used a guessed MED source ID for an existing DOI-keyed source and failed reference closure; resolved the actual source identity before the successful proposal. No validation was bypassed and no immutable candidate rewritten.

## Remaining review and coverage limits

- Independent external overall verdict remains **not run**. Consensus search/fetch access was proven in the initial run, but no creation/dispatch tool for an independent research thread is exposed. Web retrieval here is evidence discovery/inspection, not an independent verdict. No external-feedback receipt was fabricated.
- Human domain review, appraisal calibration and independent claim-level semantic verification remain pending. Automatic weights/confidence are uncalibrated; larger network coverage does not establish causal importance or whole-loop sufficiency.
- Some connecting physiology is primary-report background or regulatory mechanism text, explicitly labelled. Human-cell studies, mouse results, genetic associations and clinically observed outcomes are not interchangeable. TMA-to-triad links retain the mouse study's associative interpretation; the map does not invent an isolated human intervention proving each edge.
- THBD disease association is disputed; historical CD46 A304V and other individual variant classifications need modern reassessment. The record does not equate all listed rare variants with pathogenic mutations. MAC-induced endothelial membrane repair and model-specific C5aR1 null results remain explicit qualifications.
- Detailed infection/pregnancy routes, extra-renal organ branches, plasma-exchange/immunosuppression and emerging proximal-inhibitor appraisal remain outside the present selected evidence. The major causal framework and clinical triad are now connected, but scientific comprehensiveness is an iterative evidence-review task rather than a claim that every paper or therapy has been covered. Remaining original queue and flags persist.
- No publication pointer, reviewer policy, schedule, commit or unrelated pre-existing edits changed. Curation guidance now requires a consolidated default overview and cloud-to-map coverage for future work.

Local preview: http://127.0.0.1:4329/diseases/atypical-hus/ (existing preview server; port 4322 process preserved).
'''
(w/'handoff/report.md').write_text(report)
d=Path('curation/examples/atypical-hus/revision-consolidated-2026-10-17');shutil.copytree(w,d,dirs_exist_ok=True)
for name,src in [('proposals',root/'proposals/proposal-30077094130ad9dbab626797'),('appraisals',root/'appraisals/atypical-hus-appraised-candidate-d9e7449b5ac5'),('summary-reviews',root/'summary-reviews'/packet),('summaries',root/'summaries'/cid)]:
 if src.exists():shutil.copytree(src,d/name/src.name,dirs_exist_ok=True)
back=Path('curation/disease-backlog.md');s=back.read_text();s=s.replace('Existing maps (2026-10-17): ANCA-associated vasculitis,','Existing maps (2026-10-17): atypical haemolytic uraemic syndrome (local candidate), ANCA-associated vasculitis,');s=s.replace('examples/atypical-hus/initial-2026-10-17/handoff/report.md','examples/atypical-hus/revision-consolidated-2026-10-17/handoff/report.md');s=s.replace('**Status:** Bounded local candidate selected 2026-10-17; independent scientific review pending.','**Status:** Consolidated local candidate selected 2026-10-17 (29 entities / 44 relationships; complete cloud coverage); independent scientific review pending.');back.write_text(s)
print(cid,b['manifest']['contentDigest'],counts)
