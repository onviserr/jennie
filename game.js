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

const bone = { width: 30, height: 30, color: "#FFB6C1", points: 20, type: "bone" };
const food = { width: 30, height: 30, color: "#FFDB58", points: 10, type: "food" };
const can = { width: 30, height: 30, color: "#98AFC7", points: 5, type: "can" };
const fish = { width: 30, height: 30, color: "#00BFFF", points: -25, type: "fish" };

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        const type = Math.random() > 0.5 ? (Math.random() > 0.5 ? bone : food) : can;
        const object = {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: type.width,
            height: type.height,
            color: type.color,
            type: type.type,
            points: type.points
        };
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
    ctx.fillStyle = "#FF4500";
    ctx.fillRect(dogX, dogY, dogWidth, dogHeight);
}

function drawObjects() {
    for (let i = 0; i < objects.length; i++) {
        ctx.fillStyle = objects[i].color;
        ctx.fillRect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
    }
}

function checkCollisions() {
    for (let i = 0; i < objects.length; i++) {
        if (dogX < objects[i].x + objects[i].width && dogX + dogWidth > objects[i].x &&
            dogY < objects[i].y + objects[i].height && dogY + dogHeight > objects[i].y) {
            if (objects[i].type === "fish") {
                health -= Math.abs(objects[i].points);
                if (health <= 0) {
                    lives -= 1;
                    health = 100;
                }
            } else {
                score += objects[i].points;
            }
            objects.splice(i, 1);
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
