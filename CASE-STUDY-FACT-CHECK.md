# CASE-STUDY-FACT-CHECK

“Re-run” = executed for this build on 7 Nov 2026. “Recorded” = taken from the project repository’s own dated verification table and labelled as such on the page.

| Page | Claim | Source checked | Status |
| --- | --- | --- | --- |
| /work/hinge/ | Closed-form spring for under/critical/over-damped cases | `hinge/src/runtime/spring.ts:57-87` @ 41c0ddd | Excerpt copied verbatim (trimmed) |
| | Peak/overshoot → stiffness/damping | `spring.ts:147-157` | Verbatim |
| | Unit tests 35/35 | `pnpm test` | **Re-run**, pass |
| | Export runs outside Hinge | Exported zip built in a clean fixture (tsc, vite build), hover/release driven with Playwright | **Re-run** by capture agent; results in `media-raw/hinge/verify.json` |
| | Parity ≤ 0.43 px | README table, 2026-10-21 | Recorded, labelled |
| /work/edition/ | Dot area = clipped circle, inverse table | `edition/src/engine/halftone.ts:19-50` @ 12e9b60 | Verbatim |
| | Unit tests 29/29 | `pnpm test` | **Re-run**, pass |
| | Loupe = export (0/35,344 px), proof vs export 0.24/255 | Capture run on this page’s print | **Re-run** (`media-raw/edition/parity.json`) |
| | Loupe code-block comment | Paraphrases README’s worker lanes; marked as a comment, not a quote | OK |
| /work/orbit/ | Paths scheduled with `linearRampToValueAtTime`; seek replaces past segments | `orbit/src/audio/graph.ts:70-85` @ 3beba22 | Verbatim (y/z lines elided with a comment) |
| | Unit tests 14/14 | `pnpm test` | **Re-run**, pass |
| | Exported WAV: 2 ch, 48 kHz, 0 clipped, L/R −1.0…+2.3 dB | `orbit-export-analysis.json` | **Re-run** |
| | Live vs export ≤ 0.06 dB | README, 2026-10-25/26 | Recorded, labelled |
| /work/frameflow/ | Test table (96 unit, 25 E2E pass…) | Results from 21 Oct 2026 run at a96eb18 | Existing page states its date; unchanged. HEAD is still a96eb18 |
| | Real-capture hero film | `docs/media/sample-real-capture-demo-page.mp4` in repo | Existing, labelled “Real capture” |
| | Mic, notarization, multi-display | Page says unverified / not done | OK |
| /work/filo/ | “Privacy lives in the database” | Private audit: `users` and `rankings` read policies broader than intended | **Corrected**: heading and limitation softened; no exploit detail published |
| | No users/traction claimed | Page states it | OK |
| | Recommendation engine not connected | Page states it | OK |
| Work index | REINFORCE “two-joint arm reacher” | `cartpole-policy-gradient` README: CartPole-v1 | **Corrected** |
| About / Currently | FoRG and CMC affiliations | Links resolve (200); role not stated | See FACTS_TO_CONFIRM.md |
