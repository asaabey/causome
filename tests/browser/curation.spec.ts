import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { validateExtraction, reconcileExtraction } from '../../scripts/curation/reconcile.mjs';
test.skip(process.env.CAUSOME_BUILD_MODE === 'publication', 'Internal curator and unreviewed second-disease checks belong to preview builds');

test('curator can export an abstention bound to its base and matching sources', async ({ page }, testInfo) => {
  await page.goto('curation/');
  await page.getByLabel('Disease workspace').selectOption('iga-nephropathy');
  await expect(page.getByRole('heading', { name: /Source queue \([1-9]\d*\)/ })).toBeVisible();
  await page.getByLabel('Abstain: evidence is insufficient').check();
  await page.getByLabel('Abstention reason').fill('The cached excerpt does not answer the proposed question.');
  await page.getByRole('button', { name: 'Stage finding', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Staged findings (1)' })).toBeVisible();
  const proposalEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export extraction proposal' }).click();
  const proposal = await proposalEvent; const proposalPath = testInfo.outputPath('extraction.json'); await proposal.saveAs(proposalPath);
  const papersEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export matching source snapshots' }).click();
  const papersDownload = await papersEvent; const papersPath = testInfo.outputPath('papers.json'); await papersDownload.saveAs(papersPath);
  const extraction = JSON.parse(await readFile(proposalPath, 'utf8')), papers = JSON.parse(await readFile(papersPath, 'utf8'));
  const bundlePath = `knowledge/diseases/iga-nephropathy/candidates/${extraction.baseReleaseId}.json`;
  const base = JSON.parse(await readFile(bundlePath, 'utf8'));
  expect(validateExtraction(extraction, papers, base)).toEqual([]);
  expect(reconcileExtraction({ base, extraction, papers, cutoff: base.evidenceCutoff }).candidate).toBeNull();
  await page.reload(); await expect(page.getByRole('heading', { name: 'Staged findings (1)' })).toBeVisible();
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', await page.locator('body').evaluate(element => element.clientWidth));
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});
test('group expansion and search reveal the canonical entity while preserving the complete outline', async ({ page }) => {
  await page.goto('diseases/iga-nephropathy/');
  await expect(page.locator('.react-flow__node')).toHaveCount(6);
  await page.getByRole('button', { name: /Expand Cytokine & IgA1 production/ }).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(8);
  await page.getByRole('button', { name: /Collapse Cytokine & IgA1 production/ }).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(6);
  await page.getByLabel('Find a mediator or therapy').fill('IL-6');
  await page.getByRole('button', { name: /IL-6.*Cytokine/i }).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(8);
  await expect(page.locator('.evidence-inspector__selection h2')).toHaveText('IL-6');
  await expect(page.locator('#mechanism-outline #entity-entity-il6')).toBeVisible();
});
test('cross-disease comparisons preserve independent context and evidence links', async ({ page }) => {
  await page.goto('compare/');
  await expect(page.getByRole('heading', { name: /Compare diseases/ })).toBeVisible();
  await expect(page.locator('.comparison-change').filter({ hasText: 'IL-6' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Read.*evidence/ }).first()).toHaveAttribute('href', /diseases\//);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test('a source-checked finding exports a valid proposal and an advancing evidence cutoff', async ({ page }, testInfo) => {
  await page.goto('curation/'); await page.getByLabel('Disease workspace').selectOption('iga-nephropathy');
  await page.getByLabel('Filter sources').fill('15673298');
  await page.getByRole('button', { name: /15673298/ }).first().click();
  await expect(page.locator('#finding-editor')).toBeFocused();
  await page.getByLabel('Proposed evidence cutoff').fill('2026-10-11');
  await page.getByRole('combobox', { name: 'Subject', exact: true }).selectOption('entity-iga-complexes');
  await page.getByRole('combobox', { name: 'Object', exact: true }).selectOption('entity-mesangial');
  await page.getByRole('combobox', { name: 'Context', exact: true }).selectOption({ index: 1 });
  await page.getByRole('combobox', { name: 'Predicate', exact: true }).selectOption('stimulates');
  await page.getByRole('combobox', { name: 'Interpretation', exact: true }).selectOption('mechanistic');
  await page.getByLabel('Evidence contribution').selectOption('qualifying');
  await page.getByLabel('Claim in this context').fill('Synthetic browser-test qualification of a cultured-cell endpoint.');
  await page.getByLabel('Exact cached passage').fill('uncomplexed IgA1 did not affect MC proliferation significantly');
  await page.getByLabel('Source location').fill('Abstract'); await page.getByLabel('Study system').fill('Synthetic UI test of recorded cultured mesangial-cell evidence');
  await page.getByLabel('Evidence type').selectOption('human_in_vitro');
  await page.getByLabel('Limitations (one per line)').fill('Synthetic test output; no scientific approval or real source check is claimed.');
  await page.getByLabel('Why this differs').fill('Synthetic test of the distinct-finding field.');
  await page.getByLabel('I inspected the original report').check();
  await page.getByLabel('Source checker', { exact: true }).fill('synthetic-test-only'); await page.getByLabel('Checked date').fill('2026-10-11');
  await page.getByRole('button', { name: 'Stage finding', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Staged findings (1)' })).toBeVisible();
  const extractionEvent = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export extraction proposal' }).click();
  const extractionPath = testInfo.outputPath('checked-extraction.json'); await (await extractionEvent).saveAs(extractionPath);
  const sourcesEvent = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export matching source snapshots' }).click();
  const papersPath = testInfo.outputPath('checked-papers.json'); await (await sourcesEvent).saveAs(papersPath);
  const extraction = JSON.parse(await readFile(extractionPath, 'utf8')), papers = JSON.parse(await readFile(papersPath, 'utf8'));
  const base = JSON.parse(await readFile(`knowledge/diseases/iga-nephropathy/candidates/${extraction.baseReleaseId}.json`, 'utf8'));
  expect(validateExtraction(extraction, papers, base)).toEqual([]);
  const report = reconcileExtraction({ base, extraction, papers, cutoff: '2026-10-11' });
  expect(report.candidate).not.toBeNull(); expect(report.publicationChanged).toBe(false);
});

test('version comparison defaults to the selected candidate and links each changed claim to frozen evidence',async({page})=>{
 const selected = JSON.parse(await readFile('knowledge/diseases/iga-nephropathy/disease.json', 'utf8')).previewCandidate;
 await page.goto('diseases/iga-nephropathy/compare/');await expect(page.getByRole('combobox',{name:'After',exact:true})).toHaveValue(selected);
 await expect(page.getByRole('combobox',{name:'Before',exact:true})).toHaveValue('iga-nephropathy-candidate-001');
 await expect(page.getByRole('link',{name:'Read this claim’s source evidence'}).first()).toHaveAttribute('href',new RegExp(`candidates/${selected}/#claim-`));
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});

test('a persisted finding with a stale source hash blocks export until it is reinspected',async({page})=>{
 await page.goto('curation/');await page.getByLabel('Disease workspace').selectOption('iga-nephropathy');await page.getByLabel('Abstain: evidence is insufficient').check();await page.getByLabel('Abstention reason').fill('Synthetic draft-integrity test');await page.getByRole('button',{name:'Stage finding',exact:true}).click();
 await page.evaluate(()=>{const key=Object.keys(localStorage).find(key=>key.startsWith('causome-draft:')&&!key.endsWith(':cutoff'))!;const saved=JSON.parse(localStorage.getItem(key)!);saved[0].paperDigest='0'.repeat(64);localStorage.setItem(key,JSON.stringify(saved));});
 await page.reload();await expect(page.getByRole('alert')).toContainText('changed or missing source snapshots');await expect(page.getByRole('button',{name:'Export extraction proposal'})).toBeDisabled();await page.getByRole('button',{name:/Remove finding/}).click();await expect(page.getByRole('heading',{name:'Staged findings (0)'})).toBeVisible();
});
