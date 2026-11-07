# PROGRESS — Portfolio V1

- **Worktree:** `~/Developer/design-engineering-build-2026/portfolio-v1`
- **Branch:** `design/portfolio-v1-content-media`, created from `design/portfolio-editorial-explorations` @ `a0204eb` (draft PR #1 head; clean and equal to origin at start).
  Why a new branch rather than continuing PR #1: PR #1 is a set of design studies the owner may still want to compare. V1 is a different scope (copy reset, new media, new case studies), so it gets its own reviewable branch and draft PR.
- **Protected, never written to:** `~/Development/Personal/maria-showalter` (`iris-header-preview`, dirty: halftone engine + `playground.html`), `main`, `CNAME`.
- **Preview:** `python3 -m http.server 5461 --bind 127.0.0.1 --directory <worktree>` (launch config `portfolio-v1`).

## Milestones

- [x] M0 Preflight: branches, PR #1 (draft, open), app repos (Hinge/Edition/Orbit redesigns merged to their `main` and deployed), tools, baseline smoke (Chromium all pass) and captures `docs/screenshots/v1-baseline/`.
- [~] M1 Copy, nav, hero: registry rewritten, name-only header, “Design Engineer” hero, Currently with FoRG/CMC links, Art = Coming soon, About shortened, case-study titles de-emphasised.
- [~] M2 Exhibition + Work index: layout built; waiting on new media.
- [ ] M3 Demo media: capture agents running for Hinge, Edition, Orbit, FrameFlow (studio via Electron test harness). Iris pending.
- [ ] M4 Case studies: Hinge, Edition, Orbit pages to add; FrameFlow/Filo/Iris preserved.
- [ ] M5 Playground/Art/Writing/About/footer/deck rights.
- [ ] M6 Critique passes + full QA.
- [ ] M7 Push, draft PR, handoff.

## Environment notes

- Homebrew ffmpeg/ffprobe broken (libx265). Use `~/Developer/FrameFlow/node_modules/ffmpeg-static/ffmpeg` and `.../ffprobe-static/bin/darwin/arm64/ffprobe`.
- System sleep is set to 1 minute; background agents were cut off by sleep several times. Keep-awake was declined by the permission classifier.
- No PIL; `scripts/slice.sh` splits tall screenshots with ffmpeg.

## Next safe command

`node scripts/build-content.mjs --check && ENGINES=chromium node tests/smoke.mjs http://127.0.0.1:5461/`
