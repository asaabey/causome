import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { rmSync } from 'node:fs';
import { hash } from '../scripts/curation/io.mjs';
import { initializeDisease, listDiseases } from '../scripts/curation/diseases.mjs';
import { normalizePaper, europePMC, scanQueries } from '../scripts/curation/literature.mjs';
import { mergePapers, scanDisease } from '../scripts/curation/scan.mjs';
import { seedDisease } from '../scripts/curation/seed.mjs';
import { reconcileExtraction, releaseDiff, validateExtraction, resolveEntity } from '../scripts/curation/reconcile.mjs';
import { contentDigest, validatePreview } from '../scripts/validation.mjs';
import { evaluateExtraction, evaluateSearch } from '../scripts/curation/evaluate.mjs';
const profile = JSON.parse(readFileSync('knowledge/diseases/iga-nephropathy/disease.json'));
const input = JSON.parse(readFileSync('curation/examples/iga-first-map.json'));
const seed = () => seedDisease(profile, input);
const raw = (id = '100', extra = {}) => ({ id, source: 'MED', title: 'Synthetic test report', abstractText: 'A finding in cultured cells.', pubTypeList: { pubType: ['Journal Article'] }, ...extra });
const temporary = t => { const dir = mkdtempSync(join(tmpdir(), 'causome-curation-')); t.after(() => rmSync(dir, { recursive: true, force: true })); return dir; };
function extraFinding() {
  const { bundle, papers, extraction } = seed();
  const finding = extraction.findings.find(item => item.category === 'supporting');
  extraction.findings = [{ ...finding, id: 'new-qualifier', category: 'qualifying', text: `${finding.text} This is a synthetic test qualifier.`, distinctFindingRationale: 'Separate measured endpoint in the same report; test fixture only.' }];
  return { base: bundle, papers, extraction, cutoff: input.evidenceCutoff };
}

test('a new disease starts without copied claims or a publication pointer', t => {
  const dir = temporary(t);
  initializeDisease(dir, { ...profile, id: 'another-disease', previewCandidate: null });
  assert.equal(listDiseases(dir)[0].id, 'another-disease');
  assert.equal(existsSync(join(dir, 'another-disease', 'current.json')), false);
  assert.throws(() => initializeDisease(dir, { ...profile, id: '../escape' }), /safe disease slug/);
});
test('first maps retain inspected scope, stable identities, pending reviews and null scores', () => {
  const { bundle, papers } = seed();
  assert.equal(validatePreview(bundle).valid, true);
  assert.equal(bundle.entities.find(item => item.label === 'IL-6').id, 'entity-il6');
  assert(papers.every(item => /selected citation excerpt/.test(item.accessScope)));
  assert(bundle.claims.every(item => item.reviewDisposition.decision === 'pending_domain_review'));
  assert(bundle.assessments.every(item => item.mechanisticWeight === null));
  assert.equal(bundle.parentReleaseId, null);
});
test('first maps reject missing citations and association escalation', () => {
  const changed = structuredClone(input); changed.findings[0].quote = 'This passage does not exist';
  assert.throws(() => seedDisease(profile, changed), /passage/);
  changed.findings[0].quote = input.findings[0].quote; changed.findings[0].causalInterpretation = 'association';
  assert.throws(() => seedDisease(profile, changed), /association/);
});
test('persistent DOI and PMID aliases deduplicate, changed identifiers retain the original key', () => {
  const first = mergePapers([], [raw('100', { doi: 'https://doi.org/10.1000/TEST' })], '2026-10-09');
  const second = mergePapers(first.papers, [raw('100', { doi: '10.1000/test' })], '2026-10-10');
  assert.equal(second.papers.length, 1); assert.equal(second.changes.length, 0);
  assert.equal(second.papers[0].firstSeenAt, '2026-10-09'); assert.equal(second.papers[0].lastCheckedAt, '2026-10-10');
  const collision = mergePapers([], [raw('100', { doi: '10.1000/a' }), raw('101', { doi: '10.1000/b' })], '2026-10-09');
  assert.throws(() => mergePapers(collision.papers, [raw('100', { doi: '10.1000/b' })], '2026-10-10'), /collision/);
});
test('retraction notices flag their linked original and later metadata cannot silently clear flags', () => {
  const result = mergePapers([], [raw('100'), raw('101', { pubTypeList: { pubType: ['Retraction of Publication'] }, commentCorrectionList: { commentCorrection: [{ type: 'Retracted article', id: '100', source: 'MED' }] } })], '2026-10-09');
  assert(result.papers.find(item => item.pmid === '100').flags.includes('retraction-linked'));
  const next = mergePapers(result.papers, [raw('100')], '2026-10-10');
  assert(next.papers.find(item => item.pmid === '100').flags.includes('retraction-linked'));
});
test('search includes overlapping indexed/updated records, notices and disease-independent known refresh', () => {
  const queries = scanQueries(profile, { from: '2026-09-10', to: '2026-10-10', known: [normalizePaper(raw())] });
  assert.match(queries[0].query, /CREATION_DATE.*UPDATE_DATE/); assert.match(queries[1].query, /Retraction/);
  assert.equal(queries[2].query, 'SRC:MED AND (EXT_ID:100)');
  assert.match(scanQueries(profile,{from:'2026-09-10',to:'2026-10-10',known:[normalizePaper(raw('100',{doi:'10.1234/test'}))]}).at(-1).query,/DOI:"10.1234\/test"/);
  assert(!scanQueries(profile, { from: '2026-09-10', to: '2026-10-10', reconcile: true })[0].query.includes('DATE:'));
});
test('provider retries transient errors, paginates completely and rejects an empty incomplete page', async () => {
  let calls = 0;
  const provider = europePMC({ sleep: async () => {}, fetchImpl: async url => { calls++; if (calls === 1) return { ok: false, status: 429 }; return { ok: true, json: async () => ({ hitCount: 2, resultList: { result: [raw(String(calls))] }, nextCursorMark: String(calls) }) }; } });
  assert.equal((await provider.search('test')).length, 2); assert.equal(calls, 3);
  const bad = europePMC({ fetchImpl: async () => ({ ok: true, json: async () => ({ hitCount: 2, resultList: { result: [] } }) }) });
  await assert.rejects(bad.search('test'), /Incomplete/);
  const oversized = europePMC({ maxRecords: 1, fetchImpl: async () => ({ ok: true, json: async () => ({ hitCount: 2, resultList: { result: [raw()] } }) }) });
  await assert.rejects(oversized.search('test'), /exceeds/);
});
test('failed runs preserve cursor and cache; identical runs are idempotent even with refresh queries', async t => {
  const directory = temporary(t), provider = { version: 'fixture-v1', search: async () => [raw()] };
  const first = await scanDisease({ profile, directory, provider, to: '2026-10-10' });
  const before = readFileSync(join(directory, 'state.json'));
  await assert.rejects(scanDisease({ profile, directory, provider: { ...provider, search: async () => { throw new Error('source outage'); } }, to: '2026-10-11' }), /outage/);
  assert.deepEqual(readFileSync(join(directory, 'state.json')), before);
  const repeat = await scanDisease({ profile, directory, provider, to: '2026-10-10' });
  assert.equal(repeat.runId, first.runId); assert.equal(repeat.repeated, true); assert.equal(repeat.publicationChanged, false);
  const changedQuery = await scanDisease({ profile: { ...profile, query: 'different query' }, directory, provider, to: '2026-10-11' });
  assert.equal(changedQuery.window.reconcile, true);
});
test('reconciliation binds a named base and immutable source, rejects extractor scores and stale content', () => {
  const args = extraFinding(); assert.deepEqual(validateExtraction(args.extraction, args.papers, args.base), []);
  args.extraction.findings[0].score = 90; assert.match(validateExtraction(args.extraction, args.papers, args.base).join(), /unsupported/); delete args.extraction.findings[0].score;
  args.papers[0].abstract += ' changed'; assert.match(validateExtraction(args.extraction, args.papers, args.base).join(), /changed source/);
  args.extraction.baseContentDigest = 'a'.repeat(64); assert.match(validateExtraction(args.extraction, args.papers, args.base).join(), /stale/);
});
test('new qualifying evidence preserves old claims, stages a complete diff and never advances publication', () => {
  const args = extraFinding(), original = structuredClone(args.base), result = reconcileExtraction(args);
  assert(result.candidate); assert.equal(result.publicationChanged, false); assert.equal(result.candidate.claims.length, original.claims.length + 1);
  assert.deepEqual(args.base, original); assert.equal(result.candidate.parentReleaseId, null);
  assert(releaseDiff(original, result.candidate).some(item => item.collection === 'claims' && item.kind === 'added'));
  assert(result.candidate.claims.every(item => item.reviewDisposition.decision === 'pending_domain_review'));
  assert.equal(reconcileExtraction(args).id, result.id);
});
test('missing checks, duplicated findings and flagged base sources require reconciliation without a ready candidate', () => {
  const args = extraFinding(); delete args.extraction.findings[0].sourceCheck;
  assert.equal(reconcileExtraction(args).candidate, null);
  const duplicate = seed(); duplicate.extraction.findings = [duplicate.extraction.findings[0]];
  assert.equal(reconcileExtraction({ base: duplicate.bundle, ...duplicate, cutoff: input.evidenceCutoff }).findings[0].outcome, 'duplicate');
  const flagged = extraFinding(); flagged.papers[0].flags = ['retracted']; flagged.extraction.findings[0].paperDigest = hash(flagged.papers[0]);
  assert.match(reconcileExtraction(flagged).warnings.join(), /flagged/);
});
test('synonym and external identity resolution requires a unique canonical match', () => {
  const { bundle } = seed(); assert.equal(resolveEntity('Gd-IgA1', bundle.entities), 'entity-gd-iga1');
  assert.throws(() => resolveEntity('unentered entity', bundle.entities), /Unresolved/);
  assert.throws(() => resolveEntity('IL-6', [...bundle.entities, { ...bundle.entities[0], id: 'duplicate' }]), /Ambiguous/);
});
function evaluationFixture() {
  const cases = Array.from({ length: 120 }, (_, i) => ({ id: `case-${i}`, studyFamilyId: `study-${i % 30}`, split: 'held-out', insufficientEvidence: i >= 100, category: i < 20 ? 'qualifying' : 'supporting', claim: { subjectId: 'a', objectId: 'b', predicate: i < 20 ? 'is_associated_with' : 'stimulates', polarity: i < 20 ? 'not_applicable' : 'positive', context: { diseaseId: 'synthetic' } } }));
  const reference = { version: 1, id: 'synthetic-test-only', synthetic: true, cases };
  const predictions = { version: 1, referenceId: reference.id, promptVersion: 'test', modelVersion: 'test', cases: cases.map(item => ({ id: item.id, abstained: item.insufficientEvidence, ...(item.insufficientEvidence ? {} : { claim: item.claim, category: item.category }) })) };
  const adjudication = { version: 1, predictionDigest: hash(predictions), reviewerId: 'synthetic-reviewer', reviewedAt: '2026-10-10', cases: cases.filter(item => !item.insufficientEvidence).map(item => ({ id: item.id, citationEntailed: true, unsupportedScoreChange: false })) };
  return { reference, predictions, adjudication };
}
test('held-out evaluator records denominators, missing outputs and leakages; synthetic data cannot launch', () => {
  const f = evaluationFixture(), pass = evaluateExtraction(f.reference, f.predictions, f.adjudication);
  assert.equal(pass.valid, true); assert.equal(pass.launchEligible, false); assert.deepEqual(pass.metrics.recall, { numerator: 100, denominator: 100, value: 1 });
  f.predictions.cases = f.predictions.cases.slice(1); f.adjudication.predictionDigest = hash(f.predictions);
  assert.equal(evaluateExtraction(f.reference, f.predictions, f.adjudication).metrics.recall.value, .99);
  f.reference.developmentStudyFamilies = ['study-1']; assert(evaluateExtraction(f.reference, f.predictions, f.adjudication).errors.some(item => /leakage/.test(item)));
});
test('association escalation, unadjudicated citations and a score change of zero fail evaluation', () => {
  const f = evaluationFixture(); f.predictions.cases[0].claim = { ...f.predictions.cases[0].claim, predicate: 'stimulates' }; f.predictions.cases[1].scoreChange = 0; f.adjudication.cases = f.adjudication.cases.slice(1); f.adjudication.predictionDigest = hash(f.predictions);
  const result = evaluateExtraction(f.reference, f.predictions, f.adjudication); assert.equal(result.valid, false); assert.equal(result.associationEscalations, 1); assert.equal(result.unsupportedScoreChanges, 1); assert(result.errors.some(item => /Missing entailment/.test(item)));
});
test('search evaluation requires labelled coverage and real data, with explicit recall and false positives', () => {
  const reference = { version: 1, id: 'test', synthetic: true, records: Array.from({ length: 60 }, (_, i) => ({ id: String(i), relevant: i < 30 })) };
  const result = evaluateSearch(reference, reference.records.map(item => item.id)); assert.equal(result.valid, true); assert.equal(result.launchEligible, false); assert.equal(result.falsePositives.length, 30);
  assert.equal(evaluateSearch(reference, ['0']).valid, false);
});

test('evaluation requires context correctness, association semantics and separate sufficient families', () => {
 const f=evaluationFixture();f.predictions.cases[0].claim={...f.predictions.cases[0].claim,subjectId:'b',objectId:'a'};f.adjudication.predictionDigest=hash(f.predictions);assert.equal(evaluateExtraction(f.reference,f.predictions,f.adjudication).metrics.recall.value,1);
 f.predictions.cases[30].claim={...f.predictions.cases[30].claim,context:{diseaseId:'different'}};f.predictions.cases[110].assessment={mechanisticWeight:0};f.adjudication.predictionDigest=hash(f.predictions);const result=evaluateExtraction(f.reference,f.predictions,f.adjudication);assert.equal(result.metrics.recall.value,.99);assert.equal(result.unsupportedScoreChanges,1);
 f.reference.cases.forEach((item,index)=>{item.studyFamilyId=index<100?`family-${index%29}`:`abstention-${index}`;});assert(evaluateExtraction(f.reference,f.predictions,f.adjudication).errors.some(item=>/30/.test(item)));
});
test('reconciliation resets review decisions, versions changed records and preserves same-day parent chronology', () => {
 const args=extraFinding();args.base.status='approved';args.base.createdAt=`${args.cutoff}T12:00:00.000Z`;
 args.base.claims.forEach(claim=>{claim.verification='reviewed';claim.reviewDisposition={decision:'accepted',reviewerId:'synthetic-reviewer',reviewedAt:args.cutoff};});args.base.manifest.contentDigest=contentDigest(args.base);args.extraction.baseContentDigest=args.base.manifest.contentDigest;
 const result=reconcileExtraction(args);assert(result.candidate);assert.equal(result.candidate.parentReleaseId,args.base.id);assert.equal(result.candidate.createdAt,args.base.createdAt);assert(result.candidate.claims.every(claim=>claim.reviewDisposition.decision==='pending_domain_review'));assert(result.candidate.claims.every(claim=>claim.revisionId!==args.base.claims.find(old=>old.id===claim.id)?.revisionId));
});

test('meta-analyses and systematic reviews remain discovery sources rather than primary claim evidence',()=>{
 assert(normalizePaper(raw('200',{title:'A systematic review and meta-analysis',pubTypeList:{pubType:['Meta-Analysis']}})).flags.includes('secondary-or-commentary'));
 const args=extraFinding();const finding=args.extraction.findings[0],paper=args.papers.find(item=>item.key===finding.paperKey);paper.flags.push('secondary-or-commentary');finding.paperDigest=hash(paper);assert(validateExtraction(args.extraction,args.papers,args.base).some(error=>/primary report/.test(error)));
});

test('updated correction flags become a reviewed diff while historical source metadata stays unchanged',()=>{
 const args=extraFinding(),finding=args.extraction.findings[0],paper=args.papers.find(item=>item.key===finding.paperKey);paper.flags.push('correction-linked');finding.paperDigest=hash(paper);const result=reconcileExtraction(args);assert(result.candidate);const source=result.candidate.sources.find(item=>item.identifiers.some(id=>paper.identifiers.includes(id)));assert(source.flags.includes('correction-linked'));assert.notEqual(source.revisionId,args.base.sources.find(item=>item.id===source.id).revisionId);assert(!args.base.sources.find(item=>item.id===source.id).flags.includes('correction-linked'));
});
