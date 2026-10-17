import urllib.request,urllib.parse,json,pathlib,re
p=pathlib.Path('curation/workspace/behcet-disease/research'); d=json.loads((p/'papers.json').read_text())
for name,q in [('tnf','TITLE_ABS:Behcet AND TITLE_ABS:infliximab AND TITLE_ABS:randomized'),('intestinal','TITLE_ABS:"intestinal Behçet" AND TITLE_ABS:cohort AND FIRST_PDATE:[2015-01-01 TO 2026-10-17]')]:
 u='https://www.ebi.ac.uk/europepmc/webservices/rest/search?'+urllib.parse.urlencode({'query':q,'format':'json','resultType':'core','pageSize':20});r=json.load(urllib.request.urlopen(u));(p/(name+'.json')).write_text(json.dumps(r,indent=2))
 for a in r['resultList']['result']:d[a['id']]=a
 print(name,[(a['id'],a['title']) for a in r['resultList']['result']][:10])
(p/'papers.json').write_text(json.dumps(d,indent=2))
