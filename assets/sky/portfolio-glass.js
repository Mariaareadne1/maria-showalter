// sky/src/glass/shader.ts
var e = .5, t = class {
	canvas;
	gl;
	program;
	tex;
	uniforms = /* @__PURE__ */ new Map();
	copy = document.createElement("canvas");
	copyCtx;
	texSize = [0, 0];
	src = [
		0,
		0,
		0,
		0
	];
	hasSky = !1;
	skyLod = 1;
	constructor(e) {
		this.canvas = e;
		let t = e.getContext("webgl2", {
			alpha: !0,
			premultipliedAlpha: !0,
			antialias: !1,
			depth: !1,
			stencil: !1,
			powerPreference: "low-power"
		});
		if (!t) throw Error("WebGL 2 is not available.");
		this.gl = t, this.program = n(t, "#version 300 es\nin vec2 aPos;\nvoid main() { gl_Position = vec4(aPos, 0.0, 1.0); }\n", "#version 300 es\nprecision highp float;\nout vec4 outColor;\n\nuniform sampler2D uSky;\nuniform vec2 uCanvas;        // canvas size, CSS px\nuniform float uScale;        // device px per CSS px for this canvas\nuniform vec2 uOrigin;        // canvas top-left in the viewport, CSS px\nuniform vec4 uPanel;         // panel rect in canvas space: x0, y0, x1, y1 (CSS px)\nuniform vec2 uViewport;      // viewport size, CSS px\nuniform vec4 uSrc;           // viewport px -> sky uv: uv = v * uSrc.xy + uSrc.zw\nuniform float uP;            // scroll progress 0..1\nuniform float uPad;          // text column inset from the panel's side edges\n\n// treatment\nuniform float uRadius, uBevel, uRefract, uDispersion;\nuniform float uFrostEdge, uFrostCore, uFrostVar, uRipple;\nuniform vec3 uTint0, uTint1;\nuniform float uTintA0, uTintA1, uGain, uLift, uCoreShade, uSat;\nuniform float uSpec, uInner, uAbsorb, uGrain;\nuniform float uInkLight;     // 1 = white text sits on this glass\nuniform float uContrastLum;  // background luminance floor (dark ink) or ceiling (white ink)\nuniform float uSkyLod;       // mip bias for the texture's own resolution\n\n// veil (matches .sky-veil in sky.css)\nuniform float uVeilOn;\n\n// jelly\nuniform vec2 uPtr;           // pointer, canvas CSS px\nuniform float uHover;        // 0..1 pointer over the surface\nuniform float uNear;         // 0..1 pointer near an edge (surface tension)\nuniform float uPress;        // spring, ~0..1 with overshoot\nuniform float uSlosh;        // px, scroll-velocity spring\nuniform float uJelly;        // treatment strength\n\nfloat lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }\nvec3 toLin(vec3 c) { return pow(max(c, 0.0), vec3(2.2)); }\nvec3 toSrgb(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }\n\nfloat hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\nfloat vnoise(vec2 p) {\n  vec2 i = floor(p), f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);\n}\nfloat fbm(vec2 p) { return 0.6 * vnoise(p) + 0.3 * vnoise(p * 2.03 + 7.1) + 0.1 * vnoise(p * 4.1 + 3.7); }\nfloat ign(vec2 fc) { return fract(52.9829189 * fract(dot(fc, vec2(0.06711056, 0.00583715)))); }\n\n// Rounded box: signed distance and outward normal.\nfloat sdBox(vec2 p, vec2 b, float r) {\n  vec2 d = abs(p) - b + r;\n  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;\n}\nvec2 nBox(vec2 p, vec2 b, float r) {\n  vec2 d = abs(p) - b + r;\n  vec2 s = sign(p);\n  if (d.x > 0.0 && d.y > 0.0) return normalize(d) * s;\n  return d.x > d.y ? vec2(s.x, 0.0) : vec2(0.0, s.y);\n}\n\nvec2 skyUv(vec2 v) { return clamp(v * uSrc.xy + uSrc.zw, vec2(0.001), vec2(0.999)); }\n\nvec3 veil(vec3 c, float y) {\n  if (uVeilOn < 0.5) return c;\n  float t = clamp(y / uViewport.y, 0.0, 1.0);\n  float a = t < 0.55 ? mix(0.14, 0.16, t / 0.55) : mix(0.16, 0.36, (t - 0.55) / 0.45);\n  vec3 vc = mix(vec3(238.0, 244.0, 250.0), vec3(244.0, 246.0, 245.0), t) / 255.0;\n  c = mix(c, vc, a);\n  return mix(c, vec3(242.0, 245.0, 247.0) / 255.0, uP * 0.36);\n}\n\n// Frost: a rotated golden-angle disc over a mip level, so it is smooth, not blocky.\nvec3 frost(vec2 v, float lod, float rot) {\n  vec2 texel = 1.0 / vec2(textureSize(uSky, 0));\n  float l = max(lod - uSkyLod, 0.0);\n  float rad = exp2(l) * 1.1;\n  float tapLod = max(l - 1.4, 0.0);\n  vec2 uv = skyUv(v);\n  vec3 acc = vec3(0.0);\n  for (int i = 0; i < 8; i++) {\n    float fi = float(i);\n    float a = rot + fi * 2.39996;\n    float r = sqrt((fi + 0.5) / 8.0) * rad;\n    acc += textureLod(uSky, clamp(uv + vec2(cos(a), sin(a)) * r * texel, vec2(0.001), vec2(0.999)), tapLod).rgb;\n  }\n  return veil(acc / 8.0, v.y);\n}\n\nvoid main() {\n  vec2 q = vec2(gl_FragCoord.x, uCanvas.y * uScale - gl_FragCoord.y) / uScale;\n  vec2 c = (uPanel.xy + uPanel.zw) * 0.5;\n  vec2 hb = (uPanel.zw - uPanel.xy) * 0.5;\n  vec2 pc = q - c;\n\n  float sd = sdBox(pc, hb, uRadius);\n  if (sd > 1.0) { outColor = vec4(0.0); return; }\n\n  // Surface tension: the bevel widens a little where the pointer is near the rim.\n  vec2 dp = q - uPtr;\n  float near = uNear * exp(-dot(dp, dp) / (150.0 * 150.0)) * uJelly;\n  float bevel = uBevel * (1.0 + 0.55 * near);\n\n  // The bevel field uses a rounder corner so the normal turns smoothly.\n  float rr = max(uRadius, bevel);\n  float e = max(-sdBox(pc, hb, rr), 0.0);\n  float t = clamp(e / bevel, 0.0, 1.0);\n  vec2 n = nBox(pc, hb, rr);\n  float rim = 1.0 - t;\n\n  // Panel-space coordinates: the glass texture moves with the sheet, and trails a\n  // little when scrolled fast (slosh).\n  vec2 qp = q - uPanel.xy + vec2(0.0, uSlosh);\n\n  // Refraction: at the bevel the slab bends rays outward, so the rim shows a\n  // compressed strip of sky from just beyond the edge.\n  vec2 disp = n * bevel * uRefract * pow(rim, 1.6) * 1.6;\n  // gentle waviness across the whole surface\n  vec2 wv = vec2(fbm(qp / 210.0), fbm(qp / 210.0 + 19.7)) - 0.5;\n  disp += wv * uRipple * 2.0;\n\n  // Pointer lens: a soft dome that magnifies a little; a press dents it, then it springs back.\n  float R = 170.0;\n  float g = exp(-dot(dp, dp) / (R * R));\n  float dome = (uHover * 0.55 - uPress * 0.9) * uJelly;\n  disp -= dp / R * g * dome * 16.0;\n  disp.y += uSlosh * 0.35 * g;\n\n  vec2 v = q + uOrigin;   // viewport position of this pixel\n\n  // Frost varies: clearer near the rim, densest over the text column, with a soft\n  // hand-made unevenness.\n  float sideE = min(q.x - uPanel.x, uPanel.z - q.x);\n  float column = smoothstep(uPad * 0.1, uPad * 2.4, sideE);\n  float core = column * smoothstep(bevel * 0.5, bevel * 3.5, e);\n  float lod = mix(uFrostEdge, uFrostCore, core) + uFrostVar * (fbm(qp / 340.0 + 3.3) - 0.5) * 2.0;\n  // pressing into the slab clears its frost a little, like warmth on frosted glass\n  lod -= (0.9 * uHover + 0.8 * max(uPress, 0.0)) * g * uJelly;\n  float rot = ign(gl_FragCoord.xy) * 6.2831;\n\n  vec3 col;\n  if (rim > 0.001 && uDispersion > 0.0) {\n    float k = uDispersion * rim;\n    col.r = frost(v + disp * (1.0 - k), lod, rot).r;\n    col.g = frost(v + disp, lod, rot).g;\n    col.b = frost(v + disp * (1.0 + k), lod, rot).b;\n  } else {\n    col = frost(v + disp, lod, rot);\n  }\n\n  // Body: tint (which deepens or whitens as the reader scrolls), gain and lift.\n  vec3 tint = mix(uTint0, uTint1, uP);\n  float ta = mix(uTintA0, uTintA1, uP);\n  col = mix(col, tint, ta);\n  col = col * uGain + uLift;\n  col = mix(vec3(lum(col)), col, uSat);\n  // a faint internal gradient behind the text, darker toward the middle of the column\n  col *= 1.0 - uCoreShade * core * (0.75 + 0.25 * smoothstep(0.0, 1.0, 1.0 - abs(q.x - c.x) / max(hb.x, 1.0)));\n\n  // Thickness: absorption along the lower rims, the slab's far edge seen through it,\n  // and a luminous specular rim lit from the upper left.\n  vec2 toLight = normalize(vec2(-0.35, -1.0));\n  float facing = dot(n, toLight);\n  col *= 1.0 - uAbsorb * pow(rim, 2.0) * max(-facing, 0.0);\n  // (not along the top, where the masthead rule sits)\n  float farEdge = exp(-pow((e - bevel * 0.92) / 1.6, 2.0)) * (1.0 - smoothstep(0.4, 0.9, -n.y));\n  col += uInner * farEdge * (facing > 0.0 ? 0.55 : -0.25) * (0.4 + 0.6 * abs(facing));\n  float spec = pow(max(facing, 0.0), 1.5) * pow(rim, 3.5) + 0.38 * pow(max(-facing, 0.0), 2.0) * pow(rim, 5.0);\n  col += uSpec * spec;\n  // The dome (or dent) catches the light: sheen on its lit side, shade on the other.\n  vec2 domeN = dp / R * g * dome;            // surface slope of the bump\n  float domeLight = dot(domeN, toLight);\n  col += 0.24 * domeLight * (1.0 - 0.4 * uInkLight);\n  col += 0.035 * uJelly * uHover * g;\n\n  // Contrast floor (or ceiling) behind text, computed per pixel in linear light.\n  // text can sit anywhere in the column, including the masthead on the top rim\n  float tm = smoothstep(uPad * 0.15, uPad * 0.85, sideE) * smoothstep(4.0, 14.0, e);\n  vec3 lin = toLin(col);\n  float L = lum(lin);\n  if (uInkLight > 0.5) {\n    // pull toward a deeper shade of the body tint (keeps the hue; no grey smudges)\n    vec3 deep = toLin(tint) * 0.55;\n    float Ld = lum(deep);\n    float k = L > uContrastLum ? clamp((L - uContrastLum) / max(L - Ld, 1e-3), 0.0, 1.0) : 0.0;\n    lin = mix(lin, deep, k * tm);\n  } else if (L < uContrastLum) {\n    float k = (uContrastLum - L) / max(1.0 - L, 1e-3);\n    lin = mix(lin, mix(lin, vec3(1.0), k), tm);\n  }\n  col = toSrgb(lin);\n\n  col += (ign(gl_FragCoord.xy + 17.0) - 0.5) * uGrain;\n  float a = clamp(0.5 - sd, 0.0, 1.0);\n  outColor = vec4(clamp(col, 0.0, 1.0) * a, a);\n}\n");
		let r = t.createBuffer();
		t.bindBuffer(t.ARRAY_BUFFER, r), t.bufferData(t.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			3,
			-1,
			-1,
			3
		]), t.STATIC_DRAW);
		let i = t.createVertexArray();
		t.bindVertexArray(i);
		let a = t.getAttribLocation(this.program, "aPos");
		t.enableVertexAttribArray(a), t.vertexAttribPointer(a, 2, t.FLOAT, !1, 0, 0), this.tex = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.tex), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR_MIPMAP_LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), this.copyCtx = this.copy.getContext("2d", { alpha: !1 });
	}
	get ready() {
		return this.hasSky;
	}
	uploadLive(t, n) {
		let r = performance.now(), i = Math.max(2, Math.round(n[0] * e)), a = Math.max(2, Math.round(n[1] * e));
		return this.copyCtx ? ((this.copy.width !== i || this.copy.height !== a) && (this.copy.width = i, this.copy.height = a), this.copyCtx.drawImage(t, 0, 0, i, a), this.upload(this.copy, i, a), this.src = [
			1 / n[0],
			1 / n[1],
			0,
			0
		], this.skyLod = Math.log2(1 / e), performance.now() - r) : 0;
	}
	uploadImage(e, t, n = .5, r = .35) {
		let i = e.naturalWidth, a = e.naturalHeight;
		i && a && (this.upload(e, i, a), this.mapCover(i, a, t, n, r), this.imageInfo = {
			iw: i,
			ih: a,
			posX: n,
			posY: r
		});
	}
	imageInfo = null;
	refit(e) {
		let t = this.imageInfo;
		t && this.mapCover(t.iw, t.ih, e, t.posX, t.posY);
	}
	mapCover(e, t, n, r, i) {
		let [a, o] = n, s = Math.max(a / e, o / t), c = e * s, l = t * s, u = (a - c) * r, d = (o - l) * i;
		this.src = [
			1 / c,
			1 / l,
			-u / c,
			-d / l
		], this.skyLod = Math.log2(s);
	}
	liveEnded() {
		this.imageInfo = null;
	}
	upload(e, t, n) {
		let r = this.gl;
		r.bindTexture(r.TEXTURE_2D, this.tex), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), this.texSize[0] !== t || this.texSize[1] !== n ? (r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, e), this.texSize = [t, n]) : r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, e), r.generateMipmap(r.TEXTURE_2D), this.hasSky = !0;
	}
	resize(e, t, n) {
		let r = Math.max(1, Math.round(e * n)), i = Math.max(1, Math.round(t * n));
		(this.canvas.width !== r || this.canvas.height !== i) && (this.canvas.width = r, this.canvas.height = i);
	}
	draw(e, t) {
		if (!this.hasSky) return;
		let n = this.gl;
		n.viewport(0, 0, this.canvas.width, this.canvas.height), n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.useProgram(this.program), n.activeTexture(n.TEXTURE0), n.bindTexture(n.TEXTURE_2D, this.tex);
		let r = (e) => (this.uniforms.has(e) || this.uniforms.set(e, n.getUniformLocation(this.program, e)), this.uniforms.get(e));
		n.uniform1i(r("uSky"), 0), n.uniform2f(r("uCanvas"), e.canvas[0], e.canvas[1]), n.uniform1f(r("uScale"), this.canvas.width / Math.max(1, e.canvas[0])), n.uniform2f(r("uOrigin"), e.origin[0], e.origin[1]), n.uniform4f(r("uPanel"), ...e.panel), n.uniform2f(r("uViewport"), e.viewport[0], e.viewport[1]), n.uniform4f(r("uSrc"), ...this.src), n.uniform1f(r("uP"), e.p), n.uniform1f(r("uPad"), e.pad), n.uniform1f(r("uSkyLod"), this.skyLod), n.uniform1f(r("uVeilOn"), +!!e.veil), n.uniform1f(r("uRadius"), t.radius), n.uniform1f(r("uBevel"), t.bevel), n.uniform1f(r("uRefract"), t.refract), n.uniform1f(r("uDispersion"), t.dispersion), n.uniform1f(r("uFrostEdge"), t.frostEdge), n.uniform1f(r("uFrostCore"), t.frostCore), n.uniform1f(r("uFrostVar"), t.frostVar), n.uniform1f(r("uRipple"), t.ripple), n.uniform3f(r("uTint0"), ...t.tint0), n.uniform3f(r("uTint1"), ...t.tint1), n.uniform1f(r("uTintA0"), t.tintA0), n.uniform1f(r("uTintA1"), t.tintA1), n.uniform1f(r("uGain"), t.gain), n.uniform1f(r("uLift"), t.lift), n.uniform1f(r("uCoreShade"), t.coreShade), n.uniform1f(r("uSat"), t.sat), n.uniform1f(r("uSpec"), t.spec), n.uniform1f(r("uInner"), t.inner), n.uniform1f(r("uAbsorb"), t.absorb), n.uniform1f(r("uGrain"), t.grain), n.uniform1f(r("uInkLight"), +(t.ink === "light")), n.uniform1f(r("uContrastLum"), t.contrastLum), n.uniform2f(r("uPtr"), e.ptr[0], e.ptr[1]), n.uniform1f(r("uHover"), e.hover), n.uniform1f(r("uNear"), e.near), n.uniform1f(r("uPress"), e.press), n.uniform1f(r("uSlosh"), e.slosh), n.uniform1f(r("uJelly"), t.jelly), n.drawArrays(n.TRIANGLES, 0, 3);
	}
	dispose() {
		this.gl.getExtension("WEBGL_lose_context")?.loseContext();
	}
};
function n(e, t, n) {
	let r = (t, n) => {
		let r = e.createShader(t);
		if (e.shaderSource(r, n), e.compileShader(r), !e.getShaderParameter(r, e.COMPILE_STATUS)) throw Error(`Glass shader: ${e.getShaderInfoLog(r)}`);
		return r;
	}, i = e.createProgram();
	if (e.attachShader(i, r(e.VERTEX_SHADER, t)), e.attachShader(i, r(e.FRAGMENT_SHADER, n)), e.linkProgram(i), !e.getProgramParameter(i, e.LINK_STATUS)) throw Error(`Glass program: ${e.getProgramInfoLog(i)}`);
	return i;
}
// sky/src/glass/springs.ts
var r = class {
	omega;
	zeta;
	value;
	velocity = 0;
	target;
	constructor(e, t, n) {
		this.omega = t, this.zeta = n, this.value = this.target = e;
	}
	step(e) {
		let t = this.omega * this.omega, n = 2 * this.zeta * this.omega, r = Math.max(1, Math.ceil(e / (1 / 240))), i = e / r;
		for (let e = 0; e < r; e++) this.velocity += (-t * (this.value - this.target) - n * this.velocity) * i, this.value += this.velocity * i;
	}
	snap(e = this.target) {
		this.value = this.target = e, this.velocity = 0;
	}
	get resting() {
		return Math.abs(this.value - this.target) < .001 && Math.abs(this.velocity) < .001;
	}
}, i = class {
	enabled;
	x = new r(0, 16, .9);
	y = new r(0, 16, .9);
	hover = new r(0, 9, 1);
	near = new r(0, 9, 1);
	press = new r(0, 22, .42);
	slosh = new r(0, 11, .5);
	placed = !1;
	constructor(e) {
		this.enabled = e;
	}
	pointer(e, t, n, r) {
		this.enabled && (this.placed ||= (this.x.snap(e), this.y.snap(t), !0), this.x.target = e, this.y.target = t, this.hover.target = n, this.near.target = r);
	}
	leave() {
		this.hover.target = 0, this.near.target = 0, this.press.target = 0;
	}
	setPress(e) {
		this.enabled && (this.press.target = +!!e);
	}
	scrolled(e) {
		if (!this.enabled) return;
		let t = Math.max(-1, Math.min(1, e / 80));
		this.slosh.velocity += t * 26;
	}
	step(e) {
		for (let t of this.springs) t.step(e);
		Math.abs(this.slosh.value) > 9 && (this.slosh.value = Math.sign(this.slosh.value) * 9);
	}
	get resting() {
		return this.springs.every((e) => e.resting);
	}
	get springs() {
		return [
			this.x,
			this.y,
			this.hover,
			this.near,
			this.press,
			this.slosh
		];
	}
}, a = (e) => {
	let t = parseInt(e.slice(1), 16);
	return [
		(t >> 16 & 255) / 255,
		(t >> 8 & 255) / 255,
		(t & 255) / 255
	];
}, o = .47, s = .115, c = {
	lens: {
		id: "lens",
		label: "Clear lens",
		ink: "dark",
		radius: 26,
		bevel: 22,
		refract: .6,
		dispersion: .06,
		frostEdge: 1,
		frostCore: 3.6,
		frostVar: .55,
		ripple: 1.2,
		tint0: a("#FFFFFF"),
		tint1: a("#FAFAF7"),
		tintA0: .26,
		tintA1: .9,
		gain: 1.03,
		lift: .02,
		coreShade: 0,
		sat: 1.05,
		spec: .7,
		inner: .08,
		absorb: .1,
		grain: .012,
		contrastLum: o,
		jelly: .8
	},
	jelly: {
		id: "jelly",
		label: "Soft jelly",
		ink: "dark",
		radius: 32,
		bevel: 46,
		refract: .8,
		dispersion: .035,
		frostEdge: 2,
		frostCore: 4.6,
		frostVar: .9,
		ripple: 2.6,
		tint0: a("#F4F8FC"),
		tint1: a("#FAFAF7"),
		tintA0: .36,
		tintA1: .9,
		gain: 1.05,
		lift: .025,
		coreShade: 0,
		sat: 1.1,
		spec: .55,
		inner: .1,
		absorb: .16,
		grain: .014,
		contrastLum: o,
		jelly: 1
	},
	smoke: {
		id: "smoke",
		label: "Smoked glass",
		ink: "light",
		radius: 28,
		bevel: 30,
		refract: .65,
		dispersion: .045,
		frostEdge: 1.6,
		frostCore: 4.8,
		frostVar: .8,
		ripple: 1.8,
		tint0: a("#1A1F27"),
		tint1: a("#161A20"),
		tintA0: .5,
		tintA1: .88,
		gain: .9,
		lift: 0,
		coreShade: .1,
		sat: .9,
		spec: .85,
		inner: .1,
		absorb: .12,
		grain: .012,
		contrastLum: s,
		jelly: .9
	},
	tide: {
		id: "tide",
		label: "Sky glass",
		ink: "light",
		radius: 30,
		bevel: 36,
		refract: .75,
		dispersion: .05,
		frostEdge: 1.4,
		frostCore: 4,
		frostVar: .8,
		ripple: 2.2,
		tint0: a("#1F4E80"),
		tint1: a("#172A40"),
		tintA0: .42,
		tintA1: .88,
		gain: .86,
		lift: 0,
		coreShade: .06,
		sat: 1.35,
		spec: .8,
		inner: .1,
		absorb: .12,
		grain: .012,
		contrastLum: s,
		jelly: 1
	}
}, l = [
	"lens",
	"jelly",
	"smoke",
	"tide"
], u = "jelly", d = "mariashowalter.com/sky/still/v1", f = "/assets/sky/sky-still.jpg", p = 1, m = 110, h = document.documentElement, g = (e) => window.matchMedia?.(e).matches ?? !1;
function _() {
	let e = new URLSearchParams(location.search).get("glass");
	if (e && c[e]) return c[e];
	let t = h.dataset.glass;
	return t && c[t] ? c[t] : c[u];
}
function v(e) {
	h.dataset.glass = e.id, h.dataset.ink = e.ink, h.style.setProperty("--glass-radius", `${e.radius}px`);
}
function y() {
	try {
		let e = localStorage.getItem(d);
		if (e && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(e)) return e;
	} catch {}
	return f;
}
function b() {
	let e = document.querySelector(".sheet");
	if (!e) return;
	let n = _();
	v(n);
	let r = {
		uploads: 0,
		draws: 0,
		uploadMs: 0
	}, a = "css", o = {
		get treatment() {
			return n;
		},
		get state() {
			return a;
		},
		stats: r,
		setTreatment(e) {
			c[e] && (n = c[e], v(n), P(), R());
		}
	};
	if (window.__portfolioGlass = o, new URLSearchParams(location.search).has("glass-compare") && x(o), g("(prefers-reduced-transparency: reduce)") || g("(prefers-contrast: more)") || g("(forced-colors: active)")) return;
	let s = document.createElement("div");
	s.className = "glass-clip", s.setAttribute("aria-hidden", "true");
	let l = document.createElement("canvas");
	l.className = "glass-canvas", s.appendChild(l), e.prepend(s);
	let u;
	try {
		u = new t(l);
	} catch {
		s.remove();
		return;
	}
	let d = new i(!g("(prefers-reduced-motion: reduce)")), b = !!document.querySelector(".sky-veil"), S = window.__skyProgress ?? 0, C = 48, w = 0, T = 0, E = 0, D = 0, O = 0, k = l.getBoundingClientRect(), A = e.getBoundingClientRect(), j = window.scrollY, M = null, N = () => [window.innerWidth, document.documentElement.clientHeight || window.innerHeight];
	function P() {
		let t = e.querySelector(".wrap");
		C = t && parseFloat(getComputedStyle(t).paddingLeft) || 48;
	}
	P();
	function F() {
		k = l.getBoundingClientRect(), A = e.getBoundingClientRect(), u.resize(k.width, k.height, p);
	}
	function I(e) {
		if (h.classList.contains("sky-editing") || !u.ready) return;
		let t = T ? Math.min(.05, (e - T) / 1e3) : 1 / 60;
		T = e, d.step(t), F();
		let i = {
			canvas: [k.width, k.height],
			origin: [k.left, k.top],
			panel: [
				A.left - k.left,
				A.top - k.top,
				A.right - k.left,
				A.bottom - k.top
			],
			viewport: N(),
			pad: C,
			p: S,
			veil: b,
			ptr: [d.x.value, d.y.value],
			hover: d.hover.value,
			near: d.near.value,
			press: d.press.value,
			slosh: d.slosh.value
		};
		u.draw(i, n), L = !1, r.draws++, a === "css" && (a = u.ready ? M ? "live" : "image" : "css", h.dataset.glassState = a);
	}
	let L = !1;
	function R() {
		L = !0, w ||= requestAnimationFrame((e) => {
			w = 0, L && (I(e), !d.resting && performance.now() - E > 50 && R());
		});
	}
	function z(e) {
		let t = new Image();
		t.decoding = "async", t.onload = () => {
			M || (u.uploadImage(t, N()), R());
		}, t.onerror = () => {
			e !== f && z(f);
		}, t.src = e;
	}
	z(y());
	function B(e) {
		M?.(), M = e.onAfterRender((e) => {
			if (!h.classList.contains("sky-editing")) {
				if (E = performance.now(), O++, O % (D < 1.5 ? 1 : D < 4 ? 2 : 4) == 0 || !u.ready) {
					let t = u.uploadLive(e, N());
					D = D ? D * .9 + t * .1 : t, r.uploads++, r.uploadMs = D;
				}
				I(E), a === "image" && (h.dataset.glassState = a = "live");
			}
		});
	}
	function V() {
		M?.(), M = null, E = 0, u.liveEnded(), a === "live" && (h.dataset.glassState = a = "image"), z(y());
	}
	let H = window.__portfolioSky?.sky.engine;
	H && B(H), window.addEventListener("sky:engine", (e) => B(e.detail)), window.addEventListener("sky:engine-ended", V), window.addEventListener("sky:progress", (e) => {
		S = e.detail, R();
	}), window.addEventListener("scroll", () => {
		let e = window.scrollY;
		d.scrolled(e - j), j = e, R();
	}, { passive: !0 }), window.addEventListener("resize", () => {
		P(), u.refit(N()), R();
	});
	let U = (e) => [e.clientX - k.left, e.clientY - k.top], W = (e, t) => {
		let n = e + k.left, r = t + k.top, i = n >= A.left && n <= A.right && r >= A.top && r <= A.bottom, a = Math.max(A.left - n, 0, n - A.right), o = Math.max(A.top - r, 0, r - A.bottom), s = i ? Math.min(n - A.left, A.right - n, r - A.top, A.bottom - r) : Math.hypot(a, o);
		return {
			inside: i,
			near: Math.max(0, 1 - s / m)
		};
	};
	window.addEventListener("pointermove", (e) => {
		if (e.pointerType === "touch" && !e.buttons) return;
		let [t, n] = U(e), { inside: r, near: i } = W(t, n);
		d.pointer(t, n, +!!r, i), R();
	}, { passive: !0 }), window.addEventListener("pointerdown", (e) => {
		let [t, n] = U(e), { inside: r, near: i } = W(t, n);
		r && (d.pointer(t, n, 1, i), d.setPress(!0), R());
	}, { passive: !0 });
	let G = (e) => {
		d.setPress(!1), e.pointerType === "touch" && d.leave(), R();
	};
	window.addEventListener("pointerup", G, { passive: !0 }), window.addEventListener("pointercancel", G, { passive: !0 }), document.documentElement.addEventListener("pointerleave", () => {
		d.leave(), R();
	}), l.addEventListener("webglcontextlost", (e) => {
		e.preventDefault(), h.dataset.glassState = a = "css";
	}), l.addEventListener("webglcontextrestored", () => location.reload());
}
function x(e) {
	let t = document.createElement("div");
	t.className = "glass-switch", t.setAttribute("role", "group"), t.setAttribute("aria-label", "Panel material");
	for (let n of l) {
		let r = document.createElement("button");
		r.type = "button", r.textContent = c[n].label, r.setAttribute("aria-pressed", String(e.treatment.id === n)), r.addEventListener("click", () => {
			e.setTreatment(n);
			for (let e of t.querySelectorAll("button")) e.setAttribute("aria-pressed", String(e === r));
			let i = new URL(location.href);
			i.searchParams.set("glass", n), history.replaceState(null, "", i);
		}), t.appendChild(r);
	}
	document.body.appendChild(t);
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", b, { once: !0 }) : b();
