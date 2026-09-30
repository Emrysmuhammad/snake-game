(function (root) {
  'use strict';

  /**
   * Central place for every tweakable game setting.
   * Speed per difficulty lives in js/difficulty.js.
   */
  const Config = Object.freeze({
    GRID_SIZE: 20,          // board is GRID_SIZE x GRID_SIZE cells
    CELL_SIZE: 24,          // pixels per cell (canvas = GRID_SIZE * CELL_SIZE)
    START_LENGTH: 3,        // snake length at the start of a round

    POINTS_PER_FOOD: 10,
    FOODS_PER_LEVEL: 5,     // foods needed to reach the next level

    HIGH_SCORE_KEY: 'snake.highScore',       // a difficulty suffix is added
    DIFFICULTY_KEY: 'snake.difficulty',

    COLORS: Object.freeze({
      background: '#0f172a',
      grid: '#1e293b',
      snakeHead: '#4ade80',
      snakeBody: '#22c55e',
      food: '#f87171',
      overlay: 'rgba(15, 23, 42, 0.78)',
      text: '#f8fafc',
      subtext: '#94a3b8'
    })
  });

  root.SnakeGame = root.SnakeGame || {};
  root.SnakeGame.Config = Config;
})(typeof window !== 'undefined' ? window : globalThis);