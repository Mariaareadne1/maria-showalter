// Screenshots of the V2 site with the real GPU sky (Chromium + ANGLE/Metal).
//   node tests/shots.mjs <outDir> [base=http://127.0.0.1:5471] [pages=/,/work/] [sizes=1440x900,390x844]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const out = process.argv[2] || 'qa/v2/shots'
const base = process.argv[3] || 'http://127.0.0.1:5471'
const pages = (process.argv[4] || '/').split(',')
const sizes = (process.argv[5] || '1440x900,390x844').split(',').map((s) => s.split('x').map(Number))
const full = process.env.FULL === '1'
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: Number(process.env.DPR || 1), isMobile: w < 700, hasTouch: w < 700 })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.error('pageerror', e.message))
  page.on('console', (m) => { if (m.type() === 'error') console.error('console', m.text()) })
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'load' })
    if (await page.$('[data-sky-live]')) await page.waitForFunction(() => document.querySelector('.sky')?.dataset.reveal === 'true' || ['unsupported', 'lost'].includes(document.documentElement.dataset.sky), null, { timeout: 30000 })
    await page.waitForTimeout(Number(process.env.WAIT || 1500))
    const name = `${(path.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home')}-${w}x${h}`
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: full })
    console.log('shot', name)
  }
  await ctx.close()
}
await browser.close()
