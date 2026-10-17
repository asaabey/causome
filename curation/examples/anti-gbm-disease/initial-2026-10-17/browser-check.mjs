import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const response=await page.goto('http://127.0.0.1:4328/diseases/anti-gbm-disease/');await page.locator('.react-flow__node').first().waitFor();
const picker=page.getByLabel('Explore a route');const opts=await picker.locator('option').evaluateAll(xs=>xs.map(x=>({value:x.value,label:x.textContent})));
const views=[];for(const o of opts){await picker.selectOption(o.value);await page.waitForTimeout(100);views.push({...o,nodes:await page.locator('.react-flow__node').count(),edges:await page.locator('.react-flow__edge').count()});if(!views.at(-1).nodes)throw Error('Empty map');}
await page.getByRole('button',{name:/Imlifidase.*experimental/i}).click();await page.waitForTimeout(100);const therapyText=await page.locator('.evidence-inspector').innerText();if(!therapyText.includes('primary endpoint'))throw Error('Null trial missing from therapy inspector');
await picker.selectOption(opts[1].value);await page.screenshot({path:'curation/workspace/anti-gbm-disease/handoff/page.png',fullPage:true});
const packet=await page.request.get('http://127.0.0.1:4328/diseases/anti-gbm-disease/summary-review.md');const packetText=await packet.text();if(!packet.ok()||!packetText.includes('824d30740aae'))throw Error('Review packet mismatch');
await page.goto('http://127.0.0.1:4328/curation/?disease=anti-gbm-disease');await page.getByLabel('Disease workspace').waitFor();const workspace=await page.getByLabel('Disease workspace').inputValue();
fs.writeFileSync('curation/workspace/anti-gbm-disease/handoff/browser-check.json',JSON.stringify({checkedAt:new Date().toISOString(),url:response.url(),status:response.status(),views,therapyNullEndpointVisible:true,packetStatus:packet.status(),packetBindsFinalCandidate:true,curationWorkspace:workspace,pageErrors:errors},null,2));await browser.close();if(errors.length)throw Error(errors.join('\n'));console.log('Browser smoke passed: '+views.length+' views, therapy null endpoint and bound summary packet.');
