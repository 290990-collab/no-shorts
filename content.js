(() => {
  "use strict";

  const SHORTS_PATH = /^\/shorts(?:\/|$)/;

  // ---- 1. Never stay on a /shorts page ----
  // YouTube switches pages without reloading, so the network rule alone is not enough:
  // check the address on every in-app navigation.
  const leaveShorts = () => {
    if (SHORTS_PATH.test(location.pathname)) {
      location.replace(location.origin + "/");
    }
  };
  leaveShorts();
  for (const ev of ["yt-navigate-start", "yt-navigate-finish", "popstate", "pageshow"]) {
    window.addEventListener(ev, leaveShorts, true);
    document.addEventListener(ev, leaveShorts, true);
  }
  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      leaveShorts();
    }
  }, 200);

  // ---- 2. Clicks on Shorts links do nothing ----
  const isShortsLink = (a) => {
    try {
      const url = new URL(a.href, location.href);
      return url.hostname.endsWith("youtube.com") && SHORTS_PATH.test(url.pathname);
    } catch {
      return false;
    }
  };
  const blockEvent = (e) => {
    const a = e.target instanceof Element && e.target.closest("a[href]");
    if (a && isShortsLink(a)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };
  for (const ev of ["click", "auxclick", "mousedown", "touchstart"]) {
    document.addEventListener(ev, blockEvent, { capture: true, passive: false });
  }

  // ---- 3. Hide whatever the CSS misses ----
  const SHELVES = [
    "ytd-rich-section-renderer",
    "ytd-reel-shelf-renderer",
    "grid-shelf-view-model",
    "ytm-rich-section-renderer",
    "ytm-reel-shelf-renderer",
  ].join(",");
  const ITEMS = [
    "ytd-rich-item-renderer",
    "ytd-video-renderer",
    "ytd-grid-video-renderer",
    "ytd-compact-video-renderer",
    "ytd-playlist-video-renderer",
    "ytd-notification-renderer",
    "ytd-guide-entry-renderer",
    "ytd-mini-guide-entry-renderer",
    "yt-lockup-view-model",
    "ytm-rich-item-renderer",
    "ytm-video-with-context-renderer",
    "ytm-compact-video-renderer",
    "ytm-pivot-bar-item-renderer",
  ].join(",");
  // Tabs and chips labelled "Shorts" (channel tabs, search filters, mobile nav)
  const LABELLED = [
    "yt-tab-shape",
    "tp-yt-paper-tab",
    "yt-chip-cloud-chip-renderer",
    "chip-view-model",
    "ytd-guide-entry-renderer",
    "ytd-mini-guide-entry-renderer",
    "ytm-pivot-bar-item-renderer",
  ].join(",");

  const hide = (el) => el && !el.hasAttribute("data-no-shorts") && el.setAttribute("data-no-shorts", "");

  const sweep = () => {
    for (const a of document.querySelectorAll('a[href*="/shorts"]')) {
      if (!isShortsLink(a)) continue;
      // Hide a whole shelf only when it holds nothing but Shorts
      const shelf = a.closest(SHELVES);
      if (shelf && !shelf.querySelector('a[href*="/watch?"]')) {
        hide(shelf);
      } else {
        hide(a.closest(ITEMS) || a);
      }
    }
    for (const el of document.querySelectorAll(LABELLED)) {
      if (el.textContent.trim() === "Shorts") hide(el);
    }
  };

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sweep();
    });
  };

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href"],
  });
  document.addEventListener("DOMContentLoaded", schedule);

  // ---- 4. Optional extras chosen in the popup ----
  // Each enabled option becomes an attribute on <html> (data-ns-comments, ...) and
  // content.css hides the matching parts. Shorts are not an option: they stay off.
  const OPTIONS = ["comments", "chat", "related", "endscreen", "homefeed"];
  const root = document.documentElement;
  const applyOptions = (values) => {
    for (const key of OPTIONS) {
      if (key in values) root.toggleAttribute("data-ns-" + key, values[key] === true);
    }
  };
  // The home feed option needs to know when we are on the home page
  const markHome = () => root.toggleAttribute("data-ns-at-home", location.pathname === "/");
  markHome();
  for (const ev of ["yt-navigate-finish", "popstate", "pageshow"]) {
    window.addEventListener(ev, markHome, true);
  }
  setInterval(markHome, 500);

  // The userscript build defines NO_SHORTS_STORE (Violentmonkey storage);
  // the extension uses chrome.storage.
  const store =
    typeof NO_SHORTS_STORE !== "undefined"
      ? NO_SHORTS_STORE
      : typeof chrome !== "undefined" && chrome.storage
        ? {
            load: (keys, cb) => chrome.storage.sync.get(keys, cb),
            watch: (cb) =>
              chrome.storage.onChanged.addListener((changes, area) => {
                if (area !== "sync") return;
                const values = {};
                for (const [k, c] of Object.entries(changes)) values[k] = c.newValue;
                cb(values);
              }),
          }
        : null;
  if (store) {
    store.load(OPTIONS, applyOptions);
    store.watch(applyOptions);
  }
})();
