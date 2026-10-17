# C3 glomerulonephritis local candidate handoff

Date: 2026-10-15. Author/checker: Codex agent. Outcome: local candidate added and selected; scientific review pending.

## Scope and evidence

Bounded C3GN map: alternative complement pathway dysregulation, acquired convertase stabilization, complement-regulatory variants and glomerular complement deposition. Dense deposit disease is excluded as a phenotype; mixed C3 glomerulopathy studies are labelled and cannot establish C3GN-specific effects. Infection-related and immune-complex glomerulonephritis are excluded. Related patient-IgG assays and the mixed-C3G APPEAR trial are explicitly distinguished from C3GN-specific observations. Evidence cutoff: 2026-10-15. Five selected primary abstracts were inspected through Europe PMC, not full-text methods. PubMed web opens returned limited content, so the indexed primary abstracts were retrieved directly from Europe PMC and retained. No model extraction adapter was used; no adapter prompt/model version or human approval is claimed.

Literature query: `(TITLE_ABS:"C3 glomerulonephritis" OR TITLE_ABS:"C3 glomerulopathy")`; creation/update window 1900-01-01 through 2026-10-15, plus notice query. Scan `scan-8aa15c7b2386d0cf0d0a6d4b` retrieved 805 records, 798 unique, 285 flagged (flags include secondary reports; this is not 285 retractions). Retrieval succeeded; screening is incomplete. Two selected reports occurred in the disease scan; three assay/historical reports were obtained with targeted PMID/title queries. Raw scan queries/responses and the 798-record queue remain under `curation/workspace/c3-glomerulonephritis/scans/scan-8aa15c7b2386d0cf0d0a6d4b/`. Copied scan reports preserve the actual queries/digests. Targeted primary-record responses are in `sources/primary-records.json` and `sources/genetics-record.json`.

The five selected source records show no retraction/concern flags in inspected provider metadata. PMID 22673887 has two Comment-in links (23364589, 23364591); these comments have not been reviewed. No comprehensive publisher/retraction check is asserted. Source checks and access limitations: `source-checks.json` and each first-map finding. Exact quotations and surrounding indexed abstracts: `first-map.json`; original provider metadata: `sources/`. Remaining scan records are unprocessed, not rejected. Carry this queue and flagged-source triage into subsequent work.

## Exact selected artifact

- Candidate: `knowledge/diseases/c3-glomerulonephritis/candidates/c3-glomerulonephritis-summary-candidate-bc0c86a1bbcb.json`
- SHA-256 manifest: `634290e4c0d52fee062844f552b1159d1f76a08207ed8e955b6aa7e3d3e3aa0f`
- Profile: `knowledge/diseases/c3-glomerulonephritis/disease.json`; previewCandidate `c3-glomerulonephritis-summary-candidate-bc0c86a1bbcb`.
- Local page: `/diseases/c3-glomerulonephritis/`; curator: `/curation/?disease=c3-glomerulonephritis`.
- Counts: 10 entities, 8 relationships, 11 claims, 5 sources, 11 evidence items, 1 aggregate context, 18 automatic provisional assessments, 0 therapy records. Findings: 8 supporting, 3 qualifying, 0 contradicting. Absence of curated contradictions is not evidence of consensus.

## Audit inputs

The required local handoff is `curation/workspace/c3-glomerulonephritis/handoff/report.md`. A portable copy of selected source/input/appraisal/summary artifacts is retained in `curation/examples/c3-glomerulonephritis/`, because workspace storage is Git-ignored. Initial seed inputs: `first-map.json` and `imports/seed-seed-8d554145c5be/`. Automatic assessment receipts: `appraisals/c3-glomerulonephritis-appraised-candidate-80e1ca3d8ba0/`. Authored summary: `summary-input.json` and `summaries/`. Final portable review packet: `summary-review/review.md`, `packet.json`, `feedback-template.json`. Original packets and all prior candidates remain immutable. There was no full-candidate proposal or version diff beyond the seed/appraisal/summary lineage.

## Actual checks

All checks below ran on 2026-10-15. Logs: `check.log`, `build.log`, `browser-check.json`; screenshot in local workspace `page.png`.

| Layer | Command / action | Result |
| --- | --- | --- |
| Exact final candidate | `node scripts/validate-release.mjs knowledge/diseases/c3-glomerulonephritis/candidates/c3-glomerulonephritis-summary-candidate-bc0c86a1bbcb.json` | Passed, exit 0; 10 entities / 8 relationships |
| Registry and types | `pnpm check` (includes `pnpm validate`) | Passed, exit 0; Astro 39 files, zero errors/warnings/hints |
| Build | `pnpm build` (includes registry validation) | Passed, exit 0; 96 pages |
| Product smoke inspection | Headless Chromium against isolated preview port 4399; disease and curator pages | Passed; disease HTTP 200, correct title and summary, no disease-page JS exceptions; full-page screenshot visually inspected |
| Primary-source entailment | Codex agent inspected five indexed abstracts and bounded each claim | Agent check only; methods/quality/full text and independent review pending |
| External overall-science check | Final packet exported and inspected locally | **Not run**; no external feedback receipt or consistency verdict |
| Calibration / claim-verifier evaluation | No supplied adjudicated dataset or independent reviewers | **Not run** |

No failed scientific/engineering validation was hidden or corrected by altering scores. A shell probe for a nonexistent optional browser-test filename returned exit 1; it was not a product test. No UI code changed and the full browser benchmark suite was not run.

## Remaining scientific gaps

The 798-record scan is not a completed systematic review. Complement variant pathogenicity, CFHR rearrangements/dimerization, C3/CFB gain of function, monoclonal gammopathy-associated disease, tissue injury mechanisms and terminal-pathway interventions need targeted primary/full-text review. Cohort overlap and independent study replication are unverified. Historical isolated-C3 diagnoses and related glomerulopathy assays may not map exactly to modern C3GN. The aggregate overview context preserves those distinctions in claims and limitations but does not provide separate subtype/trial views. Three qualifying findings retain negative assay endpoints and variable native-kidney course. No full causal circuit or universal mechanism is claimed.

APPEAR proteinuria evidence is represented as an intervention relationship. The therapy catalog, current jurisdictional approval checks and other interventions (including pegcetacoplan) are **not curated**. Zero therapy records must not be read as absence of available therapies. No clinical recommendations or long-term kidney-survival inference is made. Confidence and weight are conservative automatic, uncalibrated drafts; independent source-quality and domain appraisal remain pending.

## Scientific summary

Summary revision: `summary-bc0c86a1bbcb`. External current-literature review not run; no major-issue-resolution verdict is asserted.

C3 glomerulonephritis is represented here as a heterogeneous complement-associated renal phenotype. In a 12-case C3GN series, acquired C3 nephritic factors and complement-regulatory genetic abnormalities accompanied glomerular accumulation of alternative-pathway and terminal-complement proteins, with hematuria and proteinuria. Patient-derived biochemical assays provide a possible mechanism for one branch: nephritic-factor IgG can stabilize the alternative-pathway C3 convertase and resist its regulation. Historical isolated-C3 glomerulonephritis cohorts also identified complement-regulatory variants, but genetic association and protein deposition do not establish a single sufficient causal pathway in every patient.

Important heterogeneity remains visible. Properdin dependence altered nephritic-factor effects on terminal-pathway activity. Anti-factor H antibodies affected cofactor activity in only selected glomerulopathy samples and did not impair the reported cell-surface protection or ligand-binding assays; these broader-cohort results cannot be assumed for all C3GN. Most native-kidney patients in the small C3GN series had stable function during reported follow-up, so progression is not inevitable over that interval. In APPEAR-C3G, iptacopan reduced proteinuria relative to placebo by 35.1% at six months on background care, supporting a treatment-responsive complement contribution in the enrolled mixed-C3G population; this abstract does not establish a C3GN-specific effect or long-term kidney-survival benefit. This synthesis covers five selected primary abstracts, with incomplete literature screening, no curated regulatory-status catalog and pending independent scientific review.

Publication pointers, reviewer policy and scheduling were not advanced. Existing unrelated work was preserved.
