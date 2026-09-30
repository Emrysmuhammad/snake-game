const test = require('node:test');
const assert = require('node:assert/strict');
const { Snake, DIRECTIONS } = require('../js/snake.js');

test('snake starts with the requested length, head first', () => {
  const s = new Snake(5, 5, 3);
  assert.equal(s.body.length, 3);
  assert.deepEqual(s.head(), { x: 5, y: 5 });
  assert.deepEqual(s.body[2], { x: 3, y: 5 });
});

test('snake moves one cell in its direction and keeps its length', () => {
  const s = new Snake(5, 5, 3);
  s.move();
  assert.deepEqual(s.head(), { x: 6, y: 5 });
  assert.equal(s.body.length, 3);
});

test('snake cannot reverse directly', () => {
  const s = new Snake(5, 5, 3);
  assert.equal(s.setDirection(DIRECTIONS.LEFT), false);
  s.move();
  assert.deepEqual(s.head(), { x: 6, y: 5 });
});

test('quick double turn cannot reverse the snake into itself', () => {
  const s = new Snake(5, 5, 3);
  s.setDirection(DIRECTIONS.UP);
  assert.equal(s.setDirection(DIRECTIONS.LEFT), false);
  s.move();
  assert.deepEqual(s.head(), { x: 5, y: 4 });
});

test('grow() lengthens the snake on the next move', () => {
  const s = new Snake(5, 5, 3);
  s.grow();
  s.move();
  assert.equal(s.body.length, 4);
  s.move();
  assert.equal(s.body.length, 4);
});

test('hitsWall() detects leaving the grid', () => {
  const s = new Snake(0, 0, 1);
  assert.equal(s.hitsWall(20), false);
  s.setDirection(DIRECTIONS.UP);
  s.move();
  assert.equal(s.hitsWall(20), true);
});

test('hitsSelf() detects running into the body', () => {
  const s = new Snake(5, 5, 5);
  s.setDirection(DIRECTIONS.UP);
  s.move();
  s.setDirection(DIRECTIONS.LEFT);
  s.move();
  s.setDirection(DIRECTIONS.DOWN);
  s.move();
  assert.equal(s.hitsSelf(), true);
});

test('occupies() reports snake cells correctly', () => {
  const s = new Snake(5, 5, 3);
  assert.equal(s.occupies(5, 5), true);
  assert.equal(s.occupies(3, 5), true);
  assert.equal(s.occupies(9, 9), false);
});