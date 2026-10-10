import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sharedPathways, versionChanges } from '../web/src/lib/comparison.ts';
const seed = JSON.parse(readFileSync('knowledge/diseases/iga-nephropathy/candidates/iga-nephropathy-candidate-001.json'));
test('shared symmetric associations match reversed external identities without swapping directed claims', () => {
  const left = structuredClone(seed), right = structuredClone(seed);
  left.entities = left.entities.slice(0, 2); right.entities = right.entities.slice(0, 2);
  left.entities.forEach((entity,index) => { entity.externalIds = [{ namespace: 'test', value: String(index) }]; right.entities[index].externalIds = entity.externalIds; right.entities[index].id = `other-${index}`; });
  left.relationships = [{ id:'left', sourceId:left.entities[0].id, targetId:left.entities[1].id, predicate:'is_associated_with', directionality:'symmetric', polarity:'not_applicable' }];
  right.relationships = [{ ...left.relationships[0], id:'right', sourceId:'other-1', targetId:'other-0' }];
  const comparison = sharedPathways(left,right); assert.equal(comparison.shared.length,2); assert.equal(comparison.sharedRelationships.length,1);
  for(const bundle of [left,right]) Object.assign(bundle.relationships[0],{predicate:'stimulates',directionality:'directed',polarity:'positive'});
  assert.equal(sharedPathways(left,right).sharedRelationships.length,0);
});
test('label coincidence and ambiguous ontology matches cannot establish shared biological identity', () => {
  const left=structuredClone(seed),right=structuredClone(seed);right.entities.forEach(entity=>{entity.id=`other-${entity.id}`;entity.externalIds=[];});
  assert.equal(sharedPathways(left,right).shared.length,0);
  right.entities[0].id=left.entities[0].id;right.entities.push({...right.entities[0],id:'ambiguous',externalIds:[{namespace:'test',value:'same'}]});left.entities[0].externalIds=[{namespace:'test',value:'same'}];
  assert(!sharedPathways(left,right).shared.some(pair=>pair.left.id===left.entities[0].id));
});
test('version diffs distinguish zero, null and source/view changes without changing either snapshot', () => {
  const before=structuredClone(seed),after=structuredClone(seed);after.assessments[0].mechanisticWeight=0;after.sources[0].accessScope+=' Test';after.mapViews[0].label+=' Test';
  const original=JSON.stringify(before),changes=versionChanges(before,after);
  for(const collection of ['assessments','sources','mapViews'])assert(changes.some(item=>item.collection===collection&&item.kind==='changed'));
  assert.equal(JSON.stringify(before),original);
});
