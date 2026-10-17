# sjogren-disease: proposal-d94346f89c96a8fe3f1ee32a

Base: sjogren-disease-candidate-20261017-001

Base digest: 53b1f23fe530c6006b237f675e80e8d8531de87198e47386e41dd6b027d8b1cd

Candidate: sjogren-disease-therapy-candidate-20261017-001

Prompt: manual-bundle; model: manual.

## Findings

Manual candidate bundle; review the complete diff.

## Pending source checks

None recorded

## Warnings

Independent scientific review is still required.

## Complete record diff

- release/release-metadata: changed; id, revisionId, changeSetRevision, releaseNote, manifest
- entities/entity-sjd-activity: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- claims/claim-sjd-dazodalibep-activity: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-sjd-dazodalibep-symptoms: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-sjd-dazodalibep-target: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-sjd-ianalumab-activity: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-sjd-ianalumab-comparison: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-sjd-ianalumab-target: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-sjd-rituximab-null: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-sjd-rituximab-saliva: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- evidenceItems/evidence-sjd-dazodalibep-activity: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-sjd-dazodalibep-symptoms: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-sjd-dazodalibep-target: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-sjd-ianalumab-activity: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-sjd-ianalumab-comparison: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-sjd-ianalumab-target: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-sjd-rituximab-null: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-sjd-rituximab-saliva: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- sources/source-doi-60a7f7ce001bba0810d7: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-doi-749a861e936d2ec3a407: changed; revisionId, kind, accessScope
- sources/source-doi-b732b2a20a4e343ff1ab: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-sjd-status-dazodalibep: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-sjd-status-ianalumab: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- therapies/therapy-sjd-dazodalibep: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- therapies/therapy-sjd-ianalumab: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- therapies/therapy-sjd-rituximab: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- contexts/context-sjd-trials: added; id, revisionId, status, diseaseId, label, organism, tissue, phenotype, stage
- assessments/assessment-sjd-activity: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- mapViews/view-sjogren-disease-overview: changed; revisionId, entityIds, assessmentIds
- layouts/layout-sjogren-disease-overview: changed; revisionId, positions

Review context, source entailment, direction, polarity, evidence category, study independence, therapy status, scores and every view change. Neither this report nor a JSON reviewer name authenticates approval. No public pointer was advanced.
