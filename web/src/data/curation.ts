import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { hash } from '../../../scripts/curation/io.mjs';
import { atlas } from './atlas';
import type { CurationDisease } from '../components/CurationWorkbench';
export const curationDiseases: CurationDisease[] = atlas.map(({ profile, bundle }) => {
  const root = resolve('../curation/workspace', profile.id), statePath = join(root, 'state.json');
  let papers: CurationDisease['papers'][number]['paper'][] = [], runId: string | null = null;
  if (existsSync(statePath)) { const state = JSON.parse(readFileSync(statePath, 'utf8')); papers = state.papers; runId = state.latestRunId; }
  if (existsSync(join(root, 'imports'))) {
    const paths = readdirSync(join(root, 'imports')).sort().map(name => join(root, 'imports', name, 'papers.json')).filter(path => existsSync(path));
    const records: typeof papers = paths.flatMap(path => JSON.parse(readFileSync(path, 'utf8')));
    // Explicitly inspected passages take precedence; provider flags remain visible.
    const byKey = new Map(papers.map(paper => [paper.key, paper]));
    const identifiers = new Map(papers.flatMap(paper => paper.identifiers.map(id => [id, paper.key])));
    for (const record of records) {
      const matches = [...new Set(record.identifiers.map(id => identifiers.get(id)).filter(Boolean))];
      if (matches.length > 1) throw new Error('Curator source identifier collision requires reconciliation');
      const key = matches[0] ?? record.key, previous = byKey.get(key);
      const merged = { ...record, key, identifiers: [...new Set([...(previous?.identifiers ?? []), ...record.identifiers])].sort(), flags: [...new Set([...(previous?.flags ?? []), ...record.flags])].sort() };
      byKey.set(key, merged); for (const id of merged.identifiers) identifiers.set(id, key);
    }
    papers = [...byKey.values()]; runId ??= paths.length ? 'Manual inspected imports' : null;
  }
  return { id: profile.id, label: profile.label, base: bundle, papers: papers.map(paper => ({ paper, paperDigest: hash(paper) })), runId };
});
