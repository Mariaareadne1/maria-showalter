// Renders content/site.json into marked regions of the static pages.
//   node scripts/build-content.mjs          rewrite regions in place
//   node scripts/build-content.mjs --check  exit 1 if any page is out of date
//
// A region looks like:  <!-- region:name key=value -->…<!-- /region:name -->
// Everything between the markers is generated; everything outside is hand-written.
// The site needs no build step to be served — the output is committed.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const site = JSON.parse(await readFile(join(root, 'content/site.json'), 'utf8'))
const check = process.argv.includes('--check')

const PAGES = [
  'index.html', '404.html',
  'work/index.html', 'playground/index.html', 'art/index.html', 'writing/index.html', 'about/index.html',
  'work/frameflow/index.html', 'work/filo/index.html',
  'work/hinge/index.html', 'work/edition/index.html', 'work/orbit/index.html',
  'blog-creativity.html', 'blog-cartpole.html', 'blog-pid.html', 'blog-filo.html'
]

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const isExternal = (href) => /^https?:/.test(href)
const byId = Object.fromEntries(site.projects.map((p) => [p.id, p]))

const NAV = [
  ['work', 'Work', '/work/'],
  ['playground', 'Playground', '/playground/'],
  ['art', 'Art', '/art/'],
  ['writing', 'Writing', '/writing/'],
  ['about', 'About', '/about/']
]
const LINK_LABEL = { case: 'Case study', live: 'Try it ↗', source: 'Source ↗', writing: 'Notes' }

function links (l = {}, keys = ['case', 'live', 'source', 'writing']) {
  const items = keys.filter((k) => l[k]).map((k) => `<a href="${esc(l[k])}">${LINK_LABEL[k]}</a>`)
  return items.length ? `<p class="links">${items.join('')}</p>` : ''
}

function primaryHref (p) { return p.links.case || p.links.live || p.links.source }

function filoDiagram () {
  return `<svg viewBox="0 0 400 240" width="100%" height="100%" fill="none" stroke="currentColor" font-family="IBM Plex Mono, monospace" font-size="11" role="img" aria-label="${esc(byId.filo.media.alt)}">
<line x1="30" y1="60" x2="370" y2="60"/><line x1="115" y1="105" x2="285" y2="105"/><line x1="157" y1="150" x2="243" y2="150"/><line x1="189" y1="195" x2="211" y2="195"/>
<g fill="currentColor" stroke="none"><circle cx="200" cy="60" r="4"/><circle cx="200" cy="105" r="4"/><circle cx="200" cy="150" r="4"/><circle cx="200" cy="195" r="4"/><g fill="#5F6977"><text x="30" y="46">n places, ranked</text><text x="295" y="109">n/2</text><text x="253" y="154">n/4</text><text x="221" y="199">≈ log₂ n taps</text></g></g></svg>`
}

/* Media frame. The whole frame links to the project (duplicate of the title link, so it is
   hidden from assistive tech and skipped by Tab); the video toggle stays a separate button. */
function media (p, { cls = '', sizes = '(max-width: 680px) 100vw, 50vw', eager = false, cover = true } = {}) {
  const m = p.media
  const href = primaryHref(p)
  const coverLink = cover ? `<a class="cover" href="${esc(href)}" tabindex="-1" aria-hidden="true"></a>` : ''
  if (m.type === 'video') {
    return `<div class="media ${cls}"><video data-inline muted loop playsinline preload="${eager ? 'metadata' : 'none'}" poster="${esc(m.poster)}" aria-label="${esc(m.alt)}"${m.w ? ` width="${m.w}" height="${m.h}"` : ''}><source src="${esc(m.src)}" type="video/mp4"></video>${coverLink}</div>`
  }
  if (m.type === 'diagram') return `<div class="media ${cls} diagram">${filoDiagram()}${coverLink}</div>`
  return `<div class="media ${cls}"><img${eager ? '' : ' loading="lazy"'} decoding="async" src="${esc(m.src)}"${m.small ? ` srcset="${esc(m.small)} 800w, ${esc(m.src)} 1600w" sizes="${sizes}"` : ''} width="${m.w}" height="${m.h}" alt="${esc(m.alt)}">${coverLink}</div>`
}
const note = (p) => p.media.note ? `<p class="note-tag">${esc(p.media.note)}</p>` : ''

/* ---------- regions ---------- */

const R = {}

R.nav = ({ current }) => {
  const items = NAV.map(([id, label, href]) => `<li><a href="${href}"${id === current ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')
  return `<header class="mast"><div class="wrap">
<a class="home" href="/"${current === 'home' ? ' aria-current="page"' : ''}>${esc(site.person.name)}</a>
<nav aria-label="Primary"><ul>${items}</ul></nav>
<button class="menu-btn" type="button" data-menu-open aria-haspopup="dialog" aria-expanded="false" aria-controls="menu">Menu</button>
</div></header>
<dialog class="menu" id="menu" aria-label="Site menu"><div class="inner">
<div class="top"><a class="home" href="/">${esc(site.person.name)}</a><button class="close" type="button" data-menu-close>Close</button></div>
<nav aria-label="Primary (menu)"><ol>${items}</ol></nav>
<p class="contact-line meta"><a href="mailto:${esc(site.person.email)}">${esc(site.person.email)}</a></p>
</div></dialog>`
}

R.foot = () => `<footer class="site-foot"><div class="wrap">
<div class="foot-row">
<p class="foot-name">${esc(site.person.name)}</p>
<ul class="foot-links"><li><a href="mailto:${esc(site.person.email)}">${esc(site.person.email)}</a></li>${site.person.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('')}</ul>
<a class="top-link" href="#top">Back to top</a>
</div>
</div></footer>`

/* Home — Hybrid Exhibition: one wide lead, a matched pair, one wide series, a quieter pair. */
R['home-work'] = () => {
  const f = byId.frameflow, h = byId.hinge, e = byId.edition, o = byId.orbit, fi = byId.filo
  const cap = (p, keys) => `<div class="cap"><h3 class="title" id="pw-${p.id}"><a href="${esc(primaryHref(p))}">${esc(p.name)}</a></h3><p class="line">${esc(p.line)}</p>${links(p.links, keys)}${note(p)}</div>`
  const art = (p, cls, mediaOpts, keys) => `<article class="pw ${cls}" aria-labelledby="pw-${p.id}">${media(p, mediaOpts)}${cap(p, keys)}</article>`
  return `
${art(f, 'pw-lead', { cls: 'm-lead', sizes: '(max-width: 680px) 100vw, 92vw', eager: true }, ['case', 'source'])}
<div class="pw-pair">
${art(h, 'pw-half', { cls: 'm-half' }, ['case', 'live'])}
${art(e, 'pw-half', { cls: 'm-half' }, ['case', 'live'])}
</div>
<div class="pw-pair pw-quiet">
${art(o, 'pw-small', { cls: 'm-small dark', sizes: '(max-width: 680px) 100vw, 40vw' }, ['case', 'live'])}
${art(fi, 'pw-small', { cls: 'm-small paper' }, ['case', 'source'])}
</div>`
}

R['home-currently'] = () => `<dl class="currently">${site.currently.map((c) => `<div><dt>${esc(c.label)}</dt><dd>${c.links ? c.links.map((l) => `<a href="${esc(l.href)}">${esc(l.text)}</a>`).join('<br>') : esc(c.text)}</dd></div>`).join('')}</dl>`

const thumb = (x) => x.still
  ? `<span class="thumb"><img loading="lazy" decoding="async" src="${esc(x.still)}" alt=""></span>`
  : `<span class="thumb thumb-type" aria-hidden="true"><span>${esc(x.name)}</span></span>`

R['home-playground'] = () => `<ul class="pg-strip">${site.playground.slice(0, 3).map((x) => `<li><a href="${esc(x.href)}">${thumb(x)}<span class="pg-name">${esc(x.name)}${isExternal(x.href) ? ' ↗' : ''}</span><span class="pg-line">${esc(x.line)}</span></a></li>`).join('')}</ul>`

/* Work index: three groups, scannable rows, each row goes somewhere real. */
R['work-index'] = () => {
  const groups = [
    ['product', 'Products'],
    ['experiment', 'Creative experiments'],
    ['professional', 'Research, team and technical work']
  ]
  const all = [...site.projects, ...site.otherWork.map((w, n) => ({ ...w, id: 'o' + n, other: true }))]
  return groups.map(([kind, title]) => {
    const rows = all.filter((p) => p.kind === kind).map((p) => {
      const text = p.other ? p.statement : p.line
      const inner = p.media?.type === 'diagram' ? filoDiagram() : `<img loading="lazy" decoding="async" src="${esc(p.media?.thumb || p.media?.poster || p.media?.src)}" alt="">`
      const thumbHtml = p.other ? '' : `<a class="wi-thumb${p.media.type === 'diagram' ? ' diagram' : ''}" href="${esc(primaryHref(p))}" tabindex="-1" aria-hidden="true">${inner}</a>`
      return `<li class="wi-row${p.other ? ' text-only' : ''}" id="${esc(p.id)}">${thumbHtml}<div class="wi-body"><h3><a href="${esc(primaryHref(p))}">${esc(p.name)}</a></h3><p>${esc(text)}</p><p class="meta">${esc(p.medium)}</p></div>${links(p.links)}</li>`
    }).join('\n')
    return `<section class="wi-group" aria-labelledby="g-${kind}"><h2 class="group-h" id="g-${kind}">${title}</h2><ol class="wi">${rows}</ol></section>`
  }).join('\n')
}

R['playground-list'] = () => `<ul class="pg-grid">${site.playground.map((x) => `<li><a href="${esc(x.href)}">${thumb(x)}<span class="pg-name">${esc(x.name)}${isExternal(x.href) ? ' ↗' : ''}</span><span class="pg-line">${esc(x.line)}</span><span class="meta">${esc(x.series)}</span></a></li>`).join('')}</ul>`

R['writing-list'] = () => `<ol class="wl">${site.writing.map((w, k) => `<li><span class="wl-n meta">${String(k + 1).padStart(2, '0')}</span><div><a class="wl-title" href="${esc(w.href)}">${esc(w.title)}${w.external ? ' ↗' : ''}</a><p class="wl-dek">${esc(w.dek)}</p></div><span class="meta wl-meta">${esc(w.topic)} · ${esc(w.date)}${w.external ? ' · external' : ''}</span></li>`).join('')}</ol>`

/* ---------- apply ---------- */

const RE = /<!-- region:([\w-]+)((?: [\w-]+=[\w-]+)*) -->[\s\S]*?<!-- \/region:\1 -->/g
let stale = 0
for (const rel of PAGES) {
  const file = join(root, rel)
  let html
  try { html = await readFile(file, 'utf8') } catch (err) {
    if (err.code === 'ENOENT') { console.warn(`skip (missing): ${rel}`); continue }
    throw err
  }
  const out = html.replace(RE, (_, name, rawArgs) => {
    const fn = R[name]
    if (!fn) throw new Error(`${rel}: unknown region "${name}"`)
    const args = Object.fromEntries(rawArgs.trim().split(/\s+/).filter(Boolean).map((kv) => kv.split('=')))
    return `<!-- region:${name}${rawArgs} -->\n${fn(args).trim()}\n<!-- /region:${name} -->`
  })
  if (out !== html) {
    stale++
    if (check) console.log(`stale: ${rel}`)
    else { await writeFile(file, out); console.log(`updated: ${rel}`) }
  }
}
if (check && stale) process.exit(1)
if (!stale) console.log('content regions up to date')
