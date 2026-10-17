import fs from 'node:fs';
import { contentDigest } from '../../../scripts/validation.mjs';
const dir='curation/workspace/primary-fsgs';
const b=JSON.parse(fs.readFileSync(dir+'/contexts-candidate.json'));
b.id='primary-fsgs-candidate-therapies-003';b.revisionId=b.id+'-r1';b.changeSetRevision='fsgs-therapy-contexts-v1';
b.releaseNote+=' Selected inaxaplin and sparsentan records added; US sparsentan indication explicitly excludes nephrotic syndrome. Steroids, calcineurin inhibitors and rituximab not curated.';
const ident=id=>({id,revisionId:id+'-therapies-v1',status:'candidate'});
for(const pmid of ['36920755','37921461']){
 const s=b.sources.find(s=>s.identifiers.includes('PMID:'+pmid));s.kind='trial';s.revisionId=s.id+'-therapies-v1';
}
function copyClaim(from,to,therapy){
 const c=structuredClone(b.claims.find(c=>c.id==='claim-fsgs-'+from));
 Object.assign(c,ident('claim-fsgs-'+to),{subjectId:therapy});b.claims.push(c);return c.id;
}
const inaxMoA=copyClaim('inax-channel','therapy-inax-channel','therapy-inaxaplin');
const inaxEff=copyClaim('inax-protein','therapy-inax-protein','therapy-inaxaplin');
const sparEff=copyClaim('spar-protein','therapy-spar-protein','therapy-sparsentan');
const sparQual=copyClaim('spar-egfr','therapy-spar-egfr','therapy-sparsentan');
const fdaUrl='https://www.fda.gov/drugs/drug-alerts-and-statements/first-fda-approved-treatment-patients-focal-segmental-glomerulosclerosis-rare-kidney-condition';
const quote='(sparsentan) tablets for reducing proteinuria (abnormal levels of protein in the urine) in patients aged eight years and older with focal segmental glomerulosclerosis (FSGS) without nephrotic syndrome.';
fs.writeFileSync(dir+'/sources/fda-source-check.json',JSON.stringify({url:fdaUrl,checkedBy:'Codex agent via web retrieval',checkedAt:'2026-10-17',accessScope:'FDA web announcement full page',exactExcerpt:quote,mechanismExcerpt:'Filspari is a dual endothelin and angiotensin II receptor antagonist.',limitations:['US indication only; not an indication for nephrotic syndrome.']},null,2)+'\n');
b.sources.push({...ident('source-fda-fsgs-2026'),title:'FDA: First FDA-approved treatment for FSGS',url:fdaUrl,kind:'regulatory',studyId:'FDA-FILSPARI-FSGS-2026',citation:'FDA announcement and linked 2026 labeling, inspected 2026-10-17',accessScope:'FDA announcement full page inspected by Codex agent; prescribing-label PDF not separately inspected',identifiers:[],flags:[]});
b.contexts.push({...ident('context-fsgs-spar-label'),diseaseId:b.diseaseId,label:'US sparsentan indication: FSGS without nephrotic syndrome, age 8+',organism:'Human',phenotype:'FSGS without nephrotic syndrome',tissue:'Kidney',stage:'US indication checked 2026-10-17; outside nephrotic primary-FSGS phenotype'});
b.evidenceItems.push({...ident('evidence-fsgs-spar-label'),sourceId:'source-fda-fsgs-2026',summary:'US FDA indication for reducing proteinuria in FSGS without nephrotic syndrome, age eight years and older.',location:'FDA announcement opening paragraph; mechanism in following paragraph',retrievedAt:'2026-10-17',studySystem:'US FDA regulatory indication',evidenceType:'regulatory_label'});
b.claims.push({...ident('claim-fsgs-spar-label'),text:'In the United States, sparsentan is approved to reduce proteinuria in patients aged eight years and older with FSGS without nephrotic syndrome.',subjectId:'therapy-sparsentan',objectId:'entity-proteinuria',predicate:'efficacy_on',contextId:'context-fsgs-spar-label',evidenceItemIds:['evidence-fsgs-spar-label'],verification:'source_checked',causalInterpretation:'interventional',limitations:['Label restriction excludes nephrotic syndrome; no extrapolation to nephrotic primary FSGS.'],sourceCheckedAt:'2026-10-17',reviewDisposition:{decision:'pending_domain_review',reviewerId:null,reviewedAt:null}});
const src=pmid=>b.sources.find(s=>s.identifiers.includes('PMID:'+pmid)).id;
b.therapies=[
 {...ident('therapy-inaxaplin'),name:'Inaxaplin (VX-147)',modality:'Oral small-molecule APOL1 channel inhibitor',directTargetIds:['entity-apol1'],indirectTargetIds:['entity-apol1-current'],mechanismOfAction:'Inhibits APOL1 channel function in preclinical assays.',indicationContextId:'context-fsgs-inaxaplin',developmentStatus:'experimental',trialSourceIds:[src('36920755')],supportingClaimIds:[inaxMoA,inaxEff],qualifyingClaimIds:[],contradictingClaimIds:[],lastVerifiedAt:'2026-10-17',indication:'Investigational APOL1-associated proteinuric kidney disease; initial trial required two APOL1 risk variants and biopsy-proven FSGS.',jurisdiction:'Investigational; no approved indication asserted',trialPhase:'Inspected efficacy report: phase 2a (NCT04340362); subsequent development not systematically curated',verificationSourceIds:[src('36920755')],limitations:['Small uncontrolled 13-week study; no randomized kidney-outcome efficacy established.','2026 sponsor updates identified in search; newer trial results not independently inspected or mapped.']},
 {...ident('therapy-sparsentan'),name:'Sparsentan (Filspari)',modality:'Oral dual endothelin / angiotensin II receptor antagonist',directTargetIds:[],indirectTargetIds:['entity-proteinuria'],mechanismOfAction:'Dual endothelin and angiotensin II receptor antagonism, as described by FDA; specific receptor nodes not expanded in this map.',indicationContextId:'context-fsgs-spar-label',developmentStatus:'approved',trialSourceIds:[src('37921461')],supportingClaimIds:[sparEff,'claim-fsgs-spar-label'],qualifyingClaimIds:[sparQual],contradictingClaimIds:[],lastVerifiedAt:'2026-10-17',indication:'US: reduce proteinuria in patients aged eight years and older with FSGS without nephrotic syndrome.',jurisdiction:'United States (FDA)',trialPhase:'Phase 3 DUPLEX (NCT03493685)',verificationSourceIds:['source-fda-fsgs-2026'],limitations:['US label excludes nephrotic syndrome; not an approved treatment for the nephrotic primary-FSGS branch.','DUPLEX overall eGFR-slope endpoint was not significant despite proteinuria improvement.','FDA announcement notes hepatotoxicity/REMS; full prescribing information not appraised.']}
];
b.manifest.contentDigest=contentDigest(b);
fs.writeFileSync(dir+'/therapy-candidate.json',JSON.stringify(b,null,2)+'\n');
