// Records the panel material in motion (Chromium, GPU, real mouse input) → docs/v2-review/glass-jelly-demo.mp4
// Pointer approaches the rim from the sky, rests on the slab, presses and releases, then the
// page scrolls (the surface trails a little and settles), then the four treatments in turn.
import { chromium } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
const base = process.argv[2] || 'http://127.0.0.1:5471'
const tmp = mkdtempSync(`${tmpdir()}/glassrec-`)
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: tmp, size: { width: 1280, height: 800 } } })
const page = await ctx.newPage()
await page.goto(`${base}/?glass=skyjelly`)
await page.waitForFunction(() => window.__portfolioGlass?.state === 'live', null, { timeout: 30000 })
await page.waitForTimeout(1500)
const m = page.mouse
await m.move(60, 420); await page.waitForTimeout(400)
await m.move(250, 420, { steps: 40 }); await page.waitForTimeout(900)     // near the rim
await m.move(560, 380, { steps: 50 }); await page.waitForTimeout(900)     // onto the slab
await m.move(760, 300, { steps: 50 }); await page.waitForTimeout(500)
await m.down(); await page.waitForTimeout(700); await m.up(); await page.waitForTimeout(1300) // press, spring back
await m.move(1240, 420, { steps: 40 }); await page.waitForTimeout(700)
for (let i = 0; i < 14; i++) { await m.wheel(0, 70); await page.waitForTimeout(30) }
await page.waitForTimeout(1200)
for (let i = 0; i < 14; i++) { await m.wheel(0, -70); await page.waitForTimeout(30) }
await page.waitForTimeout(1200)
for (const id of ['clearjelly', 'jelly', 'tide', 'skyjelly']) {
  await page.evaluate((id) => window.__portfolioGlass.setTreatment(id), id)
  await m.move(420 + Math.random() * 300, 360, { steps: 25 })
  await page.waitForTimeout(1500)
}
await ctx.close(); await browser.close()
const webm = readdirSync(tmp).find((f) => f.endsWith('.webm'))
const ff = `${homedir()}/Developer/FrameFlow/node_modules/ffmpeg-static/ffmpeg`
execFileSync(ff, ['-loglevel', 'error', '-y', '-i', `${tmp}/${webm}`, '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', '-an', 'docs/v2-review/glass-jelly-demo.mp4'])
console.log('wrote docs/v2-review/glass-jelly-demo.mp4')
