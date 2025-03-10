const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const track = document.getElementById('track');
let score = 0;
let playerPosition = 1; // 0 = left, 1 = center, 2 = right
let obstacles = [];
let gameInterval;
let speed = 3; // Speed of obstacles falling
let isJumping = false;

// Listen for key presses
document.addEventListener('keydown', movePlayer);
document.addEventListener('keydown', jumpPlayer);

// Move player left or right
function movePlayer(e) {
    if (e.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition--;
    } else if (e.key === 'ArrowRight' && playerPosition < 2) {
        playerPosition++;
    }
    player.style.left = `${playerPosition * 33.33}%`;
}

// Make player jump (if not already jumping)
function jumpPlayer(e) {
    if (e.key === 'ArrowUp' && !isJumping) {
        isJumping = true;
        player.style.bottom = '120px'; // Jump height
        setTimeout(() => {
            player.style.bottom = '20px'; // Return to normal position
            isJumping = false;
        }, 500);
    }
}

// Generate obstacles (trains)
function generateObstacles() {
    let lanes = [];
    
    // Randomly decide how many lanes to have obstacles
    const numOfLanes = Math.floor(Math.random() * 2) + 1; // This will give 1 or 2 lanes

    while (lanes.length < numOfLanes) {
        const lane = Math.floor(Math.random() * 3); // Randomly choose between 0 (left), 1 (center), 2 (right)
        if (!lanes.includes(lane)) {
            lanes.push(lane);
        }
    }

    // For each selected lane, create an obstacle
    lanes.forEach(lane => {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = `${lane * 33.33}%`; // 0 = left, 1 = center, 2 = right
        track.appendChild(obstacle);
        obstacles.push(obstacle);

        // Set obstacle speed and move it down
        obstacle.style.animationDuration = `${speed}s`;
    });
}

// Check for collisions
function checkCollisions() {
    obstacles.forEach((obstacle, index) => {
        const obsLeft = obstacle.offsetLeft;
        const obsRight = obsLeft + obstacle.offsetWidth;
        const playerLeft = player.offsetLeft;
        const playerRight = playerLeft + player.offsetWidth;

        // Check if the player collides with the obstacle
        if (
            player.offsetTop < obstacle.offsetTop + obstacle.offsetHeight &&
            playerRight > obsLeft &&
            playerLeft < obsRight
        ) {
            endGame();
        }

        // Remove obstacles that are off-screen
        if (obstacle.offsetTop > window.innerHeight) {
            obstacle.remove();
            obstacles.splice(index, 1);
        }
    });
}

// Update score
function updateScore() {
    score++;
    scoreElement.textContent = `Score: ${score}`;
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    alert(`Game Over! Your Score: ${score}`);
    resetGame();
}

// Reset the game state
function resetGame() {
    score = 0;
    playerPosition = 1;
    player.style.left = '33.33%';
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    scoreElement.textContent = `Score: ${score}`;
    speed = 3;
    gameInterval = setInterval(runGame, 1000 / 60);
}

// Main game loop
function runGame() {
    generateObstacles();
    updateScore();
    checkCollisions();
}

// Start the game
gameInterval = setInterval(runGame, 1000 / 60);
