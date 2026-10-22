import fs from 'node:fs';
import path from 'node:path';
import {hash} from '../../../../scripts/curation/io.mjs';
import {sourceIdentifiers} from '../../../../scripts/curation/update.mjs';
import {releaseDiff} from '../../../../scripts/curation/reconcile.mjs';
const root='curation/workspace/maintenance/2026-10-21',cycle=path.join(root,fs.readdirSync(root)[0]);
const report=JSON.parse(fs.readFileSync(path.join(cycle,'report.json'))),notices=[],bindings=[],retrieval=[];
for(const r of report.results){
 const base=JSON.parse(fs.readFileSync(r.basePath));const profile=JSON.parse(fs.readFileSync(`knowledge/diseases/${r.diseaseId}/disease.json`));const final=JSON.parse(fs.readFileSync(`knowledge/diseases/${r.diseaseId}/candidates/${profile.previewCandidate}.json`));
 const known=new Set(base.sources.flatMap(sourceIdentifiers));const packet=JSON.parse(fs.readFileSync(r.packet));
 for(const {paper} of packet.changes.filter(c=>c.paper.flags.some(f=>/retract|concern|correction/.test(f)))){
  const affectedIdentifiers=[...paper.identifiers,...paper.relatedRecords.flatMap(x=>[`${x.source}:${x.id}`,...(x.source==='MED'?[`PMID:${x.id}`]:[])])];
  notices.push({diseaseId:r.diseaseId,key:paper.key,sourceContentHash:hash(paper),identifiers:paper.identifiers,title:paper.title,flags:paper.flags,relatedRecords:paper.relatedRecords,matchesBase:affectedIdentifiers.some(i=>known.has(i)),baseClaimIds:r.affectedClaimIds,disposition:'Quarantined for notice/original-source review; no positive finding imported from this record.'});
 }
 const changed=base.id!==final.id;const ratings=changed?base.assessments.map(a=>{const n=final.assessments.find(x=>x.id===a.id);return n&&JSON.stringify([a.mechanisticWeight,a.evidenceConfidence,a.therapeuticLeverage])!==JSON.stringify([n.mechanisticWeight,n.evidenceConfidence,n.therapeuticLeverage])?{assessmentId:a.id,before:{weight:a.mechanisticWeight,confidence:a.evidenceConfidence,leverage:a.therapeuticLeverage},after:{weight:n.mechanisticWeight,confidence:n.evidenceConfidence,leverage:n.therapeuticLeverage}}:null;}).filter(Boolean):[];
 bindings.push({diseaseId:r.diseaseId,basePath:r.basePath,baseId:base.id,baseDigest:base.manifest.contentDigest,finalPath:`knowledge/diseases/${r.diseaseId}/candidates/${final.id}.json`,finalId:final.id,finalDigest:final.manifest.contentDigest,changed,entityCount:final.entities.length,relationshipCount:final.relationships.length,claimCount:final.claims.length,sourceCount:final.sources.length,addedEntities:final.entities.filter(x=>!base.entities.some(y=>x.id===y.id)).map(x=>x.id),addedClaims:final.claims.filter(x=>!base.claims.some(y=>x.id===y.id)).map(x=>x.id),ratingChanges:ratings,defaultViewEntityCount:final.mapViews[0].entityIds.length,totalViewEntityCount:new Set(final.mapViews.flatMap(v=>v.entityIds)).size,summary:final.scientificSummary,views:final.mapViews.map(v=>({id:v.id,contextId:v.contextId,entityCount:v.entityIds.length}))});
 if(changed)fs.writeFileSync(path.join(cycle,`${r.diseaseId}-final-diff.json`),JSON.stringify(releaseDiff(base,final),null,2)+'\n');
 const scan=JSON.parse(fs.readFileSync(path.join(path.dirname(r.scanReport),'responses.json')));
 retrieval.push({...r,actualQueries:scan.responses.map(x=>({kind:x.kind,query:x.query,recordCount:x.records.length})),rawResponsesWorkspaceOnly:path.join(path.dirname(r.scanReport),'responses.json')});
}
fs.writeFileSync(path.join(cycle,'source-notice-audit.json'),JSON.stringify(notices,null,2)+'\n');
fs.writeFileSync(path.join(cycle,'candidate-bindings.json'),JSON.stringify(bindings,null,2)+'\n');
fs.writeFileSync(path.join(cycle,'retrieval-index.json'),JSON.stringify(retrieval,null,2)+'\n');
console.log(JSON.stringify({notices:notices.length,noticeMatchesBase:notices.filter(x=>x.matchesBase).length,changed:bindings.filter(x=>x.changed).map(x=>({diseaseId:x.diseaseId,ratingChanges:x.ratingChanges.length,entities:x.entityCount,claims:x.claimCount}))},null,2));
