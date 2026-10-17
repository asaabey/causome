# behcet-disease: proposal-6b611bb7072e3ebaaee9ef8e

Base: behcet-disease-summary-candidate-b4e9d1815063

Base digest: bd25eaf177c306bfeaf3c13185f0ff486e4ffb111ffb38ad587f3787c2101cdc

Candidate: behcet-disease-review-candidate-20261017-001

Prompt: manual-bundle; model: manual.

## Findings

Manual candidate bundle; review the complete diff.

## Pending source checks

None recorded

## Warnings

Independent scientific review is still required.

## Complete record diff

- release/release-metadata: changed; id, revisionId, changeSetRevision, releaseNote, manifest, scientificSummary
- entities/entity-il17: changed; revisionId, biologicalRoleClaimIds
- entities/entity-neutrophils: changed; revisionId, biologicalRoleClaimIds
- entities/entity-tc17: added; id, revisionId, status, label, entityClass, description, synonyms, externalIds, biologicalRoleClaimIds
- relationships/relationship-behcet-il17-neutrophils: added; id, revisionId, status, sourceId, targetId, predicate, directionality, polarity, contextId, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- relationships/relationship-behcet-tc17-il17: added; id, revisionId, status, sourceId, targetId, predicate, directionality, polarity, contextId, assessmentId, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds
- claims/claim-behcet-il17-neutrophils: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-behcet-infliximab-bio: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- claims/claim-behcet-tc17-il17: added; id, revisionId, status, text, subjectId, objectId, predicate, contextId, evidenceItemIds, verification, causalInterpretation, limitations, sourceCheckedAt, reviewDisposition
- evidenceItems/evidence-behcet-il17-neutrophils: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-behcet-infliximab-bio: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- evidenceItems/evidence-behcet-tc17-il17: added; id, revisionId, status, sourceId, summary, location, retrievedAt, studySystem, evidenceType
- sources/source-behcet-34254298: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- sources/source-behcet-39432564: added; id, revisionId, status, title, url, kind, studyId, citation, accessScope, identifiers, flags
- therapies/therapy-behcet-infliximab: changed; revisionId, trialSourceIds, qualifyingClaimIds, limitations
- contexts/context-behcet-bio-trial: added; id, revisionId, status, diseaseId, label, organism, phenotype, tissue, stage
- assessments/assessment-0a5ecaf5f76493f19c0b: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-0b1e8479c033cc9e5a44: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-0f56eefdeb65655b817b: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-11bdee01d980bb2760e4: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-14689e0426aeaf81d1d4: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-16d452d930af45278711: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-19e456ada366aa4aa67c: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-1f211e977f8be9da3666: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-1f8a47dd9a875ca27245: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-23ca51f6edcd6c7016b2: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-2b745c1b54322fb88a2e: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-2f516dcdc1bd8d790c77: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-30f3088bb21f4e5685e7: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-31b0a094a74945aaf4b8: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-32604d12a66386a1e5fc: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-343353057c1e85cc0ec3: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-3752c9dfb4da803a6fe0: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-39535bdaa3a3a082a67d: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-3ad73cffb12d6b1ed327: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-3cdc49b08b9f59ca0a2d: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-421cad971e6365372d1b: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-45d2d2904efb2980db7d: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4b90e9beac68bc21e94d: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4e748e22df51bdcbd62b: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-4f498f1bdcf9c0f4de14: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-553938f24d4a926ccb19: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-557042ff0ae56a70cf0f: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-55f99b9c1f88140b0756: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-58fc506342685e1a3fdd: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-5bab71454042de8b4fbe: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-6d084c50c0371db24e65: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-73894b08c396b01dd26c: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-75b2bb3dd23b73b4e15d: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-763024083f9a0dcc3f3b: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-784d5631e040850130de: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-7ed8c2462916a872f127: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-7f6b02d80e426016f88c: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-8134c9240745416406f1: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-82a498619f1cc6bc7a28: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-83c2f524fa026e2a7432: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-84a1697f7c9322d5c767: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-8bc72035a7633eddbc14: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-90525d7e19ddfee8572a: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-90714f459ffaadabe878: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-9804df3abac422cf6570: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-99bb03e028e8a4225c5a: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-99d7485c4146739af301: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-9bc6a9c7bbeb68ebe1d9: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-9cb39389c0f144c3acc8: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-9d37d3e19dd8281bef7c: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a0e6b83345f00748de68: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a22b7abade078e55a3a5: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a2697db7b11bfcd83337: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a46b1ceee843fcbc582a: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-a828f94e475a53ab4231: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ac180bccc43014319c6c: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ade6c47c3fb329b3ef0e: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ae250e490eb31ff0030b: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b3121f3031151013c282: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b49afb1bdaa13281588c: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b7b1cec82deff2ea9801: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b832b0bb12187f4cf4c7: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b83cde9196c6e836f7fe: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b87f4a63de8a8ca1a353: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-b97eabdfdd31032d0077: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-bcd2279cc1412598cddb: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-behcet-il17-neutrophils: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-behcet-tc17: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-behcet-tc17-il17: added; id, revisionId, status, subjectId, contextId, scoringModelId, metricStatus, mechanisticWeight, evidenceConfidence, therapeuticLeverage, supportingClaimIds, qualifyingClaimIds, contradictingClaimIds, rationale, reviewerDecision, reviewedAt
- assessments/assessment-c05bb000a608363f9653: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-c806a34cf8e594c8c87d: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-cd4549731d1b5086f4e1: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ce09159753f93d129d70: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-cf7526c4b97daaf5dea8: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-d0183dbb7e88af36e335: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-d15c6b4632721ff69cfe: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-d40cd08b8a7522fe249f: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-d6c90bb4b491ab811ac9: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-d8ba1a4c098a7acc2150: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-d963c92437f91dda0dbc: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-db6c079ff036c8f26f85: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-dcc25839019a7271e7f3: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-de07f6c334448b2290bf: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-e76937b30cf13d89e819: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-e88fd755336af6fd8f97: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-ecf7858699614cbe7315: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-f23c6ffdeb69206f8194: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-f5bf17f8cc683c2515a7: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-f99fa632f8a117390078: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- assessments/assessment-fdf5e389648b462063d3: changed; revisionId, metricStatus, mechanisticWeight, evidenceConfidence, rationale, therapeuticAppraisal, weightComponents, weightRaw, weightTier, confidenceAppraisal, appraisalProvenance
- mapViews/view-behcet-disease-overview: changed; revisionId, entityIds, relationshipIds, assessmentIds
- layouts/layout-behcet-disease-overview: changed; revisionId, positions

Review context, source entailment, direction, polarity, evidence category, study independence, therapy status, scores and every view change. Neither this report nor a JSON reviewer name authenticates approval. No public pointer was advanced.
