const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 10;

// Ball settings
const BALL_RADIUS = 10;
let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

// Left paddle (player)
let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Right paddle (AI)
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
const AI_SPEED = 4;

// Score
let leftScore = 0;
let rightScore = 0;

// Mouse control for left paddle (works anywhere on page)
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp paddle so it stays in bounds
    if (leftPaddleY < 0) leftPaddleY = 0;
    if (leftPaddleY > HEIGHT - PADDLE_HEIGHT) leftPaddleY = HEIGHT - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw middle line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(PADDLE_MARGIN, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT); // Left
    ctx.fillRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT); // Right

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = "40px Arial";
    ctx.fillText(leftScore, WIDTH / 4, 50);
    ctx.fillText(rightScore, 3 * WIDTH / 4, 50);
}

// Update game state
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > HEIGHT) {
        ballSpeedY = -ballSpeedY;
        ballY += ballSpeedY;
    }

    // Ball collision with left paddle
    if (
        ballX - BALL_RADIUS < PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some spin based on where it hits the paddle
        let collidePos = ballY - (leftPaddleY + PADDLE_HEIGHT / 2);
        ballSpeedY += collidePos * 0.08;
        ballX = PADDLE_MARGIN + PADDLE_WIDTH + BALL_RADIUS; // Prevent sticking
    }

    // Ball collision with right paddle (AI)
    if (
        ballX + BALL_RADIUS > WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        let collidePos = ballY - (rightPaddleY + PADDLE_HEIGHT / 2);
        ballSpeedY += collidePos * 0.08;
        ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_RADIUS; // Prevent sticking
    }

    // Score check
    if (ballX < 0) {
        rightScore++;
        resetBall();
    }
    if (ballX > WIDTH) {
        leftScore++;
        resetBall();
    }

    // AI paddle movement
    let aiCenter = rightPaddleY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 20) rightPaddleY += AI_SPEED;
    else if (aiCenter > ballY + 20) rightPaddleY -= AI_SPEED;
    // Clamp AI paddle within bounds
    if (rightPaddleY < 0) rightPaddleY = 0;
    if (rightPaddleY > HEIGHT - PADDLE_HEIGHT) rightPaddleY = HEIGHT - PADDLE_HEIGHT;
}

function resetBall() {
    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
    // Randomize initial direction
    ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    ballSpeedY = (Math.random() - 0.5) * 6;
}

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();