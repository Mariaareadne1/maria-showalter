// Representative load measurement (Chromium, cold cache, no throttling).
//   node tests/perf.mjs <url> [<url> ...]
// Reports requests and bytes for the initial load (before any scrolling), LCP and CLS.
// Wall-clock numbers on a busy laptop are indicative only; bytes and request counts are the
// comparable part between hosts.
import { chromium } from '@playwright/test'

const urls = process.argv.slice(2)
const browser = await chromium.launch()
for (const url of urls) {
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'no-preference' })
    const page = await ctx.newPage()
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Network.enable')
    let bytes = 0, requests = 0
    const byType = {}
    cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; requests++ })
    cdp.on('Network.responseReceived', (e) => { byType[e.type] = (byType[e.type] || 0) + 1 })
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value }).observe({ type: 'layout-shift', buffered: true })
    })
    const t0 = Date.now()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
    const load = Date.now() - t0
    await page.waitForTimeout(1000)
    const { lcp, cls } = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }))
    console.log(`${url} @${vp.width}: ${requests} requests, ${(bytes / 1024 / 1024).toFixed(2)} MB, networkidle ${load} ms, LCP ${Math.round(lcp)} ms, CLS ${cls.toFixed(3)}  ${JSON.stringify(byType)}`)
    await ctx.close()
  }
}
await browser.close()
