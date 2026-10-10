import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { fixture } from './fixture';

test.beforeEach(async ({ page }) => {
  await page.goto('diseases/sle/');
  await expect(page.locator('.react-flow__node').first()).toBeVisible();
});

test('search finds synonyms with keyboard access and recovers from no matches', async ({ page }) => {
  const entity = fixture.entities.find(item => item.synonyms.includes('TNFSF13B'))!;
  const search = page.getByRole('searchbox', { name: 'Find a mediator or therapy' });
  await search.fill('  tnfsf13b  ');
  const results = page.getByRole('list', { name: 'Search results' });
  await expect(results.getByRole('button')).toHaveCount(1);
  await expect(results).toContainText(entity.label);
  await search.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Clear search' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(results.getByRole('button')).toBeFocused();
  await page.keyboard.press('Enter');
  const inspector = page.getByRole('complementary', { name: 'Evidence inspector' });
  await expect(inspector).toBeFocused();
  await expect(inspector.getByRole('heading', { level: 2 })).toHaveText(entity.label);
  const result = await new AxeBuilder({ page }).include('.mechanism-workspace').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')).map(item => item.id)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await search.fill('zzzz-no-record');
  await expect(page.locator('.mechanism-search__status')).toContainText('No matches in this atlas');
  await expect(results).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(page.locator('.mechanism-search__status')).toBeEmpty();
});

test('therapy brand search leads to its target across routes and shows evidence on mobile', async ({ page }, testInfo) => {
  const therapy = fixture.therapies.find(item => item.name.includes('Saphnelo'))!;
  const target = fixture.entities.find(item => item.id === therapy.directTargetIds[0])!;
  const complete = fixture.mapViews.find(item => item.entityIds.length === fixture.entities.length)!;
  expect(fixture.mapViews[0].entityIds).not.toContain(target.id);
  await page.getByRole('searchbox', { name: 'Find a mediator or therapy' }).fill('saphnelo');
  await page.getByRole('list', { name: 'Search results' }).getByRole('button').click();
  const inspector = page.getByRole('complementary', { name: 'Evidence inspector' });
  await expect(inspector.getByRole('heading', { level: 2 })).toHaveText(therapy.name);
  await expect(inspector).toContainText(therapy.lastVerifiedAt!);
  await expect(inspector).toBeFocused();
  await inspector.getByRole('button', { name: `Direct: ${target.label}`, exact: true }).click();
  await expect(page.getByLabel('Explore a route')).toHaveValue(complete.id);
  await expect(page.locator(`.react-flow__node[data-id="${target.id}"]`)).toHaveClass(/selected/);
  await expect(inspector.getByRole('heading', { level: 2 })).toHaveText(target.label);
  await expect(inspector).toBeFocused();
  expect(await inspector.evaluate(element => element.scrollTop)).toBe(0);
  if (testInfo.project.name === 'mobile') {
    const box = await inspector.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeLessThan(40);
    await expect(inspector.getByRole('heading', { level: 2 })).toBeInViewport();
  }
});

test('connected relationships preserve incoming arrows and symmetric association labels', async ({ page }) => {
  const symmetric = fixture.relationships.find(item => item.directionality === 'symmetric')!;
  const incoming = fixture.relationships.find(item => item.directionality === 'directed')!;
  for (const id of new Set([symmetric.targetId, incoming.targetId])) {
    const entity = fixture.entities.find(item => item.id === id)!;
    await page.getByRole('searchbox', { name: 'Find a mediator or therapy' }).fill(entity.label);
    await page.getByRole('list', { name: 'Search results' }).getByRole('button').filter({ has: page.getByText(entity.label, { exact: true }) }).click();
    const related = page.locator('.evidence-inspector__related').filter({ has: page.getByRole('heading', { name: 'Connected relationships' }) });
    const relationships = fixture.relationships.filter(item => item.sourceId === id || item.targetId === id);
    await expect(related.getByRole('button')).toHaveCount(relationships.length);
    for (const [index, relationship] of relationships.entries()) {
      const source = fixture.entities.find(item => item.id === relationship.sourceId)!;
      const target = fixture.entities.find(item => item.id === relationship.targetId)!;
      const button = related.getByRole('button').nth(index);
      await expect(button.locator('strong')).toHaveText(`${source.label} ${relationship.directionality === 'symmetric' ? '—' : '→'} ${target.label}`);
      await expect(button.locator('small')).toContainText(relationship.directionality === 'symmetric' ? 'Symmetric association' : relationship.targetId === id ? 'Incoming relationship' : 'Outgoing relationship');
    }
    await related.getByRole('button').first().click();
    await expect(page.getByRole('complementary', { name: 'Evidence inspector' })).toBeFocused();
    await expect(page.locator('.evidence-direction-note')).toContainText(relationships[0].directionality === 'symmetric' ? 'Association is symmetric' : 'Arrow points from');
  }
});

test('map selection has an evidence shortcut and changing routes clears it', async ({ page }, testInfo) => {
  const inspector = page.getByRole('complementary', { name: 'Evidence inspector' });
  if (testInfo.project.name === 'desktop') {
    await inspector.evaluate(element => { element.scrollTop = element.scrollHeight; });
    expect(await inspector.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  }
  await page.locator('.mechanism-therapies button').first().click();
  expect(await inspector.evaluate(element => element.scrollTop)).toBe(0);
  const shortcut = page.getByRole('button', { name: 'Read selected evidence' });
  await shortcut.click();
  await expect(inspector).toBeFocused();
  await expect(inspector.getByRole('heading', { level: 2 })).toBeInViewport();
  await page.getByLabel('Explore a route').selectOption(fixture.mapViews[1].id);
  await expect(shortcut).toBeDisabled();
  await expect(page.locator('.mechanism-selection')).toContainText('Select an entity');
  await expect(inspector.getByRole('heading', { level: 2 })).toHaveText('Follow a mechanism.');
});
