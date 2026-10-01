# 15 Second Mysteries ~ official homepage

One plain page in the show art's colours: the logo, today's episode, where to listen, and a 15-second game of Snake. Plain HTML, CSS and JS, no build step, no framework. Upload the folder anywhere that serves static files (Vercel, Netlify drop, GitHub Pages, Cloudflare Pages).

## Adding today's mystery (the daily job)

Open `episodes.js` and paste a new entry at the TOP of `EPISODES`:

```js
{
  n: 2,
  date: "2026-10-01",
  title: "The Case of the ...",
  blurb: "One line about the case.",
  src: "https://.../episode.mp3",   // any link to the episode, or ""
},
```

- Episodes whose `date` is in the future stay hidden until that day, so you can queue the whole week up in advance.
- The page shows the newest released episode as TODAY'S EPISODE, numbered against `SITE.seasonEpisodes` (90).
- `src` becomes the LISTEN button. Leave it as `""` and there is no button.
- `blurb` shows under the title. Leave it as `""` to skip it.

## Links

Also in `episodes.js`, fill in `LINKS` (Kickstarter, Spotify, Apple, YouTube, RSS). Anything left as `""` stays off the page; if they are all empty the page says "coming soon".

## Background music

`SITE.bgMusicYouTubeId` is looped via the YouTube IFrame API by `bgm.js`. It is hidden and has no controls. Browsers block sound until the visitor clicks or presses a key, so it starts on the first interaction. The volume is `VOLUME` at the top of `bgm.js` (0 to 100).

## Snake

Eat 15 in 15 seconds to win. It is tuned to be hard but possible: a 15x15 board, 80ms a step, and new food always lands within 6 steps of the snake's head. Both knobs are at the top of `snake.js`: lower `REACH` to make 15 easier, raise it to make it harder (28 puts food anywhere on the board); a lower `SPEED` is a faster snake. Arrow keys or WASD on a keyboard, swipe on a phone.

## Look

Colours are sampled from the show art and live at the top of `style.css` (`--ink` is the black paper, `--violet` is the 15). `snake.js` repeats the same colours for the canvas. No web fonts.

## Files

- `index.html` the page
- `404.html` the not-found page (Vercel picks it up automatically; elsewhere, point your host's 404 rule at it)
- `style.css`, `snake.js`, `bgm.js`, `episodes.js`
- `img/logo.png`, `img/logo-og.jpg`, `img/favicon.png` are web-sized copies of `15logo2.png` (the 4 MB original stays out of git)- `vercel.json` clean URLs, plus redirects from the old `/v2` and `/guestbook` addresses to the home page
