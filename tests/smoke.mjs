// Smoke + interaction checks for the preview site.
//   node tests/smoke.mjs http://127.0.0.1:5451/ [route ...]
// Env: ENGINES=chromium,webkit (default both)
import { chromium, webkit } from '@playwright/test'

const [base = 'http://127.0.0.1:5451/', ...only] = process.argv.slice(2)
const ROUTES = only.length ? only : [
  '', 'work/', 'playground/', 'art/', 'writing/', 'about/',
  'work/frameflow/', 'work/filo/', 'work/iris/',
  'blog-creativity.html', 'blog-cartpole.html', 'blog-pid.html', 'blog-filo.html',
  'gallery.html', 'design-studies/', 'design-studies/a.html', 'design-studies/b.html', 'design-studies/c.html'
]
const WIDTHS = [[1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 640]]
const engines = (process.env.ENGINES ?? 'chromium,webkit').split(',')
const TYPES = { chromium, webkit }

let failures = 0
const check = (ok, msg) => { if (!ok) { failures++; console.log(`  ✗ ${msg}`) } else if (process.env.VERBOSE) console.log(`  ✓ ${msg}`) }
const checkedLinks = new Map()

for (const engine of engines) {
  console.log(`\n[${engine}]`)
  const browser = await TYPES[engine].launch()
  for (const route of ROUTES) {
    for (const [w, h] of WIDTHS) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`))
      const res = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => ({ status: () => e.message }))
      const tag = `${route || '/'} @${w}`
      check(res.status() === 200, `${tag}: HTTP ${res.status()}`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      check(overflow <= 0, `${tag}: horizontal overflow ${overflow}px`)
      if (w === 1440 || w === 390) {
        await page.evaluate(async () => { for (const i of document.images) { i.loading = 'eager'; await i.decode().catch(() => {}) } })
        const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && !i.naturalWidth && i.src).map((i) => i.getAttribute('src')))
        check(broken.length === 0, `${tag}: broken images ${broken.join(' ')}`)
        const h1 = await page.locator('h1').count()
        check(h1 === 1, `${tag}: exactly one h1 (found ${h1})`)
        const noAlt = await page.evaluate(() => [...document.images].filter((i) => !i.hasAttribute('alt')).length)
        check(noAlt === 0, `${tag}: ${noAlt} images without alt attribute`)
        const playing = await page.evaluate(() => [...document.querySelectorAll('video')].filter((v) => !v.paused).length)
        check(playing === 0, `${tag}: no video plays under reduced motion (${playing} playing)`)
      }
      check(errors.length === 0, `${tag}: console/HTTP errors: ${errors.join(' | ')}`)
      if (w === 1440 && engine === 'chromium') {
        const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(location.origin)))
        for (const href of new Set(hrefs.map((x) => x.split('#')[0]))) {
          if (!checkedLinks.has(href)) checkedLinks.set(href, (await page.request.get(href)).status())
          check(checkedLinks.get(href) === 200, `${tag}: link ${href} → ${checkedLinks.get(href)}`)
        }
      }
      await page.close()
    }
  }

  // Phone menu: opens as a modal, Escape closes, focus returns to the button.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  const btn = page.locator('[data-menu-open]')
  await btn.click()
  check(await page.locator('#menu').evaluate((d) => d.open), 'menu opens')
  check(await page.evaluate(() => document.getElementById('menu').contains(document.activeElement)), 'focus moves into the menu')
  await page.keyboard.press('Escape')
  check(!(await page.locator('#menu').evaluate((d) => d.open)), 'Escape closes the menu')
  check(await btn.evaluate((b) => b === document.activeElement), 'focus returns to the Menu button')
  // The dialog's close event is async; wait for the handler rather than racing it.
  const reset = await page.waitForFunction(() => document.querySelector('[data-menu-open]').getAttribute('aria-expanded') === 'false', null, { timeout: 2000 }).then(() => true, () => false)
  check(reset, 'aria-expanded resets')
  // Keyboard: skip link is the first tab stop on a fresh load.
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  await page.keyboard.press('Tab')
  check(await page.evaluate(() => document.activeElement.classList.contains('skip')), 'skip link is first tab stop')
  await page.close()

  // Video previews play with motion allowed and pause offscreen.
  const vp = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  await vp.goto(base, { waitUntil: 'networkidle' })
  await vp.locator('.pw-lead video').scrollIntoViewIfNeeded()
  await vp.waitForTimeout(1500)
  check(await vp.locator('.pw-lead video').evaluate((v) => !v.paused), 'lead video plays when visible (motion allowed)')
  await vp.evaluate(() => scrollTo(0, document.body.scrollHeight))
  await vp.waitForTimeout(800)
  check(await vp.locator('.pw-lead video').evaluate((v) => v.paused), 'lead video pauses offscreen')
  await vp.close()
  await browser.close()
}

console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed')
process.exit(failures ? 1 : 0)
