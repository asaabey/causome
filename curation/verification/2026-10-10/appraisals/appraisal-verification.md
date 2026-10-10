# Local provisional-appraisal verification

This check concerns the two **unreviewed local candidates**, not a scientific publication or launch acceptance.

- SLE: `sle-appraised-candidate-df64ccfede54`, 48 assessments.
- IgA nephropathy: `iga-nephropathy-appraised-candidate-bf0656421814`, 16 assessments.
- All 64 have provisional weight/confidence appraisals and categorical therapeutic target coverage. All independent review decisions remain pending; the scoring model remains uncalibrated.
- `unit-tests.txt`: 76 unit/integration checks passed, including stale/invalid worksheet rejection, provisional publication rejection, target-category integrity, base preservation, reproducibility and invalidation after evidence changes. A subsequent five-test focused rerun added unsafe-disease-slug rejection and passed.
- `build.txt`: zero Astro errors/warnings/hints across 35 files; static build produces 18 routes.
- `browser-tests.txt`: 38 desktop/mobile checks passed, four opt-in benchmark cases skipped. They cover the exact displayed ratings, agent provenance, components, categorical direct/indirect and endpoint targets, version defaults, static history, curator coverage, keyboard navigation, accessibility and source exports.
- `browser-tests-interrupted.txt`: prior run contained a long pause and two mobile timeouts. Preserved as a failed run; the later full rerun passed.
- Health verification confirmed the selected SLE snapshot and complete local routes on port 4322. The other project on port 4321 was left running.
- The original SLE candidate was compared with its Git HEAD bytes and is unchanged. Original IgA candidates are preserved and are used as frozen bases in reproduction tests.

The source inventory binds this verification to local files rather than a new Git commit. Calibration, independent study/dataset adjudication, scientific review, automated extractor acceptance and GitHub publication are not claimed.

The two throttled performance checks passed with five cold loads each (1.6 Mbps, 150 ms latency, 4× CPU). Desktop medians: LCP 480 ms, interactive 2487 ms, inspector 97 ms. Mobile: LCP 472 ms, interactive 2470 ms, inspector 93 ms. All remain below the 2500/5000/200 ms budgets. Full measurements and runner metadata are retained in the two performance JSON files.
