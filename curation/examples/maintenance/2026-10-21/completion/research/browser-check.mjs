import {chromium} from '@playwright/test';
import fs from 'node:fs';
const dir='curation/workspace/maintenance-completion/2026-10-21/browser';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true});const results=[];
try{
 for(const slug of ['membranous-nephropathy','minimal-change-nephropathy']){
  const profile=JSON.parse(fs.readFileSync(`knowledge/diseases/${slug}/disease.json`));
  const b=JSON.parse(fs.readFileSync(`knowledge/diseases/${slug}/candidates/${profile.previewCandidate}.json`));
  const page=await browser.newPage({viewport:{width:1440,height:1050}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(`http://127.0.0.1:4322/diseases/${slug}/`,{waitUntil:'networkidle'});if(!response?.ok())throw new Error(`${slug}: failed page`);
  await page.locator('.mechanism-count').waitFor();
  const text=await page.locator('.scientific-summary').innerText();for(const p of b.scientificSummary.paragraphs)if(!text.replace(/\s+/g,' ').includes(p.text.replace(/\s+/g,' ')))throw new Error(`${slug}: summary mismatch`);
  const packet=await page.request.get(`http://127.0.0.1:4322/diseases/${slug}/summary-review.md`);const packetText=await packet.text();if(!packet.ok()||!packetText.includes(b.id)||!packetText.includes(b.manifest.contentDigest))throw new Error(`${slug}: packet identity mismatch`);
  await page.locator('.mechanism-heading').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/${slug}-map.png`});
  await page.locator('.scientific-summary').screenshot({path:`${dir}/${slug}-summary.png`});
  const count=await page.locator('.mechanism-count').innerText();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(errors.length||overflow)throw new Error(`${slug}: ${JSON.stringify({errors,overflow})}`);
  results.push({slug,candidateId:b.id,contentDigest:b.manifest.contentDigest,status:response.status(),mechanismCount:count,summaryMatches:true,packetMatches:true,pageErrors:errors,overflow});await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto('http://127.0.0.1:4322/diseases/calciphylaxis/',{waitUntil:'networkidle'});await page.locator('.mechanism-count').waitFor();await page.screenshot({path:`dir/mobile.png`.replace('dir',dir)});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow)throw new Error('Mobile page overflow');results.push({mobile:'calciphylaxis',overflow});
 fs.writeFileSync(`${dir}/results.json`,JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
