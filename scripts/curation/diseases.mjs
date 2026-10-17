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
// Short labels are presentation-only display names for word clouds. They live beside the profile, outside the digested scientific record.
export const SHORT_LABEL_MAX = 24;
export function validateShortLabels(file) {
  assert(file?.version === 1 && file.labels && typeof file.labels === 'object' && !Array.isArray(file.labels), 'Short labels need version 1 and a labels object');
  for (const [id, label] of Object.entries(file.labels)) {
    assert(/^entity-[a-z0-9-]+$/.test(id), `Invalid short-label entity ID ${id}`);
    assert(typeof label === 'string' && label.trim() === label && label.length >= 1 && label.length <= SHORT_LABEL_MAX, `Short label for ${id} must be 1–${SHORT_LABEL_MAX} trimmed characters`);
  }
  return file.labels;
}
export function loadShortLabels(root, id) {
  assert(safeSlug(id), 'Invalid disease ID');
  const path = join(root, id, 'short-labels.json');
  return existsSync(path) ? validateShortLabels(readJSON(path)) : {};
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
