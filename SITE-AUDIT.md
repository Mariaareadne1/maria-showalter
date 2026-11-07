# Site audit — mariashowalter.com (baseline before the editorial redesign)

Audited 2026-10-25 against `origin/main` @ `9ca218c` and the live site. Nothing here was changed on
`main` or in production.

## Repository and worktrees

| Path | Branch | State | Role |
| --- | --- | --- | --- |
| `~/Development/Personal/maria-showalter` | `iris-header-preview` @ `11c3303` | **dirty — protected**: `M index.html`, `?? halftone/`, `?? playground.html` | Owner's halftone-hero workstream. Read only. |
| `~/Developer/design-engineering-build-2026/maria-showalter` | `case-studies` @ `9ca218c` | clean | Earlier case-study work (already fast-forwarded to `main`). |
| `~/Developer/design-engineering-build-2026/maria-showalter-redesign` | `design/portfolio-editorial-explorations` | this work | Created from `origin/main`; upstream unset so a bare `git push` cannot reach `main`. |

Remote: `https://github.com/Mariaareadne1/maria-showalter.git`. Hosting: GitHub Pages from `main`,
`CNAME` = `mariashowalter.com`. No build step, no Jekyll config, no `.nojekyll`.

## Architecture

Static HTML. Every page carries its own inline `<style>` and `<script>`; no shared CSS except
`work/case-study.css` (the three case studies). Fonts: Fraunces (3 local TTFs, ~1.1 MB together, no
`font-display`), IBM Plex Sans/Mono from Google Fonts. Three.js r128 from cdnjs only on `gallery.html`.

## Routes (all verified 200 locally; live statuses noted)

| Route | Content | Notes |
| --- | --- | --- |
| `/` (`index.html`, 542 lines) | Hero photo + name, about/contact, 3-D "records" carousel of six panels (Projects, Experience, Music, Creative, About, Contact), Writing strip, Photos strip, DJ deck, YouTube embeds, song-recommendation bubble, footer | Projects list lives inside a JS template string (line 476). |
| `/index6.html` | Older copy of the homepage | Not linked anywhere. Left untouched. |
| `/gallery.html` | 15-photo masonry + Three.js point-cloud "sphere" lightbox | Inbound deep link; must stay reachable. |
| `/work/frameflow/`, `/work/filo/`, `/work/iris/` | Case studies (shared `case-study.css`) | Live, smoke-tested in the previous build. |
| `/work/` | — | **404 live and locally.** No Work index exists. |
| `/blog-creativity.html`, `/blog-cartpole.html`, `/blog-pid.html`, `/blog-filo.html` | Essays | Inbound links; keep paths. |
| `/audacity/`, `/audacity/story.html` | The Audacity Project microsite (own berry/bone identity) | Out of scope; untouched. |
| `/404.html` | — | Missing; GitHub Pages serves its default 404. |

## Media inventory

- **Film photographs**: 14 JPEGs at 3089×2048, 2–5.7 MB each, served full size to the homepage strip
  and gallery (the homepage strip alone pulls ~25 MB). EXIF: `NORITSU KOKI EZ Controller` — lab scans;
  the EXIF date is the scan date (25 Mar / 12 Apr 2026), not the shooting date. Camera body unknown.
- **B/W darkroom/process shots**: `IMG_9084_bw.jpg` (negative on scanner), `IMG_F8D2FAD1_bw.jpg`
  (camera internals), `IMG_5BFD1833_bw.jpg` (street through a negative).
- **Personal**: `photo_main.png` (912×558 cut-out portrait used in the hero), `photo_dj1.jpg`,
  `photo_dj2.png`, three Algorave screenshots.
- **Case-study media** (`work/media/`): FrameFlow capture MP4 + poster, before/after stills, style
  thumbnails; Iris three MP4s + posters + stills + two m4a sound clips.
- **Audio**: six full-length commercial MP3s (24 MB together) — see *Rights* below.

Derivatives made for this redesign (originals untouched): `assets/media/photos/*-1600.jpg` and
`*-800.jpg` (sips, q78). Product shots for Hinge, Edition and Orbit were copied with `git show HEAD:`
from each app's committed `docs/media/` (their working trees were not touched) and resized the same way.

## Defects found on the live site

1. **Mobile layout is broken.** No media queries on the homepage: at 390 px the bio column wraps to one
   or two words per line, the about/contact grid stays two-column, the records carousel overflows.
   (`docs/screenshots/baseline/home--390--chromium--full.jpg`)
2. `.reveal` sections stay at `opacity:0` until an IntersectionObserver fires — in the full-page
   capture Writing, Photos, DJ and Videos are blank; content waits on an entrance effect.
3. `cursor:none` on `body` with a custom dot cursor — hides the OS cursor everywhere.
4. Gallery references `000000010016.jpg` and `IMG_0396_2.JPG`, neither of which exists (the file is
   `IMG_0396 2.JPG`). Two broken images in production.
5. Gallery alt text is shuffled: `IMG_0387` is labelled "Columbia Library facade detail" but shows a
   person crouching with corgis; `IMG_0394` "corgi meeting" is a rainbow over a field; `IMG_0396 2`
   "rainbow" is the library facade.
6. Song-recommendation bubble writes user input into `innerHTML` (self-XSS via sessionStorage; the
   entries are also only visible to the visitor who typed them, so nothing reaches the owner).
7. Records carousel captures ←/→/↑/↓ page-wide while it is half visible (`preventDefault`), cards are
   `div`s with click handlers (no keyboard focus), panel overlay has no Escape/focus trap.
8. Five YouTube iframes load eagerly on page load (third-party requests before interaction).
9. No canonical URL, Open Graph/Twitter tags, favicon, sitemap, or meta description on the homepage.
10. `/work/` 404; no 404 page.

## DJ deck — behaviour from source (index.html lines 334–413, 502–526)

Graph per deck: `AudioBufferSourceNode(loop) → lowpass → highpass → analyser → gain → masterAnalyser →
destination`. Whole MP3 is fetched and decoded on track select.

| Control | Real effect today |
| --- | --- |
| Track select / suggestion chips | Fetch + decode; resets that deck. Audio context created on this gesture. |
| Play/stop ▶/■ | Starts a new looped source **from 0** each time; stop discards position (no pause, no seek). |
| Platter drag | Rotates the drawing only. **No audio effect** (described as "scratch"). |
| BPM slider + "sync decks" | **Changes labels only** — no `playbackRate` is touched. |
| Low pass / High pass | Real: shared cutoff on both decks (200 Hz–18 kHz, 20–820 Hz, squared curve). |
| Crossfader | Real: equal-power cosine law. |
| Per-deck volume | Not present. |
| Visualiser | Canvas behind the deck, frequency bars, rAF only while playing. |
| Cleanup | Old source stopped and gain disconnected on reload; filter/analyser nodes of the old graph are left connected to nothing (garbage-collected). `alert()` if play pressed with no track. |

## Rights

The six MP3s are commercial recordings (Ayesha Erotica, M.I.A., TLC, Destiny's Child, The Weeknd,
Harry Styles). There is no licence for public distribution in the repo. **Flagged for the owner; I did
not remove them from `main`.** In the preview the deck keeps them selectable (unchanged behaviour) and
adds a generated test fixture for automated tests only. A rights-clean path exists locally:
`~/Development/Personal/acrylic-deck` synthesises two original demo tracks.

## Protected work and the hero boundary

`halftone/halftone-cover.js` (Bayer-dither WebGL video cover, ~700 lines, MIT, owner's own) lives only
untracked in the protected checkout. Its two footage clips (`media/look.mp4`, `media/hair.mp4`) are
**not on disk**; `~/Downloads/halftone-cover/demo/media/` holds synthetic stand-in silhouettes only.
The engine API is `HalftoneCover.mount(selector, config)` on a sized container. The preview reserves
that container (see `DESIGN-DECISIONS.md → Hero boundary`) and never copies or edits the engine.

## Baseline evidence

`docs/screenshots/baseline/` — live site, Chromium, 1440/1280/768/390 + full page at 1440 and 390 for
`/`, `/gallery.html`, `/work/` (404), `/work/frameflow/`, `/work/iris/`, `/blog-filo.html`.

Reproduce: `npm install && FULL=1 node tests/capture.mjs https://mariashowalter.com/ docs/screenshots/baseline / gallery.html work/frameflow/`
