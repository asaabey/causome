import type { ReleaseBundle, Entity, Relationship } from '../data/types';
const stable = (value: unknown): string | undefined => Array.isArray(value) ? `[${value.map(stable).join(',')}]` : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable((value as Record<string, unknown>)[key])}`).join(',')}}` : JSON.stringify(value);
export function versionChanges(before: ReleaseBundle, after: ReleaseBundle) {
  const collections = ['entities', 'relationships', 'claims', 'evidenceItems', 'sources', 'therapies', 'contexts', 'assessments', 'scoringModels', 'mapViews', 'layouts'] as const;
  const metadata = (value: ReleaseBundle) => Object.fromEntries(Object.entries(value).filter(([key]) => !(collections as readonly string[]).includes(key)));
  const previousMetadata = metadata(before), currentMetadata = metadata(after);
  const metadataFields = [...new Set([...Object.keys(previousMetadata), ...Object.keys(currentMetadata)])].filter(key => stable(previousMetadata[key]) !== stable(currentMetadata[key]));
  return [...(metadataFields.length ? [{ collection: 'release', id: 'release-metadata', kind: 'changed', fields: metadataFields, before: previousMetadata as unknown, after: currentMetadata as unknown }] : []), ...collections.flatMap(collection => {
    const old = new Map(before[collection].map(item => [item.id, item])), next = new Map(after[collection].map(item => [item.id, item]));
    return [...new Set([...old.keys(), ...next.keys()])].flatMap(id => {
      const previous = old.get(id), current = next.get(id);
      if (stable(previous) === stable(current)) return [];
      const fields = [...new Set([...Object.keys(previous ?? {}), ...Object.keys(current ?? {})])].filter(key => stable((previous as unknown as Record<string, unknown>)?.[key]) !== stable((current as unknown as Record<string, unknown>)?.[key]));
      return [{ collection, id, kind: !previous ? 'added' : !current ? 'removed' : 'changed', fields, before: previous, after: current }];
    });
  })];
}
const sameEntity = (a: Entity, b: Entity) => a.entityClass === b.entityClass && (a.id === b.id || a.externalIds.some(id => b.externalIds.some(other => id.namespace.toLowerCase() === other.namespace.toLowerCase() && id.value.toLowerCase() === other.value.toLowerCase())));
export function sharedPathways(left: ReleaseBundle, right: ReleaseBundle) {
  const shared = left.entities.flatMap(entity => {
    const matches = right.entities.filter(other => sameEntity(entity, other));
    return matches.length === 1 && left.entities.filter(other => sameEntity(other, matches[0])).length === 1 ? [{ left: entity, right: matches[0] }] : [];
  });
  const mapping = new Map(shared.map(item => [item.left.id, item.right.id]));
  const matches = (a: Relationship, b: Relationship) => a.predicate === b.predicate && a.directionality === b.directionality && a.polarity === b.polarity && ((mapping.get(a.sourceId) === b.sourceId && mapping.get(a.targetId) === b.targetId) || (a.directionality === 'symmetric' && mapping.get(a.sourceId) === b.targetId && mapping.get(a.targetId) === b.sourceId));
  const sharedRelationships = left.relationships.flatMap(edge => right.relationships.filter(other => matches(edge, other)).map(other => ({ left: edge, right: other })));
  return { shared, sharedRelationships, leftOnly: left.relationships.filter(edge => !sharedRelationships.some(item => item.left.id === edge.id)), rightOnly: right.relationships.filter(edge => !sharedRelationships.some(item => item.right.id === edge.id)) };
}
