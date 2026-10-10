# Local milestone record — 2026-10-10

The product and reusable curation workflow are implemented locally. GitHub, remote publication and scheduling remain deferred. Scientific candidates are clearly labelled; engineering tests do not grant domain approval, calibration or evaluation acceptance.

| Milestone | Local implementation | Remaining acceptance |
| --- | --- | --- |
| 1. Graph foundation | Static Astro atlas, accessible React Flow graph, deterministic geometry and a complete JavaScript-free outline. | Complete locally. |
| 2. Curated SLE experience | Source-checked bounded map: 21 entities, 27 relationships, 40 claims, three therapies; focused views, contextual evidence and negative/qualifying findings. | Independent human source/domain review. |
| 3. Publish the MVP | Exact-commit authenticated review/CI gate, immutable root storage, public-build isolation, accessibility/performance checks, artifact archiving/restoration and health checks. | GitHub deferred; independent scientific approval, manual assistive-technology review, actual user walkthrough, reviewed-artifact staging redeployment and public hosting. |
| 4. Evidence depth/history | Immutable successors, revision and stale-base checks, complete before/after diffs and historical evidence routes; groups, calibrated-rubric validation and 200-entity/400-relationship stress fixture. | Real scoring calibration if assessed scores are used, independently approved successor, usability pilot and hosting rollback. |
| 5. Living literature workflow | Live Europe PMC retrieval, overlap/indexing/update/notice/known-source refresh, identifier deduplication, flags and attempt logs; strict manual/model extraction, immutable reconciliation packets, held-out/search evaluators and scheduling readiness. | Independent review of a real manual scan; actual reviewer-labelled held-out/search evaluations; configured model backend if desired. Weekly scans remain off. |
| 6. Additional diseases | Generic profiles, entities and routes; bounded IgA nephropathy example; shared canonical identities with separate disease evidence, assessments and layouts; cross-disease comparison. | Two independently reviewed maps; current SLE and IgA maps remain candidates. |

## Use the local product

- Atlas: <http://127.0.0.1:4322/>
- Curator: <http://127.0.0.1:4322/curation/>
- IgA mechanism map: <http://127.0.0.1:4322/diseases/iga-nephropathy/>
- IgA change comparison: <http://127.0.0.1:4322/diseases/iga-nephropathy/compare/>
- Cross-disease comparison: <http://127.0.0.1:4322/compare/>

[The curation guide](CURATION.md) explains initialization, inspected first maps, scans/imports, bounded model batches, manual drafts, source checks, reconciliation, complete-candidate changes, calibration, evaluations and recovery. Blank templates fail their gates until actual evidence and reviewers are supplied. New diseases use their own scientific scope and reports; the workflow does not claim comprehensive coverage of every disease or automatically transfer another disease's evidence.

A source-checked finding must retain its canonical endpoints, context, exact source hash/passage, location, study system, limitations and checker/date. A model cannot check its own source, invent scores or approve anything. Source updates invalidate stale browser exports. Proposal packets retain the exact extraction and source inputs as well as the complete diff. Publication additionally requires independently authenticated review of the exact candidate.

## Verified locally

Report summaries now use descriptive filenames: [engineering verification](curation/verification/2026-10-10/engineering-verification.md) and [appraisal verification](curation/verification/2026-10-10/appraisals/appraisal-verification.md). Historical source manifests retain the original paths and hashes from their verification runs; documentation renames do not represent a new verification run.

- **76 unit/integration tests passed in the latest appraisal verification**, followed by a five-test appraisal recheck. Full schema/integrity, scientific-candidate, curation, scoring, lineage, authenticated-review, health, artifact and public-build tests pass. Public-build integration uses clearly synthetic approval fixtures in temporary directories, including a root and successor; it proves isolation and historical routing without creating real approved records.
- The latest Astro verification checked all 35 source files with zero errors, warnings or hints; the ordinary static build produced 18 routes.
- **38 browser checks passed in the latest appraisal verification** (four opt-in benchmark checks skipped). Desktop/mobile browser verification covers displayed ratings and provenance, keyboard selection, search, therapy navigation, evidence shortcuts, grouped expansion, source-checked and abstention exports, persisted drafts, version/cross-disease comparison, axe checks, mobile overflow and JavaScript-free evidence.
- Cold-load and expanded-map performance reports are retained under `curation/verification/2026-10-10/`. Measurements use Chromium 156.0.8078.4, Playwright 1.64.0, Node 24.16.0 on Darwin arm64, 1.6 Mbps, 150 ms latency and 4× CPU slowdown. They are local candidate/synthetic results, not reviewed production-artifact acceptance.
- Live IgA retrieval completed locally. The final date-window/known-source run consolidated 737 overlapping API responses into 257 unique records, retained 85 flagged records and advanced only the local successful cursor. The queue includes off-topic, secondary and otherwise unsuitable records that still need screening; API retrieval is not a scientific synthesis. No twelve-run scheduled reliability claim is made.
- The committed IgA primary-report example seeds eight entities/eight relationships/nine claims; its qualification proposal preserves the original evidence and produces ten claims with a full review packet. Original snapshots retain null scores; newer local snapshots contain 64 provisional appraisals. Domain reviews remain pending.
- Immutable-file comparison passes. The original SLE candidate digest remains `352acd773aebf033bbdae9de860b26daa36a805c9b9c6830747445b7f379064e`; the original illustrative regression release is unchanged.
- `validate:publication` and `validate:launch` reject this checkout because no approved current root exists. These are intentional review gates; no remote API calls or deployments were made to satisfy them.

## Honest completion boundary

Local engineering is complete for the implemented milestone capabilities. The PRD's “done when” clauses that require independent reviewers, actual calibration/evaluation data, participants or hosting remain pending. No scientific approval, human pilot result, model-evaluation success, staging recovery or deployment has been fabricated. The reviewer policy remains disabled and empty. The ordinary local build excludes the synthetic stress route; internal curation and candidate routes are excluded from public builds.

A hosting recovery restores exact archived site bytes to a new directory. It does not move scientific history backward. Reverting scientific content requires a newly reviewed successor of the current release. Historical snapshots and original receipts remain immutable.

## Local appraisal repair — 2026-10-10

The current selectors now point to `sle-appraised-candidate-df64ccfede54` and `iga-nephropathy-appraised-candidate-bf0656421814`. Their 64 entity/relationship assessments contain explicitly provisional, agent-authored weight/confidence judgments, component/dimension rationales, contextual claim references, assessor/date and exact input/base digests. These are conservative appraisals of selected reports; abstract access and unestablished study independence limit confidence. They are not calibrated or independently reviewed. The original SLE snapshot remains byte-identical, and initial IgA candidates remain available in history.

Therapeutic leverage now displays categorical direct/indirect target coverage from the frozen therapy records, including experimental status, indication, jurisdiction and verification date. Edge categories describe endpoints rather than efficacy on the relationship. An empty therapy collection produces “No intervention curated”, not an invented score or a statement that no therapy exists. Reusable `assessment-template` / `assess` commands support the same workflow for other disease profiles. New evidence reconciliation clears prior draft appraisals for reassessment; publication rejects provisional models even with a permissive approval callback.

The repaired preview passes 76 unit/integration tests, a subsequent five-test appraisal recheck, all 38 desktop/mobile browser checks, schema/registry validation, a zero-diagnostic Astro build of 18 routes, and the port-4322 health check. A browser run with a long pause and two mobile timeouts was retained separately; its clean rerun passed. Appraisal-specific verification is stored in `curation/verification/2026-10-10/appraisals/`; earlier verification files describe the earlier snapshots and remain unchanged. Independent calibration/domain review and GitHub remain deferred.

Appraised-map performance also passes on desktop and mobile: median cold interactive times 2487/2470 ms and inspector responses 97/93 ms, under the existing 5000/200 ms budgets. Five cold loads per viewport retain the configured 1.6 Mbps, 150 ms and 4× CPU conditions.
