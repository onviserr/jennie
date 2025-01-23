// Отримуємо посилання на canvas і контекст
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Отримуємо посилання на елемент рахунку
const scoreElement = document.getElementById("score");

// Параметри гри
const gravity = 0.6;
const groundHeight = 50; // висота землі знизу
const dogSpeed = 4;     // горизонтальна швидкість собаки, якщо потрібно
const jumpForce = 12;   // сила стрибка
let score = 0;

// Опис об'єкта "Собака"
const dog = {
  x: 100,
  y: canvas.height - groundHeight - 50,
  width: 50,
  height: 50,
  vy: 0,            // вертикальна швидкість
  onGround: false,  // перевірка, чи на землі
};

// Масив кісточок
const bones = [];
const boneWidth = 30;
const boneHeight = 30;

// Таймери для появи кісточок
let boneSpawnTimer = 0;
const boneSpawnInterval = 90; // кожні 90 кадрів з’являється кісточка

// Функція ініціалізації кісточок (якщо треба заповнити спочатку)
// Можна викликати, щоб закинути кілька кісточок відразу
function initBones() {
  bones.push({
    x: 500,
    y: canvas.height - groundHeight - boneHeight,
    width: boneWidth,
    height: boneHeight
  });
}

// Функція для створення випадкової кісточки
function spawnBone() {
  // Можна регулювати випадкове розташування за необхідності
  const boneY = canvas.height - groundHeight - boneHeight; // на "землі"
  bones.push({
    x: canvas.width,
    y: boneY,
    width: boneWidth,
    height: boneHeight
  });
}

// Обробка натискань клавіш
document.addEventListener("keydown", (e) => {
  if ((e.code === "Space" || e.code === "ArrowUp") && dog.onGround) {
    dog.vy = -jumpForce;
    dog.onGround = false;
  }
});

// Головний цикл гри
function update() {
  // Очищення canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Малюємо "землю" (простий прямокутник унизу)
  ctx.fillStyle = "#654321";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  // Оновлюємо вертикальну позицію собаки з урахуванням гравітації
  dog.y += dog.vy;
  dog.vy += gravity;

  // Перевірка, чи собака на землі
  if (dog.y + dog.height >= canvas.height - groundHeight) {
    dog.y = canvas.height - groundHeight - dog.height;
    dog.onGround = true;
    dog.vy = 0;
  }

  // Малюємо собаку (простий прямокутник або замініть на картинку)
  ctx.fillStyle = "#ff9933";
  ctx.fillRect(dog.x, dog.y, dog.width, dog.height);

  // Оновлюємо й малюємо кісточки
  boneSpawnTimer++;
  if (boneSpawnTimer > boneSpawnInterval) {
    spawnBone();
    boneSpawnTimer = 0;
  }

  for (let i = 0; i < bones.length; i++) {
    const bone = bones[i];

    // Рух кісточки зліва направо чи навпаки
    bone.x -= 5; // рухаємо кісточку вліво, щоби створити ілюзію руху

    // Малюємо кісточку (простий прямокутник або замініть на картинку)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bone.x, bone.y, bone.width, bone.height);

    // Перевірка зіткнення з собакою
    if (isColliding(dog, bone)) {
      score++;
      updateScore();
      // Видаляємо кісточку з масиву
      bones.splice(i, 1);
      i--;
      continue;
    }

    // Якщо кісточка вийшла за межі екрану — видаляємо
    if (bone.x + bone.width < 0) {
      bones.splice(i, 1);
      i--;
    }
  }

  // Просимо браузер оновити кадр
  requestAnimationFrame(update);
}

// Функція перевірки зіткнення двох об'єктів
function isColliding(rect1, rect2) {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect1.x > rect2.x + rect2.width ||
    rect1.y + rect1.height < rect2.y ||
    rect1.y > rect2.y + rect2.height
  );
}

// Функція оновлення рахунку
function updateScore() {
  scoreElement.textContent = score;
}

// Запуск гри
initBones();
update();
