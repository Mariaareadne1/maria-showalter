# Baseline audit — PR #2 head before V2 (2026-11-07)

- Base: `design/portfolio-v1-content-media` @ `feca664`, draft PR #2, clean, equal to origin. PR #1 untouched.
- Local `~/Development/Personal/maria-showalter` is on `iris-header-preview` with uncommitted `index.html`, `halftone/`, `playground.html` — left exactly as found.
- Site: static HTML, `content/site.json` → `scripts/build-content.mjs` regions; no build step; fonts self-hosted.
- Baseline screenshots: `qa/v2/baseline/` (not committed; before/after sheet in docs/v2-review/).
- Baseline tests: `tests/dj.mjs` already failed 5 mixer-graph checks (low/high pass, crossfader, volume read-back) on PR #2 itself — same failures after V2 moved the deck to /lab/deck/, so not a regression.
- Sky Study `c09d1c8`: `npm run typecheck` clean, `npm test` 42/42.
- Visual issues noted in baseline: full-bleed 1520 px grid, serif display hero, giant lead card, Playground duplicating Work (Hinge/Edition/Orbit), visible half-finished deck on the homepage.
