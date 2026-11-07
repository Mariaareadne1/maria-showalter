# QA-RESULTS — Portfolio V1

Environment: macOS (Darwin 25.4), Node 22.21, Playwright 1.64 (Chromium 1248, WebKit 2370), local
`python3 -m http.server 5461`. Final run 7 Nov 2026 on the commit that adds self-hosted fonts. Firefox, real phones and
spoken screen-reader output were **not** tested.

## Suites

| Suite | Command | Result |
| --- | --- | --- |
| Content registry in sync; stable across rebuilds | `node scripts/build-content.mjs --check` (twice), `git diff --quiet` | pass; no diff |
| Smoke: 17 routes incl. `/work/iris/` redirect × 1440/1024/768/390/320 — HTTP 200, no overflow, no console/HTTP errors, images decode, one h1, alt attributes, no video playing under reduced motion, every internal link 200; phone menu (modal, Escape, focus return); skip link | `node tests/smoke.mjs http://127.0.0.1:5461/` | **Chromium + WebKit: all checks passed** |
| Accessibility: axe-core WCAG 2.0–2.2 A/AA rules, 13 routes × desktop + phone | `node tests/a11y.mjs` | **No violations** (first run found 14 groups; fixed: focusable code blocks/diagrams/tables, deck position labels on phone, Filo explainer contrast) |
| DJ deck: no audio before gesture, load, play/pause/seek, Space, filters, equal-power crossfade, volume, sync/tempo rates (112/124 BPM loops), platter nudge, deselect race, local file (no network, unknown BPM), 404 error state | `node tests/dj.mjs http://127.0.0.1:5461/` | **Chromium + WebKit: all passed.** Real AAC loops also decoded in both engines |
| Performance, homepage, cold cache | `node tests/perf.mjs http://127.0.0.1:5461/` | 1440: 23 requests, 1.00 MB, LCP 76 ms, CLS 0.000 · 390: 24 requests, 1.57 MB, LCP 68 ms, CLS 0.000. 0 third-party requests. (Earlier live-site measurement, from PR #1: 96 requests, 27.28 MB.) |
| App unit tests | `pnpm test` in each repo | Hinge 35/35, Edition 29/29, Orbit 14/14 (run by me); FrameFlow 96/96 (run by the capture agent) |
| Media | ffprobe 6.0 | All MP4s H.264 yuv420p 30 fps, fast start, no audio stream; see MEDIA-MANIFEST.md |

## Problems found and fixed during QA

- Work page: Filo row rendered an image with an empty `src` → now shows its diagram.
- Case-study section bar and the new sticky header both stuck at `top: 0` → bar offset by the measured header height (58 px desktop, 60 px phone).
- Two full smoke runs failed with `ERR_INTERNET_DISCONNECTED` while this Mac's network flapped; the only external dependency was Google Fonts. Fonts are now self-hosted (Fontsource, OFL), which also removed the third-party request for visitors.

## Visual passes

Screenshots: `docs/screenshots/v1-baseline/` (before), `docs/screenshots/v1-pass2/` (after).

**Pass 1** (after media landed): hero-to-work gap reduced (bottom padding removed, section top 56–96 px); Orbit/Filo tiles made equal width; phone FrameFlow links left-aligned; Edition poster swapped from a single-plate frame to the two-ink print.

**Pass 2** (after Iris removal): deck quick-start turned into a real filled button; native file inputs replaced by text-button labels (were truncating to “No f…hosen”); deck note set in quiet sans; phone Playground tiles 16:9; case-study bar overlap fixed.

Critique against the brief: the first screen reads “Maria Showalter” (header) and “Design Engineer” (h1) with one sentence; no emphasised words; three distinct work rhythms; every tile and link leads to a real page or live app; Art is an intentional “Coming soon”.

## Not verified

Firefox · real iOS/Android devices · spoken screen-reader output · GitHub Pages serving of this branch (Pages serves only `main`) · real ScreenCaptureKit capture, microphone, notarization (FrameFlow).
