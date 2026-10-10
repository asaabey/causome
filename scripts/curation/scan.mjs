import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { assert, hash, readJSON, validDate, withLock, writeImmutableJSON, writeJSON } from './io.mjs';
import { normalizePaper, scanQueries } from './literature.mjs';

const daysBefore = (date, days) => new Date(Date.parse(date) - days * 86_400_000).toISOString().slice(0, 10);
const scientificContent = paper => { const { firstSeenAt, lastCheckedAt, reviewedAt, ...content } = paper; return content; };

export function mergePapers(existing, incoming, checkedAt) {
  const papers = new Map(existing.map(paper => [paper.key, structuredClone(paper)]));
  const identifiers = new Map(existing.flatMap(paper => paper.identifiers.map(id => [id, paper.key])));
  const changes = [];
  for (const raw of incoming) {
    const paper = normalizePaper(raw);
    const matches = [...new Set(paper.identifiers.map(id => identifiers.get(id)).filter(Boolean))];
    assert(matches.length <= 1, `Identifier collision requires curator reconciliation: ${paper.identifiers.join(', ')}`);
    const key = matches[0] ?? paper.key, previous = papers.get(key);
    const next = { ...paper, key, identifiers: [...new Set([...(previous?.identifiers ?? []), ...paper.identifiers])].sort(),
      flags: [...new Set([...(previous?.flags ?? []), ...paper.flags])].sort(),
      firstSeenAt: previous?.firstSeenAt ?? checkedAt, lastCheckedAt: checkedAt, reviewedAt: previous?.reviewedAt ?? null };
    if (!previous || hash(scientificContent(previous)) !== hash(scientificContent(next))) changes.push({ key, kind: previous ? 'updated' : 'new', flags: next.flags });
    papers.set(key, next);
    for (const id of next.identifiers) identifiers.set(id, key);
  }
  // A correction/retraction notice must flag the linked original as well.
  for (const paper of papers.values()) for (const related of paper.relatedRecords) {
    const key = identifiers.get(`${related.source}:${related.id}`), original = papers.get(key);
    if (!original || !/retract|concern|errat|correct/i.test(related.type)) continue;
    const flag = /retract/i.test(related.type) ? 'retraction-linked' : /concern/i.test(related.type) ? 'concern-linked' : 'correction-linked';
    if (!original.flags.includes(flag)) { original.flags.push(flag); original.flags.sort(); changes.push({ key, kind: 'updated', flags: original.flags }); }
  }
  return { papers: [...papers.values()].sort((a, b) => a.key.localeCompare(b.key)), changes: [...new Map(changes.map(item => [item.key, item])).values()] };
}

export async function scanDisease({ profile, directory, provider, knownIdentifiers = [], to = new Date().toISOString().slice(0, 10), from, reconcile = false, trigger = 'manual' }) {
  assert(validDate(to) && ['manual', 'scheduled'].includes(trigger), 'Invalid scan date or trigger');
  const attempt = { version: 1, id: `attempt-${randomUUID()}`, diseaseId: profile.id, trigger, provider: provider.version, startedAt: new Date().toISOString(), requestedThrough: to };
  try {
  const result = await withLock(join(directory, '.scan.lock'), async () => {
    const statePath = join(directory, 'state.json');
    const previous = existsSync(statePath) ? readJSON(statePath) : { version: 1, diseaseId: profile.id, cursor: null, lastReconciledAt: null, papers: [] };
    assert(previous.version === 1 && previous.diseaseId === profile.id && Array.isArray(previous.papers), 'Invalid scan state');
    assert((previous.cursor === null || validDate(previous.cursor)) && (previous.lastReconciledAt === null || validDate(previous.lastReconciledAt)), 'Invalid successful cursor or reconciliation date');
    assert(!previous.cursor || to >= previous.cursor, 'Scan date cannot precede the successful cursor');
    const queryDigest = hash({ query: profile.query, provider: provider.version });
    const reconciliationAnchor = previous.lastReconciledAt ?? previous.firstScanAt ?? previous.cursor;
    const full = reconcile || (previous.queryDigest && previous.queryDigest !== queryDigest) || (reconciliationAnchor && reconciliationAnchor <= daysBefore(to, profile.reconciliationDays));
    const window = { from: from ?? daysBefore(previous.cursor ?? to, profile.overlapDays), to, reconcile: Boolean(full) };
    const queries = scanQueries(profile, { ...window, known: [...previous.papers, { identifiers: knownIdentifiers }] });
    const responses = [];
    // Fetch the whole run before mutating the retrieval state or cursor.
    for (const query of queries) responses.push({ ...query, records: await provider.search(query.query) });
    const { papers, changes } = mergePapers(previous.papers, responses.flatMap(item => item.records), to);
    const payload = { version: 1, diseaseId: profile.id, queryDigest, provider: provider.version, window, responses };
    const runId = `scan-${hash({ diseaseId: profile.id, queryDigest, window, papers: papers.map(scientificContent) }).slice(0, 24)}`, runDirectory = join(directory, 'scans', runId);
    const reportPath = join(runDirectory, 'report.json');
    const nextState = { version: 1, diseaseId: profile.id, queryDigest, cursor: to, firstScanAt: previous.firstScanAt ?? previous.cursor ?? to, lastReconciledAt: full ? to : previous.lastReconciledAt, latestRunId: runId, papers };
    if (existsSync(reportPath)) { writeJSON(statePath, nextState); return { ...readJSON(reportPath), repeated: true }; }
    const report = { version: 1, runId, diseaseId: profile.id, trigger, provider: provider.version, window, queryDigest,
      responseDigest: hash(payload), retrievedCount: responses.reduce((sum, item) => sum + item.records.length, 0),
      uniqueCount: papers.length, changes, flaggedRecords: papers.filter(item => item.flags.length).map(item => ({ key: item.key, flags: item.flags })),
      publicationChanged: false, reviewRequired: true };
    writeImmutableJSON(join(runDirectory, 'responses.json'), payload);
    writeImmutableJSON(join(runDirectory, 'papers.json'), papers);
    mkdirSync(runDirectory, { recursive: true });
    const markdown = `# ${profile.label}: literature scan\n\nRun: ${runId}\n\nWindow: ${window.from} through ${to}${full ? ' (broad reconciliation)' : ''}. Provider: ${provider.version}.\n\nRetrieved ${report.retrievedCount} results; ${papers.length} unique records. ${changes.length} new or updated records.\n\n${changes.map(item => `- ${item.key}: ${item.kind}${item.flags.length ? `; ${item.flags.join(', ')}` : ''}`).join('\n')}\n\nScientific review is required. This scan did not alter a candidate or public release.\n`;
    const markdownPath = join(runDirectory, 'report.md');
    if (existsSync(markdownPath)) assert(readFileSync(markdownPath, 'utf8') === markdown, 'Partial scan report differs');
    else writeFileSync(markdownPath, markdown, { flag: 'wx' });
    writeImmutableJSON(reportPath, report);
    writeJSON(statePath, nextState);
    return report;
  });
  writeImmutableJSON(join(directory, 'attempts', `${attempt.id}.json`), { ...attempt, finishedAt: new Date().toISOString(), status: 'succeeded', runId: result.runId });
  return result;
  } catch (error) {
    writeImmutableJSON(join(directory, 'attempts', `${attempt.id}.json`), { ...attempt, finishedAt: new Date().toISOString(), status: 'failed', error: error.message, cursorAdvanced: false, publicationChanged: false });
    throw error;
  }
}
