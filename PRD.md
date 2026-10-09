# Causome: Living Disease Atlas

Product requirements and build manifest

- Status: Draft
- Version: 0.1
- Date: 2026-10-09
- Initial disease: Systemic lupus erythematosus (SLE)
- Source concepts: `IDEA.md` and `proto-sle.md`

## 1. Product summary

Causome is a static, evidence-linked atlas of disease mechanisms. Its primary interface is an interactive causal map showing how named biological mediators, cell states, molecular processes, tissue responses, and therapeutic interventions relate to one another.

The scientific content is maintained through a separate curation pipeline. On a scheduled or manually triggered cadence, the pipeline searches for newly indexed literature, extracts claim-level evidence, compares it with the currently published disease model, and proposes a reviewable change set. Approved changes produce a new immutable disease-map release and trigger a static site rebuild.

The product is not an AI-generated medical encyclopedia. Its core asset is a versioned, structured, source-traceable knowledge graph rendered through a reproducible frontend.

## 2. Product vision

The atlas should help a user answer:

- What biological disturbances initiate or predispose to this disease?
- Which mechanisms maintain the established disease state?
- Which named mediators connect upstream disturbances to downstream pathology?
- Which relationships are causal, contributory, associative, inhibitory, or uncertain?
- How strong and broad is the evidence for each mediator and relationship?
- Which mechanisms are core, context-specific, emerging, challenged, or superseded?
- Where do approved, clinical-stage, and experimental therapies intervene?
- How has the disease model changed over time?
- Which mechanisms are shared with other diseases, and where do they diverge?

## 3. Product principles

### 3.1 The graph is primary

The mechanism map is the main knowledge interface. Text, citations, evidence summaries, therapeutic details, and clinical context explain the graph rather than replacing it.

### 3.2 Named biology over vague abstraction

Causal relationships should connect named entities wherever the evidence permits. Examples include BAFF/BLyS, BAFF-R, TLR7, UNC93B1, IFN-alpha/beta, IFNAR, DNASE1L3, C1q, and defined cell states.

Broad concepts such as “loss of tolerance” may be used as organizational containers or control-system descriptions, but must not substitute for relevant named mediators.

### 3.3 Evidence belongs to claims and relationships

A citation attached to a page is insufficient. Evidence must be attached to the specific node, edge, therapeutic assertion, or contextual claim it supports.

### 3.4 Association and causation remain distinct

The system must distinguish:

- Association
- Predisposition
- Contribution
- Activation or inhibition
- Necessity
- Sufficiency
- Disease maintenance
- Organ injury
- Therapeutic validation

### 3.5 Initiation and maintenance remain distinct

An intervention that improves established disease supports a maintenance role for its target. It does not automatically establish that the target initiated the disease.

### 3.6 Uncertainty remains visible

The interface must preserve heterogeneity, competing hypotheses, contradictory evidence, context dependence, and limitations. It must not force a single root cause when the evidence supports multiple entry routes or disease endotypes.

### 3.7 Published maps are reproducible

Every public map is generated from a versioned data snapshot. A user must be able to inspect the evidence, view the change log, and return to an earlier version.

### 3.8 AI proposes; reviewed data publishes

Automated systems may retrieve literature, extract claims, score evidence, identify contradictions, and prepare candidate changes. High-impact scientific changes require explicit approval before publication.

## 4. Initial users

### 4.1 Primary users

- Clinicians seeking a mechanistic understanding of disease
- Medical and biomedical researchers
- Advanced trainees and specialist learners
- Translational scientists assessing target relevance

### 4.2 Later users

- Drug discovery and clinical development teams
- Evidence synthesis groups
- Guideline and research organizations
- Patients or advocates using a separately simplified view

The MVP is optimized for scientifically literate users. A patient-facing interpretation is outside the initial scope.

## 5. MVP scope

### 5.1 Disease scope

The first complete implementation is SLE.

The data model must support later addition of:

- Mixed connective tissue disease
- IgA nephropathy
- Sjögren disease
- Systemic sclerosis
- Rheumatoid arthritis
- Other immune-mediated and renal diseases

### 5.2 Required MVP capabilities

1. Interactive SLE mechanism map
2. Directed, labelled causal relationships
3. Evidence inspector for nodes and edges
4. Mechanistic-weight and evidence-confidence displays
5. Approved and experimental therapeutic interventions
6. Source-linked claim evidence
7. Published map version and evidence cutoff date
8. Change log and historical map releases
9. Weekly or manually triggered literature curation workflow
10. Human review of candidate graph changes
11. Static Astro build and deployment

### 5.3 Explicit MVP non-goals

- Thousands of diseases
- Real-time literature updates
- Unsupervised publication of major mechanistic changes
- Patient-specific treatment recommendations
- Diagnostic or therapeutic decision support
- User accounts and personalized dashboards
- A live production graph database
- Fully automated causal inference from literature
- Full-text redistribution beyond licensing permissions

## 6. Primary experience

### 6.1 Disease page

The SLE disease page should contain:

- Disease title and map version
- Evidence-through date
- Primary interactive mechanism map
- Visual-encoding legend
- Node and relationship inspector
- Therapeutic intervention details
- Recent changes
- Version history
- Methodology and scoring links
- Medical and scientific-use disclaimer

### 6.2 Interaction model

Users must be able to:

- Select a mediator, process, cell state, substrate, complex, or outcome
- Select a directed relationship
- View evidence-confidence and mechanistic-weight components
- View supporting, qualifying, and contradicting claims
- Open citation details
- Inspect therapy status and mechanism of action
- Expand grouped mechanisms into named child entities
- Collapse detailed branches into a readable overview
- Switch between current and historical releases
- Identify what changed between releases

### 6.3 Progressive disclosure

The published knowledge graph should be more complete than the initial viewport.

The default map shows the principal disease-maintaining circuit and the most important upstream and downstream mechanisms. Secondary mediators, subtype-specific pathways, organ-specific branches, and emerging hypotheses appear through zooming, expansion, filters, or research mode.

Completeness must not require rendering every known entity at the same visual level.

## 7. Visualization specification

Every visual property must have one stable meaning.

### 7.1 Position

Position communicates biological and causal role, not importance alone.

- The central corridor contains the principal disease-maintaining circuit.
- Upstream susceptibility and initiating disturbances sit before or around the core circuit.
- Alternative or context-specific routes branch laterally.
- Tissue injury and organ manifestations sit downstream.
- Emerging and weakly supported mechanisms may sit toward the periphery.

The layout must preserve an understandable causal direction while supporting feedback loops.

### 7.2 Node size and typography

Default node area communicates mechanistic weight.

- Higher-weight nodes are visibly larger.
- Primary labels are larger and slightly heavier.
- Lower-weight nodes remain readable and selectable.
- Node-area scaling must avoid visually exaggerating small numerical differences.
- The numeric score and component breakdown remain available in the inspector.

Alternative emphasis modes may resize nodes by evidence confidence, study volume, or therapeutic leverage. Label prominence should continue to preserve the mechanistic-weight cue.

### 7.3 Fill intensity

A restrained, single-hue sequential fill may reinforce mechanistic importance:

- Core mechanism: stronger accent tint
- Major contributor: moderate tint
- Supporting or contextual mechanism: near-neutral tint

Fill intensity must not be the only importance cue. Avoid rainbow scales or colors that imply danger, benefit, or contradiction without that intended meaning.

### 7.4 Evidence ring

The evidence ring communicates confidence that the entity genuinely participates in the disease mechanism in the stated context.

It is derived from converging evidence dimensions such as:

- Human causal or genetic evidence
- Human observational evidence
- Functional mechanistic evidence
- Interventional evidence
- Independent replication
- Consistency across modalities
- Contradicting or qualifying evidence

The ring does not communicate universality and does not mean that the mediator causes every case of the disease.

### 7.5 Entity shapes

Shape represents biological entity class and remains consistent across every disease map.

Initial display classes:

| Entity class | Default shape |
| --- | --- |
| Receptor or sensor | Oval or circle |
| Cytokine or chemokine | Diamond |
| Enzyme or intracellular regulator | Rectangle |
| Process or control system | Dashed rectangle |
| Cell or cell state | Capsule |
| Antibody or immune complex | Hexagon |
| Biological substrate | Parallelogram |
| Tissue or clinical outcome | Octagon |

The textual entity class must remain visible or accessible. Meaning must not depend on shape alone.

### 7.6 Relationships

Every edge must specify:

- Source
- Target
- Direction
- Relationship type
- Polarity
- Biological context
- Evidence confidence
- Evidence volume
- Supporting and contradicting claims

Relationship examples include:

- Activates
- Inhibits
- Increases availability of
- Promotes survival of
- Predisposes to
- Produces
- Differentiates into
- Maintains
- Causes injury to
- Is associated with

Arrow thickness communicates relationship-evidence strength. Dashed edges communicate provisional, indirect, or context-dependent relationships according to the legend.

### 7.7 Edge geometry

Edges must be computed from current node geometry.

- Arrows attach to the boundary of source and target shapes.
- Arrowheads clearly identify the target.
- A source port or visible connection origin should be used when direction is otherwise ambiguous.
- Edges must recalculate when node size, position, shape, expansion state, or viewport changes.
- Fixed SVG coordinates are not acceptable for the production graph.
- The layout should minimize crossings while remaining stable between releases.

### 7.8 Therapeutic indicators

Therapeutic interventions are an overlay on the primary mechanism map, not a separate redundant map.

Nodes may show a compact `Rx` count or status indicator. Full labels must not overlap node content or graph relationships.

The inspector displays:

- Therapy name
- Direct or indirect target
- Mechanism of action
- Approval or development status
- Disease and phenotype indication
- Trial phase where relevant
- Interventional evidence
- Important limitations
- Last verified date

Initial statuses:

- Approved
- Established care
- Late clinical
- Early clinical
- Experimental
- Preclinical
- Discontinued or negative

### 7.9 Accessibility

- Do not rely on color, size, shape, or position alone.
- All nodes and edges must be keyboard selectable.
- The graph must expose an accessible textual representation.
- Focus state must be visible.
- Text must meet contrast requirements.
- Touch targets must be usable on small screens.
- Reduced-motion preferences must be respected.
- A linearized mechanism outline must be available as a fallback.

## 8. Scientific scoring model

All scores are versioned derived data, not immutable facts.

### 8.1 Mechanistic weight

Mechanistic weight estimates how important an entity is to explaining or maintaining the disease model.

Proposed initial components:

| Component | Initial weight |
| --- | ---: |
| Causal confidence | 35% |
| Network influence | 25% |
| Clinical or interventional validation | 20% |
| Disease coverage | 15% |
| Independent replication | 5% |

The final formula requires scientific review and calibration. The UI must show component values and scoring-model version.

### 8.2 Evidence confidence

Evidence confidence is separate from mechanistic weight. A mechanism may be confidently involved but of limited network influence, or potentially central but weakly established.

The score must account for:

- Human versus animal or in-vitro evidence
- Causal versus associative design
- Study quality and risk of bias
- Independence of research groups and datasets
- Replication
- Directness of the measured mechanism
- Contextual consistency
- Contradictions and limitations

### 8.3 Evidence volume

Evidence volume is displayed separately and must not determine importance by itself.

Prefer counts such as:

- Directly supporting primary studies
- Directly qualifying or contradicting studies
- Human mechanistic studies
- Interventional studies
- Independent cohorts or research groups

Raw citation counts may be displayed as bibliometric context but must not masquerade as causal confidence.

### 8.4 Therapeutic leverage

Therapeutic leverage is separate from biological importance.

Proposed dimensions:

- Target validation
- Intervention maturity
- Target directness
- Tractability
- Safety and therapeutic window
- Likely disease coverage
- Organ or phenotype relevance
- Biomarker availability

An important mechanism may not be druggable. A tractable target may not be the most important disease driver.

## 9. Data model

JSON is the publication and rendering contract. It is not necessarily the permanent canonical database.

### 9.1 Core record types

- Entity
- Relationship
- Claim
- Evidence item
- Publication
- Trial
- Therapy
- Disease context
- Map view
- Map release
- Change set
- Scoring-model version
- Layout snapshot

### 9.2 Entity

Required fields include:

- Stable internal ID
- Preferred label
- Synonyms
- Entity class
- External ontology identifiers
- Description
- Biological roles
- Mechanistic-weight assessment
- Evidence-confidence assessment
- Therapeutic-leverage assessment
- Review and version metadata

### 9.3 Relationship

Required fields include:

- Stable relationship ID
- Source entity ID
- Target entity ID
- Relationship type
- Polarity
- Direction
- Disease context
- Cell, tissue, organ, phenotype, organism, and disease-stage context where relevant
- Evidence-confidence assessment
- Supporting, qualifying, and contradicting claim IDs
- Review and version metadata

### 9.4 Claim

A claim is the smallest evidence-bearing scientific assertion.

Required fields include:

- Stable claim ID
- Subject
- Predicate
- Object
- Context
- Evidence type
- Causal interpretation
- Source publication or trial
- Exact supporting location where permitted
- Limitations
- Appraisal
- Reviewer status
- Extraction and review provenance

### 9.5 Therapy

Required fields include:

- Stable therapy ID
- Name
- Modality
- Direct and indirect target IDs
- Mechanism of action
- Development or approval status
- Disease and phenotype indication
- Relevant trials
- Supporting evidence claims
- Last verified date
- Historical status changes

### 9.6 Layout separation

Scientific identity and visual layout must remain separate.

BAFF remains a cytokine regardless of where it appears. Coordinates, expansion state, route emphasis, and view-specific grouping belong to a layout or map-view record rather than the core entity.

### 9.7 Stable identifiers and normalization

Synonyms must resolve to stable entities. Examples include:

- BAFF and BLyS
- Gene, protein, and receptor naming distinctions
- Preprint and final-publication relationships
- Drug generic names and development codes

Entity normalization should use appropriate biomedical ontologies and registries, including MONDO, MeSH, HGNC, UniProt, Cell Ontology, and relevant drug or trial identifiers.

## 10. Knowledge lifecycle

### 10.1 Publication rule

The published graph is never silently rewritten. A curation run produces a candidate change set. Approved changes create a new immutable release.

### 10.2 Weekly workflow

1. Read the previous successful search cursor.
2. Search literature and trial sources using a rolling overlap window.
3. Deduplicate papers, preprints, corrections, and trial updates.
4. Retrieve metadata and permissible full text.
5. Classify disease and mechanistic relevance.
6. Extract claim-level findings.
7. Normalize entities and relationships.
8. Appraise evidence and limitations.
9. Reconcile claims with the current graph.
10. Produce candidate additions, modifications, challenges, demotions, or therapy updates.
11. Validate the change set.
12. Generate a human-readable review report and before/after map preview.
13. Conduct scientific review.
14. Publish an approved immutable map release.
15. Trigger the Astro build and deployment.

### 10.3 Incremental-search reliability

Do not search only from an exact publication-date boundary.

- Use a rolling overlap window.
- Deduplicate with PMID, DOI, trial ID, and other persistent identifiers.
- Record `firstSeenAt`, `lastCheckedAt`, and `reviewedAt`.
- Search separately for corrections, expressions of concern, and retractions.
- Periodically run a broader reconciliation search.

### 10.4 Reconciliation outcomes

Each extracted claim is classified as:

- Supporting
- Refining
- Qualifying
- Contradicting
- Superseding
- Novel
- Duplicate
- Non-contributory

### 10.5 Separate lifecycle axes

| Dimension | States |
| --- | --- |
| Editorial | Candidate → under review → approved → published |
| Scientific evidence | Emerging → supported → established → challenged → superseded |
| Map prominence | Hidden → peripheral → major → core |

These axes must not be collapsed into one status.

### 10.6 New-mediator rules

A candidate mediator requires:

- Normalized biological identity
- At least one explicit relationship to the current graph
- Traceable primary evidence
- Defined biological context
- Evidence appraisal
- Duplicate and synonym checks
- Reviewer disposition

New mediators normally enter the research layer or periphery before being promoted to the core map.

### 10.7 Automation boundaries

Low-risk operations that may be automated after validation:

- Publication metadata updates
- Identifier reconciliation
- Linking an additional supporting source
- Trial registry metadata updates
- Correction and retraction flags

Changes requiring explicit review:

- Adding or removing a mediator
- Adding a causal relationship
- Changing relationship direction or polarity
- Promoting a mechanism to core status
- Demoting an established mechanism
- Changing a therapy’s scientific interpretation
- Marking a claim contradicted or superseded

## 11. Static application architecture

### 11.1 Publication model

The public application is an Astro static site.

- Disease pages are prerendered.
- Scientific content is loaded at build time.
- The interactive graph is a client-side React island.
- A full rebuild occurs when an approved map release is merged.
- Historical release pages are also statically generated.

### 11.2 Proposed frontend stack

- Astro
- TypeScript
- React for the mechanism-map island
- React Flow or Cytoscape.js for graph rendering
- A geometry-aware layout system such as ELK where useful
- Astro content collections or a custom build-time loader
- JSON Schema and generated TypeScript types

The graph-library choice requires a focused implementation spike. The selected library must support custom accessible nodes, dynamic geometry, labelled edges, feedback loops, stable layouts, compound nodes, expansion, and exportable snapshots.

### 11.3 Initial routes

```text
/
/diseases/
/diseases/sle/
/diseases/sle/changes/
/diseases/sle/versions/
/diseases/sle/versions/{release-id}/
/methodology/
/methodology/evidence/
/methodology/scoring/
/sources/
```

### 11.4 Static-site limitations accepted for MVP

- Updates require a rebuild.
- No in-browser editorial interface.
- No authenticated reviewer workflow.
- Cross-disease queries are generated at build time or run over bundled static indexes.

## 12. Repository structure

```text
causome/
├── AGENTS.md
├── PRD.md
├── IDEA.md
├── proto-sle.md
│
├── .codex/
│   └── skills/
│       ├── literature-scan/
│       ├── reconcile-evidence/
│       ├── review-change-set/
│       └── publish-atlas-release/
│
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   ├── public/
│   ├── astro.config.mjs
│   └── package.json
│
├── curation/
│   ├── src/
│   │   ├── search/
│   │   ├── retrieval/
│   │   ├── extraction/
│   │   ├── normalization/
│   │   ├── appraisal/
│   │   ├── reconciliation/
│   │   ├── validation/
│   │   └── reporting/
│   ├── prompts/
│   ├── policies/
│   ├── tests/
│   ├── evals/
│   ├── reviews/
│   ├── cache/
│   └── pyproject.toml
│
├── knowledge/
│   ├── entities/
│   ├── claims/
│   ├── evidence/
│   ├── therapies/
│   ├── scoring-models/
│   └── diseases/
│       └── sle/
│           ├── current.json
│           └── releases/
│
├── schemas/
│   ├── entity.schema.json
│   ├── relationship.schema.json
│   ├── claim.schema.json
│   ├── evidence.schema.json
│   ├── therapy.schema.json
│   ├── disease-map.schema.json
│   └── change-set.schema.json
│
└── .github/
    └── workflows/
        ├── curate.yml
        ├── validate.yml
        └── deploy.yml
```

## 13. Skills, tools, prompts, and policies

These are distinct artifacts.

### 13.1 Deterministic tools

Production commands live in `curation/` or `web/` and must work without an agent skill.

Proposed command interface:

```bash
uv run causome search --disease sle
uv run causome retrieve --scan latest
uv run causome extract --scan latest
uv run causome reconcile --disease sle
uv run causome validate-change-set
uv run causome review-report --change-set latest
uv run causome publish --change-set sle-2026-W41
pnpm --dir web test
pnpm --dir web build
```

### 13.2 Runtime prompts

Versioned prompts used programmatically by the pipeline live under `curation/prompts/`.

Each prompt must declare:

- Purpose
- Required input schema
- Required output schema
- Model assumptions
- Failure behavior
- Version
- Associated evaluation suite

### 13.3 Scientific policies

Human- and agent-readable scientific rules live under `curation/policies/`.

Initial policies include:

- Literature inclusion and exclusion
- Evidence appraisal
- Causal-language rules
- Mediator inclusion
- Entity normalization
- Contradiction handling
- Retraction handling
- Therapeutic-status verification
- Publication approval

### 13.4 Codex skills

Repo-scoped skills live under `.codex/skills/` and teach an agent how to orchestrate existing tools and policies.

Each skill contains a `SKILL.md` and only the necessary supporting references, scripts, or templates.

Initial skills:

1. `literature-scan`
2. `reconcile-evidence`
3. `review-change-set`
4. `publish-atlas-release`

Skills must not contain the only copy of production logic or scientific policy.

## 14. Pull-request workflow

A curation pull request should contain:

- Candidate change-set JSON
- Updated knowledge records
- New immutable disease release
- Machine-readable validation report
- Human-readable scientific change report
- Added and removed evidence
- Contradiction and uncertainty summary
- Before/after map preview
- Score changes and scoring-model version
- Reviewer checklist

The pull request must not contain licensed full text unless redistribution is permitted.

Merging an approved knowledge change triggers:

1. Schema validation
2. Referential-integrity checks
3. Curation tests and evaluations
4. Frontend tests
5. Static build
6. Accessibility checks
7. Visual regression checks
8. Deployment
9. Release-health verification

## 15. Validation requirements

The build fails when:

- An edge references a missing node.
- A claim lacks a source.
- A therapy references a missing target.
- An entity lacks a display class.
- A published record has candidate editorial status.
- A score is outside the schema range.
- A score lacks its scoring-model version.
- A published release lacks a parent release.
- A visible node lacks layout data.
- Two stable IDs conflict.
- Required context or provenance is missing.
- The current release pointer does not resolve.

Warnings requiring review include:

- Large score changes from one study
- Causal-language escalation
- Relationship-direction changes
- New core nodes
- Unresolved contradictions
- Therapy-status changes
- Evidence based predominantly on non-human studies
- Unreviewed preprints affecting the core map

## 16. Testing strategy

### 16.1 Curation tests

- Source query construction
- Incremental search and overlap windows
- Deduplication
- Identifier normalization
- Claim extraction schema compliance
- Relationship reconciliation
- Retraction handling
- Idempotent reruns
- Change-set generation

### 16.2 Prompt and model evaluations

- Mechanistic relevance classification
- Claim extraction precision and recall
- Direction and polarity accuracy
- Association-versus-causation classification
- Context extraction
- Citation entailment
- Contradiction detection
- Appropriate abstention
- No unsupported score changes

### 16.3 Knowledge tests

- JSON Schema validation
- Referential integrity
- Stable IDs
- Version lineage
- No orphan claims or sources
- No duplicate normalized entities
- Current snapshot reproducibility

### 16.4 Frontend tests

- All nodes and edges render from JSON
- Dynamic edge attachment
- Selection and inspector behavior
- Expansion and collapse
- Historical release loading
- Keyboard navigation
- Screen-reader fallback
- Mobile layout
- Reduced motion
- Visual regression
- Static build reproducibility

## 17. Performance and resilience

- Static HTML should remain useful before graph hydration.
- The interactive graph should load only on disease pages.
- The initial SLE map should become interactive promptly on typical broadband and mobile connections.
- Large research layers should be lazy-loaded or progressively expanded.
- Published pages must remain available if literature APIs, model APIs, or the curation system are unavailable.
- The deployment must be recoverable by redeploying an earlier immutable release.

## 18. Security, privacy, and licensing

- API keys exist only in the curation or CI environment.
- No secrets are exposed in static assets.
- External paper content is treated as untrusted input.
- Extracted instructions inside papers are never executed.
- Full-text storage and quotation follow source licensing.
- Public JSON contains identifiers, claims, summaries, and permitted excerpts rather than redistributed licensed articles.
- Dependency and credential scanning run in CI.
- Curation logs must not expose secrets or restricted content.

## 19. Provenance and auditability

Every published scientific assertion must be traceable through:

```text
Rendered node or edge
→ published entity or relationship
→ reviewed claim
→ evidence item
→ publication or trial identifier
→ extraction and appraisal record
→ map release and reviewer decision
```

The system records:

- Automated extraction method and version
- Prompt version where applicable
- Model identifier where applicable
- Retrieval date
- Reviewer and review date
- Approval decision
- Source and destination release IDs

## 20. Release phases

### Phase 0: Architecture and schema spike

Deliverables:

- Repository skeleton
- Core JSON Schemas
- Minimal SLE sample graph
- React Flow versus Cytoscape technical spike
- Static Astro page rendering sample JSON
- Initial validation command

Exit criteria:

- One versioned JSON map renders without hard-coded scientific content.
- Node shape, size, evidence ring, edge direction, and inspector are data-driven.
- Invalid references fail validation.

### Phase 1: Curated SLE prototype

Deliverables:

- Curated SLE mediator set
- Named relationships and feedback loops
- Evidence inspector
- Therapeutic overlay
- Mechanistic-weight and evidence-confidence methodology draft
- Accessible linear fallback
- Initial citations and provenance

Exit criteria:

- Domain review confirms that the map is scientifically coherent.
- Citations support the claims to which they are attached.
- General processes do not conceal important named mediators.

### Phase 2: Versioning and publication

Deliverables:

- Immutable release format
- Current-release pointer
- Change log
- Historical map routes
- Before/after comparison
- Static deployment workflow

Exit criteria:

- A knowledge change produces a reviewed new release and reproducible deployment.
- The previous release remains accessible.

### Phase 3: Curation pipeline

Deliverables:

- Incremental literature search
- Deduplication and source tracking
- Claim extraction
- Reconciliation engine
- Candidate change-set generator
- Review report
- Scheduled and manual workflows
- Prompt evaluations

Exit criteria:

- A weekly run identifies relevant new literature and produces a reviewable proposal without directly modifying the published map.

### Phase 4: Additional diseases and comparison

Deliverables:

- MCTD and IgA nephropathy maps
- Shared-entity reuse
- Cross-disease comparison view
- Common pathway queries
- Disease-specific layout snapshots

Exit criteria:

- One mediator can participate in multiple disease maps without duplicated canonical identity.
- Shared and divergent relationships can be compared reproducibly.

## 21. MVP acceptance criteria

The MVP is complete when:

1. The SLE page is statically generated by Astro.
2. The graph is rendered entirely from a validated JSON release.
3. Named mediators, cell states, complexes, processes, and outcomes use consistent shapes.
4. Mechanistic weight controls node prominence.
5. Evidence confidence controls the evidence ring.
6. Relationships are directional, labelled, selectable, and evidence-linked.
7. Dynamic edges attach to node boundaries after layout and resizing.
8. BAFF/BLyS and other important named mediators are not hidden inside generic B-cell labels.
9. Approved and experimental therapies are visible without obscuring graph content.
10. Selecting a node or edge exposes supporting, qualifying, and contradicting evidence.
11. Scores are identified as versioned assessments rather than facts.
12. A user can inspect the current version, evidence cutoff, change log, and previous release.
13. A curation run produces a candidate change set rather than directly publishing.
14. High-impact changes require explicit approval.
15. Schema, integrity, accessibility, and static-build checks pass in CI.

## 22. Success measures

### Scientific quality

- Proportion of displayed claims supported by directly relevant sources
- Expert agreement with relationship direction and evidence category
- Rate of citation-entailment failures
- Rate of duplicate or incorrectly normalized mediators
- Relevant-paper retrieval recall
- Appropriate contradiction and retraction handling

### Product quality

- Users can identify the principal disease-maintaining circuit.
- Users can distinguish evidence confidence from mechanistic importance.
- Users can identify where approved and experimental therapies intervene.
- Users can understand why a mechanism was promoted, demoted, or qualified.
- The graph remains readable as detail is expanded.

### Operational quality

- Weekly scan completion rate
- Time from evidence discovery to reviewed candidate change
- Reproducible release builds
- Rollback success
- Number of unreviewed high-impact changes reaching publication: zero

## 23. Open decisions

The following require explicit decisions or validation:

1. React Flow versus Cytoscape.js
2. Exact mechanistic-weight formula
3. Exact evidence-confidence rubric
4. Score calibration and whether scores should be continuous or tiered
5. Minimum evidence threshold for candidate and published mediators
6. Default-map density and progressive-disclosure rules
7. Publication cadence: every approved weekly run versus monthly stable release
8. Hosting provider
9. Literature and full-text licensing strategy
10. Expert-review workflow and reviewer attribution
11. When to move from Git-backed JSON to PostgreSQL
12. Whether raw citation counts should be publicly displayed
13. Policy for preprints, sponsor-reported results, and unpublished trial data
14. Public API timing and scope

## 24. Immediate next steps

1. Approve this PRD as the working build contract.
2. Create the repository skeleton.
3. Define the first JSON Schemas.
4. Convert the current SLE prototype into structured entities, relationships, and claims.
5. Build the graph-library spike using the same sample release.
6. Select the graph renderer.
7. Implement the Astro disease-page shell.
8. Implement schema and referential-integrity validation.
9. Curate the first reviewable SLE map release.
10. Add the curation workflow only after the published-data contract is stable.
