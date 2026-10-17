---
description: Run the monthly incremental curation update across every disease map (CURATION.md monthly runbook)
argument-hint: "[--to YYYY-MM-DD] [--disease <slug>]"
---

Run one incremental curation maintenance cycle following the **Monthly update runbook** and **Run the all-disease update script** sections of `CURATION.md`. Read those sections, plus sections 3, 4 and 7, before starting; they are authoritative where this command is silent.

Arguments: `$ARGUMENTS` (pass through to `update-all`; if no `--to` is given, the cycle date is today).

## 1. Plan and bind bases

- Run `pnpm curate update-all --plan $ARGUMENTS`.
- Report, per disease: selected candidate ID/path, content digest, evidence cutoff, successful cursor, and status. Diseases reporting `needs_initial_map` are out of scope; list them and do not curate them here.
- Check `git status` for uncommitted work in `knowledge/diseases/` and mention it before retrieving.

## 2. Retrieve the delta

- Run `pnpm curate update-all $ARGUMENTS` (live retrieval through Europe PMC).
- Record the printed cycle directory, run IDs, and per-disease packet/base/papers paths.
- A disease with `incomplete` retrieval is **not** "no new evidence": record it as incomplete with the error and continue with the others. The command exits nonzero in that case; that is expected.

## 3. Build each disease's work queue

For each disease with `evidence_to_screen`:

- Start from `report.json` `changes` and the disease's `update.json`.
- Add unresolved/deferred items carried forward from the most recent previous `handoff.md` under `curation/workspace/maintenance/` (the scan packet does not include earlier backlog).
- Deduplicate against source identifiers already in the bound base candidate.
- Screen titles/abstracts; inspect primary sources only for records that could affect a mechanism, evidence strength, disease context or therapy. Provider flags are triage inputs, not verdicts.

Diseases with `no_retrieval_changes` and no carried backlog are recorded as "checked through <cycle-date>; no map change".

## 4. Decide and apply changes

- Give every screened paper one disposition: supports / qualifies / contradicts-supersedes / adds mechanism / changes therapy evidence / duplicate / irrelevant / deferred — with reason and affected claim/entity IDs.
- Only where a disposition changes the map: run `pnpm curate extract` and `pnpm curate reconcile --cutoff <cycle-date>` against the **exact printed base and papers paths** (therapy/context/removal changes go through `pnpm curate propose`). Never edit the previous snapshot. Never author findings you have not checked against the source.
- Do not create a new candidate just to advance a cutoff.

## 5. Validate and check summaries (changed diseases only)

- `node scripts/validate-release.mjs <new-candidate.json>`, `pnpm curate diff --before <base> --after <new>`, inspect score changes.
- Revise the 1–2 paragraph summary (`summary-template` / `summarize`) to reflect what changed and what remains uncertain.
- Export `pnpm curate summary-packet` for the section 7 external check. **Stop and ask the user** to run the external review (or confirm they want it skipped/pending); do not fabricate feedback. Record real feedback with `summary-feedback`.
- Do not select the new candidate as the profile's preview without the user's confirmation.
- After selection: `pnpm validate`, `pnpm check`, `pnpm build`.

## 6. Close the cycle

Write `handoff.md` in the cycle directory containing, per disease:

- searched-through date, base/final candidate IDs and digests, new/updated record counts, relevant/deferred counts, unresolved notices, outcome (unchanged / updated / incomplete / needs_initial_map)
- a short "what changed and why" paragraph and the final summary where changed
- paper-level disposition list (identifier, source-content hash, decision, reason, affected IDs, cycle date, proposal path)
- deferred/unprocessed items to carry into the next cycle
- validation table separating passed / failed / not run / pending scientific review, with commands and exit results

Keep retrieval completion and scientific processing completion as separate facts. Finish with a brief chat summary and the `handoff.md` path. Do not commit unless asked.
