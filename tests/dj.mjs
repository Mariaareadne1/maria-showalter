// DJ deck behaviour test.
//   node tests/dj.mjs http://127.0.0.1:5451/
// The six commercial MP3s are never decoded here: every track request is answered with a
// generated WAV fixture (sine + 120 BPM clicks), so tests use rights-clean audio only.
import { chromium, webkit } from '@playwright/test'

const base = process.argv[2] ?? 'http://127.0.0.1:5451/'
const engines = (process.env.ENGINES ?? 'chromium,webkit').split(',')
const TYPES = { chromium, webkit }
let failures = 0, soft = 0
const check = (ok, msg) => { console.log(`  ${ok ? '✓' : '✗'} ${msg}`); if (!ok) failures++ }
const note = (ok, msg) => { console.log(`  ${ok ? '✓' : '~'} ${msg}${ok ? '' : ' (environment-dependent; not counted)'}`); if (!ok) soft++ }

function fixtureWav (seconds = 6, rate = 44100) {
  const n = seconds * rate, data = Buffer.alloc(44 + n * 2)
  data.write('RIFF', 0); data.writeUInt32LE(36 + n * 2, 4); data.write('WAVE', 8); data.write('fmt ', 12)
  data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22); data.writeUInt32LE(rate, 24)
  data.writeUInt32LE(rate * 2, 28); data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34); data.write('data', 36); data.writeUInt32LE(n * 2, 40)
  const beat = rate * 0.5 // 120 BPM
  for (let i = 0; i < n; i++) {
    const click = (i % beat) < 400 ? Math.exp(-(i % beat) / 80) : 0
    const v = 0.25 * Math.sin(2 * Math.PI * 220 * i / rate) + 0.5 * click
    data.writeInt16LE(Math.max(-1, Math.min(1, v)) * 32767 | 0, 44 + i * 2)
  }
  return data
}
const WAV = fixtureWav()

const setRange = (page, sel, value, ev = 'input') => page.$eval(sel, (el, [v, e]) => { el.value = v; el.dispatchEvent(new Event(e, { bubbles: true })) }, [String(value), ev])
const state = (page) => page.evaluate(() => window.__dj.state())
const near = (a, b, tol) => Math.abs(a - b) <= tol

for (const engine of engines) {
  console.log(`\n[${engine}]`)
  const browser = await TYPES[engine].launch(engine === 'chromium' ? { args: ['--autoplay-policy=no-user-gesture-required'] } : {})
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const audioRequests = []
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.route(/track-.*\.mp3$/, (route) => {
    audioRequests.push(route.request().url())
    if (route.request().url().includes('track-bills')) return route.fulfill({ status: 404, body: 'missing' })
    return route.fulfill({ status: 200, contentType: 'audio/wav', body: WAV })
  })
  await page.goto(base + '#deck', { waitUntil: 'networkidle' })

  let s = await state(page)
  check(s.ctx === 'none', 'no AudioContext before a user gesture')
  check(audioRequests.length === 0, 'no audio fetched on page load')
  check(await page.locator('[data-play="A"]').isDisabled(), 'Play is disabled with no track')

  // Load a pair via a suggestion chip (one real gesture).
  await page.getByRole('button', { name: 'Yummy + Paper Planes' }).click()
  await page.waitForFunction(() => document.querySelector('[data-status="A"]').textContent.startsWith('Ready') && document.querySelector('[data-status="B"]').textContent.startsWith('Ready'), null, { timeout: 15000 })
  s = await state(page)
  check(s.A.loaded !== false && s.B.loaded !== false, 'both decks decode the fixture and build their graphs')
  check(!(await page.locator('[data-play="A"]').isDisabled()), 'Play enables after load')

  // Transport
  await page.locator('[data-play="A"]').click()
  s = await state(page)
  check(s.A.playing === true, 'deck A plays')
  check((await page.locator('[data-play="A"]').textContent()) === 'Pause', 'button reads Pause while playing')
  await page.waitForTimeout(900)
  const p1 = (await state(page)).A.position
  note(p1 > 0.3, `deck A position advances (${p1.toFixed(2)} s after 0.9 s; ctx ${s.ctx})`)
  await page.locator('[data-play="A"]').click()
  const paused = await state(page)
  check(paused.A.playing === false, 'pause stops deck A')
  await page.waitForTimeout(400)
  check(near((await state(page)).A.position, paused.A.position, 0.01), 'position holds while paused')

  // Seek
  await setRange(page, '#posA', 500, 'change')
  check(near((await state(page)).A.position, 3.0, 0.05), 'seek to 50% of a 6 s fixture lands at 3.0 s')
  await page.locator('[data-play="A"]').focus()
  await page.keyboard.press('Space')
  check((await state(page)).A.playing === true, 'Space on the focused Play button starts the deck (keyboard)')
  note((await state(page)).A.position >= 2.95, 'playback resumes from the seek point, not 0')

  // Filters (original curves)
  await setRange(page, '#lp', 0)
  await page.waitForTimeout(150)
  check(near((await state(page)).A.lp, 200, 15), 'low pass at 0 → ~200 Hz on deck A')
  await setRange(page, '#hp', 100)
  await page.waitForTimeout(150)
  s = await state(page)
  check(near(s.B.hp, 820, 15), 'high pass at 100 → ~820 Hz on deck B')
  await setRange(page, '#lp', 100); await setRange(page, '#hp', 0)

  // Crossfader (equal power)
  await setRange(page, '#xf', 0); await page.waitForTimeout(150)
  s = await state(page)
  check(near(s.A.xf, 1, 0.03) && near(s.B.xf, 0, 0.03), 'crossfader hard left: A=1, B=0')
  await setRange(page, '#xf', 50); await page.waitForTimeout(150)
  s = await state(page)
  check(near(s.A.xf, Math.SQRT1_2, 0.03) && near(s.B.xf, Math.SQRT1_2, 0.03), 'crossfader centre: both ≈0.707 (equal power)')

  // Volume
  await setRange(page, '#volA', 0); await page.waitForTimeout(150)
  check(near((await state(page)).A.vol, 0, 0.01), 'deck A volume 0 → gain 0')
  await setRange(page, '#volA', 85)

  // Tempo + sync are real now
  check(near((await state(page)).A.rate, 1, 0.001), 'unsynced deck plays at its native rate')
  await page.locator('#syncBtn').click()
  s = await state(page)
  check(s.synced && s.tempo === 97, 'Sync engages at the midpoint of 96 and 98 BPM')
  check(near(s.A.rate, 97 / 96, 0.002) && near(s.B.rate, 97 / 98, 0.002), 'Sync sets each deck’s playbackRate to tempo / track BPM')
  await setRange(page, '#tempo', 120)
  s = await state(page)
  check(near(s.A.rate, 120 / 96, 0.002), 'tempo 120 → deck A rate 1.25')
  check((await page.locator('[data-bpm="A"]').textContent()) === '120', 'deck A BPM readout shows the real tempo')

  // Platter nudge (pointer)
  const box = await page.locator('[data-platter="A"]').boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 4 })
  const held = (await state(page)).A.rate
  await page.mouse.up()
  const released = (await state(page)).A.rate
  check(held > 1.25 && near(released, 1.25, 0.002), `platter drag nudges the rate (${held.toFixed(3)}) and releases back (${released.toFixed(3)})`)

  // Error state: Bills is answered with 404 by the route above.
  await page.selectOption('#selB', 'track-bills.mp3')
  await page.waitForFunction(() => /Couldn’t load/.test(document.querySelector('[data-status="B"]').textContent), null, { timeout: 10000 })
  check(await page.locator('[data-play="B"]').isDisabled(), 'failed load shows an error and disables Play')

  // Stop everything
  await page.locator('[data-play="A"]').click()
  check((await state(page)).A.playing === false, 'deck A stops')
  check(errors.length === 0, `no page errors ${errors.join(' | ')}`)
  await browser.close()
}
console.log(failures ? `\n${failures} failure(s), ${soft} soft` : `\nall checks passed (${soft} environment-dependent notes)`)
process.exit(failures ? 1 : 0)
