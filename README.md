# mariashowalter.com

Personal website for Maria Carla Ariadne Showalter — CS + Hellenic Studies at Barnard College, Columbia University.

Built as a single HTML file with no frameworks, no build step, and no dependencies beyond two Google Fonts. Deploys instantly to GitHub Pages.

## What's here

- **Hero** — transparent photo cutout with name, editorial layout
- **Records** — 3D card navigation through Projects, Experience, Music, Creative, About, Contact
- **Writing** — scrollable blog post cards linked to GitHub repos
- **DJ Deck** — functional turntables with BPM sync, low/high pass filter, crossfader
- **Videos** — live coding sessions and Algorave recordings
- **Easter egg** — click the photo

## Stack

Plain HTML · CSS · vanilla JavaScript · Fraunces (local) · IBM Plex Mono/Sans (Google Fonts)

## File structure

```
maria-showalter/
├── index.html
├── photo_main.png          # hero photo (transparent background)
├── photo_dj1.jpg           # music panel
├── photo_dj2.png           # music panel
├── Fraunces-Regular.ttf
├── Fraunces-Italic.ttf
└── Fraunces-SemiBold.ttf
```

## Live site

[mariaareadne1.github.io/maria-showalter](https://mariaareadne1.github.io/maria-showalter)

## Contact

m.showalter@columbia.edu

## V2 sky (branch design/sky-glass-editorial-v2)

- Live sky: Sky Study engine vendored in `sky/vendor/sky-study` (`node scripts/sync-sky-study.mjs [path]`), adapter in `sky/src`, bundle `npx vite build -c sky/vite.config.mjs` → `assets/sky/portfolio-sky.js` (committed).
- Shipped still: `node scripts/make-sky-still.mjs` (needs the local server).
- Tests (server on 5471): `node tests/sky.mjs [base] [chromium|webkit]`, `node tests/playground.mjs`, `node tests/smoke.mjs http://127.0.0.1:5471/`, `node tests/a11y.mjs http://127.0.0.1:5471/`, `node tests/perf-sky.mjs`, `node tests/shots.mjs <dir>`.
- Details: SKY-INTEGRATION.md, DESIGN-DECISIONS.md, REVIEW-NOTES.md.
