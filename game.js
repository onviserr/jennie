// game.js

// Отримуємо доступ до холста (canvas) та контексту
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Розміри ігрового поля
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Параметри собаки
const dog = {
  x: WIDTH / 2 - 25, // початкова позиція (по центру)
  y: HEIGHT - 60,    // трошки вище нижнього краю
  width: 50,
  height: 50,
  speed: 5,
  dx: 0 // напрямок руху (0 - без руху, -1 - ліворуч, 1 - праворуч)
};

// Ігрові змінні
let score = 0;
let lives = 3;
let gameOver = false;

// Моделі "кісточок" (які дають очки) та "бомб" (які забирають життя)
const bones = [];
const bombs = [];

// Параметри для випадкового створення елементів
const spawnInterval = 1500; // раз на 1.5 секунди спавн
let lastSpawnTime = 0;

// Функція для створення кісточки
function spawnBone() {
  const bone = {
    x: Math.random() * (WIDTH - 30) + 15, // щоб не виходило за межі
    y: -20,
    radius: 15,
    speed: 3 + Math.random() * 2 // від 3 до 5
  };
  bones.push(bone);
}

// Функція для створення бомби
function spawnBomb() {
  const bomb = {
    x: Math.random() * (WIDTH - 20) + 10,
    y: -20,
    radius: 10,
    speed: 3 + Math.random() * 2 // від 3 до 5
  };
  bombs.push(bomb);
}

// Функція для оновлення позиції собаки
function updateDog() {
  dog.x += dog.dx * dog.speed;
  // Не даємо вийти за межі екрану
  if (dog.x < 0) dog.x = 0;
  if (dog.x + dog.width > WIDTH) dog.x = WIDTH - dog.width;
}

// Функція для оновлення кісточок
function updateBones() {
  for (let i = bones.length - 1; i >= 0; i--) {
    const bone = bones[i];
    bone.y += bone.speed;

    // Перевірка зіткнення із собакою
    if (checkCollisionCircleRect(bone, dog)) {
      score++;
      updateScore();
      bones.splice(i, 1); // видаляємо кісточку з масиву
    } else if (bone.y - bone.radius > HEIGHT) {
      // Якщо кісточка вийшла за нижню межу
      bones.splice(i, 1);
    }
  }
}

// Функція для оновлення бомб
function updateBombs() {
  for (let i = bombs.length - 1; i >= 0; i--) {
    const bomb = bombs[i];
    bomb.y += bomb.speed;

    // Перевірка зіткнення із собакою
    if (checkCollisionCircleRect(bomb, dog)) {
      lives--;
      updateLives();
      bombs.splice(i, 1); // видаляємо бомбу
      if (lives <= 0) {
        endGame();
      }
    } else if (bomb.y - bomb.radius > HEIGHT) {
      // Якщо бомба вийшла за нижню межу
      bombs.splice(i, 1);
    }
  }
}

// Перевірка зіткнення кола (кісточка чи бомба) з прямокутником (собака)
function checkCollisionCircleRect(circle, rect) {
  // Найближча точка прямокутника до центру кола
  const distX = Math.abs(circle.x - (rect.x + rect.width / 2));
  const distY = Math.abs(circle.y - (rect.y + rect.height / 2));

  // Якщо відстань більша, ніж половина прямокутника + радіус кола,
  // то точно немає зіткнення
  if (distX > (rect.width / 2 + circle.radius)) return false;
  if (distY > (rect.height / 2 + circle.radius)) return false;

  // Якщо вхідні перевірки пройдено, потенційно є зіткнення
  if (distX <= (rect.width / 2)) return true;
  if (distY <= (rect.height / 2)) return true;

  // Перевірка куточків
  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

// Функція відображення (рендер)
function draw() {
  // Очищаємо холст
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Малюємо собаку (прямокутник)
  ctx.fillStyle = 'brown';
  ctx.fillRect(dog.x, dog.y, dog.width, dog.height);

  // Малюємо кісточки (кола)
  ctx.fillStyle = 'white';
  bones.forEach(bone => {
    ctx.beginPath();
    ctx.arc(bone.x, bone.y, bone.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });

  // Малюємо бомби (кола)
  ctx.fillStyle = 'black';
  bombs.forEach(bomb => {
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
}

// Оновлення відображення очок
function updateScore() {
  document.getElementById('score').textContent = score;
}

// Оновлення відображення життів
function updateLives() {
  document.getElementById('lives').textContent = lives;
}

// Основний цикл гри
let lastTime = 0;
function gameLoop(timestamp) {
  if (gameOver) return; // Якщо гра завершена, більше нічого не робимо

  const delta = timestamp - lastTime;
  lastTime = timestamp;

  // Генеруємо нові елементи з певним інтервалом
  if (timestamp - lastSpawnTime > spawnInterval) {
    lastSpawnTime = timestamp;
    // Випадковим чином створюємо або кісточку, або бомбу
    const randomItem = Math.random();
    if (randomItem < 0.6) {
      spawnBone(); // з імовірністю 60% - кісточка
    } else {
      spawnBomb(); // з імовірністю 40% - бомба
    }
  }

  updateDog();
  updateBones();
  updateBombs();
  draw();

  requestAnimationFrame(gameLoop);
}

// Функція завершення гри
function endGame() {
  gameOver = true;
  const gameOverDiv = document.getElementById('gameOver');
  gameOverDiv.style.display = 'block';
  gameOverDiv.textContent = `Гру завершено! Ваш результат: ${score} очок`;
}

// Обробка натискань клавіш
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') {
    dog.dx = -1;
  } else if (e.code === 'ArrowRight') {
    dog.dx = 1;
  }
});

// Коли відпускаємо клавішу – зупиняємо рух собаки
document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    dog.dx = 0;
  }
});

// Запускаємо гру
updateScore();
updateLives();
requestAnimationFrame(gameLoop);
