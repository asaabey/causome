import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fixture } from './fixture';
import { summaryPacket, feedbackTemplate, attachSummary } from '../../scripts/curation/summary.mjs';
test.skip(process.env.CAUSOME_BUILD_MODE === 'publication' || !fixture.scientificSummary, 'Summary review belongs to the selected internal candidate');

test('summary review is portable, copyable and tied to the exact graph snapshot', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(`curation/?disease=${fixture.diseaseId}`);
  const region = page.getByRole('region', { name: 'Overall scientific summary' });
  await expect(region).not.toContainText(/review pending|approval pending/i);
  for (const paragraph of fixture.scientificSummary!.paragraphs) await expect(region).toContainText(paragraph.text);
  await region.getByRole('button', { name: 'Copy summary and review prompt' }).click();
  await expect(region.getByRole('status')).toContainText('copied');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe(summaryPacket(fixture).reviewText);
  const download = page.waitForEvent('download');
  await region.getByRole('button', { name: 'Export summary packet' }).click();
  const packet = JSON.parse(readFileSync((await (await download).path())!, 'utf8'));
  expect(packet).toEqual(summaryPacket(fixture));
  const feedbackDownload = page.waitForEvent('download');
  await region.getByRole('button', { name: 'Export feedback template' }).click();
  const feedback = JSON.parse(readFileSync((await (await feedbackDownload).path())!, 'utf8'));
  expect(feedback).toEqual(feedbackTemplate(fixture));
  expect(feedback.verdict).toBe('');
  expect(feedback.literatureSearch.performed).toBe(false);
  const response = await page.request.get(`diseases/${fixture.diseaseId}/summary-review.md`);
  expect(response.ok()).toBe(true); expect(await response.text()).toBe(copied);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const mediator = region.locator('strong a').filter({ hasText: /^TLR7$/ }).first();
  await expect(mediator).toHaveAttribute('href', new RegExp(`/candidates/${fixture.id}/#entity-entity-tlr7$`));
  await expect(region.locator('strong a').filter({ hasText: /^BAFF$/ }).first()).toBeVisible();
  await expect(region.locator('strong a').filter({ hasText: /^Type I interferon$/ })).toBeVisible();
  await mediator.click();
  await expect(page.locator('#entity-entity-tlr7')).toBeInViewport();
  await expect(page.locator('#entity-entity-tlr7').getByRole('heading', { name: 'TLR7', exact: true })).toBeVisible();
});

test('summary edits export as a new author-bound candidate and remain visible without JavaScript', async ({ page, browser }) => {
  await page.goto(`curation/?disease=${fixture.diseaseId}`);
  const region = page.getByRole('region', { name: 'Overall scientific summary' });
  await region.getByRole('button', { name: 'Edit summary draft' }).click();
  const text = `${fixture.scientificSummary!.paragraphs[0].text} A synthetic browser edit awaiting review.`;
  await region.getByLabel('Summary paragraph 1').fill(text);
  await region.getByLabel('Summary author', { exact: true }).fill('Synthetic browser reviewer');
  const download = page.waitForEvent('download'); await region.getByRole('button', { name: 'Export summary edit' }).click();
  const input = JSON.parse(readFileSync((await (await download).path())!, 'utf8'));
  const next = attachSummary(fixture, input);
  expect(next.scientificSummary.paragraphs[0].text).toBe(text);
  expect(next.scientificSummary.authoredBy.kind).toBe('human');
  expect(next.manifest.contentDigest).not.toBe(fixture.manifest.contentDigest);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const outline = await context.newPage(); await outline.goto(new URL(`../diseases/${fixture.diseaseId}/`, page.url()).href);
  await expect(outline.getByRole('region', { name: 'Overall scientific summary' })).toContainText(fixture.scientificSummary!.paragraphs[0].text);
  await expect(outline.getByRole('link', { name: 'Download summary and external review prompt' })).toBeVisible();
  await outline.getByRole('region', { name: 'Overall scientific summary' }).locator('strong a').filter({ hasText: /^TLR7$/ }).first().click();
  await expect(outline.locator('#entity-entity-tlr7')).toBeInViewport();
  await context.close();
  if (test.info().project.name === 'desktop') {
    await region.getByRole('button', { name: 'Edit summary draft' }).click();
    await region.screenshot({ path: '/private/tmp/causome-summary-workbench.png' });
  }
});
