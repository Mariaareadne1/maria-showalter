import { PRESETS } from '../vendor/sky-study/atmosphere/timeOfDay';
import { useSky } from '../vendor/sky-study/state/store';
import type { PortfolioSkyController } from './controller';
import type { Tool } from './interaction';

/**
 * Edit Sky: the reading panel steps aside (inert, faded, scroll held), a small
 * toolbar appears, and every control acts on the real Sky Study store.
 */

const LIGHTS = PRESETS.map((p) => ({ id: p.id, label: p.short, full: p.label, hour: p.hour }));

export interface EditorOptions {
  sheet: HTMLElement;
  announce(text: string): void;
}

export class SkyEditor {
  private readonly el: HTMLElement;
  private trigger: HTMLElement | null = null;
  private scrollY = 0;
  private unsub: (() => void) | null = null;

  constructor(private readonly sky: PortfolioSkyController, private readonly opts: EditorOptions) {
    this.el = document.createElement('div');
    this.el.className = 'sky-editor';
    this.el.setAttribute('role', 'region');
    this.el.setAttribute('aria-label', 'Sky editor');
    this.el.hidden = true;
    this.el.innerHTML = `
<p class="sky-hint" id="sky-hint">Draw a line in the sky to make a cloud. Drag a cloud to move it; pull a corner to resize.<span class="sky-keys"> Keys: [ ] pick a cloud · arrows move · + − size · Delete · Esc done</span></p>
<div class="sky-bar" role="toolbar" aria-label="Sky tools" aria-describedby="sky-hint">
  <div class="sky-group" role="group" aria-label="Tool">
    <button type="button" data-tool="draw" aria-pressed="true">Draw</button>
    <button type="button" data-tool="move" aria-pressed="false">Move</button>
  </div>
  <div class="sky-group" role="group" aria-label="Light">
    ${LIGHTS.map((l) => `<button type="button" data-hour="${l.hour}" aria-pressed="false" title="${l.full}">${l.label}</button>`).join('')}
  </div>
  <div class="sky-group" role="group" aria-label="Edit">
    <button type="button" data-act="add">Add cloud</button>
    <button type="button" data-act="delete" disabled>Delete</button>
    <button type="button" data-act="undo" disabled>Undo</button>
    <button type="button" data-act="redo" disabled>Redo</button>
    <button type="button" data-act="reset">Reset sky</button>
  </div>
  <button type="button" class="sky-done" data-act="done">Done</button>
</div>`;
    document.body.appendChild(this.el);
    this.el.addEventListener('click', this.onClick);
  }

  get open(): boolean {
    return !this.el.hidden;
  }

  enter(trigger: HTMLElement | null) {
    if (this.open || !this.sky.canEdit) return;
    this.trigger = trigger;
    this.scrollY = window.scrollY;
    const html = document.documentElement;
    html.classList.add('sky-editing');
    this.opts.sheet.inert = true;
    this.el.hidden = false;
    this.sky.setInteractionMode('edit');
    this.setTool('draw');
    this.sync();
    this.unsub = useSky.subscribe(() => this.sync());
    document.addEventListener('keydown', this.onKey);
    (this.el.querySelector('[data-tool="draw"]') as HTMLElement).focus({ preventScroll: true });
    this.opts.announce('Editing the sky. Draw to make clouds; press Escape or Done to return to the page.');
  }

  exit() {
    if (!this.open) return;
    document.removeEventListener('keydown', this.onKey);
    this.unsub?.();
    this.unsub = null;
    this.sky.setInteractionMode('browse');
    this.el.hidden = true;
    this.opts.sheet.inert = false;
    document.documentElement.classList.remove('sky-editing');
    window.scrollTo({ top: this.scrollY, behavior: 'instant' as ScrollBehavior });
    this.trigger?.focus({ preventScroll: true });
    this.sky.captureStill();
    this.opts.announce('Back to the page. Your sky is saved.');
  }

  private setTool(tool: Tool) {
    this.sky.interaction.setTool(tool);
    this.el.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === tool)));
  }

  /** Reflect store state on the controls. */
  private sync() {
    const st = useSky.getState();
    const q = (s: string) => this.el.querySelector<HTMLButtonElement>(s)!;
    q('[data-act="undo"]').disabled = st.past.length === 0;
    q('[data-act="redo"]').disabled = st.future.length === 0;
    q('[data-act="delete"]').disabled = !st.selectedId;
    const hour = st.scene.hour;
    this.el.querySelectorAll<HTMLButtonElement>('[data-hour]').forEach((b) => b.setAttribute('aria-pressed', String(Math.abs(Number(b.dataset.hour) - hour) < 0.01)));
  }

  private onClick = (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b || b.disabled) return;
    const st = useSky.getState();
    if (b.dataset.tool) {
      this.setTool(b.dataset.tool as Tool);
      return;
    }
    if (b.dataset.hour) {
      const light = LIGHTS.find((l) => String(l.hour) === b.dataset.hour);
      st.setHour(Number(b.dataset.hour));
      this.opts.announce(`${light?.full ?? 'Light'}.`);
      return;
    }
    switch (b.dataset.act) {
      case 'add':
        this.opts.announce(this.sky.interaction.addCloudFromKeyboard() ? 'Cloud added and selected. Arrow keys move it.' : 'The sky is full — delete a cloud first.');
        break;
      case 'delete':
        this.deleteSelected();
        break;
      case 'undo':
        this.sky.undo();
        this.opts.announce('Undone.');
        break;
      case 'redo':
        this.sky.redo();
        this.opts.announce('Redone.');
        break;
      case 'reset':
        this.sky.resetCloudScene();
        this.opts.announce('Original sky restored. Undo brings yours back.');
        break;
      case 'done':
        this.exit();
        break;
    }
  };

  private deleteSelected() {
    const st = useSky.getState();
    if (!st.selectedId) return;
    st.deleteCloud(st.selectedId);
    this.opts.announce('Cloud deleted.');
  }

  private onKey = (e: KeyboardEvent) => {
    const st = useSky.getState();
    const mod = e.metaKey || e.ctrlKey;
    const k = e.key;
    if (k === 'Escape') {
      e.preventDefault();
      this.exit();
      return;
    }
    if (mod && k.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) this.sky.redo();
      else this.sky.undo();
      return;
    }
    if (mod && k.toLowerCase() === 'y') {
      e.preventDefault();
      this.sky.redo();
      return;
    }
    if (mod || e.altKey) return;
    const ia = this.sky.interaction;
    if (k === 'b' || k === 'B') return this.setTool('draw');
    if (k === 'v' || k === 'V') return this.setTool('move');
    if (k === '[' || k === ']') {
      const c = ia.cycleSelection(k === ']' ? 1 : -1);
      if (c) this.opts.announce(`Cloud ${st.scene.clouds.indexOf(c) + 1} of ${st.scene.clouds.length} selected.`);
      return;
    }
    if ((k === 'Delete' || k === 'Backspace') && st.selectedId) {
      e.preventDefault();
      this.deleteSelected();
      return;
    }
    if (!st.selectedId) return;
    const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
    if (arrows[k]) {
      e.preventDefault();
      st.begin();
      ia.nudgeSelected(...arrows[k]);
      st.end();
      return;
    }
    if (k === '+' || k === '=' || k === '-' || k === '_') {
      e.preventDefault();
      st.begin();
      ia.scaleSelected(k === '-' || k === '_' ? 1 / 1.1 : 1.1);
      st.end();
    }
  };
}
