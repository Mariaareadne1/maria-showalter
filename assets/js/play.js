/* play.js — the homepage Meadow window. Nothing loads until the visitor asks: then the
   self-hosted build (/play/meadow/, same origin) replaces the poster in place. */
(function () {
  'use strict'
  document.querySelectorAll('[data-play]').forEach(function (frame) {
    var btn = frame.querySelector('[data-play-start]')
    if (!btn) return
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe')
      f.src = '/play/meadow/'
      f.title = 'Meadow — draw a loop on the grass to make a sheep'
      f.setAttribute('allow', 'fullscreen')
      f.className = 'play-live'
      f.addEventListener('load', function () { frame.classList.add('is-live'); try { f.contentWindow.focus() } catch (e) {} })
      frame.appendChild(f)
      frame.classList.add('is-loading')
      btn.setAttribute('aria-hidden', 'true')
      btn.tabIndex = -1
      f.focus()
    })
  })
})()
