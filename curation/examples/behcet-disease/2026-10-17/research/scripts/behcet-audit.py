import json,pathlib,re,html,hashlib
w=pathlib.Path('curation/workspace/behcet-disease');b=json.load(open('knowledge/diseases/behcet-disease/candidates/behcet-disease-summary-candidate-d266780f35d0.json'));papers=json.load(open(w/'research/papers.json'))
def norm(s):return re.sub(r'\s+',' ',html.unescape(re.sub('</?[a-zA-Z][^>]*>',' ',s))).strip().lower()
receipts=[]
first=json.load(open(w/'first-map.json'))
for f in first['findings']:
 raw=papers[f['pmid']];ok=norm(f['quote']) in norm(raw['abstractText']);assert ok,f['id'];receipts.append({'claimId':'claim-'+f['id'],'pmid':f['pmid'],'matched':ok,'quote':f['quote'],'location':f['quoteLocation'],'sourceCheck':f['sourceCheck']})
for name in ['therapy-excerpts.json','review-excerpts.json']:
 for f in json.load(open(w/'research'/name)):
  s=next(s for s in b['sources'] if s['id']==f['sourceId']);pmid=next((i[5:] for i in s.get('identifiers',[]) if i.startswith('PMID:')),None)
  raw=papers[pmid]['abstractText'] if pmid else (w/'research'/('otezla-label.txt' if 'otezla' in s['id'] else 'remicade-label.txt')).read_text();ok=norm(f['quote']) in norm(raw);assert ok,(f['claimId'],f['quote']);receipts.append({**f,'matched':ok})
(w/'handoff/source-passage-checks.json').write_text(json.dumps({'date':'2026-10-17','checkedBy':'Codex agent','description':'Deterministic quotation matching after actual agent passage inspection; not independent semantic verification','receipts':receipts},ensure_ascii=False,indent=2)+'\n')
selected=set()
for s in b['sources']:
 for id in s.get('identifiers',[]):
  if id.startswith('PMID:'):selected.add(id[5:])
selected|={'40013981','28166214'}
(w/'research/selected-primary-records.json').write_text(json.dumps({id:papers[id] for id in sorted(selected)},ensure_ascii=False,indent=2)+'\n')
print('Matched',len(receipts),'receipts; sources',len(b['sources']),'claims',len(b['claims']),'contexts',len(b['contexts']))
print('Notices:')
for id in sorted(selected):
 r=papers[id];print(id,r.get('isRetracted'),r.get('commentCorrectionList',{}))
print('Digest',b['manifest']['contentDigest']);print('summary',b['scientificSummary'])
