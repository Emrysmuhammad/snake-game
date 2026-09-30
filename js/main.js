(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const { Game, Input } = window.SnakeGame;
    const canvas = document.getElementById('game-canvas');
    const difficultyButtons = Array.from(document.querySelectorAll('[data-difficulty]'));

    const game = new Game({
      canvas,
      elements: {
        score: document.getElementById('score'),
        level: document.getElementById('level'),
        highScore: document.getElementById('high-score'),
        difficultyButtons
      }
    });

    Input.bind(
      {
        onDirection: (name) => game.handleDirection(name),
        onAction: (action) => game.handleAction(action)
      },
      canvas
    );

    // Difficulty selector
    difficultyButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        game.setDifficulty(btn.dataset.difficulty);
        btn.blur(); // so Space doesn't re-trigger the button
      });
    });

    // Auto-pause when the player switches tabs
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) game.pause();
    });

    window.snakeGame = game; // handy for debugging in the console
  });
})();