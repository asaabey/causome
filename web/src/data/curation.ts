import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { hash, safeSlug } from '../../../scripts/curation/io.mjs';
import { atlas } from './atlas';
import { summaryPacket, feedbackTemplate, recordSummaryFeedback } from '../../../scripts/curation/summary.mjs';
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
  const feedbackRoot = resolve('../knowledge/diseases', profile.id, 'summary-reviews');
  const feedback = existsSync(feedbackRoot) ? readdirSync(feedbackRoot).filter(name => /^summary-feedback-[a-f0-9]+\.json$/.test(name)).map(name => {
    const record = JSON.parse(readFileSync(join(feedbackRoot, name), 'utf8'));
    if (!safeSlug(record.candidateId) || record.diseaseId !== profile.id || name !== `${record.id}.json`) throw new Error('Invalid summary feedback identity');
    const reviewed = JSON.parse(readFileSync(resolve('../knowledge/diseases', profile.id, 'candidates', `${record.candidateId}.json`), 'utf8'));
    const input = Object.fromEntries(Object.keys(feedbackTemplate(reviewed)).map(key => [key, record[key]]));
    if (hash(recordSummaryFeedback(reviewed, input)) !== hash(record)) throw new Error('Invalid summary feedback receipt');
    return { ...record, current: record.contentDigest === bundle.manifest.contentDigest };
  }) : [];
  const packet = bundle.scientificSummary ? summaryPacket(bundle) : null;
  return { id: profile.id, label: profile.label, base: bundle, papers: papers.map(paper => ({ paper, paperDigest: hash(paper) })), runId,
    ...(packet ? { summaryReview: { reviewText: packet.reviewText, packet, feedbackTemplate: feedbackTemplate(bundle), feedback } } : {}) };
});
