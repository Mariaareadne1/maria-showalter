// Proves the portrait slot mounts the owner's halftone engine without copying it into this branch.
//   node tests/hero-integration.mjs http://127.0.0.1:5451/ [enginePath] [clipDir]
// The engine is READ from the protected checkout and injected only into the test browser via
// request interception. Clips default to the synthetic stand-ins shipped with the engine's demo —
// they are not a likeness of anyone, and the screenshot is labelled as such.
import { chromium } from '@playwright/test'
import { readFile, access } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

const base = process.argv[2] ?? 'http://127.0.0.1:5451/'
const enginePath = process.argv[3] ?? join(homedir(), 'Development/Personal/maria-showalter/halftone/halftone-cover.js')
const clipDir = process.argv[4] ?? join(homedir(), 'Downloads/halftone-cover/demo/media')
const shot = process.env.SHOT

try { await access(enginePath) } catch { console.log(`engine not found at ${enginePath}; skipping (not a failure of the site)`); process.exit(0) }
const engine = await readFile(enginePath)
let failures = 0
const check = (ok, msg) => { console.log(`  ${ok ? '✓' : '✗'} ${msg}`); if (!ok) failures++ }

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.route('**/halftone/halftone-cover.js', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: engine }))
await page.route(/\/media\/(look|hair)\.mp4$/, async (r) => {
  const name = r.request().url().match(/(look|hair)\.mp4$/)[1]
  try { r.fulfill({ status: 200, contentType: 'video/webm', body: await readFile(join(clipDir, name + '.webm')) }) } catch { r.fulfill({ status: 404 }) }
})
// Insert the one integration line the owner would add, only in this test's copy of the page.
await page.route(base, async (r) => {
  const res = await r.fetch()
  const html = (await res.text()).replace('<script src="/assets/js/hero-slot.js" defer></script>', '<script src="/halftone/halftone-cover.js" defer></script>\n<script src="/assets/js/hero-slot.js" defer></script>')
  r.fulfill({ response: res, body: html })
})
await page.goto(base, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const slot = page.locator('[data-halftone-slot]')
check((await slot.getAttribute('data-state')) === 'live', 'slot reports data-state="live" with the engine present')
check(await page.locator('[data-halftone-stage] canvas').count() > 0, 'engine drew a canvas inside the stage')
check(!(await page.locator('[data-halftone-slot] .fallback').isVisible()), 'static fallback is hidden once live')
check(errors.length === 0, `no page errors ${errors.join(' | ')}`)
if (shot) await page.screenshot({ path: shot, type: 'jpeg', quality: 75 })
await browser.close()
process.exit(failures ? 1 : 0)
