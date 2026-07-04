/* ============================================================
   Raisonné — service worker
   Caches the app shell (cache-first) and Google Fonts
   (stale-while-revalidate) so the register opens fully offline
   once it has been loaded once over http(s).
   Bump CACHE to invalidate everything on the next visit.
   ============================================================ */
"use strict";
const CACHE = "raisonne-v2";
const SHELL = ["./", "./raisonne.html", "./manifest.webmanifest", "./icon.svg"];

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

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isFont = url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com";

  // Google Fonts: serve cached copy immediately, refresh in the background.
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

  // Same-origin (app shell): cache-first, fall back to the app if offline.
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(cached => cached || fetch(req).then(r => {
      if (r && r.ok) {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
      }
      return r;
    }).catch(() => caches.match("./raisonne.html"))));
  }
  // Everything else (should be nothing) falls through to the network.
});
