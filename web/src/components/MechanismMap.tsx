import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Background, BackgroundVariant, MarkerType, Panel, ReactFlow, ReactFlowProvider, useReactFlow, type EdgeChange, type NodeChange } from '@xyflow/react';
import { ArrowRight, Focus, List, Minus, Plus } from 'lucide-react';
import type { Relationship, ReleaseBundle } from '../data/types';
import { feedbackEdgeIds } from '../lib/graph/geometry';
import EvidenceInspector, { type Selection } from './graph/EvidenceInspector';
import MechanismSearch from './graph/MechanismSearch';
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
  const [groupState, setGroupState] = useState<Record<string, boolean>>({});
  const hiddenIds = useMemo(() => new Set((view.groups ?? []).filter(group => groupState[`${view.id}:${group.id}`] ?? group.collapsed).flatMap(group => group.entityIds)), [view, groupState]);
  const entities = useMemo(() => release.entities.filter(item => view?.entityIds.includes(item.id) && !hiddenIds.has(item.id)), [release, view, hiddenIds]);
  const relationships = useMemo(() => view.relationshipIds.map(id => release.relationships.find(item => item.id === id)).filter((item): item is Relationship => Boolean(item) && !hiddenIds.has(item!.sourceId) && !hiddenIds.has(item!.targetId)), [release, view, hiddenIds]);
  const feedbackIds = useMemo(() => feedbackEdgeIds(relationships), [relationships]);
  const [selection, setSelection] = useState<Selection>(() => entities[0] ? { kind: 'entity', id: entities[0].id } : null);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const workspaceRef = useRef<HTMLElement>(null);
  const [evidenceRequest, setEvidenceRequest] = useState(0);
  const selectedRelationship = selection?.kind === 'relationship' ? release.relationships.find(item => item.id === selection.id) : undefined;
  const selectionAnnouncement = selection?.kind === 'entity' ? release.entities.find(item => item.id === selection.id)?.label
    : selection?.kind === 'therapy' ? release.therapies.find(item => item.id === selection.id)?.name
    : selectedRelationship ? `${release.entities.find(item => item.id === selectedRelationship.sourceId)?.label} ${humanize(selectedRelationship.predicate)} ${release.entities.find(item => item.id === selectedRelationship.targetId)?.label}, ${selectedRelationship.directionality}` : undefined;
  const selectRelationship = useCallback((id: string) => setSelection({ kind: 'relationship', id }), []);
  useEffect(() => {
    setViewId(release.mapViews[0]?.id);
    setGroupState({});
    const initial = release.mapViews[0];
    const hidden = new Set((initial.groups ?? []).filter(group => group.collapsed).flatMap(group => group.entityIds));
    const first = release.entities.find(item => initial.entityIds.includes(item.id) && !hidden.has(item.id));
    setSelection(first ? { kind: 'entity', id: first.id } : null);
  }, [release]);
  useEffect(() => {
    if (!evidenceRequest) return;
    const inspector = workspaceRef.current?.querySelector<HTMLElement>('#evidence-inspector');
    inspector?.focus({ preventScroll: true });
    inspector?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [evidenceRequest]);
  const inspect = useCallback((next: Selection, readEvidence = false) => {
    let nextView = view;
    if (next && ((next.kind === 'entity' && !view.entityIds.includes(next.id)) || (next.kind === 'relationship' && !view.relationshipIds.includes(next.id)))) {
      const complete = release.mapViews.find(item => next.kind === 'entity' ? item.entityIds.includes(next.id) : item.relationshipIds.includes(next.id));
      if (complete) { nextView = complete; setViewId(complete.id); }
    }
    const edge = next?.kind === 'relationship' ? release.relationships.find(item => item.id === next.id) : undefined;
    const reveal = next?.kind === 'entity' ? [next.id] : edge ? [edge.sourceId, edge.targetId] : [];
    setGroupState(current => {
      const expand = (nextView.groups ?? []).filter(group => (current[`${nextView.id}:${group.id}`] ?? group.collapsed) && group.entityIds.some(id => reveal.includes(id)));
      return expand.length ? { ...current, ...Object.fromEntries(expand.map(group => [`${nextView.id}:${group.id}`, false])) } : current;
    });
    setSelection(next);
    if (readEvidence) setEvidenceRequest(value => value + 1);
  }, [release, view]);

  const baseNodes = useMemo<BiologicalNode[]>(() => entities.map((entity, index) => {
    const position = layout?.positions.find(item => item.entityId === entity.id) ?? { x: index * 270, y: 160 };
    const presentation = classPresentation[entity.entityClass];
    const assessment = release.assessments.find(item => item.subjectId === entity.id && view.assessmentIds.includes(item.id));
    const scale = assessment?.weightTier == null ? 1 : Math.sqrt([1, 1.5, 2, 3, 4][assessment.weightTier]);
    return {
      id: entity.id, type: 'biological', position: { x: position.x, y: position.y }, data: { entity, assessment, width: presentation.width * scale, height: presentation.height * scale, therapyCount: release.therapies.filter(item => item.directTargetIds.includes(entity.id)).length },
      selected: false,
      draggable: false, connectable: false, deletable: false, focusable: true,
      ariaLabel: `${entity.label}, ${presentation.label}, ${assessment?.appraisalProvenance ? 'provisional, ' : ''}weight ${assessment?.mechanisticWeight ?? 'not assessed'}, confidence ${assessment?.evidenceConfidence ?? 'not assessed'}. Select to inspect evidence and linked interventions.`,
      style: { width: presentation.width * scale, height: presentation.height * scale },
    };
  }), [entities, layout, release, view]);
  const nodes = useMemo(() => baseNodes.map(node => ({ ...node, selected: selection?.kind === 'entity' && selection.id === node.id })), [baseNodes, selection]);

  const baseEdges = useMemo<BiologicalEdge[]>(() => relationships.map(relationship => {
    const source = entities.find(item => item.id === relationship.sourceId);
    const target = entities.find(item => item.id === relationship.targetId);
    const assessment = release.assessments.find(item => item.id === relationship.assessmentId);
    return {
      id: relationship.id, type: 'biological', source: relationship.sourceId, target: relationship.targetId,
      data: { relationship, assessment, feedback: feedbackIds.has(relationship.id), onSelect: selectRelationship }, selected: false,
      markerEnd: relationship.directionality === 'directed' ? { type: MarkerType.ArrowClosed, color: '#788f86', width: 18, height: 18 } : undefined,
      focusable: true, deletable: false, reconnectable: false,
      ariaLabel: `${source?.label} ${humanize(relationship.predicate)} ${target?.label}, ${relationship.directionality}, ${assessment?.appraisalProvenance ? 'provisional, ' : ''}weight ${assessment?.mechanisticWeight ?? 'not assessed'}, confidence ${assessment?.evidenceConfidence ?? 'not assessed'}. Select to inspect evidence.`,
    };
  }), [relationships, entities, selectRelationship, feedbackIds, release]);
  const edges = useMemo(() => baseEdges.map(edge => ({ ...edge, selected: selection?.kind === 'relationship' && selection.id === edge.id })), [baseEdges, selection]);

  const onNodesChange = useCallback((changes: NodeChange<BiologicalNode>[]) => {
    const selected = changes.find(change => change.type === 'select' && change.selected);
    if (selected?.type === 'select') setSelection({ kind: 'entity', id: selected.id });
  }, []);
  const onEdgesChange = useCallback((changes: EdgeChange<BiologicalEdge>[]) => {
    const selected = changes.find(change => change.type === 'select' && change.selected);
    if (selected?.type === 'select') setSelection({ kind: 'relationship', id: selected.id });
  }, []);

  return <section ref={workspaceRef} className="mechanism-workspace" aria-label="Interactive mechanism map">
    <p className="graph-sr-only" role="status" aria-live="polite" aria-atomic="true">{selectionAnnouncement ? `Selected ${selectionAnnouncement}. Evidence is available in the evidence inspector.` : 'No selection. Select an entity, relationship or therapy.'}</p>
    <div className="mechanism-main">
      <div className="mechanism-heading"><div><span className="graph-kicker">Mechanism overview</span><h2>{view?.label ?? release.title}</h2></div><span className="mechanism-count">Showing {entities.length}/{release.entities.length} entities · {relationships.length}/{release.relationships.length} relationships</span></div>
      {release.mapViews.length > 1 && <div className="mechanism-view-picker"><label htmlFor="mechanism-view">Explore a route</label><select id="mechanism-view" value={view.id} onChange={event => { setViewId(event.target.value); setSelection(null); }}>{release.mapViews.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select><a href="#mechanism-outline">Complete evidence outline</a></div>}
      <MechanismSearch release={release} onSelect={next => inspect(next, true)} />
      {!!view.groups?.length && <div className="mechanism-groups" aria-label="Mechanism groups">{view.groups.map(group => {
        const collapsed = groupState[`${view.id}:${group.id}`] ?? group.collapsed;
        return <button type="button" key={group.id} aria-expanded={!collapsed} onClick={() => {
          setGroupState(current => ({ ...current, [`${view.id}:${group.id}`]: !collapsed }));
          if (!collapsed && selection && ((selection.kind === 'entity' && group.entityIds.includes(selection.id)) || (selection.kind === 'relationship' && [selectedRelationship?.sourceId, selectedRelationship?.targetId].some(id => id && group.entityIds.includes(id))))) setSelection(null);
        }}>{collapsed ? 'Expand' : 'Collapse'} {group.label}<small>{group.entityIds.length} entities · {group.entityIds.map(id => release.entities.find(item => item.id === id)?.label).join(', ')}</small></button>;
      })}</div>}
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
      <div className="mechanism-selection"><p>{selectionAnnouncement ? <><span className="graph-kicker">Selected</span>{selectionAnnouncement}</> : 'Select an entity, relationship or therapy to read its evidence.'}</p><button type="button" disabled={!selection} onClick={() => setEvidenceRequest(value => value + 1)}>Read selected evidence<ArrowRight size={16} aria-hidden="true" /></button></div>
      <div className="mechanism-legend" aria-label="Map legend"><span><i className="legend-line legend-line--directed" aria-hidden="true" />Arrow: directed relationship</span><span><i className="legend-line legend-line--symmetric" aria-hidden="true" />Dotted line: symmetric association</span><span>Dashed line: indirect or context-dependent</span><span><i className="legend-neutral" aria-hidden="true" />{release.assessments.some(item => item.mechanisticWeight !== null || item.evidenceConfidence !== null) ? `${release.assessments.some(item => item.appraisalProvenance) ? 'Provisional · ' : ''}Area: weight tier · Outline: confidence tier (0 dotted, 1 dashed, 2 solid, 3 double, 4 heavy)` : 'All scores: not assessed'}</span><span>Rx: direct-target therapy count</span><span>↺: cycle-closing connection</span></div>
      <details className="mechanism-shape-legend"><summary>Biological shapes & reading the overview</summary><p>Use zoom or Focus selection to read a mediator. Position groups biological routes and does not assign importance.</p><ul>{Object.entries(classPresentation).filter(([key]) => entities.some(item => item.entityClass === key)).map(([key, value]) => <li key={key}>{value.label}: {value.shape === 'rectangle' && key === 'process' ? 'dashed rectangle' : value.shape}</li>)}</ul></details>
      <div className="mechanism-outline">
        <button className="mechanism-outline__toggle" type="button" aria-expanded={outlineOpen} aria-controls="mechanism-text-outline" onClick={() => setOutlineOpen(value => !value)}><List size={17} aria-hidden="true" /><span>Explore the text outline</span><span className="mechanism-outline__toggle-hint">{outlineOpen ? 'Hide' : 'Show'} entities & relationships in this route</span></button>
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
    <EvidenceInspector release={release} contextId={view.contextId} assessmentIds={view.assessmentIds} selection={selection} onSelect={next => inspect(next, true)} />
  </section>;
}

export default function MechanismMap({ release }: { release: ReleaseBundle }) {
  return <ReactFlowProvider><GraphWorkspace release={release} /></ReactFlowProvider>;
}
