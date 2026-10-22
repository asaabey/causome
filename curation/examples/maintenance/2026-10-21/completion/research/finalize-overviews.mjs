import fs from 'node:fs';
import {contentDigest} from '../../../../scripts/validation.mjs';
const dir='curation/workspace/maintenance-completion/2026-10-21';
for(const [s,suffix,positions]of[
 ['membranous-nephropathy','49b97ca92fc2',[['entity-mn-nell1',360,450],['entity-mn-epitope-spreading',740,-180],['entity-mn-igg1-3',1100,-180]]],
 ['minimal-change-nephropathy','2391a4e992e9',[['entity-hemopexin-activity',600,800]]]
]){
 const b=JSON.parse(fs.readFileSync(`knowledge/diseases/${s}/candidates/${s}-appraised-candidate-${suffix}.json`));
 b.id=`${s}-maintenance-overview-20261020`;b.revisionId=b.id+'-r1';b.changeSetRevision=b.id;
 b.releaseNote=s==='membranous-nephropathy'?'Local maintenance: antigen-subtype complement-deposition qualification; complete overview. Abstract-level observational evidence; domain review pending.':'Local maintenance: human hemopexin activity association in relapsing minimal change disease; complete human overview. No universal causal permeability factor asserted; domain review pending.';
 delete b.scientificSummary;
 const v=b.mapViews[0];v.revisionId=v.id+'-maintenance-20261020';v.entityIds=b.entities.map(e=>e.id);v.relationshipIds=b.relationships.filter(r=>r.contextId===v.contextId).map(r=>r.id);v.assessmentIds=b.assessments.filter(a=>a.contextId===v.contextId&&[...v.entityIds,...v.relationshipIds].includes(a.subjectId)).map(a=>a.id);
 const l=b.layouts.find(l=>l.id===v.layoutId);l.revisionId=l.id+'-maintenance-20261020';l.positions.push(...positions.map(([entityId,x,y])=>({entityId,x,y})));
 b.manifest.contentDigest=contentDigest(b);fs.writeFileSync(`${dir}/${s}-overview-proposal.json`,JSON.stringify(b,null,2)+'\n');
}
