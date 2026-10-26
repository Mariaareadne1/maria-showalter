/* =============================================================================
   hero-slot.js — integration boundary for the owner's halftone portrait.

   The engine (halftone/halftone-cover.js, window.HalftoneCover) is a separate,
   artist-owned project and is NOT part of this branch. This file never edits
   or re-implements it. When a page also loads that script, every element with
   [data-halftone-slot] is handed to HalftoneCover.mount() and its static
   fallback is hidden. Without the engine, the fallback stays: an authentic
   existing photograph, never a generated likeness.

   To integrate after review, add before this script:
     <script src="/halftone/halftone-cover.js"></script>
   Clip paths come from the engine's own DEFAULTS unless the slot sets
   data-halftone-config='{"layers":[...]}'.
   ========================================================================== */
(function () {
  'use strict'
  function mountAll () {
    var slots = document.querySelectorAll('[data-halftone-slot]')
    if (!slots.length) return
    var engine = window.HalftoneCover
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i]
      if (!engine || typeof engine.mount !== 'function') { slot.dataset.state = 'fallback'; continue }
      var config
      try { config = slot.dataset.halftoneConfig ? JSON.parse(slot.dataset.halftoneConfig) : undefined } catch (e) {
        console.error('hero-slot: invalid data-halftone-config', e)
      }
      var stage = slot.querySelector('[data-halftone-stage]') || slot
      try {
        engine.mount(stage, config)
        slot.dataset.state = 'live'
      } catch (e) {
        console.error('hero-slot: HalftoneCover.mount failed; keeping the fallback', e)
        slot.dataset.state = 'fallback'
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll)
  else mountAll()
})()
