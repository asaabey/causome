# Diffuse cutaneous systemic sclerosis — local candidate handoff

Date / evidence cutoff: 2026-10-17. Local candidate selected; scientific review and score calibration remain pending.

## Final snapshot and preview

- Candidate: `diffuse-systemic-sclerosis-summary-candidate-f7786448c91d`
- Path: `knowledge/diseases/diffuse-systemic-sclerosis/candidates/diffuse-systemic-sclerosis-summary-candidate-f7786448c91d.json`
- Manifest SHA-256: `70bced4cbe985957ffdc3d459614c80efb68d9a63bcd97d922b0a7a6b05c7727`
- Summary revision: `summary-f7786448c91d`
- Profile: `knowledge/diseases/diffuse-systemic-sclerosis/disease.json`; previewCandidate binds the final ID.
- Local preview: http://127.0.0.1:4328/diseases/diffuse-systemic-sclerosis/ (built-site preview).
- Portable review: `summary-reviews/c91ddcc48d5161de1302c9304e3ab57cd73ff71c7886e5807e92dd5ebc258d87/review.md`, `packet.json`, `feedback-template.json` in this durable directory.
- 31 entities, 44 relationships, 63 claims/evidence items, 22 sources, 6 therapies and 2 contexts. Default overview includes 31/31 entities and 44/44 relationships; desktop/mobile rendered 31 map nodes and 31 cloud entries. Source flags explicitly retain two correction-linked originals.
- Seed findings: 44 supporting, 4 qualifying, 0 contradicting. Therapy record contribution arrays retain 9 supporting and 6 qualifying claim references. These counts are bookkeeping, not evidence-strength or replication counts.

## Scope

Diffuse cutaneous systemic sclerosis: immune activation, vascular signalling, fibroblast and matrix responses, skin fibrosis, SSc-ILD and renal crisis. Cross-study synthesis retains culture, observation and trial populations; mixed-subset SSc studies are not diffuse-only evidence. Selected therapies; excludes limited cutaneous phenotype, morphea, overlap syndromes and comprehensive organ/therapy coverage.

Shared canonical identities reused where appropriate from CREST and other maps (pDC, CXCL4, interferon, IL-6, TGF-beta, dermal fibroblasts, myofibroblasts, ECM, skin fibrosis, endothelial cells, endothelin and ILD). Disease claims and assessments were authored separately. The diagram is a labelled cross-study synthesis, not one patient's sequence. It does not silently convert culture findings or transcriptomic ligand-receptor inference into proven human mechanisms.

## Retrieval and access

`pnpm curate list` confirmed no existing diffuse map before registration. Initial broad scan (2020-01-01 to 2026-10-17) failed because query exceeded 5,000 records; cursor did not advance. See `research/scan.log`.

Refined scan: `scan-07c638fdb847dc96404f3f83`, indexing/update window 2020-01-01–2026-10-17; 854 retrieved, 854 unique, 854 changes, 158 flagged records; exit 0. Exact profile query:

```text
(TITLE_ABS:"diffuse cutaneous systemic sclerosis" OR TITLE_ABS:dcSSc OR TITLE_ABS:"scleroderma renal crisis") AND (TITLE_ABS:mechanism* OR TITLE_ABS:fibrosis OR TITLE_ABS:fibroblast* OR TITLE_ABS:endothelial OR TITLE_ABS:autoantibod* OR TITLE_ABS:interleukin OR TITLE_ABS:"TGF" OR TITLE_ABS:nintedanib OR TITLE_ABS:tocilizumab OR TITLE_ABS:mycophenolate OR TITLE_ABS:cyclophosphamide OR TITLE_ABS:transplantation OR TITLE_ABS:"RNA polymerase" OR TITLE_ABS:topoisomerase)
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
| Exact candidate | PASS, exit 0: `node scripts/validate-release.mjs knowledge/diseases/diffuse-systemic-sclerosis/candidates/diffuse-systemic-sclerosis-summary-candidate-f7786448c91d.json`; `final-candidate-validation.log` |
| Registry | PASS, exit 0: `pnpm validate`; `final-registry-validation.log` |
| Local selection | PASS, exit 0: `pnpm curate preview --disease diffuse-systemic-sclerosis --candidate diffuse-systemic-sclerosis-summary-candidate-f7786448c91d`; `final-preview.log` |
| Short labels | PASS, 2 tests, exit 0: `node --test tests/short-labels.test.mjs`; `short-labels-test.log` |
| Type/product check | PASS, exit 0: `pnpm check`; 42 Astro files, no errors/warnings/hints; `check.log` |
| Build | PASS, exit 0: `pnpm build`; 165 pages; `build.log` |
| Browser initial dev | FAILED: stale Vite optimized-dependency 504 prevented hydration; `browser.log`, `browser-diagnose.mjs`. Stopped only this task's dev process and served built output. |
| Browser built first run | Assertion FAILED: expected lowercase `approved`, actual display `APPROVED`; graph, coverage, summary and packet passed. `browser-built.log`. Corrected assertion to compare case-insensitively. |
| Browser final | PASS, exit 0: `node .../browser-check.mjs`; desktop 1440×1000 and mobile 390×844, 31/31 nodes/cloud entities, exact summary and portable packet, approved therapy inspector, no horizontal overflow or page errors. `browser-final.log`, `browser-results.json`, screenshots and inspector text. Screenshots visually inspected. |
| Scientific inspection | Agent primary-source inspection only; access limits, null results and correction uncertainty retained. Independent domain review and calibrated scoring PENDING. |
| External overall verdict | NOT RUN / PENDING: Consensus discovery ran, but no independent overall assessment returned through available search/fetch tools. |

## Scientific summary

Diffuse cutaneous systemic sclerosis combines immune dysregulation, vascular abnormalities and fibrosis, with heterogeneous organ involvement. In early diffuse disease, anti-topoisomerase I antibodies mark greater interstitial lung disease prevalence, while anti-RNA polymerase III antibodies mark more extensive skin involvement and renal crisis; these associations do not prove antibody causation. Patient immune-complex preparations activated endothelial cultures and altered IL-6, TGF-beta and endothelin responses, with important differences among antibody groups. A complementary innate route links plasmacytoid dendritic cells, CXCL4–DNA complexes and interferon amplification. Effector CD8 T-cell IL-13 production correlates with skin fibrosis. Dermal culture experiments connect IL-6 trans-signalling through STAT3 and TGF-beta/SMAD3 to collagen expression, while IL-13/STAT6 can act independently of TGF-beta1. Early untreated skin studies suggest a macrophage–PDGF/TGF-beta–fibroblast vascular niche, although much of that interaction is inferred from spatial and transcriptomic data. Fibroblast and myofibroblast responses converge on matrix production in skin and lung. Renal crisis represents a vascular and kidney-injury branch, often with hypertension; renin abnormalities alone do not predict it.

This is a cross-study explanation, not a demonstrated universal causal circuit. Cell-culture activity and uncontrolled TGF-beta-blockade biomarkers cannot establish clinical benefit, and skin findings cannot automatically be transferred to lung or kidney. Nintedanib slowed FVC decline in the primary SENSCIS analysis, with missing-data sensitivity and gastrointestinal tolerability limits; skin benefit was not demonstrated. Tocilizumab missed its primary skin endpoint but showed secondary lung-function preservation in selected early inflammatory diffuse disease. Both have verified US adult SSc-ILD indications for slowing pulmonary-function decline. SLS II did not demonstrate mycophenolate superiority over cyclophosphamide; within-arm improvement is not proof of equivalence. ACE inhibitors are guideline-supported at established renal crisis, distinct from prophylaxis, and autologous transplantation has benefits and treatment-related mortality in carefully selected severe diffuse disease. The latter treatments are recorded without claiming SSc-specific regulatory approval. Most sources have abstract-level access; study independence is incompletely established. The IL-13 correction concerns attribution, while the tocilizumab trial has linked corrections requiring further appraisal; current prescribing information independently confirms its indication and overall FVC estimate. Independent scientific review and score calibration remain pending.

## Remaining work

- Independent domain review, claim entailment appraisal and calibration; automatic scores are provisional, not calibrated probabilities or principal-circuit certification.
- Resolve original tocilizumab 2020 correction and randomized-denominator discrepancy; primary-appraise EUSTAR observational null and contemporary ACEi cohort discovered in final searches.
- Screen the 847 unprocessed scan records and 158 retrieval flags; expand targeted historical retrieval where needed. Reused datasets and overlapping cohorts require independence review.
- Broader HLA/genetic, B-cell, autoantigen-specific T-cell, functional receptor autoantibody, epithelial injury, matrix-stiffness, hypoxia and detailed renal ischaemia/RAAS/TMA pathways remain incompletely curated. The vascular culture route demonstrates activation; initiating endothelial injury/death is not established by it. Optional GI/cardiac/PAH and Raynaud/digital outcomes are not a comprehensive diffuse-disease map here.
- Evaluate omitted therapies and emerging cellular therapies separately; do not infer absence of treatments from this selected six-record set.

Backlog updated to the selected local candidate. Public pointers, reviewer policy, scheduling and publication were not advanced. No commit made. Pre-existing edits to CURATION.md, shared command workflow, backlog and graph CSS were preserved; concurrent global CSS edits were also left untouched.
