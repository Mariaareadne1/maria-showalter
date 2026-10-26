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
  'work/frameflow/index.html', 'work/filo/index.html', 'work/iris/index.html',
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
const LINK_LABEL = { case: 'Case study →', live: 'Live demo ↗', source: 'GitHub ↗', writing: 'Notes →' }

function links (l = {}) {
  const items = ['case', 'live', 'source', 'writing'].filter((k) => l[k])
    .map((k) => `<a href="${esc(l[k])}">${LINK_LABEL[k]}</a>`)
  return items.length ? `<div class="links">${items.join('')}</div>` : ''
}

function primaryHref (p) { return p.links.case || p.links.live || p.links.source }

function filoDiagram (label = true) {
  return `<svg viewBox="0 0 400 220" width="100%" height="100%" fill="none" stroke="currentColor" font-family="IBM Plex Mono, monospace" font-size="11" role="img" aria-label="${esc(byId.filo.media.alt)}">
<line x1="30" y1="50" x2="370" y2="50"/><line x1="115" y1="95" x2="285" y2="95"/><line x1="157" y1="140" x2="243" y2="140"/><line x1="189" y1="185" x2="211" y2="185"/>
<g fill="currentColor" stroke="none"><circle cx="200" cy="50" r="4"/><circle cx="200" cy="95" r="4"/><circle cx="200" cy="140" r="4"/><circle cx="200" cy="185" r="4"/>${label ? '<g fill="#5F6977"><text x="30" y="38">n places, ranked</text><text x="295" y="99">n/2</text><text x="253" y="144">n/4</text><text x="221" y="189">≈ log₂ n taps</text></g>' : ''}</g></svg>`
}

function media (p, { cls = '', fit = '', sizes = '(max-width: 680px) 100vw, 60vw' } = {}) {
  const m = p.media
  if (m.type === 'video') {
    return `<div class="media ${cls}"><video data-inline muted loop playsinline preload="none" poster="${esc(m.poster)}" aria-label="${esc(m.alt)}"><source src="${esc(m.src)}" type="video/mp4"></video></div>`
  }
  if (m.type === 'diagram') return `<div class="media ${cls} diagram">${filoDiagram()}</div>`
  return `<div class="media ${cls}"><img loading="lazy" decoding="async" src="${esc(m.src)}" srcset="${esc(m.small)} 800w, ${esc(m.src)} 1600w" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(m.alt)}"${fit ? ` style="${fit}"` : ''}></div>`
}
const note = (p) => p.media.note ? `<p class="note-tag">${esc(p.media.note)}.</p>` : ''

/* ---------- regions ---------- */

const R = {}

R.nav = ({ current }) => {
  const items = NAV.map(([id, label, href]) => `<li><a href="${href}"${id === current ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')
  const menuItems = NAV.map(([id, label, href]) => `<li><a href="${href}"${id === current ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')
  return `<header class="mast"><div class="wrap">
<a class="home" href="/">${esc(site.person.name)}</a>
<nav aria-label="Primary"><ul>${items}<li><a class="contact" href="mailto:${esc(site.person.email)}">Contact</a></li></ul></nav>
<button class="menu-btn" type="button" data-menu-open aria-haspopup="dialog" aria-expanded="false" aria-controls="menu">Menu</button>
</div></header>
<dialog class="menu" id="menu" aria-label="Site menu"><div class="inner">
<div class="top"><a class="home" href="/">${esc(site.person.name)}</a><button class="close" type="button" data-menu-close>Close</button></div>
<nav aria-label="Primary (menu)"><ol><li><a href="/">Home</a></li>${menuItems}</ol></nav>
<p class="contact-line meta">Write to <a href="mailto:${esc(site.person.email)}">${esc(site.person.email)}</a></p>
</div></dialog>`
}

R.foot = () => `<footer class="site-foot"><div class="wrap grid">
<p class="say">Say hello — <a href="mailto:${esc(site.person.email)}">${esc(site.person.email)}</a></p>
<nav aria-label="Footer"><ul><li><a href="/">Home</a></li>${NAV.map(([, l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></nav>
<div class="else"><ul>${site.person.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)} ↗</a></li>`).join('')}</ul></div>
<p class="small meta"><span>${esc(site.person.fullName)} · ${esc(site.person.study)}</span><a href="#top">Back to top ↑</a></p>
</div></footer>`

/* Home: each of the six gets a treatment suited to its medium (layout is design, text is content). */
R['home-work'] = () => {
  const f = byId.frameflow, h = byId.hinge, e = byId.edition, i = byId.iris, o = byId.orbit, fi = byId.filo
  const head = (p, n, tag = 'h3') => `<span class="no">${n}</span><${tag} class="title"><a href="${esc(primaryHref(p))}">${esc(p.name)}</a></${tag}>`
  const body = (p) => `<p class="statement">${esc(p.statement)}</p><p class="meta">${esc(p.medium)}<br>${esc(p.role)} · ${esc(p.status)}</p>${links(p.links)}`
  return `
<article class="pw pw-lead" aria-labelledby="pw-${f.id}">
  <figure class="lead-frame">${media(f, { cls: 'lead-media', sizes: '(max-width: 680px) 100vw, 90vw' })}</figure>
  <div class="lead-text"><span class="no">01</span><h3 class="title" id="pw-${f.id}"><a href="${esc(primaryHref(f))}">${esc(f.name)}</a></h3></div>
  <div class="lead-body">${body(f)}</div>
</article>
<div class="pw-pair">
  <article class="pw pw-hinge" aria-labelledby="pw-${h.id}">${media(h, { cls: 'hinge-media', sizes: '(max-width: 680px) 100vw, 55vw' })}<div class="pw-text">${head(h, '02').replace('class="title"', `class="title" id="pw-${h.id}"`)}${body(h)}${note(h)}</div></article>
  <article class="pw pw-edition" aria-labelledby="pw-${e.id}">${media(e, { cls: 'edition-media', sizes: '(max-width: 680px) 100vw, 40vw' })}<div class="pw-text">${head(e, '03').replace('class="title"', `class="title" id="pw-${e.id}"`)}${body(e)}${note(e)}</div></article>
</div>
<article class="pw pw-stage on-dark" aria-labelledby="pw-${i.id}">
  <div class="stage-inner">
    <div class="stage-text">${head(i, '04').replace('class="title"', `class="title" id="pw-${i.id}"`)}${body(i)}</div>
    ${media(i, { cls: 'stage-media', sizes: '(max-width: 680px) 100vw, 62vw' })}
    <ul class="stage-trio">${site.playground.filter((x) => x.status.startsWith('Iris')).map((x) => `<li><a href="${esc(x.href)}"><span class="verb">${esc(x.verb)}</span> ${esc(x.name)} ↗</a></li>`).join('')}</ul>
  </div>
</article>
<ol class="pw-rows">
  <li class="pw pw-row pw-orbit" aria-labelledby="pw-${o.id}">${head(o, '05').replace('class="title"', `class="title" id="pw-${o.id}"`)}<div class="row-body">${body(o)}${note(o)}</div>${media(o, { cls: 'row-media dark', sizes: '(max-width: 680px) 100vw, 30vw' })}</li>
  <li class="pw pw-row pw-filo" aria-labelledby="pw-${fi.id}">${head(fi, '06').replace('class="title"', `class="title" id="pw-${fi.id}"`)}<div class="row-body">${body(fi)}</div>${media(fi, { cls: 'row-media paper' })}</li>
</ol>`
}

R['home-currently'] = () => `<ul class="currently">${site.currently.map((c) => `<li><span class="meta">${esc(c.label)}</span><span>${c.href ? `<a href="${esc(c.href)}">${esc(c.text)}</a>` : esc(c.text)}</span></li>`).join('')}</ul>`

R['home-playground'] = () => `<ul class="play">${site.playground.map((x) => `<li><a href="${esc(x.href)}"><span class="verb">${esc(x.verb)}</span><span class="nm">${esc(x.name)}${isExternal(x.href) ? ' ↗' : ''}</span><span class="ln">${esc(x.line)}</span><span class="meta">${esc(x.status)}</span></a></li>`).join('')}</ul>`

const photo = (id) => site.photos.find((p) => p.id === id) || site.process.find((p) => p.id === id)
const filmLabel = (p) => p.film === 'bw' ? 'Black-and-white 35 mm film' : p.film === 'colour' ? 'Colour 35 mm film' : 'Process'

R['home-art'] = () => {
  const picks = [['000000010015', 'a1', 1600], ['img_0422', 'a2', 800], ['img_f8d2fad1_bw', 'a3', 800]]
  return `<div class="art-seq">${picks.map(([id, cls, w]) => { const p = photo(id); const sq = id.endsWith('_bw') && id !== '000000010015'; return `<figure class="${cls}"><a href="/art/#${esc(id)}"><img loading="lazy" decoding="async" src="/assets/media/photos/${esc(id)}-${w}.jpg" width="${w}" height="${sq ? w : Math.round(w * 0.663)}" alt="${esc(p.alt)}"></a><figcaption>${esc(filmLabel(p))}</figcaption></figure>` }).join('')}</div>`
}

R['home-writing'] = () => `<ul class="writing-list">${site.writing.slice(0, 4).map((w) => `<li><a href="${esc(w.href)}">${esc(w.title)}</a><span class="meta">${esc(w.topic)} · ${esc(w.date)}</span></li>`).join('')}</ul>`

/* Work index: categories legible without filter UI; each row expands to media + links. */
R['work-index'] = () => {
  const groups = [
    ['product', 'Product software', 'Finished enough to use; each has a live demo or a documented build.'],
    ['experiment', 'Experimental interactive systems', 'Studies and prototypes. Some are research code.'],
    ['professional', 'Professional, team and research work', 'Work done with or for others; my part is stated.']
  ]
  const all = [...site.projects, ...site.otherWork.map((w, n) => ({ ...w, id: 'o' + n, other: true }))]
  let n = 0
  return groups.map(([kind, title, desc]) => {
    const rows = all.filter((p) => p.kind === kind).map((p) => {
      n++
      const pid = `wi-${p.id}`
      const mediaHtml = p.other ? '' : media(p, { cls: p.id === 'iris' || p.id === 'orbit' ? 'dark' : '', sizes: '(max-width: 680px) 100vw, 55vw' })
      return `<li><button type="button" class="wi-head" data-disclosure aria-expanded="false" aria-controls="${pid}"><span class="n meta">${String(n).padStart(2, '0')}</span><span class="t">${esc(p.name)}</span><span class="d"><span class="sm">${esc(p.statement)}</span><span class="md meta">${esc(p.medium)}</span></span><span class="ex" aria-hidden="true">+</span></button>
<div class="wi-panel${p.other ? ' text-only' : ''}" id="${pid}" hidden>${mediaHtml}<div class="wi-text">${p.role ? `<p class="meta">${esc(p.role)}${p.status ? ' · ' + esc(p.status) : ''}</p>` : ''}${links(p.links)}${p.media?.note ? `<p class="note-tag">${esc(p.media.note)}.</p>` : ''}</div></div></li>`
    }).join('\n')
    return `<section class="wi-group" aria-labelledby="g-${kind}"><header class="opener"><span class="no">${kind === 'product' ? 'A' : kind === 'experiment' ? 'B' : 'C'}</span><h2 id="g-${kind}">${title}</h2><p>${desc}</p></header><ol class="wi">${rows}</ol></section>`
  }).join('\n')
}

R['playground-list'] = () => `<ol class="pg">${site.playground.map((x, k) => `<li class="pg-item tone-${esc(x.tone)}"><a href="${esc(x.href)}">${x.still ? `<span class="media"><img loading="lazy" decoding="async" src="${esc(x.still)}" alt="${esc(x.alt)}"></span>` : `<span class="media type-only" aria-hidden="true"><span>${esc(x.verb.toLowerCase())}</span></span>`}<span class="pg-text"><span class="verb">${esc(x.verb)}</span><span class="nm">${esc(x.name)}${isExternal(x.href) ? ' ↗' : ''}</span><span class="ln">${esc(x.line)}</span><span class="meta">${esc(x.status)} · opens the ${isExternal(x.href) ? 'live experiment' : 'deck on this site'}</span></span></a></li>`).join('')}</ol>`

R['art-sequence'] = () => `<div class="seq">${site.photos.map((p, k) => `<figure class="seq-item s${(k % 5) + 1}" id="${esc(p.id)}"><button type="button" class="lb-open" data-lightbox="${k}" aria-label="Open larger: ${esc(p.alt)}"><img loading="lazy" decoding="async" src="/assets/media/photos/${esc(p.id)}-1600.jpg" srcset="/assets/media/photos/${esc(p.id)}-800.jpg 800w, /assets/media/photos/${esc(p.id)}-1600.jpg 1600w" sizes="(max-width: 680px) 100vw, 60vw" width="1600" height="1061" alt="${esc(p.alt)}"></button><figcaption>${String(k + 1).padStart(2, '0')} · ${esc(filmLabel(p))}</figcaption></figure>`).join('')}</div>`

R['art-process'] = () => `<div class="process">${site.process.map((p) => `<figure><img loading="lazy" decoding="async" src="/assets/media/photos/${esc(p.id)}-800.jpg" width="800" height="800" alt="${esc(p.alt)}"><figcaption>${esc(p.alt)}</figcaption></figure>`).join('')}</div>`

R['art-data'] = () => `<script type="application/json" id="photo-data">${JSON.stringify(site.photos.map((p) => ({ id: p.id, alt: p.alt, film: filmLabel(p) }))).replace(/</g, '\\u003c')}</script>`

R['writing-list'] = () => `<ol class="wl">${site.writing.map((w) => `<li><a href="${esc(w.href)}"><span class="wl-title">${esc(w.title)}${w.external ? ' ↗' : ''}</span><span class="wl-dek">${esc(w.dek)}</span></a><span class="meta">${esc(w.topic)} · ${esc(w.date)}${w.external ? ' · elsewhere' : ''}</span></li>`).join('')}</ol>`

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
