(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const { Game, Input } = window.SnakeGame;
    const canvas = document.getElementById('game-canvas');

    const game = new Game({
      canvas,
      elements: {
        score: document.getElementById('score'),
        level: document.getElementById('level'),
        highScore: document.getElementById('high-score')
      }
    });

    Input.bind(
      {
        onDirection: (name) => game.handleDirection(name),
        onAction: (action) => game.handleAction(action)
      },
      canvas
    );

    // Auto-pause when the player switches tabs
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) game.pause();
    });

    window.snakeGame = game; // handy for debugging in the console
  });
})();