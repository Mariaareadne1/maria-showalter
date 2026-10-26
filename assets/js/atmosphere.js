/* =============================================================================
   atmosphere.js — sculpted light + contour field behind a region of the page.

   The field is an interference pattern of damped circular waves (the same
   family of solutions as the wave equation behind Iris Resonance), plus one
   broad swell. It is rendered ONCE per size into a canvas: a soft relief
   shading pass (gradient of the field · a light direction) and contour lines
   traced by marching squares. Nothing animates while the pointer is still;
   pointer response is a small damped translation of the finished canvas.

   Atmosphere.mount(host, { mode, sources, anchor, ink })
     host     element that gets an absolutely positioned canvas as first child
     mode     'whisper' | 'balanced' | 'sculptural'
     sources  [{ x, y, a, s, k, p }] in host-normalised coordinates (optional)
     anchor   { x, y, r } normalised focus the lines gather around (optional)
   Returns { setMode(mode), destroy() }.
   ========================================================================== */
(function (global) {
  'use strict'

  var MODES = {
    whisper:    { levels: 9,  lineAlpha: 0.12, shade: 0.010, fragment: 0.55, reach: 1.25, parallax: 3,  width: 0.6 },
    balanced:   { levels: 14, lineAlpha: 0.20, shade: 0.022, fragment: 0.15, reach: 0.85, parallax: 7,  width: 0.75 },
    sculptural: { levels: 20, lineAlpha: 0.28, shade: 0.06,  fragment: 0,    reach: 1.05, parallax: 14, width: 0.85 }
  }

  var DEFAULT_SOURCES = [
    { x: 0.72, y: 0.42, a: 1.0, s: 0.55, k: 15, p: 0 },
    { x: 1.05, y: 0.95, a: 0.6, s: 0.45, k: 19, p: 1.3 },
    { x: 0.30, y: -0.1, a: 0.35, s: 0.5, k: 11, p: 2.1 }
  ]

  var CELL = 6 // css px per marching-squares cell

  function prefersReducedMotion () {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  function coarsePointer () {
    return global.matchMedia && global.matchMedia('(pointer: coarse)').matches
  }

  function hexToRgb (hex) {
    var n = parseInt(String(hex).replace('#', ''), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }

  // Cheap deterministic hash noise, used only to break whisper lines into fragments.
  function hash (x, y) {
    var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
    return h - Math.floor(h)
  }

  function sampleField (sources, aspect, nx, ny) {
    var v = 0
    for (var i = 0; i < sources.length; i++) {
      var s = sources[i]
      var dx = (nx - s.x) * aspect
      var dy = ny - s.y
      var r = Math.sqrt(dx * dx + dy * dy)
      v += s.a * Math.exp(-r / s.s) * Math.cos(s.k * r + s.p)
    }
    var bx = (nx - 0.6) * aspect, by = ny - 0.5
    return v + 0.35 * Math.exp(-(bx * bx + by * by) / 0.35)
  }

  function render (state) {
    var host = state.host, canvas = state.canvas
    var w = host.clientWidth, h = host.clientHeight
    if (!w || !h) return
    var dpr = Math.min(global.devicePixelRatio || 1, 2)
    var pad = MODES.sculptural.parallax * 2 // room for parallax without exposing edges
    var W = w + pad * 2, H = h + pad * 2
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    canvas.style.left = -pad + 'px'
    canvas.style.top = -pad + 'px'

    var m = MODES[state.mode] || MODES.balanced
    var ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    var cols = Math.ceil(W / CELL) + 1, rows = Math.ceil(H / CELL) + 1
    var aspect = W / H
    var grid = new Float32Array(cols * rows)
    var lo = Infinity, hi = -Infinity
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var f = sampleField(state.sources, aspect, (i * CELL) / W, (j * CELL) / H)
        grid[j * cols + i] = f
        if (f < lo) lo = f
        if (f > hi) hi = f
      }
    }

    var ink = hexToRgb(state.ink)
    var anchor = state.anchor

    // Influence of the anchor: lines and relief gather near it and recede.
    function reachAt (x, y) {
      if (!anchor) return 1
      var dx = (x / W - anchor.x) * aspect, dy = y / H - anchor.y
      var d = Math.sqrt(dx * dx + dy * dy) / (anchor.r * m.reach)
      return Math.max(0, 1 - d * d)
    }

    // 1. Relief shading at low resolution, upscaled with smoothing.
    var sw = cols - 1, sh = rows - 1
    var shadeCanvas = document.createElement('canvas')
    shadeCanvas.width = sw
    shadeCanvas.height = sh
    var sctx = shadeCanvas.getContext('2d')
    var img = sctx.createImageData(sw, sh)
    var lx = -0.55, ly = -0.75 // light from upper left
    var span = hi - lo || 1
    for (j = 0; j < sh; j++) {
      for (i = 0; i < sw; i++) {
        var gx = (grid[j * cols + i + 1] - grid[j * cols + i]) / span
        var gy = (grid[(j + 1) * cols + i] - grid[j * cols + i]) / span
        var lit = -(gx * lx + gy * ly) * 18 // positive = facing the light
        var k = reachAt(i * CELL, j * CELL)
        var o = (j * sw + i) * 4
        if (lit > 0) { img.data[o] = 255; img.data[o + 1] = 255; img.data[o + 2] = 255 } else { img.data[o] = ink[0] * 0.4; img.data[o + 1] = ink[1] * 0.4; img.data[o + 2] = ink[2] * 0.5 }
        img.data[o + 3] = Math.min(255, Math.abs(lit) * 255 * m.shade * 3 * k)
      }
    }
    sctx.putImageData(img, 0, 0)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(shadeCanvas, 0, 0, sw * CELL, sh * CELL)

    // 2. Contour lines by marching squares, one path per level.
    ctx.lineWidth = m.width
    ctx.lineCap = 'round'
    for (var L = 1; L < m.levels; L++) {
      var iso = lo + (span * L) / m.levels
      // Mid-range levels are the visible "bands"; extremes fade.
      var levelWeight = Math.sin((Math.PI * L) / m.levels)
      ctx.beginPath()
      for (j = 0; j < rows - 1; j++) {
        for (i = 0; i < cols - 1; i++) {
          var a = grid[j * cols + i], b = grid[j * cols + i + 1]
          var c = grid[(j + 1) * cols + i + 1], d = grid[(j + 1) * cols + i]
          var idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0)
          if (idx === 0 || idx === 15) continue
          var x0 = i * CELL, y0 = j * CELL
          if (reachAt(x0, y0) <= 0.02) continue
          if (m.fragment && hash(Math.floor(i / 6), Math.floor(j / 6) + L * 13) < m.fragment) continue
          var t
          t = (iso - a) / (b - a); var tx = x0 + t * CELL, ty = y0
          t = (iso - b) / (c - b); var rx = x0 + CELL, ry = y0 + t * CELL
          t = (iso - d) / (c - d); var bx2 = x0 + t * CELL, by2 = y0 + CELL
          t = (iso - a) / (d - a); var lx2 = x0, ly2 = y0 + t * CELL
          switch (idx) {
            case 1: case 14: ctx.moveTo(lx2, ly2); ctx.lineTo(bx2, by2); break
            case 2: case 13: ctx.moveTo(bx2, by2); ctx.lineTo(rx, ry); break
            case 3: case 12: ctx.moveTo(lx2, ly2); ctx.lineTo(rx, ry); break
            case 4: case 11: ctx.moveTo(tx, ty); ctx.lineTo(rx, ry); break
            case 6: case 9: ctx.moveTo(tx, ty); ctx.lineTo(bx2, by2); break
            case 7: case 8: ctx.moveTo(lx2, ly2); ctx.lineTo(tx, ty); break
            case 5: ctx.moveTo(lx2, ly2); ctx.lineTo(tx, ty); ctx.moveTo(bx2, by2); ctx.lineTo(rx, ry); break
            case 10: ctx.moveTo(tx, ty); ctx.lineTo(rx, ry); ctx.moveTo(lx2, ly2); ctx.lineTo(bx2, by2); break
          }
        }
      }
      ctx.strokeStyle = 'rgba(' + ink[0] + ',' + ink[1] + ',' + ink[2] + ',' + (m.lineAlpha * (0.35 + 0.65 * levelWeight)).toFixed(3) + ')'
      ctx.stroke()
    }

    // Lines are masked toward the anchor with a radial fade so they recede softly.
    if (anchor) {
      ctx.globalCompositeOperation = 'destination-in'
      var g = ctx.createRadialGradient(anchor.x * W, anchor.y * H, 0, anchor.x * W, anchor.y * H, anchor.r * m.reach * H * 1.1)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(0.6, 'rgba(0,0,0,0.75)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'
    }
    state.canvas.dataset.mode = state.mode
  }

  function mount (host, opts) {
    if (typeof host === 'string') host = document.querySelector(host)
    if (!host) return null
    opts = opts || {}
    var canvas = document.createElement('canvas')
    canvas.className = 'atmosphere'
    canvas.setAttribute('aria-hidden', 'true')
    // max-width:none — the canvas is deliberately larger than its host (parallax margin).
    // The mask fades all four edges so the field never ends on a hard line.
    canvas.style.cssText = 'position:absolute;pointer-events:none;z-index:0;max-width:none;will-change:transform;' +
      '-webkit-mask-image:linear-gradient(to bottom,transparent,#000 8%,#000 82%,transparent),linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);-webkit-mask-composite:source-in;' +
      'mask-image:linear-gradient(to bottom,transparent,#000 8%,#000 82%,transparent),linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);mask-composite:intersect'
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative'
    host.insertBefore(canvas, host.firstChild)

    var state = {
      host: host,
      canvas: canvas,
      mode: MODES[opts.mode] ? opts.mode : 'balanced',
      sources: opts.sources || DEFAULT_SOURCES,
      anchor: opts.anchor || null,
      ink: opts.ink || '#2348C7'
    }

    var resizeTimer = 0, lastW = 0, lastH = 0
    var ro = new ResizeObserver(function () {
      // Height changes from late-loading content re-render only when meaningful.
      if (Math.abs(host.clientWidth - lastW) < 2 && Math.abs(host.clientHeight - lastH) < 24) return
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () { lastW = host.clientWidth; lastH = host.clientHeight; render(state) }, 120)
    })
    ro.observe(host)
    lastW = host.clientWidth; lastH = host.clientHeight
    render(state)

    // Pointer parallax: damped spring toward a target offset; rAF only while moving.
    var pos = { x: 0, y: 0 }, vel = { x: 0, y: 0 }, target = { x: 0, y: 0 }, raf = 0
    var interactive = !prefersReducedMotion() && !coarsePointer()
    function step () {
      var amp = MODES[state.mode].parallax
      var k = 0.06, damp = 0.78
      vel.x = (vel.x + (target.x * amp - pos.x) * k) * damp
      vel.y = (vel.y + (target.y * amp - pos.y) * k) * damp
      pos.x += vel.x
      pos.y += vel.y
      canvas.style.transform = 'translate3d(' + pos.x.toFixed(2) + 'px,' + pos.y.toFixed(2) + 'px,0)'
      if (Math.abs(vel.x) + Math.abs(vel.y) > 0.01 || Math.abs(target.x * amp - pos.x) > 0.05) raf = requestAnimationFrame(step)
      else raf = 0
    }
    function onMove (e) {
      var r = host.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight) return
      // Opposite to the pointer, as if the relief sits slightly below the page.
      target.x = -((e.clientX - r.left) / r.width - 0.5)
      target.y = -((e.clientY - r.top) / r.height - 0.5)
      if (!raf) raf = requestAnimationFrame(step)
    }
    if (interactive) global.addEventListener('pointermove', onMove, { passive: true })

    return {
      setMode: function (mode) { if (MODES[mode]) { state.mode = mode; render(state) } },
      destroy: function () {
        ro.disconnect()
        clearTimeout(resizeTimer)
        global.removeEventListener('pointermove', onMove)
        cancelAnimationFrame(raf)
        canvas.remove()
      }
    }
  }

  global.Atmosphere = { mount: mount, MODES: Object.keys(MODES) }
})(window)
