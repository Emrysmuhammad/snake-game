const test = require('node:test');
const assert = require('node:assert/strict');
const { Snake } = require('../js/snake.js');
const { spawnFood } = require('../js/food.js');

test('food never spawns on the snake', () => {
  const snake = new Snake(2, 2, 3);
  for (let i = 0; i < 500; i++) {
    const food = spawnFood(5, snake);
    assert.equal(snake.occupies(food.x, food.y), false);
  }
});

test('food stays inside the grid', () => {
  const snake = new Snake(2, 2, 3);
  for (let i = 0; i < 200; i++) {
    const f = spawnFood(5, snake);
    assert.ok(f.x >= 0 && f.x < 5 && f.y >= 0 && f.y < 5);
  }
});

test('spawnFood uses the injected random source', () => {
  const snake = new Snake(2, 2, 1);
  const first = spawnFood(4, snake, () => 0);
  assert.deepEqual(first, { x: 0, y: 0 });
});

test('returns null when the board is full', () => {
  const snake = new Snake(0, 0, 1);
  snake.body = [
    { x: 0, y: 0 }, { x: 1, y: 0 },
    { x: 0, y: 1 }, { x: 1, y: 1 }
  ];
  assert.equal(spawnFood(2, snake), null);
});