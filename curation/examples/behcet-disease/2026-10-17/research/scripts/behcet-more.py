exec(open('/tmp/behcet-retrieve.py').read().split('queries=')[0])
a=p/'papers.json';d=json.loads(a.read_text())
for id in ['31722152']:
 u='https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:'+id+'&format=json&resultType=core';r=json.load(urllib.request.urlopen(u))['resultList']['result'][0];d[id]=r;print(id,re.sub('<[^>]+>',' ',r.get('abstractText','')) if False else r.get('abstractText'))
a.write_text(json.dumps(d,indent=2))
