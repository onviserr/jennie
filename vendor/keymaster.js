// game.js

// --- Player Class ---
class Dog {
    constructor() {
      this.x = 170;
      this.y = 450;
      this.width = 60;
      this.height = 45;
      this.image = new Image();
      this.image.src = 'assets/jennie.png';
    }
    
    moveLeft() {
      if (this.x > 0) this.x -= 20;
    }
    
    moveRight() {
      if (this.x < 400 - this.width) this.x += 20;
    }
    
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
  
  // --- Falling Object Base Class ---
  class FallingObject {
    constructor(options) {
      this.x = Math.floor(Math.random() * (400 - 30));
      this.y = 0;
      this.width = 30;
      this.height = 30;
      this.dy = 2; // initial falling speed
      this.good = options.good;  // true for good objects, false for bad
      this.xp = options.xp || 0;   // XP value (only for good objects)
      this.image = new Image();
      this.image.src = options.src;
    }
    
    update() {
      this.y += this.dy;
    }
    
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    
    collidesWith(obj) {
      return (
        this.x < obj.x + obj.width &&
        this.x + this.width > obj.x &&
        this.y < obj.y + obj.height &&
        this.y + this.height > obj.y
      );
    }
  }
  
  // --- Specific Falling Objects ---
  // Good items:
  class Filet extends FallingObject {
    constructor() {
      super({ good: true, src: 'assets/filet.png', xp: 3 });
    }
  }
  
  class Lunch extends FallingObject {
    constructor() {
      super({ good: true, src: 'assets/lunch.png', xp: 2 });
    }
  }
  
  class Can extends FallingObject {
    constructor() {
      super({ good: true, src: 'assets/can.png', xp: 1 });
    }
  }
  
  // Bad item:
  class Fish extends FallingObject {
    constructor() {
      super({ good: false, src: 'assets/fish.png' });
    }
  }
  
  // --- Game Class ---
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.score = 0;       // XP score
      this.lives = 3;
      this.dog = new Dog();
      this.goodObjects = [];  // Array for Filet, Lunch, and Can objects
      this.badObjects = [];   // Array for Fish objects
      this.goodInterval = null;
      this.badInterval = null;
    }
    
    start() {
      // Start spawning good objects every 2 seconds
      this.goodInterval = setInterval(() => {
        const types = [Filet, Lunch, Can];
        const RandomGood = types[Math.floor(Math.random() * types.length)];
        this.goodObjects.push(new RandomGood());
      }, 2000);
      
      // Start spawning fish (bad objects) every 5.5 seconds
      this.badInterval = setInterval(() => {
        this.badObjects.push(new Fish());
      }, 5500);
      
      requestAnimationFrame(this.animate.bind(this));
    }
    
    animate() {
      this.update();
      this.draw();
      
      if (this.lives > 0) {
        requestAnimationFrame(this.animate.bind(this));
      } else {
        this.gameOver();
      }
    }
    
    update() {
      // Update good objects and check for collisions
      for (let i = this.goodObjects.length - 1; i >= 0; i--) {
        let obj = this.goodObjects[i];
        obj.update();
        if (obj.collidesWith(this.dog)) {
          this.score += obj.xp;
          this.goodObjects.splice(i, 1);
        } else if (obj.y > this.canvas.height) {
          this.goodObjects.splice(i, 1);
        }
      }
      
      // Update bad objects and check for collisions
      for (let i = this.badObjects.length - 1; i >= 0; i--) {
        let obj = this.badObjects[i];
        obj.update();
        if (obj.collidesWith(this.dog)) {
          this.lives--;
          this.badObjects.splice(i, 1);
        } else if (obj.y > this.canvas.height) {
          this.badObjects.splice(i, 1);
        }
      }
    }
    
    draw() {
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw background (using an image)
      let bg = new Image();
      bg.src = 'assets/background.png';
      // To ensure the background loads before drawing, you might preload it;
      // here we simply draw it every frame.
      this.ctx.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);
      
      // Draw the dog
      this.dog.draw(this.ctx);
      
      // Draw falling objects
      this.goodObjects.forEach(obj => obj.draw(this.ctx));
      this.badObjects.forEach(obj => obj.draw(this.ctx));
      
      // Draw score and lives
      this.ctx.fillStyle = "white";
      this.ctx.font = "20px Arial";
      this.ctx.fillText("XP: " + this.score, 10, 30);
      this.ctx.fillText("Lives: " + this.lives, 300, 30);
    }
    
    gameOver() {
      clearInterval(this.goodInterval);
      clearInterval(this.badInterval);
      this.ctx.fillStyle = "black";
      this.ctx.font = "30px Arial";
      this.ctx.fillText("Game Over!", 120, 250);
    }
  }
  
  // --- Start-Up Code ---
  window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 400;
    canvas.height = 500;
    
    const game = new Game(canvas);
    const ctx = canvas.getContext('2d');
    
    // Draw a simple start screen
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Press SPACE to start", 100, 250);
    
    // Wait for SPACE to be pressed to start the game.
    const startHandler = (e) => {
      if (e.key === " ") {
        window.removeEventListener('keydown', startHandler);
        game.start();
      }
    };
    window.addEventListener('keydown', startHandler);
    
    // Listen for arrow keys to move the dog.
    window.addEventListener('keydown', (e) => {
      if (e.key === "ArrowLeft") {
        game.dog.moveLeft();
      } else if (e.key === "ArrowRight") {
        game.dog.moveRight();
      }
    });
  };
  