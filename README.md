# 15 Second Mysteries ~ official homepage

One plain page in the show art's colours: the logo, the show description, a Kickstarter link, and a 15-second game of Snake. Plain HTML, CSS and JS, no build step, no framework. Upload the folder anywhere that serves static files (Vercel, Netlify drop, GitHub Pages, Cloudflare Pages).

## Kickstarter

Paste the campaign URL into `LINKS.kickstarter` in `episodes.js`. The Kickstarter section on the page then shows a "Back it on Kickstarter" button. While it is empty the section just says "Launching soon. The goal is $15."

The page does not show episodes or the other listen links right now. `EPISODES` and the rest of `LINKS` stay in `episodes.js` so they can come back later.

## Background music

`SITE.bgMusicYouTubeId` is looped via the YouTube IFrame API by `bgm.js`. It is hidden and has no controls. Browsers block sound until the visitor clicks or presses a key, so it starts on the first interaction. The volume is `VOLUME` at the top of `bgm.js` (0 to 100).

## Snake

Eat 15 in 15 seconds to win. It is tuned to be hard but possible: a 15x15 board, 80ms a step, and new food always lands within 6 steps of the snake's head. Both knobs are at the top of `snake.js`: lower `REACH` to make 15 easier, raise it to make it harder (28 puts food anywhere on the board); a lower `SPEED` is a faster snake. Arrow keys or WASD on a keyboard, swipe on a phone. Space starts or restarts a game.

The clock counts down in milliseconds, huge, behind the game.

Winning flips the whole site: the black becomes the violet and the violet becomes the black, pulsing out from the snake's head in board-sized pixels (browsers without view transitions just switch). It stays until the next win or a refresh. The flipped colours are the `html.flip` line in `style.css`.

## Look

Colours are sampled from the show art and live at the top of `style.css` (`--ink` is the black paper, `--violet` is the 15). `snake.js` reads the same colours for the canvas. No web fonts.

## Files

- `index.html` the page
- `404.html` the not-found page (Vercel picks it up automatically; elsewhere, point your host's 404 rule at it)
- `style.css`, `snake.js`, `bgm.js`, `episodes.js`
- `img/logo.png`, `img/logo-og.jpg`, `img/favicon.png` are web-sized copies of `15logo2.png` (the 4 MB original stays out of git)
- `vercel.json` clean URLs, plus redirects from the old `/v2`, `/guestbook` and `/cases`/`/faq` addresses (with or without `.html`) to the home page
