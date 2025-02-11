// lib/dog.js
export default class Dog {
  constructor() {
    this.x = 170;
    this.y = 450;
    this.width = 60;
    this.height = 45;
    this.image = new Image();
    this.image.src = "assets/jennie.png";
  }

  updatePos(moveLeft) {
    if (moveLeft && this.x > 0) {
      this.x -= 20;
    } else if (!moveLeft && this.x < 340) {
      this.x += 20;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
