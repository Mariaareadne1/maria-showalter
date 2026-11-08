// Glass panel cost on the real GPU: frame rate with the sky + glass running and the pointer
// moving over the panel, the glass draw's GPU time, and the sky-copy time.
//   node tests/perf-glass.mjs [base]
import { chromium } from '@playwright/test'
const base = process.argv[2] || 'http://127.0.0.1:5471'
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const [w, h, dpr, id] of [[1440, 900, 2, 'jelly'], [1440, 900, 2, 'tide'], [1440, 900, 1, 'jelly'], [390, 844, 3, 'jelly']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr })
  await page.goto(`${base}/?glass=${id}`)
  await page.waitForFunction(() => window.__portfolioGlass?.state === 'live', null, { timeout: 30000 })
  await page.waitForTimeout(3000)
  const move = (async () => { for (let i = 0; i < 60; i++) { await page.mouse.move(w * 0.3 + i * 4, h * 0.4 + Math.sin(i / 5) * 60); await page.waitForTimeout(40) } })()
  const r = await page.evaluate(async () => {
    const e = window.__portfolioSky.sky.engine, g = window.__portfolioGlass
    const f0 = e.frames, d0 = g.stats.draws, t0 = performance.now()
    await new Promise((r) => setTimeout(r, 2400))
    const s = (performance.now() - t0) / 1000
    // GPU time of one glass draw: force completion with a readback
    const cv = document.querySelector('canvas.glass-canvas'), gl = cv.getContext('webgl2')
    const times = []
    for (let i = 0; i < 20; i++) { const a = performance.now(); window.dispatchEvent(new Event('resize')); await new Promise(requestAnimationFrame); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4)); times.push(performance.now() - a) }
    times.sort((a, b) => a - b)
    return { fps: +((e.frames - f0) / s).toFixed(1), glassFps: +((g.stats.draws - d0) / s).toFixed(1), uploadMs: +g.stats.uploadMs.toFixed(2), canvas: [cv.width, cv.height], frameWithReadbackMs: +times[10].toFixed(1) }
  })
  await move
  console.log(JSON.stringify({ viewport: `${w}x${h}@${dpr}`, treatment: id, ...r }))
  await page.close()
}
await browser.close()
