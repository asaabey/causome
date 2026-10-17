# C3 GN continuation: Consensus-assisted evidence expansion

Date / curator: 2026-10-15 / Codex agent. Outcome: expanded local candidate selected; independent scientific review and publication remain pending. This continues the initial bounded candidate without overwriting any candidate snapshot.

## Final bound artifact

- Candidate: `knowledge/diseases/c3-glomerulonephritis/candidates/c3-glomerulonephritis-summary-candidate-67b26c1308bd.json`
- ID: `c3-glomerulonephritis-summary-candidate-67b26c1308bd`
- Manifest SHA-256: `364ebd83f67a1e9a45595a20a7c68e06348854625111a3fa943a944679482edf`
- Summary revision: `summary-67b26c1308bd`
- Profile / selection: `knowledge/diseases/c3-glomerulonephritis/disease.json`, previewCandidate as above.
- Local route: `/diseases/c3-glomerulonephritis/`; curator: `/curation/?disease=c3-glomerulonephritis`.
- Evidence cutoff: 2026-10-15. Scope: Bounded C3GN map: acquired convertase dysregulation, complement-regulatory and CFHR structural variants, glomerular complement deposition and variable renal course. Related mixed-C3G assay/cohort evidence and mixed-C3G/IC-MPGN trials retain separate contexts. Dense deposit disease and immune-complex GN are excluded as mapped phenotypes; their inclusion in cited studies is explicit. Selected proximal complement therapies include verified US indications through 2026-10-15; no universal causal circuit or comprehensive therapy catalog is claimed.

Counts: **18 entities, 17 relationships, 29 claims, 29 evidence items, 12 sources (10 primary reports and 2 FDA labels), 2 therapies, 7 contexts/views and 43 automatic provisional assessments**. Evidence categories: 21 supporting, 8 qualifying, 0 contradicting. Forty of 43 assessments have automatic weight/confidence values; three remain without usable contextual primary support. Forty-three have categorical therapy coverage. Automatic ratings are uncalibrated; no independent review or study-independence calibration is implied.

## What changed and why

The previous selected base was `c3-glomerulonephritis-summary-candidate-bc0c86a1bbcb` (digest `634290e4c0d52fee062844f552b1159d1f76a08207ed8e955b6aa7e3d3e3aa0f`). Its 10 entities / 8 relationships / 11 claims / five abstracts are retained in historical snapshots. The full-candidate proposal binds that exact base. Trial exposure remains an entity-to-outcome relationship; distinct therapy records carry molecular target, regulatory scope and safety limitations. This avoids treating a regulatory indication as a new randomized result.

Added CFHR5 exon 2–3 duplication, altered FHR5 protein and binding phenotype; familial CFHR3-1 association; expanded CFHR5 progression evidence; and the modern C3G driver cohort. Full-text review limits the classic nephritic-factor experiments to a predominantly DDD discovery cohort (>80%) and four volume-selected purified-IgG samples for SPR. The modern cohort reports that over half of its comprehensively characterized C3GN subgroup lacked an identifiable driver. Localized glomerular dysregulation remains a hypothesis. The CFHR5 protein's enhanced cofactor activity qualifies a simple global loss-of-function explanation. The expanded founder study is not independent replication of the original pedigrees.

Added US-labelled iptacopan and pegcetacoplan therapy records with target and population limits. Preserved the original VALIANT secondary-endpoint qualification separately from the August 2026 FDA label, which includes reducing loss of kidney function. Both labels' encapsulated-bacterial infection warnings are retained. No head-to-head efficacy comparison, C3GN-only treatment estimate, non-US approval or lifelong kidney-failure prevention is claimed. Separate pathology, nephritic-assay, anti-FH-assay, familial, modern-cohort, APPEAR and VALIANT views prevent cross-context scoring/circuit inference.

## Actual research, access and unfinished screening

**Consensus MCP was used as requested:** four search calls returned 80 results / 79 distinct paper IDs; seven fetch calls inspected six mapped/retained records and one deferred eculizumab report. Exact queries, date, scope and tool limitations: `consensus-research-log.json`. Raw search/fetch results: `sources/consensus-*.json`. Per-paper title/snippet disposition: `sources/consensus-dispositions.json`. Fetched citations with original Consensus URLs, authors, year, journal, citation counts and DOI: `consensus-bibliography.md`. Unfetched title/snippet results remain deferred, not scientifically rejected. Consensus search/filter behavior and indexing do not establish exhaustive coverage.

The initial Europe PMC scan window (1900-01-01 through 2026-10-15) retrieved 805 records / 798 unique, with 285 provider flags. Original scan reports, exact query/response digests and the unscreened queue remain in the initial packet/workspace; no second scan or cursor advance was manufactured. This revision adds targeted retrieval from Consensus discovery, existing selected PMIDs and FDA records. It does not complete screening of the 798-record queue. Carry both that queue and this revision's deferred Consensus results forward.

Full-text sections actually inspected: PMC4438675 (C3GN clinical/complement/proteomic study), PMC3608896 (nephritic-factor methods/results), PMC2935536 (CFHR5 genetics/binding/limitations) and PMC10851021 (modern C3G driver cohort). Raw XML and selected body-text extracts are under `sources/`. CFHR3-1 full-text retrieval failed HTTP 500 twice; only its inspected abstract supports the mapped association. CFHR5 expanded-cohort, anti-FH, historical isolated-C3 and both phase 3 trial records retain their actual abstract-level access limits. Newly accessed full texts supplement earlier source checks; unchanged historical claim text that says abstract-only describes the original inspection, not a full methods appraisal.

FDA PDFs are archived under `sources/`; sections 1, 5, 12.1 and relevant clinical-study sections were inspected via web PDF text. `sources/regulatory-checks.json` records current FDA registry corroboration, including the 2026-08-20 pegcetacoplan indication update. The March 2025 iptacopan label was used for its C3G indication and corroborated against the current FDA orphan approvals entry; it is not asserted to be the latest label for unrelated indications. All sources have agent inspection only. Source metadata does not establish absence of all corrections/retractions; original C3GN comments lack abstracts and remain unreviewed. VALIANT has two Comment-in links; their full reports also remain unreviewed. No corrective notice was silently cleared.

## Audit artifacts and lineage

This complete revision packet is portable under `curation/examples/c3-glomerulonephritis/revision-2026-10-15/`; original first-map, quotations and initial receipts remain one directory above. Required current local handoff: `curation/workspace/c3-glomerulonephritis/handoff/report.md`.

- Authored full-candidate input and generator: `candidate-input.json`, `author-revision.mjs`, `revision-metadata.json`.
- Complete proposal and diff: `proposal/` (original `curation/workspace/c3-glomerulonephritis/proposals/proposal-ef628fb61a78a07d4a49e89c/`). The CLI persisted candidate-002, then a new automatically appraised candidate and extractive summary.
- Exact quotes/checker/date/categories: `claim-evidence-receipts.json`. Normalized source-passage checks: `passage-checks.json` (23 matched primary passages; 6 FDA passages manually inspected). Matching is traceability, not semantic assurance.
- Source-document hashes: `source-manifest.json`.
- Appraisal input/result: `appraisal/`, binding `c3-glomerulonephritis-appraised-candidate-c7fdac3e8a2c`.
- Connected synthesis: `summary-input-final.json`; earlier input preserved. Final summary uses the expanded scope; prior summary candidates remain immutable.
- Exact final external-review packet: `summary-review/review.md`, `packet.json`, `feedback-template.json`. No feedback receipt was fabricated.
- No extraction model adapter was invoked. The CLI's full-candidate proposal labels its route manual; scientific authorship/source checks are Codex agent work, never authenticated human review. No unsupported model-version assertion is made.

## Actual validation

All actions ran 2026-10-15; `validation-results.json` includes commands, outcomes, corrected failures and access failures.

| Check | Result / artifact |
| --- | --- |
| Exact final candidate validation | Passed, exit 0; `c3-glomerulonephritis-summary-candidate-67b26c1308bd` / digest above |
| `pnpm check` | Passed, exit 0; 39 Astro files, zero errors/warnings/hints; `check.log` |
| `pnpm build` after final scope clarification | Passed, exit 0; registry/type checks and 100 pages; `build.log` |
| Targeted Chromium smoke | Passed, exit 0; all seven routes, both therapy searches/inspectors, final bound curator snapshot, desktop/mobile width, no page JS errors; `browser-check.mjs`, `browser-check.json` |
| Screenshot inspection | Desktop therapy view visually inspected; `therapy-desktop.png`; mobile screenshot retained, horizontal overflow check passed |
| Scientific support | Agent inspection within the access scopes above; independent domain appraisal pending |
| Independent complete-summary review | **Not run**. Consensus exposed search/fetch and existing-thread read/poll tools, but no research-dispatch endpoint. Returned records were evaluated by the same curation agent, so no independent Consensus verdict is claimed. |
| Calibration / held-out evaluation | **Not run**, no real independently adjudicated dataset supplied |

Initial pre-proposal validation caught missing FDA study IDs and empty trial-view relationship lists; corrected before proposal storage. Two smoke assertions initially failed due to the selected text container/case and curator hydration timing; corrected assertions then passed, with no changes to UI or science to make them pass. Full benchmark suites were not rerun for this data-only update.

## Remaining gaps

Pending: independent review of the final exact summary packet, primary-source study-quality appraisal and calibration; complete screening/dispositions for the baseline queue; relevant comments; C3/CFB gain-of-function variants and additional CFHR functional studies; monoclonal-gammopathy mechanisms and clone-directed treatment; chronic injury/remodeling and longer-term outcomes. Some source cohorts may overlap beyond the explicitly shared CFHR5 founder dataset; no independent replication credit was assigned. Modern cohort variant filters do not prove pathogenicity of every rare variant. C3/C3b is intentionally a combined target node and not a complete cleavage/reaction network.

Eculizumab's fetched six-patient mixed-DDD/C3GN uncontrolled report shows variable response, but full primary methods and C3GN-specific outcomes were not inspected sufficiently here; it remains deferred rather than approved or rejected in this catalog. Other interventions and non-US regulatory jurisdictions remain uncurated. Both existing and newly retrieved unresolved records must be carried forward; successful retrieval is not a completed scientific review.

## Final connected summary

C3 glomerulonephritis comprises heterogeneous complement-associated kidney injury rather than a single universal circuit. C3GN biopsies and clinical series link alternative-pathway abnormalities with glomerular complement deposits, hematuria and proteinuria. Patient-IgG experiments show that nephritic factors can stabilize C3 convertase, but the classic assay cohort was predominantly dense deposit disease, and terminal-pathway activity varied between samples. Familial evidence identifies a different branch: a CFHR5 duplication cosegregated with C3GN and produced a protein with altered surface-complement binding; its increased cofactor activity argues against a simple loss of all function. CFHR3-1 rearrangements provide another familial association. These mechanisms remain incomplete: more than half of the C3GN subgroup in a modern comprehensively characterized cohort had no identifiable driver. Local glomerular dysregulation is a proposed explanation, not a demonstrated mechanism for that group.

Clinical course and treatment response also vary. Stable function in a small native-kidney C3GN series does not negate progression seen in the expanded CFHR5 founder cohort. In mixed-population randomized trials, iptacopan reduced proteinuria versus placebo by 35.1% at six months and pegcetacoplan by 68.1% at week 26; different populations and designs prevent a direct efficacy comparison or isolated C3GN estimate. The original VALIANT analysis did not show a significant histologic activity-score difference and did not formally test subsequent eGFR endpoints. Separately, the August 2026 US pegcetacoplan label includes reducing proteinuria and loss of kidney function in patients aged at least 12 with C3G or primary IC-MPGN; the inspected US iptacopan label covers proteinuria reduction in adults with C3G. Those regulatory statements do not establish lifelong prevention of kidney failure. Both labels warn of serious encapsulated-bacterial infections. This bounded, Consensus-assisted synthesis retains mixed-disease and assay limitations, incomplete screening and pending independent scientific review.

No public pointer, reviewer policy, schedule or unrelated user work was changed.
