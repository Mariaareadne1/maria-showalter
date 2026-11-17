// Homepage Meadow window: wakes on click, and drawing a loop inside it makes a sheep.
// node tests/play.mjs [base] [shot.png]
import { chromium } from '@playwright/test'
const base = process.argv[2] || 'http://127.0.0.1:5481/'
const shot = process.argv[3]
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(base)
await page.locator('#play').scrollIntoViewIfNeeded()
const before = await page.locator('iframe.play-live').count()
await page.getByRole('button', { name: /Play Meadow here/ }).click()
await page.waitForSelector('.play-frame.is-live', { timeout: 30000 })
const frame = page.frameLocator('iframe.play-live')
await frame.locator('canvas').first().waitFor({ timeout: 30000 })
await page.waitForTimeout(2500)
const box = await page.locator('.play-frame').boundingBox()
// a loose loop in the middle of the field
const cx = box.x + box.width * 0.55, cy = box.y + box.height * 0.6, r = Math.min(box.width, box.height) * 0.06
await page.mouse.move(cx + r, cy)
await page.mouse.down()
for (let i = 1; i <= 40; i++) { const a = (i / 40) * Math.PI * 2.1; await page.mouse.move(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8) }
await page.mouse.up()
await page.waitForTimeout(5000)
if (shot) await page.screenshot({ path: shot, clip: box })
const sheepText = await frame.locator('body').innerText().catch(() => '')
console.log(JSON.stringify({ before, live: await page.locator('.play-frame.is-live').count(), errors, tail: sheepText.slice(0, 160).replace(/\s+/g, ' ') }))
await browser.close()
if (errors.length) process.exit(1)
