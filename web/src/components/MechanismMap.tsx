import { useCallback, useEffect, useMemo, useState } from 'react';
import { Background, BackgroundVariant, MarkerType, Panel, ReactFlow, ReactFlowProvider, useReactFlow, type EdgeChange, type NodeChange } from '@xyflow/react';
import { ArrowRight, Focus, List, Minus, Plus } from 'lucide-react';
import type { Relationship, ReleaseBundle } from '../data/types';
import { feedbackEdgeIds } from '../lib/graph/geometry';
import EvidenceInspector, { type Selection } from './graph/EvidenceInspector';
import { classPresentation, edgeTypes, humanize, nodeTypes, type BiologicalEdge, type BiologicalNode } from './graph/FlowElements';
import '@xyflow/react/dist/style.css';
import './graph/graph.css';

function ViewportControls({ selectedId }: { selectedId?: string }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return <div className="mechanism-controls" aria-label="Map viewport controls">
    <button type="button" aria-label="Zoom in" onClick={() => void zoomIn({ duration: 0 })}><Plus size={18} aria-hidden="true" /></button>
    <button type="button" aria-label="Zoom out" onClick={() => void zoomOut({ duration: 0 })}><Minus size={18} aria-hidden="true" /></button>
    <button type="button" aria-label="Fit entire map" onClick={() => void fitView({ padding: 0.22, duration: 0, maxZoom: 0.9 })}><Focus size={18} aria-hidden="true" /><span>Fit map</span></button>
    <button type="button" disabled={!selectedId} aria-label="Focus selected entity" onClick={() => void fitView({ nodes: [{ id: selectedId! }], padding: 1.2, duration: 0, maxZoom: 1 })}>Focus selection</button>
  </div>;
}

function GraphWorkspace({ release }: { release: ReleaseBundle }) {
  const [viewId, setViewId] = useState(release.mapViews[0]?.id);
  const view = release.mapViews.find(item => item.id === viewId) ?? release.mapViews[0];
  const layout = release.layouts.find(item => item.id === view?.layoutId);
  const entities = useMemo(() => release.entities.filter(item => view?.entityIds.includes(item.id)), [release, view]);
  const relationships = useMemo(() => view.relationshipIds.map(id => release.relationships.find(item => item.id === id)).filter((item): item is Relationship => Boolean(item)), [release, view]);
  const feedbackIds = useMemo(() => feedbackEdgeIds(relationships), [relationships]);
  const [selection, setSelection] = useState<Selection>(() => entities[0] ? { kind: 'entity', id: entities[0].id } : null);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const selectRelationship = useCallback((id: string) => setSelection({ kind: 'relationship', id }), []);
  useEffect(() => { setViewId(release.mapViews[0]?.id); setSelection(release.entities[0] ? { kind: 'entity', id: release.entities[0].id } : null); }, [release]);
  const inspect = useCallback((next: Selection) => {
    if (next && ((next.kind === 'entity' && !view.entityIds.includes(next.id)) || (next.kind === 'relationship' && !view.relationshipIds.includes(next.id)))) {
      const complete = release.mapViews.find(item => item.entityIds.length === release.entities.length);
      if (complete) setViewId(complete.id);
    }
    setSelection(next);
  }, [release, view]);

  const nodes = useMemo<BiologicalNode[]>(() => entities.map((entity, index) => {
    const position = layout?.positions.find(item => item.entityId === entity.id) ?? { x: index * 270, y: 160 };
    const presentation = classPresentation[entity.entityClass];
    return {
      id: entity.id, type: 'biological', position: { x: position.x, y: position.y }, data: { entity, therapyCount: release.therapies.filter(item => item.directTargetIds.includes(entity.id)).length },
      selected: selection?.kind === 'entity' && selection.id === entity.id,
      draggable: false, connectable: false, deletable: false, focusable: true,
      ariaLabel: `${entity.label}, ${presentation.label}, not assessed. Select to inspect evidence and linked interventions.`,
      style: { width: presentation.width, height: presentation.height },
    };
  }), [entities, layout, selection, release]);

  const edges = useMemo<BiologicalEdge[]>(() => relationships.map(relationship => {
    const source = entities.find(item => item.id === relationship.sourceId);
    const target = entities.find(item => item.id === relationship.targetId);
    return {
      id: relationship.id, type: 'biological', source: relationship.sourceId, target: relationship.targetId,
      data: { relationship, feedback: feedbackIds.has(relationship.id), onSelect: selectRelationship }, selected: selection?.kind === 'relationship' && selection.id === relationship.id,
      markerEnd: relationship.directionality === 'directed' ? { type: MarkerType.ArrowClosed, color: '#788f86', width: 18, height: 18 } : undefined,
      focusable: true, deletable: false, reconnectable: false,
      ariaLabel: `${source?.label} ${humanize(relationship.predicate)} ${target?.label}, ${relationship.directionality}, unassessed. Select to inspect evidence.`,
    };
  }), [relationships, entities, selection, selectRelationship, feedbackIds]);

  const onNodesChange = useCallback((changes: NodeChange<BiologicalNode>[]) => {
    const selected = changes.find(change => change.type === 'select' && change.selected);
    if (selected?.type === 'select') setSelection({ kind: 'entity', id: selected.id });
  }, []);
  const onEdgesChange = useCallback((changes: EdgeChange<BiologicalEdge>[]) => {
    const selected = changes.find(change => change.type === 'select' && change.selected);
    if (selected?.type === 'select') setSelection({ kind: 'relationship', id: selected.id });
  }, []);

  return <section className="mechanism-workspace" aria-label="Interactive mechanism map">
    <div className="mechanism-main">
      <div className="mechanism-heading"><div><span className="graph-kicker">Mechanism overview</span><h2>{view?.label ?? release.title}</h2></div><span className="mechanism-count">Showing {entities.length}/{release.entities.length} entities · {relationships.length}/{release.relationships.length} relationships</span></div>
      {release.mapViews.length > 1 && <div className="mechanism-view-picker"><label htmlFor="mechanism-view">Explore a route</label><select id="mechanism-view" value={view.id} onChange={event => { setViewId(event.target.value); setSelection(null); }}>{release.mapViews.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select><a href="#mechanism-outline">Complete evidence outline</a></div>}
      {release.therapies.length > 0 && <div className="mechanism-therapies" aria-label="Explore therapies"><span className="graph-kicker">Interventions</span>{release.therapies.map(item => <button key={item.id} type="button" aria-pressed={selection?.kind === 'therapy' && selection.id === item.id} onClick={() => setSelection({ kind: 'therapy', id: item.id })}>{item.name.split(' (')[0]}<small>{humanize(item.developmentStatus)}</small></button>)}</div>}
      <div className="mechanism-canvas" aria-label="Mechanism diagram. Drag the background to pan; use the buttons to zoom. A complete text outline is available below.">
        <ReactFlow<BiologicalNode, BiologicalEdge> key={view.id} nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => setSelection({ kind: 'entity', id: node.id })}
          onEdgeClick={(_, edge) => setSelection({ kind: 'relationship', id: edge.id })}
          onPaneClick={() => setSelection(null)} nodesDraggable={false} nodesConnectable={false}
          elementsSelectable={true} edgesFocusable={true} nodesFocusable={true} deleteKeyCode={null}
          panOnDrag={true} zoomOnScroll={false} zoomOnPinch={true} minZoom={0.2} maxZoom={1.6}
          fitView fitViewOptions={{ padding: 0.22, maxZoom: 0.9 }} attributionPosition="bottom-right">
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#c7d4cb" />
          <Panel position="top-left"><span className="mechanism-canvas__badge">{release.illustrative ? 'Illustrative · unverified' : humanize(release.status)}</span></Panel>
          <Panel position="bottom-left"><ViewportControls selectedId={selection?.kind === 'entity' ? selection.id : undefined} /></Panel>
        </ReactFlow>
      </div>
      <div className="mechanism-legend" aria-label="Map legend"><span><i className="legend-line legend-line--directed" aria-hidden="true" />Arrow: directed relationship</span><span><i className="legend-line legend-line--symmetric" aria-hidden="true" />Dotted: symmetric association</span><span>Dashed: indirect or context-dependent</span><span><i className="legend-neutral" aria-hidden="true" />All scores: not assessed</span><span>Rx: direct-target therapy count</span><span>↺: cycle-closing connection</span></div>
      <details className="mechanism-shape-legend"><summary>Biological shapes & reading the overview</summary><p>Use zoom or Focus selection to read a mediator. Position groups biological routes and does not assign importance.</p><ul>{Object.entries(classPresentation).filter(([key]) => entities.some(item => item.entityClass === key)).map(([key, value]) => <li key={key}>{value.label}: {value.shape === 'rectangle' && key === 'process' ? 'dashed rectangle' : value.shape}</li>)}</ul></details>
      <div className="mechanism-outline">
        <button className="mechanism-outline__toggle" type="button" aria-expanded={outlineOpen} aria-controls="mechanism-text-outline" onClick={() => setOutlineOpen(value => !value)}><List size={17} aria-hidden="true" /><span>Explore the text outline</span><span className="mechanism-outline__toggle-hint">{outlineOpen ? 'Hide' : 'Show'} all entities & relationships</span></button>
        <div className="mechanism-outline__body" id="mechanism-text-outline" hidden={!outlineOpen}>
          <div><h3>Entities</h3><ul>{entities.map(entity => <li key={entity.id}><button type="button" onClick={() => setSelection({ kind: 'entity', id: entity.id })} aria-pressed={selection?.kind === 'entity' && selection.id === entity.id}><span><strong>{entity.label}</strong><small>{classPresentation[entity.entityClass].label} · Not assessed</small></span><ArrowRight size={16} aria-hidden="true" /></button></li>)}</ul></div>
          <div><h3>Relationships</h3><ul>{relationships.map(relationship => {
            const source = entities.find(item => item.id === relationship.sourceId);
            const target = entities.find(item => item.id === relationship.targetId);
            return <li key={relationship.id}><button type="button" onClick={() => selectRelationship(relationship.id)} aria-pressed={selection?.kind === 'relationship' && selection.id === relationship.id}><span><strong>{source?.label} {relationship.directionality === 'symmetric' ? '—' : '→'} {target?.label}</strong><small>{humanize(relationship.predicate)} · {relationship.directionality} · Not assessed</small></span><ArrowRight size={16} aria-hidden="true" /></button></li>;
          })}</ul></div>
        </div>
      </div>
    </div>
    <EvidenceInspector release={release} selection={selection} onSelect={inspect} />
  </section>;
}

export default function MechanismMap({ release }: { release: ReleaseBundle }) {
  return <ReactFlowProvider><GraphWorkspace release={release} /></ReactFlowProvider>;
}
