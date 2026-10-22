import fs from 'node:fs';const d='curation/workspace/maintenance-completion/2026-10-21';
for(const[s,id]of[['minimal-change-nephropathy','minimal-change-nephropathy-maintenance-context-20261020'],['membranous-nephropathy','membranous-nephropathy-appraised-candidate-10418184175e']]){
 const b=JSON.parse(fs.readFileSync(`knowledge/diseases/${s}/candidates/${id}.json`));let i=JSON.parse(fs.readFileSync(`${d}/${s}-summary-input.json`));i.baseReleaseId=b.id;i.baseContentDigest=b.manifest.contentDigest;
 if(s==='minimal-change-nephropathy'){
 i.scope=i.scope.replace('T-cell and cytokine','observational hemopexin activity, T-cell and cytokine');
 i.paragraphs[0].text=i.paragraphs[0].text.replace('prevalence varies by assay and cohort.','replication supports a subset but prevalence is quantitatively inconsistent. A cell-based assay cohort detected antibodies in 7/36 adults with MCD (19.44%); another pediatric/young-adult cohort found 15% MCD and 11% FSGS positivity. Anti-nephrin is neither universal nor specific to MCD.');
 i.paragraphs[0].claimIds.push('claim-3816cebd7c651f8cd1f5','claim-735fc6733f590ae4742f');
 i.paragraphs[1].text=i.paragraphs[1].text.replace('supporting a model-specific route without establishing that IL-13 is necessary in humans.','supporting an overexpression-model route. IL-13 effects remain model-dependent; this does not establish uniform pathogenicity or human necessity.');
 }else{
 i.paragraphs[0].text=i.paragraphs[0].text.replace('NELL-1 in a further share of PLA2R-negative cases that varies widely by cohort,','NELL-1 in selected PLA2R-negative cases,');
 i.paragraphs[1].text=i.paragraphs[1].text.replace('No initiating pathway is established as universal.','These non-exclusive pathways differ by subtype, assay and experimental system; none is established as universal.').replace('The under-1-to-4.9% frequencies concern seven putative targets, not NELL-1; malignancy-associated NELL-1 disease falls outside this primary-only scope. The primary-secondary boundary is a curation choice.','The under-1-to-4.9% frequencies concern seven putative targets, not NELL-1. In a separate 70-person NELL1 series only 11% lacked known secondary associations, including drugs, autoimmunity or malignancy. NELL1 identity does not establish primary disease; its inclusion is bounded and provisional against mixed literature, with secondary associations excluded.');
 i.paragraphs[1].claimIds.push('claim-40c9c27b0960c6aac6ed');
 }
 fs.writeFileSync(`${d}/${s}-revised-summary-input.json`,JSON.stringify(i,null,2)+'\n');console.log(s,i.paragraphs.map(p=>p.text.split(/\s+/).length));
}
