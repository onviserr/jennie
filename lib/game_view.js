// lib/game_view.js
import Game from './game.js';

export default class GameView {
  constructor(ctx) {
    this.ctx = ctx;
  }

  bindKeyHandlers() {
    const dog = this.dog;
    Object.keys(GameView.MOVES).forEach((keyName) => {
      // keymaster (loaded in index.html) will bind arrow keys to move the dog.
      key(keyName, () => dog.updatePos(GameView.MOVES[keyName] === -20));
    });
  }

  welcome() {
    this.drawWelcome(this.ctx);
    window.addEventListener("keypress", (e) => {
      if (e.keyCode === 32) {
        this.start();
      }
    });
  }

  drawWelcome(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.font = '20px Arial';
    ctx.fillStyle = "black";
    ctx.fillText("Press SPACE to start!", 100, 200);
  }

  start() {
    this.game = new Game(this.ctx);
    this.dog = this.game.dog;
    this.bindKeyHandlers();
    this.game.startIntervals();
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    this.game.draw(this.ctx);
    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.MOVES = {
  "left": -20,
  "right": 20
};
