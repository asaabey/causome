# Causome curation: agent entry point

Give this file to any third-party agent working on a disease map. It is the single starting point for **new-disease curation, updates and validation**. Run all commands from the repository root. Supporting templates, examples and policies are linked where needed; they are contracts and reference material, not separate workflow entry points.

## Start here

Use this task instruction:

> Read CURATION.md and follow its runbook for **[new disease / update / validate]**. Disease: **[name and slug]**. Scope: **[organ, phenotype, mechanisms and exclusions]**. Evidence cutoff: **[YYYY-MM-DD]**. Produce the required handoff, record actual checks and unresolved gaps, and keep the result a local candidate. Do not invent citations, source checks, human review, calibration or validation results.

Use Node.js 24+ and pnpm 10.24.0. Install existing dependencies with `pnpm install --frozen-lockfile` if needed. Check `pnpm curate list` before registering a disease. Existing files may contain other agents' work; preserve it and immutable snapshots. GitHub publication and scheduling remain deferred.

Choose a task:

| Task | Route |
| --- | --- |
| New disease | Follow the new-disease runbook below, then sections 1–5 for the detailed contracts. |
| Update existing diseases | Follow the monthly update runbook below, starting with each existing map and reviewing only new, changed or unresolved evidence. Never overwrite the base. |
| Validate a supplied candidate | Run the validation route below and produce the handoff report. Do not change scientific assertions to make checks pass without reporting the change. |

### New-disease runbook

1. **Define the scope.** Record disease name, safe lowercase slug, aliases, phenotype/organ/stage, exclusions, evidence cutoff and literature query. When essential scope is missing, request it; do not silently claim coverage of the whole disease. Search existing entities for shared canonical identities, while retaining disease-specific context and evidence.
2. **Register and retrieve.** Use `curate init` and `curate scan` as shown in sections 1–2. Scanning works before a first map exists. The scan prints the actual source-snapshot and review-report paths. Inspect retrieved primary reports, exact passages and source notices. A successful search is not evidence that its results support a mechanism or that coverage is complete.
3. **Author the first-map input.** Copy [the blank first-map contract](curation/templates/first-map.json) into `curation/workspace/<slug>/first-map.json`. Follow [the inspected IgA example](curation/examples/iga-first-map.json) for structure, not scientific content. Replace placeholders with this disease's entities, source metadata, atomic findings, exact quotations, study context and limitations. Retain qualifying and contradictory evidence. Record only source checks actually performed, with the real checker/date and actual access scope; identify agent checks as agent work, never human approval. Model-adapter extraction output cannot contain its own source checks. Missing evidence/checks must remain pending in the handoff rather than being fabricated to seed a map.
4. **Create the graph bundle.** After the first-map source checks are available, run `curate seed`. It creates one self-contained candidate JSON containing entities, relationships, claims, evidence items, sources, contexts, assessments and views/layouts. It also retains normalized source/extraction inputs under `curation/workspace/<slug>/imports/`. Keep the authored first-map input too: exact quotations are not currently embedded in the graph bundle. Use a new candidate ID for changed input. The CLI preserves that initial snapshot, creates conservative appraisals, then embeds an extractive summary in a new candidate and writes its review packet. Use the final **summary candidate ID** printed by the command. Seeding creates no therapies; add supported therapy/context changes through the full-candidate proposal route in section 4. Section 5 explains automatic ratings and optional editorial replacements.
5. **Validate before selecting.** Run the candidate and registry checks below. Fix structural errors using actual evidence. Leave missing science explicitly unresolved. Automatic appraisals are now part of the CLI workflow. For an existing unappraised map, use `auto-assess --base <candidate.json>` or select it with `curate preview`; both create a new appraised candidate. Explicit editorial replacements use `assessment-template` / `assess`, identify the actual assessor kind, and require validation against the resulting candidate. Do not copy another disease's scores or imply calibration.
6. **Select, summarize and check the overall science.** Select with `curate preview`, which adds missing appraisals and a summary in new snapshots. Replace the extractive draft with a connected one- or two-paragraph synthesis before scientific handoff; section 7 gives the commands. Check the final exact candidate, run `pnpm check` and `pnpm build`, and inspect its page and review packet. Add `short-labels.json` entries for long entity names (section 1) and check the Key players cloud reads clearly. Submit that packet to an external research tool for a current-literature check; record the actual report or mark this step not run. Resolve major issues in both the summary and graph, generate a new packet and recheck. Use port 4322 or an available `CAUSOME_PORT`; do not replace another project's server. Changed UI behavior needs relevant browser checks; data-only changes do not require every benchmark.
7. **Deliver the handoff.** Include the final candidate, all input/source/proposal artifacts, actual validation results and unresolved evidence/review gaps. Use the checklist below. No public pointer, reviewer policy or schedule is changed by this workflow.

These commands are a sequence with placeholders, not a script to run verbatim. First author the input and perform actual source checks; then replace `<slug>` and `<candidate-id>` with their real values:

```sh
pnpm curate seed --disease <slug> --input curation/workspace/<slug>/first-map.json
node scripts/validate-release.mjs knowledge/diseases/<slug>/candidates/<candidate-id>.json
pnpm validate
pnpm curate preview --disease <slug> --candidate <candidate-id>
pnpm check
pnpm build
```

### Monthly update runbook

Use a monthly maintenance cycle for every registered disease with an existing map. The same process can run weekly when needed. A cycle checks every disease for new evidence; it only changes maps for which relevant evidence changes the knowledge. A new disease still follows the first-map runbook above. This runbook does not install a scheduler or start a literature scan.

The starting point is the existing graph JSON, not a fresh review of the disease. Keep unchanged papers, claims and mechanisms as the baseline. Retrieve new arrivals and metadata changes, screen their relevance, and assess their contribution against that baseline. Older papers need renewed inspection when a correction, retraction, changed source or new finding challenges the claims they support. An older publication newly indexed by the provider also counts as newly discovered evidence.

1. **Open a dated cycle and bind the bases.** Run `pnpm curate update-all --plan` to inspect the selected candidate paths, IDs/content digests, evidence cutoffs and successful cursors. Use the locally selected candidate as the base for local product updates. Diseases without a map need initial curation, not an incremental update. After retrieval, keep the scientific processing/disposition report as `handoff.md` in the printed maintenance cycle directory; preserve the script's retrieval reports.
2. **Retrieve the delta for each disease.** Run `pnpm curate update-all --to <cycle-date>` using the script instructions below. An existing successful cursor supplies the overlapping date window automatically. On the first maintenance scan, the script starts from the base evidence cutoff; a manually seeded map did not establish a search cursor. Save the printed run IDs and packet paths. A failed search leaves that disease incomplete and its successful cursor unchanged; the script continues the other diseases and exits nonzero when a disease is incomplete. Do not describe a failed search as “no new evidence.”
3. **Build the work queue, retaining unfinished work.** Use `report.json`'s `changes` to select new and updated records from the source snapshots. Add unresolved records from earlier cycles; the latest scan alone is not a complete backlog. Compare new-to-cache records with the existing map's source identifiers: a cache refresh can rediscover an already-curated paper. Review unchanged, already-processed papers only when an unresolved issue or new evidence makes them relevant. Screen titles/abstracts first, then inspect the primary source for records that could affect a mechanism, evidence strength, disease context or therapy. Provider flags are triage inputs, not a relevance verdict.
4. **Decide what each relevant paper changes.** Compare its findings with existing entities, relationships, claims, study contexts and therapies. Record one of: supports an existing assertion; qualifies/refines it; contradicts/supersedes it; adds a mechanism; changes therapy evidence/status; duplicate; irrelevant/non-contributory; or deferred because evidence/access is insufficient. Keep negative findings and study-specific limits. A new citation need not create a new node or raise a score. For changed or flagged sources already cited by the map, identify the affected claims and inspect those sources explicitly.
5. **Apply only meaningful map changes.** Use section 3 extraction and section 4 reconciliation against the exact bound base, with a papers file containing the selected records. Therapy/context/removal changes use the full-candidate proposal route. Keep the previous snapshot immutable. The existing CLI currently regenerates automatic appraisals after evidence reconciliation; it does not yet limit recalculation to affected assessments. Inspect the affected scientific paths and any resulting score changes. If nothing relevant changes, retain the current graph and summary and record “checked through <cycle-date>; no map change” in the maintenance report. Do not manufacture a new graph just to advance its evidence cutoff.
6. **Check the changed explanation.** When the graph changes, revise its one- or two-paragraph summary to reflect what was learned and what remains uncertain. Run candidate/registry validation, inspect the version diff, and use section 7's external summary check against the new snapshot. Then select the final candidate locally and rebuild. Do not reopen every historical source for this step: start with the changed findings and their affected assertions. If the overall explanation is unchanged, record that explicitly; feedback from an older graph remains historical because packets bind exact snapshot digests.
7. **Close the cycle with a small change report.** For each disease record the searched-through date, base/final IDs and digests, new/updated record counts, relevant/deferred counts, unresolved notices and outcome: unchanged, updated or incomplete. Include a short “what changed and why” paragraph and the final scientific summary where changed. Keep a paper-level disposition list with identifier/key, source-content hash, decision, reason, affected claim/entity IDs, cycle date and proposal path. Carry deferred or unprocessed records into the next cycle. Retrieval completion and scientific processing completion are separate facts.

Example single-disease retrieval, repeated for each existing disease with its own base:

```sh
# First maintenance scan when there is no successful cursor:
pnpm curate scan --disease <slug> --from <base-evidence-cutoff> --to <cycle-date>

# Subsequent cycles use the recorded successful cursor and overlap:
pnpm curate scan --disease <slug> --to <cycle-date>
pnpm curate status --disease <slug>

# After screening and extracting the selected delta against the existing graph:
pnpm curate reconcile --base <existing-candidate.json> --papers <selected-papers.json> --extraction <new-findings.json> --cutoff <cycle-date>
```

Use this compact report structure; counts and verdicts must come from actual work:

| Disease | Searched through | New / updated records | Relevant / deferred | Outcome | Map/summary impact |
| --- | --- | --- | --- | --- | --- |
| `<slug>` | `<date or incomplete>` | `<counts>` | `<counts>` | `<unchanged / updated / incomplete>` | `<short explanation and candidate link>` |

### Run the all-disease update script

The script is [scripts/curation/update.mjs](scripts/curation/update.mjs), exposed through the existing curation CLI. Run it from the repository root:

```sh
# Inspect existing bases/cursors; no network requests or files are written:
pnpm curate update-all --plan

# Retrieve changes through today for every disease with a selected map:
pnpm curate update-all

# Use an explicit cycle date, or retry just one disease:
pnpm curate update-all --to YYYY-MM-DD
pnpm curate update-all --disease sle --to YYYY-MM-DD
```

Each live run creates a separate directory at `curation/workspace/maintenance/<date>/<cycle-id>/`. Its `report.json` and `report.md` summarize every disease. Successful disease subdirectories contain:

- `update.json`: exact base path/ID/digest, scan ID/window, new/updated counts, changed source snapshots and existing claim IDs affected by changes to cited sources.
- `papers.json`: only this scan's new or updated records for screening/extraction, rather than the entire literature cache.
- `baseline-refreshes.json`: first-time metadata refreshes for already-curated, unflagged sources, kept separate from newly discovered evidence. Check these for material differences if the existing source metadata is insufficient; they do not require a fresh scientific review solely because they were absent from the scan cache.

Retrieval outcomes are `evidence_to_screen`, `no_retrieval_changes`, `incomplete` or `needs_initial_map`. Planning uses `planned`. These describe retrieval, not scientific processing or map validity. A retry creates a new cycle directory and preserves previous reports. Original scan reports/raw responses remain under each disease's `scans/<scan-id>/` directory. A repeated identical scan may return the same delta again; deduplicate it using source identifiers and the recorded dispositions.

Continue with the existing extraction and reconciliation commands, using the **base path** and **papers path printed for that disease**:

```sh
pnpm curate extract --base <printed-base-path> --papers <printed-papers-path> --output <extraction.json>
# Populate the findings and record actual source checks as in section 3.
pnpm curate reconcile --base <printed-base-path> --papers <printed-papers-path> --extraction <extraction.json> --cutoff <cycle-date>
```

Skip extraction when the packet is empty and there is no unresolved backlog. The script performs retrieval and prepares update packets; it does not infer findings, edit maps, select candidates, rebuild the site or configure a schedule. Graph updates and summary checking follow steps 4–7 above.

**Implementation boundary:** all-disease update packets, incremental retrieval, successful cursors, identifier deduplication, source-change/notice detection, immutable reconciliation, automatic appraisals, version diffs and summary review are implemented. The current browser queue still combines all cached/imported sources. There is no durable paper-disposition ledger, reviewed-through checkpoint or automatic “new/unprocessed only” browser queue yet. The script's packet contains the current scan delta, not unresolved work from previous cycles. Maintain the cycle/disposition reports explicitly and carry their unfinished items forward. A successful scan cursor only means retrieval completed; it must never be treated as a completed scientific review.

The default 30-day overlap and 90-day broad reconciliation protect against late indexing, source updates and query changes. Re-fetching metadata is not a requirement to reread unchanged papers. Broad searches should still be screened against the baseline and disposition list. Changing disease scope or query may require a targeted catch-up search beyond the ordinary monthly window; record that coverage separately.

### Validation route

| Layer | Action | What the result establishes |
| --- | --- | --- |
| Candidate integrity | `node scripts/validate-release.mjs <candidate.json>` | Schema, IDs/references, evidence/context consistency, supported scoring/provenance rules and content digest. |
| Registry integrity | `pnpm validate` | All registered candidates and their disease/profile/path identities. |
| Product integration | `pnpm check`, then `pnpm build` | The atlas type-checks and builds with the candidate. It does not establish source entailment. |
| Scientific support | Inspect actual primary-source passages and the claim's scope; retain dispositions and unresolved gaps. | Only the checks actually performed. Quote matching and a checker name alone do not establish support or independent human approval. |
| Overall scientific understanding (primary review unit) | Section 7: export the summary packet, check it with an external research tool, and record actual feedback with `summary-feedback`. | Whether that tool found the bounded overall explanation consistent, needing revision or insufficiently supported, with its actual search coverage and sources. This is recorded external feedback, not certification of every graph element or authenticated publication approval. |
| Checker evaluation | Section 5's `curate evaluate` / `evaluate-search`, with real held-out labels, predictions and actual adjudication. | Measured extractor/search performance on those datasets; not validity of every claim in a disease map. |
| Automated claim-level semantic verification and random audits | Section 8 describes an optional future implementation. | **Not implemented.** There is no runnable service or audit command that certifies every assertion at scale. Summary review is the practical overall-science check; it does not imply claim-level assurance. |

Separate `passed`, `failed`, `not run` and `pending scientific review` in the report. Include the command, date, exit result, output/report path and exact candidate ID/content digest. Do not convert successful engineering checks into a scientific-validity or publication verdict. A failed check remains visible after a correction and rerun.

### Required handoff

Write a concise report at `curation/workspace/<slug>/handoff/report.md` containing:

- Disease scope, evidence cutoff, actual search queries/windows, retrieval coverage and source access limitations.
- The final `knowledge/diseases/<slug>/candidates/<candidate-id>.json` path, its manifest digest and the profile/preview selection. This is the single JSON used by the graph; source/extraction inputs are audit artifacts.
- Paths to the authored first-map input, exact source snapshots/quotations, source-check provenance and any extraction/proposal/diff/appraisal inputs. Include actual model/prompt versions when a model adapter was used.
- Entity/relationship/claim/source counts; supporting, qualifying and contradicting evidence; unresolved notices, context gaps, study-independence uncertainty and missing therapies/appraisals.
- Actual validation results by layer, corrected failures, checks not run and scientific checks still pending. If there is no seedable candidate, explain why and hand off the draft/evidence rather than asserting completion.
- The one- or two-paragraph scientific summary, its scope/cutoff, final summary revision, portable review packet and actual external feedback receipts. State tool/date/search coverage, verdict, major issues and resolutions, or explicitly say external review has not run.
- The local preview route if selected, and confirmation that domain review/calibration remain pending and publication/scheduling were not advanced.

`curation/workspace/` is ignored local storage. When handing the work to another agent or machine, transfer the referenced input/evidence packet with the candidate; a Git checkout alone will not contain it. Preserve original records and historical hashes.

The remainder of this file defines the detailed workflow and contracts.

This workflow creates reviewable candidates. Retrieval, model output, a source checker name, a local JSON review and a browser draft cannot grant authenticated scientific publication. The public store remains separate.

## 1. Define scope and author a first map

```sh
pnpm curate init --id disease-slug --label "Disease name" --summary "Bounded scope and limitations" --query 'TITLE_ABS:"disease name"'
```

Edit the profile's aliases and query in `knowledge/diseases/<slug>/disease.json`. `overlapDays` defaults to 30 and `reconciliationDays` to 90. A newly registered disease has no claims or selected candidate. It can be scanned before its first map exists.

Use `curation/templates/first-map.json` as a blank structure and `curation/examples/iga-first-map.json` as a complete inspected example. Supply canonical entities with descriptions, synonyms and ontology identifiers, a context (organism, phenotype, tissue, stage), inspected publications, and one structured finding per assertion. Use stable identities for shared biology; do not copy another disease's claims or importance. Supported classes include cells, proteins, genes, metabolites, pathogens, tissues, receptors, variants, processes, outcomes and immune mediators.

Publication metadata follows the Europe PMC core shape: string `id` and `source`, title, optional DOI/PMID/PMCID, abstract or **accurately labelled inspected excerpt** in `abstractText`, publication types and correction links. `inspectedScope` must describe the material actually inspected. Full-text access, licensing and source inspection are separate facts. Do not substitute a generated claim for a source passage.

Each finding has a publication PMID, canonical subject/object, predicate, interpretation, contribution category, contextual claim text, an exact cached passage, source location, study system, evidence type, limitations and an actual dated source check. The initial seed snapshot assigns no scores or review approvals. The CLI immediately follows it with a separate automatic provisional appraisal candidate; no human review or calibration is implied. `diseaseDescription` and `diseaseAliases` are optional frozen release metadata; public builds otherwise use the reviewed release title/note, not mutable profile prose.

```sh
pnpm curate seed --disease disease-slug --input first-map.json
pnpm curate preview --disease disease-slug --candidate candidate-id
pnpm build
```

Seeding is immutable by candidate ID. Author a new ID for changed input. Automatic appraisals have their own IDs and retained input/result receipts. Preview selection automatically appraises an unappraised scientific snapshot and updates the local profile to the resulting ID; existing editorial/appraised snapshots are preserved. It never creates or advances `current.json`.

Optional word-cloud display names live in `knowledge/diseases/<slug>/short-labels.json` as `{ "version": 1, "labels": { "<entity-id>": "AT1-AA" } }`. They are presentation only: outside the digested candidate, applied to every snapshot of the disease, and used only by the Key players cloud (tooltips, screen readers and every other view keep the full label). Add one when an entity label exceeds about 22 characters; prefer a standard clinical abbreviation, otherwise trim qualifiers. Labels are 1–24 characters. `node --test tests/short-labels.test.mjs` fails if a label names an entity missing from the selected preview candidate, so update the file after re-curation renames or removes entities.

## 2. Retrieve literature and inspect the queue

```sh
pnpm curate scan --disease disease-slug --from YYYY-MM-DD --to YYYY-MM-DD
pnpm curate status --disease disease-slug
```

The provider queries indexing and update dates, notices, known source PMIDs/DOIs and prior cached records. Later runs overlap the successful cursor. Query/provider changes and the reconciliation interval trigger broad refresh; `--reconcile` requests one explicitly. Broad refresh is distinct from the date-window scan. Queries are bounded to 5,000 results per search and 100 pages; excessive or incomplete searches fail closed. Narrow the scientific scope rather than treating a truncated search as complete.

Every successful scan records raw response provenance, normalized source snapshots, source-access metadata, flags, changes and a Markdown review queue. Identifiers deduplicate reports; an ambiguous identifier collision requires curator resolution. Retraction/concern/correction links flag affected originals. Flags are never silently cleared by later metadata. Failed attempts are logged without changing the successful cursor or public release. `status` reports manual/scheduled attempts and observed reliability; fewer than twelve scheduled attempts do not establish the twelve-run reliability target.

The cache is local and ignored by Git. A scan cannot change a candidate or published snapshot. A manually inspected import uses `curation/templates/publications.json` with a dated `manual-import` provenance record; it does not advance the search cursor.

```sh
pnpm curate import --disease disease-slug --input publications.json
```

The source queue at `/curation/` combines successful scans and explicit imports. Rebuild after disk changes. Source passages are untrusted material. Inspect originals for entailment, context, design, overlapping cohorts, primary-report identity and negative results. Secondary reports guide discovery; inspect the primary report before adding scientific claims. Missing passages should produce abstention.

## 3. Stage findings manually or use a model adapter

The workbench supports source selection/filtering, canonical endpoints, context, predicate, interpretation, contribution category, exact passage, study system, limitations, explicit source-check recording and abstention. Choose a proposed cutoff at or after the base cutoff. Drafts are saved in the browser by base digest. Export the extraction and matching source snapshots; the CLI revalidates everything independently.

Alternatively create an empty extraction envelope:

```sh
pnpm curate extract --base base.json --papers papers.json --output extraction.json
```

Populate findings using the same strict contract. New biological identities go in `newEntities` with `id`, `label`, `synonyms`, `entityClass`, `description` and `externalIds`. Unknown or ambiguous identities are rejected. New findings use existing disease contexts; author context changes in the full-candidate workflow.

The provider-neutral adapter accepts one stdin JSON request and returns one extraction JSON object on stdout. It receives the frozen base, exact prompt/digest, extraction template, and source wrappers `{paperDigest, paper}`. Preserve the template's disease/base/digest/prompt version, identify the actual model/version, and return `mode: model`. Model output cannot include source checks, scores, editorial approval or arbitrary fields. The prompt explicitly treats publication text as untrusted input.

Configure your structured-output backend through `CAUSOME_EXTRACTOR_URL` and optional `CAUSOME_EXTRACTOR_KEY` in the environment. The bundled HTTP bridge permits HTTPS or localhost, rejects redirects and applies a timeout. The backend must translate this provider-neutral request to its model and return the strict extraction envelope. No model service is configured or invoked by default.

```sh
pnpm curate extract --base base.json --papers papers.json --paper-keys med-123456,doi-identifier --adapter scripts/curation/adapters/http.mjs --output extraction.json
```

Model batches contain 1–20 explicitly selected records. The CLI records the exact prompt hash/version, model version, source hashes and named base, validates returned passages and rejects causal escalation. A human/source checker then records actual source checks before a candidate can become ready. Passage matching establishes traceability, not entailment or review.

## 4. Reconcile and compare

```sh
pnpm curate reconcile --base base.json --papers papers.json --extraction extraction.json --cutoff YYYY-MM-DD
```

Outcomes are supporting, refining, qualifying, contradicting, superseding, novel, duplicate and non-contributory. Exact duplicates do not add evidence. A separate finding from the same study needs a distinct-finding rationale. Qualifying/refining/superseding findings attach to existing assertions; they do not automatically erase prior evidence. Flagged sources already used by the base require explicit reconciliation of those claims. Retractions/concerns cannot introduce positive support. Pending checks or unresolved warnings keep the proposal unready.

Ready proposals write an immutable candidate and a local packet containing `proposal.json`, `changes.json`, `review.md` and the exact `extraction.json`/`papers.json` inputs. Retain the entire packet for review and audit. The complete diff includes release metadata and all scientific/view collections. Existing evidence is preserved, source/domain approvals reset, and old appraisals are invalidated in the reconciled snapshot. The CLI then creates a separate automatically appraised candidate and prints its ID. New mechanisms appear in a research view rather than acquiring core prominence; a provisional weight does not assert principal-circuit causation. Repeated identical proposals are idempotent. Neither a ready proposal nor preview selection changes public routing.

Therapy status, new contexts, removals, ontology corrections and other edits can be authored as a full validated candidate:

```sh
pnpm curate propose --base base.json --candidate edited-candidate.json
pnpm curate diff --before base.json --after edited-candidate.json --output changes.json
```

Use a new candidate ID, new revision IDs for every changed scientific/view record, and pending domain-review dispositions. Full-candidate proposals require source-checked claims and reset assessment decisions, matching automatic reconciliation. The proposal and successor store reject changed record content that retains its previous revision ID. A public base requires its exact parent ID/digest. Inspect `/diseases/<slug>/compare/` and historical snapshot links. Scientific approval binds every change, including sources, therapy metadata, layouts and assessments.

The committed IgA example demonstrates the pipeline without manufacturing review:

```sh
pnpm curate reconcile --base knowledge/diseases/iga-nephropathy/candidates/iga-nephropathy-candidate-001.json --papers curation/examples/iga-source-snapshots.json --extraction curation/examples/iga-qualification-extraction.json --cutoff 2026-10-10
```

It adds a source-checked qualification from the already cited mesangial-cell report, preserves the initial map, and creates an unapproved candidate. The associated source review ledger is `curation/reviews/iga-nephropathy-candidate-001.md`.

## 5. Scoring, evaluation and scheduling gates

### Automatic appraisals (default)

`curate seed`, a ready `curate reconcile`, and an unappraised `curate propose` automatically create a provisional appraisal candidate after preserving the source snapshot. `curate preview` also appraises an unappraised scientific snapshot before selecting it, so selecting the original seed ID does not leave the local product without ratings. Existing explicit editorial appraisals and calibrated values are preserved. Extraction models still cannot supply scores or review decisions.

To appraise an existing map explicitly:

```sh
pnpm curate auto-assess --base knowledge/diseases/<slug>/candidates/<candidate-id>.json
pnpm curate preview --disease <slug> --candidate <printed-appraised-candidate-id>
pnpm validate
pnpm build
```

Inputs/results are retained in `curation/workspace/<slug>/appraisals/<appraised-candidate-id>/input.json` and `result.json`. The candidate binds the worksheet digest, original base digest, system identity, actual assessment date and `causome-auto-appraisal-v1`. Identical inputs/date reproduce the same candidate; changing evidence generates a fresh assessment. Keep this packet with the handoff. The workbench can export the same automatic worksheet; `curate assess` verifies that a rules worksheet exactly reproduces the supported policy and rejects hand-edited automatic ratings.

| Field | Automatic policy |
| --- | --- |
| Mechanistic weight | Use the existing five-component rubric and rounding. Functional study tags plus contextual causal interpretation get conservative causal credit; associations do not. Supported context-local connections give a bounded network proxy. Interventions need the corresponding study/claim types. Patient coverage is capped at a narrow phenotype. Independent replication needs explicit group/dataset metadata, not citation volume. Unknown higher-level inferences are not credited. |
| Evidence confidence | Retain all confidence dimensions and claim references. Unappraised methods/quality, directness and consistency conservatively cap this metadata-only draft at 1/4. This is an ordinal tier, not a 25% probability. If no usable contextual primary support exists, confidence is 0 and mechanistic weight is unavailable with an explicit insufficiency reason; missing evidence is not converted into a weight of zero. |
| Therapeutic leverage | Derive categorical direct/indirect target coverage from frozen therapy records, development status and endpoints. No linked therapy yields “No intervention curated”; the rules do not discover drugs or establish efficacy. |
| Evidence and provenance | Preserve supporting/qualifying/contradicting categories, contextual references, component/dimension rationales and source notices. Qualifiers/negative controls cannot be counted as positive functional support. Source-type tags and claim interpretation are inputs requiring verification, not automatically proven facts. |

These are conservative rules, not a configured LLM appraisal backend or the independent claim-level semantic validator proposed in section 8. They fill the product automatically and expose their limitations. Improve a draft with a reasoned editorial worksheet when more source information is available; independent calibration and authenticated scientific review remain separate gates. The original snapshots and existing SLE/IgA editorial drafts remain unchanged. Reappraisal invalidates an embedded summary; selecting the resulting candidate regenerates a fresh draft and packet.

### Local provisional appraisal

```sh
pnpm curate assessment-template --base base.json --output appraisals.json
pnpm curate assess --base base.json --input appraisals.json
pnpm curate preview --disease <slug> --candidate <new-appraised-candidate-id>
pnpm build
```

The blank worksheet does not assign scores. Supply the actual assessor, date, limitations, five anchored weight components and claim-linked rationales, and confidence dimensions. A missing component leaves weight null. Claims must match the assessed subject and biological context; a clinical trial in a treatment context cannot be credited to an overview assessment. `assess` binds the exact base digest, validates component arithmetic and confidence ceilings, and creates an immutable candidate with explicit provisional provenance. It never asserts calibration or independent review and cannot publish.

Therapeutic leverage is categorical coverage computed from the frozen direct/indirect targets and development status, with therapy IDs and indication limitations. Relationship categories concern endpoints, not treatment efficacy on that relationship. “No intervention curated” describes the bounded map, not absence of therapies. Numeric leverage is unsupported. When evidence reconciliation creates a new candidate, old appraisals remain in history, stale scores are cleared, and the CLI generates fresh automatic appraisals. Explicit editorial appraisals can subsequently replace this draft in another immutable candidate.

The selected SLE and IgA maps use the **agent-authored** worksheets in `curation/examples/sle-provisional-appraisals.json` and `curation/examples/iga-nephropathy-provisional-appraisals.json`. They are preliminary editorial judgments of selected reports, not systematic reviews or independent reviewer results. Abstract access limits confidence; broad disease coverage and independent study/dataset replication have not been established. The curator exposes appraisal coverage and an export; map inspectors and JavaScript-free outlines expose the full rationale and provenance.


```sh
pnpm curate calibration-template --base base.json --output calibration.json
pnpm curate calibrate --input calibration.json --output calibration-result.json
```

These commands create a blank reviewer worksheet and evaluate paired ratings. They do not supply ratings, authenticate reviewers or edit scores. The embedded rubric preserves component anchors, weights, raw/tier/display rounding and confidence ceilings. Public numerical appraisals need two independent calibration reviewers, representative cases, at least 80% paired agreement, source/context-linked rationales, frozen study independence evidence and authenticated assessment review.

Real held-out extraction evaluation needs at least 100 labelled claims from 30 study/dataset families, including 20 associative and 20 qualifying/contradictory cases, plus 20 separate insufficient-evidence examples. Split families away from development. Entailment adjudication binds the exact prediction digest and names its actual reviewer. Search evaluation needs at least 30 relevant and 30 irrelevant labelled records. Templates are empty; synthetic unit tests cannot confer launch eligibility.

```sh
pnpm curate evaluate --reference held-out.json --predictions predictions.json --adjudication review.json --output evaluation.json
pnpm curate evaluate-search --reference search-labels.json --input retrieved-ids.json --output search-evaluation.json
pnpm curate schedule-ready --evaluation evaluation.json --search-evaluation search-evaluation.json --manual-review scan-review.json
```

Results retain numerators/denominators and exact prompt/model versions. Missing predictions count against recall/context/direction. Association escalation and any unsupported score change fail. Inspect labels, errors and source entailment; self-authored JSON is not authenticated scientific review. `schedule-ready` checks local evidence records only and installs no scheduler. Its manual-review record needs an accepted actual reviewer, a scan ID, and exact hashes of both evaluation reports.

Weekly scheduling remains off until a real manual scan is reviewed and held-out/search evaluation passes. An approved scheduler runs only `curate scan --trigger scheduled` and notifies on meaningful new evidence or failures. It cannot approve, publish or advance a release. Report trailing success using actual attempt logs, with outages counted as failures.

## 6. Scientific publication and recovery

The private source repository is [asaabey/causome](https://github.com/asaabey/causome). Scientific publication is deferred. Continue reviewing local candidates without changing the disabled reviewer policy. When publication is enabled through trusted review, the same authenticated gate covers a root or successor, and successors must name the exact current parent. Historical files and original receipts are never rewritten. Before publishing scores, both calibration reviewers and each appraisal decision require authenticated backing.

`archive:site` archives verified public output. `restore:site` verifies archive/file hashes, paths, counts and release identity before restoring exact bytes into a fresh directory. It rejects links, traversal, duplicate entries and existing destinations. A synthetic local round-trip test is engineering evidence, not a demonstrated hosting redeployment. Actual staging recovery and previous-release rollback must be recorded against approved artifacts.

Restoring an earlier site artifact does not move the scientific `current.json` pointer backward. A scientific content reversion is a newly reviewed successor whose parent is the current release.

## 7. Overall scientific summary review

**Implemented locally; external checking requires an actual tool run.** The primary review unit is one or two paragraphs answering: **does this overall explanation represent current scientific understanding within its declared scope?** Paragraph 1 connects the central mechanisms and disease manifestations. Paragraph 2 distinguishes established observations from uncertain interpretations, major contrary findings and therapeutic evidence. Keep each paragraph under 220 words. Preserve mixed human/cell/animal contexts and material caveats; do not inflate the map into a universal causal circuit.

The summary is embedded as `scientificSummary` in the same JSON that drives the graph. It includes author/date, scope/cutoff, paragraph-to-claim links, input digest, summary revision and a digest of all scientific/view collections. Claim links provide traceability, not a semantic proof that the prose is entailed. Changing graph records or the cutoff makes the old summary invalid. Reconciliation and reappraisal remove it; their CLI workflow creates a new draft. Original candidates and their review packets remain immutable.

Seeding, ready proposals/reconciliation, automatic appraisal and preview selection create an **extractive system draft** when no summary exists. It selects a few contextual findings and their limitations; it does not perform a literature search or establish consensus. The curator must turn it into a coherent synthesis with the actual author kind. The five local disease maps have agent-authored two-paragraph drafts from their frozen evidence; [the saved inputs](curation/examples/disease-summaries.json) reproduce them. Their external scientific review remains pending.

### Author or revise the summary

The workbench's **Edit summary draft** exports an author-bound input. Its claim links need inspection if the scientific content changes. Agents can use:

```sh
pnpm curate summary-template --base <candidate.json> --output summary-input.json
# Edit scope, paragraphs and claimIds. Set authoredBy to the actual human/agent.
pnpm curate summarize --base <candidate.json> --input summary-input.json
pnpm curate preview --disease <slug> --candidate <printed-summary-candidate-id>
```

`summarize` creates a new candidate and retains the exact input under `curation/workspace/<slug>/summaries/<candidate-id>/input.json`. It preserves scientific records and appraisals while resetting review dispositions where necessary. An edited system-attributed worksheet is rejected; use the actual human/agent author.

### Check the review block in an external tool

In `/curation/?disease=<slug>`, use **Copy summary and review prompt**, **Download summary review**, or **Export summary packet**. The disease page also provides a Markdown download without JavaScript. The CLI can export the same packet:

```sh
pnpm curate summary-packet --base <summary-candidate.json> --output <review-directory>
```

The directory contains `review.md`, `packet.json` and `feedback-template.json`. The packet binds the exact candidate ID/digest, summary revision/digest, scope, evidence cutoff, linked sources/access limits and versioned external review prompt. Paste `review.md` into your chosen research tool. The prompt asks for an independent current-literature search and an overall verdict, major errors/omissions/outdated interpretations, causal overstatement, unresolved debates, specific corrections and citations. A tool without retrieval must disclose that limitation; agreement from memory is not a current-literature check. Independent tools may disagree; preserve the disagreements rather than vote them away. No external service is called automatically by this implementation.

### Record feedback and resolve changes

Fill in the exported feedback template with the actual tool, recorder, check date, search coverage/date, consulted URLs, verdict, explanation, issues and original report. Allowed verdicts are `consistent_with_caveats`, `needs_revision` and `insufficient_evidence`. An issue contains `severity` (`major`/`minor`), `category` (`unsupported`, `omission`, `outdated`, `causal_overstatement`, `scope`, `other`), `description`, `suggestedCorrection` and `sourceUrls`. Do not fabricate a search or source: no search cannot yield a current-science consistency verdict, and unresolved major issues require revision or insufficient evidence.

```sh
pnpm curate summary-feedback --base <summary-candidate.json> --input <completed-feedback.json>
pnpm validate
pnpm build
```

The receipt is saved immutably under `knowledge/diseases/<slug>/summary-reviews/summary-feedback-<digest>.json` and appears in the rebuilt curator. Registry validation verifies its exact snapshot/packet bindings and record digest. Identical imports are idempotent. The receipt records external feedback, not authenticated human approval; it changes neither graph nor summary nor publication status. The snapshot's frozen pending-review status remains its original authoring state; actual reports are shown separately.

For major feedback, inspect the cited sources and update the underlying graph through extraction/reconciliation or a full-candidate proposal. For full-candidate edits, remove the now-stale `scientificSummary`, use new record revision IDs, and let the CLI create a fresh summary. Revise the prose to match the corrected graph, then export and recheck the **new** packet. A prose-only clarification also creates a new summary candidate. Old feedback remains visible as historical and cannot be submitted for a different snapshot, even when most prose is unchanged. Keep unresolved major issues visible and the candidate provisional.

Summary review answers the overall-understanding question. It does not validate every node/edge, calibrate scores, prove literature completeness or replace authenticated scientific publication review. Summary candidates currently retain a pending review status and cannot bypass the publication gate.

## 8. Optional future claim-level verification: evidence checks, exceptions and random audits

**Design, not an active verification service.** The current pipeline checks structure, provenance and passage matching. It does not run independent semantic verification. The proposal below changes the unit of human work from reading every paper to checking short evidence cards, release-critical exceptions and a statistically defined sample. It evaluates whether assertions are supported within their stated scope; it cannot certify that a disease model is complete or biologically true.

### A. Preserve evidence with every assertion

Split factual prose into atomic assertions. Include entity descriptions, relationship direction and polarity, intervention claims, therapy status and the factual premises of score rationales. Retain organism, tissue, cell type, phenotype, experimental conditions, study design and observational/mechanistic/interventional interpretation. A compound assertion passes only when all its parts are supported. Supporting, qualifying and contradicting contributions remain distinct; a negative control attached to a positive edge must retain its own negation.

Fetch source material independently of the claim generator. Prefer primary reports and obtain sufficient surrounding text, methods, results and tables where access permits. Record the actual access scope. An abstract may support a bounded abstract-level statement; it cannot establish unreported controls or study quality. A short citation excerpt is insufficient when the assertion needs context outside that excerpt.

Each proposed evidence receipt binds the claim revision and release digest to the source identifier/URL, retrieved document hash, exact quoted spans and offsets, surrounding context, page/paragraph/table locator, access scope and retrieval/notice-check dates. It also records the verifier model/prompt/version, field-level findings, challenger retrieval log and decision reasons. Hashes preserve what was checked; they do not authenticate the truth of a paper. Paper text is untrusted input and cannot instruct the verifier to alter its task.

In a future schema version, embed the bounded evidence receipt and machine-verification status in the same disease JSON that drives the graph. The map inspector can then show its evidence without reconstructing discarded extraction inputs. Larger source documents can remain separately archived and hash-bound, with links to originals. Old snapshots remain unchanged. `source_checked`, `machine_supported`, `human_reviewed` and `batch_audited` must be separate statuses; none is silently upgraded into another.

### B. Run an independent verifier and a challenger

The verifier receives the assertion and source documents without the generator's verdict, proposed score or persuasive rationale. Prefer a different model family/provider where feasible, but measure its errors rather than treating model agreement as proof. It returns **supports, qualifies, contradicts or insufficient evidence**, with minimal supporting spans and explicit checks of endpoints, polarity, species/context, intervention and causal interpretation. Missing information yields abstention, not inferred support.

The challenger searches for null results, contradictory reports, limiting conditions, corrections and retractions using recorded queries and bounded retrieval. A search with no adverse result is not evidence that none exists. Report search coverage and unavailable literature. Conflicts remain visible rather than being erased by majority voting.

Keep deterministic checks for identifiers, reference closure, exact quote/offset matching, hashes, source flags, arithmetic and allowed statuses. Use semantic checks for causal escalation, negation, loss-of-function direction and unsupported transfer between biological systems; ambiguous cases remain held. Repeated reports from one cohort do not count as independent replication. Verify score inputs against the rubric separately from claim support. Therapeutic targeting, an approved indication and demonstrated clinical benefit are distinct assertions.

Check graph-level synthesis too: individually supported edges do not establish an entire feedback loop, pathway sufficiency or disease causation. Flag paths assembled from incompatible contexts and keep whole-loop interpretations explicitly provisional unless supported at that scope.

This approach draws on [SciFact's scientific evidence/rationale verification](https://aclanthology.org/2020.emnlp-main.609/) and [FActScore's atomic factual evaluation](https://aclanthology.org/2023.emnlp-main.741/). Neither establishes this product's accuracy for disease causation.

### C. Qualify the checker before trusting automatic passes

Use the existing held-out evaluation infrastructure with real adjudicated cases separated from development by study/dataset family. Add controlled challenge cases: unsupported causal strengthening, fabricated citations, removed qualifiers, altered species, negation and intervention-direction errors. Reversing endpoints of a symmetric association is not automatically an error. Synthetic challenges supplement real cases; they do not replace them.

Measure false acceptance, missed contradiction/qualification, context errors, abstention and retrieval coverage by claim class. Preserve actual numerators, denominators and adjudications. A model's self-reported confidence is not a calibrated probability. A small, properly labelled human reference set is still necessary; it can be reused to evaluate subsequent checker versions. Until a claim class passes its predeclared evaluation thresholds, its automatic passes are provisional.

### D. Give humans evidence cards and a bounded queue

Route release-critical cases to direct review: new central causal links, links that close a claimed circuit, treatment/indication changes, major score promotions, model disagreements, source notices and transfers between contexts. Rank by consequence and uncertainty. Cases that cannot be resolved within the review budget remain visibly provisional or are withheld from the accepted map. Show their coverage and impact; a limited review budget must not imply that an unreviewed core mechanism was accepted.

Each card shows one atomic assertion beside highlighted original text with surrounding context and an **open original** link. Show study system/design, source access limits, contrary evidence, the failed or passed checks and a concise explanation. Expandable details expose hashes and full provenance. Reviewer actions are **Supported**, **Unsupported**, and **Need more evidence**, with a reason/context correction; decisions bind the exact receipt/release and actual reviewer/date. Editing a claim invalidates its old decision.

For example, the existing IgA extraction contains the control finding “Uncomplexed IgA1 did not significantly alter proliferation in the reported mesangial-cell culture assay.” Its cached quotation is “uncomplexed IgA1 did not affect MC proliferation significantly”, from [PMID 15673298](https://pubmed.ncbi.nlm.nih.gov/15673298/). A card must show that this is a **qualification** of the immune-complex/mesangial-cell edge, not evidence that uncomplexed IgA1 stimulates proliferation. The stored material is a selected citation excerpt, so broader study-quality and in-vivo conclusions remain unverified. This is an illustration from `curation/examples/iga-qualification-extraction.json` and `curation/examples/iga-source-snapshots.json`, not a new automated or human verdict.

### E. Audit automatic passes using a fixed random sample

Freeze the eligible routine-pass pool and its release/checker/input digests before drawing a uniform random sample without replacement. Commit the target error rate, confidence level, sample size, selection procedure and seed record before reviewing results. Every sampled claim must have an actual support verdict; missing evidence is an audit failure. Targeted reviews are useful but do not count toward the random-sample bound. Preserve the entire selection and all failures; do not stop early, replace hard cases or resample until a batch passes.

For a zero-error sample, the one-sided 95% binomial upper bound is `1 - 0.05^(1/n)`. This gives the following conservative illustration for a large finite pool sampled uniformly:

| Fixed sample | Errors found | Upper support-error bound at 95% confidence |
| --- | --- | --- |
| 59 claims | 0 | About 4.95% |
| 299 claims | 0 | About 0.997% |

Use exact finite-population hypergeometric bounds for the actual pool where useful; if the pool is smaller than the planned sample, review the entire pool. The numerical examples were calculated from the formula above; see [NIST's exact binomial confidence-limit method](https://www.itl.nist.gov/div898/software/dataplot/refman2/auxillar/exacbici.htm). The statement concerns the support-error rate of that frozen eligible pool, assuming accurate human adjudication. It does not prove every claim, literature completeness, graph causality or quality of future batches. A bound on sampled study families is not interchangeable with a bound on sampled claims.

Predeclare the acceptance rule. Under the zero-error rule, any error blocks batch acceptance, prompts root-cause review and invalidates affected receipts. Correct and refreeze the batch before a new audit. Retain the failed audit. Never drop erroneous rows and report the original bound as if no errors occurred. New batches need their own assurance; reusing unchanged receipts does not create a universal lifetime error bound.

### F. Recheck changes and expose assurance honestly

Reuse a receipt only when the assertion/context, source document and notice state, retrieval coverage, rubric and checker versions match its validated inputs. New evidence, retractions, context changes or checker changes invalidate the affected receipts and dependent paths/scores. Routine updates check the changed assertions and affected dependants, while tracking which older claims remain outside current assurance.

The human release view should show counts of checked/held assertions, unresolved critical cases, actual access scopes, checker evaluation results and the audit's sample size, errors and bound. Approval applies to the stated process, eligible pool and exceptions; it does not fabricate an individual human review for each automatic pass.

Implementation order is evidence-preserving schema/receipts, independent verification and challenge adapters, evidence-card/exception UI, held-out checker qualification, then frozen-batch audits and incremental invalidation. The current publication policy still requires authenticated per-assertion dispositions and calibrated appraisal review. This design does **not** weaken that gate: adopting a separately attested batch-audit policy would require explicit policy/schema work with distinct machine and human statuses. No verifier service, audit approval or publication change has been activated by this document.

## 8. Blank template contracts

The JSON worksheets are in `curation/templates/`.

These are worksheets, not accepted scientific records. Placeholder dates, empty case sets and null reviewer fields deliberately fail their gates. Replace them with actual inspected evidence and reviewer-labelled data. A JSON name is not authenticated approval.

For first-map records, use `curation/examples/iga-first-map.json` to see the entity/publication/finding contract. Scope fields are literal scientific metadata. Layout positions have `entityId`, `x`, `y`; optional groups have a stable `id`, `label`, `entityIds`, `collapsed`. Groups must leave an initially visible entity.

An extraction envelope contains version, disease ID, named base release ID/content digest, mode, prompt/model versions, new canonical entity descriptors and findings. `curate extract` generates the envelope from a valid base. Each finding binds `paperKey` and `paperDigest`, has an outcome category, and is either an abstention with a reason or a contextual source-linked claim. Use an exact cached passage; source-check records identify an actual checker/date. Model output cannot supply a source check.

Held-out cases have:

- `id`, `studyFamilyId`, `split: held-out`, `insufficientEvidence` (boolean), and `category`.
- For sufficient cases, `claim` with `subjectId`, `objectId`, `predicate`, `polarity`, and `context` (the labelled disease/organism/tissue/stage/phenotype fields).
- Predictions retain case IDs, `abstained`, and predicted claim/category when extracted. Predictions on insufficient cases count as false positives. Missing cases remain recall/context/direction failures.
- Entailment-review cases contain case ID, boolean `citationEntailed` and boolean `unsupportedScoreChange`. Bind the review to `hash(predictions)` from `scripts/curation/io.mjs`, and record the actual reviewer/date. Inspect exact passages and source locations, not only lexical overlap.

There must be at least 100 sufficient cases, 30 non-overlapping study/dataset families, 20 associative cases, 20 qualifying/contradicting cases and 20 separate insufficient-evidence examples. `developmentStudyFamilies` excludes entire families from evaluation. Mark synthetic test data `synthetic: true`; it cannot become launch eligible. Do not train prompts on the held-out answers.

Search-label records contain persistent publication `id` and boolean `relevant`. Supply at least 30 relevant and 30 irrelevant reports, and a separate JSON array of retrieved IDs. Identify the real reviewed label-set version.

`scan-review.json` must reference a reviewed real scan and exact hashes of the extraction and search evaluation reports. It is a local acceptance worksheet. Configure scheduling only after the real labels, results and review have been checked; scientific publication still uses authenticated review.
