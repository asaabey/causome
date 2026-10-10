import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { canonicalize } from '../validation.mjs';

export const hash = value => createHash('sha256').update(typeof value === 'string' ? value : canonicalize(value)).digest('hex');
export const readJSON = path => JSON.parse(readFileSync(path, 'utf8'));
export const safeSlug = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,100}$/.test(value);
export const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
export function assert(condition, message) { if (!condition) throw new Error(message); }
export function writeJSON(path, value, { exclusive = false } = {}) {
  mkdirSync(dirname(path), { recursive: true });
  const content = `${JSON.stringify(value, null, 2)}\n`;
  if (exclusive) return writeFileSync(path, content, { flag: 'wx' });
  const pending = `${path}.${process.pid}.pending`;
  try { writeFileSync(pending, content, { flag: 'wx' }); renameSync(pending, path); }
  finally { rmSync(pending, { force: true }); }
}
export function writeImmutableJSON(path, value) {
  if (existsSync(path)) {
    assert(canonicalize(readJSON(path)) === canonicalize(value), `Immutable record differs: ${path}`);
    return false;
  }
  writeJSON(path, value, { exclusive: true });
  return true;
}
export async function withLock(path, action) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }), { flag: 'wx' });
  try { return await action(); } finally { rmSync(path); }
}
