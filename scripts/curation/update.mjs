import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { contentDigest, validatePreview } from '../validation.mjs';
import { listDiseases } from './diseases.mjs';
import { assert, readJSON, validDate, writeImmutableJSON } from './io.mjs';
import { europePMC } from './literature.mjs';
import { scanDisease } from './scan.mjs';

export const sourceIdentifiers = source => [...new Set([
  ...(source.identifiers ?? []), source.studyId,
  ...(source.url?.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/)?.slice(1).map(id => `PMID:${id}`) ?? []),
].filter(Boolean))];

/** Retrieve update packets against the selected local maps; never author science. */
export async function updateDiseases({ root = 'knowledge/diseases', workspace = 'curation/workspace',
  to = new Date().toISOString().slice(0, 10), disease, plan = false, provider = europePMC() } = {}) {
  assert(validDate(to), 'Invalid maintenance cutoff');
  const profiles = listDiseases(root);
  assert(!disease || profiles.some(item => item.id === disease), 'Unknown maintenance disease');
  const selected = profiles.filter(item => !disease || item.id === disease);
  const cycleId = `update-${to}-${randomUUID()}`;
  const directory = join(workspace, 'maintenance', to, cycleId);
  const results = [];
  if (!plan) mkdirSync(directory, { recursive: true });
  for (const profile of selected) {
    if (!profile.previewCandidate) { results.push({ diseaseId: profile.id, status: 'needs_initial_map' }); continue; }
    try {
      const basePath = join(root, profile.id, 'candidates', `${profile.previewCandidate}.json`), base = readJSON(basePath);
      const validation = validatePreview(base);
      assert(validation.valid && base.diseaseId === profile.id && base.id === profile.previewCandidate && !base.illustrative,
        `Invalid selected scientific base: ${validation.errors.join('; ')}`);
      assert(to >= base.evidenceCutoff, 'Maintenance cutoff precedes the selected map');
      const scanDirectory = join(workspace, profile.id), statePath = join(scanDirectory, 'state.json');
      const state = existsSync(statePath) ? readJSON(statePath) : null;
      assert(!state || state.diseaseId === profile.id && state.version === 1 && (state.cursor === null || validDate(state.cursor)), 'Invalid scan state');
      assert(!state?.cursor || to >= state.cursor, 'Maintenance cutoff precedes the successful cursor');
      const binding = { diseaseId: profile.id, basePath, baseReleaseId: base.id, baseContentDigest: contentDigest(base),
        evidenceCutoff: base.evidenceCutoff, successfulCursor: state?.cursor ?? null,
        firstScanFrom: state?.cursor ? null : base.evidenceCutoff };
      if (plan) { results.push({ ...binding, status: 'planned' }); continue; }
      const known = new Set(base.sources.flatMap(sourceIdentifiers));
      const scan = await scanDisease({ profile, directory: scanDirectory, provider, knownIdentifiers: [...known], to,
        ...(!state?.cursor ? { from: base.evidenceCutoff } : {}) });
      const sourceDirectory = join(scanDirectory, 'scans', scan.runId), papers = readJSON(join(sourceDirectory, 'papers.json'));
      const byKey = new Map(papers.map(paper => [paper.key, paper]));
      // Initial known-source refreshes establish metadata, rather than pretending
      // already-curated publications are newly discovered scientific evidence.
      const refreshes = [], changes = [];
      for (const change of scan.changes) {
        const paper = byKey.get(change.key); assert(paper, 'Scan change has no source snapshot');
        const knownSource = paper.identifiers.some(id => known.has(id));
        if (change.kind === 'new' && knownSource && paper.flags.length === 0) refreshes.push(paper);
        else changes.push({ ...change, knownSource, paper });
      }
      const affectedClaimIds = [...new Set(changes.filter(item => item.knownSource).flatMap(({ paper }) => {
        const ids = new Set(base.sources.filter(source => sourceIdentifiers(source).some(id => paper.identifiers.includes(id))).map(source => source.id));
        const evidenceIds = new Set(base.evidenceItems.filter(item => ids.has(item.sourceId)).map(item => item.id));
        return base.claims.filter(claim => claim.evidenceItemIds.some(id => evidenceIds.has(id))).map(claim => claim.id);
      }))];
      const packetDirectory = join(directory, profile.id);
      writeImmutableJSON(join(packetDirectory, 'papers.json'), changes.map(item => item.paper));
      writeImmutableJSON(join(packetDirectory, 'baseline-refreshes.json'), refreshes);
      const result = { ...binding, status: changes.length ? 'evidence_to_screen' : 'no_retrieval_changes',
        scanId: scan.runId, scanReport: join(sourceDirectory, 'report.json'), scanPapers: join(sourceDirectory, 'papers.json'),
        window: scan.window, newRecords: changes.filter(item => item.kind === 'new').length,
        updatedRecords: changes.filter(item => item.kind === 'updated').length, baselineRefreshes: refreshes.length,
        affectedClaimIds, packet: join(packetDirectory, 'update.json'), papers: join(packetDirectory, 'papers.json') };
      writeImmutableJSON(result.packet, { version: 1, ...result, changes, graphChanged: false,
        backlog: 'This packet contains this scan’s delta. Carry unresolved items from earlier maintenance reports.',
        processingComplete: false });
      results.push(result);
    } catch (error) { results.push({ diseaseId: profile.id, status: 'incomplete', error: error.message }); }
  }
  const report = { version: 1, cycleId: plan ? null : cycleId, searchedThrough: to, plan,
    graphChanged: false, results, complete: results.every(item => item.status !== 'incomplete'),
    ...(plan ? {} : { report: join(directory, 'report.json'), markdown: join(directory, 'report.md') }) };
  if (!plan) {
    writeImmutableJSON(report.report, report);
    const escape = text => String(text ?? '').replace(/[|\r\n]/g, ' ');
    writeFileSync(report.markdown, `# Disease maintenance: ${to}\n\nRetrieval cycle: ${cycleId}. Existing maps were preserved.\n\n| Disease | Retrieval outcome | New | Updated | Packet / error |\n| --- | --- | --- | --- | --- |\n${results.map(item => `| ${escape(item.diseaseId)} | ${item.status} | ${item.newRecords ?? '—'} | ${item.updatedRecords ?? '—'} | ${escape(item.packet ?? item.error ?? 'Initial curation needed')} |`).join('\n')}\n\nScreen the delta against each named base, carry unresolved earlier items forward, and reconcile meaningful findings using CURATION.md. No retrieval changes is not a scientific review verdict. Baseline refreshes establish metadata for already-curated sources; they are saved separately.\n`, { flag: 'wx' });
  }
  return report;
}
