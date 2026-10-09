# Causome

An evidence-linked disease mechanism atlas. Milestone 1 provides the working graph foundation: a static Astro application, a React Flow graph, a self-contained JSON contract, validation, and build CI.

The five-entity SLE fixture is **illustrative and unreviewed**. All scores are unassessed. Its claim links reference fixture documentation, not scientific evidence. Do not use this demo to make clinical or scientific conclusions.

## Run locally

Use Node.js 24 or newer and pnpm 10.24.0.

```sh
pnpm install
pnpm dev
```

Open http://localhost:4321/diseases/sle/. The graph supports pan/zoom, fit-to-view, and node/relationship selection. The inspector shows source links, context, limitations, and assessment status. A static mechanism outline is available without JavaScript.

## Verify

```sh
pnpm validate
pnpm test
pnpm check
pnpm build
pnpm preview
```

The static preview output is in web/dist/. The GitHub Actions workflow runs the same validation, type checks, tests, and build with the workspace lockfile. There is no automatic deployment or scientific publisher in Milestone 1.

Local verification passes 16 data/geometry tests and Astro type checks with no errors or warnings. Browser checks cover node and relationship selection by pointer/keyboard, five directed arrows and one arrowless association, zoom/fit controls, mobile layout without page overflow, and the complete outline with JavaScript disabled. These checks verify the illustrative foundation, not scientific validity or full MVP launch readiness.

## Data and source traceability

The fixture is knowledge/diseases/sle/releases/sle-illustrative-001.json. It embeds entities, relationships, claims, evidence items, sources, context, unassessed assessments, map views, and layout. The validator checks JSON Schema, reference integrity, symmetric-association rules, root lineage, and the content digest before the app builds.

Stable biological identity stays separate from disease-context assessments and view coordinates. Scientific content is read from JSON rather than hardcoded in React. Preview validation accepts the illustrative candidate; publication validation rejects it and remains unavailable until authenticated scientific-review verification is implemented.

See curation/policies/manual-scientific-review.md and curation/policies/publication-approval.md for the source-verification and reviewer requirements. The reviewer allowlist is deliberately empty; no approval has been invented.

## Renderer decision

The graph uses React Flow with custom nodes and edges. It fits the React island and provides viewport controls, selection, and keyboard behavior; custom edge geometry clips connections to biological shapes and supports the fixture's feedback circuit. The spike validates this single renderer rather than retaining competing implementations. See the [React Flow custom-edge guide](https://reactflow.dev/learn/customization/custom-edges) and [accessibility guide](https://reactflow.dev/learn/advanced-use/accessibility).

## Next milestone

Milestone 2 curates a bounded SLE graph with verified primary evidence and therapy records. Milestone 3 adds authenticated scientific publication and launches the MVP. Numerical scores, history comparisons, and automated literature curation follow later. PRD.md is the working requirements and milestone contract.
