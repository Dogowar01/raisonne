# Raisonné

A private registrar for **Signal9 Studio** — three lightweight registers in one single-file,
offline-first app, no backend: **Editions** (fine-art print editions, the full studio suite),
**Apps** (what you're building), and **Writing** (what you're writing). See
[`raisonne-brief.md`](raisonne-brief.md) for the original Editions spec.

## Three registers, one shell

A tab bar in the masthead (**Editions · Apps · Writing**) switches between them. All three share
the same gallery-at-night shell — atmosphere, dark/light theme, fonts, the fractured mark,
per-image palette glow, and exhibition view — but each has its own IndexedDB store, its own
tailored fields, and **its own accent colour and room atmosphere**: Editions keeps the archival
verdigris/brass; Apps runs on a cool circuit-blue; Writing on a literary plum. The brass mark and
wordmark stay constant across all three — that's the studio's signature, not a section's.

- **Editions** — the full studio suite: sales register, collectors, market mode, studio dashboard,
  palette studio, collector catalogue, certificates. Unchanged, and still the primary register.
- **Apps** — a lightweight project shelf: name, one-line pitch, status (Idea/Building/Shipped/
  Archived), stack tags, repo/live links, notes, an optional screenshot. Grouped by status.
- **Writing** — a lightweight manuscript index: title, type, status (Idea/Drafting/Editing/
  Submitted/Published), a word-count meter against a goal, synopsis, notes, an optional cover.
  Grouped by status. (Not a writing tool — if you want the fuller writing-companion experience,
  that's what Ballast is for; this is just an at-a-glance register.)

Search, grid/ledger view, exhibition view (click the artwork to view it large), CSV export,
and undo-safe delete all work the same way across all three tabs. **Back up** always bundles
every register (plus collectors) into one JSON; **CSV** exports whichever tab is active.
Editions-only tools (Market, Collectors, Studio, Palette, Catalogue, Print) simply hide on the
other two tabs.

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

## Exhibition view & safety

- **Exhibition view:** click any **artwork** to view it large — the room dims and the print hangs
  in its own palette's glow; **← →** walks the gallery, Esc leaves. Click a plate's **caption**
  (or a ledger row) to edit instead.
- **Undo-safe delete:** removing a work shows an 8-second **Undo** toast; the record only truly
  leaves the register when the grace period passes.
- **Tier spin-offs:** in a saved work's card, **"Spin off tier"** creates the A2 Hero / A3 / Art
  Card sister edition sharing the same image, starting at zero sold.
- **Edition guards:** sold can't exceed the edition, and selling the last number automatically
  stamps the work **Sold out**.
- **A quiet guide:** press **?** (or the toolbar ?) for the room map and keyboard shortcuts.

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
