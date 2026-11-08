// Verifies every Playground entry in content/site.json opens a live, interactive world:
// HTTP 200, a canvas renders, and a drawn loop (real mouse input) changes the picture.
//   node tests/playground.mjs [outDir=qa/v2/playground]
import { chromium } from '@playwright/test'
import { readFileSync, mkdirSync } from 'node:fs'
const out = process.argv[2] || 'qa/v2/playground'
mkdirSync(out, { recursive: true })
const site = JSON.parse(readFileSync(new URL('../content/site.json', import.meta.url)))
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
let fail = 0
for (const x of site.playground) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  try {
    const res = await page.goto(x.href, { waitUntil: 'load', timeout: 60000 })
    await page.waitForSelector('canvas', { timeout: 30000 })
    await page.waitForTimeout(4000)
    const box = await page.locator('canvas').first().boundingBox()
    const before = await page.screenshot({ path: `${out}/${x.name.toLowerCase()}-before.png` })
    // a closed loop near the middle of the scene, drawn slowly like a hand
    const cx = box.x + box.width * 0.5, cy = box.y + box.height * 0.58, r = Math.min(box.width, box.height) * 0.07
    await page.mouse.move(cx + r, cy)
    await page.mouse.down()
    for (let i = 1; i <= 40; i++) { const t = (i / 40) * Math.PI * 2; await page.mouse.move(cx + Math.cos(t) * r * 1.3, cy + Math.sin(t) * r, { steps: 2 }) }
    await page.mouse.up()
    await page.waitForTimeout(4500)
    const after = await page.screenshot({ path: `${out}/${x.name.toLowerCase()}-after.png` })
    // crude change measure: compare encoded sizes and bytes in the drawn region via canvas sampling
    const changed = await page.evaluate(async ([a, b]) => {
      const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src })
      const [ia, ib] = await Promise.all([load(a), load(b)])
      const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height
      const g = c.getContext('2d')
      g.drawImage(ia, 0, 0); const da = g.getImageData(0, 0, c.width, c.height).data
      g.drawImage(ib, 0, 0); const db = g.getImageData(0, 0, c.width, c.height).data
      let n = 0; for (let i = 0; i < da.length; i += 16) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 40) n++
      return n / (da.length / 16)
    }, [`data:image/png;base64,${before.toString('base64')}`, `data:image/png;base64,${after.toString('base64')}`])
    const ok = res.status() === 200 && changed > 0.002 && errs.length === 0
    if (!ok) fail++
    console.log(`${ok ? 'PASS' : 'FAIL'} ${x.name} ${x.href} http=${res.status()} changed=${(changed * 100).toFixed(2)}% errors=${errs.length}`)
  } catch (e) { fail++; console.log(`FAIL ${x.name}: ${e.message.split('\n')[0]}`) }
  await page.close()
}
await browser.close()
process.exit(fail ? 1 : 0)
