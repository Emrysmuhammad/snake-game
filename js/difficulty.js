(function (root) {
  'use strict';

  /**
   * Speed settings per difficulty. Values are the delay in milliseconds
   * between snake moves, so a LOWER number means a FASTER snake.
   */
  const DIFFICULTIES = Object.freeze({
    beginner: Object.freeze({
      label: 'Beginner',
      startSpeedMs: 300,   // very slow
      minSpeedMs: 200,
      speedStepMs: 10
    }),
    intermediate: Object.freeze({
      label: 'Intermediate',
      startSpeedMs: 150,   // normal
      minSpeedMs: 60,
      speedStepMs: 10
    }),
    expert: Object.freeze({
      label: 'Expert',
      startSpeedMs: 75,    // very fast
      minSpeedMs: 35,
      speedStepMs: 5
    })
  });

  const DEFAULT_DIFFICULTY = 'intermediate';

  function isValidDifficulty(name) {
    return Object.prototype.hasOwnProperty.call(DIFFICULTIES, name);
  }

  /**
   * Delay between moves for a difficulty at a given level.
   * Unknown difficulty names fall back to the default.
   */
  function getSpeed(name, level) {
    const d = isValidDifficulty(name) ? DIFFICULTIES[name] : DIFFICULTIES[DEFAULT_DIFFICULTY];
    const ms = d.startSpeedMs - (level - 1) * d.speedStepMs;
    return Math.max(d.minSpeedMs, ms);
  }

  const api = { DIFFICULTIES, DEFAULT_DIFFICULTY, isValidDifficulty, getSpeed };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;          // Node (unit tests)
  } else {
    root.SnakeGame = root.SnakeGame || {};
    Object.assign(root.SnakeGame, api);  // Browser
  }
})(typeof window !== 'undefined' ? window : globalThis);