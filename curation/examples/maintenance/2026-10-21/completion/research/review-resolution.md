# Completion-pass review resolutions

Checks were performed by the Codex agent on 2026-10-20 UTC (2026-10-21 Darwin), not by a human reviewer.

## Calciphylaxis

The additional Consensus report accepted the supplied PPi full-text findings with caveats. It incorrectly mapped supplied PPi excerpts to an unrelated sodium-thiosulfate meta-analysis. Its original citation markers and report remain unchanged; this mapping is a tool limitation, not independent verification of the PPi paper. The original primary XML and inspected result paragraphs remain in the first-pass archive.

The report's major vitamin K objection compared a different calciphylaxis trial with the candidate's actual source. The candidate cites **iPACK-HD**, DOI 10.1093/ndt/gfac191, PMID 35641194, NCT01528800. Its primary abstract was fetched again and inspected (`ipack-hd-primary.json`): 86 haemodialysis patients randomized; inactive MGP declined, with no difference in coronary-calcification progression. The graph explicitly states that this was not a calciphylaxis population. The summary accurately describes the cited trial, so it was retained. A different trial's findings cannot substitute for this source. Any newly reported calciphylaxis vitamin K efficacy signal requires its own primary-source/registry reconciliation; no efficacy claim is imported from a review.

Industry funding and employee disclosures are supplied by the independently cached PPi full text, not independently verified by the external tool. The conservative `needs_revision` historical receipts remain visible. Domain review remains pending.

## Membranous nephropathy

The first completion-pass review requested stronger NELL1 primary/secondary scope qualification and complement-pathway heterogeneity. The selected successor adds a primary-abstract-checked qualification from the 70-person, three-institution NELL1 cohort (DOI 10.1016/j.ekir.2024.02.1401). Only 11% lacked known secondary associations. This is an applicability qualification, not a causal route from secondary disease into primary MN. The revised summary explicitly calls NELL1 inclusion provisional and bounded against mixed literature, and describes non-exclusive, system-dependent complement evidence. The original external `needs_revision` receipt binds the earlier snapshot and is retained.

## Minimal change disease

The first completion-pass review requested lower-prevalence replication and FSGS overlap. Two primary abstracts were fetched and inspected: DOI 10.1093/ckj/sfaf012 (7/36 adult MCD positive by cell-based assay) and DOI 10.1016/j.jtauto.2025.100307 (15% MCD, 11% FSGS in a pediatric/young-adult cohort). Both now qualify the anti-nephrin association in the graph. The summary retains the original 44%/69% estimates as one cohort, explicitly states quantitative inconsistency, and does not present the antibody as specific or universal for MCD.

The broader IL-33/ILC2 report (DOI 10.1016/j.intimp.2022.109493) was fetched and its primary abstract inspected. Its PAN/ADM rats and podocyte/macrophage cultures are not the existing anti-nephrin mouse/rabbit context. Its context-dependent IL-13 findings remain a deferred scope extension, not a transplanted human causal claim. The selected summary explicitly confines the curated IL-13 result to an overexpression model and disclaims uniform pathogenicity. The experimental context was also corrected to include the already-curated IL-13 rat studies; it previously named only mouse/rabbit models. No new IL-33/ILC2 mechanism is asserted.

The original external `needs_revision` receipt remains bound to the earlier snapshot. The revised exact packets were submitted to a fresh current-literature check; its actual result is preserved separately and must not be inferred from this resolution note.

The final MCD snapshot `minimal-change-nephropathy-summary-candidate-a323b9cfac8b` adds claim `claim-e0af84816a76533ec517` from the methodology study PMID40490077. The final current-literature review returned **consistent_with_caveats**, no major factual error, with optional wording precision about model-specific injury. Its exact candidate-bound receipt is preserved. The revised MN snapshot also received consistent_with_caveats. These are tool reviews, not human approval.
