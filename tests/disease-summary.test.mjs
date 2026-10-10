import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { summaryTemplate, attachSummary, summaryPacket, feedbackTemplate, recordSummaryFeedback } from '../scripts/curation/summary.mjs';
import { contentDigest, validatePreview, validatePublication } from '../scripts/validation.mjs';
import { assessCandidate } from '../scripts/curation/assessment.mjs';
import { automaticAssessmentWorksheet } from '../scripts/automatic-appraisal.mjs';
import { validateRevisionChanges } from '../scripts/curation/reconcile.mjs';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const base = read('knowledge/diseases/iga-nephropathy/candidates/iga-nephropathy-appraised-candidate-bf0656421814.json');
const input = summaryTemplate(base, 'Bounded IgA1 / mesangial culture mechanism');
const candidate = attachSummary(base, input);
const today = new Date().toISOString().slice(0, 10);
function feedback(bundle = candidate) {
  return { ...feedbackTemplate(bundle), tool: 'Synthetic external-tool fixture', recordedBy: 'test-fixture', checkedAt: today,
    literatureSearch: { performed: false, searchedThrough: null, coverage: 'No retrieval; synthetic test only.' },
    verdict: 'insufficient_evidence', explanation: 'Fixture has no literature search.', sourcesConsulted: [], report: 'Synthetic report, not a real scientific verdict.' };
}

test('summary candidates preserve the graph and appraisals, reproduce exactly and embed a portable bounded review block', () => {
  const before = JSON.stringify(base);
  assert.deepEqual(attachSummary(base, input), candidate);
  assert.equal(JSON.stringify(base), before);
  for (const key of ['entities','relationships','claims','assessments','therapies','sources','evidenceItems','contexts','layouts','mapViews']) assert.deepEqual(candidate[key], base[key]);
  assert.equal(validatePreview(candidate).valid, true);
  assert.deepEqual(validateRevisionChanges(base, candidate), []);
  const packet = summaryPacket(candidate);
  assert.equal(packet.contentDigest, candidate.manifest.contentDigest);
  assert.equal(packet.status, 'pending_external_review');
  assert.equal(packet.paragraphs.length, 2);
  assert(packet.reviewText.includes(candidate.manifest.contentDigest));
  assert(packet.reviewText.includes('Independently search current literature'));
  assert(packet.reviewText.includes('important unresolved debates'));
  assert(packet.sources.length > 0);
  assert(packet.paragraphs.every(paragraph => paragraph.claimIds.every(id => base.claims.some(claim => claim.id === id))));
});

test('summarizing a reviewed base resets dispositions with new record revisions and preserves parent lineage', () => {
  const reviewed = read('knowledge/diseases/iga-nephropathy/candidates/iga-nephropathy-candidate-2a8f21ad71cc.json'); reviewed.status = 'approved';
  for (const claim of reviewed.claims) { claim.verification = 'reviewed'; claim.reviewDisposition = { decision:'accepted', reviewerId:'synthetic-reviewer-fixture', reviewedAt:today }; }
  reviewed.manifest.contentDigest = contentDigest(reviewed);
  assert.equal(validatePreview(reviewed).valid, true);
  const next = attachSummary(reviewed, summaryTemplate(reviewed));
  assert.deepEqual(validateRevisionChanges(reviewed, next), []);
  assert.equal(next.parentReleaseId, reviewed.id); assert.equal(next.parentContentDigest, reviewed.manifest.contentDigest);
  assert(next.claims.every(claim => claim.reviewDisposition.decision === 'pending_domain_review'));
});

test('summary templates preserve existing authored paragraphs while requiring a new actual editor', () => {
  const template = summaryTemplate(candidate);
  assert.deepEqual(template.paragraphs, candidate.scientificSummary.paragraphs);
  assert.equal(template.baseReleaseId, candidate.id); assert.equal(template.authoredBy.id, '');
  assert.throws(() => attachSummary(candidate, template), /actual author/);
});

test('summary authoring rejects stale bases, unknown claims, oversized paragraphs and false system attribution', () => {
  for (const mutate of [value => value.baseContentDigest = '0'.repeat(64), value => value.paragraphs[0].claimIds = ['missing-claim'],
    value => value.paragraphs[0].text = 'word '.repeat(221), value => value.paragraphs[0].text += '\nExtra paragraph',
    value => value.paragraphs.push(value.paragraphs[0]), value => value.approved = true,
    value => value.paragraphs[0].text = 'An edited text pretending to be system-generated.']) {
    const edited = structuredClone(input); mutate(edited); assert.throws(() => attachSummary(base, edited));
  }
  const edited = structuredClone(input); edited.authoredBy = { id: 'actual-agent-fixture', kind: 'agent' };
  edited.paragraphs[0].text = 'This is an agent-authored synthesis fixture, awaiting scientific review.';
  assert.equal(validatePreview(attachSummary(base, edited)).valid, true);
});

test('summary checks invalidate changed graph, evidence cutoff and text even when the manifest is recomputed', () => {
  for (const mutate of [value => value.claims[0].text += ' Changed.', value => value.layouts[0].positions[0].x += 1,
    value => value.evidenceCutoff = '2026-10-09', value => value.scientificSummary.paragraphs[0].text += ' Changed.']) {
    const edited = structuredClone(candidate); mutate(edited); edited.manifest.contentDigest = contentDigest(edited);
    const validation = validatePreview(edited); assert.equal(validation.valid, false);
    assert(validation.errors.some(error => /summary|Summary/.test(error)));
  }
  const revised = structuredClone(candidate); revised.scientificSummary.scope += ' Changed scope.';
  assert(validateRevisionChanges(candidate, revised).some(error => /summary revision/.test(error)));
});

test('external feedback records are immutable snapshot receipts, do not edit data and never grant scientific approval', async () => {
  const before = JSON.stringify(candidate), report = feedback(), record = recordSummaryFeedback(candidate, report);
  assert.deepEqual(record, recordSummaryFeedback(candidate, report));
  assert.equal(JSON.stringify(candidate), before);
  assert.equal(record.status, 'recorded_external_feedback'); assert.equal(record.publicationChanged, false);
  assert.equal(candidate.scientificSummary.status, 'pending_external_review');
  const result = await validatePublication(candidate);
  assert.equal(result.valid, false); assert(result.errors.some(error => /Summary external feedback/.test(error)));
});

test('feedback cannot claim current consensus without search and citations, hide major issues, or cross snapshot bindings', () => {
  for (const key of ['candidateId','contentDigest','summaryRevisionId','summaryDigest','packetDigest']) {
    const report = feedback(); report[key] = 'incorrect'; assert.throws(() => recordSummaryFeedback(candidate, report), /stale/);
  }
  const report = feedback(); report.verdict = 'consistent_with_caveats';
  assert.throws(() => recordSummaryFeedback(candidate, report), /Without a literature search/);
  report.literatureSearch = { performed: true, searchedThrough: today, coverage: 'Synthetic search fixture.' };
  assert.throws(() => recordSummaryFeedback(candidate, report), /consulted sources/);
  report.sourcesConsulted = ['https://example.org/synthetic-reference'];
  assert.equal(recordSummaryFeedback(candidate, report).verdict, 'consistent_with_caveats');
  report.issues = [{ severity:'major', category:'omission', description:'Synthetic major omission.', suggestedCorrection:'Revise synthetic model.', sourceUrls:[] }];
  assert.throws(() => recordSummaryFeedback(candidate, report), /Major unresolved/);
  report.verdict = 'needs_revision'; assert.equal(recordSummaryFeedback(candidate, report).issues.length, 1);
  report.sourcesConsulted = ['javascript:alert(1)']; assert.throws(() => recordSummaryFeedback(candidate, report), /HTTP/);
});

test('reappraisal drops the old summary so a fresh packet is required and prior feedback becomes stale', () => {
  const appraised = assessCandidate(candidate, automaticAssessmentWorksheet(candidate));
  assert.equal(appraised.scientificSummary, undefined);
  const next = attachSummary(appraised, summaryTemplate(appraised));
  assert.notEqual(summaryPacket(next).packetDigest, summaryPacket(candidate).packetDigest);
  assert.throws(() => recordSummaryFeedback(next, feedback()), /stale/);
});

test('all authored local summaries reproduce from saved inputs, retain graph limits and link to actual candidate sources', () => {
  const examples = read('curation/examples/disease-summaries.json');
  assert.equal(Object.keys(examples.inputs).length, 5);
  for (const [slug, authored] of Object.entries(examples.inputs)) {
    const original = read(`knowledge/diseases/${slug}/candidates/${authored.baseReleaseId}.json`);
    const result = attachSummary(original, authored);
    assert.deepEqual(result, read(`knowledge/diseases/${slug}/candidates/${result.id}.json`));
    assert.equal(result.scientificSummary.authoredBy.kind, 'agent');
    assert.equal(result.scientificSummary.paragraphs.length, 2);
    assert(summaryPacket(result).sources.every(source => original.sources.some(item => item.id === source.id)));
    assert(!summaryPacket(result).reviewText.includes('Status: approved'));
  }
});

test('CLI seeds and selects summaries by default, exports packets, records feedback idempotently and rejects a changed snapshot', t => {
  const directory = mkdtempSync(join(tmpdir(), 'causome-summary-cli-')); t.after(() => rmSync(directory, { recursive: true, force: true }));
  const cli = resolve('scripts/curate.mjs'), run = (...args) => execFileSync(process.execPath, [cli, ...args], { cwd: directory, encoding: 'utf8', stdio: ['pipe','pipe','pipe'] });
  const slug = 'synthetic-summary-workflow';
  run('init','--id',slug,'--label','Synthetic summary test','--summary','Fixture only','--query','synthetic');
  const first = read('curation/examples/iga-first-map.json'); first.id = `${slug}-candidate-001`;
  const firstPath = join(directory, 'first.json'); writeFileSync(firstPath, JSON.stringify(first));
  assert.match(run('seed','--disease',slug,'--input',firstPath), /Overall summary candidate/);
  run('preview','--disease',slug,'--candidate',first.id);
  const profile = read(join(directory,'knowledge/diseases',slug,'disease.json'));
  const path = join(directory,'knowledge/diseases',slug,'candidates',`${profile.previewCandidate}.json`), current = read(path);
  assert(current.scientificSummary); assert(current.assessments.every(item => item.appraisalProvenance));
  const output = join(directory,'packet'); run('summary-packet','--base',path,'--output',output);
  assert.equal(read(join(output,'packet.json')).contentDigest, current.manifest.contentDigest);
  assert(readFileSync(join(output,'review.md'),'utf8').includes(current.scientificSummary.paragraphs[0].text));
  const report = feedback(current), reportPath = join(directory,'feedback.json'); writeFileSync(reportPath, JSON.stringify(report));
  const before = readFileSync(path); run('summary-feedback','--base',path,'--input',reportPath); run('summary-feedback','--base',path,'--input',reportPath);
  assert.deepEqual(readFileSync(path), before);
  assert.equal(readdirSync(join(directory,'knowledge/diseases',slug,'summary-reviews')).length, 1);
  const revised = summaryTemplate(current); revised.authoredBy = { id:'synthetic-editor', kind:'agent' }; revised.paragraphs[0].text += ' Synthetic revision.';
  const revisedPath = join(directory,'summary-input.json'); writeFileSync(revisedPath,JSON.stringify(revised));
  const nextOutput = run('summarize','--base',path,'--input',revisedPath), nextId = nextOutput.match(/Overall summary candidate: ([a-z0-9-]+)/)[1];
  assert.throws(() => run('summary-feedback','--base',join(directory,'knowledge/diseases',slug,'candidates',`${nextId}.json`),'--input',reportPath));
});
