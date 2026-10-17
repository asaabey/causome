# diffuse-systemic-sclerosis: proposal-0c650926a906c21bba6f82e6

Base: diffuse-systemic-sclerosis-candidate-20261017-001

Base digest: 2b3c4e3d1c2dbbd3f0bd316c1c52cbdd961e3e83736d895d2717b7aa1578c139

Candidate: diffuse-systemic-sclerosis-therapy-candidate-20261017-001

Prompt: manual-bundle; model: manual.

## Findings

Manual candidate bundle; review the complete diff.

## Pending source checks

None recorded

## Warnings

Independent scientific review is still required.

## Complete record diff

- release/release-metadata: changed; id, revisionId, changeSetRevision, releaseNote, manifest
- entities/entity-dcssc-global-outcome: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- claims/claim-dcssc-therapy-ace-pressure: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-ace-src: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-cyc-fvc: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-cyc-toxicity: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-hsct-global: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-hsct-harm: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-mmf-comparison: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-mmf-fvc: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-nint-fvc: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-nint-sensitivity: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-nint-skin-null: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-nint-target: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-toci-fvc: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-toci-mechanism: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-dcssc-therapy-toci-skin-null: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- evidenceItems/evidence-dcssc-therapy-ace-pressure: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-ace-src: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-cyc-fvc: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-cyc-toxicity: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-hsct-global: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-hsct-harm: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-mmf-comparison: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-mmf-fvc: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-nint-fvc: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-nint-sensitivity: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-nint-skin-null: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-nint-target: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-toci-fvc: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-toci-mechanism: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-dcssc-therapy-toci-skin-null: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- sources/source-dcssc-actemra-label: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-dcssc-eular: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-dcssc-ofev-label: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-doi-73ddf0f17f742a2ae895: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-doi-9fbd55d1169487e01cc0: changed; revisionId, kind
- sources/source-doi-c81dec45c9f50fd639da: changed; revisionId, kind
- sources/source-doi-d670c4f950e627a1bddc: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-doi-f75348042f80c140f762: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-doi-fc533ed94b035950972b: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-med-31573469: changed; revisionId
- therapies/therapy-dcssc-ace-inhibitors: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- therapies/therapy-dcssc-cyclophosphamide: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- therapies/therapy-dcssc-hsct: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- therapies/therapy-dcssc-mycophenolate: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- therapies/therapy-dcssc-nintedanib: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- therapies/therapy-dcssc-tocilizumab: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- contexts/context-dcssc-therapy: added; id, revisionId, status, diseaseId, label, organism, tissue, phenotype, stage
- assessments/assessment-dcssc-global: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- mapViews/view-diffuse-systemic-sclerosis-overview: changed; revisionId, entityIds, assessmentIds
- layouts/layout-diffuse-systemic-sclerosis-overview: changed; revisionId, positions

Review context, source entailment, direction, polarity, evidence category, study independence, therapy status, scores and every view change. Neither this report nor a JSON reviewer name authenticates approval. No public pointer was advanced.
