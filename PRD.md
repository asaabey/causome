# Causome: Living Disease Atlas

Product requirements and build manifest

- Status: Draft
- Version: 0.3
- Date: 2026-10-09
- Initial disease: Systemic lupus erythematosus (SLE)
- Product contract: this document; current implementation and remaining gates are recorded in `PROGRESS.md`.

## 1. Product summary

Causome is a static, evidence-linked atlas of disease mechanisms. Its primary interface is an interactive causal map showing how named biological mediators, cell states, molecular processes, tissue responses, and therapeutic interventions relate to one another.

The MVP publishes one manually curated, reviewed SLE map. Later milestones add a separate curation pipeline that searches for newly indexed literature, extracts claim-level evidence, compares it with the currently published disease model, and proposes a reviewable change set. Approved changes produce a new immutable disease-map release and trigger a static site rebuild.

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

Automated systems may retrieve literature, extract claims, propose evidence assessments, identify contradictions, and prepare candidate changes. For the MVP, every change to public knowledge requires explicit approval bound to the exact candidate revision. Automation does not confer scientific approval.

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
2. Directed, labelled causal relationships and explicitly symmetric associations
3. Evidence inspector for nodes and edges
4. Explicit evidence context, limitations, and assessment status
5. Approved and experimental therapeutic interventions
6. Source-linked claim evidence
7. Published map version and evidence cutoff date
8. Accessible textual mechanism outline
9. Manual JSON authoring and validation
10. Human review of the initial scientific release
11. Static Astro build and deployment

The MVP is complete at Milestone 3 in Section 20. It is a usable, evidence-linked SLE atlas with one immutable release. Milestones 1–2 build that product; Milestones 4–6 extend it after launch.

The first release contains 15–25 named entities, 20–40 reviewed relationships, and 3–5 evidence-linked therapies, including approved and experimental examples with explicitly verified status and indication. These are scope budgets, not quotas to fill with weak evidence; reduce the set with a documented domain-review rationale if necessary. The initial map covers the principal reviewed circuit, a feedback loop, and one organ-injury branch rather than attempting exhaustive SLE coverage.

Scores are optional for MVP. Public releases ship numerical assessments as `null` with “Not assessed” labels unless Section 8.5 calibration has already passed. Internal local candidates may contain explicitly provisional agent or human editorial appraisals with assessor/date, exact base/input digests, claim-linked component rationales and validated confidence ceilings. These drafts remain uncalibrated, require fresh appraisal after evidence reconciliation, and cannot be published as assessed values. Unassessed nodes use equal baseline sizing and neutral rings; position, labels, and named biological relationships communicate the mechanism. Overview membership does not assert a scored `core` status.

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
- Automated literature retrieval, extraction, reconciliation, or weekly scans
- Calibrated numerical scoring as a launch dependency
- Historical-version browsing and before/after comparison
- Expandable compound groups, research mode, and alternate emphasis modes
- Cross-disease comparison

## 6. Primary experience

### 6.1 Disease page

The SLE disease page should contain:

- Disease title and map version
- Evidence-through date
- Primary interactive mechanism map
- Visual-encoding legend
- Node and relationship inspector
- Therapeutic intervention details
- Initial release note
- Methodology and scoring links
- Medical and scientific-use disclaimer

Recent changes and interactive version history are added in Milestone 4.

### 6.2 Interaction model

Users must be able to:

- Select a mediator, process, cell state, substrate, complex, or outcome
- Select a directed relationship or symmetric association
- View evidence context and assessment status; calibrated components only when available
- View supporting, qualifying, and contradicting claims
- Open citation details
- Inspect therapy status and mechanism of action

Milestone 4 adds grouped-mechanism expansion/collapse, historical-release switching, and before/after changes. The MVP exposes every entity in its small map without requiring these controls.

### 6.3 Progressive disclosure

From Milestone 4 onward, the published knowledge graph may be more complete than the initial viewport.

The MVP shows its complete curated set through pan/zoom and the textual outline. The default map shows the principal reviewed disease-maintaining circuit and selected upstream and downstream mechanisms. Later secondary mediators, subtype-specific pathways, organ-specific branches, and emerging hypotheses appear through expansion, filters, or research mode.

Completeness must not require rendering every known entity at the same visual level.

The default overview displays at most 25 nodes and 40 relationships. Additional named entities remain reachable through expansion or filters and the textual outline. View records explicitly declare overview membership; nodes are not selected solely by score. A release that needs a denser overview must revise this budget with a reviewed usability result.

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
- The assessed tier, underlying score, and component breakdown remain available in the inspector.

Optional emphasis modes may resize nodes by evidence confidence or study volume. Label prominence should continue to preserve the mechanistic-weight cue. Resizing by therapeutic leverage is deferred until a separate rubric is calibrated.

Unassessed nodes use a fixed, readable baseline size and an explicit “Not assessed” label. They must not be rendered as zero-weight nodes. Public size scaling uses the tiers in Section 8.5 rather than presenting small score differences as meaningful.

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

The ring uses the ordinal confidence tiers in Section 8.2, with a textual label in the inspector and accessible outline. An unassessed confidence value uses a neutral outline labelled “Not assessed”; it is visually distinct from assessed tier 0.

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
- Directionality: `directed` or `symmetric`
- Relationship type
- Polarity: `positive`, `negative`, `mixed`, or `not_applicable`
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

Directed predicates use a source-to-target arrow. `is_associated_with` is symmetric, uses `polarity: not_applicable`, and renders as a labelled line with no arrowhead. Endpoint order for a symmetric relationship is only a storage convention and must not imply cause or temporal order. Normalize symmetric endpoint IDs into a consistent order for deduplication. A bidirectional causal circuit is represented by two separately supported directed relationships, not by an association or a double-headed causal arrow. Line thickness follows confidence tiers; unassessed relationships use a neutral baseline width.

### 7.7 Edge geometry

Edges must be computed from current node geometry.

- Arrows attach to the boundary of source and target shapes.
- Arrowheads clearly identify the target of directed relationships; symmetric associations have no arrowheads.
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

All scores are versioned editorial assessments, not measured probabilities or immutable biological facts. The provisional rubric `causome-scoring-v0.1` below is the contract for Milestone 4. Its scientific calibration must pass Section 8.5 before assessed values are publicly displayed. The MVP supports unassessed values and can launch without numerical scores or completed calibration.

### 8.1 Mechanistic weight

Mechanistic weight estimates how important an entity is to explaining or maintaining the disease model.

Mechanistic weight uses five components, each assessed on an integer scale from 0 to 4 with a rationale and supporting claim IDs:

| Component | Initial weight |
| --- | ---: |
| Causal confidence | 35% |
| Network influence | 25% |
| Clinical or interventional validation | 20% |
| Disease coverage | 15% |
| Independent replication | 5% |

The component anchors are:

| Component | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| Causal confidence | Appraised evidence does not establish a causal role | Indirect causal hypothesis | Direct functional perturbation supports a contextual contribution | Converging human and functional causal evidence | Independently corroborated human causal evidence in the stated context |
| Network influence | No supported role in the reviewed circuit | One local downstream effect | One supported branch or feedback connection | Links multiple supported branches or sustains a major feedback loop | Connects multiple branches and sustains the principal reviewed circuit |
| Clinical or interventional validation | No qualifying intervention evidence found in the appraised set | Preclinical target perturbation | Human target engagement or biomarker change | Controlled human intervention links target modulation to a relevant disease outcome | Independently corroborated controlled human outcomes with target attribution |
| Disease coverage | No demonstrated coverage in the appraised set | Rare or narrowly defined subgroup | Multiple defined subgroups or one major phenotype | Broad involvement across multiple major phenotypes | Broad involvement across the major phenotypes and stages covered by the release |
| Independent replication | No independent corroboration | Replication within one research group or dataset family | Two independent groups and non-overlapping datasets | At least three independent groups across two evidence modalities | At least three independent groups across human and functional modalities with consistent findings |

Network influence is a reviewed biological interpretation of supported relationships, not raw degree or centrality. Coverage must name the assessed phenotypes and its evidence; it must not infer a population percentage from study volume. An intervention's success does not establish initiation or direct target attribution by itself.

For components `C`, `N`, `I`, `D`, and `R`, calculate `rawWeight = (35*C + 25*N + 20*I + 15*D + 5*R) / 4`. Store the components and raw value; display the score rounded to the nearest 5, with halfway values rounded upward. The public tiers use the raw value: minimal `[0,20)`, supporting `[20,40)`, contributor `[40,60)`, major `[60,80)`, and high `[80,100]`. Tier names describe this assessment, not editorial core status.

All five components are required to calculate a weight. Missing or insufficiently appraised components are `null`, making the aggregate `null`; do not substitute zero or renormalize weights. Zero means an explicit completed appraisal meeting the zero anchor, not a missing appraisal. The UI must show assessment context, component values, rationale, and scoring-model version.

### 8.2 Evidence confidence

Evidence confidence is separate from mechanistic weight. A mechanism may be confidently involved but of limited network influence, or potentially central but weakly established.

The appraisal must account for:

- Human versus animal or in-vitro evidence
- Causal versus associative design
- Study quality and risk of bias
- Independence of research groups and datasets
- Replication
- Directness of the measured mechanism
- Contextual consistency
- Contradictions and limitations

For each dimension, store the evidence, reviewer rationale, and an appraisal of `adequate`, `limited`, `inadequate`, or `unknown`. These appraisals support an ordinal confidence tier; they are not averaged into a probability:

| Tier | Label | Minimum interpretation |
| --- | --- | --- |
| 0 | Unsupported or refuted | Completed appraisal finds no adequate support for the exact assertion, or evidence refutes it |
| 1 | Preliminary | Indirect evidence or an unreplicated finding; directness, quality, or major contradictions limit confidence |
| 2 | Supported | Converging, directly relevant findings support involvement, with important limitations or without independent human corroboration |
| 3 | Strong | At least two independent human primary-study groups with non-overlapping datasets, direct functional support, and adequate quality support the exact assertion |
| 4 | Established in context | Tier 3 plus human genetic, perturbational, or interventional causal evidence independently corroborated in the stated context |

Assign the highest tier whose complete criteria are met. A reviewer may downgrade with a recorded rationale. Predominantly non-human evidence cannot exceed tier 2. Inadequate evidence quality or an unresolved material contradiction caps the assessment at tier 1. An incomplete appraisal produces `null` and “Not assessed”, not tier 0. An association cannot acquire a causal predicate merely because its involvement confidence is high; upgrading the interpretation requires a separate reviewed causal claim.

### 8.3 Evidence volume

Evidence volume is displayed separately and must not determine importance by itself.

Prefer counts such as:

- Directly supporting primary studies
- Directly qualifying or contradicting studies
- Human mechanistic studies
- Interventional studies
- Independent cohorts or research groups

Raw citation counts may be displayed as bibliometric context but must not masquerade as causal confidence.

Count primary studies once per study ID, link multiple reports of the same study, and record shared cohorts or datasets. Independent-group and cohort counts must exclude reused data; preprints and final publications do not count as independent replications.

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

The MVP displays therapy details and evidence-linked limitations. Milestone 4 may add contextual categorical appraisals of therapeutic leverage. A composite therapeutic-leverage score or resizing by therapeutic leverage requires a separately versioned, calibrated rubric and is outside the committed milestones.

### 8.5 Calibration and publication gate

- Store the complete rubric, weights, rounding rules, tier boundaries, display mapping, and calibration results in a versioned scoring-model record. Published releases embed that record.
- Before publishing assessed scores, two designated domain reviewers independently assess at least 20 representative entities and relationships covering strong, weak, contradictory, and missing evidence. At least 80% of paired ordinal/component ratings must differ by no more than one level. Paired `null` values agree; a `null`/numeric pair counts as disagreement. Record both ratings and adjudicate every disagreement into the reference set.
- Publish the sample selection, agreement result, limitations, and final reviewer approval with the methodology. If the gate fails, revise and reversion the rubric and repeat calibration; keep public assessments explicitly unassessed until it passes.
- Use fixed node areas for the five weight tiers in ratios `1 : 1.5 : 2 : 3 : 4`, scaled from a readable minimum appropriate to the entity shape. Confidence uses five distinct ring/line treatments with accessible labels. The renderer stores these mappings in the release's view configuration.
- A new scoring-model version requires reappraisal or deterministic recomputation as appropriate, a score-change report, and explicit approval. It never rewrites assessments in an older release.
- Automated assessments are candidates. Core prominence requires a completed weight assessment, confidence of at least tier 2, reviewed primary evidence, and an explicit promotion decision; no score alone promotes an entity.

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
- Contextual assessment
- Map view
- Map release
- Change set
- Approval record
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
- Review and version metadata

An entity stores canonical biological identity only. Mechanistic weight, disease involvement, therapeutic leverage, prominence, and disease-specific evidence belong to contextual assessments or map views. Biological-role assertions themselves must reference reviewed claims.

### 9.3 Relationship

Required fields include:

- Stable relationship ID
- Source entity ID
- Target entity ID
- Relationship type
- Polarity, including `not_applicable` for symmetric associations
- Directionality: `directed` or `symmetric`
- Disease context
- Cell, tissue, organ, phenotype, organism, and disease-stage context where relevant
- Contextual evidence-confidence assessment ID
- Supporting, qualifying, and contradicting claim IDs
- Review and version metadata

For symmetric associations, source and target fields identify canonically ordered endpoints, not causal roles. Predicate, directionality, and polarity must satisfy a schema-defined compatibility table. Directed relationships require an explicitly supported direction; association evidence alone cannot satisfy that requirement.

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

Claims reference one or more evidence items. Each evidence item identifies the source revision, study or cohort identity where known, supporting location, retrieval date, permissible excerpt or summary, and appraisal. Publication and trial records preserve the source metadata as retrieved; later corrections do not mutate earlier source snapshots.

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

### 9.8 Contextual assessment

Required fields include:

- Stable assessment ID and immutable revision ID
- Subject entity or relationship ID
- Disease-context ID, including phenotype, tissue, organism, and stage where relevant
- Scoring-model version
- Status per assessment metric: `assessed` or `unassessed`, permitting an assessed confidence tier alongside an unassessed weight
- Mechanistic-weight components and aggregate for entities, or `null` where unassessed
- Evidence-confidence tier and dimensional appraisals
- Therapeutic-leverage dimensional appraisals where relevant
- Supporting, qualifying, and contradicting claim IDs
- Rationale, reviewer decision, and review date

An entity may have multiple assessments for different diseases or phenotypes without duplicating its canonical identity. A map view chooses an explicit assessment revision for each displayed subject. Changing the selected context changes the displayed assessment; evidence from incompatible contexts is not silently pooled. There must be at most one selected assessment per subject and context within a release.

### 9.9 Map release and dependency snapshot

For the MVP, each release is a self-contained JSON bundle. Working records under `knowledge/` may evolve, but a release embeds all transitive public rendering dependencies: entities, relationships, claims, evidence items, publication and trial metadata, therapies, disease contexts, assessments, scoring models, map views, layout snapshots, and applicable schema versions. Scientific and view record references resolve inside that bundle; historical pages do not dereference the mutable working store or current external metadata. Parent-release, authenticated-review, deployment-artifact, and external citation links are audit or navigation references rather than mutable rendering dependencies.

Required release fields include:

- Unique release ID, disease ID, and release-format version
- `parentReleaseId` and parent content digest
- Evidence cutoff, creation date, and source change-set revision
- Embedded dependency records with stable IDs and revision IDs
- Content manifest and SHA-256 digest of deterministic serialized scientific and view content
- Approval-record references and publication attestation
- Frontend build revision and archived deployment-artifact reference

The first release of a disease is its root and has `parentReleaseId: null` and no parent digest. One root release is sufficient for MVP. Every subsequent release must reference the current release for that disease as its parent at publication time. Reject extra roots, missing parents, cycles, and attempts to overwrite a release ID. Implement root validation and release-overwrite protection before MVP launch; complete successor and comparison workflows in Milestone 4 before publishing an update.

`knowledge/diseases/sle/current.json` contains only the current release ID and its content digest. Publication advances this pointer only after validation and approval. A rollback redeploys an archived artifact; it does not rewrite history. Reverting current scientific content requires a new approved release whose parent is the current release.

Historical routes render exclusively from the selected bundle. Scientific content and view configuration remain reproducible after working-store changes. Exact visual reproduction uses the archived frontend artifact and pinned build inputs; rebuilding history with a newer frontend must retain the original scientific snapshot. Exclude approval records, generated publication timestamps, and deployment metadata from the approved content digest to avoid circular hashes; they are bound to it by the publication attestation. The hashed content includes the evidence cutoff, source revisions, parent identity, scientific records, scoring models, schemas, and view configuration.

### 9.10 Change sets and approval records

A change set identifies its base release ID and digest, immutable candidate revision, complete proposed changes, candidate release-content digest, validation report, and scientific review report. The review report and previews must be generated from that exact candidate content. Candidate bundles may be prepared before approval but are not public releases.

An approval record identifies the authorized reviewer, authenticated review event, decision, review date, change-set revision, reviewed commit, base release digest, candidate content digest, scoring-model versions, and acknowledged review warnings. The publication workflow generates the record from an authenticated approval; a JSON field written by a proposal author is not proof of approval.

For the MVP, use repository pull-request reviews and required CI checks. At least one configured domain reviewer other than the proposal author must approve each public knowledge change. Scoring-model calibration additionally requires the two reviewers in Section 8.5. Reviewer authorization is maintained in protected publication policy; a proposal cannot authorize its own reviewer by modifying that policy. This is a repository workflow, not an authenticated public-site editorial interface.

Any change to candidate content, evidence, assessments, scoring model, or view configuration invalidates the approval and requires a new candidate revision and review. If the base release ceases to be current before publication, reconcile against the new base and obtain approval again. The publisher verifies authenticated approval and the content digest before finalizing the bundle and advancing the pointer.

## 10. Knowledge lifecycle

The MVP authors the initial knowledge records manually and publishes them through validated, authenticated repository review. Automated search, extraction, and reconciliation in Sections 10.2–10.4 are Milestone 5 requirements. The publication and review rules apply from the first release.

### 10.1 Publication rule

The published graph is never silently rewritten. A curation run produces a candidate change set. Approved changes create a new immutable release using the snapshot and approval contracts in Sections 9.9–9.10. Initial publication follows the same approval gate, with a null base release.

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
13. Conduct scientific review of the exact candidate revision and record authenticated approval.
14. Verify approval, the candidate digest, and the current base release; publish an immutable map release.
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

A newly published mediator must satisfy all candidate requirements and have at least one reviewed, directly relevant supporting primary-study claim for its stated context. Its relationships and assessment selection must be reviewed, even if its scores remain explicitly unassessed. Core promotion additionally meets Section 8.5. Existing challenged or superseded mediators may remain in history or a clearly labelled research view with their contradicting evidence; loss of support is not a reason to erase their history.

### 10.7 Automation boundaries

Operations that may be prepared automatically as candidate changes after validation:

- Publication metadata updates
- Identifier reconciliation
- Linking an additional supporting source
- Trial registry metadata updates
- Correction and retraction flags

For the MVP, these operations still require approval before altering any public release. Linking evidence, changing trial metadata, or flagging a retraction can affect scores, interpretation, or therapy status; all resulting scientific changes must appear in the review report. Metadata preparation must not silently recalculate published assessments. Retrieval-cache refreshes may run without approval because they do not alter a public release.

Scientific changes requiring domain review include:

- Adding or removing a mediator
- Adding a causal relationship
- Changing relationship direction or polarity
- Promoting a mechanism to core status
- Demoting an established mechanism
- Changing a therapy’s scientific interpretation
- Marking a claim contradicted or superseded
- Changing an assessment, scoring model, or evidence eligibility

The full diff against the base release determines review scope, including derived changes. Automated publication of metadata-only updates is a later capability requiring a separately approved policy and tests; it is outside the MVP.

## 11. Static application architecture

### 11.1 Publication model

The public application is an Astro static site.

- Disease pages are prerendered.
- Scientific content is loaded at build time.
- The interactive graph is a client-side React island.
- A full rebuild occurs when an approved candidate release is merged and finalized by the publication workflow.
- Milestone 4 adds statically generated historical release pages.

### 11.2 Proposed frontend stack

- Astro
- TypeScript
- React for the mechanism-map island
- React Flow or Cytoscape.js for graph rendering
- A geometry-aware layout system such as ELK where useful
- Astro content collections or a custom build-time loader
- JSON Schema and generated TypeScript types

The graph-library choice requires a focused implementation spike in Milestone 1. The MVP selection must support custom accessible nodes, dynamic geometry, labelled edges, feedback loops, and stable layouts. Verify that compound nodes, expansion, and exportable snapshots can be added later; do not implement those features to finish the spike.

### 11.3 Initial routes

```text
/
/diseases/
/diseases/sle/
/methodology/
/methodology/evidence/
/sources/
```

Milestone 4 implements generic `/diseases/{disease-id}/compare/`, `/diseases/{disease-id}/history/`, `/diseases/{disease-id}/releases/{release-id}/`, and `/methodology/#scoring`. Internal candidate snapshots use a separate `/candidates/{candidate-id}/` route. Until then, the disease page shows its release ID, evidence cutoff, initial release note, and unassessed-score explanation.

### 11.4 Static-site limitations accepted for MVP

- Updates require a rebuild.
- No in-browser editorial interface.
- No authenticated reviewer interface in the public site; authenticated repository review is required for publication.
- Cross-disease queries are generated at build time or run over bundled static indexes.

## 12. Repository structure

This is the target structure across all milestones. Milestone 1 creates only `web/`, the minimal `knowledge/` and `schemas/` records, and validation/build CI. Add curation modules, evaluation suites, and agent skills when their milestone begins; empty pipeline scaffolding is not an MVP deliverable.

```text
causome/
├── AGENTS.md
├── PRD.md
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
│   ├── relationships/
│   ├── claims/
│   ├── evidence/
│   ├── publications/
│   ├── trials/
│   ├── therapies/
│   ├── contexts/
│   ├── assessments/
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
│   ├── assessment.schema.json
│   ├── scoring-model.schema.json
│   ├── map-release.schema.json
│   ├── approval.schema.json
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

The MVP needs deterministic release validation, build commands, and manual scientific/publication policies. Automated pipeline commands, runtime prompts, and orchestration skills below are Milestone 5 deliverables.

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
uv run causome publish --change-set sle-2026-W41 --revision 1 --approval approved-review-id
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
- Candidate self-contained disease-release bundle and content digest
- Machine-readable validation report
- Human-readable scientific change report
- Added and removed evidence
- Contradiction and uncertainty summary
- Before/after map preview
- Score changes and scoring-model version
- Reviewer checklist
- Authenticated approval bound to the reviewed revision before publication

The pull request must not contain licensed full text unless redistribution is permitted.

Required checks run before merge and again against the exact artifact to be published. Candidate previews are separate from public release routes. Merging an approved knowledge change triggers:

1. Schema validation
2. Referential-integrity checks
3. Approval, content-digest, and current-base verification
4. Tests and evaluations for implemented milestone capabilities
5. Frontend tests
6. Static build
7. Accessibility checks
8. Visual regression checks
9. Finalization of the immutable release, pointer update, and deployment-artifact archive
10. Deployment
11. Release-health verification

Failure of an approval or validation gate prevents publication and deployment. A deployment failure retains the last healthy public artifact and its displayed release; retry the approved artifact or redeploy the previous archived artifact.

For the root MVP release, the change report is an initial release note and the preview shows the proposed map; there is no prior map to compare. Scores remain unassessed unless calibrated. Automated curation tests and model evaluations become required in Milestone 5; their absence does not block the manual MVP.

## 15. Validation requirements

The build fails when:

- An edge references a missing node.
- A claim lacks a source.
- A therapy references a missing target.
- An entity lacks a display class.
- A public release contains a scientific record whose editorial status is neither `approved` nor `published`, including `candidate` and `under review`.
- A score is outside the schema range.
- A score lacks its scoring-model version.
- A published assessed value lacks a calibrated and approved scoring-model version.
- An unassessed component is treated as zero, or an aggregate is present with missing required components.
- A displayed subject lacks a selected assessment for its exact context.
- A canonical entity contains disease-specific assessment values.
- A non-root release lacks a valid parent, a disease has more than one root, or release lineage contains a cycle.
- The root does not explicitly have `parentReleaseId: null`.
- A release ID or its embedded content would overwrite an existing release.
- A scientific or view record reference resolves outside its embedded dependency snapshot, or its manifest digest does not match its content.
- An approval is missing, unauthorized, stale, or bound to a different candidate revision, commit, base, or content digest.
- The candidate's base is no longer current at publication time.
- A symmetric association has an arrowhead or causal polarity, or a predicate has incompatible directionality or polarity.
- A visible node lacks layout data.
- Two stable IDs conflict.
- Required context or provenance is missing.
- The current release pointer does not resolve.

Warnings requiring recorded reviewer disposition before publication include:

- Large score changes from one study
- Causal-language escalation
- Relationship-direction changes
- New core nodes
- Unresolved contradictions
- Therapy-status changes
- Evidence based predominantly on non-human studies
- Unreviewed preprints affecting the core map

“Warning” permits an explicitly reviewed scientific limitation; it does not bypass approval. Undisposed warnings fail the publication gate. Candidate validation and previews may contain unapproved records, but the public-release validator must apply all publication rules above.

## 16. Testing strategy

MVP launch requires applicable schema/integrity, approval, root-release, and frontend checks for the implemented map. Milestone 4 adds calibrated-score, successor-release, comparison, and expansion tests. Milestone 5 adds Sections 16.1–16.2's automated curation tests and evaluations. Future-feature tests are not launch dependencies for the manual MVP.

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
- Changed candidates and changed base releases invalidate approval
- Both scheduled and manual runs produce proposals without publishing

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

The Milestone 5 launch evaluation uses a versioned, reviewer-labelled held-out set containing at least 100 claims from at least 30 primary reports, including at least 20 associative claims and 20 qualifying or contradictory cases. Split by study or dataset family so overlapping reports do not leak between development and evaluation. Include at least 20 separate insufficient-evidence examples for abstention. Report numerators, denominators, errors, and the exact prompt/model versions.

Required launch thresholds are extraction precision ≥95%, extraction recall ≥85%, direction/polarity accuracy ≥95% on directed claims, required-context accuracy ≥90%, citation entailment ≥95%, qualifying/contradictory-case recall ≥90%, and appropriate abstention ≥90% on insufficient-evidence examples. There must be zero association-to-causation escalations in the associative subset and zero unsupported score changes. These are product acceptance targets, not claims of achieved model accuracy; human review remains mandatory.

Search evaluation uses frozen query and source-response fixtures labelled with at least 30 relevant and 30 irrelevant publications and requires ≥90% recall of the relevant set through retrieval and relevance filtering. Separately record a real-source manual scan and review its errors; fixture recall does not establish recall of all scientific literature. The evaluator defines normalized matching rules and handles abstentions explicitly rather than omitting failed examples.

### 16.3 Knowledge tests

- JSON Schema validation
- Referential integrity
- Stable IDs
- Version lineage
- No orphan claims or sources
- No duplicate normalized entities
- Current snapshot reproducibility
- Root-release acceptance and rejection of a second root or cyclic lineage
- Historical content remains identical after working entities, therapies, evidence, or scoring models change
- Independent disease-context assessments of the same canonical entity
- Exact digest verification, approval invalidation, and prevention of release overwrite
- Distinct rendering and validation of `null` and assessed zero values

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
- Symmetric associations render and announce without a causal direction
- All quantitative budgets in Section 17 and manual accessibility tasks in Section 21

## 17. Performance and resilience

- Static HTML should remain useful before graph hydration.
- The interactive graph should load only on disease pages.
- The initial SLE map must meet the measurable performance budgets below.
- Large research layers should be lazy-loaded or progressively expanded.
- Published pages must remain available if literature APIs, model APIs, or the curation system are unavailable.
- The deployment must be recoverable by redeploying an earlier immutable release.

The MVP spike and release CI use a versioned fixture covering the actual launch map, up to 25 entities and 40 relationships, including a feedback loop, long labels, symmetric associations, and mixed shapes. Test at desktop 1366×768 and mobile 390×844 viewports. Milestone 4 adds a stress fixture with 200 entities and 400 relationships, compound groups, and fully expanded views. A production release that exceeds its current fixture's node or relationship count must extend the benchmark to cover its actual size before publication.

On a pinned browser and test runner, with a cold cache, 1.6 Mbps download, 150 ms network latency, and 4× CPU slowdown, measure five runs per viewport. The median largest-contentful-paint time must be ≤2.5 seconds and the overview graph must accept selection and keyboard input within 5 seconds of navigation. After hydration, the median inspector-response time must be ≤200 ms over 20 selections in the launch fixture, and later in the expanded stress fixture. Record browser, runner, fixture, bundle sizes, and timings in the CI artifact; do not compare timings across unrecorded environments.

The static textual outline and citation details remain usable with JavaScript disabled. The page has no horizontal overflow at the mobile viewport outside the intentionally pannable graph. Deployment health checks verify the displayed release ID and digest, the disease page, one prior-release route once available, and the fallback outline. Before MVP completion, archive the launch artifact and demonstrate redeployment of that artifact within 15 minutes in staging. Milestone 4 adds rollback to an earlier release artifact.

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
- Authenticated review-event reference, candidate revision, and approved content digest
- Source and destination release IDs

## 20. Delivery milestones

The delivery path is Milestone 1 → Milestone 2 → Milestone 3 → MVP launch. Stop adding features once the launch criteria pass. Milestones 4–6 are follow-on work, not prerequisites for the first usable product.

| Milestone | Outcome | Dependency | Release boundary |
| --- | --- | --- | --- |
| 1. Working graph foundation | A small JSON graph renders with selectable evidence | None | Internal demo |
| 2. Curated SLE experience | A bounded SLE map with citations and therapy details | Milestone 1 | Reviewable prototype |
| 3. Publish the MVP | One reviewed, accessible, immutable SLE release on a static site | Milestone 2 | MVP launch |
| 4. Evidence depth and history | Calibrated scores, expansion, and release comparison | Milestone 3 | Post-MVP release |
| 5. Living literature workflow | Manual, then scheduled evidence proposals | Milestone 4's successor-release workflow | Post-MVP release |
| 6. Additional diseases | Shared entities and cross-disease comparison | Milestone 4; curation automation optional | Later expansion |

### 20.1 Milestone 1: Working graph foundation

Status: Implemented and locally verified on 2026-10-09. React Flow is the selected renderer; the illustrative fixture has five entities and six relationships. Data/geometry tests, Astro type checks, and the static build pass. Browser verification covers pointer/keyboard selection, arrow semantics, viewport controls, mobile layout, and the no-JavaScript outline. See README.md for commands and limits. This completes the foundation milestone; scientific curation and public launch remain Milestones 2–3.

Build:

- Astro, TypeScript, and a React graph island, with local development and build commands.
- A small illustrative fixture: approximately 5 entities and 6 relationships, including a feedback loop and a symmetric association.
- Minimal schemas for entities, relationships, claims, sources, therapies, context, unassessed assessments, and a self-contained root-release bundle.
- Shape-aware edge attachment, pan/zoom, fit-to-view, selection, and an inspector showing one linked claim and its citation.
- Schema and referential-integrity validation plus build CI.
- Manual scientific-review and publication policy, including the configured reviewer requirement.

Done when:

- The sample renders entirely from JSON and selecting a node or relationship opens its evidence.
- Invalid IDs or missing sources fail validation; the root's null parent is accepted.
- Associations have no arrowheads and feedback arrows remain attached after resizing.
- Choose one graph renderer after checking these requirements. Do not maintain two production implementations.
- Illustrative data is clearly labelled and is not presented as reviewed SLE evidence.

### 20.2 Milestone 2: Curated SLE experience

Status: Reviewable source-checked candidate implemented on 2026-10-10: 21 entities, 27 relationships, and three therapies, with focused map views, claim-level provenance, study systems, qualifying evidence, negative trial outcomes, and a complete static outline. The original candidate retains unassessed scores. Newer local SLE and IgA snapshots include explicit provisional appraisals and categorical therapeutic target coverage; calibration and independent appraisal review remain pending. Human domain review of the proposed maintaining circuit and source interpretations is pending; no reviewed or published release is claimed. See curation/reviews/sle-curated-candidate-001.md for the initial note and claim ledger.

Build:

- Manually curate the bounded SLE set in Section 5.2; source concepts guide inclusion but are not substitutes for primary-source verification.
- Include named upstream disturbances, the reviewed maintaining circuit, a feedback loop, and one organ-injury branch.
- Populate claim-level supporting, qualifying, and contradicting evidence where identified. Empty evidence categories are explicitly labelled rather than fabricated.
- Add 3–5 therapy records with linked targets, mechanism, indication, status, verification date, and limitations.
- Add the map legend, useful overview layout, readable labels, inspector, and static textual mechanism outline.
- Keep public numerical scores unassessed unless calibration and approval already exist. Local provisional candidates follow the explicit provenance and review restrictions in Section 8.

Done when:

- Every scientific assertion in the proposed map has a traceable, directly relevant source and review disposition.
- Named mediators such as BAFF/BLyS remain visible; generic process labels do not hide the important biology.
- Selecting a mediator or relationship explains the exact claim and its context; therapy details explain the intervention and its limits.
- A domain reviewer can inspect the complete map, evidence, and initial release note before approval.

### 20.3 Milestone 3: Publish the MVP

Status: Local engineering implemented on 2026-10-10; GitHub and public launch deferred by the user. Implemented exact-commit GitHub approval verification, immutable root storage and current-pointer routing, separate preview/public builds, browser accessibility checks, health checks, artifact archiving and a gated Pages workflow. Reviewer policy remains disabled, domain approval and a public root are pending, and live deployment, manual screen-reader/walkthrough checks, reviewed-artifact performance and staging redeployment remain launch gates. See curation/launch/PUBLICATION.md. This is not MVP completion.

Current work prioritizes the local product; GitHub setup and deployment are deferred. The atlas supports name/synonym and therapy-brand search, evidence navigation across routes, a selected-evidence shortcut, explicit incoming/outgoing/symmetric connection labels, and selection-based inspector scroll reset.

Build:

- A responsive disease page, methodology/evidence explanation, source listing, and basic landing/navigation pages.
- Keyboard selection, visible focus, screen-reader labels, reduced-motion behavior, and the no-JavaScript outline.
- One immutable, self-contained SLE root release, its digest and current-release pointer, authenticated approval, and an initial release note.
- Required validation, approval, accessibility, and static-build checks before publication.
- Static deployment, launch-artifact archive, health checks, and redeployment verification.

Done when:

- Every requirement in Section 21 passes against the reviewed launch artifact.
- The public page is useful for exploring SLE mechanisms and their evidence without accounts, live APIs, or automated curation.
- The published release is approved and reproducible; changing working records does not alter it.

This is the MVP launch boundary. Historical browsing, calibrated scores, grouped expansion, automated literature scanning, and additional diseases may remain unimplemented.

### 20.4 Milestone 4: Evidence depth and release history

Status: Local engineering implemented on 2026-10-10: version comparison, immutable successors, grouped views, contextual rubric/calibration validation, archived-artifact restoration and the 200-entity/400-relationship benchmark. Real calibration, an independently approved successor, the usability pilot and hosting rollback remain acceptance gates. See PROGRESS.md; engineering checks do not establish those scientific/human outcomes.

Build:

- Calibrate and approve the scoring rubric under Section 8.5, then add contextual weight/confidence tiers and their explanations.
- Complete successor-release lineage, stale-base rejection, and approval invalidation before publishing any update.
- Add historical routes, change log, before/after comparison, and previous-artifact rollback.
- Add grouped expansion/collapse and the 200-entity/400-relationship benchmark from Section 17.

Done when:

- The root and an approved successor remain independently accessible with unchanged embedded evidence.
- A changed candidate or base cannot reuse its old approval.
- A user can explain one map change using the comparison and its evidence.
- Public assessed scores pass calibration; unassessed values remain distinct from zero.
- Expanded-map interactions and performance checks pass, and the Section 22 pilot tasks are completed.

### 20.5 Milestone 5: Living literature workflow

Status: Local manual workflow implemented on 2026-10-10: live retrieval, persistent-identifier deduplication, overlap and known-source refresh, source flags, bounded manual/model extraction, immutable reconciliation packets, held-out/search evaluators and scheduling-readiness checks. Real manual-scan review and reviewer-labelled evaluations are pending; no model service or weekly scheduler is configured. See CURATION.md and PROGRESS.md.

Build in order:

1. Manual literature search/retrieval command with overlap windows, deduplication, source tracking, and a retrieval report.
2. Claim extraction and reconciliation that produce candidate changes and review reports against a named base release.
3. Held-out evaluations, prompt/model versioning, retries, and idempotent reruns.
4. Weekly scheduling only after the manual workflow passes its checks.

Done when:

- One reviewed real-source manual scan completes and Section 16.2's evaluation thresholds pass.
- Manual and scheduled-trigger integration runs produce reviewable proposals without publishing or advancing the current pointer.
- Repeated scans do not create duplicate evidence or proposals.
- Human-approved proposals use the Milestone 4 successor-release workflow.

### 20.6 Milestone 6: Additional diseases and comparison

Status: Generic registry/routes, source-checked IgA nephropathy example and canonical-identity comparison implemented locally on 2026-10-10. SLE and IgA evidence/assessments remain independent; both maps await independent human domain review. See PROGRESS.md. This is a reviewable prototype, not completion of the two-reviewed-map acceptance criterion.

Build:

- Add one reviewed disease map at a time, starting with MCTD or IgA nephropathy.
- Reuse canonical entity identities with independent disease-context assessments and layouts.
- Add shared-pathway queries and a cross-disease comparison view.

Done when:

- Two independently reviewed maps can share a mediator without overwriting either disease's evidence or assessment.
- Shared and divergent relationships can be compared with their context and source evidence intact.

## 21. MVP acceptance criteria

The MVP is complete at Milestone 3 when:

1. A deployed Astro site exposes the SLE page, methodology/evidence explanation, sources, and usable navigation.
2. The entire map renders from one validated, approved, self-contained root release with a release ID, evidence cutoff, digest, and initial release note.
3. The curated set respects Section 5.2's scope budget and contains named biology, a supported feedback loop, and an organ-injury branch.
4. Nodes use consistent entity shapes; causal arrows are directional, associations have no arrowheads, and geometry stays correct after resizing and pan/zoom.
5. Selecting any node or relationship exposes its reviewed claims, exact context, sources, and relevant limitations; supporting, qualifying, and contradicting categories are available.
6. Approved and experimental therapy examples have evidence-linked targets, status, indication, and last verified dates without obscuring graph content.
7. Numerical scores are either explicitly unassessed with neutral rendering or calibrated and approved under Section 8.5. Unassessed values never masquerade as zero or as measured confidence.
8. Authenticated approval matches the exact candidate content; schema, integrity, approval, and static-build checks pass. Candidate or under-review scientific records cannot enter the public release.
9. The root permits a null parent, overwriting an existing release is rejected, and working-record edits leave the archived release unchanged.
10. Keyboard-only users can reach and select every displayed node and relationship, inspect evidence, and operate graph controls without focus traps. Focus is visible and screen-reader review verifies names, relationship directionality, selection announcements, and inspector reading order.
11. The full textual outline and citations work with JavaScript disabled. At 390×844 the page has no unintended horizontal overflow and respects reduced-motion preferences.
12. Normal text contrast is at least 4.5:1; large text (at least 24 CSS pixels, or 19 when bold) and focus-indicator contrast are at least 3:1. Hit areas are at least 44×44 CSS pixels, automated accessibility checks have no unresolved serious/critical findings, and manual tasks have no unresolved blockers.
13. The actual launch map passes Section 17's performance budgets, release-health checks, and archived-artifact redeployment check.
14. A scientifically literate user, without curator assistance, can trace the reviewed circuit, inspect one relationship's evidence, and locate a therapy's target and status. Record a walkthrough and fix blocking misunderstandings.

One approved release is sufficient. There is no MVP requirement for historical comparison, score calibration when all scores are unassessed, compound-group expansion, scheduled scans, model evaluations, or another disease. Those features have their own milestone gates above.

## 22. Success measures

### Scientific quality

MVP scientific quality is established through claim-level source verification and domain review of the initial map. Section 16.2's model-evaluation thresholds apply when automated curation launches in Milestone 5. Track these measures as their capabilities become available, using reviewer-adjudicated examples and publishing sample sizes:

- Proportion of displayed claims supported by directly relevant sources
- Expert agreement with relationship direction and evidence category
- Rate of citation-entailment failures
- Rate of duplicate or incorrectly normalized mediators
- Relevant-paper retrieval recall
- Appropriate contradiction and retraction handling

### Product quality

The MVP requires the walkthrough in Section 21. Milestone 4 adds a pilot in which at least four of five scientifically literate users must complete each task below without curator assistance. Record task scripts, outcomes, graph version, and observed misunderstandings; this is an initial usability gate, not evidence of broad user performance.

- Identify and trace the principal disease-maintaining circuit against a reviewer-authored answer key.
- Explain the separate confidence and mechanistic-weight labels for a selected node.
- Locate one approved and one experimental therapy and identify their labelled targets and status.
- Use a release comparison and its evidence to explain one promotion, demotion, or qualification.
- Expand a branch, select a named child mediator, and trace a labelled relationship without curator assistance.

### Operational quality

MVP launch requires root-release reproducibility, health checks, and launch-artifact redeployment. Milestone 4 adds previous-release rollback; Milestone 5 adds scheduled/manual-run checks. Once scheduled scans launch, target ≥95% successful weekly scans over the trailing 12 scheduled runs; source outages count as failed runs and must not alter public releases.

- Weekly scan completion rate
- Time from evidence discovery to reviewed candidate change
- Reproducible release builds
- Rollback success
- Number of unapproved public knowledge changes reaching publication: zero

## 23. Open decisions

The following remain open; they do not replace the MVP defaults and publication gates defined above:

1. React Flow versus Cytoscape.js
2. Scientific calibration of the specified provisional rubric in Milestone 4; any resulting changes require a new scoring-model version
3. A future composite therapeutic-leverage rubric, outside MVP
4. Later refinements to inclusion thresholds beyond the MVP primary-evidence and core-promotion gates
5. Refinement of overview membership after pilot testing within the specified density budget
6. Publication cadence for updates after MVP; the MVP publishes one approved root release
7. Hosting provider
8. Literature and full-text licensing strategy
9. Appointment of authorized domain reviewers and their public attribution preferences; the repository approval workflow is specified
10. When to move from Git-backed JSON to PostgreSQL
11. Whether raw citation counts should be publicly displayed
12. Policy for preprints, sponsor-reported results, and unpublished trial data
13. Public API timing and scope

## 24. Immediate next steps

1. Milestone 1 is complete: the Astro app, graph renderer, schema and validation/build CI are implemented.
2. Create the small illustrative fixture, validator, selectable graph, and evidence inspector.
3. Choose the graph renderer using the fixture and commit to one implementation.
4. Milestone 2 candidate is implemented: complete the pending domain review of the bounded SLE map, primary-source interpretations and therapy records.
5. Start Milestone 3: complete accessibility, authenticated scientific review, and static publication of the root release.
6. Launch when Section 21 passes; use initial user feedback to prioritize Milestone 4.

### Revision 0.2

Resolved release dependency freezing, contextual assessment ownership, authenticated approval and invalidation, symmetric associations, root-release lineage, and scoring/missing-data rules. Defined Phases 0–3 as the MVP and added measurable density, performance, accessibility, evaluation, and usability gates. The scientific rubric remains explicitly provisional until its required calibration is completed.

### Revision 0.3

Replaced the broad MVP with six delivery milestones. Milestones 1–3 ship one manually curated, evidence-linked SLE atlas. Milestones 4–6 add calibrated scores and history, automated literature curation, and additional diseases. Numerical scores may remain explicitly unassessed at launch. This scope replaces Revision 0.2's requirement to complete the curation pipeline before MVP launch while retaining immutable releases, source traceability, and authenticated scientific review.
