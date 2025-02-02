const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 5;
let health = 100;
let gameInterval;
let objects = [];
let dogX = canvas.width / 2 - 25;
let dogY = canvas.height - 60;
let dogWidth = 50;
let dogHeight = 50;
let speed = 5;

const dogImage = new Image(); // Create a new Image object for the dog
const filetImage = new Image(); // Create a new Image object for the filet
const lunchImage = new Image(); // Create a new Image object for the lunch
const canImage = new Image(); // Create a new Image object for the can
const backgroundImage = new Image(); // Create a new Image object for the background

// Load the images
dogImage.src = "jennie.png"; // Path to dog image (jennie.png)
filetImage.src = "filet.png"; // Path to filet image
lunchImage.src = "lunch.png"; // Path to lunch image
canImage.src = "can.png"; // Path to can image
backgroundImage.src = "background.png"; // Path to background image

function startGame() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameArea").style.display = "block";
    gameInterval = setInterval(updateGame, 20);
    generateObjects();
}

function restartGame() {
    score = 0;
    lives = 5;
    health = 100;
    objects = [];
    dogX = canvas.width / 2 - 25;
    dogY = canvas.height - 60;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("lives").innerText = `Lives: ${lives}`;
    document.getElementById("health").innerText = `Health: ${health}`;
    document.getElementById("endScreen").classList.add("hidden");
    startGame();
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Draw the background
    moveDog();
    moveObjects();
    checkCollisions();
    drawDog();
    drawObjects();
    updateUI();
    if (lives <= 0) {
        endGame();
    }
}

function moveDog() {
    if (keys["ArrowLeft"] && dogX > 0) dogX -= speed;
    if (keys["ArrowRight"] && dogX < canvas.width - dogWidth) dogX += speed;
}

function generateObjects() {
    setInterval(function () {
        const randomType = Math.random();
        let object;

        if (randomType < 0.33) {
            // Spawn the filet (most XP)
            object = {
                x: Math.random() * (canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                image: filetImage,
                points: 20,
                type: "filet"
            };
        } else if (randomType < 0.66) {
            // Spawn the lunch (average XP)
            object = {
                x: Math.random() * (canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                image: lunchImage,
                points: 10,
                type: "lunch"
            };
        } else {
            // Spawn the can (least XP)
            object = {
                x: Math.random() * (canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                image: canImage,
                points: 5,
                type: "can"
            };
        }

        objects.push(object);
    }, 1000);
}

function moveObjects() {
    for (let i = 0; i < objects.length; i++) {
        objects[i].y += 2;
        if (objects[i].y > canvas.height) {
            objects.splice(i, 1);
        }
    }
}

function drawDog() {
    ctx.drawImage(dogImage, dogX, dogY, dogWidth, dogHeight); // Draw the dog image (jennie.png)
}

function drawObjects() {
    for (let i = 0; i < objects.length; i++) {
        ctx.drawImage(objects[i].image, objects[i].x, objects[i].y, objects[i].width, objects[i].height); // Draw the object image (filet, lunch, can)
    }
}

function checkCollisions() {
    for (let i = 0; i < objects.length; i++) {
        if (dogX < objects[i].x + objects[i].width && dogX + dogWidth > objects[i].x &&
            dogY < objects[i].y + objects[i].height && dogY + dogHeight > objects[i].y) {
            score += objects[i].points;
            objects.splice(i, 1); // Remove object after collision
        }
    }
}

function updateUI() {
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("lives").innerText = `Lives: ${lives}`;
    document.getElementById("health").innerText = `Health: ${health}`;
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById("finalScore").innerText = `Your Score: ${score}`;
    document.getElementById("endScreen").classList.remove("hidden");
}

let keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);
