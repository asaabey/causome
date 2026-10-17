# Minimal change nephropathy — revision after external summary review

Review: `summary-reviews/9c90eda1…/external-report.md` (verdict `needs_revision`, dated 2026-10-13) against `minimal-change-nephropathy-summary-candidate-22a34a3088c7`. Agent work by Claude Opus 5.5; no human review asserted. Repository dates are UTC; agent checks ran on 2026-10-12 UTC (2026-10-13 ACST).

## Snapshot chain (all immutable)

1. `minimal-change-nephropathy-candidate-5855e3a9d51f`: full-candidate edit (`stage-a.mjs`, proposal `proposal-7e5a3cc5607960d307f6725e`). Adds `context-mcn-experimental` for animal evidence. Adds limitations reclassifying the spontaneous-remission case as clinical natural-history context, keeping CD4 activation as association only, and bounding the IL-8/TNF-alpha negative finding to its tested conditions.
2. `minimal-change-nephropathy-candidate-afc4c3d77c4c`: reconciled 11 source-checked findings (proposal `proposal-afc4c3d77c4ca7c1b207b67a`, cutoff 2026-10-12).
3. `minimal-change-nephropathy-appraised-candidate-1f40e4edb5bb`: automatic provisional appraisals.
4. **`minimal-change-nephropathy-summary-candidate-bc5dfdb78dfb`**: agent-authored two-paragraph summary (`summary-input.json`), selected as preview. New packet: `summary-reviews/689390bc5f20cba8f13b8d144977388d4523d2a60fb9a28bd381197435efaebc/`.

(`minimal-change-nephropathy-summary-candidate-32b357e83600` is the CLI's automatic extractive summary of stage 1, not used.)

## Evidence added

| PMID | Source | Finding(s) | Context |
| --- | --- | --- | --- |
| 38804512 | Hengel et al., NEJM 2024 | Prevalence (44% adult MCD; 69% active untreated); levels track activity; mouse immunization → MCD-like nephrotic syndrome, nephrin phosphorylation, cytoskeletal change | human; experimental |
| 39820038 | Hengel et al., JCI 2025 (research letter; full PMC text) | Passive transfer of patient IgG → rabbit proteinuria, effacement without deposits; nephrin tyrosine phosphorylation. n = 1 per arm, total IgG | experimental |
| 40147632 | Kidney Int 2025, adult Chinese cohort | Antibodies fall in remission, reappear before relapse (mixed MCD/FSGS) | human |
| 42015820 | Ann Med 2026 | 50%/70% positivity; correlation with proteinuria; IgG4 and Th2 (IL-4/IL-13) skew | human |
| 41736774 | Hengel et al., KI Rep 2026 (already cited) | 12/17 positive; antibody clearance with steroid remission (not a causal-benefit claim) | human |
| 17429054 | Lai et al., JASN 2007 | IL-13 overexpression in rats → foot-process fusion; nephrin down, B7-1 up | experimental |

New entity: `entity-il13`. Review issues addressed: anti-nephrin omission, the podocyte mechanism, T-cell rebalancing, B-cell/humoral involvement, IL-8 interpretation, case reclassification and heterogeneity.

## Not done / deferred

- **Feedback receipt not yet imported.** `summary-reviews/9c90eda1…/feedback.json` is complete, but `summary-feedback` rejects a check date later than today in UTC (report date 2026-10-13; UTC was still 2026-10-12). After 00:00 UTC, run: `pnpm curate summary-feedback --base knowledge/diseases/minimal-change-nephropathy/candidates/minimal-change-nephropathy-summary-candidate-22a34a3088c7.json --input curation/workspace/minimal-change-nephropathy/summary-reviews/9c90eda1963afbd4fb254ed78a38f10e3951010e54c7b8589b8ed0d0bd7a5311/feedback.json`
- CD80/B7-1 (beyond the rat finding), CTLA-4 and ANGPTL4 are not curated; the summary scope says so and does not mention them.
- Beck & Salant 2026 (review) and the 2021 mechanisms review were not used for claims (secondary literature policy).
- New mechanisms sit in the CLI's "Research additions" views; the core overview view was not re-laid out.
- The new packet has not been externally rechecked.

## Checks (2026-10-12 UTC)

- `validate-release.mjs` on all four new snapshots: valid.
- `pnpm validate`: 30 candidates valid. `pnpm check`: 0 errors/warnings/hints. `pnpm build`: 57 pages. `npx pnpm@10.24.0 test`: 98/98 pass (bare `pnpm test` fails here with spawn ENOEXEC, an environment issue).
- Built disease page contains the new summary text. No browser suites run (data-only change).

## Follow-up: map views (2026-10-13 UTC)

- `minimal-change-nephropathy-candidate-ea826765a33b`: view-only full-candidate edit (`stage-views.mjs`, proposal `proposal-a72f0cce6e3c2a0d0d53eb4c`). The default view is a two-row human-evidence layout (immune findings → anti-nephrin hub → nephrin/podocytes on top; nephrotic-syndrome hub with CD4, IL-8, effacement and proteinuria below). The experimental view is relabelled and laid out without edges crossing nodes. The redundant research view is removed. No scientific records changed.
- **`minimal-change-nephropathy-summary-candidate-08ba4223dd93`**: the same agent-authored summary reattached (`summary-input-views.json`), now the selected preview. Packet: `summary-reviews/58845de7957419c2b73bf7fb364a73f8ad1e6bd16f1460461be55c34513aa326/`.
- External review receipt imported: `knowledge/diseases/minimal-change-nephropathy/summary-reviews/summary-feedback-f87530e6b761fc2fec51ccc3.json` (bound to summary-candidate-22a34a3088c7).
- Checks: validate (33 candidates), check (0 errors/warnings), build, 98/98 tests; both views verified in a headless browser.
- The dev server "not rendered" symptom was a stale Vite dependency cache (`504 Outdated Optimize Dep`). Running build/tests, which spawn `astro build` in `web/`, while `astro dev` runs invalidates it; restart dev with `--force`.
