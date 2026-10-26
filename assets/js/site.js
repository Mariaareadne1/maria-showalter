/* site.js — shared behaviour: phone menu, muted video previews, disclosure rows, media errors. */
(function () {
  'use strict'
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  /* Phone menu: native modal <dialog> gives focus containment and Escape; we restore focus. */
  function initMenu () {
    var btn = document.querySelector('[data-menu-open]')
    var dlg = document.getElementById('menu')
    if (!btn || !dlg) return
    // Without <dialog> support (Safari < 15.4), show the plain nav instead of a dead button.
    if (typeof dlg.showModal !== 'function') { document.documentElement.classList.add('no-dialog'); return }
    btn.addEventListener('click', function () {
      dlg.showModal()
      btn.setAttribute('aria-expanded', 'true')
      var first = dlg.querySelector('a, button')
      if (first) first.focus()
    })
    dlg.addEventListener('close', function () { btn.setAttribute('aria-expanded', 'false'); btn.focus() })
    dlg.querySelectorAll('[data-menu-close], a').forEach(function (el) {
      el.addEventListener('click', function () { dlg.close() })
    })
    // Clicking the backdrop (the dialog element itself, outside .inner) closes it.
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close() })
  }

  /* Muted previews: lazy, play only on screen, pause offscreen, explicit toggle, poster under reduced motion. */
  function initVideos () {
    var vids = document.querySelectorAll('video[data-inline]')
    if (!vids.length) return
    var userPaused = new WeakSet()
    vids.forEach(function (v) {
      v.muted = true
      v.addEventListener('error', function () { markError(v.closest('.media'), 'Video unavailable — open the project for the full view.') }, true)
      var host = v.closest('.media')
      if (!host) return
      var b = document.createElement('button')
      b.type = 'button'
      b.className = 'vid-toggle'
      function label () { var playing = !v.paused; b.textContent = playing ? '❚❚ Pause' : '▶ Play'; b.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + (v.getAttribute('aria-label') || 'preview')) }
      b.addEventListener('click', function () {
        if (v.paused) { userPaused.delete(v); if (v.preload === 'none') v.preload = 'auto'; v.play().catch(function () {}) } else { userPaused.add(v); v.pause() }
      })
      v.addEventListener('play', label)
      v.addEventListener('pause', label)
      label()
      host.appendChild(b)
    })
    if (!('IntersectionObserver' in window)) return
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target
        if (en.isIntersecting && !reduceMotion.matches && !userPaused.has(v)) {
          if (v.preload === 'none') v.preload = 'auto'
          v.play().catch(function () {})
        } else if (!en.isIntersecting) v.pause()
      })
    }, { threshold: 0.4 })
    vids.forEach(function (v) { io.observe(v) })
  }

  function markError (host, msg) {
    if (!host) return
    host.classList.add('is-error')
    host.setAttribute('data-error', msg)
  }
  function initImages () {
    document.querySelectorAll('.media img').forEach(function (img) {
      function fail () { img.style.visibility = 'hidden'; markError(img.closest('.media'), 'Image unavailable') }
      if (img.complete && img.naturalWidth === 0 && img.src) fail()
      else img.addEventListener('error', fail)
    })
  }

  /* Disclosure rows (work index): button[aria-expanded][aria-controls]. */
  function initDisclosure () {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-disclosure]')
      if (!b) return
      var panel = document.getElementById(b.getAttribute('aria-controls'))
      if (!panel) return
      var open = b.getAttribute('aria-expanded') === 'true'
      b.setAttribute('aria-expanded', String(!open))
      panel.hidden = open
    })
  }

  function init () { initMenu(); initVideos(); initImages(); initDisclosure() }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
})()
