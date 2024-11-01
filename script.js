// Load the power cell image
const powerCellImage = new Image();
powerCellImage.src = 'powerCell.png'; // Adjust the path if necessary

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Game variables
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    color: "#00ffcc",
    power: 0,
    health: 100, // Health starts at 100
    speed: 3,
    dx: 0,
    dy: 0
};

// Power-up properties
let powerCells = [];
const powerCellSize = 50; // New hitbox size for power cells
const powerCellCount = 5;
const respawnInterval = 3000; // Respawn interval for power cells in milliseconds

// Generate initial power cells
function generatePowerCells() {
    powerCells = [];
    for (let i = 0; i < powerCellCount; i++) {
        let cell = {
            x: Math.random() * (canvas.width - powerCellSize),
            y: Math.random() * (canvas.height - powerCellSize)
        };
        powerCells.push(cell);
    }
}

// Draw player with pulsing effect
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
}

// Draw power cells using an image
function drawPowerCells() {
    powerCells.forEach(cell => {
        ctx.drawImage(powerCellImage, cell.x, cell.y, powerCellSize, powerCellSize); // Draw the image
    });
}

// Draw health bar
function drawHealthBar() {
    ctx.fillStyle = "#ff0000"; // Health bar color
    ctx.fillRect(10, 10, 200, 20); // Draw full health bar
    ctx.fillStyle = "#00ff00"; // Health color
    ctx.fillRect(10, 10, (player.health / 100) * 200, 20); // Draw current health
}

// Update power display
function updatePowerDisplay() {
    document.getElementById("powerDisplay").textContent = player.power;
}

// Smooth movement with key press
let keysPressed = {};
document.addEventListener("keydown", (e) => {
    keysPressed[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
});

// Calculate and update player movement
function updatePlayerMovement() {
    if (keysPressed["ArrowUp"]) player.dy = -player.speed;
    if (keysPressed["ArrowDown"]) player.dy = player.speed;
    if (keysPressed["ArrowLeft"]) player.dx = -player.speed;
    if (keysPressed["ArrowRight"]) player.dx = player.speed;

    player.x += player.dx;
    player.y += player.dy;

    // Gradual deceleration
    player.dx *= 0.9;
    player.dy *= 0.9;

    // Boundary checks
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

// Power-up collection logic with animation
function collectPower() {
    for (let i = powerCells.length - 1; i >= 0; i--) {
        let cell = powerCells[i];
        // Adjusted hitbox distance for the 50x50px hitbox
        let distance = Math.hypot(player.x - (cell.x + powerCellSize / 2), player.y - (cell.y + powerCellSize / 2));
        if (distance < player.size + (powerCellSize / 2)) { // Adjusted for hitbox size
            player.power++;
            player.health = Math.min(player.health + 20, 100); // Increase health by 20, max 100
            updatePowerDisplay();
            powerCells.splice(i, 1); // Remove collected power cell
            // Add a pulsing effect on power gain
            player.size += 1; // Temporary size increase
            setTimeout(() => {
                player.size = 20; // Reset size after effect
            }, 100);
        }
    }
}

// Respawn power cells periodically
setInterval(generatePowerCells, respawnInterval);

// Decrease health over time
setInterval(() => {
    player.health -= 5; // Decrease health by 5 every second
    if (player.health <= 0) {
        window.location.href = "game-over.html"; // Redirect to game over screen
    }
}, 1000);

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayerMovement();
    collectPower();
    drawPlayer();
    drawPowerCells();
    drawHealthBar();
    requestAnimationFrame(gameLoop);
}

// Initialize game
generatePowerCells();
updatePowerDisplay();
gameLoop();
