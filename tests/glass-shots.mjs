// Screenshots of the home page per glass treatment: node tests/glass-shots.mjs [outDir] [ids] [scrollY]
import { chromium } from '@playwright/test'
const out = process.argv[2] || 'qa/glass'
const ids = (process.argv[3] || 'lens,jelly,smoke,tide').split(',')
const scrollY = +(process.argv[4] || 0)
import { mkdirSync } from 'node:fs'; mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
for (const id of ids) {
  await page.goto(`http://127.0.0.1:5471/?glass=${id}`)
  await page.waitForFunction(() => window.__portfolioGlass?.state === 'live', null, { timeout: 30000 }).catch(() => {})
  if (scrollY) { await page.evaluate(y => scrollTo(0, y), scrollY) }
  await page.waitForTimeout(2500)
  const st = await page.evaluate(() => ({ state: window.__portfolioGlass?.state, ...window.__portfolioGlass?.stats }))
  await page.screenshot({ path: `${out}/${id}-${scrollY}.png` })
  console.log(id, JSON.stringify(st))
}
console.log('errors', errs)
await browser.close()
