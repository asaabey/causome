import { existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { assert, readJSON, safeSlug, writeJSON } from './io.mjs';

export function validateDisease(profile) {
  assert(profile.version === 1 && safeSlug(profile.id), 'Disease profile needs version 1 and a safe disease slug');
  for (const key of ['label', 'summary', 'query']) assert(typeof profile[key] === 'string' && profile[key].trim(), `Disease profile needs ${key}`);
  assert(Array.isArray(profile.aliases) && profile.aliases.every(item => typeof item === 'string' && item.trim()), 'Invalid disease aliases');
  assert(Number.isSafeInteger(profile.overlapDays) && profile.overlapDays >= 1 && profile.overlapDays <= 365, 'Overlap must be 1–365 days');
  assert(Number.isSafeInteger(profile.reconciliationDays) && profile.reconciliationDays >= profile.overlapDays, 'Invalid reconciliation interval');
  if (profile.previewCandidate !== null) assert(safeSlug(profile.previewCandidate), 'Invalid preview candidate ID');
  return profile;
}
export function loadDisease(root, id) {
  assert(safeSlug(id), 'Invalid disease ID');
  const profile = validateDisease(readJSON(join(root, id, 'disease.json')));
  assert(profile.id === id, 'Disease profile and directory differ');
  return profile;
}
export function listDiseases(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).filter(item => item.isDirectory() && existsSync(join(root, item.name, 'disease.json')))
    .map(item => loadDisease(root, item.name)).sort((a, b) => a.label.localeCompare(b.label));
}
export function initializeDisease(root, profile) {
  validateDisease(profile);
  const directory = join(root, profile.id);
  writeJSON(join(directory, 'disease.json'), profile, { exclusive: true });
  mkdirSync(join(directory, 'candidates'), { recursive: true });
  return directory;
}
