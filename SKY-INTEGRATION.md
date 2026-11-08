# Sky integration — Sky Study inside the portfolio (V2)

_2026-11-08. Facts below were checked against the code on this branch._

## What runs

The homepage sky is **Sky Study's real renderer**: WebGL2 physically based atmosphere and raymarched volumetric clouds, cloud generation from strokes, picking, the zustand store with undo/redo, and auto quality. It is not re-implemented. A thin, framework-free adapter (no React) sits around it.

| Layer | File | Notes |
|---|---|---|
| Engine (vendored, verbatim) | `sky/vendor/sky-study/**` | 23 files from Sky Study `c09d1c8` via `scripts/sync-sky-study.mjs`. One patch: `zustand` → `zustand/vanilla` (same store API, no React). `SOURCE.md` and `ATTRIBUTION.md` travel with it. |
| Controller | `sky/src/controller.ts` | `PortfolioSkyController`: mount, browse/edit mode, visual intensity (pause when fully veiled), pause/resume, reset, undo/redo, export, still capture, WebGL context loss/restore, dispose. |
| Pointer + keyboard | `sky/src/interaction.ts` | Port of Sky Study's `InteractionLayer` (same picking, `strokeToCloud`, store actions) with portfolio rules for the two modes. |
| Editor UI | `sky/src/editor.ts` | Toolbar, panel inert/fade, scroll + focus save/restore, Escape, keyboard shortcuts, live announcements. |
| Default scene | `sky/src/defaultScene.ts` | Five authored strokes sent through Sky Study's own stroke → cloud pipeline on a canonical 16:10 camera, then pushed to varied depths. World-space, so identical on every screen. |
| Persistence | `sky/src/storage.ts` | `mariashowalter.com/sky/scene/v1` (never Sky Study's keys). Default scene is never written; reset deletes the key. Storage failure → in-memory with one notice. Other tabs: last writer wins, ignored while editing. |
| Boot | `sky/src/main.ts` | Idle-time boot on pages with `[data-sky-live]`; wires triggers and state. Exposes `window.__portfolioSky` for tests. |
| No-WebGL layer | `assets/js/sky-page.js` | Still background (visitor's own JPEG or shipped capture), scroll progress `--sky-p`, works without modules/GPU. |
| Styles | `assets/css/sky.css` | Sky layers, sheet glass, triggers, edit mode, toolbar, reduced transparency / contrast / forced colours. |

Build: `npx vite build -c sky/vite.config.mjs` → `assets/sky/portfolio-sky.js` (104 kB, 34 kB gzip). The site itself still needs no build step; the bundle is committed like the generated HTML regions.

## Modes

- **Browse (default).** Page scroll, wheel, touch, find-in-page and focus are untouched (the sky surface has no wheel handler in browse; it sits under the sheet). A mouse can grab an existing cloud in the exposed margins and move it. Touch never edits in browse.
- **Edit sky.** Sheet becomes `inert`, fades and drops slightly; the veil lifts; `html` stops scrolling (position saved, restored on exit). Tools: Draw, Move, five light presets (Sky Study's Dawn/Noon/Golden/Blue/Moon), Add cloud, Delete, Undo, Redo, Reset sky, Done. Resize via corner handles, depth via Shift-drag or the wheel over a cloud. The camera never moves, so the page composition is stable.
- **Keyboard path** (honest, not full parity with freehand drawing): `Add cloud` makes a generated cloud and selects it; `[ ]` cycle selection; arrows move; `+ −` resize; Delete; ⌘Z / ⇧⌘Z; Escape exits. Focus returns to the trigger.

## Rendering lifecycle

- One renderer per page, homepage only. Inner pages show a still: the visitor's own (640×400 JPEG captured by the engine after an edit) or `assets/sky/sky-still.jpg` (rendered by `scripts/make-sky-still.mjs` from the real engine, 48 samples).
- Paused when the document is hidden, or when scroll progress reaches 1 (sky fully veiled); the last frame stays on screen. Resumes on scroll up.
- Quality: browse uses a fixed modest scale (`reduced` at DPR ≥ 1.5, else `balanced`); edit uses Sky Study's adaptive `auto`. Engine caps DPR at 2.
- Reduced motion: drift off (Sky Study's own rule); no CSS transitions. Reduced transparency / more contrast: opaque sheet.
- Failure: WebGL2 or float targets missing → `unsupported`, still remains, triggers disabled and read "Sky editing needs WebGL 2". Context lost → stop, disable, recreate the engine on restore.

## Measured (headless Chromium 1248, ANGLE/Metal, this Mac; not a promise for other hardware)

| Viewport | First sky frame | Steady fps | Render size | GPU ms/frame (mean / p90) |
|---|---|---|---|---|
| 1440×900 @2 (browse, reduced) | 324 ms | 60 | 1037×648 | 5.7 / 8.0 |
| 1440×900 @1 (browse, balanced) | 142 ms | 60 | 720×450 | 3.4 / 4.9 |
| 390×844 @3 (browse, reduced) | 134 ms | 60 | 281×608 | 3.3 / 5.0 |
| 1440×900 @2 before the browse cap (auto → 0.72) | 205 ms | 60 | 2074×1296 | 12.0 / 13.0 |

DOMContentLoaded ≈ 35 ms locally; text paints before the engine (idle boot). JS heap ≈ 13 MB. Command: `node tests/perf-sky.mjs`.

## Not done / known limits

- No camera look/fly in the portfolio (deliberate: keeps the page composition fixed).
- Freehand drawing has no keyboard equivalent beyond "Add cloud".
- Firefox not tested (Playwright Firefox is installed but WebGL2 raymarching under headless Firefox was not evaluated).
- Real low-end/mobile GPU timing not measured; the iPhone numbers above are an emulated viewport on this Mac's GPU.

## Glass panel (V2.1)
- Source: `sky/src/glass/` — `shader.ts` (the slab), `GlassLayer.ts` (WebGL 2, sky texture, uniforms), `treatments.ts` (four materials), `springs.ts` (pointer, press, scroll slosh), `glassMain.ts` (DOM, scheduling, `?glass=` / `?glass-compare`). Built with the engine: `npx vite build -c sky/vite.config.mjs` → `assets/sky/portfolio-glass.js`, loaded on every page.
- No engine import. The home sky hands each (re)started renderer over with a `sky:engine` event (`sky:engine-ended` on unsupported/lost); the glass copies each frame in `engine.onAfterRender` (same task, so the non-preserved buffer is still valid) through a half-resolution 2D canvas into a mip-mapped texture. Copy cost is measured and throttled (every frame if < 1.5 ms, else every 2nd/4th).
- Inner pages refract the still (visitor's saved still or the shipped one) laid out like `background-size: cover; background-position: 50% 35%`.
- The canvas is `position: sticky; height: 100vh` inside `.glass-clip` (absolute, `clip-path: inset(0 round r)`, `z-index: -1` in the sheet's stacking context). Edges stay compositor-locked while scrolling; the sheet must not get a `transform` while the glass is live.
- Draws only when something changed: on each renderer frame while the sky runs, otherwise on scroll, resize, progress or while a spring is moving.
- `window.__portfolioGlass` = `{ treatment, setTreatment(id), state: 'css'|'image'|'live', stats }`; `html[data-glass]`, `[data-ink]`, `[data-glass-state]` drive the CSS.
- Measured (Chromium, Metal, M-series): no frame-rate change with the pointer moving over the panel at 1440×900@2, @1 and 390×844@3; sky copy 0.1–0.2 ms; glass canvas 880×900 at 1× (panel width, not viewport). `node tests/perf-glass.mjs`.
