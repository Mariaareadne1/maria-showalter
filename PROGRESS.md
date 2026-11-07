# PROGRESS — Portfolio V1

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
