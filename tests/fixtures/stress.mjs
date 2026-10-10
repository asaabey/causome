import {readFileSync,existsSync} from 'node:fs';
import {contentDigest,validatePreview} from '../../scripts/validation.mjs';
export function stressFixture(){
 const base=JSON.parse(readFileSync(`${existsSync('knowledge/diseases')?'knowledge':'../knowledge'}/diseases/sle/releases/sle-illustrative-001.json`));
 const bundle=structuredClone(base),identity=id=>({id,revisionId:`${id}-r1`,status:'candidate'}),contextId='context-synthetic-stress';
 Object.assign(bundle,{id:'synthetic-stress-200-400',revisionId:'synthetic-stress-200-400-r1',formatVersion:'0.3.0',diseaseId:'synthetic',title:'Synthetic graph benchmark',releaseNote:'Synthetic performance fixture only. No biological findings, source checks or scientific approval.',therapies:[],claims:[],relationships:[],assessments:[]});
 bundle.contexts=[{...base.contexts[0],...identity(contextId),diseaseId:'synthetic',label:'Synthetic performance context; not scientific evidence'}];
 const classes=['cytokine','cell','protein','gene','metabolite','pathogen','tissue','clinical_outcome','receptor','substrate'];
 bundle.entities=Array.from({length:200},(_,i)=>({...identity(`entity-stress-${String(i).padStart(3,'0')}`),label:`Synthetic mediator ${i}${i%17===0?' with a deliberately long label':''}`,synonyms:[],entityClass:classes[i%classes.length],description:'Synthetic renderer test. This represents no scientific assertion.',biologicalRoleClaimIds:[],externalIds:[]}));
 for(let i=0;i<400;i++){
  const a=bundle.entities[i%200],b=bundle.entities[(i%200+(i<200?1:13))%200];let sourceId=a.id,targetId=b.id;const symmetric=i>=200;
  if(symmetric&&sourceId>targetId)[sourceId,targetId]=[targetId,sourceId];
  const edgeId=`relationship-stress-${i}`,claimId=`claim-stress-${i}`,predicate=symmetric?'is_associated_with':'stimulates';
  bundle.claims.push({...base.claims[0],...identity(claimId),text:`Synthetic test relationship ${i}; not a biological finding.`,subjectId:sourceId,objectId:targetId,predicate,contextId,causalInterpretation:'illustrative'});
  bundle.relationships.push({...base.relationships[0],...identity(edgeId),sourceId,targetId,predicate,directionality:symmetric?'symmetric':'directed',polarity:symmetric?'not_applicable':'positive',contextId,assessmentId:`assessment-${edgeId}`,supportingClaimIds:[claimId],qualifyingClaimIds:[],contradictingClaimIds:[]});
  a.biologicalRoleClaimIds.push(claimId);b.biologicalRoleClaimIds.push(claimId);
 }
 for(const record of [...bundle.entities,...bundle.relationships])bundle.assessments.push({...base.assessments[0],...identity(`assessment-${record.id}`),subjectId:record.id,contextId,supportingClaimIds:record.biologicalRoleClaimIds??record.supportingClaimIds,qualifyingClaimIds:[],contradictingClaimIds:[]});
 const layoutId='layout-stress',allIds=bundle.entities.map(item=>item.id);
 bundle.layouts=[{...identity(layoutId),positions:allIds.map((entityId,i)=>({entityId,x:(i%10)*320,y:Math.floor(i/10)*230}))}];
 const group={id:'group-stress-research',label:'Additional synthetic mechanisms',entityIds:allIds.slice(40),collapsed:true};
 bundle.mapViews=[{...identity('view-stress-overview'),label:'Synthetic grouped overview',contextId,entityIds:allIds,relationshipIds:bundle.relationships.map(item=>item.id),assessmentIds:bundle.assessments.map(item=>item.id),layoutId,groups:[group]},{...identity('view-stress-expanded'),label:'Fully expanded stress graph',contextId,entityIds:allIds,relationshipIds:bundle.relationships.map(item=>item.id),assessmentIds:bundle.assessments.map(item=>item.id),layoutId}];
 bundle.manifest.schemaVersion='0.3.0';bundle.manifest.contentDigest=contentDigest(bundle);const result=validatePreview(bundle);if(!result.valid)throw new Error(result.errors.join('\n'));return bundle;
}
