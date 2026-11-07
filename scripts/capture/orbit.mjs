// Orbit demo media capture (portfolio). Repeatable: `node scripts/capture/orbit.mjs` from portfolio-v1.
// Drives the LIVE app (ORBIT_URL overrides) with real UI input only: adds three built-in sounds, places one,
// draws two paths, plays, and triggers Orbit's own Export WAV. Writes:
//   assets/media/orbit/  orbit-loop.mp4, poster jpg/webp, orbit-step-N.jpg, orbit-export.m4a,
//                        orbit-export-analysis.json, manifest.json
//   ../media-raw/orbit/  orbit-export.wav (raw download), frames are kept in memory only.
// Audio backend: Chromium's fake audio sink (--disable-audio-output), because this Mac's real output device
// stopped advancing AudioContext clocks. The probe result is recorded in the manifest.
import { createHash } from 'node:crypto'
import { execFileSync, spawn } from 'node:child_process'
import { mkdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = join(ROOT, 'assets/media/orbit')
const RAW = resolve(ROOT, '../media-raw/orbit')
const ORBIT_REPO = resolve(ROOT, '../orbit')
const URL_ = process.env.ORBIT_URL ?? 'https://mariaareadne1.github.io/orbit/'
const FFMPEG = process.env.FFMPEG ?? `${process.env.HOME}/Developer/FrameFlow/node_modules/ffmpeg-static/ffmpeg`
const FFPROBE = process.env.FFPROBE ?? `${process.env.HOME}/Developer/FrameFlow/node_modules/ffprobe-static/bin/darwin/arm64/ffprobe`
const VIEW = { width: 1600, height: 1000 }
const DSF = 2 // render at 2x, screencast/screenshot downscaled to 1600 wide for crisp text
const FPS = 30
const DOC_KEY = 'orbit.document.v1'
const DOC_DURATION = 12
const EMPTY_DOC = { version: 1, name: 'Portfolio orbit', duration: DOC_DURATION, loop: true, voices: [] }

mkdirSync(OUT, { recursive: true })
mkdirSync(RAW, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const sha256 = (f) => createHash('sha256').update(readFileSync(f)).digest('hex')
const probe = (f) => JSON.parse(execFileSync(FFPROBE, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', f], { encoding: 'utf8' }))

// ── 1. audio clock probe: real device vs fake sink ─────────────────────────
async function clockAdvance(args) {
  const b = await chromium.launch({ args: ['--use-angle=metal', ...args] })
  const p = await b.newPage()
  const r = await p.evaluate(async () => {
    const c = new AudioContext(); await c.resume().catch(() => {})
    const t0 = c.currentTime; await new Promise((res) => setTimeout(res, 800))
    return { state: c.state, advanced_s: +(c.currentTime - t0).toFixed(4), wall_s: 0.8 }
  })
  await b.close()
  return r
}
const realProbe = await clockAdvance([])
const fakeProbe = await clockAdvance(['--disable-audio-output'])
const realWorks = realProbe.advanced_s > 0.6
console.log('audio clock: real device', realProbe, '| fake sink', fakeProbe)
const AUDIO_ARGS = realWorks ? [] : ['--disable-audio-output']
const AUDIO_BACKEND = realWorks ? 'real' : 'fake'

// ── 2. browser + capture-only cursor marker ────────────────────────────────
const browser = await chromium.launch({ args: ['--use-angle=metal', ...AUDIO_ARGS] })
const context = await browser.newContext({ viewport: VIEW, deviceScaleFactor: DSF, acceptDownloads: true })
await context.addInitScript(({ key, value }) => {
  if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.clear(); localStorage.setItem(key, value) }
  // Capture-only cursor marker: headless Chromium draws no pointer. Follows real mouse events; grows while pressed.
  addEventListener('DOMContentLoaded', () => {
    const d = document.createElement('div')
    d.id = '__capture-cursor'
    d.style.cssText = 'position:fixed;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:rgba(255,255,255,.85);box-shadow:0 0 0 2px rgba(20,24,40,.7);pointer-events:none;z-index:2147483647;transition:transform .08s;transform:translate(-100px,-100px)'
    document.body.appendChild(d)
    let x = -100, y = -100, s = 1
    const paint = () => { d.style.transform = `translate(${x}px,${y}px) scale(${s})` }
    addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; paint() }, true)
    addEventListener('pointerdown', (e) => { x = e.clientX; y = e.clientY; s = 0.7; paint() }, true)
    addEventListener('pointerup', () => { s = 1; paint() }, true)
  })
}, { key: DOC_KEY, value: JSON.stringify(EMPTY_DOC) })

const page = await context.newPage()
const pageErrors = []
page.on('pageerror', (e) => pageErrors.push(e.message))
page.on('console', (m) => m.type() === 'error' && pageErrors.push(m.text()))
await page.goto(URL_, { waitUntil: 'networkidle' })
await page.getByTestId('stage').waitFor()
await sleep(600)

// stage metres → client px, via the SVG's own transform (viewBox 720, centre 360, 59.2 units/m)
const toClient = (x, y) => page.evaluate(([x, y]) => {
  const svg = document.querySelector('[data-testid=stage]')
  const pt = svg.createSVGPoint(); pt.x = 360 + x * 59.2; pt.y = 360 - y * 59.2
  const q = pt.matrixTransform(svg.getScreenCTM()); return [q.x, q.y]
}, [x, y])
let mouse = [VIEW.width * 0.55, VIEW.height * 0.6]
async function moveTo(x, y, steps = 14, stepMs = 12) {
  const [x0, y0] = mouse
  for (let i = 1; i <= steps; i++) {
    const f = i / steps, e = f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2
    await page.mouse.move(x0 + (x - x0) * e, y0 + (y - y0) * e); await sleep(stepMs)
  }
  mouse = [x, y]
}
async function clickLocator(loc, settle = 260) {
  const b = await loc.boundingBox()
  await moveTo(b.x + b.width / 2, b.y + b.height / 2)
  await page.mouse.down(); await sleep(70); await page.mouse.up(); await sleep(settle)
}
const nodeCenter = async (name) => { const b = await page.getByTestId(`node-${name}`).boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2] }
const stills = []
async function still(n, label) {
  const file = join(OUT, `orbit-step-${n}.jpg`)
  await page.screenshot({ path: file, type: 'jpeg', quality: 86, scale: 'css' })
  stills.push({ file, label })
}
const positions = async (label) => page.evaluate((label) => {
  const o = window.orbit; const t = o.engine.time()
  return { label, t: +t.toFixed(3), voices: o.doc().voices.map((v) => { const p = o.engine.position(v, t); return { name: v.name, x: +p.x.toFixed(2), y: +p.y.toFixed(2), keyframes: v.path.length } }) }
}, label)

// ── 3. CDP screencast ──────────────────────────────────────────────────────
const cdp = await context.newCDPSession(page)
const frames = [] // { ts, data: Buffer }
cdp.on('Page.screencastFrame', async (f) => {
  frames.push({ ts: f.metadata.timestamp, data: Buffer.from(f.data, 'base64') })
  await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {})
})
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: VIEW.width, maxHeight: VIEW.height, everyNthFrame: 1 })
await sleep(300)
const marks = {}
const mark = (k) => { marks[k] = Date.now() / 1000 }
mark('start')

// Step A: add three built-in sounds from the score's empty lanes.
for (const name of ['Drone', 'Plucks', 'Pulse']) {
  await clickLocator(page.getByRole('button', { name: '+ Add sound' }), 200)
  await clickLocator(page.getByRole('group', { name: 'Add a sound' }).getByRole('button', { name, exact: true }), 320)
}
const added = await positions('after adding three sounds')
await still(1, 'Three generated sounds added from the score (Drone, Plucks, Pulse) at their default spots')

// Step B: Place mode (default) — drag Drone to behind-left.
{
  const [nx, ny] = await nodeCenter('Drone')
  await moveTo(nx, ny); await page.mouse.down(); mouse = [nx, ny]
  const [tx, ty] = await toClient(-2.6, -2.4)
  await moveTo(tx, ty, 22, 16); await page.mouse.up(); await sleep(300)
}

// Step C: Draw mode — a loop for Plucks, then a frontal arc for Pulse.
await clickLocator(page.getByRole('button', { name: 'Draw', exact: true }), 200)
async function drawFor(name, pts, stillAt) {
  const [nx, ny] = await nodeCenter(name)
  await moveTo(nx, ny); await page.mouse.down(); await sleep(60); await page.mouse.up(); await sleep(200) // first press selects
  const client = []
  for (const [x, y] of pts) client.push(await toClient(x, y))
  await moveTo(client[0][0], client[0][1], 12, 12)
  await page.mouse.down()
  for (let i = 1; i < client.length; i++) {
    await page.mouse.move(client[i][0], client[i][1]); await sleep(14)
    if (stillAt && i === Math.round(client.length * 0.7)) await still(stillAt, `Draw mode: a path being sketched for ${name} (stroke in progress)`)
  }
  mouse = client[client.length - 1]
  await page.mouse.up(); await sleep(350)
}
const loop = Array.from({ length: 73 }, (_, i) => { const a = (i / 72) * Math.PI * 2; return [3.3 * Math.sin(a), 3.3 * Math.cos(a) * 0.9 + 0.2] })
await drawFor('Plucks', loop, 2)
const arc = Array.from({ length: 49 }, (_, i) => { const f = i / 48; return [-4 + 8 * f, 1.2 + 2.4 * Math.sin(f * Math.PI)] })
await drawFor('Pulse', arc, null)
const drawn = await positions('after drawing (paused, t=0)')

// Step D: play — the playhead moves the sources along their paths.
mark('play')
await clickLocator(page.getByTestId('play'), 100)
const moving = []
for (let i = 0; i < 6; i++) {
  await sleep(1000)
  moving.push(await positions(`playing +${i + 1}s`))
  if (i === 2) { mark('poster'); await page.screenshot({ path: join(OUT, 'orbit-loop-poster.jpg'), type: 'jpeg', quality: 82, scale: 'css' }); await still(3, 'Playing: playhead running, Plucks and Pulse moved along their drawn paths, score lanes show direction over time') }
}

// Step E: Orbit's real Export WAV (OfflineAudioContext render, 16-bit stereo).
const dlP = page.waitForEvent('download', { timeout: 60_000 })
await clickLocator(page.getByRole('button', { name: 'Export WAV' }), 50)
const download = await dlP
await page.getByTestId('export-status').filter({ hasText: 'WAV' }).waitFor({ timeout: 30_000 })
const exportStatus = await page.getByTestId('export-status').innerText()
await moveTo(VIEW.width * 0.78, VIEW.height * 0.62, 16, 14) // keep the marker off the button and status
await sleep(600)
await still(4, 'Export WAV finished: in-app status reports length, 48 kHz stereo 16-bit, peak dBFS and clipped samples')
await sleep(500)
mark('end')
await cdp.send('Page.stopScreencast')
const docFinal = await page.evaluate(() => window.orbit.doc())
const wavRaw = join(RAW, 'orbit-export.wav')
await download.saveAs(wavRaw)
const suggested = download.suggestedFilename()
await browser.close()
console.log('frames', frames.length, 'export status:', exportStatus)

// ── 4. constant-fps H.264 from screencast timestamps ───────────────────────
frames.sort((a, b) => a.ts - b.ts)
const t0 = marks.start, t1 = marks.end
const seq = []
for (let t = t0, j = 0; t <= t1; t += 1 / FPS) {
  while (j + 1 < frames.length && frames[j + 1].ts <= t) j++
  seq.push(frames[j].data)
}
const mp4 = join(OUT, 'orbit-loop.mp4')
await new Promise((res, rej) => {
  const ff = spawn(FFMPEG, ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-vf', `scale=${VIEW.width}:${VIEW.height}:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', process.env.CRF ?? '24',
    '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4], { stdio: ['pipe', 'inherit', 'inherit'] })
  ff.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg ${c}`))))
  ;(async () => { for (const b of seq) if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once('drain', r)); ff.stdin.end() })()
})
execFileSync(FFMPEG, ['-y', '-v', 'error', '-i', join(OUT, 'orbit-loop-poster.jpg'), '-c:v', 'libwebp', '-quality', '82', join(OUT, 'orbit-loop-poster.webp')])

// ── 5. WAV analysis ────────────────────────────────────────────────────────
function readWav(file) {
  const b = readFileSync(file)
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WAVE') throw new Error('not a RIFF/WAVE file')
  let off = 12, fmt = null, data = null
  while (off + 8 <= b.length) {
    const id = b.toString('ascii', off, off + 4), size = b.readUInt32LE(off + 4)
    if (id === 'fmt ') fmt = { format: b.readUInt16LE(off + 8), channels: b.readUInt16LE(off + 10), sampleRate: b.readUInt32LE(off + 12), bits: b.readUInt16LE(off + 22) }
    if (id === 'data') data = b.subarray(off + 8, off + 8 + size)
    off += 8 + size + (size & 1)
  }
  if (!fmt || !data || fmt.format !== 1 || fmt.bits !== 16) throw new Error('expected 16-bit PCM')
  const n = data.length / 2 / fmt.channels
  const ch = Array.from({ length: fmt.channels }, () => new Float32Array(n))
  for (let i = 0; i < n; i++) for (let c = 0; c < fmt.channels; c++) ch[c][i] = data.readInt16LE((i * fmt.channels + c) * 2) / 32768
  return { ...fmt, frames: n, ch }
}
const w = readWav(wavRaw)
const db = (x) => +(20 * Math.log10(Math.max(x, 1e-12))).toFixed(2)
const stats = (a) => { let pk = 0, ss = 0, clip = 0; for (const v of a) { const m = Math.abs(v); if (m > pk) pk = m; if (m >= 0.999) clip++; ss += v * v } return { peak: +pk.toFixed(4), peak_dbfs: db(pk), rms: +Math.sqrt(ss / a.length).toFixed(4), rms_dbfs: db(Math.sqrt(ss / a.length)), samples_at_or_above_0_999: clip } }
const WIN = 0.1, win = Math.round(w.sampleRate * WIN), windows = []
for (let i = 0; i + win <= w.frames; i += win) {
  let l = 0, r = 0
  for (let k = i; k < i + win; k++) { l += w.ch[0][k] ** 2; r += w.ch[1][k] ** 2 }
  const lr = Math.sqrt(l / win), rr = Math.sqrt(r / win)
  windows.push({ t: +(i / w.sampleRate).toFixed(2), l_rms_db: db(lr), r_rms_db: db(rr), l_minus_r_db: +(db(lr) - db(rr)).toFixed(2) })
}
const lr = windows.filter((x) => x.l_rms_db > -60 && x.r_rms_db > -60).map((x) => x.l_minus_r_db)
const minW = windows.reduce((a, b) => (b.l_minus_r_db < a.l_minus_r_db ? b : a)), maxW = windows.reduce((a, b) => (b.l_minus_r_db > a.l_minus_r_db ? b : a))
const perSecond = []
for (let s = 0; s < Math.floor(w.frames / w.sampleRate); s++) { const ws = windows.filter((x) => x.t >= s && x.t < s + 1); perSecond.push({ t: s, mean_l_minus_r_db: +(ws.reduce((a, b) => a + b.l_minus_r_db, 0) / ws.length).toFixed(2) }) }
const analysis = {
  file: 'media-raw/orbit/orbit-export.wav', suggested_filename: suggested, sha256: sha256(wavRaw), bytes: statSync(wavRaw).size,
  channels: w.channels, sample_rate: w.sampleRate, bits: w.bits, duration_s: +(w.frames / w.sampleRate).toFixed(3),
  left: stats(w.ch[0]), right: stats(w.ch[1]),
  balance: { window_s: WIN, windows_counted: lr.length, l_minus_r_db_min: Math.min(...lr), l_minus_r_db_max: Math.max(...lr), range_db: +(Math.max(...lr) - Math.min(...lr)).toFixed(2), min_at_s: minW.t, max_at_s: maxW.t, convention: 'positive = louder on the left' },
  per_second_mean_l_minus_r_db: perSecond,
  app_export_status: exportStatus,
  document: docFinal.voices.map((v) => ({ name: v.name, source: v.source, gainDb: v.gainDb, keyframes: v.path.length, first: v.path[0], last: v.path[v.path.length - 1] })),
  windows_100ms: windows,
}
writeFileSync(join(OUT, 'orbit-export-analysis.json'), JSON.stringify(analysis, null, 2))

// web version for a user-initiated "Play sound" control
const m4a = join(OUT, 'orbit-export.m4a')
execFileSync(FFMPEG, ['-y', '-v', 'error', '-i', wavRaw, '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-movflags', '+faststart', m4a])

// ── 6. manifest ────────────────────────────────────────────────────────────
const commit = execFileSync('git', ['-C', ORBIT_REPO, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
let deployedSha = null
try { deployedSha = JSON.parse(execFileSync('gh', ['run', 'list', '--repo', 'Mariaareadne1/orbit', '--workflow', 'Test and deploy', '--branch', 'main', '--status', 'success', '--limit', '1', '--json', 'headSha'], { encoding: 'utf8' }))[0]?.headSha ?? null } catch { /* gh unavailable */ }
const common = {
  source_url: URL_, source_repo: 'https://github.com/Mariaareadne1/orbit', source_commit: commit,
  source_commit_verification: deployedSha === commit ? `local HEAD equals the head SHA of the latest successful "Test and deploy" run on main (${deployedSha}); deployed bundle not byte-compared` : `local HEAD ${commit}; latest successful deploy run head ${deployedSha ?? 'unknown'} — not verified equal`,
  sound_sources: [
    { name: 'Drone', provenance: "Orbit built-in, generated in code at runtime (src/audio/signals.ts); no recording" },
    { name: 'Plucks', provenance: "Orbit built-in, generated in code at runtime (src/audio/signals.ts); no recording" },
    { name: 'Pulse', provenance: "Orbit built-in, generated in code at runtime (src/audio/signals.ts); no recording" },
  ],
  capture_date: new Date().toISOString(),
  audio_backend: AUDIO_BACKEND,
  audio_backend_detail: { real_device_probe: realProbe, fake_sink_probe: fakeProbe, chromium_args: AUDIO_ARGS, note: AUDIO_BACKEND === 'fake' ? "Real-time playback ran on Chromium's fake audio sink (--disable-audio-output): the AudioContext clock and PannerNode automation ran, nothing reached a speaker. The WAV comes from OfflineAudioContext and does not use the output device." : 'Real output device clock advanced.' },
  viewport: VIEW, device_scale: DSF,
  scenario: 'Empty "Portfolio orbit" document (12 s, loop) seeded into localStorage before load; then real UI input: + Add sound ×3 (Drone, Plucks, Pulse) → Place: drag Drone behind-left → Draw: loop for Plucks, frontal left→right arc for Pulse → Play → Export WAV.',
  cursor_marker: 'Capture-only white dot (#__capture-cursor) injected by the capture script, following real pointer events and shrinking while pressed; not part of Orbit.',
  page_errors: pageErrors,
}
const STEPS = ['add 3 built-in sounds', 'place Drone', 'draw path for Plucks', 'draw path for Pulse', 'play', 'export WAV']
const entry = (file, kind, extra) => {
  const p = probe(file), v = p.streams.find((s) => s.codec_type === 'video'), a = p.streams.find((s) => s.codec_type === 'audio')
  return { file: `assets/media/orbit/${file.split('/').pop()}`, kind, ...common, steps: STEPS, capture_method: extra.method,
    dimensions: v ? { width: v.width, height: v.height } : null, duration_s: kind === 'video' || kind === 'audio' ? +Number(p.format.duration).toFixed(3) : null,
    codec: (v ?? a)?.codec_name ?? null, pix_fmt: v?.pix_fmt ?? null, has_audio: !!a, channels: a?.channels ?? null, sample_rate: a ? Number(a.sample_rate) : null,
    bytes: statSync(file).size, sha256: sha256(file), notes: extra.notes }
}
const motion = { added, drawn, moving }
const manifest = [
  entry(mp4, 'video', { method: `CDP Page.startScreencast (jpeg q90, ${DSF}x render downscaled to 1600 wide) resampled to constant ${FPS} fps from frame metadata.timestamp; ffmpeg-static libx264 CRF ${process.env.CRF ?? 24} -preset slow -tune stillimage, yuv420p, +faststart, no audio track`, notes: `Silent loop. Engine read-back of voice positions during capture (stage metres, piece time): ${JSON.stringify(motion)}` }),
  entry(join(OUT, 'orbit-loop-poster.jpg'), 'image', { method: 'Playwright page.screenshot jpeg q82, scale css, taken during playback ~3 s after Play (the same moment appears in the video)', notes: 'Poster for orbit-loop.mp4' }),
  entry(join(OUT, 'orbit-loop-poster.webp'), 'image', { method: 'ffmpeg-static libwebp -quality 82 from the poster jpg', notes: 'Poster for orbit-loop.mp4' }),
  ...stills.map((s) => entry(s.file, 'image', { method: 'Playwright page.screenshot jpeg q86, scale css (2x render downscaled)', notes: s.label })),
  { ...entry(m4a, 'audio', { method: "Orbit's own Export WAV (renderArrangement → OfflineAudioContext 48 kHz → encodeWav 16-bit), captured with page.waitForEvent('download'); transcoded with ffmpeg-static aac 160k stereo", notes: `Web version of the exported WAV for a user-initiated Play control. Raw WAV: media-raw/orbit/orbit-export.wav (sha256 ${analysis.sha256}). L−R balance (100 ms windows) ${analysis.balance.l_minus_r_db_min}…${analysis.balance.l_minus_r_db_max} dB. App status: ${exportStatus}` }), audio_backend: 'offline (OfflineAudioContext; no output device involved)' },
  { file: 'assets/media/orbit/orbit-export-analysis.json', kind: 'data', ...common, steps: STEPS, capture_method: 'Node script in scripts/capture/orbit.mjs parsing the raw 16-bit PCM WAV', dimensions: null, duration_s: analysis.duration_s, codec: 'pcm_s16le (source WAV)', pix_fmt: null, has_audio: false, channels: analysis.channels, sample_rate: analysis.sample_rate, bytes: statSync(join(OUT, 'orbit-export-analysis.json')).size, sha256: sha256(join(OUT, 'orbit-export-analysis.json')), notes: 'Per-channel peak/RMS, clipping count, 100 ms windowed L/R RMS of the exported WAV', audio_backend: 'offline (OfflineAudioContext; no output device involved)' },
]
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(JSON.stringify({ frames: frames.length, video_frames: seq.length, analysis: { ...analysis, windows_100ms: undefined, per_second_mean_l_minus_r_db: undefined, document: undefined } }, null, 2))
