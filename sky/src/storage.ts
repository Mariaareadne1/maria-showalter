import { type SceneDoc, parseScene, serializeScene } from '../vendor/sky-study/state/scene';
import { useSky } from '../vendor/sky-study/state/store';
import { SCENE_KEY, STILL_KEY } from './config';
import { defaultScene, isDefaultScene } from './defaultScene';

/**
 * Portfolio-owned persistence. Its own namespaced keys, so it never reads or
 * overwrites a standalone Sky Study save. The shipped default is never written;
 * only a scene the visitor changed is stored. Storage failures degrade to an
 * in-memory scene with one non-blocking message.
 */

export type StorageState = 'ok' | 'memory';

const SAVE_DELAY_MS = 400;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function storageAvailable(): boolean {
  try {
    const k = `${SCENE_KEY}/probe`;
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function loadScene(): { scene: SceneDoc; restored: boolean; message: string | null } {
  const raw = read(SCENE_KEY);
  if (!raw) return { scene: defaultScene(), restored: false, message: null };
  const parsed = parseScene(raw);
  if (!parsed.ok) return { scene: defaultScene(), restored: false, message: 'Your saved sky could not be read, so the original is back.' };
  return { scene: parsed.scene, restored: true, message: parsed.dropped ? 'Some saved clouds were damaged and skipped.' : null };
}

/** Saves the scene (debounced) whenever it changes. Returns an unsubscribe. */
export function startAutosave(onState: (s: StorageState, message?: string) => void): () => void {
  let timer = 0;
  let failed = false;
  const save = () => {
    const scene = useSky.getState().scene;
    try {
      if (isDefaultScene(scene)) {
        localStorage.removeItem(SCENE_KEY);
        localStorage.removeItem(STILL_KEY);
      } else localStorage.setItem(SCENE_KEY, serializeScene(scene));
      if (failed) onState('ok');
      failed = false;
    } catch {
      if (!failed) onState('memory', 'This browser isn’t saving the sky, so your clouds will last until you close the tab.');
      failed = true;
    }
  };
  const unsub = useSky.subscribe((state, prev) => {
    if (state.scene === prev.scene || state.txn) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(save, SAVE_DELAY_MS);
  });
  return () => {
    window.clearTimeout(timer);
    unsub();
  };
}

/** Another tab saved a sky: adopt it (last writer wins) unless this tab is mid-edit. */
export function watchOtherTabs(isEditing: () => boolean): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== SCENE_KEY || isEditing()) return;
    const next = e.newValue ? parseScene(e.newValue) : null;
    const scene = next && next.ok ? next.scene : defaultScene();
    useSky.getState().replaceScene(scene);
  };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}

/** A small JPEG of the visitor's own sky, so inner pages can show it without WebGL. */
export function saveStill(dataUrl: string | null) {
  try {
    if (dataUrl) localStorage.setItem(STILL_KEY, dataUrl);
    else localStorage.removeItem(STILL_KEY);
  } catch {
    // quota: inner pages fall back to the shipped still
  }
}
