// Text contrast on the drawn glass, measured from pixels (axe cannot see through a canvas).
// For each treatment and scroll position: screenshot with all text made transparent, then for
// every visible text box compare its computed ink colour with the darkest/lightest 5% of the
// pixels behind it. WCAG 2.2 AA: 4.5:1, or 3:1 for large text (≥ 24px, or ≥ 18.66px bold).
//   node tests/glass-contrast.mjs [base] [ids] [paths]
import { chromium } from '@playwright/test'
import { PNG } from 'pngjs'
const base = process.argv[2] || 'http://127.0.0.1:5471'
const ids = (process.argv[3] || 'lens,jelly,smoke,tide').split(',')
const paths = (process.argv[4] || '/').split(',')
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
let failed = 0
for (const path of paths) for (const id of ids) {
  for (const y of [0, 700, 1800]) {
    await page.goto(`${base}${path}?glass=${id}`)
    await page.waitForFunction(() => window.__portfolioGlass && window.__portfolioGlass.state !== 'css', null, { timeout: 30000 })
    await page.evaluate((y) => scrollTo(0, y), y)
    await page.waitForTimeout(1600)
    const boxes = await page.evaluate(() => {
      const out = []
      const walker = document.createTreeWalker(document.querySelector('.sheet'), NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        const n = walker.currentNode
        if (!n.textContent.trim()) continue
        const el = n.parentElement
        if (el.closest('.media, .thumb, .vid-toggle, .vh, dialog, [hidden], .edit-sky')) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || +cs.opacity === 0) continue
        const r = document.createRange(); r.selectNodeContents(n)
        for (const b of r.getClientRects()) {
          if (b.width < 4 || b.bottom < 0 || b.top > innerHeight) continue
          const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700
          out.push({ x: b.left, y: Math.max(0, b.top), w: b.width, h: Math.min(b.bottom, innerHeight) - Math.max(0, b.top), color: cs.color, large: size >= 24 || (bold && size >= 18.66), text: n.textContent.trim().slice(0, 40) })
        }
      }
      return out
    })
    await page.addStyleTag({ content: '.sheet *, .sheet *::before, .sheet *::after { color: transparent !important; text-decoration-color: transparent !important; caret-color: transparent !important }' })
    await page.waitForTimeout(250)
    const png = PNG.sync.read(await page.screenshot())
    let worst = { r: 99 }, bad = 0
    for (const b of boxes) {
      const m = b.color.match(/[\d.]+/g).map(Number)
      const lum = []
      for (let yy = Math.floor(b.y); yy < Math.min(png.height, b.y + b.h); yy++) for (let xx = Math.floor(b.x); xx < Math.min(png.width, b.x + b.w); xx++) {
        const i = (yy * png.width + xx) * 4
        lum.push([L(png.data[i], png.data[i + 1], png.data[i + 2]), png.data[i], png.data[i + 1], png.data[i + 2]])
      }
      if (!lum.length) continue
      lum.sort((a, c) => a[0] - c[0])
      // composite semi-transparent ink over the median background, then test the 5% extreme
      const med = lum[lum.length >> 1]
      const a = m[3] ?? 1
      const ink = L(m[0] * a + med[1] * (1 - a), m[1] * a + med[2] * (1 - a), m[2] * a + med[3] * (1 - a))
      const inkIsLight = ink > med[0]
      const ext = inkIsLight ? lum[Math.floor(lum.length * 0.95)][0] : lum[Math.floor(lum.length * 0.05)][0]
      const r = ratio(ink, ext), need = b.large ? 3 : 4.5
      if (r < need) bad++
      if (r / need < worst.r / (worst.need || 1)) worst = { r: +r.toFixed(2), need, text: b.text }
    }
    if (bad) failed++
    console.log(`${bad ? 'FAIL' : 'PASS'} ${path} ${id} scroll ${y}: ${boxes.length} text boxes, ${bad} below AA; tightest ${worst.r}:1 (needs ${worst.need}) "${worst.text}"`)
  }
}
await browser.close()
process.exit(failed ? 1 : 0)
