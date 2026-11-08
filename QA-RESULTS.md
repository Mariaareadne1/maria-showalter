# QA results — V2 sky + editorial (2026-11-08)

## V2.1 glass panel (2026-11-08)
| Command | Result |
|---|---|
| `node tests/sky.mjs` (Chromium) | **22 / 22 pass** (panel check now reads glass pixels: lighter at *Currently*, reverses at top) |
| `node tests/sky.mjs … webkit` | **22 / 22 pass** |
| `node tests/glass-contrast.mjs` — 4 treatments × home at scroll 0/700/1800 | **all pass WCAG AA from pixels** (tightest 4.51:1) |
| `node tests/glass-contrast.mjs … jelly,tide /work/hinge/,/about/,/playground/,/writing/` | **all pass** |
| `node tests/a11y.mjs` (axe) | **no violations** (axe cannot see through the canvas — hence the pixel test) |
| `node tests/smoke.mjs` | Chromium all pass; WebKit 1 failure: *lead video plays when visible* — **also fails on 9b6c0fb** (checked side by side, 3×), so it predates the glass; an explicit `play()` works, the scroll-triggered autoplay in headless WebKit does not |
| `node tests/perf-glass.mjs` | no frame-rate change with the pointer over the panel (1440×900@2, @1, 390×844@3); sky copy 0.1–0.2 ms |
| `npx tsc -p sky/tsconfig.json` | clean |

Fixed during QA: grey labels failed on frosted glass (`--meta` → #41474F, floor raised); masthead text sat outside the contrast mask; links stayed dark in white-ink treatments (`--link` resolves at :root — overridden); case-study bar, steps and video Play pill were white-on-white in white ink; the glass froze mid-transition when the sky paused at the bottom of the page (scheduler dropped the last redraw).

Machine: macOS (Darwin 25.4), Apple Silicon. Playwright 1.64.0 — Chromium 1248 with `--use-angle=metal --enable-gpu` (hardware-accelerated WebGL2), WebKit 2370. Local server `http://127.0.0.1:5471/`. Firefox not run.

| Command | Result |
|---|---|
| `node tests/sky.mjs` (Chromium) | **22 / 22 pass** |
| `node tests/sky.mjs … webkit` | **22 / 22 pass** |
| `node tests/playground.mjs` | **4 / 4 pass** — Meadow, Pond, Hive, Lanterns respond to a drawn loop |
| `node tests/smoke.mjs` (19 routes × 5 widths × 2 engines) | first full run: 9 failures (FrameFlow facts overflow at 390; `/lab/deck/` no h1 + overflow) → fixed → re-run of the failing routes in both engines: **all checks passed** |
| `node tests/a11y.mjs` (axe, WCAG 2.0–2.2 A/AA, 13 routes × 2 widths) | **no violations** |
| `node tests/dj.mjs` on `/lab/deck/` | 5 failures (mixer read-back), **identical on PR #2 baseline** — pre-existing |
| `node scripts/build-content.mjs --check` ×2 | up to date both times (deterministic) |
| `npx tsc -p sky/tsconfig.json` | clean |
| Sky Study reference: `npm run typecheck && npm test` | clean, 42 / 42 |
| Manual overflow sweep, 15 routes at 320 px | none |

sky.mjs covers: text before sky; default scene; wheel scrolls page in browse (camera unchanged); mouse drags a margin cloud (state + pixels); keyboard entry to Edit sky with inert sheet and focus in toolbar; draw → new cloud (state + pixels after formation); undo/redo; corner-handle resize; arrows/Delete/⌘Z; Golden hour changes hour, pixels and highlight warmth; Escape restores exact scroll and focus; navigate to a case study and back with a saved still; reload persistence; reset persists and never writes the default; grouped-edit drag survives an immediate reload (regression for a review finding); scroll progress raises opacity with no width/position change and reverses; renderer pauses when veiled and resumes; no page errors; no-WebGL2 fallback; storage throwing → memory + notice; context loss/restore; reduced motion → no drift; 390 px touch tap does not draw, editor fits and restores scroll.

Code review (independent agent) found one high bug — grouped edits (drag, resize, nudge) were not autosaved — plus edge cases (pending saves dropped on navigation, wheel transaction outliving edit mode, stuck gesture on permanent context loss, loose still validation). All fixed; regression test added.

Performance: see SKY-INTEGRATION.md (measured fps / GPU ms per frame, init time).

Not verified: Firefox; real phones/tablets; low-end GPUs; screen readers beyond axe and the live-region text; 200 % zoom was checked only via the 320–390 px layouts that it maps to, not with browser zoom itself.

---

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
