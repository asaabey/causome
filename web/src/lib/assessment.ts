import type { Assessment } from '../data/types';
export const appraisalFieldLabel = (key: string) => key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ');
export function metricLabel(assessment: Assessment | undefined, metric: 'mechanisticWeight' | 'evidenceConfidence') {
  const value = assessment?.[metric];
  return value == null ? assessment?.appraisalProvenance?.method === 'rules' ? 'Insufficient support' : 'Not assessed'
    : `${value}/${metric === 'mechanisticWeight' ? 100 : 4}`;
}
export function appraisalAttribution(assessment: Assessment) {
  const provenance = assessment.appraisalProvenance;
  return provenance?.method === 'rules' ? `Automatic · ${provenance.rulesVersion}, ${provenance.assessedAt}.`
    : provenance ? `Draft by ${provenance.assessorId} (${provenance.assessorKind}), ${provenance.assessedAt}.` : '';
}

const labels = {
  approved_direct_target: 'Approved direct target',
  experimental_direct_target: 'Experimental direct target',
  withdrawn_direct_target: 'Withdrawn direct target',
  unverified_direct_target: 'Unverified direct target',
  indirect_intervention: 'Indirect intervention',
  no_linked_intervention: 'No intervention curated',
};
export function therapeuticLabel(assessment?: Assessment) {
  const appraisal = assessment?.therapeuticAppraisal;
  if (!appraisal) return 'Not assessed';
  return `${appraisal.scope === 'relationship_endpoints' && appraisal.therapyIds.length ? 'Endpoint: ' : ''}${labels[appraisal.category]}`;
}
