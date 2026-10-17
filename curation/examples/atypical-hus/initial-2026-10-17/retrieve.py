import requests,json,concurrent.futures
from pathlib import Path
out=Path('curation/workspace/atypical-hus/sources')
queries=['DOI:10.1182/blood-2007-02-071472','DOI:10.1182/blood-2007-09-109876','DOI:10.1681/ASN.2012090884','DOI:10.1182/blood-2014-02-558296','DOI:10.3389/fimmu.2023.1206409','TITLE:"Gain-of-function mutations in complement factor B"','TITLE:"Mutations in complement C3 predispose"','TITLE:"Terminal complement inhibitor eculizumab in atypical"','TITLE:"ravulizumab" AND TITLE:"adults" AND FIRST_PDATE:2020','TITLE:"Thrombomodulin mutations"']
def run(q):
 r=requests.get('https://www.ebi.ac.uk/europepmc/webservices/rest/search',params={'query':q,'format':'json','resultType':'core','pageSize':10},timeout=50);r.raise_for_status();return q,r.json()
results=list(concurrent.futures.ThreadPoolExecutor(8).map(run,queries))
(out/'targeted-searches.json').write_text(json.dumps(results,indent=2))
papers={p['id']:p for q,r in results for p in r['resultList']['result']}
(out/'primary-records.json').write_text(json.dumps(list(papers.values()),indent=2))
for p in papers.values():print(p['id'],p.get('pmcid'),p['title'], '\n',p.get('abstractText',''), '\nFLAGS',p.get('commentCorrectionList'),p.get('isRetracted'))
