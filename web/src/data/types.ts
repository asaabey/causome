/** Minimal Milestone 1 snapshot contract; assessment values stay explicitly unassessed. */
export type EditorialStatus = 'candidate' | 'under_review' | 'approved' | 'published';
export type EntityClass = 'cytokine' | 'cell' | 'antibody' | 'immune_complex' | 'process' | 'clinical_outcome';
export type Predicate = 'stimulates' | 'produces' | 'forms' | 'contributes_to' | 'is_associated_with';
export interface RecordIdentity { id: string; revisionId: string; status: EditorialStatus }
export interface Entity extends RecordIdentity {
  label: string; synonyms: string[]; entityClass: EntityClass; description: string;
  biologicalRoleClaimIds: string[]; externalIds: { namespace: string; value: string }[];
}
export interface Relationship extends RecordIdentity {
  sourceId: string; targetId: string; predicate: Predicate;
  directionality: 'directed' | 'symmetric'; polarity: 'positive' | 'negative' | 'not_applicable';
  contextId: string; assessmentId: string; supportingClaimIds: string[];
  qualifyingClaimIds: string[]; contradictingClaimIds: string[];
}
export interface Claim extends RecordIdentity {
  text: string; subjectId: string; objectId: string; predicate: Predicate;
  contextId: string; evidenceItemIds: string[]; verification: 'unverified' | 'reviewed';
  causalInterpretation: 'illustrative' | 'association' | 'causal'; limitations: string[];
}
export interface EvidenceItem extends RecordIdentity {
  sourceId: string; summary: string; location: string; retrievedAt: string;
}
export interface Source extends RecordIdentity {
  title: string; url: string; kind: 'fixture_documentation' | 'publication' | 'trial';
}
export interface Therapy extends RecordIdentity {
  name: string; modality: string; directTargetIds: string[]; indirectTargetIds: string[];
  mechanismOfAction: string; indicationContextId: string;
  developmentStatus: 'unverified' | 'experimental' | 'approved' | 'withdrawn';
  trialSourceIds: string[]; supportingClaimIds: string[]; lastVerifiedAt: string | null;
}
export interface DiseaseContext extends RecordIdentity {
  diseaseId: string; label: string; organism: string; phenotype: string | null;
  tissue: string | null; stage: string | null;
}
export interface Assessment extends RecordIdentity {
  subjectId: string; contextId: string; scoringModelId: string;
  metricStatus: { mechanisticWeight: 'unassessed'; evidenceConfidence: 'unassessed'; therapeuticLeverage: 'unassessed' };
  mechanisticWeight: null; evidenceConfidence: null; therapeuticLeverage: null;
  supportingClaimIds: string[]; qualifyingClaimIds: string[]; contradictingClaimIds: string[];
  rationale: string; reviewerDecision: null; reviewedAt: null;
}
export interface ScoringModel extends RecordIdentity {
  label: string; calibrated: false; description: string;
}
export interface Layout extends RecordIdentity { positions: { entityId: string; x: number; y: number }[] }
export interface MapView extends RecordIdentity {
  label: string; contextId: string; entityIds: string[]; relationshipIds: string[];
  assessmentIds: string[]; layoutId: string;
}
export interface ReleaseBundle {
  id: string; revisionId: string; formatVersion: '0.1.0'; diseaseId: string; title: string;
  status: EditorialStatus; illustrative: boolean; parentReleaseId: null; parentContentDigest: null;
  createdAt: string; evidenceCutoff: string; changeSetRevision: string;
  entities: Entity[]; relationships: Relationship[]; claims: Claim[]; evidenceItems: EvidenceItem[];
  sources: Source[]; therapies: Therapy[]; contexts: DiseaseContext[]; assessments: Assessment[]; scoringModels: ScoringModel[];
  mapViews: MapView[]; layouts: Layout[];
  manifest: { algorithm: 'sha256'; schemaVersion: '0.1.0'; contentDigest: string };
}
