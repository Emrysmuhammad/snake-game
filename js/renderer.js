(function (root) {
  'use strict';

  /** Draws the game onto a <canvas>. It only draws; it never changes game state. */
  class Renderer {
    constructor(canvas, config) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.cfg = config;
      this.size = config.GRID_SIZE * config.CELL_SIZE;
      canvas.width = this.size;
      canvas.height = this.size;
    }

    clear() {
      const { ctx, cfg, size } = this;
      ctx.fillStyle = cfg.COLORS.background;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = cfg.COLORS.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < cfg.GRID_SIZE; i++) {
        const p = i * cfg.CELL_SIZE + 0.5;
        ctx.moveTo(p, 0);
        ctx.lineTo(p, size);
        ctx.moveTo(0, p);
        ctx.lineTo(size, p);
      }
      ctx.stroke();
    }

    drawCell(x, y, color, inset = 1) {
      const c = this.cfg.CELL_SIZE;
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x * c + inset, y * c + inset, c - inset * 2, c - inset * 2);
    }

    drawSnake(snake) {
      const { COLORS } = this.cfg;
      for (let i = snake.body.length - 1; i >= 0; i--) {
        const s = snake.body[i];
        this.drawCell(s.x, s.y, i === 0 ? COLORS.snakeHead : COLORS.snakeBody, 2);
      }
    }

    drawFood(food) {
      if (!food) return;
      const c = this.cfg.CELL_SIZE;
      this.ctx.fillStyle = this.cfg.COLORS.food;
      this.ctx.beginPath();
      this.ctx.arc(food.x * c + c / 2, food.y * c + c / 2, c / 2 - 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    drawOverlay(title, subtitle) {
      const { ctx, cfg, size } = this;
      ctx.fillStyle = cfg.COLORS.overlay;
      ctx.fillRect(0, 0, size, size);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = cfg.COLORS.text;
      ctx.font = 'bold 40px system-ui, sans-serif';
      ctx.fillText(title, size / 2, size / 2 - 16);

      ctx.fillStyle = cfg.COLORS.subtext;
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillText(subtitle, size / 2, size / 2 + 26);
    }

    /** Draw one full frame. */
    render({ snake, food, overlay }) {
      this.clear();
      this.drawFood(food);
      this.drawSnake(snake);
      if (overlay) this.drawOverlay(overlay.title, overlay.subtitle);
    }
  }

  root.SnakeGame = root.SnakeGame || {};
  root.SnakeGame.Renderer = Renderer;
})(typeof window !== 'undefined' ? window : globalThis);