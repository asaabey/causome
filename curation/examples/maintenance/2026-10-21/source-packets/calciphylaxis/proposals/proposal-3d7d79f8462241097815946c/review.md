# calciphylaxis: proposal-3d7d79f8462241097815946c

Base: calciphylaxis-summary-candidate-9b1e60179c27

Base digest: 328e540a3c2ba5ec8e4b3ada6c2283f703aa6c6c56a0910bea3f1a7a7ed0090c

Candidate: calciphylaxis-candidate-3d7d79f84622

Prompt: causome-extraction-v1; model: codex-agent-manual-source-curation-v1.

## Findings

- calciphylaxis-ppi-case-association-20261020: novel; claim-d817a99bb3f6b3dcca3a
- calciphylaxis-ppi-mortality-association-20261020: novel; claim-a2234e93c51e067a6dbd

## Pending source checks

None recorded

## Warnings

Independent scientific review is still required.

## Complete record diff

- release/release-metadata: changed; id, revisionId, createdAt, evidenceCutoff, changeSetRevision, releaseNote, manifest, scientificSummary
- entities/entity-pyrophosphate: added; id, label, synonyms, entityClass, description, externalIds, revisionId, status, biologicalRoleClaimIds
- relationships/relationship-7101d3e15ed241d8e567: added; id, revisionId, status, sourceId, targetId, predicate, contextId, assessmentId, directionality, polarity, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-a51dbf313ca98c574cb4: added; id, revisionId, status, sourceId, targetId, predicate, contextId, assessmentId, directionality, polarity, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- claims/claim-a2234e93c51e067a6dbd: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-d817a99bb3f6b3dcca3a: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- evidenceItems/evidence-a2234e93c51e067a6dbd: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-d817a99bb3f6b3dcca3a: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- sources/source-7929868cca3619df79ac: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- assessments/assessment-06a8393bb0b846570269: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-0b7d62b68a4e8ced45e3: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-0fa1e9f159bd4c16ee01: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-159931276b34f8374c30: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-15a2585870e163675d24: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-173ba9680ba1a3988693: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-1e454c0be2e2b4f5ee28: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-21e56e027d9290be42f7: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-22c2c43987eb3f69c99e: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-233b656c256b7dfde824: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-32d1d7604c9641ded7a6: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-32db7397ac644a99e97a: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-3d93910c01d0181e6c04: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-3e97b53b7cd6a5cd578a: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-3f2d602d14151181c550: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-42f2a89774d60d4be454: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-43f1ee29b13646b9312f: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-45a06bfd85bbd442ad8a: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-47a4feccbf8c8adf13ad: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4d3473ec3112ce35c94e: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-52a2937d93b1ae7c0676: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-5a6bd05f13849b6ebb9e: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-5d1b3c31de7a5fcf51ce: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-5dee5212cda5c072b83d: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-610ed2b01e35a5a911c4: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-6689472cf256f51b80f6: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-71ebd9265c8a92c867a0: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-7390d4ca71dad0cd1937: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-7a0bc73aef81dc6c3848: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-7bccee68bf262559321b: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-7d8783bde87a4ac233ad: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-84dafb46653f1d5e0529: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-85e5759784d10935c3f9: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-899b1c6db080329c9a71: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-95fd4ce03be73773fc49: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-964fee1d6473b3ef777f: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a17196a60c97015419fd: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a401b9754dd284cc135e: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ab465ffa11af14063c9d: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b5fae692dbe0d77983c7: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b99fba7cd30eee54ef09: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ba1251804996de8c73bd: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-cc38dce3b81515e7c2e6: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ccdc32af3a278f1b03d0: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-d5c8cf271bc659344975: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-d9c627b79746fdd6f5ac: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-df1ab2e2827bdfc62642: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-e407b5de2ce91282e71c: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-e586a3e7ef56f1d9b72d: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ec696990d9f239d2ee55: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-entity-casr: changed; revisionId, metricStatus, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-f1c1b7178d64b5b5f669: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-fc042518602b45cc0920: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-relationship-7101d3e15ed241d8e567: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-relationship-a51dbf313ca98c574cb4: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- mapViews/view-research-context-calciphylaxis-overview: added; id, revisionId, status, label, contextId, entityIds, relationshipIds, assessmentIds, layoutId
- layouts/layout-research-context-calciphylaxis-overview: added; id, revisionId, status, positions

Review context, source entailment, direction, polarity, evidence category, study independence, therapy status, scores and every view change. Neither this report nor a JSON reviewer name authenticates approval. No public pointer was advanced.
