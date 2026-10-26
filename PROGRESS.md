# PROGRESS — portfolio editorial redesign (preview branch)

- Working directory: `~/Developer/design-engineering-build-2026/maria-showalter-redesign`
- Worktree of: `~/Development/Personal/maria-showalter` (protected, on `iris-header-preview`, dirty — never touched)
- Branch: `design/portfolio-editorial-explorations` (created from `origin/main` @ `9ca218c`, upstream unset)
- Production: `main` and `CNAME` untouched. No merge, no deploy.

## Commands

```bash
npm install                     # Playwright 1.64 (dev only)
npm run serve                   # http://127.0.0.1:5451/
FULL=1 node tests/capture.mjs http://127.0.0.1:5451/ docs/screenshots/<dir> / work/
```

## Milestones

- [x] P0 — preflight, audit (`SITE-AUDIT.md`), live baseline screenshots (`docs/screenshots/baseline/`)
- [x] P1 — three design studies (`/design-studies/`) + `DESIGN-DECISIONS.md`
- [x] P2 — provisional shell + homepage (secondary routes land in P3)
- [x] P3 — secondary pages + case studies
- [x] P4 — DJ deck restyle + microinteractions
- [x] P5 — QA, regression, `DESIGN-REVIEW.md`

## Log

- 2026-10-25 P0: audit + baseline. Media derivatives generated under `assets/media/`.
- 2026-10-26 P1: studies A/B/C, atmosphere module (3 modes), hero slot loader, content registry `content/site.json`. Captures in `docs/screenshots/studies/`.
- 2026-10-26 P2: tokens/base/nav/media/home/dj CSS, site.js (menu dialog, video previews), dj.js (real tempo/sync, pause/seek, nudge, volume), content build script, new homepage. Smoke on `/` chromium: only failures were links to P3 routes not yet built.
- 2026-10-26 P3: Work/Playground/Art/Writing/About/404, gallery redirect, essays and case studies on the shared system (`f7d7991`).
- 2026-10-26 P4: DJ tests (29/engine), hero integration test, perf + smoke suites (`a24f69c`).
- 2026-10-26 P5: review fixes (dj.js deselect race + bfcache, atmosphere timer, build-script errors, dialog fallback), final captures in `docs/screenshots/preview/`, DESIGN-REVIEW.md.

## Tests

```bash
npm run serve &                                   # or the preview server on 5451
node tests/smoke.mjs http://127.0.0.1:5451/       # ENGINES=chromium,webkit
node tests/dj.mjs http://127.0.0.1:5451/
node tests/hero-integration.mjs http://127.0.0.1:5451/
node tests/perf.mjs https://mariashowalter.com/ http://127.0.0.1:5451/
node scripts/build-content.mjs --check
```

## Media and rights

- Six commercial MP3s remain in the repo (unchanged from `main`) and selectable in the deck; no licence on file. Tests use a generated WAV.
- Hinge/Edition/Orbit images copied from each repo's committed `docs/media/` (pre-redesign captures, labelled on the page).
- Private Filo findings stay in `../audits/filo-audit.md` / BUILD-STATUS; nothing about them is in public copy.

## Next safe action

Owner review of DESIGN-REVIEW.md §4 open decisions. Do not merge to `main` or touch CNAME without explicit approval. Do not run git commands that write in the protected checkout.
