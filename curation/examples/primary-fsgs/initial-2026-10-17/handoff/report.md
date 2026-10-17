# Primary FSGS with APOL1 branch: local candidate handoff

Date: 2026-10-17. Author: Codex agent. Independent scientific review pending.

## Scope and selection

Circulating-factor/immune primary FSGS with post-transplant recurrence, plus a separate APOL1-associated kidney injury branch. APOL1 disease is not classified as idiopathic primary FSGS. Excludes other monogenic podocytopathies, adaptive FSGS, virus/drug-associated disease and non-APOL1 collapsing variants. MCD-like experimental findings are explicitly labelled. Shared nephrin, anti-nephrin, podocyte and proteinuria IDs reuse MCD identities; IFN gamma remains specific rather than merged with type I interferon.

Final candidate: knowledge/diseases/primary-fsgs/candidates/primary-fsgs-summary-candidate-c0afb63eed8a.json
Manifest SHA-256: aafab97ce80a809950be139d4fb14a56d1840cda978b7156b73aee99bf0b02f3
Profile: knowledge/diseases/primary-fsgs/disease.json selects this preview. Local route: /diseases/primary-fsgs/. No public pointer, policy or schedule changed.

17 entities, 14 relationships, 23 claims, 19 evidence items, 12 sources (11 primary papers and one FDA announcement), nine contexts, eight views, two therapies. First-map findings: 15 supporting, two qualifying, one contradicting. Therapy claims reuse trial evidence, not independent replication. Automatic appraisals are provisional and uncalibrated.

## Retrieval and source access

Evidence cutoff: 2026-10-17. Actual command: pnpm curate scan --disease primary-fsgs --from 1990-01-01 --to 2026-10-17.
Run scan-ad6ec0ac05861bb2f93f9592 completed: 2,378 results, 2,368 unique records, 546 flagged records. Retrieval completion does not mean scientific screening completion. The remaining queue and flags are unresolved; the cursor is not a reviewed-through checkpoint.

Actual query: ((TITLE_ABS:"focal segmental glomerulosclerosis" OR TITLE_ABS:"FSGS") AND (TITLE_ABS:primary OR TITLE_ABS:"circulating factor" OR TITLE_ABS:nephrin OR TITLE_ABS:recurrence)) OR (TITLE_ABS:APOL1 AND (TITLE_ABS:podocyte OR TITLE_ABS:channel OR TITLE_ABS:interferon OR TITLE_ABS:inaxaplin))

Full scan artifacts remain in curation/workspace/primary-fsgs/scans/scan-ad6ec0ac05861bb2f93f9592/: report.md, report.json, papers.json, responses.json. Durable report and selected-snapshot copies are in this archive's scan directory. Full raw responses and full paper cache remain in the ignored workspace.

Supplemental Europe PMC queries included DOI:10.1056/NEJMoa2314471, DOI:10.1056/NEJMoa2202396, DOI:10.1056/NEJM199604043341402, DOI:10.1056/NEJMoa2308550; EXT_ID:42048157, EXT_ID:40147632, EXT_ID:41502813; TITLE_ABS:suPAR AND TITLE_ABS:not AND TITLE_ABS:FSGS; TITLE:APOL1 AND TITLE:cation; TITLE:APOL1 AND TITLE:interferon; TITLE:podocyte depletion; TITLE:Podocyte depletion causes glomerulosclerosis. Discovery records are in sources/discovery.json. An exploratory incorrect PMID 38804576 returned an unrelated drug-delivery report and was excluded. PMID 41502813 had no indexed abstract and was deferred. Selected primary records: sources/selected-publications.json.

Web discovery covered FSGS anti-nephrin 2024–2026, APOL1 cation transport/inaxaplin, suPAR specificity, DUPLEX, FDA FSGS approval and 2026 inaxaplin development. Primary indexed abstracts were inspected directly through Europe PMC, including the 2026 anti-nephrin null study. FDA full web announcement was inspected; exact excerpt/check provenance is in sources/fda-source-check.json. Publisher full methods, supplements and the prescribing-label PDF were not independently inspected. Source checks identify actual dated agent inspection, not human approval.

## Scientific limitations and next review

- Anti-nephrin cohort results conflict (PMIDs 38804512, 40147632, 42048157); antigen expression and cross-reactivity need full-text resolution. Pooled MCD/FSGS prevalence is not primary-FSGS prevalence.
- Negative serum suPAR biomarker evidence indirectly qualifies generalization of culture injury, rather than being a direct toxicity replication.
- APOL1 culture and transgenic-mouse findings stay separate; G1 results do not alone establish identical G2 effects, human penetrance or a universal interferon requirement.
- Rat podocyte depletion illustrates a final injury pathway, not the initiating cause in primary human FSGS. Human effacement and detailed progressive scarring require further curation.
- Inaxaplin is experimental. Mapped efficacy is a small uncontrolled phase 2a study; newer September 2026 sponsor AMPLIFIED/AMPLITUDE updates were identified in search but not fully inspected or mapped. Current development/efficacy coverage is incomplete.
- Sparsentan FDA indication is age 8+ FSGS without nephrotic syndrome. It must not be extrapolated to nephrotic primary FSGS. DUPLEX overall eGFR-slope null result is retained. Full safety-label appraisal remains outstanding.
- Steroids, calcineurin inhibitors, rituximab, plasma exchange and further candidate factors including CLCF1 are uncurated. Absence in this bounded map is not absence in medicine.
- No adjudicated research-group/dataset-family independence, comprehensive study-quality assessment or score calibration. Citation counts are not independent replication.
- Independent external research-tool review of the final packet: NOT RUN. No feedback receipt or human approval is asserted.

## Artifacts and immutable history

first-map.json retains exact quotations, source locations, study systems and dated agent checks. The graph does not embed verbatim quotations. imports retains normalized sources and extraction. contexts-candidate.json, therapy-candidate.json, stage-contexts.mjs, stage-therapies.mjs, proposals and appraisals retain inputs and changes. summary-input.json and summaries retain agent authoring provenance. No model adapter was invoked; manual pipeline metadata is not an LLM execution record.

Candidate snapshots are immutable under knowledge/diseases/primary-fsgs/candidates/. The final portable review packet is summary-reviews/c87f838838748a484e1f041a485f5f39d0a2db65a7fbe3392472b4/ (review.md, packet.json, feedback-template.json). Final summary revision: summary-c0afb63eed8a.

## Actual validation

See handoff/checks.json, check.log, build.log, browser-check.json and page.png. Final exact candidate validation: passed, exit 0. Registry validation passed within check/build. Astro check: 40 files, zero errors/warnings/hints. Production build: 114 pages, exit 0. Playwright smoke inspection on available port 4327 covered the disease page, all eight route selectors and curation page; zero page errors. Screenshot visually inspected. Data-only addition; unrelated in-progress UI changes were preserved.

Corrected failures are retained in checks.json: unsupported predicate vocabulary/qualification-only edge in initial seed; missing regulatory source studyId in first therapy proposal. Reruns passed. Engineering checks establish structure and product integration, not scientific validity. Independent summary review, human domain review and calibration: not run.

## Scientific summary

This bounded map separates circulating-factor/immune primary FSGS from genetically susceptible APOL1-associated kidney injury. In recurrent primary FSGS, patient serum increased albumin permeability in isolated glomeruli, supporting a circulating-activity hypothesis without identifying a universal factor. Anti-nephrin reactivity was reported in a minority of primary FSGS patients, while suPAR and anti-CD40 pathways contributed to injury in selected human podocyte cultures. The separate APOL1 branch links interferon-induced channel activity in human podocytes and G1-associated sodium/potassium transport in experimental cells to injury in transgenic mouse models. Podocyte-depletion experiments in rats connect loss of these cells to proteinuria and segmental sclerosis as a final injury pathway; they do not establish the initiating cause in human primary FSGS.

These branches are provisional and cannot be assembled into one demonstrated human causal circuit. Anti-nephrin findings conflict across cohorts and assay systems: a 2026 study found similarly low reactivity in patients and controls with human-cell-derived antigen, challenging broad disease specificity. A negative serum suPAR study likewise limits biomarker generalization without directly refuting culture toxicity. Inaxaplin inhibited APOL1 channels experimentally and was associated with reduced proteinuria in a small, uncontrolled 13-week phase 2a trial; long-term randomized kidney benefit is not established by that report. DUPLEX showed greater proteinuria reduction with sparsentan but no significant overall eGFR-slope advantage. The verified US sparsentan indication covers patients aged eight years and older with FSGS without nephrotic syndrome, so it must not be extrapolated to nephrotic primary FSGS. Source inspection was predominantly at abstract level; the 2026-10-17 cutoff records retrieval, not exhaustive screening. Newer inaxaplin sponsor-reported results and comprehensive immunosuppressive therapy evidence remain uncurated, and independent current-literature review is pending.
