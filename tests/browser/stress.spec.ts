import {test,expect} from '@playwright/test';
import {writeFileSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {stressFixture} from '../fixtures/stress.mjs';

test('grouped 200-node/400-edge fixture meets cold-load and expanded inspector budgets',async({browser,baseURL},info)=>{
 test.skip(process.env.CAUSOME_STRESS!=='1','Run build:stress followed by test:stress');test.setTimeout(180000);
 const loads: {lcpMs:number;interactiveMs:number}[]=[],responses:number[]=[];
 for(let run=0;run<5;run++){
  const context=await browser.newContext({viewport:info.project.use.viewport}),page=await context.newPage(),session=await context.newCDPSession(page);
  await session.send('Network.enable');await session.send('Network.setCacheDisabled',{cacheDisabled:true});await session.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600000/8,uploadThroughput:750000/8});await session.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.addInitScript(()=>{(window as any).__lcp=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())(window as any).__lcp=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});});
  await page.goto(`${baseURL}testing/stress/`);await expect(page.locator('.react-flow__node')).toHaveCount(40);
  const target=page.locator('.react-flow__node').nth(1),label=await target.locator('.biological-node__label').textContent();await target.focus();await page.keyboard.press('Enter');await expect(page.locator('.evidence-inspector__selection h2')).toHaveText(label!);
  loads.push(await page.evaluate(()=>({lcpMs:(window as any).__lcp,interactiveMs:performance.now()})));
  if(run===4){await session.send('Emulation.setCPUThrottlingRate',{rate:1});await page.getByRole('button',{name:/Expand Additional synthetic mechanisms/}).click();await expect(page.locator('.react-flow__node')).toHaveCount(200);await expect(page.locator('.react-flow__edge')).toHaveCount(400);
   for(let i=0;i<20;i++){const node=page.locator('.react-flow__node').nth((i*9+1)%200),name=await node.locator('.biological-node__label').textContent();await node.focus();const start=await page.evaluate(()=>performance.now());await page.keyboard.press('Enter');await expect(page.locator('.evidence-inspector__selection h2')).toHaveText(name!);responses.push(await page.evaluate(start=>performance.now()-start,start));}
   await page.getByRole('button',{name:/Collapse Additional synthetic mechanisms/}).click();await expect(page.locator('.react-flow__node')).toHaveCount(40);await page.getByLabel('Explore a route').selectOption('view-stress-expanded');await expect(page.locator('.react-flow__node')).toHaveCount(200);await expect(page.locator('.react-flow__edge')).toHaveCount(400);
  }
  await context.close();
 }
 const median=(numbers:number[])=>{const sorted=[...numbers].sort((a,b)=>a-b),i=Math.floor(sorted.length/2);return sorted.length%2?sorted[i]:(sorted[i-1]+sorted[i])/2;};
 const f=stressFixture(),report={fixture:{id:f.id,contentDigest:f.manifest.contentDigest,synthetic:true,entities:200,relationships:400},viewport:info.project.use.viewport,browser:browser.version(),runner:{playwright:JSON.parse(readFileSync('node_modules/@playwright/test/package.json','utf8')).version,node:process.version,platform:process.platform,arch:process.arch},network:{downloadMbps:1.6,latencyMs:150,cpuSlowdown:4,coldCache:true},bundles:readdirSync('web/dist/_astro').map(name=>({name,bytes:statSync(join('web/dist/_astro',name)).size})),loads,inspectorResponseMs:responses,medians:{lcpMs:median(loads.map(item=>item.lcpMs)),interactiveMs:median(loads.map(item=>item.interactiveMs)),inspectorMs:median(responses)}};
 const path=info.outputPath('stress-report.json');writeFileSync(path,JSON.stringify(report,null,2));await info.attach('stress-report',{path,contentType:'application/json'});console.log(`${info.project.name} stress medians: ${JSON.stringify(report.medians)}`);expect(report.medians.lcpMs).toBeGreaterThan(0);expect(report.medians.lcpMs).toBeLessThanOrEqual(2500);expect(report.medians.interactiveMs).toBeLessThanOrEqual(5000);expect(report.medians.inspectorMs).toBeLessThanOrEqual(200);
});
