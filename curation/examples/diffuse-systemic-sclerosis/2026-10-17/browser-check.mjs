import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync} from 'node:fs';
const b=JSON.parse(readFileSync('knowledge/diseases/diffuse-systemic-sclerosis/candidates/diffuse-systemic-sclerosis-summary-candidate-f7786448c91d.json'));
const browser=await chromium.launch();const results=[];
for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4328/diseases/diffuse-systemic-sclerosis/');await page.locator('.react-flow__node').first().waitFor();await page.waitForTimeout(500);
 const nodes=await page.locator('.react-flow__node').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-id')));
 const missing=b.entities.filter(e=>!nodes.includes(e.id)).map(e=>e.id);
 const cloud=page.locator('details.word-cloud').filter({hasText:'Key players'}).first();
 const cloudCount=await cloud.locator('[aria-label$="Show on map."]').count();
 const summary=await page.getByRole('region',{name:'Overall scientific summary'}).innerText();
 const response=await page.request.get('http://127.0.0.1:4328/diseases/diffuse-systemic-sclerosis/summary-review.md');
 const packet=await response.text();
 await page.getByRole('searchbox',{name:'Find a mediator or therapy'}).fill('nintedanib');
 await page.getByRole('list',{name:'Search results'}).getByRole('button').first().click();
 const inspector=await page.getByRole('complementary',{name:'Evidence inspector'}).innerText();writeFileSync(`curation/workspace/diffuse-systemic-sclerosis/${label}-inspector.txt`,inspector);
 await page.screenshot({path:`curation/workspace/diffuse-systemic-sclerosis/${label}.png`,fullPage:true});
 const result={label,nodes:nodes.length,missing,cloudCount,summaryMatches:b.scientificSummary.paragraphs.every(p=>summary.includes(p.text)),packetOK:response.ok()&&packet.includes(b.id),therapyVisible:inspector.includes('Nintedanib')&&inspector.toLowerCase().includes('approved'),noHorizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),errors};results.push(result);
 await page.close();
}
await browser.close();writeFileSync('curation/workspace/diffuse-systemic-sclerosis/browser-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));if(results.some(r=>r.missing.length||!r.summaryMatches||!r.packetOK||!r.therapyVisible||!r.noHorizontalOverflow||r.errors.length))process.exitCode=1;
