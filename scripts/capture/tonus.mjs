// Still of the live TONUS synth for the Playground tile.
//   node scripts/capture/tonus.mjs
import { chromium } from '@playwright/test'
const out = new URL('../../assets/media/playground/', import.meta.url).pathname
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1 })
await page.goto('https://mariaareadne1.github.io/webaudio-synth/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.screenshot({ path: out + 'tonus.jpg', type: 'jpeg', quality: 82 })
console.log('title:', await page.title())
await browser.close()
// Output then resized: ffmpeg -i tonus.jpg -vf scale=960:-2 -q:v 4 tonus-960.jpg
