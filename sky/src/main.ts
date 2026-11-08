import { useSky } from '../vendor/sky-study/state/store';
import { PortfolioSkyController, type SkyState } from './controller';
import { defaultScene } from './defaultScene';
import { SkyEditor } from './editor';

/**
 * Boots the live sky on pages that have [data-sky-live]. Everything visual that
 * must work without this module (still background, scroll progress, panel
 * opacity) lives in /assets/js/sky-page.js; this file only adds the engine.
 */

declare global {
  interface Window {
    __portfolioSky?: { sky: PortfolioSkyController; editor: SkyEditor; store: typeof useSky; defaultScene: typeof defaultScene };
    __skyProgress?: number;
  }
}

function statusRegion(): HTMLElement {
  let el = document.getElementById('sky-status');
  if (!el) {
    el = document.createElement('p');
    el.id = 'sky-status';
    el.className = 'vh';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  return el;
}

const UNSUPPORTED_LABEL = 'Sky editing needs WebGL 2';

function boot() {
  const root = document.querySelector<HTMLElement>('[data-sky-live]');
  const sheet = document.querySelector<HTMLElement>('.sheet');
  if (!root || !sheet) return;
  const status = statusRegion();
  let last = '';
  const announce = (text: string) => {
    // re-announce identical messages by clearing first
    status.textContent = text === last ? `${text} ` : text;
    last = status.textContent;
  };
  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-sky-edit]'));

  const onState = (state: SkyState, reason?: string) => {
    document.documentElement.dataset.sky = state;
    const unavailable = state === 'unsupported' || state === 'lost';
    document.documentElement.classList.toggle('sky-unavailable', unavailable);
    for (const t of triggers) {
      t.disabled = unavailable;
      const label = t.querySelector('[data-sky-label]');
      if (label) label.textContent = unavailable ? UNSUPPORTED_LABEL : 'Edit sky';
      if (unavailable && reason) t.title = reason;
      else t.removeAttribute('title');
    }
    if (state === 'lost' && editor?.open) editor.exit();
    // Hand each (re)started renderer to the glass panel, which refracts its frames.
    const engine = sky.engine;
    if (state === 'live' && engine && engine !== announcedEngine) {
      announcedEngine = engine;
      window.dispatchEvent(new CustomEvent('sky:engine', { detail: engine }));
    } else if (unavailable && announcedEngine) {
      announcedEngine = null;
      window.dispatchEvent(new CustomEvent('sky:engine-ended'));
    }
  };
  let announcedEngine: unknown = null;

  // onState first runs inside mount(), after this assignment.
  const sky = new PortfolioSkyController(root, { onState, announce });
  let editor: SkyEditor | null = null;
  editor = new SkyEditor(sky, { sheet, announce });
  for (const t of triggers) t.addEventListener('click', () => editor!.enter(t));

  const applyProgress = (p: number) => sky.setVisualIntensity(p);
  applyProgress(window.__skyProgress ?? 0);
  window.addEventListener('sky:progress', (e) => applyProgress((e as CustomEvent<number>).detail));

  sky.mount();
  window.__portfolioSky = { sky, editor, store: useSky, defaultScene };
  window.addEventListener('pagehide', () => sky.pause());
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) sky.resume();
  });
}

const start = () => {
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) ric(boot, { timeout: 500 });
  else window.setTimeout(boot, 1);
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
