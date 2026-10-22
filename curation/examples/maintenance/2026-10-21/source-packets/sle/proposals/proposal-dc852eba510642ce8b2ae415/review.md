# sle: proposal-dc852eba510642ce8b2ae415

Base: sle-summary-candidate-f3c3742263d5

Base digest: 838249cbf80a8a9de5bb0051d91d24bbc91fd9fa64aa013aa7c2b6543c720161

Candidate: sle-candidate-dc852eba5106

Prompt: causome-extraction-v1; model: codex-agent-manual-source-curation-v1.

## Findings

- sle-curli-autoantibodies-20261021: novel; claim-d4e4e467a2d76a39ace2
- sle-curli-stage-null-20261021: qualifying; claim-4d9c103b676f83c8bd56

## Pending source checks

None recorded

## Warnings

Independent scientific review is still required.

## Complete record diff

- release/release-metadata: changed; id, revisionId, createdAt, evidenceCutoff, changeSetRevision, releaseNote, manifest, scientificSummary
- entities/entity-curli-dna: added; id, label, synonyms, entityClass, description, externalIds, revisionId, status, biologicalRoleClaimIds
- relationships/relationship-c3293bcb1ac098447d7d: added; id, revisionId, status, sourceId, targetId, predicate, contextId, assessmentId, directionality, polarity, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- claims/claim-4d9c103b676f83c8bd56: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-d4e4e467a2d76a39ace2: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- evidenceItems/evidence-4d9c103b676f83c8bd56: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-d4e4e467a2d76a39ace2: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- sources/source-43ffa8d6e6e72a9276db: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- assessments/assessment-78cc28ac57d8b2ff73e4: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-entity-activity: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-autoantibodies: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-b_cells: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-baff: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-clearance: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-complexes: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-debris: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-dna: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-fcr: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-ifn: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-ifnar: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-il6: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-kidney: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-monocytes: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-pdc: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-plasma: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-plasmablasts: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-rna: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-tlr7: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-tlr9: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-variant: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-antibodies-complexes: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-baff-bcells: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-bcells-blasts: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-blasts-plasma: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-c3293bcb1ac098447d7d: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-relationship-clearance-debris: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-complexes-baff: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-complexes-fcr: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-complexes-kidney: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-complexes-tlr7: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-complexes-tlr9: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-debris-complexes: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-dna-complexes: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-fcr-kidney: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-ifn-activity: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-ifn-baff: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-ifn-blasts: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-ifn-ifnar: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-il6-plasma: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-monocytes-baff: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-pdc-ifn: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-pdc-il6: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-plasma-antibodies: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-rna-complexes: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-tlr7-bcells: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-tlr7-pdc: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-tlr9-pdc: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-variant-tlr7: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- mapViews/view-research-context-sle-overview: added; id, revisionId, status, label, contextId, entityIds, relationshipIds, assessmentIds, layoutId
- layouts/layout-research-context-sle-overview: added; id, revisionId, status, positions

Review context, source entailment, direction, polarity, evidence category, study independence, therapy status, scores and every view change. Neither this report nor a JSON reviewer name authenticates approval. No public pointer was advanced.
