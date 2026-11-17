// src/embed.ts
function e() {
	let e = innerWidth * innerHeight;
	return matchMedia("(pointer: coarse)").matches || e < 6e5 ? .45 : e < 12e5 ? .75 : 1;
}
async function t(e, t) {
	let n = {
		quality: t,
		floraMinX: -1.3
	};
	try {
		let t = new Worker(new URL(
			/* @vite-ignore */
			new URL("assets/build.worker-w1dVjGnM.js", import.meta.url).href,
			"" + import.meta.url
		), { type: "module" }), r = await new Promise((r, i) => {
			t.onmessage = (e) => r(e.data), t.onerror = (e) => i(Error(e.message || "worker failed")), t.postMessage({
				id: e,
				opts: n
			});
		});
		if (t.terminate(), !r.ok || !r.world) throw Error(r.error ?? "world build failed");
		return r.world;
	} catch {
		let [{ buildWorld: t }, { WORLDS: r }] = await Promise.all([import("./worldBuild-D9GUfLji.js"), import("./scenes-Csh5zrJE.js")]);
		return t(r[e], n);
	}
}
async function n(n) {
	let r = n.scene ?? "living-knot", i = n.reducedMotion ?? matchMedia("(prefers-reduced-motion: reduce)").matches, a;
	try {
		a = !!document.createElement("canvas").getContext("webgl2");
	} catch {
		a = !1;
	}
	if (!a) return n.onFail?.(/* @__PURE__ */ Error("WebGL2 unavailable")), null;
	let o;
	try {
		let [a, { WorldApp: s }, { WORLDS: c }] = await Promise.all([
			t(r, n.quality ?? e()),
			import("./WorldApp-BwihENp7.js"),
			import("./scenes-Csh5zrJE.js")
		]);
		o = new s({
			canvas: n.canvas,
			scene: c[r],
			world: a,
			panel: n.panel,
			reducedMotion: i,
			manual: !1,
			maxDpr: n.maxDpr ?? 1.5
		});
	} catch (e) {
		return n.onFail?.(e), null;
	}
	let s = [], c = (e, t, n, r) => {
		e.addEventListener(t, n, r), s.push(() => e.removeEventListener(t, n, r));
	}, l = !1;
	if (c(window, "resize", () => {
		l || (l = !0, requestAnimationFrame(() => {
			l = !1, o.resize();
		}));
	}), n.panel) {
		let e = new ResizeObserver(() => o.measurePanel());
		e.observe(n.panel), s.push(() => e.disconnect());
	}
	document.fonts?.ready.then(() => o.measurePanel());
	let u = !0, d = () => {
		u && !document.hidden ? o.start() : o.stop();
	}, f = new IntersectionObserver((e) => {
		u = e.some((e) => e.isIntersecting), d();
	}, { threshold: 0 });
	f.observe(n.canvas), s.push(() => f.disconnect()), c(document, "visibilitychange", d);
	let p = 0;
	return c(n.canvas, "webglcontextlost", () => {
		p = window.setTimeout(() => {
			o.stop(), n.onFail?.(/* @__PURE__ */ Error("WebGL context lost"));
		}, 2500);
	}), c(n.canvas, "webglcontextrestored", () => {
		clearTimeout(p), d();
	}), o.renderer.debug.onShaderError = (e, t) => {
		console.error("Hero shader error", e.getProgramInfoLog(t)), o.stop(), n.onFail?.(/* @__PURE__ */ Error("shader error"));
	}, d(), o.onceAfterFrame(() => n.onReady?.()), window.__hero = o, {
		measure: () => o.measurePanel(),
		dispose: () => {
			for (let e of s) e();
			f.disconnect(), o.dispose();
		}
	};
}
export { n as mountHero };
