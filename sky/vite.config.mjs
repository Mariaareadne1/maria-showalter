// Builds the portfolio sky (Sky Study engine + portfolio adapter) into one ES module:
//   npx vite build -c sky/vite.config.mjs   →  assets/sky/portfolio-sky.js
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  root: here('.'),
  publicDir: false,
  assetsInclude: ['**/*.glsl'],
  build: {
    outDir: here('../assets/sky'),
    emptyOutDir: false,
    target: 'es2022',
    sourcemap: false,
    lib: { entry: here('src/main.ts'), formats: ['es'], fileName: () => 'portfolio-sky.js' }
  }
})
