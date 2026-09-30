(function (root) {
  'use strict';

  const DIRECTIONS = Object.freeze({
    UP: Object.freeze({ x: 0, y: -1 }),
    DOWN: Object.freeze({ x: 0, y: 1 }),
    LEFT: Object.freeze({ x: -1, y: 0 }),
    RIGHT: Object.freeze({ x: 1, y: 0 })
  });

  /**
   * The snake is an array of {x, y} cells. body[0] is the head.
   * This class knows nothing about the DOM or canvas, so it is easy to test.
   */
  class Snake {
    constructor(startX, startY, length = 3) {
      this.body = [];
      for (let i = 0; i < length; i++) {
        this.body.push({ x: startX - i, y: startY });
      }
      this.direction = DIRECTIONS.RIGHT;      // direction of the last move
      this.nextDirection = DIRECTIONS.RIGHT;  // direction requested for the next move
      this.growPending = 0;
    }

    head() {
      return this.body[0];
    }

    /**
     * Queue a new direction. A 180-degree turn is rejected, and because we
     * compare against the direction of the LAST MOVE, two quick key presses
     * inside one tick can never reverse the snake into itself.
     */
    setDirection(dir) {
      if (dir.x === -this.direction.x && dir.y === -this.direction.y) {
        return false;
      }
      this.nextDirection = dir;
      return true;
    }

    /** Advance one cell. Returns the new head position. */
    move() {
      this.direction = this.nextDirection;
      const h = this.head();
      const newHead = { x: h.x + this.direction.x, y: h.y + this.direction.y };
      this.body.unshift(newHead);

      if (this.growPending > 0) {
        this.growPending--;
      } else {
        this.body.pop();
      }
      return newHead;
    }

    grow(amount = 1) {
      this.growPending += amount;
    }

    occupies(x, y) {
      return this.body.some((segment) => segment.x === x && segment.y === y);
    }

    hitsWall(gridSize) {
      const h = this.head();
      return h.x < 0 || h.y < 0 || h.x >= gridSize || h.y >= gridSize;
    }

    hitsSelf() {
      const h = this.head();
      for (let i = 1; i < this.body.length; i++) {
        if (this.body[i].x === h.x && this.body[i].y === h.y) return true;
      }
      return false;
    }
  }

  const api = { Snake, DIRECTIONS };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;          // Node (unit tests)
  } else {
    root.SnakeGame = root.SnakeGame || {};
    Object.assign(root.SnakeGame, api);  // Browser
  }
})(typeof window !== 'undefined' ? window : globalThis);