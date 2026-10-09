# Causome

An evidence-linked disease mechanism atlas built with Astro and React Flow. Milestone 1 established the renderer, self-contained snapshots and validation. Milestone 2 now provides a source-checked SLE candidate for human domain review.

The candidate has **21 named entities, 27 relationships and three therapies**: belimumab, anifrolumab and enpatoran. Its proposed maintaining circuit, upstream sensing and renal branch have readable focused views; the complete map and a static evidence outline expose the entire candidate. All numerical scores remain unassessed.

**Human domain review is pending.** Source checking is distinct from scientific approval. Many checks use primary-study abstracts; every evidence item records its study system and inspected location. The circuit combines human observations, cell cultures and mouse experiments, with explicit limits. It is a reviewable prototype, not a published scientific reference.

## Run locally

Use Node.js 24 or newer and pnpm 10.24.0.

```sh
pnpm install
pnpm dev
```

Open http://localhost:4321/diseases/sle/. Select a route, mediator, relationship or therapy. Pan, zoom, fit the selected view, or focus a selected entity. The inspector shows exact claims, study systems, source locations, pending review dispositions and limitations. The complete mechanism and therapy outline remains available without JavaScript.

## Verify

```sh
pnpm validate
pnpm test
pnpm check
pnpm build
pnpm preview
```

The default validator checks `knowledge/diseases/sle/candidates/sle-curated-candidate-001.json`. You can still validate the preserved foundation fixture:

```sh
node scripts/validate-release.mjs knowledge/diseases/sle/releases/sle-illustrative-001.json
```

The static build is in `web/dist/`. CI runs validation, type checks, tests and build with the workspace lockfile. Publication validation rejects both the illustrative fixture and this candidate. There is no automatic scientific publication or deployment.

The verification record and review ledger are in [the Milestone 2 review packet](curation/reviews/sle-curated-candidate-001.md). The data and geometry suite has 23 tests, including candidate provenance, therapy integrity, publication rejection and shape-aware clipping. Browser verification covers desktop/mobile, route switching, mediator and relationship selection, therapies, focus controls, arrow semantics, and the complete no-JavaScript outline.

## Data and scientific review

The scientific candidate uses format `0.2.0` and embeds entities, relationships, claims, evidence items, source identities, therapy status evidence, contexts, unassessed assessments, map views and layouts. Its SHA-256 digest covers scientific and view content. Scores and approvals have not been invented.

The validator checks schema, references, claim/relationship endpoints, therapy claims, approved-drug regulatory sources, source-check dates, selected-view coverage, root lineage and digest integrity. These are structural safeguards; they do not replace domain judgment. All claim dispositions are `pending_domain_review` and reviewer identities are null.

The original five-entity illustrative `0.1.0` fixture is retained as a regression fixture. It is not the displayed scientific candidate.

See [manual scientific review](curation/policies/manual-scientific-review.md) and [publication approval](curation/policies/publication-approval.md). The reviewer allowlist remains empty. Before publication, a domain reviewer must verify the complete synthesis and source interpretations, including claims checked only against abstracts.

## Renderer

React Flow provides viewport controls, selection and keyboard behavior. Custom SVG shapes and edge geometry clip arrows to biological silhouettes; downstream feedback returns route around the focused circuit. Named mediators remain visible, with Rx counts for direct targets. See the [custom-edge guide](https://reactflow.dev/learn/customization/custom-edges) and [accessibility guide](https://reactflow.dev/learn/advanced-use/accessibility).

## Next milestone

Complete the pending human scientific review, then Milestone 3 adds authenticated publication, launch accessibility checks and static deployment of an immutable approved root release. Numerical scoring, history and automated literature curation remain later milestones. `PRD.md` defines the delivery contract.
