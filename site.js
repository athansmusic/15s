// ~~ 15 SECOND MYSTERIES ~~ shared javascript ~~ (c) forever ~~ no stealing ~~
(function () {
  var E = (window.EPISODES || []).slice().sort(function (a, b) { return b.date < a.date ? -1 : 1; });
  var L = window.LINKS || {}, S = window.SITE || {};

  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function released() { var t = today(); return E.filter(function (e) { return e.date <= t; }); }
  function upcoming() { var t = today(); return E.filter(function (e) { return e.date > t; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }); }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad3(n) { return String(n).padStart(3, "0"); }
  function niceDate(iso) { var p = iso.split("-"); var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; return m[+p[1] - 1] + " " + (+p[2]) + ", " + p[0]; }
  function ytId(u) { var m = String(u).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{6,})/); return m ? m[1] : null; }

  function player(e) {
    if (!e.src) return '<font color="#ff6666"><span class="blink">**</span> The RealAudio server is down!! Audio coming soon!! <span class="blink">**</span></font>';
    var id = ytId(e.src);
    if (/youtu/.test(e.src) && id) return '<iframe width="320" height="180" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';
    if (/open\.spotify\.com/.test(e.src)) return '<iframe src="' + esc(e.src.replace("open.spotify.com/", "open.spotify.com/embed/")) + '" width="320" height="80" frameborder="0" allow="encrypted-media"></iframe>';
    if (/\.(mp3|m4a|wav|ogg)(\?|$)/i.test(e.src)) return '<audio controls preload="none" src="' + esc(e.src) + '" style="width:320px"></audio><br><font size="1">(if the plugin does not load, <a href="' + esc(e.src) + '">click here</a>)</font>';
    return '<a href="' + esc(e.src) + '" target="_blank"><img src="img/magnify.gif" border="0" align="absmiddle"> LISTEN TO THE MYSTERY</a>';
  }

  function link(key, label) {
    return L[key] ? '<a href="' + esc(L[key]) + '" target="_blank">' + label + '</a>' : label + ' <font color="#999">(coming soon!!)</font>';
  }

  window.Site = {
    fill: function () {
      var r = released(), u = upcoming(), t = r[0];
      var el;
      if ((el = document.getElementById("todays"))) {
        el.innerHTML = t ? '<img src="img/new.gif" align="absmiddle"> <b><font size="4" color="#ffff00">MYSTERY #' + pad3(t.n) + '</font></b> <font size="1">(' + niceDate(t.date) + ')</font><br>'
          + '<font size="5" class="glitter">' + esc(t.title) + '</font><br><i>' + esc(t.blurb) + '</i><br><br>' + player(t)
          : '<img src="img/q.gif" align="absmiddle"> No mysteries yet!! The first one is coming!!';
      }
      if ((el = document.getElementById("progress"))) {
        var n = r.length, total = S.seasonEpisodes || 90, pct = Math.min(100, Math.round(n / total * 100));
        el.innerHTML = '<div class="bar"><div style="width:' + pct + '%"></div></div><font size="1">SEASON ONE: ' + n + ' of ' + total + ' mysteries solved (' + pct + '%) = ' + (n * 15) + ' seconds of content</font>';
      }
      if ((el = document.getElementById("nextlabel"))) el.textContent = u.length ? "NEXT MYSTERY IN:" : "NEXT MYSTERY (probably) IN:";
      if ((el = document.getElementById("updated"))) el.textContent = t ? niceDate(t.date) : "never";
      ["kickstarter", "spotify", "apple", "youtube", "rss"].forEach(function (k) {
        var n = document.getElementById("link-" + k); if (n) n.innerHTML = link(k, n.textContent);
      });
      if ((el = document.getElementById("email"))) el.innerHTML = L.email ? '<a href="mailto:' + esc(L.email) + '"><img src="img/mail.gif" border="0" align="absmiddle"> EMAIL THE WEBMASTER</a>' : '<img src="img/mail.gif" align="absmiddle"> EMAIL THE WEBMASTER <font color="#999" size="1">(the mailbox is not hooked up yet)</font>';
      if ((el = document.getElementById("kslink")) && L.kickstarter) el.href = L.kickstarter;
      if ((el = document.getElementById("mlabel"))) el.textContent = S.bgMusicLabel || "bgmusic.mid";
    },

    countdown: function () {
      var el = document.getElementById("countdown"); if (!el) return;
      var u = upcoming(), target;
      if (u.length) { var p = u[0].date.split("-"); target = new Date(+p[0], +p[1] - 1, +p[2], 0, 0, 0); }
      else { target = new Date(); target.setHours(24, 0, 0, 0); }
      function tick() {
        var ms = target - new Date(); if (ms < 0) ms = 0;
        var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60, d = Math.floor(h / 24);
        el.textContent = (d ? d + "d " : "") + String(h % 24).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
      }
      tick(); setInterval(tick, 1000);
    },

    counter: function () {
      var el = document.getElementById("hits"); if (!el) return;
      var n = 15; // we don't know how to track this
      el.innerHTML = String(n).padStart(6, "0").split("").map(function (d) { return '<span class="digit" style="background-position:-' + (d * 14) + 'px 0"></span>'; }).join("");
    },

    titleScroll: function () {
      var s = "*~* 15 SECOND MYSTERIES *~* A NEW MYSTERY EVERY DAY!!! *~*   ", i = 0;
      setInterval(function () { document.title = s.slice(i) + s.slice(0, i); i = (i + 1) % s.length; }, 250);
    },

    sparkles: function () {
      var cols = ["#ff00ff", "#00ffff", "#ffff00", "#ffffff"], k = 0;
      document.addEventListener("mousemove", function (ev) {
        if (k++ % 2) return;
        var s = document.createElement("span"); s.className = "spark"; s.textContent = "*"; s.style.color = cols[k % 4];
        s.style.left = ev.clientX + "px"; s.style.top = ev.clientY + "px"; document.body.appendChild(s);
        setTimeout(function () { s.remove(); }, 1000);
      });
    },

    noSteal: function () {
      document.addEventListener("contextmenu", function (e) { e.preventDefault(); alert("HEY!! No stealing my mysteries!!!\n\n(c) 15 Second Mysteries. All 15 seconds reserved."); });
    },

    // ~~ BACKGROUND MUSIC ~~ (youtube, looped forever) ~~
    music: function () {
      var id = S.bgMusicYouTubeId, box = document.getElementById("yt"), sp = document.getElementById("splash");
      var P = null, wantPlay = false;
      function setState(s) { var st = document.getElementById("mstate"); if (st) st.textContent = s; }
      if (id && box) {
        var tag = document.createElement("script"); tag.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = function () {
          P = new YT.Player("yt", {
            width: 200, height: 113, videoId: id,
            playerVars: { loop: 1, playlist: id, controls: 0, autoplay: 0, rel: 0, playsinline: 1 },
            events: {
              onReady: function () { setState("READY"); if (wantPlay) { P.unMute(); P.setVolume(60); P.playVideo(); } },
              onStateChange: function (ev) { if (ev.data === YT.PlayerState.ENDED) P.playVideo(); setState(ev.data === 1 ? "PLAYING" : ev.data === 3 ? "BUFFERING..." : "STOPPED"); }
            }
          });
        };
      }
      window.Music = {
        play: function () { wantPlay = true; if (P && P.playVideo) { P.unMute(); P.setVolume(60); P.playVideo(); } },
        stop: function () { wantPlay = false; if (P && P.pauseVideo) P.pauseVideo(); }
      };
      if (sp) {
        sp.addEventListener("click", function () { window.Music.play(); sp.remove(); window.Site.popup(6000); });
        var q = document.getElementById("enter-quiet"); if (q) q.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); sp.remove(); window.Site.popup(6000); });
      }
      var st = document.getElementById("mstop"); if (st) st.addEventListener("click", function () { window.Music.stop(); });
      var pl = document.getElementById("mplay"); if (pl) pl.addEventListener("click", function () { window.Music.play(); });
    },

    // ~~ ADVERTISEMENT ~~ (it's milk) ~~
    popup: function (delay) {
      if (document.getElementById("ad")) return;
      setTimeout(function () {
        var d = document.createElement("div"); d.id = "ad";
        d.innerHTML = '<div class="ad-title"><span>Advertisement - Microsoft Internet Explorer</span><button type="button" class="ad-x" title="Close">&times;</button></div>'
          + '<div class="ad-body"><font size="1" color="#666">~ ADVERTISEMENT ~</font><br>'
          + '<font size="6" color="#cc0000" face="Impact, Arial Black, sans-serif"><b>MILK</b></font><br>'
          + '<a href="https://www.target.com/p/organic-valley-whole-milk-1-2gal-64oz/-/A-49174886#lnk=sametab" target="_blank" rel="noopener"><img src="img/milk.jpg" width="180" height="180" alt="milk" border="0"></a><br>'
          + '<font size="2"><b>You look thirsty.</b></font><br>'
          + '<a href="https://www.target.com/p/organic-valley-whole-milk-1-2gal-64oz/-/A-49174886#lnk=sametab" target="_blank" rel="noopener"><font size="4" color="#0000ee"><b>&gt;&gt;&gt; CLICK HERE FOR MILK &lt;&lt;&lt;</b></font></a><br>'
          + '<font size="1" color="#666">(this ad helps fund the plot)</font><br><br>'
          + '<button type="button" class="ad-no">No thanks, I am lactose intolerant</button></div>';
        document.body.appendChild(d);
        function close() { d.remove(); }
        d.querySelector(".ad-x").addEventListener("click", close);
        d.querySelector(".ad-no").addEventListener("click", close);
      }, delay || 0);
    },

    guestbook: function () {
      var list = document.getElementById("gb-list"), form = document.getElementById("gb-form"); if (!list) return;
      var seed = [{ name: "THE WEBMASTER", from: "The Crime Scene", msg: "FIRST!!! Welcome to my homepage. Please sign the guestbook, it makes the hit counter go up (I think)", when: "1999-12-31" }];
      function load() { try { return JSON.parse(localStorage.getItem("gb15") || "null") || seed; } catch (e) { return seed; } }
      function save(x) { try { localStorage.setItem("gb15", JSON.stringify(x)); } catch (e) {} }
      function render() {
        list.innerHTML = load().slice().reverse().map(function (g) {
          return '<table width="100%" cellpadding="4" class="box2" style="margin-bottom:8px"><tr><td><b>' + esc(g.name) + '</b> <font size="1">from ' + esc(g.from || "the internet") + (g.site ? ' ~ <a href="' + esc(g.site) + '" target="_blank" rel="noopener">homepage</a>' : '') + ' ~ ' + esc(g.when) + '</font><hr size="1">' + esc(g.msg).replace(/\n/g, "<br>") + '</td></tr></table>';
        }).join("");
      }
      render();
      if (form) form.addEventListener("submit", function (ev) {
        ev.preventDefault(); var f = ev.target;
        if (!f.msg.value.trim()) { alert("You forgot to write anything!!"); return; }
        var x = load(); x.push({ name: f.name.value.trim() || "Anonymous Detective", from: f.from.value.trim(), site: /^https?:\/\//.test(f.site.value.trim()) ? f.site.value.trim() : "", msg: f.msg.value.trim(), when: today() }); save(x); f.reset(); render();
        alert("Thanks for signing!! (Your entry is saved in YOUR browser because the guestbook CGI script is broken)");
      });
    },

    boot: function () { this.fill(); this.countdown(); this.counter(); this.titleScroll(); this.sparkles(); this.noSteal(); this.music(); this.guestbook(); if (!document.getElementById("splash")) this.popup(6000); }
  };
  document.addEventListener("DOMContentLoaded", function () { window.Site.boot(); });
})();
