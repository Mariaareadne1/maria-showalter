// Renders the shipped default sky with the real Sky Study renderer and saves assets/sky/sky-still.jpg.
// Needs the site served (default http://127.0.0.1:5471). Uses Chromium with ANGLE/Metal.
import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const base = process.argv[2] || 'http://127.0.0.1:5471'
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.addInitScript(() => { try { localStorage.clear() } catch {} })
await page.goto(base + '/')
await page.waitForFunction(() => window.__portfolioSky?.sky.engine)
const url = await page.evaluate(() => {
  const e = window.__portfolioSky.sky.engine
  const w = 1600, h = 1000
  const px = e.capture(w, h, 48)
  const c = document.createElement('canvas'); c.width = w; c.height = h
  c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(px), w, h), 0, 0)
  return c.toDataURL('image/jpeg', 0.84)
})
writeFileSync('assets/sky/sky-still.jpg', Buffer.from(url.split(',')[1], 'base64'))
console.log('wrote assets/sky/sky-still.jpg')
await browser.close()
