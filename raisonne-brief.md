# Raisonné — Build Brief

**A desktop catalogue for Signal9 Studio editions.** Single-file HTML PWA. A working reference build already exists (`raisonne.html`); this brief is the spec behind it so it can be rebuilt, extended, or handed to Claude Code cleanly.

---

## 1. One-liner

A quiet registrar's ledger for Kirk's fine-art print editions — drag print images in, collate them into series and works-order, name and describe each piece, and track the edition. Lives on the desktop, works offline, no backend.

---

## 2. Purpose & context

Signal9 Studio produces limited-edition archival giclée prints (editions of 25, A2 hero format, three-tier architecture: art card / A3 / A2 hero). Sales run through Tasmanian markets now (Harvest, Salamanca), moving to an online collector model later. This tool is the private master record behind all of it — the single source of truth for what exists, where the master file lives, how many of each edition have sold, and what each piece is about.

It is a **working tool for one person**, not a marketing site. Restraint is the whole point: if a change makes it quieter, it's probably right.

---

## 3. Platform & technical constraints

- **Single-file `raisonne.html`** — all HTML, CSS, JS inline. No build step, no framework, vanilla JS.
- **Offline-first.** No backend, no runtime AI, no network calls except Google Fonts on first load (must degrade gracefully to system serif/mono when offline).
- **Desktop delivery:** installed as an app via Chrome/Edge (*Install this site as an app*) so it runs in its own window with a desktop icon, or opened directly as a local `file://`. Both must work identically.
- **Persistence: IndexedDB.** localStorage is too small — print previews are image blobs. Three object stores:
  - `works` (keyPath `id`) — metadata objects
  - `images` (keyPath `id`) — downscaled preview blobs, one per work
  - `meta` (keyPath `key`) — settings (theme, view)
- **Image handling on import:** downscale to longest edge ~1600px, encode WebP (fallback JPEG), quality ~0.86. Store the preview blob; store the original filename as text (`file`). Do **not** store full-res masters in IndexedDB.
- Object URLs cached per work id and revoked on replace/delete to avoid leaks.

---

## 4. Visual design system

Concept: **a registrar's ledger crossed with a gallery wall.** Archival board, iron-gall ink, copper-plate patina. The artwork thumbnails are the hero; everything around them is disciplined and hairline-thin.

### Palette — light (default)
| Token | Hex | Role |
|---|---|---|
| `--board` | `#e8e7e1` | mat board / app ground |
| `--paper` | `#f3f2ed` | cards lift off the board |
| `--paper-2` | `#ecebe4` | frame wells, secondary bars |
| `--ink` | `#1b1a18` | primary text |
| `--ink-soft` | `#6b6a63` | metadata / secondary |
| `--ink-faint` | `#9a988f` | captions, disabled |
| `--rule` | `#cecdc4` | hairlines |
| `--accent` | `#46595b` | copper-plate verdigris — interactive/active only |
| `--stamp` | `#7a3b34` | oxblood — sold-out / retired only |

### Palette — dark ("after-hours studio")
Ground `#16161a`, cards `#202025`, text `#e7e6e0`, accent lifts to `#82a3a5`, stamp `#c07a70`. Toggle persists in `meta`.

Deliberately **not** the cream + terracotta AI-default look. Cool board, verdigris accent, oxblood used once.

### Type
- **Display (plates, titles):** Cormorant Garamond, 500 weight. Fallback Georgia.
- **Prose (descriptions):** Spectral. Fallback Georgia.
- **Data (all edition numbers, dimensions, status, dates, tallies):** JetBrains Mono. This is where the ledger personality lives — edition fractions like `12 / 25`, accession codes, section counts.

### Layout
- **Masthead:** wordmark "Raisonné" + eyebrow "Signal9 Studio · Register of Editions", with a running tally on the right (`N works · M series · K closed`).
- **Toolbar:** search, theme filter, status filter, grid/ledger toggle, print, back up, restore, light/dark, primary "Add work".
- **Left index rail:** series list with per-series counts; jumps to section; highlights active series on scroll. Hides under ~820px.
- **Catalogue:** works grouped into **series sections** (collapsible), each with a printed header + hairline rule + plate count. Within a section, works sort by **works-order**, then title.

### Signature element
The **mounted plate**: each work sits on a paper mount with a thin plate-mark frame; below it a hand-set caption — order number + year on one mono line, Cormorant title, then a mono data line (`A2 · Ed. 25 · 12 sold`) with a status tag. Sold-out/retired works carry a small rotated **oxblood stamp** in the corner. The edit drawer is styled as a registrar's **accession card**.

Quality floor: responsive to mobile, visible focus, `prefers-reduced-motion` respected, print stylesheet.

---

## 5. Data model

```js
{
  id,           // uid
  title,        // string
  desc,         // description of the piece (Spectral prose)
  series,       // grouping level 1
  theme,        // cross-cutting tag (filterable)
  order,        // int — works-order within the series
  year,         // int
  tier,         // "A2 Hero" | "A3" | "Art Card" | ""
  format,       // e.g. "A2"
  medium,       // default "Archival giclée"
  edition,      // int, default 25
  sold,         // int, default 0
  price,        // string (AUD, free-form)
  status,       // Concept | Proofing | Editioned | Active | Sold out | Retired
  file,         // master filename — where the real file lives on disk
  notes,        // private (sold-to, edition numbers, market debut, proofing)
  created, updated // timestamps
}
```
Preview blob stored separately in `images` under the same `id`.

---

## 6. Features

**Import (the core interaction).** Drag image files anywhere onto the window → full-window drop veil → each image downscaled and staged. Multi-drop **queues**: opens the accession card per image, pre-fills a title from the filename (`tamar_nocturne_03` → "Tamar Nocturne 03") and sets the master filename, waits for review + save, then advances to the next. Also an "Add work" button (blank card) and click-to-add / drop-onto-card image slot with Replace.

**Organisation.** Series is the primary grouping; works-order sorts within it; "Unassigned" sinks to the bottom. Theme is a cross-cutting filter, not a group.

**Two views.**
- *Plate grid* — gallery wall of mounted plates.
- *Ledger* — dense rows (order · thumb · title · format+edition · status · sold · reorder arrows).

**Editing — the accession card drawer.** All fields above, grouped: Placement / The edition / Registrar. Live **edition meter** (sold-of-edition bar; turns oxblood when full). Ctrl/Cmd-S saves, Esc closes.

**Reorder.** Up/down arrows per row in ledger view renumber works-order within the series (normalise to 1..n, swap). Order also directly editable in the card.

**Search & filter.** Text search across title/series/theme/description/notes/status; theme dropdown (populated from data); status dropdown. `/` focuses search.

**Backup / Restore.** Export bundles all metadata **and** previews (blobs → data URLs) into one timestamped JSON. Restore merges a backup back in, rebuilding blobs. This is the durability guarantee against IndexedDB being cleared — surface it, don't bury it.

**Print.** `window.print()` with a stylesheet that drops all chrome and lays the plates out cleanly as a physical catalogue.

**Status stamps.** Sold out / Retired render an oxblood corner stamp on the plate and count toward "closed" in the tally.

---

## 7. Interaction & edge cases

- Drop veil uses a drag-depth counter so nested dragleave events don't flicker it off.
- Dropping onto the window while the drawer is open = replace that work's image, not a new queue.
- Empty state: "An empty register" with drag/add invitation. Filtered-empty state is distinct ("Nothing matches").
- Untitled works allowed (default "Untitled"); missing order sorts last; missing image shows an empty frame well, not a broken icon.
- Delete asks for confirmation; removes both metadata and blob and revokes the URL.
- Fonts offline: system serif/mono fallbacks already declared so nothing breaks air-gapped.

---

## 8. Out of scope (v1) — candidate extensions

- **Full-resolution storage** or **File System Access API** handles so a click opens the actual master `.tif` on disk (persisted handles in IndexedDB).
- **Installable PWA polish:** web app manifest + service worker for GitHub Pages install and true offline caching of fonts.
- **Collector-facing export:** a public-catalogue HTML/PDF generation for the online model (respecting edition integrity — no discounting, no reprints surfaced).
- **Per-number sale tracking** (which of the 25 sold, to whom) as structured rows rather than free-text notes.
- **Market inventory** view for physical stall stock.
- Drag-to-reorder plates (currently arrows + numeric, chosen for robustness against the window-level file-drop handler).

---

## 9. Acceptance criteria

1. Opens offline as a local file and as an installed desktop app; data persists across sessions.
2. Dragging one or several print images in creates works with previews and pre-filled titles.
3. Works collate into collapsible series sections in works-order; rail navigates them.
4. Each work is nameable and describable with full edition metadata and a master-file reference.
5. Grid and ledger views both render; search and both filters work; ledger reorder renumbers correctly.
6. Backup exports a single JSON containing images; restore rebuilds them faithfully.
7. Print produces a clean catalogue. Light/dark toggle persists.
8. Visual system matches the tokens above; artwork is the loudest thing on screen.
