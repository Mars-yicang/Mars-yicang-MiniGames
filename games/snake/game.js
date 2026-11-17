const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const bestEl = document.querySelector("#best");
const message = document.querySelector("#message");
const startBtn = document.querySelector("#start");
const pauseBtn = document.querySelector("#pause");

const SIZE = 20;
const CELLS = canvas.width / SIZE;
let snake, food, direction, nextDirection, score, timer, running = false, paused = false;
let best = Number(localStorage.getItem("miniGamesSnakeBest") || 0);
bestEl.textContent = best;

function reset() {
  snake = [{x: 9, y: 10}, {x: 8, y: 10}, {x: 7, y: 10}];
  direction = {x: 1, y: 0};
  nextDirection = {...direction};
  score = 0;
  scoreEl.textContent = score;
  placeFood();
  draw();
}

function placeFood() {
  do {
    food = {x: Math.floor(Math.random()*CELLS), y: Math.floor(Math.random()*CELLS)};
  } while (snake.some(part => part.x === food.x && part.y === food.y));
}

function draw() {
  ctx.fillStyle = "#101a2b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#1b2940";
  ctx.lineWidth = 1;
  for (let i=0;i<=CELLS;i++) {
    ctx.beginPath(); ctx.moveTo(i*SIZE,0); ctx.lineTo(i*SIZE,canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,i*SIZE); ctx.lineTo(canvas.width,i*SIZE); ctx.stroke();
  }
  ctx.fillStyle = "#fb7185";
  ctx.beginPath(); ctx.arc(food.x*SIZE+SIZE/2,food.y*SIZE+SIZE/2,SIZE*.34,0,Math.PI*2); ctx.fill();
  snake.forEach((part,index) => {
    ctx.fillStyle = index === 0 ? "#a7f3d0" : "#34d399";
    ctx.fillRect(part.x*SIZE+2,part.y*SIZE+2,SIZE-4,SIZE-4);
  });
}

function tick() {
  direction = nextDirection;
  const head = {x:snake[0].x+direction.x,y:snake[0].y+direction.y};
  const ate = head.x===food.x && head.y===food.y;
  const body = ate ? snake : snake.slice(0,-1);
  if (head.x<0 || head.y<0 || head.x>=CELLS || head.y>=CELLS ||
      body.some(part=>part.x===head.x && part.y===head.y)) {
    endGame();
    return;
  }
  snake.unshift(head);
  if (ate) {
    score += 10;
    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      localStorage.setItem("miniGamesSnakeBest", String(best));
    }
    placeFood();
  } else snake.pop();
  draw();
}

function startGame() {
  clearInterval(timer);
  reset();
  running = true;
  paused = false;
  message.textContent = "遊戲進行中！";
  timer = setInterval(tick, 115);
}

function endGame() {
  clearInterval(timer);
  running = false;
  message.textContent = `遊戲結束！你的分數是 ${score} 分，按「開始遊戲」再玩一次。`;
}

function setDirection(x,y) {
  if (x === -direction.x && y === -direction.y) return;
  nextDirection = {x,y};
}

document.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();
  const map = {
    arrowup:[0,-1], w:[0,-1], arrowdown:[0,1], s:[0,1],
    arrowleft:[-1,0], a:[-1,0], arrowright:[1,0], d:[1,0]
  };
  if (map[key]) {
    event.preventDefault();
    setDirection(...map[key]);
  }
  if (key === " " && running) togglePause();
});

function togglePause() {
  if (!running) return;
  if (paused) {
    timer = setInterval(tick,115);
    paused = false;
    message.textContent = "遊戲進行中！";
    pauseBtn.textContent = "暫停";
  } else {
    clearInterval(timer);
    paused = true;
    message.textContent = "已暫停，按「繼續」恢復遊戲。";
    pauseBtn.textContent = "繼續";
  }
}

document.querySelectorAll("[data-dir]").forEach(button => {
  button.addEventListener("click", () => {
    const dirs = {up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
    setDirection(...dirs[button.dataset.dir]);
  });
});
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);
reset();
