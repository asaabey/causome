/** Geometry shared by SVG node silhouettes and edge clipping. All coordinates are flow-space. */
export type Shape = 'diamond' | 'capsule' | 'hexagon' | 'rectangle' | 'octagon' | 'ellipse' | 'parallelogram';
export interface Point { x: number; y: number }
export interface ShapeBox extends Point { width: number; height: number; shape: Shape }

export function center(box: ShapeBox): Point {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

export function polygonPoints(shape: Exclude<Shape, 'capsule'>, width: number, height: number): Point[] {
  switch (shape) {
    case 'diamond': return [{ x: width / 2, y: 0 }, { x: width, y: height / 2 }, { x: width / 2, y: height }, { x: 0, y: height / 2 }];
    case 'hexagon': return [{ x: width / 5, y: 0 }, { x: width * 4 / 5, y: 0 }, { x: width, y: height / 2 }, { x: width * 4 / 5, y: height }, { x: width / 5, y: height }, { x: 0, y: height / 2 }];
    case 'parallelogram': return [{ x: width * .15, y: 0 }, { x: width, y: 0 }, { x: width * .85, y: height }, { x: 0, y: height }];
    case 'octagon': {
      const cut = Math.min(width, height) * 0.24;
      return [{ x: cut, y: 0 }, { x: width - cut, y: 0 }, { x: width, y: cut }, { x: width, y: height - cut }, { x: width - cut, y: height }, { x: cut, y: height }, { x: 0, y: height - cut }, { x: 0, y: cut }];
    }
    default: return [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }];
  }
}

const cross = (a: Point, b: Point) => a.x * b.y - a.y * b.x;

/** Intersect a ray from the shape center toward a point with the actual silhouette. */
export function boundaryPoint(box: ShapeBox, toward: Point): Point {
  const origin = center(box);
  const direction = { x: toward.x - origin.x, y: toward.y - origin.y };
  if (Math.abs(direction.x) + Math.abs(direction.y) < 1e-8) return { x: origin.x + box.width / 2, y: origin.y };

  if (box.shape === 'ellipse') {
    const t = 1 / Math.hypot(direction.x / (box.width / 2), direction.y / (box.height / 2));
    return { x: origin.x + direction.x * t, y: origin.y + direction.y * t };
  }

  if (box.shape === 'capsule') {
    // The SVG capsule is a rounded rectangle with radius min(width,height)/2.
    const radius = Math.min(box.width, box.height) / 2;
    const halfStraightX = box.width / 2 - radius;
    const halfStraightY = box.height / 2 - radius;
    let low = 0;
    let high = (box.width + box.height) / Math.hypot(direction.x, direction.y);
    for (let iteration = 0; iteration < 48; iteration++) {
      const t = (low + high) / 2;
      const cornerX = Math.max(Math.abs(direction.x * t) - halfStraightX, 0);
      const cornerY = Math.max(Math.abs(direction.y * t) - halfStraightY, 0);
      if (cornerX * cornerX + cornerY * cornerY <= radius * radius) low = t;
      else high = t;
    }
    return { x: origin.x + direction.x * low, y: origin.y + direction.y * low };
  }

  const vertices = polygonPoints(box.shape, box.width, box.height).map(point => ({ x: box.x + point.x, y: box.y + point.y }));
  let nearest = Infinity;
  for (let index = 0; index < vertices.length; index++) {
    const start = vertices[index];
    const end = vertices[(index + 1) % vertices.length];
    const segment = { x: end.x - start.x, y: end.y - start.y };
    const offset = { x: start.x - origin.x, y: start.y - origin.y };
    const denominator = cross(direction, segment);
    if (Math.abs(denominator) < 1e-8) continue;
    const t = cross(offset, segment) / denominator;
    const u = cross(offset, direction) / denominator;
    if (t >= 0 && u >= -1e-8 && u <= 1 + 1e-8) nearest = Math.min(nearest, t);
  }
  return { x: origin.x + direction.x * nearest, y: origin.y + direction.y * nearest };
}

export interface EdgeGeometry { path: string; label: Point; start: Point; end: Point; feedback: boolean }

export function edgeGeometry(source: ShapeBox, target: ShapeBox, symmetric: boolean, feedback = false): EdgeGeometry {
  const a = center(source);
  const b = center(target);
  if (feedback && a.y > b.y + 100) {
    // Return from the downstream row around its bottom and the upstream left,
    // rather than cutting horizontally through neighboring biological nodes.
    const routeX = Math.min(source.x, target.x) - 110;
    const routeY = Math.max(source.y + source.height, target.y + target.height) + 100;
    const start = boundaryPoint(source, { x: a.x, y: routeY });
    const end = boundaryPoint(target, { x: routeX, y: b.y });
    const radius = 28;
    return {
      path: `M ${start.x} ${start.y} L ${start.x} ${routeY - radius} Q ${start.x} ${routeY} ${start.x - radius} ${routeY} L ${routeX + radius} ${routeY} Q ${routeX} ${routeY} ${routeX} ${routeY - radius} L ${routeX} ${end.y + radius} Q ${routeX} ${end.y} ${routeX + radius} ${end.y} L ${end.x} ${end.y}`,
      label: { x: (start.x + routeX) / 2, y: routeY - 18 }, start, end, feedback,
    };
  }
  if (symmetric || feedback) {
    const vertical = Math.abs(a.y - b.y) > 100;
    const routeX = Math.min(source.x, target.x) - (feedback ? 150 : 125);
    const routeY = symmetric ? Math.max(source.y + source.height, target.y + target.height) + 130 : Math.min(source.y, target.y) - 165;
    const c1 = vertical ? { x: routeX, y: a.y } : { x: a.x, y: routeY };
    const c2 = vertical ? { x: routeX, y: b.y } : { x: b.x, y: routeY };
    // Clipping toward each control point also preserves the curve's endpoint tangent.
    const start = boundaryPoint(source, c1);
    const end = boundaryPoint(target, c2);
    const label = { x: (start.x + 3 * c1.x + 3 * c2.x + end.x) / 8, y: (start.y + 3 * c1.y + 3 * c2.y + end.y) / 8 };
    return { path: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`, label, start, end, feedback };
  }
  const start = boundaryPoint(source, b);
  const end = boundaryPoint(target, a);
  // Keep the complete arrow visible even when a predicate label is wider than a short gap.
  const horizontal = Math.abs(b.x - a.x) >= Math.abs(b.y - a.y);
  const label = { x: (start.x + end.x) / 2 + (horizontal ? 0 : 48), y: (start.y + end.y) / 2 - (horizontal ? 20 : 0) };
  return { path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, label, start, end, feedback };
}

/** Identify cycle-closing directed edges without inferring causal direction from layout position. */
export function feedbackEdgeIds(relationships: { id: string; sourceId: string; targetId: string; directionality: string }[]): Set<string> {
  const outgoing = new Map<string, typeof relationships>();
  for (const relationship of relationships) {
    if (relationship.directionality !== 'directed') continue;
    const entries = outgoing.get(relationship.sourceId) ?? [];
    entries.push(relationship);
    outgoing.set(relationship.sourceId, entries);
  }
  const visited = new Set<string>();
  const active = new Set<string>();
  const feedback = new Set<string>();
  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    active.add(id);
    for (const relationship of outgoing.get(id) ?? []) {
      if (active.has(relationship.targetId)) feedback.add(relationship.id);
      else visit(relationship.targetId);
    }
    active.delete(id);
  };
  for (const id of outgoing.keys()) visit(id);
  return feedback;
}
