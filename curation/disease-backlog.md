# Candidate disease backlog

Updated 2026-10-17 after commit `2a3737f`. Two agreed diseases remain unstarted; Sjögren disease, diffuse cutaneous systemic sclerosis and the three renal backlog diseases have selected local candidates. A selected or committed candidate is not an independently approved scientific release.

## Next disease maps

| Priority | Disease | Slug | Group | Status |
| --- | --- | --- | --- | --- |
| 1 | Sjögren disease | `sjogren-disease` | Rheumatology | [Local candidate selected 2026-10-17; scientific review pending](examples/sjogren-disease/2026-10-17/handoff/report.md) |
| 2 | Diffuse cutaneous systemic sclerosis | `diffuse-systemic-sclerosis` | Rheumatology | [Local candidate selected 2026-10-17; scientific review pending](examples/diffuse-systemic-sclerosis/2026-10-17/handoff/report.md) |
| 3 | Rheumatoid arthritis | `rheumatoid-arthritis` | Rheumatology | Not started |
| 4 | Mixed connective tissue disease | `mixed-connective-tissue-disease` | Rheumatology | Not started |

Use the [CURATION.md](../CURATION.md) new-disease runbook with the scope and exclusions below:

> Read CURATION.md and follow its runbook for **new disease**. Disease: **[label and slug]**. Scope: **[scope + exclusions below]**. Evidence cutoff: **[YYYY-MM-DD]**. …

Queries for unstarted diseases are untested drafts. Run `pnpm curate list` first and refine the query after a test `curate scan`. Therapy lists are research prompts, not verified current indications; confirm jurisdiction, date and restrictions before writing therapy records.

Each new map should consolidate the disease's major mechanisms and clinical outcomes in its default overview, with substantially the same players as the word cloud. Keep study systems and uncertainty in the evidence; supplementary routes must not replace the comprehensive overview. Do not omit essential mechanisms to meet a fixed entity count.

## Backlog diseases with local maps

| Disease | Slug | Latest local work | Handoff / remaining review |
| --- | --- | --- | --- |
| Atypical haemolytic uraemic syndrome | `atypical-hus` | Consolidated overview: 29 entities, 44 relationships; all cloud entities visible | [Scientific review and calibration pending; remaining coverage gaps](examples/atypical-hus/revision-consolidated-2026-10-17/handoff/report.md) |
| Anti-GBM disease | `anti-gbm-disease` | Local candidate selected 2026-10-17 | [Scientific review and calibration pending](examples/anti-gbm-disease/initial-2026-10-17/handoff/report.md) |
| Primary FSGS with APOL1 branch | `primary-fsgs` | Local candidate selected 2026-10-17; APOL1 remains distinct from idiopathic primary FSGS | [Scientific review and unresolved gaps](examples/primary-fsgs/initial-2026-10-17/handoff/report.md) |

These use the existing-map update route in CURATION.md; do not register or seed duplicates. The original scope notes are retained below for follow-up work and do not certify complete coverage.

## Atlas inventory

Behçet’s disease: [Local candidate selected 2026-10-17; 38 entities, 52 relationships, 2 therapies; scientific review pending](examples/behcet-disease/2026-10-17/handoff/report.md).

All 16 registered diseases have selected local candidates: ANCA-associated vasculitis, anti-GBM disease, atypical haemolytic uraemic syndrome, C3 glomerulonephritis, calciphylaxis, Behçet’s disease, CREST syndrome, diffuse cutaneous systemic sclerosis, IgA nephropathy, IgG4-related disease, membranous nephropathy, minimal change nephropathy, pre-eclampsia, primary FSGS with APOL1 branch, Sjögren disease, and SLE. The registry profiles under `knowledge/diseases/` identify the exact selected candidates. Review and consolidation gaps remain disease-specific; aHUS's cloud coverage has not been established for every older map.

---

## 1. Sjögren disease

- **Slug:** `sjogren-disease`
- **Aliases:** Sjögren's syndrome, primary Sjögren syndrome, pSS, sicca syndrome
- **Scope:** Exocrine gland epithelial activation, type I interferon signature, BAFF-driven B-cell hyperactivity, anti-Ro/SSA and anti-La/SSB, ectopic germinal centres, and glandular dysfunction (dry eyes and mouth). Extraglandular and lymphoma branches are optional. A lymphoma-risk branch (MALT lymphoma) is allowed only with direct human evidence.
- **Exclusions:** secondary Sjögren with SLE or RA (contrast only), IgG4-related sialadenitis, non-autoimmune sicca, and symptomatic therapy efficacy.
- **Shared entities:** interferon, plasmacytoid dendritic cell, BAFF and B-cell entities from `sle`; plasmablast entities from `igg4-related-disease`.
- **Therapies to verify:** ianalumab (anti-BAFF-R), dazodalibep (CD40L antagonist), nipocalimab (FcRn), telitacicept. All are experimental unless verified otherwise.
- **Draft query:** `(TITLE_ABS:"Sjögren" OR TITLE_ABS:"Sjogren" OR TITLE_ABS:"Sjögren's syndrome")`

## 2. Diffuse cutaneous systemic sclerosis

- **Status:** Local candidate selected 2026-10-17 (31 entities, 44 relationships, 6 selected therapies); independent scientific review and calibration pending. [Handoff and evidence gaps](examples/diffuse-systemic-sclerosis/2026-10-17/handoff/report.md).

- **Slug:** `diffuse-systemic-sclerosis`
- **Aliases:** dcSSc, diffuse scleroderma
- **Scope:** Anti-topoisomerase I (Scl-70) and anti-RNA polymerase III autoimmunity, endothelial injury, myofibroblast activation (TGF-β, IL-6) and progressive skin and organ fibrosis. Includes an interstitial lung disease branch and a scleroderma renal crisis branch, which were excluded from the CREST map.
- **Exclusions:** limited cutaneous SSc (covered by `crest-syndrome`), morphea, overlap syndromes, and SSc sine scleroderma unless explicitly contextualised.
- **Shared entities:** endothelial vasculopathy and fibroblast activation from `crest-syndrome`. Keep the subset contexts separate rather than merging maps.
- **Therapies to verify:** nintedanib, tocilizumab (SSc-ILD); mycophenolate, cyclophosphamide; autologous HSCT; ACE inhibitors (renal crisis).
- **Draft query:** `(TITLE_ABS:"diffuse cutaneous systemic sclerosis" OR TITLE_ABS:"dcSSc" OR TITLE_ABS:"scleroderma renal crisis" OR (TITLE_ABS:"systemic sclerosis" AND TITLE_ABS:"interstitial lung disease"))`

## 3. Rheumatoid arthritis

- **Slug:** `rheumatoid-arthritis`
- **Aliases:** RA
- **Scope:** Seropositive RA. Covers shared-epitope HLA-DRB1 risk, citrullination and ACPA/RF, T-cell costimulation, synovial fibroblast and macrophage activation (TNF, IL-6, JAK-STAT), osteoclast-driven bone erosion and cartilage destruction.
- **Exclusions:** seronegative RA (contrast only), juvenile idiopathic arthritis, extra-articular disease (ILD, vasculitis) unless separately scoped later, and comparative treatment efficacy.
- **Shared entities:** B-cell and plasma cell entities from `sle`; IL-6 and fibroblast activation from `crest-syndrome`.
- **Therapies to verify:** adalimumab and other TNF inhibitors, tocilizumab, abatacept, rituximab, tofacitinib/baricitinib/upadacitinib, methotrexate. This is a dense therapy area, so cap it to target-representative agents.
- **Draft query:** `(TITLE_ABS:"rheumatoid arthritis") AND (TITLE_ABS:citrullin* OR TITLE_ABS:ACPA OR TITLE_ABS:synovial OR TITLE_ABS:"shared epitope")`
- **Notes:** The literature volume is very large. Restrict retrieval to the declared mechanisms, but include enough entities to explain the major converging pathways and outcomes comprehensively.

## 4. Mixed connective tissue disease

- **Slug:** `mixed-connective-tissue-disease`
- **Aliases:** MCTD, Sharp syndrome
- **Scope:** Anti-U1 RNP autoimmunity and HLA-DR4 association, U1 snRNP / TLR7 interferon signalling, overlap features (Raynaud's, puffy hands, arthritis, myositis), and a pulmonary arterial hypertension and ILD branch.
- **Exclusions:** undifferentiated CTD, defined overlap syndromes meeting full criteria for another disease, and classification-criteria comparison.
- **Shared entities:** nucleic-acid sensing and interferon from `sle`; vasculopathy and pulmonary arterial hypertension from `crest-syndrome`.
- **Therapies to verify:** none disease-specific expected. Record "No intervention curated" rather than borrowing SLE/SSc therapies.
- **Draft query:** `(TITLE_ABS:"mixed connective tissue disease" OR TITLE_ABS:"MCTD" OR TITLE_ABS:"anti-U1 RNP")`
- **Notes:** The primary mechanistic literature is thin. Expect a small map with low confidence, and check during scoping whether it supports a standalone map.

## Atypical haemolytic uraemic syndrome

- **Status:** Consolidated local candidate selected 2026-10-17 (29 entities / 44 relationships; complete cloud coverage); independent scientific review pending. [Handoff and deferred branches](examples/atypical-hus/revision-consolidated-2026-10-17/handoff/report.md).

- **Slug:** `atypical-hus`
- **Aliases:** aHUS, complement-mediated HUS, complement-mediated thrombotic microangiopathy, CM-TMA
- **Scope:** Faulty complement control at the endothelial surface. This covers susceptibility variants affecting CFH, CFI, CD46/MCP, C3 and CFB, CFHR1/CFHR3 deficiency, and anti-factor H autoantibodies. Retain THBD as a disputed genetic association with biochemical regulatory findings and contradictory human evidence. Converging mechanisms involve uncontrolled C5 activation and membrane attack complex (C5b-9) formation, endothelial injury, platelet consumption and microvascular thrombosis. Outcomes are haemolysis, thrombocytopenia and acute kidney injury. Triggers (pregnancy, infection) are upstream context only.
- **Exclusions:** STEC-HUS, TTP/ADAMTS13 deficiency, and secondary TMAs (malignant hypertension, drugs, transplant, autoimmune). Include them only as labelled contrast. DGKE-mediated and cobalamin-related TMA are also excluded.
- **Shared entities:** complement regulators and C3/C5 convertase entities from `c3-glomerulonephritis`; C5a/C5aR from `anca-associated-vasculitis`; endothelial dysfunction and HELLP/pregnancy-trigger context from `pre-eclampsia`.
- **Therapies to verify:** eculizumab, ravulizumab (anti-C5); iptacopan (factor B inhibitor, experimental for aHUS); plasma exchange.
- **Draft query:** `(TITLE_ABS:"atypical hemolytic uremic syndrome" OR TITLE_ABS:"atypical haemolytic uraemic syndrome" OR TITLE_ABS:"aHUS" OR TITLE_ABS:"complement-mediated thrombotic microangiopathy")`
- **Notes:** The selected consolidated map includes C5 targets and the clinical triad. Use its handoff for actual curated evidence, therapy verification, contradictory findings and deferred branches.

## Anti-GBM disease

- **Status:** Local candidate selected 2026-10-17; independent scientific review and calibration pending. [Durable handoff](examples/anti-gbm-disease/initial-2026-10-17/handoff/report.md).

- **Slug:** `anti-gbm-disease`
- **Aliases:** Goodpasture disease, anti-glomerular basement membrane disease, Goodpasture syndrome
- **Scope:** HLA-DR15-restricted autoimmunity to the hidden α3(IV)NC1 epitope (and α5(IV)NC1), including the structural conformational change that exposes it. Anti-GBM antibodies and autoreactive T cells cause linear GBM IgG deposition, complement and neutrophil injury, crescentic glomerulonephritis and an alveolar haemorrhage branch. Antibody-transfer and immunisation models stay separate from human observations.
- **Exclusions:** Alport post-transplant anti-GBM nephritis, atypical/seronegative linear IgG disease (contrast only), and diagnostic assay performance. Double-positive ANCA disease is included only as a labelled link to the ANCA map.
- **Shared entities:** neutrophil and complement injury and crescent formation from `anca-associated-vasculitis`; glomerular basement membrane entities from the existing glomerular maps.
- **Therapies to verify:** plasma exchange, cyclophosphamide, glucocorticoids; imlifidase (IgG-cleaving enzyme, experimental).
- **Draft query:** `(TITLE_ABS:"anti-GBM" OR TITLE_ABS:"anti-glomerular basement membrane" OR TITLE_ABS:"Goodpasture")`
- **Notes:** Initial local curation is complete; scientific review and remaining evidence gaps are recorded in the handoff. Future presentation updates should follow the consolidated-overview guidance.

## Primary FSGS with APOL1 branch

**Status:** Local candidate selected 2026-10-17; scientific review pending. [Handoff and unresolved review gaps](examples/primary-fsgs/initial-2026-10-17/handoff/report.md). The APOL1 branch remains distinct from idiopathic primary FSGS.

- **Slug:** `primary-fsgs`
- **Aliases:** primary focal segmental glomerulosclerosis, circulating-factor FSGS, APOL1-mediated kidney disease, AMKD
- **Scope:** Two bounded routes to the same podocyte injury.
  - **Circulating-factor / immune route:** candidate permeability factors and anti-nephrin antibodies, podocyte effacement and loss, segmental sclerosis, nephrotic syndrome and recurrence after transplant.
  - **APOL1 branch:** G1/G2 risk variants plus a second hit (for example interferon). APOL1 then forms cation channels, causing podocyte injury.
- **Exclusions:** monogenic podocytopathies (NPHS1/2, INF2, etc.), adaptive/maladaptive FSGS (obesity, reduced nephron mass), virus- and drug-associated FSGS, and collapsing variants unrelated to APOL1. The minimal change–FSGS continuum is handled by linking to the MCD map, not duplicating it.
- **Shared entities:** nephrin, anti-nephrin antibodies, podocyte effacement and nephrotic syndrome from `minimal-change-nephropathy`; interferon from `sle`.
- **Therapies to verify:** sparsentan (dual endothelin/angiotensin receptor antagonist); inaxaplin (APOL1 channel inhibitor, experimental); glucocorticoids, calcineurin inhibitors, rituximab in anti-nephrin-positive disease.
- **Draft query:** `((TITLE_ABS:"focal segmental glomerulosclerosis" OR TITLE_ABS:"FSGS") AND (TITLE_ABS:primary OR TITLE_ABS:"circulating factor" OR TITLE_ABS:nephrin OR TITLE_ABS:recurrence)) OR TITLE_ABS:"APOL1"`
- **Notes:** The highest scope risk of the renal three. Define the mechanism boundaries before scanning. The APOL1 term will pull in non-FSGS CKD literature, so screen it to kidney phenotypes.
