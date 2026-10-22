import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const research='curation/workspace/maintenance-research/2026-10-21';
const cycle='curation/workspace/maintenance/2026-10-21/'+fs.readdirSync('curation/workspace/maintenance/2026-10-21')[0];
const dest='curation/examples/maintenance/2026-10-21';fs.mkdirSync(dest,{recursive:true});
fs.cpSync(research,`${dest}/research`,{recursive:true});
const top=['report.json','report.md','handoff.md','paper-dispositions.json','carried-backlog.json','source-notice-audit.json','candidate-bindings.json','retrieval-index.json','cycle-status.json',...fs.readdirSync(cycle).filter(n=>n.endsWith('-final-diff.json'))];
for(const name of top)fs.copyFileSync(`${cycle}/${name}`,`${dest}/${name}`);
const packets={
 'sle':{proposals:['proposal-dc852eba510642ce8b2ae415','proposal-55cd93d8e32b08ce24ce183f'],appraisals:['sle-appraised-candidate-681273ee935d','sle-appraised-candidate-32a52e130f7b'],summaries:['sle-summary-candidate-904291fc29fb','sle-summary-candidate-ecc3504a7a24'],reviews:['7f2ea908983820474f4f4c8546d6dbb693a3af1b5735070047c5495f775df401','815a4353e330742d6b27e55172d7e08fe5f4c95db9a4947b1e285e233a795d90']},
 'anca-associated-vasculitis':{proposals:['proposal-42173efab580cbda9165aeb4'],appraisals:['anca-associated-vasculitis-appraised-candidate-a25b58b5a9a4'],summaries:['anca-associated-vasculitis-summary-candidate-ca3e7a1d8c0d'],reviews:['1a2ba45942afb86b665360ffb9cc756a2915d2ab5b58b0c162552fd492b5c411']},
 'calciphylaxis':{proposals:['proposal-3d7d79f8462241097815946c','proposal-6248a81063280d769d21aff1'],appraisals:['calciphylaxis-appraised-candidate-409c9db87504'],summaries:['calciphylaxis-summary-candidate-d5f1a8f06f12'],reviews:['63a4b811fc6cb26977b8f48358703cdfd447deeb6ceaa32e3fc9a27f6d06c25f']}
};
for(const [slug,groups] of Object.entries(packets))for(const [kind,ids] of Object.entries(groups))for(const id of ids){const source=`curation/workspace/${slug}/${kind==='reviews'?'summary-reviews':kind}/${id}`;if(fs.existsSync(source))fs.cpSync(source,`${dest}/source-packets/${slug}/${kind}/${id}`,{recursive:true});}
const logs={'update-all':'/tmp/causome-update-all-2026-10-21.log','check':'/tmp/causome-maintenance-check.log','final-build':'/tmp/causome-maintenance-final-build.log','first-build':'/tmp/causome-maintenance-build.log','final-validate':'/tmp/causome-maintenance-final-validate.log','short-labels':'/tmp/causome-maintenance-short-labels.log','browser':'/tmp/causome-maintenance-browser.log','sle-reconcile-failed-local-date':'/tmp/causome-sle-reconcile.log','sle-assess-local-date':'/tmp/causome-sle-assess.log','sle-reconcile-utc':'/tmp/causome-sle-reconcile-utc.log','aav-reconcile':'/tmp/causome-aav-reconcile.log','ppi-reconcile':'/tmp/causome-ppi-reconcile.log','triage':'/tmp/causome-maintenance-triage.log'};
fs.mkdirSync(`${dest}/logs`,{recursive:true});for(const [name,source] of Object.entries(logs))fs.copyFileSync(source,`${dest}/logs/${name}.log`);
const files=[];function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,ent.name);if(ent.isDirectory())walk(f);else if(ent.name!=='artifact-manifest.json'){const data=fs.readFileSync(f);files.push({path:f.slice(dest.length+1),bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}}}walk(dest);
fs.writeFileSync(`${dest}/artifact-manifest.json`,JSON.stringify({version:1,cycleDirectory:cycle,researchDirectory:research,rawRetrievalCaches:'Workspace-only; actual original paths and queries in retrieval-index.json. No full-cache preservation is claimed.',files},null,2)+'\n');
console.log(JSON.stringify({directory:dest,files:files.length,bytes:files.reduce((s,x)=>s+x.bytes,0)},null,2));
