/**
 * The glass slab, drawn into a panel-sized canvas that scrolls with the sheet.
 *
 * Inputs are in CSS pixels of the canvas (origin top-left). The sky texture is the
 * viewport behind the sheet (live renderer frame or the still), mip-mapped so frost
 * is a cheap level-of-detail lookup. Everything optical happens here: refraction at
 * the bevel, surface waviness, varied frost, body tint, thickness cues, specular rim,
 * the pointer lens, and a per-pixel contrast floor for the text that sits on top.
 */

export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;

uniform sampler2D uSky;
uniform vec2 uCanvas;        // canvas size, CSS px
uniform float uScale;        // device px per CSS px for this canvas
uniform vec2 uOrigin;        // canvas top-left in the viewport, CSS px
uniform vec4 uPanel;         // panel rect in canvas space: x0, y0, x1, y1 (CSS px)
uniform vec2 uViewport;      // viewport size, CSS px
uniform vec4 uSrc;           // viewport px -> sky uv: uv = v * uSrc.xy + uSrc.zw
uniform float uP;            // scroll progress 0..1
uniform float uPad;          // text column inset from the panel's side edges

// treatment
uniform float uRadius, uBevel, uRefract, uDispersion;
uniform float uFrostEdge, uFrostCore, uFrostVar, uRipple;
uniform vec3 uTint0, uTint1;
uniform float uTintA0, uTintA1, uGain, uLift, uCoreShade, uSat;
uniform float uSpec, uInner, uAbsorb, uGrain;
uniform float uInkLight;     // 1 = white text sits on this glass
uniform float uContrastLum;  // background luminance floor (dark ink) or ceiling (white ink)
uniform float uSkyLod;       // mip bias for the texture's own resolution

// veil (matches .sky-veil in sky.css)
uniform float uVeilOn;

// jelly
uniform vec2 uPtr;           // pointer, canvas CSS px
uniform float uHover;        // 0..1 pointer over the surface
uniform float uNear;         // 0..1 pointer near an edge (surface tension)
uniform float uPress;        // spring, ~0..1 with overshoot
uniform float uSlosh;        // px, scroll-velocity spring
uniform float uJelly;        // treatment strength

float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 toLin(vec3 c) { return pow(max(c, 0.0), vec3(2.2)); }
vec3 toSrgb(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { return 0.6 * vnoise(p) + 0.3 * vnoise(p * 2.03 + 7.1) + 0.1 * vnoise(p * 4.1 + 3.7); }
float ign(vec2 fc) { return fract(52.9829189 * fract(dot(fc, vec2(0.06711056, 0.00583715)))); }

// Rounded box: signed distance and outward normal.
float sdBox(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + r;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}
vec2 nBox(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + r;
  vec2 s = sign(p);
  if (d.x > 0.0 && d.y > 0.0) return normalize(d) * s;
  return d.x > d.y ? vec2(s.x, 0.0) : vec2(0.0, s.y);
}

vec2 skyUv(vec2 v) { return clamp(v * uSrc.xy + uSrc.zw, vec2(0.001), vec2(0.999)); }

vec3 veil(vec3 c, float y) {
  if (uVeilOn < 0.5) return c;
  float t = clamp(y / uViewport.y, 0.0, 1.0);
  float a = t < 0.55 ? mix(0.14, 0.16, t / 0.55) : mix(0.16, 0.36, (t - 0.55) / 0.45);
  vec3 vc = mix(vec3(238.0, 244.0, 250.0), vec3(244.0, 246.0, 245.0), t) / 255.0;
  c = mix(c, vc, a);
  return mix(c, vec3(242.0, 245.0, 247.0) / 255.0, uP * 0.36);
}

// Frost: a rotated golden-angle disc over a mip level, so it is smooth, not blocky.
vec3 frost(vec2 v, float lod, float rot) {
  vec2 texel = 1.0 / vec2(textureSize(uSky, 0));
  float l = max(lod - uSkyLod, 0.0);
  float rad = exp2(l) * 1.1;
  float tapLod = max(l - 1.4, 0.0);
  vec2 uv = skyUv(v);
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float a = rot + fi * 2.39996;
    float r = sqrt((fi + 0.5) / 8.0) * rad;
    acc += textureLod(uSky, clamp(uv + vec2(cos(a), sin(a)) * r * texel, vec2(0.001), vec2(0.999)), tapLod).rgb;
  }
  return veil(acc / 8.0, v.y);
}

void main() {
  vec2 q = vec2(gl_FragCoord.x, uCanvas.y * uScale - gl_FragCoord.y) / uScale;
  vec2 c = (uPanel.xy + uPanel.zw) * 0.5;
  vec2 hb = (uPanel.zw - uPanel.xy) * 0.5;
  vec2 pc = q - c;

  float sd = sdBox(pc, hb, uRadius);
  if (sd > 1.0) { outColor = vec4(0.0); return; }

  // Surface tension: the bevel widens a little where the pointer is near the rim.
  vec2 dp = q - uPtr;
  float near = uNear * exp(-dot(dp, dp) / (150.0 * 150.0)) * uJelly;
  float bevel = uBevel * (1.0 + 0.55 * near);

  // The bevel field uses a rounder corner so the normal turns smoothly.
  float rr = max(uRadius, bevel);
  float e = max(-sdBox(pc, hb, rr), 0.0);
  float t = clamp(e / bevel, 0.0, 1.0);
  vec2 n = nBox(pc, hb, rr);
  float rim = 1.0 - t;

  // Panel-space coordinates: the glass texture moves with the sheet, and trails a
  // little when scrolled fast (slosh).
  vec2 qp = q - uPanel.xy + vec2(0.0, uSlosh);

  // Refraction: at the bevel the slab bends rays outward, so the rim shows a
  // compressed strip of sky from just beyond the edge.
  vec2 disp = n * bevel * uRefract * pow(rim, 1.6) * 1.6;
  // gentle waviness across the whole surface
  vec2 wv = vec2(fbm(qp / 210.0), fbm(qp / 210.0 + 19.7)) - 0.5;
  disp += wv * uRipple * 2.0;

  // Pointer lens: a soft dome that magnifies a little; a press dents it, then it springs back.
  float R = 170.0;
  float g = exp(-dot(dp, dp) / (R * R));
  float dome = (uHover * 0.55 - uPress * 0.9) * uJelly;
  disp -= dp / R * g * dome * 16.0;
  disp.y += uSlosh * 0.35 * g;

  vec2 v = q + uOrigin;   // viewport position of this pixel

  // Frost varies: clearer near the rim, densest over the text column, with a soft
  // hand-made unevenness.
  float sideE = min(q.x - uPanel.x, uPanel.z - q.x);
  float column = smoothstep(uPad * 0.1, uPad * 2.4, sideE);
  float core = column * smoothstep(bevel * 0.5, bevel * 3.5, e);
  float lod = mix(uFrostEdge, uFrostCore, core) + uFrostVar * (fbm(qp / 340.0 + 3.3) - 0.5) * 2.0;
  // pressing into the slab clears its frost a little, like warmth on frosted glass
  lod -= (0.9 * uHover + 0.8 * max(uPress, 0.0)) * g * uJelly;
  float rot = ign(gl_FragCoord.xy) * 6.2831;

  vec3 col;
  if (rim > 0.001 && uDispersion > 0.0) {
    float k = uDispersion * rim;
    col.r = frost(v + disp * (1.0 - k), lod, rot).r;
    col.g = frost(v + disp, lod, rot).g;
    col.b = frost(v + disp * (1.0 + k), lod, rot).b;
  } else {
    col = frost(v + disp, lod, rot);
  }

  // Body: tint (which deepens or whitens as the reader scrolls), gain and lift.
  vec3 tint = mix(uTint0, uTint1, uP);
  float ta = mix(uTintA0, uTintA1, uP);
  col = mix(col, tint, ta);
  col = col * uGain + uLift;
  col = mix(vec3(lum(col)), col, uSat);
  // a faint internal gradient behind the text, darker toward the middle of the column
  col *= 1.0 - uCoreShade * core * (0.75 + 0.25 * smoothstep(0.0, 1.0, 1.0 - abs(q.x - c.x) / max(hb.x, 1.0)));

  // Thickness: absorption along the lower rims, the slab's far edge seen through it,
  // and a luminous specular rim lit from the upper left.
  vec2 toLight = normalize(vec2(-0.35, -1.0));
  float facing = dot(n, toLight);
  col *= 1.0 - uAbsorb * pow(rim, 2.0) * max(-facing, 0.0);
  // (not along the top, where the masthead rule sits)
  float farEdge = exp(-pow((e - bevel * 0.92) / 1.6, 2.0)) * (1.0 - smoothstep(0.4, 0.9, -n.y));
  col += uInner * farEdge * (facing > 0.0 ? 0.55 : -0.25) * (0.4 + 0.6 * abs(facing));
  float spec = pow(max(facing, 0.0), 1.5) * pow(rim, 3.5) + 0.38 * pow(max(-facing, 0.0), 2.0) * pow(rim, 5.0);
  col += uSpec * spec;
  // The dome (or dent) catches the light: sheen on its lit side, shade on the other.
  vec2 domeN = dp / R * g * dome;            // surface slope of the bump
  float domeLight = dot(domeN, toLight);
  col += 0.24 * domeLight * (1.0 - 0.4 * uInkLight);
  col += 0.035 * uJelly * uHover * g;

  // Contrast floor (or ceiling) behind text, computed per pixel in linear light.
  // text can sit anywhere in the column, including the masthead on the top rim
  float tm = smoothstep(uPad * 0.15, uPad * 0.85, sideE) * smoothstep(4.0, 14.0, e);
  vec3 lin = toLin(col);
  float L = lum(lin);
  if (uInkLight > 0.5) {
    // pull toward a deeper shade of the body tint (keeps the hue; no grey smudges)
    vec3 deep = toLin(tint) * 0.55;
    float Ld = lum(deep);
    float k = L > uContrastLum ? clamp((L - uContrastLum) / max(L - Ld, 1e-3), 0.0, 1.0) : 0.0;
    lin = mix(lin, deep, k * tm);
  } else if (L < uContrastLum) {
    float k = (uContrastLum - L) / max(1.0 - L, 1e-3);
    lin = mix(lin, mix(lin, vec3(1.0), k), tm);
  }
  col = toSrgb(lin);

  col += (ign(gl_FragCoord.xy + 17.0) - 0.5) * uGrain;
  float a = clamp(0.5 - sd, 0.0, 1.0);
  outColor = vec4(clamp(col, 0.0, 1.0) * a, a);
}
`;
