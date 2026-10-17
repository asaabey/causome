import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { layoutCloud, packCloud, packCloudTight, type CloudGroup, type CloudItem, type CloudOptions, type PlacedWord, type SizedItem } from '../lib/word-cloud';
import './word-cloud.css';

type Variant = 'cloud' | 'grouped';

interface Props {
  items: CloudItem[];
  groups?: CloudGroup[];
  options?: CloudOptions;
  title: string;
  /** States what size encodes; always shown so size is never read as importance. */
  caption: string;
  /** Unit for counts in badges and accessible names, e.g. ['claim', 'claims']. */
  unit: [singular: string, plural: string];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Suffix for accessible names of selectable items, e.g. 'Show on map.' */
  actionHint?: string;
  showWeights?: boolean;
  defaultOpen?: boolean;
  defaultVariant?: Variant;
  className?: string;
}

// The packed cloud needs a wider size range than the grouped view to read as a cloud; narrow screens trade range for legibility.
const CLOUD_SIZES: CloudOptions = { minSize: 13, maxSize: 54 };
const NARROW_CLOUD_SIZES: CloudOptions = { minSize: 12, maxSize: 34 };

export default function WordCloud({ items, groups = [], options, title, caption, unit, selectedId, onSelect, actionHint, showWeights = true, defaultOpen = true, defaultVariant = 'cloud', className }: Props) {
  const [chosenVariant, setVariant] = useState<Variant>();
  const [narrow, setNarrow] = useState(false);
  const [font, setFont] = useState<string>();
  const rootRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const frame = rootRef.current;
    if (!frame || typeof ResizeObserver === 'undefined') return;
    // Narrow containers get a taller cloud instead of a wide one scaled down to illegible text.
    const observer = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 520));
    observer.observe(frame);
    let cancelled = false;
    // Glyph-level packing needs a canvas and the loaded page font, so it replaces the server-rendered box layout after mount.
    void document.fonts?.ready.then(() => { if (!cancelled) setFont(getComputedStyle(frame).fontFamily); });
    return () => { cancelled = true; observer.disconnect(); };
  }, []);
  // Single-line glyph packing needs width; phones open on the grouped view unless the reader picks the cloud.
  const variant = chosenVariant ?? (narrow ? 'grouped' : defaultVariant);
  const grouped = useMemo(() => layoutCloud(items, groups, options), [items, groups, options]);
  const cloudLayout = useMemo(() => layoutCloud(items, groups, { ...(narrow ? NARROW_CLOUD_SIZES : CLOUD_SIZES), ...options }), [items, groups, options, narrow]);
  const packed = useMemo(() => font ? packCloudTight(cloudLayout.cards, { font, aspect: narrow ? 0.85 : 2.4 }) : packCloud(cloudLayout.cards, narrow ? { aspect: 0.75, maxChars: 12 } : { aspect: 2.2 }), [cloudLayout, narrow, font]);
  if (!grouped.cards.length && !grouped.rows.length) return null;

  const accessibleName = (item: CloudItem) => `${item.label}, ${item.weight} ${item.weight === 1 ? unit[0] : unit[1]}.${onSelect && actionHint ? ` ${actionHint}` : ''}`;
  const chip = (item: SizedItem) => {
    const content = <>{item.label}{showWeights && <sup aria-hidden="true">{item.weight}</sup>}</>;
    const style = { fontSize: `${item.size.toFixed(1)}px` };
    return onSelect
      ? <button key={item.id} type="button" className="word-cloud__word" style={style} aria-pressed={selectedId === item.id} aria-label={accessibleName(item)} onClick={() => onSelect(item.id)}>{content}</button>
      : <span key={item.id} className="word-cloud__word" style={style} aria-label={accessibleName(item)}>{content}</span>;
  };
  const placedWord = (word: PlacedWord) => {
    const { item, lines, lineWidths, x, y, width, height } = word;
    const lineHeight = item.size * 1.1;
    const interactive = onSelect ? {
      role: 'button', tabIndex: 0, 'aria-pressed': selectedId === item.id, onClick: () => onSelect(item.id),
      onKeyDown: (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(item.id); } },
    } : { role: 'img' };
    return <g key={item.id} className={`word-cloud__placed${word.bounds ? ' word-cloud__placed--glyph' : ''} word-cloud--tone-${word.group?.tone ?? 'neutral'}`} aria-label={accessibleName(item)} {...interactive}>
      <title>{item.label}</title>
      {word.bounds
        // Glyph-packed words render exactly as d3-cloud measured them; highlights are glyph-hugging strokes because neighbours touch.
        ? <text fontSize={item.size} transform={`translate(${x},${y}) rotate(${word.rotate ?? 0})`} aria-hidden="true">{lines[0]}</text>
        : <>
        <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx={5} />
        <text fontSize={item.size} aria-hidden="true">
          {/* textLength pins each line to the width the packer reserved, so estimated metrics can never cause overlap. */}
          {lines.map((line, index) => <tspan key={index} x={x} y={y + (index - (lines.length - 1) / 2) * lineHeight} dy=".35em" textLength={lineWidths[index]} lengthAdjust="spacingAndGlyphs">{line}</tspan>)}
        </text>
      </>}
    </g>;
  };
  const rows = grouped.rows.map(({ group, items }) => <div key={group.id} className={`word-cloud__row word-cloud--tone-${group.tone ?? 'neutral'}`} aria-label={group.label}>
    <h3>{group.label}</h3>
    <div className="word-cloud__words">{items.map(chip)}</div>
  </div>);
  const { viewBox } = packed;

  return <details ref={rootRef} className={`word-cloud${className ? ` ${className}` : ''}`} open={defaultOpen}>
    <summary><span className="word-cloud__title">{title}</span><span className="word-cloud__caption">{caption}</span></summary>
    <div className="word-cloud__toggle" role="group" aria-label={`${title} view`}>
      {(['cloud', 'grouped'] as const).map(value => <button key={value} type="button" aria-pressed={variant === value} onClick={() => setVariant(value)}>{value === 'cloud' ? 'Cloud' : 'Grouped'}</button>)}
    </div>
    {variant === 'cloud' ? <>
      <div className="word-cloud__frame">
        <svg className="word-cloud__svg" viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} style={{ maxWidth: `${Math.round(viewBox.width * 1.15)}px` }} role="group" aria-label={title}>
          {[...packed.words].sort((p, q) => Number(p.item.id === selectedId) - Number(q.item.id === selectedId)).map(placedWord)}
        </svg>
      </div>
      {cloudLayout.cards.length > 1 && <ul className="word-cloud__legend" aria-label="Colour key">{cloudLayout.cards.map(({ group }) => <li key={group.id} className={`word-cloud--tone-${group.tone ?? 'neutral'}`}>{group.label}</li>)}</ul>}
    </> : grouped.cards.length > 0 && <div className="word-cloud__cards">
      {grouped.cards.map(({ group, items }) => <section key={group.id} className={`word-cloud__card word-cloud--tone-${group.tone ?? 'neutral'}`} aria-label={group.label}>
        <h3>{group.label}</h3>
        <div className="word-cloud__words">{items.map(chip)}</div>
      </section>)}
    </div>}
    {rows}
  </details>;
}
