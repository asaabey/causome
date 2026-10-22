# Pyrophosphate review discrepancy

Local date: 2026-10-21 Darwin; checks and candidate cutoff: 2026-10-20 UTC.

Consensus returned `needs_revision` for `calciphylaxis-summary-candidate-d5f1a8f06f12` because its access to DOI [10.1016/j.jacadv.2026.103205](https://doi.org/10.1016/j.jacadv.2026.103205) was abstract-only. The full original report and exact candidate-bound feedback receipt are preserved. This is an access-limited disagreement, not evidence that the agent obtained independent approval.

The agent inspected the primary [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC13571338/) and cached its XML as `calciphylaxis-ppi-primary.xml`. `ppi-inspected-paragraphs.json` retains exact main-body paragraphs. The methods/results paragraphs explicitly describe 30 cases and 30 matched controls, the 70-person calciphylaxis cohort, 67% ESKD, short-term mortality associations, no pain-intensity correlation and substantial within-person variability. The disclosure section explicitly identifies sponsor funding and employee authors. The normalized extraction wrapper labels these cached full-text paragraphs accurately; they are not represented as a publication abstract.

The proposed correction was conditional on citable full text being unavailable. That full text is available and supports the retained details. The graph uses symmetric observational associations and the summary excludes causal deficiency or PPi-treatment benefit. No assertion was removed merely to obtain a passing external verdict. The external review receipt remains `needs_revision`; independent review of the full-text evidence remains pending. The local candidate can be inspected with that disagreement visible, under CURATION.md's local workflow. Domain review and calibration remain pending.
