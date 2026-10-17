import { useMemo } from 'react';
import type { EntityClass, ReleaseBundle } from '../../data/types';
import { compactLabel, type CloudGroup, type CloudItem } from '../../lib/word-cloud';
import WordCloud from '../WordCloud';

// Families group entity classes into mnemonic clusters; clinical outcomes sit apart, unscaled, so the disease phenotype never dominates the players.
const families: (CloudGroup & { classes: EntityClass[] })[] = [
  { id: 'humoral', label: 'Antibodies & complexes', tone: 'plum', classes: ['antibody', 'immune_complex'] },
  { id: 'cells', label: 'Cells', tone: 'blue', classes: ['cell'] },
  { id: 'mediators', label: 'Cytokines & mediators', tone: 'amber', classes: ['cytokine', 'metabolite'] },
  { id: 'molecular', label: 'Proteins, receptors & genes', tone: 'green', classes: ['protein', 'receptor', 'gene', 'genetic_variant'] },
  { id: 'processes', label: 'Processes', tone: 'violet', classes: ['process'] },
  { id: 'context', label: 'Substrates, tissues & pathogens', tone: 'olive', classes: ['substrate', 'tissue', 'pathogen'] },
  { id: 'outcomes', label: 'Leads to', tone: 'earth', classes: ['clinical_outcome'], scaled: false, layout: 'row' },
];
const familyOf = new Map(families.flatMap(family => family.classes.map(entityClass => [entityClass, family.id])));

export default function KeyPlayers({ release, shortLabels = {}, selectedId, onSelect }: { release: ReleaseBundle; shortLabels?: Record<string, string>; selectedId?: string; onSelect: (id: string) => void }) {
  const items = useMemo<CloudItem[]>(() => release.entities.map(entity => ({
    id: entity.id,
    label: entity.label,
    shortLabel: shortLabels[entity.id] ?? compactLabel(entity.label),
    group: familyOf.get(entity.entityClass),
    weight: new Set([...entity.biologicalRoleClaimIds, ...release.claims.filter(claim => claim.subjectId === entity.id || claim.objectId === entity.id).map(claim => claim.id)]).size,
  })), [release, shortLabels]);
  return <WordCloud items={items} groups={families} title="Key players" caption="Size = evidence-linked claims in this map, not importance or causal weight"
    unit={['evidence-linked claim', 'evidence-linked claims']} selectedId={selectedId} onSelect={onSelect} actionHint="Show on map." />;
}
