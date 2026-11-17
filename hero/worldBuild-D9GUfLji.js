import { b as e, d as t, f as n, i as r, kn as i, mt as a, n as o, r as s, t as c } from "./noise-BtPGSgcY.js";
// src/world/geometry/OrganicGeometry.ts
var l = new i(0, 1, 0);
function u(e, t, n) {
	let r = [], a = [], o = [];
	for (let n = 0; n <= t; n++) r.push(e.getPointAt(n / t)), a.push(e.getTangentAt(n / t).normalize());
	let s = Math.abs(a[0].y) < .9 ? l : new i(1, 0, 0);
	o.push(new i().crossVectors(a[0], s).normalize());
	for (let e = 1; e <= t; e++) {
		let t = new i().crossVectors(a[e - 1], a[e]), n = o[e - 1].clone();
		t.lengthSq() > 1e-12 && (t.normalize(), n.applyAxisAngle(t, Math.acos(Math.min(1, Math.max(-1, a[e - 1].dot(a[e])))))), o.push(n.normalize());
	}
	if (n) {
		let e = new i().crossVectors(a[0], o[0]), n = o[t], r = Math.atan2(n.dot(e), n.dot(o[0]));
		for (let e = 0; e <= t; e++) o[e].applyAxisAngle(a[e], -r * e / t).normalize();
	}
	return {
		pts: r,
		tans: a,
		nrms: o
	};
}
function d(e, t) {
	let { segs: n, closed: r } = e, a = u(t, n, r), o = new i(0, 1, .32).normalize(), s = [], c = 0;
	for (let e = 0; e <= n; e++) {
		let t = a.tans[e], n = a.nrms[e], r = new i().crossVectors(t, n), l = o.clone().addScaledVector(t, -o.dot(t));
		l.lengthSq() < .04 && l.set(0, 0, 1).addScaledVector(t, -t.z);
		let u = Math.atan2(l.dot(r), l.dot(n));
		for (; u - c > Math.PI;) u -= 2 * Math.PI;
		for (; u - c < -Math.PI;) u += 2 * Math.PI;
		s.push(u), c = u;
	}
	let l = Math.max(2, Math.round(n * .04)), d = r ? s[n] - s[0] : 0, f = s.slice();
	for (let e = 0; e < 3; e++) {
		let e = f.slice();
		for (let t = 0; t <= n; t++) {
			let i = 0, a = 0;
			for (let e = -l; e <= l; e++) {
				let o = t + e, s, c = 0;
				r ? (s = (o % n + n) % n, c = Math.floor(o / n) * d) : s = Math.min(n, Math.max(0, o)), i += f[s] + c, a++;
			}
			e[t] = i / a;
		}
		f = e;
	}
	let p = [], m = [];
	for (let t = 0; t <= n; t++) {
		let r = a.tans[t], o = a.nrms[t], s = new i().crossVectors(r, o), c = f[t] + e.twist(t / n), l = o.clone().multiplyScalar(Math.cos(c)).addScaledVector(s, Math.sin(c)).normalize();
		p.push(l), m.push(new i().crossVectors(l, r).normalize());
	}
	return {
		pts: a.pts,
		tans: a.tans,
		face: p,
		side: m
	};
}
function f(e, t, n = 0) {
	let r = t.y * .92 + t.z * .22, i = o(e.x * 2.3 + 4.4, e.z * 2.3 - e.y * 1.9) - .5, a = o(e.x * .95 + 21, e.z * .95 - e.y * .8) - .5, c = o(e.x * .52 + 9.3, e.z * .52 + e.y * .44);
	return s(-.18, .34, r + i * .4 + a * .55 + n) * s(.04, .3, c);
}
function p(e) {
	return .66 + .48 * o(e.x * 2.4 - 2.2, e.z * 2.4 + e.y * 2) + .18 * o(e.x * 7.3 + 5.1, e.z * 7.3 - e.y * 4.4) - .09;
}
function m(t) {
	let n = t.points.map((e) => new i(e[0], e[1], e[2])), r = new e(n, t.closed, "centripetal", .5);
	return {
		spec: t,
		curve: r,
		fr: d(t, r),
		len: r.getLength()
	};
}
var h = (e, t) => Math.sign(e) * Math.abs(e) ** +t, g = new i(), _ = new i(), v = new i(), y = new i();
function b(e, t) {
	let n = e.spec.segs, r = (e.spec.closed ? (t % 1 + 1) % 1 : c(t)) * n, i = Math.min(n - 1, Math.floor(r)), a = r - i;
	g.copy(e.fr.pts[i]).lerp(e.fr.pts[i + 1], a), _.copy(e.fr.tans[i]).lerp(e.fr.tans[i + 1], a).normalize(), v.copy(e.fr.face[i]).lerp(e.fr.face[i + 1], a), v.addScaledVector(_, -v.dot(_)).normalize(), y.crossVectors(v, _).normalize();
}
function x(e, t, n, r, i) {
	b(e, t);
	let a = e.spec.width(t), o = e.spec.thick(t), s = e.spec.squareness, c = Math.cos(n), l = Math.sin(n), u = h(c, s) * a, d = h(l, s) * o;
	r.copy(g).addScaledVector(y, u).addScaledVector(v, d);
	let f = 2 / s - 1, p = h(c, f * s) / a, m = h(l, f * s) / o;
	i.copy(y).multiplyScalar(p).addScaledVector(v, m).normalize();
}
function S(e, t, n, r) {
	let i = f(n, r, e.spec.coverBias ?? 0);
	if (e.spec.faceBand) {
		let e = o(n.x * 3.1 + 7.7, n.z * 3.1 - n.y * 2.3) - .5;
		i *= s(.12, .72, Math.sin(t) + e * .4);
	}
	return i;
}
function C(e, t, n, r, i) {
	x(e, t, n, r, i);
	let a = S(e, n, r, i);
	return r.addScaledVector(i, e.spec.moss(t) * a * p(r)), a;
}
function w(e) {
	let t = e.spec.segs, n = e.spec.radial, r = (t + 1) * (n + 1), a = new Float32Array(r * 3), o = new Float32Array(r * 3), s = new Float32Array(r), c = new Float32Array(r), l = new Float32Array(r * 2), u = new i(), d = new i(), f = Math.PI * 2, m = new Float32Array(r * 3), h = new Float32Array(r);
	for (let r = 0; r <= t; r++) for (let i = 0; i <= n; i++) {
		x(e, e.spec.closed && r === t ? 0 : r / t, i / n * f, u, d);
		let a = r * (n + 1) + i;
		m.set([
			u.x,
			u.y,
			u.z
		], a * 3), o.set([
			d.x,
			d.y,
			d.z
		], a * 3), h[a] = S(e, i / n * f, u, d);
	}
	let g = (n) => e.spec.closed ? (n % t + t) % t : Math.min(t, Math.max(0, n)), _ = (e) => (e % n + n) % n, v = h;
	for (let e = 0; e < 2; e++) {
		let e = new Float32Array(r);
		for (let r = 0; r <= t; r++) for (let t = 0; t <= n; t++) {
			let i = 0, a = 0;
			for (let e = -2; e <= 2; e++) for (let o = -2; o <= 2; o++) {
				let s = 1 / (1 + e * e + o * o);
				i += v[g(r + e) * (n + 1) + _(t + o)] * s, a += s;
			}
			e[r * (n + 1) + t] = i / a;
		}
		v = e;
	}
	for (let r = 0; r <= t; r++) for (let i = 0; i <= n; i++) {
		let f = e.spec.closed && r === t ? 0 : r / t, h = r * (n + 1) + i;
		u.set(m[h * 3], m[h * 3 + 1], m[h * 3 + 2]), d.set(o[h * 3], o[h * 3 + 1], o[h * 3 + 2]);
		let g = v[h], _ = e.spec.moss(f) * g * g * p(u);
		u.addScaledVector(d, _), a.set([
			u.x,
			u.y,
			u.z
		], h * 3), s[h] = g, c[h] = _, l[h * 2] = 1 - Math.abs(i / n * 2 - 1), l[h * 2 + 1] = r / t * e.len;
	}
	let y = new Float32Array(r * 3), b = (r, i) => (r = e.spec.closed ? (r % t + t) % t : Math.min(t, Math.max(0, r)), i = (i % n + n) % n, (r * (n + 1) + i) * 3);
	for (let e = 0; e <= t; e++) for (let t = 0; t <= n; t++) {
		let r = b(e + 1, t), i = b(e - 1, t), s = b(e, t + 1), c = b(e, t - 1), l = a[r] - a[i], u = a[r + 1] - a[i + 1], d = a[r + 2] - a[i + 2], f = a[s] - a[c], p = a[s + 1] - a[c + 1], m = a[s + 2] - a[c + 2], h = p * d - m * u, g = m * l - f * d, _ = f * u - p * l, v = Math.hypot(h, g, _), x = (e * (n + 1) + t) * 3;
		v < 1e-12 ? (h = o[x], g = o[x + 1], _ = o[x + 2]) : (h /= v, g /= v, _ /= v), h * o[x] + g * o[x + 1] + _ * o[x + 2] < 0 && (h = -h, g = -g, _ = -_), y[x] = h, y[x + 1] = g, y[x + 2] = _;
	}
	return {
		spec: e.spec,
		S: t,
		R: n,
		pos: a,
		nrm: y,
		cap: s,
		rawNrm: o,
		swell: c,
		uv: l,
		len: e.len
	};
}
function T(e) {
	let { S: t, R: n } = e, r = new Uint32Array(t * n * 6), i = 0;
	for (let a = 0; a < t; a++) for (let t = 0; t < n; t++) {
		let o = a * (n + 1) + t, s = o + n + 1, c = o * 3, l = s * 3, u = (o + 1) * 3, d = e.pos[l] - e.pos[c], f = e.pos[l + 1] - e.pos[c + 1], p = e.pos[l + 2] - e.pos[c + 2], m = e.pos[u] - e.pos[c], h = e.pos[u + 1] - e.pos[c + 1], g = e.pos[u + 2] - e.pos[c + 2], _ = f * g - p * h, v = p * m - d * g, y = d * h - f * m;
		_ * e.nrm[c] + v * e.nrm[c + 1] + y * e.nrm[c + 2] > 0 ? (r[i++] = o, r[i++] = s, r[i++] = o + 1, r[i++] = s, r[i++] = s + 1, r[i++] = o + 1) : (r[i++] = o, r[i++] = o + 1, r[i++] = s, r[i++] = s, r[i++] = o + 1, r[i++] = s + 1);
	}
	return r;
}
function E(e, t) {
	let n = [], r = Math.max(4, Math.round(e.len / t));
	for (let t = 0; t <= r && !(e.spec.closed && t === r); t++) {
		let i = t / r;
		b(e, i);
		let a = e.spec.width(i), o = e.spec.thick(i), s = Math.max(1, Math.round(a / o));
		for (let e = 0; e < s; e++) {
			let t = (s === 1 ? 0 : e / (s - 1) * 2 - 1) * (a - o * .9);
			n.push([
				g.x + y.x * t,
				g.y + y.y * t,
				g.z + y.z * t,
				o * .95
			]);
		}
	}
	return n;
}
function D(e, t = 52, n = 9) {
	let { S: r, R: i, pos: a } = e, o = Math.max(2, Math.round(r / t)), s = Math.max(2, Math.round(i / n)), c = [];
	for (let e = 0; e <= r; e += o) for (let t = 0; t < i; t++) {
		let n = (e * (i + 1) + t) * 3, r = n + 3;
		c.push(a[n], a[n + 1], a[n + 2], a[r], a[r + 1], a[r + 2]);
	}
	for (let e = 0; e < i; e += s) for (let t = 0; t < r; t++) {
		let n = (t * (i + 1) + e) * 3, r = ((t + 1) * (i + 1) + e) * 3;
		c.push(a[n], a[n + 1], a[n + 2], a[r], a[r + 1], a[r + 2]);
	}
	return new Float32Array(c);
}
// src/world/worldBuild.ts
var O = Math.PI * 2;
function k(e, r) {
	let i = (e.S + 1) * (e.R + 1), a = new Float32Array(i * 4);
	for (let o = 0; o < i; o++) {
		let i = e.pos[o * 3], s = e.pos[o * 3 + 1], c = e.pos[o * 3 + 2], l = e.nrm[o * 3], u = e.nrm[o * 3 + 1], d = e.nrm[o * 3 + 2];
		a[o * 4] = e.cap[o], a[o * 4 + 1] = t(i, s, c, l, u, d, r), a[o * 4 + 2] = n(i + l * .03, s + u * .03, c + d * .03, r);
	}
	return a;
}
function A(e, t, n, r, i, a) {
	let o = Math.min(e.S - 1, Math.max(0, Math.floor(r))), s = Math.min(e.R - 1, Math.max(0, Math.floor(i))), c = Math.min(1, Math.max(0, r - o)), l = Math.min(1, Math.max(0, i - s)), u = o * (e.R + 1) + s, d = u + e.R + 1, f = u + 1, p = d + 1, m = (1 - c) * (1 - l), h = c * (1 - l), g = (1 - c) * l, _ = c * l;
	for (let e = 0; e < n; e++) a[e] = t[u * n + e] * m + t[d * n + e] * h + t[f * n + e] * g + t[p * n + e] * _;
}
function j(e, t, n, r, i) {
	let { S: a, R: s } = t, c = a * s, l = new Float64Array(c), u = 0;
	for (let e = 0; e < a; e++) for (let n = 0; n < s; n++) {
		let r = (e * (s + 1) + n) * 3, i = r + (s + 1) * 3, a = r + 3, o = t.pos[i] - t.pos[r], c = t.pos[i + 1] - t.pos[r + 1], d = t.pos[i + 2] - t.pos[r + 2], f = t.pos[a] - t.pos[r], p = t.pos[a + 1] - t.pos[r + 1], m = t.pos[a + 2] - t.pos[r + 2], h = Math.hypot(c * m - d * p, d * f - o * m, o * p - c * f), g = e * (s + 1) + n, _ = .25 * (t.cap[g] + t.cap[g + 1] + t.cap[g + s + 1] + t.cap[g + s + 2]);
		u += h * _ * _, l[e * s + n] = u;
	}
	let d = new Float32Array(r * 3), f = new Float32Array(r * 3), p = new Float32Array(r * 4), m = new Float32Array(r * 4), h = new Float32Array(r * 2), g = [
		0,
		0,
		0,
		0
	], _ = 0;
	for (let v = 0; v < r && u > 0; v++) {
		let r = i() * u, v = 0, y = c - 1;
		for (; v < y;) {
			let e = v + y >> 1;
			l[e] < r ? v = e + 1 : y = e;
		}
		let b = v / s | 0, x = v - b * s, S = i(), C = i();
		A(t, t.cap, 1, b + S, x + C, g);
		let w = g[0];
		if (w < .32) continue;
		A(t, t.pos, 3, b + S, x + C, g);
		let T = g[0], E = g[1], D = g[2];
		A(t, t.nrm, 3, b + S, x + C, g);
		let k = Math.hypot(g[0], g[1], g[2]) || 1, j = _ * 3, M = _ * 4;
		d[j] = T, d[j + 1] = E, d[j + 2] = D, f[j] = g[0] / k, f[j + 1] = g[1] / k, f[j + 2] = g[2] / k;
		let N = i() < .06 ? 1.4 + .5 * i() : 1;
		p[M] = i() * O, p[M + 1] = e.spec.blade((b + S) / a) * (.45 + .6 * w) * (.58 + .5 * i()) * N, p[M + 2] = (i() - .5) * 1.15, p[M + 3] = i(), A(t, n, 4, b + S, x + C, g), m[M] = o(T * .85 + 17, D * .85 - E * .7) * .62 + o(T * 5.6 - 3.3, D * 5.6 + E * 2.1) * .38, m[M + 1] = g[1], m[M + 2] = g[2], m[M + 3] = w, h[_ * 2] = (x + C) / s, h[_ * 2 + 1] = (b + S) / a, _++;
	}
	return {
		count: _,
		off: d.subarray(0, _ * 3),
		nrm: f.subarray(0, _ * 3),
		rnd: p.subarray(0, _ * 4),
		aux: m.subarray(0, _ * 4),
		fuv: h.subarray(0, _ * 2)
	};
}
function M(e, t, n) {
	let r = 0;
	for (let t = 0; t <= 8; t++) {
		let n = t / 8, i = e.spec.width(n), a = e.spec.thick(n);
		r += O * Math.sqrt((i * i + a * a) / 2) / 9;
	}
	let i = Math.max(16, Math.round(r / n)), a = Math.max(16, Math.round(e.len / n)), o = new Float32Array(i * a * 3), s = new Float32Array(i * a * 3), c = [
		0,
		0,
		0
	];
	for (let e = 0; e < a; e++) for (let n = 0; n < i; n++) {
		let r = (e + .5) / a * t.S, l = (n + .5) / i * t.R, u = (e * i + n) * 3;
		A(t, t.pos, 3, r, l, c), o[u] = c[0], o[u + 1] = c[1], o[u + 2] = c[2], A(t, t.nrm, 3, r, l, c);
		let d = Math.hypot(c[0], c[1], c[2]) || 1;
		s[u] = c[0] / d, s[u + 1] = c[1] / d, s[u + 2] = c[2] / d;
	}
	return {
		W: i,
		H: a,
		pos: o,
		nrm: s
	};
}
function N(e, t) {
	let n = Math.floor(e.S / t), r = Math.floor(e.R / t), i = new Float32Array((n + 1) * (r + 1) * 3), a = new Float32Array((n + 1) * (r + 1) * 3);
	for (let o = 0; o <= n; o++) for (let n = 0; n <= r; n++) {
		let s = (Math.min(o * t, e.S) * (e.R + 1) + Math.min(n * t, e.R)) * 3, c = (o * (r + 1) + n) * 3;
		for (let t = 0; t < 3; t++) i[c + t] = e.pos[s + t] + e.nrm[s + t] * .025, a[c + t] = e.nrm[s + t];
	}
	let o = new Uint32Array(n * r * 6), s = 0;
	for (let e = 0; e < n; e++) for (let t = 0; t < r; t++) {
		let n = e * (r + 1) + t, i = n + r + 1;
		o[s++] = n, o[s++] = i, o[s++] = n + 1, o[s++] = i, o[s++] = i + 1, o[s++] = n + 1;
	}
	return {
		pos: i,
		nrm: a,
		index: o
	};
}
function P(e, n) {
	let o = performance.now(), s = r(), c = e.limbs.map((e) => m(e)), l = c.map((e) => w(e)), u = c.flatMap((e) => E(e, .32)), d = new Float32Array(u.flat()), f = c.reduce((e, t) => e + t.len, 0), p = [], h = [
		Infinity,
		Infinity,
		Infinity
	], g = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	c.forEach((t, r) => {
		let i = l[r], a = k(i, d), o = j(t, i, a, Math.round(e.blades * n.quality * (t.len / f)), s), c = M(t, i, .05), u = N(i, 4);
		for (let e = 0; e < i.pos.length; e += 3) for (let t = 0; t < 3; t++) h[t] = Math.min(h[t], i.pos[e + t]), g[t] = Math.max(g[t], i.pos[e + t]);
		p.push({
			name: t.spec.name,
			closed: t.spec.closed,
			S: i.S,
			R: i.R,
			pos: i.pos,
			nrm: i.nrm,
			rawNrm: i.rawNrm,
			swell: i.swell,
			shade: a,
			uv: i.uv,
			index: T(i),
			wire: D(i, Math.round(t.len * 4.2), 10),
			proxyPos: u.pos,
			proxyNrm: u.nrm,
			proxyIndex: u.index,
			fieldW: c.W,
			fieldH: c.H,
			fieldPos: c.pos,
			fieldNrm: c.nrm,
			blades: o.count,
			bOffset: o.off,
			bNrm: o.nrm,
			bRnd: o.rnd,
			bAux: o.aux,
			bFuv: o.fuv
		});
	});
	let _ = new i(), v = new i(), y = new i(0, 1, 0), b = new a(), x = new i(), S = (e, t) => e + (t - e) * s(), A = [], P = [], F = [], I = Math.round(e.ferns * Math.min(1, n.quality + .2));
	for (let e = 0, r = 0; e < I && r < I * 80; r++) {
		let r = c[Math.floor(s() * c.length)];
		C(r, s(), s() * O, _, v) < .6 || v.y < .3 || _.x < n.floraMinX || t(_.x, _.y, _.z, v.x, v.y, v.z, d) > .93 && s() < .7 || (x.copy(v).addScaledVector(y, .18).addScaledVector(new i(S(-.62, .62), S(-.2, .05), S(.15, .75)), 1).normalize(), b.setFromUnitVectors(y, x).multiply(new a().setFromAxisAngle(y, s() * O)), A.push(_.x, _.y, _.z), P.push(b.x, b.y, b.z, b.w), F.push(S(.18, .38), s()), e++);
	}
	let L = [], R = [], z = [], B = Math.round(e.flowers * Math.min(1, n.quality + .2));
	for (let e = 0, r = 0; e < B && r < B * 80; r++) {
		let r = c[Math.floor(s() * c.length)], o = s(), l = s() * O;
		if (C(r, o, l, _, v) < .6 || v.y < .2 || _.x < n.floraMinX || t(_.x, _.y, _.z, v.x, v.y, v.z, d) > .95 && s() < .6) continue;
		let u = 6 + Math.floor(s() * 10);
		for (let t = 0; t < u && e < B; t++) C(r, Math.min(1, Math.max(0, o + S(-.006, .006))), l + S(-.2, .2), _, v) < .5 || (_.addScaledVector(v, S(.02, .09)), x.copy(v).addScaledVector(y, .35).addScaledVector(new i(S(-.3, .3), 0, S(-.3, .3)), 1).normalize(), b.setFromUnitVectors(new i(0, 0, 1), x).multiply(new a().setFromAxisAngle(new i(0, 0, 1), s() * O)), L.push(_.x, _.y, _.z), R.push(b.x, b.y, b.z, b.w), z.push(S(.045, .1), s()), e++);
	}
	let V = [];
	for (let t of e.perches) {
		let e = Infinity, n = new i(), r = new i();
		for (let i of c) for (let a = 0; a < 900; a++) {
			if (C(i, a % 60 / 60, Math.floor(a / 60) / 15 * O, _, v) < .5 || v.y < .4) continue;
			let o = Math.hypot(_.x - t[0], _.y - t[1], _.z - t[2]);
			o < e && (e = o, n = _.clone(), r = v.clone());
		}
		e < Infinity && V.push(n.x + r.x * .09, n.y + r.y * .09, n.z + r.z * .09, r.x, r.y, r.z);
	}
	return {
		id: e.id,
		limbs: p,
		spheres: d,
		ferns: {
			pos: new Float32Array(A),
			quat: new Float32Array(P),
			rnd: new Float32Array(F)
		},
		flowers: {
			pos: new Float32Array(L),
			quat: new Float32Array(R),
			rnd: new Float32Array(z)
		},
		perches: new Float32Array(V),
		bounds: {
			min: h,
			max: g
		},
		ms: performance.now() - o
	};
}
function F(e) {
	let t = [e.spheres.buffer, e.perches.buffer];
	for (let n of [e.ferns, e.flowers]) t.push(n.pos.buffer, n.quat.buffer, n.rnd.buffer);
	for (let n of e.limbs) for (let e of Object.values(n)) ArrayBuffer.isView(e) && t.push(e.buffer);
	return [...new Set(t)];
}
export { P as buildWorld, F as transferables };
