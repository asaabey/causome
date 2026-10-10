import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, Handle, Position, useInternalNode, type Edge, type EdgeProps, type Node, type NodeProps } from '@xyflow/react';
import type { Assessment, Entity, EntityClass, Relationship } from '../../data/types';
import { edgeGeometry, polygonPoints, type Shape, type ShapeBox } from '../../lib/graph/geometry';

export const classPresentation: Record<EntityClass, { label: string; shape: Shape; width: number; height: number }> = {
  cytokine: { label: 'Cytokine', shape: 'diamond', width: 190, height: 144 },
  cell: { label: 'Cell', shape: 'capsule', width: 184, height: 106 },
  antibody: { label: 'Antibody / complex', shape: 'hexagon', width: 192, height: 112 },
  immune_complex: { label: 'Immune complex', shape: 'hexagon', width: 192, height: 112 },
  process: { label: 'Process', shape: 'rectangle', width: 184, height: 106 },
  clinical_outcome: { label: 'Clinical outcome', shape: 'octagon', width: 190, height: 120 },
  receptor: { label: 'Receptor / sensor', shape: 'ellipse', width: 190, height: 112 },
  substrate: { label: 'Biological substrate', shape: 'parallelogram', width: 190, height: 112 },
  genetic_variant: { label: 'Genetic variant', shape: 'rectangle', width: 190, height: 112 },
  protein: { label: 'Protein', shape: 'ellipse', width: 190, height: 112 },
  gene: { label: 'Gene', shape: 'rectangle', width: 190, height: 112 },
  metabolite: { label: 'Metabolite', shape: 'diamond', width: 190, height: 144 },
  pathogen: { label: 'Pathogen', shape: 'hexagon', width: 192, height: 112 },
  tissue: { label: 'Tissue', shape: 'capsule', width: 184, height: 106 },
};

export const humanize = (value: string) => value.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ');
export type BiologicalNode = Node<{ entity: Entity; assessment?: Assessment; width?: number; height?: number; therapyCount?: number }, 'biological'>;
export type BiologicalEdge = Edge<{ relationship: Relationship; assessment?: Assessment; feedback: boolean; onSelect: (id: string) => void }, 'biological'>;

export const BiologicalNodeView = memo(function BiologicalNodeView({ data, selected }: NodeProps<BiologicalNode>) {
  const presentation = classPresentation[data.entity.entityClass];
  const { shape } = presentation;
  const width = data.width ?? presentation.width, height = data.height ?? presentation.height;
  const confidence = data.assessment?.evidenceConfidence;
  const inset = 3;
  const points = shape === 'capsule' ? '' : polygonPoints(shape, width - inset * 2, height - inset * 2).map(point => `${point.x + inset},${point.y + inset}`).join(' ');
  const silhouette = shape === 'ellipse' ? <ellipse cx={width / 2} cy={height / 2} rx={(width - 6) / 2} ry={(height - 6) / 2} /> : shape === 'capsule'
    ? <rect x={inset} y={inset} width={width - inset * 2} height={height - inset * 2} rx={(height - inset * 2) / 2} /> : <polygon points={points} />;
  return (
    <div className={`biological-node biological-node--${shape} biological-node--${data.entity.entityClass}${confidence != null ? ` confidence-${confidence}` : ''}${selected ? ' is-selected' : ''}`} style={{ width, height }}>
      <svg className="biological-node__silhouette" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        {silhouette}
        {confidence === 3 && <g className="biological-node__inner-ring" transform={`translate(${width * .035},${height * .035}) scale(.93)`}>{silhouette}</g>}
      </svg>
      <div className="biological-node__copy">
        <span className="biological-node__class">{presentation.label}</span>
        <span className="biological-node__label">{data.entity.label}</span>
        <span className="biological-node__assessment">{data.assessment?.mechanisticWeight == null && confidence == null ? 'Not assessed' : `W ${data.assessment?.mechanisticWeight ?? '—'} · C ${confidence ?? '—'}`}</span>
      </div>
      {Boolean(data.therapyCount) && <span className="biological-node__rx">Rx {data.therapyCount}</span>}
      <Handle type="source" position={Position.Right} className="biological-node__handle" isConnectable={false} />
      <Handle type="target" position={Position.Left} className="biological-node__handle" isConnectable={false} />
    </div>
  );
});

export const BiologicalEdgeView = memo(function BiologicalEdgeView({ id, source, target, data, selected, markerEnd }: EdgeProps<BiologicalEdge>) {
  const sourceNode = useInternalNode<BiologicalNode>(source);
  const targetNode = useInternalNode<BiologicalNode>(target);
  if (!sourceNode || !targetNode || !data) return null;
  const box = (node: typeof sourceNode): ShapeBox => {
    const presentation = classPresentation[node.data.entity.entityClass];
    const width = node.measured.width ?? presentation.width;
    const height = node.measured.height ?? presentation.height;
    // Match the inset SVG silhouette rather than the rectangular node wrapper.
    return { x: node.internals.positionAbsolute.x + 3, y: node.internals.positionAbsolute.y + 3, width: width - 6, height: height - 6, shape: presentation.shape };
  };
  const symmetric = data.relationship.directionality === 'symmetric';
  const geometry = edgeGeometry(box(sourceNode), box(targetNode), symmetric, data.feedback);
  const predicate = humanize(data.relationship.predicate);
  return (
    <>
      <BaseEdge id={id} path={geometry.path} markerEnd={symmetric ? undefined : markerEnd} interactionWidth={28}
        style={{ stroke: selected ? '#1b655b' : '#788f86', strokeWidth: selected ? 2.6 : data.assessment?.evidenceConfidence == null ? 1.7 : [1, 1.5, 2, 3, 4][data.assessment.evidenceConfidence], strokeDasharray: symmetric ? '4 6' : data.relationship.provisional !== false ? '8 5' : undefined }} />
      <EdgeLabelRenderer>
        <button type="button" className={`mechanism-edge-label nodrag nopan${selected ? ' is-selected' : ''}`}
          style={{ transform: `translate(-50%, -50%) translate(${geometry.label.x}px,${geometry.label.y}px)` }}
          tabIndex={-1} onClick={() => data.onSelect(id)} aria-label={`${sourceNode.data.entity.label} ${predicate} ${targetNode.data.entity.label}, ${data.relationship.directionality}${geometry.feedback ? ', feedback' : ''}: inspect relationship evidence`} aria-pressed={Boolean(selected)}>
          {predicate}{geometry.feedback && <span className="mechanism-edge-label__feedback"> ↺</span>}
        </button>
      </EdgeLabelRenderer>
    </>
  );
});

export const nodeTypes = { biological: BiologicalNodeView };
export const edgeTypes = { biological: BiologicalEdgeView };
