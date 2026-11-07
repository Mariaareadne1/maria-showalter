// Responsive screenshot capture for design review.
//   node tests/capture.mjs <baseURL> <outDir> <route> [route...]
// Env: ENGINES=chromium,webkit  FULL=1 (also capture full page at 1440)
//      WIDTHS=1440,1280,768,390  MOTION=reduce|no-preference
import { chromium, webkit } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const [base, outDir, ...routes] = process.argv.slice(2)
if (!base || !outDir || routes.length === 0) {
  console.error('usage: node tests/capture.mjs <baseURL> <outDir> <route> [route...]')
  process.exit(1)
}

const VIEWPORTS = {
  1440: { width: 1440, height: 900 },
  1280: { width: 1280, height: 800 },
  1024: { width: 1024, height: 768 },
  768: { width: 768, height: 1024 },
  390: { width: 390, height: 844 },
  320: { width: 320, height: 640 },
}
const widths = (process.env.WIDTHS ?? '1440,1280,768,390').split(',').map(Number)
const engines = (process.env.ENGINES ?? 'chromium').split(',')
const full = process.env.FULL === '1'
const motion = process.env.MOTION ?? 'reduce'
const TYPES = { chromium, webkit }

await mkdir(outDir, { recursive: true })

const slug = (route) => route.replace(/^\/|\/$/g, '').replace(/[/.]+/g, '-') || 'home'

for (const engine of engines) {
  const browser = await TYPES[engine].launch()
  for (const route of routes) {
    for (const w of widths) {
      const vp = VIEWPORTS[w] ?? { width: w, height: 900 }
      const page = await browser.newPage({ viewport: vp, reducedMotion: motion, deviceScaleFactor: 1 })
      try {
        await page.goto(new URL(route, base).href, { waitUntil: 'networkidle', timeout: 45000 })
      } catch (e) {
        console.warn(`  ! ${route} @${w}: ${e.message.split('\n')[0]}`)
      }
      await page.waitForTimeout(600)
      const name = `${slug(route)}--${w}--${engine}`
      await page.screenshot({ path: join(outDir, `${name}.jpg`), type: 'jpeg', quality: 72 })
      if (full && (w === 1440 || w === 390)) {
        // Make lazy media load before the full-page capture.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)) }
          scrollTo(0, 0)
        })
        await page.waitForTimeout(500)
        await page.screenshot({ path: join(outDir, `${name}--full.jpg`), type: 'jpeg', quality: 62, fullPage: true })
      }
      console.log(`  ✓ ${name}`)
      await page.close()
    }
  }
  await browser.close()
}
