// snake. 15 seconds. eat 15 to win.
(function () {

  var cv = document.getElementById("snake"); if (!cv) return;
  // tuned so 15 is hard but possible: 80ms a step, and new food always lands within REACH steps of the head.
  // too hard? lower REACH. too easy? raise it (28 = anywhere on the board).
  var ctx = cv.getContext("2d"), N = 15, CELL = cv.width / N, LIMIT = 15, WIN = 15, SPEED = 80, REACH = 6;
  var INK = "#18070e", BODY = "#7a68ff", FOOD = "#f4f1ff", FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'; // same colours as style.css
  var timeEl = document.getElementById("snake-time"), scoreEl = document.getElementById("snake-score"), btn = document.getElementById("snake-start");
  var snake, dir, nextDir, food, score, alive, running = false, stepTimer, clock, started;
  function rnd() { return Math.floor(Math.random() * N); }
  function placeFood() {
    var tries = 0;
    do { food = [rnd(), rnd()]; tries++; }
    while (snake.some(function (p) { return p[0] === food[0] && p[1] === food[1]; }) || (tries < 500 && Math.abs(food[0] - snake[0][0]) + Math.abs(food[1] - snake[0][1]) > REACH));
  }
  // the snake has no gaps, so it reads like a stroke of the 15
  function draw(msg, sub, won) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = FOOD; ctx.fillRect(food[0] * CELL + 5, food[1] * CELL + 5, CELL - 10, CELL - 10);
    snake.forEach(function (p, i) { ctx.fillStyle = BODY; ctx.fillRect(p[0] * CELL, p[1] * CELL, CELL, CELL); });
    if (msg) {
      ctx.fillStyle = won ? BODY : "rgba(24,7,14,.85)"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = won ? INK : FOOD; ctx.font = "bold 22px " + FONT; ctx.textAlign = "center"; ctx.fillText(msg, cv.width / 2, cv.height / 2);
      if (sub) { ctx.font = "13px " + FONT; ctx.fillText(sub, cv.width / 2, cv.height / 2 + 24); }
    }
  }
  function end(msg, won) {
    running = false; clearInterval(stepTimer); clearInterval(clock);
    draw(msg, "score: " + score, won);
    btn.disabled = false;
  }
  function step() {
    dir = nextDir;
    var h = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
    if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || snake.some(function (p) { return p[0] === h[0] && p[1] === h[1]; })) { end("YOU DIED"); return; }
    snake.unshift(h);
    if (h[0] === food[0] && h[1] === food[1]) { score++; scoreEl.textContent = score; if (score >= WIN) { end("YOU WIN", true); return; } placeFood(); } else snake.pop();
    draw();
  }
  function start() {
    snake = [[7, 7], [6, 7], [5, 7]]; dir = [1, 0]; nextDir = dir; score = 0; scoreEl.textContent = 0; placeFood();
    running = true; started = Date.now(); timeEl.textContent = LIMIT; btn.disabled = true; draw();
    stepTimer = setInterval(step, SPEED);
    clock = setInterval(function () {
      var left = LIMIT - Math.floor((Date.now() - started) / 1000);
      timeEl.textContent = Math.max(0, left);
      if (left <= 0) end("TIME IS UP");
    }, 200);
  }
  function turn(d) { if (d[0] !== -dir[0] || d[1] !== -dir[1]) nextDir = d; }
  btn.addEventListener("click", function () { start(); cv.focus(); });
  document.addEventListener("keydown", function (e) {
    if (!running) return;
    var k = e.key.toLowerCase(), d = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] }[k];
    if (!d) return;
    e.preventDefault();
    turn(d);
  });
  // phones: swipe on the board to steer
  var tx, ty;
  cv.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  cv.addEventListener("touchmove", function (e) {
    if (!running) return;
    e.preventDefault();
    var dx = e.touches[0].clientX - tx, dy = e.touches[0].clientY - ty;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    turn(Math.abs(dx) > Math.abs(dy) ? [dx > 0 ? 1 : -1, 0] : [0, dy > 0 ? 1 : -1]);
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: false });
  snake = [[7, 7], [6, 7], [5, 7]]; food = [11, 7]; score = 0; draw("snake", "press play");
})();
