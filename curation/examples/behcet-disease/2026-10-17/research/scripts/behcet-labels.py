import urllib.request,pathlib,re,json,html
from html.parser import HTMLParser
class T(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,data):
  s=data.strip()
  if s:self.parts.append(s)
p=pathlib.Path('curation/workspace/behcet-disease/research')
for name,sid in [('otezla','f6b1f516-4972-4d82-bced-113e47b41cc5'),('remicade','a0a046c1-056d-45a9-bfd9-13b47c24f257')]:
 url='https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid='+sid
 raw=urllib.request.urlopen(url).read().decode();(p/(name+'-label.html')).write_text(raw);t=T();t.feed(raw);txt='\n'.join(t.parts);(p/(name+'-label.txt')).write_text(txt)
 print(name,[(m.start(),txt[max(0,m.start()-60):m.start()+140]) for m in list(re.finditer('INDICATIONS AND USAGE|Mechanism of Action|inhibitor of phosphodiesterase|TNF blocker|Updated ',txt))[:10]])
