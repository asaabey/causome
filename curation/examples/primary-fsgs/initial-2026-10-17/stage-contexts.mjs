import fs from 'node:fs';
import { contentDigest } from '../../../scripts/validation.mjs';
const dir='curation/workspace/primary-fsgs';
const b=JSON.parse(fs.readFileSync('knowledge/diseases/primary-fsgs/candidates/primary-fsgs-candidate-001.json'));
b.id='primary-fsgs-candidate-contexts-002';b.revisionId=b.id+'-r1';b.changeSetRevision='fsgs-study-contexts-v1';b.releaseNote='Separate study-context views for primary FSGS serum activity, human anti-nephrin findings, experimental immune injury, APOL1 ion transport, transgenic injury, inaxaplin trial and DUPLEX. No universal causal circuit or comprehensive therapy catalogue. Source checks are agent abstract inspections; independent scientific review pending.';
const specs=[
 ['serum','Primary FSGS: circulating activity and recurrence','Human serum / isolated glomerular assay','Recurrent primary FSGS','fsgs-serum-permeability fsgs-factor-recurrence'],
 ['nephrin','Human anti-nephrin evidence: conflicting cohorts','Human','Primary FSGS and explicitly mixed podocytopathy cohorts','fsgs-nephrin-fsgs fsgs-nephrin-china fsgs-nephrin-null'],
 ['immune','Immune experiments and biomarker limits','Human cultures; mouse immunization; human biopsy cohort','Selected experimental podocyte injury; MCD-like mouse model and mixed-FSGS biomarker qualification','fsgs-nephrin-binding fsgs-supar-culture fsgs-cd40-culture fsgs-supar-null'],
 ['apol1','APOL1: interferon and cation transport','Human cultured primary podocytes and HEK293 cells','Experimental APOL1 expression and channel inhibition','fsgs-ifng-current fsgs-apol1-current fsgs-inax-channel'],
 ['apol1-mouse','APOL1 G1: experimental podocyte injury','Transgenic mouse','IFNγ-induced APOL1 G1 injury','fsgs-current-injury'],
 ['inaxaplin','APOL1-associated FSGS: inaxaplin phase 2a','Human','Two APOL1 risk variants, biopsy-proven FSGS and proteinuria; uncontrolled 13-week trial','fsgs-inax-protein'],
 ['depletion','Final injury pathway: rat podocyte depletion','Transgenic rat','Toxin-induced podocyte depletion; not an initiating FSGS mechanism','fsgs-loss-sclerosis fsgs-loss-protein'],
 ['duplex','FSGS intervention: DUPLEX and endpoint limits','Human','FSGS without known secondary causes; genetic cases included; randomized active-controlled trial','fsgs-spar-protein fsgs-spar-egfr']
];
const ident=id=>({id,revisionId:id+'-contexts-v1',status:'candidate'});
b.contexts=[];b.assessments=[];b.mapViews=[];b.layouts=[];
const mapping=new Map();
for(const [key,label,organism,phenotype,ids] of specs){
 const contextId='context-fsgs-'+key;
 b.contexts.push({...ident(contextId),diseaseId:b.diseaseId,label,organism,phenotype,tissue:'Glomerulus / podocyte / circulation as specified per evidence item',stage:'Selected study-specific evidence; no transfer across systems'});
 for(const id of ids.split(' '))mapping.set('claim-'+id,contextId);
}
for(const c of b.claims){c.contextId=mapping.get(c.id);c.revisionId=c.id+'-contexts-v1';}
for(const r of b.relationships){const ids=[...r.supportingClaimIds,...r.qualifyingClaimIds,...r.contradictingClaimIds];r.contextId=mapping.get(ids[0]);if(ids.some(id=>mapping.get(id)!==r.contextId))throw Error('mixed edge');r.revisionId=r.id+'-contexts-v1';}
const assess=(subjectId,contextId,support=[],qualifying=[],contradicting=[])=>{
 const id='assessment-'+subjectId+'-'+contextId;
 b.assessments.push({...ident(id),subjectId,contextId,scoringModelId:b.scoringModels[0].id,metricStatus:{mechanisticWeight:'unassessed',evidenceConfidence:'unassessed',therapeuticLeverage:'unassessed'},mechanisticWeight:null,evidenceConfidence:null,therapeuticLeverage:null,supportingClaimIds:support,qualifyingClaimIds:qualifying,contradictingClaimIds:contradicting,rationale:'Context-specific source-checked candidate; quantitative appraisal and independent domain review pending.',reviewerDecision:null,reviewedAt:null});
 return id;
};
for(const c of b.contexts){
 const edges=b.relationships.filter(r=>r.contextId===c.id);
 const entityIds=[...new Set(edges.flatMap(r=>[r.sourceId,r.targetId]))];
 const aids=[];
 for(const r of edges){r.assessmentId=assess(r.id,c.id,r.supportingClaimIds,r.qualifyingClaimIds,r.contradictingClaimIds);aids.push(r.assessmentId);}
 for(const id of entityIds){
 const es=edges.filter(r=>r.sourceId===id||r.targetId===id);
 aids.push(assess(id,c.id,[...new Set(es.flatMap(r=>r.supportingClaimIds))],[...new Set(es.flatMap(r=>r.qualifyingClaimIds))],[...new Set(es.flatMap(r=>r.contradictingClaimIds))]));
 }
 const layoutId='layout-'+c.id;
 b.layouts.push({...ident(layoutId),positions:entityIds.map((entityId,i)=>({entityId,x:(i%3)*380+50,y:Math.floor(i/3)*260+50}))});
 b.mapViews.push({...ident('view-'+c.id),label:c.label,contextId:c.id,entityIds,relationshipIds:edges.map(r=>r.id),assessmentIds:aids,layoutId});
}
b.manifest.contentDigest=contentDigest(b);
fs.writeFileSync(dir+'/contexts-candidate.json',JSON.stringify(b,null,2)+'\n');
