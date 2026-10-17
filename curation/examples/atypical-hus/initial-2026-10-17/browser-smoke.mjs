import fs from 'node:fs';
import {chromium} from '@playwright/test';
const w='curation/workspace/atypical-hus';const b=JSON.parse(fs.readFileSync('knowledge/diseases/atypical-hus/candidates/atypical-hus-summary-candidate-cd695231f272.json'));
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const root='http://127.0.0.1:4329';const routes=[];
for(const route of ['/diseases/atypical-hus/',...b.mapViews.map(v=>'/diseases/atypical-hus/?view='+v.id),'/curation/?disease=atypical-hus']){const r=await page.goto(root+route);await page.waitForTimeout(400);if(r.status()!==200)throw Error(route+' '+r.status());routes.push({route,status:r.status()});}
await page.goto(root+'/diseases/atypical-hus/');await page.waitForTimeout(600);if(!(await page.locator('h1').innerText()).includes('Atypical'))throw Error('title');if(await page.locator('.react-flow__node').count()===0)throw Error('no graph');
const download=await page.request.get(root+'/diseases/atypical-hus/summary-review.md');const md=await download.text();if(!md.includes(b.id)||!md.includes(b.manifest.contentDigest))throw Error('summary snapshot');
await page.screenshot({path:w+'/handoff/page.png',fullPage:false});await page.setViewportSize({width:390,height:844});await page.screenshot({path:w+'/handoff/mobile.png',fullPage:false});
await browser.close();if(errors.length)throw Error(errors.join('; '));fs.writeFileSync(w+'/handoff/browser-check.json',JSON.stringify({checkedAt:'2026-10-17',candidateId:b.id,routes,summaryDigestBound:true,pageErrors:errors,desktop:[1366,900],mobile:[390,844]},null,2));console.log('Browser smoke passed: '+routes.length+' routes, rendered nodes and exact summary identity.');
