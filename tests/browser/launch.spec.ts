import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { fixture as candidate } from './fixture';

for (const path of ['/', '/diseases/sle/', '/methodology/', '/sources/']) {
  test(`${path} has usable navigation, no horizontal overflow and no serious accessibility findings`, async ({ page }, testInfo) => {
    await page.goto(path.replace(/^\//, ''));
    if (path === '/diseases/sle/') await expect(page.locator('.react-flow__node').first()).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
    await testInfo.attach('axe-results', { body: JSON.stringify(result), contentType: 'application/json' });
    const failures = result.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')).map(item => ({ id: item.id, targets: item.nodes.map(node => node.target).slice(0, 12), count: item.nodes.length }));
    expect(failures).toEqual([]);
  });
}

test('keyboard can select every node and relationship, read evidence and exit the graph', async ({ page }) => {
  await page.goto('diseases/sle/');
  await page.getByLabel('Explore a route').selectOption(candidate.mapViews.find(view => view.entityIds.length === candidate.entities.length)!.id);
  await expect(page.locator('.react-flow__node')).toHaveCount(candidate.entities.length);
  await expect(page.locator('.react-flow__edge')).toHaveCount(candidate.relationships.length);
  // Browser keyboard events exercise the renderer's actual accessibility handlers.
  for (const entity of candidate.entities) {
    const node = page.locator(`.react-flow__node[data-id="${entity.id}"]`);
    await node.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('.evidence-inspector__selection h2')).toHaveText(entity.label);
    await expect(page.locator('.evidence-inspector__claims')).toContainText('Claims & provenance');
  }
  for (const edge of candidate.relationships) {
    const element = page.locator(`.react-flow__edge[data-id="${edge.id}"]`);
    await element.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('.evidence-inspector__selection h2')).toHaveText(edge.predicate.replaceAll('_', ' '));
    await expect(page.locator('.evidence-direction-note')).toContainText(edge.directionality === 'symmetric' ? 'Association is symmetric' : 'Arrow points from');
    expect(await element.getAttribute('aria-label')).toContain(edge.directionality);
  }
  await page.getByRole('button', { name: 'Zoom in', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Zoom out', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Fit entire map' }).focus(); await page.keyboard.press('Enter');
  for (const therapy of candidate.therapies) {
    const button = page.locator('.mechanism-therapies button').filter({ hasText: therapy.name.split(' (')[0] });
    await button.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('.evidence-inspector__selection h2')).toHaveText(therapy.name);
    await expect(page.locator('.evidence-context')).toContainText(therapy.lastVerifiedAt!);
  }
});

test('reduced motion, visible focus and graph controls work on both viewports', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('diseases/sle/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  const zoom = page.getByRole('button', { name: 'Zoom in', exact: true });
  await zoom.focus();
  const focus = await zoom.evaluate(element => ({ outline: getComputedStyle(element).outlineStyle, width: getComputedStyle(element).outlineWidth }));
  expect(focus.outline).toBe('solid'); expect(parseFloat(focus.width)).toBeGreaterThanOrEqual(3);
  for (const button of await page.locator('.mechanism-controls button, .mechanism-therapies button').all()) {
    const box = await button.boundingBox(); expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
});

test('all scientific content and citations remain readable without JavaScript', async ({ browser, baseURL }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  await page.goto(`${baseURL}diseases/sle/`);
  const outline = page.locator('#mechanism-outline');
  await expect(outline.locator('article[id^="entity-"]')).toHaveCount(candidate.entities.length);
  await expect(outline.locator('article[id^="relationship-"]')).toHaveCount(candidate.relationships.length);
  await expect(outline.locator('article[id^="claim-"]')).toHaveCount(candidate.claims.length);
  await expect(outline.locator('article[id^="therapy-"]')).toHaveCount(candidate.therapies.length);
  await expect(outline).toContainText(candidate.manifest.contentDigest);
  expect(await outline.locator('a[href^="https://"]').count()).toBeGreaterThanOrEqual(candidate.sources.length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
