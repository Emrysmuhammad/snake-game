(function (root) {
  'use strict';

  /**
   * Pick a random empty cell. We build the list of free cells first, so the
   * food can never land on the snake and the function never loops forever.
   * Returns null when the board is completely full (the player has won).
   *
   * @param {number} gridSize
   * @param {{occupies: function(number, number): boolean}} snake
   * @param {function(): number} rng  injectable random source (for tests)
   */
  function spawnFood(gridSize, snake, rng = Math.random) {
    const free = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!snake.occupies(x, y)) free.push({ x, y });
      }
    }
    if (free.length === 0) return null;
    return free[Math.floor(rng() * free.length)];
  }

  const api = { spawnFood };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SnakeGame = root.SnakeGame || {};
    Object.assign(root.SnakeGame, api);
  }
})(typeof window !== 'undefined' ? window : globalThis);