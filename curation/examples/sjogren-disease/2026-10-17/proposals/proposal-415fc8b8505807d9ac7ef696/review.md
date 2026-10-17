# sjogren-disease: proposal-415fc8b8505807d9ac7ef696

Base: sjogren-disease-summary-candidate-8c51542f9f64

Base digest: 4db0823454e93f86054bdb07ca424287534922f001c02ea6e441aac25de09f33

Candidate: sjogren-disease-null-qualified-candidate-20261017-001

Prompt: manual-bundle; model: manual.

## Findings

Manual candidate bundle; review the complete diff.

## Pending source checks

None recorded

## Warnings

Independent scientific review is still required.

## Complete record diff

- release/release-metadata: changed; id, revisionId, changeSetRevision, releaseNote, manifest, scientificSummary
- entities/entity-baff: changed; revisionId, biologicalRoleClaimIds
- entities/entity-sjd-gc: changed; revisionId, biologicalRoleClaimIds
- relationships/relationship-888ab4fcc8d08f04a694: removed; id, revisionId, status, sourceId, targetId, predicate, directionality, polarity, contextId, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- claims/claim-sjd-baff-gc: removed; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-sjd-baff-gc-null: removed; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-sjd-baff-ssa: changed; revisionId, limitations
- evidenceItems/evidence-sjd-baff-gc: removed; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-sjd-baff-gc-null: removed; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- assessments/assessment-0e598d21902b0eb024ea: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-128e214bded464862b71: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-14a0ba8bf72f94064888: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-23cce348265b94644229: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-2913f5cdec8a897865ec: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-31138ce307679f034682: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-3c56708fdfce49111efb: removed; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-44b95094754fd44e76cd: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4783397f93919aae6090: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4af15a5ebc5b6d403ba4: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4d02c0be453bfb91a2bd: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4f5bb929417994493fc2: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4f92deefafa3503c11fd: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-504511848baf49140034: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-574a7b29779919da954f: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, supportingClaimIds, qualifyingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-5bbd9894921bbe9bdacc: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, supportingClaimIds, qualifyingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-61b41a0eb0c012b10ebc: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-63bbcea054bb9fea4c75: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, supportingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-640bb23d96e0ef65717b: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-68104947e6813013ff3c: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, supportingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-782260e295a45f6467f9: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-790b83dece9919fe4427: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, supportingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-7afadfd913e2803dd1d2: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-8f8c18c1134e1b47899c: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, supportingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-912dbe2467338847b2d7: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-9981dd41f096a19485d1: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, contradictingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-9fd9d33e7c813a1d0d1f: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a6d83628c7dc0fb6bc59: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, supportingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a9a5fb53b48f329eb7f5: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, supportingClaimIds, contradictingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a9be782eec818b7a749b: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-aa1ccde4d985a1c3bb32: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b7f7381aa8a1b5d55b66: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-c4b437b69c4daad4f303: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-c965cd8fc954b49bbe78: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-dd60a20f57a1a8c49d2e: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-dead617c374aed3b0837: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ebdef9b4fa0569680fb7: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, supportingClaimIds, qualifyingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-f3265392dc852865af29: changed; revisionId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-sjd-activity: changed; revisionId, scoringModelId, metricStatus, evidenceConfidence, supportingClaimIds, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- scoringModels/model-provisional-2a6c9349c445: removed; id, revisionId, status, label, calibrated, provisional, rubric, description
- mapViews/view-sjogren-disease-overview: changed; revisionId, relationshipIds, assessmentIds

Review context, source entailment, direction, polarity, evidence category, study independence, therapy status, scores and every view change. Neither this report nor a JSON reviewer name authenticates approval. No public pointer was advanced.
