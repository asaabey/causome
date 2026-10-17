import {chromium} from '@playwright/test';import fs from 'node:fs';import assert from 'node:assert/strict';
const w='curation/workspace/behcet-disease',b=JSON.parse(fs.readFileSync('knowledge/diseases/behcet-disease/candidates/behcet-disease-summary-candidate-d266780f35d0.json')),browser=await chromium.launch({headless:true}),results=[];
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4330/diseases/behcet-disease/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.react-flow__node').count(),38);assert.equal(await page.locator('.react-flow__edge').count(),52);
 const domIds=await page.locator('.react-flow__node').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-id')));assert.deepEqual([...domIds].sort(),b.entities.map(e=>e.id).sort());
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(errors.length,0);
 const region=page.getByRole('region',{name:'Overall scientific summary'});for(const para of b.scientificSummary.paragraphs)assert((await region.innerText()).includes(para.text));
 await page.getByRole('button',{name:'Grouped',exact:true}).click();const cloudNames=await page.locator('.word-cloud .word-cloud__word').evaluateAll(ns=>ns.map(n=>n.getAttribute('aria-label')));assert.equal(cloudNames.length,38);
 await page.locator('.word-cloud .word-cloud__word').filter({hasText:/Histone H3.1/}).click();assert((await page.locator('.evidence-inspector').innerText()).includes('Histone H3.1'));
 await page.locator('.mechanism-therapies button').filter({hasText:'Apremilast'}).click();assert((await page.locator('.evidence-inspector').innerText()).includes('United States'));
 const packet=await page.request.get('http://127.0.0.1:4330/diseases/behcet-disease/summary-review.md');assert(packet.ok());assert((await packet.text()).includes(b.id));
 await page.locator('.mechanism-workspace').screenshot({path:`${w}/handoff/${name}-map.png`});await page.screenshot({path:`${w}/handoff/${name}-viewport.png`});results.push({name,width,nodes:38,edges:52,cloudEntities:38,cloudMapCoverage:'38/38',summaryMatches:true,therapyInspector:true,packetStatus:packet.status(),horizontalOverflow:false,pageErrors:errors});await page.close();
}
const context=await browser.newContext({javaScriptEnabled:false});const p=await context.newPage();await p.goto('http://127.0.0.1:4330/diseases/behcet-disease/');assert((await p.locator('body').innerText()).includes(b.scientificSummary.paragraphs[0].text));assert(await p.getByRole('link',{name:'Download summary and external review prompt'}).count());await context.close();await browser.close();fs.writeFileSync(`${w}/handoff/browser-results.json`,JSON.stringify({candidate:b.id,contentDigest:b.manifest.contentDigest,results,noJavaScriptSummary:true},null,2));console.log(JSON.stringify(results));
