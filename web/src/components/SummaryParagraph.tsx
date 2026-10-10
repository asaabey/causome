import type { Entity } from '../data/types';
import { summaryMentions } from '../lib/summary-mentions';

export default function SummaryParagraph({ text, entities, evidencePath = '' }: { text: string; entities: Entity[]; evidencePath?: string }) {
  return <p>{summaryMentions(text, entities).map((segment, index) => segment.entity
    ? <strong key={index}><a href={`${evidencePath}#entity-${segment.entity.id}`} title={`View ${segment.entity.label} and linked evidence`}>{segment.text}</a></strong>
    : segment.text)}</p>;
}
