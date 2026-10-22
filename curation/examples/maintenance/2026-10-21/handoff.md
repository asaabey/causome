# All-disease maintenance handoff — 2026-10-21

Cycle: update-2026-10-21-8a7698af-ea14-4c41-bcd4-8770c8d42b58. Request: use curate to update all existing disease maps.

## Outcome and limits

Retrieval completed for all 16 existing maps through local cycle date 2026-10-21 (exit 0). Three local candidates were updated and selected: AAV, SLE and calciphylaxis. The other thirteen selections were retained. This is **not a completed scientific review of all retrieved literature**: 5884 new/updated source records received a retained disposition, of which 100 have agent-authored paper-specific decisions and 5784 have deterministic title/metadata triage only. 3561 current records remain deferred; 20 earlier deferred records are explicitly carried forward. These counts are not a relevance verdict or an exhaustive literature review; current and prior backlog counts can overlap.

Scope stays bound to each existing profile and base snapshot. No source notice matched a cited base source (45 notice/linked-source records quarantined). The single changed cited CREST source affected claim-crest-calcinosis-telangiectasia-eustar; the original HTML abstract was explicitly checked, retaining mixed-SSc/association limits. Its claim remains supported and unchanged.

## Disease outcomes

Relevant counts below are a lower bound from paper-specific decisions; deferred records include relevance still unassessed. Unchanged with incomplete screening is not “no new evidence”.

| Disease | Retrieval through | New / updated | Relevant / deferred | Outcome | Final candidate |
| --- | --- | --- | --- | --- | --- |
| anca-associated-vasculitis | 2026-10-21 | 8 / 2 | 2 / 0 | updated | anca-associated-vasculitis-summary-candidate-ca3e7a1d8c0d |
| anti-gbm-disease | 2026-10-21 | 3 / 4 | 1 / 1 | unchanged · scientific screening incomplete | anti-gbm-disease-summary-candidate-824d30740aae |
| atypical-hus | 2026-10-21 | 8 / 4 | 0 / 1 | unchanged · scientific screening incomplete | atypical-hus-summary-candidate-d4ea04ecbc70 |
| behcet-disease | 2026-10-21 | 10 / 6 | 2 / 2 | unchanged · scientific screening incomplete | behcet-disease-summary-candidate-d266780f35d0 |
| c3-glomerulonephritis | 2026-10-21 | 2 / 3 | 1 / 1 | unchanged · scientific screening incomplete | c3-glomerulonephritis-summary-candidate-67b26c1308bd |
| calciphylaxis | 2026-10-21 | 37 / 0 | 2 / 16 | updated · scientific screening incomplete | calciphylaxis-summary-candidate-d5f1a8f06f12 |
| crest-syndrome | 2026-10-21 | 35 / 1 | 1 / 25 | unchanged · scientific screening incomplete | crest-syndrome-summary-candidate-b57a0717c4a3 |
| diffuse-systemic-sclerosis | 2026-10-21 | 1 / 0 | 0 / 0 | unchanged | diffuse-systemic-sclerosis-summary-candidate-f7786448c91d |
| iga-nephropathy | 2026-10-21 | 553 / 8 | 0 / 331 | unchanged · scientific screening incomplete | iga-nephropathy-summary-candidate-5bcf0968db75 |
| igg4-related-disease | 2026-10-21 | 6 / 5 | 0 / 2 | unchanged · scientific screening incomplete | igg4-related-disease-appraised-candidate-90d22ffa6cee |
| membranous-nephropathy | 2026-10-21 | 6 / 2 | 0 / 2 | unchanged · scientific screening incomplete | membranous-nephropathy-summary-candidate-a6d97ad77a83 |
| minimal-change-nephropathy | 2026-10-21 | 58 / 7 | 2 / 38 | unchanged · scientific screening incomplete | minimal-change-nephropathy-summary-candidate-08ba4223dd93 |
| pre-eclampsia | 2026-10-21 | 1818 / 24 | 0 / 1140 | unchanged · scientific screening incomplete | pre-eclampsia-summary-candidate-980515be46a7 |
| primary-fsgs | 2026-10-21 | 2 / 13 | 0 / 2 | unchanged · scientific screening incomplete | primary-fsgs-summary-candidate-c0afb63eed8a |
| sjogren-disease | 2026-10-21 | 5 / 7 | 0 / 2 | unchanged · scientific screening incomplete | sjogren-disease-summary-candidate-b62d8ddf75f2 |
| sle | 2026-10-21 | 3229 / 17 | 1 / 1998 | updated · scientific screening incomplete | sle-summary-candidate-904291fc29fb |

## What changed and why

- **SLE:** one experimental bacterial curli/DNA entity and upstream autoantibody route, with one positive and one qualifying claim from DOI 10.1371/journal.ppat.1014666. Mouse strain/stage dependence and null proteinuria are explicit; no infection-to-human-SLE or worsening-nephritis claim. This is a different study from the earlier Z-DNA preprint, which stays deferred. The consolidated default overview covers 22/22 entities.
- **AAV:** one human observational qualification to the existing alternative-complement/renal-injury relationship, from DOI 10.1016/j.ekir.2026.107056. Transcript abundance is not biochemical activation, causal proof or treatment-response prediction. The existing GPA/MPA and EGPA contexts remain separate: default 11/19 entities; the union of both scientific contexts covers 19/19. Collapsing the eosinophilic EGPA context into the ANCA loop would be misleading, so it remains an explicit overview-coverage exception.
- **Calciphylaxis:** circulating PPi added with two symmetric observational associations (case status and short-term mortality), from DOI 10.1016/j.jacadv.2026.103205. Matched/case-cohort design, 67% ESKD, null pain association, sponsor involvement and lack of PPi intervention are retained. The default overview covers 25/25 entities.

Five claims, two entities, three relationships and three sources were added across these candidates. No therapy record or regulatory indication changed. Summaries were revised to match each exact snapshot.

## External review and disagreements

Consensus MCP was actually used for disease-specific discovery, selected-paper fetches, and two independent summary-review runs. Original queries, source records, complete reports, citation markers and trace are preserved. First thread: https://consensus.app/search/independently-check-both-exact-disease-map-summary/aBbn6VVAQemyt9lS4GIaYQ/ . Final thread: https://consensus.app/search/review-both-exact-final-summary-snapshots-below-ag/kJKAQX5qTqCeadIaaSpCeQ/ . Coverage is targeted and mixed abstract/full text, not exhaustive.

AAV received consistent_with_caveats. The report's major-labeled instruction to preserve expression-versus-activation limits was already satisfied by the exact checked text; that resolution and the original report are retained. SLE's requested source distinction was clarified in a new immutable summary; the exact final snapshot was rechecked and received consistent_with_caveats, with optional wording precision remaining. Calciphylaxis received **needs_revision** because the external tool could not verify sample counts/variability/pain details from its abstract-only access. The agent's independently inspected citable full text explicitly supplies these details. Correct details were retained rather than removed to pass a check; ppi-review-resolution.md documents the discrepancy. The external needs_revision receipt remains visible; independent full-text review and domain review remain pending. No tool result is authenticated scientific approval.

## Exact candidates, counts and summaries

### anca-associated-vasculitis

Final: knowledge/diseases/anca-associated-vasculitis/candidates/anca-associated-vasculitis-summary-candidate-ca3e7a1d8c0d.json

ID: anca-associated-vasculitis-summary-candidate-ca3e7a1d8c0d

Content digest: aba6adb1474288823c6d3b7f8dea0b95fb0a3d82281307d80f357b7f461be713

Bound base: anca-associated-vasculitis-summary-candidate-12053b461b79; c46f06c3dee6188f1174d16859bda2fcfd2c38800039d0ff78db34af2bddff90

Counts: 19 entities, 21 relationships, 26 claims, 10 sources. Summary revision: summary-ca3e7a1d8c0d; cutoff 2026-10-20. Preview: /diseases/anca-associated-vasculitis/ .

Within selected GPA/MPA-spectrum evidence, patient MPO-ANCA and PR3-ANCA IgG activated human neutrophils in vitro, with TNF priming enhancing oxidative burst and degranulation. Activated-neutrophil supernatants activated serum complement and generated C5a; C5a primed further ANCA responses. These experiments support a context-bound amplification model. Factor-B- and C5-deficient mice were protected from anti-MPO renal disease. Purified anti-MPO IgG caused necrotizing crescentic glomerulonephritis in mice; pulmonary capillaritis was reported in a separate splenocyte-transfer experiment. A newly added retrospective study of 369 patients links intrarenal complement-related expression to renal severity and outcomes, but transcript abundance does not establish biochemical activation or causation, and serum and tissue measurements were weakly concordant. The study did not test whether its expression scores predict treatment response. ANCA-stimulated neutrophils released NETs containing MPO and PR3, and NETs were observed in inflamed human kidneys. Tissue presence does not prove disease initiation; serum NET measurements in one cohort did not reliably distinguish active disease from remission or correlate with BVAS and renal indices.

EGPA is represented separately rather than treated as an interchangeable ANCA-driven extension of that model. Its genetic study linked a tendency to eosinophilia with susceptibility and distinguished MPO-ANCA-positive from ANCA-negative subgroups. In selected EGPA tissue, lytic eosinophils and eosinophil extracellular traps were present in small-vessel thrombi; EETs supported platelet adhesion in vitro, but these findings do not establish the initiating cause of clinical thrombosis. In a small cohort, circulating cell-free DNA tracked activity only in the EGPA subgroup and was not shown to derive exclusively from EETs. Serum from patients in EGPA remission induced NET formation in healthy-donor neutrophils: the overall ANCA-positive/negative comparison was not significant, despite subgroup differences reported in the source. Eosinophil count correlated with NET formation without identifying the responsible serum factor. These culture, genetic and observational findings remain distinct from mouse experiments. Most historical sources were inspected at abstract level. The new complement study was inspected in full text, but its supplementary methods were not independently audited; residual selection bias, exploratory survival analyses and causal uncertainty remain. Therapy efficacy is outside this map; provisional automatic appraisals are uncalibrated, and independent domain and external summary review remain pending.

### calciphylaxis

Final: knowledge/diseases/calciphylaxis/candidates/calciphylaxis-summary-candidate-d5f1a8f06f12.json

ID: calciphylaxis-summary-candidate-d5f1a8f06f12

Content digest: d0819a6282a2c4385789b82f2975a0ee36471893d30e42b43231ea643fd145e3

Bound base: calciphylaxis-summary-candidate-9b1e60179c27; 328e540a3c2ba5ec8e4b3ada6c2283f703aa6c6c56a0910bea3f1a7a7ed0090c

Counts: 25 entities, 30 relationships, 56 claims, 37 sources. Summary revision: summary-d5f1a8f06f12; cutoff 2026-10-20. Preview: /diseases/calciphylaxis/ .

This bounded calciphylaxis map centres on small-vessel calcification together with thrombosis and vascular narrowing in predominantly dialysis-related disease. Human studies associate disease with aspects of mineral metabolism, vitamin K antagonism and reduced calcification-inhibitor activity; cultured smooth-muscle-cell and animal experiments support mechanisms involving phosphate, matrix Gla protein and fetuin-A. Human skin studies link an osteogenic programme with arteriolar mineral deposition and show thrombosis/intimal hyperplasia in lesional skin. Endothelial culture experiments add an inflammatory tissue-factor route to coagulation. The resulting model proposes convergence of calcification and vascular occlusion rather than a sufficient explanation based on mineral deposition alone. A newly added human registry study found lower circulating pyrophosphate in 30 calciphylaxis cases than in 30 matched controls; in its 70-patient cohort, lower levels were also associated with higher short-term mortality. This adds an observational calcification-inhibitor signal without demonstrating that PPi deficiency causes calciphylaxis.

Risk-factor findings vary across cohorts: phosphate and parathyroid-hormone results are not uniform, and vascular calcification can occur in clinically normal skin. Observational associations and experimental vascular calcification should not be equated with proven human calciphylaxis causation. Treatment signals are also limited: CALCIPHYX did not meet its wound or pain primary endpoints, uncontrolled sodium-thiosulfate improvement reports do not establish efficacy, and the cited vitamin K trial improved a biomarker without reducing coronary calcification progression. A secondary cinacalcet prevention analysis does not establish treatment of existing lesions. The pyrophosphate study was small, industry-funded and observational, with substantial within-person variability; PPi did not correlate with pain intensity. Raising PPi was not tested, and no treatment benefit is inferred. This is a selected-report local candidate with pending domain review.

### sle

Final: knowledge/diseases/sle/candidates/sle-summary-candidate-904291fc29fb.json

ID: sle-summary-candidate-904291fc29fb

Content digest: f9be34698291844f0295d2c302b4e4ca1bfeee108133e1108df67c245713f940

Bound base: sle-summary-candidate-f3c3742263d5; 838249cbf80a8a9de5bb0051d91d24bbc91fd9fa64aa013aa7c2b6543c720161

Counts: 22 entities, 28 relationships, 42 claims, 18 sources. Summary revision: summary-904291fc29fb; cutoff 2026-10-20. Preview: /diseases/sle/ .

This bounded SLE model connects self-reactive antibodies and nucleic-acid-containing immune complexes with innate sensing and B-cell responses. In the cited culture systems, RNA- and DNA-containing complexes stimulate TLR7- or TLR9-dependent plasmacytoid dendritic-cell interferon production. Type I interferon can increase monocyte BAFF release and promote stages of B-cell differentiation; BAFF and enhanced TLR7 signalling support B-cell survival in the cited mouse models. Autoantibody-producing cells and immune complexes provide a proposed route connecting these processes. A newly added anti-C1q mouse study, distinct from the separate Z-DNA/curli preprint, shows that bacterial biofilm curli/DNA exposure can increase anti-C1q and selected anti-dsDNA responses, adding an experimental upstream route into autoantibody production. The existing renal branch places deposited immune complexes upstream of Fc-receptor-dependent inflammation in lupus-prone mice.

The evidence spans human observations, cell cultures and animal models; it does not establish a universal, self-sufficient causal circuit for every SLE phenotype. Curli effects depended on mouse strain and disease stage: already-high responses in late-disease NZBxW/F1 mice did not increase further, and proteinuria did not significantly increase in either lupus-prone model at the measured timepoints. The biofilm experiment does not establish infection as a cause of human SLE or prove worsening nephritis. Reduced apoptotic clearance remains a proposed initiating route, TLR9 can have different effects across models, and renal immune-complex deposition alone did not produce severe nephritis in an Fc-receptor-deficient model. The cited belimumab and anifrolumab trials support selected clinical outcomes and populations, while anifrolumab and enpatoran programmes include negative primary endpoints. Target engagement, an approved indication and benefit across all manifestations remain distinct conclusions.

## Appraisals and validation

Reconciliation regenerated automatic appraisals as documented by CURATION.md. AAV and calciphylaxis had no changes to existing displayed numeric/categorical metrics. SLE had **29 existing assessment metric changes** when its older agent-authored provisional worksheet was replaced by current conservative automatic rules (for example BAFF mechanistic weight 45 → 30, clearance 20 → 15). These are appraisal-policy recalculations, not 29 new biological findings. Every before/after value is retained in candidate-bindings.json and the final diff; the original editorial candidate remains immutable. Scores remain uncalibrated, with pending domain review.

| Check | Actual result | Log/evidence |
| --- | --- | --- |
| update-all --plan | passed, 16 maps | bases preserved in retrieval-index.json |
| update-all --to 2026-10-21 | passed, exit 0, all 16 | report.json/report.md and logs/update-all.log |
| Three exact candidate validators | passed | IDs/digests above; browser and final registry also bind these candidates |
| pnpm validate (final) | passed, exit 0, 148 candidates | logs/final-validate.log |
| pnpm check | passed, exit 0, zero errors/warnings/hints | logs/check.log |
| pnpm build | passed; final rebuild after last scan to refresh curator queue | logs/final-build.log |
| node --test tests/short-labels.test.mjs | passed, 2 tests | logs/short-labels.log |
| Browser, three changed disease pages | passed: exact summary and packet ID/digest, graph node counts, no page exceptions or overflow | research/browser/results.json and screenshots |
| Mobile calciphylaxis | passed: no horizontal overflow | research/browser/mobile.png |
| Primary scientific review | partial, only actual inspections described | paper-dispositions.json; extracted exact passages |
| Domain review/calibration | pending | no human review invented |

An initial SLE reconciliation using the local calendar date as cutoff failed automatic appraisal because the CLI uses the prior UTC date; the failed log and unselected immutable snapshots are preserved. Corrected scientific authoring/check/cutoff dates use actual UTC 2026-10-20, while the retrieval cycle remains local 2026-10-21. An explicit 2026-10-21 appraisal worksheet was also generated before that correction and is unselected. Connector requests exceeding the tool's 10,000-character limit and one transient search rate limit were retried; actual successful requests/reports are retained.

## Artifacts and unfinished work

Inputs, exact inspected source XML/HTML, source-check/extraction worksheets, proposal preparation scripts, Consensus searches/fetched records, verbatim external reports, review resolution and browser screenshots are in the companion research directory. Final bindings/digests and complete diffs are in candidate-bindings.json and *-final-diff.json. Proposal inputs are retained in the named disease proposal directories; durable copies accompany this handoff. No model adapter was configured or invoked; manual agent extraction is identified as codex-agent-manual-source-curation-v1. All appraisals are provisional automatic rules, not calibration or human review.

paper-dispositions.json is the paper-level ledger with IDs, full canonical source-content hash, decision, reason, scope/access level, affected IDs, cycle date and proposal path. It distinguishes deterministic title/metadata triage from agent-authored source decisions. It does not treat titles as support for positive claims. source-notice-audit.json retains all notices and bindings; carried-backlog.json retains all 20 earlier unresolved items. retrieval-index.json preserves actual queries/windows/counts and raw-cache paths. Baseline metadata refreshes remain separate from new evidence.

Large complete raw responses, full cache snapshots and the 5,884-record scan packet collection remain in ignored curation/workspace/ at the exact paths in retrieval-index.json; they are **workspace-only**, not claimed to be preserved by a Git checkout. The durable directory preserves authored inputs, selected exact source evidence, extraction/proposal/appraisal/summary packets, review reports, dispositions, source notices and all handoff bindings.

Priority pending work includes source-notice/original-paper reconciliation for uncited flagged records; the IgAN Gd-IgA1 insufficiency correspondence (no available passage), MN NELL1/PLA2R complement subtype comparison, Behcet human-versus-mouse SPHK1 and IRF8 identity checks, IgG4 organ-specific macrophage/fibrosis findings, and model/context checks for new MCD/primary-FSGS/Sjogren studies. The 2026-10-15 therapy/prevention and Z-DNA/APOL1 preprint backlog remains open. New queries surfaced thousands of older newly cached records; they must not be silently dropped in the next cycle.

All changes remain local candidates. No public pointer, publication gate, reviewer policy, schedule or commit was advanced. Pre-existing edits in web/src/components/MechanismMap.tsx, graph/EvidenceInspector.tsx and graph/graph.css were preserved; integration checks ran against that working tree.
