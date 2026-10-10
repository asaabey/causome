import { useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import type { ReleaseBundle } from '../../data/types';
import type { Selection } from './EvidenceInspector';
import { classPresentation, humanize } from './FlowElements';

export default function MechanismSearch({ release, onSelect }: { release: ReleaseBundle; onSelect: (selection: Selection) => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (values: string[]) => terms.every(term => values.join(' ').toLowerCase().includes(term));
  const entities = terms.length ? release.entities.filter(item => matches([item.label, ...item.synonyms])) : [];
  const therapies = terms.length ? release.therapies.filter(item => matches([item.name])) : [];
  const count = entities.length + therapies.length;

  return <div className="mechanism-search" role="search" aria-label="Search this atlas">
    <label htmlFor="mechanism-search">Find a mediator or therapy</label>
    <div className="mechanism-search__field">
      <Search size={17} aria-hidden="true" />
      <input ref={inputRef} id="mechanism-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try BLyS or belimumab" aria-describedby="mechanism-search-help" />
      {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); inputRef.current?.focus(); }}><X size={17} aria-hidden="true" /></button>}
    </div>
    <p id="mechanism-search-help">Search names and synonyms across every route. Choose a result to read its evidence.</p>
    <p className="mechanism-search__status" role="status" aria-live="polite" aria-atomic="true">{terms.length ? count ? `${count} ${count === 1 ? 'result' : 'results'} in this atlas.` : 'No matches in this atlas. Try another name or synonym.' : ''}</p>
    {count > 0 && <ul className="mechanism-search__results" aria-label="Search results">
      {entities.map(item => <li key={item.id}><button type="button" onClick={() => onSelect({ kind: 'entity', id: item.id })}><span><strong>{item.label}</strong><small>{classPresentation[item.entityClass].label}{item.synonyms.length > 0 && ` · Also known as ${item.synonyms.join(', ')}`}</small></span><ArrowRight size={16} aria-hidden="true" /></button></li>)}
      {therapies.map(item => <li key={item.id}><button type="button" onClick={() => onSelect({ kind: 'therapy', id: item.id })}><span><strong>{item.name}</strong><small>Therapy · {humanize(item.developmentStatus)}</small></span><ArrowRight size={16} aria-hidden="true" /></button></li>)}
    </ul>}
  </div>;
}
