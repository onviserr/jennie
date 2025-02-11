// lib/game.js
import Dog from './dog.js';
import Filet from './filet.js';
import Lunch from './lunch.js';
import Can from './can.js';
import Fish from './fish.js';

export default class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.score = 0;      // XP
    this.lives = 3;
    this.goodObjects = []; // Holds Filet, Lunch, and Can objects
    this.badObjects = [];  // Holds Fish objects
    this.difficulty = 2;   // Falling speed (will increase with score)
    this.dog = new Dog();
  }

  draw(ctx) {
    // Clear the canvas
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    // Draw background image
    let bg = new Image();
    bg.src = "assets/background.png";
    ctx.drawImage(bg, 0, 0, Game.DIM_X, Game.DIM_Y);

    // Draw the dog
    this.dog.draw(ctx);

    // Update falling objects and check for collisions
    this.checkCollisions();

    this.drawScore(ctx);
    this.drawLives(ctx);
    this.checkGameOver(ctx);
  }

  drawScore(ctx) {
    ctx.font = '20px Raleway';
    ctx.fillStyle = "white";
    ctx.fillText("XP: " + this.score, 10, 30);
  }

  drawLives(ctx) {
    ctx.font = '20px Raleway';
    ctx.fillStyle = "white";
    ctx.fillText("LIVES: " + this.lives, 315, 30);
  }

  drawGameOver(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.font = '25px Raleway';
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER", 125, 160);
    ctx.fillText("YOUR XP: " + this.score, 110, 200);
    ctx.fillText("Press SPACE to restart!", 70, 240);
    this.clearAllIntervals();
  }

  checkGameOver(ctx) {
    if (this.lives <= 0) {
      this.drawGameOver(ctx);
    }
  }

  checkCollisions() {
    // Process good objects
    this.goodObjects.forEach((obj, i) => {
      if (obj.collidesWith(this.dog)) {
        this.score += obj.xp;
        this.goodObjects.splice(i, 1);
      } else {
        this.increaseDifficulty(obj);
        obj.update(this.ctx);
      }
    });

    // Process bad objects (fish)
    this.badObjects.forEach((obj, i) => {
      if (obj.collidesWith(this.dog)) {
        this.lives--;
        this.badObjects.splice(i, 1);
      } else {
        this.increaseDifficulty(obj);
        obj.update(this.ctx);
      }
    });
  }

  startIntervals() {
    // Spawn a random good object (Filet, Lunch, or Can) every 2000ms
    this.goodInterval = setInterval(() => {
      const types = [Filet, Lunch, Can];
      const RandomGood = types[Math.floor(Math.random() * types.length)];
      this.goodObjects.push(new RandomGood());
    }, 2000);

    // Spawn a Fish (bad object) every 5500ms
    this.badInterval = setInterval(() => {
      this.badObjects.push(new Fish());
    }, 5500);
  }

  clearAllIntervals() {
    clearInterval(this.goodInterval);
    clearInterval(this.badInterval);
  }

  increaseDifficulty(object) {
    if (this.score >= 5 && this.score < 10) {
      this.difficulty = 3;
    } else if (this.score >= 10 && this.score < 20) {
      this.difficulty = 4;
    } else if (this.score >= 20) {
      this.difficulty = 5;
    }
    object.dy = this.difficulty;
  }
}

Game.DIM_X = 400;
Game.DIM_Y = 500;
