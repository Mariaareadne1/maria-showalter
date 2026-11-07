// Synthesises the two default loops for the homepage DJ deck.
// Original material generated entirely by this script (no samples, no third-party audio),
// so the site can ship it without a licence question. Deterministic: same output every run.
//   node scripts/make-deck-loops.mjs   → assets/audio/loop-a.m4a, loop-b.m4a (+ WAV in media-raw)
import { writeFile, mkdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FFMPEG = process.env.FFMPEG ?? join(homedir(), 'Developer/FrameFlow/node_modules/ffmpeg-static/ffmpeg')
const RAW = join(homedir(), 'Developer/design-engineering-build-2026/media-raw/deck')
const SR = 44100

function rng (seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) }
const midi = (n) => 440 * 2 ** ((n - 69) / 12)

function render ({ bpm, bars, seed, bassLine, chord, hatEvery, swing }) {
  const beat = 60 / bpm
  const len = Math.round(bars * 4 * beat * SR)
  const L = new Float32Array(len), R = new Float32Array(len)
  const rand = rng(seed)
  const add = (t0, fn, dur, pan = 0) => {
    const i0 = Math.round(t0 * SR), n = Math.round(dur * SR)
    const gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4)
    for (let i = 0; i < n && i0 + i < len; i++) { const v = fn(i / SR); L[i0 + i] += v * gl; R[i0 + i] += v * gr }
  }
  const kick = (t) => Math.sin(2 * Math.PI * (48 * t + 90 * (1 - Math.exp(-t * 28)) / 28)) * Math.exp(-t * 7) * 0.9
  const noise = () => rand() * 2 - 1
  const hat = (t) => noise() * Math.exp(-t * 60) * 0.16
  const clap = (t) => noise() * (Math.exp(-t * 22) + 0.6 * Math.exp(-((t - 0.012) ** 2) * 4e5)) * 0.32
  const bass = (f) => (t) => {
    const ph = f * t
    const saw = 2 * (ph - Math.floor(ph + 0.5))
    return (Math.sin(2 * Math.PI * ph) * 0.7 + saw * 0.18) * Math.min(1, t * 200) * Math.exp(-t * 3.2) * 0.42
  }
  const pad = (fs) => (t) => fs.reduce((a, f, k) => a + Math.sin(2 * Math.PI * f * t + k) * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.25 * t + k)), 0) / fs.length * Math.min(1, t * 3) * 0.12

  for (let b = 0; b < bars; b++) {
    const bar0 = b * 4 * beat
    for (let q = 0; q < 4; q++) add(bar0 + q * beat, kick, 0.5)
    add(bar0 + 1 * beat, clap, 0.25, 0.1); add(bar0 + 3 * beat, clap, 0.25, -0.1)
    for (let s = 0; s < 16; s += hatEvery) {
      const sw = s % 2 ? swing * beat / 4 : 0
      add(bar0 + s * beat / 4 + sw, hat, 0.08, s % 4 === 2 ? 0.35 : -0.25)
    }
    bassLine.forEach(([step, note, dur]) => add(bar0 + step * beat / 4, bass(midi(note)), dur * beat / 4))
    if (b % 2 === 0) add(bar0, pad(chord[(b / 2) % chord.length].map(midi)), 8 * beat, 0)
  }
  // Soft saturation, then normalise to −1 dBFS peak.
  let peak = 0
  for (let i = 0; i < len; i++) { L[i] = Math.tanh(L[i] * 1.2); R[i] = Math.tanh(R[i] * 1.2); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])) }
  const g = 0.89 / peak
  for (let i = 0; i < len; i++) { L[i] *= g; R[i] *= g }
  return [L, R]
}

function wav ([L, R]) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4)
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8)
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24)
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40)
  for (let i = 0; i < n; i++) { buf.writeInt16LE(Math.round(L[i] * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * 32767), 46 + i * 4) }
  return buf
}

const LOOPS = [
  { id: 'loop-a', bpm: 112, bars: 16, seed: 7, hatEvery: 2, swing: 0.12,
    bassLine: [[0, 33, 3], [3, 33, 1], [6, 36, 2], [10, 31, 3], [14, 33, 2]],
    chord: [[57, 60, 64, 67], [53, 57, 60, 64]] },
  { id: 'loop-b', bpm: 124, bars: 16, seed: 19, hatEvery: 1, swing: 0,
    bassLine: [[2, 38, 2], [6, 38, 1], [8, 41, 2], [11, 43, 1], [14, 36, 2]],
    chord: [[62, 65, 69, 72], [58, 62, 65, 69], [60, 64, 67, 71], [57, 60, 64, 67]] }
]

await mkdir(RAW, { recursive: true })
await mkdir(join(root, 'assets/audio'), { recursive: true })
for (const l of LOOPS) {
  const w = join(RAW, `${l.id}.wav`)
  await writeFile(w, wav(render(l)))
  const out = join(root, 'assets/audio', `${l.id}.m4a`)
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', w, '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out])
  console.log(`${l.id}: ${l.bpm} BPM, ${l.bars} bars → ${out}`)
}
