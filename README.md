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

- The **Back up** button shows a small oxblood dot when there are changes since your last backup.
- In Chrome/Edge, Back up uses the **File System Access API** — the first backup asks where to
  save, and every backup after that overwrites the same file with one click.
- **CSV** exports the register (metadata + sold numbers/buyers, no images) for spreadsheets or
  insurance.

## Registrar features

- **Per-number sale tracking:** in a work's card, the *Sales register* shows the whole edition as
  a number grid — tap a number to mark it sold, then record the buyer, date and price. The Sold
  count and the edition meter follow it automatically.
- **Open the master file on disk:** *Link masters folder…* once (Chrome/Edge), then *Open master*
  resolves the work's master filename in that folder and opens it. (Browsers can preview images /
  PDFs and download other formats; they can't launch an external editor directly.)
- **Collector catalogue:** the **Catalogue** button generates a self-contained public HTML page
  (embedded images, grouped by collection, with availability and price) — print it to PDF for
  collectors. It deliberately omits sold counts, buyers and private notes to protect edition
  integrity. Concept/Proofing works are excluded.

## The studio suite

- **Market mode** (toolbar **Market**): a stall companion. Tap a work to sell its next available
  number; a running day total and count sit up top, with one-tap **Undo**. Everything writes
  straight into the register.
- **Collectors (CRM)** (toolbar **Collectors**): buyers with contact details, purchase history and
  totals. **Sync buyers** pulls names from your recorded sales; sale rows autocomplete against your
  collectors. Each work has a **waitlist** with a **Notify** button (bcc mailto to those collectors).
- **Certificates of Authenticity**: each sale row has a **COA** button — a printable certificate for
  that numbered impression (edition n/N, medium, buyer, date, studio mark, signature line).
- **Fulfilment**: every sale carries a stage — *Reserved → Paid → Shipped*.
- **Studio dashboard** (toolbar **Studio**): revenue, impressions sold, profit (from per-print
  costs), remaining and closed editions; breakdowns by collection, best sellers, and revenue by year.
- **The vault** (toolbar **Vault**): requests **persistent storage** so the browser won't evict your
  data, and shows a usage meter, backup age and a health warning. Back-ups now include collectors too.

## Palette studio (colour tools for making art)

Open **Palette** in the toolbar (studio-wide) or **Colour tools** on a work's card.

- **Eyedropper** — tap anywhere on a print to sample that exact colour; it copies to your clipboard
  and joins your picked swatches.
- **Swatches** — the auto-extracted palette and colour **harmonies** (complementary / analogous /
  triadic) as chips; click any to copy the hex.
- **Value & composition** — toggle a **grayscale** value view and **thirds / golden / diagonal**
  overlays on the image (non-destructive) to check tone and composition.
- **Export** — download a palette as **GIMP `.gpl`**, **Adobe `.ase`**, **Procreate `.swatches`**,
  or a **PNG swatch card** — a direct bridge from a finished edition back into your next canvas.
- **Studio palette** — aggregates the dominant colours across every work into your Signal9
  signature palette (overall and per collection), exportable as one file.
- **Reference image** — *Reference…* loads any inspiration image (not catalogued) into the same
  tools to pull a palette for planning a new piece.
- **Value & Duotone views** — grayscale value study, or a **duotone** that maps the print's tones
  to your first two picked colours (test a colour treatment before you paint it).
- **A-crop guide** — overlays the √2 A-series crop so you can see how a master fits A2/A3.
- **Pigment names** — every swatch names its nearest traditional pigment (Burnt Sienna, Payne's
  Grey…) for mixing/ordering.
- **Studies export** — a 3-value **notan** PNG and a framed **wall-mockup** PNG from any print.
- **Print-fit** — on a work's card, the image's original pixels show an **A2 dpi estimate** with a
  warning if it's too low-res to print large.

## Visual identity — a gallery at night

Tuned to the **Signal9 Studio aesthetic**: beauty-in-darkness, warm and atmospheric, never flat.
The app opens **dark by default** — a gallery after hours where the artwork is the light source:

- **A breathing room:** three slow pools of ember/verdigris/oxblood light drift behind everything,
  with dust motes rising through the beams and film grain on the air. (All of it stands down for
  `prefers-reduced-motion`, and it's compositor-cheap — transforms and one small canvas.)
- **The artwork lights the wall:** each plate casts a glow in **its own palette** onto the ground
  beneath it — a rust print warms its corner of the room, a teal print cools it.
- **The signal transmits:** the fractured nine-bar mark shimmers bar-by-bar, like a live signal.
- **Collections as rooms:** giant italic **ghost numerals** (01, 02…) sit behind each collection
  title, with hairline rules that fade out in the collection's own colour.
- **Living details:** the accession drawer wears a gradient strip of its work's palette; grid ↔
  ledger switches recompose with a staggered rise; dialogs carry brass→verdigris identity strips;
  the empty state is the glowing mark itself.

- **Palette:** aged-paper warmth in light, **warm charcoal** in dark (not cool black), with
  atmospheric radial glows, a soft vignette, and a runtime-generated **film-grain** overlay so
  surfaces feel like canvas rather than flat fills. Verdigris + oxblood, plus a **brass/amber**
  accent for highlights.
- **Type:** italic **Fraunces** (a modern high-contrast serif) for the wordmark, section headers
  and plate titles; **Space Grotesk** for UI and prose; JetBrains Mono for all ledger data.
- **Fracture motif** (Signal9's theme): the top bar carries a bold brass→verdigris **gradient**
  under a generated **cracked-glass** overlay, and the logomark is a nine-bar signal **displaced
  along a diagonal fault line**.
- **Depth:** the masthead and toolbar are raised with layered shadows; plates sit on a 3D
  perspective and **tilt and lift on hover**.
- **Per-image palette:** every card reflects the colours of *its own artwork*. Each preview is
  sampled for up to four dominant tones (muted into the theme) and shown as a full-width **colour
  strip** across the top of the plate, with the card's mount, image matte and border **washed in
  the image's dominant tone**. Each collection header shows its **combined palette**; the index-rail
  dot uses the set's dominant. Palettes are cached per work and recomputed only when its image
  changes.

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
