import urllib.request,urllib.parse,json,pathlib
p=pathlib.Path('curation/workspace/behcet-disease/research');d=json.loads((p/'papers.json').read_text())
queries={'tnf-refined':'(TITLE_ABS:Behcet* OR TITLE_ABS:Behçet*) AND (TITLE_ABS:etanercept OR TITLE_ABS:infliximab) AND TITLE_ABS:trial','intestinal-refined':'(TITLE_ABS:Behcet* OR TITLE_ABS:Behçet*) AND TITLE_ABS:intestinal AND TITLE_ABS:pathogenesis','clinical-refined':'(TITLE_ABS:Behcet* OR TITLE_ABS:Behçet*) AND TITLE_ABS:cohort AND TITLE_ABS:arthritis'}
for name,q in queries.items():
 r=json.load(urllib.request.urlopen('https://www.ebi.ac.uk/europepmc/webservices/rest/search?'+urllib.parse.urlencode({'query':q,'format':'json','resultType':'core','pageSize':30})));(p/(name+'.json')).write_text(json.dumps(r,indent=2))
 for a in r['resultList']['result']:d[a['id']]=a
 print(name,r['hitCount'],[(a['id'],a['title']) for a in r['resultList']['result']][:15])
(p/'papers.json').write_text(json.dumps(d,indent=2))
