import { DEG } from '../vendor/sky-study/math/vec';
import type { View } from '../vendor/sky-study/renderer/camera';

/** The portfolio looks a little higher than Sky Study's default, so the page sits in open sky. */
export const PORTFOLIO_VIEW: View = { x: 0, z: 0, yaw: 0, pitch: 21 * DEG, altitude: 1 };

/** Daylight is the default; the other presets are Sky Study's own. */
export const DEFAULT_HOUR = 12.5;

export const STORAGE_PREFIX = 'mariashowalter.com/sky';
export const SCENE_KEY = `${STORAGE_PREFIX}/scene/v1`;
export const STILL_KEY = `${STORAGE_PREFIX}/still/v1`;
export const HINT_KEY = `${STORAGE_PREFIX}/hint-seen/v1`;
