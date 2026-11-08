/* sky-page.js — the parts of the sky that must work without WebGL or ES modules.
   - Shows the visitor's own sky still (saved by the live sky) or the shipped one.
   - Turns scroll position into one progress value, --sky-p (0 open sky → 1 reading surface),
     used by CSS for panel opacity and the veil, and broadcast to the live sky as `sky:progress`.
   Pages set the range with [data-sky-end] (the element whose top is "fully off-white");
   pages without it use a fixed resting value from <html data-sky-rest="0.8">. */
(function () {
  'use strict'
  var html = document.documentElement
  var STILL_KEY = 'mariashowalter.com/sky/still/v1'

  function applyStill () {
    var el = document.querySelector('.sky-still')
    if (!el) return
    var url = null
    try { url = localStorage.getItem(STILL_KEY) } catch (e) { url = null }
    if (url && url.indexOf('data:image/jpeg;base64,') === 0) el.style.backgroundImage = 'url("' + url + '")'
  }

  var raf = 0
  var last = -1
  function measure () {
    raf = 0
    var end = document.querySelector('[data-sky-end]')
    var p
    if (!end) {
      p = parseFloat(html.getAttribute('data-sky-rest') || '0.8')
    } else {
      var top = end.getBoundingClientRect().top + window.scrollY
      var span = Math.max(1, top - window.innerHeight * 0.45)
      p = Math.min(1, Math.max(0, window.scrollY / span))
    }
    if (Math.abs(p - last) < 0.002) return
    last = p
    html.style.setProperty('--sky-p', p.toFixed(3))
    html.classList.toggle('sky-far', p > 0.85)
    html.classList.toggle('sky-top', p < 0.04)
    window.__skyProgress = p
    window.dispatchEvent(new CustomEvent('sky:progress', { detail: p }))
  }
  function schedule () { if (!raf) raf = requestAnimationFrame(measure) }

  applyStill()
  measure()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  window.addEventListener('load', schedule)
  window.addEventListener('storage', function (e) { if (e.key === STILL_KEY) applyStill() })
})()
