import json,urllib.request,concurrent.futures,pathlib,hashlib
root=pathlib.Path('curation/workspace/maintenance-completion/2026-10-21');(root/'primary').mkdir(exist_ok=True)
records=json.loads((root/'inventory.json').read_text());todo={}
for x in records:
 if x['bucket']!='missing-abstract':continue
 p=x['paper'];pmc=p.get('pmcid') or next((i[6:] for i in p['identifiers'] if i.startswith('PMCID:')),None)
 if pmc:todo[pmc]=p

def fetch(item):
 pmc,p=item;url='https://www.ebi.ac.uk/europepmc/webservices/rest/'+pmc+'/fullTextXML'
 r={'key':p['key'],'pmcid':pmc,'url':url,'accessedAtUTC':'2026-10-20','inspected':False}
 try:
  with urllib.request.urlopen(url,timeout=25) as response:data=response.read()
  f=root/'primary'/f'{pmc}.xml';f.write_bytes(data);r.update(status=200,path=str(f),sha256=hashlib.sha256(data).hexdigest())
 except Exception as e:r.update(status='failed',error=str(e))
 return r
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:results=list(ex.map(fetch,todo.items()))
(root/'missing-primary-access.json').write_text(json.dumps(results,indent=2)+'\n');print(json.dumps({'attempted':len(results),'downloaded':sum(x['status']==200 for x in results)}))
