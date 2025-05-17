const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0 };
const gravity = 0.5;
const jump = -8;
let pipes = [];
let score = 0;
let gameOver = false;

document.addEventListener("keydown", () => {
  if (!gameOver) {
    bird.velocity = jump;
  } else {
    location.reload(); // restart game on key press
  }
});

function spawnPipe() {
  const gap = 120;
  const top = Math.random() * 200 + 20;
  const bottom = canvas.height - top - gap;
  pipes.push({
    x: canvas.width,
    width: 40,
    top,
    bottom
  });
}

function update() {
  if (gameOver) return;

  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Game over if bird falls or hits top
  if (bird.y > canvas.height || bird.y < 0) gameOver = true;

  pipes.forEach(p => {
    p.x -= 2;

    // Collision check
    if (
      bird.x < p.x + p.width &&
      bird.x + bird.width > p.x &&
      (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)
    ) {
      gameOver = true;
    }

    // Score
    if (p.x + p.width === bird.x) score++;
  });

  // Remove old pipes
  pipes = pipes.filter(p => p.x + p.width > 0);

  // Add new pipe
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 180) {
    spawnPipe();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  ctx.fillStyle = "black";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Draw pipes
  ctx.fillStyle = "green";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
  });

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 25);

  if (gameOver) {
    ctx.fillText("GAME OVER", 90, 200);
    ctx.fillText("Press any key to restart", 60, 230);
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

spawnPipe();
gameLoop();
