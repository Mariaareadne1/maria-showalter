# DESIGN-REVIEW — editorial redesign preview

**Status:** reviewable preview on branch `design/portfolio-editorial-explorations`. Not merged, not
deployed. `main`, `CNAME` and mariashowalter.com are unchanged. Nothing here is a final design.

## How to look at it

```bash
cd ~/Developer/design-engineering-build-2026/maria-showalter-redesign
python3 -m http.server 5451 --bind 127.0.0.1
# http://127.0.0.1:5451/                 provisional site
# http://127.0.0.1:5451/design-studies/  the three studies + background comparison
```

No hosted branch preview exists: GitHub Pages serves only `main`, and adding a second Pages source
would change production settings. Screenshots are committed instead (below).

## 1. Before → after

| | Before (live, `docs/screenshots/baseline/`) | After (preview, `docs/screenshots/preview/`) |
| --- | --- | --- |
| Home 1440 | `home--1440--chromium.jpg` — photo cut-out + name, 3-D card carousel hides the work in panels | `home--1440--chromium.jpg` — name, framed portrait slot, identity line, "Selected work ↓" |
| Home 390 | `home--390--chromium--full.jpg` — bio one word per line, sections blank until scrolled | `home--390--chromium--full.jpg` — recomposed: portrait first, name overlaps frame, every section readable |
| Work | `/work/` → 404 | `work--1440--chromium--full.jpg` — categorised index, statements visible, rows expand |
| Photos | `gallery-html--1440--chromium.jpg` — masonry, 2 broken images, shuffled alt text | `art--1440--chromium--full.jpg` (sequence) · `art-contact-sheet--1440--chromium.jpg` |
| Case study | `work-iris--1440--chromium.jpg` | `work-frameflow--1440--chromium.jpg` — same content, shared masthead, new type |

## 2. The three compositions

See `/design-studies/` and `DESIGN-DECISIONS.md §2` for critique and ranking. A (Editorial Index) is
the provisional basis; B contributed the media environments; C contributed the expanding Work index.

## 3. What works (tested)

Environment: macOS (Darwin 25.4), Node 22.21, Playwright 1.64 (Chromium 1248, WebKit 2370), local
`python3 -m http.server`. Firefox was not tested.

| Suite | Command | Result |
| --- | --- | --- |
| Smoke: 18 routes × 1440/1024/768/390/320 — HTTP 200, no horizontal overflow, no console/HTTP errors, images decode, one h1, alt attributes, no video under reduced motion, every internal link 200 | `node tests/smoke.mjs http://127.0.0.1:5451/` | Chromium: pass after one test-timing fix (menu `aria-expanded` read before the async `close` event). WebKit: pass after one test fix (WebKit tabs to links only with Option, as Safari does). Both re-run green on `/` after the fixes. |
| Phone menu | (in smoke) | Opens as modal, focus moves in, Escape closes, focus returns to Menu, `aria-expanded` resets |
| Skip link | (in smoke) | First tab stop on both engines |
| Video previews | (in smoke) | Play when visible with motion allowed; pause offscreen; never autoplay under reduced motion; explicit Play/Pause button |
| DJ deck — 29 checks per engine | `node tests/dj.mjs http://127.0.0.1:5451/` | **Chromium 29/29, WebKit 29/29.** No AudioContext or audio fetch before a gesture; load, play, pause holds position, seek, keyboard Space, LP/HP curves, equal-power crossfade, volume, Sync and tempo set real playbackRate, platter nudge and release, 404 error state, deselect-during-load regression. Uses a generated WAV fixture, never the commercial MP3s. |
| Hero boundary | `node tests/hero-integration.mjs http://127.0.0.1:5451/` | Owner's engine read from the protected checkout (not copied) mounts in the slot; fallback hides; no errors. Synthetic stand-in clips. |
| Content registry | `node scripts/build-content.mjs --check` | All regions up to date |
| Whitespace | `git diff --check` | Clean |
| Contrast | computed (DESIGN-DECISIONS §3) | All text tokens ≥ 4.87:1; brief's `#677180` rejected (4.32:1 on secondary field) |
| Independent code review (subagent) | — | Two real bugs in `dj.js` (deselect race; dead deck after back-forward cache) and three minor items — all fixed, regression test added |

**Performance — homepage, cold cache, Chromium, no throttling** (`node tests/perf.mjs`):

| | Requests | Transferred | LCP | CLS |
| --- | --- | --- | --- | --- |
| Live site @1440 | 96 | 27.28 MB | 324 ms | 0.000 |
| Preview @1440 | 22 | 0.60 MB | 120 ms | 0.002 |
| Live site @390 | 96 | 27.28 MB | 172 ms | 0.000 |
| Preview @390 | 22 | 0.60 MB | 100 ms | 0.010 |

The live numbers include five YouTube embeds and full-size photo scans; the preview loads lazy
derivatives and no third-party embeds. Hosts differ (GitHub Pages vs localhost), so compare bytes
and requests, not milliseconds.

**Deep links preserved:** `/work/frameflow/`, `/work/filo/`, `/work/iris/`, `/blog-*.html` (same
paths, text identical), `/gallery.html` (redirects to `/art/`), `/audacity/` (untouched). New:
`/work/`, `/playground/`, `/art/`, `/writing/`, `/about/`, `/404.html`, `sitemap.xml`, `robots.txt`.

**Not verified:** Firefox; real iOS Safari or Android devices (only emulated widths); screen-reader
output (structure and focus were tested, not spoken output); the live halftone with real footage
(the footage isn't on disk); GitHub Pages serving of `404.html` (it is only served from `main`).

## 4. Open decisions for the owner

1. **Portrait:** scale, crop, overlap with the name; merging `halftone/` and real footage; whether to
   pass `{"colors":{"paper":"#F6F6F2"}}` so the engine's white paper matches the page
   (`docs/screenshots/preview/hero-integration--synthetic-standin-clip.jpg` shows the white box —
   the clip there is the engine demo's synthetic stand-in, not a likeness).
2. **Typography:** keep Fraunces (continuity) or move the masthead to a sans (Study C).
3. **Cobalt density** and exact value (`#2348C7` now).
4. **Background:** Balanced in the hero only (now) vs. also at section transitions.
5. **Project lineup and order;** whether Iris sits in Work, Playground or both (both now).
6. **Navigation:** sticky or not (not now); keep the homepage margin index?
7. **Art default view** (Sequence now) and whether the old 3-D point-cloud viewer returns as a Playground piece.
8. **DJ deck:** keep this restyle, or ship `acrylic-deck` at `/deck/` (also fixes music rights).
9. **Music rights:** the six MP3s are commercial recordings without a licence in the repo.
10. **Copy:** hero sentence and section ledes are drafts written from verified facts.
11. **Hinge/Edition/Orbit media:** current images are pre-redesign captures, labelled as such on the page; swap when their redesigns land.

## 5. Suggested next iteration (priority order)

1. Integrate the real halftone footage and tune portrait scale against the name at 1440, 1024 and 390.
2. Replace the FrameFlow lead film with a darker, tighter crop of the studio (the capture is a light UI
   on light grey; the ink mat helps but the footage is still the weakest first impression).
3. Decide the deck question; if acrylic-deck wins, embed it and remove the commercial MP3s.
4. Give Playground real thumbnails for TONUS and the deck (currently type-only tiles).
5. Self-host the two Google font families to remove the third-party request and FOUT.
