// lib/falling_object.js
export default class FallingObject {
  constructor(options) {
    // Random x position within canvas width (400px minus object width)
    this.x = Math.floor((400 - 30) * Math.random());
    this.y = 0;
    this.width = 30;
    this.height = 30;
    this.dy = 2;
    this.good = options.good; // true for good objects, false for bad
    this.image = new Image();
    this.image.src = options.src;
    this.xp = options.xp || 0; // XP value (for good objects)
  }

  update(ctx) {
    this.y += this.dy;
    this.draw(ctx);
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collidesWith(otherObject) {
    // Simple AABB collision check
    return (
      this.x < otherObject.x + otherObject.width &&
      this.x + this.width > otherObject.x &&
      this.y < otherObject.y + otherObject.height &&
      this.y + this.height > otherObject.y
    );
  }
}
