import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assessCandidate, assessmentTemplate } from '../scripts/curation/assessment.mjs';
import { validateScoring, therapeuticAppraisal } from '../scripts/scoring.mjs';
import { contentDigest, validatePreview, validatePublication } from '../scripts/validation.mjs';
import { validateRevisionChanges, reconcileExtraction } from '../scripts/curation/reconcile.mjs';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const base = read('knowledge/diseases/sle/candidates/sle-curated-candidate-001.json');
const input = read('curation/examples/sle-provisional-appraisals.json');
const igaBase = read('knowledge/diseases/iga-nephropathy/candidates/iga-nephropathy-candidate-2a8f21ad71cc.json');
const igaInput = read('curation/examples/iga-nephropathy-provisional-appraisals.json');

test('explicit provisional appraisals populate both maps, reproduce selected snapshots and preserve their original bases', () => {
 for(const [b,i] of [[base,input],[igaBase,igaInput]]) {
  const before=JSON.stringify(b),candidate=assessCandidate(b,i);
  assert.equal(JSON.stringify(b),before);
  assert.equal(validatePreview(candidate).valid,true);
  assert.deepEqual(validateRevisionChanges(b,candidate),[]);
  assert(candidate.assessments.every(a=>a.mechanisticWeight!==null&&a.evidenceConfidence!==null&&a.metricStatus.therapeuticLeverage==='categorical'&&a.reviewerDecision===null));
  assert(candidate.assessments.every(a=>a.appraisalProvenance.assessorKind==='agent'));
  assert.deepEqual(candidate,read(`knowledge/diseases/${b.diseaseId}/candidates/${candidate.id}.json`));
  assert.deepEqual(candidate.claims,b.claims);
 }
 assert.equal(base.manifest.contentDigest,contentDigest(base));
});

test('a blank template has no assigned scores, and stale, duplicated or out-of-scope worksheets are rejected', () => {
 const blank=assessmentTemplate(base);assert(blank.assessments.every(a=>Object.values(a.weightComponents).every(c=>c.rating===null)&&a.evidenceConfidence===null));
 assert.throws(()=>assessCandidate(base,blank),/identified assessor/);
 assert.throws(()=>assessCandidate({...base,diseaseId:'../outside'},input),/safe slug/);
 let value=structuredClone(input);value.baseContentDigest='0'.repeat(64);assert.throws(()=>assessCandidate(base,value),/stale/);
 value=structuredClone(input);value.assessments.push(value.assessments[0]);assert.throws(()=>assessCandidate(base,value),/unique/);
 value=structuredClone(input);value.assessments[0].weightComponents.causalConfidence.claimIds=['claim-belimumab-trial'];assert.throws(()=>assessCandidate(base,value),/outside/);
 value=structuredClone(input);value.assessments[0].evidenceConfidence=4;assert.throws(()=>assessCandidate(base,value),/ceiling/);
});

test('provisional values cannot be presented as calibrated, independently reviewed or public', async () => {
 const c=assessCandidate(base,input);
 let value=structuredClone(c);value.scoringModels.find(m=>m.provisional).calibrated=true;assert(validateScoring(value).some(e=>e.includes('provisional model')));
 value=structuredClone(c);value.assessments[0].reviewerDecision='accepted';value.assessments[0].reviewerId='pretend';value.assessments[0].reviewedAt='2026-10-10';assert(validateScoring(value).some(e=>e.includes('cannot claim independent review')));
 value=structuredClone(c);value.status='approved';value.manifest.contentDigest=contentDigest(value);
 const result=await validatePublication(value,{verifyAuthenticatedApproval:async()=>true});assert.equal(result.valid,false);assert(result.errors.some(e=>e.includes('provisional')));
 value=structuredClone(c);delete value.assessments[0].appraisalProvenance;assert(validateScoring(value).some(e=>e.includes('calibrated model')));
});

test('therapy categories distinguish direct, indirect and endpoint coverage without inventing numerical leverage', () => {
 const c=assessCandidate(base,input);
 assert.equal(therapeuticAppraisal(c,'entity-baff').category,'approved_direct_target');
 assert.equal(therapeuticAppraisal(c,'entity-tlr7').category,'experimental_direct_target');
 assert.equal(therapeuticAppraisal(c,'entity-ifn').category,'indirect_intervention');
 assert.equal(therapeuticAppraisal(c,'entity-il6').category,'no_linked_intervention');
 assert.equal(therapeuticAppraisal(c,'relationship-ifn-baff').scope,'relationship_endpoints');
 let value=structuredClone(c);value.assessments[0].therapeuticAppraisal.category='no_linked_intervention';assert(validateScoring(value).some(e=>e.includes('frozen target')));
 value=structuredClone(c);value.assessments[0].therapeuticLeverage=80;assert(validateScoring(value).some(e=>e.includes('numerical therapeutic')));
});

test('evidence reconciliation invalidates prior scores rather than silently carrying them forward', () => {
 const b=assessCandidate(igaBase,igaInput),extraction=read('curation/examples/iga-qualification-extraction.json');
 extraction.baseReleaseId=b.id;extraction.baseContentDigest=contentDigest(b);
 // Existing qualifier is already present: change the bound source-checked finding text to add a fresh contextual qualification.
 extraction.findings[0].text += ' The result remains limited to the reported culture assay.';
 assert.throws(()=>reconcileExtraction({base:b,extraction,papers:read('curation/examples/iga-source-snapshots.json'),cutoff:b.evidenceCutoff}),/reused finding ID/);
 extraction.findings[0].id += '-new-test-qualification';
 const report=reconcileExtraction({base:b,extraction,papers:read('curation/examples/iga-source-snapshots.json'),cutoff:b.evidenceCutoff});
 assert(report.candidate);
 assert(report.candidate.assessments.every(a=>a.mechanisticWeight===null&&a.evidenceConfidence===null&&!a.appraisalProvenance&&!a.therapeuticAppraisal));
 assert(b.assessments.every(a=>a.mechanisticWeight!==null));
});
