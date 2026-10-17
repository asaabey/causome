import urllib.request,urllib.parse,json,pathlib
p=pathlib.Path('curation/workspace/behcet-disease/research')
queries={'genetics':'EXT_ID:20622878 OR EXT_ID:23291587 OR DOI:10.1038/ng.3786','nets':'DOI:10.1136/annrheumdis-2018-214335 OR DOI:10.1002/art.42486 OR DOI:10.1002/art.70217','adaptive':'TITLE_ABS:Behcet AND (TITLE_ABS:Th17 OR TITLE_ABS:interleukin-23) AND FIRST_PDATE:[2007-01-01 TO 2013-12-31]','therapy':'EXT_ID:23290985 OR (TITLE:"Trial of Apremilast" AND TITLE_ABS:Behcet)','outcomes':'TITLE_ABS:Behcet AND (TITLE_ABS:neurologic OR TITLE_ABS:intestinal OR TITLE_ABS:aneurysm) AND TITLE_ABS:cohort'}
all={}
for key,q in queries.items():
 u='https://www.ebi.ac.uk/europepmc/webservices/rest/search?'+urllib.parse.urlencode({'query':q,'format':'json','resultType':'core','pageSize':30})
 d=json.load(urllib.request.urlopen(u));(p/(key+'.json')).write_text(json.dumps(d,indent=2))
 for r in d['resultList']['result']:all[r['id']]=r
 print(key,d['hitCount'],[(r['id'],r['title']) for r in d['resultList']['result']][:15])
(p/'papers.json').write_text(json.dumps(all,indent=2))
