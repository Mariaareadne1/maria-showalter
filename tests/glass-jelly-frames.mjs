// Frames of the panel's pointer response → qa/glass/j-<id>-*.png: rest, near rim, hover, press, release.
//   node tests/glass-jelly-frames.mjs [treatment]
import { mkdirSync } from 'node:fs'; mkdirSync('qa/glass', { recursive: true })
import { chromium } from '@playwright/test'
const id = process.argv[2] || 'jelly'
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto(`http://127.0.0.1:5471/?glass=${id}`)
await page.waitForFunction(() => window.__portfolioGlass?.state === 'live', null, { timeout: 30000 })
await page.waitForTimeout(1500)
const clip = { x: 280, y: 120, width: 640, height: 420 }
const shot = (n) => page.screenshot({ path: `qa/glass/j-${id}-${n}.png`, clip })
await page.mouse.move(100, 450); await page.waitForTimeout(600); await shot('0rest')
await page.mouse.move(330, 330, { steps: 10 }); await page.waitForTimeout(700); await shot('1near-rim')
await page.mouse.move(560, 330, { steps: 10 }); await page.waitForTimeout(700); await shot('2hover')
await page.mouse.down(); await page.waitForTimeout(400); await shot('3press')
await page.mouse.up(); await page.waitForTimeout(90); await shot('4release')
await browser.close()
