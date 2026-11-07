# PROJECT-AUDIT — what to show, and where

Checked 7 Nov 2026 from local clones, `gh repo view` and live URLs. Repos are all owned by `Mariaareadne1` and none are forks (`isFork: false`); team projects are noted. Scores are 1–5 for design-engineering strength (interaction craft, technical depth, completeness, uniqueness).

## Featured (homepage)

| Project | Repo · live | What it actually does (from code) | Systems implemented | Runs / deploy | Strength | Placement | Risks / licensing | New media |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **FrameFlow** | github.com/Mariaareadne1/FrameFlow · no public build | macOS app: ScreenCaptureKit helper records screen + 60 Hz cursor telemetry; clicks/dwells → editable camera Moments; one Canvas renderer for preview, MP4, GIF | Swift SCK helper, auto-zoom clustering, shared renderer, WebCodecs export, versioned project format | Builds locally; v2.3.0; ad-hoc signed, not notarized; no release | 5 | Lead | Gatekeeper rejects builds; mic + multi-display unverified; architecture.md stale | Studio capture via the Electron test harness (see MEDIA-MANIFEST) |
| **Hinge** | /hinge · mariaareadne1.github.io/hinge | Tune hover/press/drag springs on a specimen; export a React component | Closed-form spring solver, peak/overshoot inversion, state machine, codegen + zip | Live; CI deploy for `41c0ddd` succeeded | 5 | Pair (left) | None found; MIT | New loop, 4 stills, exported component built and driven |
| **Edition** | /edition · mariaareadne1.github.io/edition | Photo → two-ink halftone with plates, misregistration, A4 300 dpi export | OKLab separation, exact dot area, registration in plate frame, worker pool | Live; CI deploy for `12e9b60` succeeded | 5 | Pair (right) | No ICC proofing (stated) | New loop from owner film photo, 5 stills, real export + parity |
| **Orbit** | /orbit · mariaareadne1.github.io/orbit | Place/draw/perform sound positions; HRTF panning; offline WAV export | PannerNode scheduling on the audio clock, look-ahead loop scheduler, OfflineAudioContext, WAV encoder | Live; CI deploy for `3beba22` succeeded | 5 | Quiet pair (left) | Needs headphones; generic HRTF | New loop, 4 stills, exported WAV analysed + web audio clip |
| **Filo** | github.com/Mariaareadne1/Filo (+ filo-recommendation-engine) | React Native/Expo map + binary-insertion ranking + taste matching; separate ML engine not wired in | Supabase/RLS, ranking, twins | Prototype, not released | 3 | Quiet pair (right) | **Privacy**: a prior audit found RLS policies exposing emails/push tokens; not verified fixed. No production data used. | None (by design). Diagram + existing case-study explainers only |

## Secondary (Work index / Playground)

| Project | Repo · live | Notes | Placement |
| --- | --- | --- | --- |
| TONUS | webaudio-synth · live | Polyphonic synth (FM/AM/additive/subtractive), chord generator. Live page 200. | Playground + Work |
| Inverted pendulum PID | inverted-pendulum-pid | Python PID + browser dashboard. Not deployed. | Work + essay |
| REINFORCE / CartPole | cartpole-policy-gradient (renamed from `rl-reacher`) | Hand-written REINFORCE, CartPole-v1. **Registry previously described a two-joint arm; corrected.** | Work + essay |
| Filo recommendation engine | filo-recommendation-engine | Fine-tuned MiniLM on a synthetic catalogue; not wired into the app. | Work |
| Sheet Music to Strudel, cellular automata | own repos | Live-coding / generative music tools; no deploy. | Work (sheet music), Writing (automata) |
| Stencil, SafeScan, ACC dashboard | team / employer | Kept with “team” framing as before. | Work (Research, team and technical) |
| DJ deck | this site | Kept; now defaults to original loops. | Homepage |

Not displayed: `index6.html` (old homepage copy, unlinked, left untouched).

**Removed at the owner’s request (7 Nov 2026):** the Iris series (Soft Matter, Resonance, Afterimage) and the iris-cloth precursor. `/work/iris/` now redirects to `/work/`; its media and captures were removed from the branch (raw captures kept outside the repo in `media-raw/iris/`).
