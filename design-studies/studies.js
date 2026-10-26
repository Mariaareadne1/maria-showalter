/* Study review bar + background-mode switching + inline video behaviour.
   Preview-only. The background mode is a design-review control, not a site setting. */
(function () {
  'use strict'
  var STUDIES = [['a', 'A · Editorial Index'], ['b', 'B · Exhibition Catalogue'], ['c', 'C · Field Notes']]
  var params = new URLSearchParams(location.search)
  var mode = params.get('bg') || document.body.dataset.bg || 'balanced'
  var current = document.body.dataset.study
  var handles = []

  function mountAtmosphere () {
    if (!window.Atmosphere) return
    document.querySelectorAll('[data-atmosphere]').forEach(function (host) {
      var opts = {}
      try { opts = JSON.parse(host.dataset.atmosphere || '{}') } catch (e) { console.error(e) }
      opts.mode = mode
      handles.push(window.Atmosphere.mount(host, opts))
    })
  }

  function bar () {
    var el = document.createElement('nav')
    el.className = 'study-bar'
    el.setAttribute('aria-label', 'Design study review controls')
    var html = '<span class="group"><a href="./">Studies</a></span><span class="group">'
    STUDIES.forEach(function (s) {
      html += '<a href="' + s[0] + '.html' + (mode !== 'balanced' ? '?bg=' + mode : '') + '"' + (s[0] === current ? ' aria-current="page"' : '') + '>' + s[1].split(' · ')[0] + '<span class="hide-sm"> · ' + s[1].split(' · ')[1] + '</span></a>'
    })
    html += '</span><span class="group" role="group" aria-label="Background intensity"><span class="label hide-sm">bg</span>'
    ;['whisper', 'balanced', 'sculptural'].forEach(function (m) {
      html += '<button type="button" data-mode="' + m + '" aria-pressed="' + (m === mode) + '">' + m + '</button>'
    })
    html += '</span>'
    el.innerHTML = html
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-mode]')
      if (!b) return
      mode = b.dataset.mode
      handles.forEach(function (h) { h && h.setMode(mode) })
      el.querySelectorAll('button[data-mode]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.mode === mode)) })
      var u = new URL(location.href); u.searchParams.set('bg', mode); history.replaceState(null, '', u)
      el.querySelectorAll('a[aria-current], .group a').forEach(function (a) { if (/^[abc]\.html/.test(a.getAttribute('href'))) a.setAttribute('href', a.getAttribute('href').split('?')[0] + '?bg=' + mode) })
    })
    document.body.appendChild(el)
  }

  // Muted previews play only while on screen and only without reduced motion.
  function videos () {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    var vids = document.querySelectorAll('video[data-inline]')
    if (reduce || !('IntersectionObserver' in window)) return
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target
        if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(function () {}) } else v.pause()
      })
    }, { threshold: 0.35 })
    vids.forEach(function (v) { io.observe(v) })
  }

  mountAtmosphere()
  bar()
  videos()
})()
