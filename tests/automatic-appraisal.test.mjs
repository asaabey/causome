import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { autoAssessCandidate, assessCandidate } from '../scripts/curation/assessment.mjs';
import { automaticAssessmentWorksheet, assessmentClaimSets } from '../scripts/automatic-appraisal.mjs';
import { contentDigest, validatePreview, validatePublication } from '../scripts/validation.mjs';
import { validateRevisionChanges, reconcileExtraction } from '../scripts/curation/reconcile.mjs';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const base = read('knowledge/diseases/iga-nephropathy/candidates/iga-nephropathy-candidate-2a8f21ad71cc.json');
const options = { assessedAt: '2026-10-10' };
const revise = bundle => { bundle.manifest.contentDigest = contentDigest(bundle); return bundle; };

test('automatic appraisals are reproducible, contextual, linked to evidence and preserve the original bundle', () => {
  const before = JSON.stringify(base);
  const { candidate, input } = autoAssessCandidate(base, options);
  assert.equal(JSON.stringify(base), before);
  assert.deepEqual(candidate, autoAssessCandidate(base, options).candidate);
  assert.deepEqual(candidate, assessCandidate(base, input));
  assert.equal(validatePreview(candidate).valid, true);
  assert.deepEqual(validateRevisionChanges(base, candidate), []);
  assert.deepEqual(candidate.claims, base.claims);
  assert(candidate.assessments.every(item => item.mechanisticWeight !== null && item.evidenceConfidence === 1));
  assert(candidate.assessments.every(item => item.appraisalProvenance.method === 'rules' && item.appraisalProvenance.assessorKind === 'system'));
  assert(candidate.assessments.every(item => item.metricStatus.therapeuticLeverage === 'categorical' && item.therapeuticAppraisal.category === 'no_linked_intervention'));
});

test('qualifying controls cannot earn positive functional credit, and only supported context is appraised', () => {
  const subject = base.entities.find(item => item.label === 'IgA1-containing immune complexes').id;
  const a = base.assessments.find(item => item.subjectId === subject);
  const sets = assessmentClaimSets(base, a);
  const control = base.claims.find(item => item.text.startsWith('Uncomplexed IgA1'));
  assert(sets.qualifyingClaimIds.includes(control.id));
  assert(!sets.supportingClaimIds.includes(control.id));
  const input = automaticAssessmentWorksheet(base, options);
  assert(!input.assessments.find(item => item.assessmentId === a.id).confidenceAppraisal.directFunctionalClaimIds.includes(control.id));
  const sle = read('knowledge/diseases/sle/candidates/sle-curated-candidate-001.json');
  const { candidate } = autoAssessCandidate(sle, options);
  const overview = candidate.assessments.filter(item => item.contextId !== 'context-sle-treatment');
  assert(overview.every(item => !Object.values(item.weightComponents).some(component => component.claimIds.includes('claim-belimumab-trial'))));
  assert.equal(validatePreview(candidate).valid, true);
});

test('associations do not acquire causal or intervention credit, and citation volume does not establish independence', () => {
  const { input } = autoAssessCandidate(base, options);
  const association = base.relationships.find(item => item.predicate === 'is_associated_with');
  const row = input.assessments.find(item => item.assessmentId === association.assessmentId);
  assert.equal(row.weightComponents.causalConfidence.rating, 0);
  assert.equal(row.weightComponents.interventionalValidation.rating, 0);
  assert(input.assessments.every(item => item.weightComponents.independentReplication.rating === 0));
  const withGroups = structuredClone(base);
  withGroups.sources.forEach((source, index) => { source.researchGroupId = `synthetic-group-${index}`; source.datasetFamilyId = 'synthetic-shared-cohort'; });
  const shared = automaticAssessmentWorksheet(revise(withGroups), options);
  assert(shared.assessments.every(item => item.weightComponents.independentReplication.rating < 2));
});

test('adverse source notices remove positive support without turning missing evidence into a weight of zero', () => {
  const flagged = structuredClone(base);
  flagged.sources.forEach(source => source.flags = ['retracted']);
  revise(flagged);
  const input = automaticAssessmentWorksheet(flagged, options);
  assert(input.assessments.every(item => item.evidenceConfidence === 0));
  assert(input.assessments.every(item => item.confidenceAppraisal.unresolvedMaterialContradiction));
  assert(input.assessments.every(item => Object.values(item.weightComponents).every(component => component.rating === null)));
  // The existing integrity gate also blocks a candidate whose only positive
  // sources are retracted; automatic appraisal cannot bypass reconciliation.
  assert.throws(() => autoAssessCandidate(flagged, options), /Invalid appraisal base/);
});

test('automatic worksheets cannot be hand-edited to invent high confidence or human approval, and cannot publish', async () => {
  const { candidate, input } = autoAssessCandidate(base, options);
  const edited = structuredClone(input); edited.assessments[0].evidenceConfidence = 4;
  assert.throws(() => assessCandidate(base, edited), /reproduce/);
  const incorrectKind = structuredClone(input); incorrectKind.assessorKind = 'human';
  assert.throws(() => assessCandidate(base, incorrectKind), /reproduce/);
  const published = structuredClone(candidate); published.status = 'approved'; revise(published);
  const result = await validatePublication(published, { verifyAuthenticatedApproval: async () => true });
  assert.equal(result.valid, false);
  assert(result.errors.some(error => error.includes('provisional')));
});

test('CLI seeds, previews and reconciles a disease with automatic appraisals, frozen bases and saved input receipts', t => {
  const directory = mkdtempSync(join(tmpdir(), 'causome-auto-cli-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const cli = resolve('scripts/curate.mjs');
  const run = (...args) => execFileSync(process.execPath, [cli, ...args], { cwd: directory, encoding: 'utf8' });
  const slug = 'synthetic-auto-workflow';
  run('init', '--id', slug, '--label', 'Synthetic workflow test', '--summary', 'Fixture only', '--query', 'synthetic');
  const input = read('curation/examples/iga-first-map.json'); input.id = `${slug}-candidate-001`;
  const inputPath = join(directory, 'first-map.json'); writeFileSync(inputPath, JSON.stringify(input));
  const seeded = run('seed', '--disease', slug, '--input', inputPath);
  assert.match(seeded, /Automatic provisional appraisals:/);
  const candidateDirectory = join(directory, 'knowledge/diseases', slug, 'candidates');
  const originalPath = join(candidateDirectory, `${input.id}.json`);
  const original = readFileSync(originalPath);
  const selected = run('preview', '--disease', slug, '--candidate', input.id);
  const profile = read(join(directory, 'knowledge/diseases', slug, 'disease.json'));
  assert.match(selected, /summary-candidate/);
  const candidate = read(join(candidateDirectory, `${profile.previewCandidate}.json`));
  assert(candidate.assessments.every(item => item.mechanisticWeight !== null && item.evidenceConfidence !== null && item.therapeuticAppraisal));
  assert.deepEqual(readFileSync(originalPath), original);
  assert.equal(candidate.scientificSummary.status, 'pending_external_review');
  const appraisedBase = read(join(candidateDirectory, `${candidate.scientificSummary.baseReleaseId}.json`));
  const appraisalDirectory = join(directory, 'curation/workspace', slug, 'appraisals', appraisedBase.id);
  assert.equal(read(join(appraisalDirectory, 'result.json')).inputDigest, candidate.assessments[0].appraisalProvenance.inputDigest);
  assert.deepEqual(appraisedBase, assessCandidate(JSON.parse(original), read(join(appraisalDirectory, 'input.json'))));
  const seedInputs = join(directory, 'curation/workspace', slug, 'imports', readdirSync(join(directory, 'curation/workspace', slug, 'imports'))[0]);
  const extraction = read(join(seedInputs, 'extraction.json'));
  extraction.baseReleaseId = candidate.id; extraction.baseContentDigest = candidate.manifest.contentDigest;
  const finding = extraction.findings[0];
  extraction.findings = [{ ...finding, id: 'synthetic-qualification', category: 'qualifying', text: `${finding.text} Limited to this synthetic workflow test.`, distinctFindingRationale: 'Synthetic additional qualification.' }];
  const extractionPath = join(directory, 'extraction.json'); writeFileSync(extractionPath, JSON.stringify(extraction));
  const reconciled = run('reconcile', '--base', join(candidateDirectory, `${candidate.id}.json`), '--papers', join(seedInputs, 'papers.json'), '--extraction', extractionPath, '--cutoff', input.evidenceCutoff);
  assert.match(reconciled, /Automatic provisional appraisals:/);
  assert.deepEqual(readFileSync(originalPath), original);
  const appraised = readdirSync(candidateDirectory).filter(name => name.includes('appraised-candidate')).map(name => read(join(candidateDirectory, name)));
  assert.equal(appraised.length, 2);
  assert(appraised.every(bundle => bundle.assessments.every(item => item.appraisalProvenance?.method === 'rules')));
});
