# Milestone 3 launch record

GitHub publication is deferred. Milestone 3 engineering is implemented locally; scientific/public launch acceptance remains pending. The engineering gates are implemented; the current candidate has no human approval and there is no public root or deployment. Do not replace pending entries with invented review or test results.

## Configure the repository

1. Connect this checkout to its intended GitHub repository. Enable GitHub Pages with GitHub Actions as the publishing source. Require the `validate-build` check and protect the default branch, publication workflows, reviewer policy and `github-pages` environment. Require maintainer review of changes to those trusted files. Keep scientific proposal PRs limited to `knowledge/diseases/<disease-id>/candidates/` and `curation/reviews/`.
2. In a separate maintainer-reviewed policy change, configure `curation/policies/reviewers.json`. Each authorized domain reviewer is an object with a verified numeric GitHub `id` and `login`; optional `diseaseIds` restrict the reviewer to qualified disease scopes. Set `publicationEnabled` to true only after verifying reviewer qualifications. Authors and bot accounts cannot approve their own proposal.
3. Merge the publisher and frontend implementation before preparing the scientific proposal. Run the publisher from the clean, current default branch. It fetches policy from that branch, candidate JSON from the exact proposed commit, GitHub review events and the successful `validate-build` check. Candidate code is never executed by the publisher.

The implementation uses [GitHub pull-request review events](https://docs.github.com/en/rest/pulls/reviews) and the [custom Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Branch and environment protection must be configured in repository settings; files in this checkout cannot establish those protections.

## Review and finalize the root

1. A human domain reviewer checks the full synthesis, primary-source interpretations, therapy status and every embedded limitation. Add one new candidate JSON file with the intended stable root ID, a new revision, an initial release note, and approved editorial statuses for every embedded collection. Preserve the original source-checked candidate as a regression fixture. Each claim needs `verification: reviewed` and an accepted disposition with the reviewer's GitHub login and actual review date. Update the digest with `contentDigest`; do not change these fields automatically to manufacture approval. CI selects the sole changed candidate for validation, the map preview and browser tests, so the review check covers the exact proposed snapshot.
2. Generate `pnpm review:template <candidate-path>` from that exact revision. The reviewer submits an **Approve** review on the exact PR head, including the generated `causome-approval` block. The block binds revision, digest, null root base, scoring-model versions and a conservative inventory of non-human evidence, abstract-only access, hypotheses, contradictory therapy evidence and treatment statuses. Pending claims still prevent publication even if the reviewer submits a block.
3. With read-only repository credentials, run:

   ```sh
   GITHUB_REPOSITORY=owner/repository pnpm publish:root <PR-number> <full-head-SHA> <candidate-path>
   ```

   Supply `GITHUB_TOKEN` through the environment for a private repository or authenticated rate limits. The command writes the exact reviewed bundle, a separate `.approval.json` attestation and `current.json`. The pointer contains only release ID and content digest. The bundle is never transformed after review; author, unauthorized, stale, dismissed, incomplete or bot approvals fail closed. Changes requested by any reviewer block finalization.

4. Commit the generated registry files through protected review. After finalization, the proposal may be closed without changing its head. The build rechecks its original content and current authenticated review decisions. Preserve the proposal commit and review events. Working-record changes do not affect public rendering. Existing snapshots and original approval receipts cannot be edited or replaced. A successor must name the exact current parent ID/digest, carry new revisions for changed records and receive its own authenticated review; publication then advances the pointer atomically. Historical receipts retain their original policy binding; the current release also satisfies the current protected policy. Live required CI and review decisions are rechecked.

## Verify the actual launch artifact

`pnpm build` creates an explicitly labelled candidate preview. `pnpm build:publication` requires a configured immutable root and live authenticated approval. It has no candidate fallback. `pnpm test:browser` checks four routes, desktop 1366×768 and mobile 390×844, all graph keyboard selections, viewport controls, reduced motion, focus, serious/critical axe findings, and the complete no-JavaScript outline. Set `CAUSOME_BUILD_MODE=publication` for browser checks of a public build. For Pages project sites, pass the same `CAUSOME_BASE_PATH` used at build time.

`pnpm test:performance` measures five cold-cache navigations per viewport with a pinned Chromium/Playwright pair, 1.6 Mbps download, 150 ms latency and 4× CPU slowdown. It records browser, runner, fixture identity, raw bundle sizes, lockfile digest, all timings and medians in Playwright attachments. The gates are median LCP ≤2.5 s, keyboard selection readiness ≤5 s, and median inspector response ≤200 ms across 20 selections. Keep reports from the actual approved build; local candidate measurements do not complete launch acceptance.

Complete `sle.json` against the exact root ID and content digest, with reports saved under `curation/launch/reports/`:

- **Screen reader:** record reviewer, date, OS/browser/assistive-technology versions, entity names, relationship directionality, selection announcements, reading order, visible focus, keyboard escape and target sizes. Check the complete and focused routes. Automated accessibility results do not substitute for this review.
- **Walkthrough:** record a scientifically literate participant's unaided trace of the maintaining circuit, inspection of one relationship's evidence, and discovery of a therapy's target and status. Record misunderstandings and fixes.
- **Staging redeployment:** archive the public artifact with `pnpm archive:site`, record its SHA-256 and release identity, deploy it to staging, then extract and redeploy that same archive without rebuilding. Record start/end times proving recovery within 15 minutes, staging URL and health results. Verify the archive hash before extraction. Do not claim a redeployment check from a fresh build.
- **Performance:** retain both viewport reports and the exact runner identity for the reviewed artifact. Mark passed only when all budgets pass.

`pnpm validate:launch` deliberately rejects the initially pending record. The production workflow reruns accessibility and performance checks against the actual public output before deployment; the recorded reports document the earlier staging and human acceptance run. Archive downloads expire after 90 days in Actions, so copy the launch archive and its digest record to durable project storage before expiration.

## Deploy and check health

Run **Publish reviewed root** on the protected default branch only after acceptance is recorded. It authenticates approval, preserves immutable files, builds public routes, runs browser/performance checks, archives exact bytes, then uploads and deploys those same static files through the protected Pages environment. It checks the deployed identity, disease page, all navigation routes and complete static outline with `pnpm health <site-base-URL> <archive-record.json>`. Candidate builds cannot pass the public health gate.

The workflow is configured locally and has not been exercised on GitHub. There is no automatic push deployment, scheduled curation or approval bypass. A deployment failure requires checking Pages state and restoring the archived healthy artifact; atomic rollback of Pages hosting has not been demonstrated. Do not declare MVP launch until the real staging and production checks have been recorded.

## Later releases and recovery

`pnpm publish:release` handles a disease root or an exact-current successor using the same protected review process. The configured Pages workflow and `sle.json` acceptance record target the initial SLE launch; prepare equivalent disease/release-specific acceptance before other deployments and validate it with `pnpm validate:launch <disease-id>`. Site archiving reads the built artifact’s primary disease identity. Local engineering coverage is in `PROGRESS.md`.

Restore an archived public site into a fresh directory with `pnpm restore:site <archive.tar.gz> <archive-record.json> <destination>`, then redeploy those verified bytes through the hosting recovery procedure. Archive recovery does not change scientific history or move `current.json` backward. Reverting scientific content requires a new independently approved successor. Actual hosting rollback remains an external acceptance exercise.
