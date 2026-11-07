// Edition (Print Room) portfolio media capture — drives the LIVE app with Playwright.
//   node scripts/capture/edition.mjs capture   # browser run: screencast frames, stills, real exports → media-raw
//   node scripts/capture/edition.mjs build     # encode loop/poster/derivatives, parity checks, manifest
//   node scripts/capture/edition.mjs           # both
// Run from portfolio-v1 (uses its Playwright). ffmpeg/ffprobe from FrameFlow's static builds.
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const HOME = homedir()
const ROOT = join(HOME, 'Developer/design-engineering-build-2026')
const URL = 'https://mariaareadne1.github.io/edition/'
const REPO = join(ROOT, 'edition')
const PHOTO = join(ROOT, 'portfolio-v1/assets/media/photos/img_0422-1600.jpg')
const RAW = join(ROOT, 'media-raw/edition')
const FRAMES = join(RAW, 'frames')
const EXPORTS = join(RAW, 'exports')
const OUT = join(ROOT, 'portfolio-v1/assets/media/edition')
const FFMPEG = join(HOME, 'Developer/FrameFlow/node_modules/ffmpeg-static/ffmpeg')
const FFPROBE = join(HOME, 'Developer/FrameFlow/node_modules/ffprobe-static/bin/darwin/arm64/ffprobe')
const VIEWPORT = { width: 1600, height: 1000 }
const MAX_FRAME_S = 0.8 // cap on any single static frame (trims render waits, keeps deliberate holds)
const FPS = +(process.env.FPS ?? 30)
const mode = process.argv[2] ?? 'all'

const ff = (args) => execFileSync(FFMPEG, ['-hide_banner', '-v', 'error', '-y', ...args], { maxBuffer: 1 << 30 })
const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex')

const CURSOR = `(() => {
  const add = () => {
    if (document.getElementById('__cap_cursor')) return
    const d = document.createElement('div'); d.id = '__cap_cursor'
    d.style.cssText = 'position:fixed;left:-50px;top:-50px;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:rgba(255,255,255,.85);border:2px solid rgba(20,20,20,.85);box-shadow:0 1px 4px rgba(0,0,0,.45);pointer-events:none;z-index:2147483647;transition:transform .08s'
    document.documentElement.appendChild(d)
    const mv = (e) => { d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px' }
    addEventListener('pointermove', mv, true); addEventListener('mousemove', mv, true)
    addEventListener('pointerdown', () => d.style.transform = 'scale(.7)', true)
    addEventListener('pointerup', () => d.style.transform = '', true)
  }
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', add) : add()
})()`

async function capture() {
  rmSync(FRAMES, { recursive: true, force: true })
  mkdirSync(FRAMES, { recursive: true }); mkdirSync(EXPORTS, { recursive: true }); mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, acceptDownloads: true })
  await ctx.addInitScript(CURSOR)
  const p = await ctx.newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(e.message))
  const proofed = () => p.getByTestId('proof-status').filter({ hasText: 'proofed in' }).waitFor({ timeout: 60000 })
  const settle = async () => { await proofed(); await p.waitForTimeout(300); await proofed() }
  const hold = (ms) => p.waitForTimeout(ms)
  const moveTo = (x, y, steps = 18) => p.mouse.move(x, y, { steps })
  const clickEl = async (loc) => {
    const b = await loc.boundingBox()
    await moveTo(b.x + b.width / 2, b.y + b.height / 2)
    await hold(120)
    await loc.click()
  }

  await p.goto(URL)
  await p.evaluate(() => new Promise((r) => { const q = indexedDB.deleteDatabase('edition'); q.onsuccess = q.onerror = q.onblocked = () => r() }))
  await p.reload()
  await settle()
  await p.mouse.move(800, 500)

  // CDP screencast with frame timestamps
  const cdp = await ctx.newCDPSession(p)
  const frames = []
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const file = join(FRAMES, `${String(frames.length).padStart(5, '0')}.jpg`)
    writeFileSync(file, Buffer.from(data, 'base64'))
    frames.push({ file, t: metadata.timestamp })
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  })
  const marks = {}
  const mark = (k) => { marks[k] = Date.now() / 1000 }
  const still = (n) => p.screenshot({ path: join(RAW, `step-${n}.png`) })
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: VIEWPORT.width, maxHeight: VIEWPORT.height, everyNthFrame: 1 })
  await hold(500)
  mark('start')

  // 1. Import via Open ▸ Image… (real file chooser)
  await clickEl(p.getByRole('button', { name: /^Open/ }))
  await hold(500)
  const chooser = p.waitForEvent('filechooser')
  await clickEl(p.getByRole('button', { name: /^Image…/ }))
  await (await chooser).setFiles(PHOTO)
  await p.getByTestId('proof-status').filter({ hasText: 'img_0422' }).waitFor({ timeout: 60000 })
  await settle()
  mark('imported')
  await hold(900)
  await still(1)

  // 2. The two separations: Plate 1, Plate 2, then hold Separate
  await clickEl(p.getByRole('button', { name: 'Plate 1', exact: true })); await settle(); await hold(750)
  await clickEl(p.getByRole('button', { name: 'Plate 2', exact: true })); await settle(); await hold(750)
  await clickEl(p.getByRole('button', { name: 'Print', exact: true })); await settle()
  const sb = await p.getByRole('button', { name: 'Separate' }).boundingBox()
  await moveTo(sb.x + sb.width / 2, sb.y + sb.height / 2)
  await p.mouse.down()
  await p.locator('.fan__plate.is-ready').nth(1).waitFor({ timeout: 20000 })
  mark('separated')
  await hold(1000)
  await still(2)
  await p.mouse.up()
  await settle(); await hold(200)

  // 3. Misregistration: drag plate 2 across the sheet, then register it exactly
  const sheet = await p.getByTestId('sheet').boundingBox()
  const cx = sheet.x + sheet.width * 0.55, cy = sheet.y + sheet.height * 0.5
  await moveTo(cx, cy)
  await p.mouse.down()
  for (let i = 1; i <= 40; i++) { await p.mouse.move(cx + i * 0.9, cy + i * 0.5); await hold(25) }
  await hold(400)
  mark('dragged')
  await still(4)
  await p.mouse.up()
  await settle(); await hold(600)
  const shiftDragged = await p.getByRole('textbox', { name: 'Shift X' }).inputValue() + ' / ' + await p.getByRole('textbox', { name: 'Shift Y' }).inputValue()
  await clickEl(p.getByRole('button', { name: 'Register plate 2 exactly' })); await settle(); await hold(800)

  // 4. Loupe at 2:1 over the sun — the export's own 300 dpi pixels
  await clickEl(p.getByRole('button', { name: 'Loupe' }))
  await clickEl(p.getByRole('button', { name: '2:1' }))
  for (const [fx, fy] of [[0.22, 0.52], [0.3, 0.47], [0.38, 0.45], [0.46, 0.5]]) {
    await moveTo(sheet.x + sheet.width * fx, sheet.y + sheet.height * fy, 30)
    await hold(380)
  }
  mark('loupe')
  await still(3)
  await hold(300)

  // 5. Split compare: source vs print, drag the handle
  await clickEl(p.getByRole('button', { name: 'Loupe' }))
  await clickEl(p.getByRole('button', { name: 'Split', exact: true })); await settle(); await hold(300)
  const grip = await p.getByRole('slider', { name: 'Comparison position' }).boundingBox()
  const gy = grip.y + grip.height / 2
  await moveTo(grip.x + grip.width / 2, gy)
  await p.mouse.down()
  await moveTo(sheet.x + sheet.width * 0.25, gy, 30)
  await moveTo(sheet.x + sheet.width * 0.75, gy, 50)
  await p.mouse.up()
  mark('split')
  await hold(900)
  mark('end')
  await cdp.send('Page.stopScreencast')
  await hold(300)

  // Back to the print at the default register (undo "register exactly" and the drag)
  await clickEl(p.getByRole('button', { name: 'Print', exact: true })); await settle()
  await p.getByRole('button', { name: 'Undo' }).click(); await settle()
  await p.getByRole('button', { name: 'Undo' }).click(); await settle()
  const shiftExport = await p.getByRole('textbox', { name: 'Shift X' }).inputValue() + ' / ' + await p.getByRole('textbox', { name: 'Shift Y' }).inputValue()

  // Loupe 1:1 window for pixel parity against the exported composite
  await p.getByRole('button', { name: 'Loupe' }).click()
  await p.getByRole('button', { name: '1:1' }).click()
  await p.mouse.move(sheet.x + sheet.width * 0.3, sheet.y + sheet.height * 0.47, { steps: 10 })
  const loupe = p.getByTestId('loupe')
  for (let i = 0; i < 100; i++) {
    const [a, b, c, d] = await Promise.all(['data-cx', 'data-cy', 'data-span', 'data-drawn'].map((k) => loupe.getAttribute(k)))
    if (d === `${a},${b},${c}`) break
    await hold(200)
  }
  const glass = await loupe.evaluate((c) => {
    const { data, width, height } = c.getContext('2d').getImageData(0, 0, c.width, c.height)
    return { data: Array.from(data), width, height, cx: +c.dataset.cx, cy: +c.dataset.cy, span: +c.dataset.span, longEdge: +c.dataset.longEdge }
  })
  await p.getByRole('button', { name: 'Loupe' }).click()
  await settle()

  // Proof block means (linear light) for export parity
  const BLOCK = 8
  const proof = await p.getByTestId('proof').evaluate((c, block) => {
    const { data, width, height } = c.getContext('2d').getImageData(0, 0, c.width, c.height)
    const lin = (v) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4) }
    const out = []
    for (let by = 0; by + block <= height; by += block)
      for (let bx = 0; bx + block <= width; bx += block) {
        let s = 0
        for (let y = by; y < by + block; y++) for (let x = bx; x < bx + block; x++) { const i = (y * width + x) * 4; s += lin(data[i]) + lin(data[i + 1]) + lin(data[i + 2]) }
        const m = s / (block * block * 3)
        out.push(255 * (m <= 0.0031308 ? m * 12.92 : 1.055 * Math.pow(m, 1 / 2.4) - 0.055))
      }
    return { width, height, blocks: out }
  }, BLOCK)

  // 6. Real export at A4 · 300 dpi: three files, downloaded
  await clickEl(p.getByRole('button', { name: 'Export', exact: true }))
  const dialog = p.getByRole('dialog')
  await dialog.getByLabel('A4 · 300 dpi').check()
  const sizeReadout = await dialog.getByTestId('export-size').innerText()
  await clickEl(dialog.getByRole('button', { name: /Render 3 files/ }))
  await dialog.getByRole('list', { name: 'Rendered files' }).waitFor({ timeout: 240000 })
  await hold(500)
  await still(5)
  const downloads = []
  const items = dialog.getByRole('listitem').filter({ has: p.getByRole('button', { name: 'Download', exact: true }) })
  for (let i = 0; i < await items.count(); i++) {
    const dl = p.waitForEvent('download')
    await items.nth(i).getByRole('button', { name: 'Download', exact: true }).click()
    const d = await dl
    const file = join(EXPORTS, d.suggestedFilename())
    await d.saveAs(file)
    downloads.push({ file, listed: await items.nth(i).innerText() })
  }
  const statusText = await p.getByTestId('proof-status').innerText()
  await browser.close()

  writeFileSync(join(RAW, 'capture.json'), JSON.stringify({
    captured: new Date().toISOString(), frames, marks, shiftDragged, shiftExport, sizeReadout, downloads, statusText, errors,
    glass, proof, block: BLOCK,
  }))
  console.log({ frames: frames.length, shiftDragged, shiftExport, sizeReadout, downloads: downloads.map((d) => d.file), errors })
}

// ---------- build ----------
const probe = (f) => JSON.parse(execFileSync(FFPROBE, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', f]).toString())
const pngDims = (f) => { const b = readFileSync(f); return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) } }
const rgba = (f) => ff(['-i', f, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'])

function encodeLoop(cap) {
  const { frames, marks } = cap
  const kept = frames.filter((f) => f.t >= marks.start - 0.05 && f.t <= marks.end + 0.05)
  let list = '', timeline = 0
  const timeOf = {}
  for (let i = 0; i < kept.length; i++) {
    const next = kept[i + 1]?.t ?? marks.end
    const d = Math.max(0.001, Math.min(MAX_FRAME_S, next - kept[i].t))
    for (const [k, v] of Object.entries(marks)) if (timeOf[k] === undefined && kept[i].t >= v) timeOf[k] = timeline
    list += `file '${kept[i].file}'\nduration ${d.toFixed(4)}\n`
    timeline += d
  }
  list += `file '${kept.at(-1).file}'\n`
  writeFileSync(join(RAW, 'concat.txt'), list)
  const mp4 = join(OUT, 'edition-loop.mp4')
  const crf = process.env.CRF ?? '26'
  ff(['-f', 'concat', '-safe', '0', '-i', join(RAW, 'concat.txt'), '-vf', `fps=${FPS},scale=${VIEWPORT.width}:${VIEWPORT.height}:flags=lanczos,format=yuv420p`,
    '-c:v', 'libx264', '-preset', 'veryslow', '-crf', crf, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4])
  return { mp4, crf, timeOf }
}

function exportParity(cap, comp, dims) {
  const px = rgba(comp)
  const g = cap.glass
  let compared = 0, differing = 0
  const x0 = g.cx - (g.span >> 1), y0 = g.cy - (g.span >> 1)
  for (let y = 0; y < g.span; y++) for (let x = 0; x < g.span; x++) {
    const X = x0 + x, Y = y0 + y
    if (X < 0 || Y < 0 || X >= dims.width || Y >= dims.height) continue
    const i = (y * g.width + x) * 4, j = (Y * dims.width + X) * 4
    compared++
    if (g.data[i] !== px[j] || g.data[i + 1] !== px[j + 1] || g.data[i + 2] !== px[j + 2]) differing++
  }
  const LIN = Array.from({ length: 256 }, (_, i) => { const c = i / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) })
  const enc = (l) => 255 * (l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055)
  const { width: pw, height: ph, blocks } = cap.proof, B = cap.block
  const r = Math.max(dims.width, dims.height) / Math.max(pw, ph)
  let k = 0, sum = 0, worst = 0
  for (let by = 0; by + B <= ph; by += B) for (let bx = 0; bx + B <= pw; bx += B) {
    const xa = Math.round(bx * r), xb = Math.min(dims.width, Math.round((bx + B) * r))
    const ya = Math.round(by * r), yb = Math.min(dims.height, Math.round((by + B) * r))
    let s = 0, n = 0
    for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) { const i = (y * dims.width + x) * 4; s += LIN[px[i]] + LIN[px[i + 1]] + LIN[px[i + 2]]; n += 3 }
    const dlt = Math.abs(enc(s / n) - blocks[k++]); sum += dlt; worst = Math.max(worst, dlt)
  }
  return {
    readout: cap.sizeReadout, composite: dims,
    dims_match_readout: cap.sizeReadout.replace(/\s+/g, ' ').startsWith(`${dims.width} × ${dims.height}`),
    long_edge_3508: Math.max(dims.width, dims.height) === 3508,
    proof_aspect: +(pw / ph).toFixed(4), export_aspect: +(dims.width / dims.height).toFixed(4),
    loupe_pixels: { compared, differing, at: [g.cx, g.cy], span: g.span },
    block_means: { proof: `${pw}x${ph}`, block_px: B, blocks: k, mean_abs_diff_255: +(sum / k).toFixed(3), worst_255: +worst.toFixed(3) },
  }
}

function build() {
  const cap = JSON.parse(readFileSync(join(RAW, 'capture.json'), 'utf8'))
  const { mp4, crf, timeOf } = encodeLoop(cap)
  const pr = probe(mp4)
  const duration = +pr.format.duration

  const posterT = Math.min(duration - 0.1, (timeOf.imported ?? 1) + 1.0)
  const poster = join(OUT, 'edition-loop-poster.jpg')
  ff(['-ss', String(posterT), '-i', mp4, '-frames:v', '1', '-q:v', '4', poster]) // q:v 4 ≈ libjpeg q82
  ff(['-i', poster, '-c:v', 'libwebp', '-quality', '82', join(OUT, 'edition-loop-poster.webp')])
  for (const [k, t] of [['a', 0.5], ['b', duration * 0.5], ['c', duration - 0.6]]) ff(['-ss', String(t), '-i', mp4, '-frames:v', '1', '-q:v', '3', join(RAW, `check-${k}.jpg`)])

  const STILLS = {
    1: ['import', 'Open ▸ Image… loads the owner’s film photo; the two-ink print (cobalt key + vermilion accent) is proofed on the sheet'],
    2: ['separations', 'Holding Separate lifts the two plates apart, each rendered alone by the engine with its registration'],
    3: ['loupe', 'Loupe at 2:1 over the sun: export-resolution (A4/300 dpi) pixels, halftone dots and overprint'],
    4: ['misregistration', 'Mid-drag of plate 2 with the live millimetre readout; registration marks double up'],
    5: ['export', 'Export dialog after rendering the three A4/300 dpi files'],
  }
  for (const n of Object.keys(STILLS)) ff(['-i', join(RAW, `step-${n}.png`), '-vf', 'scale=1600:-2:flags=lanczos', '-q:v', '3', join(OUT, `edition-step-${n}.jpg`)])

  const comp = cap.downloads.find((d) => /print-composite\.png$/.test(d.file)).file
  const dims = pngDims(comp)
  const exportDims = Object.fromEntries(cap.downloads.map((d) => [d.file.split('/').pop(), pngDims(d.file)]))
  ff(['-i', comp, '-vf', 'scale=1600:-2:flags=lanczos', '-q:v', '3', join(OUT, 'edition-export-print-1600.jpg')])
  const CROP = { w: 1000, h: 625, x: Math.round(dims.width * 0.24), y: Math.round(dims.height * 0.36) }
  ff(['-i', comp, '-vf', `crop=${CROP.w}:${CROP.h}:${CROP.x}:${CROP.y}`, '-q:v', '2', join(OUT, 'edition-export-crop.jpg')])
  const parity = { ...exportParity(cap, comp, dims), files: exportDims }
  writeFileSync(join(RAW, 'parity.json'), JSON.stringify(parity, null, 2))
  console.log(parity)

  const commit = execFileSync('git', ['-C', REPO, 'rev-parse', 'HEAD']).toString().trim()
  const base = {
    source_url: URL, source_repo: 'https://github.com/mariaareadne1/edition', source_commit: commit,
    source_commit_note: 'Local edition HEAD; equals origin/main and the headSha of the latest successful "Test and deploy" GitHub Actions run (2026-10-26), so the live Pages deploy was built from it (verified via gh run list, not from the served bundle).',
    fixture_image: 'portfolio-v1/assets/media/photos/img_0422-1600.jpg',
    fixture_provenance: 'Owner’s own film photograph (Maria Showalter): sunset over water, no people. Edition ships no image fixtures (its sample and test images are code-generated).',
    capture_date: cap.captured, viewport: VIEWPORT, device_scale: 1,
  }
  const jpgDims = (f) => { const s = probe(join(OUT, f)).streams[0]; return { width: s.width, height: s.height } }
  const entry = (file, extra) => {
    const f = join(OUT, file)
    return { file, ...base, dimensions: jpgDims(file), duration_s: null, codec: null, pix_fmt: null, has_audio: false, crop: null, bytes: statSync(f).size, sha256: sha(f), ...extra }
  }
  const v = pr.streams.find((s) => s.codec_type === 'video')
  const cursorNote = 'Capture-only cursor marker injected via addInitScript: a 16 px white dot with dark ring following pointer events (pointer-events:none); not part of the app.'
  const manifest = [
    entry('edition-loop.mp4', { kind: 'video', scenario: 'import → separations → misregistration → loupe → split compare',
      steps: ['Open ▸ Image… (real file chooser) imports img_0422-1600.jpg, replacing the sample print', 'Plate 1 view (cobalt key), Plate 2 view (vermilion accent)',
        'Hold Separate: the two plates lift apart', `Drag plate 2 across the sheet (to ${cap.shiftDragged} mm), then Register plate 2 exactly`,
        'Loupe at 2:1 swept over the sun (export pixels)', 'Split view: drag the source/print wipe handle'],
      capture_method: `Playwright 1.64 Chromium headless, CDP Page.startScreencast (JPEG q90), frames placed by metadata.timestamp, static frames capped at ${MAX_FRAME_S}s, resampled to ${FPS} fps CFR, libx264 CRF ${crf} preset veryslow, +faststart, -an`,
      dimensions: { width: v.width, height: v.height }, duration_s: +duration.toFixed(2), codec: v.codec_name, pix_fmt: v.pix_fmt,
      has_audio: pr.streams.some((s) => s.codec_type === 'audio'),
      notes: `${cursorNote} Timeline marks (s): ${JSON.stringify(Object.fromEntries(Object.entries(timeOf).map(([a, b]) => [a, +b.toFixed(2)])))}.` }),
    entry('edition-loop-poster.jpg', { kind: 'poster', scenario: 'loop poster (imported print)', steps: [`frame at ${posterT.toFixed(2)} s of edition-loop.mp4`], capture_method: 'ffmpeg frame extract, JPEG ≈q82', notes: cursorNote }),
    entry('edition-loop-poster.webp', { kind: 'poster', scenario: 'loop poster (imported print)', steps: ['WebP of edition-loop-poster.jpg'], capture_method: 'ffmpeg libwebp quality 82', notes: cursorNote }),
    ...Object.entries(STILLS).map(([n, [scenario, desc]]) => entry(`edition-step-${n}.jpg`, { kind: 'still', scenario, steps: [desc],
      capture_method: 'Playwright page.screenshot (PNG) at 1600×1000 DSF 1 → JPEG',
      notes: n === '5' ? 'Native <dialog> renders in the top layer, above the injected cursor dot.' : cursorNote })),
    entry('edition-export-print-1600.jpg', { kind: 'export-derivative', scenario: 'real export: merged print',
      steps: [`Export ▸ A4 · 300 dpi ▸ Render 3 files ▸ Download; print-composite.png (${dims.width}×${dims.height}) downscaled to 1600 wide`],
      capture_method: 'page.waitForEvent("download") → saveAs media-raw/edition/exports; ffmpeg lanczos downscale',
      notes: `Native export files: ${JSON.stringify(exportDims)}. Plate 2 register at export: ${cap.shiftExport} mm (app default, after undoing the demo drag). Parity: ${JSON.stringify(parity)}` }),
    entry('edition-export-crop.jpg', { kind: 'export-derivative', scenario: 'real export: 1:1 crop showing halftone dots', steps: ['Native-resolution crop of the downloaded print-composite.png'],
      capture_method: 'ffmpeg crop of the exported PNG, JPEG q≈90', crop: { source: `print-composite.png ${dims.width}×${dims.height}`, ...CROP },
      notes: 'No scaling: one image pixel = one 300 dpi export pixel.' }),
  ]
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  console.log(manifest.map((m) => `${m.file} ${m.dimensions.width}x${m.dimensions.height} ${m.bytes}B ${m.duration_s ?? ''}`).join('\n'))
}

if (mode === 'capture' || mode === 'all') await capture()
if (mode === 'build' || mode === 'all') build()
