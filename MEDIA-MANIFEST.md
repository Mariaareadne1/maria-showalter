# MEDIA-MANIFEST

Per-file provenance (scenario, steps, source commit, capture method, sha256) lives in the machine-readable
manifests: `assets/media/{frameflow,hinge,edition,orbit}/manifest.json`. This page summarises them and records
the checks re-run on 7 Nov 2026 with ffprobe 6.0 (static build; Homebrew ffmpeg is broken on this machine).

## Rules every capture followed

- Real apps doing real things: live deploys for Hinge, Edition and Orbit (commits match their latest successful
  deploy runs on GitHub; bundles not byte-compared); the FrameFlow 2.3 app built from `a96eb18`.
- Scripted Playwright input; a small capture-only pointer marker is drawn by the capture script because headless
  browsers show no cursor. It is never part of the apps and every manifest entry says so.
- No generated imagery, no overlays in app UI, no stock photos. Edition’s source photo is the owner’s own film frame.
- Raw frames, full-resolution exports and logs stay outside the repo in `~/Developer/design-engineering-build-2026/media-raw/`.
- Loops are silent (no audio stream). Sound is only on user-initiated `<audio controls>` players.
- Repeatable scripts: `scripts/capture/{hinge,edition,orbit,frameflow,tonus}.mjs`; deck loops: `scripts/make-deck-loops.mjs`.

## Shipped media (ffprobe, 7 Nov 2026)

All MP4s are H.264, yuv420p, 30 fps, with `moov` before `mdat` (fast start).

| File | Kind | Dims | Duration | Audio | Bytes | Proves |
| --- | --- | --- | --- | --- | --- | --- |
| `frameflow/frameflow-loop.mp4` | video | 1600×1000 | 24.90 s | none | 593,869 | Studio: automatic Moments → Moment edit → style → MP4 export → exported film |
| `frameflow/frameflow-export.mp4` | video | 1600×900 | 16.50 s | none | 665,964 | Web copy of the real export (original 1920×1080, 30 fps, 16.5 s) |
| `hinge/hinge-loop.mp4` | video | 1600×1000 | 24.13 s | none | 630,036 | Same throw before and after retuning the release spring |
| `edition/edition-loop.mp4` | video | 1600×1000 | 22.47 s | none | 2,228,359 | Import → plates → misregistration → loupe → split |
| `orbit/orbit-loop.mp4` | video | 1600×1000 | 19.00 s | none | 553,896 | Add sounds → place → draw paths → playback → export |
| `orbit/orbit-export.m4a` | audio | — | 12.00 s | AAC 48 kHz stereo | 256,381 | Orbit’s own WAV export, re-encoded (WAV: 0 clipped, L/R −1.0…+2.3 dB) |
| `audio/loop-a.m4a`, `loop-b.m4a` | audio | — | 34.29 / 30.97 s | AAC 44.1 kHz stereo | 741,239 / 721,014 | Original deck loops, synthesised by script |

Stills: 4–5 per project (`*-step-N.jpg`, 1600 px), posters as JPEG + WebP, Edition export derivatives
(`edition-export-print-1600.jpg`, `edition-export-crop.jpg`), the Hinge export source (`hinge-export-sample.tsx`),
and the TONUS Playground still (`playground/tonus-960.jpg`).

## Honest-source notes

- **FrameFlow:** the recording edited in the studio is the repository’s demo page rendered with scripted pointer
  telemetry, not a ScreenCaptureKit capture. The loop is edited (waits cut, UI at 1.2×). Both are stated on the page.
  The real ScreenCaptureKit film from the repo remains the case-study hero.
- **Orbit:** the run started from an empty document seeded in localStorage; every later step is real input.
- **Edition:** poster replaced with the 12 s frame of the loop (the original frame showed one plate only).
- **Removed:** Iris media (owner request). Raw captures kept in `media-raw/iris/`.
- **Older media still on the site:** FrameFlow case-study stills from the app’s own screenshot suite (labelled
  “Test footage”). The pre-redesign Hinge/Edition/Orbit stills (`assets/media/projects/`) were removed from the branch.

## Weight

Home page media is poster-first; videos use `preload="none"` (lead: `metadata`) and play only while 40 % visible
and motion is allowed. See QA-RESULTS.md for measured transfer.


## V2 additions (2026-11-08)

| File | Source | Size | Notes |
|---|---|---|---|
| assets/sky/sky-still.jpg | Rendered by `scripts/make-sky-still.mjs` from this branch's default scene with the real Sky Study renderer, 1600×1000, 48 samples | 46 KB | Shipped fallback / inner-page sky |
| assets/media/filo/filo-screens-1600.jpg, -800.jpg | Three Filo screenshots from `Filo/docs/screenshots/after/` (iOS 26.5 simulator, dev build, `d4ed99f`), placed side by side on paper with ffmpeg; no retouching | 114 / 33 KB | Sample data shown (handles like @cal are seed users) |
| assets/media/playground/{meadow,pond,hive,lanterns}-960.jpg | Downscaled from each repo's own `docs/media` captures (08-several-depths, 01-pond, 01-garden, demo-end) | 53–74 KB | Real app captures by each project's tooling |
| docs/v2-review/edit-sky-demo.mp4 | `tests/record-edit.mjs`: real mouse input in Chromium (GPU), 960×600 H.264, 22.6 s | 371 KB | Review evidence, not loaded by the site |
