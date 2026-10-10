import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculateWeight, confidenceCeiling, confidenceDimensions, weightComponents, evaluateCalibration, defaultRubric, validateScoring } from '../scripts/scoring.mjs';
const ratings = values => Object.fromEntries(weightComponents.map((key,i)=>[key,{ rating:values[i], rationale:'Synthetic test appraisal',claimIds:['claim-test'] }]));
function calibration() { return { modelRevisionId:'model-r1', reviewerIds:['one','two'],selectionRationale:'Synthetic representative coverage',limitations:'Test only',cases:Array.from({length:20},(_,i)=>({id:`case-${i}`,subjectId:`subject-${i}`,contextId:'context',category:['strong','weak','contradictory','missing'][i%4],rationale:'Synthetic test case',claimIds:[],ratings:{one:{...Object.fromEntries(weightComponents.map(key=>[key,i%4===3?null:2])),confidence:i%4===3?null:2},two:{...Object.fromEntries(weightComponents.map(key=>[key,i%4===3?null:3])),confidence:i%4===3?null:3}},adjudicated:{...Object.fromEntries(weightComponents.map(key=>[key,i%4===3?null:2])),confidence:i%4===3?null:2}})) }; }
const appraisal = () => ({dimensions:Object.fromEntries(confidenceDimensions.map(key=>[key,{rating:'adequate',rationale:'Synthetic test',claimIds:['claim-test']}])),predominantlyNonHuman:false,unresolvedMaterialContradiction:false,humanPrimaryGroups:['a','b'],humanDatasetFamilies:['a','b'],directFunctionalClaimIds:['functional'],humanCausalClaimIds:['causal-a','causal-b']});
test('weight uses all five components, preserves zero and null, rounds ties upward using raw tiers',()=>{
 assert.deepEqual(calculateWeight(ratings([0,0,0,0,0])),{raw:0,displayed:0,tier:0});
 assert.deepEqual(calculateWeight(ratings([4,4,4,4,4])),{raw:100,displayed:100,tier:4});
 assert.deepEqual(calculateWeight(ratings([null,4,4,4,4])),{raw:null,displayed:null,tier:null});
 assert.deepEqual(calculateWeight(ratings([2,0,0,0,0])),{raw:17.5,displayed:20,tier:0});
 assert.throws(()=>calculateWeight(ratings([5,0,0,0,0])),/integers/);
 assert(Object.values(defaultRubric.anchors).every(values=>values.length===5));
});
test('calibration requires independent reviewers, representative paired ratings and exact model revision',()=>{
 const value=calibration();assert.equal(evaluateCalibration(value,'model-r1').valid,true);
 assert.equal(evaluateCalibration(value,'other-r1').valid,false);value.reviewerIds=['one','one'];assert.equal(evaluateCalibration(value,'model-r1').valid,false);
});
test('null and numeric calibration pairs disagree; less than 80% fails with recorded denominators',()=>{
 const value=calibration();for(const sample of value.cases.slice(0,6))for(const key of [...weightComponents,'confidence'])sample.ratings.two[key]=null;
 const result=evaluateCalibration(value,'model-r1');assert.equal(result.total,120);assert.equal(result.agreement,.75);assert.equal(result.valid,false);
});
test('confidence ceilings preserve missing appraisals and non-human/quality/contradiction limits',()=>{
 const value=appraisal();assert.equal(confidenceCeiling(value),4);value.predominantlyNonHuman=true;assert.equal(confidenceCeiling(value),2);value.unresolvedMaterialContradiction=true;assert.equal(confidenceCeiling(value),1);value.dimensions.quality.rating='unknown';assert.equal(confidenceCeiling(value),null);
});
test('a score cannot be attached to an uncalibrated source-checked candidate',()=>{
 const bundle=JSON.parse(readFileSync('knowledge/diseases/sle/candidates/sle-curated-candidate-001.json'));bundle.assessments[0].mechanisticWeight=0;bundle.assessments[0].metricStatus.mechanisticWeight='assessed';
 assert(validateScoring(bundle).some(error=>/calibrated/.test(error)));assert(validateScoring(bundle).some(error=>/component/.test(error)));
});

test('entirely missing calibration ratings cannot qualify a numerical scoring model',()=>{
 const value=calibration();for(const sample of value.cases)for(const key of [...weightComponents,'confidence']){sample.ratings.one[key]=null;sample.ratings.two[key]=null;sample.adjudicated[key]=null;}assert.equal(evaluateCalibration(value,'model-r1').valid,false);
});
