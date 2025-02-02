const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 5;
let health = 100;
let gameInterval;
let objects = [];
let dogX = canvas.width / 2 - 75; // Bigger dog starting X position
let dogY = canvas.height - 150;  // Bigger dog starting Y position
let dogWidth = 150;  // Increase dog size
let dogHeight = 150; // Increase dog size
let speed = 5;
let isPaused = false; // Pause variable

// Image objects
const dogImage = new Image();
const filetImage = new Image();
const lunchImage = new Image();
const canImage = new Image();
const fishImage = new Image(); // Fish image
const backgroundImage = new Image();

// Load images
dogImage.src = "jennie.png";
filetImage.src = "filet.png";
lunchImage.src = "lunch.png";
canImage.src = "can.png";
fishImage.src = "fish.png";  // Fish image source
backgroundImage.src = "background.png";

// Wait for all images to load before starting the game
let imagesLoaded = 0;
const totalImages = 6;  // We have one more image now (fish)

const imageLoadHandler = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame();
    }
};

dogImage.onload = imageLoadHandler;
filetImage.onload = imageLoadHandler;
lunchImage.onload = imageLoadHandler;
canImage.onload = imageLoadHandler;
fishImage.onload = imageLoadHandler;
backgroundImage.onload = imageLoadHandler;

// Start the game
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
    dogX = canvas.width / 2 - 75;
    dogY = canvas.height - 150;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("lives").innerText = `Lives: ${lives}`;
    document.getElementById("health").innerText = `Health: ${health}`;
    document.getElementById("endScreen").classList.add("hidden");
    startGame();
}

function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function updateGame() {
    if (isPaused) return;

    updateCanvasSize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
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

        if (randomType < 0.25) {
            object = {
                x: Math.random() * (canvas.width - 50),
                y: -50,
                width: 50,
                height: 50,
                image: filetImage,
                points: 20,
                type: "filet"
            };
        } else if (randomType < 0.5) {
            object = {
                x: Math.random() * (canvas.width - 50),
                y: -50,
                width: 50,
                height: 50,
                image: lunchImage,
                points: 10,
                type: "lunch"
            };
        } else if (randomType < 0.75) {
            object = {
                x: Math.random() * (canvas.width - 50),
                y: -50,
                width: 50,
                height: 50,
                image: canImage,
                points: 5,
                type: "can"
            };
        } else {
            // Fish (removes life)
            object = {
                x: Math.random() * (canvas.width - 50),
                y: -50,
                width: 50,
                height: 50,
                image: fishImage,
                points: -1,  // Remove life when caught
                type: "fish"
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
    ctx.drawImage(dogImage, dogX, dogY, dogWidth, dogHeight); // Draw the larger dog
}

function drawObjects() {
    for (let i = 0; i < objects.length; i++) {
        ctx.drawImage(objects[i].image, objects[i].x, objects[i].y, objects[i].width, objects[i].height); // Draw food and fish
    }
}

function checkCollisions() {
    for (let i = 0; i < objects.length; i++) {
        if (dogX < objects[i].x + objects[i].width && dogX + dogWidth > objects[i].x &&
            dogY < objects[i].y + objects[i].height && dogY + dogHeight > objects[i].y) {
            
            if (objects[i].type === "fish") {
                lives -= 1;  // Lose a life if fish is caught
            } else {
                score += objects[i].points;  // Add points for food
            }
            objects.splice(i, 1); // Remove the object after collision
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

// Implementing the pause functionality
window.addEventListener("keydown", (e) => {
    if (e.key === "p" || e.key === "P") {
        isPaused = !isPaused; // Toggle pause
        if (!isPaused) {
            gameInterval = setInterval(updateGame, 20); // Restart game loop
        } else {
            clearInterval(gameInterval); // Stop game loop
        }
    }
});

// Update canvas size when the window is resized
window.addEventListener("resize", updateCanvasSize);
