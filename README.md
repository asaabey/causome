# Causome

A local, evidence-linked disease mechanism atlas with a reusable curation workflow. Astro serves static snapshots; React Flow provides the interactive map. GitHub publication is deferred.

The atlas includes the source-checked SLE candidate (21 entities, 27 relationships, three therapies) and a bounded IgA nephropathy candidate (8 entities, 8 relationships, 10 claims after a qualifying-evidence proposal). Claims retain study systems, citations, limitations and pending domain-review dispositions. **These are scientific candidates awaiting independent human review. The selected local maps include evidence-linked provisional weight/confidence appraisals and categorical therapeutic target coverage. New disease seeds and reconciled candidates receive conservative automatic appraisals by default; CREST syndrome and pre-eclampsia now demonstrate this workflow alongside the existing SLE and IgA editorial drafts. Drafts are explicitly uncalibrated and unreviewed.**

## Run locally

Use Node.js 24+ and pnpm 10.24.0. Causome uses port 4322. Set `CAUSOME_PORT` to choose a different port for development, preview and browser checks.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [the atlas](http://127.0.0.1:4322/), [the curator workbench](http://127.0.0.1:4322/curation/), or [cross-disease comparison](http://127.0.0.1:4322/compare/). A production-style local preview uses `pnpm build` followed by `pnpm preview`.

Search by name, synonym or therapy brand. Search reveals hidden groups and opens evidence. Connected links preserve incoming, outgoing and symmetric directions. The evidence shortcut works on mobile; each selection resets the inspector's scroll. Every disease map retains a complete static evidence outline without JavaScript. History distinguishes candidates from reviewed releases, and version comparison links changed records to their frozen evidence.

## Curate any disease

Give a third-party agent **[CURATION.md](CURATION.md)** as the single entry point for new-disease curation, updates and validation. It contains the task instruction, ordered runbook, commands, required handoff and scientific-validation limits. A profile defines the disease's scope and query; its first map is authored from its own inspected reports.

```sh
pnpm curate help
pnpm curate list
pnpm curate init --id disease-slug --label "Disease name" --summary "Bounded scope" --query 'TITLE_ABS:"disease name"'
pnpm curate seed --disease disease-slug --input first-map.json
pnpm curate preview --disease disease-slug --candidate candidate-id
pnpm curate scan --disease disease-slug --from YYYY-MM-DD --to YYYY-MM-DD
pnpm curate status --disease disease-slug
```

The workbench lets a curator inspect cached sources, stage contextual findings or abstentions, retain a browser draft, and export an extraction plus matching source snapshots. `curate reconcile` validates those exports against their exact base and stages a candidate, complete diff and review report. A separately configured structured-output adapter can propose findings from bounded source batches; it cannot check its own sources, approve records or supply scores. The CLI subsequently creates versioned automatic appraisals with retained input/result receipts. Use `pnpm curate auto-assess --base <candidate.json>` for an existing map; preview selection also fills an unappraised map automatically. Metadata-only confidence is conservatively capped at 1/4, and an empty therapy inventory means “No intervention curated”.

Live Europe PMC retrieval was exercised locally. The initial IgA scan consolidated 254 results into 250 records, with correction, retraction, secondary-report and preprint flags. Known-source refresh consolidated the cache to 257 records; the final scan retrieved 737 overlapping responses and retained 85 flagged records. This is a retrieval queue, not a reviewed literature synthesis. Local scan caches and drafts live in ignored `curation/workspace/`; reproducible inspected examples are in `curation/examples/`.

## Verify

```sh
pnpm validate
pnpm test
pnpm check
pnpm build
pnpm test:browser
pnpm test:performance
pnpm build:stress
pnpm test:stress
pnpm build
```

Validation covers every registered candidate, schema/reference closure, direction, source checks, disease context, calibrated scoring, lineage and scientific/view digests. The stress fixture uses synthetic 200-entity/400-relationship data, is generated only by `build:stress`, and is excluded from ordinary and public builds. Restore the normal build after benchmarking. Browser suites cover desktop 1366×768 and mobile 390×844, accessibility, keyboard exploration, curator exports, comparisons, expansion and JavaScript-free evidence. Performance reports record the pinned runner, fixture, bundle sizes and measured budgets.

## Releases and milestones

See [the milestone record](PROGRESS.md) for completed local engineering, evidence of verification and remaining acceptance gates. Format `0.3.0` adds grouped views, successors, source flags and calibrated contextual appraisals while preserving legacy unassessed snapshots. No actual domain approval, calibration, held-out evaluation or pilot result has been invented.

The [curation workflow](CURATION.md) includes template contracts and the proposed validation method. Retained verification records cover [atlas/stress checks](curation/verification/2026-10-10/engineering-verification.md) and [the current provisional appraisals](curation/verification/2026-10-10/appraisals/appraisal-verification.md).

Authenticated publication binds the exact commit, candidate digest, parent, scoring versions and warnings to independent reviewer events. Immutable root/successor storage rejects stale parents and overwrites. Public builds consume reviewed snapshots, freeze their descriptions, exclude internal workspaces, and fail closed without an approved current release. Archived static bytes can be verified and restored to a fresh directory without rebuilding.

Publication policy remains disabled and the reviewer allowlist is empty. There is no public root, remote deployment or active scheduled scan. Human source/domain review, scoring calibration when used, real held-out evaluations before scheduling, usability acceptance and staging redeployment remain their respective gates. See [scientific review](curation/policies/manual-scientific-review.md), [publication policy](curation/policies/publication-approval.md) and [launch procedure](curation/launch/PUBLICATION.md). `PRD.md` retains the acceptance contract.
