import { useState } from 'react';
import type { ReleaseBundle, Relationship } from '../data/types';
import { sharedPathways } from '../lib/comparison';

interface Disease { id: string; label: string; bundle: ReleaseBundle }
export default function DiseaseComparison({ diseases, basePath }: { diseases: Disease[]; basePath: string }) {
  const [leftId, setLeftId] = useState(diseases[0].id), [rightId, setRightId] = useState(diseases.at(-1)!.id);
  const left = diseases.find(item => item.id === leftId)!, right = diseases.find(item => item.id === rightId)!;
  const comparison = sharedPathways(left.bundle, right.bundle);
  const endpoint = (bundle: ReleaseBundle, id: string) => bundle.entities.find(item => item.id === id)?.label;
  const context = (bundle: ReleaseBundle, edge: Relationship) => bundle.contexts.find(item => item.id === edge.contextId)?.label;
  const evidenceLink = (disease: Disease, id: string, kind = 'entity') => `${basePath}diseases/${disease.id}/#${kind}-${id}`;
  return <div className="comparison-workspace">
    <div className="comparison-pickers"><label>First disease<select value={leftId} onChange={event => setLeftId(event.target.value)}>{diseases.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Second disease<select value={rightId} onChange={event => setRightId(event.target.value)}>{diseases.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></div>
    {leftId === rightId ? <p role="status">Choose two different diseases. An additional disease requires its own source evidence and domain review.</p> : <>
      <p role="status" aria-live="polite">{comparison.shared.length} shared canonical entities; {comparison.sharedRelationships.length} structurally shared relationships. Context and evidence remain separate.</p>
      <h2>Shared entities</h2>{comparison.shared.length === 0 && <p>No unambiguous shared identity is recorded. Similar labels alone do not establish identity.</p>}
      {comparison.shared.map(item => <article className="comparison-change" key={item.left.id}><h3>{item.left.label}</h3><div className="comparison-records">{[[left, item.left], [right, item.right]].map(([diseaseValue, entityValue]) => {
        const disease = diseaseValue as Disease, entity = entityValue as typeof item.left;
        const assessments = disease.bundle.assessments.filter(assessment => assessment.subjectId === entity.id);
        return <div key={disease.id}><h4>{disease.label}</h4><p>{entity.description}</p>{assessments.map(assessment => <p key={assessment.id}>Context: {disease.bundle.contexts.find(context => context.id === assessment.contextId)?.label}. Weight: {assessment.mechanisticWeight ?? 'Not assessed'}. Confidence: {assessment.evidenceConfidence ?? 'Not assessed'}.</p>)}<a href={evidenceLink(disease, entity.id)}>Read {disease.label} evidence</a></div>;
      })}</div></article>)}
      <h2>Relationships in context</h2>{[left, right].map(disease => <details key={disease.id} open><summary>{disease.label} · {disease.bundle.relationships.length} relationships</summary><ul>{disease.bundle.relationships.map(edge => <li key={edge.id}><a href={evidenceLink(disease, edge.id, 'relationship')}>{endpoint(disease.bundle, edge.sourceId)} {edge.directionality === 'symmetric' ? '—' : '→'} {endpoint(disease.bundle, edge.targetId)}</a><small>{edge.predicate.replaceAll('_',' ')} · {edge.directionality} · {context(disease.bundle, edge)} · {comparison.sharedRelationships.some(pair => pair.left.id === edge.id || pair.right.id === edge.id) ? 'Shared structure; independent evidence' : 'Disease-specific structure'}</small></li>)}</ul></details>)}
    </>}
  </div>;
}
