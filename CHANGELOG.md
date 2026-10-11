# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `curate update-all` with a no-network planning mode, per-disease failure isolation, existing-map bindings, incremental source packets, separate baseline refreshes and affected-claim lists; the monthly runbook includes runnable script commands and backlog limitations.

- Monthly incremental disease-maintenance runbook: existing-map bases, delta screening, unresolved backlog, source-notice handling, explicit no-change outcomes and concise per-disease impact reports, with the missing queue/disposition tooling identified.

- Bold, linked mediator mentions in scientific summaries on the curator and disease pages, including snapshot-specific evidence links and common name variants; portable review text remains unchanged.

- Overall scientific-summary review: embedded one- or two-paragraph graph-bound summaries, default extractive drafts, five agent-authored local summaries, portable current-literature review prompts/packets, browser copy/edit/export and immutable external-feedback receipts. Changed snapshots require a new review; feedback cannot grant publication approval.

- Default automatic provisional appraisals after seeding, reconciliation and unappraised proposals/previews; versioned context/evidence rules, retained reproducible input receipts, a standalone `auto-assess` command and browser worksheet export. Unknown study quality caps automatic confidence at 1/4; therapeutic coverage is categorical and source-derived.

- Disease-independent curation CLI, local source queue and draft/export workbench, live Europe PMC scans, persistent-identifier deduplication, overlap/broad refresh, correction/retraction flags, failure-safe cursors and attempt logs.
- Strict manual/model extraction contracts, exact source/base/prompt binding, contextual reconciliation, immutable proposal packets and complete scientific/view diffs.
- Contextual scoring/calibration logic and held-out/search evaluators with blank reviewer templates; independent calibration, evaluations and approvals remain pending.
- 64 evidence-linked provisional weight/confidence appraisals across the local SLE and IgA maps, categorical therapeutic target coverage, explicit agent/date/base provenance, and reusable appraisal worksheets. Evidence changes invalidate draft scores; provisional appraisals cannot publish.
- Generic disease registry, a bounded IgA nephropathy source-checked example, shared-identity comparison, version browsing, grouped expansion and a synthetic 200-entity/400-relationship benchmark.
- Immutable successor storage, record revision checks, stale-parent rejection and verified archived-site restoration.

- Local atlas search across mediator names, synonyms and therapy brand names, with keyboard access and direct navigation to evidence on desktop and mobile.
- Milestone 3 root-publication tooling for live independent GitHub approval and CI verification, immutable release storage, current-pointer routing and separate public builds.
- Pinned desktop/mobile browser accessibility and keyboard checks, throttled performance measurement, static release-health metadata, launch artifact archiving and a gated GitHub Pages workflow.
- Explicit pending records and launch procedure for scientific approval, screen-reader review, user walkthrough and staging redeployment.
- Source-linked SLE candidate with 21 entities, 27 relationships, 40 claims and three therapies, including study systems, source locations and qualifying or negative evidence. Human domain review remains pending; original snapshots retain unassessed scores.
- Focused mechanism views, entity focus controls, therapy inspection and a complete static evidence outline accessible without JavaScript.
- Review packet and candidate validation tests covering provenance, therapy integrity and rejection of publication before domain review.

### Changed

- Removed human-review and approval-pending reminders from the local interface, including summaries, ratings, evidence inspection, history and shared page notices. Source provenance, scientific limitations and underlying review records remain available.

- Made root `CURATION.md` the single agent entry point for new diseases, updates and validation, including task instructions, an ordered runbook and required evidence/validation handoff. Reused the existing workflow guide rather than adding a duplicate.

- Consolidated documentation around one root README; curation template instructions are part of `CURATION.md`, and publication and verification guides use descriptive filenames.

- The atlas now displays the Milestone 2 candidate while preserving the original illustrative snapshot for regression checks.
- Extended the snapshot contract and validator to distinguish source checking from domain approval and verify therapy status sources and claim references.

### Deprecated

### Removed

- Superseded concept drafts, standalone visual prototypes, the early milestone-3 verification summary and generated local browser/test caches. Frozen disease snapshots, source inputs and dated audit records are retained.

### Fixed

- Persist the chosen curation disease in the page URL so its saved draft is restored after reload even when additional diseases change the default workspace.

- Preserve source-to-target direction in connected-relationship labels, distinguish symmetric associations, use the active route's context, and reset the inspector scroll position on selection.
- Keep the selected evidence shortcut beside the diagram and focus the inspector when following search, target or relationship links.
- Raise muted text and landing-page number contrast, enlarge navigation targets, preserve viewport-control focus outlines and announce graph selections in a persistent status region.
- Clip graph connections to receptor and substrate shapes and route downstream feedback around the focused circuit.

### Security

- Ignore private key, credential and secret configuration files alongside existing environment-file exclusions.
