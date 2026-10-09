import { useCallback, useEffect, useMemo, useState } from 'react';
import { Background, BackgroundVariant, MarkerType, Panel, ReactFlow, ReactFlowProvider, useReactFlow, type EdgeChange, type NodeChange } from '@xyflow/react';
import { ArrowRight, Focus, List, Minus, Plus } from 'lucide-react';
import type { ReleaseBundle } from '../data/types';
import { feedbackEdgeIds } from '../lib/graph/geometry';
import EvidenceInspector, { type Selection } from './graph/EvidenceInspector';
import { classPresentation, edgeTypes, humanize, nodeTypes, type BiologicalEdge, type BiologicalNode } from './graph/FlowElements';
import '@xyflow/react/dist/style.css';
import './graph/graph.css';

function ViewportControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return <div className="mechanism-controls" aria-label="Map viewport controls">
    <button type="button" aria-label="Zoom in" onClick={() => void zoomIn({ duration: 0 })}><Plus size={18} aria-hidden="true" /></button>
    <button type="button" aria-label="Zoom out" onClick={() => void zoomOut({ duration: 0 })}><Minus size={18} aria-hidden="true" /></button>
    <button type="button" aria-label="Fit entire map" onClick={() => void fitView({ padding: 0.22, duration: 0, maxZoom: 0.9 })}><Focus size={18} aria-hidden="true" /><span>Fit map</span></button>
  </div>;
}

function GraphWorkspace({ release }: { release: ReleaseBundle }) {
  const view = release.mapViews[0];
  const layout = release.layouts.find(item => item.id === view?.layoutId);
  const entities = useMemo(() => release.entities.filter(item => view?.entityIds.includes(item.id)), [release, view]);
  const relationships = useMemo(() => release.relationships.filter(item => view?.relationshipIds.includes(item.id)), [release, view]);
  const feedbackIds = useMemo(() => feedbackEdgeIds(relationships), [relationships]);
  const [selection, setSelection] = useState<Selection>(() => entities[0] ? { kind: 'entity', id: entities[0].id } : null);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const selectRelationship = useCallback((id: string) => setSelection({ kind: 'relationship', id }), []);
  useEffect(() => { setSelection(entities[0] ? { kind: 'entity', id: entities[0].id } : null); }, [release.id, entities]);

  const nodes = useMemo<BiologicalNode[]>(() => entities.map((entity, index) => {
    const position = layout?.positions.find(item => item.entityId === entity.id) ?? { x: index * 270, y: 160 };
    const presentation = classPresentation[entity.entityClass];
    return {
      id: entity.id, type: 'biological', position: { x: position.x, y: position.y }, data: { entity },
      selected: selection?.kind === 'entity' && selection.id === entity.id,
      draggable: false, connectable: false, deletable: false, focusable: true,
      ariaLabel: `${entity.label}, ${presentation.label}, not assessed. Select to inspect evidence.`,
      style: { width: presentation.width, height: presentation.height },
    };
  }), [entities, layout, selection]);

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
      <div className="mechanism-heading"><div><span className="graph-kicker">Mechanism overview</span><h2>{view?.label ?? release.title}</h2></div><span className="mechanism-count">{entities.length} entities · {relationships.length} relationships</span></div>
      <div className="mechanism-canvas" aria-label="Mechanism diagram. Drag the background to pan; use the buttons to zoom. A complete text outline is available below.">
        <ReactFlow<BiologicalNode, BiologicalEdge> nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => setSelection({ kind: 'entity', id: node.id })}
          onEdgeClick={(_, edge) => setSelection({ kind: 'relationship', id: edge.id })}
          onPaneClick={() => setSelection(null)} nodesDraggable={false} nodesConnectable={false}
          elementsSelectable={true} edgesFocusable={true} nodesFocusable={true} deleteKeyCode={null}
          panOnDrag={true} zoomOnScroll={false} zoomOnPinch={true} minZoom={0.2} maxZoom={1.6}
          fitView fitViewOptions={{ padding: 0.22, maxZoom: 0.9 }} attributionPosition="bottom-right">
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#c7d4cb" />
          <Panel position="top-left"><span className="mechanism-canvas__badge">{release.illustrative ? 'Illustrative · unverified' : humanize(release.status)}</span></Panel>
          <Panel position="bottom-left"><ViewportControls /></Panel>
        </ReactFlow>
      </div>
      <div className="mechanism-legend" aria-label="Map legend"><span><i className="legend-line legend-line--directed" aria-hidden="true" />Directed relationship</span><span><i className="legend-line legend-line--symmetric" aria-hidden="true" />Symmetric association</span><span><i className="legend-neutral" aria-hidden="true" />All scores: not assessed</span></div>
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
    <EvidenceInspector release={release} selection={selection} onSelect={setSelection} />
  </section>;
}

export default function MechanismMap({ release }: { release: ReleaseBundle }) {
  return <ReactFlowProvider><GraphWorkspace release={release} /></ReactFlowProvider>;
}
