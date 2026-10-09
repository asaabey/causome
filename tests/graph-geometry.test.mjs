import assert from 'node:assert/strict';
import test from 'node:test';
import { boundaryPoint, edgeGeometry, feedbackEdgeIds } from '../web/src/lib/graph/geometry.ts';

test('diamond and hexagon clip to their angled boundaries, not their bounding rectangles', () => {
  const diamond = boundaryPoint({ x: 10, y: 20, width: 200, height: 100, shape: 'diamond' }, { x: 210, y: 120 });
  assert.equal(diamond.x, 160);
  assert.equal(diamond.y, 95);
  const hexagon = boundaryPoint({ x: 0, y: 0, width: 200, height: 100, shape: 'hexagon' }, { x: 200, y: 0 });
  assert.ok(hexagon.x < 200 && hexagon.x > 150);
  assert.ok(hexagon.y > 0 && hexagon.y < 25);
});

test('capsule clipping follows the round end cap', () => {
  const point = boundaryPoint({ x: 0, y: 0, width: 200, height: 100, shape: 'capsule' }, { x: 300, y: -50 });
  assert.ok(point.x < 200 && point.x > 150);
  assert.ok(Math.abs((point.x - 150) ** 2 + (point.y - 50) ** 2 - 2500) < 1e-6);
});

test('edges recompute from updated geometry; feedback and symmetric routes remain distinct', () => {
  const source = { x: 0, y: 200, width: 180, height: 100, shape: 'capsule' };
  const target = { x: 300, y: 200, width: 180, height: 100, shape: 'hexagon' };
  const original = edgeGeometry(source, target, false);
  const resized = edgeGeometry({ ...source, width: 240 }, target, false);
  assert.notEqual(original.start.x, resized.start.x);
  const moved = edgeGeometry(source, { ...target, x: 420 }, false);
  assert.equal(moved.end.x - original.end.x, 120);
  const feedback = edgeGeometry(target, source, false, true);
  assert.equal(feedback.feedback, true);
  assert.ok(feedback.label.y < source.y);
  const association = edgeGeometry(source, target, true);
  assert.equal(association.feedback, false);
  assert.ok(association.label.y > source.y + source.height);
});

test('cycle detection marks the closing edge and ignores symmetric associations', () => {
  const edges = [
    { id: 'a-b', sourceId: 'a', targetId: 'b', directionality: 'directed' },
    { id: 'b-c', sourceId: 'b', targetId: 'c', directionality: 'directed' },
    { id: 'c-a', sourceId: 'c', targetId: 'a', directionality: 'directed' },
    { id: 'a-c', sourceId: 'a', targetId: 'c', directionality: 'symmetric' },
  ];
  assert.deepEqual([...feedbackEdgeIds(edges)], ['c-a']);
});

test('vertical association curves beside endpoints rather than through the target', () => {
  const source = { x: 400, y: 160, width: 180, height: 100, shape: 'capsule' };
  const target = { x: 400, y: 430, width: 180, height: 100, shape: 'octagon' };
  const association = edgeGeometry(source, target, true);
  assert.ok(association.label.x < source.x);
  assert.ok(association.end.x <= target.x + 1);
});

test('receptor ellipses and substrate parallelograms clip to their visible boundaries', () => {
  const ellipse = boundaryPoint({ x: 0, y: 0, width: 200, height: 100, shape: 'ellipse' }, { x: 200, y: 0 });
  assert.ok(Math.abs(((ellipse.x - 100) / 100) ** 2 + ((ellipse.y - 50) / 50) ** 2 - 1) < 1e-8);
  const substrate = boundaryPoint({ x: 0, y: 0, width: 200, height: 100, shape: 'parallelogram' }, { x: 0, y: 0 });
  assert.ok(substrate.x > 0 && substrate.x < 30 && substrate.y > 0);
});

test('a downstream feedback return leaves the bottom and enters the upstream left boundary', () => {
  const source = { x: 600, y: 470, width: 190, height: 112, shape: 'hexagon' };
  const target = { x: 0, y: 0, width: 190, height: 112, shape: 'hexagon' };
  const edge = edgeGeometry(source, target, false, true);
  assert.equal(edge.start.y, source.y + source.height);
  assert.equal(edge.end.x, target.x);
  assert.ok(edge.label.y > source.y + source.height);
  assert.ok(edge.path.includes(' Q '));
});
