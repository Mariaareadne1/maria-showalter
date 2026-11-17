/* glass-light.js — one spring, one rAF: the light on every .glass element follows the
   pointer a little, as the hero's WebGL panel does. Sleeps when settled; off under
   reduced motion. */
(function () {
  'use strict'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  var target = { x: 0.3, y: 0 }, cur = { x: 0.3, y: 0 }, vel = { x: 0, y: 0 }
  var raf = 0, last = 0
  function tick (now) {
    var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now
    var w = 2 * Math.PI * 0.9, k = w * w, c = 2 * 0.85 * w
    ;['x', 'y'].forEach(function (a) {
      vel[a] += (-k * (cur[a] - target[a]) - c * vel[a]) * dt
      cur[a] += vel[a] * dt
    })
    var els = document.querySelectorAll('.glass')
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight) continue
      // light from the upper left, leaning toward the pointer
      var lx = 18 + (cur.x * innerWidth - r.left) / Math.max(1, r.width) * 30
      els[i].style.setProperty('--lx', Math.max(-20, Math.min(120, lx)).toFixed(1) + '%')
    }
    var moving = Math.abs(cur.x - target.x) + Math.abs(cur.y - target.y) + Math.abs(vel.x) + Math.abs(vel.y) > 1e-4
    raf = moving ? requestAnimationFrame(tick) : 0
    if (!moving) last = 0
  }
  function wake () { if (!raf) raf = requestAnimationFrame(tick) }
  addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; target.x = e.clientX / innerWidth; target.y = e.clientY / innerHeight; wake() }, { passive: true })
  addEventListener('scroll', wake, { passive: true })
  wake()
})()
