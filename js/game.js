(function (root) {
  'use strict';

  const {
    Config, Snake, DIRECTIONS, spawnFood, Renderer,
    DIFFICULTIES, DEFAULT_DIFFICULTY, isValidDifficulty, getSpeed
  } = root.SnakeGame;

  /**
   * Game state machine:  ready -> running <-> paused -> over -> (ready)
   * Owns the score, level, speed, game loop, difficulty and high score.
   */
  class Game {
    constructor({ canvas, elements }) {
      this.renderer = new Renderer(canvas, Config);
      this.els = elements;
      this.timer = null;
      this.difficulty = this.loadDifficulty();
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

    // ---------- difficulty ----------

    /** Switch difficulty. This resets the round so scores stay fair. */
    setDifficulty(name) {
      if (!isValidDifficulty(name) || name === this.difficulty) return;
      this.difficulty = name;
      this.saveDifficulty();
      this.highScore = this.loadHighScore();
      this.reset();
    }

    // ---------- game loop ----------

    speed() {
      return getSpeed(this.difficulty, this.level);
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
      const label = DIFFICULTIES[this.difficulty].label;
      switch (this.state) {
        case 'ready':
          return { title: 'SNAKE', subtitle: label + '  -  Press Space or tap to start' };
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

      (this.els.difficultyButtons || []).forEach((btn) => {
        const active = btn.dataset.difficulty === this.difficulty;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-checked', String(active));
      });
    }

    // ---------- persistence ----------

    highScoreKey() {
      return Config.HIGH_SCORE_KEY + '.' + this.difficulty;
    }

    loadHighScore() {
      try {
        return parseInt(localStorage.getItem(this.highScoreKey()), 10) || 0;
      } catch (err) {
        return 0; // storage blocked (private mode, etc.)
      }
    }

    saveHighScore() {
      try {
        localStorage.setItem(this.highScoreKey(), String(this.highScore));
      } catch (err) {
        /* ignore */
      }
    }

    loadDifficulty() {
      try {
        const saved = localStorage.getItem(Config.DIFFICULTY_KEY);
        return isValidDifficulty(saved) ? saved : DEFAULT_DIFFICULTY;
      } catch (err) {
        return DEFAULT_DIFFICULTY;
      }
    }

    saveDifficulty() {
      try {
        localStorage.setItem(Config.DIFFICULTY_KEY, this.difficulty);
      } catch (err) {
        /* ignore */
      }
    }
  }

  root.SnakeGame.Game = Game;
})(typeof window !== 'undefined' ? window : globalThis);