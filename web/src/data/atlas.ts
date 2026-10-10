import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { listDiseases } from '../../../scripts/curation/diseases.mjs';
import { listPublishedReleases, loadPublishedRelease } from '../../../scripts/release-store.mjs';
import { validatePreview } from '../../../scripts/validation.mjs';
import type { ReleaseBundle } from './types';

export interface DiseaseProfile { version: 1; id: string; label: string; aliases: string[]; summary: string; query: string; overlapDays: number; reconciliationDays: number; previewCandidate: string | null }
export interface AtlasDisease { profile: DiseaseProfile; bundle: ReleaseBundle; versions: ReleaseBundle[]; published: boolean }
export const isPublication = process.env.CAUSOME_BUILD_MODE === 'publication';
if (process.env.CAUSOME_BUILD_MODE && !['preview', 'publication'].includes(process.env.CAUSOME_BUILD_MODE)) throw new Error('Unknown Causome build mode');
const root = resolve('../knowledge/diseases');
const override = process.env.CAUSOME_CANDIDATE_PATH;
const match = override?.match(/^knowledge\/diseases\/([a-z0-9][a-z0-9-]*)\/candidates\/([a-z0-9][a-z0-9-]*)\.json$/);
if (override && !match) throw new Error('Invalid candidate preview path');
const checked = (path: string, id: string): ReleaseBundle => {
  const bundle = JSON.parse(readFileSync(path, 'utf8'));
  const result = validatePreview(bundle);
  if (!result.valid || bundle.diseaseId !== id) throw new Error(`Invalid ${id} snapshot: ${result.errors.join('; ')}`);
  return bundle;
};
const profiles: DiseaseProfile[] = listDiseases(root);
const customPublicStore = isPublication && process.env.CAUSOME_RELEASE_STORE ? resolve(process.env.CAUSOME_RELEASE_STORE) : null;
const customPublicRelease = customPublicStore ? loadPublishedRelease(customPublicStore).bundle as ReleaseBundle : null;
export const atlas: AtlasDisease[] = profiles.flatMap<AtlasDisease>(profile => {
  const store = isPublication && process.env.CAUSOME_RELEASE_STORE ? resolve(process.env.CAUSOME_RELEASE_STORE) : join(root, profile.id);
  if (isPublication) {
    if (customPublicRelease && profile.id !== customPublicRelease.diseaseId) return [];
    if (!process.env.CAUSOME_RELEASE_STORE && !existsSync(join(store, 'current.json'))) return [];
    const bundle = loadPublishedRelease(store).bundle as ReleaseBundle;
    if (bundle.diseaseId !== profile.id) throw new Error('Publication store disease differs from its route');
    const frozenProfile = { ...profile, label: bundle.title, aliases: bundle.diseaseAliases ?? [], summary: bundle.diseaseDescription ?? bundle.releaseNote ?? 'Reviewed contextual evidence and its limitations.' };
    return [{ profile: frozenProfile, bundle, versions: listPublishedReleases(store) as ReleaseBundle[], published: true }];
  }
  const id = match?.[1] === profile.id ? match[2] : profile.previewCandidate;
  if (!id) return [];
  const bundle = checked(join(root, profile.id, 'candidates', `${id}.json`), profile.id);
  const candidates = readdirSync(join(root, profile.id, 'candidates')).filter(name => /^[a-z0-9-]+\.json$/.test(name)).map(name => checked(join(root, profile.id, 'candidates', name), profile.id));
  const published = existsSync(join(root, profile.id, 'current.json')) ? listPublishedReleases(join(root, profile.id)) as ReleaseBundle[] : [];
  const byId = new Map<string, ReleaseBundle>();
  for (const version of [...candidates, ...published]) {
    if (byId.has(version.id) && byId.get(version.id)!.manifest.contentDigest !== version.manifest.contentDigest) throw new Error('A candidate reuses an immutable release ID with different content');
    byId.set(version.id, version);
  }
  return [{ profile, bundle, versions: [...byId.values()].sort((a,b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)), published: false }];
});
if (!atlas.length) throw new Error(isPublication ? 'No approved current root (current.json). Complete authenticated scientific publication first.' : 'No validated disease candidate is selected');
export const primaryDisease = atlas.find(item => item.profile.id === match?.[1]) ?? atlas.find(item => item.profile.id === 'sle') ?? atlas[0];
export const diseaseProfiles = profiles;
