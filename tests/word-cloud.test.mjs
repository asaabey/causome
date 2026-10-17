import test from 'node:test';
import assert from 'node:assert/strict';
import { compactLabel, layoutCloud, packCloud, wrapLabel } from '../web/src/lib/word-cloud.ts';

const groups = [
  { id: 'cells', label: 'Cells' },
  { id: 'humoral', label: 'Antibodies' },
  { id: 'outcomes', label: 'Leads to', scaled: false, layout: 'row' },
];
const items = [
  { id: 'b', label: 'B cells', weight: 1, group: 'cells' },
  { id: 't', label: 'T cells', weight: 1, group: 'cells' },
  { id: 'ab', label: 'Anti-nephrin', weight: 9, group: 'humoral' },
  { id: 'ns', label: 'Nephrotic syndrome', weight: 40, group: 'outcomes' },
  { id: 'x', label: 'Unclassified', weight: 4, group: 'missing' },
];

test('unscaled row groups neither join the weight range nor change other sizes', () => {
  const layout = layoutCloud(items, groups, { minSize: 10, maxSize: 30 });
  assert.equal(layout.maxWeight, 9);
  assert.deepEqual(layout.rows.map(row => row.group.id), ['outcomes']);
  assert.equal(layout.rows[0].items[0].size, 10);
  const sizes = Object.fromEntries(layout.cards.flatMap(card => card.items.map(item => [item.id, item.size])));
  assert.equal(sizes.ab, 30);
  assert.equal(sizes.b, 10);
});

test('cards order by total weight and unknown groups fall into Other', () => {
  const layout = layoutCloud(items, groups, { otherLabel: 'Other players' });
  assert.deepEqual(layout.cards.map(card => card.group.label), ['Antibodies', 'Other players', 'Cells']);
  assert.deepEqual(layoutCloud(items, groups, { groupOrder: 'given' }).cards.map(card => card.group.id), ['cells', 'humoral', '__other__']);
});

test('ties sort alphabetically and equal weights use the minimum size', () => {
  const layout = layoutCloud(items.slice(0, 2), groups, { minSize: 12 });
  assert.deepEqual(layout.cards[0].items.map(item => [item.label, item.size]), [['B cells', 12], ['T cells', 12]]);
});

test('square-root scale enlarges low weights more than linear', () => {
  const pair = [{ id: 'a', label: 'a', weight: 0 }, { id: 'm', label: 'm', weight: 25 }, { id: 'z', label: 'z', weight: 100 }];
  const size = scale => layoutCloud(pair, [], { minSize: 0, maxSize: 100, scale }).cards[0].items.find(item => item.id === 'm').size;
  assert.equal(size('linear'), 25);
  assert.equal(size('sqrt'), 50);
});

test('compact labels prefer trailing abbreviations and drop explanatory brackets', () => {
  assert.equal(compactLabel('Soluble fms-like tyrosine kinase-1 (sFlt-1)'), 'sFlt-1');
  assert.equal(compactLabel('Posterior reversible encephalopathy syndrome (PRES)'), 'PRES');
  assert.equal(compactLabel('Thrombophilia (protein C/S deficiency, antiphospholipid antibodies)'), 'Thrombophilia');
  assert.equal(compactLabel('Calciphylaxis (clinical syndrome)'), 'Calciphylaxis');
  assert.equal(compactLabel('IL-6'), 'IL-6');
});

test('wrapping keeps lines short and folds overflow into the last line', () => {
  assert.deepEqual(wrapLabel('Nucleic-acid immune complexes'), ['Nucleic-acid', 'immune complexes']);
  assert.deepEqual(wrapLabel('a b c d', 1, 2), ['a', 'b c d']);
});

test('packing is deterministic, starts at the centre and never overlaps', () => {
  const many = Array.from({ length: 40 }, (_, index) => ({ id: `e${index}`, label: `Entity number ${index}`, weight: (index * 7) % 13 + 1 }));
  const { cards } = layoutCloud(many);
  const first = packCloud(cards, { padding: 2 });
  assert.deepEqual(packCloud(cards, { padding: 2 }), first);
  assert.deepEqual([first.words[0].x, first.words[0].y], [0, 0]);
  for (const [i, a] of first.words.entries()) for (const b of first.words.slice(i + 1)) {
    const apart = Math.abs(a.x - b.x) >= (a.width + b.width) / 2 || Math.abs(a.y - b.y) >= (a.height + b.height) / 2;
    assert.ok(apart, `${a.item.id} overlaps ${b.item.id}`);
  }
});
