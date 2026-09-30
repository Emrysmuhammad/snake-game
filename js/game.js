(function (root) {
  'use strict';

  const { Config, Snake, DIRECTIONS, spawnFood, Renderer } = root.SnakeGame;

  /**
   * Game state machine:  ready -> running <-> paused -> over -> (ready)
   * Owns the score, level, speed, game loop and high score.
   */
  class Game {
    constructor({ canvas, elements }) {
      this.renderer = new Renderer(canvas, Config);
      this.els = elements;
      this.timer = null;
      this.highScore = this.loadHighScore();
      this.reset();
    }

    // ---------- lifecycle ----------

    reset() {
      this.stopTimer();
      const mid = Math.floor(Config.GRID_SIZE / 2);
      this.snake = new Snake(mid, mid, Config.START_LENGTH);
      this.food = spawnFood(Config.GRID_SIZE, this.snake);
      this.score = 0;
      this.foodEaten = 0;
      this.level = 1;
      this.won = false;
      this.state = 'ready';
      this.updateHud();
      this.draw();
    }

    start() {
      if (this.state === 'over') this.reset();
      if (this.state !== 'ready') return;
      this.state = 'running';
      this.draw();
      this.schedule();
    }

    restart() {
      this.reset();
      this.start();
    }

    pause() {
      if (this.state !== 'running') return;
      this.state = 'paused';
      this.stopTimer();
      this.draw();
    }

    resume() {
      if (this.state !== 'paused') return;
      this.state = 'running';
      this.draw();
      this.schedule();
    }

    finish(won) {
      this.state = 'over';
      this.won = won;
      this.stopTimer();
      if (this.score > this.highScore) {
        this.highScore = this.score;
        this.saveHighScore();
      }
      this.updateHud();
      this.draw();
    }

    // ---------- game loop ----------

    speed() {
      const ms = Config.START_SPEED_MS - (this.level - 1) * Config.SPEED_STEP_MS;
      return Math.max(Config.MIN_SPEED_MS, ms);
    }

    schedule() {
      this.timer = setTimeout(() => {
        this.tick();
        if (this.state === 'running') this.schedule();
      }, this.speed());
    }

    stopTimer() {
      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }

    tick() {
      this.snake.move();

      if (this.snake.hitsWall(Config.GRID_SIZE) || this.snake.hitsSelf()) {
        this.finish(false);
        return;
      }

      const head = this.snake.head();
      if (this.food && head.x === this.food.x && head.y === this.food.y) {
        this.snake.grow();
        this.score += Config.POINTS_PER_FOOD;
        this.foodEaten++;
        this.level = 1 + Math.floor(this.foodEaten / Config.FOODS_PER_LEVEL);
        this.food = spawnFood(Config.GRID_SIZE, this.snake);
        this.updateHud();

        if (this.food === null) {   // board is full: perfect game
          this.finish(true);
          return;
        }
      }

      this.draw();
    }

    // ---------- input entry points ----------

    handleDirection(name) {
      if (this.state === 'over') return;
      if (this.state === 'ready') this.start();
      if (this.state === 'running') this.snake.setDirection(DIRECTIONS[name]);
    }

    handleAction(action) {
      if (action === 'restart') return this.restart();
      if (action === 'pause') {
        return this.state === 'paused' ? this.resume() : this.pause();
      }
      if (action === 'toggle') {
        if (this.state === 'ready' || this.state === 'over') return this.start();
        return this.state === 'running' ? this.pause() : this.resume();
      }
    }

    // ---------- drawing & HUD ----------

    overlay() {
      switch (this.state) {
        case 'ready':
          return { title: 'SNAKE', subtitle: 'Press Space or tap to start' };
        case 'paused':
          return { title: 'PAUSED', subtitle: 'Press Space to resume' };
        case 'over':
          return {
            title: this.won ? 'YOU WIN!' : 'GAME OVER',
            subtitle: 'Score ' + this.score + '  -  Press Space to play again'
          };
        default:
          return null;
      }
    }

    draw() {
      this.renderer.render({
        snake: this.snake,
        food: this.food,
        overlay: this.overlay()
      });
    }

    updateHud() {
      this.els.score.textContent = this.score;
      this.els.level.textContent = this.level;
      this.els.highScore.textContent = this.highScore;
    }

    // ---------- persistence ----------

    loadHighScore() {
      try {
        return parseInt(localStorage.getItem(Config.HIGH_SCORE_KEY), 10) || 0;
      } catch (err) {
        return 0; // storage blocked (private mode, etc.)
      }
    }

    saveHighScore() {
      try {
        localStorage.setItem(Config.HIGH_SCORE_KEY, String(this.highScore));
      } catch (err) {
        /* ignore */
      }
    }
  }

  root.SnakeGame.Game = Game;
})(typeof window !== 'undefined' ? window : globalThis);