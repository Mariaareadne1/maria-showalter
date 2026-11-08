import { GlassLayer, type GlassFrame } from './GlassLayer';
import { JellyState } from './springs';
import { DEFAULT_TREATMENT, TREATMENT_ORDER, TREATMENTS, type Treatment } from './treatments';

/**
 * The glass panel. Inserts a clipped, sticky canvas behind the sheet's content and
 * draws the slab into it. The canvas is `position: sticky` inside a wrapper clipped
 * to the sheet, so the compositor keeps its edges locked to the sheet while
 * scrolling; only the sky seen through it is computed from (slightly older) layout.
 *
 * Without WebGL 2, or with reduced transparency / more contrast / forced colours,
 * nothing is inserted and the CSS glass in sky.css stays.
 */

interface EngineLike {
  onAfterRender(fn: (canvas: HTMLCanvasElement) => void): () => void;
}

declare global {
  interface Window {
    __portfolioGlass?: GlassApi;
  }
}

export interface GlassApi {
  readonly treatment: Treatment;
  setTreatment(id: string): void;
  readonly state: 'css' | 'image' | 'live';
  readonly stats: { uploads: number; draws: number; uploadMs: number };
}

const STILL_KEY = 'mariashowalter.com/sky/still/v1';
const STILL_URL = '/assets/sky/sky-still.jpg';
const GLASS_SCALE = 1;
const NEAR_PX = 110;
const html = document.documentElement;

const media = (q: string) => window.matchMedia?.(q).matches ?? false;

function chooseTreatment(): Treatment {
  const fromUrl = new URLSearchParams(location.search).get('glass');
  if (fromUrl && TREATMENTS[fromUrl]) return TREATMENTS[fromUrl];
  const fromAttr = html.dataset.glass;
  if (fromAttr && TREATMENTS[fromAttr]) return TREATMENTS[fromAttr];
  return TREATMENTS[DEFAULT_TREATMENT];
}

function applyTreatmentAttrs(t: Treatment) {
  html.dataset.glass = t.id;
  html.dataset.ink = t.ink;
  html.style.setProperty('--glass-radius', `${t.radius}px`);
}

function storedStill(): string {
  try {
    const url = localStorage.getItem(STILL_KEY);
    if (url && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(url)) return url;
  } catch {
    // storage blocked: the shipped still
  }
  return STILL_URL;
}

function boot() {
  const sheet = document.querySelector<HTMLElement>('.sheet');
  if (!sheet) return;
  let treatment = chooseTreatment();
  applyTreatmentAttrs(treatment);
  const stats = { uploads: 0, draws: 0, uploadMs: 0 };
  let state: GlassApi['state'] = 'css';

  const api: GlassApi = {
    get treatment() { return treatment; },
    get state() { return state; },
    stats,
    setTreatment(id: string) {
      if (!TREATMENTS[id]) return;
      treatment = TREATMENTS[id];
      applyTreatmentAttrs(treatment);
      measurePad();
      request();
    },
  };
  window.__portfolioGlass = api;
  if (new URLSearchParams(location.search).has('glass-compare')) mountSwitcher(api);

  if (media('(prefers-reduced-transparency: reduce)') || media('(prefers-contrast: more)') || media('(forced-colors: active)')) return;

  const clip = document.createElement('div');
  clip.className = 'glass-clip';
  clip.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas');
  canvas.className = 'glass-canvas';
  clip.appendChild(canvas);
  sheet.prepend(clip);

  let layer: GlassLayer;
  try {
    layer = new GlassLayer(canvas);
  } catch {
    clip.remove();
    return;
  }

  const reduced = media('(prefers-reduced-motion: reduce)');
  const jelly = new JellyState(!reduced);
  const hasVeil = !!document.querySelector('.sky-veil');
  let p = (window as { __skyProgress?: number }).__skyProgress ?? 0;
  let pad = 48;
  let raf = 0;
  let last = 0;
  let lastLive = 0;
  let uploadEma = 0;
  let frame = 0;
  let canvasRect = canvas.getBoundingClientRect();
  let sheetRect = sheet.getBoundingClientRect();
  let lastScroll = window.scrollY;
  let detachLive: (() => void) | null = null;

  const viewport = (): [number, number] => [window.innerWidth, document.documentElement.clientHeight || window.innerHeight];

  function measurePad() {
    const wrap = sheet!.querySelector<HTMLElement>('.wrap');
    pad = wrap ? parseFloat(getComputedStyle(wrap).paddingLeft) || 48 : 48;
  }
  measurePad();

  function measure() {
    canvasRect = canvas.getBoundingClientRect();
    sheetRect = sheet!.getBoundingClientRect();
    layer.resize(canvasRect.width, canvasRect.height, GLASS_SCALE);
  }

  // Text runs on the sheet, for local shading behind them. The node list is cached;
  // rects are read each draw (layout is clean then, so this is cheap).
  const MAX_TEXT = 64;
  const textBuf = new Float32Array(MAX_TEXT * 4);
  let textNodes: Text[] = [];
  const range = document.createRange();
  function collectText() {
    const out: Text[] = [];
    const walker = document.createTreeWalker(sheet!, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode as Text;
      if (!n.textContent?.trim()) continue;
      const el = n.parentElement;
      if (!el || el.closest('.media, .thumb, .vh, dialog, [hidden], .glass-clip, script, style')) continue;
      out.push(n);
    }
    textNodes = out;
  }
  collectText();
  new MutationObserver(() => collectText()).observe(sheet, { childList: true, subtree: true, characterData: true });
  function textRects(): number {
    if (!treatment.local) return 0;
    let k = 0;
    const top = canvasRect.top, left = canvasRect.left, h = canvasRect.height;
    for (const n of textNodes) {
      if (k >= MAX_TEXT) break;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width || r.bottom < top - 40 || r.top > top + h + 40) continue;
      textBuf[k * 4] = r.left - left;
      textBuf[k * 4 + 1] = r.top - top;
      textBuf[k * 4 + 2] = r.right - left;
      textBuf[k * 4 + 3] = r.bottom - top;
      k++;
    }
    return k;
  }

  function draw(now: number) {
    if (html.classList.contains('sky-editing') || !layer.ready) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    jelly.step(dt);
    measure();
    const f: GlassFrame = {
      canvas: [canvasRect.width, canvasRect.height],
      origin: [canvasRect.left, canvasRect.top],
      panel: [sheetRect.left - canvasRect.left, sheetRect.top - canvasRect.top, sheetRect.right - canvasRect.left, sheetRect.bottom - canvasRect.top],
      viewport: viewport(),
      pad,
      p,
      veil: hasVeil,
      ptr: [jelly.x.value, jelly.y.value],
      hover: jelly.hover.value,
      near: jelly.near.value,
      press: jelly.press.value,
      slosh: jelly.slosh.value,
      text: textBuf,
      textN: 0,
    };
    f.textN = textRects();
    layer.draw(f, treatment);
    pending = false;
    stats.draws++;
    if (state === 'css') {
      state = layer.ready ? (detachLive ? 'live' : 'image') : 'css';
      html.dataset.glassState = state;
    }
  }

  // Own loop only while the live renderer is not driving frames (image source, paused sky).
  // A request is dropped only if the renderer drew a frame after it was made.
  let pending = false;
  function request() {
    pending = true;
    if (raf) return;
    raf = requestAnimationFrame((now) => {
      raf = 0;
      if (!pending) return; // the renderer's frame already drew
      draw(now);
      if (!jelly.resting && performance.now() - lastLive > 50) request();
    });
  }

  function loadImage(url: string) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (detachLive) return;
      layer.uploadImage(img, viewport());
      request();
    };
    img.onerror = () => {
      if (url !== STILL_URL) loadImage(STILL_URL);
    };
    img.src = url;
  }
  loadImage(storedStill());

  function attachLive(engine: EngineLike) {
    detachLive?.();
    detachLive = engine.onAfterRender((sky) => {
      if (html.classList.contains('sky-editing')) return;
      lastLive = performance.now();
      frame++;
      const every = uploadEma < 1.5 ? 1 : uploadEma < 4 ? 2 : 4;
      if (frame % every === 0 || !layer.ready) {
        const ms = layer.uploadLive(sky, viewport());
        uploadEma = uploadEma ? uploadEma * 0.9 + ms * 0.1 : ms;
        stats.uploads++;
        stats.uploadMs = uploadEma;
      }
      draw(lastLive);
      if (state === 'image') html.dataset.glassState = state = 'live';
    });
  }
  function endLive() {
    detachLive?.();
    detachLive = null;
    lastLive = 0;
    layer.liveEnded();
    if (state === 'live') html.dataset.glassState = state = 'image';
    loadImage(storedStill());
  }
  const existing = (window as unknown as { __portfolioSky?: { sky: { engine: EngineLike | null } } }).__portfolioSky?.sky.engine;
  if (existing) attachLive(existing);
  window.addEventListener('sky:engine', (e) => attachLive((e as CustomEvent<EngineLike>).detail));
  window.addEventListener('sky:engine-ended', endLive);

  window.addEventListener('sky:progress', (e) => {
    p = (e as CustomEvent<number>).detail;
    request();
  });
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    jelly.scrolled(y - lastScroll);
    lastScroll = y;
    request();
  }, { passive: true });
  window.addEventListener('resize', () => {
    measurePad();
    layer.refit(viewport());
    request();
  });

  // Pointer: presence over the slab, proximity to its rim, and press.
  const toCanvas = (e: PointerEvent): [number, number] => [e.clientX - canvasRect.left, e.clientY - canvasRect.top];
  const edgeInfo = (x: number, y: number) => {
    const px = x + canvasRect.left, py = y + canvasRect.top;
    const inside = px >= sheetRect.left && px <= sheetRect.right && py >= sheetRect.top && py <= sheetRect.bottom;
    const dx = Math.max(sheetRect.left - px, 0, px - sheetRect.right);
    const dy = Math.max(sheetRect.top - py, 0, py - sheetRect.bottom);
    const outside = Math.hypot(dx, dy);
    const toEdge = inside ? Math.min(px - sheetRect.left, sheetRect.right - px, py - sheetRect.top, sheetRect.bottom - py) : outside;
    return { inside, near: Math.max(0, 1 - toEdge / NEAR_PX) };
  };
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' && !e.buttons) return;
    const [x, y] = toCanvas(e);
    const { inside, near } = edgeInfo(x, y);
    jelly.pointer(x, y, inside ? 1 : 0, near);
    request();
  }, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    const [x, y] = toCanvas(e);
    const { inside, near } = edgeInfo(x, y);
    if (!inside) return;
    jelly.pointer(x, y, 1, near);
    jelly.setPress(true);
    request();
  }, { passive: true });
  const release = (e: PointerEvent) => {
    jelly.setPress(false);
    if (e.pointerType === 'touch') jelly.leave();
    request();
  };
  window.addEventListener('pointerup', release, { passive: true });
  window.addEventListener('pointercancel', release, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    jelly.leave();
    request();
  });

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    html.dataset.glassState = state = 'css';
  });
  canvas.addEventListener('webglcontextrestored', () => location.reload());
}

/** ?glass-compare: a small switcher for reviewing the treatments side by side. */
function mountSwitcher(api: GlassApi) {
  const bar = document.createElement('div');
  bar.className = 'glass-switch';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Panel material');
  for (const id of TREATMENT_ORDER) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = TREATMENTS[id].label;
    b.setAttribute('aria-pressed', String(api.treatment.id === id));
    b.addEventListener('click', () => {
      api.setTreatment(id);
      for (const o of bar.querySelectorAll('button')) o.setAttribute('aria-pressed', String(o === b));
      const url = new URL(location.href);
      url.searchParams.set('glass', id);
      history.replaceState(null, '', url);
    });
    bar.appendChild(b);
  }
  document.body.appendChild(bar);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
