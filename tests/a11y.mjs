// axe-core (WCAG 2.0–2.2 A/AA rules) on every main route, desktop and phone.
//   node tests/a11y.mjs http://127.0.0.1:5461/
import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const base = process.argv[2] ?? 'http://127.0.0.1:5461/'
const ROUTES = ['', 'work/', 'work/frameflow/', 'work/hinge/', 'work/edition/', 'work/orbit/', 'work/filo/',
  'playground/', 'art/', 'writing/', 'about/', '404.html', 'blog-pid.html']
const browser = await chromium.launch()
let total = 0
for (const [w, h] of [[1440, 900], [390, 844]]) {
  for (const r of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.goto(base + r, { waitUntil: 'networkidle' })
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    for (const v of res.violations) {
      total++
      console.log(`✗ ${r || '/'} @${w} ${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)
    }
    await ctx.close()
  }
}
await browser.close()
console.log(total ? `\n${total} violation group(s)` : '\nno axe violations')
process.exit(total ? 1 : 0)
