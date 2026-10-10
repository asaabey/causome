import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fixture } from './fixture';

test('launch map meets cold-load and inspector response budgets', async ({ browser, baseURL }, testInfo) => {
  test.skip(process.env.CAUSOME_PERFORMANCE !== '1', 'Run with pnpm test:performance on the pinned runner');
  test.setTimeout(180_000);
  const loads: { lcpMs: number; interactiveMs: number }[] = [];
  const responseTimes: number[] = [];
  for (let run = 0; run < 5; run++) {
    const context = await browser.newContext({ viewport: testInfo.project.use.viewport });
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    await session.send('Network.enable');
    await session.send('Network.setCacheDisabled', { cacheDisabled: true });
    await session.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8 });
    await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      (window as any).__lcp = 0;
      new PerformanceObserver(list => { for (const entry of list.getEntries()) (window as any).__lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await page.goto(`${baseURL}diseases/sle/`);
    const node = page.locator('.react-flow__node').nth(1);
    const selectedLabel = await node.locator('.biological-node__label').textContent();
    await expect(node).toBeVisible();
    await node.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('.evidence-inspector__selection h2')).toHaveText(selectedLabel!);
    loads.push(await page.evaluate(() => ({ lcpMs: (window as any).__lcp, interactiveMs: performance.now() })));
    if (run === 4) {
      // Hydrated responses are measured separately from network/CPU cold-load simulation.
      await session.send('Emulation.setCPUThrottlingRate', { rate: 1 });
      const complete = fixture.mapViews.find(view => view.entityIds.length === fixture.entities.length)!;
      await page.getByLabel('Explore a route').selectOption(complete.id);
      await expect(page.locator('.react-flow__node')).toHaveCount(fixture.entities.length);
      const nodes = page.locator('.react-flow__node');
      const count = await nodes.count();
      for (let selection = 0; selection < 20; selection++) {
        const target = nodes.nth((selection + 1) % count);
        const name = await target.locator('.biological-node__label').textContent();
        await target.focus();
        const started = await page.evaluate(() => performance.now());
        await page.keyboard.press('Enter');
        await expect(page.locator('.evidence-inspector__selection h2')).toHaveText(name!);
        responseTimes.push(await page.evaluate(start => performance.now() - start, started));
      }
    }
    await context.close();
  }
  const median = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b), middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  };
  const report = {
    viewport: testInfo.project.use.viewport, browser: browser.version(),
    runner: { playwright: JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8')).version, node: process.version, platform: process.platform, arch: process.arch },
    fixture: JSON.parse(readFileSync('web/dist/release.json', 'utf8')),
    network: { downloadMbps: 1.6, latencyMs: 150, cpuSlowdown: 4, coldCache: true },
    bundles: readdirSync('web/dist/_astro').map(name => ({ name, bytes: statSync(join('web/dist/_astro', name)).size })),
    lockfileDigest: createHash('sha256').update(readFileSync('pnpm-lock.yaml')).digest('hex'),
    loads, inspectorResponseMs: responseTimes,
    medians: { lcpMs: median(loads.map(item => item.lcpMs)), interactiveMs: median(loads.map(item => item.interactiveMs)), inspectorMs: median(responseTimes) },
  };
  const reportPath = testInfo.outputPath('performance-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  await testInfo.attach('performance-report', { path: reportPath, contentType: 'application/json' });
  console.log(`${testInfo.project.name} performance medians: ${JSON.stringify(report.medians)}`);
  expect(report.medians.lcpMs).toBeGreaterThan(0);
  expect(report.medians.lcpMs).toBeLessThanOrEqual(2500);
  expect(report.medians.interactiveMs).toBeLessThanOrEqual(5000);
  expect(report.medians.inspectorMs).toBeLessThanOrEqual(200);
});
