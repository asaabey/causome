import urllib.request,urllib.parse,json,pathlib,re
p=pathlib.Path('curation/workspace/behcet-disease/research');d=json.loads((p/'papers.json').read_text())
q='DOI:10.1111/bjd.20643 OR DOI:10.1093/rheumatology/keae585 OR DOI:10.1002/advs.202411524'
r=json.load(urllib.request.urlopen('https://www.ebi.ac.uk/europepmc/webservices/rest/search?'+urllib.parse.urlencode({'query':q,'format':'json','resultType':'core','pageSize':20})));(p/'review-records.json').write_text(json.dumps(r,indent=2))
for a in r['resultList']['result']:
 d[a['id']]=a;print(a['id'],a.get('pmcid'),a.get('firstPublicationDate'),re.sub('<[^>]+>',' ',a.get('abstractText','')))
(p/'papers.json').write_text(json.dumps(d,indent=2))
