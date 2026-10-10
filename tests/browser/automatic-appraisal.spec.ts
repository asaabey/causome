import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { fixture } from './fixture';
import { assessCandidate } from '../../scripts/curation/assessment.mjs';
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const automatic = readdirSync('knowledge/diseases').flatMap(slug => {
  const profile = read(`knowledge/diseases/${slug}/disease.json`);
  if (!profile.previewCandidate) return [];
  const bundle = read(`knowledge/diseases/${slug}/candidates/${profile.previewCandidate}.json`);
  return bundle.assessments.some((item: any) => item.appraisalProvenance?.method === 'rules') ? [bundle] : [];
})[0];
test.skip(process.env.CAUSOME_BUILD_MODE === 'publication', 'Automatic drafts belong to the internal preview');

test('workbench exports a populated automatic worksheet that the CLI appraisal engine accepts', async ({ page }) => {
  await page.goto('curation/');
  await page.getByLabel('Disease workspace').selectOption(fixture.diseaseId);
  const region = page.getByRole('region', { name: 'Current appraisals' });
  await expect(region).toContainText('Seeding and reconciliation generate fresh conservative appraisals automatically');
  const pending = page.waitForEvent('download');
  await region.getByRole('button', { name: 'Export automatic appraisal worksheet' }).click();
  const download = await pending;
  const worksheet = read((await download.path())!);
  expect(worksheet.method).toBe('rules');
  expect(worksheet.assessorKind).toBe('system');
  expect(worksheet.baseContentDigest).toBe(fixture.manifest.contentDigest);
  expect(worksheet.assessments).toHaveLength(fixture.assessments.length);
  expect(worksheet.assessments.every((item: any) => item.evidenceConfidence !== null && Object.keys(item.weightComponents).length === 5)).toBe(true);
  const candidate = assessCandidate(fixture, worksheet);
  expect(candidate.assessments.every((item: any) => item.therapeuticAppraisal)).toBe(true);
  expect(candidate.assessments.some((item: any) => item.therapeuticAppraisal.category === 'approved_direct_target')).toBe(true);
});

test('an automatically appraised map exposes values, conservative reasons and system provenance', async ({ page }) => {
  test.skip(!automatic, 'No selected automatic disease candidate in this checkout');
  const assessment = automatic.assessments.find((item: any) => item.mechanisticWeight !== null && automatic.entities.some((entity: any) => entity.id === item.subjectId));
  const entity = automatic.entities.find((item: any) => item.id === assessment.subjectId);
  await page.goto(`diseases/${automatic.diseaseId}/`);
  await page.getByRole('searchbox', { name: 'Find a mediator or therapy' }).fill(entity.label);
  await page.getByRole('list', { name: 'Search results' }).getByRole('button').first().click();
  const inspector = page.getByRole('complementary', { name: 'Evidence inspector' });
  await expect(inspector.locator('.evidence-scores')).toContainText(`${assessment.mechanisticWeight}/100`);
  await expect(inspector.locator('.evidence-scores')).toContainText(`${assessment.evidenceConfidence}/4`);
  await expect(inspector.locator('.evidence-scores')).not.toContainText('Not assessed');
  await expect(inspector).toContainText('Automatic · causome-auto-appraisal-v1');
  await inspector.getByText('Confidence dimensions and rationale', { exact: true }).click();
  await expect(inspector).toContainText('study controls, methods and bias have not been independently appraised');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
