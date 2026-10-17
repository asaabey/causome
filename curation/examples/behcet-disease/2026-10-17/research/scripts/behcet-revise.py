exec(open('/tmp/behcet-author.py').read().split("b['findings']=fs")[0])
b['id']='behcet-disease-candidate-20261017-002'
# Avoid conflating a shared cutaneous microvascular-thrombosis identity with systemic vascular thrombosis.
for e in b['entities']:
 if e['id']=='entity-thrombosis': e['id']='entity-behcet-vascular-thrombosis'
for x in fs:
 for k in ['subject','object']:
  if x[k]=='entity-thrombosis':x[k]='entity-behcet-vascular-thrombosis'
for id,label,cl,desc in [('tnf','TNF','cytokine','Cytokine studied in intestinal Behçet patient PBMC–epithelial co-cultures.'),('plk1','PLK1','protein','Kinase implicated in TNF secretion in the intestinal Behçet co-culture study.'),('ifi16','IFI16','protein','DNA sensor studied by knockdown in intestinal epithelial co-cultures.'),('sting-tbk1','STING–TBK1 signalling','process','Intracellular signalling studied in human intestinal epithelial co-cultures.'),('epithelial-apoptosis','Intestinal epithelial apoptosis','process','Apoptotic injury in the reported NCM460 epithelial cell assay.'),('intestinal-ulcers','Intestinal ulceration','clinical_outcome','Ulcer tissue from the intestinal Behçet subset; not generalized to all patients.'),('joint-involvement','Joint involvement','clinical_outcome','Articular phenotype associated with HLA-B51 in a 2026 single-centre cohort.')]:
 b['entities'].append({'id':'entity-'+id,'label':label,'entityClass':cl,'description':desc,'synonyms':[],'externalIds':[]})
a='Intestinal Behçet patient PBMCs co-cultured with human NCM460 epithelial cells; PLK1 inhibitor, TNF neutralization, IFI16 knockdown and STING agonist; ulcer tissue observations'
f('plk1-tnf',38676954,'plk1','tnf','stimulates','PLK1 promoted TNF secretion by intestinal Behçet PBMCs in the reported co-culture experiments.','PLK1 promotes the secretion of TNF-α from PBMCs',a,'human_in_vitro',lim=['One study, intestinal subset and cell-line co-culture; no clinical efficacy established.'])
f('tnf-ifi16',38676954,'tnf','ifi16','stimulates','PBMC-derived TNF induced epithelial IFI16 overexpression in the reported co-culture system.','which causes overexpression of IFI16',a,'human_in_vitro')
f('ifi16-sting',38676954,'ifi16','sting-tbk1','activates','IFI16 participated in the STING–TBK1 pathway mediating epithelial injury in the reported perturbation assays.','activation of the IFI16-STING-TBK1 pathway',a,'human_in_vitro')
f('sting-apoptosis',38676954,'sting-tbk1','epithelial-apoptosis','contributes_to','STING–TBK1 signalling mediated intestinal epithelial-cell apoptosis in the reported assays.','induces apoptosis of IECs via the STING-TBK1 pathway',a,'human_in_vitro')
f('ifi16-ulcer',38676954,'ifi16','intestinal-ulcers','is_associated_with','IFI16 expression was higher in intestinal Behçet ulcer tissue than healthy-control tissue.','expressions of IFI16, TNF-α, cleaved caspase 3',a,lim=['Ulcer-tissue association; cell-line results do not prove that this route initiates human intestinal ulcers.'])
f('tnf-ulcer',38676954,'tnf','intestinal-ulcers','is_associated_with','TNF was elevated in intestinal Behçet ulcer tissue compared with healthy controls.','in the intestinal ulcer tissue of BS patients were significantly higher',a)
f('hla-joint',42159075,'hla-b51','joint-involvement','is_associated_with','HLA-B51 was associated with joint involvement in the 4,007-patient single-centre cohort.','HLA-B51 was associated with joint and ocular involvement','2026 retrospective cross-sectional Turkish single-centre cohort; 4,007 patients',lim=['Retrospective, single-centre and ancestry-specific association; not a causal joint-injury pathway.'])
f('hla-eye',42159075,'hla-b51','uveitis','is_associated_with','HLA-B51 was associated with ocular involvement in the 4,007-patient single-centre cohort.','HLA-B51 was associated with joint and ocular involvement','2026 retrospective cross-sectional Turkish single-centre cohort; 4,007 patients')
# Insert a clinical link for the intestinal branch, supported by the primary-report population itself.
f('disease-gut',38676954,'behcet','intestinal-ulcers','is_associated_with','The intestinal Behçet subset in the study had intestinal ulcer tissue sampled.','intestinal ulcer tissue of BS patients',a)
b['findings']=fs
for id in sorted(used):
 r=p[id].copy();r['inspectedScope']='Primary-report abstract and Europe PMC bibliographic/notice metadata inspected by Codex agent on '+date+'; full text not inspected.'
 if id=='23291587':
  r['inspectedScope']='Primary-report abstract and full-text Results/Methods inspected (PMC3810947) on '+date+'. Provider Meta-Analysis tag adjudicated as primary GWAS with replication/meta-analysis; raw metadata retained.'
  r['pubTypeList']={'pubType':[x for x in r.get('pubTypeList',{}).get('pubType',[]) if 'meta' not in x.lower()]}
 b['publications'].append(r)
b['diseaseDescription']='Bounded human Behçet disease overview: HLA/ERAP1 and cytokine-locus susceptibility, T-cell and neutrophil activation, NET/coagulation and endothelial injury, plus mucocutaneous, ocular, vascular, neurologic, joint and intestinal branches. Primary-report associations, culture mechanisms and intervention populations remain distinct. Excludes monogenic mimics, diagnostic criteria and comprehensive treatment guidance.'
d['summary']=b['diseaseDescription'];profile.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
# Place genetics, immune branches and organ outcomes in readable columns. Explicit bands do not imply a proven whole-disease cascade.
rows=[['hla-b51','erap1-risk','il10-risk','il23r-risk','il10','joint-involvement'],['il21','treg','th17','il23','ifng','il17'],['behcet','oral-ulcers','genital-ulcers','skin-lesions','uveitis','visual-impairment'],['neutrophils','nets','thrombin-generation','behcet-vascular-thrombosis','arterial-aneurysms','mortality'],['pde4','apremilast','ros','histone-h3-1','tlr4','endothelial-senescence'],['plk1','tnf','ifi16','sting-tbk1','epithelial-apoptosis','intestinal-ulcers'],['cns-involvement']]
b['positions']=[{'entityId':'entity-'+id,'x':i*330,'y':j*250} for j,row in enumerate(rows) for i,id in enumerate(row)]
(w/'first-map.json').write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
labels={e['id']:e['label'] for e in b['entities'] if len(e['label'])<=24};labels.update({'entity-hla-b51':'HLA-B*51','entity-il23r-risk':'IL23R–IL12RB2 locus','entity-nets':'NETs','entity-endothelial-senescence':'Endothelial senescence','entity-pde4':'PDE4','entity-skin-lesions':'Skin lesions','entity-cns-involvement':'CNS involvement','entity-mortality':'Mortality','entity-ros':'ROS','entity-behcet':'Behçet disease','entity-epithelial-apoptosis':'Epithelial apoptosis'})
pathlib.Path('knowledge/diseases/behcet-disease/short-labels.json').write_text(json.dumps({'version':1,'labels':labels},ensure_ascii=False,indent=2)+'\n')
print(len(b['entities']),len(fs),len(used))
