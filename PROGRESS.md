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
- [ ] P2 — provisional shell + homepage
- [ ] P3 — secondary pages + case studies
- [ ] P4 — DJ deck restyle + microinteractions
- [ ] P5 — QA, regression, `DESIGN-REVIEW.md`

## Log

- 2026-10-25 P0: audit + baseline. Media derivatives generated under `assets/media/`.
- 2026-10-26 P1: studies A/B/C, atmosphere module (3 modes), hero slot loader, content registry `content/site.json`. Captures in `docs/screenshots/studies/`.

## Next safe action

Continue with P1 from this worktree. Do not run git commands that write in the protected checkout.
