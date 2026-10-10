import { useState } from 'react';
import type { ReleaseBundle } from '../data/types';
import { versionChanges } from '../lib/comparison';

export default function VersionComparison({ versions, diseaseId, basePath, currentReleaseId }: { versions: ReleaseBundle[]; diseaseId: string; basePath: string; currentReleaseId: string }) {
  const [beforeId, setBeforeId] = useState(versions.find(item => item.id !== currentReleaseId)?.id ?? currentReleaseId), [afterId, setAfterId] = useState(currentReleaseId);
  const before = versions.find(item => item.id === beforeId)!, after = versions.find(item => item.id === afterId)!;
  const changes = versionChanges(before, after);
  const link = (version: ReleaseBundle, fragment = '') => `${basePath}diseases/${diseaseId}/${['approved','published'].includes(version.status) ? 'releases' : 'candidates'}/${version.id}/${fragment}`;
  return <div className="comparison-workspace">
    <div className="comparison-pickers"><label>Before<select value={beforeId} onChange={event => setBeforeId(event.target.value)}>{versions.map(item => <option key={item.id} value={item.id}>{item.id} · {item.status}</option>)}</select></label><label>After<select value={afterId} onChange={event => setAfterId(event.target.value)}>{versions.map(item => <option key={item.id} value={item.id}>{item.id} · {item.status}</option>)}</select></label></div>
    <p role="status" aria-live="polite">{beforeId === afterId ? 'Choose two different versions to compare. Candidate versions require domain review.' : `${changes.length} changed records. Each side retains its own evidence and context.`}</p>
    <div className="comparison-identities"><p><a href={link(before)}>Read before snapshot</a><small>{before.manifest.contentDigest}</small></p><p><a href={link(after)}>Read after snapshot</a><small>{after.manifest.contentDigest}</small></p></div>
    {changes.map(change => <article className="comparison-change" key={`${change.collection}-${change.id}`}><p className="record-label">{change.collection} · {change.kind}</p><h2>{change.id}</h2><p>Changed fields: {change.fields.join(', ')}</p>
      <details><summary>Inspect before and after records</summary><div className="comparison-records"><div><h3>Before</h3><pre>{change.before ? JSON.stringify(change.before, null, 2) : 'Absent'}</pre></div><div><h3>After</h3><pre>{change.after ? JSON.stringify(change.after, null, 2) : 'Absent'}</pre></div></div></details>
      {change.collection === 'claims' && <p><a href={link(change.after ? after : before, `#claim-${change.id}`)}>Read this claim’s source evidence</a></p>}
      {change.collection === 'relationships' && <p><a href={link(change.after ? after : before, `#relationship-${change.id}`)}>Inspect supporting, qualifying and contradicting claims</a></p>}
    </article>)}
  </div>;
}
