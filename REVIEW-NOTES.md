# Review notes — V3 "Living Material" (for the owner)

Branch `design/living-material` (from PR #3). Nothing merged; `main`, `CNAME` and mariashowalter.com untouched.
Run locally: `python3 -m http.server 5481 --bind 127.0.0.1` in the worktree, open http://127.0.0.1:5481/.
Pictures: `docs/v3-review/` (hero at 1672, 1920 and 390; full home page; Work; About; Orbit case study).

## Please confirm (scope and permissions)
1. **Sylva.** The hero is built on systems adapted from Meng To's Sylva, under the permission you described for your portfolio website. Only the **built, minified** hero (`hero/`) is in this repository; the readable source stays in the private `moss-hero` repo, with the full reuse inventory in its `ATTRIBUTION.md`. But this repository is public, so merging puts Sylva-derived code (minified) in a public repo as well as on the site. I think that is within "for the portfolio website", but please confirm with Meng, and keep his permission in writing (an email is enough). No Sylva images, fonts or vendored files are used. Credit is in `hero/NOTICE.md`; say if you also want a visible credit line in the footer.
2. **Meadow.** `play/meadow/` is a production build of the private `meadow-interactive` repo, so its compiled code becomes public with this branch (the same code is already served publicly at meadow-interactive.vercel.app). The source is not included.
3. **Iris case study.** `/work/iris/` was removed at your request in V1/V2 and still redirects. The Iris pieces now appear only in the Playground's Iris group, with the Holocloth credit (Dmitry Kurash, MIT). Restore the case study only if you want it back.
4. **Research.** FoRG and the Computer Music Center are listed with their own one-line descriptors (taken from their sites) and links. No role, project or contribution is claimed. Add your role if you want one stated.

## Projects: what is shown and why
- **Filo:** real Simulator footage of a development build with test data, edited so that no other users' handles or notes appear. It cannot be run fresh: the hosted Supabase project no longer resolves and Docker was not running. The separate recommendation engine is **not** integrated into the app, so the site does not say it is. Filo's own PROGRESS notes say a Mapbox download token is in its git history and should be rotated.
- **Little Tide:** new case study. Package tests (82) pass in a fresh run; device testing has not been done, and the page says so.
- **Daylight:** shown as "In progress", text only, no screenshots.
- **Orbit:** the case-study film is a silent screen recording; the real audio is the offline WAV export in its Evidence section. I did not combine them into one video, because the recording and the export were not captured from the same playback, so sync could not be guaranteed. A synchronized demo needs a capture with system audio (for example, QuickTime with an audio loopback device).
- **FrameFlow:** the home loop is the demo page driven by a scripted pointer (as before); the case study also has the real 16.5 s export.

## Decisions you may want to change
- Hero shows the **Living Knot**; `?hero=ribbon` previews the Ribbon. Switching the default is one line in `assets/js/world.js`.
- The glass bar is hidden over the hero on the home page (the glass panel carries Work / Playground / About) and slides in once you scroll.
- Meadow loads only when you press "Play Meadow here", so it costs nothing until then.

## Known gaps
- Not checked on real phones, Safari on a device, Firefox, or low-end GPUs. The hero lowers its pixel ratio by itself if frames run long.
- Repos without a licence file: sky-study, spool, fold-gallery. Somewhere Else's licence may be missing the Holocloth copyright line. Nothing on the site depends on these, but check them before linking source.
- The original brief I received was cut off at "A. Hero … A very short". Anything after that is not reflected here.

---

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
