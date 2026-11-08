// End-to-end checks for the live sky with real pointer and keyboard input, on the real GPU renderer.
//   node tests/sky.mjs [base=http://127.0.0.1:5471] [browser=chromium|webkit]
// Each check asserts scene state AND rendered pixels where the brief asks for both.
import { chromium, webkit } from '@playwright/test'

const base = process.argv[2] || 'http://127.0.0.1:5471'
const which = process.argv[3] || 'chromium'
const launcher = which === 'webkit' ? webkit : chromium
const browser = await launcher.launch(which === 'chromium' ? { args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] } : {})
let pass = 0, fail = 0
const results = []
async function check (name, fn) {
  try { await fn(); pass++; results.push(`PASS ${name}`) } catch (e) { fail++; results.push(`FAIL ${name}: ${e.message.split('\n')[0]}`) }
}
const assert = (c, m) => { if (!c) throw new Error(m) }

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(base + '/')
await page.evaluate(() => localStorage.clear())
await page.reload()

const ready = () => page.waitForFunction(() => window.__portfolioSky?.sky.engine && document.documentElement.dataset.sky === 'live' && window.__portfolioSky.sky.engine.frames > 6, null, { timeout: 30000 })
const scene = () => page.evaluate(() => window.__portfolioSky.store.getState().scene)
const sample = (r) => page.evaluate((r) => window.__portfolioSky.sky.engine.sample(r, 160, 100), r)
const diff = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b)

await check('text and nav render before/without waiting for the sky', async () => {
  assert(await page.locator('h1').innerText() === 'Maria Showalter, Design Engineer' || (await page.locator('h1').innerText()).includes('Design Engineer'), 'hero heading')
  assert(await page.locator('nav[aria-label="Primary"] a').count() === 5, 'nav links')
})

await ready()

await check('default scene: authored clouds, daylight', async () => {
  const s = await scene()
  assert(s.clouds.length >= 4 && s.clouds.length <= 7, `clouds ${s.clouds.length}`)
  assert(Math.abs(s.hour - 12.5) < 0.01, `hour ${s.hour}`)
})

await check('browse: wheel over the open sky scrolls the page (no camera move)', async () => {
  const view0 = await page.evaluate(() => JSON.stringify(window.__portfolioSky.store.getState().view))
  await page.mouse.move(120, 420)
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(400)
  const y = await page.evaluate(() => window.scrollY)
  assert(y > 200, `scrollY ${y}`)
  const view1 = await page.evaluate(() => JSON.stringify(window.__portfolioSky.store.getState().view))
  assert(view0 === view1, 'view changed')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
})

await check('browse: mouse drags an existing cloud in the margin (state + pixels)', async () => {
  // find a cloud's screen rect in the right margin
  const target = await page.evaluate(() => {
    const { sky, store } = window.__portfolioSky
    const rects = store.getState().scene.clouds.map((c) => ({ id: c.id, r: sky.engine.screenRect(c) })).filter((x) => x.r && x.r.x + x.r.w / 2 > 1200 && x.r.y + x.r.h / 2 < 480)
    return rects[0]
  })
  assert(target, 'no margin cloud found')
  const cx = target.r.x + target.r.w / 2, cy = target.r.y + target.r.h / 2
  const before = (await scene()).clouds.find((c) => c.id === target.id).position
  const region = { x0: 0.8, y0: 0.05, x1: 1, y1: 0.6 }
  const px0 = await sample(region)
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  for (let i = 1; i <= 12; i++) await page.mouse.move(cx + 10, cy + i * 14)
  await page.mouse.up()
  const after = (await scene()).clouds.find((c) => c.id === target.id).position
  assert(Math.hypot(after[0] - before[0], after[1] - before[1], after[2] - before[2]) > 0.2, 'cloud did not move')
  const px1 = await sample(region)
  assert(diff(px0, px1) > 0.5, `pixels unchanged (${diff(px0, px1).toFixed(2)})`)
  await page.evaluate(() => window.__portfolioSky.store.getState().undo())
})

await check('Edit sky opens with the keyboard; panel inert; focus moves into toolbar', async () => {
  await page.evaluate(() => window.scrollTo(0, 260))
  await page.waitForTimeout(200)
  await page.locator('.hero [data-sky-edit]').focus()
  await page.keyboard.press('Enter')
  await page.waitForSelector('.sky-editor:not([hidden])')
  assert(await page.evaluate(() => document.querySelector('.sheet').inert), 'sheet not inert')
  assert(await page.evaluate(() => document.activeElement?.dataset.tool === 'draw'), 'focus not on Draw')
})

await check('draw makes a real cloud (state + pixels)', async () => {
  const n0 = (await scene()).clouds.length
  const region = { x0: 0.0, y0: 0.32, x1: 0.24, y1: 0.55 }
  const px0 = await sample(region)
  await page.mouse.move(60, 400)
  await page.mouse.down()
  for (let i = 0; i <= 24; i++) await page.mouse.move(60 + i * 9, 400 + Math.sin(i / 3) * 18 - i * 1.5)
  await page.mouse.up()
  const s = await scene()
  assert(s.clouds.length === n0 + 1, `clouds ${n0} → ${s.clouds.length}`)
  await page.waitForTimeout(3800) // formation animation
  const px1 = await sample(region)
  assert(diff(px0, px1) > 3, `pixels unchanged (${diff(px0, px1).toFixed(2)})`)
})

await check('undo removes the drawn cloud; redo restores it', async () => {
  const n = (await scene()).clouds.length
  await page.click('[data-act="undo"]')
  assert((await scene()).clouds.length === n - 1, 'undo')
  await page.click('[data-act="redo"]')
  assert((await scene()).clouds.length === n, 'redo')
})

await check('select + resize with a corner handle changes scale', async () => {
  await page.click('[data-tool="move"]')
  const t = await page.evaluate(() => {
    const { sky, store } = window.__portfolioSky
    const c = store.getState().scene.clouds.at(-1)
    return { id: c.id, r: sky.engine.screenRect(c), scale: c.scale }
  })
  await page.mouse.click(t.r.x + t.r.w / 2, t.r.y + t.r.h / 2)
  await page.waitForSelector('.sky-selection:not([hidden])')
  const h = await page.locator('.sky-selection [data-handle="se"]').boundingBox()
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2)
  await page.mouse.down()
  for (let i = 1; i <= 8; i++) await page.mouse.move(h.x + 9 + i * 8, h.y + 9 + i * 5)
  await page.mouse.up()
  const c = (await scene()).clouds.find((x) => x.id === t.id)
  assert(c.scale > t.scale * 1.05, `scale ${t.scale} → ${c.scale}`)
})

await check('keyboard: arrows move the selected cloud, Delete removes it, undo restores', async () => {
  const st0 = await page.evaluate(() => { const s = window.__portfolioSky.store.getState(); return { id: s.selectedId, pos: s.scene.clouds.find((c) => c.id === s.selectedId)?.position } })
  assert(st0.id, 'nothing selected')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  const p1 = (await scene()).clouds.find((c) => c.id === st0.id).position
  assert(Math.hypot(p1[0] - st0.pos[0], p1[1] - st0.pos[1], p1[2] - st0.pos[2]) > 0.05, 'arrow did not move')
  const n = (await scene()).clouds.length
  await page.keyboard.press('Delete')
  assert((await scene()).clouds.length === n - 1, 'delete')
  await page.keyboard.press('Meta+z')
  assert((await scene()).clouds.length === n, 'undo delete')
})

await check('light preset changes the hour and the pixels; daylight restores', async () => {
  const full = { x0: 0, y0: 0, x1: 1, y1: 1 }
  const px0 = await sample(full)
  await page.click('[data-hour="18.2"]')
  await page.waitForTimeout(2600)
  assert(Math.abs((await scene()).hour - 18.2) < 0.01, 'hour')
  const px1 = await sample(full)
  assert(diff(px0, px1) > 10, `pixels barely changed (${diff(px0, px1).toFixed(1)})`)
  assert(px1.highlightWarmth > px0.highlightWarmth, 'golden hour not warmer')
  await page.click('[data-hour="12.5"]')
  await page.waitForTimeout(2200)
})

let edited
await check('Escape exits; scroll and focus restored; edits kept', async () => {
  edited = await scene()
  await page.keyboard.press('Escape')
  await page.waitForSelector('.sky-editor', { state: 'hidden' })
  assert(await page.evaluate(() => Math.abs(window.scrollY - 260) < 2), `scrollY ${await page.evaluate(() => window.scrollY)}`)
  assert(await page.evaluate(() => document.activeElement?.matches('.hero [data-sky-edit]')), 'focus not returned to trigger')
  assert(!(await page.evaluate(() => document.querySelector('.sheet').inert)), 'sheet still inert')
  assert(JSON.stringify(await scene()) === JSON.stringify(edited), 'scene changed on exit')
})

await check('navigate to a case study and back: sky persists', async () => {
  await page.waitForTimeout(700) // debounced save
  await page.click('#wk-hinge a')
  await page.waitForURL('**/work/hinge/')
  const still = await page.evaluate(() => localStorage.getItem('mariashowalter.com/sky/still/v1'))
  assert(still && still.startsWith('data:image/jpeg'), 'no saved still for inner pages')
  await page.goBack()
  await ready()
  assert(JSON.stringify((await scene()).clouds.map((c) => c.id)) === JSON.stringify(edited.clouds.map((c) => c.id)), 'scene not restored')
})

await check('reload keeps clouds and light; reset restores the original and persists', async () => {
  await page.reload()
  await ready()
  assert((await scene()).clouds.length === edited.clouds.length, 'reload lost clouds')
  await page.click('.hero [data-sky-edit]')
  await page.click('[data-act="reset"]')
  const def = await page.evaluate(() => JSON.stringify(window.__portfolioSky.defaultScene()))
  assert(JSON.stringify(await scene()) === def, 'reset not default')
  await page.click('[data-act="undo"]')
  assert((await scene()).clouds.length === edited.clouds.length, 'undo after reset')
  await page.click('[data-act="reset"]')
  await page.click('[data-act="done"]')
  await page.waitForTimeout(700)
  await page.reload()
  await ready()
  assert(JSON.stringify(await scene()) === def, 'reset did not persist')
  assert(await page.evaluate(() => localStorage.getItem('mariashowalter.com/sky/scene/v1')) === null, 'default written to storage')
})

await check('scroll progress: panel opacity rises, width never changes, and reverses', async () => {
  const read = () => page.evaluate(() => { const s = document.querySelector('.sheet'); return { w: s.getBoundingClientRect().width, x: s.getBoundingClientRect().x, bg: getComputedStyle(s).backgroundColor, p: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sky-p')) } })
  const a = await read()
  await page.evaluate(() => document.getElementById('currently').scrollIntoView())
  await page.waitForTimeout(400)
  const b = await read()
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
  const c = await read()
  assert(a.w === b.w && a.x === b.x, 'sheet width/position changed')
  assert(b.p > 0.95 && a.p < 0.05 && c.p < 0.05, `p ${a.p} ${b.p} ${c.p}`)
  assert(a.bg !== b.bg, 'background did not change')
})

await check('renderer pauses when the sky is fully veiled and resumes at the top', async () => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)
  const f0 = await page.evaluate(() => window.__portfolioSky.sky.engine.frames)
  await page.waitForTimeout(600)
  const f1 = await page.evaluate(() => window.__portfolioSky.sky.engine.frames)
  assert(f1 === f0, `still rendering when veiled (${f1 - f0} frames)`)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)
  const f2 = await page.evaluate(() => window.__portfolioSky.sky.engine.frames)
  assert(f2 > f1, 'did not resume')
})

await check('no page errors', async () => assert(errors.length === 0, errors.join(' | ')))
await ctx.close()

// Failure modes in fresh contexts.
await check('no WebGL2: still sky, readable page, Edit sky disabled with an explanation', async () => {
  const c = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const p = await c.newPage()
  await p.addInitScript(() => { const orig = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return t === 'webgl2' ? null : orig.call(this, t, ...a) } })
  const errs = []
  p.on('pageerror', (e) => errs.push(e.message))
  await p.goto(base + '/')
  await p.waitForFunction(() => document.documentElement.dataset.sky === 'unsupported', null, { timeout: 10000 })
  const btn = p.locator('.hero [data-sky-edit]')
  assert(await btn.isDisabled(), 'button enabled')
  assert((await btn.innerText()).includes('WebGL'), 'no explanation')
  const bg = await p.evaluate(() => getComputedStyle(document.querySelector('.sky-still')).backgroundImage)
  assert(bg.includes('sky-still.jpg'), 'no still')
  assert(errs.length === 0, errs.join('|'))
  await c.close()
})

await check('storage unavailable: sky still works in memory, with a notice', async () => {
  const c = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const p = await c.newPage()
  await p.addInitScript(() => { Storage.prototype.setItem = function () { throw new DOMException('quota', 'QuotaExceededError') } })
  await p.goto(base + '/')
  await p.waitForFunction(() => window.__portfolioSky?.sky.engine && document.documentElement.dataset.sky === 'live', null, { timeout: 30000 })
  await p.click('.hero [data-sky-edit]')
  await p.click('[data-act="add"]')
  await p.waitForTimeout(800)
  const status = await p.locator('#sky-status').innerText()
  assert(/saving|tab/.test(status) || (await p.evaluate(() => document.querySelector('.sky').dataset.storage)) === 'memory', `status: ${status}`)
  assert((await p.evaluate(() => window.__portfolioSky.store.getState().scene.clouds.length)) >= 6, 'memory scene lost')
  await c.close()
})

await check('WebGL context loss and restore: no errors, editing disabled then back', async () => {
  const c = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const p = await c.newPage()
  const errs = []
  p.on('pageerror', (e) => errs.push(e.message))
  await p.goto(base + '/')
  await p.waitForFunction(() => window.__portfolioSky?.sky.engine?.frames > 4, null, { timeout: 30000 })
  await p.evaluate(() => { window.__lose = window.__portfolioSky.sky.engine.renderer.gl.getExtension('WEBGL_lose_context'); window.__lose.loseContext() })
  await p.waitForFunction(() => document.documentElement.dataset.sky === 'lost')
  assert(await p.locator('.hero [data-sky-edit]').isDisabled(), 'edit not disabled')
  await p.evaluate(() => window.__lose.restoreContext())
  await p.waitForFunction(() => document.documentElement.dataset.sky === 'live', null, { timeout: 10000 })
  await p.waitForFunction(() => window.__portfolioSky.sky.engine.frames > 3, null, { timeout: 10000 })
  assert(!(await p.locator('.hero [data-sky-edit]').isDisabled()), 'edit not re-enabled')
  assert(errs.length === 0, errs.join('|'))
  await c.close()
})

await check('reduced motion: no drift, page usable', async () => {
  const c = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  const p = await c.newPage()
  await p.goto(base + '/')
  await p.waitForFunction(() => window.__portfolioSky?.sky.engine, null, { timeout: 30000 })
  assert((await p.evaluate(() => window.__portfolioSky.store.getState().drift)) === false, 'drift on')
  await c.close()
})

await check('phone 390: touch scroll does not draw; Edit sky enter/exit works', async () => {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: which === 'chromium', hasTouch: true, deviceScaleFactor: 2 })
  const p = await c.newPage()
  await p.goto(base + '/')
  await p.waitForFunction(() => window.__portfolioSky?.sky.engine && document.documentElement.dataset.sky === 'live', null, { timeout: 30000 })
  const n0 = await p.evaluate(() => window.__portfolioSky.store.getState().scene.clouds.length)
  // a touch "swipe" over the sky band in browse mode must not create a cloud
  await p.touchscreen.tap(195, 120)
  await p.evaluate(() => window.scrollTo(0, 400))
  assert((await p.evaluate(() => window.__portfolioSky.store.getState().scene.clouds.length)) === n0, 'touch created a cloud')
  await p.locator('.hero [data-sky-edit]').tap()
  await p.waitForSelector('.sky-editor:not([hidden])')
  const bar = await p.locator('.sky-bar').boundingBox()
  assert(bar && bar.y + bar.height <= 844 && bar.x >= 0, 'toolbar offscreen')
  await p.locator('[data-act="done"]').tap()
  await p.waitForSelector('.sky-editor', { state: 'hidden' })
  assert(Math.abs((await p.evaluate(() => window.scrollY)) - 400) < 2, 'scroll not restored')
  await c.close()
})

await browser.close()
console.log(results.join('\n'))
console.log(`\n${which}: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
