// Visual QA: node scripts/look.mjs <path> <out.png> [--w=1440 --h=900 --full --wait=6000 --scroll=0 --dpr=1]
import { chromium } from '@playwright/test'
const [path = '/', out = 'look.png', ...rest] = process.argv.slice(2)
const a = Object.fromEntries(rest.map((x) => { const m = /^--([^=]+)(?:=(.*))?$/.exec(x); return [m[1], m[2] ?? '1'] }))
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: +(a.w ?? 1440), height: +(a.h ?? 900) }, deviceScaleFactor: +(a.dpr ?? 1) })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('requestfailed', (r) => errors.push('failed: ' + r.url()))
page.on('response', (r) => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()) })
await page.goto(`http://127.0.0.1:5481${path}`)
await page.waitForTimeout(+(a.wait ?? 6000))
if (a.scroll) { await page.evaluate((y) => window.scrollTo(0, +y), a.scroll); await page.waitForTimeout(900) }
await page.screenshot({ path: out, fullPage: !!a.full })
console.log(out, JSON.stringify(errors.slice(0, 10)))
await browser.close()
