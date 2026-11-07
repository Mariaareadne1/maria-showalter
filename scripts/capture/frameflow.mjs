#!/usr/bin/env node
// FrameFlow portfolio capture. Read-only with respect to the FrameFlow repo: it only runs the
// already-built app (out/) and writes into media-raw/frameflow and assets/media/frameflow.
//
//   node scripts/capture/frameflow.mjs source   # render tests/demo-app frame-by-frame + cursor.json
//   node scripts/capture/frameflow.mjs studio   # drive the FrameFlow studio, capture frames, export MP4
//   node scripts/capture/frameflow.mjs media    # assemble loop/poster/stills/export copy (ffmpeg)
//   node scripts/capture/frameflow.mjs manifest # write manifest.json
//
// Every phase saves its output to disk so a sleep/interruption only loses the current phase.
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const FF_ROOT = join(homedir(), 'Developer/FrameFlow')
const BUILD = join(homedir(), 'Developer/design-engineering-build-2026')
const RAW = join(BUILD, 'media-raw/frameflow')
const OUT = join(BUILD, 'portfolio-v1/assets/media/frameflow')
const FFMPEG = join(FF_ROOT, 'node_modules/ffmpeg-static/ffmpeg')
const FFPROBE = join(FF_ROOT, 'node_modules/ffprobe-static/bin/darwin/arm64/ffprobe')
const req = createRequire(join(FF_ROOT, 'package.json'))
const { _electron: electron } = req('playwright')

const SRC_DIR = join(RAW, 'source')            // demo-page recording + cursor.json
const STUDIO_FRAMES = join(RAW, 'studio-frames') // CDP screencast frames of the studio
const WORK = join(RAW, 'work')                  // library/userData for the app run
for (const d of [RAW, OUT, SRC_DIR, WORK]) mkdirSync(d, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ff = (args) => execFileSync(FFMPEG, ['-v', 'error', '-y', ...args], { stdio: ['ignore', 'inherit', 'inherit'] })
const probe = (file) => JSON.parse(execFileSync(FFPROBE, ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', '-count_frames', file]).toString())

// ---------------------------------------------------------------------------------------------
// Phase 1: source. The repo's own demo page (tests/demo-app, the page the author's real
// ScreenCaptureKit capture recorded) rendered in an Electron window, one screenshot per 1/30 s
// of virtual time. Pointer input is dispatched to the page through CDP (no OS mouse movement)
// and logged as a FrameFlow cursor.json (normalized samples + clicks), the helper's format.
// ---------------------------------------------------------------------------------------------
const SRC_FPS = 30
const SRC_W = 1200
const SRC_H = 750

async function phaseSource() {
  const framesDir = join(SRC_DIR, 'frames')
  rmSync(framesDir, { recursive: true, force: true })
  mkdirSync(framesDir, { recursive: true })
  const app = await electron.launch({ args: ['--force-device-scale-factor=2', join(FF_ROOT, 'tests/demo-app/main.cjs')], cwd: FF_ROOT })
  try {
    const page = await app.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await app.evaluate(({ BrowserWindow }, [w, h]) => BrowserWindow.getAllWindows()[0].setContentSize(w, h), [SRC_W, SRC_H])
    await sleep(800)
    console.log('dpr', await page.evaluate(() => [devicePixelRatio, innerWidth, innerHeight]))
    const box = async (sel) => page.locator(sel).first().evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, l: r.x, w: r.width } })
    const menuBtn = await box('#menuBtn')
    const name = await box('#name')
    const create = await box('#create')
    const count = await box('#count')
    const reports = await box('nav a:nth-child(2)')
    // Scripted demo (targets in CSS px; t = arrival time in seconds).
    // Three groups of interaction, spaced so Calm's clustering yields three separate Moments.
    const steps = [
      { t: 0, x: SRC_W * 0.55, y: SRC_H * 0.62 },
      { t: 1.3, x: menuBtn.x, y: menuBtn.y, click: true },             // open File menu
      { t: 2.6, x: menuBtn.x, y: menuBtn.y + 2, click: true },         // close it
      { t: 6.6, x: name.l + 40, y: name.y, click: true, type: 'Launch plan' }, // focus + type
      { t: 8.6, x: create.x, y: create.y, click: true },               // Create
      { t: 9.3, x: create.x + 2, y: create.y + 1, click: true },       // Create again
      { t: 13.6, x: reports.x, y: reports.y, click: true },            // nav
      { t: 15.6, x: count.x + 120, y: count.y + 60 },
    ]
    const duration = 16.5
    const travel = 0.7
    const pos = (t) => {
      let prev = steps[0]
      for (const s of steps) {
        if (t < s.t - travel) return { x: prev.x, y: prev.y }
        if (t < s.t) {
          const k = (t - (s.t - travel)) / travel
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
          return { x: prev.x + (s.x - prev.x) * e, y: prev.y + (s.y - prev.y) * e }
        }
        prev = s
      }
      return { x: prev.x, y: prev.y }
    }
    const samples = []
    const clicks = []
    const pendingClicks = steps.filter((s) => s.click).map((s) => ({ ...s, at: s.t + 0.12 }))
    let typing = null
    const total = Math.round(duration * SRC_FPS)
    for (let i = 0; i < total; i++) {
      const t = i / SRC_FPS
      const p = pos(t)
      await page.mouse.move(p.x, p.y)
      while (pendingClicks.length && pendingClicks[0].at <= t) {
        const c = pendingClicks.shift()
        await page.mouse.down(); await page.mouse.up()
        clicks.push({ t, x: p.x / SRC_W, y: p.y / SRC_H, button: 'left' })
        if (c.type) typing = { text: c.type, start: t + 0.25, done: 0 }
      }
      if (typing) {
        const want = Math.min(typing.text.length, Math.floor((t - typing.start) / 0.09) + 1)
        while (typing.done < want && t >= typing.start) await page.keyboard.type(typing.text[typing.done++])
        if (typing.done >= typing.text.length) typing = null
      }
      // Sample at 60 Hz like the helper (two samples per 30 fps frame).
      for (const dt of [0, 1 / 60]) { const q = pos(t + dt); samples.push({ t: t + dt, x: q.x / SRC_W, y: q.y / SRC_H }) }
      await page.screenshot({ path: join(framesDir, `f${String(i).padStart(5, '0')}.png`), scale: 'device' })
      if (i % 60 === 0) console.log(`source frame ${i}/${total}`)
    }
    writeFileSync(join(SRC_DIR, 'cursor.json'), JSON.stringify({ version: 1, samples, clicks }))
    console.log('clicks', clicks.map((c) => c.t.toFixed(2)).join(' '))
  } finally {
    await app.close()
  }
  ff(['-framerate', String(SRC_FPS), '-i', join(framesDir, 'f%05d.png'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(SRC_DIR, 'recording.mp4')])
  const p = probe(join(SRC_DIR, 'recording.mp4')).streams[0]
  console.log('recording.mp4', p.width, p.height, p.nb_read_frames, p.duration)
}

// ---------------------------------------------------------------------------------------------
// Phase 2: studio. Launch the built app exactly like tests/e2e/helpers.ts `launch()` (test env,
// isolated userData/library), write a recorded-style project with the repo's own createProject
// (as `openDemoProject` does), open it, and drive the journey while a CDP screencast records.
// ---------------------------------------------------------------------------------------------
async function loadModel() {
  const esbuild = req('esbuild')
  const outfile = join(WORK, 'model.mjs')
  await esbuild.build({
    stdin: { contents: "export { createProject } from './src/shared/projectModel.ts'; export { parseCursorTrack } from './src/shared/engine/cursor.ts'", resolveDir: FF_ROOT, loader: 'ts' },
    bundle: true, format: 'esm', platform: 'node', outfile, logLevel: 'error',
  })
  return import(pathToFileURL(outfile).href + `?t=${Date.now()}`)
}

class Screencast {
  constructor(page, dir) { this.page = page; this.dir = dir; this.frames = []; this.marks = [] }
  async start() {
    rmSync(this.dir, { recursive: true, force: true })
    mkdirSync(this.dir, { recursive: true })
    this.cdp = await this.page.context().newCDPSession(this.page)
    this.cdp.on('Page.screencastFrame', async (f) => {
      const n = this.frames.length
      const file = `s${String(n).padStart(5, '0')}.jpg`
      writeFileSync(join(this.dir, file), Buffer.from(f.data, 'base64'))
      this.frames.push({ file, ts: f.metadata.timestamp })
      try { await this.cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }) } catch {}
    })
    await this.cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, everyNthFrame: 1 })
    this.t0 = Date.now() / 1000
  }
  /** A full screenshot appended to the frame list (screencast can stall once the page is idle). */
  async still() {
    const file = `s${String(this.frames.length).padStart(5, '0')}.jpg`
    const ts = Date.now() / 1000
    await this.page.screenshot({ path: join(this.dir, file), type: 'jpeg', quality: 95 })
    this.frames.push({ file, ts, still: true })
  }
  mark(name) { this.marks.push({ name, ts: Date.now() / 1000 }); console.log('mark', name); this.flush() }
  flush() { writeFileSync(join(this.dir, 'index.json'), JSON.stringify({ frames: this.frames, marks: this.marks, t0: this.t0 }, null, 1)) }
  async stop() { await this.cdp.send('Page.stopScreencast'); await sleep(200); this.flush() }
}

/** A capture-only pointer marker (pointer-events: none), because CDP input has no visible cursor. */
async function installMarker(page) {
  await page.evaluate(() => {
    if (document.getElementById('__capture_pointer')) return
    const m = document.createElement('div')
    m.id = '__capture_pointer'
    m.setAttribute('aria-hidden', 'true')
    m.style.cssText = 'position:fixed;left:0;top:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:rgba(20,20,30,.18);border:2px solid rgba(20,20,30,.55);pointer-events:none;z-index:2147483647;transition:transform .12s ease;transform:translate(-100px,-100px)'
    document.body.appendChild(m)
    window.addEventListener('mousemove', (e) => { m.style.transform = `translate(${e.clientX}px,${e.clientY}px)` }, true)
    window.addEventListener('mousedown', () => { m.style.background = 'rgba(20,20,30,.38)' }, true)
    window.addEventListener('mouseup', () => { m.style.background = 'rgba(20,20,30,.18)' }, true)
  })
}

let mouseAt = { x: 720, y: 450 }
async function glide(page, x, y, ms = 650) {
  const steps = Math.max(6, Math.round(ms / 33))
  const from = mouseAt
  for (let i = 1; i <= steps; i++) {
    const k = i / steps
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
    await page.mouse.move(from.x + (x - from.x) * e, from.y + (y - from.y) * e)
    await sleep(ms / steps / 2)
  }
  mouseAt = { x, y }
}
async function center(loc) { const b = await loc.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, b } }
async function clickOn(page, loc, ms) { const c = await center(loc); await glide(page, c.x, c.y, ms); await sleep(120); await page.mouse.down(); await sleep(70); await page.mouse.up(); return c }

async function phaseStudio() {
  if (!existsSync(join(SRC_DIR, 'recording.mp4'))) throw new Error('run the source phase first')
  const { createProject, parseCursorTrack } = await loadModel()
  const run = join(WORK, `run-${Date.now()}`)
  const library = join(run, 'library')
  const folder = join(library, 'Acme demo')
  mkdirSync(folder, { recursive: true })
  const video = join(folder, 'recording.mp4')
  const cursorPath = join(folder, 'cursor.json')
  copyFileSync(join(SRC_DIR, 'recording.mp4'), video)
  copyFileSync(join(SRC_DIR, 'cursor.json'), cursorPath)
  const info = probe(video)
  const vs = info.streams.find((s) => s.codec_type === 'video')
  const track = parseCursorTrack(JSON.parse(readFileSync(cursorPath, 'utf8')))
  const project = createProject({
    name: 'Acme dashboard demo',
    media: { path: video, width: vs.width, height: vs.height, duration: Number(info.format.duration), hasAudio: false, cursorPath, cursorEmbedded: false },
    cursorTrack: track, style: 'editorial', camera: 'calm', cursorEffect: 'halo', aspectRatio: '16:9',
  })
  console.log('auto zooms', project.zooms.map((z) => `${z.start.toFixed(2)}-${z.end.toFixed(2)}@${z.scale}`).join(' '))
  const file = join(folder, 'Acme dashboard demo.frameflow')
  writeFileSync(file, JSON.stringify(project))
  const exportPath = join(RAW, 'frameflow-export-original.mp4')
  rmSync(exportPath, { force: true })

  const env = { ...process.env, FRAMEFLOW_TEST: '1', FRAMEFLOW_USER_DATA: join(run, 'userData'), FRAMEFLOW_LIBRARY: library }
  delete env.ELECTRON_RENDERER_URL
  const app = await electron.launch({ args: ['--force-device-scale-factor=2', join(FF_ROOT, 'out/main/index.js')], env, cwd: FF_ROOT })
  const cast = { stop: async () => {} }
  try {
    const page = await app.firstWindow()
    page.on('pageerror', (e) => console.error('[renderer error]', e))
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => localStorage.setItem('frameflow.prefs.v2', JSON.stringify({ style: 'editorial', camera: 'calm', cursor: 'halo', countdown: 0, microphone: false })))
    await page.reload()
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setContentSize(1440, 900))
    await sleep(600)
    console.log('studio dpr/size', await page.evaluate(() => [devicePixelRatio, innerWidth, innerHeight]))
    await app.evaluate(({ dialog }, p) => { dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [p] }) }, file)
    await app.evaluate(({ dialog }, p) => { dialog.showSaveDialog = async () => ({ canceled: false, filePath: p }) }, exportPath)
    await page.getByTestId('open-project-file').click()
    await page.getByTestId('studio').waitFor()
    // Let Moment thumbnails decode before recording starts.
    await page.locator('[data-testid^="moment-card-"] [data-testid="moment-thumb"]').first().waitFor()
    await sleep(2500)
    await installMarker(page)
    await page.mouse.move(mouseAt.x, mouseAt.y)

    const sc = new Screencast(page, STUDIO_FRAMES)
    Object.assign(cast, { stop: () => sc.stop() })
    await sc.start()
    await sleep(300)
    sc.mark('studio')
    // 1. Studio with automatic Moments: play a couple of seconds so the auto camera moves.
    await sleep(700)
    await clickOn(page, page.getByTestId('play-toggle'), 600)
    await sleep(3300)
    await page.mouse.down(); await sleep(70); await page.mouse.up() // pause (same button)
    await sleep(500)
    sc.mark('select-moment')
    // 2. Select Moment 02 (the typing Moment), rename it and push its zoom.
    const cards = page.locator('[data-testid^="moment-card-"]')
    const n = await cards.count()
    console.log('moment cards', n)
    await clickOn(page, cards.nth(Math.min(1, n - 1)), 700)
    await page.getByTestId('moment-inspector').waitFor()
    await sleep(700)
    const nameBox = page.getByTestId('moment-name')
    await clickOn(page, nameBox, 500)
    await page.keyboard.press('Meta+A')
    await page.keyboard.type('Name the project', { delay: 55 })
    await page.keyboard.press('Enter')
    await sleep(400)
    sc.mark('zoom')
    const slider = page.getByRole('slider', { name: 'Zoom' })
    const s = await center(slider)
    const min = Number(await slider.getAttribute('min') ?? 1), max = Number(await slider.getAttribute('max') ?? 4)
    const cur = Number(await slider.inputValue())
    const xFor = (v) => s.b.x + ((v - min) / (max - min)) * s.b.width
    await glide(page, xFor(cur), s.y, 500)
    await page.mouse.down()
    await glide(page, xFor(2.6), s.y, 800)
    await page.mouse.up()
    await sleep(900)
    console.log('zoom now', await slider.inputValue())
    // 3. Design: switch the art direction.
    sc.mark('design')
    await clickOn(page, page.getByTestId('dock-design'), 650)
    await page.getByTestId('design-panel').waitFor()
    await sleep(600)
    await clickOn(page, page.getByTestId('style-aura'), 600)
    await sleep(1100)
    await clickOn(page, page.getByTestId('style-midnight'), 450)
    await sleep(1100)
    // 4. Export MP4 1080p 30 fps.
    sc.mark('export-sheet')
    await clickOn(page, page.getByTestId('open-export'), 700)
    await page.getByTestId('export-start').waitFor()
    await sleep(700)
    await clickOn(page, page.getByRole('radio', { name: '1080p' }), 450)
    await sleep(250)
    await clickOn(page, page.getByRole('radio', { name: '30 fps' }), 450)
    await sleep(500)
    await clickOn(page, page.getByTestId('export-start'), 600)
    sc.mark('export-progress')
    await page.getByTestId('export-done').waitFor({ timeout: 170_000 })
    sc.mark('export-done')
    for (let i = 0; i < 4; i++) { await sleep(350); await sc.still() }
    sc.mark('end')
    await sc.stop()
    await page.screenshot({ path: join(RAW, 'studio-export-done-retina.png') })
    writeFileSync(join(RAW, 'studio-run.json'), JSON.stringify({ run, project: file, exportPath, zooms: project.zooms }, null, 1))
  } finally {
    await cast.stop().catch(() => {})
    await app.close()
  }
  console.log('export', exportPath, existsSync(exportPath))
}

// ---------------------------------------------------------------------------------------------
// Phase 3: media. Cut the studio capture into the loop (idle waits removed, UI at 1.2x), append
// a short slice of the real exported MP4, and write poster, stills and the web export copy.
// ---------------------------------------------------------------------------------------------
const LOOP_W = 1600, LOOP_H = 1000, LOOP_FPS = 30, UI_SPEED = 1.2
const EXPORT_SLICE = [6.9, 9.6] // export seconds appended to the loop (zoomed Moment 02 on Midnight)

function studioIndex() {
  const j = JSON.parse(readFileSync(join(STUDIO_FRAMES, 'index.json'), 'utf8'))
  const t0 = j.frames[0].ts
  const frames = j.frames.map((f) => ({ ...f, t: f.ts - t0 }))
  const marks = Object.fromEntries(j.marks.map((m) => [m.name, m.ts - t0]))
  return { frames, marks }
}
function frameAtT(frames, t) { let best = frames[0]; for (const f of frames) if (f.t <= t + 1e-6) best = f; return best }

function loopSegments(m) {
  return [
    [m.studio, m['select-moment'] - 0.4],          // studio with automatic Moments, playback
    [m['select-moment'] - 0.4, m.design],          // select Moment 02, rename, drag zoom
    [m.design, m['export-sheet']],                 // Design: Aura, then Midnight
    [m['export-sheet'], m['export-progress'] + 1.3], // export sheet: 1080p, 30 fps, Export
    [m['export-done'] - 1.0, m.end],               // end of progress, "Ready to share"
  ]
}

async function phaseMedia() {
  const { frames, marks } = studioIndex()
  const segs = loopSegments(marks)
  const tmp = join(RAW, 'assemble'); rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true })
  // Concat list: every captured frame inside the kept ranges, held until the next one.
  const lines = []
  let uiDur = 0
  for (const [a, b] of segs) {
    const inSeg = frames.filter((f) => f.t > a && f.t < b)
    const list = [frameAtT(frames, a), ...inSeg]
    list.forEach((f, i) => {
      const start = i === 0 ? a : f.t
      const end = i + 1 < list.length ? list[i + 1].t : b
      const d = (end - start) / UI_SPEED
      if (d <= 0) return
      lines.push(`file '${join(STUDIO_FRAMES, f.file)}'`, `duration ${d.toFixed(5)}`)
      uiDur += d
    })
  }
  lines.push(lines[lines.length - 2]) // concat demuxer needs the last file repeated
  writeFileSync(join(tmp, 'ui.txt'), lines.join('\n') + '\n')
  const exportOrig = join(RAW, 'frameflow-export-original.mp4')
  const ui = join(tmp, 'ui.mp4'), slice = join(tmp, 'slice.mp4')
  ff(['-f', 'concat', '-safe', '0', '-i', join(tmp, 'ui.txt'), '-vf', `scale=${LOOP_W}:${LOOP_H}:flags=lanczos,fps=${LOOP_FPS},format=yuv420p`, '-c:v', 'libx264', '-crf', '12', '-preset', 'medium', ui])
  // The exported MP4 itself, fit into the 16:10 frame with Midnight-dark bars (1600x900 + 50px).
  ff(['-ss', String(EXPORT_SLICE[0]), '-to', String(EXPORT_SLICE[1]), '-i', exportOrig, '-vf', `scale=${LOOP_W}:900:flags=lanczos,pad=${LOOP_W}:${LOOP_H}:0:50:color=0x0e0e14,fps=${LOOP_FPS},format=yuv420p`, '-an', '-c:v', 'libx264', '-crf', '12', slice])
  const loop = join(OUT, 'frameflow-loop.mp4')
  const enc = (crf) => ff(['-i', ui, '-i', slice, '-filter_complex', '[0:v][1:v]concat=n=2:v=1:a=0[v]', '-map', '[v]', '-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', String(LOOP_FPS), loop])
  let crf = 23
  enc(crf)
  while (statSync(loop).size > 2.9e6 && crf < 26) enc(++crf)
  console.log('loop', (uiDur + EXPORT_SLICE[1] - EXPORT_SLICE[0]).toFixed(2), 's crf', crf, statSync(loop).size)
  writeFileSync(join(RAW, 'loop-encode.json'), JSON.stringify({ crf, segs, uiSpeed: UI_SPEED, exportSlice: EXPORT_SLICE }, null, 1))

  // Poster = the loop's first frame (no flash when the video starts).
  ff(['-i', loop, '-frames:v', '1', '-q:v', '3', join(OUT, 'frameflow-loop-poster.jpg')])
  ff(['-i', loop, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '82', join(OUT, 'frameflow-loop-poster.webp')])

  // Stills from the full-resolution (2880x1800) capture frames, downscaled to 1600 wide.
  const still = (src, name) => ff(['-i', src, '-vf', 'scale=1600:-2:flags=lanczos', '-q:v', '2', join(OUT, name)])
  const st = (t) => join(STUDIO_FRAMES, frameAtT(frames, t).file)
  still(st(marks['select-moment'] - 1.2), 'frameflow-step-1.jpg')   // studio, auto Moments, zoomed preview
  still(st(marks.design - 0.3), 'frameflow-step-2.jpg')             // Moment inspector after edit
  still(st(marks['export-sheet'] - 0.3), 'frameflow-step-3.jpg')    // Design: Midnight
  still(st(marks['export-progress'] - 0.5), 'frameflow-step-4.jpg') // export sheet configured
  ff(['-ss', '8.3', '-i', exportOrig, '-frames:v', '1', '-vf', 'scale=1600:-2:flags=lanczos', '-q:v', '2', join(OUT, 'frameflow-step-5.jpg')]) // frame of the exported MP4
  still(join(STUDIO_FRAMES, frames[frames.length - 1].file), join('..', '..', '..', '..', 'media-raw', 'frameflow', 'studio-ready-to-share.jpg')) // raw only

  // Web copy of the export: 1600 wide, no audio (the export has no audio stream).
  const web = join(OUT, 'frameflow-export.mp4')
  let wcrf = 23
  const encWeb = () => ff(['-i', exportOrig, '-vf', 'scale=1600:-2:flags=lanczos', '-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', String(wcrf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', web])
  encWeb()
  while (statSync(web).size > 2.9e6 && wcrf < 28) { wcrf++; encWeb() }
  console.log('web export crf', wcrf, statSync(web).size)
}
// ---------------------------------------------------------------------------------------------
// Phase 4: manifest.
// ---------------------------------------------------------------------------------------------
async function phaseManifest() {
  const commit = execFileSync('git', ['-C', FF_ROOT, 'rev-parse', 'HEAD']).toString().trim()
  const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex')
  const enc = JSON.parse(readFileSync(join(RAW, 'loop-encode.json'), 'utf8'))
  const date = new Date(statSync(join(STUDIO_FRAMES, 'index.json')).mtimeMs).toISOString().slice(0, 10)
  const SOURCE = 'Constructed demo source, NOT a ScreenCaptureKit capture and NOT FRAMEFLOW_CAPTURE_SYNTHETIC: the repo\'s own demo page tests/demo-app/index.html ("Acme Dashboard", the page the author\'s real capture docs/media/sample-real-capture-demo-page.mp4 shows) rendered in an Electron window at 2x, one screenshot per 1/30 s of virtual time (2400x1500, 16.5 s), with scripted pointer input sent through CDP and logged as a FrameFlow cursor.json (60 Hz samples + 6 clicks). Project built with the repo\'s createProject() exactly like tests/e2e/helpers.ts openDemoProject (recorded-style project with cursor telemetry, Calm feel, Editorial, Halo). The real sample capture was not usable as a source: it is already a composed export and has no cursor.json.'
  const common = { source: SOURCE, source_repo: 'github.com/Mariaareadne1/FrameFlow (local ~/Developer/FrameFlow, main)', source_commit: commit, capture_date: date, app_build: 'electron-vite production build in out/ (npm run build at ' + commit.slice(0, 7) + ', unpackaged), launched by Playwright _electron with FRAMEFLOW_TEST=1 and isolated userData/library like tests/e2e/helpers.ts launch()' }
  const vinfo = (f) => {
    const p = probe(f)
    const v = p.streams.find((s) => s.codec_type === 'video')
    return { dimensions: `${v.width}x${v.height}`, duration_s: Number(Number(p.format.duration).toFixed(3)), codec: `${v.codec_name} ${v.profile}`, pix_fmt: v.pix_fmt, fps: v.r_frame_rate, frames: Number(v.nb_read_frames), has_audio: p.streams.some((s) => s.codec_type === 'audio') }
  }
  const iinfo = (f) => { const p = probe(f).streams[0]; return { dimensions: `${p.width}x${p.height}`, duration_s: null, codec: p.codec_name, pix_fmt: p.pix_fmt, has_audio: false } }
  const castMethod = 'CDP Page.startScreencast (JPEG q95, 2880x1800 device pixels of the 1440x900 window at forced device-scale-factor 2) on the FrameFlow main window, plus page.screenshot stills after export finished; UI driven by Playwright CDP mouse/keyboard (the OS mouse was never moved)'
  const marker = 'A capture-only pointer marker (22 px grey ring, pointer-events:none, injected into the page DOM only during capture) shows where the CDP pointer is, because CDP input has no OS cursor. It is not part of FrameFlow. The arrow cursor with the halo INSIDE the preview/export is FrameFlow\'s own rendered cursor from cursor.json.'
  const entries = [
    { file: 'frameflow-loop.mp4', kind: 'loop-video', scenario: 'Studio journey: project with automatic Moments -> play -> select Moment 02, rename, drag Zoom 1.5x->2.6x -> Design: Aura then Midnight -> Export sheet (MP4, 1080p, 30 fps) -> export progress -> Ready to share -> 2.7 s of the actual exported MP4', steps: ['studio with 3 automatic Moments, playback with auto camera', 'select + rename Moment 02, drag Zoom to 2.6x', 'Design: Aura, then Midnight art direction', 'Export sheet: 1080p, 30 fps, Export video', 'export progress -> Ready to share (1920x1080, 0:16.5, rendered in ~5 s)', 'slice 6.9-9.6 s of the exported MP4'], capture_method: castMethod + '. Assembled with ffmpeg: kept ranges of the capture timeline (idle waits and the middle ~3 s of the export progress cut), UI played back at ' + enc.uiSpeed + 'x capture speed, then the export slice appended (scaled to 1600x900, padded to 16:10 with #0e0e14 bars).', crop: 'full app window content (no OS chrome), 2880x1800 -> 1600x1000 lanczos; export slice letterboxed', notes: marker + ' Segment ranges (s of capture): ' + JSON.stringify(enc.segs.map((x) => x.map((n) => Number(n.toFixed(2))))) + '. CRF ' + enc.crf + ', no audio track.' },
    { file: 'frameflow-loop-poster.jpg', kind: 'poster', scenario: 'first frame of the loop', steps: ['studio with automatic Moments'], capture_method: 'ffmpeg first frame of frameflow-loop.mp4, JPEG q~82 (-q:v 3)', crop: 'same as loop', notes: '' },
    { file: 'frameflow-loop-poster.webp', kind: 'poster', scenario: 'first frame of the loop', steps: ['studio with automatic Moments'], capture_method: 'ffmpeg first frame of frameflow-loop.mp4, libwebp quality 82', crop: 'same as loop', notes: '' },
    { file: 'frameflow-step-1.jpg', kind: 'still', scenario: 'Studio with automatic Moments while playing (Moment 01 camera move, File menu open in the source)', steps: ['studio'], capture_method: castMethod, crop: 'full window, 2880x1800 -> 1600 wide', notes: marker },
    { file: 'frameflow-step-2.jpg', kind: 'still', scenario: 'Moment inspector after editing Moment 02 (renamed "Name the project", Zoom 2.60x, Edited badge)', steps: ['edit Moment'], capture_method: castMethod, crop: 'full window, 2880x1800 -> 1600 wide', notes: marker },
    { file: 'frameflow-step-3.jpg', kind: 'still', scenario: 'Design drawer with Midnight art direction applied; preview re-rendered', steps: ['change style'], capture_method: castMethod, crop: 'full window, 2880x1800 -> 1600 wide', notes: marker },
    { file: 'frameflow-step-4.jpg', kind: 'still', scenario: 'Export sheet configured: Video (MP4), 16:9, 1080p, 30 fps, High', steps: ['export panel'], capture_method: castMethod, crop: 'full window, 2880x1800 -> 1600 wide', notes: marker },
    { file: 'frameflow-step-5.jpg', kind: 'still', scenario: 'Frame at 8.3 s of the real exported MP4: Moment 02 at 2.6x on Midnight, FrameFlow vector cursor with Halo, typed "Launch plan"', steps: ['exported result'], capture_method: 'ffmpeg frame extraction from media-raw/frameflow/frameflow-export-original.mp4, scaled 1920 -> 1600 wide', crop: 'none (full export frame)', notes: 'This is FrameFlow output, not a UI screenshot.' },
    { file: 'frameflow-export.mp4', kind: 'export-web-copy', scenario: 'The MP4 FrameFlow exported in this run (Midnight, Calm feel + edited Moment 02 at 2.6x, Halo cursor, 1080p30 High)', steps: ['exported result'], capture_method: 'Re-encode of media-raw/frameflow/frameflow-export-original.mp4 (the app\'s own WebCodecs H.264 output, 1920x1080, 30 fps, 16.5 s, 495 frames, 4,150,596 bytes, no audio stream, sha256 ' + sha(join(RAW, 'frameflow-export-original.mp4')) + ') scaled to 1600x900 with libx264', crop: 'none', notes: 'Original export has no audio (source had none), so the copy has none.' },
  ]
  const manifest = entries.map((e) => {
    const f = join(OUT, e.file)
    const media = e.file.endsWith('.mp4') ? vinfo(f) : iinfo(f)
    return { file: e.file, kind: e.kind, scenario: e.scenario, steps: e.steps, ...common, capture_method: e.capture_method, ...media, bytes: statSync(f).size, sha256: sha(f), crop: e.crop, notes: e.notes }
  })
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  console.log(manifest.map((m) => `${m.file} ${m.dimensions} ${m.duration_s ?? ''} ${m.bytes}`).join('\n'))
}

const phase = process.argv[2]
if (phase === 'source') await phaseSource()
else if (phase === 'studio') await phaseStudio()
else if (phase === 'media') await phaseMedia()
else if (phase === 'manifest') await phaseManifest()
else console.log('usage: frameflow.mjs source|studio|media|manifest')
