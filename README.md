# No Shorts

**You opened YouTube for one video. Shorts were counting on that.**

No Shorts is a tiny browser extension that removes YouTube Shorts from the web: the sidebar entry, the shelves, the search results, the channel tab, and the `/shorts` URL itself. Chrome, Edge, Brave, Opera and Firefox.

[![License: MIT](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE)
![Manifest V3](https://img.shields.io/badge/manifest-v3-black.svg)
![Dependencies: 0](https://img.shields.io/badge/dependencies-0-black.svg)

| | |
|---|---|
| **Size** | 4 files, about 6 KB, no build step |
| **Permissions** | `youtube.com` only. No tabs, no history, no other sites |
| **Network requests** | None. No analytics, no server, nothing leaves your browser |

## What it does

A friend sends you a Shorts link. You land on the YouTube homepage.

- **The URL is dead.** `youtube.com/shorts/...` redirects to the homepage before the page loads, whether you came from a chat, a bookmark or a Google result.
- **The way in is gone.** No Shorts button in the sidebar, no Shorts shelf on the home page, no Shorts in search, subscriptions, related videos or notifications, no Shorts tab on channels, no Shorts filter in search.
- **Clicks go nowhere.** Any Shorts link that survives on the page does nothing when clicked.
- **Navigation is watched.** YouTube switches pages without reloading. No Shorts checks every in-app navigation, so the back button can't drop you into the feed either.

It covers `www.youtube.com` and `m.youtube.com`.

## Install

### Chrome, Edge, Brave, Opera

1. Download `no-shorts-1.0.0.zip` from the [latest release](https://github.com/290990-collab/no-shorts/releases/latest) and unzip it somewhere permanent. The browser loads the extension from that folder, so don't delete it later.
2. Open `chrome://extensions` (Edge: `edge://extensions`, Brave: `brave://extensions`, Opera: `opera://extensions`).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped folder.
5. Open **Details** on No Shorts and turn on **Allow in Incognito**.
6. Reload any open YouTube tab.

### Firefox

Firefox only accepts signed extensions permanently, so on Firefox No Shorts runs as a userscript. Same code, no account needed.

1. Install [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) from the Firefox add-ons site. When asked, allow it to run in private windows.
2. Open [no-shorts.user.js](https://raw.githubusercontent.com/290990-collab/no-shorts/main/no-shorts.user.js). Violentmonkey shows an install page.
3. Click **Install**.
4. Reload any open YouTube tab.

Violentmonkey checks this repository for new versions and updates the script on its own.

### Check that it works

Type `youtube.com/shorts` in the address bar. You should land on the YouTube homepage.

## FAQ

**Can I still watch a Short someone sends me?**
Only as a normal video. If the link is `youtube.com/watch?v=...`, it plays in the regular player, with no swipe and no next Short. No Shorts removes the feed, not every video that happens to be vertical.

**Something Shorts-shaped came back.**
YouTube renames its page elements from time to time. [Open an issue](https://github.com/290990-collab/no-shorts/issues) with a screenshot and the page address, and the filters get updated. The `/shorts` redirect doesn't depend on page elements and keeps working regardless.

**Can I lock it so I can't turn it off?**
No Shorts is built for people who want the temptation gone, not for parental control. Anyone with access to the browser can disable it in the extensions page.

**What does it collect?**
Nothing. There is no server to send anything to. The whole extension is four short files you can read in five minutes: [manifest.json](manifest.json), [rules.json](rules.json), [content.css](content.css), [content.js](content.js).

**Why is "Developer mode" needed on Chrome?**
No Shorts isn't on the Chrome Web Store, and Developer mode is how Chrome loads an extension from a folder. It doesn't change anything else in the browser.

## How it works

| File | Job |
|---|---|
| [rules.json](rules.json) | A `declarativeNetRequest` rule that redirects any `/shorts` page load to the homepage, before YouTube's code runs |
| [content.css](content.css) | Hides every known Shorts element as soon as it appears |
| [content.js](content.js) | Leaves `/shorts` pages reached by in-app navigation, blocks clicks on Shorts links, hides what the CSS misses |
| [no-shorts.user.js](no-shorts.user.js) | The same CSS and script in one userscript, for Firefox |

## Contributing

Pull requests that fix a Shorts element YouTube added or renamed are the most useful kind.

1. Edit `content.css` or `content.js`. Don't edit `no-shorts.user.js` by hand.
2. Raise `version` in `manifest.json`.
3. Run `node build-userscript.mjs` to rebuild the userscript.
4. Reload the extension in `chrome://extensions` and check the pages you touched.

## License

[MIT](LICENSE)
