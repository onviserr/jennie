const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const dog = { x: 50, y: 300, width: 50, height: 50, speed: 3, jumping: false, velocity: 0 };
const gravity = 0.5;
const bones = [];
let score = 0;

// Bone generation
function generateBone() {
  const bone = { x: canvas.width, y: Math.random() * (canvas.height - 50), width: 30, height: 30 };
  bones.push(bone);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the dog
  ctx.fillStyle = 'brown';
  ctx.fillRect(dog.x, dog.y, dog.width, dog.height);

  // Gravity and jumping
  if (dog.jumping) {
    dog.velocity -= gravity;
    dog.y -= dog.velocity;
    if (dog.y >= 300) {
      dog.y = 300;
      dog.jumping = false;
      dog.velocity = 0;
    }
  }

  // Draw and move bones
  bones.forEach((bone, index) => {
    bone.x -= 2;
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bone.x, bone.y, bone.width, bone.height);

    // Check collision
    if (
      dog.x < bone.x + bone.width &&
      dog.x + dog.width > bone.x &&
      dog.y < bone.y + bone.height &&
      dog.y + dog.height > bone.y
    ) {
      bones.splice(index, 1);
      score++;
    }

    // Remove bones that go off-screen
    if (bone.x + bone.width < 0) bones.splice(index, 1);
  });

  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);

  requestAnimationFrame(gameLoop);
}

// Jump action
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !dog.jumping) {
    dog.jumping = true;
    dog.velocity = 10;
  }
});

// Start the game
setInterval(generateBone, 2000); // Generate bones every 2 seconds
gameLoop();
