from pathlib import Path
import json,shutil,hashlib
w=Path('curation/workspace/anti-gbm-disease'); out=Path('curation/examples/anti-gbm-disease/initial-2026-10-17');out.mkdir(parents=True,exist_ok=True)
p=json.load(open('knowledge/diseases/anti-gbm-disease/disease.json'));b=json.load(open('knowledge/diseases/anti-gbm-disease/candidates/'+p['previewCandidate']+'.json'))
f=json.load(open(w/'first-map.json'));selected={x['pmid'] for x in f['findings']};papers=json.load(open(w/'scans/scan-e4a583a3d6996884d1de51eb/papers.json'))
ledger=[]
for r in papers:
 pmid=r.get('pmid'); ledger.append(dict(key=r['key'],identifiers=r['identifiers'],title=r['title'],sourceContentHash=hashlib.sha256(json.dumps(r,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest(),hashMethod='Python canonical sorted JSON UTF-8; audit convenience, not the CLI paperDigest',decision='processed-selected' if pmid in selected else 'unprocessed',reason='Selected primary abstract findings seeded; notice metadata inspected' if pmid in selected else 'Retrieved only; not scientifically screened. Cache includes unrelated GBM oncology hits from initial broad query and known-record refresh.',affectedClaimIds=[c['id'] for c in b['claims'] if any(bi['id'] in c['evidenceItemIds'] and next(s for s in b['sources'] if s['id']==bi['sourceId']).get('studyId')=='PMID:'+str(pmid) for bi in b['evidenceItems'])] if pmid in selected else [],cycleDate='2026-10-17'))
json.dump(ledger,open(w/'paper-dispositions.json','w'),indent=2)
checks=dict(date='2026-10-17',candidate=b['id'],contentDigest=b['manifest']['contentDigest'],passed=[{'command':'node scripts/validate-release.mjs knowledge/diseases/anti-gbm-disease/candidates/'+b['id']+'.json','exitCode':0,'log':'handoff/candidate-validation.log'},{'command':'pnpm check','exitCode':0,'log':'handoff/check.log','result':'Registry validation and Astro check: 42 files, 0 errors/warnings/hints'},{'command':'pnpm build','exitCode':0,'log':'handoff/build.log','result':'124 pages built'},{'command':'node curation/workspace/anti-gbm-disease/browser-check.mjs','exitCode':0,'log':'handoff/browser-check.json','result':'Nine non-empty views; imlifidase null endpoint visible; exact-candidate summary packet; curator workspace; zero page errors. Screenshot inspected by Codex.'}],correctedFailures=[{'command':'pnpm curate propose','exitCode':1,'reason':'A therapy-only context was given an empty graph view; removed the empty view while retaining phase 3 context/claims.'},{'command':'pnpm curate propose','exitCode':1,'reason':'trialSourceIds initially referenced a publication-kind phase 2 source and an observational cohort. Marked phase 2 source trial; removed cohort from trialSourceIds.'}],notRun=['Independent overall summary verdict from an external research agent: no such callable reviewer available. Consensus search/fetch performed retrieval only.','Authenticated domain review, scoring calibration, claim-level independent semantic verification'],publicationChanged=False)
json.dump(checks,open(w/'handoff/checks.json','w'),indent=2)
review='''External literature retrieval, 2026-10-17: Consensus search and three fetches were actually run (see consensus-discovery.json and consensus-fetches.json). Query: anti glomerular basement membrane disease HLA DR15 alpha3 alpha5 NC1 imlifidase GOOD-IDES-02 randomized phase 3 results year:2025-2026. Returned 20 discovery records. This was retrieval, not an independent overall-review verdict; no summary-feedback receipt is asserted.

Deferred current evidence: Tyrberg et al., DOI 10.1093/ckj/sfaf393 (same GOOD-IDES-01 cohort, classical activation falls but terminal activation remains elevated); Kuang et al., DOI 10.1093/ndt/gfaf153 (perlecan autoantibodies, observational antigen expansion); Eggenhuizen et al., DOI 10.1016/j.kint.2025.01.005 (engineered antigen-specific Tregs; fetch lacked a full abstract). Primary originals, notices and exact passages need follow-up before these are added. None establishes clinical Treg efficacy or that collagen IV is the only antigen. Summary states the narrow scope and newer-branch omissions.

Web retrieval inspected primary abstracts, a selected PMC complement biopsy report, KDIGO chapter 11, EMA EPAR and Hansa phase 3 topline announcement. Hansa header/lead and its Cision release are dated 2025-12-16, but one regulatory footer says 2026; preserved as an unresolved date inconsistency. Phase 3 null result is explicitly sponsor-reported, not presented as independently appraised full data.

Independent overall current-science verdict: NOT RUN / pending scientific review. Human domain review and calibration: pending.
'''
(w/'handoff/external-review-status.md').write_text(review)
counts={k:len(b[k]) for k in ['entities','relationships','claims','sources','evidenceItems','therapies','contexts','mapViews','assessments']}
scanids=['scan-f7d527bda6feac005e246a04','scan-e4a583a3d6996884d1de51eb']
report=f'''# Anti-GBM disease local curation handoff — 2026-10-17

Local candidate selected; independent scientific review and calibration pending.

## Scope and coverage

“anti-gmb disease” resolved to Anti-GBM disease, slug `anti-gbm-disease`; aliases Goodpasture disease/syndrome and anti-glomerular basement membrane disease. Renal classical anti-GBM autoimmunity, α3/α5 NC1 conformational specificity, HLA-restricted responses, labelled pulmonary and ANCA-overlap branches. Excludes Alport post-transplant nephritis, atypical/seronegative disease and assay performance. Evidence cutoff 2026-10-17. Human observations, biochemical assays, monkey IgG transfer, HLA-transgenic and heterologous mouse models, and rat lung experiments have separate contexts/views. No whole-disease completeness claim.

Initial query `(TITLE_ABS:"anti-GBM" OR TITLE_ABS:"anti-glomerular basement membrane" OR TITLE_ABS:"Goodpasture")`, explicit 1960-01-01 through 2026-10-17 indexing/update window. Run `{scanids[0]}`: 3454 retrieved, 3441 unique, 3441 changes, 532 flagged. Oncology contamination was found; the profile query was refined to `{p['query']}`. Query change triggered broad reconciliation in run `{scanids[1]}`: 8939 raw records including known-record refreshes, 3446 unique retained records, 7 changes, 534 flagged. The retained cache includes prior off-topic records: these counts are not all disease-relevant records. Both searches succeeded without truncation. Actual report/query/response provenance is under each workspace `scans/<run-id>/`; reports are preserved durably under `scans/` here, large raw responses and all-record papers remain workspace-only (~157 MB whole workspace before handoff).

Nine selected primary reports supplied 20 seed findings (18 supporting, 2 qualifying). Three additional authoritative/sponsor sources support therapy metadata/status; six therapy claims include copies of four already-curated primary findings, not six independent studies. No independently replicated study count is claimed. Predominantly abstract access; selected PMC complement methods/results were additionally inspected. See first-map publication inspectedScope, findings' studySystem/limitations/sourceCheck and additional-source-checks.json. No model adapter used: manual contract authored by Codex agent; actual source checks are agent work, not human approval. Original normalized extraction retains `manual-source-check-v1` / `causome-extraction-v1` metadata.

## Exact product artifact

`knowledge/diseases/anti-gbm-disease/candidates/{b['id']}.json`

SHA-256 manifest content digest: `{b['manifest']['contentDigest']}`.

Profile: `knowledge/diseases/anti-gbm-disease/disease.json`, previewCandidate `{p['previewCandidate']}`. Local page `/diseases/anti-gbm-disease/`; inspected on available port 4328, preserving the existing 4322 server. Counts: {json.dumps(counts)}. Nine views; the tenth context is the therapy-only phase 3 population and has no standalone empty graph. Context separation replaces the initial mixed overview; immutable original remains available.

Source inputs: first-map.json; targeted-primary-records.json; additional-source-checks.json; imports/ (normalized papers and extraction with exact quotes); stage-candidate.mjs and contexts-therapies-candidate.json; proposals/; appraisals/ automatic inputs/results; summary-input.json and summaries/; summary-reviews/ (including portable review.md, packet.json and blank feedback worksheet). Author scripts are preserved; run from repository root using their original workspace paths/import depths. Candidate appraisals are conservative automatic provisional rules, neither calibrated nor independent scientific judgments.

## Scientific synthesis

{b['scientificSummary']['paragraphs'][0]['text']}

{b['scientificSummary']['paragraphs'][1]['text']}

Summary revision `{b['scientificSummary']['revisionId']}`. Exact packet digest `9b1c5fb40c29f27f530929af816961087086acc7f4295b6d95e8de6d778b5a8f`, under summary-reviews/. Final packet inspected and served download verified to bind the selected candidate. Consensus retrieval performed; independent overall verdict NOT RUN / pending scientific review. No external verdict receipt fabricated. See handoff/external-review-status.md for coverage, newer deferred reports and source-date conflict.

## Checks

All commands run 2026-10-17. Final candidate integrity passed (exit 0); `pnpm check` passed (registry plus 42 Astro files; zero errors/warnings/hints); `pnpm build` passed (124 pages). Browser smoke passed for nine populated routes, therapy null-outcome evidence, summary download and curator selection; zero page errors. Screenshot visually inspected. Logs and exact commands/results in handoff/checks.json, candidate-validation.log, check.log, build.log, browser-check.json and page.png.

Corrected proposal failures: empty graph view rejected; removed it while retaining therapy context. Non-trial sources rejected in trialSourceIds; phase 2 source correctly marked trial and retrospective cohort removed from that field. Both corrected before successful immutable proposal. Initial overly broad query was refined; successful cache retrieval was never treated as scientific screening.

## Unresolved work

- paper-dispositions.json preserves all 3446 cache identities/hashes and selected/unprocessed state. All non-selected records remain unscreened, including provider notices, secondary reports and off-topic oncology records. No assertion that 534 flagged sources were resolved. Selected imported primary metadata showed no retraction/concern/correction flag; comment links remain in original primary records and need deeper appraisal where relevant.
- New complement longitudinal results, perlecan/laminin antigen expansion and engineered Tregs are deferred explicitly; cohort overlap and source access must be checked. Biological sequence from trigger to human disease, T-cell help to antibody production and direct human neutrophil causality remain gaps rather than inferred edges.
- Hansa phase 3 topline date conflict retained; full trial effect estimates, registry result tables, peer-reviewed report and long-term outcomes not appraised. EMA EU transplant indication checked; anti-GBM use remains experimental. Combined standard regimen reflects international KDIGO use, with regulatory status `unverified` because individual product labels were not appraised; it is not an assertion of unverified clinical use. Component-specific benefit and full toxicity/dosing coverage absent.
- Independent overall review, human domain approval, appraisal calibration and independent claim-level verification remain pending/not run. No publish, public current pointer, reviewer policy, scheduler or commit changed. Unrelated pre-existing repository edits preserved.
'''
(w/'handoff/report.md').write_text(report)
# Preserve selected source material and reproducible local inputs; keep the large retrieval cache local.
for path in w.iterdir():
 if path.name in ['scans','cache','state.json','attempts']:continue
 dest=out/path.name
 if path.is_dir():shutil.copytree(path,dest,dirs_exist_ok=True)
 else:shutil.copy2(path,dest)
for sid in scanids:
 d=out/'scans'/sid;d.mkdir(parents=True,exist_ok=True)
 for name in ['report.json','report.md']:shutil.copy2(w/'scans'/sid/name,d/name)
print('Durable handoff:',out/'handoff/report.md');print(counts)
