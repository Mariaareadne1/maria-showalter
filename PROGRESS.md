# PROGRESS — Portfolio V3 "Living Material" (first draft)

- **Worktree:** `~/Developer/design-engineering-build-2026/living-material`
- **Branch:** `design/living-material`, from `design/sky-glass-editorial-v2` (draft PR #3), so the unmerged case studies, media, tests and content pipeline carry over. Not merged; no PR opened yet.
- **Live site:** untouched. `main` (GitHub Pages, CNAME mariashowalter.com) was never written. There is no preview host; review locally.
- **Preview:** launch config `living-material` → `python3 -m http.server 5481 --bind 127.0.0.1 --directory <worktree>`.

## What changed from V2

- **Hero:** the Living Knot moss world (built bundle in `hero/`, from the private `moss-hero` repo, branch `sylva-systems`; `npm run build:embed` there, then copy `dist-embed/` here). A still renders first, the live canvas fades in when ready; `?hero=ribbon` shows the Ribbon, `?still` skips WebGL. The glass intro panel carries the primary nav; the glass bar appears once you scroll past the hero.
- **Look:** the sky is gone. Warm paper, Newsreader serif headings, liquid-glass bar and panels (`assets/css/glass.css`, pointer-following light in `assets/js/glass-light.js`, after Glass Studies).
- **Play:** Meadow runs in a window on the home page (self-hosted build in `play/meadow/`, because the Vercel deploy refuses framing). It loads only on click.
- **Work:** FrameFlow lead, then Hinge, Edition, Orbit; an **iPhone apps** section with real Simulator footage of Little Tide and Filo (development build, test data), and Daylight marked in progress (no screenshots).
- **New case study:** `/work/little-tide/` (facts and test counts from the repo and a fresh `swift test` run).
- **Playground:** three groups (Painted worlds, Studies, Iris), nine new entries checked live on 2026-11-17, with the Holocloth credit on the Iris group.
- **About:** FoRG and the Computer Music Center with their own descriptors, linked; no role or contribution claimed.

## Tests (2026-11-17)

- `node tests/a11y.mjs http://127.0.0.1:5481/`: no axe violations (14 routes × 2 widths).
- `node tests/play.mjs`: Meadow wakes in the window, a drawn loop works, no errors.
- `ENGINES=chromium node tests/smoke.mjs http://127.0.0.1:5481/`: see QA-RESULTS.md / final report.
- Visual QA at 1672×941, 1920×1080, 1440×900 and 390×844 (hero, home sections, Work, About, Orbit and Little Tide case studies, Playground).

## Next safe action

Owner review (REVIEW-NOTES.md, FACTS_TO_CONFIRM.md). Do not merge to `main` or touch `CNAME` without approval: `main` deploys straight to mariashowalter.com.

---

# PROGRESS — Portfolio V2 (sky + editorial)

- **Worktree:** `~/Developer/design-engineering-build-2026/portfolio-v2`
- **Branch:** `design/sky-glass-editorial-v2`, from `design/portfolio-v1-content-media` @ `feca664` (draft PR #2 head, clean, equal to origin).
- **Protected, never written:** `~/Development/Personal/maria-showalter` (`iris-header-preview`, dirty), `main`, `CNAME`, PR #1/#2 branches, `~/Development/sky-study` (read-only reference).
- **Preview:** launch config `portfolio-v2` → `python3 -m http.server 5471 --bind 127.0.0.1 --directory <worktree>`.
- **Sky engine source:** Sky Study @ `c09d1c8`, vendored by `node scripts/sync-sky-study.mjs` into `sky/vendor/sky-study/`; bundle built with `npx vite build -c sky/vite.config.mjs` → `assets/sky/portfolio-sky.js`.

## Milestones (V2)

- [x] S0 Audit: repos, PRs, Sky Study baseline (typecheck + 42 unit tests pass), Playground repos found (Meadow, Pond, Hive, Lanterns live).
- [x] S1 Sky spike on the real homepage: Sky Study engine renders; draw/move/resize change scene state and pixels (tests/sky.mjs).
- [x] S2 Browse/Edit modes, toolbar, keyboard path, persistence, reset/undo, fallbacks (no WebGL2, storage full, context loss).
- [x] S3–S4 Sheet, hero, compact Selected Work, scroll progression; all pages on the sheet.
- [x] S5 Playground verified by real drawing (tests/playground.mjs).
- [x] S6 Art / DJ coming soon, About, Writing, case studies re-set; old deck at unlisted /lab/deck/.
- [x] S7 QA (QA-RESULTS.md), perf cap for browse mode, review fixes.
- [x] S8 Pushed `66fe5b9`; draft PR https://github.com/Mariaareadne1/maria-showalter/pull/3 (base: PR #2 branch). No preview host (Pages builds `main` only).

## Next safe action

Owner review of the draft PR (REVIEW-NOTES.md). Before any further change: `node tests/sky.mjs && node tests/smoke.mjs http://127.0.0.1:5471/`. Do not merge to `main` or touch `CNAME` without approval.

---

# Previous: PROGRESS — Portfolio V1

- **Worktree:** `~/Developer/design-engineering-build-2026/portfolio-v1`
- **Branch:** `design/portfolio-v1-content-media`, created from `design/portfolio-editorial-explorations` @ `a0204eb` (draft PR #1 head; clean and equal to origin at start).
  Why a new branch rather than continuing PR #1: PR #1 is a set of design studies the owner may still want to compare. V1 is a different scope (copy reset, new media, new case studies), so it gets its own reviewable branch and draft PR.
- **Protected, never written to:** `~/Development/Personal/maria-showalter` (`iris-header-preview`, dirty: halftone engine + `playground.html`), `main`, `CNAME`.
- **Preview:** `python3 -m http.server 5461 --bind 127.0.0.1 --directory <worktree>` (launch config `portfolio-v1`).

## Milestones

- [x] M0 Preflight and baseline
- [x] M1 Copy, name-only header, Design Engineer hero, Currently, Art coming soon, About
- [x] M2 Exhibition layout + Work index
- [x] M3 New captures: Hinge, Edition, Orbit (+WAV), FrameFlow studio; TONUS still. Iris captured, then removed at owner request.
- [x] M4 Case studies: Hinge, Edition, Orbit added; FrameFlow, Filo kept and fact-checked
- [x] M5 Playground, Art, Writing, About, footer, deck with original loops
- [x] M6 Two visual passes, full QA (QA-RESULTS.md), self-hosted fonts
- [x] M7 Pushed; draft PR opened (see below)

## Environment notes

- Homebrew ffmpeg/ffprobe broken (libx265). Use `~/Developer/FrameFlow/node_modules/ffmpeg-static/ffmpeg` and `.../ffprobe-static/bin/darwin/arm64/ffprobe`.
- System sleep is 1 minute and the network flapped; background agents were interrupted several times and two QA runs failed on lost connectivity.
- No PIL; `scripts/slice.sh` splits tall screenshots with ffmpeg.

## Next safe command

`node scripts/build-content.mjs --check && node tests/smoke.mjs http://127.0.0.1:5461/`
Owner review: FACTS_TO_CONFIRM.md. Do not merge to `main` or touch `CNAME` without approval.
