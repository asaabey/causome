import type { Entity } from '../data/types';

export interface SummarySegment { text: string; entity?: Entity }

// Display aliases only: these never change the scientific snapshot or review text.
function aliases(entity: Entity): string[] {
  const names = [entity.label, ...entity.synonyms];
  const withoutQualifiers = entity.label.replace(/\s*\([^()]*\)/g, '').trim();
  names.push(withoutQualifiers);
  names.push(...withoutQualifiers.split(' / ').filter(name => /[A-ZΑ-Ω]/u.test(name)));
  for (const match of entity.label.matchAll(/\(([^()]+)\)/g)) {
    if (!/[,/]/.test(match[1]) && /[A-ZΑ-Ω]/u.test(match[1])) names.push(match[1]);
  }
  return [...new Set(names.flatMap(name => [name,
    name.replace(/\bIFN\b/g, 'interferon').replace(/\bDCs\b/g, 'dendritic cells'),
  ]).filter(name => name.trim().length > 1))];
}

function pattern(name: string): string {
  const words = name.trim().split(/[\s\-‐‑–]+/u);
  return words.map((word, index) => {
    const singular = index === words.length - 1 && /^[A-Za-z]+s$/.test(word) && /[a-z]/.test(word)
      ? word.slice(0, -1) : word;
    const escaped = singular.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `${escaped}${singular !== word ? 's?' : ''}`;
  }).join('[\\s\\-‐‑–]+');
}

export function summaryMentions(text: string, entities: Entity[]): SummarySegment[] {
  const targets = new Map<string, Entity | null>();
  for (const entity of entities) for (const alias of aliases(entity)) {
    const key = pattern(alias).toLowerCase();
    if (!targets.has(key)) targets.set(key, entity);
    else if (targets.get(key)?.id !== entity.id) targets.set(key, null);
  }
  const matches: { start: number; end: number; entity: Entity }[] = [];
  for (const [name, entity] of targets) {
    if (!entity) continue; // Ambiguous names do not select an arbitrary entity.
    const expression = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${name})(?![\\p{L}\\p{N}_])`, 'giu');
    for (const match of text.matchAll(expression)) matches.push({ start: match.index!, end: match.index! + match[0].length, entity });
  }
  matches.sort((left, right) => left.start - right.start || right.end - left.end);
  const segments: SummarySegment[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start < cursor) continue;
    if (match.start > cursor) segments.push({ text: text.slice(cursor, match.start) });
    segments.push({ text: text.slice(match.start, match.end), entity: match.entity });
    cursor = match.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}
