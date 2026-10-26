/* =============================================================================
   dj.js — the homepage two-deck mixer.

   Audio graph per deck (unchanged from the original site, plus a volume stage):
     AudioBufferSource(loop) → lowpass → highpass → analyser → volume → crossfade gain → master analyser → out
   Filter curves and the equal-power crossfade law are the original ones.

   Changes from the original, so every control maps to real audio:
     · Tempo + Sync now set playbackRate (the original only changed labels). Pitch follows.
     · Play/Pause resumes from the paused position; Position seeks. (Original restarted from 0.)
     · Platter drag nudges the rate of a playing deck (original only rotated the drawing).
     · Per-deck volume. Status text instead of alert(). Old nodes are disconnected on reload.
   The AudioContext is created on the first user gesture; nothing plays until Play is pressed.
   ========================================================================== */
(function () {
  'use strict'
  var root = document.getElementById('djDeck')
  if (!root) return

  var TRACKS = [
    { file: 'track-yummy.mp3', label: 'Yummy — Ayesha Erotica', short: 'Yummy', bpm: 96 },
    { file: 'track-paper-planes.mp3', label: 'Paper Planes — M.I.A.', short: 'Paper Planes', bpm: 98 },
    { file: 'track-no-scrubs.mp3', label: 'No Scrubs — TLC', short: 'No Scrubs', bpm: 100 },
    { file: 'track-bills.mp3', label: "Bills Bills Bills — Destiny's Child", short: 'Bills', bpm: 100 },
    { file: 'track-blinding-lights.mp3', label: 'Blinding Lights — The Weeknd', short: 'Blinding Lights', bpm: 171 },
    { file: 'track-as-it-was.mp3', label: 'As It Was — Harry Styles', short: 'As It Was', bpm: 174 }
  ]
  var NUDGE_MAX = 0.08
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  var ctx = null, master = null
  var decks = { A: makeDeck('A'), B: makeDeck('B') }
  var tempo = 100, synced = false, raf = 0
  var $ = function (sel) { return root.querySelector(sel) }

  function makeDeck (id) {
    return { id: id, track: null, buffer: null, src: null, nodes: null, playing: false, offset: 0, startedAt: 0, rate: 1, nudge: 0, angle: 0, loadToken: 0 }
  }

  function audio () {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext
      if (!AC) throw new Error('Web Audio is not supported in this browser')
      ctx = new AC()
      master = ctx.createAnalyser()
      master.fftSize = 256
      master.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  function status (d, text) { $('[data-status="' + d.id + '"]').textContent = text }

  /* ---------- loading ---------- */
  function populate (sel) {
    sel.innerHTML = '<option value="">Choose a track</option>' + TRACKS.map(function (t) {
      return '<option value="' + t.file + '">' + t.label + '</option>'
    }).join('')
  }

  function teardown (d) {
    if (d.src) { try { d.src.stop() } catch (e) { /* already stopped */ } d.src.disconnect(); d.src = null }
    if (d.nodes) { Object.keys(d.nodes).forEach(function (k) { d.nodes[k].disconnect() }); d.nodes = null }
    d.playing = false
  }

  function load (d, file) {
    var track = TRACKS.filter(function (t) { return t.file === file })[0]
    teardown(d)
    d.buffer = null; d.offset = 0; d.track = track || null
    updateDeckUI(d)
    if (!track) { status(d, 'No track loaded'); return Promise.resolve() }
    var c
    try { c = audio() } catch (e) { status(d, e.message); return Promise.resolve() }
    var token = ++d.loadToken
    status(d, 'Loading ' + track.short + '…')
    return fetch('/' + track.file)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer() })
      .then(function (ab) { return new Promise(function (res, rej) { c.decodeAudioData(ab, res, rej) }) })
      .then(function (buf) {
        if (token !== d.loadToken) return // a newer selection won
        d.buffer = buf
        var lp = c.createBiquadFilter(); lp.type = 'lowpass'
        var hp = c.createBiquadFilter(); hp.type = 'highpass'
        var an = c.createAnalyser(); an.fftSize = 256
        var vol = c.createGain(), xf = c.createGain()
        lp.connect(hp); hp.connect(an); an.connect(vol); vol.connect(xf); xf.connect(master)
        d.nodes = { lp: lp, hp: hp, an: an, vol: vol, xf: xf }
        applyFilters(); applyVolume(d); applyCrossfade(); applyRate(d)
        status(d, 'Ready · ' + track.short)
        updateDeckUI(d)
      })
      .catch(function (err) {
        if (token !== d.loadToken) return
        console.error('dj: could not load', track.file, err)
        d.track = null
        status(d, 'Couldn’t load this track. Try another.')
        updateDeckUI(d)
      })
  }

  /* ---------- transport ---------- */
  function position (d) {
    if (!d.buffer) return 0
    var p = d.playing ? d.offset + (ctx.currentTime - d.startedAt) * d.rate : d.offset
    return ((p % d.buffer.duration) + d.buffer.duration) % d.buffer.duration
  }

  function start (d) {
    var c = audio()
    var src = c.createBufferSource()
    src.buffer = d.buffer
    src.loop = true
    src.playbackRate.value = d.rate
    src.connect(d.nodes.lp)
    src.start(0, position(d))
    d.src = src
    d.startedAt = c.currentTime
    d.playing = true
  }

  function stopSource (d) {
    if (!d.src) return
    d.offset = position(d)
    try { d.src.stop() } catch (e) { /* already stopped */ }
    d.src.disconnect()
    d.src = null
    d.playing = false
  }

  function toggle (d) {
    if (!d.buffer) { status(d, 'Choose a track first'); return }
    if (d.playing) stopSource(d); else start(d)
    status(d, (d.playing ? 'Playing · ' : 'Paused · ') + d.track.short)
    updateDeckUI(d)
    loop()
  }

  function seek (d, frac) {
    if (!d.buffer) return
    var wasPlaying = d.playing
    if (wasPlaying) stopSource(d)
    d.offset = frac * d.buffer.duration
    if (wasPlaying) start(d)
    updateDeckUI(d)
  }

  /* ---------- rate: tempo, sync, nudge ---------- */
  function baseRate (d) { return synced && d.track ? tempo / d.track.bpm : 1 }
  function applyRate (d) {
    var r = baseRate(d) * (1 + d.nudge)
    if (d.playing && ctx) { d.offset = position(d); d.startedAt = ctx.currentTime }
    d.rate = r
    if (d.src) d.src.playbackRate.setTargetAtTime(r, ctx.currentTime, 0.015)
    var bpmEl = $('[data-bpm="' + d.id + '"]')
    bpmEl.textContent = d.track ? Math.round(d.track.bpm * r) : '—'
  }

  /* ---------- mixer (original curves) ---------- */
  function applyFilters () {
    var lpv = +$('#lp').value, hpv = +$('#hp').value
    var lf = 200 + Math.pow(lpv / 100, 2) * 17800
    var hf = 20 + Math.pow(hpv / 100, 2) * 800
    ;['A', 'B'].forEach(function (k) {
      var n = decks[k].nodes
      if (!n) return
      n.lp.frequency.setTargetAtTime(lf, ctx.currentTime, 0.01)
      n.hp.frequency.setTargetAtTime(hf, ctx.currentTime, 0.01)
    })
  }
  function applyCrossfade () {
    var f = +$('#xf').value / 100
    if (decks.A.nodes) decks.A.nodes.xf.gain.setTargetAtTime(Math.cos(f * Math.PI / 2), ctx.currentTime, 0.01)
    if (decks.B.nodes) decks.B.nodes.xf.gain.setTargetAtTime(Math.cos((1 - f) * Math.PI / 2), ctx.currentTime, 0.01)
  }
  function applyVolume (d) {
    if (!d.nodes) return
    var v = +$('[data-vol="' + d.id + '"]').value / 100
    d.nodes.vol.gain.setTargetAtTime(v * v, ctx.currentTime, 0.01)
  }

  /* ---------- UI ---------- */
  function fmt (s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }
  function updateDeckUI (d) {
    var play = $('[data-play="' + d.id + '"]')
    var seekEl = $('[data-seek="' + d.id + '"]')
    play.disabled = !d.buffer
    seekEl.disabled = !d.buffer
    play.textContent = d.playing ? 'Pause' : 'Play'
    play.setAttribute('aria-label', (d.playing ? 'Pause' : 'Play') + ' deck ' + d.id)
    play.classList.toggle('is-on', d.playing)
    root.querySelector('.unit[data-deck="' + d.id + '"]').classList.toggle('is-playing', d.playing)
    if (d.buffer && document.activeElement !== seekEl) seekEl.value = Math.round(position(d) / d.buffer.duration * 1000)
    $('[data-time="' + d.id + '"]').textContent = d.buffer ? fmt(position(d)) + ' / ' + fmt(d.buffer.duration) : '0:00'
    applyRate(d)
  }

  var meter = document.getElementById('meter'), mctx = meter.getContext('2d'), bins = new Uint8Array(128)
  function drawMeter () {
    var w = meter.width, h = meter.height
    mctx.clearRect(0, 0, w, h)
    ;['A', 'B'].forEach(function (k, row) {
      var n = decks[k].nodes
      var level = 0
      if (n && decks[k].playing) { n.an.getByteFrequencyData(bins); for (var i = 0; i < 64; i++) level += bins[i]; level /= 64 * 255 }
      var y = row * (h / 2) + 4, bh = h / 2 - 8
      mctx.fillStyle = 'rgba(22,26,34,0.10)'; mctx.fillRect(0, y, w, bh)
      mctx.fillStyle = '#2348C7'; mctx.fillRect(0, y, Math.round(w * Math.min(1, level * 1.6)), bh)
    })
  }

  function loop () {
    if (raf) return
    var last = performance.now()
    function frame (t) {
      var dt = (t - last) / 1000; last = t
      var any = false
      ;['A', 'B'].forEach(function (k) {
        var d = decks[k]
        if (!d.playing) return
        any = true
        if (!reduceMotion.matches) {
          d.angle = (d.angle + dt * 200 * d.rate) % 360 // ≈ 33⅓ rpm at rate 1
          root.querySelector('[data-platter="' + k + '"] .disc').style.transform = 'rotate(' + d.angle.toFixed(1) + 'deg)'
        }
        if (Math.floor(t / 250) !== Math.floor((t - dt * 1000) / 250)) updateDeckUI(d)
      })
      drawMeter()
      raf = any ? requestAnimationFrame(frame) : 0
    }
    raf = requestAnimationFrame(frame)
  }

  /* ---------- wiring ---------- */
  ;['A', 'B'].forEach(function (k) {
    var d = decks[k]
    var sel = document.getElementById('sel' + k)
    populate(sel)
    sel.addEventListener('change', function () { load(d, sel.value) })
    $('[data-play="' + k + '"]').addEventListener('click', function () { toggle(d) })
    var seekEl = $('[data-seek="' + k + '"]')
    seekEl.addEventListener('change', function () { seek(d, +seekEl.value / 1000) })
    $('[data-vol="' + k + '"]').addEventListener('input', function () { applyVolume(d) })

    // Platter: drag horizontally to nudge a playing deck ±8 %. Releasing returns to the base rate.
    var platter = $('[data-platter="' + k + '"]'), x0 = 0, dragging = false
    platter.addEventListener('pointerdown', function (e) {
      if (!d.playing) return
      dragging = true; x0 = e.clientX; platter.setPointerCapture(e.pointerId); platter.classList.add('is-held')
    })
    platter.addEventListener('pointermove', function (e) {
      if (!dragging) return
      d.nudge = Math.max(-NUDGE_MAX, Math.min(NUDGE_MAX, (e.clientX - x0) * 0.001))
      applyRate(d)
    })
    function release () { if (!dragging) return; dragging = false; d.nudge = 0; applyRate(d); platter.classList.remove('is-held') }
    platter.addEventListener('pointerup', release)
    platter.addEventListener('pointercancel', release)
  })

  $('#tempo').addEventListener('input', function () {
    tempo = +this.value
    document.getElementById('tempoOut').textContent = tempo
    applyRate(decks.A); applyRate(decks.B)
  })
  $('#syncBtn').addEventListener('click', function () {
    synced = !synced
    this.setAttribute('aria-pressed', String(synced))
    if (synced && decks.A.track && decks.B.track && !this.dataset.touched) {
      // First sync with two tracks: start from the midpoint of their tempos (original behaviour).
      tempo = Math.round((decks.A.track.bpm + decks.B.track.bpm) / 2)
      $('#tempo').value = tempo
      document.getElementById('tempoOut').textContent = tempo
    }
    this.dataset.touched = '1'
    applyRate(decks.A); applyRate(decks.B)
  })
  $('#lp').addEventListener('input', function () { if (ctx) applyFilters() })
  $('#hp').addEventListener('input', function () { if (ctx) applyFilters() })
  $('#xf').addEventListener('input', function () { if (ctx) applyCrossfade() })

  root.querySelectorAll('[data-pair]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pair = btn.dataset.pair.split(',')
      document.getElementById('selA').value = pair[0]
      document.getElementById('selB').value = pair[1]
      root.querySelectorAll('[data-pair]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)) })
      load(decks.A, pair[0]); load(decks.B, pair[1])
    })
    btn.setAttribute('aria-pressed', 'false')
  })

  window.addEventListener('pagehide', function () {
    teardown(decks.A); teardown(decks.B)
    if (ctx) { ctx.close(); ctx = null; master = null }
  })

  // Read-only hook for the automated tests (tests/dj.mjs). Exposes state, not controls.
  window.__dj = {
    state: function () {
      function s (d) {
        return d.nodes ? { playing: d.playing, rate: d.rate, position: position(d), lp: d.nodes.lp.frequency.value, hp: d.nodes.hp.frequency.value, vol: d.nodes.vol.gain.value, xf: d.nodes.xf.gain.value } : { playing: d.playing, loaded: false }
      }
      return { ctx: ctx ? ctx.state : 'none', synced: synced, tempo: tempo, A: s(decks.A), B: s(decks.B) }
    }
  }
})()
