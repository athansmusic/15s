// snake. 15 seconds.
(function () {

  var cv = document.getElementById("snake"); if (!cv) return;
  var ctx = cv.getContext("2d"), N = 20, CELL = cv.width / N, LIMIT = 15;
  var timeEl = document.getElementById("snake-time"), scoreEl = document.getElementById("snake-score"), btn = document.getElementById("snake-start");
  var snake, dir, nextDir, food, score, alive, running = false, stepTimer, clock, started;
  function rnd() { return Math.floor(Math.random() * N); }
  function placeFood() { do { food = [rnd(), rnd()]; } while (snake.some(function (p) { return p[0] === food[0] && p[1] === food[1]; })); }
  function draw(msg, sub) {
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#888"; ctx.fillRect(food[0] * CELL, food[1] * CELL, CELL - 1, CELL - 1);
    snake.forEach(function (p, i) { ctx.fillStyle = "#000"; ctx.fillRect(p[0] * CELL, p[1] * CELL, CELL - 1, CELL - 1); });
    if (msg) {
      ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#000"; ctx.font = "bold 20px serif"; ctx.textAlign = "center"; ctx.fillText(msg, cv.width / 2, cv.height / 2);
      if (sub) { ctx.fillStyle = "#000"; ctx.font = "12px serif"; ctx.fillText(sub, cv.width / 2, cv.height / 2 + 24); }
    }
  }
  function end(msg) {
    running = false; clearInterval(stepTimer); clearInterval(clock);
    draw(msg, "score: " + score);
    btn.disabled = false;
  }
  function step() {
    dir = nextDir;
    var h = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
    if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || snake.some(function (p) { return p[0] === h[0] && p[1] === h[1]; })) { end("YOU DIED"); return; }
    snake.unshift(h);
    if (h[0] === food[0] && h[1] === food[1]) { score++; scoreEl.textContent = score; placeFood(); } else snake.pop();
    draw();
  }
  function start() {
    snake = [[10, 10], [9, 10], [8, 10]]; dir = [1, 0]; nextDir = dir; score = 0; scoreEl.textContent = 0; placeFood();
    running = true; started = Date.now(); timeEl.textContent = LIMIT; btn.disabled = true; draw();
    stepTimer = setInterval(step, 110);
    clock = setInterval(function () {
      var left = LIMIT - Math.floor((Date.now() - started) / 1000);
      timeEl.textContent = Math.max(0, left);
      if (left <= 0) end("TIME IS UP");
    }, 200);
  }
  btn.addEventListener("click", function () { start(); cv.focus(); });
  document.addEventListener("keydown", function (e) {
    if (!running) return;
    var k = e.key.toLowerCase(), d = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] }[k];
    if (!d) return;
    e.preventDefault();
    if (d[0] !== -dir[0] || d[1] !== -dir[1]) nextDir = d;
  });
  snake = [[10, 10], [9, 10], [8, 10]]; food = [15, 10]; score = 0; draw("snake", "15 seconds");
})();
