/**
 * Panel material treatments. Each is a full material, not an opacity: bevel shape,
 * refraction, frost distribution, body tint, thickness cues and how it reacts.
 * `ink` decides the text colour the CSS uses on top (html[data-ink]).
 */

export type Ink = 'dark' | 'light';
export type Rgb = [number, number, number];

export interface Treatment {
  id: string;
  label: string;
  ink: Ink;
  radius: number;
  /** Bevel width (px): how far in from the edge the slab curves. */
  bevel: number;
  refract: number;
  dispersion: number;
  /** Frost as a mip level (each +1 doubles the blur radius). */
  frostEdge: number;
  frostCore: number;
  frostVar: number;
  ripple: number;
  /** Body tint at the top of the page (0) and once reading (1). */
  tint0: Rgb;
  tint1: Rgb;
  tintA0: number;
  tintA1: number;
  gain: number;
  lift: number;
  coreShade: number;
  /** Saturation of what is seen through the glass (1 = unchanged). */
  sat: number;
  spec: number;
  inner: number;
  absorb: number;
  grain: number;
  /** Linear luminance floor (dark ink) or ceiling (white ink) behind text. */
  contrastLum: number;
  jelly: number;
}

const rgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// The floor is set by the lightest dark text, --meta (#41474F, L≈0.062): 4.5:1 needs a
// background L ≥ 0.43. The ceiling is set by the dimmest white text (86% white): 4.5:1
// needs L ≤ ~0.13 behind it. Both keep a small margin.
const DARK_FLOOR = 0.47;
const LIGHT_CEIL = 0.115;

export const TREATMENTS: Record<string, Treatment> = {
  // Thin, clear crystal: crisp rim lensing with a touch of dispersion; frost gathers behind the text.
  lens: {
    id: 'lens', label: 'Clear lens', ink: 'dark', radius: 26, bevel: 22, refract: 0.6, dispersion: 0.06,
    frostEdge: 1.0, frostCore: 3.6, frostVar: 0.55, ripple: 1.2,
    tint0: rgb('#FFFFFF'), tint1: rgb('#FAFAF7'), tintA0: 0.26, tintA1: 0.9,
    gain: 1.03, lift: 0.02, coreShade: 0, sat: 1.05, spec: 0.7, inner: 0.08, absorb: 0.1, grain: 0.012,
    contrastLum: DARK_FLOOR, jelly: 0.8,
  },
  // Thick, soft-edged, milky: a deep rounded bevel that magnifies the clouds at the rim.
  jelly: {
    id: 'jelly', label: 'Soft jelly', ink: 'dark', radius: 32, bevel: 46, refract: 0.8, dispersion: 0.035,
    frostEdge: 2.0, frostCore: 4.6, frostVar: 0.9, ripple: 2.6,
    tint0: rgb('#F4F8FC'), tint1: rgb('#FAFAF7'), tintA0: 0.36, tintA1: 0.9,
    gain: 1.05, lift: 0.025, coreShade: 0, sat: 1.1, spec: 0.55, inner: 0.1, absorb: 0.16, grain: 0.014,
    contrastLum: DARK_FLOOR, jelly: 1,
  },
  // Smoked glass for white type: neutral graphite body, darker behind the text, bright rim.
  smoke: {
    id: 'smoke', label: 'Smoked glass', ink: 'light', radius: 28, bevel: 30, refract: 0.65, dispersion: 0.045,
    frostEdge: 1.6, frostCore: 4.8, frostVar: 0.8, ripple: 1.8,
    tint0: rgb('#1A1F27'), tint1: rgb('#161A20'), tintA0: 0.5, tintA1: 0.88,
    gain: 0.9, lift: 0, coreShade: 0.1, sat: 0.9, spec: 0.85, inner: 0.1, absorb: 0.12, grain: 0.012,
    contrastLum: LIGHT_CEIL, jelly: 0.9,
  },
  // Clear sky-blue glass for white type: keeps the sky's colour and darkens only where a
  // cloud behind would wash the text out.
  tide: {
    id: 'tide', label: 'Sky glass', ink: 'light', radius: 30, bevel: 36, refract: 0.75, dispersion: 0.05,
    frostEdge: 1.4, frostCore: 4.0, frostVar: 0.8, ripple: 2.2,
    tint0: rgb('#1F4E80'), tint1: rgb('#172A40'), tintA0: 0.42, tintA1: 0.88,
    gain: 0.86, lift: 0, coreShade: 0.06, sat: 1.35, spec: 0.8, inner: 0.1, absorb: 0.12, grain: 0.012,
    contrastLum: LIGHT_CEIL, jelly: 1,
  },
};

export const TREATMENT_ORDER = ['lens', 'jelly', 'smoke', 'tide'] as const;
export const DEFAULT_TREATMENT = 'jelly';
