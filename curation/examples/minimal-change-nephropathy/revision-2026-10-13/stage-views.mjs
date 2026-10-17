// View-only full-candidate edit: one layered human-evidence view as the default,
// a crossing-free experimental view, and removal of the redundant research view.
// Scientific records are unchanged.
import { readFileSync, writeFileSync } from 'node:fs';
import { contentDigest, validatePreview } from '../../../../../scripts/validation.mjs';
import { hash } from '../../../../../scripts/curation/io.mjs';

const dir = 'knowledge/diseases/minimal-change-nephropathy/candidates';
const base = JSON.parse(readFileSync(`${dir}/minimal-change-nephropathy-summary-candidate-bc5dfdb78dfb.json`, 'utf8'));
const c = structuredClone(base);
const revision = hash({ stage: 'mcn-views', base: base.manifest.contentDigest }).slice(0, 12);
delete c.scientificSummary;
c.id = `minimal-change-nephropathy-candidate-${revision}`; c.revisionId = `${c.id}-r1`;
c.changeSetRevision = `full-candidate-${revision}`; c.createdAt = "2026-10-13T19:00:00.000Z";
c.releaseNote = `View-only edit of ${base.id} (${base.manifest.contentDigest}): the default map is a layered human-evidence view (immune findings, anti-nephrin and nephrotic-syndrome hubs, podocyte and clinical outcomes); the experimental anti-nephrin/IL-13 view is relabelled and laid out without edges crossing nodes; the redundant research view is removed. Scientific records are unchanged; domain review pending.`;

const research = c.mapViews.find(v => v.id === 'view-research-context-mcn-overview');
const overview = c.mapViews.find(v => v.id === 'view-minimal-change-nephropathy-overview');
const experimental = c.mapViews.find(v => v.id === 'view-research-context-mcn-experimental');
Object.assign(overview, { label: 'Human evidence · immune findings to podocyte injury', entityIds: research.entityIds, relationshipIds: research.relationshipIds, assessmentIds: research.assessmentIds });
experimental.label = 'Experimental models · anti-nephrin and IL-13';
const at = (entityId, x, y) => ({ entityId, x, y });
// Symmetric edges arc below same-row pairs, so each hub shares a row with its
// partners: anti-nephrin's on top, nephrotic syndrome's below, hubs aligned.
c.layouts.find(l => l.id === overview.layoutId).positions = [
  at('entity-b_cells', 0, 0), at('entity-il13', 300, 0), at('entity-anti-nephrin', 600, 0), at('entity-nephrin', 900, 0), at('entity-podocyte', 1200, 0),
  at('entity-cd4', 0, 400), at('entity-il8', 300, 400), at('entity-nephrotic', 600, 400), at('entity-effacement', 900, 400), at('entity-proteinuria', 1200, 400)];
c.layouts.find(l => l.id === experimental.layoutId).positions = [
  at('entity-anti-nephrin', 0, 110), at('entity-il13', 0, 440),
  at('entity-nephrotic', 520, 0), at('entity-nephrin', 520, 240), at('entity-effacement', 520, 480)];
c.mapViews = [overview, experimental];
c.layouts = c.layouts.filter(l => c.mapViews.some(v => v.layoutId === l.id));
for (const name of ['mapViews', 'layouts']) for (const r of c[name]) {
  const prev = base[name].find(x => x.id === r.id);
  if (JSON.stringify(prev) !== JSON.stringify(r)) r.revisionId = `${r.id}-${revision}`;
}
c.manifest.contentDigest = contentDigest(c);
const v = validatePreview(c); if (!v.valid) throw Error(v.errors.join('\n'));
const out = `${dir}/${c.id}.json`;
writeFileSync(out, JSON.stringify(c, null, 2) + '\n', { flag: 'wx' });
console.log(out);
