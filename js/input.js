(function (root) {
  'use strict';

  const KEY_TO_DIRECTION = {
    arrowup: 'UP', w: 'UP',
    arrowdown: 'DOWN', s: 'DOWN',
    arrowleft: 'LEFT', a: 'LEFT',
    arrowright: 'RIGHT', d: 'RIGHT'
  };

  const KEY_TO_ACTION = {
    ' ': 'toggle',
    enter: 'toggle',
    p: 'pause',
    r: 'restart'
  };

  const SWIPE_THRESHOLD = 24; // px

  /**
   * Translates keyboard, touch swipes and on-screen buttons into two callbacks:
   *   onDirection('UP' | 'DOWN' | 'LEFT' | 'RIGHT')
   *   onAction('toggle' | 'pause' | 'restart')
   */
  const Input = {
    bind(handlers, canvas) {
      const { onDirection, onAction } = handlers;

      // Keyboard
      document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (KEY_TO_DIRECTION[key]) {
          event.preventDefault();
          onDirection(KEY_TO_DIRECTION[key]);
        } else if (KEY_TO_ACTION[key]) {
          event.preventDefault();
          onAction(KEY_TO_ACTION[key]);
        }
      });

      // On-screen buttons
      document.querySelectorAll('[data-dir]').forEach((btn) => {
        btn.addEventListener('click', () => {
          onDirection(btn.dataset.dir);
          btn.blur();
        });
      });
      document.querySelectorAll('[data-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          onAction(btn.dataset.action);
          btn.blur();
        });
      });

      // Swipe gestures (a simple tap acts like the start/pause button)
      let startX = 0;
      let startY = 0;

      canvas.addEventListener('touchstart', (event) => {
        const t = event.changedTouches[0];
        startX = t.clientX;
        startY = t.clientY;
      }, { passive: true });

      canvas.addEventListener('touchend', (event) => {
        const t = event.changedTouches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;

        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
          onAction('toggle');
          return;
        }
        if (Math.abs(dx) > Math.abs(dy)) {
          onDirection(dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
          onDirection(dy > 0 ? 'DOWN' : 'UP');
        }
      }, { passive: true });
    }
  };

  root.SnakeGame = root.SnakeGame || {};
  root.SnakeGame.Input = Input;
})(typeof window !== 'undefined' ? window : globalThis);