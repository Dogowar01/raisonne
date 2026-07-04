/* ============================================================
   Raisonné — service worker

   Strategy:
   • HTML navigations → NETWORK-FIRST (always get the latest app
     when online; fall back to the cached copy offline). This is
     what stops a stale version from "sticking".
   • Google Fonts      → stale-while-revalidate.
   • Other same-origin → cache-first.

   Bump CACHE to retire old caches on the next visit.
   ============================================================ */
"use strict";
const CACHE = "raisonne-v3";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(
      SHELL.map(u => c.add(u).catch(() => {/* tolerate a missing shell entry */}))
    ))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const isDoc = req =>
  req.mode === "navigate" ||
  (req.destination === "document") ||
  (req.headers.get("accept") || "").includes("text/html");

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isFont = url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com";

  // App HTML: network-first so a new version is picked up as soon as it's online.
  if (url.origin === location.origin && isDoc(req)) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const c = await caches.open(CACHE);
        c.put("./index.html", fresh.clone());
        return fresh;
      } catch (_) {
        return (await caches.match(req)) || (await caches.match("./index.html"));
      }
    })());
    return;
  }

  // Google Fonts: serve cached immediately, refresh in the background.
  if (isFont) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const cached = await c.match(req);
      const network = fetch(req).then(r => {
        if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone());
        return r;
      }).catch(() => cached);
      return cached || network;
    }));
    return;
  }

  // Other same-origin assets: cache-first.
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(cached => cached || fetch(req).then(r => {
      if (r && r.ok) {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
      }
      return r;
    }).catch(() => caches.match("./index.html"))));
  }
});
