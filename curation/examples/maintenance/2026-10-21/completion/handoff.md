# All-disease maintenance: continuation handoff, 2026-10-21

This continues the [first-pass handoff](../handoff.md). The first-pass archive and its manifest remain unchanged. This report supersedes its candidate bindings/status for the current working tree.

## Actual outcome

Retrieval completed for **all 16 existing maps** through local cycle date 2026-10-21. **Five** local candidates were updated: ANCA-associated vasculitis, calciphylaxis, SLE, membranous nephropathy and minimal change nephropathy. Eleven selections were retained. Candidate/registry checks, type checks, build and targeted browser checks establish local integration only.

**Scientific screening of every retrieved record is not complete.** Of 5884 changed records, 3557 remain deferred; 20 earlier unresolved records are still carried forward (counts can overlap). Most of this queue has only deterministic title/metadata triage, not primary-source review. The supplementary ledger revises 12 actual paper-specific decisions; it does not relabel the remaining queue as reviewed. This is a completed local-candidate handoff with a substantial unfinished scientific queue, not a claim that all disease evidence is current or scientifically approved.

## Disease selections

| Disease | New / updated records | Deferred current records | Local outcome | Exact selected candidate |
| --- | --- | --- | --- | --- |
| anca-associated-vasculitis | 8 / 2 | 0 | updated local candidate | anca-associated-vasculitis-summary-candidate-ca3e7a1d8c0d |
| anti-gbm-disease | 3 / 4 | 1 | retained selection | anti-gbm-disease-summary-candidate-824d30740aae |
| atypical-hus | 8 / 4 | 1 | retained selection | atypical-hus-summary-candidate-d4ea04ecbc70 |
| behcet-disease | 10 / 6 | 2 | retained selection | behcet-disease-summary-candidate-d266780f35d0 |
| c3-glomerulonephritis | 2 / 3 | 1 | retained selection | c3-glomerulonephritis-summary-candidate-67b26c1308bd |
| calciphylaxis | 37 / 0 | 16 | updated local candidate | calciphylaxis-summary-candidate-d5f1a8f06f12 |
| crest-syndrome | 35 / 1 | 25 | retained selection | crest-syndrome-summary-candidate-b57a0717c4a3 |
| diffuse-systemic-sclerosis | 1 / 0 | 0 | retained selection | diffuse-systemic-sclerosis-summary-candidate-f7786448c91d |
| iga-nephropathy | 553 / 8 | 331 | retained selection | iga-nephropathy-summary-candidate-5bcf0968db75 |
| igg4-related-disease | 6 / 5 | 2 | retained selection | igg4-related-disease-appraised-candidate-90d22ffa6cee |
| membranous-nephropathy | 6 / 2 | 0 | updated local candidate | membranous-nephropathy-summary-candidate-6c64ff75abce |
| minimal-change-nephropathy | 58 / 7 | 38 | updated local candidate | minimal-change-nephropathy-summary-candidate-a323b9cfac8b |
| pre-eclampsia | 1818 / 24 | 1140 | retained selection | pre-eclampsia-summary-candidate-980515be46a7 |
| primary-fsgs | 2 / 13 | 0 | retained selection | primary-fsgs-summary-candidate-c0afb63eed8a |
| sjogren-disease | 5 / 7 | 2 | retained selection | sjogren-disease-summary-candidate-b62d8ddf75f2 |
| sle | 3229 / 17 | 1998 | updated local candidate | sle-summary-candidate-904291fc29fb |

## Changes made in this continuation

- **Membranous nephropathy:** one primary-abstract qualification from the 17 PLA2R/9 NELL1 comparison (DOI 10.1111/nep.70288). Lower C3/C4d deposition does not prove functional complement activation or direct slit injury; proteomic differences were not significant. External feedback then prompted another qualification from the 70-person NELL1 cohort (DOI 10.1016/j.ekir.2024.02.1401), explicitly bounding primary-only applicability against frequent secondary associations. No therapy claim was imported. The consolidated overview now covers 19/19 entities, including previously omitted NELL1, epitope spreading and IgG1-3.
- **Minimal change nephropathy:** a human hemopexin-activity association (DOI 10.1007/s00467-005-1936-3) adds a distinct circulating-factor hypothesis without causal sufficiency. This corrects the first-pass disposition's erroneous statement that hemopexin was already in the map. External review prompted primary-abstract qualifications from two lower-prevalence anti-nephrin cohorts (DOI 10.1093/ckj/sfaf012; 10.1016/j.jtauto.2025.100307), retaining FSGS overlap and non-universal detection. A further methodological qualification (DOI 10.1016/j.kint.2025.05.018) retains method/antigen-specific false positives and negatives. The experimental context now explicitly includes the already-curated IL-13 rat models as well as anti-nephrin mouse/rabbit models. Human and animal findings remain in separate contexts. Default overview covers 11/11 entities and the human relationships; animal relationships remain in their supplementary view. A short cloud label was added for hemopexin activity.
- **Calciphylaxis:** the existing PPi candidate is retained. Additional review accepted the supplied full-text results with caveats, but misattributed their citation markers to another paper. Its vitamin K objection compared a different trial; a fresh primary-abstract check of the actual cited iPACK-HD trial (PMID35641194) supports the retained biomarker/CAC-null wording. Original objections and the mapping/access limits remain visible, without invented independent approval.

AAV and SLE retain the first pass's selected candidates and source safeguards. The 45 source-notice/linked-source records remain quarantined; none matches a cited bound base source. CREST's changed cited abstract was rechecked in the first pass and retained.

## Research and external review

Consensus MCP was actually used, with selected records fetched before citation. Each primary abstract used for the new graph assertions was independently obtained from Europe PMC and inspected by the agent. Full text is **not** claimed for those abstracts. Thirty-seven additional primary XML files were downloaded during access recovery, but downloading is not inspection: only the aHUS abstract extraction is marked as inspected in the disposition supplement; the other files remain retrieval artifacts. A whole-atlas Consensus request returned no usable supported answer; this failed research coverage is preserved, not reported as a successful review.

The original completion-pass kidney review requested revisions. Source-checked qualifications and new immutable summaries followed. The second exact-snapshot review found **no major MN error**, recorded as consistent_with_caveats, but requested additional MCD assay-validity caution. That methodology paper was independently checked and added to the MCD graph and final summary. Historical needs_revision receipts remain bound to their original snapshots. The final MCD report is consistent_with_caveats, with no major factual error; preserved verbatim in research/mcd-final-summary-review.json and its Markdown document, with exact candidate-bound feedback receipt.

Review threads, full verbatim documents with citation markers, actual input messages, fetched records, original source metadata and actual limitations are in research/. Source-identity disagreements and scope decisions are documented in [review-resolution.md](research/review-resolution.md). Reports are external tool feedback, not authenticated domain review or appraisal calibration. The IL-33/ILC2 primary abstract was inspected but its distinct PAN/ADM and culture contexts remain deferred rather than merged into a human causal graph.

## Exact bindings and scientific summaries

### anca-associated-vasculitis

Final path: knowledge/diseases/anca-associated-vasculitis/candidates/anca-associated-vasculitis-summary-candidate-ca3e7a1d8c0d.json

ID: anca-associated-vasculitis-summary-candidate-ca3e7a1d8c0d

Content digest: aba6adb1474288823c6d3b7f8dea0b95fb0a3d82281307d80f357b7f461be713

Bound base: anca-associated-vasculitis-summary-candidate-12053b461b79; digest c46f06c3dee6188f1174d16859bda2fcfd2c38800039d0ff78db34af2bddff90

Counts: 19 entities, 21 relationships, 26 claims, 10 sources. Summary revision summary-ca3e7a1d8c0d; evidence cutoff 2026-10-20. Local preview /diseases/anca-associated-vasculitis/ .

Within selected GPA/MPA-spectrum evidence, patient MPO-ANCA and PR3-ANCA IgG activated human neutrophils in vitro, with TNF priming enhancing oxidative burst and degranulation. Activated-neutrophil supernatants activated serum complement and generated C5a; C5a primed further ANCA responses. These experiments support a context-bound amplification model. Factor-B- and C5-deficient mice were protected from anti-MPO renal disease. Purified anti-MPO IgG caused necrotizing crescentic glomerulonephritis in mice; pulmonary capillaritis was reported in a separate splenocyte-transfer experiment. A newly added retrospective study of 369 patients links intrarenal complement-related expression to renal severity and outcomes, but transcript abundance does not establish biochemical activation or causation, and serum and tissue measurements were weakly concordant. The study did not test whether its expression scores predict treatment response. ANCA-stimulated neutrophils released NETs containing MPO and PR3, and NETs were observed in inflamed human kidneys. Tissue presence does not prove disease initiation; serum NET measurements in one cohort did not reliably distinguish active disease from remission or correlate with BVAS and renal indices.

EGPA is represented separately rather than treated as an interchangeable ANCA-driven extension of that model. Its genetic study linked a tendency to eosinophilia with susceptibility and distinguished MPO-ANCA-positive from ANCA-negative subgroups. In selected EGPA tissue, lytic eosinophils and eosinophil extracellular traps were present in small-vessel thrombi; EETs supported platelet adhesion in vitro, but these findings do not establish the initiating cause of clinical thrombosis. In a small cohort, circulating cell-free DNA tracked activity only in the EGPA subgroup and was not shown to derive exclusively from EETs. Serum from patients in EGPA remission induced NET formation in healthy-donor neutrophils: the overall ANCA-positive/negative comparison was not significant, despite subgroup differences reported in the source. Eosinophil count correlated with NET formation without identifying the responsible serum factor. These culture, genetic and observational findings remain distinct from mouse experiments. Most historical sources were inspected at abstract level. The new complement study was inspected in full text, but its supplementary methods were not independently audited; residual selection bias, exploratory survival analyses and causal uncertainty remain. Therapy efficacy is outside this map; provisional automatic appraisals are uncalibrated, and independent domain and external summary review remain pending.

### calciphylaxis

Final path: knowledge/diseases/calciphylaxis/candidates/calciphylaxis-summary-candidate-d5f1a8f06f12.json

ID: calciphylaxis-summary-candidate-d5f1a8f06f12

Content digest: d0819a6282a2c4385789b82f2975a0ee36471893d30e42b43231ea643fd145e3

Bound base: calciphylaxis-summary-candidate-9b1e60179c27; digest 328e540a3c2ba5ec8e4b3ada6c2283f703aa6c6c56a0910bea3f1a7a7ed0090c

Counts: 25 entities, 30 relationships, 56 claims, 37 sources. Summary revision summary-d5f1a8f06f12; evidence cutoff 2026-10-20. Local preview /diseases/calciphylaxis/ .

This bounded calciphylaxis map centres on small-vessel calcification together with thrombosis and vascular narrowing in predominantly dialysis-related disease. Human studies associate disease with aspects of mineral metabolism, vitamin K antagonism and reduced calcification-inhibitor activity; cultured smooth-muscle-cell and animal experiments support mechanisms involving phosphate, matrix Gla protein and fetuin-A. Human skin studies link an osteogenic programme with arteriolar mineral deposition and show thrombosis/intimal hyperplasia in lesional skin. Endothelial culture experiments add an inflammatory tissue-factor route to coagulation. The resulting model proposes convergence of calcification and vascular occlusion rather than a sufficient explanation based on mineral deposition alone. A newly added human registry study found lower circulating pyrophosphate in 30 calciphylaxis cases than in 30 matched controls; in its 70-patient cohort, lower levels were also associated with higher short-term mortality. This adds an observational calcification-inhibitor signal without demonstrating that PPi deficiency causes calciphylaxis.

Risk-factor findings vary across cohorts: phosphate and parathyroid-hormone results are not uniform, and vascular calcification can occur in clinically normal skin. Observational associations and experimental vascular calcification should not be equated with proven human calciphylaxis causation. Treatment signals are also limited: CALCIPHYX did not meet its wound or pain primary endpoints, uncontrolled sodium-thiosulfate improvement reports do not establish efficacy, and the cited vitamin K trial improved a biomarker without reducing coronary calcification progression. A secondary cinacalcet prevention analysis does not establish treatment of existing lesions. The pyrophosphate study was small, industry-funded and observational, with substantial within-person variability; PPi did not correlate with pain intensity. Raising PPi was not tested, and no treatment benefit is inferred. This is a selected-report local candidate with pending domain review.

### membranous-nephropathy

Final path: knowledge/diseases/membranous-nephropathy/candidates/membranous-nephropathy-summary-candidate-6c64ff75abce.json

ID: membranous-nephropathy-summary-candidate-6c64ff75abce

Content digest: 3df1e4da6b6d6f018a8f088a70f0eada4b028dc6fc77cbda8036781a626fd2be

Bound base: membranous-nephropathy-summary-candidate-a6d97ad77a83; digest ad55638557f0588b5b948ee5bfd7e8c088409c64ed3183d400941722dfdde2c2

Counts: 19 entities, 33 relationships, 48 claims, 22 sources. Summary revision summary-6c64ff75abce; evidence cutoff 2026-10-20. Local preview /diseases/membranous-nephropathy/ .

Primary membranous nephropathy shares an antigen-specific podocyte autoantibody principle, but antigen-defined subtypes differ in frequency, serology and clinical associations and are increasingly treated as partly distinct entities. Autoantibodies, IgG4-predominant though not IgG4-exclusive, bind a podocyte-associated antigen, not all of which are cell-surface proteins: PLA2R in most inspected adult cases, THSD7A in a smaller PLA2R-negative subgroup, NELL-1 in selected PLA2R-negative cases, and semaphorin 3B, HTRA1 or rarer putative targets beyond those. The evidence differs in kind by antigen: deposit-eluted IgG recognized PLA2R and THSD7A, patient sera recognized NELL-1, semaphorin 3B and HTRA1, and the seven putative mass-spectrometry targets were recovered from immune complexes and co-localized with IgG in the deposits without comparable serological evidence. Anti-PLA2R levels tracked clinical status and proteinuria, and epitope spreading beyond the cysteine-rich domain was an independent risk factor for poor renal outcome. HLA-DQA1 and PLA2R1 risk loci were associated with biopsy-proven disease in white-ancestry cohorts.

Antigen-specific rodent models supply directional evidence: podocyte expression of human PLA2R1 produced antibodies, deposits and nephrotic syndrome, lymphocyte-deficient animals developed neither, and Thsd7a-knockout mice resisted antibody transfer. These do not establish one human effector route. Patient-biopsy assays detected all three complement initiation pathways, with proximity assays favouring the classical pathway; factor-B-null mice were protected and lectin-pathway blockade preserved slit proteins in culture. A newly added retrospective comparison of 17 PLA2R-associated and nine NELL1-associated cases found lower C3 and C4d deposition in NELL1 disease. Deposition is not functional activation, proteomic complement differences were not significant, and this study did not test slit-diaphragm injury. Effector evidence also differs by system: C5b-9 was required for slit-protein proteolysis in culture and C5 deficiency partly reduced albuminuria, while membrane-attack-complex inhibition did not restore albumin permselectivity on a glomerulus-on-a-chip and anti-THSD7A antibodies injured podocytes in C3-deficient mice. These non-exclusive pathways differ by subtype, assay and experimental system; none is established as universal. The under-1-to-4.9% frequencies concern seven putative targets, not NELL-1. In a separate 70-person NELL1 series only 11% lacked known secondary associations, including drugs, autoimmunity or malignancy. NELL1 identity does not establish primary disease; its inclusion is bounded and provisional against mixed literature, with secondary associations excluded. Evidence rests on agent-inspected abstracts; therapy efficacy and independent domain review remain outside the completed work.

### minimal-change-nephropathy

Final path: knowledge/diseases/minimal-change-nephropathy/candidates/minimal-change-nephropathy-summary-candidate-a323b9cfac8b.json

ID: minimal-change-nephropathy-summary-candidate-a323b9cfac8b

Content digest: 0583713c1ed4908abb441a7c257ac056ecf7f30e225e12996700ae14d3da330a

Bound base: minimal-change-nephropathy-summary-candidate-08ba4223dd93; digest 6b14c7cea37c38f58baf04e98bb927829699998d3286921191b371a42ebcfd51

Counts: 11 entities, 15 relationships, 23 claims, 15 sources. Summary revision summary-a323b9cfac8b; evidence cutoff 2026-10-20. Local preview /diseases/minimal-change-nephropathy/ .

Primary minimal change disease (MCD) is represented here as an immune-associated podocytopathy with heterogeneous upstream pathogenesis, foot-process effacement and nephrotic proteinuria. Anti-nephrin autoantibodies identify a subset: one multicentre cohort detected them in 44% of adults with MCD and 69% with active untreated disease. Levels tracked activity and proteinuria, fell during remission and reappeared before relapse; human antibody detection remains quantitatively inconsistent. A cell-based assay cohort detected antibodies in 7/36 adults with MCD (19.44%); another pediatric/young-adult cohort found 15% MCD and 11% FSGS positivity. Anti-nephrin is neither universal nor specific to MCD. Human biopsy findings associate antibodies with podocyte IgG. Nephrin immunization in mice induced an MCD-like syndrome, nephrin phosphorylation and podocyte cytoskeletal changes. Patient IgG transferred to a rabbit caused proteinuria, effacement without deposits and nephrin phosphorylation. These experiments demonstrate injury in selected models; human assay results do not establish a settled causal mechanism or explain antibody-negative disease. Anti-nephrin-positive patients also had IgG4 predominance, Th2-skewed cytokines and a non-significant plasmablast trend; their sequence is unresolved. A human study found higher hemopexin protease activity despite lower hemopexin concentration during MCD relapse, compared with remission. This supplies a separate observational circulating-factor signal, not proof that hemopexin causes human MCD.

A two-cohort methodology study found method- and antigen-dependent false positives and negatives: approximately half of 24 MCD samples had weak signals detectable only by immunoprecipitation-Western blotting, while strong cross-assay signals occurred in two FSGS samples. Assay standardization and orthogonal confirmation therefore matter; human seropositivity cannot be equated with pathogenic antibody activity. The rabbit experiment used total IgG from one patient in one recipient, rather than purified nephrin-specific antibody. The hemopexin comparison included 18 relapsing patients and 23 in post-prednisolone remission, leaving treatment and stage confounding; its tissue assay did not establish in vivo causation. Peripheral CD4 activation remains associative. IL-13 overexpression caused albuminuria, effacement and nephrin/B7-1 changes in rats; effects remain model-dependent, not uniformly pathogenic or necessary in humans. Urinary IL-8 rose in relapse, yet the same report did not support a disease-specific IL-8/TNF-alpha role under tested conditions. No upstream factor is established as universal. Concurrent steroid-induced remission and antibody clearance do not isolate a treatment mediator. Secondary causes, other glomerulopathies and treatment efficacy are excluded. Human and animal graph contexts remain distinct; most sources were inspected at abstract level, with domain review and calibration pending.

### sle

Final path: knowledge/diseases/sle/candidates/sle-summary-candidate-904291fc29fb.json

ID: sle-summary-candidate-904291fc29fb

Content digest: f9be34698291844f0295d2c302b4e4ca1bfeee108133e1108df67c245713f940

Bound base: sle-summary-candidate-f3c3742263d5; digest 838249cbf80a8a9de5bb0051d91d24bbc91fd9fa64aa013aa7c2b6543c720161

Counts: 22 entities, 28 relationships, 42 claims, 18 sources. Summary revision summary-904291fc29fb; evidence cutoff 2026-10-20. Local preview /diseases/sle/ .

This bounded SLE model connects self-reactive antibodies and nucleic-acid-containing immune complexes with innate sensing and B-cell responses. In the cited culture systems, RNA- and DNA-containing complexes stimulate TLR7- or TLR9-dependent plasmacytoid dendritic-cell interferon production. Type I interferon can increase monocyte BAFF release and promote stages of B-cell differentiation; BAFF and enhanced TLR7 signalling support B-cell survival in the cited mouse models. Autoantibody-producing cells and immune complexes provide a proposed route connecting these processes. A newly added anti-C1q mouse study, distinct from the separate Z-DNA/curli preprint, shows that bacterial biofilm curli/DNA exposure can increase anti-C1q and selected anti-dsDNA responses, adding an experimental upstream route into autoantibody production. The existing renal branch places deposited immune complexes upstream of Fc-receptor-dependent inflammation in lupus-prone mice.

The evidence spans human observations, cell cultures and animal models; it does not establish a universal, self-sufficient causal circuit for every SLE phenotype. Curli effects depended on mouse strain and disease stage: already-high responses in late-disease NZBxW/F1 mice did not increase further, and proteinuria did not significantly increase in either lupus-prone model at the measured timepoints. The biofilm experiment does not establish infection as a cause of human SLE or prove worsening nephritis. Reduced apoptotic clearance remains a proposed initiating route, TLR9 can have different effects across models, and renal immune-complex deposition alone did not produce severe nephritis in an Fc-receptor-deficient model. The cited belimumab and anifrolumab trials support selected clinical outcomes and populations, while anifrolumab and enpatoran programmes include negative primary endpoints. Target engagement, an approved indication and benefit across all manifestations remain distinct conclusions.

## Verification and appraisal limits

- Candidate and registry validation: passed for 174 candidate snapshots; exact final bindings are also checked against the rendered summary-review packets. See logs/causome-completion-verified-validate.log.
- pnpm check: passed with zero errors, warnings or hints; logs/causome-completion-verified-check.log.
- pnpm build: passed; logs/causome-completion-verified-build.log.
- Short-label tests: passed, 2 tests; logs/causome-completion-verified-short-labels.log.
- Browser: exact selected MN/MCD summaries and candidate ID/digest packets, 19/19 and 11/11 default entity coverage, no page exceptions or horizontal overflow; research/browser/results.json and screenshots. First-pass AAV/SLE/PPi browser evidence remains in ../research/browser/.
- Full candidate diffs and metric changes: candidate-bindings.json and *-final-diff.json. MN/MCD existing displayed metrics were unchanged by conservative reappraisal. SLE retains the documented 29 older provisional metric changes from automatic recalculation; these are not new biological findings.
- Source/domain review and calibrated appraisals: pending. No held-out checker qualification or human approval was invented.

## Retained artifacts and unfinished work

The completion archive contains authored inputs, selected primary records, exact abstract/extraction passages, Consensus searches/fetches and verbatim reports, proposal and automatic-appraisal packets, summary packets, feedback inputs, final diffs and actual check logs. artifact-manifest.json hashes the completion archive; the parent manifest still hashes the unchanged first pass. Full retrieval caches remain workspace-only at the original paths in ../retrieval-index.json; no durable full-cache preservation is claimed.

The current paper-level ledger retains keys, source-content hashes, decisions, reasons, access level, affected IDs, cycle date and proposal paths. disposition-revisions.json identifies the 12 records reconsidered during this continuation. The new graph evidence discovered by external review is additionally retained in the normalized *-review-papers.json and *-assay-papers.json inputs and immutable proposal packets. Earlier carry-forward remains in ../carried-backlog.json. Do not rerun the first-pass triage script over this supplement and erase these decisions.

Still pending: systematic primary-source review of the large deferred queue; mixed-species and organ-context proposals for Behcet, IgG4 and Sjogren findings; missing-access sources and notices; earlier Z-DNA/APOL1 preprints and therapy/prevention questions; final domain review/calibration. Unchanged selections with deferred records must not be described as no-new-evidence verdicts. No source access or decision was fabricated to close a counter.

Pre-existing UI edits in MechanismMap.tsx, EvidenceInspector.tsx and graph.css were preserved. All results remain local candidates; no public pointer, reviewer policy, schedule or commit was advanced.
