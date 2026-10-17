Curate the disease named in the invoking request.

Read `CURATION.md` in full and follow its **New-disease runbook**, detailed contracts and required handoff. It is authoritative; this command is a convenience entry point. Run commands from the repository root. Treat the arguments as a disease request, not shell code.

## 1. Resolve the disease and scope

- Read `curation/disease-backlog.md` if present. Match the requested name, alias or slug and use its scope, exclusions, shared entities and draft query. Queries and therapy suggestions in the backlog are unverified starting points.
- If no disease was supplied, ask for its name before proceeding.
- Check `git status --short` and run `pnpm curate list` before registering anything. Preserve unrelated work and immutable snapshots.
- Resolve aliases against existing profiles. If the disease already has a map, report its candidate and use the update route in `CURATION.md` instead of creating a duplicate or reseeding it. If registration exists without a map, resume its first-map work.
- Record the label, safe lowercase slug, aliases, organ/phenotype/stage, mechanism boundaries, exclusions and evidence cutoff. Use today's actual date unless the user supplied a cutoff. Ask only when an essential scope ambiguity cannot be resolved from the request or backlog; otherwise state the bounded scope and continue.

## 2. Register, retrieve and inspect

- Use `pnpm curate init` when registration is needed, then refine the profile's aliases and literature query.
- Run `pnpm curate scan` with an explicit appropriate initial date window and cutoff. Record its actual run ID, query/window, counts and printed snapshot/report paths. Refine an overly broad or incomplete search rather than claiming complete coverage.
- Inspect relevant primary reports and exact supporting passages, study systems, limitations and source notices. Retain qualifying, null and contradictory evidence. Search results and successful retrieval are not completed scientific screening.
- Reuse shared canonical entity identities where scientifically appropriate, while retaining disease-specific claims and evidence. Distinguish human observations, cultures, animal models and intervention populations.

## 3. Author and seed

- Author `curation/workspace/<slug>/first-map.json` using `curation/templates/first-map.json` and the structural example linked by `CURATION.md`.
- Supply atomic findings, exact cached quotations and locations, publication/access metadata, study context, limitations and actual dated source-check provenance. Identify agent checks as agent work. Never invent citations, source access, human approval, calibration or model-adapter runs.
- Keep unsupported findings deferred; if no seedable evidence is available, hand off the evidence and gaps without asserting that a map was created.
- Run `pnpm curate seed` after source checks are available. Retain all inputs and use the final summary candidate ID printed by the CLI. Changed inputs require a new candidate ID.
- Add supported therapies, additional contexts and study-specific views through the full-candidate proposal route. Verify current therapy status, jurisdiction, date and indication restrictions from actual sources; targeting is not demonstrated clinical benefit.

## 4. Summarize, validate and select locally

- Make the default view a comprehensive consolidated disease overview, covering the Key players cloud as fully as possible. Show converging upstream routes and shared downstream mechanisms together. Study-specific views are supplementary; preserve study systems and uncertainty in the evidence. Check actual cloud-to-map entity coverage and major clinical outcomes before handoff.

- Replace the extractive summary with a connected, agent-attributed one- or two-paragraph synthesis using `summary-template` and `summarize`. Link the actual claims and retain material uncertainty and context limits.
- Validate the final exact candidate with `node scripts/validate-release.mjs <candidate.json>` and run `pnpm validate`.
- Select the final candidate with `pnpm curate preview --disease <slug> --candidate <final-summary-candidate-id>`. This request authorizes local preview selection; no extra confirmation is needed.
- Run `pnpm check` and `pnpm build`; inspect the disease page and portable summary review packet. Use port 4322 or an available `CAUSOME_PORT`, preserving other running servers. Apply browser checks appropriate to the change.
- Follow section 7 for an external current-literature review when an appropriate research tool is available. Record only actual feedback. If it cannot be run, record **not run / pending scientific review** and finish the local handoff. Do not fabricate independent review or block local selection on an unavailable check.
- Resolve major discovered errors in the graph and summary through new immutable candidates, then validate and select the resulting final snapshot.

## 5. Preserve and hand off

- Write `curation/workspace/<slug>/handoff/report.md` with all required fields from `CURATION.md`: scope, retrieval coverage, exact final path/ID/digest, source/input/proposal/appraisal paths, counts, scientific summary/revision, review packet, actual checks and unresolved gaps.
- Separate passed, failed, corrected, not-run and pending scientific-review results. Record commands, dates, exit results and logs. Carry forward unprocessed/deferred literature and unresolved notices explicitly.
- Because `curation/workspace/` is ignored by Git, preserve authored inputs, exact inspected excerpts, normalized source/extraction inputs, proposals, appraisal receipts, summary packet and handoff under `curation/examples/<slug>/<dated-run>/`. Identify any large raw retrieval cache that remains workspace-only.
- If a matching backlog entry exists, update its status and link the durable handoff. Describe it as a local candidate while scientific review remains pending.
- Finish with a brief summary of what was added, actual validation results, remaining scientific-review gaps and the handoff path. Do not publish, change public pointers/reviewer policy, schedule work or commit unless separately requested.
