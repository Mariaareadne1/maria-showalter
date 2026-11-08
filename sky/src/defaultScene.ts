import { shapeOf } from '../vendor/sky-study/clouds/cloudModel';
import type { Point2 } from '../vendor/sky-study/clouds/shape';
import { MIN_BASE_KM, strokeToCloud } from '../vendor/sky-study/interactions/geometry';
import { moveToDistance } from '../vendor/sky-study/interactions/picking';
import { createCamera } from '../vendor/sky-study/renderer/camera';
import { type CloudDoc, type SceneDoc, SCENE_VERSION } from '../vendor/sky-study/state/scene';
import { DEFAULT_HOUR, PORTFOLIO_VIEW } from './config';

/**
 * The shipped sky: a few authored clouds, made by sending fixed strokes through
 * Sky Study's own stroke → cloud pipeline on a canonical 16:10 camera. World-space
 * results, so the scene is identical on every screen; only the framing changes.
 */
interface Authored {
  id: string;
  seed: number;
  /** Stroke in NDC (-1..1, y up) on the canonical camera. */
  path: Point2[];
  /** Push back to this distance (km) for depth variety. */
  distance?: number;
  scale?: number;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i / (n - 1));

/** A soft closed loop, slightly lumpy so the cloud does not read as a disc. */
function loop(cx: number, cy: number, w: number, h: number, wobble = 0.12): Point2[] {
  return range(64).map((u) => {
    const t = u * Math.PI * 2;
    const r = 1 + wobble * Math.sin(t * 3 + cx * 7) + wobble * 0.5 * Math.cos(t * 5);
    return { x: cx + Math.cos(t) * w * 0.5 * r, y: cy + Math.sin(t) * h * 0.5 * r };
  });
}

/** A low, gently undulating line — reads as a flat-based drift of cumulus. */
function wave(x0: number, x1: number, y: number, amp: number, k = 2.2): Point2[] {
  return range(48).map((u) => ({ x: x0 + (x1 - x0) * u, y: y + Math.sin(u * Math.PI * k) * amp + u * amp * 0.4 }));
}

const AUTHORED: Authored[] = [
  { id: 'sky-a', seed: 1103, path: loop(-0.74, 0.5, 0.3, 0.2), distance: 11 },
  { id: 'sky-b', seed: 2207, path: wave(-1.02, -0.6, -0.12, 0.05), distance: 16, scale: 1.25 },
  { id: 'sky-c', seed: 3301, path: loop(0.76, 0.3, 0.34, 0.22), distance: 10 },
  { id: 'sky-d', seed: 4409, path: wave(0.58, 1.0, -0.3, 0.04), distance: 19, scale: 1.4 },
  { id: 'sky-e', seed: 5503, path: wave(-0.16, 0.2, 0.74, 0.045, 1.6), distance: 14 },
];

let cached: SceneDoc | null = null;

export function defaultScene(): SceneDoc {
  if (cached) return cached;
  const cam = createCamera(1.6, PORTFOLIO_VIEW);
  const clouds: CloudDoc[] = [];
  AUTHORED.forEach((a, i) => {
    const res = strokeToCloud(cam, a.path, a.seed);
    if (!res.ok) return;
    let cloud: CloudDoc = { ...res.cloud, id: a.id, order: i + 1, scale: a.scale ?? 1 };
    if (a.distance) cloud = { ...cloud, position: moveToDistance(cam.position, cloud.position, a.distance) };
    const minY = MIN_BASE_KM - shapeOf(cloud).baseY * cloud.scale;
    cloud = { ...cloud, position: [cloud.position[0], Math.max(cloud.position[1], minY), cloud.position[2]] };
    clouds.push(cloud);
  });
  cached = { version: SCENE_VERSION, hour: DEFAULT_HOUR, clouds };
  return cached;
}

export const isDefaultScene = (s: SceneDoc): boolean => JSON.stringify(s) === JSON.stringify(defaultScene());
