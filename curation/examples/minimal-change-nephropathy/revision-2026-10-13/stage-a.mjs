// Stage A of the 2026-10-13 revision responding to the external summary review
// (summary-reviews/9c90eda1…/external-report.md). Full-candidate edit: adds an
// experimental-model context for animal evidence and reclassifies/qualifies
// existing claims per the review. No new evidence is introduced here.
import { readFileSync, writeFileSync } from 'node:fs';
import { contentDigest, validatePreview } from '../../../../../scripts/validation.mjs';
import { hash } from '../../../../../scripts/curation/io.mjs';

const dir = 'knowledge/diseases/minimal-change-nephropathy/candidates';
const baseId = 'minimal-change-nephropathy-summary-candidate-22a34a3088c7';
const base = JSON.parse(readFileSync(`${dir}/${baseId}.json`, 'utf8'));
const c = structuredClone(base);
const revision = hash({ stage: 'mcn-review-revision-a', base: base.manifest.contentDigest }).slice(0, 12);
delete c.scientificSummary;
c.id = `minimal-change-nephropathy-candidate-${revision}`; c.revisionId = `${c.id}-r1`;
c.changeSetRevision = `full-candidate-${revision}`; c.createdAt = '2026-10-12T21:00:00.000Z';
c.releaseNote = `Full-candidate edit of ${base.id} (${base.manifest.contentDigest}) responding to external summary review 2026-10-13 (needs_revision): adds an experimental-model context for animal anti-nephrin evidence; reclassifies the spontaneous-remission case as clinical natural-history context; qualifies T-cell and IL-8/TNF-alpha claims. No new evidence; domain review pending.`;
const bump = r => { r.revisionId = `${r.id}-${revision}`; };

c.contexts.push({ id: 'context-mcn-experimental', label: 'Experimental anti-nephrin models (animal); not human prevalence or universal mechanism',
  organism: 'Mouse (active nephrin immunization); rabbit (passive transfer of patient IgG)', phenotype: 'Experimental MCD-like podocytopathy with nephrotic syndrome or proteinuria',
  tissue: 'Kidney glomerulus / podocyte slit diaphragm', stage: 'Experimental induction; does not establish the mechanism in every human case',
  revisionId: `context-mcn-experimental-${revision}`, status: 'candidate', diseaseId: c.diseaseId });

const claim = id => c.claims.find(x => x.id === id);
const edits = {
  'claim-mcn-effacement': 'Reclassified as clinical natural-history context (spontaneous remission and relapse); it does not identify an initiating mechanism.',
  'claim-mcn-cd4-activation': 'A human association only; not an established initiating cause, permeability-factor source or necessary disease mechanism.',
  'claim-mcn-il8-qualification': 'The negative albumin-permeability finding applies to the tested conditions; it does not exclude context-dependent cytokine effects.',
};
for (const [id, note] of Object.entries(edits)) { const x = claim(id); x.limitations.push(note); bump(x); }

c.manifest.contentDigest = contentDigest(c);
const v = validatePreview(c); if (!v.valid) throw Error(v.errors.join('\n'));
const out = `${dir}/${c.id}.json`;
writeFileSync(out, JSON.stringify(c, null, 2) + '\n', { flag: 'wx' });
console.log(out);
