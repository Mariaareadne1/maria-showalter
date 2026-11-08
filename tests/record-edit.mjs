// Records a short Edit Sky demo with real mouse input (Chromium, GPU) → docs/v2-review/edit-sky-demo.mp4
import { chromium } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
const base = process.argv[2] || 'http://127.0.0.1:5471'
const tmp = 'qa/v2/video'; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true }); mkdirSync('docs/v2-review', { recursive: true })
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: tmp, size: { width: 1280, height: 800 } } })
await ctx.addInitScript(() => { try { if (!sessionStorage.getItem('rec')) { localStorage.clear(); sessionStorage.setItem('rec', '1') } } catch {} })
const page = await ctx.newPage()
await page.goto(base + '/')
await page.waitForFunction(() => window.__portfolioSky?.sky.engine?.frames > 20, null, { timeout: 30000 })
await page.waitForTimeout(1500)
const btn = page.locator('.hero [data-sky-edit]'); const b = await btn.boundingBox()
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 20 }); await page.waitForTimeout(500); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2)
await page.waitForTimeout(1200)
// draw a cloud
await page.mouse.move(420, 300, { steps: 15 }); await page.mouse.down()
for (let i = 0; i <= 50; i++) { const u = i / 50; await page.mouse.move(420 + u * 380, 300 - Math.sin(u * Math.PI) * 90 + Math.sin(u * 14) * 10, { steps: 2 }) }
await page.mouse.up(); await page.waitForTimeout(3800)
// move it
await page.click('[data-tool="move"]'); await page.waitForTimeout(300)
await page.mouse.move(610, 250, { steps: 15 }); await page.mouse.down()
for (let i = 1; i <= 30; i++) await page.mouse.move(610 + i * 4, 250 + i * 3, { steps: 2 })
await page.mouse.up(); await page.waitForTimeout(800)
// golden hour, then back to noon
const g = await page.locator('[data-hour="18.2"]').boundingBox(); await page.mouse.move(g.x + 20, g.y + 15, { steps: 15 }); await page.mouse.click(g.x + 20, g.y + 15); await page.waitForTimeout(2800)
const n = await page.locator('[data-hour="12.5"]').boundingBox(); await page.mouse.move(n.x + 20, n.y + 15, { steps: 10 }); await page.mouse.click(n.x + 20, n.y + 15); await page.waitForTimeout(2400)
const d = await page.locator('[data-act="done"]').boundingBox(); await page.mouse.move(d.x + 20, d.y + 15, { steps: 15 }); await page.mouse.click(d.x + 20, d.y + 15)
await page.waitForTimeout(1800)
await page.mouse.wheel(0, 700); await page.waitForTimeout(1500)
await ctx.close(); await browser.close()
const webm = readdirSync(tmp).find((f) => f.endsWith('.webm'))
const ff = `${homedir()}/Developer/FrameFlow/node_modules/ffmpeg-static/ffmpeg`
execFileSync(ff, ['-loglevel', 'error', '-y', '-i', `${tmp}/${webm}`, '-vf', 'scale=960:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '28', '-movflags', '+faststart', '-an', 'docs/v2-review/edit-sky-demo.mp4'])
console.log('wrote docs/v2-review/edit-sky-demo.mp4')
