const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Змінні гри
const dog = { x: 50, y: 300, width: 50, height: 50, speed: 4, dx: 0, dy: 0, jumping: false };
const gravity = 0.5;
const platforms = [
  { x: 0, y: 350, width: canvas.width, height: 50 },
  { x: 200, y: 250, width: 100, height: 20 },
  { x: 400, y: 200, width: 100, height: 20 }
];
const bones = [
  { x: 220, y: 230, width: 20, height: 20 },
  { x: 420, y: 180, width: 20, height: 20 }
];
let score = 0;

// Малювання платформ
function drawPlatforms() {
  ctx.fillStyle = '#654321';
  platforms.forEach((platform) => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

// Малювання собаки
function drawDog() {
  ctx.fillStyle = 'brown';
  ctx.fillRect(dog.x, dog.y, dog.width, dog.height);
}

// Малювання кісточок
function drawBones() {
  ctx.fillStyle = 'yellow';
  bones.forEach((bone) => {
    ctx.fillRect(bone.x, bone.y, bone.width, bone.height);
  });
}

// Перевірка зіткнення з платформами
function checkPlatformCollision() {
  dog.jumping = true;
  platforms.forEach((platform) => {
    if (
      dog.x < platform.x + platform.width &&
      dog.x + dog.width > platform.x &&
      dog.y + dog.height <= platform.y &&
      dog.y + dog.height + dog.dy >= platform.y
    ) {
      dog.jumping = false;
      dog.dy = 0;
      dog.y = platform.y - dog.height;
    }
  });
}

// Перевірка зіткнення з кісточками
function checkBoneCollision() {
  bones.forEach((bone, index) => {
    if (
      dog.x < bone.x + bone.width &&
      dog.x + dog.width > bone.x &&
      dog.y < bone.y + bone.height &&
      dog.y + dog.height > bone.y
    ) {
      bones.splice(index, 1);
      score++;
    }
  });
}

// Оновлення положення собаки
function updateDog() {
  dog.x += dog.dx;
  dog.y += dog.dy;

  // Гравітація
  if (dog.jumping) {
    dog.dy += gravity;
  }

  // Обмеження руху
  if (dog.x < 0) dog.x = 0;
  if (dog.x + dog.width > canvas.width) dog.x = canvas.width - dog.width;
  if (dog.y > canvas.height) {
    // Скидання гри, якщо собака падає за екран
    dog.x = 50;
    dog.y = 300;
    score = 0;
  }
}

// Обробка натискання клавіш
function keyDown(e) {
  if (e.key === 'w' && !dog.jumping) {
    dog.jumping = true;
    dog.dy = -10;
  }
  if (e.key === 'a') dog.dx = -dog.speed;
  if (e.key === 'd') dog.dx = dog.speed;
}

// Обробка відпускання клавіш
function keyUp(e) {
  if (e.key === 'a' || e.key === 'd') dog.dx = 0;
}

// Малювання рахунку
function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Основний ігровий цикл
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlatforms();
  drawDog();
  drawBones();
  drawScore();

  updateDog();
  checkPlatformCollision();
  checkBoneCollision();

  requestAnimationFrame(gameLoop);
}

// Слухачі подій
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

// Запуск гри
gameLoop();
