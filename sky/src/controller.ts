import { Engine } from '../vendor/sky-study/engine/Engine';
import { useSky } from '../vendor/sky-study/state/store';
import { PORTFOLIO_VIEW } from './config';
import { defaultScene, isDefaultScene } from './defaultScene';
import { SkyInteraction } from './interaction';
import { loadScene, saveStill, startAutosave, watchOtherTabs } from './storage';

/**
 * PortfolioSkyController — the one boundary between the static site and the
 * Sky Study engine. One renderer per page. The page stays fully usable when the
 * engine cannot start: the shipped still remains and editing is disabled.
 */

export type SkyState = 'loading' | 'live' | 'paused' | 'unsupported' | 'lost';

export interface ControllerEvents {
  onState(state: SkyState, reason?: string): void;
  announce(text: string): void;
}

const STILL_DELAY_MS = 1200;
const REVEAL_FRAMES = 6;

export class PortfolioSkyController {
  engine: Engine | null = null;
  readonly interaction: SkyInteraction;
  private readonly canvas: HTMLCanvasElement;
  private readonly root: HTMLElement;
  private state: SkyState = 'loading';
  private editing = false;
  private intensity = 0;
  private cleanups: (() => void)[] = [];
  private stillTimer = 0;
  private framesSeen = 0;

  constructor(root: HTMLElement, private readonly events: ControllerEvents) {
    this.root = root;
    this.canvas = root.querySelector('canvas.sky-canvas')!;
    this.interaction = new SkyInteraction(root.querySelector('.sky-surface')!, { announce: (t) => events.announce(t) });
  }

  /** Restores the visitor's sky (or the shipped one) and starts the renderer. */
  mount(): SkyState {
    const { scene, message } = loadScene();
    const st = useSky.getState();
    st.replaceScene(scene);
    st.setView(PORTFOLIO_VIEW);
    st.setQuality('auto');
    if (message) this.events.announce(message);

    this.cleanups.push(
      startAutosave((s, msg) => {
        if (s === 'memory' && msg) this.events.announce(msg);
        this.root.dataset.storage = s;
      }),
      watchOtherTabs(() => this.editing),
      useSky.subscribe((s, prev) => {
        if (s.scene !== prev.scene && !s.txn) this.scheduleStill();
      }),
    );

    const onLost = (e: Event) => {
      e.preventDefault();
      this.engine?.stop();
      this.setState('lost', 'The graphics context was lost; the sky will come back when the browser restores it.');
    };
    const onRestored = () => this.startEngine();
    const onVisibility = () => this.updateRunState();
    this.canvas.addEventListener('webglcontextlost', onLost);
    this.canvas.addEventListener('webglcontextrestored', onRestored);
    document.addEventListener('visibilitychange', onVisibility);
    this.cleanups.push(() => {
      this.canvas.removeEventListener('webglcontextlost', onLost);
      this.canvas.removeEventListener('webglcontextrestored', onRestored);
      document.removeEventListener('visibilitychange', onVisibility);
    });

    this.startEngine();
    return this.state;
  }

  private startEngine() {
    if (this.engine) {
      try {
        this.engine.dispose();
      } catch {
        // resources of a lost context are already gone
      }
      this.engine = null;
    }
    try {
      this.engine = new Engine(this.canvas);
    } catch (err) {
      this.interaction.attach(null);
      const reason = err instanceof Error ? err.message : 'WebGL 2 is not available.';
      this.setState('unsupported', reason);
      return;
    }
    this.engine.snapView();
    this.framesSeen = 0;
    this.interaction.attach(this.engine);
    this.engine.onFrame(() => {
      if (++this.framesSeen === REVEAL_FRAMES) this.root.dataset.reveal = 'true';
    });
    this.setState('live');
    this.updateRunState();
  }

  private setState(state: SkyState, reason?: string) {
    this.state = state;
    this.root.dataset.state = state;
    this.events.onState(state, reason);
  }

  get current(): SkyState {
    return this.state;
  }

  get isEditing(): boolean {
    return this.editing;
  }

  get canEdit(): boolean {
    return !!this.engine && (this.state === 'live' || this.state === 'paused');
  }

  /** 0 = open sky at the top of the page, 1 = the off-white reading surface. */
  setVisualIntensity(amount: number) {
    this.intensity = Math.min(1, Math.max(0, amount));
    this.updateRunState();
  }

  setInteractionMode(mode: 'browse' | 'edit') {
    this.editing = mode === 'edit';
    this.interaction.setMode(mode);
    this.updateRunState();
  }

  /** Render only when someone could see it change. The last frame stays on screen while paused. */
  private updateRunState() {
    const engine = this.engine;
    if (!engine || this.state === 'unsupported' || this.state === 'lost') return;
    const visible = !document.hidden && (this.editing || this.intensity < 0.999);
    if (visible) {
      engine.start();
      if (this.state !== 'live') this.setState('live');
    } else {
      engine.stop();
      if (this.state !== 'paused') this.setState('paused');
    }
  }

  pause() {
    this.engine?.stop();
  }

  resume() {
    this.updateRunState();
  }

  resetCloudScene() {
    const st = useSky.getState();
    const scene = defaultScene();
    st.apply(() => scene);
    st.select(null);
  }

  undo() {
    useSky.getState().undo();
  }

  redo() {
    useSky.getState().redo();
  }

  exportScene() {
    return useSky.getState().scene;
  }

  private scheduleStill() {
    window.clearTimeout(this.stillTimer);
    this.stillTimer = window.setTimeout(() => this.captureStill(), STILL_DELAY_MS);
  }

  /** Saves a small JPEG of the visitor's sky for inner pages (no WebGL there). */
  captureStill() {
    const engine = this.engine;
    if (!engine || !this.canEdit) return;
    if (isDefaultScene(useSky.getState().scene)) {
      saveStill(null);
      return;
    }
    try {
      const w = 640, h = 400;
      const px = engine.capture(w, h, 10);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      c.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(px), w, h), 0, 0);
      saveStill(c.toDataURL('image/jpeg', 0.8));
    } catch {
      // a still is a nicety; inner pages fall back to the shipped one
    }
  }

  dispose() {
    window.clearTimeout(this.stillTimer);
    for (const fn of this.cleanups.splice(0)) fn();
    this.interaction.dispose();
    this.engine?.dispose();
    this.engine = null;
  }
}
