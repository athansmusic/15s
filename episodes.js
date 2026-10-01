// ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//   15 SECOND MYSTERIES  --  THE DATA FILE  (edit this one every day!!)
// ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//
// HOW TO ADD TODAY'S MYSTERY:
//   Copy the top entry, paste it above it, bump "n", set "date" (YYYY-MM-DD),
//   the title, a one-line blurb, and "src" (a link to the episode: an .mp3,
//   YouTube, Spotify, anything). Episodes with a date in the future stay hidden
//   until that day, so you can queue a bunch up in advance.
//
// KICKSTARTER: the button on the page. Fill in "url" and "launch" once and it
//   switches by itself:
//     no url yet         -> greyed-out "Kickstarter launching soon"
//     before launch day  -> "Notify me on Kickstarter" (the pre-launch page)
//     launch to the end  -> "Back it on Kickstarter"
//     after "days" run   -> "See it on Kickstarter"
//   Use the campaign's public URL, NOT the preview link with "?token=" in it.
//   The pre-launch page and the live campaign use the same URL.
//
// The episode list and LINKS below are kept for later but not shown right now.

window.SITE = {
  seasonEpisodes: 90,                   // Season One = 90 cases, exactly 15 seconds each (promise)
  bgMusicYouTubeId: "U4gkWzrNORA",      // Computer Fan Ambient Noise ( 1 Hour ), looped forever
};

window.KICKSTARTER = {
  url: "",            // e.g. "https://www.kickstarter.com/projects/theredactedunit/15-second-mysteries"
  launch: "",         // launch day "YYYY-MM-DD", or an exact time like "2026-10-31T10:00:00-05:00"
  days: 15,           // campaign length
  goal: 15,           // dollars
};

window.LINKS = {
  spotify: "",
  apple: "",
  youtube: "",
  rss: "",
};

window.EPISODES = [
  // ---- NEWEST FIRST ----
  {
    n: 1,
    date: "2026-09-30",
    title: "no ep",
    blurb: "",
    src: "",
  },
];
