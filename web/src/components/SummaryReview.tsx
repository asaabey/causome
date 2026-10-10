import { memo, useState } from 'react';
import type { ReleaseBundle } from '../data/types';
import { sitePath } from '../data/site';
import SummaryParagraph from './SummaryParagraph';
export interface SummaryReviewData {
  reviewText: string; packet: unknown; feedbackTemplate: unknown;
  feedback: { id: string; tool: string; checkedAt: string; verdict: string; explanation: string; current: boolean; report: string;
    literatureSearch: { performed: boolean; searchedThrough: string | null; coverage: string }; sourcesConsulted: string[];
    issues: { severity: string; description: string; suggestedCorrection: string; sourceUrls: string[] }[] }[];
}
function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}
function SummaryReview({ base, review }: { base: ReleaseBundle; review?: SummaryReviewData }) {
  const [message, setMessage] = useState(''), [editing, setEditing] = useState(false), [paragraphs, setParagraphs] = useState(base.scientificSummary?.paragraphs.map(item => item.text) ?? []), [author, setAuthor] = useState('');
  const summary = base.scientificSummary;
  if (!summary || !review) return <section aria-label="Overall scientific summary" className="curation-binding"><h2>Overall scientific summary</h2><p>This historical snapshot has no embedded summary. Select it with <code>curate preview</code> to create a new summary candidate and review packet.</p></section>;
  async function copy() {
    try { await navigator.clipboard.writeText(review!.reviewText); setMessage('Summary and review prompt copied. Paste them into your external research tool.'); }
    catch { setMessage('Clipboard access is unavailable. Download the review text instead.'); }
  }
  function exportEdit() {
    if (!author.trim() || paragraphs.some(text => !text.trim() || text.split(/\s+/).length > 220 || /[\r\n]/.test(text))) { setMessage('Enter your name and one or two paragraphs of at most 220 words each.'); return; }
    const input = { version: 1, diseaseId: base.diseaseId, baseReleaseId: base.id, baseContentDigest: base.manifest.contentDigest,
      scope: summary!.scope, authoredBy: { id: author.trim(), kind: 'human' }, authoredAt: new Date().toISOString().slice(0, 10),
      paragraphs: paragraphs.map((text, index) => ({ text: text.trim(), claimIds: summary!.paragraphs[index].claimIds })) };
    download(`${JSON.stringify(input, null, 2)}\n`, `${base.diseaseId}-summary-input.json`, 'application/json');
    setMessage('Summary edit exported. Check its claim links, then use curate summarize to create a new snapshot before external review.');
  }
  return <section aria-label="Overall scientific summary" className="curation-binding">
    <h2>Overall scientific summary</h2><p>Check the overall explanation using the summary and prompt below.</p>
    <p>Scope: {summary.scope}</p>{summary.paragraphs.map((paragraph, index) => <SummaryParagraph key={index} text={paragraph.text} entities={base.entities} evidencePath={sitePath(`/diseases/${base.diseaseId}/candidates/${base.id}/`)} />)}
    <p>{summary.authoredBy.kind === 'system' ? 'Automatic extractive draft' : `Draft by ${summary.authoredBy.id}`} · {summary.authoredAt} · Evidence cutoff: {base.evidenceCutoff}</p>
    <button type="button" onClick={copy}>Copy summary and review prompt</button>
    <button type="button" onClick={() => download(review.reviewText, `${base.diseaseId}-summary-review.md`, 'text/markdown')}>Download summary review</button>
    <button type="button" onClick={() => download(`${JSON.stringify(review.packet, null, 2)}\n`, `${base.diseaseId}-summary-packet.json`, 'application/json')}>Export summary packet</button>
    <button type="button" onClick={() => download(`${JSON.stringify(review.feedbackTemplate, null, 2)}\n`, `${base.diseaseId}-summary-feedback.json`, 'application/json')}>Export feedback template</button>
    <details><summary>External review prompt</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{review.reviewText}</pre></details>
    <button type="button" aria-expanded={editing} onClick={() => setEditing(!editing)}>Edit summary draft</button>
    {editing && <div>{paragraphs.map((text, index) => <label key={index}>Summary paragraph {index + 1}<textarea value={text} onChange={event => setParagraphs(current => current.map((item, at) => at === index ? event.target.value : item))} /></label>)}<label>Summary author<input value={author} onChange={event => setAuthor(event.target.value)} /></label><p>Edits retain the listed claim links. Inspect and amend them in the exported JSON when you change the scientific content.</p><button type="button" onClick={exportEdit}>Export summary edit</button><p>Use <code>pnpm curate summarize --base &lt;candidate.json&gt; --input &lt;summary-input.json&gt;</code>, then select the new candidate and review its new packet.</p></div>}
    <p>Record the tool report and its search coverage in the feedback template, then use <code>pnpm curate summary-feedback --base &lt;candidate.json&gt; --input &lt;feedback.json&gt;</code>. Rebuild to display the receipt.</p>
    {!!review.feedback.length && <div><h3>Recorded external feedback</h3>{review.feedback.map(item => <article key={item.id}><h4>{item.tool} · {item.checkedAt}</h4><p>{item.current ? 'Applies to this exact snapshot' : 'Historical feedback: recheck required for this snapshot'} · {item.verdict.replaceAll('_', ' ')}</p><p>{item.explanation}</p><p>{item.literatureSearch.performed ? `Literature searched through ${item.literatureSearch.searchedThrough}` : 'No literature search performed'}. Coverage: {item.literatureSearch.coverage}</p><ul>{item.sourcesConsulted.map(url => <li key={url}><a href={url} target="_blank" rel="noreferrer">Consulted source</a></li>)}</ul><ul>{item.issues.map((issue, index) => <li key={index}>{issue.severity}: {issue.description}<p>Suggested correction: {issue.suggestedCorrection}</p>{issue.sourceUrls.map(url => <a key={url} href={url} target="_blank" rel="noreferrer">Supporting source </a>)}</li>)}</ul><details><summary>Original external report</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{item.report}</pre></details></article>)}</div>}
    <p role="status" aria-live="polite">{message}</p>
  </section>;
}
export default memo(SummaryReview);
