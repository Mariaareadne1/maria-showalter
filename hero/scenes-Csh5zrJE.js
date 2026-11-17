// src/world/scenes.ts
var e = Math.PI * 2, t = (e, t, n) => {
	let r = Math.min(1, Math.max(0, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, n = (e, t, n) => 1 + t * Math.sin(e * 23 + 1.3) + n * Math.sin(e * 57 + .4) + n * .5 * Math.sin(e * 103 + 2.2), r = {
	id: "living-ribbon",
	title: "Living Ribbon",
	limbs: [{
		name: "ribbon",
		points: [
			[
				-1.9,
				-3.7,
				3.1
			],
			[
				-.5,
				-2.75,
				2.35
			],
			[
				1,
				-2,
				1.55
			],
			[
				2.35,
				-1.2,
				.8
			],
			[
				3.2,
				-.15,
				.15
			],
			[
				3.45,
				.95,
				-.45
			],
			[
				2.95,
				1.85,
				-.95
			],
			[
				1.95,
				2.25,
				-1.3
			],
			[
				.85,
				2,
				-1.55
			],
			[
				.15,
				1.15,
				-1.85
			],
			[
				-.05,
				0,
				-2.2
			],
			[
				.35,
				-1.2,
				-2.75
			],
			[
				1.25,
				-2.4,
				-3.45
			],
			[
				2.3,
				-3.45,
				-4.15
			]
		],
		closed: !1,
		segs: 680,
		radial: 104,
		width: (e) => (1.25 - .22 * t(.25, .55, e) + .12 * Math.sin(e * 5.3 + .4)) * n(e, .02, .01),
		thick: (e) => (.3 + .05 * Math.sin(e * 7.1 + .5)) * n(e, .035, .016),
		twist: (e) => .5 * Math.sin(e * Math.PI * 1.3) * (1 - t(.35, .5, e)) - .55 * t(.4, .62, e) + 1.75 * t(.6, .9, e),
		moss: (e) => .11 + .03 * Math.sin(e * 9),
		blade: (e) => .0305 + .002 * Math.sin(e * 9),
		squareness: .62,
		coverBias: .1,
		faceBand: !0
	}],
	blades: 43e4,
	ferns: 34,
	flowers: 300,
	camera: {
		position: [
			.3,
			.05,
			8.9
		],
		target: [
			.6,
			-.1,
			0
		],
		fov: 36,
		orbit: [.05, .03],
		shiftX: .12,
		portrait: {
			pullBack: .9,
			lift: .18
		}
	},
	scanOrigin: [
		-.9,
		-2.3,
		2.3
	],
	floorY: null,
	perches: [
		[
			2.5,
			-1,
			1.4
		],
		[
			3,
			.3,
			.3
		],
		[
			.8,
			-1.6,
			1.9
		]
	],
	openings: [{
		centre: [
			1.65,
			.45,
			-.7
		],
		axis: [
			.15,
			-.05,
			1
		],
		radius: .95
	}],
	keepOutX: -.42
};
function i(t, n) {
	let r = [];
	for (let i = 0; i < t; i++) r.push(n(i / t * e));
	return r;
}
var a = (e, t, n, r) => {
	let [i, a, o] = e, s = a * Math.cos(t) - o * Math.sin(t), c = a * Math.sin(t) + o * Math.cos(t), l = i * Math.cos(n) + c * Math.sin(n), u = -i * Math.sin(n) + c * Math.cos(n);
	return [
		l + r[0],
		s + r[1],
		u + r[2]
	];
}, o = [
	1.05,
	-.05,
	-.6
], s = .38, c = -.32, l = {
	id: "living-knot",
	title: "Living Knot",
	limbs: [{
		name: "eight",
		points: i(26, (e) => a([
			(2.95 + .35 * Math.cos(e)) * Math.cos(e),
			1.55 * Math.sin(2 * e) * (1 + .16 * Math.cos(e)) + .1 * Math.sin(3 * e),
			.98 * Math.sin(e) + .1 * Math.cos(2 * e)
		], s, c, o)),
		closed: !0,
		segs: 760,
		radial: 64,
		width: (t) => (.56 + .12 * Math.sin(t * e + .7) + .06 * Math.sin(t * e * 3 + 1.2)) * n(t, .03, .012),
		thick: (t) => (.43 + .08 * Math.sin(t * e * 2 + .3)) * n(t, .035, .015),
		twist: (t) => .45 * Math.sin(t * e * 2 + .4),
		moss: () => .27,
		blade: () => .02885,
		squareness: .86,
		coverBias: .02
	}, {
		name: "band",
		points: i(18, (e) => {
			let t = 1.6 * Math.cos(e) + .1 * Math.cos(2 * e), n = 2.7 * Math.sin(e) + .15 * Math.sin(2 * e + .6);
			return a([
				t,
				-.5 * n * Math.cos(e) + .12 * Math.sin(e + .9) - .08,
				n
			], s, c, o);
		}),
		closed: !0,
		segs: 520,
		radial: 56,
		width: (t) => (.47 + .1 * Math.sin(t * e + 2.1)) * n(t, .03, .012),
		thick: (t) => (.34 + .05 * Math.sin(t * e * 2 + 1)) * n(t, .035, .015),
		twist: (t) => .3 * Math.sin(t * e + .6),
		moss: () => .24,
		blade: () => .0132 + .014,
		squareness: .9,
		coverBias: 0
	}],
	blades: 44e4,
	ferns: 30,
	flowers: 260,
	camera: {
		position: [
			.55,
			1,
			9.9
		],
		target: [
			.95,
			-.15,
			0
		],
		fov: 36,
		orbit: [.06, .035],
		shiftX: .17,
		portrait: {
			pullBack: 1.25,
			lift: .3
		}
	},
	scanOrigin: [
		-1.2,
		-1.6,
		2
	],
	floorY: -2.55,
	perches: [
		[
			2.6,
			1,
			-.2
		],
		[
			1.2,
			-.7,
			1.7
		],
		[
			-.2,
			1.05,
			.6
		]
	],
	openings: [{
		centre: a([
			1.5,
			0,
			0
		], s, c, o),
		axis: [
			.2,
			.35,
			1
		],
		radius: .6
	}, {
		centre: a([
			-1.5,
			0,
			0
		], s, c, o),
		axis: [
			.2,
			.35,
			1
		],
		radius: .55
	}],
	keepOutX: -.42
}, u = {
	"living-ribbon": r,
	"living-knot": l
};
export { l as LIVING_KNOT, r as LIVING_RIBBON, u as WORLDS };
