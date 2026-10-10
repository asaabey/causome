/** Self-contained preview contract; source checking is distinct from human approval. */
export type EditorialStatus = 'candidate' | 'under_review' | 'approved' | 'published';
export type EntityClass = 'cytokine' | 'cell' | 'antibody' | 'immune_complex' | 'process' | 'clinical_outcome' | 'receptor' | 'substrate' | 'genetic_variant' | 'protein' | 'gene' | 'metabolite' | 'pathogen' | 'tissue';
export type Predicate = 'stimulates' | 'produces' | 'forms' | 'contributes_to' | 'is_associated_with' | 'activates' | 'inhibits' | 'increases_availability_of' | 'promotes_survival_of' | 'differentiates_into' | 'efficacy_on';
export interface RecordIdentity { id: string; revisionId: string; status: EditorialStatus }
export interface Entity extends RecordIdentity {
  label: string; synonyms: string[]; entityClass: EntityClass; description: string;
  biologicalRoleClaimIds: string[]; externalIds: { namespace: string; value: string }[];
}
export interface Relationship extends RecordIdentity {
  sourceId: string; targetId: string; predicate: Predicate;
  directionality: 'directed' | 'symmetric'; polarity: 'positive' | 'negative' | 'not_applicable';
  contextId: string; assessmentId: string; supportingClaimIds: string[]; provisional?: boolean;
  qualifyingClaimIds: string[]; contradictingClaimIds: string[];
}
export interface Claim extends RecordIdentity {
  text: string; subjectId: string; objectId: string; predicate: Predicate;
  contextId: string; evidenceItemIds: string[]; verification: 'unverified' | 'source_checked' | 'reviewed';
  sourceCheckedAt?: string;
  reviewDisposition?: { decision: 'pending_domain_review' | 'accepted' | 'rejected'; reviewerId: string | null; reviewedAt: string | null };
  causalInterpretation: 'illustrative' | 'association' | 'causal' | 'mechanistic' | 'hypothesis' | 'interventional'; limitations: string[];
}
export interface EvidenceItem extends RecordIdentity {
  sourceId: string; summary: string; location: string; retrievedAt: string;
  studySystem?: string; evidenceType?: 'human_genetic' | 'human_observational' | 'human_in_vitro' | 'animal_experiment' | 'randomized_trial' | 'regulatory_label' | 'development_status';
}
export interface Source extends RecordIdentity {
  title: string; url: string; kind: 'fixture_documentation' | 'publication' | 'trial' | 'regulatory' | 'sponsor_status';
  studyId?: string; citation?: string; accessScope?: string;
  identifiers?: string[]; flags?: string[]; datasetFamilyId?: string; researchGroupId?: string;
}
export interface Therapy extends RecordIdentity {
  name: string; modality: string; directTargetIds: string[]; indirectTargetIds: string[];
  mechanismOfAction: string; indicationContextId: string;
  developmentStatus: 'unverified' | 'experimental' | 'approved' | 'withdrawn';
  trialSourceIds: string[]; supportingClaimIds: string[]; lastVerifiedAt: string | null;
  indication?: string; jurisdiction?: string; trialPhase?: string; verificationSourceIds?: string[];
  qualifyingClaimIds?: string[]; contradictingClaimIds?: string[]; limitations?: string[];
}
export interface DiseaseContext extends RecordIdentity {
  diseaseId: string; label: string; organism: string; phenotype: string | null;
  tissue: string | null; stage: string | null;
}
export interface Assessment extends RecordIdentity {
  subjectId: string; contextId: string; scoringModelId: string;
  metricStatus: { mechanisticWeight: 'unassessed' | 'assessed'; evidenceConfidence: 'unassessed' | 'assessed'; therapeuticLeverage: 'unassessed' | 'categorical' };
  mechanisticWeight: number | null; evidenceConfidence: number | null; therapeuticLeverage: null;
  weightRaw?: number | null; weightTier?: number | null;
  appraisalProvenance?: { status: 'provisional'; assessorId: string; assessorKind: 'agent' | 'human'; assessedAt: string; inputDigest: string; baseReleaseId: string; baseContentDigest: string };
  therapeuticAppraisal?: { category: 'approved_direct_target' | 'experimental_direct_target' | 'withdrawn_direct_target' | 'unverified_direct_target' | 'indirect_intervention' | 'no_linked_intervention'; scope: 'entity' | 'relationship_endpoints'; therapyIds: string[]; rationale: string };
  weightComponents?: Record<string, { rating: number | null; rationale: string; claimIds: string[] }>;
  confidenceAppraisal?: { dimensions: Record<string, { rating: string; rationale: string; claimIds: string[] }>; downgradeRationale?: string };
  supportingClaimIds: string[]; qualifyingClaimIds: string[]; contradictingClaimIds: string[];
  rationale: string; reviewerDecision: 'accepted' | null; reviewedAt: string | null; reviewerId?: string;
}
export interface ScoringModel extends RecordIdentity {
  label: string; calibrated: boolean; provisional?: boolean; description: string;
  rubric?: { version: string; areaRatios: number[]; confidenceStyles: string[] }; calibration?: { modelRevisionId: string; reviewerIds: string[] };
}
export interface Layout extends RecordIdentity { positions: { entityId: string; x: number; y: number }[] }
export interface MapView extends RecordIdentity {
  label: string; contextId: string; entityIds: string[]; relationshipIds: string[];
  assessmentIds: string[]; layoutId: string;
  groups?: { id: string; label: string; entityIds: string[]; collapsed: boolean }[];
}
export interface ReleaseBundle {
  id: string; revisionId: string; formatVersion: '0.1.0' | '0.2.0' | '0.3.0'; diseaseId: string; title: string;
  status: EditorialStatus; illustrative: boolean; parentReleaseId: string | null; parentContentDigest: string | null;
  releaseNote?: string; createdAt: string; evidenceCutoff: string; changeSetRevision: string;
  diseaseDescription?: string; diseaseAliases?: string[];
  entities: Entity[]; relationships: Relationship[]; claims: Claim[]; evidenceItems: EvidenceItem[];
  sources: Source[]; therapies: Therapy[]; contexts: DiseaseContext[]; assessments: Assessment[]; scoringModels: ScoringModel[];
  mapViews: MapView[]; layouts: Layout[];
  manifest: { algorithm: 'sha256'; schemaVersion: '0.1.0' | '0.2.0' | '0.3.0'; contentDigest: string };
}
