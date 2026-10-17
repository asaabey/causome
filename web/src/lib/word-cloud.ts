import cloud from 'd3-cloud';
// Domain-free weighted-list layout: callers map their records to items and groups; this module only orders and sizes them.

export type CloudTone = 'plum' | 'blue' | 'amber' | 'green' | 'violet' | 'olive' | 'earth' | 'neutral';

export interface CloudItem {
  id: string;
  label: string;
  weight: number;
  group?: string;
  /** Display text for packed clouds; the full label stays in tooltips and accessible names. */
  shortLabel?: string;
}

export interface CloudGroup {
  id: string;
  label: string;
  tone?: CloudTone;
  /** false renders the group at base size, outside the weight scale (e.g. outcomes that would otherwise dominate). */
  scaled?: boolean;
  /** 'row' renders an inline labelled strip after the cards instead of a card. */
  layout?: 'card' | 'row';
}

export interface CloudOptions {
  minSize?: number;
  maxSize?: number;
  scale?: 'sqrt' | 'linear' | 'log';
  /** 'weight' orders groups by total weight; 'given' keeps the order of the groups array. */
  groupOrder?: 'weight' | 'given';
  /** Label for items whose group is missing or unknown. */
  otherLabel?: string;
}

export interface SizedItem extends CloudItem { size: number }
export interface CloudSection { group: CloudGroup; items: SizedItem[]; total: number }
export interface CloudLayout { cards: CloudSection[]; rows: CloudSection[]; minWeight: number; maxWeight: number }

const OTHER = '__other__';

const scales = {
  linear: (t: number) => t,
  // Square root sizes by area, so one dominant item does not shrink the rest to illegibility.
  sqrt: Math.sqrt,
  log: (t: number) => Math.log1p(t * (Math.E - 1)),
};

export function layoutCloud(items: CloudItem[], groups: CloudGroup[] = [], options: CloudOptions = {}): CloudLayout {
  const { minSize = 13, maxSize = 26, scale = 'sqrt', groupOrder = 'weight', otherLabel = 'Other' } = options;
  const known = new Map(groups.map(group => [group.id, group]));
  const groupOf = (item: CloudItem) => item.group && known.has(item.group) ? item.group : OTHER;
  const scaledWeights = items.filter(item => known.get(groupOf(item))?.scaled !== false).map(item => item.weight);
  const minWeight = scaledWeights.length ? Math.min(...scaledWeights) : 0;
  const maxWeight = scaledWeights.length ? Math.max(...scaledWeights) : 0;
  const sizeOf = (weight: number) => maxWeight === minWeight ? minSize : minSize + (maxSize - minSize) * scales[scale](Math.min(1, Math.max(0, (weight - minWeight) / (maxWeight - minWeight))));
  const byWeight = (a: CloudItem, b: CloudItem) => b.weight - a.weight || a.label.localeCompare(b.label);

  const sections = [...groups, { id: OTHER, label: otherLabel, tone: 'neutral' as const }].map((group, index) => {
    const members = items.filter(item => groupOf(item) === group.id).sort(byWeight);
    return { index, group, total: members.reduce((sum, item) => sum + item.weight, 0), items: members.map(item => ({ ...item, size: group.scaled === false ? minSize : sizeOf(item.weight) })) };
  }).filter(section => section.items.length);
  if (groupOrder === 'weight') sections.sort((a, b) => b.total - a.total || a.index - b.index);
  const strip = ({ index: _index, ...section }: (typeof sections)[number]): CloudSection => section;
  return {
    cards: sections.filter(section => section.group.layout !== 'row').map(strip),
    rows: sections.filter(section => section.group.layout === 'row').map(strip),
    minWeight, maxWeight,
  };
}

/** Prefers a trailing abbreviation ("… kinase-1 (sFlt-1)" → "sFlt-1"); otherwise drops explanatory brackets. */
export function compactLabel(label: string): string {
  const bracket = label.match(/^(.*\S)\s*\(([^()]*)\)\s*$/);
  if (!bracket) return label;
  const [, head, inner] = bracket;
  return /^[^\s,;]{2,10}$/.test(inner) && /[A-Z]/.test(inner) ? inner : head;
}

export function wrapLabel(label: string, maxChars = 16, maxLines = 3): string[] {
  const lines: string[] = [];
  for (const word of label.split(/\s+/)) {
    const last = lines.at(-1);
    if (last !== undefined && (last + ' ' + word).length <= maxChars) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines.length <= maxLines ? lines : [...lines.slice(0, maxLines - 1), lines.slice(maxLines - 1).join(' ')];
}

export interface PlacedWord {
  item: SizedItem; group?: CloudGroup; lines: string[]; x: number; y: number; width: number; height: number;
  /** Widths each line is fitted to; empty when glyph metrics were measured exactly. */
  lineWidths: number[];
  rotate?: number;
  /** Rotated glyph bounds relative to (x, y), when known. */
  bounds?: { x0: number; y0: number; x1: number; y1: number };
}
export interface PackedCloud { words: PlacedWord[]; viewBox: { x: number; y: number; width: number; height: number } }

export interface PackOptions {
  /** Width:height ratio the spiral favours, e.g. 2 for wide containers, 0.8 for phones. */
  aspect?: number;
  /** Average glyph advance as a fraction of font size; renderers fit text to the estimated width. */
  charWidth?: number;
  lineHeight?: number;
  padding?: number;
  maxChars?: number;
  label?: (item: CloudItem) => string;
  /** Measures rendered text width in px; falls back to charWidth estimates (e.g. during server rendering). */
  measure?: (text: string, size: number) => number;
}

/**
 * Deterministic Archimedean-spiral packing of axis-aligned word boxes, heaviest first from the centre.
 * No randomness, so a given map always produces the same picture — useful as a spatial memory aid.
 */
export function packCloud(sections: CloudSection[], options: PackOptions = {}): PackedCloud {
  const { aspect = 2, charWidth = 0.56, lineHeight = 1.1, padding = 4, maxChars = 16, label = item => item.shortLabel ?? item.label, measure = (text, size) => text.length * size * charWidth } = options;
  const entries = sections.flatMap(section => section.items.map(item => ({ item, group: section.group })))
    .sort((a, b) => b.item.weight - a.item.weight || a.item.label.localeCompare(b.item.label));
  const placed: PlacedWord[] = [];
  const overlaps = (x: number, y: number, w: number, h: number) => placed.some(word =>
    x < word.x + word.width / 2 + padding + w / 2 && x > word.x - word.width / 2 - padding - w / 2 &&
    y < word.y + word.height / 2 + padding + h / 2 && y > word.y - word.height / 2 - padding - h / 2);
  for (const { item, group } of entries) {
    const lines = wrapLabel(label(item), maxChars);
    const lineWidths = lines.map(line => measure(line, item.size));
    const width = Math.max(...lineWidths) + 10, height = lines.length * item.size * lineHeight + 4;
    let x = 0, y = 0;
    for (let t = 0; overlaps(x, y, width, height) && t < 4000; t += 0.05) {
      x = 3 * t * Math.cos(t) * Math.sqrt(aspect);
      y = 3 * t * Math.sin(t) / Math.sqrt(aspect);
    }
    placed.push({ item, group, lines, x, y, width, height, lineWidths });
  }
  const margin = 6;
  const left = Math.min(0, ...placed.map(word => word.x - word.width / 2)) - margin;
  const top = Math.min(0, ...placed.map(word => word.y - word.height / 2)) - margin;
  const right = Math.max(0, ...placed.map(word => word.x + word.width / 2)) + margin;
  const bottom = Math.max(0, ...placed.map(word => word.y + word.height / 2)) + margin;
  return { words: placed, viewBox: { x: left, y: top, width: right - left, height: bottom - top } };
}

export interface TightPackOptions {
  /** CSS font-family the words render in; must match the renderer for collision to be exact. */
  font: string;
  fontWeight?: number;
  aspect?: number;
  padding?: number;
  /** Words at most this many characters may be turned vertical, as in classic word clouds. */
  rotateMaxChars?: number;
  /** Fraction (0–1) of eligible words turned vertical. */
  rotateShare?: number;
  label?: (item: CloudItem) => string;
  canvas?: () => HTMLCanvasElement;
}

const hash = (text: string) => { let value = 2166136261; for (const char of text) value = Math.imul(value ^ char.charCodeAt(0), 16777619); return value >>> 0; };
const seeded = (seed: number) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

type CloudWord = cloud.Word & { entry: { item: SizedItem; group?: CloudGroup }; turn: number; x0?: number; y0?: number; x1?: number; y1?: number };

/**
 * Wordle-style packing against real glyph shapes (via d3-cloud), single-line words with some turned vertical.
 * Browser-only (needs a canvas); seeded from the item ids so a given map always yields the same picture.
 * The board grows until every word fits, because d3-cloud silently drops words that do not.
 */
export function packCloudTight(sections: CloudSection[], options: TightPackOptions): PackedCloud {
  const { font, fontWeight = 600, aspect = 2, padding = 2, rotateMaxChars = 14, rotateShare = 0.35, label = item => item.shortLabel ?? item.label, canvas } = options;
  const entries = sections.flatMap(section => section.items.map(item => ({ item, group: section.group })))
    .sort((a, b) => b.item.weight - a.item.weight || a.item.label.localeCompare(b.item.label));
  if (!entries.length) return { words: [], viewBox: { x: 0, y: 0, width: 0, height: 0 } };
  const seed = hash(entries.map(entry => entry.item.id).join('|'));
  // Keep the two heaviest words horizontal so the focal point always reads naturally.
  const turn = (entry: (typeof entries)[number], index: number) => index > 1 && label(entry.item).length <= rotateMaxChars && hash(entry.item.id) % 1000 < rotateShare * 1000 ? 90 : 0;
  const area = entries.reduce((sum, entry) => sum + label(entry.item).length * 0.6 * entry.item.size * entry.item.size * 1.3, 0);
  let width = Math.max(240, Math.sqrt(area * aspect * 1.6));
  for (let attempt = 0; ; attempt += 1) {
    const height = width / aspect;
    let placed: CloudWord[] = [];
    const layout = cloud<CloudWord>().size([Math.ceil(width), Math.ceil(height)])
      .words(entries.map((entry, index) => ({ entry, turn: turn(entry, index), text: label(entry.item), size: entry.item.size })))
      .font(font).fontWeight(fontWeight).padding(padding).rotate(word => word.turn).fontSize(word => word.size!).text(word => word.text!)
      .spiral('archimedean').random(seeded(seed)).timeInterval(Infinity).on('end', words => { placed = words; });
    if (canvas) layout.canvas(canvas);
    layout.start();
    if (placed.length === entries.length || attempt === 8) {
      const words: PlacedWord[] = placed.map(word => {
        const bounds = { x0: word.x0 ?? 0, y0: word.y0 ?? 0, x1: word.x1 ?? 0, y1: word.y1 ?? 0 };
        return { item: word.entry.item, group: word.entry.group, lines: [word.text!], lineWidths: [], x: word.x!, y: word.y!, rotate: word.rotate, bounds, width: bounds.x1 - bounds.x0, height: bounds.y1 - bounds.y0 };
      });
      const margin = 4;
      const left = Math.min(...words.map(word => word.x + word.bounds!.x0)) - margin, top = Math.min(...words.map(word => word.y + word.bounds!.y0)) - margin;
      const right = Math.max(...words.map(word => word.x + word.bounds!.x1)) + margin, bottom = Math.max(...words.map(word => word.y + word.bounds!.y1)) + margin;
      return { words, viewBox: { x: left, y: top, width: right - left, height: bottom - top } };
    }
    width *= 1.2;
  }
}
