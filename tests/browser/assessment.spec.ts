import { test, expect } from '@playwright/test';
import { fixture } from './fixture';
test.skip(process.env.CAUSOME_BUILD_MODE === 'publication' || !fixture.assessments.some(item => item.appraisalProvenance), 'Provisional-appraisal checks belong to the local appraised preview');

test('current node and edge ratings show provenance, components and categorical therapy scope', async ({ page }) => {
 await page.goto('diseases/sle/');
 await page.getByRole('searchbox', { name: 'Find a mediator or therapy' }).fill('TNFSF13B');
 await page.getByRole('list', { name: 'Search results' }).getByRole('button').click();
 const inspector=page.getByRole('complementary',{name:'Evidence inspector'});
 const assessment=fixture.assessments.find(item=>item.subjectId==='entity-baff')!;
 await expect(inspector.locator('.evidence-scores')).toContainText(`${assessment.mechanisticWeight}/100`);
 await expect(inspector.locator('.evidence-scores')).toContainText(`${assessment.evidenceConfidence}/4`);
 await expect(inspector.locator('.evidence-scores')).toContainText('Approved direct target');
 await expect(inspector.locator('.evidence-scores')).not.toContainText('Not assessed');
 await expect(inspector).toContainText('Provisional · uncalibrated · review pending');
 await inspector.getByText('Weight components and rationale', { exact:true }).click();
 await expect(inspector.locator('.evidence-appraisal').filter({hasText:'Weight components and rationale'})).toContainText('Independent corroboration');
 await inspector.getByText('Therapeutic target coverage and limits', {exact:true}).click();
 await expect(inspector).toContainText('Belimumab');
 await expect(inspector).toContainText('US');
 const edge=fixture.relationships.find(item=>item.id==='relationship-ifn-baff')!;
 const related=inspector.locator('.evidence-inspector__related').filter({has:page.getByRole('heading',{name:'Connected relationships'})});
 const source=fixture.entities.find(item=>item.id===edge.sourceId)!;
 await related.getByRole('button').filter({hasText:source.label}).first().click();
 await expect(inspector.locator('.evidence-scores')).toContainText('Endpoint: Approved direct target');
 await inspector.getByText('Therapeutic target coverage and limits',{exact:true}).click();
 await expect(inspector).toContainText('does not establish treatment efficacy on this relationship');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('current appraisals are exposed in the curator and original history remains unassessed', async ({ page }) => {
 await page.goto('curation/');
 await page.getByLabel('Disease workspace').selectOption('sle');
 await expect(page.getByRole('region',{name:'Current appraisals'})).toContainText('48 of 48');
 await expect(page.getByRole('region',{name:'Current appraisals'})).toContainText('uncalibrated');
 await page.getByLabel('Disease workspace').selectOption('iga-nephropathy');
 await expect(page.getByRole('region',{name:'Current appraisals'})).toContainText('16 of 16');
 await page.goto('diseases/sle/candidates/sle-curated-candidate-001/');
 await expect(page.locator('.static-assessment').first()).toContainText('Mechanistic weight: Not assessed');
 await page.goto('diseases/sle/');
 await expect(page.locator('.static-assessment').first()).toContainText('Approved direct target');
 await expect(page.locator('.static-assessment').first()).toContainText('Provisional');
});
