# c3-glomerulonephritis: proposal-ef628fb61a78a07d4a49e89c

Base: c3-glomerulonephritis-summary-candidate-bc0c86a1bbcb

Base digest: 634290e4c0d52fee062844f552b1159d1f76a08207ed8e955b6aa7e3d3e3aa0f

Candidate: c3-glomerulonephritis-candidate-002

Prompt: manual-bundle; model: manual.

## Findings

Manual candidate bundle; review the complete diff.

## Pending source checks

None recorded

## Warnings

Independent scientific review is still required.

## Complete record diff

- release/release-metadata: changed; id, revisionId, diseaseDescription, createdAt, changeSetRevision, releaseNote, manifest, scientificSummary
- entities/entity-ap-c3-convertase: changed; revisionId, biologicalRoleClaimIds
- entities/entity-ap-dysregulation: changed; revisionId, biologicalRoleClaimIds
- entities/entity-c3: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- entities/entity-c3gn-phenotype: changed; revisionId, biologicalRoleClaimIds
- entities/entity-cfhr5-duplication: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- entities/entity-complement-autoantibodies: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- entities/entity-complement-regulatory-variants: changed; revisionId, biologicalRoleClaimIds
- entities/entity-factor-b: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- entities/entity-fhr5-surface-binding: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- entities/entity-kidney-function-loss: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- entities/entity-mutant-fhr5: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- entities/entity-pegcetacoplan-exposure: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- entities/entity-proteinuria: changed; revisionId, biologicalRoleClaimIds
- relationships/relationship-0f19a3a7f900e4ecb79b: added; id, revisionId, status, sourceId, targetId, predicate, contextId, directionality, polarity, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-3036b7471d7efc4e185f: added; id, revisionId, status, sourceId, targetId, predicate, contextId, directionality, polarity, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-3386f0783aaf80833622: added; id, revisionId, status, sourceId, targetId, predicate, contextId, directionality, polarity, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-37a632bbf3e63ceaae96: changed; revisionId, contextId, assessmentId
- relationships/relationship-519d2a3f0ce8a208e5cf: changed; revisionId, assessmentId
- relationships/relationship-544a9a5ec8c75bb0ddb6: changed; revisionId, assessmentId
- relationships/relationship-5a19300acd80c47a7965: changed; revisionId, assessmentId
- relationships/relationship-5af200b474a4a9849758: changed; revisionId, assessmentId
- relationships/relationship-78cad79108482a03e7f1: added; id, revisionId, status, sourceId, targetId, predicate, contextId, directionality, polarity, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-7da2ea28394983206ce8: added; id, revisionId, status, sourceId, targetId, predicate, contextId, directionality, polarity, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-8802e905d8db82b958b6: added; id, revisionId, status, sourceId, targetId, predicate, contextId, directionality, polarity, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-8974f5a3fec02df3378b: added; id, revisionId, status, sourceId, targetId, predicate, contextId, directionality, polarity, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-91a8c61de20de412d41d: added; id, revisionId, status, sourceId, targetId, predicate, contextId, directionality, polarity, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-a182b1169473ad409de9: changed; revisionId, assessmentId
- relationships/relationship-aa30b9df20addc92570e: changed; revisionId, contextId, assessmentId
- relationships/relationship-c7d741e7a297485e134b: added; id, revisionId, status, sourceId, targetId, predicate, contextId, directionality, polarity, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-d603c5022fe867c8d10b: changed; revisionId, contextId, assessmentId
- claims/claim-c3gn-anti-fh-function: changed; revisionId, contextId
- claims/claim-c3gn-anti-fh-qualification: changed; revisionId, contextId
- claims/claim-c3gn-cfhr3-1-segregation: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-cfhr5-binding: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-cfhr5-not-loss: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-cfhr5-protein: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-cfhr5-segregation: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-convertase-c3: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-factor-b-convertase: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-familial-progression: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-ipt-moa: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-ipt-us-indication: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-iptacopan-infection-limit: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-iptacopan-proteinuria: changed; revisionId, contextId
- claims/claim-c3gn-modern-autoantibodies: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-modern-unknown: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-nephritic-stabilization: changed; revisionId, contextId, limitations
- claims/claim-c3gn-nephritic-terminal-qualification: changed; revisionId, contextId, limitations
- claims/claim-c3gn-peg-histology-qualification: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-peg-moa: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-peg-proteinuria: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-peg-us-indication: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-c3gn-pegcetacoplan-infection-limit: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- evidenceItems/evidence-c3gn-cfhr3-1-segregation: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-cfhr5-binding: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-cfhr5-not-loss: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-cfhr5-protein: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-cfhr5-segregation: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-convertase-c3: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-factor-b-convertase: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-familial-progression: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-ipt-moa: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-ipt-us-indication: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-iptacopan-infection-limit: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-modern-autoantibodies: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-modern-unknown: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-peg-histology-qualification: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-peg-moa: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-peg-proteinuria: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-peg-us-indication: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-c3gn-pegcetacoplan-infection-limit: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- sources/source-doi-1de181fbba9cced51df3: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags, datasetFamilyId
- sources/source-doi-52f03e0b14781095baf8: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-doi-5e1eee58edff2ec0c340: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags, datasetFamilyId
- sources/source-doi-a244ff446770358b5fbc: changed; revisionId, accessScope
- sources/source-doi-d5843433959f478a1a9f: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-doi-e55def3fa75dabaf18aa: changed; revisionId, kind, datasetFamilyId
- sources/source-doi-f3e2ceaeff5ddff27d21: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags, datasetFamilyId
- sources/source-doi-fade1a9b5518c445d808: changed; revisionId, accessScope
- sources/source-fda-empaveli-2026: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-fda-fabhalta-2025: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- therapies/therapy-iptacopan: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- therapies/therapy-pegcetacoplan: added; id, revisionId, status, name, modality, directTargetIds, indirectTargetIds, mechanismOfAction, indicationContextId, developmentStatus, trialSourceIds, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, lastVerifiedAt, indication, jurisdiction, trialPhase, verificationSourceIds, limitations
- contexts/context-c3gn-anti-fh-assays: added; id, revisionId, status, diseaseId, label, organism, phenotype, tissue, stage
- contexts/context-c3gn-appear: added; id, revisionId, status, diseaseId, label, organism, phenotype, tissue, stage
- contexts/context-c3gn-familial: added; id, revisionId, status, diseaseId, label, organism, phenotype, tissue, stage
- contexts/context-c3gn-modern-drivers: added; id, revisionId, status, diseaseId, label, organism, phenotype, tissue, stage
- contexts/context-c3gn-nephritic-assays: added; id, revisionId, status, diseaseId, label, organism, phenotype, tissue, stage
- contexts/context-c3gn-valiant: added; id, revisionId, status, diseaseId, label, organism, phenotype, tissue, stage
- assessments/assessment-0922c03f2ac67c6d51ea: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-0a2bec233fe1f2aa2b19: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-0c5ae79a3fac6f21bee1: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-1441804e1146aa946af1: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-1640187ba3989d19196c: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-191b255df6c03771927b: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-1b0c599297ef9de634b2: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-1dd7d3e4481d366922c5: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-23857fe158d0f119440a: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-243273da979c20c0f269: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-2928bd90c858058d3a0b: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-2e1e28914a14806683e0: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-2ef153e3c6a17328d0ff: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-37a2bc2c2fb41f1e1277: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-394832c43a0b7efeb124: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-46713a29e84b843d9e8b: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-48b4f283667cb698fd1f: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4fe0953319bb341cb671: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-50a643042abfef0aa29d: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-5586b1422bbff3df66bb: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-55a56d9c8acea5fbd3a1: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-56bc8b161419b5cea69f: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-57a526e986c2b06fdd6b: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-5badd5b23fc1b1911b5d: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-6ae9bc893404b14c0184: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-761244f3cd3e818bf699: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-78125858f9891c0894f5: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-797ca34c856b2be8c514: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-7b007e0c9e352d37fed5: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-7e41b7c6b104c5df829d: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-821daa227b341ba5daaa: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-82ab05bb7ca7e9086cfa: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-8310731f85ba416b6e2e: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-963d0745cfcdbc5aa350: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-976ad98f824bc145a19d: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-9c70abf06f79595bc9e3: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-9d5570f5bdd5cbe697fc: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-9ffe4a4ed1ee44f21396: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-a525b0a5081611b14666: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-a9b05a63a6c83920028d: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-aa1359f83cda675006a9: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-ab23183356f5b50dd7ec: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-ae17df7e7e1068465e31: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-bcaa9bcda04c366313c5: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-c71c36f96517d0c3ec3c: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-c81ab7fa5c64fe175c38: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-cabb36902c1379e54f26: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-d226459bf5f9d3312184: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-dba984a654d272bf5126: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-de9bad33fec415ff3f44: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-de9bcf00ee6897151559: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-e5e62c25e28ba06f4bbc: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-e8c6b67105233648d5e9: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-e9eaacac7a2b7e3741a6: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-eead1c4a50b3a6eaec30: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-f56ebd171d277352a49b: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-f62d93ee5198d938ff75: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-f890dd11a24a9e078d36: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-f96021c0a7a032a9f04a: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-fa44c5752b87c0c1210d: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-fb7ef1a98bea404635f1: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- scoringModels/model-provisional-80e1ca3d8ba0: removed; id, revisionId, status, label, calibrated, provisional, rubric, description
- scoringModels/scoring-c3-glomerulonephritis-unassessed: removed; id, revisionId, status, label, calibrated, description
- scoringModels/scoring-c3gn-expansion-unassessed: added; id, revisionId, status, label, calibrated, description
- mapViews/view-c3-glomerulonephritis-overview: changed; revisionId, label, entityIds, relationshipIds, assessmentIds, layoutId
- mapViews/view-context-c3gn-anti-fh-assays: added; id, revisionId, status, label, contextId, entityIds, relationshipIds, assessmentIds, layoutId
- mapViews/view-context-c3gn-appear: added; id, revisionId, status, label, contextId, entityIds, relationshipIds, assessmentIds, layoutId
- mapViews/view-context-c3gn-familial: added; id, revisionId, status, label, contextId, entityIds, relationshipIds, assessmentIds, layoutId
- mapViews/view-context-c3gn-modern-drivers: added; id, revisionId, status, label, contextId, entityIds, relationshipIds, assessmentIds, layoutId
- mapViews/view-context-c3gn-nephritic-assays: added; id, revisionId, status, label, contextId, entityIds, relationshipIds, assessmentIds, layoutId
- mapViews/view-context-c3gn-valiant: added; id, revisionId, status, label, contextId, entityIds, relationshipIds, assessmentIds, layoutId
- layouts/layout-c3-glomerulonephritis-overview: removed; id, revisionId, status, positions
- layouts/layout-context-c3gn-anti-fh-assays: added; id, revisionId, status, positions
- layouts/layout-context-c3gn-appear: added; id, revisionId, status, positions
- layouts/layout-context-c3gn-familial: added; id, revisionId, status, positions
- layouts/layout-context-c3gn-modern-drivers: added; id, revisionId, status, positions
- layouts/layout-context-c3gn-nephritic-assays: added; id, revisionId, status, positions
- layouts/layout-context-c3gn-overview: added; id, revisionId, status, positions
- layouts/layout-context-c3gn-valiant: added; id, revisionId, status, positions

Review context, source entailment, direction, polarity, evidence category, study independence, therapy status, scores and every view change. Neither this report nor a JSON reviewer name authenticates approval. No public pointer was advanced.
