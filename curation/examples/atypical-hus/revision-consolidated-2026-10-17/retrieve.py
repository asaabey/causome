import requests,json,concurrent.futures
from pathlib import Path
w=Path('curation/workspace/atypical-hus/revision-consolidated-2026-10-17/sources')
queries=['TITLE:"Factor H dysfunction in patients"','TITLE:"Complement activation by heme as a secondary hit"','TITLE:"Gain-of-function mutations in complement factor B"','DOI:10.1056/NEJMoa0810739','TITLE:"Spontaneous hemolytic uremic syndrome triggered"','TITLE:"Genetics and outcome of atypical hemolytic uremic syndrome"','TITLE:"Complement factor H mutations and endothelial"','TITLE:"Atypical Hemolytic Uremic Syndrome in the Era"']
def run(q):
 r=requests.get('https://www.ebi.ac.uk/europepmc/webservices/rest/search',params={'query':q,'format':'json','resultType':'core','pageSize':8},timeout=60);r.raise_for_status();return q,r.json()
res=list(concurrent.futures.ThreadPoolExecutor(6).map(run,queries));(w/'targeted-queries.json').write_text(json.dumps(res,indent=2));p={x['id']:x for _,r in res for x in r['resultList']['result']};(w/'primary-records.json').write_text(json.dumps(list(p.values()),indent=2))
for x in p.values():print(x['id'],x.get('pmcid'),x['title'],'\n',x.get('abstractText',''),'\nNOTICES',x.get('commentCorrectionList'))
