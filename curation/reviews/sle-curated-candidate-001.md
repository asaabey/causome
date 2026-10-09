# Milestone 2 — SLE candidate review packet

Candidate: `sle-curated-candidate-001` · revision `sle-curated-candidate-001-r1` · evidence cutoff 2026-10-10

Content digest: `352acd773aebf033bbdae9de860b26daa36a805c9b9c6830747445b7f379064e`

Scope: 21 entities, 27 relationships, 40 claims, 17 source records and 3 therapies.

## Review disposition

Source checks are preliminary curation performed by Codex on 2026-10-09–10. Every claim is pending human domain review; reviewer identity and decision date remain null. No scientific approval or public release has been asserted. Structural validation cannot establish whether the synthesis is scientifically correct.

The candidate and build are reviewable now. The domain reviewer must assess the complete map, individual source interpretations and the initial release note before approval. Most primary reports were checked at abstract level; source records disclose access scope. Full-text examination is still required wherever an abstract is insufficient for the proposed interpretation.

## Initial candidate note

Initial source-checked candidate: 21 entities, a proposed maintaining circuit and feedback loop, a renal branch, and three therapies. Human cultures, rare human genetics, mouse experiments and clinical trials are distinguished at each claim. This bounded synthesis has not received human domain review; all scores remain unassessed. It is not a published scientific release.

## Scope and qualifications

The maintaining view depicts a proposed cycle: nucleic-acid immune complexes → TLR7 → pDCs → IFN → BAFF → B cells → plasmablasts → antibody-secreting cells → autoantibodies → complexes. It is an editorial synthesis across experimental systems, not a directly demonstrated universal human circuit. CD40 activation and IL-6 requirements remain visible in the supporting claims and the complete view.

Upstream disturbances include impaired apoptotic clearance and a rare TLR7 gain-of-function variant. The clearance-to-persistence route is labelled as a hypothesis. The renal branch uses activating Fc-receptor γ-chain deletion in lupus-prone mice; complex composition is not assumed to match the human pDC assays.

TLR9-deficiency findings qualify a simple disease-promoting interpretation. Renal complex deposition is explicitly insufficient on its own in the Fc-receptor deletion experiment. Therapy records preserve the negative TULIP-1 endpoint and WILLOW dose-response objective. Empty categories mean none recorded, not no evidence exists.

The map intentionally excludes broader T-cell, complement, NET, metabolic and organ-specific pathways. These scope budgets are met without presenting exhaustive coverage or assessing numerical importance.

## Source selection

A 2002 BLyS/APRIL paper was excluded after a retraction notice was identified. The IFN-α–BLyS route instead cites the directly relevant SLE monocyte study. See the [retraction notice](https://www.nature.com/articles/s41590-026-02446-1.pdf) and [SLE monocyte report](https://pubmed.ncbi.nlm.nih.gov/24942493/).

Reports and claims retain shared study identities; multiple claims from one report do not imply independent replication. Regulatory labels establish US licensed indications. The enpatoran sponsor announcement is used only to establish phase 3 development, separately from the primary WILLOW efficacy report.

## Claim ledger

All rows have disposition **pending domain review**. Each claim has a specific source location and study system in the JSON candidate and website outline.

| Claim | Interpretation | Study identity |
| --- | --- | --- |
| `claim-clearance-debris` | hypothesis | [PMID:9663482](https://pubmed.ncbi.nlm.nih.gov/9663482/) |
| `claim-debris-complexes` | hypothesis | [PMID:9663482](https://pubmed.ncbi.nlm.nih.gov/9663482/) |
| `claim-rna-complexes` | mechanistic | [PMID:16230478](https://pubmed.ncbi.nlm.nih.gov/16230478/) |
| `claim-dna-complexes` | mechanistic | [PMID:16230478](https://pubmed.ncbi.nlm.nih.gov/16230478/) |
| `claim-antibodies-complexes` | mechanistic | [PMID:16230478](https://pubmed.ncbi.nlm.nih.gov/16230478/) |
| `claim-complexes-tlr7` | mechanistic | [PMID:16230478](https://pubmed.ncbi.nlm.nih.gov/16230478/) |
| `claim-complexes-tlr9` | mechanistic | [PMID:16230478](https://pubmed.ncbi.nlm.nih.gov/16230478/) |
| `claim-tlr7-pdc` | mechanistic | [PMID:16230478](https://pubmed.ncbi.nlm.nih.gov/16230478/) |
| `claim-tlr9-pdc` | mechanistic | [PMID:16230478](https://pubmed.ncbi.nlm.nih.gov/16230478/) |
| `claim-pdc-ifn` | mechanistic | [PMID:16230478](https://pubmed.ncbi.nlm.nih.gov/16230478/) |
| `claim-ifn-ifnar` | mechanistic | [US-label:SAPHNELO:2026-04](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/761451Orig1s000lbl.pdf) |
| `claim-ifn-baff` | mechanistic | [PMID:24942493](https://pubmed.ncbi.nlm.nih.gov/24942493/) |
| `claim-monocytes-baff` | mechanistic | [PMID:24942493](https://pubmed.ncbi.nlm.nih.gov/24942493/) |
| `claim-complexes-baff` | mechanistic | [PMID:24942493](https://pubmed.ncbi.nlm.nih.gov/24942493/) |
| `claim-baff-bcells` | mechanistic | [PMID:10587360](https://pubmed.ncbi.nlm.nih.gov/10587360/), [US-label:BENLYSTA:2026-08](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2fa3c528-1777-4628-8a55-a69dae2381a3) |
| `claim-variant-tlr7` | causal | [DOI:10.1038/s41586-022-04642-z](https://www.nature.com/articles/s41586-022-04642-z) |
| `claim-tlr7-bcells` | mechanistic | [DOI:10.1038/s41586-022-04642-z](https://www.nature.com/articles/s41586-022-04642-z) |
| `claim-bcells-blasts` | mechanistic | [PMID:12932356](https://pubmed.ncbi.nlm.nih.gov/12932356/) |
| `claim-ifn-blasts` | mechanistic | [PMID:12932356](https://pubmed.ncbi.nlm.nih.gov/12932356/) |
| `claim-pdc-il6` | mechanistic | [PMID:12932356](https://pubmed.ncbi.nlm.nih.gov/12932356/) |
| `claim-il6-plasma` | mechanistic | [PMID:12932356](https://pubmed.ncbi.nlm.nih.gov/12932356/) |
| `claim-blasts-plasma` | mechanistic | [PMID:12932356](https://pubmed.ncbi.nlm.nih.gov/12932356/) |
| `claim-plasma-antibodies` | mechanistic | [DOI:10.1038/ni.3175](https://www.nature.com/articles/ni.3175) |
| `claim-complexes-fcr` | mechanistic | [PMID:9461440](https://pubmed.ncbi.nlm.nih.gov/9461440/) |
| `claim-fcr-kidney` | mechanistic | [PMID:9461440](https://pubmed.ncbi.nlm.nih.gov/9461440/) |
| `claim-complexes-kidney` | hypothesis | [PMID:9461440](https://pubmed.ncbi.nlm.nih.gov/9461440/) |
| `claim-renal-not-sufficient` | mechanistic | [PMID:9461440](https://pubmed.ncbi.nlm.nih.gov/9461440/) |
| `claim-ifn-activity` | association | [PMID:9933442](https://pubmed.ncbi.nlm.nih.gov/9933442/) |
| `claim-belimumab-mechanism` | mechanistic | [US-label:BENLYSTA:2026-08](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2fa3c528-1777-4628-8a55-a69dae2381a3) |
| `claim-belimumab-status` | interventional | [US-label:BENLYSTA:2026-08](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2fa3c528-1777-4628-8a55-a69dae2381a3) |
| `claim-belimumab-trial` | interventional | [NCT00424476](https://pubmed.ncbi.nlm.nih.gov/21296403/) |
| `claim-anifrolumab-mechanism` | mechanistic | [US-label:SAPHNELO:2026-04](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/761451Orig1s000lbl.pdf) |
| `claim-anifrolumab-status` | interventional | [US-label:SAPHNELO:2026-04](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/761451Orig1s000lbl.pdf) |
| `claim-anifrolumab-trial` | interventional | [NCT02446899](https://pubmed.ncbi.nlm.nih.gov/31851795/) |
| `claim-anifrolumab-negative` | interventional | [NCT02446912](https://pubmed.ncbi.nlm.nih.gov/38229377/) |
| `claim-enpatoran-mechanism` | mechanistic | [NCT05162586:Cohort-B](https://pubmed.ncbi.nlm.nih.gov/42107374/) |
| `claim-enpatoran-status` | interventional | [ELOWEN:NCT07332481:NCT07355218](https://www.emdgroup.com/en/news/enpatoran-phase-3-first-dose-30-04-26.html) |
| `claim-enpatoran-trial` | interventional | [NCT05162586:Cohort-B](https://pubmed.ncbi.nlm.nih.gov/42107374/) |
| `claim-enpatoran-negative` | interventional | [NCT05162586:Cohort-B](https://pubmed.ncbi.nlm.nih.gov/42107374/) |
| `claim-tlr9-context` | mechanistic | [PMID:16973389](https://pubmed.ncbi.nlm.nih.gov/16973389/) |

## Verification

- 23 data/geometry tests pass, including missing provenance, mismatched claims, therapy status verification and publication rejection.
- Astro type checks and the four-page static build pass without warnings.
- Browser checks: 1366×768 desktop and 390×844 mobile; all views and therapies; node/relationship selection and focus; directed arrows versus symmetric association; no horizontal page overflow.
- JavaScript-disabled browser: complete entities, relationships, claims, source links and all three therapy records remain usable.
- The reviewer allowlist and authenticated publisher remain unconfigured. Milestone 3 is not complete.
