# Vendored from Sky Study

- Repository: https://github.com/Mariaareadne1/sky-study (same author; no separate licence file in that repo)
- Commit: `c09d1c8d87a13ed225e3594371e3c79eeafc7886`
- Copied by `scripts/sync-sky-study.mjs`; 23 files, verbatim except:
  - `state/store.ts`: `create` from `zustand` → `createStore` from `zustand/vanilla` (same store API; avoids bundling React).
- Third-party technique credits: see ATTRIBUTION.md in this folder.
