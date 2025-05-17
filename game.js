const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird, pipes, score, gameOver;
let bgm = document.getElementById("bgm");
let volumeSlider = document.getElementById("volumeSlider");

volumeSlider.addEventListener("input", () => {
  bgm.volume = volumeSlider.value;
});

// ===== Menu Functions =====
function startGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("settings").style.display = "none";
  canvas.style.display = "block";
  initGame();
  bgm.play();
}

function openSettings() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("settings").style.display = "block";
}

function closeSettings() {
  document.getElementById("settings").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

// ===== Game Code =====
function initGame() {
  bird = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0
  };
  pipes = [];
  score = 0;
  gameOver = false;
  spawnPipe();
  gameLoop();
}

const gravity = 0.5;
const jump = -10;

function getRandomColor() {
  const colors = ["#4CAF50", "#FF5722", "#03A9F4", "#E91E63", "#FFC107", "#9C27B0"];
  return colors[Math.floor(Math.random() * colors.length)];
}

document.addEventListener("keydown", () => {
  if (!gameOver && canvas.style.display === "block") {
    bird.velocity = jump;
  } else if (gameOver) {
    returnToMenu();
  }
});

function spawnPipe() {
  const gap = 180;
  const top = Math.random() * (canvas.height / 2) + 50;
  const bottom = canvas.height - top - gap;
  pipes.push({
    x: canvas.width,
    width: 60,
    top,
    bottom,
    color: getRandomColor()
  });
}

function update() {
  if (gameOver) return;

  bird.velocity += gravity;
  bird.y += bird.velocity;

  if (bird.y > canvas.height || bird.y < 0) gameOver = true;

  pipes.forEach(p => {
    p.x -= 4;

    if (
      bird.x < p.x + p.width &&
      bird.x + bird.width > p.x &&
      (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)
    ) {
      gameOver = true;
    }

    if (p.x + p.width === bird.x) score++;
  });

  pipes = pipes.filter(p => p.x + p.width > 0);

  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
    spawnPipe();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.width / 2, 0, Math.PI * 2);
  ctx.fill();

  // Pipes
  pipes.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
  });

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "28px sans-serif";
  ctx.fillText(`Score: ${score}`, 30, 50);

  if (gameOver) {
    ctx.font = "40px sans-serif";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2 - 20);
    ctx.font = "24px sans-serif";
    ctx.fillText("Press any key to return to menu", canvas.width / 2 - 170, canvas.height / 2 + 20);
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function returnToMenu() {
  canvas.style.display = "none";
  document.getElementById("menu").style.display = "block";
  bgm.pause();
  bgm.currentTime = 0;
}
