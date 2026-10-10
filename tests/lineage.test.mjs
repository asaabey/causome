import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync,writeFileSync,mkdtempSync,rmSync,existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { collections,contentDigest } from '../scripts/validation.mjs';
import { reviewBinding } from '../scripts/github-approval.mjs';
import { storeRootRelease,storeSuccessorRelease,loadPublishedRelease,loadHistoricalRelease,listPublishedReleases } from '../scripts/release-store.mjs';
const seed=JSON.parse(readFileSync('knowledge/diseases/iga-nephropathy/candidates/iga-nephropathy-candidate-001.json'));
const temporary=t=>{const directory=mkdtempSync(join(tmpdir(),'causome-lineage-'));t.after(()=>rmSync(directory,{recursive:true,force:true}));return directory;};
function reviewed(id,parent=null) { const bundle=structuredClone(seed);bundle.id=id;bundle.revisionId=`${id}-r1`;bundle.status='approved';bundle.parentReleaseId=parent?.id??null;bundle.parentContentDigest=parent?.manifest.contentDigest??null;for(const key of collections)for(const record of bundle[key])record.status='approved';for(const claim of bundle.claims){claim.verification='reviewed';claim.reviewDisposition={decision:'accepted',reviewerId:'synthetic-reviewer',reviewedAt:'2026-10-10'};}bundle.manifest.contentDigest=contentDigest(bundle);return bundle; }
const receipt=bundle=>({version:1,frontendCommit:'a'.repeat(40),reviewedCommit:'b'.repeat(40),policyDigest:'c'.repeat(64),approvals:[{reviewerId:42}],...reviewBinding(bundle)});
test('arbitrary disease successors preserve original snapshot and receipt bytes',t=>{
 const dir=temporary(t),root=reviewed('iga-root-test'),next=reviewed('iga-next-test',root);storeRootRelease(dir,root,receipt(root));const original=readFileSync(join(dir,'releases',`${root.id}.json`)),approval=readFileSync(join(dir,'releases',`${root.id}.approval.json`));storeSuccessorRelease(dir,next,receipt(next));assert.equal(loadPublishedRelease(dir).bundle.id,next.id);assert.equal(listPublishedReleases(dir).length,2);assert.deepEqual(loadHistoricalRelease(dir,root.id).bundle,root);assert.deepEqual(readFileSync(join(dir,'releases',`${root.id}.json`)),original);assert.deepEqual(readFileSync(join(dir,'releases',`${root.id}.approval.json`)),approval);
});
test('stale bases, other diseases and overwrite attempts leave the current pointer intact',t=>{
 const dir=temporary(t),root=reviewed('iga-root-test'),next=reviewed('iga-next-test',root);storeRootRelease(dir,root,receipt(root));storeSuccessorRelease(dir,next,receipt(next));const pointer=readFileSync(join(dir,'current.json'));const stale=reviewed('iga-stale-test',root);assert.throws(()=>storeSuccessorRelease(dir,stale,receipt(stale)),/Stale/);assert.equal(existsSync(join(dir,'releases',`${stale.id}.json`)),false);const foreign=reviewed('other-next-test',next);foreign.diseaseId='other-disease';foreign.contexts.forEach(item=>item.diseaseId='other-disease');foreign.manifest.contentDigest=contentDigest(foreign);assert.throws(()=>storeSuccessorRelease(dir,foreign,receipt(foreign)),/Stale/);assert.throws(()=>storeSuccessorRelease(dir,next,receipt(next)),/Stale|EEXIST/);assert.deepEqual(readFileSync(join(dir,'current.json')),pointer);
});
test('changed parents, missing ancestors, cycles and changed receipts fail historical routing',t=>{
 const dir=temporary(t),root=reviewed('iga-root-test'),next=reviewed('iga-next-test',root);storeRootRelease(dir,root,receipt(root));storeSuccessorRelease(dir,next,receipt(next));const path=join(dir,'releases',`${next.id}.json`);next.parentContentDigest='d'.repeat(64);next.manifest.contentDigest=contentDigest(next);writeFileSync(path,JSON.stringify(next));writeFileSync(join(dir,'releases',`${next.id}.approval.json`),JSON.stringify(receipt(next)));assert.throws(()=>loadPublishedRelease(dir),/lineage/);assert.throws(()=>loadHistoricalRelease(dir,'../escape'),/Invalid/);
});
test('content reversions require a newly reviewed successor and preserve the current parent',t=>{
 const dir=temporary(t),root=reviewed('iga-root-test'),next=reviewed('iga-next-test',root);next.entities[0].label='Synthetic changed label';next.entities[0].revisionId+='-next';next.manifest.contentDigest=contentDigest(next);storeRootRelease(dir,root,receipt(root));storeSuccessorRelease(dir,next,receipt(next));
 const reverted=reviewed('iga-reverted-test',next);reverted.entities[0].revisionId=next.entities[0].revisionId;reverted.manifest.contentDigest=contentDigest(reverted);assert.throws(()=>storeSuccessorRelease(dir,reverted,receipt(reverted)),/revision ID/);assert.equal(loadPublishedRelease(dir).bundle.id,next.id);
 reverted.entities[0].revisionId+='-reverted';reverted.manifest.contentDigest=contentDigest(reverted);storeSuccessorRelease(dir,reverted,receipt(reverted));assert.equal(loadPublishedRelease(dir).bundle.id,reverted.id);assert.equal(reverted.parentReleaseId,next.id);assert.equal(loadHistoricalRelease(dir,next.id).bundle.entities[0].label,'Synthetic changed label');
});
