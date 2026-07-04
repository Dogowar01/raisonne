# Raisonné

A private registrar's ledger for **Signal9 Studio** fine-art print editions. Single-file,
offline-first, no backend. See [`raisonne-brief.md`](raisonne-brief.md) for the full spec.

## Files

| File | Role |
|---|---|
| `raisonne.html` | The whole app — HTML, CSS, JS inline. Open it and it works. |
| `manifest.webmanifest` | Web app manifest, so it installs as a desktop/standalone app. |
| `sw.js` | Service worker — caches the app shell + Google Fonts for true offline use. |
| `icon.svg` | App / favicon (verdigris monogram). |
| `raisonne-brief.md` | The build brief / design spec. |

## Running it

**As a local file** — double-click `raisonne.html`. Works fully offline; the service worker
simply doesn't activate on `file://`, and the app runs identically without it (fonts fall back
to system serif/mono when offline).

**As an installed app (recommended)** — serve the folder over http(s), open `raisonne.html`,
then use Chrome/Edge **⋮ → Install this site as an app**. It runs in its own window with a
desktop icon. Any static host works, e.g. from this folder:

```
python -m http.server 4173      # then open http://localhost:4173/raisonne.html
```

Once loaded over http(s) once, the service worker caches everything (including fonts), so it
opens offline thereafter. Bump the `CACHE` constant in `sw.js` to force a refresh after edits.

## Your data & backups

All works and preview images live in the browser's **IndexedDB** — private to this browser
profile, never uploaded. Because that store *can* be cleared (clearing site data, some
"clean up" tools), the durability guarantee is the **Back up** button: it exports one
timestamped JSON containing all metadata **and** the preview images. **Restore** merges it back
in. Back up before anything risky.

## The "treatment" applied to the reference build

- **PWA polish + offline:** added the manifest, an SVG app icon, apple/standalone meta tags,
  and a service worker (app-shell cache-first + Google-Fonts stale-while-revalidate). All
  guarded so `file://` behaves exactly as before.
- **Review & fixes:** honoured `prefers-reduced-motion` (transitions/animations/smooth-scroll
  disabled), added keyboard-only `:focus-visible` outlines, and fixed double-escaped `alt` text
  on preview images — the three quality-floor gaps against the brief.
- **Verified:** loads with no console errors; drop→stage→save (filename→title inference, WebP
  downscale, IndexedDB persist, plate hydrate), edition meter, theme toggle + persistence,
  series grouping/rail, and the backup image-bundling roundtrip all confirmed working.
