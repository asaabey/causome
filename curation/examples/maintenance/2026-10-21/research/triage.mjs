import fs from 'node:fs';
import path from 'node:path';
import {hash} from '../../../../scripts/curation/io.mjs';
const root='curation/workspace/maintenance/2026-10-21';
const cycle=path.join(root,fs.readdirSync(root)[0]);
const explicit=JSON.parse(fs.readFileSync('curation/workspace/maintenance-research/2026-10-21/decisions.json'));
const titleKey=p=>p.title.toLowerCase().replace(/&[^;]+;/g,'').replace(/[^a-z0-9]/g,'');
const ledger=[];
const applied={
 'anca-associated-vasculitis:doi-5d5660d642f0a30d1b11':{proposalPath:'curation/workspace/anca-associated-vasculitis/proposals/proposal-42173efab580cbda9165aeb4',affectedClaimIds:['claim-6f2942b97b1583df319c'],affectedEntityIds:['entity-alternative-complement','entity-kidney']},
 'sle:doi-182cad0224e008dbc324':{proposalPath:'curation/workspace/sle/proposals/proposal-dc852eba510642ce8b2ae415',affectedClaimIds:['claim-d4e4e467a2d76a39ace2','claim-4d9c103b676f83c8bd56'],affectedEntityIds:['entity-curli-dna','entity-autoantibodies']},
 'calciphylaxis:doi-744ab78596dc4b7e587e':{proposalPath:'curation/workspace/calciphylaxis/proposals/proposal-3d7d79f8462241097815946c',affectedClaimIds:['claim-d817a99bb3f6b3dcca3a','claim-a2234e93c51e067a6dbd'],affectedEntityIds:['entity-pyrophosphate','entity-calciphylaxis','entity-mortality']}
};
for(const slug of fs.readdirSync(cycle)){
 const file=path.join(cycle,slug,'update.json');if(!fs.existsSync(file))continue;
 const packet=JSON.parse(fs.readFileSync(file));const papers=JSON.parse(fs.readFileSync(packet.papers));
 const canonical=new Map();for(const p of [...papers].sort((a,b)=>Number(Boolean(b.abstract))-Number(Boolean(a.abstract))||Number(Boolean(b.doi))-Number(Boolean(a.doi))))if(!canonical.has(titleKey(p)))canonical.set(titleKey(p),p.key);
 for(const p of papers){
  let decision,reason,screeningLevel,method='agent-authored paper disposition';
  const hand=explicit[slug]?.[p.key];
  if(hand)[decision,reason,screeningLevel]=hand;
  else {
   method='deterministic title/metadata triage; no semantic primary-source review';screeningLevel='automated title/metadata triage';
   if(canonical.get(titleKey(p))!==p.key){decision='duplicate';reason=`Punctuation-normalized identical title to ${canonical.get(titleKey(p))}; retain both source snapshots but do not count as independent evidence. Identifier identity remains provisional if identifiers do not overlap.`;}
   else if(p.flags.some(f=>/retract|concern|correction/.test(f))){decision='deferred';reason='Source notice/linked-source flag requires explicit original-record and notice reconciliation. No positive evidence accepted from this record. Affected base claims are recorded separately.';}
   else if(p.flags.includes('secondary-or-commentary')||/review|meta.analysis|bibliometric|guideline|recommendation|treatment standard|StatPearls|Bookshelf/i.test(p.title)){decision='irrelevant/non-contributory';reason='Secondary/reference/overview material identified at metadata/title triage. No primary scientific claim extracted. This does not establish that the topic has no relevant primary evidence.';}
   else if(/study protocol|trial protocol|protocol for|rationale and design|protocol.*study/i.test(p.title)){decision='irrelevant/non-contributory';reason='Protocol/design paper: no completed outcome results identified from title; no map assertion added.';}
   else if(/case report|case series|a case of|report of.*case|\ba.*year.old\b/i.test(p.title)){decision='deferred';reason='Case-based record requires population, mechanism and alternative-explanation screening before a map assertion. No efficacy or causal inference accepted from title alone.';}
   else if(/predict|prognos|risk (?:model|score|stratification)|diagnostic accuracy|validation of|bibliometric|epidemiolog|prevalence|incidence|histopathological spectrum|demographic|classification|workforce/i.test(p.title)){decision='irrelevant/non-contributory';reason='Title indicates diagnostic/prognostic/epidemiologic classification, rather than a directly supported mechanistic finding. Title-only exclusion is provisional and reversible; no claim about full-text results.';}
   else {decision='deferred';reason='Primary or ambiguous record retained for scientific screening and exact-passage/context review; title/metadata do not support a safe map change. Full methods/source review has not been completed.';}
  }
  const change=packet.changes.find(c=>c.key===p.key);
  ledger.push({diseaseId:slug,cycleDate:'2026-10-21',sourceKey:p.key,identifiers:p.identifiers,sourceContentHash:hash(p),title:p.title,changeKind:change?.kind,knownSource:change?.knownSource??false,decision,reason,screeningLevel,method,affectedClaimIds:change?.knownSource?packet.affectedClaimIds:[],affectedEntityIds:[],proposalPath:null,...applied[`${slug}:${p.key}`],scientificProcessingComplete:decision!=='deferred',sourceSnapshot:packet.papers});
 }
}
fs.writeFileSync(path.join(cycle,'paper-dispositions.json'),JSON.stringify(ledger,null,2)+'\n');
const counts={};for(const p of ledger){const c=counts[p.diseaseId]??={total:0,deferred:0,manual:0,automatic:0};c.total++;if(p.decision==='deferred')c.deferred++;c[p.method.startsWith('agent-authored')?'manual':'automatic']++;}
console.log(JSON.stringify({cycle,counts},null,2));
