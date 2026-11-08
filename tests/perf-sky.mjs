// Measures the live sky in headless Chromium (ANGLE/Metal): init time, steady fps, auto quality, GPU ms/frame.
import { chromium } from '@playwright/test'
const base = process.argv[2] || 'http://127.0.0.1:5471'
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const [w, h, dpr] of [[1440, 900, 2], [1440, 900, 1], [390, 844, 3]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr })
  await page.addInitScript(() => { window.__t0 = performance.now() })
  await page.goto(base + '/')
  await page.waitForFunction(() => window.__portfolioSky?.sky.engine?.frames > 0, null, { timeout: 30000 })
  const init = await page.evaluate(() => ({ firstFrame: performance.now(), dcl: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd, lcp: 0 }))
  await page.waitForTimeout(6000)
  const r = await page.evaluate(async () => {
    const e = window.__portfolioSky.sky.engine
    const f0 = e.frames, t0 = performance.now()
    await new Promise((r) => setTimeout(r, 3000))
    const fps = (e.frames - f0) / ((performance.now() - t0) / 1000)
    return { fps: +fps.toFixed(1), scale: e.renderer.renderScale, quality: e.renderer.quality, canvas: [e.renderer.gl.drawingBufferWidth, e.renderer.gl.drawingBufferHeight], gpu: e.benchmark(20), heapMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1e6).toFixed(1) : null }
  })
  console.log(JSON.stringify({ viewport: `${w}x${h}@${dpr}`, dclMs: Math.round(init.dcl), firstSkyFrameMs: Math.round(init.firstFrame), ...r, gpu: { mean: +r.gpu.mean.toFixed(2), p90: +r.gpu.p90.toFixed(2), render: [r.gpu.renderWidth, r.gpu.renderHeight] } }))
  await page.close()
}
await browser.close()
