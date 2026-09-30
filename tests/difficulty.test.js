const test = require('node:test');
const assert = require('node:assert/strict');
const {
  DIFFICULTIES,
  DEFAULT_DIFFICULTY,
  isValidDifficulty,
  getSpeed
} = require('../js/difficulty.js');

test('level 1 speeds are 300ms, 150ms and 75ms', () => {
  assert.equal(getSpeed('beginner', 1), 300);
  assert.equal(getSpeed('intermediate', 1), 150);
  assert.equal(getSpeed('expert', 1), 75);
});

test('expert is faster than intermediate, which is faster than beginner', () => {
  for (let level = 1; level <= 15; level++) {
    assert.ok(getSpeed('expert', level) < getSpeed('intermediate', level));
    assert.ok(getSpeed('intermediate', level) < getSpeed('beginner', level));
  }
});

test('the game speeds up as the level increases', () => {
  assert.ok(getSpeed('intermediate', 2) < getSpeed('intermediate', 1));
  assert.ok(getSpeed('expert', 3) < getSpeed('expert', 2));
  assert.ok(getSpeed('beginner', 2) < getSpeed('beginner', 1));
});

test('speed never drops below the minimum of each difficulty', () => {
  assert.equal(getSpeed('beginner', 100), DIFFICULTIES.beginner.minSpeedMs);
  assert.equal(getSpeed('intermediate', 100), DIFFICULTIES.intermediate.minSpeedMs);
  assert.equal(getSpeed('expert', 100), DIFFICULTIES.expert.minSpeedMs);
});

test('unknown difficulty falls back to the default', () => {
  assert.equal(getSpeed('impossible', 1), getSpeed(DEFAULT_DIFFICULTY, 1));
});

test('isValidDifficulty only accepts known names', () => {
  assert.equal(isValidDifficulty('beginner'), true);
  assert.equal(isValidDifficulty('expert'), true);
  assert.equal(isValidDifficulty('toString'), false);
  assert.equal(isValidDifficulty(undefined), false);
});