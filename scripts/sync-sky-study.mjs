// Copies the Sky Study engine modules the portfolio sky needs into sky/vendor/sky-study/.
//   node scripts/sync-sky-study.mjs [path-to-sky-study-checkout]
// Default source: ~/Development/sky-study. Records the source commit in sky/vendor/sky-study/SOURCE.md.
// Files are copied verbatim except one documented patch (zustand → zustand/vanilla, so React is not bundled).
// Do not hand-edit the vendored files; change Sky Study and re-sync.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = process.argv[2] || join(homedir(), 'Development/sky-study')
const dest = join(root, 'sky/vendor/sky-study')

const FILES = [
  'atmosphere/physics.ts', 'atmosphere/timeOfDay.ts',
  'clouds/cloudModel.ts', 'clouds/shape.ts',
  'engine/Engine.ts',
  'interactions/flight.ts', 'interactions/geometry.ts', 'interactions/picking.ts', 'interactions/strokes.ts',
  'math/rng.ts', 'math/vec.ts',
  'renderer/Renderer.ts', 'renderer/camera.ts', 'renderer/gl.ts',
  'renderer/shaders/accumulate.frag', 'renderer/shaders/common.glsl', 'renderer/shaders/fullscreen.vert',
  'renderer/shaders/noise.frag', 'renderer/shaders/present.frag', 'renderer/shaders/scene.frag', 'renderer/shaders/skyLut.frag',
  'state/scene.ts', 'state/store.ts'
]
const PATCHES = {
  'state/store.ts': [["import { create } from 'zustand';", "import { createStore as create } from 'zustand/vanilla';"]]
}

const commit = execFileSync('git', ['-C', src, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const dirty = execFileSync('git', ['-C', src, 'status', '--porcelain', '--', 'src'], { encoding: 'utf8' }).trim()
await rm(dest, { recursive: true, force: true })
for (const f of FILES) {
  await mkdir(dirname(join(dest, f)), { recursive: true })
  let text = await readFile(join(src, 'src', f), 'utf8')
  for (const [from, to] of PATCHES[f] || []) {
    if (!text.includes(from)) throw new Error(`patch target missing in ${f}: ${from}`)
    text = text.replace(from, to)
  }
  await writeFile(join(dest, f), text)
}
await cp(join(src, 'ATTRIBUTION.md'), join(dest, 'ATTRIBUTION.md'))
await writeFile(join(dest, 'SOURCE.md'), `# Vendored from Sky Study

- Repository: https://github.com/Mariaareadne1/sky-study (same author; no separate licence file in that repo)
- Commit: \`${commit}\`${dirty ? ' (source tree had uncommitted changes under src/)' : ''}
- Copied by \`scripts/sync-sky-study.mjs\`; ${FILES.length} files, verbatim except:
  - \`state/store.ts\`: \`create\` from \`zustand\` → \`createStore\` from \`zustand/vanilla\` (same store API; avoids bundling React).
- Third-party technique credits: see ATTRIBUTION.md in this folder.
`)
console.log(`synced ${FILES.length} files from ${src} @ ${commit.slice(0, 7)}`)
