// node_modules/zustand/esm/vanilla.mjs
var e = (e) => {
	let t, n = /* @__PURE__ */ new Set(), r = (e, r) => {
		let i = typeof e == "function" ? e(t) : e;
		if (!Object.is(i, t)) {
			let e = t;
			t = r ?? (typeof i != "object" || !i) ? i : Object.assign({}, t, i), n.forEach((n) => n(t, e));
		}
	}, i = () => t, a = {
		setState: r,
		getState: i,
		getInitialState: () => o,
		subscribe: (e) => (n.add(e), () => n.delete(e))
	}, o = t = e(r, i, a);
	return a;
}, t = ((t) => t ? e(t) : e), n = (e, t) => [
	e[0] + t[0],
	e[1] + t[1],
	e[2] + t[2]
], r = (e, t) => [
	e[0] - t[0],
	e[1] - t[1],
	e[2] - t[2]
], i = (e, t) => [
	e[0] * t,
	e[1] * t,
	e[2] * t
], a = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2], o = (e, t) => [
	e[1] * t[2] - e[2] * t[1],
	e[2] * t[0] - e[0] * t[2],
	e[0] * t[1] - e[1] * t[0]
], s = (e) => Math.hypot(e[0], e[1], e[2]), c = (e) => {
	let t = s(e) || 1;
	return [
		e[0] / t,
		e[1] / t,
		e[2] / t
	];
}, l = (e, t, n) => e + (t - e) * n, u = (e, t, n) => Math.min(n, Math.max(t, e)), d = (e, t, n) => {
	let r = u((n - e) / (t - e), 0, 1);
	return r * r * (3 - 2 * r);
}, f = Math.PI / 180, p = (e, t) => [
	Math.sin(e) * Math.cos(t),
	Math.sin(t),
	-Math.cos(e) * Math.cos(t)
], m = 15 * f, h = 50 * f, g = -82 * f, _ = 75 * f, v = .05, y = {
	x: 0,
	z: 0,
	yaw: 0,
	pitch: m,
	altitude: 1
};
function b(e) {
	let t = Math.PI * 2, n = e.yaw % t;
	n > Math.PI && (n -= t), n < -Math.PI && (n += t);
	let r = (e) => Number.isFinite(e) ? e : 0, i = r(e.x), a = r(e.z), o = Math.hypot(i, a);
	return o > 60 && (i *= 60 / o, a *= 60 / o), {
		x: i,
		z: a,
		yaw: Number.isFinite(n) ? n : 0,
		pitch: Math.min(_, Math.max(g, Number.isFinite(e.pitch) ? e.pitch : m)),
		altitude: Math.min(16, Math.max(v, Number.isFinite(e.altitude) ? e.altitude : 1))
	};
}
function x(e, t = y, n = h) {
	let { yaw: r, pitch: i, altitude: a } = t, s = Number.isFinite(t.x) ? t.x : 0, l = Number.isFinite(t.z) ? t.z : 0, u = c([
		Math.sin(r) * Math.cos(i),
		Math.sin(i),
		-Math.cos(r) * Math.cos(i)
	]), d = c(o(u, [
		0,
		1,
		0
	])), f = o(d, u);
	return {
		position: [
			s,
			a,
			l
		],
		forward: u,
		right: d,
		up: f,
		fovY: n,
		aspect: e
	};
}
function S(e, t, r) {
	let a = Math.tan(e.fovY / 2);
	return c(n(n(e.forward, i(e.right, t * a * e.aspect)), i(e.up, r * a)));
}
function C(e, t) {
	let n = r(t, e.position), i = a(n, e.forward);
	if (i <= 1e-6) return null;
	let o = Math.tan(e.fovY / 2);
	return {
		x: a(n, e.right) / (i * o * e.aspect),
		y: a(n, e.up) / (i * o),
		depth: i
	};
}
function w(e, t, o, s) {
	let c = a(t, s);
	if (Math.abs(c) < 1e-8) return null;
	let l = a(r(o, e), s) / c;
	return l <= 0 ? null : n(e, i(t, l));
}
function T(e) {
	return c([
		e.forward[0],
		0,
		e.forward[2]
	]);
}
var ee = (e = 12.5) => ({
	version: 1,
	hour: e,
	clouds: []
}), E = .35, D = 2.6, O = (e) => typeof e == "number" && Number.isFinite(e);
function te(e) {
	if (!e || typeof e != "object") return null;
	let t = e;
	if (typeof t.id != "string" || t.id.length === 0 || t.id.length > 64 || !O(t.seed) || !O(t.scale) || !O(t.yaw) || !O(t.order) || typeof t.closed != "boolean" || t.orientation !== void 0 && t.orientation !== "vertical" && t.orientation !== "horizontal" || !Array.isArray(t.position) || t.position.length !== 3 || !t.position.every(O) || !Array.isArray(t.stroke) || t.stroke.length < 2 || t.stroke.length > 2e3) return null;
	let n = [];
	for (let e of t.stroke) {
		if (!e || typeof e != "object" || !O(e.x) || !O(e.y)) return null;
		n.push({
			x: e.x,
			y: e.y
		});
	}
	return {
		id: t.id,
		seed: t.seed >>> 0,
		stroke: n,
		closed: t.closed,
		...t.orientation === "horizontal" ? { orientation: "horizontal" } : {},
		position: [
			t.position[0],
			t.position[1],
			t.position[2]
		],
		scale: Math.min(D, Math.max(E, t.scale)),
		yaw: t.yaw,
		order: t.order
	};
}
function ne(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return {
			ok: !1,
			error: "The file is not valid JSON."
		};
	}
	if (!t || typeof t != "object") return {
		ok: !1,
		error: "The file is not a Sky Study scene."
	};
	let n = t;
	if (n.version !== 1) return {
		ok: !1,
		error: `Unsupported scene version (${String(n.version)}).`
	};
	if (!O(n.hour)) return {
		ok: !1,
		error: "The scene has no valid time of day."
	};
	if (!Array.isArray(n.clouds)) return {
		ok: !1,
		error: "The scene has no cloud list."
	};
	let r = [], i = 0;
	for (let e of n.clouds) {
		let t = te(e);
		t && r.length < 16 && !r.some((e) => e.id === t.id) ? r.push(t) : i++;
	}
	return {
		ok: !0,
		scene: {
			version: 1,
			hour: n.hour,
			clouds: r
		},
		dropped: i
	};
}
var re = (e) => JSON.stringify(e), ie = 100, ae = (e, t) => e === t || JSON.stringify(e) === JSON.stringify(t), oe = 0, k = t((e, t) => ({
	scene: ee(),
	past: [],
	future: [],
	txn: null,
	selectedId: null,
	tool: "draw",
	uiHidden: !1,
	quality: "auto",
	toast: null,
	recording: !1,
	drift: !0,
	view: y,
	style: "realistic",
	pixelSize: 4,
	formedAt: {},
	apply: (n) => {
		let { scene: r, txn: i, past: a } = t(), o = n(r);
		o !== r && e(i ? { scene: o } : {
			scene: o,
			past: [...a, r].slice(-100),
			future: []
		});
	},
	begin: () => {
		t().txn || e({ txn: t().scene });
	},
	end: () => {
		let { txn: n, scene: r, past: i } = t();
		n && (ae(n, r) ? e({ txn: null }) : e({
			txn: null,
			past: [...i, n].slice(-100),
			future: []
		}));
	},
	undo: () => {
		let { past: n, scene: r, future: i, selectedId: a } = t();
		t().txn && t().end();
		let o = n[n.length - 1];
		o && e({
			scene: o,
			past: n.slice(0, -1),
			future: [r, ...i].slice(0, ie),
			selectedId: o.clouds.some((e) => e.id === a) ? a : null
		});
	},
	redo: () => {
		let { past: n, scene: r, future: i, selectedId: a } = t(), o = i[0];
		o && e({
			scene: o,
			past: [...n, r].slice(-100),
			future: i.slice(1),
			selectedId: o.clouds.some((e) => e.id === a) ? a : null
		});
	},
	replaceScene: (t) => e({
		scene: t,
		past: [],
		future: [],
		txn: null,
		selectedId: null,
		formedAt: {}
	}),
	addCloud: (n, r) => t().scene.clouds.length >= 16 ? (t().notify("The sky holds 16 clouds — delete one to draw another.", "warn"), !1) : (t().apply((e) => ({
		...e,
		clouds: [...e.clouds, n]
	})), e({ formedAt: {
		...t().formedAt,
		[n.id]: r
	} }), !0),
	updateCloud: (e, n) => t().apply((t) => ({
		...t,
		clouds: t.clouds.map((t) => t.id === e ? {
			...t,
			...n
		} : t)
	})),
	deleteCloud: (n) => {
		t().apply((e) => ({
			...e,
			clouds: e.clouds.filter((e) => e.id !== n)
		})), t().selectedId === n && e({ selectedId: null });
	},
	duplicateCloud: (n, r, i) => {
		let a = t().scene.clouds.find((e) => e.id === n);
		if (!a) return;
		let o = Math.max(0, ...t().scene.clouds.map((e) => e.order)) + 1, s = {
			...a,
			id: r,
			order: o,
			position: [
				a.position[0] + 1.1 * a.scale,
				a.position[1] + .15,
				a.position[2] + .6
			]
		};
		t().addCloud(s, i - 1e4) && e({ selectedId: r });
	},
	clearAll: () => {
		t().scene.clouds.length !== 0 && (t().apply((e) => ({
			...e,
			clouds: []
		})), e({ selectedId: null }));
	},
	setHour: (e) => t().apply((t) => t.hour === e ? t : {
		...t,
		hour: e
	}),
	select: (t) => e({ selectedId: t }),
	setTool: (t) => e({ tool: t }),
	setUiHidden: (t) => e({ uiHidden: t }),
	setQuality: (t) => e({ quality: t }),
	setRecording: (t) => e({ recording: t }),
	setDrift: (t) => e({ drift: t }),
	setView: (n) => e({ view: b({
		...t().view,
		...n
	}) }),
	setStyle: (t) => e({ style: t }),
	setPixelSize: (t) => e({ pixelSize: Math.min(12, Math.max(2, Math.round(t))) }),
	notify: (t, n = "info") => e({ toast: {
		id: ++oe,
		text: t,
		tone: n
	} }),
	dismissToast: () => e({ toast: null })
})), A = 6360, se = 6460, j = [
	.005802,
	.013558,
	.0331
], ce = .003996, le = .00444, ue = 1.2, de = [
	65e-5,
	.001881,
	85e-6
];
function fe(e, t, n) {
	let r = a(e, t), i = a(e, e) - n * n, o = r * r - i;
	return o < 0 ? -1 : -r + Math.sqrt(o);
}
function pe(e, t, n) {
	let r = a(e, t), i = a(e, e) - n * n, o = r * r - i;
	return o < 0 ? -1 : -r - Math.sqrt(o);
}
function me(e, t) {
	let n = Math.exp(-e / 8), r = Math.exp(-e / ue) * t.haze * le, i = Math.max(0, 1 - Math.abs(e - 25) / 15);
	return [
		j[0] * n + r + de[0] * i,
		j[1] * n + r + de[1] * i,
		j[2] * n + r + de[2] * i
	];
}
function M(e, t, n, r = 40) {
	let i = [
		0,
		A + e,
		0
	];
	if (pe(i, t, 6360) > 0) return [
		0,
		0,
		0
	];
	let a = fe(i, t, se) / r, o = [
		0,
		0,
		0
	];
	for (let e = 0; e < r; e++) {
		let r = (e + .5) * a, s = [
			i[0] + t[0] * r,
			i[1] + t[1] * r,
			i[2] + t[2] * r
		], c = me(Math.hypot(s[0], s[1], s[2]) - A, n);
		o[0] += c[0] * a, o[1] += c[1] * a, o[2] += c[2] * a;
	}
	return [
		Math.exp(-o[0]),
		Math.exp(-o[1]),
		Math.exp(-o[2])
	];
}
var he = (e) => 3 / (16 * Math.PI) * (1 + e * e), ge = (e, t = .8) => {
	let n = t * t;
	return 3 / (8 * Math.PI) * ((1 - n) * (1 + e * e)) / ((2 + n) * (1 + n - 2 * t * e) ** 1.5);
};
function _e(e, t, n, r, i = 16) {
	let o = c(t), s = [
		0,
		A + e,
		0
	], l = pe(s, o, A), u = (l > 0 ? l : fe(s, o, se)) / i, d = [
		0,
		0,
		0
	], f = [
		0,
		0,
		0
	];
	for (let e = 0; e < i; e++) {
		let t = (e + .5) * u, i = [
			s[0] + o[0] * t,
			s[1] + o[1] * t,
			s[2] + o[2] * t
		], c = Math.hypot(i[0], i[1], i[2]), l = c - A, p = me(l, r);
		f[0] += p[0] * u * .5, f[1] += p[1] * u * .5, f[2] += p[2] * u * .5;
		let m = [
			Math.exp(-f[0]),
			Math.exp(-f[1]),
			Math.exp(-f[2])
		];
		f[0] += p[0] * u * .5, f[1] += p[1] * u * .5, f[2] += p[2] * u * .5;
		let h = Math.exp(-l / 8), g = Math.exp(-l / ue) * r.haze * ce;
		for (let e of n) {
			let t = a(o, e.dir), n = a([
				i[0] / c,
				i[1] / c,
				i[2] / c
			], e.dir), s = M(l, [
				Math.sqrt(Math.max(0, 1 - n * n)),
				n,
				0
			], r, 12), f = he(t), p = ge(t);
			for (let t = 0; t < 3; t++) {
				let n = j[t] * h * (f + ve) + g * (p + ve);
				d[t] += e.illuminance[t] * s[t] * n * m[t] * u;
			}
		}
	}
	return [
		d[0],
		d[1],
		d[2]
	];
}
var ve = .012, ye = [
	{
		id: "dawn",
		label: "Dawn",
		short: "Dawn",
		hour: 6.35
	},
	{
		id: "noon",
		label: "Noon",
		short: "Noon",
		hour: 12.5
	},
	{
		id: "golden",
		label: "Golden hour",
		short: "Golden",
		hour: 18.2
	},
	{
		id: "dusk",
		label: "Blue hour",
		short: "Blue",
		hour: 19.45
	},
	{
		id: "night",
		label: "Moonlight",
		short: "Moon",
		hour: 22.5
	}
], N = [
	{
		h: 5.5,
		sunAz: -70,
		sunEl: -5,
		haze: 2.2,
		exposure: 1.1
	},
	{
		h: 6.35,
		sunAz: -78,
		sunEl: 3.5,
		haze: 2.4,
		exposure: 1
	},
	{
		h: 8.5,
		sunAz: -125,
		sunEl: 24,
		haze: 1.6,
		exposure: 1.2
	},
	{
		h: 12.5,
		sunAz: -250,
		sunEl: 48,
		haze: 1,
		exposure: 1.36
	},
	{
		h: 16.5,
		sunAz: -256,
		sunEl: 20,
		haze: 1.5,
		exposure: 1.2
	},
	{
		h: 18.2,
		sunAz: -262,
		sunEl: 5,
		haze: 2.6,
		exposure: 1
	},
	{
		h: 19,
		sunAz: -268,
		sunEl: -2,
		haze: 2.3,
		exposure: 1
	},
	{
		h: 19.45,
		sunAz: -273,
		sunEl: -5.5,
		haze: 1.5,
		exposure: .9
	},
	{
		h: 20.5,
		sunAz: -282,
		sunEl: -12,
		haze: 1.8,
		exposure: 1
	},
	{
		h: 23.5,
		sunAz: -300,
		sunEl: -30,
		haze: 1.6,
		exposure: 1
	}
];
function be(e) {
	let t = u(e, N[0].h, N[N.length - 1].h), n = 0;
	for (; n < N.length - 2 && t > N[n + 1].h;) n++;
	let r = N[n], i = N[n + 1], a = d(0, 1, (t - r.h) / (i.h - r.h));
	return {
		h: t,
		sunAz: l(r.sunAz, i.sunAz, a),
		sunEl: l(r.sunEl, i.sunEl, a),
		haze: l(r.haze, i.haze, a),
		exposure: l(r.exposure, i.exposure, a)
	};
}
var xe = [
	1,
	.96,
	.9
], Se = 20, Ce = Se * .0035, we = -28 * f, Te = 34 * f, Ee = 2.2, De = .12;
function Oe(e) {
	let t = d(-17, -4, e) * (1 - d(-3, 3, e)), n = d(-12, -3, e) * (1 - d(-1, 4, e));
	return {
		dome: P([
			.16,
			.24,
			.5
		], .03 * t),
		glow: P([
			1,
			.5,
			.36
		], .06 * n)
	};
}
function ke(e, t, n) {
	let r = Math.hypot(n[0], n[2]) || 1, i = n[0] / r, a = n[2] / r, o = Math.hypot(t[0], t[2]) || 1, s = Math.max(0, (t[0] * i + t[2] * a) / o), c = Math.exp(-Math.max(t[1], 0) * 5), l = s ** 3 * c, u = .75 + .25 * Math.max(t[1], 0);
	return [
		e.dome[0] * u + e.glow[0] * l,
		e.dome[1] * u + e.glow[1] * l,
		e.dome[2] * u + e.glow[2] * l
	];
}
var P = (e, t) => [
	e[0] * t,
	e[1] * t,
	e[2] * t
], Ae = (e, t) => [
	e[0] * t[0],
	e[1] * t[1],
	e[2] * t[2]
], F = (e, t) => [
	e[0] + t[0],
	e[1] + t[1],
	e[2] + t[2]
], I = (e) => .2126 * e[0] + .7152 * e[1] + .0722 * e[2];
function je(e, t, n, r, i) {
	let a = [
		0,
		0,
		0
	], o = 0;
	for (let s of [
		6,
		20,
		38,
		60,
		82
	]) for (let c = 0; c < 8; c++) {
		let l = p(c / 8 * Math.PI * 2, s * f), u = Math.sin(s * f) * Math.cos(s * f);
		a = F(a, P(F(_e(e, l, t, { haze: n }, 10), ke(r, l, i)), u)), o += u;
	}
	return P(a, 1 / o);
}
function Me(e) {
	let t = be(e), n = p(t.sunAz * f, t.sunEl * f), r = p(we, Te), i = d(-6, -14, t.sunEl), a = P(xe, Se), o = P([
		.86,
		.92,
		1
	], Ce * i), s = [{
		dir: n,
		illuminance: a
	}];
	i > 0 && s.push({
		dir: r,
		illuminance: o
	});
	let c = { haze: t.haze }, l = -Math.acos(A / (A + Ee)) / f, u = Math.max(t.sunEl, l + .6), m = p(t.sunAz * f, u * f), h = d(-9, l + .6, t.sunEl), g = P(Ae(a, M(Ee, m, c)), h), _ = Ae(o, M(Ee, r, c)), v = I(g) >= I(_), y = v ? m : r, b = v ? g : _, x = v ? d(0, -6, t.sunEl) * .5 : 0, S = I(b), C = [
		S * 1.9,
		S * .75,
		S * .85
	], w = [
		b[0] + (C[0] - b[0]) * x,
		b[1] + (C[1] - b[1]) * x,
		b[2] + (C[2] - b[2]) * x
	], T = Oe(t.sunEl), ee = je(Ee, s, t.haze, T, n), E = [
		.0011,
		.0016,
		.0032
	], D = F(ee, E), O = F(P(F(F(P(Ae(a, M(.05, n, c)), Math.max(0, n[1])), P(ee, Math.PI)), P(Ae(o, M(.05, r, c)), Math.max(0, r[1]))), De / Math.PI), P(E, .5)), te = I(D) + .25 * I(w) * .05, ne = t.exposure * .32 / (te + 1e-5) ** .78;
	return {
		hour: e,
		sunDir: n,
		moonDir: r,
		sunIlluminance: a,
		moonIlluminance: o,
		haze: t.haze,
		keyDir: y,
		keyColor: w,
		ambientTop: D,
		ambientBottom: O,
		exposure: ne,
		twilight: T,
		night: i
	};
}
// sky/vendor/sky-study/math/rng.ts
function Ne(e) {
	let t = e >>> 0;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
var Pe = () => Math.random() * 4294967295 >>> 0, Fe = 14;
function L(e) {
	let t = 0;
	for (let n = 1; n < e.length; n++) t += Math.hypot(e[n].x - e[n - 1].x, e[n].y - e[n - 1].y);
	return t;
}
function Ie(e) {
	let t = Infinity, n = -Infinity, r = Infinity, i = -Infinity;
	for (let a of e) t = Math.min(t, a.x), n = Math.max(n, a.x), r = Math.min(r, a.y), i = Math.max(i, a.y);
	return {
		minX: t,
		maxX: n,
		minY: r,
		maxY: i
	};
}
function Le(e, t) {
	let n = e.filter((e) => Number.isFinite(e.x) && Number.isFinite(e.y));
	if (n.length === 0) return [];
	if (n.length === 1 || t < 2) return [n[0]];
	let r = L(n);
	if (r === 0) return [n[0]];
	let i = [n[0]], a = r / (t - 1), o = 0, s = a;
	for (let e = 1; e < n.length && i.length < t - 1; e++) {
		let r = n[e - 1], c = n[e], l = Math.hypot(c.x - r.x, c.y - r.y);
		for (; l > 0 && o + l >= s && i.length < t - 1;) {
			let e = (s - o) / l;
			i.push({
				x: r.x + (c.x - r.x) * e,
				y: r.y + (c.y - r.y) * e
			}), s += a;
		}
		o += l;
	}
	return i.push(n[n.length - 1]), i;
}
function Re(e, t = 2, n = !1) {
	let r = e.slice(), i = r.length;
	if (i < 3) return r;
	for (let e = 0; e < t; e++) {
		let e = [];
		for (let t = 0; t < i; t++) {
			if (!n && (t === 0 || t === i - 1)) {
				e.push(r[t]);
				continue;
			}
			let a = r[(t - 1 + i) % i], o = r[t], s = r[(t + 1) % i];
			e.push({
				x: (a.x + 2 * o.x + s.x) / 4,
				y: (a.y + 2 * o.y + s.y) / 4
			});
		}
		r = e;
	}
	return r;
}
function ze(e) {
	if (e.length < 8) return !1;
	let t = Ie(e), n = Math.max(t.maxX - t.minX, t.maxY - t.minY), r = Math.hypot(e[0].x - e[e.length - 1].x, e[0].y - e[e.length - 1].y);
	return n > 0 && r < n * .3 && L(e) > n * 2.2;
}
function Be(e, t, n) {
	let r = !1;
	for (let i = 0, a = n.length - 1; i < n.length; a = i++) {
		let o = n[i], s = n[a];
		o.y > t != s.y > t && e < (s.x - o.x) * (t - o.y) / (s.y - o.y) + o.x && (r = !r);
	}
	return r;
}
function Ve(e, t, n, r) {
	let i = Infinity, a = 0, o = 0, s = L(n) + (r ? Math.hypot(n[0].x - n[n.length - 1].x, n[0].y - n[n.length - 1].y) : 0), c = r ? n.length : n.length - 1;
	for (let r = 0; r < c; r++) {
		let c = n[r], l = n[(r + 1) % n.length], d = l.x - c.x, f = l.y - c.y, p = d * d + f * f, m = p > 0 ? u(((e - c.x) * d + (t - c.y) * f) / p, 0, 1) : 0, h = Math.hypot(e - (c.x + d * m), t - (c.y + f * m));
		h < i && (i = h, a = (o + Math.sqrt(p) * m) / (s || 1)), o += Math.sqrt(p);
	}
	return {
		d: i,
		s: a
	};
}
function He(e) {
	let t = e.filter((e) => Number.isFinite(e.x) && Number.isFinite(e.y));
	if (t.length < 2) return null;
	let n = L(t);
	if (n < .25) return null;
	let r = u(Math.round(n / .06), 16, 160), i = ze(t), a = Re(Le(t, r), 3, !1), o = Ie(a), s = {
		x: (o.minX + o.maxX) / 2,
		y: (o.minY + o.maxY) / 2
	}, c = Math.min(1, Fe / Math.max(o.maxX - o.minX, o.maxY - o.minY, 1e-6));
	return {
		points: a.map((e) => ({
			x: (e.x - s.x) * c,
			y: (e.y - s.y) * c
		})),
		center: s,
		closed: i
	};
}
var R = (e) => Math.round(e * 1e4) / 1e4;
function Ue(e, t, n, r = "vertical") {
	let i = Ne(n), a = (e, t) => e + (t - e) * i(), o = Ie(e), s = o.maxX - o.minX, c = o.maxY - o.minY, l = Math.max(s, c, .05), d = L(e), f = [];
	if (t && e.length >= 8) {
		let t = u(l / 8, .1, 1.4), n = 0, r = [];
		for (let i = o.minY + t * .5; i < o.maxY; i += t) for (let s = o.minX + t * .5; s < o.maxX; s += t) {
			let o = s + a(-.4, .4) * t, c = i + a(-.4, .4) * t;
			if (!Be(o, c, e)) continue;
			let { d: l, s: u } = Ve(o, c, e, !0);
			l < t * .35 || (r.push({
				x: o,
				y: c,
				d: l,
				s: u
			}), n = Math.max(n, l));
		}
		for (let e of r) {
			if (i() < .25) continue;
			let r = u(e.d * a(.85, 1.3), t * .6, l * .42);
			f.push({
				x: e.x,
				y: e.y,
				z: a(-.55, .55) * Math.min(e.d, n),
				r,
				t: .55 * (1 - e.d / (n || 1)) + .45 * e.s
			});
		}
		let s = u(l * .075, .1, .8), c = Math.max(1, Math.round(s * .9 / (d / e.length || 1)));
		for (let t = 0; t < e.length; t += c) {
			let n = e[t];
			f.push({
				x: n.x,
				y: n.y,
				z: a(-.4, .4) * s,
				r: s * a(.65, 1.45),
				t: t / e.length
			});
		}
	} else {
		let t = u(.1 * d + .22, .24, 1.25), n = t * .5, r = Le(e, Math.max(2, Math.ceil(d / n)) + 1);
		for (let e = 0; e < r.length; e++) {
			let n = r.length > 1 ? e / (r.length - 1) : .5, o = t * (.55 + .45 * Math.sin(Math.PI * u(n, 0, 1)) ** .6) * a(.82, 1.15);
			f.push({
				x: r[e].x + a(-.1, .1) * o,
				y: r[e].y + a(-.08, .12) * o,
				z: a(-.3, .3) * t,
				r: o,
				t: n
			}), i() < .7 && f.push({
				x: r[e].x,
				y: r[e].y - o * .15,
				z: (i() < .5 ? -1 : 1) * t * a(.35, .6),
				r: o * a(.7, .9),
				t: n + .05
			});
		}
	}
	if (r === "horizontal") for (let e = 0; e < f.length; e++) {
		let t = f[e];
		f[e] = {
			...t,
			x: t.x,
			y: Math.abs(t.z) * .8 + t.r * .15,
			z: -t.y
		};
	}
	let p = [...f], m = f.reduce((e, t) => e + t.r, 0) / (f.length || 1), h = f.slice().sort((e, t) => t.y + t.r - (e.y + e.r)), g = Math.min(h.length, Math.max(1, Math.round(f.length * .35)));
	for (let e = 0; e < g; e++) {
		let e = h[Math.floor(i() * Math.min(h.length, g * 2))];
		if (i() < .45) continue;
		let t = e.r * a(.55, .8);
		p.push({
			x: e.x + a(-.3, .3) * e.r,
			y: e.y + e.r * a(.45, .75),
			z: e.z + a(-.25, .25) * e.r,
			r: t,
			t: e.t + .12
		});
	}
	let _ = p.slice();
	for (let e of _) {
		if (e.r < m * .35) continue;
		let t = e.r > m * .8 ? 3 : 2;
		for (let n = 0; n < t; n++) {
			let t = a(0, Math.PI * 2), n = a(.15, 1), r = Math.sqrt(1 - n * n), i = [
				Math.cos(t) * r,
				n,
				Math.sin(t) * r
			], o = e.r * a(.35, .55), s = e.r * a(.7, .85);
			p.push({
				x: e.x + i[0] * s,
				y: e.y + i[1] * s,
				z: e.z + i[2] * s * .8,
				r: o,
				t: Math.min(1.2, e.t + .15)
			});
		}
	}
	let v = Infinity, y = 0, b = 0, x = 0;
	for (let e of p) v = Math.min(v, e.y - e.r), y = Math.max(y, Math.abs(e.x) + e.r), b = Math.max(b, Math.abs(e.y) + e.r), x = Math.max(x, Math.abs(e.z) + e.r);
	let S = 2 * b, C = v + S * (t ? .2 : .1), w = .06;
	return {
		lobes: p.map((e) => ({
			x: R(e.x),
			y: R(e.y),
			z: R(e.z),
			r: R(e.r),
			t: R(u(e.t, 0, 1.2))
		})),
		half: [
			R(y + w),
			R(b + w),
			R(x + w)
		],
		closed: t,
		baseY: R(C)
	};
}
function We(e, t, n, r = "vertical") {
	let i = Ue(e, t, n, r);
	return {
		baseY: i.baseY,
		half: i.half
	};
}
var z = {
	x: 96,
	y: 64,
	z: 64
};
function Ge(e, t = z) {
	let { x: n, y: r, z: i } = t, a = new Float32Array(n * r * i).fill(1), o = new Float32Array(n * r * i), s = new Float32Array(n * r * i).fill(1), [c, l, d] = e.half, f = 2 * c / n, p = 2 * l / r, m = 2 * d / i;
	for (let t of e.lobes) {
		let e = Math.max(0, Math.floor((t.x - t.r + c) / f)), u = Math.min(n - 1, Math.ceil((t.x + t.r + c) / f)), h = Math.max(0, Math.floor((t.y - t.r + l) / p)), g = Math.min(r - 1, Math.ceil((t.y + t.r + l) / p)), _ = Math.max(0, Math.floor((t.z - t.r + d) / m)), v = Math.min(i - 1, Math.ceil((t.z + t.r + d) / m)), y = 1 / (t.r * t.r);
		for (let i = _; i <= v; i++) {
			let _ = -d + (i + .5) * m - t.z;
			for (let d = h; d <= g; d++) {
				let m = -l + (d + .5) * p - t.y, h = (i * r + d) * n;
				for (let n = e; n <= u; n++) {
					let e = -c + (n + .5) * f - t.x, r = (e * e + m * m + _ * _) * y;
					if (r >= 1) continue;
					let i = (1 - r) * (1 - r), l = h + n;
					a[l] *= 1 - i, i > o[l] && (o[l] = i, s[l] = t.t);
				}
			}
		}
	}
	let h = new Uint8Array(n * r * i * 2), g = Math.max(p * 2, l * .18);
	for (let t = 0; t < i; t++) for (let i = 0; i < r; i++) {
		let o = u((-l + (i + .5) * p - e.baseY) / g, 0, 1), c = o * o * (3 - 2 * o);
		for (let e = 0; e < n; e++) {
			let o = (t * r + i) * n + e, l = (1 - a[o]) * c;
			h[o * 2] = Math.round(u(l, 0, 1) * 255), h[o * 2 + 1] = Math.round(u(s[o] / 1.2, 0, 1) * 255);
		}
	}
	return h;
}
// sky/vendor/sky-study/clouds/cloudModel.ts
var B = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map();
function H(e) {
	let t = 2166136261 ^ e.seed, n = (e) => {
		t ^= Math.round(e * 1e4) | 0, t = Math.imul(t, 16777619);
	};
	for (let t of e.stroke) n(t.x), n(t.y);
	return n(+!!e.closed), n(e.orientation === "horizontal" ? 7 : 0), `${e.seed.toString(36)}-${(t >>> 0).toString(36)}-${e.stroke.length}`;
}
function U(e) {
	let t = H(e), n = B.get(t);
	return n || (n = Ue(e.stroke, e.closed, e.seed, e.orientation), B.set(t, n)), n;
}
function Ke(e) {
	let t = H(e), n = V.get(t);
	return n || (n = Ge(U(e)), V.set(t, n), V.size > 48 && V.delete(V.keys().next().value)), n;
}
function qe(e) {
	let t = new Set(e.map(H));
	for (let e of B.keys()) t.has(e) || B.delete(e);
	for (let e of V.keys()) t.has(e) || V.delete(e);
}
// sky/vendor/sky-study/renderer/gl.ts
var W = class extends Error {};
function Je(e, t, n, r) {
	let i = e.createShader(t);
	if (!i) throw new W(`Could not create ${r} shader`);
	if (e.shaderSource(i, n), e.compileShader(i), !e.getShaderParameter(i, e.COMPILE_STATUS)) {
		let t = e.getShaderInfoLog(i) ?? "";
		throw e.deleteShader(i), new W(`${r} shader failed to compile:\n${t}`);
	}
	return i;
}
function G(e, t, n, r) {
	let i = Je(e, e.VERTEX_SHADER, t, `${r}.vert`), a = Je(e, e.FRAGMENT_SHADER, n, `${r}.frag`), o = e.createProgram();
	if (!o) throw new W(`Could not create program ${r}`);
	if (e.attachShader(o, i), e.attachShader(o, a), e.linkProgram(o), e.deleteShader(i), e.deleteShader(a), !e.getProgramParameter(o, e.LINK_STATUS)) {
		let t = e.getProgramInfoLog(o) ?? "";
		throw e.deleteProgram(o), new W(`Program ${r} failed to link:\n${t}`);
	}
	let s = /* @__PURE__ */ new Map(), c = e.getProgramParameter(o, e.ACTIVE_UNIFORMS);
	for (let t = 0; t < c; t++) {
		let n = e.getActiveUniform(o, t);
		if (!n) continue;
		let r = n.name.replace(/\[0\]$/, ""), i = e.getUniformLocation(o, n.name);
		i && s.set(r, i);
	}
	return {
		program: o,
		uniforms: s
	};
}
function K(e, t, n, r, i, a, o = e.LINEAR) {
	let s = e.createTexture(), c = e.createFramebuffer();
	if (!s || !c) throw new W("Could not allocate render target");
	e.bindTexture(e.TEXTURE_2D, s), e.texImage2D(e.TEXTURE_2D, 0, r, t, n, 0, i, a, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, o), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, o), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.bindFramebuffer(e.FRAMEBUFFER, c), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, s, 0);
	let l = e.checkFramebufferStatus(e.FRAMEBUFFER);
	if (e.bindFramebuffer(e.FRAMEBUFFER, null), l !== e.FRAMEBUFFER_COMPLETE) throw e.deleteTexture(s), e.deleteFramebuffer(c), new W(`Render target incomplete (0x${l.toString(16)})`);
	return {
		framebuffer: c,
		texture: s,
		width: t,
		height: n
	};
}
function q(e, t) {
	t && (e.deleteFramebuffer(t.framebuffer), e.deleteTexture(t.texture));
}
function Ye(e, t) {
	return e.replace("//#include common", t);
}
// sky/vendor/sky-study/renderer/shaders/fullscreen.vert?raw
var J = "#version 300 es\nout vec2 vUv;\nvoid main() {\n  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));\n  vUv = p;\n  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);\n}\n", Xe = "// ---- shared atmosphere constants (mirror src/atmosphere/physics.ts) ----\nconst float PI = 3.14159265359;\nconst float PLANET_RADIUS = 6360.0;\nconst float ATMOSPHERE_RADIUS = 6460.0;\nconst vec3 RAYLEIGH_SCATTERING = vec3(5.802e-3, 13.558e-3, 33.1e-3);\nconst float RAYLEIGH_HEIGHT = 8.0;\nconst float MIE_SCATTERING = 3.996e-3;\nconst float MIE_EXTINCTION = 4.44e-3;\nconst float MIE_HEIGHT = 1.2;\nconst vec3 OZONE_ABSORPTION = vec3(0.65e-3, 1.881e-3, 0.085e-3);\nconst float MULTI_SCATTER = 0.012;\n\nfloat raySphereNear(vec3 ro, vec3 rd, float r) {\n  float b = dot(ro, rd);\n  float c = dot(ro, ro) - r * r;\n  float d = b * b - c;\n  if (d < 0.0) return -1.0;\n  return -b - sqrt(d);\n}\n\nfloat raySphereFar(vec3 ro, vec3 rd, float r) {\n  float b = dot(ro, rd);\n  float c = dot(ro, ro) - r * r;\n  float d = b * b - c;\n  if (d < 0.0) return -1.0;\n  return -b + sqrt(d);\n}\n\n// Sky-view LUT parameterisation: absolute azimuth, elevation compressed toward the horizon.\nvec2 skyUv(vec3 dir) {\n  float az = atan(dir.x, -dir.z);\n  float el = asin(clamp(dir.y, -1.0, 1.0));\n  float v = 0.5 + 0.5 * sign(el) * sqrt(abs(el) / (0.5 * PI));\n  return vec2(az / (2.0 * PI) + 0.5, v);\n}\n\nvec3 skyDir(vec2 uv) {\n  float az = (uv.x - 0.5) * 2.0 * PI;\n  float s = uv.y * 2.0 - 1.0;\n  float el = sign(s) * s * s * 0.5 * PI;\n  return vec3(sin(az) * cos(el), sin(el), -cos(az) * cos(el));\n}\n\nfloat hgPhase(float mu, float g) {\n  float g2 = g * g;\n  return (1.0 - g2) / (4.0 * PI * pow(max(1.0 + g2 - 2.0 * g * mu, 1e-4), 1.5));\n}\n", Ze = "#version 300 es\nprecision highp float;\nin vec2 vUv;\nout vec4 outColor;\n\n//#include common\n\nuniform vec3 uSunDir;\nuniform vec3 uSunIlluminance;\nuniform vec3 uMoonDir;\nuniform vec3 uMoonIlluminance;\nuniform float uHaze;\nuniform float uAltitude;\nuniform vec3 uGroundAlbedo;\nuniform vec3 uTwilightDome;\nuniform vec3 uTwilightGlow;\n\nvec3 twilight(vec3 dir) {\n  vec2 s = normalize(uSunDir.xz + vec2(1e-6));\n  float toward = max(0.0, dot(normalize(dir.xz + vec2(1e-6)), s));\n  float low = exp(-max(dir.y, 0.0) * 5.0);\n  float dome = 0.75 + 0.25 * max(dir.y, 0.0);\n  return uTwilightDome * dome + uTwilightGlow * pow(toward, 3.0) * low;\n}\n\nvec3 extinctionAt(float h) {\n  float r = exp(-h / RAYLEIGH_HEIGHT);\n  float mie = exp(-h / MIE_HEIGHT) * uHaze * MIE_EXTINCTION;\n  float oz = max(0.0, 1.0 - abs(h - 25.0) / 15.0);\n  return RAYLEIGH_SCATTERING * r + mie + OZONE_ABSORPTION * oz;\n}\n\nvec3 transmittanceTo(float h, float cosZ) {\n  vec3 ro = vec3(0.0, PLANET_RADIUS + h, 0.0);\n  vec3 rd = vec3(sqrt(max(0.0, 1.0 - cosZ * cosZ)), cosZ, 0.0);\n  if (raySphereNear(ro, rd, PLANET_RADIUS) > 0.0) return vec3(0.0);\n  float tMax = raySphereFar(ro, rd, ATMOSPHERE_RADIUS);\n  const int N = 12;\n  float dt = tMax / float(N);\n  vec3 od = vec3(0.0);\n  for (int i = 0; i < N; i++) {\n    vec3 p = ro + rd * ((float(i) + 0.5) * dt);\n    od += extinctionAt(length(p) - PLANET_RADIUS) * dt;\n  }\n  return exp(-od);\n}\n\nvec3 lightScatter(vec3 dir, vec3 p, float r, float h, vec3 lightDir, vec3 illum, vec3 tv, float rd, float md, float dt) {\n  vec3 up = p / r;\n  vec3 ts = transmittanceTo(h, dot(up, lightDir));\n  float mu = dot(dir, lightDir);\n  float pr = 3.0 / (16.0 * PI) * (1.0 + mu * mu);\n  float g = 0.8;\n  float g2 = g * g;\n  float pm = 3.0 / (8.0 * PI) * ((1.0 - g2) * (1.0 + mu * mu)) / ((2.0 + g2) * pow(1.0 + g2 - 2.0 * g * mu, 1.5));\n  vec3 scat = RAYLEIGH_SCATTERING * rd * (pr + MULTI_SCATTER) + md * (pm + MULTI_SCATTER);\n  return illum * ts * scat * tv * dt;\n}\n\nvoid main() {\n  vec3 dir = skyDir(vUv);\n  vec3 ro = vec3(0.0, PLANET_RADIUS + uAltitude, 0.0);\n  float tGround = raySphereNear(ro, dir, PLANET_RADIUS);\n  bool hitsGround = tGround > 0.0;\n  float tMax = hitsGround ? tGround : raySphereFar(ro, dir, ATMOSPHERE_RADIUS);\n  const int N = 24;\n  float dt = tMax / float(N);\n  vec3 L = vec3(0.0);\n  vec3 od = vec3(0.0);\n  bool moon = dot(uMoonIlluminance, vec3(1.0)) > 0.0;\n  for (int i = 0; i < N; i++) {\n    vec3 p = ro + dir * ((float(i) + 0.5) * dt);\n    float r = length(p);\n    float h = r - PLANET_RADIUS;\n    vec3 e = extinctionAt(h);\n    vec3 tv = exp(-(od + e * dt * 0.5));\n    od += e * dt;\n    float rd = exp(-h / RAYLEIGH_HEIGHT);\n    float md = exp(-h / MIE_HEIGHT) * uHaze * MIE_SCATTERING;\n    L += lightScatter(dir, p, r, h, uSunDir, uSunIlluminance, tv, rd, md, dt);\n    if (moon) L += lightScatter(dir, p, r, h, uMoonDir, uMoonIlluminance, tv, rd, md, dt);\n  }\n  if (hitsGround) {\n    vec3 pg = ro + dir * tGround;\n    vec3 n = normalize(pg);\n    vec3 tv = exp(-od);\n    vec3 eSun = uSunIlluminance * transmittanceTo(0.0, dot(n, uSunDir)) * max(0.0, dot(n, uSunDir));\n    vec3 eMoon = uMoonIlluminance * transmittanceTo(0.0, dot(n, uMoonDir)) * max(0.0, dot(n, uMoonDir));\n    L += tv * (eSun + eMoon) * uGroundAlbedo / PI;\n  }\n  L += twilight(dir) * (hitsGround ? 0.6 : 1.0);\n  outColor = vec4(L, 1.0);\n}\n", Qe = "#version 300 es\nprecision highp float;\nprecision highp int;\nin vec2 vUv;\nout vec4 outColor;\n\n// Writes one z-slice of a tileable 3D noise volume.\nuniform float uSlice;   // 0..1 z coordinate of this slice (texel centre)\nuniform int uMode;      // 0 = shape (Perlin-Worley + Worley fbm), 1 = detail (Worley fbm)\n\nuvec3 pcg3d(uvec3 v) {\n  v = v * 1664525u + 1013904223u;\n  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;\n  v ^= v >> 16u;\n  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;\n  return v;\n}\n\nvec3 hash3(ivec3 c, int seed) {\n  uvec3 h = pcg3d(uvec3(c + ivec3(seed * 157, seed * 311, seed * 73) + 4096));\n  return vec3(h) * (1.0 / 4294967295.0);\n}\n\nivec3 wrap(ivec3 c, int period) {\n  return ((c % period) + period) % period;\n}\n\n// 1 - F1 Worley (\"billows\"), tileable with the given cell period.\nfloat worley(vec3 p, int period, int seed) {\n  vec3 x = p * float(period);\n  ivec3 cell = ivec3(floor(x));\n  vec3 f = fract(x);\n  float d = 1e9;\n  for (int k = -1; k <= 1; k++)\n  for (int j = -1; j <= 1; j++)\n  for (int i = -1; i <= 1; i++) {\n    ivec3 o = ivec3(i, j, k);\n    vec3 r = vec3(o) + hash3(wrap(cell + o, period), seed) - f;\n    d = min(d, dot(r, r));\n  }\n  return 1.0 - clamp(sqrt(d), 0.0, 1.0);\n}\n\nvec3 grad(ivec3 c, int period, int seed) {\n  return normalize(hash3(wrap(c, period), seed + 17) * 2.0 - 1.0);\n}\n\nfloat perlin(vec3 p, int period, int seed) {\n  vec3 x = p * float(period);\n  ivec3 c = ivec3(floor(x));\n  vec3 f = fract(x);\n  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);\n  float n000 = dot(grad(c + ivec3(0,0,0), period, seed), f - vec3(0,0,0));\n  float n100 = dot(grad(c + ivec3(1,0,0), period, seed), f - vec3(1,0,0));\n  float n010 = dot(grad(c + ivec3(0,1,0), period, seed), f - vec3(0,1,0));\n  float n110 = dot(grad(c + ivec3(1,1,0), period, seed), f - vec3(1,1,0));\n  float n001 = dot(grad(c + ivec3(0,0,1), period, seed), f - vec3(0,0,1));\n  float n101 = dot(grad(c + ivec3(1,0,1), period, seed), f - vec3(1,0,1));\n  float n011 = dot(grad(c + ivec3(0,1,1), period, seed), f - vec3(0,1,1));\n  float n111 = dot(grad(c + ivec3(1,1,1), period, seed), f - vec3(1,1,1));\n  return mix(mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),\n             mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);\n}\n\nfloat worleyFbm(vec3 p, int period, int seed) {\n  return worley(p, period, seed) * 0.625\n       + worley(p, period * 2, seed + 1) * 0.25\n       + worley(p, period * 4, seed + 2) * 0.125;\n}\n\nfloat remap(float v, float a, float b, float c, float d) {\n  return c + (v - a) / (b - a) * (d - c);\n}\n\nvoid main() {\n  vec3 p = vec3(vUv, uSlice);\n  if (uMode == 0) {\n    float pf = perlin(p, 4, 1) * 0.5 + perlin(p, 8, 2) * 0.25 + perlin(p, 16, 3) * 0.125;\n    pf = clamp(pf * 0.9 + 0.5, 0.0, 1.0);\n    float w = worleyFbm(p, 4, 5);\n    float pw = clamp(remap(pf, w - 1.0, 1.0, 0.0, 1.0), 0.0, 1.0);\n    outColor = vec4(pw, worleyFbm(p, 4, 9), worleyFbm(p, 8, 13), worleyFbm(p, 16, 21));\n  } else {\n    outColor = vec4(worleyFbm(p, 4, 31), worleyFbm(p, 8, 37), worleyFbm(p, 16, 41), 1.0);\n  }\n}\n", $e = "#version 300 es\nprecision highp float;\nprecision highp sampler3D;\nin vec2 vUv;\nout vec4 outColor;\n\n//#include common\n\n#define MAX_CLOUDS 16\n\nuniform vec2 uResolution;\nuniform float uFrame;\nuniform vec2 uJitter;\n\nuniform vec3 uCamPos;\nuniform vec3 uCamForward;\nuniform vec3 uCamRight;\nuniform vec3 uCamUp;\nuniform float uTanHalfFov;\nuniform float uAspect;\n\nuniform sampler2D uSkyLut;\nuniform sampler3D uNoiseShape;\nuniform sampler3D uNoiseDetail;\nuniform sampler3D uAtlas;\nuniform float uSlotCount;\nuniform vec3 uSlotTexel; // 1 / atlas texel counts within a slot (x, y, z)\n\nuniform vec3 uSunDir;\nuniform vec3 uSunIlluminance;\nuniform vec3 uMoonDir;\nuniform vec3 uMoonIlluminance;\nuniform vec3 uKeyDir;\nuniform vec3 uKeyColor;\nuniform vec3 uAmbientTop;\nuniform vec3 uAmbientBottom;\nuniform float uHaze;\nuniform float uNight;\nuniform float uTime;\n\nuniform int uCloudCount;\nuniform vec4 uCloudPos[MAX_CLOUDS];    // world centre (km), w = scale\nuniform vec4 uCloudHalf[MAX_CLOUDS];   // half extents in shape space (km), w = yaw\nuniform vec4 uCloudParam[MAX_CLOUDS];  // x = atlas slot, y = growth 0..1, z = seed, w = density\nuniform int uQuality;                  // 0 reduced, 1 balanced, 2 high\nuniform float uPixelAngle;             // radians per internal pixel (vertical)\nuniform float uPixelStyle;             // 1 = pixel art: chunkier masses, harder edges\n\nconst float SIGMA = 52.0;       // extinction per km at density 1\nconst float SHAPE_FREQ = 0.42;  // shape-noise tiles per km\nconst float DETAIL_FREQ = 2.3;  // detail-noise tiles per km\nconst float AMBIENT_STRENGTH = 0.72;\n\nfloat remap(float v, float a, float b, float c, float d) {\n  return c + (v - a) / max(b - a, 1e-5) * (d - c);\n}\n\nfloat ign(vec2 p) {\n  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));\n}\n\nfloat hash12(vec2 p) {\n  vec3 p3 = fract(vec3(p.xyx) * 0.1031);\n  p3 += dot(p3, p3.yzx + 33.33);\n  return fract((p3.x + p3.y) * p3.z);\n}\n\n// ---- per-cloud transforms ----\nvec3 toLocalDir(int i, vec3 d) {\n  float yaw = uCloudHalf[i].w;\n  float c = cos(yaw), s = sin(yaw);\n  return vec3(c * d.x - s * d.z, d.y, s * d.x + c * d.z);\n}\n\nvec2 boxInterval(vec3 ro, vec3 rd, vec3 halfSize) {\n  vec3 inv = 1.0 / rd;\n  vec3 t0 = (-halfSize - ro) * inv;\n  vec3 t1 = (halfSize - ro) * inv;\n  vec3 tmin = min(t0, t1);\n  vec3 tmax = max(t0, t1);\n  return vec2(max(max(tmin.x, tmin.y), max(tmin.z, 0.0)), min(min(tmax.x, tmax.y), tmax.z));\n}\n\n// Base envelope from the baked gesture volume: r = coverage, g = formation order.\nvec2 sampleEnvelope(int i, vec3 p) {\n  vec3 h = uCloudHalf[i].xyz;\n  vec3 uvw = clamp(p / h * 0.5 + 0.5, uSlotTexel * 0.5, 1.0 - uSlotTexel * 0.5);\n  float slot = uCloudParam[i].x;\n  uvw.z = (slot + uvw.z) / uSlotCount;\n  return texture(uAtlas, uvw).rg;\n}\n\n// Density at shape-space point p. lod: 0 = full detail, 1 = no fine detail.\n// The baked coverage acts like a smooth distance field; noise octaves displace\n// its surface (large billows → cauliflower → fine grain) and a narrow smoothstep\n// turns the result into a crisp but soft-edged cumulus boundary.\nfloat cloudDensity(int i, vec3 p, float lod, float detailFade) {\n  vec2 env = sampleEnvelope(i, p);\n  float cov = env.r;\n  if (cov < 0.02) return 0.0;\n  vec4 prm = uCloudParam[i];\n  float growth = prm.y;\n  float reveal = smoothstep(0.0, 1.0, clamp(growth * 1.4 - env.g * 0.4, 0.0, 1.0));\n  float seedOff = prm.z * 0.137;\n  vec3 q = p + vec3(seedOff * 7.1, seedOff * 3.3, seedOff * 5.7);\n  vec4 sn = texture(uNoiseShape, q * SHAPE_FREQ);\n  float hy = p.y / uCloudHalf[i].y * 0.5 + 0.5;\n  float billow = sn.g * 0.5 + sn.b * 0.3 + sn.a * 0.2;\n  float d = cov * mix(0.55, 1.0, reveal) + 0.2 - (1.0 - sn.r) * 0.3 - (1.0 - billow) * 0.32;\n  d -= (1.0 - reveal) * 0.35;\n  if (d < -0.3) return 0.0;\n  if (lod < 0.5) {\n    vec3 dn = texture(uNoiseDetail, q * DETAIL_FREQ).rgb;\n    // cauliflower on top, ragged and wispier toward the base\n    float cauli = dn.r * 0.6 + dn.g * 0.28 + dn.b * 0.12;\n    float base = smoothstep(0.35, 0.0, hy);\n    // while condensing the fine erosion is weak, so vapour reads soft, not speckled\n    d -= ((1.0 - cauli) * mix(0.3, 0.42, base)) * detailFade * mix(0.35, 1.0, reveal) * mix(1.0, 0.12, uPixelStyle);\n  } else {\n    d -= 0.13;\n  }\n  // forming: a wide, translucent ramp (vapour) that tightens into a crisp surface\n  float edge = mix(mix(0.12, 0.05, detailFade), 0.025, uPixelStyle);\n  float dens = smoothstep(0.0, mix(0.5, edge, reveal), d) * mix(0.3, 1.0, reveal);\n  return dens * prm.w;\n}\n\nfloat lightOpticalDepth(int i, vec3 p, vec3 ldirLocal, float scale, float detailFade, float jitter) {\n  float od = 0.0;\n  float seg = 0.024;\n  float t = 0.0;\n  for (int k = 0; k < 6; k++) {\n    // jittered sample position within each segment hides the terracing of a short march\n    vec3 sp = p + ldirLocal * ((t + seg * jitter) / scale);\n    od += cloudDensity(i, sp, k < 2 ? 0.0 : 1.0, detailFade) * seg;\n    t += seg;\n    seg *= 1.9;\n  }\n  return od * SIGMA;\n}\n\nvec3 skyColor(vec3 dir) {\n  vec3 c = texture(uSkyLut, skyUv(dir)).rgb;\n  // Below the horizon: no scenery, just the haze of the lower atmosphere\n  // deepening slightly toward the ground.\n  // (only near the ground; from high up the real surface below shows through)\n  float below = smoothstep(0.03, -0.04, dir.y) * (1.0 - smoothstep(1.6, 5.0, uCamPos.y));\n  if (below > 0.0) {\n    vec3 hz = texture(uSkyLut, skyUv(normalize(vec3(dir.x, 0.03, dir.z)))).rgb;\n    vec3 deep = texture(uSkyLut, skyUv(normalize(vec3(dir.x, 0.3, dir.z)))).rgb;\n    vec3 haze = mix(hz, mix(hz, deep, 0.45) * 0.62, smoothstep(0.0, -0.3, dir.y));\n    c = mix(c, haze, below);\n  }\n  return c;\n}\n\nvec3 celestial(vec3 dir) {\n  vec3 c = vec3(0.0);\n  // sun disk (0.27° radius) with limb darkening, attenuated by the sky LUT's horizon\n  float cs = dot(dir, uSunDir);\n  float sunCos = cos(0.0047);\n  if (cs > sunCos - 0.00002 && dir.y > -0.02) {\n    float r = sqrt(max(0.0, 1.0 - cs * cs)) / sin(0.0047);\n    float limb = 1.0 - 0.6 * (1.0 - sqrt(max(0.0, 1.0 - r * r)));\n    float edge = smoothstep(1.0, 0.92, r);\n    // transmittance approximated from the sky colour's ratio to its zenith\n    c += uSunIlluminance * limb * edge * 120.0 * clamp(dir.y * 8.0 + 0.4, 0.0, 1.0);\n  }\n  // moon\n  float cm = dot(dir, uMoonDir);\n  float moonR = 0.0062;\n  if (uNight > 0.0 && cm > cos(moonR * 1.2)) {\n    float r = acos(clamp(cm, -1.0, 1.0)) / moonR;\n    vec3 t = normalize(cross(uMoonDir, vec3(0.0, 1.0, 0.0)));\n    vec3 b = cross(t, uMoonDir);\n    vec2 uv = vec2(dot(dir, t), dot(dir, b)) / moonR;\n    float maria = 0.75 + 0.25 * smoothstep(0.2, 0.9, hash12(floor(uv * 3.0 + 7.0)) * 0.6 + 0.4 * sin(uv.x * 3.1 + uv.y * 2.3));\n    c += vec3(0.9, 0.93, 1.0) * smoothstep(1.0, 0.94, r) * maria * 0.35 * uNight;\n    c += vec3(0.6, 0.7, 0.9) * exp(-r * 2.2) * 0.003 * uNight;\n  }\n  // stars: sparse, tiny, dim, only high in the sky\n  if (uNight > 0.0 && dir.y > 0.05) {\n    vec2 sp = vec2(atan(dir.x, -dir.z), asin(dir.y)) * 420.0;\n    vec2 cell = floor(sp);\n    float h = hash12(cell);\n    if (h > 0.9965) {\n      vec2 f = fract(sp) - 0.5 - (vec2(hash12(cell + 3.1), hash12(cell + 7.7)) - 0.5) * 0.6;\n      float s = exp(-dot(f, f) * 40.0) * (h - 0.9965) / 0.0035;\n      c += vec3(0.85, 0.9, 1.0) * s * 0.012 * uNight * smoothstep(0.05, 0.3, dir.y);\n    }\n  }\n  return c;\n}\n\n// Shadow cast by the clouds onto the surface below: a short march from the\n// ground point toward the key light through each cloud's coarse density.\nfloat groundShadow(vec3 pg) {\n  float od = 0.0;\n  for (int i = 0; i < MAX_CLOUDS; i++) {\n    if (i >= uCloudCount) break;\n    float s = uCloudPos[i].w;\n    vec3 o = toLocalDir(i, pg - uCloudPos[i].xyz) / s;\n    vec3 d = toLocalDir(i, uKeyDir) / s;\n    vec2 t = boxInterval(o, d, uCloudHalf[i].xyz);\n    if (t.x >= t.y) continue;\n    float dt = (t.y - t.x) / 5.0;\n    for (int k = 0; k < 5; k++) {\n      od += cloudDensity(i, o + d * (t.x + (float(k) + 0.5) * dt), 1.0, 0.0) * dt;\n    }\n  }\n  return exp(-od * SIGMA * 0.12);\n}\n\nvoid main() {\n  vec2 frag = gl_FragCoord.xy + uJitter;\n  vec2 ndc = frag / uResolution * 2.0 - 1.0;\n  vec3 rd = normalize(uCamForward + uCamRight * ndc.x * uTanHalfFov * uAspect + uCamUp * ndc.y * uTanHalfFov);\n  vec3 sky = skyColor(rd);\n  // From altitude the surface below is open ocean: deepen it toward slate blue\n  // and let the clouds shade it.\n  float high = smoothstep(1.6, 5.0, uCamPos.y);\n  if (high > 0.0 && rd.y < -0.01) {\n    float down = smoothstep(-0.01, -0.35, rd.y) * high;\n    sky = mix(sky, sky * vec3(0.5, 0.6, 0.78), down);\n    float tG = -uCamPos.y / rd.y;\n    if (uKeyDir.y > 0.02) {\n      // jittered per frame; accumulation turns it into a soft penumbra\n      float a = hash12(gl_FragCoord.xy + uFrame * 17.0) * 6.2832;\n      float r = sqrt(hash12(gl_FragCoord.yx + uFrame * 7.0)) * 0.16;\n      vec3 pg = uCamPos + rd * tG + vec3(cos(a), 0.0, sin(a)) * r;\n      sky *= mix(1.0, mix(0.45, 1.0, groundShadow(pg)), down);\n    }\n  }\n  vec3 background = sky + celestial(rd);\n\n  // ---- gather the clouds this ray crosses, sorted by entry distance ----\n  vec2 iv[MAX_CLOUDS];\n  vec3 lo[MAX_CLOUDS];\n  vec3 ld[MAX_CLOUDS];\n  int act[MAX_CLOUDS];\n  int nAct = 0;\n  float tStart = 1e9;\n  float tEnd = -1.0;\n  for (int i = 0; i < MAX_CLOUDS; i++) {\n    if (i >= uCloudCount) break;\n    float s = uCloudPos[i].w;\n    vec3 o = toLocalDir(i, uCamPos - uCloudPos[i].xyz) / s;\n    vec3 d = toLocalDir(i, rd) / s;\n    vec2 t = boxInterval(o, d, uCloudHalf[i].xyz);\n    iv[i] = t;\n    lo[i] = o;\n    ld[i] = d;\n    if (t.x < t.y) {\n      tStart = min(tStart, t.x);\n      tEnd = max(tEnd, t.y);\n      // insertion sort by entry distance\n      int k = nAct;\n      while (k > 0 && iv[act[k - 1]].x > t.x) {\n        act[k] = act[k - 1];\n        k--;\n      }\n      act[k] = i;\n      nAct++;\n    }\n  }\n\n  if (tEnd < 0.0) {\n    outColor = vec4(background, 1.0);\n    return;\n  }\n\n  float noiseOffset = ign(gl_FragCoord.xy + uFrame * 5.588238);\n  float fineStep = uQuality == 2 ? 0.014 : (uQuality == 1 ? 0.02 : 0.03);\n  int maxSteps = uQuality == 2 ? 320 : (uQuality == 1 ? 220 : 150);\n  vec3 L = vec3(0.0);\n  float T = 1.0;\n  float t = tStart + fineStep * noiseOffset;\n  float firstHit = -1.0;\n  float weightedDepth = 0.0;\n  float depthWeight = 0.0;\n  int emptyRun = 0;\n\n  for (int s = 0; s < 400; s++) {\n    if (s >= maxSteps || t > tEnd || T < 0.012) break;\n    float dist = t;\n    float detailFade = 1.0 - smoothstep(18.0, 45.0, dist);\n    float sigmaSum = 0.0;\n    vec3 scatter = vec3(0.0);\n    bool nearAny = false;\n    int nextIndex = -1;\n    float nextStart = 1e9;\n    for (int k = 0; k < MAX_CLOUDS; k++) {\n      if (k >= nAct) break;\n      int i = act[k];\n      vec2 ti = iv[i];\n      if (t < ti.x) { if (ti.x < nextStart) { nextStart = ti.x; nextIndex = i; } break; }\n      if (t > ti.y) continue;\n      float scl = uCloudPos[i].w;\n      vec3 p = lo[i] + ld[i] * t;\n      vec2 env = sampleEnvelope(i, p);\n      if (env.r < 0.01) continue;\n      nearAny = true;\n      float dens = cloudDensity(i, p, 0.0, detailFade);\n      if (dens <= 0.0) continue;\n      float sigma = dens * SIGMA;\n      vec3 kl = toLocalDir(i, uKeyDir);\n      float od = lightOpticalDepth(i, p, kl, scl, detailFade, fract(noiseOffset + float(s) * 0.618034));\n      float mu = dot(rd, uKeyDir);\n      // multiple-scattering octaves (Wrenninge 2015)\n      vec3 sun = vec3(0.0);\n      float a = 1.0, b = 1.0, c = 1.0;\n      for (int o = 0; o < 4; o++) {\n        float ph = mix(hgPhase(mu, 0.72 * c), hgPhase(mu, -0.2 * c), 0.28);\n        sun += b * exp(-od * a) * ph;\n        a *= 0.33; b *= 0.6; c *= 0.5;\n      }\n      // \"powder\": dark crevices facing the light; strongest away from the sun\n      float powder = 1.0 - exp(-sigma * 0.09);\n      powder = mix(1.0, powder * 1.6 + 0.12, 0.55 * (0.5 - 0.5 * mu));\n      // skylight: brighter on tops, occluded by the mass above\n      float hy = p.y / uCloudHalf[i].y * 0.5 + 0.5;\n      float above = sampleEnvelope(i, p + vec3(0.0, 0.18 / scl, 0.0)).r;\n      float ao = exp(-above * 2.4) * 0.62 + 0.38 * hy * hy;\n      vec3 amb = mix(uAmbientBottom, uAmbientTop, smoothstep(0.0, 0.85, hy)) * ao * AMBIENT_STRENGTH;\n      scatter += sigma * (uKeyColor * sun * powder + amb);\n      sigmaSum += sigma;\n    }\n    // never step finer than ~1.3 pixel footprints: far clouds need fewer samples\n    float dt = max(fineStep, t * uPixelAngle * 1.3);\n    if (sigmaSum > 0.0) {\n      emptyRun = 0;\n      float stepT = exp(-sigmaSum * dt);\n      vec3 sInt = (scatter - scatter * stepT) / sigmaSum;\n      L += T * sInt;\n      if (firstHit < 0.0) firstHit = t;\n      weightedDepth += t * T * (1.0 - stepT);\n      depthWeight += T * (1.0 - stepT);\n      T *= stepT;\n    } else if (nearAny) {\n      // inside the envelope but eroded away: stride a little faster\n      dt *= 1.6;\n    } else {\n      // outside every envelope: stride, or jump to the next cloud's box\n      emptyRun++;\n      dt *= emptyRun > 2 ? 4.0 : 2.0;\n      bool inside = false;\n      for (int k = 0; k < MAX_CLOUDS; k++) {\n        if (k >= nAct) break;\n        vec2 ti = iv[act[k]];\n        if (t < ti.x) break;\n        if (t <= ti.y) inside = true;\n      }\n      if (!inside && nextIndex >= 0) {\n        t = nextStart + fineStep * noiseOffset;\n        continue;\n      }\n      if (!inside && nextIndex < 0) break;\n    }\n    t += dt;\n  }\n\n  float alpha = 1.0 - T;\n  vec3 col = background * T;\n  if (alpha > 0.0) {\n    float d = depthWeight > 0.0 ? weightedDepth / depthWeight : tEnd;\n    // aerial perspective: distant clouds dissolve into the sky behind them\n    float fog = exp(-d * 0.018 * uHaze);\n    col += L * fog + sky * alpha * (1.0 - fog);\n  }\n  outColor = vec4(col, 1.0);\n}\n", et = "#version 300 es\nprecision highp float;\nin vec2 vUv;\nout vec4 outColor;\nuniform sampler2D uCurrent;\nuniform sampler2D uHistory;\nuniform float uBlend; // weight of the new frame\nvoid main() {\n  vec3 c = texture(uCurrent, vUv).rgb;\n  vec3 h = texture(uHistory, vUv).rgb;\n  outColor = vec4(mix(h, c, uBlend), 1.0);\n}\n", tt = "#version 300 es\nprecision highp float;\nin vec2 vUv;\nout vec4 outColor;\nuniform sampler2D uImage;\nuniform float uExposure;\nuniform float uNight;\nuniform vec2 uResolution;\nuniform float uFrame;\nuniform float uPixel;     // 1 = pixel-art style\nuniform vec2 uTexSize;    // internal (raymarched) resolution: one \"big pixel\" per texel\nuniform float uLevels;    // tone steps\nuniform float uDither;    // ordered-dither strength (fraction of a step)\n\n// AgX tone mapping (minimal fit, Benjamin Wrensch) — gentle highlight roll-off,\n// keeps sunset hues from going neon.\nvec3 agxContrast(vec3 x) {\n  vec3 x2 = x * x;\n  vec3 x4 = x2 * x2;\n  return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;\n}\n\nvec3 agx(vec3 c) {\n  const mat3 inset = mat3(0.842479062253094, 0.0423282422610123, 0.0423756549057051,\n                          0.0784335999999992, 0.878468636469772, 0.0784336,\n                          0.0792237451477643, 0.0791661274605434, 0.879142973793104);\n  const mat3 outset = mat3(1.19687900512017, -0.0528968517574562, -0.0529716355144438,\n                           -0.0980208811401368, 1.15190312990417, -0.0980434501171241,\n                           -0.0990297440797205, -0.0989611768448433, 1.15107367264116);\n  const float minEv = -12.47393;\n  const float maxEv = 4.026069;\n  c = inset * c;\n  c = clamp(log2(max(c, 1e-10)), minEv, maxEv);\n  c = (c - minEv) / (maxEv - minEv);\n  c = agxContrast(c);\n  c = outset * c;\n  // AgX \"punchy\"-ish look: slight saturation\n  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));\n  c = l + 1.08 * (c - l);\n  return pow(max(c, 0.0), vec3(2.2));\n}\n\nvec3 linearToSrgb(vec3 c) {\n  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));\n}\n\nfloat ign(vec2 p) {\n  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));\n}\n\nfloat bayer4(vec2 p) {\n  ivec2 q = ivec2(mod(p, 4.0));\n  int i = q.x + q.y * 4;\n  // 4x4 Bayer matrix, row-major\n  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);\n  return (float(m[i]) + 0.5) / 16.0;\n}\n\n// Pixel-art finish: flat tone bands (a \"palette\" of brightness steps chosen by\n// the scene's own lighting), ordered dither where bands meet, and the hue\n// shifts pixel artists use — cooler, bluer shadows; warmer highlights.\nvec3 pixelArt(vec3 c, vec2 cell) {\n  // a brighter, more saturated starting point, like a hand-picked palette\n  c = pow(c, vec3(0.88));\n  float g0 = dot(c, vec3(0.299, 0.587, 0.114));\n  c = clamp(g0 + (c - g0) * 1.35, 0.0, 1.0);\n  float l = dot(c, vec3(0.299, 0.587, 0.114));\n  // dither only in a thin seam where two bands meet; flat colour elsewhere\n  float x = l * uLevels;\n  float f = fract(x);\n  float seam = 1.0 - smoothstep(0.0, uDither, abs(f - 0.5));\n  float d = (bayer4(cell) - 0.5) * seam;\n  float lq = clamp(floor(x + 0.5 + d) / uLevels, 0.0, 1.0);\n  vec3 col = c * (lq / max(l, 0.02));\n  // hue-shifted ramps: shadows lean blue-violet, highlights lean warm\n  col = mix(col, col * vec3(0.78, 0.9, 1.22), (1.0 - lq) * 0.55);\n  col = mix(col, col * vec3(1.06, 1.03, 0.92), lq * lq * 0.3);\n  return clamp(col, 0.0, 1.0);\n}\n\nvoid main() {\n  vec2 uv = vUv;\n  vec2 cell = vec2(0.0);\n  if (uPixel > 0.5) {\n    cell = floor(vUv * uTexSize);\n    uv = (cell + 0.5) / uTexSize;\n  }\n  vec3 hdr = texture(uImage, uv).rgb * uExposure;\n  // scotopic shift at night: low light reads bluer and less saturated\n  float l = dot(hdr, vec3(0.2126, 0.7152, 0.0722));\n  hdr = mix(hdr, l * vec3(0.78, 0.9, 1.22), uNight * 0.45);\n  vec3 c = linearToSrgb(clamp(agx(hdr), 0.0, 1.0));\n  if (uPixel > 0.5) {\n    outColor = vec4(pixelArt(c, cell), 1.0);\n    return;\n  }\n  c += (ign(gl_FragCoord.xy + uFrame * 5.588238) - 0.5) / 255.0;\n  outColor = vec4(c, 1.0);\n}\n", nt = [256, 144], rt = 128, it = 32, at = [
	.035,
	.06,
	.085
], ot = 2, st = 9, ct = .12, lt = {
	reduced: 0,
	balanced: 1,
	high: 2
}, ut = {
	reduced: .36,
	balanced: .5,
	high: .72
}, dt = (e, t) => {
	let n = 1, r = 0;
	for (; e > 0;) n /= t, r += e % t * n, e = Math.floor(e / t);
	return r;
}, ft = class {
	gl;
	canvas;
	vao;
	sceneProg;
	skyProg;
	accumProg;
	presentProg;
	noiseShape;
	noiseDetail;
	atlas;
	skyLut;
	hdrInternal;
	hdrType;
	current = null;
	history = [null, null];
	historyIndex = 0;
	accumulated = 0;
	frame = 0;
	slots = /* @__PURE__ */ new Map();
	freeSlots = [];
	skyKey = "";
	lastAtmosphere = null;
	quality;
	renderScale;
	style = "realistic";
	camera;
	constructor(e, t = "balanced") {
		this.canvas = e, this.quality = t, this.renderScale = ut[t];
		let n = e.getContext("webgl2", {
			antialias: !1,
			alpha: !1,
			depth: !1,
			stencil: !1,
			preserveDrawingBuffer: !1,
			powerPreference: "high-performance"
		});
		if (!n) throw new W("WebGL2 is not available in this browser.");
		this.gl = n;
		let r = n.getExtension("EXT_color_buffer_float") || n.getExtension("EXT_color_buffer_half_float");
		if (n.getExtension("OES_texture_float_linear"), this.hdrInternal = r ? n.RGBA16F : n.RGBA8, this.hdrType = r ? n.HALF_FLOAT : n.UNSIGNED_BYTE, n.getParameter(n.MAX_3D_TEXTURE_SIZE) < z.z * 16) throw new W("This GPU cannot hold the cloud volume atlas (3D textures too small).");
		let i = n.createVertexArray();
		if (!i) throw new W("Could not create vertex array");
		this.vao = i, this.sceneProg = G(n, J, Ye($e, Xe), "scene"), this.skyProg = G(n, J, Ye(Ze, Xe), "skyLut"), this.accumProg = G(n, J, et, "accumulate"), this.presentProg = G(n, J, tt, "present"), this.noiseShape = this.generateNoise(rt, 0, n.RGBA8, n.RGBA), this.noiseDetail = this.generateNoise(it, 1, n.RGBA8, n.RGBA), this.atlas = this.createAtlas(), this.skyLut = K(n, nt[0], nt[1], this.hdrInternal, n.RGBA, this.hdrType);
		for (let e = 15; e >= 0; e--) this.freeSlots.push(e);
		this.camera = x(1);
	}
	get hdrSupported() {
		return this.hdrInternal === this.gl.RGBA16F;
	}
	draw(e, t, n, r) {
		let i = this.gl;
		i.bindFramebuffer(i.FRAMEBUFFER, t ? t.framebuffer : null), i.viewport(0, 0, n, r), i.useProgram(e.program), i.bindVertexArray(this.vao), i.drawArrays(i.TRIANGLES, 0, 3);
	}
	generateNoise(e, t, n, r) {
		let i = this.gl, a = i.createTexture(), o = i.createFramebuffer();
		if (!a || !o) throw new W("Could not allocate noise volume");
		i.bindTexture(i.TEXTURE_3D, a), i.texImage3D(i.TEXTURE_3D, 0, n, e, e, e, 0, r, i.UNSIGNED_BYTE, null);
		let s = G(i, J, Qe, `noise${t}`);
		i.bindFramebuffer(i.FRAMEBUFFER, o);
		for (let n = 0; n < e; n++) i.framebufferTextureLayer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, a, 0, n), i.useProgram(s.program), i.uniform1f(s.uniforms.get("uSlice"), (n + .5) / e), i.uniform1i(s.uniforms.get("uMode"), t), this.draw(s, {
			framebuffer: o,
			texture: a,
			width: e,
			height: e
		}, e, e);
		return i.bindFramebuffer(i.FRAMEBUFFER, null), i.deleteFramebuffer(o), i.deleteProgram(s.program), i.bindTexture(i.TEXTURE_3D, a), i.generateMipmap(i.TEXTURE_3D), i.texParameteri(i.TEXTURE_3D, i.TEXTURE_MIN_FILTER, i.LINEAR_MIPMAP_LINEAR), i.texParameteri(i.TEXTURE_3D, i.TEXTURE_MAG_FILTER, i.LINEAR), i.texParameteri(i.TEXTURE_3D, i.TEXTURE_WRAP_S, i.REPEAT), i.texParameteri(i.TEXTURE_3D, i.TEXTURE_WRAP_T, i.REPEAT), i.texParameteri(i.TEXTURE_3D, i.TEXTURE_WRAP_R, i.REPEAT), a;
	}
	createAtlas() {
		let e = this.gl, t = e.createTexture();
		if (!t) throw new W("Could not allocate cloud atlas");
		return e.bindTexture(e.TEXTURE_3D, t), e.texImage3D(e.TEXTURE_3D, 0, e.RG8, z.x, z.y, z.z * 16, 0, e.RG, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_3D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_3D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_3D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_3D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_3D, e.TEXTURE_WRAP_R, e.CLAMP_TO_EDGE), t;
	}
	syncSlots(e) {
		let t = this.gl, n = !1, r = new Set(e.map((e) => e.id));
		for (let [e, t] of this.slots) r.has(e) || (this.slots.delete(e), this.freeSlots.push(t.slot));
		for (let r of e) {
			let e = this.slots.get(r.id);
			if (!e) {
				let t = this.freeSlots.pop();
				if (t === void 0) continue;
				e = {
					slot: t,
					key: ""
				}, this.slots.set(r.id, e);
			}
			if (e.key !== r.shapeKey) {
				let i = r.envelope();
				t.bindTexture(t.TEXTURE_3D, this.atlas), t.pixelStorei(t.UNPACK_ALIGNMENT, 1), t.texSubImage3D(t.TEXTURE_3D, 0, 0, 0, e.slot * z.z, z.x, z.y, z.z, t.RG, t.UNSIGNED_BYTE, i), e.key = r.shapeKey, n = !0;
			}
		}
		return n;
	}
	slotOf(e) {
		return this.slots.get(e)?.slot;
	}
	updateSky(e, t) {
		let n = [
			e.hour.toFixed(4),
			e.haze.toFixed(4),
			t.toFixed(3)
		].join("|");
		if (n === this.skyKey) return;
		this.skyKey = n;
		let r = this.gl, i = this.skyProg.uniforms;
		r.useProgram(this.skyProg.program), r.uniform3fv(i.get("uSunDir"), e.sunDir), r.uniform3fv(i.get("uSunIlluminance"), e.sunIlluminance), r.uniform3fv(i.get("uMoonDir"), e.moonDir), r.uniform3fv(i.get("uMoonIlluminance"), e.moonIlluminance), r.uniform1f(i.get("uHaze"), e.haze), r.uniform1f(i.get("uAltitude"), t), r.uniform3fv(i.get("uGroundAlbedo"), at), r.uniform3fv(i.get("uTwilightDome"), e.twilight.dome), r.uniform3fv(i.get("uTwilightGlow"), e.twilight.glow), this.draw(this.skyProg, this.skyLut, this.skyLut.width, this.skyLut.height);
	}
	renderSizeFor(e, t, n = this.renderScale) {
		return [Math.max(2, Math.round(e * n)), Math.max(2, Math.round(t * n))];
	}
	ensureTargets(e, t) {
		if (this.current && this.current.width === e && this.current.height === t) return;
		let n = this.gl;
		q(n, this.current), q(n, this.history[0]), q(n, this.history[1]), this.current = K(n, e, t, this.hdrInternal, n.RGBA, this.hdrType), this.history = [K(n, e, t, this.hdrInternal, n.RGBA, this.hdrType), K(n, e, t, this.hdrInternal, n.RGBA, this.hdrType)], this.accumulated = 0;
	}
	resetAccumulation() {
		this.accumulated = 0;
	}
	setSceneUniforms(e, t, n, r) {
		let i = this.gl, a = this.sceneProg.uniforms, o = e.atmosphere, s = this.camera, c = (e, t) => {
			let n = a.get(e);
			n && i.uniform1f(n, t);
		}, l = (e, t) => {
			let n = a.get(e);
			n && i.uniform1i(n, t);
		}, u = (e, t, n) => {
			let r = a.get(e);
			r && i.uniform2f(r, t, n);
		}, d = (e, t) => {
			let n = a.get(e);
			n && i.uniform3fv(n, t);
		};
		i.useProgram(this.sceneProg.program), u("uResolution", t, n), c("uFrame", this.frame % 64), u("uJitter", r[0], r[1]), d("uCamPos", s.position), d("uCamForward", s.forward), d("uCamRight", s.right), d("uCamUp", s.up), c("uTanHalfFov", Math.tan(s.fovY / 2)), c("uAspect", t / n), d("uSunDir", o.sunDir), d("uSunIlluminance", o.sunIlluminance), d("uMoonDir", o.moonDir), d("uMoonIlluminance", o.moonIlluminance), d("uKeyDir", o.keyDir), d("uKeyColor", o.keyColor), d("uAmbientTop", o.ambientTop), d("uAmbientBottom", o.ambientBottom), c("uHaze", o.haze), c("uNight", o.night), c("uTime", e.time), l("uQuality", lt[this.quality]), c("uPixelStyle", +(this.style === "pixel")), c("uPixelAngle", 2 * Math.tan(s.fovY / 2) / n), c("uSlotCount", 16), d("uSlotTexel", [
			1 / z.x,
			1 / z.y,
			1 / z.z
		]);
		let f = /* @__PURE__ */ new Float32Array(64), p = /* @__PURE__ */ new Float32Array(64), m = /* @__PURE__ */ new Float32Array(64), h = 0;
		for (let t of e.clouds) {
			let e = this.slots.get(t.id)?.slot;
			e === void 0 || h >= 16 || (f.set([
				t.position[0],
				t.position[1],
				t.position[2],
				t.scale
			], h * 4), p.set([
				t.half[0],
				t.half[1],
				t.half[2],
				t.yaw
			], h * 4), m.set([
				e,
				t.growth,
				t.seed % 997,
				t.density
			], h * 4), h++);
		}
		l("uCloudCount", h);
		let g = a.get("uCloudPos");
		g && i.uniform4fv(g, f);
		let _ = a.get("uCloudHalf");
		_ && i.uniform4fv(_, p);
		let v = a.get("uCloudParam");
		v && i.uniform4fv(v, m);
		let y = (e, t, n, r) => {
			i.activeTexture(i.TEXTURE0 + e), i.bindTexture(t, n), l(r, e);
		};
		y(0, i.TEXTURE_2D, this.skyLut.texture, "uSkyLut"), y(1, i.TEXTURE_3D, this.noiseShape, "uNoiseShape"), y(2, i.TEXTURE_3D, this.noiseDetail, "uNoiseDetail"), y(3, i.TEXTURE_3D, this.atlas, "uAtlas");
	}
	renderInternal(e, t, n, r) {
		let i = this.gl;
		this.ensureTargets(t, n), this.syncSlots(e.clouds) && (this.accumulated = 0), e.changed ? this.accumulated = 0 : e.softChange && (this.accumulated = Math.min(this.accumulated, ot));
		let a = e.view ?? y;
		this.updateSky(e.atmosphere, a.altitude), this.camera = x(t / n, a);
		let o = this.accumulated, s = o === 0 ? [0, 0] : [dt(this.frame % 16 + 1, 2) - .5, dt(this.frame % 16 + 1, 3) - .5];
		this.setSceneUniforms(e, t, n, s), this.draw(this.sceneProg, this.current, t, n);
		let c = o === 0 ? 1 : Math.max(1 / (o + 1), r), l = this.history[this.historyIndex], u = this.history[1 - this.historyIndex];
		i.useProgram(this.accumProg.program), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, this.current.texture), i.uniform1i(this.accumProg.uniforms.get("uCurrent"), 0), i.activeTexture(i.TEXTURE1), i.bindTexture(i.TEXTURE_2D, l.texture), i.uniform1i(this.accumProg.uniforms.get("uHistory"), 1), i.uniform1f(this.accumProg.uniforms.get("uBlend"), c), this.draw(this.accumProg, u, t, n), this.historyIndex = 1 - this.historyIndex, this.accumulated = Math.min(o + 1, 1e6), this.frame++, this.lastAtmosphere = e.atmosphere;
	}
	present(e, t, n, r) {
		let i = this.gl, a = this.presentProg.uniforms;
		i.useProgram(this.presentProg.program), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, this.history[this.historyIndex].texture), i.uniform1i(a.get("uImage"), 0), i.uniform1f(a.get("uExposure"), r.exposure * (this.style === "pixel" ? 1.22 : 1)), i.uniform1f(a.get("uNight"), r.night), i.uniform2f(a.get("uResolution"), t, n), i.uniform1f(a.get("uFrame"), this.frame % 64);
		let o = this.history[this.historyIndex];
		i.uniform1f(a.get("uPixel"), +(this.style === "pixel")), i.uniform2f(a.get("uTexSize"), o.width, o.height), i.uniform1f(a.get("uLevels"), st), i.uniform1f(a.get("uDither"), ct), this.draw(this.presentProg, e, t, n);
	}
	render(e, t = .08) {
		let n = this.canvas.width, r = this.canvas.height, [i, a] = this.renderSizeFor(n, r);
		return this.renderInternal(e, i, a, t), this.present(null, n, r, e.atmosphere), {
			renderWidth: i,
			renderHeight: a,
			accumulated: this.accumulated,
			quality: this.quality
		};
	}
	capture(e, t, n, r = 24, i = 1) {
		let a = this.gl, o = a.getParameter(a.MAX_RENDERBUFFER_SIZE), s = a.getParameter(a.MAX_TEXTURE_SIZE), c = Math.min(o, s);
		if (t > c || n > c) throw new W(`Capture size exceeds this GPU's limit of ${c}px`);
		let [l, u] = this.renderSizeFor(t, n, i), d = {
			current: this.current,
			history: this.history,
			idx: this.historyIndex,
			acc: this.accumulated
		};
		this.current = null, this.history = [null, null], this.historyIndex = 0;
		let f;
		try {
			this.ensureTargets(l, u);
			for (let t = 0; t < r; t++) this.renderInternal({
				...e,
				changed: t === 0
			}, l, u, 0);
			let i = K(a, t, n, a.RGBA8, a.RGBA, a.UNSIGNED_BYTE);
			this.present(i, t, n, e.atmosphere), a.bindFramebuffer(a.FRAMEBUFFER, i.framebuffer);
			let o = new Uint8Array(t * n * 4);
			a.readPixels(0, 0, t, n, a.RGBA, a.UNSIGNED_BYTE, o), a.bindFramebuffer(a.FRAMEBUFFER, null), q(a, i), f = new Uint8ClampedArray(t * n * 4);
			let s = t * 4;
			for (let e = 0; e < n; e++) f.set(o.subarray((n - 1 - e) * s, (n - e) * s), e * s);
		} finally {
			q(a, this.current), q(a, this.history[0]), q(a, this.history[1]), this.current = d.current, this.history = d.history, this.historyIndex = d.idx, this.accumulated = 0;
		}
		return f;
	}
	get atmosphere() {
		return this.lastAtmosphere;
	}
	dispose() {
		let e = this.gl;
		q(e, this.current), q(e, this.history[0]), q(e, this.history[1]), q(e, this.skyLut), e.deleteTexture(this.noiseShape), e.deleteTexture(this.noiseDetail), e.deleteTexture(this.atlas);
		for (let t of [
			this.sceneProg,
			this.skyProg,
			this.accumProg,
			this.presentProg
		]) e.deleteProgram(t.program);
		e.deleteVertexArray(this.vao), this.slots.clear();
	}
}, pt = .9, mt = .6, ht = 3, gt = /* @__PURE__ */ new Set(), _t = !1;
function vt(e) {
	return Math.min(4, .6 + e / 3);
}
function yt(e, t, n = gt, r = _t) {
	if (n.size === 0) return null;
	let i = Math.min(t, 100) / 1e3, a = vt(e.altitude) * (r ? ht : 1), o = +!!n.has("forward") - !!n.has("back"), s = +!!n.has("right") - !!n.has("left"), c = +!!n.has("up") - !!n.has("down"), l = Math.sin(e.yaw), u = Math.cos(e.yaw), d = pt * a * i;
	return {
		...e,
		x: e.x + (o * l + s * u) * d,
		z: e.z + (-o * u + s * l) * d,
		altitude: e.altitude + c * mt * a * i
	};
}
// sky/vendor/sky-study/engine/Engine.ts
var bt = 3400, xt = 1700, St = 7, Ct = 2.6, wt = .05, Tt = [
	.72,
	.62,
	.54,
	.46,
	.4,
	.34,
	.28
], Et = {
	high: {
		quality: "high",
		scale: .72
	},
	balanced: {
		quality: "balanced",
		scale: .5
	},
	reduced: {
		quality: "reduced",
		scale: .36
	}
}, Dt = (e) => 1 - (1 - u(e, 0, 1)) ** 2, Ot = (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
function kt(e, t) {
	let n = e.seed % 1e3 / 159.155, r = Math.PI * 2 / 95;
	return [
		Math.sin(t * r + n) * wt,
		Math.sin(t * r * .63 + n * 1.7) * wt * .25,
		0
	];
}
var At = class {
	renderer;
	canvas;
	raf = 0;
	running = !1;
	listeners = /* @__PURE__ */ new Set();
	afterRender = /* @__PURE__ */ new Set();
	resizeObserver;
	dpr = 1;
	cssW = 1;
	cssH = 1;
	lastFrame = 0;
	frameEma = 16.7;
	slowSince = 0;
	fastSince = 0;
	autoIndex = 2;
	signature = "";
	softSignature = "";
	hourFrom = 12.5;
	hourTo = 12.5;
	hourStart = 0;
	displayHour = 12.5;
	atmosphere;
	atmosphereHour = NaN;
	startTime = performance.now();
	displayView;
	freezeTime = null;
	constructor(e) {
		this.canvas = e, this.renderer = new ft(e, "balanced");
		let t = k.getState().scene.hour;
		this.hourFrom = this.hourTo = this.displayHour = t, this.atmosphere = Me(t), this.displayView = k.getState().view, this.resizeObserver = new ResizeObserver(() => this.syncSize()), this.resizeObserver.observe(e), this.syncSize(), window.matchMedia?.("(prefers-reduced-motion: reduce)").matches && k.getState().setDrift(!1);
	}
	start() {
		if (this.running) return;
		this.running = !0;
		let e = (t) => {
			this.running && (this.tick(t), this.raf = requestAnimationFrame(e));
		};
		this.raf = requestAnimationFrame(e);
	}
	stop() {
		this.running = !1, cancelAnimationFrame(this.raf);
	}
	dispose() {
		this.stop(), this.resizeObserver.disconnect(), this.listeners.clear(), this.afterRender.clear(), this.renderer.dispose();
	}
	onFrame(e) {
		return this.listeners.add(e), () => this.listeners.delete(e);
	}
	onAfterRender(e) {
		return this.afterRender.add(e), () => this.afterRender.delete(e);
	}
	syncSize() {
		this.dpr = Math.min(window.devicePixelRatio || 1, 2), this.cssW = Math.max(1, this.canvas.clientWidth), this.cssH = Math.max(1, this.canvas.clientHeight);
		let e = Math.round(this.cssW * this.dpr), t = Math.round(this.cssH * this.dpr);
		(this.canvas.width !== e || this.canvas.height !== t) && (this.canvas.width = e, this.canvas.height = t);
	}
	get size() {
		return {
			width: this.cssW,
			height: this.cssH,
			dpr: this.dpr
		};
	}
	get camera() {
		return x(this.cssW / this.cssH, this.displayView);
	}
	get view() {
		return this.displayView;
	}
	snapView() {
		this.displayView = k.getState().view;
	}
	updateView(e) {
		let t = k.getState().view, n = this.displayView;
		if (n === t) return;
		let r = t.yaw - n.yaw;
		r > Math.PI && (r -= Math.PI * 2), r < -Math.PI && (r += Math.PI * 2);
		let i = Math.log(t.altitude) - Math.log(n.altitude), a = Math.abs(i) > .6 || Math.abs(t.pitch - n.pitch) > .5 || Math.hypot(t.x - n.x, t.z - n.z) > 4, o = 1 - Math.exp(-(a ? Ct : St) * Math.min(e, 100) / 1e3), s = t.x - n.x, c = t.z - n.z, l = {
			x: n.x + s * o,
			z: n.z + c * o,
			yaw: n.yaw + r * o,
			pitch: n.pitch + (t.pitch - n.pitch) * o,
			altitude: Math.exp(Math.log(n.altitude) + i * o)
		}, u = Math.abs(r) < 1e-4 && Math.abs(t.pitch - n.pitch) < 1e-4 && Math.abs(i) < 1e-4 && Math.hypot(s, c) < 1e-4;
		this.displayView = u ? t : l;
	}
	get drift() {
		return k.getState().drift;
	}
	get hour() {
		return this.displayHour;
	}
	get currentAtmosphere() {
		return this.atmosphere;
	}
	rayAt(e, t) {
		let n = this.camera;
		return {
			origin: n.position,
			dir: S(n, e / this.cssW * 2 - 1, 1 - t / this.cssH * 2)
		};
	}
	toScreen(e) {
		let t = C(this.camera, e);
		return t ? {
			x: (t.x * .5 + .5) * this.cssW,
			y: (.5 - t.y * .5) * this.cssH,
			depth: t.depth
		} : null;
	}
	renderPosition(e, t = performance.now()) {
		return this.drift ? n(e.position, kt(e, (t - this.startTime) / 1e3)) : e.position;
	}
	screenRect(e, t = performance.now()) {
		let n = U(e), r = this.renderPosition(e, t), i = this.camera, a = Math.tan(i.fovY / 2), o = Math.cos(e.yaw), s = Math.sin(e.yaw), c = Infinity, l = Infinity, u = -Infinity, d = -Infinity;
		for (let t of n.lobes) {
			let i = t.x * e.scale, f = t.z * e.scale, p = [
				r[0] + o * i + s * f,
				r[1] + t.y * e.scale,
				r[2] - s * i + o * f
			], m = this.toScreen(p);
			if (!m) return null;
			let h = t.r * e.scale * .8, g = h / (m.depth * a) * (this.cssH / 2), _ = r[1] + n.baseY * e.scale, v = p[1] - h < _ ? this.toScreen([
				p[0],
				_,
				p[2]
			]) : null;
			c = Math.min(c, m.x - g), u = Math.max(u, m.x + g), l = Math.min(l, m.y - g), d = Math.max(d, v ? Math.min(m.y + g, v.y) : m.y + g);
		}
		return {
			x: c,
			y: l,
			w: u - c,
			h: d - l
		};
	}
	growthOf(e, t) {
		let n = k.getState().formedAt[e];
		return n === void 0 ? 1 : Dt((t - n) / bt);
	}
	updateHour(e) {
		let t = this.freezeTime ?? k.getState().scene.hour;
		if (this.freezeTime === null ? t !== this.hourTo && (this.hourFrom = this.displayHour, this.hourTo = t, this.hourStart = e) : this.displayHour = this.hourFrom = this.hourTo = t, this.displayHour !== this.hourTo) {
			let t = xt * u(.55 + Math.abs(this.hourTo - this.hourFrom) / 10, .6, 1.25), n = u((e - this.hourStart) / t, 0, 1);
			this.displayHour = this.hourFrom + (this.hourTo - this.hourFrom) * Ot(n), n >= 1 && (this.displayHour = this.hourTo);
		}
		this.displayHour !== this.atmosphereHour && (this.atmosphere = Me(this.displayHour), this.atmosphereHour = this.displayHour);
	}
	pixelScale(e = 1) {
		return 1 / (k.getState().pixelSize * this.dpr * e);
	}
	applyQuality(e, t) {
		let { quality: n, style: r } = k.getState();
		if (this.renderer.style = r, r === "pixel") {
			this.renderer.quality = "high", this.renderer.renderScale = this.pixelScale();
			return;
		}
		if (n !== "auto") {
			let e = Et[n];
			this.renderer.quality = e.quality, this.renderer.renderScale = e.scale;
			return;
		}
		this.frameEma = this.frameEma * .92 + Math.min(e, 100) * .08, this.frameEma > 24 ? (this.fastSince = 0, this.slowSince ||= t, t - this.slowSince > 700 && this.autoIndex < Tt.length - 1 && (this.autoIndex++, this.slowSince = t)) : this.frameEma < 18.5 ? (this.slowSince = 0, this.fastSince ||= t, t - this.fastSince > 4e3 && this.autoIndex > 0 && (this.autoIndex--, this.fastSince = t)) : this.slowSince = this.fastSince = 0;
		let i = Tt[this.autoIndex];
		this.renderer.renderScale = i, this.renderer.quality = i >= .6 ? "high" : i >= .4 ? "balanced" : "reduced";
	}
	buildRenderClouds(e, t = this.drift) {
		let { scene: n } = k.getState();
		return [...n.clouds].sort((e, t) => e.order - t.order).map((n) => {
			let r = U(n);
			return {
				id: n.id,
				shapeKey: H(n),
				envelope: () => Ke(n),
				position: t ? this.renderPosition(n, e) : n.position,
				scale: n.scale,
				yaw: n.yaw,
				half: r.half,
				growth: this.growthOf(n.id, e),
				seed: n.seed,
				density: 1
			};
		});
	}
	tick(e) {
		let t = this.lastFrame ? e - this.lastFrame : 16.7;
		this.lastFrame = e, this.syncSize(), this.updateHour(e);
		let n = yt(k.getState().view, t);
		n && k.getState().setView(n), this.updateView(t), this.applyQuality(t, e);
		let r = this.buildRenderClouds(e), i = k.getState().scene.clouds, a = [
			this.canvas.width,
			this.canvas.height,
			this.renderer.renderScale,
			this.renderer.quality,
			this.renderer.style,
			this.displayView.x,
			this.displayView.z,
			this.displayView.yaw,
			this.displayView.pitch,
			this.displayView.altitude,
			...i.map((e) => `${e.id}:${e.position.join(",")}:${e.scale}:${e.yaw}`)
		].join("|"), o = [this.displayHour.toFixed(5), ...r.map((e) => e.growth.toFixed(4))].join("|"), s = a !== this.signature, c = o !== this.softSignature;
		this.signature = a, this.softSignature = o;
		let l = this.renderer.render({
			clouds: r,
			atmosphere: this.atmosphere,
			changed: s,
			softChange: c,
			time: e / 1e3,
			view: this.displayView
		}, .06);
		this.frames++;
		for (let e of this.afterRender) e(this.canvas);
		let u = {
			now: e,
			frameMs: t,
			renderWidth: l.renderWidth,
			renderHeight: l.renderHeight,
			accumulated: l.accumulated,
			displayHour: this.displayHour
		};
		for (let e of this.listeners) e(u);
		Math.random() < .01 && qe(k.getState().scene.clouds);
	}
	frames = 0;
	sample(e = {
		x0: 0,
		y0: 0,
		x1: 1,
		y1: 1
	}, t = 192, n = 120) {
		let r = this.capture(t, n, 6), i = 0, a = 0, o = 0, s = 0, c = 0, l = 0, u = [], d = /* @__PURE__ */ new Set();
		for (let f = Math.floor(e.y0 * n); f < Math.ceil(e.y1 * n); f++) for (let n = Math.floor(e.x0 * t); n < Math.ceil(e.x1 * t); n++) {
			let e = (f * t + n) * 4;
			i += r[e], a += r[e + 1], o += r[e + 2], s++, c = Math.max(c, r[e], r[e + 1], r[e + 2]), Number.isFinite(r[e]) || l++, u.push([.2126 * r[e] + .7152 * r[e + 1] + .0722 * r[e + 2], e]), d.add(r[e] << 16 | r[e + 1] << 8 | r[e + 2]);
		}
		u.sort((e, t) => t[0] - e[0]);
		let f = u.slice(0, Math.max(1, Math.floor(u.length / 10))), p = 0, m = 0;
		for (let [, e] of f) p += r[e], m += r[e + 2];
		return {
			r: i / s,
			g: a / s,
			b: o / s,
			max: c,
			nonFinite: l,
			highlightWarmth: p / Math.max(1, m),
			distinctColors: d.size,
			glError: this.renderer.gl.getError()
		};
	}
	benchmark(e = 30, t, n) {
		let r = {
			scale: this.renderer.renderScale,
			quality: this.renderer.quality
		};
		t && (this.renderer.renderScale = t), n && (this.renderer.quality = n);
		let i = this.renderer.gl, a = this.buildRenderClouds(performance.now()).map((e) => ({
			...e,
			growth: 1
		})), o = [];
		this.renderer.render({
			clouds: a,
			atmosphere: this.atmosphere,
			changed: !0,
			time: 0,
			view: this.displayView
		}), i.finish();
		for (let t = 0; t < e; t++) {
			let e = performance.now();
			this.renderer.render({
				clouds: a,
				atmosphere: this.atmosphere,
				changed: !0,
				time: t,
				view: this.displayView
			}), i.readPixels(0, 0, 1, 1, i.RGBA, i.UNSIGNED_BYTE, /* @__PURE__ */ new Uint8Array(4)), o.push(performance.now() - e);
		}
		this.renderer.renderScale = r.scale, this.renderer.quality = r.quality, o.sort((e, t) => e - t);
		let [s, c] = this.renderer.renderSizeFor(this.canvas.width, this.canvas.height, t ?? r.scale);
		return {
			mean: o.reduce((e, t) => e + t, 0) / o.length,
			median: o[Math.floor(o.length / 2)],
			p90: o[Math.floor(o.length * .9)],
			renderWidth: s,
			renderHeight: c,
			canvas: [this.canvas.width, this.canvas.height]
		};
	}
	capture(e, t, n = 32) {
		let r = performance.now(), i = this.buildRenderClouds(r).map((e) => ({
			...e,
			growth: 1
		})), a = this.renderer.style === "pixel" ? this.pixelScale(e / this.canvas.width) : .85;
		return this.renderer.capture({
			clouds: i,
			atmosphere: this.atmosphere,
			changed: !0,
			time: r / 1e3,
			view: this.displayView
		}, e, t, n, a);
	}
}, jt = {
	x: 0,
	z: 0,
	yaw: 0,
	pitch: 21 * f,
	altitude: 1
}, Mt = 12.5, Nt = "mariashowalter.com/sky", Pt = `${Nt}/scene/v1`, Ft = `${Nt}/still/v1`, Y = .35, It = -22 * f, Lt = 2.2;
function Rt(e, t = 9) {
	let n = T(e), r = [
		-n[2],
		0,
		n[0]
	];
	return e.position[1] >= 4 && e.forward[1] < Math.sin(It) ? {
		orientation: "horizontal",
		origin: [
			e.position[0],
			Lt,
			e.position[2]
		],
		normal: [
			0,
			1,
			0
		],
		right: r,
		along: n
	} : {
		orientation: "vertical",
		origin: [
			e.position[0] + n[0] * t,
			0,
			e.position[2] + n[2] * t
		],
		normal: n,
		right: r,
		along: [
			0,
			1,
			0
		]
	};
}
function zt(e, t, n, i) {
	let o = S(e, n, i), s = w(e.position, o, t.origin, t.normal);
	if (!s) return null;
	let c = r(s, t.origin);
	return {
		x: a(c, t.right),
		y: t.orientation === "vertical" ? s[1] : a(c, t.along)
	};
}
function Bt(e) {
	let t = T(e);
	return -Math.atan2(t[0], -t[2]);
}
function Vt(e, t, r) {
	let a = Rt(e), o = [];
	for (let n of t) {
		let t = zt(e, a, n.x, n.y);
		t && o.push(t);
	}
	if (o.length < 2) return {
		ok: !1,
		reason: "off-plane"
	};
	let s = He(o);
	if (!s) return {
		ok: !1,
		reason: "too-short"
	};
	let c = a.orientation, { baseY: l } = We(s.points, s.closed, r, c), u = Bt(e);
	if (c === "horizontal") {
		let e = n(n(a.origin, i(a.right, s.center.x)), i(a.along, s.center.y)), t = [
			e[0],
			Math.max(Lt, Y - l),
			e[2]
		];
		return {
			ok: !0,
			cloud: {
				seed: r,
				stroke: s.points,
				closed: s.closed,
				orientation: c,
				position: t,
				scale: 1,
				yaw: u
			}
		};
	}
	let d = Math.max(s.center.y, Y - l), f = n(n(a.origin, i(a.right, s.center.x)), [
		0,
		d,
		0
	]);
	return {
		ok: !0,
		cloud: {
			seed: r,
			stroke: s.points,
			closed: s.closed,
			position: f,
			scale: 1,
			yaw: u
		}
	};
}
// sky/vendor/sky-study/interactions/picking.ts
var Ht = .82;
function Ut(e, t) {
	let n = Math.cos(e.yaw), r = Math.sin(e.yaw);
	return [
		(n * t[0] - r * t[2]) / e.scale,
		t[1] / e.scale,
		(r * t[0] + n * t[2]) / e.scale
	];
}
function Wt(e, t, n, i, o = n.position) {
	let s = Ut(n, r(e, o)), c = Ut(n, t), l = a(c, c), u = null;
	for (let e of i.lobes) {
		let t = r(s, [
			e.x,
			e.y,
			e.z
		]), n = e.r * Ht, i = a(t, c), o = a(t, t) - n * n, d = i * i - l * o;
		if (d < 0) continue;
		let f = (-i - Math.sqrt(d)) / l, p = f > 0 ? f : (-i + Math.sqrt(d)) / l;
		p > 0 && (u === null || p < u) && (u = p);
	}
	return u;
}
function Gt(e, t, r, a, o = (e) => e.position) {
	let s = null;
	for (let c of r) {
		let r = Wt(e, t, c, a(c), o(c));
		r !== null && (!s || r < s.t) && (s = {
			id: c.id,
			t: r,
			point: n(e, i(t, r))
		});
	}
	return s;
}
var Kt = (e, t) => s(r(t.position, e));
function qt(e, t, n) {
	let r = t[0] - e[0], i = t[2] - e[2], a = t[1] - e[1], o = Math.hypot(r, i) || 1e-6, s = Math.sqrt(Math.max(n * n - a * a, .25)) / o;
	return [
		e[0] + r * s,
		t[1],
		e[2] + i * s
	];
}
function Jt(e, t) {
	let n = Infinity, r = -Infinity, i = Infinity, a = -Infinity, o = Infinity, s = -Infinity;
	for (let e of t.lobes) {
		let c = e.r * Ht;
		n = Math.min(n, e.x - c), r = Math.max(r, e.x + c), i = Math.min(i, Math.max(e.y - c, t.baseY)), a = Math.max(a, e.y + c), o = Math.min(o, e.z - c), s = Math.max(s, e.z + c);
	}
	return {
		w: (r - n) * e.scale,
		h: (a - i) * e.scale,
		d: (s - o) * e.scale
	};
}
// sky/src/defaultScene.ts
var Yt = (e) => Array.from({ length: e }, (t, n) => n / (e - 1));
function Xt(e, t, n, r, i = .12) {
	return Yt(64).map((a) => {
		let o = a * Math.PI * 2, s = 1 + i * Math.sin(o * 3 + e * 7) + i * .5 * Math.cos(o * 5);
		return {
			x: e + Math.cos(o) * n * .5 * s,
			y: t + Math.sin(o) * r * .5 * s
		};
	});
}
function Zt(e, t, n, r, i = 2.2) {
	return Yt(48).map((a) => ({
		x: e + (t - e) * a,
		y: n + Math.sin(a * Math.PI * i) * r + a * r * .4
	}));
}
var Qt = [
	{
		id: "sky-a",
		seed: 1103,
		path: Xt(-.74, .5, .3, .2),
		distance: 11
	},
	{
		id: "sky-b",
		seed: 2207,
		path: Zt(-1.02, -.6, -.12, .05),
		distance: 16,
		scale: 1.25
	},
	{
		id: "sky-c",
		seed: 3301,
		path: Xt(.76, .3, .34, .22),
		distance: 10
	},
	{
		id: "sky-d",
		seed: 4409,
		path: Zt(.58, 1, -.3, .04),
		distance: 19,
		scale: 1.4
	},
	{
		id: "sky-e",
		seed: 5503,
		path: Zt(-.16, .2, .74, .045, 1.6),
		distance: 14
	}
], $t = null;
function X() {
	if ($t) return $t;
	let e = x(1.6, jt), t = [];
	return Qt.forEach((n, r) => {
		let i = Vt(e, n.path, n.seed);
		if (!i.ok) return;
		let a = {
			...i.cloud,
			id: n.id,
			order: r + 1,
			scale: n.scale ?? 1
		};
		n.distance && (a = {
			...a,
			position: qt(e.position, a.position, n.distance)
		});
		let o = Y - U(a).baseY * a.scale;
		a = {
			...a,
			position: [
				a.position[0],
				Math.max(a.position[1], o),
				a.position[2]
			]
		}, t.push(a);
	}), $t = {
		version: 1,
		hour: Mt,
		clouds: t
	}, $t;
}
var en = (e) => JSON.stringify(e) === JSON.stringify(X()), tn = 1100, nn = 380, rn = 1, Z = [];
function an(e) {
	let t = {
		id: rn++,
		points: [e],
		releasedAt: null,
		accepted: !1
	};
	return Z.push(t), t;
}
function on(e, t) {
	let n = e.points[e.points.length - 1];
	n && Math.hypot(t.x - n.x, t.y - n.y) < 1.2 || e.points.push(t);
}
function Q(e, t, n) {
	e.releasedAt = n, e.accepted = t;
}
function sn(e, t) {
	if (e.releasedAt === null) return 1;
	let n = t - e.releasedAt;
	return e.accepted ? n < 700 ? 1 : Math.max(0, 1 - (n - 700) / tn) : Math.max(0, 1 - n / nn);
}
function cn(e) {
	for (let t = Z.length - 1; t >= 0; t--) sn(Z[t], e) <= 0 && Z.splice(t, 1);
	return Z;
}
function ln(e) {
	if (e.length === 0) return "";
	if (e.length === 1) return `M${e[0].x},${e[0].y}l0.01,0`;
	let t = `M${e[0].x.toFixed(1)},${e[0].y.toFixed(1)}`;
	for (let n = 1; n < e.length - 1; n++) {
		let r = (e[n].x + e[n + 1].x) / 2, i = (e[n].y + e[n + 1].y) / 2;
		t += `Q${e[n].x.toFixed(1)},${e[n].y.toFixed(1)} ${r.toFixed(1)},${i.toFixed(1)}`;
	}
	let n = e[e.length - 1];
	return `${t}L${n.x.toFixed(1)},${n.y.toFixed(1)}`;
}
// sky/src/interaction.ts
var un = 7, $ = (e) => e ? k.getState().scene.clouds.find((t) => t.id === e) : void 0, dn = class {
	hooks;
	surface;
	svg;
	sel;
	label;
	engine = null;
	offFrame = null;
	gesture = null;
	wheelTimer = 0;
	wheelTarget = null;
	mode = "browse";
	tool = "draw";
	constructor(e, t) {
		this.hooks = t, this.surface = e, e.innerHTML = "<svg class=\"sky-strokes\" aria-hidden=\"true\"></svg>\n<div class=\"sky-selection\" hidden><i data-handle=\"nw\"></i><i data-handle=\"ne\"></i><i data-handle=\"sw\"></i><i data-handle=\"se\"></i><span class=\"sky-selection-label\"></span></div>", this.svg = e.querySelector("svg"), this.sel = e.querySelector(".sky-selection"), this.label = e.querySelector(".sky-selection-label"), e.addEventListener("pointerdown", this.onDown), e.addEventListener("pointermove", this.onMove), e.addEventListener("pointerup", this.onUp), e.addEventListener("pointercancel", this.onUp), e.addEventListener("contextmenu", this.onContext), e.addEventListener("wheel", this.onWheel, { passive: !1 }), this.setMode("browse");
	}
	attach(e) {
		e || this.cancelGesture(), this.offFrame?.(), this.offFrame = null, this.engine = e, e && (this.offFrame = e.onFrame(({ now: e }) => this.paint(e)));
	}
	setMode(e) {
		this.cancelGesture(), this.endWheel(), this.mode = e, this.surface.dataset.mode = e, e === "browse" && k.getState().select(null), this.surface.dataset.cursor = e === "edit" && this.tool === "draw" ? "draw" : "default";
	}
	setTool(e) {
		this.tool = e, this.surface.dataset.tool = e, this.surface.dataset.cursor = this.mode === "edit" && e === "draw" ? "draw" : "default";
	}
	dispose() {
		this.attach(null);
		let e = this.surface;
		e.removeEventListener("pointerdown", this.onDown), e.removeEventListener("pointermove", this.onMove), e.removeEventListener("pointerup", this.onUp), e.removeEventListener("pointercancel", this.onUp), e.removeEventListener("contextmenu", this.onContext), e.removeEventListener("wheel", this.onWheel), window.clearTimeout(this.wheelTimer);
	}
	paint(e) {
		let t = cn(e), n = this.svg.querySelectorAll("path");
		t.forEach((t, r) => {
			let i = n[r];
			i || (i = document.createElementNS("http://www.w3.org/2000/svg", "path"), this.svg.appendChild(i)), i.setAttribute("d", ln(t.points)), i.style.opacity = String(sn(t, e));
		});
		for (let e = t.length; e < n.length; e++) n[e].remove();
		let r = this.engine, i = this.mode === "edit" ? $(k.getState().selectedId) : void 0, a = i && r ? r.screenRect(i, e) : null;
		if (!a || !i || !r) {
			this.sel.hidden = !0;
			return;
		}
		this.sel.hidden = !1, this.sel.style.transform = `translate(${a.x}px, ${a.y}px)`, this.sel.style.width = `${a.w}px`, this.sel.style.height = `${a.h}px`;
		let o = Jt(i, U(i)), s = Kt(r.camera.position, i);
		this.label.textContent = `${Math.round(o.w * 1e3).toLocaleString("en-US")} m wide · ${s.toFixed(1)} km away`;
	}
	local(e) {
		let t = this.surface.getBoundingClientRect();
		return {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		};
	}
	pickAt(e, t) {
		let n = this.engine, { origin: r, dir: i } = n.rayAt(e, t);
		return Gt(r, i, k.getState().scene.clouds, U, (e) => n.renderPosition(e));
	}
	liftAboveGround(e, t) {
		let n = Y - U(t).baseY * t.scale;
		return [
			e[0],
			Math.max(e[1], n),
			e[2]
		];
	}
	startDrag(e, t, n, i) {
		let a = this.engine, o = $(e);
		if (!a || !o) return;
		let s = a.camera, { origin: c, dir: l } = a.rayAt(t, n), u = w(c, l, o.position, s.forward) ?? o.position;
		k.getState().begin(), this.gesture = {
			kind: "drag",
			id: e,
			offset: r(o.position, u),
			normal: s.forward,
			pointerId: i
		}, this.surface.dataset.dragging = "";
	}
	capture(e) {
		try {
			this.surface.setPointerCapture(e);
		} catch {}
	}
	cancelGesture() {
		let e = this.gesture;
		this.gesture = null, delete this.surface.dataset.dragging, e && (e.kind === "stroke" ? Q(e.stroke, !1, performance.now()) : k.getState().end());
	}
	onContext = (e) => {
		this.mode === "edit" && e.preventDefault();
	};
	onDown = (e) => {
		if (!this.engine || this.gesture || e.button !== 0) return;
		let t = k.getState(), { x: n, y: r } = this.local(e);
		if (this.mode === "browse") {
			if (e.pointerType !== "mouse") return;
			let t = this.pickAt(n, r);
			if (!t) return;
			e.preventDefault(), this.capture(e.pointerId), this.startDrag(t.id, n, r, e.pointerId);
			return;
		}
		if (e.preventDefault(), this.capture(e.pointerId), e.target.dataset?.handle && t.selectedId) {
			let i = this.sel.getBoundingClientRect(), a = this.surface.getBoundingClientRect(), o = i.left - a.left + i.width / 2, s = i.top - a.top + i.height / 2, c = $(t.selectedId);
			t.begin(), this.gesture = {
				kind: "scale",
				id: c.id,
				cx: o,
				cy: s,
				startDist: Math.max(8, Math.hypot(n - o, r - s)),
				startScale: c.scale,
				pointerId: e.pointerId
			};
			return;
		}
		let i = this.pickAt(n, r);
		if (i && e.shiftKey) {
			let n = $(i.id);
			t.select(i.id), t.begin(), this.gesture = {
				kind: "depth",
				id: i.id,
				startY: r,
				startDistance: Kt(this.engine.camera.position, n),
				pointerId: e.pointerId
			};
		} else this.tool === "move" ? i ? (t.select(i.id), this.startDrag(i.id, n, r, e.pointerId)) : t.select(null) : i && i.id === t.selectedId ? this.startDrag(i.id, n, r, e.pointerId) : this.gesture = {
			kind: "stroke",
			stroke: an({
				x: n,
				y: r
			}),
			startedOn: i?.id ?? null,
			pointerId: e.pointerId
		};
	};
	onMove = (e) => {
		let t = this.engine;
		if (!t) return;
		let { x: r, y: i } = this.local(e), a = this.gesture;
		if (!a) {
			this.hover(r, i, e.pointerType);
			return;
		}
		if (a.pointerId !== e.pointerId) return;
		let o = k.getState();
		if (a.kind === "stroke") {
			let t = e.getCoalescedEvents?.() ?? [e];
			for (let e of t) on(a.stroke, this.local(e));
			return;
		}
		let s = $(a.id);
		if (s) {
			if (a.kind === "drag") {
				let { origin: e, dir: c } = t.rayAt(r, i), l = w(e, c, s.position, a.normal);
				l && o.updateCloud(s.id, { position: this.liftAboveGround(n(l, a.offset), s) });
			} else if (a.kind === "depth") {
				let e = u(a.startDistance * Math.exp((a.startY - i) * -.006), 3, 42);
				o.updateCloud(s.id, { position: this.liftAboveGround(qt(t.camera.position, s.position, e), s) });
			} else {
				let e = u(a.startScale * Math.hypot(r - a.cx, i - a.cy) / a.startDist, E, D);
				o.updateCloud(s.id, {
					scale: e,
					position: this.liftAboveGround(s.position, {
						...s,
						scale: e
					})
				});
			}
		}
	};
	onUp = (e) => {
		let t = this.gesture, n = this.engine;
		if (!t || t.pointerId !== e.pointerId) return;
		if (!n) {
			this.cancelGesture();
			return;
		}
		this.gesture = null, delete this.surface.dataset.dragging;
		let r = k.getState();
		if (t.kind !== "stroke") {
			r.end(), t.kind === "drag" && this.mode === "browse" && this.hooks.announce("Cloud moved.");
			return;
		}
		let i = t.stroke.points, a = 0;
		for (let e = 1; e < i.length; e++) a += Math.hypot(i[e].x - i[e - 1].x, i[e].y - i[e - 1].y);
		let o = performance.now();
		if (a < un || e.type === "pointercancel") {
			Q(t.stroke, !1, o), e.type !== "pointercancel" && r.select(t.startedOn);
			return;
		}
		let { width: s, height: c } = n.size, l = i.map((e) => ({
			x: e.x / s * 2 - 1,
			y: 1 - e.y / c * 2
		})), u = Vt(n.camera, l, Pe());
		if (!u.ok) {
			Q(t.stroke, !1, o), this.hooks.announce(u.reason === "too-short" ? "Draw a little longer — that line is too short for a cloud." : "Draw above the horizon to make a cloud.");
			return;
		}
		let d = Math.max(0, ...r.scene.clouds.map((e) => e.order)) + 1, f = r.addCloud({
			...u.cloud,
			id: pn(),
			order: d
		}, o);
		Q(t.stroke, f, o), f && (r.select(null), this.hooks.announce("Cloud added."));
	};
	hover(e, t, n) {
		if (n !== "mouse") return;
		let r = k.getState(), i = this.pickAt(e, t), a;
		a = this.mode === "browse" || this.tool === "move" ? i ? "grab" : "default" : i && i.id === r.selectedId ? "grab" : "draw", this.surface.dataset.cursor = a;
	}
	onWheel = (e) => {
		let t = this.engine;
		if (this.mode !== "edit" || !t) return;
		if (this.gesture) {
			e.preventDefault();
			return;
		}
		let n = k.getState(), { x: r, y: i } = this.local(e), a = this.wheelTarget;
		a === null && (a = this.pickAt(r, i)?.id ?? null, this.wheelTarget = a ?? "sky"), window.clearTimeout(this.wheelTimer), this.wheelTimer = window.setTimeout(() => {
			this.wheelTimer = 0, this.wheelTarget = null, k.getState().end();
		}, 350), e.preventDefault();
		let o = $(a);
		if (!o) return;
		n.select(o.id), n.begin();
		let s = t.camera.position, c = u(Kt(s, o) * Math.exp(e.deltaY * .0016), 3, 42);
		n.updateCloud(o.id, { position: this.liftAboveGround(qt(s, o.position, c), o) });
	};
	endWheel() {
		this.wheelTimer && (window.clearTimeout(this.wheelTimer), this.wheelTimer = 0, this.wheelTarget = null, k.getState().end());
	}
	addCloudFromKeyboard() {
		let e = this.engine;
		if (!e) return !1;
		let t = k.getState(), n = Math.random, r = (n() < .5 ? -1 : 1) * (.45 + n() * .4), i = .05 + n() * .55, a = .18 + n() * .16, o = Array.from({ length: 48 }, (e, t) => {
			let n = t / 47 * Math.PI * 2;
			return {
				x: r + Math.cos(n) * a * .5,
				y: i + Math.sin(n) * a * .35
			};
		}), s = Vt(e.camera, o, Pe());
		if (!s.ok) return !1;
		let c = Math.max(0, ...t.scene.clouds.map((e) => e.order)) + 1, l = pn(), u = t.addCloud({
			...s.cloud,
			id: l,
			order: c
		}, performance.now());
		return u && t.select(l), u;
	}
	nudgeSelected(e, t) {
		let r = this.engine, i = k.getState(), a = $(i.selectedId);
		if (!r || !a) return !1;
		let o = r.camera, s = Kt(o.position, a) * .03, c = [
			o.right[0] * e * s + o.up[0] * t * s,
			o.right[1] * e * s + o.up[1] * t * s,
			o.right[2] * e * s + o.up[2] * t * s
		];
		return i.updateCloud(a.id, { position: this.liftAboveGround(n(a.position, c), a) }), !0;
	}
	scaleSelected(e) {
		let t = k.getState(), n = $(t.selectedId);
		if (!n) return !1;
		let r = u(n.scale * e, E, D);
		return t.updateCloud(n.id, {
			scale: r,
			position: this.liftAboveGround(n.position, {
				...n,
				scale: r
			})
		}), !0;
	}
	cycleSelection(e) {
		let t = k.getState(), n = [...t.scene.clouds].sort((e, t) => e.position[0] - t.position[0]);
		if (!n.length) return null;
		let r = n[(n.findIndex((e) => e.id === t.selectedId) + e + n.length) % n.length] ?? n[0];
		return t.select(r.id), r;
	}
}, fn = 0;
function pn() {
	return fn++, `c-${Date.now().toString(36)}-${fn}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}
// sky/src/storage.ts
var mn = 400;
function hn(e) {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
}
function gn() {
	let e = hn(Pt);
	if (!e) return {
		scene: X(),
		restored: !1,
		message: null
	};
	let t = ne(e);
	return t.ok ? {
		scene: t.scene,
		restored: !0,
		message: t.dropped ? "Some saved clouds were damaged and skipped." : null
	} : {
		scene: X(),
		restored: !1,
		message: "Your saved sky could not be read, so the original is back."
	};
}
function _n(e) {
	let t = 0, n = !1, r = () => {
		let t = k.getState().scene;
		try {
			en(t) ? (localStorage.removeItem(Pt), localStorage.removeItem(Ft)) : localStorage.setItem(Pt, re(t)), n && e("ok"), n = !1;
		} catch {
			n || e("memory", "This browser isn’t saving the sky, so your clouds will last until you close the tab."), n = !0;
		}
	}, i = !1, a = () => {
		i && (window.clearTimeout(t), i = !1, r());
	}, o = k.subscribe((e, n) => {
		!e.txn && (e.scene !== n.scene || n.txn) && (window.clearTimeout(t), i = !0, t = window.setTimeout(() => {
			i = !1, r();
		}, mn));
	}), s = () => {
		document.visibilityState === "hidden" && a();
	};
	return window.addEventListener("pagehide", a), document.addEventListener("visibilitychange", s), () => {
		window.clearTimeout(t), window.removeEventListener("pagehide", a), document.removeEventListener("visibilitychange", s), o();
	};
}
function vn(e) {
	let t = (t) => {
		if (t.key !== "mariashowalter.com/sky/scene/v1" || e()) return;
		let n = t.newValue ? ne(t.newValue) : null, r = n && n.ok ? n.scene : X();
		k.getState().replaceScene(r);
	};
	return window.addEventListener("storage", t), () => window.removeEventListener("storage", t);
}
function yn(e) {
	try {
		e ? localStorage.setItem(Ft, e) : localStorage.removeItem(Ft);
	} catch {}
}
// sky/src/controller.ts
var bn = 1200, xn = () => (window.devicePixelRatio || 1) >= 1.5 ? "reduced" : "balanced", Sn = 6, Cn = class {
	events;
	engine = null;
	interaction;
	canvas;
	root;
	state = "loading";
	editing = !1;
	intensity = 0;
	cleanups = [];
	stillTimer = 0;
	framesSeen = 0;
	constructor(e, t) {
		this.events = t, this.root = e, this.canvas = e.querySelector("canvas.sky-canvas"), this.interaction = new dn(e.querySelector(".sky-surface"), { announce: (e) => t.announce(e) });
	}
	mount() {
		let { scene: e, message: t } = gn(), n = k.getState();
		n.replaceScene(e), n.setView(jt), n.setQuality(xn()), t && this.events.announce(t), this.cleanups.push(_n((e, t) => {
			e === "memory" && t && this.events.announce(t), this.root.dataset.storage = e;
		}), vn(() => this.editing), k.subscribe((e, t) => {
			!e.txn && (e.scene !== t.scene || t.txn) && this.scheduleStill();
		}));
		let r = (e) => {
			e.preventDefault(), this.engine?.stop(), this.setState("lost", "The graphics context was lost; the sky will come back when the browser restores it.");
		}, i = () => this.startEngine(), a = () => this.updateRunState();
		return this.canvas.addEventListener("webglcontextlost", r), this.canvas.addEventListener("webglcontextrestored", i), document.addEventListener("visibilitychange", a), this.cleanups.push(() => {
			this.canvas.removeEventListener("webglcontextlost", r), this.canvas.removeEventListener("webglcontextrestored", i), document.removeEventListener("visibilitychange", a);
		}), this.startEngine(), this.state;
	}
	startEngine() {
		if (this.engine) {
			try {
				this.engine.dispose();
			} catch {}
			this.engine = null;
		}
		try {
			this.engine = new At(this.canvas);
		} catch (e) {
			this.interaction.attach(null);
			let t = e instanceof Error ? e.message : "WebGL 2 is not available.";
			this.setState("unsupported", t);
			return;
		}
		this.engine.snapView(), this.framesSeen = 0, this.interaction.attach(this.engine), this.engine.onFrame(() => {
			++this.framesSeen === Sn && (this.root.dataset.reveal = "true");
		}), this.setState("live"), this.updateRunState();
	}
	setState(e, t) {
		this.state = e, this.root.dataset.state = e, this.events.onState(e, t);
	}
	get current() {
		return this.state;
	}
	get isEditing() {
		return this.editing;
	}
	get canEdit() {
		return !!this.engine && (this.state === "live" || this.state === "paused");
	}
	setVisualIntensity(e) {
		this.intensity = Math.min(1, Math.max(0, e)), this.updateRunState();
	}
	setInteractionMode(e) {
		this.editing = e === "edit", k.getState().setQuality(this.editing ? "auto" : xn()), this.interaction.setMode(e), this.updateRunState();
	}
	updateRunState() {
		let e = this.engine;
		e && this.state !== "unsupported" && this.state !== "lost" && (!document.hidden && (this.editing || this.intensity < .999) ? (e.start(), this.state !== "live" && this.setState("live")) : (e.stop(), this.state !== "paused" && this.setState("paused")));
	}
	pause() {
		this.engine?.stop();
	}
	resume() {
		this.updateRunState();
	}
	resetCloudScene() {
		let e = k.getState(), t = X();
		e.apply(() => t), e.select(null);
	}
	undo() {
		k.getState().undo();
	}
	redo() {
		k.getState().redo();
	}
	exportScene() {
		return k.getState().scene;
	}
	scheduleStill() {
		window.clearTimeout(this.stillTimer), this.stillTimer = window.setTimeout(() => this.captureStill(), bn);
	}
	captureStill() {
		let e = this.engine;
		if (e && this.canEdit) {
			if (en(k.getState().scene)) yn(null);
			else try {
				let t = e.capture(640, 400, 10), n = document.createElement("canvas");
				n.width = 640, n.height = 400, n.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(t), 640, 400), 0, 0), yn(n.toDataURL("image/jpeg", .8));
			} catch {}
		}
	}
	dispose() {
		window.clearTimeout(this.stillTimer);
		for (let e of this.cleanups.splice(0)) e();
		this.interaction.dispose(), this.engine?.dispose(), this.engine = null;
	}
}, wn = ye.map((e) => ({
	id: e.id,
	label: e.short,
	full: e.label,
	hour: e.hour
})), Tn = class {
	sky;
	opts;
	el;
	trigger = null;
	scrollY = 0;
	unsub = null;
	constructor(e, t) {
		this.sky = e, this.opts = t, this.el = document.createElement("div"), this.el.className = "sky-editor", this.el.setAttribute("role", "region"), this.el.setAttribute("aria-label", "Sky editor"), this.el.hidden = !0, this.el.innerHTML = `
<p class="sky-hint" id="sky-hint">Draw a line in the sky to make a cloud. Drag a cloud to move it; pull a corner to resize.<span class="sky-keys"> Keys: [ ] pick a cloud · arrows move · + − size · Delete · Esc done</span></p>
<div class="sky-bar" role="toolbar" aria-label="Sky tools" aria-describedby="sky-hint">
  <div class="sky-group" role="group" aria-label="Tool">
    <button type="button" data-tool="draw" aria-pressed="true">Draw</button>
    <button type="button" data-tool="move" aria-pressed="false">Move</button>
  </div>
  <div class="sky-group" role="group" aria-label="Light">
    ${wn.map((e) => `<button type="button" data-hour="${e.hour}" aria-pressed="false" title="${e.full}">${e.label}</button>`).join("")}
  </div>
  <div class="sky-group" role="group" aria-label="Edit">
    <button type="button" data-act="add">Add cloud</button>
    <button type="button" data-act="delete" disabled>Delete</button>
    <button type="button" data-act="undo" disabled>Undo</button>
    <button type="button" data-act="redo" disabled>Redo</button>
    <button type="button" data-act="reset">Reset sky</button>
  </div>
  <button type="button" class="sky-done" data-act="done">Done</button>
</div>`, document.body.appendChild(this.el), this.el.addEventListener("click", this.onClick);
	}
	get open() {
		return !this.el.hidden;
	}
	enter(e) {
		!this.open && this.sky.canEdit && (this.trigger = e, this.scrollY = window.scrollY, document.documentElement.classList.add("sky-editing"), this.opts.sheet.inert = !0, this.el.hidden = !1, this.sky.setInteractionMode("edit"), this.setTool("draw"), this.sync(), this.unsub = k.subscribe(() => this.sync()), document.addEventListener("keydown", this.onKey), this.el.querySelector("[data-tool=\"draw\"]").focus({ preventScroll: !0 }), this.opts.announce("Editing the sky. Draw to make clouds; press Escape or Done to return to the page."));
	}
	exit() {
		this.open && (document.removeEventListener("keydown", this.onKey), this.unsub?.(), this.unsub = null, this.sky.setInteractionMode("browse"), this.el.hidden = !0, this.opts.sheet.inert = !1, document.documentElement.classList.remove("sky-editing"), window.scrollTo({
			top: this.scrollY,
			behavior: "instant"
		}), this.trigger?.focus({ preventScroll: !0 }), this.sky.captureStill(), this.opts.announce("Back to the page. Your sky is saved."));
	}
	setTool(e) {
		this.sky.interaction.setTool(e), this.el.querySelectorAll("[data-tool]").forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.tool === e)));
	}
	sync() {
		let e = k.getState(), t = (e) => this.el.querySelector(e);
		t("[data-act=\"undo\"]").disabled = e.past.length === 0, t("[data-act=\"redo\"]").disabled = e.future.length === 0, t("[data-act=\"delete\"]").disabled = !e.selectedId;
		let n = e.scene.hour;
		this.el.querySelectorAll("[data-hour]").forEach((e) => e.setAttribute("aria-pressed", String(Math.abs(Number(e.dataset.hour) - n) < .01)));
	}
	onClick = (e) => {
		let t = e.target.closest("button");
		if (!t || t.disabled) return;
		let n = k.getState();
		if (t.dataset.tool) this.setTool(t.dataset.tool);
		else if (t.dataset.hour) {
			let e = wn.find((e) => String(e.hour) === t.dataset.hour);
			n.setHour(Number(t.dataset.hour)), this.opts.announce(`${e?.full ?? "Light"}.`);
		} else switch (t.dataset.act) {
			case "add":
				this.opts.announce(this.sky.interaction.addCloudFromKeyboard() ? "Cloud added and selected. Arrow keys move it." : "The sky is full — delete a cloud first.");
				break;
			case "delete":
				this.deleteSelected();
				break;
			case "undo":
				this.sky.undo(), this.opts.announce("Undone.");
				break;
			case "redo":
				this.sky.redo(), this.opts.announce("Redone.");
				break;
			case "reset":
				this.sky.resetCloudScene(), this.opts.announce("Original sky restored. Undo brings yours back.");
				break;
			case "done": this.exit();
		}
	};
	deleteSelected() {
		let e = k.getState();
		e.selectedId && (e.deleteCloud(e.selectedId), this.opts.announce("Cloud deleted."));
	}
	onKey = (e) => {
		let t = k.getState(), n = e.metaKey || e.ctrlKey, r = e.key;
		if (r === "Escape") {
			e.preventDefault(), this.exit();
			return;
		}
		if (n && r.toLowerCase() === "z") {
			e.preventDefault(), e.shiftKey ? this.sky.redo() : this.sky.undo();
			return;
		}
		if (n && r.toLowerCase() === "y") {
			e.preventDefault(), this.sky.redo();
			return;
		}
		if (n || e.altKey) return;
		let i = this.sky.interaction;
		if (r === "b" || r === "B") return this.setTool("draw");
		if (r === "v" || r === "V") return this.setTool("move");
		if (r === "[" || r === "]") {
			let e = i.cycleSelection(r === "]" ? 1 : -1);
			e && this.opts.announce(`Cloud ${t.scene.clouds.indexOf(e) + 1} of ${t.scene.clouds.length} selected.`);
			return;
		}
		if ((r === "Delete" || r === "Backspace") && t.selectedId) {
			e.preventDefault(), this.deleteSelected();
			return;
		}
		if (!t.selectedId) return;
		let a = {
			ArrowLeft: [-1, 0],
			ArrowRight: [1, 0],
			ArrowUp: [0, 1],
			ArrowDown: [0, -1]
		};
		a[r] ? (e.preventDefault(), t.begin(), i.nudgeSelected(...a[r]), t.end()) : (r === "+" || r === "=" || r === "-" || r === "_") && (e.preventDefault(), t.begin(), i.scaleSelected(r === "-" || r === "_" ? 1 / 1.1 : 1.1), t.end());
	};
};
// sky/src/main.ts
function En() {
	let e = document.getElementById("sky-status");
	return e || (e = document.createElement("p"), e.id = "sky-status", e.className = "vh", e.setAttribute("role", "status"), e.setAttribute("aria-live", "polite"), document.body.appendChild(e)), e;
}
var Dn = "Sky editing needs WebGL 2";
function On() {
	let e = document.querySelector("[data-sky-live]"), t = document.querySelector(".sheet");
	if (!e || !t) return;
	let n = En(), r = "", i = (e) => {
		n.textContent = e === r ? `${e} ` : e, r = n.textContent;
	}, a = Array.from(document.querySelectorAll("[data-sky-edit]")), o = new Cn(e, {
		onState: (e, t) => {
			document.documentElement.dataset.sky = e;
			let n = e === "unsupported" || e === "lost";
			document.documentElement.classList.toggle("sky-unavailable", n);
			for (let e of a) {
				e.disabled = n;
				let r = e.querySelector("[data-sky-label]");
				r && (r.textContent = n ? Dn : "Edit sky"), n && t ? e.title = t : e.removeAttribute("title");
			}
			e === "lost" && s?.open && s.exit();
		},
		announce: i
	}), s = null;
	s = new Tn(o, {
		sheet: t,
		announce: i
	});
	for (let e of a) e.addEventListener("click", () => s.enter(e));
	let c = (e) => o.setVisualIntensity(e);
	c(window.__skyProgress ?? 0), window.addEventListener("sky:progress", (e) => c(e.detail)), o.mount(), window.__portfolioSky = {
		sky: o,
		editor: s,
		store: k,
		defaultScene: X
	}, window.addEventListener("pagehide", () => o.pause()), window.addEventListener("pageshow", (e) => {
		e.persisted && o.resume();
	});
}
var kn = () => {
	let e = window.requestIdleCallback;
	e ? e(On, { timeout: 500 }) : window.setTimeout(On, 1);
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", kn) : kn();
