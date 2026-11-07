// Repeatable capture of the live Hinge app for the portfolio.
// Run from portfolio-v1:  node scripts/capture/hinge.mjs [video|stills|encode|verify|manifest|all]
// Raw frames / zips / fixture go to media-raw/hinge (outside every repo); finished media to assets/media/hinge.
import { chromium } from 'playwright'
import { execFileSync, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const URL_ = 'https://mariaareadne1.github.io/hinge/'
const ROOT = '/Users/mariashowalter/Developer/design-engineering-build-2026'
const HINGE = join(ROOT, 'hinge')
const RAW = join(ROOT, 'media-raw/hinge')
const OUT = join(ROOT, 'portfolio-v1/assets/media/hinge')
const FFMPEG = '/Users/mariashowalter/Developer/FrameFlow/node_modules/ffmpeg-static/ffmpeg'
const FFPROBE = '/Users/mariashowalter/Developer/FrameFlow/node_modules/ffprobe-static/bin/darwin/arm64/ffprobe'
const VIEWPORT = { width: 1600, height: 1000 }
const FPS = 30
const SPECIMEN = '[data-testid="stage-specimen"] > *'
const TUNED = { stiffness: 320, damping: 6 } // drag (release) spring after tuning; default Lift is 180 / 16 / 1.2
const REST_CURSOR = { x: 380, y: 820 }

for (const d of [RAW, OUT]) mkdirSync(d, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// Capture-only cursor marker: headless Chromium draws no cursor. It is a 18 px ring that follows
// pointer events (capture phase, pointer-events: none) and shrinks while a button is down.
const CURSOR_SCRIPT = () => {
  const mk = () => {
    const d = document.createElement('div')
    d.id = '__capture_cursor'
    d.style.cssText = 'position:fixed;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;' +
      'background:rgba(20,20,18,.55);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);pointer-events:none;' +
      'z-index:2147483647;transition:transform 90ms ease-out;transform:translate(-100px,-100px)'
    document.documentElement.appendChild(d)
    let x = -100, y = -100, s = 1
    const put = () => { d.style.transform = `translate(${x}px,${y}px) scale(${s})` }
    addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; put() }, true)
    addEventListener('pointerdown', (e) => { x = e.clientX; y = e.clientY; s = 0.7; put() }, true)
    addEventListener('pointerup', () => { s = 1; put() }, true)
  }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', mk)
  else mk()
}

let cur = { ...REST_CURSOR }
async function moveTo(page, x, y, ms = 600) {
  const from = { ...cur }
  const steps = Math.max(2, Math.round(ms / 16))
  for (let i = 1; i <= steps; i++) {
    const t = ease(i / steps)
    await page.mouse.move(from.x + (x - from.x) * t, from.y + (y - from.y) * t)
    await sleep(ms / steps)
  }
  cur = { x, y }
}

async function open(browser) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, acceptDownloads: true, reducedMotion: 'no-preference' })
  await ctx.addInitScript(CURSOR_SCRIPT)
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(URL_, { waitUntil: 'networkidle' })
  await page.locator(SPECIMEN).waitFor()
  await page.evaluate(() => document.fonts.ready)
  cur = { ...REST_CURSOR }
  await page.mouse.move(cur.x, cur.y)
  await sleep(500)
  return { ctx, page, errors }
}

async function specimenCenter(page) {
  const b = await page.locator(SPECIMEN).boundingBox()
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 }
}

/** Scrub a slider relative to its thumb (Hinge scrubs are relative, linear in value). */
async function scrubTo(page, name, target, ms = 800) {
  const slider = page.getByRole('slider', { name: `${name} slider` })
  const [min, max, now] = await slider.evaluate((el) => ['aria-valuemin', 'aria-valuemax', 'aria-valuenow'].map((a) => Number(el.getAttribute(a))))
  const b = await slider.boundingBox()
  const x0 = b.x + ((now - min) / (max - min)) * b.width
  const y = b.y + b.height / 2
  await moveTo(page, x0, y, 500)
  await page.mouse.down()
  await moveTo(page, x0 + ((target - now) / (max - min)) * b.width, y, ms)
  await page.mouse.up()
  // Land exactly on the target through the typed field (same commit path, one more undo step).
  const box = page.getByRole('textbox', { name, exact: true })
  const v = Number(await box.inputValue())
  if (Math.abs(v - target) > 0.01) { await box.fill(String(target)); await box.press('Enter') }
}

async function dragRelease(page, dx, dy, holdMs, watchMs) {
  const c = await specimenCenter(page)
  await moveTo(page, c.x, c.y, 550)
  await sleep(250)
  await page.mouse.down()
  await moveTo(page, c.x + dx, c.y + dy, 650)
  await sleep(holdMs)
  const held = { ...cur }
  await page.mouse.up()
  await sleep(watchMs)
  return held
}

// ---------------------------------------------------------------- video pass (CDP screencast)
async function video() {
  const browser = await chromium.launch()
  const { ctx, page, errors } = await open(browser)
  const cdp = await ctx.newCDPSession(page)
  const frames = []
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    frames.push({ data, ts: metadata.timestamp })
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  })
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: VIEWPORT.width, maxHeight: VIEWPORT.height, everyNthFrame: 1 })
  await sleep(600)
  const marks = { start: Date.now() / 1000 }
  // 1. hover the card: Lift spring rise, measured dots drawn on the hover curve
  const c = await specimenCenter(page)
  await moveTo(page, c.x, c.y + 40, 800)
  await sleep(1300)
  // 2. pick the Drag state on the rail
  const tab = await page.getByRole('tab', { name: /Drag/ }).boundingBox()
  await moveTo(page, tab.x + 90, tab.y + tab.height / 2, 700)
  await page.mouse.down(); await sleep(80); await page.mouse.up()
  await sleep(500)
  // 3. drag and throw with the default release spring (k 180, c 16, m 1.2 — ζ 0.54)
  await dragRelease(page, 250, -40, 350, 1500)
  marks.firstRelease = Date.now() / 1000
  // 4. retune the release spring: stiffer, much less damping
  await scrubTo(page, 'Stiffness', TUNED.stiffness, 700)
  await sleep(250)
  await scrubTo(page, 'Damping', TUNED.damping, 800)
  await sleep(700)
  marks.tuned = Date.now() / 1000
  // 5. same throw — now it oscillates home
  await dragRelease(page, 250, -40, 350, 2600)
  marks.secondRelease = Date.now() / 1000
  // calm end: back to the Hover state and the starting cursor position, so the loop seam is quiet
  const hov = await page.getByRole('tab', { name: /Hover/ }).boundingBox()
  await moveTo(page, hov.x + 90, hov.y + hov.height / 2, 700)
  await page.mouse.down(); await sleep(80); await page.mouse.up()
  await sleep(300)
  await moveTo(page, REST_CURSOR.x, REST_CURSOR.y, 800)
  await sleep(900)
  marks.end = Date.now() / 1000
  await cdp.send('Page.stopScreencast')
  const values = {
    stiffness: await page.getByRole('textbox', { name: 'Stiffness', exact: true }).inputValue(),
    damping: await page.getByRole('textbox', { name: 'Damping', exact: true }).inputValue(),
  }
  await browser.close()

  const dir = join(RAW, 'frames')
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true })
  frames.sort((a, b) => a.ts - b.ts)
  frames.forEach((f, i) => writeFileSync(join(dir, `${String(i).padStart(5, '0')}.jpg`), Buffer.from(f.data, 'base64')))
  // Rebuild a constant-fps sequence from the frame timestamps (screencast only emits on change).
  const list = []
  let j = 0
  for (let t = marks.start; t < marks.end; t += 1 / FPS) {
    while (j + 1 < frames.length && frames[j + 1].ts <= t) j++
    list.push(`file '${join(dir, `${String(j).padStart(5, '0')}.jpg`)}'\nduration ${(1 / FPS).toFixed(6)}`)
  }
  list.push(list[list.length - 1].split('\n')[0]) // concat demuxer needs the last file repeated
  writeFileSync(join(RAW, 'frames.txt'), list.join('\n') + '\n')
  const rel = Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - marks.start).toFixed(2)]))
  writeFileSync(join(RAW, 'video-meta.json'), JSON.stringify({ rawFrames: frames.length, outFrames: list.length - 1, marks: rel, values, errors }, null, 2))
  console.log('video:', frames.length, 'raw frames,', rel, values, errors)
}

// ---------------------------------------------------------------- stills + real export
async function stills() {
  const browser = await chromium.launch()
  const { page, errors } = await open(browser)
  const shot = (n) => page.screenshot({ path: join(OUT, `hinge-step-${n}.jpg`), type: 'jpeg', quality: 82 })
  const c = await specimenCenter(page)
  await moveTo(page, c.x, c.y + 40, 500)
  await sleep(1400)
  await shot(1) // hover: Lift curve with measured dots, Live = hover
  await page.getByRole('tab', { name: /Drag/ }).click()
  cur = await specimenCenter(page)
  await sleep(500)
  const c2 = await specimenCenter(page)
  await moveTo(page, c2.x, c2.y, 300)
  await page.mouse.down()
  await moveTo(page, c2.x + 250, c2.y - 40, 600)
  await sleep(700)
  await shot(2) // drag held, rubber-banded, Live = drag, default release spring
  await page.mouse.up()
  await sleep(1800)
  await scrubTo(page, 'Stiffness', TUNED.stiffness, 400)
  await scrubTo(page, 'Damping', TUNED.damping, 400)
  await sleep(400)
  await dragRelease(page, 250, -40, 300, 2600)
  await moveTo(page, REST_CURSOR.x, REST_CURSOR.y, 300)
  await sleep(300)
  await shot(3) // retuned release spring (ζ ≈ 0.15) with the measured oscillation on the curve
  // Real export: open the bench, view the generated component, download the zip through the UI.
  await page.getByRole('button', { name: 'Export component' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.waitFor()
  await page.evaluate(() => document.getElementById('__capture_cursor')?.remove())
  const code = dialog.getByRole('textbox', { name: 'HingeCard.tsx' })
  await code.evaluate((el) => { el.scrollTop = 420 })
  await sleep(400)
  await shot(4) // export bench, generated HingeCard.tsx scrolled to the tuned drag spring
  const dl = page.waitForEvent('download')
  await dialog.getByRole('button', { name: /Download component/ }).click()
  const download = await dl
  const zip = join(RAW, download.suggestedFilename())
  await download.saveAs(zip)
  const unz = join(RAW, 'export')
  rmSync(unz, { recursive: true, force: true })
  execFileSync('unzip', ['-q', '-o', zip, '-d', unz])
  cpSync(join(unz, 'HingeCard/HingeCard.tsx'), join(OUT, 'hinge-export-sample.tsx'))
  writeFileSync(join(RAW, 'stills-meta.json'), JSON.stringify({ zip, files: execFileSync('unzip', ['-Z1', zip], { encoding: 'utf8' }).trim().split('\n'), errors }, null, 2))
  console.log('stills done; export', zip, errors)
  await browser.close()
}

// ---------------------------------------------------------------- encode loop + poster
function encode() {
  const mp4 = join(OUT, 'hinge-loop.mp4')
  execFileSync(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(RAW, 'frames.txt'),
    '-vf', `fps=${FPS},format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-profile:v', 'high',
    '-movflags', '+faststart', '-an', mp4])
  const meta = JSON.parse(readFileSync(join(RAW, 'video-meta.json'), 'utf8'))
  const t = (meta.marks.secondRelease - 2.6 + 0.2).toFixed(2) // mid-oscillation of the retuned throw
  for (const [file, args] of [['hinge-loop-poster.jpg', ['-q:v', '3']], ['hinge-loop-poster.webp', ['-c:v', 'libwebp', '-quality', '82']]]) {
    execFileSync(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', t, '-i', mp4, '-frames:v', '1', ...args, join(OUT, file)])
  }
  writeFileSync(join(RAW, 'poster-meta.json'), JSON.stringify({ poster_t: Number(t) }))
  console.log('encoded; poster at', t)
}

// ---------------------------------------------------------------- run the export in a clean fixture app
async function verify() {
  const dir = join(RAW, 'fixture')
  rmSync(dir, { recursive: true, force: true })
  cpSync(join(HINGE, 'export-fixture-template'), dir, { recursive: true })
  cpSync(join(RAW, 'export'), join(dir, 'src/generated'), { recursive: true })
  writeFileSync(join(dir, 'src/generated/cases.ts'),
    `import type { ComponentType } from 'react'\nimport { HingeCard } from './HingeCard/HingeCard'\n\n` +
    `export const CASES: Record<string, ComponentType<{ onPress?: () => void; type?: 'submit' }>> = { sample: HingeCard }\n`)
  const run = (args) => execFileSync('pnpm', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  const log = []
  log.push(['install', run(['install', '--prefer-offline', '--ignore-workspace', '--config.confirmModulesPurge=false']).trim().split('\n').slice(-3).join(' | ')])
  log.push(['typecheck', run(['run', 'typecheck']).trim().split('\n').slice(-1)[0]])
  log.push(['build', run(['run', 'build']).trim().split('\n').slice(-2).join(' | ')])
  const port = 5471
  const server = spawn('pnpm', ['exec', 'vite', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: dir, stdio: 'ignore' })
  const result = { log }
  try {
    let html = ''
    for (let i = 0; i < 80 && !html.includes('Hinge export fixture'); i++) {
      try { html = await (await fetch(`http://127.0.0.1:${port}/`)).text() } catch { await sleep(250) }
    }
    result.servedTitle = html.includes('<title>Hinge export fixture</title>')
    const browser = await chromium.launch()
    const page = await browser.newPage({ viewport: VIEWPORT })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(`http://127.0.0.1:${port}/?case=sample`)
    const el = page.locator('#root form > [class^="hinge-"]')
    await el.waitFor()
    const tf = () => el.evaluate((n) => { const m = new DOMMatrix(getComputedStyle(n).transform); return { x: +m.m41.toFixed(2), y: +m.m42.toFixed(2), scale: +Math.hypot(m.a, m.b).toFixed(3) } })
    await page.mouse.move(5, 5)
    const b = await el.boundingBox()
    const c = { x: b.x + b.width / 2, y: b.y + b.height / 2 }
    result.rest = await tf()
    await page.mouse.move(c.x, c.y)
    await sleep(1400)
    result.hover = await tf()
    await page.mouse.down()
    await page.mouse.move(c.x + 200, c.y, { steps: 10 })
    await sleep(700)
    result.held = await tf()
    // Sample the release: the retuned spring (k 320, c 6, m 1.2) should overshoot past 0 and come back.
    const sampler = el.evaluate((n) => new Promise((r) => { const out = []; const t0 = performance.now(); const tick = () => { out.push(new DOMMatrix(getComputedStyle(n).transform).m41); performance.now() - t0 < 2500 ? requestAnimationFrame(tick) : r(out) }; requestAnimationFrame(tick) }))
    await page.mouse.up()
    const rel = await sampler
    result.release = { minX: +Math.min(...rel).toFixed(2), zeroCrossings: rel.reduce((n, v, i) => n + (i && Math.sign(v) !== Math.sign(rel[i - 1]) && Math.abs(v - rel[i - 1]) > 0.01 ? 1 : 0), 0), final: +rel[rel.length - 1].toFixed(2), samples: rel.length }
    await page.mouse.move(5, 5)
    await page.mouse.click(c.x, c.y)
    await sleep(300)
    result.pressCount = await page.getByTestId('press-count').innerText()
    result.errors = errors
    await page.screenshot({ path: join(RAW, 'fixture-hover-check.png') })
    await browser.close()
  } finally { server.kill() }
  writeFileSync(join(RAW, 'verify.json'), JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result, null, 2))
}

// ---------------------------------------------------------------- manifest
function manifest() {
  const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex')
  const commit = execFileSync('git', ['-C', HINGE, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  const vmeta = JSON.parse(readFileSync(join(RAW, 'video-meta.json'), 'utf8'))
  const verified = existsSync(join(RAW, 'verify.json')) ? JSON.parse(readFileSync(join(RAW, 'verify.json'), 'utf8')) : null
  const date = new Date(statSync(join(OUT, 'hinge-loop.mp4')).mtime).toISOString()
  const base = {
    source_url: URL_, source_repo: 'https://github.com/Mariaareadne1/hinge',
    source_commit: commit,
    source_commit_note: 'Local HEAD equals origin/main (gh api repos/Mariaareadne1/hinge/commits/main); the GitHub Actions "Test and deploy" run 40276253868 for this SHA completed build, e2e and deploy successfully, and it is the latest run on main. Live asset hashes were not compared to a local build.',
    capture_date: date, viewport: `${VIEWPORT.width}x${VIEWPORT.height}`, device_scale: 1, crop: 'none (full viewport)',
  }
  const probe = (f) => JSON.parse(execFileSync(FFPROBE, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', f], { encoding: 'utf8' }))
  const cursorNote = 'Capture-only cursor marker injected via addInitScript (18 px dark ring, white border, pointer-events:none, shrinks while the button is down); it follows real Playwright pointer events. Not part of the app.'
  const entries = []
  const add = (file, kind, scenario, steps, extra = {}) => {
    const p = join(OUT, file)
    const e = { file, kind, scenario, steps, ...base, bytes: statSync(p).size, sha256: sha(p), ...extra }
    if (kind === 'video' || kind === 'image') {
      const s = probe(p).streams
      const v = s.find((x) => x.codec_type === 'video')
      e.dimensions = `${v.width}x${v.height}`
      if (kind === 'video') Object.assign(e, { duration_s: +Number(probe(p).format.duration).toFixed(2), codec: `${v.codec_name} (${v.profile})`, pix_fmt: v.pix_fmt, fps: FPS, has_audio: s.some((x) => x.codec_type === 'audio') })
      else Object.assign(e, { duration_s: null, codec: v.codec_name, pix_fmt: v.pix_fmt, has_audio: false })
    } else Object.assign(e, { dimensions: null, duration_s: null, codec: null, pix_fmt: null, has_audio: false })
    entries.push(e)
  }
  const loopSteps = ['Hover the Porcelain card (Lift recipe): spring rise, measured dots drawn on the model curve',
    'Select the Drag state on the rail', 'Drag the card right ~250 px, hold, release: default release spring (k 180, c 16, m 1.2, ζ≈0.54) settles home with little overshoot',
    `Scrub Stiffness to ${TUNED.stiffness} and Damping to ${TUNED.damping} in the instrument; the model curve reshapes`,
    'Same drag and release: the retuned spring (ζ≈0.15) visibly oscillates home', 'Return to the Hover tab and the start cursor position (loop seam)']
  add('hinge-loop.mp4', 'video', 'Tune the drag/release spring on the live stage and see the response change', loopSteps, {
    capture_method: `Playwright 1.64 headless Chromium + CDP Page.startScreencast (jpeg q90), resampled to constant ${FPS} fps from metadata.timestamp, encoded with ffmpeg-static libx264 CRF 24 preset slow +faststart, no audio`,
    notes: `${cursorNote} Raw screencast frames: ${vmeta.rawFrames}; event marks (s): ${JSON.stringify(vmeta.marks)}. Final instrument values ${JSON.stringify(vmeta.values)}. Page errors: ${vmeta.errors.length}.` })
  const pm = JSON.parse(readFileSync(join(RAW, 'poster-meta.json'), 'utf8'))
  for (const f of ['hinge-loop-poster.jpg', 'hinge-loop-poster.webp'])
    add(f, 'image', 'Poster frame of hinge-loop.mp4', [`Frame at t=${pm.poster_t}s: the retuned card mid-oscillation after release, drag curve ζ≈0.15`], {
      capture_method: f.endsWith('jpg') ? 'ffmpeg frame extract from hinge-loop.mp4, mjpeg -q:v 3 (≈ quality 82-85)' : 'ffmpeg frame extract from hinge-loop.mp4, libwebp -quality 82', notes: cursorNote })
  const stillDesc = [
    ['Hover state', 'Pointer on the card; Live = hover; hover curve with measured citron dots'],
    ['Drag held', 'Drag tab selected; card dragged ~250 px right, rubber-banded and lifted; Live = drag; default release spring'],
    ['Retuned release spring', `Drag spring at stiffness ${TUNED.stiffness}, damping ${TUNED.damping}; curve shows strong overshoot; card settled after a throw`],
    ['Export bench', 'Generated HingeCard.tsx with the tuned BEHAVIOR (drag spring stiffness 320 / damping 6) in the real export bench'],
  ]
  stillDesc.forEach(([scenario, step], i) => add(`hinge-step-${i + 1}.jpg`, 'image', scenario, [step], {
    capture_method: 'Playwright page.screenshot, jpeg quality 82, separate pass replaying the same input', notes: i === 3 ? 'Cursor marker removed before this shot; code view scrolled to the drag spring.' : cursorNote }))
  add('hinge-export-sample.tsx', 'code', 'Real export: HingeCard.tsx from the zip downloaded via "Download component (.zip)" in the export bench after the stills pass tuning', ['Lift card, drag spring retuned to k 320 / c 6'], {
    capture_method: 'Playwright download of HingeCard.zip from the live app; HingeCard/HingeCard.tsx extracted verbatim (the zip also holds hinge-card.css, hinge/spring.ts, hinge/runtime.ts, hinge/useHinge.ts, hinge.config.json, README.md; kept in media-raw/hinge)',
    notes: verified ? `Fixture verification: ${JSON.stringify(verified)}` : 'Not verified in a fixture.' })
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(entries, null, 2) + '\n')
  console.log('manifest:', entries.length, 'entries')
}

const step = process.argv[2] ?? 'all'
const steps = { video, stills, encode, verify, manifest }
if (step === 'all') { await video(); await stills(); encode(); await verify(); manifest() }
else await steps[step]()
