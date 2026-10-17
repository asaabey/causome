# Behçet disease local curation handoff — 2026-10-17

Local first-map workflow completed; independent scientific review and calibration remain pending. No publication, public pointer, scheduling, reviewer-policy or commit changes were made.

## Exact selected snapshot

- Candidate: `knowledge/diseases/behcet-disease/candidates/behcet-disease-summary-candidate-d266780f35d0.json`.
- ID: `behcet-disease-summary-candidate-d266780f35d0`.
- Manifest SHA-256: `41a7d7dd3035a960dd8bdca919760e90a5fd9e267f9b2e7b9b6767056d92e305`.
- Summary revision: `summary-d266780f35d0`; summary-input digest: `d266780f35d02ccf75b1daffa02c9bc673cf36f8a9bb0ef12050df9f47cc3b92`.
- Profile: `knowledge/diseases/behcet-disease/disease.json`; `previewCandidate` selects this exact snapshot.
- Preview: `http://127.0.0.1:4330/diseases/behcet-disease/` (own temporary server, stopped after verification). Existing servers on 4322/4323 were preserved.
- Review packet: `summary-reviews/f847700df1b336ba554f534e1efe8af53c5657ec92227d592ab3c325bca618b7/` contains `review.md`, `packet.json` and the unfilled independent-feedback template.

## Scope and retrieval

Evidence cutoff: 2026-10-17. Bounded human overview: HLA/ERAP1 and cytokine-locus susceptibility; T-cell and neutrophil mechanisms; NET/coagulation and endothelial injury; mucocutaneous, ocular, vascular, neurologic, joint and intestinal manifestations. Associations are symmetric; experimental mechanisms retain study systems. Excludes monogenic mimics, diagnostic/classification criteria and comprehensive therapy guidance. Animal feedback loops are deferred. Aliases include Behcet/Behçet disease and syndrome and Adamantiades–Behçet disease.

Initial registration had no prior map or matching backlog entry. `git status --short` showed pre-existing edits to CURATION.md, the command workflow, backlog and two CSS files; these were preserved. Shared neutrophil, NET, IFN-γ, TNF and mortality identities were checked. A broad vascular-thrombosis identity was separated from an existing cutaneous microvascular-thrombosis ID before final selection.

Required Europe PMC scan: `pnpm curate scan --disease behcet-disease --from 2000-01-01 --to 2026-10-17`, exit 0. Run `scan-00d9cf32b4b76ef6d5be3581`; 3,888 retrieved, 3,881 unique/new-or-updated, 855 flagged. The date window covers creation/update dates, not a systematic publication-date screen. Profile query:

```
(TITLE_ABS:Behcet* OR TITLE_ABS:Behçet*) AND (TITLE_ABS:neutrophil* OR TITLE_ABS:thrombosis OR TITLE_ABS:IL10 OR TITLE_ABS:IL23R OR TITLE_ABS:ERAP1 OR TITLE_ABS:Th17 OR TITLE_ABS:apremilast OR TITLE_ABS:secukinumab OR TITLE_ABS:uveitis)
```

Provider adds `(CREATION_DATE:[2000-01-01 TO 2026-10-17] OR UPDATE_DATE:[2000-01-01 TO 2026-10-17])` and a separate notice query. Exact response provenance remains in workspace `scans/scan-00d9cf32b4b76ef6d5be3581/responses.json`; query envelope, scan reports and complete title/identifier/disposition queue are preserved durably. Retrieval succeeded; scientific screening of the 3,881-record queue did not. Most remain unprocessed, including unresolved flagged records. Do not treat the scan cursor as scientific review completion.

Targeted Europe PMC primary-record searches expanded coverage for genetics, NETs, Th17, trials, clinical outcomes, intestinal mechanisms and Tc17 lesions. Initial unaccented `Behcet` queries missed relevant accented titles; refined `(TITLE_ABS:Behcet* OR TITLE_ABS:Behçet*)` queries recovered them. Exact query scripts/results are under `research/`; manual DOI/PMID records supplement the bounded scan. Consensus search/fetch queries and complete responses are in `research/consensus*.json`; actual dated interpretation and revision decisions are in `handoff/scientific-review.md`. Search ranking and targeted selection do not establish comprehensive coverage. No model extraction adapter was run; findings and checks are Codex agent work, entered through the manual contract.

## Evidence and authored artifacts

Final graph: **38 entities, 52 relationships, 59 claims/evidence items, 18 sources (16 primary reports and 2 regulatory labels), 4 contexts, 2 therapies, 90 provisional assessments, one consolidated view**. Every entity has a role claim and appears in the default view; browser coverage was 38/38 in the cloud and graph. Entity/therapy-context duplication of apremilast findings does not constitute independent replication. Unique evidence dispositions: 57 supporting and 2 qualifying claims, no curated contradicting claim. Null/qualifying findings include SHIELD and BIO-BEHÇET; the inhibitory IFN-γ assay is represented with negative polarity. No contradictory finding was silently upgraded to positive support.

Inputs and audit material (paths relative to this dated packet unless a repository path is given):

- `first-map-001.json` preserves the initial bounded seed; `first-map.json` is the expanded second seed. Both immutable candidate lineages remain under `knowledge/diseases/behcet-disease/candidates/`.
- `imports/` retains normalized source and extraction envelopes for both seeds, including exact cached quotations and source-check identity/date.
- `research/selected-primary-records.json`, `papers.json`, query result files and `PMC3810947.xml/.txt` retain original metadata, abstracts and inspected genetic full-text material. Other reports were inspected at abstract level. Full-text retrieval for PMC2923807 and PMC5369770 returned HTTP 500; no full-text inspection is claimed for those.
- `research/otezla-label.txt` and `remicade-label.txt` preserve inspected US label sections (original HTML remains workspace-only). Labels checked on 2026-10-17: OTEZLA/OTEZLA XR revised September 2026; REMICADE revised February 2025. Adult oral-ulcer apremilast approval is US-specific; infliximab is off-label for Behçet in the inspected US label. Other jurisdictions were not assessed.
- `therapy-candidate.json`, `review-candidate.json`, `add-therapies.mjs`, `review-revision.mjs`, `research/therapy-excerpts.json` and `review-excerpts.json` retain full-candidate inputs and source provenance. `proposals/proposal-03f72505be6e2e74300b7ae3/` and `proposals/proposal-6b611bb7072e3ebaaee9ef8e/` contain exact proposals and complete diffs.
- `summary-final-v2-input.json` is the final agent-authored summary input; intermediate inputs remain for audit. `appraisals/` and `summaries/` preserve actual automatic receipts and inputs. Automatic appraisals use the repository rules, are uncalibrated and provisional, and do not constitute source entailment or human review.
- `handoff/source-passage-checks.json`: all 59 quotations matched cached material after agent inspection. This deterministic result is traceability, not independent semantic verification. `handoff/browser-results.json` binds actual browser checks to the final candidate/digest.

Notices: metadata checks found related comments for PMIDs 20622878, 21724243 and 23290985; their comment texts remain unreviewed. No retraction/correction/concern signal was returned for the selected primary records inspected here, but metadata absence is not an exhaustive notice clearance. PMID 23291587 has a broad provider Meta-Analysis tag; inspection of its primary Results/Methods supports an explicit primary-GWAS adjudication. Raw metadata is retained; only the manually authored publication types omit that tag. Genetics cohorts overlap, and independent groups/datasets have not been certified.

## Checks and limits

All checks dated 2026-10-17. Actual outputs retained under `handoff/logs/`.

| Result | Command / check | Evidence |
| --- | --- | --- |
| Passed, exit 0 | `node scripts/validate-release.mjs knowledge/diseases/behcet-disease/candidates/behcet-disease-summary-candidate-d266780f35d0.json` | `final-candidate-validation.log` |
| Passed, exit 0 | `pnpm validate` | `final-registry-validation.log` |
| Passed, exit 0 | `pnpm curate preview --disease behcet-disease --candidate behcet-disease-summary-candidate-d266780f35d0` | Profile selection verified; public pointer unchanged |
| Passed, exit 0 | `pnpm check` | `final-check.log`: 42 Astro files, 0 errors/warnings/hints |
| Passed, exit 0 | `pnpm build` | `final-build.log`: 183 pages built |
| Passed, exit 0 | `node --test tests/short-labels.test.mjs` | `short-labels.log`: 2/2 passed |
| Passed, exit 0 | `node curation/workspace/behcet-disease/browser-verify.mjs` | Desktop 1440px and mobile 390px: 38 nodes, 52 edges, 38/38 cloud coverage, summary/therapy evidence interaction, summary packet HTTP 200, no horizontal overflow/page errors; JS-disabled summary/link checked |
| Passed, exit 0 | Source passage audit script | 59/59 cached quotation matches; not scientific certification |
| Corrected | Initial therapy proposal failed required source `studyId` fields | Added actual source identifiers before any proposal snapshot was created; subsequent proposal passed |
| Corrected | Browser selector expected exact “Apremilast”, but button name includes status | Narrowed to the therapy-strip button; `browser-selector-failure.log` retained; final run passed |
| Corrected | Audit helper stripped comparison symbols as HTML in plain label text | Restricted removal to actual markup tags; final 59/59 matches; no source or scientific assertion changed |
| Not run | Independent overall-science verdict / imported external summary-feedback receipt | Consensus search/fetch informed revisions, but no independent verdict endpoint was available; `scientific-review.md` discloses scope |
| Pending | Authenticated domain review, appraisal calibration, held-out checker evaluation | No approval, calibration or scientific completeness claim |

The early shell `python` command was unavailable; the retrieval script ran successfully with `python3`. No scientific retrieval result was inferred from that failed invocation. Intermediate graph validations/type/build checks also passed before the justified Tc17/comparative-trial revision; final outputs above bind the exact selected snapshot.

## Scientific synthesis

Behçet disease combines genetic susceptibility with recurrent inflammation affecting mucosa, skin, eyes and, in subsets, vessels, the nervous system, joints or bowel. HLA-B*51 and ERAP1 show a statistical interaction, while IL10 and IL23R–IL12RB2 associations implicate immune regulation without establishing a specific initiating antigen. Human blood and culture studies connect IL-21 with increased Th17 responses and fewer regulatory T cells; IL-23 can increase IL-17 production, and IL-17 and IFN-γ are elevated in active uveitis. In studied skin lesions, CD8/Tc17 cells predominated as the IL-17 source and IL-17 expression correlated with NET-forming neutrophil recruitment. A parallel neutrophil branch converges on extracellular traps (NETs): patient neutrophils form NETs, NET markers associate with vascular involvement, and DNase reduces thrombin generation in patient plasma ex vivo. A 2026 exploratory study links CD177-positive neutrophil-derived NETs and histone H3.1 to endothelial senescence and neutrophil recruitment in culture. In the intestinal subset, a separate PBMC–epithelial co-culture study links PLK1-dependent TNF release to IFI16–STING–TBK1 signalling and epithelial apoptosis. These findings connect selected immune and tissue-injury processes; phenotype links to aneurysms, neurologic injury and visual morbidity remain clinical observations.

The overview combines different patient subsets and experimental systems; it does not establish one causal circuit operating in every patient. Genetic cohorts overlap, most reports were inspected at abstract level, and the newer endothelial and intestinal mechanisms need independent replication. IFN-γ inhibited IL-17 production in one culture assay despite both cytokines being elevated in active uveitis. Subcutaneous secukinumab did not meet the primary endpoint in the Behçet uveitis SHIELD trial, qualifying the inference that IL-17 elevation predicts benefit from blockade. Apremilast reduced oral ulcers in a 207-person placebo-controlled trial and has a verified US adult oral-ulcer indication; that trial excluded major organ involvement and does not establish vascular or neurologic protection. In a separate 52-person severe vascular/CNS trial, infliximab produced more complete responses at week 22 than cyclophosphamide with glucocorticoids in both arms; this is indication-specific evidence, and Behçet is absent from the inspected US infliximab label. BIO-BEHÇET found comparable short-term outcomes for infliximab and IFN-α2a in refractory disease. Microbial triggers, broader immune pathways and treatment options remain incompletely curated. Historical cohort outcomes are not current-treated risk estimates. Independent scientific review and appraisal calibration remain pending.

## Remaining work

Independently review the frozen packet and source interpretations; inspect the related comments and more full texts; screen the retained scan queue, including flagged and deferred records. Key scientific gaps include environmental/microbial triggers, IL-1/IL-6 and broader innate regulation, complete antigen-presentation mechanisms, endothelial injury/aneurysm causality, organ-specific heterogeneity and comprehensive therapy evidence. PMID 40013981's NET–CD44–Th17 uveitis feedback is deferred because substantial evidence is experimental autoimmune uveitis rather than human Behçet disease. PMID 28166214 (additional susceptibility loci) was discovered/fetched but not incorporated into this first map; it remains follow-up work. Histological Tc17 predominance does not establish a particular endothelial autoantigen. Newer endothelial/intestinal pathways need replication. The disease hub connects phenotype associations and is not a molecular cause.

The large raw retrieval cache (about 39 MB responses + 8 MB normalized scan papers) and raw label HTML remain workspace-only. The durable packet retains selected primary records, normalized seed inputs, complete scan title/ID/disposition ledger, query provenance, reports, exact inspected excerpts, proposals, appraisals, summaries, browser evidence and this handoff. Existing user edits were preserved. Local publication/scheduling policies remain unchanged.
