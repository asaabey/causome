import json,pathlib,urllib.request,re
p=pathlib.Path('curation/workspace/behcet-disease/research'); papers=json.loads((p/'papers.json').read_text())
for pmcid in ['PMC2923807','PMC3810947','PMC5369770']:
 try:
  x=urllib.request.urlopen('https://www.ebi.ac.uk/europepmc/webservices/rest/'+pmcid+'/fullTextXML').read().decode();(p/(pmcid+'.xml')).write_text(x)
  import xml.etree.ElementTree as E
  root=E.fromstring(x); text='\n'.join(''.join(el.itertext()) for el in root.findall('.//p'));(p/(pmcid+'.txt')).write_text(text)
  print(pmcid,'cached',len(text))
 except Exception as e:print(pmcid,str(e))
scan=json.load(open('curation/workspace/behcet-disease/scans/scan-00d9cf32b4b76ef6d5be3581/papers.json'))
print('scan type',type(scan),str(scan)[:250])
