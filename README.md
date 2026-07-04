# Raisonné

A private registrar's ledger for **Signal9 Studio** fine-art print editions. Single-file,
offline-first, no backend. See [`raisonne-brief.md`](raisonne-brief.md) for the full spec.

## Files

| File | Role |
|---|---|
| `index.html` | The whole app — HTML, CSS, JS inline. Open it and it works. |
| `manifest.webmanifest` | Web app manifest, so it installs as a desktop/standalone app. |
| `sw.js` | Service worker — network-first HTML + cached shell/fonts for offline use. |
| `icon.svg` | App / favicon (verdigris monogram). |
| `raisonne-brief.md` | The build brief / design spec. |

## Running it

**As a local file** — double-click `index.html`. Works fully offline; the service worker
simply doesn't activate on `file://`, and the app runs identically without it (fonts fall back
to system serif/mono when offline).

**As an installed app (recommended)** — serve the folder over http(s), open it, then click the
**Install** button that appears in the toolbar (or use Chrome/Edge **⋮ → Install this site as an
app**). It runs in its own window with a desktop icon. Any static host works, e.g. from this
folder:

```
python -m http.server 4173      # then open http://localhost:4173/
```

The HTML is served **network-first**, so once you're online you always get the latest version;
offline, it falls back to the cached copy. Fonts and the app shell are cached for offline use.
After editing the app, bump the `CACHE` constant in `sw.js` so old caches are retired cleanly.

## Your data & backups

All works and preview images live in the browser's **IndexedDB** — private to this browser
profile, never uploaded. Because that store *can* be cleared (clearing site data, some
"clean up" tools), the durability guarantee is the **Back up** button: it exports one
timestamped JSON containing all metadata **and** the preview images. **Restore** merges it back
in. Back up before anything risky.

## Visual identity

- **Signal9 mark:** a nine-bar "signal" logomark (verdigris) sits in the masthead beside the
  Raisonné wordmark, tying the register to the studio.
- **Per-collection colour:** each series takes a colour *derived from its own artwork* — the plate
  previews are sampled for a dominant hue, muted into the archival palette, and applied as that
  collection's accent (header swatch + rule, index-rail dot and active marker, and a thin spine
  along the top of every plate in the set). Collections with no images stay neutral. The colour
  is cached per collection and recomputed only when the set or one of its images changes.

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
