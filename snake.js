// snake. 15 seconds. eat 15 to win.
(function () {

  var cv = document.getElementById("snake"); if (!cv) return;
  // tuned so 15 is hard but possible: 80ms a step, and new food always lands within REACH steps of the head.
  // too hard? lower REACH. too easy? raise it (28 = anywhere on the board).
  var ctx = cv.getContext("2d"), N = 15, CELL = cv.width / N, LIMIT = 15, WIN = 15, SPEED = 80, REACH = 6;
  var FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif', root = document.documentElement;
  // colours come from style.css, so the board follows the flip
  function col(name) { return getComputedStyle(root).getPropertyValue("--" + name).trim(); }
  var scoreEl = document.getElementById("snake-score"), btn = document.getElementById("snake-start");
  var snake, dir, nextDir, food, score, running = false, flipping = false, stepTimer, raf, started, leftMs = LIMIT * 1000;
  function rnd() { return Math.floor(Math.random() * N); }
  function placeFood() {
    var tries = 0;
    do { food = [rnd(), rnd()]; tries++; }
    while (snake.some(function (p) { return p[0] === food[0] && p[1] === food[1]; }) || (tries < 500 && Math.abs(food[0] - snake[0][0]) + Math.abs(food[1] - snake[0][1]) > REACH));
  }
  function secs(ms) { return (ms / 1000).toFixed(3); }
  // the snake has no gaps, so it reads like a stroke of the 15
  function draw(msg, sub, won) {
    var INK = col("ink"), BODY = col("violet");
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.textAlign = "center";
    if (!msg) {
      // the clock, huge, behind the game, only just brighter than the board
      ctx.globalAlpha = .18; ctx.fillStyle = col("food"); ctx.font = "bold 84px " + FONT; ctx.textBaseline = "middle";
      ctx.fillText(secs(leftMs).padStart(6, "0"), cv.width / 2, cv.height / 2);
      ctx.globalAlpha = 1; ctx.textBaseline = "alphabetic";
    }
    ctx.fillStyle = col("food"); ctx.fillRect(food[0] * CELL + 5, food[1] * CELL + 5, CELL - 10, CELL - 10);
    snake.forEach(function (p, i) { ctx.fillStyle = BODY; ctx.fillRect(p[0] * CELL, p[1] * CELL, CELL, CELL); });
    if (msg) {
      ctx.globalAlpha = won ? 1 : .85; ctx.fillStyle = won ? BODY : INK; ctx.fillRect(0, 0, cv.width, cv.height); ctx.globalAlpha = 1;
      ctx.fillStyle = won ? INK : col("paper"); ctx.font = "bold 22px " + FONT; ctx.fillText(msg, cv.width / 2, cv.height / 2);
      if (sub) { ctx.font = "13px " + FONT; ctx.fillText(sub, cv.width / 2, cv.height / 2 + 24); }
    }
  }

  // winning swaps the black and the violet across the whole site, until the next win or a refresh.
  // where the browser can do it, the new colours pulse out from the snake's head in board-sized pixels.
  function flip(after) {
    function apply() { root.classList.toggle("flip"); after(); }
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) { apply(); return; }
    var frames = pulse(), done = function () { flipping = false; };
    flipping = true;
    var vt = document.startViewTransition(apply);
    vt.ready.then(function () { root.animate(frames, { duration: 900, pseudoElement: "::view-transition-new(root)" }); }, function () {});
    vt.finished.then(done, done);
  }
  // one clip-path per frame: a ragged circle of pixels growing from the head until it covers the window
  function pulse() {
    var F = 30, BAND = 5, r = cv.getBoundingClientRect(), P = cv.clientWidth / N, ox = r.left + cv.clientLeft, oy = r.top + cv.clientTop;
    var hx = snake[0][0], hy = snake[0][1];
    var i0 = Math.floor(-ox / P), i1 = Math.ceil((innerWidth - ox) / P), j0 = Math.floor(-oy / P), j1 = Math.ceil((innerHeight - oy) / P);
    var far = Math.max(Math.hypot(i0 - hx, j0 - hy), Math.hypot(i1 - hx, j0 - hy), Math.hypot(i0 - hx, j1 - hy), Math.hypot(i1 - hx, j1 - hy)) + BAND + 1;
    function noise(i, j) { var n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return n - Math.floor(n); }
    function X(i) { return Math.round(ox + i * P); }
    function Y(j) { return Math.round(oy + j * P); }
    var frames = [];
    for (var f = 0; f <= F; f++) {
      var t = f / F, rad = far * (1 - (1 - t) * (1 - t)), d = "";
      for (var j = j0; j < j1; j++) {
        var run = null;
        for (var i = i0; i <= i1; i++) {
          var on = i < i1 && Math.hypot(i - hx, j - hy) + noise(i, j) * BAND < rad;
          if (on && run === null) run = i;
          if (!on && run !== null) { d += "M" + X(run) + " " + Y(j) + "H" + X(i) + "V" + Y(j + 1) + "H" + X(run) + "Z"; run = null; }
        }
      }
      frames.push({ clipPath: 'path("' + (d || "M0 0") + '")', easing: "step-end" });
    }
    return frames;
  }

  function end(msg, won) {
    running = false; clearInterval(stepTimer);
    var show = function () { draw(msg, won ? WIN + " in " + secs(LIMIT * 1000 - leftMs) + "s" : "score: " + score, won); };
    if (won) flip(show); else show();
    btn.disabled = false;
  }
  function tick() {
    leftMs = Math.max(0, LIMIT * 1000 - (performance.now() - started));
    if (leftMs <= 0) end("TIME IS UP");
  }
  function frame() {
    if (!running) return;
    tick(); if (!running) return;
    draw(); raf = requestAnimationFrame(frame);
  }
  function step() {
    tick(); if (!running) return;
    dir = nextDir;
    var h = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
    if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || snake.some(function (p) { return p[0] === h[0] && p[1] === h[1]; })) { end("YOU DIED"); return; }
    snake.unshift(h);
    if (h[0] === food[0] && h[1] === food[1]) { score++; scoreEl.textContent = score; if (score >= WIN) { end("YOU WIN", true); return; } placeFood(); } else snake.pop();
    draw();
  }
  function start() {
    if (flipping) return;
    clearInterval(stepTimer); cancelAnimationFrame(raf);
    snake = [[7, 7], [6, 7], [5, 7]]; dir = [1, 0]; nextDir = dir; score = 0; scoreEl.textContent = 0; placeFood();
    running = true; started = performance.now(); leftMs = LIMIT * 1000; btn.disabled = true; draw();
    stepTimer = setInterval(step, SPEED);
    raf = requestAnimationFrame(frame);
  }
  function turn(d) { if (d[0] !== -dir[0] || d[1] !== -dir[1]) nextDir = d; }
  btn.addEventListener("click", function () { start(); cv.focus(); });
  document.addEventListener("keydown", function (e) {
    // space starts a game, or restarts the one in progress
    if (e.key === " ") { e.preventDefault(); if (!e.repeat) start(); return; }
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
  snake = [[7, 7], [6, 7], [5, 7]]; food = [11, 7]; score = 0; draw("snake", "press play or space");
})();
