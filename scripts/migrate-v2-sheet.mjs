// One-time V2 migration (idempotent): puts every inner page on the sky + sheet structure.
// Touches only hand-written areas outside generated regions:
//   - font preloads → Instrument Sans; adds sky.css after nav.css
//   - after the skip link: a still sky (no WebGL on inner pages) and <div class="sheet">
//   - closes the sheet after the footer region; adds sky-page.js
import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = ['404.html', 'work/index.html', 'playground/index.html', 'art/index.html', 'writing/index.html', 'about/index.html',
  'work/frameflow/index.html', 'work/filo/index.html', 'work/hinge/index.html', 'work/edition/index.html', 'work/orbit/index.html',
  'blog-creativity.html', 'blog-cartpole.html', 'blog-pid.html', 'blog-filo.html']
const SKY = '<div class="sky" aria-hidden="true"><div class="sky-still"></div><div class="sky-veil"></div></div>\n<div class="sheet">'
for (const rel of PAGES) {
  const f = join(root, rel)
  let s = await readFile(f, 'utf8')
  if (s.includes('class="sheet"')) { console.log('skip (done):', rel); continue }
  s = s.replace(/<link rel="preload" href="\/assets\/fonts\/ibm-plex-sans-latin-400-normal\.woff2"[^>]*>\n?/, '<link rel="preload" href="/assets/fonts/instrument-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>\n')
  s = s.replace(/<link rel="preload" href="\/assets\/fonts\/fraunces-latin-opsz-normal\.woff2"[^>]*>\n?/, '<link rel="preload" href="/assets/fonts/instrument-sans-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>\n')
  s = s.replace(/(<link rel="stylesheet" href="\/assets\/css\/nav\.css"\/?>)/, '$1\n<link rel="stylesheet" href="/assets/css/sky.css">')
  s = s.replace('<meta name="theme-color" content="#F6F6F2">', '<meta name="theme-color" content="#C9DBEC">')
  if (!/<body[^>]*id="top"/.test(s)) s = s.replace(/<body([^>]*)>/, '<body$1 id="top">')
  s = s.replace(/(<a class="skip" href="#main">Skip to content<\/a>)/, `$1\n${SKY}`)
  s = s.replace('<!-- /region:foot -->', '<!-- /region:foot -->\n</div>')
  s = s.replace(/(<script src="\/assets\/js\/site\.js" defer><\/script>)/, '$1\n<script src="/assets/js/sky-page.js"></script>\n<script type="module" src="/assets/sky/portfolio-glass.js"></script>')
  for (const need of ['class="sheet"', 'sky.css', 'sky-page.js', '<!-- /region:foot -->\n</div>']) if (!s.includes(need)) throw new Error(`${rel}: missing ${need}`)
  await writeFile(f, s)
  console.log('migrated:', rel)
}
