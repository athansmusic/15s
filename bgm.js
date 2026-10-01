// background music. hidden. no controls. you cannot stop it.
(function () {
  var id = (window.SITE || {}).bgMusicYouTubeId; if (!id) return;
  var VOLUME = 6; // out of 100
  var box = document.createElement("div");
  box.style.cssText = "position:fixed;left:-9999px;top:0;width:200px;height:113px;overflow:hidden";
  box.innerHTML = '<div id="bgm"></div>';
  document.body.appendChild(box);
  var tag = document.createElement("script"); tag.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(tag);
  var P = null, playing = false;
  function go() { if (P && P.playVideo) { P.unMute(); P.setVolume(VOLUME); P.playVideo(); } }
  window.onYouTubeIframeAPIReady = function () {
    P = new YT.Player("bgm", {
      width: 200, height: 113, videoId: id,
      playerVars: { loop: 1, playlist: id, controls: 0, autoplay: 1, rel: 0, playsinline: 1, disablekb: 1 },
      events: {
        onReady: go,
        onStateChange: function (ev) {
          if (ev.data === YT.PlayerState.PLAYING) playing = true;
          if (ev.data === YT.PlayerState.ENDED || ev.data === YT.PlayerState.PAUSED) go();
        }
      }
    });
  };
  // browsers block sound until the visitor does something; the first click or key starts it
  ["click", "keydown", "touchstart"].forEach(function (t) {
    document.addEventListener(t, function () { if (!playing) go(); }, true);
  });
})();
