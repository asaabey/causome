import { ArrowRight, BookOpen, CornerUpLeft, ExternalLink } from 'lucide-react';
import type { Claim, Entity, Relationship, ReleaseBundle } from '../../data/types';
import { classPresentation, humanize } from './FlowElements';

export type Selection = { kind: 'entity' | 'relationship' | 'therapy'; id: string } | null;

export function ClaimCard({ claim, release, category }: { claim: Claim; release: ReleaseBundle; category: string }) {
  const context = release.contexts.find(item => item.id === claim.contextId);
  return (
    <article className="evidence-claim">
      <div className="evidence-claim__eyebrow"><span>{category}</span><span>{humanize(claim.verification)}</span></div>
      <p className="evidence-claim__text">{claim.text}</p>
      <p className="evidence-claim__context">{claim.reviewDisposition && <span>Review: {humanize(claim.reviewDisposition.decision)} · Source checked {claim.sourceCheckedAt}<br /></span>}Context: {context?.label ?? 'Context unavailable'} · {humanize(claim.causalInterpretation)}</p>
      {claim.limitations.length > 0 && <div className="evidence-limitations"><h4>Limits of this claim</h4><ul>{claim.limitations.map(limit => <li key={limit}>{limit}</li>)}</ul></div>}
      {claim.evidenceItemIds.map(id => {
        const evidence = release.evidenceItems.find(item => item.id === id);
        if (!evidence) return null;
        const source = release.sources.find(item => item.id === evidence.sourceId);
        return <div className="evidence-source" key={id}>
          <BookOpen size={15} aria-hidden="true" />
          <div>
            {source && <a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={12} aria-hidden="true" /><span className="graph-sr-only"> (opens in a new tab)</span></a>}
            <p>{evidence.summary}</p>{evidence.studySystem && <p>Study system: {evidence.studySystem} · {humanize(evidence.evidenceType ?? '')}</p>}<small>{humanize(source?.kind ?? 'source unavailable')} · {evidence.location} · Checked {evidence.retrievedAt}</small>{source?.studyId && <small>Study: {source.studyId} · Read: {source.accessScope}</small>}
          </div>
        </div>;
      })}
    </article>
  );
}

export default function EvidenceInspector({ release, selection, onSelect }: { release: ReleaseBundle; selection: Selection; onSelect: (selection: Selection) => void }) {
  const therapy = selection?.kind === 'therapy' ? release.therapies.find(item => item.id === selection.id) : undefined;
  if (therapy) {
    const categories = [
      { label: 'Supporting claim', ids: therapy.supportingClaimIds },
      { label: 'Qualifying claim', ids: therapy.qualifyingClaimIds ?? [] },
      { label: 'Contradicting claim', ids: therapy.contradictingClaimIds ?? [] },
    ];
    return <aside className="evidence-inspector" aria-label="Evidence inspector">
      <span className="graph-kicker">Therapeutic intervention</span>
      <div className="evidence-inspector__selection" aria-live="polite"><p className="evidence-inspector__kind">{humanize(therapy.developmentStatus)} · {therapy.modality}</p><h2>{therapy.name}</h2><p>{therapy.mechanismOfAction}</p></div>
      <div className="evidence-context"><span className="graph-kicker">Indication & status</span><p>{therapy.indication}</p><small>{therapy.jurisdiction} · {therapy.trialPhase}<br />Last verified: {therapy.lastVerifiedAt} · Editorial: {humanize(therapy.status)}</small></div>
      <div className="evidence-inspector__endpoints">{[...therapy.directTargetIds, ...therapy.indirectTargetIds].map(id => <button key={id} type="button" onClick={() => onSelect({ kind: 'entity', id })}>{therapy.directTargetIds.includes(id) ? 'Direct' : 'Indirect'}: {release.entities.find(item => item.id === id)?.label}</button>)}</div>
      <div className="evidence-limitations"><h4>Intervention limits</h4><ul>{therapy.limitations?.map(limit => <li key={limit}>{limit}</li>)}</ul></div>
      <div className="evidence-inspector__claims"><h3>Claims & provenance</h3>{categories.map(category => <div key={category.label}>{category.ids.map(id => { const claim = release.claims.find(item => item.id === id); return claim && <ClaimCard key={id} claim={claim} release={release} category={category.label} />; })}{category.ids.length === 0 && <p className="evidence-empty">No {category.label.toLowerCase()} recorded. This does not establish absence of evidence.</p>}</div>)}</div>
      <p className="evidence-inspector__notice">Source checked · Human domain review pending. Treatment records describe evidence and are not recommendations.</p>
    </aside>;
  }
  const entity = selection?.kind === 'entity' ? release.entities.find(item => item.id === selection.id) : undefined;
  const relationship = selection?.kind === 'relationship' ? release.relationships.find(item => item.id === selection.id) : undefined;
  const subject: Entity | Relationship | undefined = entity ?? relationship;
  const assessment = release.assessments.find(item => item.subjectId === subject?.id && item.contextId === (relationship?.contextId ?? release.mapViews[0]?.contextId));
  const context = release.contexts.find(item => item.id === (relationship?.contextId ?? assessment?.contextId ?? release.mapViews[0]?.contextId));
  const sourceEntity = release.entities.find(item => item.id === relationship?.sourceId);
  const targetEntity = release.entities.find(item => item.id === relationship?.targetId);
  const related = entity ? release.relationships.filter(item => item.sourceId === entity.id || item.targetId === entity.id) : [];
  const categories = entity
    ? [{ label: 'Biological role', ids: entity.biologicalRoleClaimIds }]
    : relationship ? [
      { label: 'Supporting claim', ids: relationship.supportingClaimIds },
      { label: 'Qualifying claim', ids: relationship.qualifyingClaimIds },
      { label: 'Contradicting claim', ids: relationship.contradictingClaimIds },
    ] : [];
  return (
    <aside className="evidence-inspector" aria-label="Evidence inspector">
      <div className="evidence-inspector__topline"><span className="graph-kicker">Evidence inspector</span><BookOpen size={18} aria-hidden="true" /></div>
      <div className="evidence-inspector__selection" aria-live="polite" aria-atomic="true">
        <p className="evidence-inspector__kind">{entity ? classPresentation[entity.entityClass].label : relationship ? `${humanize(relationship.directionality)} relationship` : 'Explore the map'}</p>
        <h2>{entity?.label ?? (relationship ? humanize(relationship.predicate) : 'Follow a mechanism.')}</h2>
        <p>{entity?.description ?? (relationship ? `${sourceEntity?.label} ${relationship.directionality === 'symmetric' ? '—' : '→'} ${targetEntity?.label}` : 'Select an entity or relationship to inspect its claims, context, and sources.')}</p>
      </div>
      {subject && <>
        <div className="evidence-context"><span className="graph-kicker">Biological context</span><p>{context?.label ?? 'Not specified'}</p><small>{[context?.organism, context?.phenotype, context?.tissue, context?.stage].filter(Boolean).join(' · ')}</small></div>
        <dl className="evidence-scores">
          <div><dt>Mechanistic weight</dt><dd>Not assessed</dd></div>
          <div><dt>Evidence confidence</dt><dd>Not assessed</dd></div>
          <div><dt>Therapeutic leverage</dt><dd>Not assessed</dd></div>
        </dl>
        <div className="evidence-editorial"><span>Editorial status: {humanize(subject.status)}</span><span>{assessment?.rationale ?? 'No assessment available for this context.'}</span></div>
        {relationship && <p className="evidence-direction-note">{relationship.directionality === 'symmetric' ? 'Association is symmetric. Endpoint order does not imply causation.' : `Arrow points from ${sourceEntity?.label} to ${targetEntity?.label}. Polarity: ${humanize(relationship.polarity)}.`}</p>}
        <div className="evidence-inspector__claims">
          <h3>Claims & provenance</h3>
          {categories.flatMap(category => category.ids.map(id => {
            const claim = release.claims.find(item => item.id === id);
            return claim ? <ClaimCard key={`${category.label}-${id}`} claim={claim} release={release} category={category.label} /> : null;
          }))}
          {relationship && categories.filter(category => category.ids.length === 0).map(category => <p className="evidence-empty" key={category.label}>No {category.label.toLowerCase().replace('claim', 'claims')} recorded. This does not establish absence of evidence.</p>)}
          {categories.every(category => category.ids.length === 0) && <p className="evidence-empty">No claims are attached to this record.</p>}
        </div>
        {entity && <div className="evidence-inspector__related"><h3>Therapeutic interventions</h3>{release.therapies.filter(item => [...item.directTargetIds, ...item.indirectTargetIds].includes(entity.id)).map(item => <button key={item.id} type="button" onClick={() => onSelect({ kind: 'therapy', id: item.id })}><span><strong>{item.name}</strong> · {item.directTargetIds.includes(entity.id) ? 'Direct target' : 'Indirect effect'} · {humanize(item.developmentStatus)}</span><ArrowRight size={16} aria-hidden="true" /></button>)}{!release.therapies.some(item => [...item.directTargetIds, ...item.indirectTargetIds].includes(entity.id)) && <p className="evidence-empty">No intervention linked in this bounded candidate.</p>}</div>}
        {entity && related.length > 0 && <div className="evidence-inspector__related"><h3>Connected relationships</h3>{related.map(item => {
          const other = release.entities.find(node => node.id === (item.sourceId === entity.id ? item.targetId : item.sourceId));
          return <button key={item.id} type="button" onClick={() => onSelect({ kind: 'relationship', id: item.id })}><span>{humanize(item.predicate)} <strong>{other?.label}</strong></span><ArrowRight size={16} aria-hidden="true" /></button>;
        })}</div>}
        {relationship && <div className="evidence-inspector__endpoints"><button type="button" onClick={() => onSelect({ kind: 'entity', id: relationship.sourceId })}><CornerUpLeft size={15} aria-hidden="true" />{sourceEntity?.label}</button><button type="button" onClick={() => onSelect({ kind: 'entity', id: relationship.targetId })}><CornerUpLeft size={15} aria-hidden="true" />{targetEntity?.label}</button></div>}
      </>}
      <div className="evidence-inspector__notice">{release.illustrative ? 'Illustrative fixture · unverified. These records demonstrate the interface and are not scientific evidence or clinical guidance.' : `Candidate ${release.id} · Human domain review pending · evidence cutoff ${release.evidenceCutoff}`}</div>
    </aside>
  );
}
