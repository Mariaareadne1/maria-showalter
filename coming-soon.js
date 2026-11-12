/*
 * Temporary "coming soon..." cover.
 * The real site is untouched underneath — to take this down, delete the
 * <script src="coming-soon.js"></script> line from each page (or this file).
 */
(function () {
  var css =
    "@import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');" +
    "html,body{background:#f4f1ea!important;overflow:hidden!important;cursor:auto!important;}" +
    "body>*:not(#coming-soon){display:none!important;}" +
    "#coming-soon{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;" +
    "align-items:center;justify-content:center;gap:28px;background:#f4f1ea;color:#111;" +
    "font-family:'Silkscreen',ui-monospace,Menlo,monospace;cursor:auto;}" +
    "#coming-soon .cs-text{font-size:clamp(18px,4vw,28px);letter-spacing:.08em;}" +
    "#coming-soon .cs-dot{animation:cs-blink 1.2s steps(1) infinite;}" +
    "#coming-soon .cs-dot:nth-child(2){animation-delay:.2s}" +
    "#coming-soon .cs-dot:nth-child(3){animation-delay:.4s}" +
    "#coming-soon .cs-bar{display:flex;gap:4px;padding:5px;border:4px solid #111;image-rendering:pixelated;}" +
    "#coming-soon .cs-bar i{width:14px;height:14px;background:#111;opacity:0;" +
    "animation-duration:2.4s;animation-timing-function:steps(1);animation-iteration-count:infinite;}" +
    "@keyframes cs-blink{0%{opacity:0}50%{opacity:1}}" +
    "@media (prefers-reduced-motion:reduce){#coming-soon *{animation:none!important;opacity:1!important}}";

  var BLOCKS = 10;
  // Each block lights up one step after the previous, then all reset together.
  var blockCss = "";
  for (var i = 0; i < BLOCKS; i++) {
    blockCss += "#coming-soon .cs-bar i:nth-child(" + (i + 1) + "){animation-name:cs-fill-" + i + "}" +
      "@keyframes cs-fill-" + i + "{0%{opacity:0}" + Math.round(((i + 1) / (BLOCKS + 2)) * 100) +
      "%{opacity:1}92%{opacity:1}100%{opacity:0}}";
  }
  css += blockCss;

  var style = document.createElement("style");
  style.id = "coming-soon-style";
  style.textContent = css;
  document.head.appendChild(style);

  function mount() {
    if (document.getElementById("coming-soon")) return;
    var el = document.createElement("div");
    el.id = "coming-soon";
    el.setAttribute("role", "status");
    el.innerHTML =
      '<div class="cs-bar" aria-hidden="true">' + new Array(BLOCKS + 1).join("<i></i>") + "</div>" +
      '<div class="cs-text">coming soon<span class="cs-dot">.</span><span class="cs-dot">.</span><span class="cs-dot">.</span></div>';
    document.body.appendChild(el);
    document.title = "coming soon...";
    // Silence any media the hidden page might start.
    var media = document.querySelectorAll("audio,video");
    for (var m = 0; m < media.length; m++) { try { media[m].pause(); } catch (e) {} }
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
