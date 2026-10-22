import fs from 'node:fs';
import path from 'node:path';
const base='curation/workspace/maintenance/2026-10-21';const cycle=path.join(base,fs.readdirSync(base)[0]);
const original=JSON.parse(fs.readFileSync(`${cycle}/paper-dispositions.json`));
const paperFiles=new Map();const inventory=[];
for(const x of original.filter(x=>x.decision==='deferred')){
 if(!paperFiles.has(x.sourceSnapshot))paperFiles.set(x.sourceSnapshot,new Map(JSON.parse(fs.readFileSync(x.sourceSnapshot)).map(p=>[p.key,p])));
 const p=paperFiles.get(x.sourceSnapshot).get(x.sourceKey),a=p.abstract??'',t=p.title;
 const experimental=/knock.?out|knock.?down|silenc(?:ing|ed)|siRNA|CRISPR|transfect|overexpress|co.?culture|immunoprecip|in vitro|murine|\bmous(?:e|es)\b|\bmice\b|\brats?\b|loss.of.function|gain.of.function|BMDM|organoid|single.cell|RNA.seq|transcriptom|proteomic|methylation|genome.wide|mechanis/i.test(a+' '+t);
 const secondary=/\breview\b|meta.analysis|systematic synthesis|literature search|we searched.*(?:PubMed|MEDLINE)|this (?:article|paper) (?:reviews|summari[sz]es)|consensus (?:statement|recommendation)/i.test(t+' '+a);
 const caseBased=/case report|report of.*case|report a case|we (?:present|report|describe) (?:a |the case)|case.series|a \d+.year.old|patient.*presented|patients.*presented/i.test(t+' '+a);
 const clinical=/retrospective|cross.sectional|case.control|cohort|survey|questionnaire|randomi[sz]ed|clinical trial|patients.*(?:enrolled|included)|we (?:included|enrolled).*patients|consecutive patients|study population/i.test(a);
 const notice=p.flags.some(f=>/retract|concern|correction/.test(f));
 const bucket=notice?'notice':!a?'missing-abstract':secondary?'secondary':experimental?'mechanistic':caseBased?'case':clinical?'clinical':'other';
 inventory.push({...x,paper:p,bucket,experimental,caseBased,clinical,secondary,abstractWords:a.split(/\s+/).length});
}
fs.writeFileSync('curation/workspace/maintenance-completion/2026-10-21/inventory.json',JSON.stringify(inventory,null,2)+'\n');
const counts={};for(const x of inventory){const c=counts[x.diseaseId]??={};c[x.bucket]=(c[x.bucket]??0)+1;}
console.log(JSON.stringify(counts,null,2));
