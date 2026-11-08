# Review notes — V2 (for the owner)

## V2.2 — Sky jelly
- Default is now **Sky jelly**. Compare with **Clear jelly** (more sky visible through it, soft shading only behind the text): http://127.0.0.1:5471/?glass-compare
- Pictures: docs/v2-review/glass-skyjelly-clearjelly.jpg (top / scrolled), glass-skyjelly-frames.jpg (rest, near rim, hover, press, release), glass-jelly-demo.mp4.
- White type stays AA everywhere by measurement (tests/glass-contrast.mjs at 1440 and 390 px). The cost is that the glass is a tinted blue, not water-clear: white text on a pale sky cannot be both clear and readable. Clear jelly is the closest to clear.


## V2.1 glass panel — decide
- **Which material?** Open http://127.0.0.1:5471/?glass-compare and use the switcher (bottom right), or look at docs/v2-review/glass-treatments-0.jpg / -1500.jpg. Default is *Soft jelly*; *Sky glass* is the white-type option I'd consider most. Making a treatment the default is one line: `DEFAULT_TREATMENT` in sky/src/glass/treatments.ts, then `npx vite build -c sky/vite.config.mjs`.
- **Motion:** docs/v2-review/glass-jelly-demo.mp4 (pointer near rim, hover, press/spring-back, scroll trail, all four treatments) and glass-jelly-frames.jpg.
- Not checked on real hardware: Safari's sky copy (headless WebKit copies in software, ~10 ms, so the glass updates every 4th frame there — real Safari should be faster), phones, low-end GPUs, Firefox.


Branch `design/sky-glass-editorial-v2`. Nothing merged; `main`, `CNAME` and mariashowalter.com untouched.

## Look at first
- docs/v2-review/before-after-desktop.jpg, before-after-phone.jpg
- docs/v2-review/edit-sky-demo.mp4 (22 s, real input) and edit-sky-frames.jpg
- Run locally: `python3 -m http.server 5471 --bind 127.0.0.1` in the worktree, open http://127.0.0.1:5471/ and press **Edit sky**.

## Decisions you may want to change
- **Lead project size** — FrameFlow spans the column at 16:9. Equal grid is a one-line change.
- **Four Playground worlds** (Meadow, Pond, Hive, Lanterns). Swapping in SKY, TIDE, BUBBLES or Wind Study is a `content/site.json` edit; all are live.
- **About** first sentence now says "work in design engineering: software, interactive tools, graphics and computational sound." Second paragraph unchanged.
- **Filo still** uses dev-build simulator screenshots with seed data (handles like @cal). Replace if you prefer another screen.

## Portrait
The halftone/dither portrait engine exists only as **uncommitted** work in `~/Development/Personal/maria-showalter` (`iris-header-preview`: `halftone/`, `playground.html`). It was not copied, edited or committed. The hero keeps the `[data-halftone-slot]` boundary (hidden) and `hero-slot.js`; once the engine is committed, adding `<script src="/halftone/halftone-cover.js"></script>` before `hero-slot.js` on the homepage mounts it to the right of the heading. No generated likeness was used.

## DJ deck
Off the homepage; "Coming soon" in *Also* and on /playground/. The V1 mixer (original synthesised loops only) still works at unlisted `/lab/deck/` (noindex, disallowed in robots.txt, not in the sitemap) so its source and test stay alive. The old commercial `track-*.mp3` files at the repo root (from `main`'s history) are not loaded by any V2 page; they were left in place because deleting them is your call.

## Known gaps
- `tests/dj.mjs`: 5 mixer read-back checks fail — identical on PR #2, so pre-existing.
- Firefox, real iOS/Android devices, and low-end GPUs not tested.
- Freehand drawing has no keyboard equivalent; "Add cloud" + arrows/± is the keyboard path.
- No preview deployment: this repo deploys `main` through GitHub Pages with the production CNAME, so there is no isolated preview host without new setup. Review is local + screenshots + the pushed branch.
