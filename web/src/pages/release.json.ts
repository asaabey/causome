import release, { isPublication } from '../data/release';

export const GET = () => new Response(JSON.stringify({
  mode: isPublication ? 'publication' : 'preview',
  releaseId: release.id, contentDigest: release.manifest.contentDigest,
    diseaseId: release.diseaseId,
    parentReleaseId: release.parentReleaseId,
  evidenceCutoff: release.evidenceCutoff,
  entityCount: release.entities.length, relationshipCount: release.relationships.length,
}), { headers: { 'Content-Type': 'application/json' } });
