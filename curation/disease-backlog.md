# Candidate disease backlog

Diseases agreed for future maps, in rough priority order. Each entry has the fields the [CURATION.md](../CURATION.md) new-disease runbook asks for, so it can go straight into the start-here prompt:

> Read CURATION.md and follow its runbook for **new disease**. Disease: **[label and slug]**. Scope: **[scope + exclusions below]**. Evidence cutoff: **[YYYY-MM-DD]**. …

Queries are untested drafts. Run `pnpm curate list` first and refine each query after a test `curate scan`. Therapies listed under "verify" are ones to check. Their status and indications have not been verified here and must be confirmed with jurisdiction and date before any therapy record is written.

Existing maps (2026-10-17): atypical haemolytic uraemic syndrome (local candidate), ANCA-associated vasculitis, C3 glomerulonephritis, calciphylaxis, CREST syndrome, IgA nephropathy, IgG4-related disease, membranous nephropathy, minimal change nephropathy, pre-eclampsia, primary FSGS with APOL1 branch (local candidate), SLE.

| # | Disease | Slug | Group | Status |
| --- | --- | --- | --- | --- |
| 1 | Atypical haemolytic uraemic syndrome | `atypical-hus` | Renal / complement | [Local candidate; scientific review pending](examples/atypical-hus/revision-consolidated-2026-10-17/handoff/report.md) |
| 2 | Anti-GBM disease | `anti-gbm-disease` | Renal / autoimmune | [Local candidate; scientific review pending](examples/anti-gbm-disease/initial-2026-10-17/handoff/report.md) |
| 3 | Primary FSGS with APOL1 branch | `primary-fsgs` | Renal / podocytopathy | Local candidate added 2026-10-17; scientific review pending |
| 4 | Sjögren disease | `sjogren-disease` | Rheumatology | [Local candidate selected 2026-10-17; scientific review pending](examples/sjogren-disease/2026-10-17/handoff/report.md) |
| 5 | Diffuse cutaneous systemic sclerosis | `diffuse-systemic-sclerosis` | Rheumatology | Not started |
| 6 | Rheumatoid arthritis | `rheumatoid-arthritis` | Rheumatology | Not started |
| 7 | Mixed connective tissue disease | `mixed-connective-tissue-disease` | Rheumatology | Not started |

---

## 1. Atypical haemolytic uraemic syndrome

- **Status:** Consolidated local candidate selected 2026-10-17 (29 entities / 44 relationships; complete cloud coverage); independent scientific review pending. [Handoff and deferred branches](examples/atypical-hus/revision-consolidated-2026-10-17/handoff/report.md).

- **Slug:** `atypical-hus`
- **Aliases:** aHUS, complement-mediated HUS, complement-mediated thrombotic microangiopathy, CM-TMA
- **Scope:** Faulty complement control at the endothelial surface. This covers inherited or acquired variants in CFH, CFI, CD46/MCP, C3, CFB and THBD, CFHR1/CFHR3 deletions, and anti-factor H autoantibodies. These lead to uncontrolled C5 activation and membrane attack complex (C5b-9) formation, endothelial injury, platelet consumption and microvascular thrombosis. Outcomes are haemolysis, thrombocytopenia and acute kidney injury. Triggers (pregnancy, infection) are upstream context only.
- **Exclusions:** STEC-HUS, TTP/ADAMTS13 deficiency, and secondary TMAs (malignant hypertension, drugs, transplant, autoimmune). Include them only as labelled contrast. DGKE-mediated and cobalamin-related TMA are also excluded.
- **Shared entities:** complement regulators and C3/C5 convertase entities from `c3-glomerulonephritis`; C5a/C5aR from `anca-associated-vasculitis`; endothelial dysfunction and HELLP/pregnancy-trigger context from `pre-eclampsia`.
- **Therapies to verify:** eculizumab, ravulizumab (anti-C5); iptacopan (factor B inhibitor, experimental for aHUS); plasma exchange.
- **Draft query:** `(TITLE_ABS:"atypical hemolytic uremic syndrome" OR TITLE_ABS:"atypical haemolytic uraemic syndrome" OR TITLE_ABS:"aHUS" OR TITLE_ABS:"complement-mediated thrombotic microangiopathy")`
- **Notes:** The evidence linking cause to approved therapy is strong. This map is a good first example of a therapy showing what maintains the disease.

## 2. Anti-GBM disease

- **Status:** Local candidate selected 2026-10-17; independent scientific review and calibration pending. [Durable handoff](examples/anti-gbm-disease/initial-2026-10-17/handoff/report.md).

- **Slug:** `anti-gbm-disease`
- **Aliases:** Goodpasture disease, anti-glomerular basement membrane disease, Goodpasture syndrome
- **Scope:** HLA-DR15-restricted autoimmunity to the hidden α3(IV)NC1 epitope (and α5(IV)NC1), including the structural conformational change that exposes it. Anti-GBM antibodies and autoreactive T cells cause linear GBM IgG deposition, complement and neutrophil injury, crescentic glomerulonephritis and an alveolar haemorrhage branch. Antibody-transfer and immunisation models stay separate from human observations.
- **Exclusions:** Alport post-transplant anti-GBM nephritis, atypical/seronegative linear IgG disease (contrast only), and diagnostic assay performance. Double-positive ANCA disease is included only as a labelled link to the ANCA map.
- **Shared entities:** neutrophil and complement injury and crescent formation from `anca-associated-vasculitis`; glomerular basement membrane entities from the existing glomerular maps.
- **Therapies to verify:** plasma exchange, cyclophosphamide, glucocorticoids; imlifidase (IgG-cleaving enzyme, experimental).
- **Draft query:** `(TITLE_ABS:"anti-GBM" OR TITLE_ABS:"anti-glomerular basement membrane" OR TITLE_ABS:"Goodpasture")`
- **Notes:** A small, well-bounded map. It should be the cheapest of the renal three to curate.

## 3. Primary FSGS with APOL1 branch

Local candidate added 2026-10-17. [Handoff and unresolved review gaps](examples/primary-fsgs/initial-2026-10-17/handoff/report.md). The APOL1 branch remains distinct from idiopathic primary FSGS.

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

## 4. Sjögren disease

- **Slug:** `sjogren-disease`
- **Aliases:** Sjögren's syndrome, primary Sjögren syndrome, pSS, sicca syndrome
- **Scope:** Exocrine gland epithelial activation, type I interferon signature, BAFF-driven B-cell hyperactivity, anti-Ro/SSA and anti-La/SSB, ectopic germinal centres, and glandular dysfunction (dry eyes and mouth). Extraglandular and lymphoma branches are optional. A lymphoma-risk branch (MALT lymphoma) is allowed only with direct human evidence.
- **Exclusions:** secondary Sjögren with SLE or RA (contrast only), IgG4-related sialadenitis, non-autoimmune sicca, and symptomatic therapy efficacy.
- **Shared entities:** interferon, plasmacytoid dendritic cell, BAFF and B-cell entities from `sle`; plasmablast entities from `igg4-related-disease`.
- **Therapies to verify:** ianalumab (anti-BAFF-R), dazodalibep (CD40L antagonist), nipocalimab (FcRn), telitacicept. All are experimental unless verified otherwise.
- **Draft query:** `(TITLE_ABS:"Sjögren" OR TITLE_ABS:"Sjogren" OR TITLE_ABS:"Sjögren's syndrome")`

## 5. Diffuse cutaneous systemic sclerosis

- **Slug:** `diffuse-systemic-sclerosis`
- **Aliases:** dcSSc, diffuse scleroderma
- **Scope:** Anti-topoisomerase I (Scl-70) and anti-RNA polymerase III autoimmunity, endothelial injury, myofibroblast activation (TGF-β, IL-6) and progressive skin and organ fibrosis. Includes an interstitial lung disease branch and a scleroderma renal crisis branch, which were excluded from the CREST map.
- **Exclusions:** limited cutaneous SSc (covered by `crest-syndrome`), morphea, overlap syndromes, and SSc sine scleroderma unless explicitly contextualised.
- **Shared entities:** endothelial vasculopathy and fibroblast activation from `crest-syndrome`. Keep the subset contexts separate rather than merging maps.
- **Therapies to verify:** nintedanib, tocilizumab (SSc-ILD); mycophenolate, cyclophosphamide; autologous HSCT; ACE inhibitors (renal crisis).
- **Draft query:** `(TITLE_ABS:"diffuse cutaneous systemic sclerosis" OR TITLE_ABS:"dcSSc" OR TITLE_ABS:"scleroderma renal crisis" OR (TITLE_ABS:"systemic sclerosis" AND TITLE_ABS:"interstitial lung disease"))`

## 6. Rheumatoid arthritis

- **Slug:** `rheumatoid-arthritis`
- **Aliases:** RA
- **Scope:** Seropositive RA. Covers shared-epitope HLA-DRB1 risk, citrullination and ACPA/RF, T-cell costimulation, synovial fibroblast and macrophage activation (TNF, IL-6, JAK-STAT), osteoclast-driven bone erosion and cartilage destruction.
- **Exclusions:** seronegative RA (contrast only), juvenile idiopathic arthritis, extra-articular disease (ILD, vasculitis) unless separately scoped later, and comparative treatment efficacy.
- **Shared entities:** B-cell and plasma cell entities from `sle`; IL-6 and fibroblast activation from `crest-syndrome`.
- **Therapies to verify:** adalimumab and other TNF inhibitors, tocilizumab, abatacept, rituximab, tofacitinib/baricitinib/upadacitinib, methotrexate. This is a dense therapy area, so cap it to target-representative agents.
- **Draft query:** `(TITLE_ABS:"rheumatoid arthritis") AND (TITLE_ABS:citrullin* OR TITLE_ABS:ACPA OR TITLE_ABS:synovial OR TITLE_ABS:"shared epitope")`
- **Notes:** The literature volume is very large. The query must be mechanism-restricted, and the scope budget (15–25 entities) enforced strictly.

## 7. Mixed connective tissue disease

- **Slug:** `mixed-connective-tissue-disease`
- **Aliases:** MCTD, Sharp syndrome
- **Scope:** Anti-U1 RNP autoimmunity and HLA-DR4 association, U1 snRNP / TLR7 interferon signalling, overlap features (Raynaud's, puffy hands, arthritis, myositis), and a pulmonary arterial hypertension and ILD branch.
- **Exclusions:** undifferentiated CTD, defined overlap syndromes meeting full criteria for another disease, and classification-criteria comparison.
- **Shared entities:** nucleic-acid sensing and interferon from `sle`; vasculopathy and pulmonary arterial hypertension from `crest-syndrome`.
- **Therapies to verify:** none disease-specific expected. Record "No intervention curated" rather than borrowing SLE/SSc therapies.
- **Draft query:** `(TITLE_ABS:"mixed connective tissue disease" OR TITLE_ABS:"MCTD" OR TITLE_ABS:"anti-U1 RNP")`
- **Notes:** The primary mechanistic literature is thin. Expect a small map with low confidence, and check during scoping whether it supports a standalone map.
