import { shapeOf } from '../vendor/sky-study/clouds/cloudModel';
import type { Engine } from '../vendor/sky-study/engine/Engine';
import { MIN_BASE_KM, strokeToCloud } from '../vendor/sky-study/interactions/geometry';
import { cloudDistance, cloudExtent, moveToDistance, pickCloud } from '../vendor/sky-study/interactions/picking';
import { type LiveStroke, addPoint, beginStroke, liveStrokes, releaseStroke, strokeOpacity, strokePath } from '../vendor/sky-study/interactions/strokes';
import { randomSeed } from '../vendor/sky-study/math/rng';
import { type Vec3, add, clamp, sub } from '../vendor/sky-study/math/vec';
import { intersectPlane } from '../vendor/sky-study/renderer/camera';
import { type CloudDoc, DISTANCE_MAX, DISTANCE_MIN, SCALE_MAX, SCALE_MIN } from '../vendor/sky-study/state/scene';
import { useSky } from '../vendor/sky-study/state/store';

/**
 * Pointer handling for the portfolio sky — a framework-free port of Sky Study's
 * InteractionLayer, using the same picking, stroke → cloud and store actions.
 *
 * browse: mouse only, and only grabs an existing cloud in the exposed sky. Wheel,
 *         touch and everything else fall through to normal page scrolling.
 * edit:   draw / move tools, resize handles, depth with Shift-drag or the wheel
 *         over a cloud. The camera never moves; the page composition stays put.
 */

export type Mode = 'browse' | 'edit';
export type Tool = 'draw' | 'move';

const TAP_PX = 7;

type Gesture =
  | { kind: 'stroke'; stroke: LiveStroke; startedOn: string | null; pointerId: number }
  | { kind: 'drag'; id: string; offset: Vec3; normal: Vec3; pointerId: number }
  | { kind: 'depth'; id: string; startY: number; startDistance: number; pointerId: number }
  | { kind: 'scale'; id: string; cx: number; cy: number; startDist: number; startScale: number; pointerId: number };

const findCloud = (id: string | null): CloudDoc | undefined =>
  id ? useSky.getState().scene.clouds.find((c) => c.id === id) : undefined;

export interface InteractionHooks {
  announce(text: string): void;
}

export class SkyInteraction {
  readonly surface: HTMLElement;
  private readonly svg: SVGSVGElement;
  private readonly sel: HTMLElement;
  private readonly label: HTMLElement;
  private engine: Engine | null = null;
  private offFrame: (() => void) | null = null;
  private gesture: Gesture | null = null;
  private wheelTimer = 0;
  private wheelTarget: string | null = null;
  mode: Mode = 'browse';
  tool: Tool = 'draw';

  constructor(surface: HTMLElement, private readonly hooks: InteractionHooks) {
    this.surface = surface;
    surface.innerHTML = `<svg class="sky-strokes" aria-hidden="true"></svg>
<div class="sky-selection" hidden><i data-handle="nw"></i><i data-handle="ne"></i><i data-handle="sw"></i><i data-handle="se"></i><span class="sky-selection-label"></span></div>`;
    this.svg = surface.querySelector('svg')!;
    this.sel = surface.querySelector('.sky-selection')!;
    this.label = surface.querySelector('.sky-selection-label')!;
    surface.addEventListener('pointerdown', this.onDown);
    surface.addEventListener('pointermove', this.onMove);
    surface.addEventListener('pointerup', this.onUp);
    surface.addEventListener('pointercancel', this.onUp);
    surface.addEventListener('contextmenu', this.onContext);
    surface.addEventListener('wheel', this.onWheel, { passive: false });
    this.setMode('browse');
  }

  attach(engine: Engine | null) {
    this.offFrame?.();
    this.offFrame = null;
    this.engine = engine;
    if (engine) this.offFrame = engine.onFrame(({ now }) => this.paint(now));
  }

  setMode(mode: Mode) {
    this.cancelGesture();
    this.mode = mode;
    this.surface.dataset.mode = mode;
    if (mode === 'browse') useSky.getState().select(null);
    this.surface.dataset.cursor = mode === 'edit' && this.tool === 'draw' ? 'draw' : 'default';
  }

  setTool(tool: Tool) {
    this.tool = tool;
    this.surface.dataset.tool = tool;
    this.surface.dataset.cursor = this.mode === 'edit' && tool === 'draw' ? 'draw' : 'default';
  }

  dispose() {
    this.attach(null);
    const s = this.surface;
    s.removeEventListener('pointerdown', this.onDown);
    s.removeEventListener('pointermove', this.onMove);
    s.removeEventListener('pointerup', this.onUp);
    s.removeEventListener('pointercancel', this.onUp);
    s.removeEventListener('contextmenu', this.onContext);
    s.removeEventListener('wheel', this.onWheel);
    window.clearTimeout(this.wheelTimer);
  }

  /* ---------- per-frame overlay: live strokes and the selection box ---------- */

  private paint(now: number) {
    const strokes = liveStrokes(now);
    const paths = this.svg.querySelectorAll('path');
    strokes.forEach((s, i) => {
      let p = paths[i] as SVGPathElement | undefined;
      if (!p) {
        p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.svg.appendChild(p);
      }
      p.setAttribute('d', strokePath(s.points));
      p.style.opacity = String(strokeOpacity(s, now));
    });
    for (let i = strokes.length; i < paths.length; i++) paths[i].remove();

    const engine = this.engine;
    const c = this.mode === 'edit' ? findCloud(useSky.getState().selectedId) : undefined;
    const rect = c && engine ? engine.screenRect(c, now) : null;
    if (!rect || !c || !engine) {
      this.sel.hidden = true;
      return;
    }
    this.sel.hidden = false;
    this.sel.style.transform = `translate(${rect.x}px, ${rect.y}px)`;
    this.sel.style.width = `${rect.w}px`;
    this.sel.style.height = `${rect.h}px`;
    const ext = cloudExtent(c, shapeOf(c));
    const d = cloudDistance(engine.camera.position, c);
    this.label.textContent = `${Math.round(ext.w * 1000).toLocaleString('en-US')} m wide · ${d.toFixed(1)} km away`;
  }

  /* ---------- helpers ---------- */

  private local(e: { clientX: number; clientY: number }) {
    const r = this.surface.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private pickAt(x: number, y: number) {
    const engine = this.engine!;
    const { origin, dir } = engine.rayAt(x, y);
    return pickCloud(origin, dir, useSky.getState().scene.clouds, shapeOf, (c) => engine.renderPosition(c));
  }

  private liftAboveGround(p: Vec3, c: CloudDoc): Vec3 {
    const minY = MIN_BASE_KM - shapeOf(c).baseY * c.scale;
    return [p[0], Math.max(p[1], minY), p[2]];
  }

  private startDrag(id: string, x: number, y: number, pointerId: number) {
    const engine = this.engine;
    const c = findCloud(id);
    if (!engine || !c) return;
    const cam = engine.camera;
    const { origin, dir } = engine.rayAt(x, y);
    const hit = intersectPlane(origin, dir, c.position, cam.forward) ?? c.position;
    useSky.getState().begin();
    this.gesture = { kind: 'drag', id, offset: sub(c.position, hit), normal: cam.forward, pointerId };
    this.surface.dataset.dragging = '';
  }

  private capture(pointerId: number) {
    try {
      this.surface.setPointerCapture(pointerId);
    } catch {
      // synthetic pointers can't be captured; the gesture still works
    }
  }

  private cancelGesture() {
    const g = this.gesture;
    this.gesture = null;
    delete this.surface.dataset.dragging;
    if (!g) return;
    if (g.kind === 'stroke') releaseStroke(g.stroke, false, performance.now());
    else useSky.getState().end();
  }

  /* ---------- pointer events ---------- */

  private onContext = (e: Event) => {
    if (this.mode === 'edit') e.preventDefault();
  };

  private onDown = (e: PointerEvent) => {
    if (!this.engine || this.gesture || e.button !== 0) return;
    const st = useSky.getState();
    const { x, y } = this.local(e);

    if (this.mode === 'browse') {
      // Browse: a mouse can pick up a cloud in the open sky. Nothing else is captured.
      if (e.pointerType !== 'mouse') return;
      const pick = this.pickAt(x, y);
      if (!pick) return;
      e.preventDefault();
      this.capture(e.pointerId);
      this.startDrag(pick.id, x, y, e.pointerId);
      return;
    }

    e.preventDefault();
    this.capture(e.pointerId);
    const handle = (e.target as HTMLElement).dataset?.handle;
    if (handle && st.selectedId) {
      const rect = this.sel.getBoundingClientRect();
      const lr = this.surface.getBoundingClientRect();
      const cx = rect.left - lr.left + rect.width / 2;
      const cy = rect.top - lr.top + rect.height / 2;
      const c = findCloud(st.selectedId)!;
      st.begin();
      this.gesture = { kind: 'scale', id: c.id, cx, cy, startDist: Math.max(8, Math.hypot(x - cx, y - cy)), startScale: c.scale, pointerId: e.pointerId };
      return;
    }
    const pick = this.pickAt(x, y);
    if (pick && e.shiftKey) {
      const c = findCloud(pick.id)!;
      st.select(pick.id);
      st.begin();
      this.gesture = { kind: 'depth', id: pick.id, startY: y, startDistance: cloudDistance(this.engine.camera.position, c), pointerId: e.pointerId };
      return;
    }
    if (this.tool === 'move') {
      if (pick) {
        st.select(pick.id);
        this.startDrag(pick.id, x, y, e.pointerId);
      } else st.select(null);
      return;
    }
    if (pick && pick.id === st.selectedId) {
      this.startDrag(pick.id, x, y, e.pointerId);
      return;
    }
    this.gesture = { kind: 'stroke', stroke: beginStroke({ x, y }), startedOn: pick?.id ?? null, pointerId: e.pointerId };
  };

  private onMove = (e: PointerEvent) => {
    const engine = this.engine;
    if (!engine) return;
    const { x, y } = this.local(e);
    const g = this.gesture;
    if (!g) {
      this.hover(x, y, e.pointerType);
      return;
    }
    if (g.pointerId !== e.pointerId) return;
    const st = useSky.getState();
    if (g.kind === 'stroke') {
      const events = e.getCoalescedEvents?.() ?? [e];
      for (const ev of events) addPoint(g.stroke, this.local(ev));
      return;
    }
    const c = findCloud(g.id);
    if (!c) return;
    if (g.kind === 'drag') {
      const { origin, dir } = engine.rayAt(x, y);
      const hit = intersectPlane(origin, dir, c.position, g.normal);
      if (hit) st.updateCloud(c.id, { position: this.liftAboveGround(add(hit, g.offset), c) });
    } else if (g.kind === 'depth') {
      const dist = clamp(g.startDistance * Math.exp((g.startY - y) * -0.006), DISTANCE_MIN, DISTANCE_MAX);
      st.updateCloud(c.id, { position: this.liftAboveGround(moveToDistance(engine.camera.position, c.position, dist), c) });
    } else {
      const scale = clamp((g.startScale * Math.hypot(x - g.cx, y - g.cy)) / g.startDist, SCALE_MIN, SCALE_MAX);
      st.updateCloud(c.id, { scale, position: this.liftAboveGround(c.position, { ...c, scale }) });
    }
  };

  private onUp = (e: PointerEvent) => {
    const g = this.gesture;
    const engine = this.engine;
    if (!g || g.pointerId !== e.pointerId || !engine) return;
    this.gesture = null;
    delete this.surface.dataset.dragging;
    const st = useSky.getState();
    if (g.kind !== 'stroke') {
      st.end();
      if (g.kind === 'drag' && this.mode === 'browse') this.hooks.announce('Cloud moved.');
      return;
    }
    const pts = g.stroke.points;
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    const now = performance.now();
    if (len < TAP_PX || e.type === 'pointercancel') {
      releaseStroke(g.stroke, false, now);
      if (e.type !== 'pointercancel') st.select(g.startedOn);
      return;
    }
    const { width, height } = engine.size;
    const ndc = pts.map((p) => ({ x: (p.x / width) * 2 - 1, y: 1 - (p.y / height) * 2 }));
    const result = strokeToCloud(engine.camera, ndc, randomSeed());
    if (!result.ok) {
      releaseStroke(g.stroke, false, now);
      this.hooks.announce(result.reason === 'too-short' ? 'Draw a little longer — that line is too short for a cloud.' : 'Draw above the horizon to make a cloud.');
      return;
    }
    const order = Math.max(0, ...st.scene.clouds.map((c) => c.order)) + 1;
    const added = st.addCloud({ ...result.cloud, id: newCloudId(), order }, now);
    releaseStroke(g.stroke, added, now);
    if (added) {
      st.select(null);
      this.hooks.announce('Cloud added.');
    }
  };

  private hover(x: number, y: number, pointerType: string) {
    if (pointerType !== 'mouse') return;
    const st = useSky.getState();
    const pick = this.pickAt(x, y);
    let cursor: string;
    if (this.mode === 'browse') cursor = pick ? 'grab' : 'default';
    else if (this.tool === 'move') cursor = pick ? 'grab' : 'default';
    else cursor = pick && pick.id === st.selectedId ? 'grab' : 'draw';
    this.surface.dataset.cursor = cursor;
  }

  /** Edit mode only: the wheel over a cloud pushes it away or pulls it closer. */
  private onWheel = (e: WheelEvent) => {
    const engine = this.engine;
    if (this.mode !== 'edit' || !engine) return;
    const st = useSky.getState();
    const { x, y } = this.local(e);
    let id = this.wheelTarget;
    if (id === null) {
      id = this.pickAt(x, y)?.id ?? null;
      this.wheelTarget = id ?? 'sky';
    }
    window.clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(() => {
      this.wheelTarget = null;
      useSky.getState().end();
    }, 350);
    e.preventDefault();
    const c = findCloud(id);
    if (!c) return;
    st.select(c.id);
    st.begin();
    const cam = engine.camera.position;
    const dist = clamp(cloudDistance(cam, c) * Math.exp(e.deltaY * 0.0016), DISTANCE_MIN, DISTANCE_MAX);
    st.updateCloud(c.id, { position: this.liftAboveGround(moveToDistance(cam, c.position, dist), c) });
  };

  /* ---------- keyboard alternatives (called by the editor) ---------- */

  /** Adds a cloud from a generated stroke at a free spot in view — the keyboard path to drawing. */
  addCloudFromKeyboard(): boolean {
    const engine = this.engine;
    if (!engine) return false;
    const st = useSky.getState();
    const rnd = Math.random;
    const cx = (rnd() < 0.5 ? -1 : 1) * (0.45 + rnd() * 0.4);
    const cy = 0.05 + rnd() * 0.55;
    const w = 0.18 + rnd() * 0.16;
    const pts = Array.from({ length: 48 }, (_, i) => {
      const t = (i / 47) * Math.PI * 2;
      return { x: cx + Math.cos(t) * w * 0.5, y: cy + Math.sin(t) * w * 0.35 };
    });
    const result = strokeToCloud(engine.camera, pts, randomSeed());
    if (!result.ok) return false;
    const order = Math.max(0, ...st.scene.clouds.map((c) => c.order)) + 1;
    const id = newCloudId();
    const added = st.addCloud({ ...result.cloud, id, order }, performance.now());
    if (added) st.select(id);
    return added;
  }

  /** Arrow keys: nudge the selected cloud across the view (screen-aligned). */
  nudgeSelected(dx: number, dy: number) {
    const engine = this.engine;
    const st = useSky.getState();
    const c = findCloud(st.selectedId);
    if (!engine || !c) return false;
    const cam = engine.camera;
    const d = cloudDistance(cam.position, c);
    const step = d * 0.03;
    const move: Vec3 = [cam.right[0] * dx * step + cam.up[0] * dy * step, cam.right[1] * dx * step + cam.up[1] * dy * step, cam.right[2] * dx * step + cam.up[2] * dy * step];
    st.updateCloud(c.id, { position: this.liftAboveGround(add(c.position, move), c) });
    return true;
  }

  scaleSelected(factor: number) {
    const st = useSky.getState();
    const c = findCloud(st.selectedId);
    if (!c) return false;
    const scale = clamp(c.scale * factor, SCALE_MIN, SCALE_MAX);
    st.updateCloud(c.id, { scale, position: this.liftAboveGround(c.position, { ...c, scale }) });
    return true;
  }

  cycleSelection(dir: 1 | -1) {
    const st = useSky.getState();
    const list = [...st.scene.clouds].sort((a, b) => a.position[0] - b.position[0]);
    if (!list.length) return null;
    const i = list.findIndex((c) => c.id === st.selectedId);
    const next = list[(i + dir + list.length) % list.length] ?? list[0];
    st.select(next.id);
    return next;
  }
}

let idCounter = 0;
function newCloudId(): string {
  idCounter++;
  return `c-${Date.now().toString(36)}-${idCounter}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}
