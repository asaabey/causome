#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { contentDigest, validatePreview } from './validation.mjs';
import { defaultRubric, evaluateCalibration, weightComponents } from './scoring.mjs';
import { assert, hash, readJSON, safeSlug, validDate, writeImmutableJSON, writeJSON } from './curation/io.mjs';
import { initializeDisease, listDiseases, loadDisease } from './curation/diseases.mjs';
import { europePMC, normalizePaper } from './curation/literature.mjs';
import { scanDisease } from './curation/scan.mjs';
import { reconcileExtraction, releaseDiff, validateExtraction, validateRevisionChanges } from './curation/reconcile.mjs';
import { evaluateExtraction, evaluateSearch } from './curation/evaluate.mjs';
import { seedDisease } from './curation/seed.mjs';
import { assessmentTemplate, assessCandidate, autoAssessCandidate } from './curation/assessment.mjs';
import { loadPublishedRelease } from './release-store.mjs';
import { summaryTemplate, attachSummary, summaryPacket, feedbackTemplate, recordSummaryFeedback } from './curation/summary.mjs';

const root = resolve('knowledge/diseases');
const help = `Causome curation — candidates only; scientific publication is separate.

pnpm curate list
pnpm curate status --disease <slug>
pnpm curate init --id <slug> --label <name> --summary <scope> --query <Europe-PMC-query>
pnpm curate seed --disease <slug> --input <first-map.json>
pnpm curate scan --disease <slug> [--from YYYY-MM-DD] [--to YYYY-MM-DD] [--reconcile] [--trigger manual|scheduled]
pnpm curate import --disease <slug> --input <publication-metadata.json>
pnpm curate extract --base <bundle.json> --papers <papers.json> --output <extraction.json> [--paper-keys key1,key2] [--adapter <adapter.mjs>]
pnpm curate reconcile --base <bundle.json> --papers <papers.json> --extraction <extraction.json> --cutoff YYYY-MM-DD
pnpm curate propose --base <bundle.json> --candidate <bundle.json>
pnpm curate diff --before <bundle.json> --after <bundle.json> [--output <changes.json>]
pnpm curate preview --disease <slug> --candidate <candidate-id>
pnpm curate calibration-template --base <bundle.json> --output <calibration.json>
pnpm curate assessment-template --base <bundle.json> --output <appraisals.json>
pnpm curate assess --base <bundle.json> --input <appraisals.json>
pnpm curate auto-assess --base <bundle.json>
pnpm curate summary-template --base <bundle.json> --output <summary-input.json>
pnpm curate summarize --base <bundle.json> --input <summary-input.json>
pnpm curate summary-packet --base <bundle.json> [--output <directory>]
pnpm curate summary-feedback --base <bundle.json> --input <feedback.json>
pnpm curate calibrate --input <calibration.json> [--output <result.json>]
pnpm curate evaluate --reference <held-out.json> --predictions <predictions.json> --adjudication <review.json> --output <result.json>
pnpm curate evaluate-search --reference <search-labels.json> --input <retrieved-ids.json> --output <result.json>
pnpm curate schedule-ready --evaluation <result.json> --search-evaluation <result.json> --manual-review <scan-review.json>
`;

function parse(argv) {
  const [command = 'help', ...args] = argv, options = {};
  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    assert(/^--[a-z-]+$/.test(key) && !Object.hasOwn(options, key.slice(2)), `Invalid or duplicate option ${key}`);
    if (key === '--reconcile') options.reconcile = true;
    else { assert(args[index + 1] && !args[index + 1].startsWith('--'), `Missing value for ${key}`); options[key.slice(2)] = args[++index]; }
  }
  return { command, options };
}
const required = (options, key) => { assert(options[key], `Missing --${key}`); return options[key]; };
const bundleAt = path => { const bundle = readJSON(path), validation = validatePreview(bundle); assert(validation.valid, validation.errors.join('\n')); return bundle; };
function storeSummaryPacket(candidate, output) {
  const packet = summaryPacket(candidate), directory = output ?? join('curation/workspace', candidate.diseaseId, 'summary-reviews', packet.packetDigest);
  writeImmutableJSON(join(directory, 'packet.json'), packet);
  writeImmutableJSON(join(directory, 'feedback-template.json'), feedbackTemplate(candidate));
  const path = join(directory, 'review.md');
  if (existsSync(path)) assert(readFileSync(path, 'utf8') === packet.reviewText, 'Immutable summary review text differs');
  else writeFileSync(path, packet.reviewText, { flag: 'wx' });
  console.log(`Summary review packet: ${directory}`); return directory;
}
function storeSummaryCandidate(base, input) {
  if (!input && base.scientificSummary) { storeSummaryPacket(base); return base; }
  assert(!base.illustrative, 'Scientific summaries cannot be generated for an illustrative fixture');
  const profile = existsSync(join(root, base.diseaseId, 'disease.json')) ? loadDisease(root, base.diseaseId) : null;
  input ??= summaryTemplate(base, profile?.summary);
  const candidate = attachSummary(base, input), directory = join('curation/workspace', base.diseaseId, 'summaries', candidate.id);
  writeImmutableJSON(join(directory, 'input.json'), input);
  writeImmutableJSON(join(root, candidate.diseaseId, 'candidates', `${candidate.id}.json`), candidate);
  storeSummaryPacket(candidate);
  console.log(`Overall summary candidate: ${candidate.id}; current-literature review pending.`); return candidate;
}
function storeAutomaticAppraisal(base, { force = false } = {}) {
  // Preserve explicit editorial work and already generated drafts. Raw snapshots
  // remain immutable; every automatic appraisal gets its own candidate and inputs.
  if (!force && (base.illustrative || base.assessments.some(item => item.appraisalProvenance ||
      base.scoringModels.some(model => model.id === item.scoringModelId && model.calibrated) &&
      (item.mechanisticWeight !== null || item.evidenceConfidence !== null)))) return base;
  const { input, candidate } = autoAssessCandidate(base);
  const directory = join('curation/workspace', base.diseaseId, 'appraisals', candidate.id);
  writeImmutableJSON(join(directory, 'input.json'), input);
  writeImmutableJSON(join(directory, 'result.json'), { version: 1, rulesVersion: input.rulesVersion,
    baseReleaseId: base.id, baseContentDigest: contentDigest(base), candidateId: candidate.id,
    contentDigest: contentDigest(candidate), inputDigest: hash(input), assessmentCount: candidate.assessments.length,
    weightCount: candidate.assessments.filter(item => item.mechanisticWeight !== null).length,
    confidenceCount: candidate.assessments.filter(item => item.evidenceConfidence !== null).length,
    therapyCoverageCount: candidate.assessments.filter(item => item.therapeuticAppraisal).length,
    limitations: input.limitations, publicationChanged: false });
  writeImmutableJSON(join(root, candidate.diseaseId, 'candidates', `${candidate.id}.json`), candidate);
  console.log(`Automatic provisional appraisals: ${candidate.id}\nInputs and results: ${directory}\nSelect with curate preview --disease ${candidate.diseaseId} --candidate ${candidate.id}`);
  return candidate;
}
function storeProposal(report, base, inputs) {
  const directory = join('curation/workspace', report.diseaseId, 'proposals', report.id);
  if (inputs) {
    assert(hash(inputs.extraction) === report.extractionDigest && hash(inputs.papers) === report.sourceDigest, 'Proposal input binding differs');
    writeImmutableJSON(join(directory, 'extraction.json'), inputs.extraction);
    writeImmutableJSON(join(directory, 'papers.json'), inputs.papers);
  }
  writeImmutableJSON(join(directory, 'proposal.json'), report);
  const changes = report.candidate ? releaseDiff(base, report.candidate) : [];
  writeImmutableJSON(join(directory, 'changes.json'), changes);
  const markdown = `# ${report.diseaseId}: ${report.id}\n\nBase: ${base.id}\n\nBase digest: ${report.baseContentDigest}\n\nCandidate: ${report.candidate?.id ?? 'Not ready — source checks/reconciliation required'}\n\nPrompt: ${report.promptVersion ?? 'manual-bundle'}; model: ${report.modelVersion ?? 'manual'}.\n\n## Findings\n\n${report.findings.map(item => `- ${item.id}: ${item.outcome}${item.claimId ? `; ${item.claimId}` : ''}`).join('\n') || 'Manual candidate bundle; review the complete diff.'}\n\n## Pending source checks\n\n${report.pendingSourceChecks.join(', ') || 'None recorded'}\n\n## Warnings\n\n${report.warnings.join('\n') || 'Independent scientific review is still required.'}\n\n## Complete record diff\n\n${changes.map(item => `- ${item.collection}/${item.id}: ${item.kind}; ${item.fields.join(', ')}`).join('\n')}\n\nReview context, source entailment, direction, polarity, evidence category, study independence, therapy status, scores and every view change. Neither this report nor a JSON reviewer name authenticates approval. No public pointer was advanced.\n`;
  const reportPath = join(directory, 'review.md');
  if (existsSync(reportPath)) assert(readFileSync(reportPath, 'utf8') === markdown, 'Existing review report differs');
  else writeFileSync(reportPath, markdown, { flag: 'wx' });
  if (report.candidate) writeImmutableJSON(join(root, report.diseaseId, 'candidates', `${report.candidate.id}.json`), report.candidate);
  if (report.candidate) storeSummaryCandidate(storeAutomaticAppraisal(report.candidate));
  return directory;
}

export async function main(argv = process.argv.slice(2)) {
  const { command, options } = parse(argv);
  if (command === 'help' || command === '--help') { console.log(help); return; }
  const allowed = {
    list: [], status: ['disease'], init: ['id', 'label', 'summary', 'query'], seed: ['disease', 'input'], scan: ['disease', 'from', 'to', 'reconcile', 'trigger'], import: ['disease', 'input'],
    extract: ['base', 'papers', 'output', 'adapter', 'paper-keys'], reconcile: ['base', 'papers', 'extraction', 'cutoff'], propose: ['base', 'candidate'],
    diff: ['before', 'after', 'output'], preview: ['disease', 'candidate'], 'calibration-template': ['base', 'output'], calibrate: ['input', 'output'],
    'assessment-template': ['base', 'output'], assess: ['base', 'input'],
    'auto-assess': ['base'],
    'summary-template': ['base', 'output'], summarize: ['base', 'input'], 'summary-packet': ['base', 'output'], 'summary-feedback': ['base', 'input'],
    evaluate: ['reference', 'predictions', 'adjudication', 'output'], 'evaluate-search': ['reference', 'input', 'output'], 'schedule-ready': ['evaluation', 'search-evaluation', 'manual-review'],
  };
  assert(allowed[command] && Object.keys(options).every(key => allowed[command].includes(key)), `Unknown command or option.\n${help}`);
  switch (command) {
    case 'summary-template': {
      const base = bundleAt(required(options, 'base'));
      assert(!base.illustrative, 'Summary requires a scientific snapshot');
      const profile = existsSync(join(root, base.diseaseId, 'disease.json')) ? loadDisease(root, base.diseaseId) : null;
      writeImmutableJSON(required(options, 'output'), summaryTemplate(base, profile?.summary)); console.log(options.output); break;
    }
    case 'summarize': {
      storeSummaryCandidate(bundleAt(required(options, 'base')), readJSON(required(options, 'input'))); break;
    }
    case 'summary-packet': { storeSummaryPacket(bundleAt(required(options, 'base')), options.output); break; }
    case 'summary-feedback': {
      const base = bundleAt(required(options, 'base')), record = recordSummaryFeedback(base, readJSON(required(options, 'input')));
      const path = join(root, base.diseaseId, 'summary-reviews', `${record.id}.json`);
      writeImmutableJSON(path, record); console.log(`${path}\nExternal feedback recorded for this exact snapshot; summary, graph and publication status unchanged.`); break;
    }
    case 'auto-assess': {
      storeSummaryCandidate(storeAutomaticAppraisal(bundleAt(required(options, 'base')), { force: true })); break;
    }
    case 'assessment-template': {
      writeImmutableJSON(required(options, 'output'), assessmentTemplate(bundleAt(required(options, 'base')))); console.log(options.output); break;
    }
    case 'assess': {
      const candidate = assessCandidate(bundleAt(required(options, 'base')), readJSON(required(options, 'input')));
      const path = join(root, candidate.diseaseId, 'candidates', `${candidate.id}.json`);
      writeImmutableJSON(path, candidate); console.log(`${path}\nProvisional only. Select with curate preview; public pointer unchanged.`); break;
    }
    case 'list': console.log(JSON.stringify(listDiseases(root), null, 2)); break;
    case 'status': {
      const profile = loadDisease(root, required(options, 'disease')), directory = join('curation/workspace', profile.id), statePath = join(directory, 'state.json');
      const state = existsSync(statePath) ? readJSON(statePath) : null;
      const attemptDirectory = join(directory, 'attempts');
      const attempts = existsSync(attemptDirectory) ? readdirSync(attemptDirectory).filter(name => /^attempt-[a-z0-9-]+\.json$/.test(name)).map(name => readJSON(join(attemptDirectory, name))).sort((a, b) => b.startedAt.localeCompare(a.startedAt)) : [];
      const scheduled = attempts.filter(item => item.trigger === 'scheduled').slice(0, 12);
      console.log(JSON.stringify({ diseaseId: profile.id, previewCandidate: profile.previewCandidate, successfulCursor: state?.cursor ?? null, lastBroadReconciliation: state?.lastReconciledAt ?? null, cachedPapers: state?.papers.length ?? 0, latestAttempt: attempts[0] ?? null, scheduledWindow: { attempts: scheduled.length, successes: scheduled.filter(item => item.status === 'succeeded').length, rate: scheduled.length ? scheduled.filter(item => item.status === 'succeeded').length / scheduled.length : null, minimumWindowComplete: scheduled.length === 12 }, publicationChanged: false }, null, 2)); break;
    }
    case 'init': {
      const id = required(options, 'id');
      console.log(initializeDisease(root, { version: 1, id, label: required(options, 'label'), summary: required(options, 'summary'), query: required(options, 'query'), aliases: [], overlapDays: 30, reconciliationDays: 90, previewCandidate: null })); break;
    }
    case 'scan': {
      const profile = loadDisease(root, required(options, 'disease'));
      const directory = join(root, profile.id);
      const base = existsSync(join(directory, 'current.json')) ? loadPublishedRelease(directory).bundle : profile.previewCandidate ? bundleAt(join(directory, 'candidates', `${profile.previewCandidate}.json`)) : null;
      assert(!base || base.diseaseId === profile.id, 'Scan base belongs to another disease');
      const knownIdentifiers = base?.sources.flatMap(source => [...(source.identifiers ?? []), source.studyId, ...(source.url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/)?.slice(1).map(id => `PMID:${id}`) ?? [])].filter(Boolean)) ?? [];
      const result = await scanDisease({ profile, directory: join('curation/workspace', profile.id), provider: europePMC(), knownIdentifiers, ...options });
      console.log(JSON.stringify({ runId: result.runId, diseaseId: result.diseaseId, window: result.window, retrievedCount: result.retrievedCount, uniqueCount: result.uniqueCount, changes: result.changes.length, flaggedRecords: result.flaggedRecords.length, repeated: result.repeated ?? false, report: join('curation/workspace', profile.id, 'scans', result.runId, 'report.md'), papers: join('curation/workspace', profile.id, 'scans', result.runId, 'papers.json'), publicationChanged: false, reviewRequired: true }, null, 2)); break;
    }
    case 'seed': {
      const profile = loadDisease(root, required(options, 'disease')), result = seedDisease(profile, readJSON(required(options, 'input')));
      writeImmutableJSON(join(root, profile.id, 'candidates', `${result.bundle.id}.json`), result.bundle);
      const directory = join('curation/workspace', profile.id, 'imports', `seed-${result.bundle.changeSetRevision}`);
      writeImmutableJSON(join(directory, 'papers.json'), result.papers); writeImmutableJSON(join(directory, 'extraction.json'), result.extraction);
      console.log(`Seeded ${result.bundle.id}; inputs: ${directory}. Public pointer unchanged.`);
      storeSummaryCandidate(storeAutomaticAppraisal(result.bundle)); break;
    }
    case 'import': {
      const profile = loadDisease(root, required(options, 'disease')), input = readJSON(required(options, 'input'));
      assert(input.version === 1 && input.sourceKind === 'manual-import' && validDate(input.checkedAt) && Array.isArray(input.records), 'Manual import needs version 1, a checked date, sourceKind manual-import and publication records');
      const papers = input.records.map(normalizePaper).map(paper => ({ ...paper, firstSeenAt: input.checkedAt, lastCheckedAt: input.checkedAt, reviewedAt: null }));
      const directory = join('curation/workspace', profile.id, 'imports', `import-${hash(input).slice(0, 24)}`);
      writeImmutableJSON(join(directory, 'papers.json'), papers);
      writeImmutableJSON(join(directory, 'provenance.json'), { ...input, diseaseId: profile.id, coverage: 'Selected manually inspected reports; not a complete API search', cursorAdvanced: false });
      console.log(directory); break;
    }
    case 'extract': {
      const base = bundleAt(required(options, 'base'));
      let papers = readJSON(required(options, 'papers'));
      assert(Array.isArray(papers), 'Source snapshots must be a JSON array');
      if (options['paper-keys']) {
        const keys = options['paper-keys'].split(',');
        assert(new Set(keys).size === keys.length && keys.every(key => papers.some(paper => paper.key === key)), 'Selected paper keys must be unique and resolve in the source snapshots');
        papers = papers.filter(paper => keys.includes(paper.key));
      }
      let extraction = { version: 1, diseaseId: base.diseaseId, baseReleaseId: base.id, baseContentDigest: contentDigest(base), mode: 'manual', promptVersion: 'causome-extraction-v1', modelVersion: 'manual-source-check-v1', newEntities: [], findings: [] };
      if (options.adapter) {
        assert(papers.length > 0 && papers.length <= 20, 'Model extraction requires a bounded batch of 1–20 papers; use --paper-keys to select records');
        const prompt = readFileSync(new URL('../curation/prompts/extract-v1.md', import.meta.url), 'utf8');
        extraction.promptVersion = `causome-extraction-v1:${hash(prompt)}`;
        const request = { version: 1, prompt, promptDigest: hash(prompt), extractionTemplate: { ...extraction, mode: 'model' }, base, papers: papers.map(paper => ({ paperDigest: hash(paper), paper })) };
        extraction = JSON.parse(execFileSync(process.execPath, [resolve(options.adapter)], { input: JSON.stringify(request), encoding: 'utf8', maxBuffer: 5 * 1024 * 1024, timeout: 120_000 }));
        assert(extraction.promptVersion === request.extractionTemplate.promptVersion, 'Model output must retain the exact prompt version/digest');
        assert(extraction.mode === 'model' && extraction.findings.every(item => !item.sourceCheck), 'Model output cannot perform its own source or domain review');
      }
      const errors = validateExtraction(extraction, papers, base); assert(!errors.length, errors.join('\n'));
      writeImmutableJSON(required(options, 'output'), extraction); console.log(options.output); break;
    }
    case 'reconcile': {
      const base = bundleAt(required(options, 'base'));
      const inputs = { papers: readJSON(required(options, 'papers')), extraction: readJSON(required(options, 'extraction')) };
      const report = reconcileExtraction({ base, ...inputs, cutoff: required(options, 'cutoff') });
      console.log(storeProposal(report, base, inputs)); break;
    }
    case 'propose': {
      const base = bundleAt(required(options, 'base')), candidate = bundleAt(required(options, 'candidate'));
      assert(base.diseaseId === candidate.diseaseId && candidate.status === 'candidate' && candidate.id !== base.id, 'Proposal needs a distinct candidate for the same disease');
      assert(candidate.claims.every(claim => claim.verification === 'source_checked' && claim.reviewDisposition?.decision === 'pending_domain_review') && candidate.assessments.every(item => item.reviewerDecision === null && item.reviewedAt === null), 'New candidate proposals must reset source/domain and assessment review decisions');
      if (['approved', 'published'].includes(base.status)) assert(candidate.parentReleaseId === base.id && candidate.parentContentDigest === base.manifest.contentDigest, 'Candidate has a stale or incorrect public parent');
      const revisions = validateRevisionChanges(base, candidate); assert(!revisions.length, revisions.join('\n'));
      const binding = { baseReleaseId: base.id, baseContentDigest: base.manifest.contentDigest, candidateDigest: candidate.manifest.contentDigest };
      console.log(storeProposal({ version: 1, id: `proposal-${hash(binding).slice(0, 24)}`, diseaseId: base.diseaseId, ...binding, findings: [], pendingSourceChecks: [], warnings: [], candidate, publicationChanged: false, reviewRequired: true }, base)); break;
    }
    case 'diff': {
      const result = releaseDiff(bundleAt(required(options, 'before')), bundleAt(required(options, 'after')));
      if (options.output) writeImmutableJSON(options.output, result); else console.log(JSON.stringify(result, null, 2)); break;
    }
    case 'preview': {
      const profile = loadDisease(root, required(options, 'disease')), id = required(options, 'candidate'); assert(safeSlug(id), 'Invalid candidate ID');
      let candidate = bundleAt(join(root, profile.id, 'candidates', `${id}.json`)); assert(candidate.diseaseId === profile.id && !['approved', 'published'].includes(candidate.status), 'Preview selector requires this disease’s candidate');
      candidate = storeAutomaticAppraisal(candidate);
      if (!candidate.illustrative) candidate = storeSummaryCandidate(candidate);
      writeJSON(join(root, profile.id, 'disease.json'), { ...profile, previewCandidate: candidate.id }); console.log(`Preview selected ${candidate.id}; public pointer unchanged.`); break;
    }
    case 'calibration-template': {
      const base = bundleAt(required(options, 'base')), blank = Object.fromEntries([...weightComponents, 'confidence'].map(key => [key, null]));
      const cases = base.assessments.map((item, index) => ({ id: `case-${index + 1}`, subjectId: item.subjectId, contextId: item.contextId, category: '', claimIds: item.supportingClaimIds, ratings: { 'reviewer-a': blank, 'reviewer-b': blank }, adjudicated: blank, rationale: '' }));
      writeImmutableJSON(required(options, 'output'), { modelRevisionId: `${base.scoringModels[0].id}-calibration-r1`, rubric: defaultRubric, reviewerIds: ['reviewer-a', 'reviewer-b'], selectionRationale: '', limitations: '', cases }); console.log(options.output); break;
    }
    case 'calibrate': {
      const input = readJSON(required(options, 'input')), result = evaluateCalibration(input, input.modelRevisionId);
      if (options.output) writeJSON(options.output, result); console.log(JSON.stringify(result, null, 2)); if (!result.valid) process.exitCode = 1; break;
    }
    case 'evaluate': {
      const result = evaluateExtraction(readJSON(required(options, 'reference')), readJSON(required(options, 'predictions')), readJSON(required(options, 'adjudication')));
      writeJSON(required(options, 'output'), result); console.log(JSON.stringify(result, null, 2)); if (!result.valid) process.exitCode = 1; break;
    }
    case 'evaluate-search': {
      const result = evaluateSearch(readJSON(required(options, 'reference')), readJSON(required(options, 'input')));
      writeJSON(required(options, 'output'), result); console.log(JSON.stringify(result, null, 2)); if (!result.valid) process.exitCode = 1; break;
    }
    case 'schedule-ready': {
      const extraction = readJSON(required(options, 'evaluation')), search = readJSON(required(options, 'search-evaluation')), review = readJSON(required(options, 'manual-review'));
      assert(extraction.launchEligible && search.launchEligible && review.decision === 'accepted' && typeof review.reviewerId === 'string' && review.reviewerId.trim() && validDate(review.reviewedAt) && safeSlug(review.scanId) && review.extractionEvaluationDigest === hash(extraction) && review.searchEvaluationDigest === hash(search), 'Weekly scheduling remains gated on passing real held-out/search evaluations and a reviewed real-source manual scan');
      console.log('Acceptance records are complete. Configure the scheduler separately; scans only create review proposals.'); break;
    }
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
