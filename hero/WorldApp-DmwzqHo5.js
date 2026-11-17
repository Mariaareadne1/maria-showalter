import { $ as e, $t as t, A as n, An as r, B as i, Bn as a, C as o, D as s, Dn as c, E as l, En as u, F as d, Fn as f, G as p, H as m, Hn as h, I as g, In as _, J as v, K as y, L as b, Ln as x, M as S, Mn as C, N as w, Nn as T, O as E, On as D, P as O, Pn as k, Q as A, Qt as ee, R as j, Rn as M, S as N, Sn as te, T as P, Tn as ne, U as re, Un as F, V as I, Vn as L, Wn as ie, X as R, Y as ae, Z as z, Zt as oe, _ as B, _n as se, a as ce, at as le, bn as ue, bt as V, c as de, ct as fe, dn as pe, dt as me, en as he, et as H, fn as U, ft as ge, g as W, gn as _e, gt as ve, h as ye, hn as be, i as xe, in as Se, it as Ce, j as we, jn as Te, k as Ee, kn as G, l as De, ln as Oe, lt as ke, m as Ae, mn as je, mt as Me, nn as Ne, nt as Pe, o as K, ot as Fe, pt as Ie, q, r as J, rn as Le, rt as Y, s as X, st as Re, t as ze, tt as Be, u as Ve, un as He, ut as Ue, vn as We, w as Ge, wn as Ke, x as qe, xt as Je, y as Ye, yn as Xe, zn as Ze } from "./noise-BtPGSgcY.js";
// node_modules/three/build/three.module.js
function Qe() {
	let e = null, t = !1, n = null, r = null;
	function i(t, a) {
		r = e.requestAnimationFrame(i), n(t, a);
	}
	return {
		start: function() {
			t !== !0 && n !== null && e !== null && (r = e.requestAnimationFrame(i), t = !0);
		},
		stop: function() {
			e !== null && e.cancelAnimationFrame(r), t = !1;
		},
		setAnimationLoop: function(e) {
			n = e;
		},
		setContext: function(t) {
			e = t;
		}
	};
}
function $e(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(t, n) {
		let r = t.array, i = t.usage, a = r.byteLength, o = e.createBuffer();
		e.bindBuffer(n, o), e.bufferData(n, r, i), t.onUploadCallback();
		let s;
		if (r instanceof Float32Array) s = e.FLOAT;
		else if (typeof Float16Array < "u" && r instanceof Float16Array) s = e.HALF_FLOAT;
		else if (r instanceof Uint16Array) s = t.isFloat16BufferAttribute ? e.HALF_FLOAT : e.UNSIGNED_SHORT;
		else if (r instanceof Int16Array) s = e.SHORT;
		else if (r instanceof Uint32Array) s = e.UNSIGNED_INT;
		else if (r instanceof Int32Array) s = e.INT;
		else if (r instanceof Int8Array) s = e.BYTE;
		else if (r instanceof Uint8Array) s = e.UNSIGNED_BYTE;
		else if (r instanceof Uint8ClampedArray) s = e.UNSIGNED_BYTE;
		else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: " + r);
		return {
			buffer: o,
			type: s,
			bytesPerElement: r.BYTES_PER_ELEMENT,
			version: t.version,
			size: a
		};
	}
	function r(t, n, r) {
		let i = n.array, a = n.updateRanges;
		if (e.bindBuffer(r, t), a.length === 0) e.bufferSubData(r, 0, i);
		else {
			a.sort((e, t) => e.start - t.start);
			let t = 0;
			for (let e = 1; e < a.length; e++) {
				let n = a[t], r = a[e];
				r.start <= n.start + n.count + 1 ? n.count = Math.max(n.count, r.start + r.count - n.start) : (++t, a[t] = r);
			}
			a.length = t + 1;
			for (let t = 0, n = a.length; t < n; t++) {
				let n = a[t];
				e.bufferSubData(r, n.start * i.BYTES_PER_ELEMENT, i, n.start, n.count);
			}
			n.clearUpdateRanges();
		}
		n.onUploadCallback();
	}
	function i(e) {
		return e.isInterleavedBufferAttribute && (e = e.data), t.get(e);
	}
	function a(n) {
		n.isInterleavedBufferAttribute && (n = n.data);
		let r = t.get(n);
		r && (e.deleteBuffer(r.buffer), t.delete(n));
	}
	function o(e, i) {
		if (e.isInterleavedBufferAttribute && (e = e.data), e.isGLBufferAttribute) {
			let n = t.get(e);
			(!n || n.version < e.version) && t.set(e, {
				buffer: e.buffer,
				type: e.type,
				bytesPerElement: e.elementSize,
				version: e.version
			});
			return;
		}
		let a = t.get(e);
		if (a === void 0) t.set(e, n(e, i));
		else if (a.version < e.version) {
			if (a.size !== e.array.byteLength) throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
			r(a.buffer, e, i), a.version = e.version;
		}
	}
	return {
		get: i,
		remove: a,
		update: o
	};
}
var Z = {
	alphahash_fragment: "#ifdef USE_ALPHAHASH\n	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;\n#endif",
	alphahash_pars_fragment: "#ifdef USE_ALPHAHASH\n	const float ALPHA_HASH_SCALE = 0.05;\n	float hash2D( vec2 value ) {\n		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );\n	}\n	float hash3D( vec3 value ) {\n		return hash2D( vec2( hash2D( value.xy ), value.z ) );\n	}\n	float getAlphaHashThreshold( vec3 position ) {\n		float maxDeriv = max(\n			length( dFdx( position.xyz ) ),\n			length( dFdy( position.xyz ) )\n		);\n		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );\n		vec2 pixScales = vec2(\n			exp2( floor( log2( pixScale ) ) ),\n			exp2( ceil( log2( pixScale ) ) )\n		);\n		vec2 alpha = vec2(\n			hash3D( floor( pixScales.x * position.xyz ) ),\n			hash3D( floor( pixScales.y * position.xyz ) )\n		);\n		float lerpFactor = fract( log2( pixScale ) );\n		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;\n		float a = min( lerpFactor, 1.0 - lerpFactor );\n		vec3 cases = vec3(\n			x * x / ( 2.0 * a * ( 1.0 - a ) ),\n			( x - 0.5 * a ) / ( 1.0 - a ),\n			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )\n		);\n		float threshold = ( x < ( 1.0 - a ) )\n			? ( ( x < a ) ? cases.x : cases.y )\n			: cases.z;\n		return clamp( threshold , 1.0e-6, 1.0 );\n	}\n#endif",
	alphamap_fragment: "#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;\n#endif",
	alphamap_pars_fragment: "#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
	alphatest_fragment: "#ifdef USE_ALPHATEST\n	#ifdef ALPHA_TO_COVERAGE\n	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );\n	if ( diffuseColor.a == 0.0 ) discard;\n	#else\n	if ( diffuseColor.a < alphaTest ) discard;\n	#endif\n#endif",
	alphatest_pars_fragment: "#ifdef USE_ALPHATEST\n	uniform float alphaTest;\n#endif",
	aomap_fragment: "#ifdef USE_AOMAP\n	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;\n	reflectedLight.indirectDiffuse *= ambientOcclusion;\n	#if defined( USE_CLEARCOAT ) \n		clearcoatSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_SHEEN ) \n		sheenSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( STANDARD )\n		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );\n		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );\n	#endif\n#endif",
	aomap_pars_fragment: "#ifdef USE_AOMAP\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n#endif",
	batching_pars_vertex: "#ifdef USE_BATCHING\n	#if ! defined( GL_ANGLE_multi_draw )\n	#define gl_DrawID _gl_DrawID\n	uniform int _gl_DrawID;\n	#endif\n	uniform highp sampler2D batchingTexture;\n	uniform highp usampler2D batchingIdTexture;\n	mat4 getBatchingMatrix( const in float i ) {\n		int size = textureSize( batchingTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n	float getIndirectIndex( const in int i ) {\n		int size = textureSize( batchingIdTexture, 0 ).x;\n		int x = i % size;\n		int y = i / size;\n		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );\n	}\n#endif\n#ifdef USE_BATCHING_COLOR\n	uniform sampler2D batchingColorTexture;\n	vec4 getBatchingColor( const in float i ) {\n		int size = textureSize( batchingColorTexture, 0 ).x;\n		int j = int( i );\n		int x = j % size;\n		int y = j / size;\n		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );\n	}\n#endif",
	batching_vertex: "#ifdef USE_BATCHING\n	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );\n#endif",
	begin_vertex: "vec3 transformed = vec3( position );\n#ifdef USE_ALPHAHASH\n	vPosition = vec3( position );\n#endif",
	beginnormal_vertex: "vec3 objectNormal = vec3( normal );\n#ifdef USE_TANGENT\n	vec3 objectTangent = vec3( tangent.xyz );\n#endif",
	bsdfs: "float G_BlinnPhong_Implicit( ) {\n	return 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( specularColor, 1.0, dotVH );\n	float G = G_BlinnPhong_Implicit( );\n	float D = D_BlinnPhong( shininess, dotNH );\n	return F * ( G * D );\n} // validated",
	iridescence_fragment: "#ifdef USE_IRIDESCENCE\n	const mat3 XYZ_TO_REC709 = mat3(\n		 3.2404542, -0.9692660,  0.0556434,\n		-1.5371385,  1.8760108, -0.2040259,\n		-0.4985314,  0.0415560,  1.0572252\n	);\n	vec3 Fresnel0ToIor( vec3 fresnel0 ) {\n		vec3 sqrtF0 = sqrt( fresnel0 );\n		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );\n	}\n	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );\n	}\n	float IorToFresnel0( float transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));\n	}\n	vec3 evalSensitivity( float OPD, vec3 shift ) {\n		float phase = 2.0 * PI * OPD * 1.0e-9;\n		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );\n		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );\n		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );\n		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );\n		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );\n		xyz /= 1.0685e-7;\n		vec3 rgb = XYZ_TO_REC709 * xyz;\n		return rgb;\n	}\n	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {\n		vec3 I;\n		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );\n		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );\n		float cosTheta2Sq = 1.0 - sinTheta2Sq;\n		if ( cosTheta2Sq < 0.0 ) {\n			return vec3( 1.0 );\n		}\n		float cosTheta2 = sqrt( cosTheta2Sq );\n		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );\n		float R12 = F_Schlick( R0, 1.0, cosTheta1 );\n		float T121 = 1.0 - R12;\n		float phi12 = 0.0;\n		if ( iridescenceIOR < outsideIOR ) phi12 = PI;\n		float phi21 = PI - phi12;\n		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );\n		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );\n		vec3 phi23 = vec3( 0.0 );\n		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;\n		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;\n		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;\n		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;\n		vec3 phi = vec3( phi21 ) + phi23;\n		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );\n		vec3 r123 = sqrt( R123 );\n		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );\n		vec3 C0 = R12 + Rs;\n		I = C0;\n		vec3 Cm = Rs - T121;\n		for ( int m = 1; m <= 2; ++ m ) {\n			Cm *= r123;\n			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );\n			I += Cm * Sm;\n		}\n		return max( I, vec3( 0.0 ) );\n	}\n#endif",
	bumpmap_pars_fragment: "#ifdef USE_BUMPMAP\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n	vec2 dHdxy_fwd() {\n		vec2 dSTdx = dFdx( vBumpMapUv );\n		vec2 dSTdy = dFdy( vBumpMapUv );\n		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;\n		return vec2( dBx, dBy );\n	}\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {\n		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );\n		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );\n		vec3 vN = surf_norm;\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n		float fDet = dot( vSigmaX, R1 ) * faceDirection;\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n	}\n#endif",
	clipping_planes_fragment: "#if NUM_CLIPPING_PLANES > 0\n	vec4 plane;\n	#ifdef ALPHA_TO_COVERAGE\n		float distanceToPlane, distanceGradient;\n		float clipOpacity = 1.0;\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n			distanceGradient = fwidth( distanceToPlane ) / 2.0;\n			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			if ( clipOpacity == 0.0 ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			float unionClipOpacity = 1.0;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n				distanceGradient = fwidth( distanceToPlane ) / 2.0;\n				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			}\n			#pragma unroll_loop_end\n			clipOpacity *= 1.0 - unionClipOpacity;\n		#endif\n		diffuseColor.a *= clipOpacity;\n		if ( diffuseColor.a == 0.0 ) discard;\n	#else\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			bool clipped = true;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n			}\n			#pragma unroll_loop_end\n			if ( clipped ) discard;\n		#endif\n	#endif\n#endif",
	clipping_planes_pars_fragment: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif",
	clipping_planes_pars_vertex: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n#endif",
	clipping_planes_vertex: "#if NUM_CLIPPING_PLANES > 0\n	vClipPosition = - mvPosition.xyz;\n#endif",
	color_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	diffuseColor *= vColor;\n#endif",
	color_pars_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	varying vec4 vColor;\n#endif",
	color_pars_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	varying vec4 vColor;\n#endif",
	color_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	vColor = vec4( 1.0 );\n#endif\n#ifdef USE_COLOR_ALPHA\n	vColor *= color;\n#elif defined( USE_COLOR )\n	vColor.rgb *= color;\n#endif\n#ifdef USE_INSTANCING_COLOR\n	vColor.rgb *= instanceColor.rgb;\n#endif\n#ifdef USE_BATCHING_COLOR\n	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );\n#endif",
	common: "#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\nhighp float rand( const in vec2 uv ) {\n	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n	return fract( sin( sn ) * c );\n}\n#ifdef HIGH_PRECISION\n	float precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n	float precisionSafeLength( vec3 v ) {\n		float maxComponent = max3( abs( v ) );\n		return length( v / maxComponent ) * maxComponent;\n	}\n#endif\nstruct IncidentLight {\n	vec3 color;\n	vec3 direction;\n	bool visible;\n};\nstruct ReflectedLight {\n	vec3 directDiffuse;\n	vec3 directSpecular;\n	vec3 indirectDiffuse;\n	vec3 indirectSpecular;\n};\n#ifdef USE_ALPHAHASH\n	varying vec3 vPosition;\n#endif\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\n#define inverseTransformDirection transformDirectionByInverseViewMatrix\nvec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {\n	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );\n}\nvec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {\n	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );\n}\nbool isPerspectiveMatrix( mat4 m ) {\n	return m[ 2 ][ 3 ] == - 1.0;\n}\nvec2 equirectUv( in vec3 dir ) {\n	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n	return vec2( u, v );\n}\nvec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n	return RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n}\nfloat F_Schlick( const in float f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n} // validated",
	cube_uv_reflection_fragment: "#ifdef ENVMAP_TYPE_CUBE_UV\n	#define cubeUV_minMipLevel 4.0\n	#define cubeUV_minTileSize 16.0\n	float getFace( vec3 direction ) {\n		vec3 absDirection = abs( direction );\n		float face = - 1.0;\n		if ( absDirection.x > absDirection.z ) {\n			if ( absDirection.x > absDirection.y )\n				face = direction.x > 0.0 ? 0.0 : 3.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		} else {\n			if ( absDirection.z > absDirection.y )\n				face = direction.z > 0.0 ? 2.0 : 5.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		}\n		return face;\n	}\n	vec2 getUV( vec3 direction, float face ) {\n		vec2 uv;\n		if ( face == 0.0 ) {\n			uv = vec2( direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 1.0 ) {\n			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );\n		} else if ( face == 2.0 ) {\n			uv = vec2( - direction.x, direction.y ) / abs( direction.z );\n		} else if ( face == 3.0 ) {\n			uv = vec2( - direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 4.0 ) {\n			uv = vec2( - direction.x, direction.z ) / abs( direction.y );\n		} else {\n			uv = vec2( direction.x, direction.y ) / abs( direction.z );\n		}\n		return 0.5 * ( uv + 1.0 );\n	}\n	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {\n		float face = getFace( direction );\n		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );\n		mipInt = max( mipInt, cubeUV_minMipLevel );\n		float faceSize = exp2( mipInt );\n		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;\n		if ( face > 2.0 ) {\n			uv.y += faceSize;\n			face -= 3.0;\n		}\n		uv.x += face * faceSize;\n		uv.x += filterInt * 3.0 * cubeUV_minTileSize;\n		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );\n		uv.x *= CUBEUV_TEXEL_WIDTH;\n		uv.y *= CUBEUV_TEXEL_HEIGHT;\n		#ifdef texture2DGradEXT\n			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;\n		#else\n			return texture2D( envMap, uv ).rgb;\n		#endif\n	}\n	#define cubeUV_r0 1.0\n	#define cubeUV_m0 - 2.0\n	#define cubeUV_r1 0.8\n	#define cubeUV_m1 - 1.0\n	#define cubeUV_r4 0.4\n	#define cubeUV_m4 2.0\n	#define cubeUV_r5 0.305\n	#define cubeUV_m5 3.0\n	#define cubeUV_r6 0.21\n	#define cubeUV_m6 4.0\n	float roughnessToMip( float roughness ) {\n		float mip = 0.0;\n		if ( roughness >= cubeUV_r1 ) {\n			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;\n		} else if ( roughness >= cubeUV_r4 ) {\n			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;\n		} else if ( roughness >= cubeUV_r5 ) {\n			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;\n		} else if ( roughness >= cubeUV_r6 ) {\n			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;\n		} else {\n			mip = - 2.0 * log2( 1.16 * roughness );		}\n		return mip;\n	}\n	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {\n		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );\n		float mipF = fract( mip );\n		float mipInt = floor( mip );\n		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );\n		if ( mipF == 0.0 ) {\n			return vec4( color0, 1.0 );\n		} else {\n			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );\n			return vec4( mix( color0, color1, mipF ), 1.0 );\n		}\n	}\n#endif",
	defaultnormal_vertex: "vec3 transformedNormal = objectNormal;\n#ifdef USE_TANGENT\n	vec3 transformedTangent = objectTangent;\n#endif\n#ifdef USE_BATCHING\n	mat3 bm = mat3( batchingMatrix );\n	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );\n	transformedNormal = bm * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = bm * transformedTangent;\n	#endif\n#endif\n#ifdef USE_INSTANCING\n	mat3 im = mat3( instanceMatrix );\n	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );\n	transformedNormal = im * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = im * transformedTangent;\n	#endif\n#endif\ntransformedNormal = normalMatrix * transformedNormal;\n#ifdef FLIP_SIDED\n	transformedNormal = - transformedNormal;\n#endif\n#ifdef USE_TANGENT\n	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;\n#endif",
	displacementmap_pars_vertex: "#ifdef USE_DISPLACEMENTMAP\n	uniform sampler2D displacementMap;\n	uniform float displacementScale;\n	uniform float displacementBias;\n#endif",
	displacementmap_vertex: "#ifdef USE_DISPLACEMENTMAP\n	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );\n#endif",
	emissivemap_fragment: "#ifdef USE_EMISSIVEMAP\n	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE\n		emissiveColor = sRGBTransferEOTF( emissiveColor );\n	#endif\n	totalEmissiveRadiance *= emissiveColor.rgb;\n#endif",
	emissivemap_pars_fragment: "#ifdef USE_EMISSIVEMAP\n	uniform sampler2D emissiveMap;\n#endif",
	colorspace_fragment: "gl_FragColor = linearToOutputTexel( gl_FragColor );",
	colorspace_pars_fragment: "vec4 LinearTransferOETF( in vec4 value ) {\n	return value;\n}\nvec4 sRGBTransferEOTF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );\n}\nvec4 sRGBTransferOETF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );\n}",
	envmap_fragment: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vec3 cameraToFrag;\n		if ( isOrthographic ) {\n			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToFrag = normalize( vWorldPosition - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( cameraToFrag, worldNormal );\n		#else\n			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n		#endif\n	#else\n		vec3 reflectVec = vReflect;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );\n		#ifdef ENVMAP_BLENDING_MULTIPLY\n			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_MIX )\n			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_ADD )\n			outgoingLight += envColor.xyz * specularStrength * reflectivity;\n		#endif\n	#endif\n#endif",
	envmap_common_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float envMapIntensity;\n	uniform mat3 envMapRotation;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n#endif",
	envmap_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float reflectivity;\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		varying vec3 vWorldPosition;\n		uniform float refractionRatio;\n	#else\n		varying vec3 vReflect;\n	#endif\n#endif",
	envmap_pars_vertex: "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		\n		varying vec3 vWorldPosition;\n	#else\n		varying vec3 vReflect;\n		uniform float refractionRatio;\n	#endif\n#endif",
	envmap_physical_pars_fragment: "#ifdef USE_ENVMAP\n	vec3 getIBLIrradiance( const in vec3 normal ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );\n			return PI * envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 reflectVec = reflect( - viewDir, normal );\n			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );\n			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );\n			return envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	#ifdef USE_RETROREFLECTION\n		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );\n				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );\n				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );\n				return envMapColor.rgb * envMapIntensity;\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n	#endif\n	#ifdef USE_ANISOTROPY\n		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 bentNormal = cross( bitangent, viewDir );\n				bentNormal = normalize( cross( bentNormal, bitangent ) );\n				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n				return getIBLRadiance( viewDir, bentNormal, roughness );\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n		#ifdef USE_RETROREFLECTION\n			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n				#ifdef ENVMAP_TYPE_CUBE_UV\n					vec3 bentNormal = cross( bitangent, viewDir );\n					bentNormal = normalize( cross( bentNormal, bitangent ) );\n					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n					return getIBLRetroRadiance( viewDir, bentNormal, roughness );\n				#else\n					return vec3( 0.0 );\n				#endif\n			}\n		#endif\n	#endif\n#endif",
	envmap_vertex: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vWorldPosition = worldPosition.xyz;\n	#else\n		vec3 cameraToVertex;\n		if ( isOrthographic ) {\n			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vReflect = reflect( cameraToVertex, worldNormal );\n		#else\n			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#endif\n#endif",
	fog_vertex: "#ifdef USE_FOG\n	vFogDepth = - mvPosition.z;\n#endif",
	fog_pars_vertex: "#ifdef USE_FOG\n	varying float vFogDepth;\n#endif",
	fog_fragment: "#ifdef USE_FOG\n	#ifdef FOG_EXP2\n		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n	#else\n		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );\n	#endif\n	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif",
	fog_pars_fragment: "#ifdef USE_FOG\n	uniform vec3 fogColor;\n	varying float vFogDepth;\n	#ifdef FOG_EXP2\n		uniform float fogDensity;\n	#else\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n#endif",
	gradientmap_pars_fragment: "#ifdef USE_GRADIENTMAP\n	uniform sampler2D gradientMap;\n#endif\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n	float dotNL = dot( normal, lightDirection );\n	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n	#ifdef USE_GRADIENTMAP\n		return vec3( texture2D( gradientMap, coord ).r );\n	#else\n		vec2 fw = fwidth( coord ) * 0.5;\n		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );\n	#endif\n}",
	lightmap_pars_fragment: "#ifdef USE_LIGHTMAP\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n#endif",
	lights_lambert_fragment: "LambertMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularStrength = specularStrength;",
	lights_lambert_pars_fragment: "varying vec3 vViewPosition;\nstruct LambertMaterial {\n	vec3 diffuseColor;\n	float specularStrength;\n};\nvoid RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Lambert\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert",
	lights_pars_begin: "uniform bool receiveShadow;\nuniform vec3 ambientLightColor;\n#if defined( USE_LIGHT_PROBES )\n	uniform vec3 lightProbe[ 9 ];\n#endif\nvec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {\n	float x = normal.x, y = normal.y, z = normal.z;\n	vec3 result = shCoefficients[ 0 ] * 0.886227;\n	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;\n	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;\n	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;\n	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;\n	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;\n	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );\n	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;\n	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );\n	return result;\n}\nvec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {\n	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );\n	return irradiance;\n}\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n	vec3 irradiance = ambientLightColor;\n	return irradiance;\n}\nfloat getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n	if ( cutoffDistance > 0.0 ) {\n		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n	}\n	return distanceFalloff;\n}\nfloat getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {\n	return smoothstep( coneCosine, penumbraCosine, angleCosine );\n}\n#if NUM_SUN_LIGHTS > 0\n	struct SunLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];\n	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {\n		light.color = sunLight.color;\n		light.direction = sunLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_DIR_LIGHTS > 0\n	struct DirectionalLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {\n		light.color = directionalLight.color;\n		light.direction = directionalLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_POINT_LIGHTS > 0\n	struct PointLight {\n		vec3 position;\n		vec3 color;\n		float distance;\n		float decay;\n	};\n	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = pointLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		light.color = pointLight.color;\n		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );\n		light.visible = ( light.color != vec3( 0.0 ) );\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	struct SpotLight {\n		vec3 position;\n		vec3 direction;\n		vec3 color;\n		float distance;\n		float decay;\n		float coneCos;\n		float penumbraCos;\n	};\n	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = spotLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float angleCos = dot( light.direction, spotLight.direction );\n		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n		if ( spotAttenuation > 0.0 ) {\n			float lightDistance = length( lVector );\n			light.color = spotLight.color * spotAttenuation;\n			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );\n			light.visible = ( light.color != vec3( 0.0 ) );\n		} else {\n			light.color = vec3( 0.0 );\n			light.visible = false;\n		}\n	}\n#endif\n#if NUM_RECT_AREA_LIGHTS > 0\n	struct RectAreaLight {\n		vec3 color;\n		vec3 position;\n		vec3 halfWidth;\n		vec3 halfHeight;\n	};\n	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;\n	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	struct HemisphereLight {\n		vec3 direction;\n		vec3 skyColor;\n		vec3 groundColor;\n	};\n	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {\n		float dotNL = dot( normal, hemiLight.direction );\n		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n		return irradiance;\n	}\n#endif\n#include <lightprobes_pars_fragment>",
	lights_toon_fragment: "ToonMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;",
	lights_toon_pars_fragment: "varying vec3 vViewPosition;\nstruct ToonMaterial {\n	vec3 diffuseColor;\n};\nvoid RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Toon\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon",
	lights_phong_fragment: "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;",
	lights_phong_pars_fragment: "varying vec3 vViewPosition;\nstruct BlinnPhongMaterial {\n	vec3 diffuseColor;\n	vec3 specularColor;\n	float specularShininess;\n	float specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_BlinnPhong\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong",
	lights_physical_fragment: "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nmaterial.metalness = metalnessFactor;\nvec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );\nfloat geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );\nmaterial.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;\nmaterial.roughness = min( material.roughness, 1.0 );\n#ifdef IOR\n	material.ior = ior;\n	#ifdef USE_SPECULAR\n		float specularIntensityFactor = specularIntensity;\n		vec3 specularColorFactor = specularColor;\n		#ifdef USE_SPECULAR_COLORMAP\n			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;\n		#endif\n		#ifdef USE_SPECULAR_INTENSITYMAP\n			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;\n		#endif\n		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );\n	#else\n		float specularIntensityFactor = 1.0;\n		vec3 specularColorFactor = vec3( 1.0 );\n		material.specularF90 = 1.0;\n	#endif\n	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n#else\n	material.specularColor = vec3( 0.04 );\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n	material.specularF90 = 1.0;\n#endif\n#ifdef USE_CLEARCOAT\n	material.clearcoat = clearcoat;\n	material.clearcoatRoughness = clearcoatRoughness;\n	material.clearcoatF0 = vec3( 0.04 );\n	material.clearcoatF90 = 1.0;\n	#ifdef USE_CLEARCOATMAP\n		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;\n	#endif\n	#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;\n	#endif\n	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );\n	material.clearcoatRoughness += geometryRoughness;\n	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );\n#endif\n#ifdef USE_DISPERSION\n	material.dispersion = dispersion;\n#endif\n#ifdef USE_RETROREFLECTION\n	material.retroreflectivity = retroreflectivity;\n#endif\n#ifdef USE_IRIDESCENCE\n	material.iridescence = iridescence;\n	material.iridescenceIOR = iridescenceIOR;\n	#ifdef USE_IRIDESCENCEMAP\n		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;\n	#endif\n	#ifdef USE_IRIDESCENCE_THICKNESSMAP\n		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;\n	#else\n		material.iridescenceThickness = iridescenceThicknessMaximum;\n	#endif\n#endif\n#ifdef USE_SHEEN\n	material.sheenColor = sheenColor;\n	#ifdef USE_SHEEN_COLORMAP\n		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;\n	#endif\n	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	#ifdef USE_ANISOTROPYMAP\n		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );\n		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;\n		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;\n	#else\n		vec2 anisotropyV = anisotropyVector;\n	#endif\n	material.anisotropy = length( anisotropyV );\n	if( material.anisotropy == 0.0 ) {\n		anisotropyV = vec2( 1.0, 0.0 );\n	} else {\n		anisotropyV /= material.anisotropy;\n		material.anisotropy = saturate( material.anisotropy );\n	}\n	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );\n	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;\n	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;\n#endif",
	lights_physical_pars_fragment: "uniform sampler2D dfgLUT;\nstruct PhysicalMaterial {\n	vec3 diffuseColor;\n	vec3 diffuseContribution;\n	vec3 specularColor;\n	vec3 specularColorBlended;\n	float roughness;\n	float metalness;\n	float specularF90;\n	float dispersion;\n	vec2 dfg;\n	vec3 multiScatteringCompensation;\n	#ifdef USE_RETROREFLECTION\n		float retroreflectivity;\n	#endif\n	#ifdef USE_CLEARCOAT\n		float clearcoat;\n		float clearcoatRoughness;\n		vec3 clearcoatF0;\n		float clearcoatF90;\n	#endif\n	#ifdef USE_IRIDESCENCE\n		float iridescence;\n		float iridescenceIOR;\n		float iridescenceThickness;\n		vec3 iridescenceFresnel;\n		vec3 iridescenceF0Dielectric;\n		vec3 iridescenceF0Metallic;\n	#endif\n	#ifdef USE_SHEEN\n		vec3 sheenColor;\n		float sheenRoughness;\n	#endif\n	#ifdef IOR\n		float ior;\n	#endif\n	#ifdef USE_TRANSMISSION\n		float transmission;\n		float transmissionAlpha;\n		float thickness;\n		float attenuationDistance;\n		vec3 attenuationColor;\n	#endif\n	#ifdef USE_ANISOTROPY\n		float anisotropy;\n		float alphaT;\n		vec3 anisotropyT;\n		vec3 anisotropyB;\n	#endif\n};\nvec3 clearcoatSpecularDirect = vec3( 0.0 );\nvec3 clearcoatSpecularIndirect = vec3( 0.0 );\nvec3 sheenSpecularDirect = vec3( 0.0 );\nvec3 sheenSpecularIndirect = vec3(0.0 );\nvec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {\n    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );\n    float x2 = x * x;\n    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );\n    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );\n}\nfloat V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	return 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n	float a2 = pow2( alpha );\n	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n	return RECIPROCAL_PI * a2 / pow2( denom );\n}\n#ifdef USE_ANISOTROPY\n	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {\n		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );\n		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );\n		return 0.5 / max( gv + gl, EPSILON );\n	}\n	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {\n		float a2 = alphaT * alphaB;\n		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );\n		highp float v2 = dot( v, v );\n		float w2 = a2 / v2;\n		return RECIPROCAL_PI * a2 * pow2 ( w2 );\n	}\n#endif\n#ifdef USE_CLEARCOAT\n	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {\n		vec3 f0 = material.clearcoatF0;\n		float f90 = material.clearcoatF90;\n		float roughness = material.clearcoatRoughness;\n		float alpha = pow2( roughness );\n		vec3 halfDir = normalize( lightDir + viewDir );\n		float dotNL = saturate( dot( normal, lightDir ) );\n		float dotNV = saturate( dot( normal, viewDir ) );\n		float dotNH = saturate( dot( normal, halfDir ) );\n		float dotVH = saturate( dot( viewDir, halfDir ) );\n		vec3 F = F_Schlick( f0, f90, dotVH );\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n		return F * ( V * D );\n	}\n#endif\nvec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {\n	vec3 f0 = material.specularColorBlended;\n	float f90 = material.specularF90;\n	float roughness = material.roughness;\n	float alpha = pow2( roughness );\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( f0, f90, dotVH );\n	#ifdef USE_IRIDESCENCE\n		F = mix( F, material.iridescenceFresnel, material.iridescence );\n	#endif\n	#ifdef USE_ANISOTROPY\n		float dotTL = dot( material.anisotropyT, lightDir );\n		float dotTV = dot( material.anisotropyT, viewDir );\n		float dotTH = dot( material.anisotropyT, halfDir );\n		float dotBL = dot( material.anisotropyB, lightDir );\n		float dotBV = dot( material.anisotropyB, viewDir );\n		float dotBH = dot( material.anisotropyB, halfDir );\n		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );\n		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );\n	#else\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n	#endif\n	return F * ( V * D );\n}\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n	const float LUT_SIZE = 64.0;\n	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n	const float LUT_BIAS = 0.5 / LUT_SIZE;\n	float dotNV = saturate( dot( N, V ) );\n	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n	uv = uv * LUT_SCALE + LUT_BIAS;\n	return uv;\n}\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n	float l = length( f );\n	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n}\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n	float x = dot( v1, v2 );\n	float y = abs( x );\n	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n	float b = 3.4175940 + ( 4.1616724 + y ) * y;\n	float v = a / b;\n	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n	return cross( v1, v2 ) * theta_sintheta;\n}\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n	vec3 lightNormal = cross( v1, v2 );\n	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n	vec3 T1, T2;\n	T1 = normalize( V - N * dot( V, N ) );\n	T2 = - cross( N, T1 );\n	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );\n	vec3 coords[ 4 ];\n	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n	coords[ 0 ] = normalize( coords[ 0 ] );\n	coords[ 1 ] = normalize( coords[ 1 ] );\n	coords[ 2 ] = normalize( coords[ 2 ] );\n	coords[ 3 ] = normalize( coords[ 3 ] );\n	vec3 vectorFormFactor = vec3( 0.0 );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n	return vec3( result );\n}\n#if defined( USE_SHEEN )\nfloat D_Charlie( float roughness, float dotNH ) {\n	float alpha = pow2( roughness );\n	float invAlpha = 1.0 / alpha;\n	float cos2h = dotNH * dotNH;\n	float sin2h = max( 1.0 - cos2h, 0.0078125 );\n	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );\n}\nfloat V_Neubelt( float dotNV, float dotNL ) {\n	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );\n}\nvec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float D = D_Charlie( sheenRoughness, dotNH );\n	float V = V_Neubelt( dotNV, dotNL );\n	return sheenColor * ( D * V );\n}\n#endif\nfloat IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float r2 = roughness * roughness;\n	float rInv = 1.0 / ( roughness + 0.1 );\n	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;\n	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;\n	float DG = exp( a * dotNV + b );\n	return saturate( DG );\n}\nvec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;\n	return specularColor * fab.x + specularF90 * fab.y;\n}\n#ifdef USE_IRIDESCENCE\nvoid computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#else\nvoid computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#endif\n	#ifdef USE_IRIDESCENCE\n		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );\n	#else\n		vec3 Fr = specularColor;\n	#endif\n	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;\n	float Ess = fab.x + fab.y;\n	float Ems = 1.0 - Ess;\n	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );\n	singleScatter += FssEss;\n	multiScatter += Fms * Ems;\n}\n#if NUM_RECT_AREA_LIGHTS > 0\n	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n		vec3 normal = geometryNormal;\n		vec3 viewDir = geometryViewDir;\n		vec3 position = geometryPosition;\n		vec3 lightPos = rectAreaLight.position;\n		vec3 halfWidth = rectAreaLight.halfWidth;\n		vec3 halfHeight = rectAreaLight.halfHeight;\n		vec3 lightColor = rectAreaLight.color;\n		float roughness = material.roughness;\n		vec3 rectCoords[ 4 ];\n		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;\n		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;\n		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;\n		vec2 uv = LTC_Uv( normal, viewDir, roughness );\n		vec4 t1 = texture2D( ltc_1, uv );\n		vec4 t2 = texture2D( ltc_2, uv );\n		mat3 mInv = mat3(\n			vec3( t1.x, 0, t1.y ),\n			vec3(    0, 1,    0 ),\n			vec3( t1.z, 0, t1.w )\n		);\n		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );\n		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n		#ifdef USE_CLEARCOAT\n			vec3 Ncc = geometryClearcoatNormal;\n			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );\n			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );\n			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );\n			mat3 mInvClearcoat = mat3(\n				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),\n				vec3(             0, 1,             0 ),\n				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )\n			);\n			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;\n			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );\n		#endif\n	}\n#endif\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifdef USE_CLEARCOAT\n		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );\n		vec3 ccIrradiance = dotNLcc * directLight.color;\n		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );\n	#endif\n	#ifdef USE_SHEEN\n \n 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );\n \n 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );\n \n 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );\n \n 		irradiance *= sheenEnergyComp;\n \n 	#endif\n	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );\n	#ifdef USE_RETROREFLECTION\n		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );\n		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );\n		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );\n	#endif\n	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;\n	vec3 halfDir = normalize( directLight.direction + geometryViewDir );\n	float dotVH = saturate( dot( geometryViewDir, halfDir ) );\n	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );\n	#ifdef USE_RETROREFLECTION\n		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );\n		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );\n		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );\n		F = mix( F, retroF, saturate( material.retroreflectivity ) );\n	#endif\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 singleScattering = vec3( 0.0 );\n	vec3 multiScattering = vec3( 0.0 );\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );\n	#else\n		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );\n	#endif\n	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		diffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectDiffuse += diffuse;\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {\n	#ifdef USE_CLEARCOAT\n		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );\n	#endif\n	#ifdef USE_SHEEN\n		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;\n 	#endif\n	vec3 singleScatteringDielectric = vec3( 0.0 );\n	vec3 multiScatteringDielectric = vec3( 0.0 );\n	vec3 singleScatteringMetallic = vec3( 0.0 );\n	vec3 multiScatteringMetallic = vec3( 0.0 );\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );\n	#else\n		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );\n	#endif\n	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );\n	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );\n	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;\n	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );\n	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;\n	vec3 indirectSpecular = radiance * singleScattering;\n	indirectSpecular += multiScattering * cosineWeightedIrradiance;\n	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		indirectSpecular *= sheenEnergyComp;\n		indirectDiffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectSpecular += indirectSpecular;\n	reflectedLight.indirectDiffuse += indirectDiffuse;\n}\n#define RE_Direct				RE_Direct_Physical\n#define RE_Direct_RectArea		RE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular		RE_IndirectSpecular_Physical\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}",
	lights_fragment_begin: "\nvec3 geometryPosition = - vViewPosition;\nvec3 geometryNormal = normal;\nvec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\nvec3 geometryClearcoatNormal = vec3( 0.0 );\n#ifdef USE_CLEARCOAT\n	geometryClearcoatNormal = clearcoatNormal;\n#endif\n#ifdef USE_IRIDESCENCE\n	float dotNVi = saturate( dot( normal, geometryViewDir ) );\n	if ( material.iridescenceThickness == 0.0 ) {\n		material.iridescence = 0.0;\n	} else {\n		material.iridescence = saturate( material.iridescence );\n	}\n	if ( material.iridescence > 0.0 ) {\n		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );\n		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );\n		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );\n		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );\n		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );\n	}\n#endif\n#ifdef STANDARD\n	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );\n	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;\n	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )\n		float EssMs = material.dfg.x + material.dfg.y;\n		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );\n	#endif\n#endif\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n	PointLight pointLight;\n	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n	PointLightShadow pointLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		getPointLightInfo( pointLight, geometryPosition, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n		pointLightShadow = pointLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n	SpotLight spotLight;\n	vec4 spotColor;\n	vec3 spotLightCoord;\n	bool inSpotLightMap;\n	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		getSpotLightInfo( spotLight, geometryPosition, directLight );\n		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX\n		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS\n		#else\n		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#endif\n		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )\n			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;\n			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );\n			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );\n			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;\n		#endif\n		#undef SPOT_LIGHT_MAP_INDEX\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		spotLightShadow = spotLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )\n	SunLight sunLight;\n	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0\n	SunLightShadow sunLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {\n		sunLight = sunLights[ i ];\n		getSunLightInfo( sunLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )\n		sunLightShadow = sunLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n	DirectionalLight directionalLight;\n	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		getDirectionalLightInfo( directionalLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n		directionalLightShadow = directionalLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n	RectAreaLight rectAreaLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n		rectAreaLight = rectAreaLights[ i ];\n		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if defined( RE_IndirectDiffuse )\n	vec3 iblIrradiance = vec3( 0.0 );\n	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n	#if defined( USE_LIGHT_PROBES )\n		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );\n	#endif\n	#if ( NUM_HEMI_LIGHTS > 0 )\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );\n		}\n		#pragma unroll_loop_end\n	#endif\n	#ifdef USE_LIGHT_PROBES_GRID\n		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;\n		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );\n		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );\n	#endif\n#endif\n#if defined( RE_IndirectSpecular )\n	vec3 radiance = vec3( 0.0 );\n	vec3 clearcoatRadiance = vec3( 0.0 );\n#endif",
	lights_fragment_maps: "#if defined( RE_IndirectDiffuse )\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n		irradiance += lightMapIrradiance;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )\n		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )\n			iblIrradiance += getIBLIrradiance( geometryNormal );\n		#endif\n	#endif\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n	#ifdef USE_ANISOTROPY\n		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n	#else\n		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );\n	#endif\n	#ifdef USE_RETROREFLECTION\n		#ifdef USE_ANISOTROPY\n			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n		#else\n			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );\n		#endif\n		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );\n	#endif\n	radiance += iblRadiance;\n	#ifdef USE_CLEARCOAT\n		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );\n	#endif\n#endif",
	lights_fragment_end: "#if defined( RE_IndirectDiffuse )\n	#if defined( LAMBERT ) || defined( PHONG )\n		irradiance += iblIrradiance;\n	#endif\n	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif\n#if defined( RE_IndirectSpecular )\n	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif",
	lightprobes_pars_fragment: "#ifdef USE_LIGHT_PROBES_GRID\nuniform highp sampler3D probesSH;\nuniform vec3 probesMin;\nuniform vec3 probesMax;\nuniform vec3 probesResolution;\nvec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {\n	vec3 res = probesResolution;\n	vec3 gridRange = probesMax - probesMin;\n	vec3 resMinusOne = res - 1.0;\n	vec3 probeSpacing = gridRange / resMinusOne;\n	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;\n	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );\n	uvw = uvw * resMinusOne / res + 0.5 / res;\n	float nz          = res.z;\n	float paddedSlices = nz + 2.0;\n	float atlasDepth  = 7.0 * paddedSlices;\n	float uvZBase     = uvw.z * nz + 1.0;\n	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );\n	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );\n	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );\n	vec3 c0 = s0.xyz;\n	vec3 c1 = vec3( s0.w, s1.xy );\n	vec3 c2 = vec3( s1.zw, s2.x );\n	vec3 c3 = s2.yzw;\n	vec3 c4 = s3.xyz;\n	vec3 c5 = vec3( s3.w, s4.xy );\n	vec3 c6 = vec3( s4.zw, s5.x );\n	vec3 c7 = s5.yzw;\n	vec3 c8 = s6.xyz;\n	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;\n	vec3 result = c0 * 0.886227;\n	result += c1 * 2.0 * 0.511664 * y;\n	result += c2 * 2.0 * 0.511664 * z;\n	result += c3 * 2.0 * 0.511664 * x;\n	result += c4 * 2.0 * 0.429043 * x * y;\n	result += c5 * 2.0 * 0.429043 * y * z;\n	result += c6 * ( 0.743125 * z * z - 0.247708 );\n	result += c7 * 2.0 * 0.429043 * x * z;\n	result += c8 * 0.429043 * ( x * x - y * y );\n	return max( result, vec3( 0.0 ) );\n}\n#endif",
	logdepthbuf_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n#endif",
	logdepthbuf_pars_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	uniform float logDepthBufFC;\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
	logdepthbuf_pars_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
	logdepthbuf_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	vFragDepth = 1.0 + gl_Position.w;\n	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n#endif",
	map_fragment: "#ifdef USE_MAP\n	vec4 sampledDiffuseColor = texture2D( map, vMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );\n	#endif\n	diffuseColor *= sampledDiffuseColor;\n#endif",
	map_pars_fragment: "#ifdef USE_MAP\n	uniform sampler2D map;\n#endif",
	map_particle_fragment: "#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n	#if defined( USE_POINTS_UV )\n		vec2 uv = vUv;\n	#else\n		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n	#endif\n#endif\n#ifdef USE_MAP\n	diffuseColor *= texture2D( map, uv );\n#endif\n#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, uv ).g;\n#endif",
	map_particle_pars_fragment: "#if defined( USE_POINTS_UV )\n	varying vec2 vUv;\n#else\n	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n		uniform mat3 uvTransform;\n	#endif\n#endif\n#ifdef USE_MAP\n	uniform sampler2D map;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
	metalnessmap_fragment: "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );\n	metalnessFactor *= texelMetalness.b;\n#endif",
	metalnessmap_pars_fragment: "#ifdef USE_METALNESSMAP\n	uniform sampler2D metalnessMap;\n#endif",
	morphinstance_vertex: "#ifdef USE_INSTANCING_MORPH\n	float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;\n	}\n#endif",
	morphcolor_vertex: "#if defined( USE_MORPHCOLORS )\n	vColor *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		#if defined( USE_COLOR_ALPHA )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];\n		#elif defined( USE_COLOR )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];\n		#endif\n	}\n#endif",
	morphnormal_vertex: "#ifdef USE_MORPHNORMALS\n	objectNormal *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
	morphtarget_pars_vertex: "#ifdef USE_MORPHTARGETS\n	#ifndef USE_INSTANCING_MORPH\n		uniform float morphTargetBaseInfluence;\n		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	#endif\n	uniform sampler2DArray morphTargetsTexture;\n	uniform ivec2 morphTargetsTextureSize;\n	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {\n		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;\n		int y = texelIndex / morphTargetsTextureSize.x;\n		int x = texelIndex - y * morphTargetsTextureSize.x;\n		ivec3 morphUV = ivec3( x, y, morphTargetIndex );\n		return texelFetch( morphTargetsTexture, morphUV, 0 );\n	}\n#endif",
	morphtarget_vertex: "#ifdef USE_MORPHTARGETS\n	transformed *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
	normal_fragment_begin: "float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;\n#ifdef FLAT_SHADED\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n#else\n	vec3 normal = normalize( vNormal );\n	#ifdef DOUBLE_SIDED\n		normal *= faceDirection;\n	#endif\n#endif\n#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )\n	#ifdef USE_TANGENT\n		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn = getTangentFrame( - vViewPosition, normal,\n		#if defined( USE_NORMALMAP )\n			vNormalMapUv\n		#elif defined( USE_CLEARCOAT_NORMALMAP )\n			vClearcoatNormalMapUv\n		#else\n			vUv\n		#endif\n		);\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn[0] *= faceDirection;\n		tbn[1] *= faceDirection;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	#ifdef USE_TANGENT\n		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn2[0] *= faceDirection;\n		tbn2[1] *= faceDirection;\n	#endif\n#endif\nvec3 nonPerturbedNormal = normal;",
	normal_fragment_maps: "#ifdef USE_NORMALMAP_OBJECTSPACE\n	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#ifdef FLIP_SIDED\n		normal = - normal;\n	#endif\n	#ifdef DOUBLE_SIDED\n		normal = normal * faceDirection;\n	#endif\n	normal = normalize( normalMatrix * normal );\n#elif defined( USE_NORMALMAP_TANGENTSPACE )\n	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#if defined( USE_PACKED_NORMALMAP )\n		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );\n	#endif\n	mapN.xy *= normalScale;\n	normal = normalize( tbn * mapN );\n#elif defined( USE_BUMPMAP )\n	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );\n#endif",
	normal_pars_fragment: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
	normal_pars_vertex: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
	normal_vertex: "#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n	#ifdef USE_TANGENT\n		vTangent = normalize( transformedTangent );\n		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n		#ifdef FLIP_SIDED\n			vBitangent = - vBitangent;\n		#endif\n	#endif\n#endif",
	normalmap_pars_fragment: "#ifdef USE_NORMALMAP\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n#endif\n#ifdef USE_NORMALMAP_OBJECTSPACE\n	uniform mat3 normalMatrix;\n#endif\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )\n	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( uv.st );\n		vec2 st1 = dFdy( uv.st );\n		vec3 N = surf_norm;\n		vec3 q1perp = cross( q1, N );\n		vec3 q0perp = cross( N, q0 );\n		vec3 T = q1perp * st0.x + q0perp * st1.x;\n		vec3 B = q1perp * st0.y + q0perp * st1.y;\n		float det = max( dot( T, T ), dot( B, B ) );\n		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n		return mat3( T * scale, B * scale, N );\n	}\n#endif",
	clearcoat_normal_fragment_begin: "#ifdef USE_CLEARCOAT\n	vec3 clearcoatNormal = nonPerturbedNormal;\n#endif",
	clearcoat_normal_fragment_maps: "#ifdef USE_CLEARCOAT_NORMALMAP\n	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;\n	clearcoatMapN.xy *= clearcoatNormalScale;\n	clearcoatNormal = normalize( tbn2 * clearcoatMapN );\n#endif",
	clearcoat_pars_fragment: "#ifdef USE_CLEARCOATMAP\n	uniform sampler2D clearcoatMap;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform sampler2D clearcoatNormalMap;\n	uniform vec2 clearcoatNormalScale;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform sampler2D clearcoatRoughnessMap;\n#endif",
	iridescence_pars_fragment: "#ifdef USE_IRIDESCENCEMAP\n	uniform sampler2D iridescenceMap;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform sampler2D iridescenceThicknessMap;\n#endif",
	opaque_fragment: "#ifdef OPAQUE\ndiffuseColor.a = 1.0;\n#endif\n#ifdef USE_TRANSMISSION\ndiffuseColor.a *= material.transmissionAlpha;\n#endif\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );",
	packing: "vec3 packNormalToRGB( const in vec3 normal ) {\n	return normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n	return 2.0 * rgb.xyz - 1.0;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;\nconst float Inv255 = 1. / 255.;\nconst vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );\nconst vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );\nconst vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );\nconst vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );\nvec4 packDepthToRGBA( const in float v ) {\n	if( v <= 0.0 )\n		return vec4( 0., 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec4( 1., 1., 1., 1. );\n	float vuf;\n	float af = modf( v * PackFactors.a, vuf );\n	float bf = modf( vuf * ShiftRight8, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );\n}\nvec3 packDepthToRGB( const in float v ) {\n	if( v <= 0.0 )\n		return vec3( 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec3( 1., 1., 1. );\n	float vuf;\n	float bf = modf( v * PackFactors.b, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec3( vuf * Inv255, gf * PackUpscale, bf );\n}\nvec2 packDepthToRG( const in float v ) {\n	if( v <= 0.0 )\n		return vec2( 0., 0. );\n	if( v >= 1.0 )\n		return vec2( 1., 1. );\n	float vuf;\n	float gf = modf( v * 256., vuf );\n	return vec2( vuf * Inv255, gf );\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n	return dot( v, UnpackFactors4 );\n}\nfloat unpackRGBToDepth( const in vec3 v ) {\n	return dot( v, UnpackFactors3 );\n}\nfloat unpackRGToDepth( const in vec2 v ) {\n	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;\n}\nvec4 pack2HalfToRGBA( const in vec2 v ) {\n	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );\n	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );\n}\nvec2 unpackRGBATo2Half( const in vec4 v ) {\n	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n	\n		return depth * ( far - near ) - far;\n	#else\n		return depth * ( near - far ) - near;\n	#endif\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		return ( near * far ) / ( ( near - far ) * depth - near );\n	#else\n		return ( near * far ) / ( ( far - near ) * depth - far );\n	#endif\n}",
	premultiplied_alpha_fragment: "#ifdef PREMULTIPLIED_ALPHA\n	gl_FragColor.rgb *= gl_FragColor.a;\n#endif",
	project_vertex: "vec4 mvPosition = vec4( transformed, 1.0 );\n#ifdef USE_BATCHING\n	mvPosition = batchingMatrix * mvPosition;\n#endif\n#ifdef USE_INSTANCING\n	mvPosition = instanceMatrix * mvPosition;\n#endif\nmvPosition = modelViewMatrix * mvPosition;\ngl_Position = projectionMatrix * mvPosition;",
	dithering_fragment: "#ifdef DITHERING\n	gl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif",
	dithering_pars_fragment: "#ifdef DITHERING\n	vec3 dithering( vec3 color ) {\n		float grid_position = rand( gl_FragCoord.xy );\n		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n		return color + dither_shift_RGB;\n	}\n#endif",
	roughnessmap_fragment: "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );\n	roughnessFactor *= texelRoughness.g;\n#endif",
	roughnessmap_pars_fragment: "#ifdef USE_ROUGHNESSMAP\n	uniform sampler2D roughnessMap;\n#endif",
	shadowmap_pars_fragment: "#if NUM_SPOT_LIGHT_COORDS > 0\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#if NUM_SPOT_LIGHT_MAPS > 0\n	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		#define SUN_LIGHT_CASCADES 2\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];\n		#endif\n		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];\n		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];\n		varying vec4 vSunShadowWorldPosition;\n		varying vec3 vSunShadowWorldNormal;\n		struct SunLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#endif\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#elif defined( SHADOWMAP_TYPE_BASIC )\n			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float interleavedGradientNoise( vec2 position ) {\n			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );\n		}\n		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {\n			const float goldenAngle = 2.399963229728653;\n			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );\n			float theta = float( sampleIndex ) * goldenAngle + phi;\n			return vec2( cos( theta ), sin( theta ) ) * r;\n		}\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			shadowCoord.z += shadowBias;\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n				float radius = shadowRadius * texelSize.x;\n				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n				shadow = (\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )\n				) * 0.2;\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#elif defined( SHADOWMAP_TYPE_VSM )\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;\n				float mean = distribution.x;\n				float variance = distribution.y * distribution.y;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					float hard_shadow = step( mean, shadowCoord.z );\n				#else\n					float hard_shadow = step( shadowCoord.z, mean );\n				#endif\n				\n				if ( hard_shadow == 1.0 ) {\n					shadow = 1.0;\n				} else {\n					variance = max( variance, 0.0000001 );\n					float d = shadowCoord.z - mean;\n					float p_max = variance / ( variance + d * d );\n					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );\n					shadow = max( hard_shadow, p_max );\n				}\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#else\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				float depth = texture2D( shadowMap, shadowCoord.xy ).r;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					shadow = step( depth, shadowCoord.z );\n				#else\n					shadow = step( shadowCoord.z, depth );\n				#endif\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#endif\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		float getSunShadow(\n			#if defined( SHADOWMAP_TYPE_PCF )\n				sampler2DShadow shadowMap,\n			#else\n				sampler2D shadowMap,\n			#endif\n			SunLightShadow sunLightShadow,\n			int shadowIndex\n		) {\n			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );\n			float viewDepth = vSunShadowWorldPosition.w;\n			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;\n			float shadow = 1.0;\n			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {\n				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];\n				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {\n					float cascadeShadow = getShadow(\n						shadowMap,\n						sunLightShadow.shadowMapSize,\n						sunLightShadow.shadowIntensity,\n						sunLightShadow.shadowBias,\n						sunLightShadow.shadowRadius,\n						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition\n					);\n					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );\n				}\n			}\n			return shadow;\n		}\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n	#if defined( SHADOWMAP_TYPE_PCF )\n	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 bd3D = normalize( lightToPosition );\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp -= shadowBias;\n			#else\n				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp += shadowBias;\n			#endif\n			float texelSize = shadowRadius / shadowMapSize.x;\n			vec3 absDir = abs( bd3D );\n			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );\n			tangent = normalize( cross( bd3D, tangent ) );\n			vec3 bitangent = cross( bd3D, tangent );\n			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n			vec2 sample0 = vogelDiskSample( 0, 5, phi );\n			vec2 sample1 = vogelDiskSample( 1, 5, phi );\n			vec2 sample2 = vogelDiskSample( 2, 5, phi );\n			vec2 sample3 = vogelDiskSample( 3, 5, phi );\n			vec2 sample4 = vogelDiskSample( 4, 5, phi );\n			shadow = (\n				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )\n			) * 0.2;\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#elif defined( SHADOWMAP_TYPE_BASIC )\n	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n			dp += shadowBias;\n			vec3 bd3D = normalize( lightToPosition );\n			float depth = textureCube( shadowMap, bd3D ).r;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				depth = 1.0 - depth;\n			#endif\n			shadow = step( dp, depth );\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#endif\n	#endif\n#endif",
	shadowmap_pars_vertex: "#if NUM_SPOT_LIGHT_COORDS > 0\n	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		varying vec4 vSunShadowWorldPosition;\n		varying vec3 vSunShadowWorldNormal;\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n#endif",
	shadowmap_vertex: "#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )\n	#ifdef HAS_NORMAL\n		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n	#else\n		vec3 shadowWorldNormal = vec3( 0.0 );\n	#endif\n	vec4 shadowWorldPosition;\n#endif\n#if defined( USE_SHADOWMAP )\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );\n		vSunShadowWorldNormal = shadowWorldNormal;\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );\n			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );\n			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n#endif\n#if NUM_SPOT_LIGHT_COORDS > 0\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {\n		shadowWorldPosition = worldPosition;\n		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;\n		#endif\n		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;\n	}\n	#pragma unroll_loop_end\n#endif",
	shadowmask_pars_fragment: "float getShadowMask() {\n	float shadow = 1.0;\n	#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n	SunLightShadow sunLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {\n		sunLight = sunLightShadows[ i ];\n		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n		directionalLight = directionalLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n		spotLight = spotLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n	PointLightShadow pointLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n		pointLight = pointLightShadows[ i ];\n		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#endif\n	return shadow;\n}",
	skinbase_vertex: "#ifdef USE_SKINNING\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif",
	skinning_pars_vertex: "#ifdef USE_SKINNING\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n	uniform highp sampler2D boneTexture;\n	mat4 getBoneMatrix( const in float i ) {\n		int size = textureSize( boneTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n#endif",
	skinning_vertex: "#ifdef USE_SKINNING\n	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	transformed = ( bindMatrixInverse * skinned ).xyz;\n#endif",
	skinnormal_vertex: "#ifdef USE_SKINNING\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n	#ifdef USE_TANGENT\n		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n	#endif\n#endif",
	specularmap_fragment: "float specularStrength;\n#ifdef USE_SPECULARMAP\n	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );\n	specularStrength = texelSpecular.r;\n#else\n	specularStrength = 1.0;\n#endif",
	specularmap_pars_fragment: "#ifdef USE_SPECULARMAP\n	uniform sampler2D specularMap;\n#endif",
	tonemapping_fragment: "#if defined( TONE_MAPPING )\n	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif",
	tonemapping_pars_fragment: "#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\nuniform float toneMappingExposure;\nvec3 LinearToneMapping( vec3 color ) {\n	return saturate( toneMappingExposure * color );\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	return saturate( color / ( vec3( 1.0 ) + color ) );\n}\nvec3 CineonToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	color = max( vec3( 0.0 ), color - 0.004 );\n	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\nvec3 RRTAndODTFit( vec3 v ) {\n	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;\n	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;\n	return a / b;\n}\nvec3 ACESFilmicToneMapping( vec3 color ) {\n	const mat3 ACESInputMat = mat3(\n		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),\n		vec3( 0.04823, 0.01566, 0.83777 )\n	);\n	const mat3 ACESOutputMat = mat3(\n		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),\n		vec3( -0.07367, -0.00605,  1.07602 )\n	);\n	color *= toneMappingExposure / 0.6;\n	color = ACESInputMat * color;\n	color = RRTAndODTFit( color );\n	color = ACESOutputMat * color;\n	return saturate( color );\n}\nconst mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(\n	vec3( 1.6605, - 0.1246, - 0.0182 ),\n	vec3( - 0.5876, 1.1329, - 0.1006 ),\n	vec3( - 0.0728, - 0.0083, 1.1187 )\n);\nconst mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(\n	vec3( 0.6274, 0.0691, 0.0164 ),\n	vec3( 0.3293, 0.9195, 0.0880 ),\n	vec3( 0.0433, 0.0113, 0.8956 )\n);\nvec3 agxDefaultContrastApprox( vec3 x ) {\n	vec3 x2 = x * x;\n	vec3 x4 = x2 * x2;\n	return + 15.5 * x4 * x2\n		- 40.14 * x4 * x\n		+ 31.96 * x4\n		- 6.868 * x2 * x\n		+ 0.4298 * x2\n		+ 0.1191 * x\n		- 0.00232;\n}\nvec3 AgXToneMapping( vec3 color ) {\n	const mat3 AgXInsetMatrix = mat3(\n		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),\n		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),\n		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )\n	);\n	const mat3 AgXOutsetMatrix = mat3(\n		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),\n		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),\n		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )\n	);\n	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;\n	color *= toneMappingExposure;\n	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;\n	color = AgXInsetMatrix * color;\n	color = max( color, 1e-10 );	color = log2( color );\n	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );\n	color = clamp( color, 0.0, 1.0 );\n	color = agxDefaultContrastApprox( color );\n	color = AgXOutsetMatrix * color;\n	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );\n	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;\n	color = clamp( color, 0.0, 1.0 );\n	return color;\n}\nvec3 NeutralToneMapping( vec3 color ) {\n	const float StartCompression = 0.8 - 0.04;\n	const float Desaturation = 0.15;\n	color *= toneMappingExposure;\n	float x = min( color.r, min( color.g, color.b ) );\n	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;\n	color -= offset;\n	float peak = max( color.r, max( color.g, color.b ) );\n	if ( peak < StartCompression ) return color;\n	float d = 1. - StartCompression;\n	float newPeak = 1. - d * d / ( peak + d - StartCompression );\n	color *= newPeak / peak;\n	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );\n	return mix( color, vec3( newPeak ), g );\n}\nvec3 CustomToneMapping( vec3 color ) { return color; }",
	transmission_fragment: "#ifdef USE_TRANSMISSION\n	material.transmission = transmission;\n	material.transmissionAlpha = 1.0;\n	material.thickness = thickness;\n	material.attenuationDistance = attenuationDistance;\n	material.attenuationColor = attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;\n	#endif\n	vec3 pos = vWorldPosition;\n	vec3 v = normalize( cameraPosition - pos );\n	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec4 transmitted = getIBLVolumeRefraction(\n		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,\n		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,\n		material.attenuationColor, material.attenuationDistance );\n	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );\n	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );\n#endif",
	transmission_pars_fragment: "#ifdef USE_TRANSMISSION\n	uniform float transmission;\n	uniform float thickness;\n	uniform float attenuationDistance;\n	uniform vec3 attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		uniform sampler2D transmissionMap;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		uniform sampler2D thicknessMap;\n	#endif\n	uniform vec2 transmissionSamplerSize;\n	uniform sampler2D transmissionSamplerMap;\n	uniform mat4 modelMatrix;\n	uniform mat4 projectionMatrix;\n	varying vec3 vWorldPosition;\n	float w0( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );\n	}\n	float w1( float a ) {\n		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );\n	}\n	float w2( float a ){\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );\n	}\n	float w3( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * a * a );\n	}\n	float g0( float a ) {\n		return w0( a ) + w1( a );\n	}\n	float g1( float a ) {\n		return w2( a ) + w3( a );\n	}\n	float h0( float a ) {\n		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );\n	}\n	float h1( float a ) {\n		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );\n	}\n	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {\n		uv = uv * texelSize.zw + 0.5;\n		vec2 iuv = floor( uv );\n		vec2 fuv = fract( uv );\n		float g0x = g0( fuv.x );\n		float g1x = g1( fuv.x );\n		float h0x = h0( fuv.x );\n		float h1x = h1( fuv.x );\n		float h0y = h0( fuv.y );\n		float h1y = h1( fuv.y );\n		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +\n			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );\n	}\n	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {\n		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );\n		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );\n		vec2 fLodSizeInv = 1.0 / fLodSize;\n		vec2 cLodSizeInv = 1.0 / cLodSize;\n		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );\n		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );\n		return mix( fSample, cSample, fract( lod ) );\n	}\n	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {\n		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );\n		vec3 modelScale;\n		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );\n		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );\n		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );\n		return normalize( refractionVector ) * thickness * modelScale;\n	}\n	float applyIorToRoughness( const in float roughness, const in float ior ) {\n		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );\n	}\n	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {\n		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );\n		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );\n	}\n	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {\n		if ( isinf( attenuationDistance ) ) {\n			return vec3( 1.0 );\n		} else {\n			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;\n			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;\n		}\n	}\n	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,\n		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,\n		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,\n		const in vec3 attenuationColor, const in float attenuationDistance ) {\n		vec4 transmittedLight;\n		vec3 transmittance;\n		#ifdef USE_DISPERSION\n			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;\n			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );\n			for ( int i = 0; i < 3; i ++ ) {\n				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );\n				vec3 refractedRayExit = position + transmissionRay;\n				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n				vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n				refractionCoords += 1.0;\n				refractionCoords /= 2.0;\n				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );\n				transmittedLight[ i ] = transmissionSample[ i ];\n				transmittedLight.a += transmissionSample.a;\n				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];\n			}\n			transmittedLight.a /= 3.0;\n		#else\n			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );\n			vec3 refractedRayExit = position + transmissionRay;\n			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n			vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n			refractionCoords += 1.0;\n			refractionCoords /= 2.0;\n			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );\n			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );\n		#endif\n		vec3 attenuatedColor = transmittance * transmittedLight.rgb;\n		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );\n		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;\n		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );\n	}\n#endif",
	uv_pars_fragment: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
	uv_pars_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	uniform mat3 mapTransform;\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform mat3 alphaMapTransform;\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	uniform mat3 lightMapTransform;\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	uniform mat3 aoMapTransform;\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	uniform mat3 bumpMapTransform;\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	uniform mat3 normalMapTransform;\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	uniform mat3 displacementMapTransform;\n	varying vec2 vDisplacementMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	uniform mat3 emissiveMapTransform;\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	uniform mat3 metalnessMapTransform;\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	uniform mat3 roughnessMapTransform;\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	uniform mat3 anisotropyMapTransform;\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	uniform mat3 clearcoatMapTransform;\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform mat3 clearcoatNormalMapTransform;\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform mat3 clearcoatRoughnessMapTransform;\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	uniform mat3 sheenColorMapTransform;\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	uniform mat3 sheenRoughnessMapTransform;\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	uniform mat3 iridescenceMapTransform;\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform mat3 iridescenceThicknessMapTransform;\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	uniform mat3 specularMapTransform;\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	uniform mat3 specularColorMapTransform;\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	uniform mat3 specularIntensityMapTransform;\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
	uv_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	vUv = vec3( uv, 1 ).xy;\n#endif\n#ifdef USE_MAP\n	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ALPHAMAP\n	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_LIGHTMAP\n	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_AOMAP\n	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_BUMPMAP\n	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_NORMALMAP\n	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_EMISSIVEMAP\n	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_METALNESSMAP\n	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOATMAP\n	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULARMAP\n	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_THICKNESSMAP\n	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;\n#endif",
	worldpos_vertex: "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n	vec4 worldPosition = vec4( transformed, 1.0 );\n	#ifdef USE_BATCHING\n		worldPosition = batchingMatrix * worldPosition;\n	#endif\n	#ifdef USE_INSTANCING\n		worldPosition = instanceMatrix * worldPosition;\n	#endif\n	worldPosition = modelMatrix * worldPosition;\n#endif",
	background_vert: "varying vec2 vUv;\nuniform mat3 uvTransform;\nvoid main() {\n	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	gl_Position = vec4( position.xy, 1.0, 1.0 );\n}",
	background_frag: "uniform sampler2D t2D;\nuniform float backgroundIntensity;\nvarying vec2 vUv;\nvoid main() {\n	vec4 texColor = texture2D( t2D, vUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	backgroundCube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
	backgroundCube_frag: "#ifdef ENVMAP_TYPE_CUBE\n	uniform samplerCube envMap;\n#elif defined( ENVMAP_TYPE_CUBE_UV )\n	uniform sampler2D envMap;\n#endif\nuniform float backgroundBlurriness;\nuniform float backgroundIntensity;\nuniform mat3 backgroundRotation;\nvarying vec3 vWorldDirection;\n#include <cube_uv_reflection_fragment>\nvoid main() {\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );\n	#elif defined( ENVMAP_TYPE_CUBE_UV )\n		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );\n	#else\n		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	cube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
	cube_frag: "uniform samplerCube tCube;\nuniform float tFlip;\nuniform float opacity;\nvarying vec3 vWorldDirection;\nvoid main() {\n	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );\n	gl_FragColor = texColor;\n	gl_FragColor.a *= opacity;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	depth_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vHighPrecisionZW = gl_Position.zw;\n}",
	depth_frag: "#if DEPTH_PACKING == 3200\n	uniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#if DEPTH_PACKING == 3200\n		diffuseColor.a = opacity;\n	#endif\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <logdepthbuf_fragment>\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];\n	#else\n		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;\n	#endif\n	#if DEPTH_PACKING == 3200\n		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );\n	#elif DEPTH_PACKING == 3201\n		gl_FragColor = packDepthToRGBA( fragCoordZ );\n	#elif DEPTH_PACKING == 3202\n		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );\n	#elif DEPTH_PACKING == 3203\n		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );\n	#endif\n}",
	distance_vert: "#define DISTANCE\nvarying vec3 vWorldPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <worldpos_vertex>\n	#include <clipping_planes_vertex>\n	vWorldPosition = worldPosition.xyz;\n}",
	distance_frag: "#define DISTANCE\nuniform vec3 referencePosition;\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	float dist = length( vWorldPosition - referencePosition );\n	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n	dist = saturate( dist );\n	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );\n}",
	equirect_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n}",
	equirect_frag: "uniform sampler2D tEquirect;\nvarying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vec3 direction = normalize( vWorldDirection );\n	vec2 sampleUV = equirectUv( direction );\n	gl_FragColor = texture2D( tEquirect, sampleUV );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	linedashed_vert: "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vLineDistance = scale * lineDistance;\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
	linedashed_frag: "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n		discard;\n	}\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	meshbasic_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinbase_vertex>\n		#include <skinnormal_vertex>\n		#include <defaultnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <fog_vertex>\n}",
	meshbasic_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;\n	#else\n		reflectedLight.indirectDiffuse += vec3( 1.0 );\n	#endif\n	#include <aomap_fragment>\n	reflectedLight.indirectDiffuse *= diffuseColor.rgb;\n	vec3 outgoingLight = reflectedLight.indirectDiffuse;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshlambert_vert: "#define LAMBERT\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshlambert_frag: "#define LAMBERT\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_lambert_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_lambert_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshmatcap_vert: "#define MATCAP\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n	vViewPosition = - mvPosition.xyz;\n}",
	meshmatcap_frag: "#define MATCAP\nuniform vec3 diffuse;\nuniform float opacity;\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	vec3 viewDir = normalize( vViewPosition );\n	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n	vec3 y = cross( viewDir, x );\n	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;\n	#ifdef USE_MATCAP\n		vec4 matcapColor = texture2D( matcap, uv );\n	#else\n		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );\n	#endif\n	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshnormal_vert: "#define NORMAL\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	vViewPosition = - mvPosition.xyz;\n#endif\n}",
	meshnormal_frag: "#define NORMAL\nuniform float opacity;\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <uv_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );\n	#ifdef OPAQUE\n		gl_FragColor.a = 1.0;\n	#endif\n}",
	meshphong_vert: "#define PHONG\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshphong_frag: "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshphysical_vert: "#define STANDARD\nvarying vec3 vViewPosition;\n#ifdef USE_TRANSMISSION\n	varying vec3 vWorldPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n#ifdef USE_TRANSMISSION\n	vWorldPosition = worldPosition.xyz;\n#endif\n}",
	meshphysical_frag: "#define STANDARD\n#ifdef PHYSICAL\n	#define IOR\n	#define USE_SPECULAR\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef IOR\n	uniform float ior;\n#endif\n#ifdef USE_SPECULAR\n	uniform float specularIntensity;\n	uniform vec3 specularColor;\n	#ifdef USE_SPECULAR_COLORMAP\n		uniform sampler2D specularColorMap;\n	#endif\n	#ifdef USE_SPECULAR_INTENSITYMAP\n		uniform sampler2D specularIntensityMap;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT\n	uniform float clearcoat;\n	uniform float clearcoatRoughness;\n#endif\n#ifdef USE_DISPERSION\n	uniform float dispersion;\n#endif\n#ifdef USE_RETROREFLECTION\n	uniform float retroreflectivity;\n#endif\n#ifdef USE_IRIDESCENCE\n	uniform float iridescence;\n	uniform float iridescenceIOR;\n	uniform float iridescenceThicknessMinimum;\n	uniform float iridescenceThicknessMaximum;\n#endif\n#ifdef USE_SHEEN\n	uniform vec3 sheenColor;\n	uniform float sheenRoughness;\n	#ifdef USE_SHEEN_COLORMAP\n		uniform sampler2D sheenColorMap;\n	#endif\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		uniform sampler2D sheenRoughnessMap;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	uniform vec2 anisotropyVector;\n	#ifdef USE_ANISOTROPYMAP\n		uniform sampler2D anisotropyMap;\n	#endif\n#endif\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <iridescence_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_physical_pars_fragment>\n#include <transmission_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <clearcoat_pars_fragment>\n#include <iridescence_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <roughnessmap_fragment>\n	#include <metalnessmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <clearcoat_normal_fragment_begin>\n	#include <clearcoat_normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_physical_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;\n	#include <transmission_fragment>\n	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;\n	#ifdef USE_SHEEN\n \n		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;\n \n 	#endif\n	#ifdef USE_CLEARCOAT\n		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );\n		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );\n		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;\n	#endif\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshtoon_vert: "#define TOON\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshtoon_frag: "#define TOON\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_toon_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_toon_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	points_vert: "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n#ifdef USE_POINTS_UV\n	varying vec2 vUv;\n	uniform mat3 uvTransform;\n#endif\nvoid main() {\n	#ifdef USE_POINTS_UV\n		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	#endif\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	gl_PointSize = size;\n	#ifdef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );\n	#endif\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <fog_vertex>\n}",
	points_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_particle_fragment>\n	#include <color_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	shadow_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <shadowmap_pars_vertex>\nvoid main() {\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	shadow_frag: "uniform vec3 color;\nuniform float opacity;\n#include <common>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <logdepthbuf_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n	#include <logdepthbuf_fragment>\n	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	sprite_vert: "uniform float rotation;\nuniform vec2 center;\n#include <common>\n#include <uv_pars_vertex>\n#include <fog_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	vec4 mvPosition = modelViewMatrix[ 3 ];\n	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );\n	#ifndef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) scale *= - mvPosition.z;\n	#endif\n	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;\n	vec2 rotatedPosition;\n	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n	mvPosition.xy += rotatedPosition;\n	gl_Position = projectionMatrix * mvPosition;\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
	sprite_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n}"
}, Q = {
	common: {
		diffuse: { value: /*@__PURE__*/ new N(16777215) },
		opacity: { value: 1 },
		map: { value: null },
		mapTransform: { value: /*@__PURE__*/ new A() },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new A() },
		alphaTest: { value: 0 }
	},
	specularmap: {
		specularMap: { value: null },
		specularMapTransform: { value: /*@__PURE__*/ new A() }
	},
	envmap: {
		envMap: { value: null },
		envMapRotation: { value: /*@__PURE__*/ new A() },
		reflectivity: { value: 1 },
		ior: { value: 1.5 },
		refractionRatio: { value: .98 },
		dfgLUT: { value: null }
	},
	aomap: {
		aoMap: { value: null },
		aoMapIntensity: { value: 1 },
		aoMapTransform: { value: /*@__PURE__*/ new A() }
	},
	lightmap: {
		lightMap: { value: null },
		lightMapIntensity: { value: 1 },
		lightMapTransform: { value: /*@__PURE__*/ new A() }
	},
	bumpmap: {
		bumpMap: { value: null },
		bumpMapTransform: { value: /*@__PURE__*/ new A() },
		bumpScale: { value: 1 }
	},
	normalmap: {
		normalMap: { value: null },
		normalMapTransform: { value: /*@__PURE__*/ new A() },
		normalScale: { value: /*@__PURE__*/ new D(1, 1) }
	},
	displacementmap: {
		displacementMap: { value: null },
		displacementMapTransform: { value: /*@__PURE__*/ new A() },
		displacementScale: { value: 1 },
		displacementBias: { value: 0 }
	},
	emissivemap: {
		emissiveMap: { value: null },
		emissiveMapTransform: { value: /*@__PURE__*/ new A() }
	},
	metalnessmap: {
		metalnessMap: { value: null },
		metalnessMapTransform: { value: /*@__PURE__*/ new A() }
	},
	roughnessmap: {
		roughnessMap: { value: null },
		roughnessMapTransform: { value: /*@__PURE__*/ new A() }
	},
	gradientmap: { gradientMap: { value: null } },
	fog: {
		fogDensity: { value: 25e-5 },
		fogNear: { value: 1 },
		fogFar: { value: 2e3 },
		fogColor: { value: /*@__PURE__*/ new N(16777215) }
	},
	lights: {
		ambientLightColor: { value: [] },
		lightProbe: { value: [] },
		sunLights: {
			value: [],
			properties: {
				direction: {},
				color: {}
			}
		},
		sunLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		sunShadowMatrix: { value: [] },
		sunShadowCascade: { value: [] },
		directionalLights: {
			value: [],
			properties: {
				direction: {},
				color: {}
			}
		},
		directionalLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		directionalShadowMatrix: { value: [] },
		spotLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				direction: {},
				distance: {},
				coneCos: {},
				penumbraCos: {},
				decay: {}
			}
		},
		spotLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		spotLightMap: { value: [] },
		spotLightMatrix: { value: [] },
		pointLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				decay: {},
				distance: {}
			}
		},
		pointLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {},
				shadowCameraNear: {},
				shadowCameraFar: {}
			}
		},
		pointShadowMatrix: { value: [] },
		hemisphereLights: {
			value: [],
			properties: {
				direction: {},
				skyColor: {},
				groundColor: {}
			}
		},
		rectAreaLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				width: {},
				height: {}
			}
		},
		ltc_1: { value: null },
		ltc_2: { value: null },
		probesSH: { value: null },
		probesMin: { value: /*@__PURE__*/ new G() },
		probesMax: { value: /*@__PURE__*/ new G() },
		probesResolution: { value: /*@__PURE__*/ new G() }
	},
	points: {
		diffuse: { value: /*@__PURE__*/ new N(16777215) },
		opacity: { value: 1 },
		size: { value: 1 },
		scale: { value: 1 },
		map: { value: null },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new A() },
		alphaTest: { value: 0 },
		uvTransform: { value: /*@__PURE__*/ new A() }
	},
	sprite: {
		diffuse: { value: /*@__PURE__*/ new N(16777215) },
		opacity: { value: 1 },
		center: { value: /*@__PURE__*/ new D(.5, .5) },
		rotation: { value: 0 },
		map: { value: null },
		mapTransform: { value: /*@__PURE__*/ new A() },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new A() },
		alphaTest: { value: 0 }
	}
}, et = {
	basic: {
		uniforms: /*@__PURE__*/ L([
			Q.common,
			Q.specularmap,
			Q.envmap,
			Q.aomap,
			Q.lightmap,
			Q.fog
		]),
		vertexShader: Z.meshbasic_vert,
		fragmentShader: Z.meshbasic_frag
	},
	lambert: {
		uniforms: /*@__PURE__*/ L([
			Q.common,
			Q.specularmap,
			Q.envmap,
			Q.aomap,
			Q.lightmap,
			Q.emissivemap,
			Q.bumpmap,
			Q.normalmap,
			Q.displacementmap,
			Q.fog,
			Q.lights,
			{
				emissive: { value: /*@__PURE__*/ new N(0) },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: Z.meshlambert_vert,
		fragmentShader: Z.meshlambert_frag
	},
	phong: {
		uniforms: /*@__PURE__*/ L([
			Q.common,
			Q.specularmap,
			Q.envmap,
			Q.aomap,
			Q.lightmap,
			Q.emissivemap,
			Q.bumpmap,
			Q.normalmap,
			Q.displacementmap,
			Q.fog,
			Q.lights,
			{
				emissive: { value: /*@__PURE__*/ new N(0) },
				specular: { value: /*@__PURE__*/ new N(1118481) },
				shininess: { value: 30 },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: Z.meshphong_vert,
		fragmentShader: Z.meshphong_frag
	},
	standard: {
		uniforms: /*@__PURE__*/ L([
			Q.common,
			Q.envmap,
			Q.aomap,
			Q.lightmap,
			Q.emissivemap,
			Q.bumpmap,
			Q.normalmap,
			Q.displacementmap,
			Q.roughnessmap,
			Q.metalnessmap,
			Q.fog,
			Q.lights,
			{
				emissive: { value: /*@__PURE__*/ new N(0) },
				roughness: { value: 1 },
				metalness: { value: 0 },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: Z.meshphysical_vert,
		fragmentShader: Z.meshphysical_frag
	},
	toon: {
		uniforms: /*@__PURE__*/ L([
			Q.common,
			Q.aomap,
			Q.lightmap,
			Q.emissivemap,
			Q.bumpmap,
			Q.normalmap,
			Q.displacementmap,
			Q.gradientmap,
			Q.fog,
			Q.lights,
			{ emissive: { value: /*@__PURE__*/ new N(0) } }
		]),
		vertexShader: Z.meshtoon_vert,
		fragmentShader: Z.meshtoon_frag
	},
	matcap: {
		uniforms: /*@__PURE__*/ L([
			Q.common,
			Q.bumpmap,
			Q.normalmap,
			Q.displacementmap,
			Q.fog,
			{ matcap: { value: null } }
		]),
		vertexShader: Z.meshmatcap_vert,
		fragmentShader: Z.meshmatcap_frag
	},
	points: {
		uniforms: /*@__PURE__*/ L([Q.points, Q.fog]),
		vertexShader: Z.points_vert,
		fragmentShader: Z.points_frag
	},
	dashed: {
		uniforms: /*@__PURE__*/ L([
			Q.common,
			Q.fog,
			{
				scale: { value: 1 },
				dashSize: { value: 1 },
				totalSize: { value: 2 }
			}
		]),
		vertexShader: Z.linedashed_vert,
		fragmentShader: Z.linedashed_frag
	},
	depth: {
		uniforms: /*@__PURE__*/ L([Q.common, Q.displacementmap]),
		vertexShader: Z.depth_vert,
		fragmentShader: Z.depth_frag
	},
	normal: {
		uniforms: /*@__PURE__*/ L([
			Q.common,
			Q.bumpmap,
			Q.normalmap,
			Q.displacementmap,
			{ opacity: { value: 1 } }
		]),
		vertexShader: Z.meshnormal_vert,
		fragmentShader: Z.meshnormal_frag
	},
	sprite: {
		uniforms: /*@__PURE__*/ L([Q.sprite, Q.fog]),
		vertexShader: Z.sprite_vert,
		fragmentShader: Z.sprite_frag
	},
	background: {
		uniforms: {
			uvTransform: { value: /*@__PURE__*/ new A() },
			t2D: { value: null },
			backgroundIntensity: { value: 1 }
		},
		vertexShader: Z.background_vert,
		fragmentShader: Z.background_frag
	},
	backgroundCube: {
		uniforms: {
			envMap: { value: null },
			backgroundBlurriness: { value: 0 },
			backgroundIntensity: { value: 1 },
			backgroundRotation: { value: /*@__PURE__*/ new A() }
		},
		vertexShader: Z.backgroundCube_vert,
		fragmentShader: Z.backgroundCube_frag
	},
	cube: {
		uniforms: {
			tCube: { value: null },
			tFlip: { value: -1 },
			opacity: { value: 1 }
		},
		vertexShader: Z.cube_vert,
		fragmentShader: Z.cube_frag
	},
	equirect: {
		uniforms: { tEquirect: { value: null } },
		vertexShader: Z.equirect_vert,
		fragmentShader: Z.equirect_frag
	},
	distance: {
		uniforms: /*@__PURE__*/ L([
			Q.common,
			Q.displacementmap,
			{
				referencePosition: { value: /*@__PURE__*/ new G() },
				nearDistance: { value: 1 },
				farDistance: { value: 1e3 }
			}
		]),
		vertexShader: Z.distance_vert,
		fragmentShader: Z.distance_frag
	},
	shadow: {
		uniforms: /*@__PURE__*/ L([
			Q.lights,
			Q.fog,
			{
				color: { value: /*@__PURE__*/ new N(0) },
				opacity: { value: 1 }
			}
		]),
		vertexShader: Z.shadow_vert,
		fragmentShader: Z.shadow_frag
	}
};
et.physical = {
	uniforms: /*@__PURE__*/ L([et.standard.uniforms, {
		clearcoat: { value: 0 },
		clearcoatMap: { value: null },
		clearcoatMapTransform: { value: /*@__PURE__*/ new A() },
		clearcoatNormalMap: { value: null },
		clearcoatNormalMapTransform: { value: /*@__PURE__*/ new A() },
		clearcoatNormalScale: { value: /*@__PURE__*/ new D(1, 1) },
		clearcoatRoughness: { value: 0 },
		clearcoatRoughnessMap: { value: null },
		clearcoatRoughnessMapTransform: { value: /*@__PURE__*/ new A() },
		dispersion: { value: 0 },
		retroreflectivity: { value: 0 },
		iridescence: { value: 0 },
		iridescenceMap: { value: null },
		iridescenceMapTransform: { value: /*@__PURE__*/ new A() },
		iridescenceIOR: { value: 1.3 },
		iridescenceThicknessMinimum: { value: 100 },
		iridescenceThicknessMaximum: { value: 400 },
		iridescenceThicknessMap: { value: null },
		iridescenceThicknessMapTransform: { value: /*@__PURE__*/ new A() },
		sheen: { value: 0 },
		sheenColor: { value: /*@__PURE__*/ new N(0) },
		sheenColorMap: { value: null },
		sheenColorMapTransform: { value: /*@__PURE__*/ new A() },
		sheenRoughness: { value: 1 },
		sheenRoughnessMap: { value: null },
		sheenRoughnessMapTransform: { value: /*@__PURE__*/ new A() },
		transmission: { value: 0 },
		transmissionMap: { value: null },
		transmissionMapTransform: { value: /*@__PURE__*/ new A() },
		transmissionSamplerSize: { value: /*@__PURE__*/ new D() },
		transmissionSamplerMap: { value: null },
		thickness: { value: 0 },
		thicknessMap: { value: null },
		thicknessMapTransform: { value: /*@__PURE__*/ new A() },
		attenuationDistance: { value: 0 },
		attenuationColor: { value: /*@__PURE__*/ new N(0) },
		specularColor: { value: /*@__PURE__*/ new N(1, 1, 1) },
		specularColorMap: { value: null },
		specularColorMapTransform: { value: /*@__PURE__*/ new A() },
		specularIntensity: { value: 1 },
		specularIntensityMap: { value: null },
		specularIntensityMapTransform: { value: /*@__PURE__*/ new A() },
		anisotropyVector: { value: /*@__PURE__*/ new D() },
		anisotropyMap: { value: null },
		anisotropyMapTransform: { value: /*@__PURE__*/ new A() }
	}]),
	vertexShader: Z.meshphysical_vert,
	fragmentShader: Z.meshphysical_frag
};
var tt = {
	r: 0,
	b: 0,
	g: 0
}, nt = /*@__PURE__*/ new e(), rt = /*@__PURE__*/ new A();
rt.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function it(e, t, n, r, i, a) {
	let s = new N(0), c = i === !0 ? 0 : 1, l, u, d = null, f = 0, p = null;
	function m(e) {
		let n = e.isScene === !0 ? e.background : null;
		if (n && n.isTexture) {
			let r = e.backgroundBlurriness > 0;
			n = t.get(n, r);
		}
		return n;
	}
	function h(t) {
		let r = !1, i = m(t);
		i === null ? _(s, c) : i && i.isColor && (_(i, 1), r = !0);
		let o = e.xr.getEnvironmentBlendMode();
		o === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : o === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (e.autoClear || r) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil));
	}
	function g(t, n) {
		let i = m(n);
		i && (i.isCubeTexture || i.mapping === 306) ? (u === void 0 && (u = new H(new ye(1, 1, 1), new U({
			name: "BackgroundCubeMaterial",
			uniforms: k(et.backgroundCube.uniforms),
			vertexShader: et.backgroundCube.vertexShader,
			fragmentShader: et.backgroundCube.fragmentShader,
			side: 1,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), u.geometry.deleteAttribute("normal"), u.geometry.deleteAttribute("uv"), u.onBeforeRender = function(e, t, n) {
			this.matrixWorld.copyPosition(n.matrixWorld);
		}, Object.defineProperty(u.material, "envMap", { get: function() {
			return this.uniforms.envMap.value;
		} }), r.update(u)), u.material.uniforms.envMap.value = i, u.material.uniforms.backgroundBlurriness.value = n.backgroundBlurriness, u.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, u.material.uniforms.backgroundRotation.value.setFromMatrix4(nt.makeRotationFromEuler(n.backgroundRotation)).transpose(), i.isCubeTexture && i.isRenderTargetTexture === !1 && u.material.uniforms.backgroundRotation.value.premultiply(rt), u.material.toneMapped = o.getTransfer(i.colorSpace) !== He, (d !== i || f !== i.version || p !== e.toneMapping) && (u.material.needsUpdate = !0, d = i, f = i.version, p = e.toneMapping), u.layers.enableAll(), t.unshift(u, u.geometry, u.material, 0, 0, null)) : i && i.isTexture && (l === void 0 && (l = new H(new me(2, 2), new U({
			name: "BackgroundMaterial",
			uniforms: k(et.background.uniforms),
			vertexShader: et.background.vertexShader,
			fragmentShader: et.background.fragmentShader,
			side: 0,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), l.geometry.deleteAttribute("normal"), Object.defineProperty(l.material, "map", { get: function() {
			return this.uniforms.t2D.value;
		} }), r.update(l)), l.material.uniforms.t2D.value = i, l.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, l.material.toneMapped = o.getTransfer(i.colorSpace) !== He, i.matrixAutoUpdate === !0 && i.updateMatrix(), l.material.uniforms.uvTransform.value.copy(i.matrix), (d !== i || f !== i.version || p !== e.toneMapping) && (l.material.needsUpdate = !0, d = i, f = i.version, p = e.toneMapping), l.layers.enableAll(), t.unshift(l, l.geometry, l.material, 0, 0, null));
	}
	function _(t, r) {
		t.getRGB(tt, Ze(e)), n.buffers.color.setClear(tt.r, tt.g, tt.b, r, a);
	}
	function v() {
		u !== void 0 && (u.geometry.dispose(), u.material.dispose(), u = void 0), l !== void 0 && (l.geometry.dispose(), l.material.dispose(), l = void 0);
	}
	return {
		getClearColor: function() {
			return s;
		},
		setClearColor: function(e, t = 1) {
			s.set(e), c = t, _(s, c);
		},
		getClearAlpha: function() {
			return c;
		},
		setClearAlpha: function(e) {
			c = e, _(s, c);
		},
		render: h,
		addToRenderList: g,
		dispose: v
	};
}
function at(e, t) {
	let n = e.getParameter(e.MAX_VERTEX_ATTRIBS), r = {}, i = f(null), a = i, o = !1;
	function s(n, r, i, s, c) {
		let u = !1, f = d(n, s, i, r);
		a !== f && (a = f, l(a.object)), u = p(n, s, i, c), u && m(n, s, i, c), c !== null && t.update(c, e.ELEMENT_ARRAY_BUFFER), (u || o) && (o = !1, b(n, r, i, s), c !== null && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t.get(c).buffer));
	}
	function c() {
		return e.createVertexArray();
	}
	function l(t) {
		return e.bindVertexArray(t);
	}
	function u(t) {
		return e.deleteVertexArray(t);
	}
	function d(e, t, n, i) {
		let a = i.wireframe === !0, o = r[t.id];
		o === void 0 && (o = {}, r[t.id] = o);
		let s = e.isInstancedMesh === !0 ? e.id : 0, l = o[s];
		l === void 0 && (l = {}, o[s] = l);
		let u = l[n.id];
		u === void 0 && (u = {}, l[n.id] = u);
		let d = u[a];
		return d === void 0 && (d = f(c()), u[a] = d), d;
	}
	function f(e) {
		let t = [], r = [], i = [];
		for (let e = 0; e < n; e++) t[e] = 0, r[e] = 0, i[e] = 0;
		return {
			geometry: null,
			program: null,
			wireframe: !1,
			newAttributes: t,
			enabledAttributes: r,
			attributeDivisors: i,
			object: e,
			attributes: {},
			index: null
		};
	}
	function p(e, t, n, r) {
		let i = a.attributes, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = i[t], r = o[t];
			if (r === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (r = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (r = e.instanceColor)), n === void 0 || n.attribute !== r || r && n.data !== r.data) return !0;
			s++;
		}
		return a.attributesNum !== s || a.index !== r;
	}
	function m(e, t, n, r) {
		let i = {}, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = o[t];
			n === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (n = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (n = e.instanceColor));
			let r = {};
			r.attribute = n, n && n.data && (r.data = n.data), i[t] = r, s++;
		}
		a.attributes = i, a.attributesNum = s, a.index = r;
	}
	function h() {
		let e = a.newAttributes;
		for (let t = 0, n = e.length; t < n; t++) e[t] = 0;
	}
	function g(e) {
		_(e, 0);
	}
	function _(t, n) {
		let r = a.newAttributes, i = a.enabledAttributes, o = a.attributeDivisors;
		r[t] = 1, i[t] === 0 && (e.enableVertexAttribArray(t), i[t] = 1), o[t] !== n && (e.vertexAttribDivisor(t, n), o[t] = n);
	}
	function v() {
		let t = a.newAttributes, n = a.enabledAttributes;
		for (let r = 0, i = n.length; r < i; r++) n[r] !== t[r] && (e.disableVertexAttribArray(r), n[r] = 0);
	}
	function y(t, n, r, i, a, o, s) {
		s === !0 ? e.vertexAttribIPointer(t, n, r, a, o) : e.vertexAttribPointer(t, n, r, i, a, o);
	}
	function b(n, r, i, a) {
		h();
		let o = a.attributes, s = i.getAttributes(), c = r.defaultAttributeValues;
		for (let r in s) {
			let i = s[r];
			if (i.location >= 0) {
				let s = o[r];
				if (s === void 0 && (r === "instanceMatrix" && n.instanceMatrix && (s = n.instanceMatrix), r === "instanceColor" && n.instanceColor && (s = n.instanceColor)), s !== void 0) {
					let r = s.normalized, o = s.itemSize, c = t.get(s);
					if (c === void 0) continue;
					let l = c.buffer, u = c.type, d = c.bytesPerElement, f = u === e.INT || u === e.UNSIGNED_INT || s.gpuType === 1013;
					if (s.isInterleavedBufferAttribute) {
						let t = s.data, c = t.stride, p = s.offset;
						if (t.isInstancedInterleavedBuffer) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, t.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = t.meshPerAttribute * t.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, c * d, (p + o / i.locationSize * e) * d, f);
					} else {
						if (s.isInstancedBufferAttribute) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, s.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = s.meshPerAttribute * s.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, o * d, o / i.locationSize * e * d, f);
					}
				} else if (c !== void 0) {
					let t = c[r];
					if (t !== void 0) switch (t.length) {
						case 2:
							e.vertexAttrib2fv(i.location, t);
							break;
						case 3:
							e.vertexAttrib3fv(i.location, t);
							break;
						case 4:
							e.vertexAttrib4fv(i.location, t);
							break;
						default: e.vertexAttrib1fv(i.location, t);
					}
				}
			}
		}
		v();
	}
	function x() {
		T();
		for (let e in r) {
			let t = r[e];
			for (let e in t) {
				let n = t[e];
				for (let e in n) {
					let t = n[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete n[e];
				}
			}
			delete r[e];
		}
	}
	function S(e) {
		if (r[e.id] === void 0) return;
		let t = r[e.id];
		for (let e in t) {
			let n = t[e];
			for (let e in n) {
				let t = n[e];
				for (let e in t) u(t[e].object), delete t[e];
				delete n[e];
			}
		}
		delete r[e.id];
	}
	function C(e) {
		for (let t in r) {
			let n = r[t];
			for (let t in n) {
				let r = n[t];
				if (r[e.id] === void 0) continue;
				let i = r[e.id];
				for (let e in i) u(i[e].object), delete i[e];
				delete r[e.id];
			}
		}
	}
	function w(e) {
		for (let t in r) {
			let n = r[t], i = e.isInstancedMesh === !0 ? e.id : 0, a = n[i];
			if (a !== void 0) {
				for (let e in a) {
					let t = a[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete a[e];
				}
				delete n[i], Object.keys(n).length === 0 && delete r[t];
			}
		}
	}
	function T() {
		E(), o = !0, a !== i && (a = i, l(a.object));
	}
	function E() {
		i.geometry = null, i.program = null, i.wireframe = !1;
	}
	return {
		setup: s,
		reset: T,
		resetDefaultState: E,
		dispose: x,
		releaseStatesOfGeometry: S,
		releaseStatesOfObject: w,
		releaseStatesOfProgram: C,
		initAttributes: h,
		enableAttribute: g,
		disableUnusedAttributes: v
	};
}
function ot(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	function a(t, i) {
		e.drawArrays(r, t, i), n.update(i, r, 1);
	}
	function o(t, i, a) {
		a !== 0 && (e.drawArraysInstanced(r, t, i, a), n.update(i, r, a));
	}
	function s(e, i, a) {
		if (a === 0) return;
		t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r, e, 0, i, 0, a);
		let o = 0;
		for (let e = 0; e < a; e++) o += i[e];
		n.update(o, r, 1);
	}
	this.setMode = i, this.render = a, this.renderInstances = o, this.renderMultiDraw = s;
}
function st(e, t, n, r) {
	let i;
	function a() {
		if (i !== void 0) return i;
		if (t.has("EXT_texture_filter_anisotropic") === !0) {
			let n = t.get("EXT_texture_filter_anisotropic");
			i = e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
		} else i = 0;
		return i;
	}
	function o(t) {
		return t === 1023 || r.convert(t) === e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT);
	}
	function s(n) {
		let i = n === 1016 && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
		return !(n !== 1009 && n !== 1015 && !i && r.convert(n) !== e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE));
	}
	function c(t) {
		if (t === "highp") {
			if (e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision > 0) return "highp";
			t = "mediump";
		}
		return t === "mediump" && e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
	}
	let l = n.precision === void 0 ? "highp" : n.precision, u = c(l);
	u !== l && (F("WebGLRenderer:", l, "not supported, using", u, "instead."), l = u);
	let d = n.logarithmicDepthBuffer === !0, f = n.reversedDepthBuffer === !0 && t.has("EXT_clip_control");
	n.reversedDepthBuffer === !0 && f === !1 && F("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");
	let p = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), m = e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS), h = e.getParameter(e.MAX_TEXTURE_SIZE), g = e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE), _ = e.getParameter(e.MAX_VERTEX_ATTRIBS), v = e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS), y = e.getParameter(e.MAX_VARYING_VECTORS), b = e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS), x = e.getParameter(e.MAX_SAMPLES), S = e.getParameter(e.SAMPLES);
	return {
		isWebGL2: !0,
		getMaxAnisotropy: a,
		getMaxPrecision: c,
		textureFormatReadable: o,
		textureTypeReadable: s,
		precision: l,
		logarithmicDepthBuffer: d,
		reversedDepthBuffer: f,
		maxTextures: p,
		maxVertexTextures: m,
		maxTextureSize: h,
		maxCubemapSize: g,
		maxAttributes: _,
		maxVertexUniforms: v,
		maxVaryings: y,
		maxFragmentUniforms: b,
		maxSamples: x,
		samples: S
	};
}
function ct(e) {
	let t = this, n = null, r = 0, i = !1, a = !1, o = new Ue(), s = new A(), c = {
		value: null,
		needsUpdate: !1
	};
	this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(e, t) {
		let n = e.length !== 0 || t || r !== 0 || i;
		return i = t, r = e.length, n;
	}, this.beginShadows = function() {
		a = !0, u(null);
	}, this.endShadows = function() {
		a = !1;
	}, this.setGlobalState = function(e, t) {
		n = u(e, t, 0);
	}, this.setState = function(t, o, s) {
		let d = t.clippingPlanes, f = t.clipIntersection, p = t.clipShadows, m = e.get(t);
		if (!i || d === null || d.length === 0 || a && !p) a ? u(null) : l();
		else {
			let e = a ? 0 : r, t = e * 4, i = m.clippingState || null;
			c.value = i, i = u(d, o, t, s);
			for (let e = 0; e !== t; ++e) i[e] = n[e];
			m.clippingState = i, this.numIntersection = f ? this.numPlanes : 0, this.numPlanes += e;
		}
	};
	function l() {
		c.value !== n && (c.value = n, c.needsUpdate = r > 0), t.numPlanes = r, t.numIntersection = 0;
	}
	function u(e, n, r, i) {
		let a = e === null ? 0 : e.length, l = null;
		if (a !== 0) {
			if (l = c.value, i !== !0 || l === null) {
				let t = r + a * 4, i = n.matrixWorldInverse;
				s.getNormalMatrix(i), (l === null || l.length < t) && (l = new Float32Array(t));
				for (let t = 0, n = r; t !== a; ++t, n += 4) o.copy(e[t]).applyMatrix4(i, s), o.normal.toArray(l, n), l[n + 3] = o.constant;
			}
			c.value = l, c.needsUpdate = !0;
		}
		return t.numPlanes = a, t.numIntersection = 0, l;
	}
}
var $ = 4, lt = 6, ut = 20, dt = 256, ft = /*@__PURE__*/ new fe(), pt = /*@__PURE__*/ new N(), mt = null, ht = 0, gt = 0, _t = !1, vt = /*@__PURE__*/ new G(), yt = /*@__PURE__*/ new G(), bt = class {
	constructor(e) {
		this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._sizeLods = [], this._lodMeshes = [], this._backgroundBox = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._blurMaterial = null, this._ggxMaterial = null;
	}
	fromScene(e, t = 0, n = .1, r = 100, i = {}) {
		let { size: a = 256, position: o = vt } = i;
		mt = this._renderer.getRenderTarget(), ht = this._renderer.getActiveCubeFace(), gt = this._renderer.getActiveMipmapLevel(), _t = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(a);
		let s = this._allocateTargets();
		return s.depthBuffer = !0, this._sceneToCubeUV(e, n, r, s, o), t > 0 && this._blur(s, 0, 0, t), this._applyPMREM(s), this._cleanup(s), s;
	}
	fromEquirectangular(e, t = null) {
		return this._fromTexture(e, t);
	}
	fromCubemap(e, t = null) {
		return this._fromTexture(e, t);
	}
	compileCubemapShader() {
		this._cubemapMaterial === null && (this._cubemapMaterial = Dt(), this._compileMaterial(this._cubemapMaterial));
	}
	compileEquirectangularShader() {
		this._equirectMaterial === null && (this._equirectMaterial = Et(), this._compileMaterial(this._equirectMaterial));
	}
	dispose() {
		this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose(), this._backgroundBox !== null && (this._backgroundBox.geometry.dispose(), this._backgroundBox.material.dispose());
	}
	_setSize(e) {
		this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = 2 ** this._lodMax;
	}
	_dispose() {
		this._blurMaterial !== null && this._blurMaterial.dispose(), this._ggxMaterial !== null && this._ggxMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
		for (let e = 0; e < this._lodMeshes.length; e++) this._lodMeshes[e].geometry.dispose();
	}
	_cleanup(e) {
		this._renderer.setRenderTarget(mt, ht, gt), this._renderer.xr.enabled = _t, e.scissorTest = !1, Ct(e, 0, 0, e.width, e.height);
	}
	_fromTexture(e, t) {
		e.mapping === 301 || e.mapping === 302 ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), mt = this._renderer.getRenderTarget(), ht = this._renderer.getActiveCubeFace(), gt = this._renderer.getActiveMipmapLevel(), _t = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
		let n = t || this._allocateTargets();
		return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
	}
	_allocateTargets() {
		let e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = {
			magFilter: q,
			minFilter: q,
			generateMipmaps: !1,
			type: I,
			format: V,
			colorSpace: R,
			depthBuffer: !1
		}, r = St(e, t, n);
		if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
			this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = St(e, t, n);
			let { _lodMax: r } = this;
			({lodMeshes: this._lodMeshes, sizeLods: this._sizeLods} = xt(r)), this._blurMaterial = Tt(r, e, t), this._ggxMaterial = wt(r, e, t);
		}
		return r;
	}
	_compileMaterial(e) {
		let t = new H(new B(), e);
		this._renderer.compile(t, ft);
	}
	_sceneToCubeUV(e, t, n, r, i) {
		let a = new ke(90, 1, t, n), o = [
			1,
			-1,
			1,
			1,
			1,
			1
		], s = [
			1,
			1,
			1,
			-1,
			-1,
			-1
		], c = this._renderer, l = c.autoClear, u = c.toneMapping;
		c.getClearColor(pt), c.toneMapping = 0, c.autoClear = !1, c.state.buffers.depth.getReversed() && (c.setRenderTarget(r), c.clearDepth(), c.setRenderTarget(null)), this._backgroundBox === null && (this._backgroundBox = new H(new ye(), new Be({
			name: "PMREM.Background",
			side: 1,
			depthWrite: !1,
			depthTest: !1
		})));
		let d = this._backgroundBox, f = d.material, p = !1, m = e.background;
		m ? m.isColor && (f.color.copy(m), e.background = null, p = !0) : (f.color.copy(pt), p = !0);
		for (let t = 0; t < 6; t++) {
			let n = t % 3;
			n === 0 ? (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x + s[t], i.y, i.z)) : n === 1 ? (a.up.set(0, 0, o[t]), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y + s[t], i.z)) : (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y, i.z + s[t]));
			let l = this._cubeSize;
			Ct(r, n * l, t > 2 ? l : 0, l, l), c.setRenderTarget(r), p && c.render(d, a), c.render(e, a);
		}
		c.toneMapping = u, c.autoClear = l, e.background = m;
	}
	_textureToCubeUV(e, t) {
		let n = this._renderer, r = e.mapping === 301 || e.mapping === 302;
		r ? (this._cubemapMaterial === null && (this._cubemapMaterial = Dt()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Et());
		let i = r ? this._cubemapMaterial : this._equirectMaterial, a = this._lodMeshes[0];
		a.material = i;
		let o = i.uniforms;
		o.envMap.value = e;
		let s = this._cubeSize;
		Ct(t, 0, 0, 3 * s, 2 * s), n.setRenderTarget(t), n.render(a, ft);
	}
	_applyPMREM(e) {
		let t = this._renderer, n = t.autoClear;
		t.autoClear = !1;
		let r = this._lodMeshes.length;
		for (let t = 1; t < r; t++) this._applyGGXFilter(e, t - 1, t);
		t.autoClear = n;
	}
	_applyGGXFilter(e, t, n) {
		let r = this._renderer, i = this._pingPongRenderTarget, a = this._ggxMaterial, o = this._lodMeshes[n];
		o.material = a;
		let s = a.uniforms, c = n / (this._lodMeshes.length - 1), l = t / (this._lodMeshes.length - 1), u = Math.sqrt(c * c - l * l) * (c * 1.25), { _lodMax: d } = this, f = this._sizeLods[n], p = 3 * f * (n > d - $ ? n - d + $ : 0), m = 4 * (this._cubeSize - f);
		s.envMap.value = e.texture, s.roughness.value = u, s.mipInt.value = d - t, Ct(i, p, m, 3 * f, 2 * f), r.setRenderTarget(i), r.render(o, ft), s.envMap.value = i.texture, s.roughness.value = 0, s.mipInt.value = d - n, Ct(e, p, m, 3 * f, 2 * f), r.setRenderTarget(e), r.render(o, ft);
	}
	_blur(e, t, n, r) {
		let i = this._pingPongRenderTarget, a = Math.min(r, Math.PI) / Math.SQRT2;
		this._blurPass(e, i, t, n, a), this._blurPass(i, e, n, n, a);
	}
	_blurPass(e, t, n, r, i) {
		let a = this._renderer, o = this._blurMaterial, s = this._lodMeshes[r];
		s.material = o;
		let c = o.uniforms;
		c.envMap.value = e.texture, c.sigma.value = i, c.mipInt.value = this._lodMax - n;
		let l = this._sizeLods[r];
		Ct(t, 3 * l * (r > this._lodMax - $ ? r - this._lodMax + $ : 0), 4 * (this._cubeSize - l), 3 * l, 2 * l), a.setRenderTarget(t), a.render(s, ft);
	}
};
function xt(e) {
	let t = [], n = [], r = e, i = e - $ + 1 + lt;
	for (let e = 0; e < i; e++) {
		let e = 2 ** r;
		t.push(e);
		let i = 1 / (e - 2), a = -i, o = 1 + i, s = [
			a,
			a,
			o,
			a,
			o,
			o,
			a,
			a,
			o,
			o,
			a,
			o
		], c = /* @__PURE__ */ new Float32Array(108), l = /* @__PURE__ */ new Float32Array(108);
		for (let e = 0; e < 6; e++) {
			let t = e % 3 * 2 / 3 - 1, n = e > 2 ? 0 : -1, r = [
				t,
				n,
				0,
				t + 2 / 3,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n + 1,
				0
			];
			c.set(r, 18 * e);
			for (let t = 0; t < 6; t++) {
				let n = s[t * 2] * 2 - 1, r = s[t * 2 + 1] * 2 - 1;
				e === 0 ? yt.set(1, r, n) : e === 1 ? yt.set(-n, 1, -r) : e === 2 ? yt.set(-n, r, 1) : e === 3 ? yt.set(-1, r, -n) : e === 4 ? yt.set(-n, -1, r) : yt.set(n, r, -1), yt.toArray(l, (e * 6 + t) * 3);
			}
		}
		let u = new B();
		u.setAttribute("position", new W(c, 3)), u.setAttribute("outputDirection", new W(l, 3)), n.push(new H(u, null)), r > $ && r--;
	}
	return {
		lodMeshes: n,
		sizeLods: t
	};
}
function St(e, t, n) {
	let r = new C(e, t, n);
	return r.texture.mapping = 306, r.texture.name = "PMREM.cubeUv", r.scissorTest = !0, r;
}
function Ct(e, t, n, r, i) {
	e.viewport.set(t, n, r, i), e.scissor.set(t, n, r, i);
}
function wt(e, t, n) {
	return new U({
		name: "PMREMGGXConvolution",
		defines: {
			GGX_SAMPLES: dt,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			roughness: { value: 0 },
			mipInt: { value: 0 }
		},
		vertexShader: Ot(),
		fragmentShader: "\n\n			precision highp float;\n			precision highp int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform float roughness;\n			uniform float mipInt;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			#define PI 3.14159265359\n\n			// Van der Corput radical inverse\n			float radicalInverse_VdC(uint bits) {\n				bits = (bits << 16u) | (bits >> 16u);\n				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);\n				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);\n				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);\n				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);\n				return float(bits) * 2.3283064365386963e-10; // / 0x100000000\n			}\n\n			// Hammersley sequence\n			vec2 hammersley(uint i, uint N) {\n				return vec2(float(i) / float(N), radicalInverse_VdC(i));\n			}\n\n			// GGX VNDF importance sampling (Eric Heitz 2018)\n			// \"Sampling the GGX Distribution of Visible Normals\"\n			// https://jcgt.org/published/0007/04/01/\n			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {\n				float alpha = roughness * roughness;\n\n				// Section 4.1: Orthonormal basis\n				vec3 T1 = vec3(1.0, 0.0, 0.0);\n				vec3 T2 = cross(V, T1);\n\n				// Section 4.2: Parameterization of projected area\n				float r = sqrt(Xi.x);\n				float phi = 2.0 * PI * Xi.y;\n				float t1 = r * cos(phi);\n				float t2 = r * sin(phi);\n				float s = 0.5 * (1.0 + V.z);\n				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;\n\n				// Section 4.3: Reprojection onto hemisphere\n				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;\n\n				// Section 3.4: Transform back to ellipsoid configuration\n				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));\n			}\n\n			void main() {\n				vec3 N = normalize(vOutputDirection);\n				vec3 V = N; // Assume view direction equals normal for pre-filtering\n\n				vec3 prefilteredColor = vec3(0.0);\n				float totalWeight = 0.0;\n\n				// For very low roughness, just sample the environment directly\n				if (roughness < 0.001) {\n					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);\n					return;\n				}\n\n				// Tangent space basis for VNDF sampling\n				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);\n				vec3 tangent = normalize(cross(up, N));\n				vec3 bitangent = cross(N, tangent);\n\n				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {\n					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));\n\n					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)\n					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);\n\n					// Transform H back to world space\n					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);\n					vec3 L = normalize(2.0 * dot(V, H) * H - V);\n\n					float NdotL = max(dot(N, L), 0.0);\n\n					if(NdotL > 0.0) {\n						// Sample environment at fixed mip level\n						// VNDF importance sampling handles the distribution filtering\n						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);\n\n						// Weight by NdotL for the split-sum approximation\n						// VNDF PDF naturally accounts for the visible microfacet distribution\n						prefilteredColor += sampleColor * NdotL;\n						totalWeight += NdotL;\n					}\n				}\n\n				if (totalWeight > 0.0) {\n					prefilteredColor = prefilteredColor / totalWeight;\n				}\n\n				gl_FragColor = vec4(prefilteredColor, 1.0);\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Tt(e, t, n) {
	return new U({
		name: "SphericalGaussianBlur",
		defines: {
			SAMPLES: ut,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			sigma: { value: 0 },
			mipInt: { value: 0 }
		},
		vertexShader: Ot(),
		fragmentShader: "\n\n			precision highp float;\n			precision highp int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform float sigma;\n			uniform float mipInt;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			#define PI 3.14159265359\n			#define GOLDEN_ANGLE 2.39996322973\n\n			void main() {\n\n				if ( sigma == 0.0 ) {\n\n					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );\n					return;\n\n				}\n\n				vec3 outputDirection = normalize( vOutputDirection );\n\n				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );\n				vec3 tangent = normalize( cross( up, outputDirection ) );\n				vec3 bitangent = cross( outputDirection, tangent );\n\n				// Truncate the kernel at three standard deviations or at the antipode.\n				float thetaMax = min( 3.0 * sigma, PI );\n				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );\n\n				vec3 accumColor = vec3( 0.0 );\n				float accumWeight = 0.0;\n\n				for ( int i = 0; i < SAMPLES; i ++ ) {\n\n					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.\n					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );\n					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );\n					float phi = float( i ) * GOLDEN_ANGLE;\n\n					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;\n					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;\n\n					// Correct the planar sample density to solid angle.\n					float weight = sin( theta ) / theta;\n\n					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );\n					accumWeight += weight;\n\n				}\n\n				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Et() {
	return new U({
		name: "EquirectangularToCubeUV",
		uniforms: { envMap: { value: null } },
		vertexShader: Ot(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n\n			#include <common>\n\n			void main() {\n\n				vec3 outputDirection = normalize( vOutputDirection );\n				vec2 uv = equirectUv( outputDirection );\n\n				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Dt() {
	return new U({
		name: "CubemapToCubeUV",
		uniforms: {
			envMap: { value: null },
			flipEnvMap: { value: -1 }
		},
		vertexShader: Ot(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			uniform float flipEnvMap;\n\n			varying vec3 vOutputDirection;\n\n			uniform samplerCube envMap;\n\n			void main() {\n\n				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Ot() {
	return "\n\n		precision mediump float;\n		precision mediump int;\n\n		attribute vec3 outputDirection;\n\n		varying vec3 vOutputDirection;\n\n		void main() {\n\n			vOutputDirection = outputDirection;\n			gl_Position = vec4( position, 1.0 );\n\n		}\n	";
}
var kt = class extends C {
	constructor(e = 1, t = {}) {
		super(e, e, t), this.isWebGLCubeRenderTarget = !0;
		let n = {
			width: e,
			height: e,
			depth: 1
		}, r = [
			n,
			n,
			n,
			n,
			n,
			n
		];
		this.texture = new l(r), this._setTextureOptions(t), this.texture.isRenderTargetTexture = !0;
	}
	fromEquirectangularTexture(e, t) {
		this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
		let n = {
			uniforms: { tEquirect: { value: null } },
			vertexShader: "\n\n				varying vec3 vWorldDirection;\n\n				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n				}\n\n				void main() {\n\n					vWorldDirection = transformDirection( position, modelMatrix );\n\n					#include <begin_vertex>\n					#include <project_vertex>\n\n				}\n			",
			fragmentShader: "\n\n				uniform sampler2D tEquirect;\n\n				varying vec3 vWorldDirection;\n\n				#include <common>\n\n				void main() {\n\n					vec3 direction = normalize( vWorldDirection );\n\n					vec2 sampleUV = equirectUv( direction );\n\n					gl_FragColor = texture2D( tEquirect, sampleUV );\n\n				}\n			"
		}, r = new ye(5, 5, 5), i = new U({
			name: "CubemapFromEquirect",
			uniforms: k(n.uniforms),
			vertexShader: n.vertexShader,
			fragmentShader: n.fragmentShader,
			side: 1,
			blending: 0
		});
		i.uniforms.tEquirect.value = t;
		let a = new H(r, i), o = t.minFilter;
		return t.minFilter === 1008 && (t.minFilter = q), new Ge(1, 10, this).update(e, a), t.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
	}
	clear(e, t = !0, n = !0, r = !0) {
		let i = e.getRenderTarget();
		for (let i = 0; i < 6; i++) e.setRenderTarget(this, i), e.clear(t, n, r);
		e.setRenderTarget(i);
	}
};
function At(e) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r = null;
	function i(e, t = !1) {
		return e == null ? null : t ? o(e) : a(e);
	}
	function a(n) {
		if (n && n.isTexture) {
			let r = n.mapping;
			if (r === 303 || r === 304) {
				if (t.has(n)) {
					let e = t.get(n).texture;
					return s(e, n.mapping);
				}
				{
					let r = n.image;
					if (r && r.height > 0) {
						let i = new kt(r.height);
						return i.fromEquirectangularTexture(e, n), t.set(n, i), n.addEventListener("dispose", l), s(i.texture, n.mapping);
					}
					return null;
				}
			}
		}
		return n;
	}
	function o(t) {
		if (t && t.isTexture) {
			let i = t.mapping, a = i === 303 || i === 304, o = i === 301 || i === 302;
			if (a || o) {
				let i = n.get(t), s = i === void 0 ? 0 : i.texture.pmremVersion;
				if (t.isRenderTargetTexture && t.pmremVersion !== s) return r === null && (r = new bt(e)), i = a ? r.fromEquirectangular(t, i) : r.fromCubemap(t, i), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), i.texture;
				if (i !== void 0) return i.texture;
				{
					let s = t.image;
					return a && s && s.height > 0 || o && s && c(s) ? (r === null && (r = new bt(e)), i = a ? r.fromEquirectangular(t) : r.fromCubemap(t), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), t.addEventListener("dispose", u), i.texture) : null;
				}
			}
		}
		return t;
	}
	function s(e, t) {
		return t === 303 ? e.mapping = 301 : t === 304 && (e.mapping = 302), e;
	}
	function c(e) {
		let t = 0;
		for (let n = 0; n < 6; n++) e[n] !== void 0 && t++;
		return t === 6;
	}
	function l(e) {
		let n = e.target;
		n.removeEventListener("dispose", l);
		let r = t.get(n);
		r !== void 0 && (t.delete(n), r.dispose());
	}
	function u(e) {
		let t = e.target;
		t.removeEventListener("dispose", u);
		let r = n.get(t);
		r !== void 0 && (n.delete(t), r.dispose());
	}
	function d() {
		t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r !== null && (r.dispose(), r = null);
	}
	return {
		get: i,
		dispose: d
	};
}
function jt(e) {
	let t = {};
	function n(n) {
		if (t[n] !== void 0) return t[n];
		let r = e.getExtension(n);
		return t[n] = r, r;
	}
	return {
		has: function(e) {
			return n(e) !== null;
		},
		init: function() {
			n("EXT_color_buffer_float"), n("WEBGL_clip_cull_distance"), n("OES_texture_float_linear"), n("EXT_color_buffer_half_float"), n("WEBGL_multisampled_render_to_texture"), n("WEBGL_render_shared_exponent");
		},
		get: function(e) {
			let t = n(e);
			return t === null && ie("WebGLRenderer: " + e + " extension not supported."), t;
		}
	};
}
function Mt(e, t, n, r) {
	let i = {}, a = /* @__PURE__ */ new WeakMap();
	function o(e) {
		let s = e.target;
		s.index !== null && t.remove(s.index);
		for (let e in s.attributes) t.remove(s.attributes[e]);
		s.removeEventListener("dispose", o), delete i[s.id];
		let c = a.get(s);
		c && (t.remove(c), a.delete(s)), r.releaseStatesOfGeometry(s), s.isInstancedBufferGeometry === !0 && delete s._maxInstanceCount, n.memory.geometries--;
	}
	function s(e, t) {
		return i[t.id] === !0 || (t.addEventListener("dispose", o), i[t.id] = !0, n.memory.geometries++), t;
	}
	function c(n) {
		let r = n.attributes;
		for (let n in r) t.update(r[n], e.ARRAY_BUFFER);
	}
	function l(e) {
		let n = [], r = e.index, i = e.attributes.position, o = 0;
		if (i === void 0) return;
		if (r !== null) {
			let e = r.array;
			o = r.version;
			for (let t = 0, r = e.length; t < r; t += 3) {
				let r = e[t + 0], i = e[t + 1], a = e[t + 2];
				n.push(r, i, i, a, a, r);
			}
		} else {
			let e = i.array;
			o = i.version;
			for (let t = 0, r = e.length / 3 - 1; t < r; t += 3) {
				let e = t + 0, r = t + 1, i = t + 2;
				n.push(e, r, r, i, i, e);
			}
		}
		let s = new (i.count >= 65535 ? We : se)(n, 1);
		s.version = o;
		let c = a.get(e);
		c && t.remove(c), a.set(e, s);
	}
	function u(e) {
		let t = a.get(e);
		if (t) {
			let n = e.index;
			n !== null && t.version < n.version && l(e);
		} else l(e);
		return a.get(e);
	}
	return {
		get: s,
		update: c,
		getWireframeAttribute: u
	};
}
function Nt(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	let a, o;
	function s(e) {
		a = e.type, o = e.bytesPerElement;
	}
	function c(t, i) {
		e.drawElements(r, i, a, t * o), n.update(i, r, 1);
	}
	function l(t, i, s) {
		s !== 0 && (e.drawElementsInstanced(r, i, a, t * o, s), n.update(i, r, s));
	}
	function u(e, i, o) {
		if (o === 0) return;
		t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r, i, 0, a, e, 0, o);
		let s = 0;
		for (let e = 0; e < o; e++) s += i[e];
		n.update(s, r, 1);
	}
	this.setMode = i, this.setIndex = s, this.render = c, this.renderInstances = l, this.renderMultiDraw = u;
}
function Pt(e) {
	let t = {
		geometries: 0,
		textures: 0
	}, n = {
		frame: 0,
		calls: 0,
		triangles: 0,
		points: 0,
		lines: 0
	};
	function r(t, r, i) {
		switch (n.calls++, r) {
			case e.TRIANGLES:
				n.triangles += t / 3 * i;
				break;
			case e.LINES:
				n.lines += t / 2 * i;
				break;
			case e.LINE_STRIP:
				n.lines += i * (t - 1);
				break;
			case e.LINE_LOOP:
				n.lines += i * t;
				break;
			case e.POINTS:
				n.points += i * t;
				break;
			default: x("WebGLInfo: Unknown draw mode:", r);
		}
	}
	function i() {
		n.calls = 0, n.triangles = 0, n.points = 0, n.lines = 0;
	}
	return {
		memory: t,
		render: n,
		programs: null,
		autoReset: !0,
		reset: i,
		update: r
	};
}
function Ft(e, t, n) {
	let i = /* @__PURE__ */ new WeakMap(), a = new r();
	function o(r, o, s) {
		let c = r.morphTargetInfluences, l = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = l === void 0 ? 0 : l.length, d = i.get(o);
		if (d === void 0 || d.count !== u) {
			d !== void 0 && d.texture.dispose();
			let e = o.morphAttributes.position !== void 0, n = o.morphAttributes.normal !== void 0, r = o.morphAttributes.color !== void 0, s = o.morphAttributes.position || [], c = o.morphAttributes.normal || [], l = o.morphAttributes.color || [], f = 0;
			e === !0 && (f = 1), n === !0 && (f = 2), r === !0 && (f = 3);
			let p = o.attributes.position.count * f, m = 1;
			p > t.maxTextureSize && (m = Math.ceil(p / t.maxTextureSize), p = t.maxTextureSize);
			let h = new Float32Array(p * m * 4 * u), g = new E(h, p, m, u);
			g.type = b, g.needsUpdate = !0;
			let _ = f * 4;
			for (let t = 0; t < u; t++) {
				let i = s[t], o = c[t], u = l[t], d = p * m * 4 * t;
				for (let t = 0; t < i.count; t++) {
					let s = t * _;
					e === !0 && (a.fromBufferAttribute(i, t), h[d + s + 0] = a.x, h[d + s + 1] = a.y, h[d + s + 2] = a.z, h[d + s + 3] = 0), n === !0 && (a.fromBufferAttribute(o, t), h[d + s + 4] = a.x, h[d + s + 5] = a.y, h[d + s + 6] = a.z, h[d + s + 7] = 0), r === !0 && (a.fromBufferAttribute(u, t), h[d + s + 8] = a.x, h[d + s + 9] = a.y, h[d + s + 10] = a.z, h[d + s + 11] = u.itemSize === 4 ? a.w : 1);
				}
			}
			d = {
				count: u,
				texture: g,
				size: new D(p, m)
			}, i.set(o, d);
			function v() {
				g.dispose(), i.delete(o), o.removeEventListener("dispose", v);
			}
			o.addEventListener("dispose", v);
		}
		if (r.isInstancedMesh === !0 && r.morphTexture !== null) s.getUniforms().setValue(e, "morphTexture", r.morphTexture, n);
		else {
			let t = 0;
			for (let e = 0; e < c.length; e++) t += c[e];
			let n = o.morphTargetsRelative ? 1 : 1 - t;
			s.getUniforms().setValue(e, "morphTargetBaseInfluence", n), s.getUniforms().setValue(e, "morphTargetInfluences", c);
		}
		s.getUniforms().setValue(e, "morphTargetsTexture", d.texture, n), s.getUniforms().setValue(e, "morphTargetsTextureSize", d.size);
	}
	return { update: o };
}
function It(e, t, n, r, i) {
	let a = /* @__PURE__ */ new WeakMap();
	function o(r) {
		let o = i.render.frame, s = r.geometry, l = t.get(r, s);
		if (a.get(l) !== o && (t.update(l), a.set(l, o)), r.isInstancedMesh && (r.hasEventListener("dispose", c) === !1 && r.addEventListener("dispose", c), a.get(r) !== o && (n.update(r.instanceMatrix, e.ARRAY_BUFFER), r.instanceColor !== null && n.update(r.instanceColor, e.ARRAY_BUFFER), a.set(r, o))), r.isSkinnedMesh) {
			let e = r.skeleton;
			a.get(e) !== o && (e.update(), a.set(e, o));
		}
		return l;
	}
	function s() {
		a = /* @__PURE__ */ new WeakMap();
	}
	function c(e) {
		let t = e.target;
		t.removeEventListener("dispose", c), r.releaseStatesOfObject(t), n.remove(t.instanceMatrix), t.instanceColor !== null && n.remove(t.instanceColor);
	}
	return {
		update: o,
		dispose: s
	};
}
var Lt = {
	1: "LINEAR_TONE_MAPPING",
	2: "REINHARD_TONE_MAPPING",
	3: "CINEON_TONE_MAPPING",
	4: "ACES_FILMIC_TONE_MAPPING",
	6: "AGX_TONE_MAPPING",
	7: "NEUTRAL_TONE_MAPPING",
	5: "CUSTOM_TONE_MAPPING"
};
function Rt(e, n, r, i, a, s) {
	let c = new C(n, r, {
		type: e,
		depthBuffer: a,
		stencilBuffer: s,
		samples: i ? 4 : 0,
		storeMultisampledDepthBuffer: !1,
		storeMultisampledStencilBuffer: !1,
		resolveDepthBuffer: !1,
		resolveStencilBuffer: !1
	}), l = null, u = null, d = new B();
	d.setAttribute("position", new g([
		-1,
		3,
		0,
		-1,
		-1,
		0,
		3,
		-1,
		0
	], 3)), d.setAttribute("uv", new g([
		0,
		2,
		0,
		0,
		2,
		0
	], 2));
	let f = new t({
		uniforms: { tDiffuse: { value: null } },
		vertexShader: "\n			precision highp float;\n\n			uniform mat4 modelViewMatrix;\n			uniform mat4 projectionMatrix;\n\n			attribute vec3 position;\n			attribute vec2 uv;\n\n			varying vec2 vUv;\n\n			void main() {\n				vUv = uv;\n				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n			}",
		fragmentShader: "\n			precision highp float;\n\n			uniform sampler2D tDiffuse;\n\n			varying vec2 vUv;\n\n			#include <tonemapping_pars_fragment>\n			#include <colorspace_pars_fragment>\n\n			void main() {\n				gl_FragColor = texture2D( tDiffuse, vUv );\n\n				#ifdef LINEAR_TONE_MAPPING\n					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );\n				#elif defined( REINHARD_TONE_MAPPING )\n					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );\n				#elif defined( CINEON_TONE_MAPPING )\n					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );\n				#elif defined( ACES_FILMIC_TONE_MAPPING )\n					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );\n				#elif defined( AGX_TONE_MAPPING )\n					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );\n				#elif defined( NEUTRAL_TONE_MAPPING )\n					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );\n				#elif defined( CUSTOM_TONE_MAPPING )\n					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );\n				#endif\n\n				#ifdef SRGB_TRANSFER\n					gl_FragColor = sRGBTransferOETF( gl_FragColor );\n				#endif\n			}",
		depthTest: !1,
		depthWrite: !1
	}), p = new H(d, f), m = new fe(-1, 1, 1, -1, 0, 1), h = null, _ = null, v = !1, y, b = null, x = [], S = !1;
	this.setSize = function(e, t) {
		c.setSize(e, t), l !== null && l.setSize(e, t), u !== null && u.setSize(e, t);
		for (let n = 0; n < x.length; n++) {
			let r = x[n];
			r.setSize && r.setSize(e, t);
		}
	}, this.setEffects = function(e) {
		x = e, S = x.length > 0 && x[0].isRenderPass === !0;
		let t = c.width, n = c.height;
		x.length > 0 && l === null && (l = new C(t, n, {
			type: I,
			depthBuffer: !1,
			stencilBuffer: !1
		}), u = new C(t, n, {
			type: I,
			depthBuffer: !1,
			stencilBuffer: !1
		}));
		for (let e = 0; e < x.length; e++) {
			let r = x[e];
			r.setSize && r.setSize(t, n);
		}
	}, this.begin = function(e, t) {
		if (v || e.toneMapping === 0 && x.length === 0) return !1;
		if (b = t, t !== null) {
			let e = t.width, n = t.height;
			(c.width !== e || c.height !== n) && this.setSize(e, n);
		}
		return S === !1 && e.setRenderTarget(c), y = e.toneMapping, e.toneMapping = 0, !0;
	}, this.hasRenderPass = function() {
		return S;
	}, this.end = function(e, t) {
		e.toneMapping = y, v = !0;
		let n = c, r = l;
		for (let i = 0; i < x.length; i++) {
			let a = x[i];
			a.enabled !== !1 && (a.render(e, r, n, t), a.needsSwap !== !1 && (n = r, r = r === l ? u : l));
		}
		if (h !== e.outputColorSpace || _ !== e.toneMapping) {
			h = e.outputColorSpace, _ = e.toneMapping, f.defines = {}, o.getTransfer(h) === "srgb" && (f.defines.SRGB_TRANSFER = "");
			let t = Lt[_];
			t && (f.defines[t] = ""), f.needsUpdate = !0;
		}
		f.uniforms.tDiffuse.value = n.texture, e.setRenderTarget(b), e.render(p, m), b = null, v = !1;
	}, this.isCompositing = function() {
		return v;
	}, this.dispose = function() {
		c.dispose(), l !== null && l.dispose(), u !== null && u.dispose(), d.dispose(), f.dispose();
	};
}
var zt = /*@__PURE__*/ new be(), Bt = /*@__PURE__*/ new S(1, 1), Vt = /*@__PURE__*/ new E(), Ht = /*@__PURE__*/ new s(), Ut = /*@__PURE__*/ new l(), Wt = [], Gt = [], Kt = /* @__PURE__ */ new Float32Array(16), qt = /* @__PURE__ */ new Float32Array(9), Jt = /* @__PURE__ */ new Float32Array(4);
function Yt(e, t, n) {
	let r = e[0];
	if (r <= 0 || r > 0) return e;
	let i = t * n, a = Wt[i];
	if (a === void 0 && (a = new Float32Array(i), Wt[i] = a), t !== 0) {
		r.toArray(a, 0);
		for (let r = 1, i = 0; r !== t; ++r) i += n, e[r].toArray(a, i);
	}
	return a;
}
function Xt(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0, r = e.length; n < r; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function Zt(e, t) {
	for (let n = 0, r = t.length; n < r; n++) e[n] = t[n];
}
function Qt(e, t) {
	let n = Gt[t];
	n === void 0 && (n = new Int32Array(t), Gt[t] = n);
	for (let r = 0; r !== t; ++r) n[r] = e.allocateTextureUnit();
	return n;
}
function $t(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1f(this.addr, t), n[0] = t);
}
function en(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2f(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (Xt(n, t)) return;
		e.uniform2fv(this.addr, t), Zt(n, t);
	}
}
function tn(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3f(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else if (t.r !== void 0) (n[0] !== t.r || n[1] !== t.g || n[2] !== t.b) && (e.uniform3f(this.addr, t.r, t.g, t.b), n[0] = t.r, n[1] = t.g, n[2] = t.b);
	else {
		if (Xt(n, t)) return;
		e.uniform3fv(this.addr, t), Zt(n, t);
	}
}
function nn(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4f(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (Xt(n, t)) return;
		e.uniform4fv(this.addr, t), Zt(n, t);
	}
}
function rn(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (Xt(n, t)) return;
		e.uniformMatrix2fv(this.addr, !1, t), Zt(n, t);
	} else {
		if (Xt(n, r)) return;
		Jt.set(r), e.uniformMatrix2fv(this.addr, !1, Jt), Zt(n, r);
	}
}
function an(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (Xt(n, t)) return;
		e.uniformMatrix3fv(this.addr, !1, t), Zt(n, t);
	} else {
		if (Xt(n, r)) return;
		qt.set(r), e.uniformMatrix3fv(this.addr, !1, qt), Zt(n, r);
	}
}
function on(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (Xt(n, t)) return;
		e.uniformMatrix4fv(this.addr, !1, t), Zt(n, t);
	} else {
		if (Xt(n, r)) return;
		Kt.set(r), e.uniformMatrix4fv(this.addr, !1, Kt), Zt(n, r);
	}
}
function sn(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1i(this.addr, t), n[0] = t);
}
function cn(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2i(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (Xt(n, t)) return;
		e.uniform2iv(this.addr, t), Zt(n, t);
	}
}
function ln(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3i(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if (Xt(n, t)) return;
		e.uniform3iv(this.addr, t), Zt(n, t);
	}
}
function un(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4i(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (Xt(n, t)) return;
		e.uniform4iv(this.addr, t), Zt(n, t);
	}
}
function dn(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1ui(this.addr, t), n[0] = t);
}
function fn(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2ui(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (Xt(n, t)) return;
		e.uniform2uiv(this.addr, t), Zt(n, t);
	}
}
function pn(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3ui(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if (Xt(n, t)) return;
		e.uniform3uiv(this.addr, t), Zt(n, t);
	}
}
function mn(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4ui(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (Xt(n, t)) return;
		e.uniform4uiv(this.addr, t), Zt(n, t);
	}
}
function hn(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i);
	let a;
	this.type === e.SAMPLER_2D_SHADOW ? (Bt.compareFunction = n.isReversedDepthBuffer() ? 518 : 515, a = Bt) : a = zt, n.setTexture2D(t || a, i);
}
function gn(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture3D(t || Ht, i);
}
function _n(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTextureCube(t || Ut, i);
}
function vn(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture2DArray(t || Vt, i);
}
function yn(e) {
	switch (e) {
		case 5126: return $t;
		case 35664: return en;
		case 35665: return tn;
		case 35666: return nn;
		case 35674: return rn;
		case 35675: return an;
		case 35676: return on;
		case 5124:
		case 35670: return sn;
		case 35667:
		case 35671: return cn;
		case 35668:
		case 35672: return ln;
		case 35669:
		case 35673: return un;
		case 5125: return dn;
		case 36294: return fn;
		case 36295: return pn;
		case 36296: return mn;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return hn;
		case 35679:
		case 36299:
		case 36307: return gn;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return _n;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return vn;
	}
}
function bn(e, t) {
	e.uniform1fv(this.addr, t);
}
function xn(e, t) {
	let n = Yt(t, this.size, 2);
	e.uniform2fv(this.addr, n);
}
function Sn(e, t) {
	let n = Yt(t, this.size, 3);
	e.uniform3fv(this.addr, n);
}
function Cn(e, t) {
	let n = Yt(t, this.size, 4);
	e.uniform4fv(this.addr, n);
}
function wn(e, t) {
	let n = Yt(t, this.size, 4);
	e.uniformMatrix2fv(this.addr, !1, n);
}
function Tn(e, t) {
	let n = Yt(t, this.size, 9);
	e.uniformMatrix3fv(this.addr, !1, n);
}
function En(e, t) {
	let n = Yt(t, this.size, 16);
	e.uniformMatrix4fv(this.addr, !1, n);
}
function Dn(e, t) {
	e.uniform1iv(this.addr, t);
}
function On(e, t) {
	e.uniform2iv(this.addr, t);
}
function kn(e, t) {
	e.uniform3iv(this.addr, t);
}
function An(e, t) {
	e.uniform4iv(this.addr, t);
}
function jn(e, t) {
	e.uniform1uiv(this.addr, t);
}
function Mn(e, t) {
	e.uniform2uiv(this.addr, t);
}
function Nn(e, t) {
	e.uniform3uiv(this.addr, t);
}
function Pn(e, t) {
	e.uniform4uiv(this.addr, t);
}
function Fn(e, t, n) {
	let r = this.cache, i = t.length, a = Qt(n, i);
	Xt(r, a) || (e.uniform1iv(this.addr, a), Zt(r, a));
	let o;
	o = this.type === e.SAMPLER_2D_SHADOW ? Bt : zt;
	for (let e = 0; e !== i; ++e) n.setTexture2D(t[e] || o, a[e]);
}
function In(e, t, n) {
	let r = this.cache, i = t.length, a = Qt(n, i);
	Xt(r, a) || (e.uniform1iv(this.addr, a), Zt(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture3D(t[e] || Ht, a[e]);
}
function Ln(e, t, n) {
	let r = this.cache, i = t.length, a = Qt(n, i);
	Xt(r, a) || (e.uniform1iv(this.addr, a), Zt(r, a));
	for (let e = 0; e !== i; ++e) n.setTextureCube(t[e] || Ut, a[e]);
}
function Rn(e, t, n) {
	let r = this.cache, i = t.length, a = Qt(n, i);
	Xt(r, a) || (e.uniform1iv(this.addr, a), Zt(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture2DArray(t[e] || Vt, a[e]);
}
function zn(e) {
	switch (e) {
		case 5126: return bn;
		case 35664: return xn;
		case 35665: return Sn;
		case 35666: return Cn;
		case 35674: return wn;
		case 35675: return Tn;
		case 35676: return En;
		case 5124:
		case 35670: return Dn;
		case 35667:
		case 35671: return On;
		case 35668:
		case 35672: return kn;
		case 35669:
		case 35673: return An;
		case 5125: return jn;
		case 36294: return Mn;
		case 36295: return Nn;
		case 36296: return Pn;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return Fn;
		case 35679:
		case 36299:
		case 36307: return In;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return Ln;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return Rn;
	}
}
var Bn = class {
	constructor(e, t, n) {
		this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = yn(t.type);
	}
}, Vn = class {
	constructor(e, t, n) {
		this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = zn(t.type);
	}
}, Hn = class {
	constructor(e) {
		this.id = e, this.seq = [], this.map = {};
	}
	setValue(e, t, n) {
		let r = this.seq;
		for (let i = 0, a = r.length; i !== a; ++i) {
			let a = r[i];
			a.setValue(e, t[a.id], n);
		}
	}
}, Un = /(\w+)(\])?(\[|\.)?/g;
function Wn(e, t) {
	e.seq.push(t), e.map[t.id] = t;
}
function Gn(e, t, n) {
	let r = e.name, i = r.length;
	for (Un.lastIndex = 0;;) {
		let a = Un.exec(r), o = Un.lastIndex, s = a[1], c = a[2] === "]", l = a[3];
		if (c && (s |= 0), l === void 0 || l === "[" && o + 2 === i) {
			Wn(n, l === void 0 ? new Bn(s, e, t) : new Vn(s, e, t));
			break;
		}
		{
			let e = n.map[s];
			e === void 0 && (e = new Hn(s), Wn(n, e)), n = e;
		}
	}
}
var Kn = class {
	constructor(e, t) {
		this.seq = [], this.map = {};
		let n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
		for (let r = 0; r < n; ++r) {
			let n = e.getActiveUniform(t, r);
			Gn(n, e.getUniformLocation(t, n.name), this);
		}
		let r = [], i = [];
		for (let t of this.seq) t.type === e.SAMPLER_2D_SHADOW || t.type === e.SAMPLER_CUBE_SHADOW || t.type === e.SAMPLER_2D_ARRAY_SHADOW ? r.push(t) : i.push(t);
		r.length > 0 && (this.seq = r.concat(i));
	}
	setValue(e, t, n, r) {
		let i = this.map[t];
		i !== void 0 && i.setValue(e, n, r);
	}
	setOptional(e, t, n) {
		let r = t[n];
		r !== void 0 && this.setValue(e, n, r);
	}
	static upload(e, t, n, r) {
		for (let i = 0, a = t.length; i !== a; ++i) {
			let a = t[i], o = n[a.id];
			o.needsUpdate !== !1 && a.setValue(e, o.value, r);
		}
	}
	static seqWithValue(e, t) {
		let n = [];
		for (let r = 0, i = e.length; r !== i; ++r) {
			let i = e[r];
			i.id in t && n.push(i);
		}
		return n;
	}
};
function qn(e, t, n) {
	let r = e.createShader(t);
	return e.shaderSource(r, n), e.compileShader(r), r;
}
var Jn = 37297, Yn = 0;
function Xn(e, t) {
	let n = e.split("\n"), r = [], i = Math.max(t - 6, 0), a = Math.min(t + 6, n.length);
	for (let e = i; e < a; e++) {
		let i = e + 1;
		r.push(`${i === t ? ">" : " "} ${i}: ${n[e]}`);
	}
	return r.join("\n");
}
var Zn = /*@__PURE__*/ new A();
function Qn(e) {
	o._getMatrix(Zn, o.workingColorSpace, e);
	let t = `mat3( ${Zn.elements.map((e) => e.toFixed(4))} )`;
	switch (o.getTransfer(e)) {
		case z: return [t, "LinearTransferOETF"];
		case He: return [t, "sRGBTransferOETF"];
		default: return F("WebGLProgram: Unsupported color space: ", e), [t, "LinearTransferOETF"];
	}
}
function $n(e, t, n) {
	let r = e.getShaderParameter(t, e.COMPILE_STATUS), i = (e.getShaderInfoLog(t) || "").trim();
	if (r && i === "") return "";
	let a = /ERROR: 0:(\d+)/.exec(i);
	if (a) {
		let r = parseInt(a[1]);
		return n.toUpperCase() + "\n\n" + i + "\n\n" + Xn(e.getShaderSource(t), r);
	}
	return i;
}
function er(e, t) {
	let n = Qn(t);
	return [
		`vec4 ${e}( vec4 value ) {`,
		`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,
		"}"
	].join("\n");
}
var tr = {
	1: "Linear",
	2: "Reinhard",
	3: "Cineon",
	4: "ACESFilmic",
	6: "AgX",
	7: "Neutral",
	5: "Custom"
};
function nr(e, t) {
	let n = tr[t];
	return n === void 0 ? (F("WebGLProgram: Unsupported toneMapping:", t), "vec3 " + e + "( vec3 color ) { return LinearToneMapping( color ); }") : "vec3 " + e + "( vec3 color ) { return " + n + "ToneMapping( color ); }";
}
var rr = /*@__PURE__*/ new G();
function ir() {
	return o.getLuminanceCoefficients(rr), [
		"float luminance( const in vec3 rgb ) {",
		`	const vec3 weights = vec3( ${rr.x.toFixed(4)}, ${rr.y.toFixed(4)}, ${rr.z.toFixed(4)} );`,
		"	return dot( weights, rgb );",
		"}"
	].join("\n");
}
function ar(e) {
	return [e.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "", e.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].filter(cr).join("\n");
}
function or(e) {
	let t = [];
	for (let n in e) {
		let r = e[n];
		r !== !1 && t.push("#define " + n + " " + r);
	}
	return t.join("\n");
}
function sr(e, t) {
	let n = {}, r = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES);
	for (let i = 0; i < r; i++) {
		let r = e.getActiveAttrib(t, i), a = r.name, o = 1;
		r.type === e.FLOAT_MAT2 && (o = 2), r.type === e.FLOAT_MAT3 && (o = 3), r.type === e.FLOAT_MAT4 && (o = 4), n[a] = {
			type: r.type,
			location: e.getAttribLocation(t, a),
			locationSize: o
		};
	}
	return n;
}
function cr(e) {
	return e !== "";
}
function lr(e, t) {
	let n = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
	return e.replace(/NUM_SUN_LIGHTS/g, t.numSunLights).replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, n).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g, t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function ur(e, t) {
	return e.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
var dr = /^[ \t]*#include +<([\w\d./]+)>/gm;
function fr(e) {
	return e.replace(dr, mr);
}
var pr = /* @__PURE__ */ new Map();
function mr(e, t) {
	let n = Z[t];
	if (n === void 0) {
		let e = pr.get(t);
		if (e !== void 0) n = Z[e], F("WebGLRenderer: Shader chunk \"%s\" has been deprecated. Use \"%s\" instead.", t, e);
		else throw Error("THREE.WebGLProgram: Can not resolve #include <" + t + ">");
	}
	return fr(n);
}
var hr = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function gr(e) {
	return e.replace(hr, _r);
}
function _r(e, t, n, r) {
	let i = "";
	for (let e = parseInt(t); e < parseInt(n); e++) i += r.replace(/\[\s*i\s*\]/g, "[ " + e + " ]").replace(/UNROLLED_LOOP_INDEX/g, e);
	return i;
}
function vr(e) {
	let t = `precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;
	return e.precision === "highp" ? t += "\n#define HIGH_PRECISION" : e.precision === "mediump" ? t += "\n#define MEDIUM_PRECISION" : e.precision === "lowp" && (t += "\n#define LOW_PRECISION"), t;
}
var yr = {
	1: "SHADOWMAP_TYPE_PCF",
	3: "SHADOWMAP_TYPE_VSM"
};
function br(e) {
	return yr[e.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
}
var xr = {
	301: "ENVMAP_TYPE_CUBE",
	302: "ENVMAP_TYPE_CUBE",
	306: "ENVMAP_TYPE_CUBE_UV"
};
function Sr(e) {
	return e.envMap === !1 ? "ENVMAP_TYPE_CUBE" : xr[e.envMapMode] || "ENVMAP_TYPE_CUBE";
}
var Cr = { 302: "ENVMAP_MODE_REFRACTION" };
function wr(e) {
	return e.envMap === !1 ? "ENVMAP_MODE_REFLECTION" : Cr[e.envMapMode] || "ENVMAP_MODE_REFLECTION";
}
var Tr = {
	0: "ENVMAP_BLENDING_MULTIPLY",
	1: "ENVMAP_BLENDING_MIX",
	2: "ENVMAP_BLENDING_ADD"
};
function Er(e) {
	return e.envMap === !1 ? "ENVMAP_BLENDING_NONE" : Tr[e.combine] || "ENVMAP_BLENDING_NONE";
}
function Dr(e) {
	let t = e.envMapCubeUVHeight;
	if (t === null) return null;
	let n = Math.log2(t) - 2, r = 1 / t;
	return {
		texelWidth: 1 / (3 * Math.max(2 ** n, 112)),
		texelHeight: r,
		maxMip: n
	};
}
function Or(e, t, n, r) {
	let i = e.getContext(), a = n.defines, o = n.vertexShader, s = n.fragmentShader, c = br(n), l = Sr(n), u = wr(n), d = Er(n), f = Dr(n), p = ar(n), m = or(a), h = i.createProgram(), g, _, v = n.glslVersion ? "#version " + n.glslVersion + "\n" : "";
	n.isRawShaderMaterial ? (g = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m
	].filter(cr).join("\n"), g.length > 0 && (g += "\n"), _ = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m
	].filter(cr).join("\n"), _.length > 0 && (_ += "\n")) : (g = [
		vr(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m,
		n.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
		n.batching ? "#define USE_BATCHING" : "",
		n.batchingColor ? "#define USE_BATCHING_COLOR" : "",
		n.instancing ? "#define USE_INSTANCING" : "",
		n.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
		n.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.map ? "#define USE_MAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + u : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.mapUv ? "#define MAP_UV " + n.mapUv : "",
		n.alphaMapUv ? "#define ALPHAMAP_UV " + n.alphaMapUv : "",
		n.lightMapUv ? "#define LIGHTMAP_UV " + n.lightMapUv : "",
		n.aoMapUv ? "#define AOMAP_UV " + n.aoMapUv : "",
		n.emissiveMapUv ? "#define EMISSIVEMAP_UV " + n.emissiveMapUv : "",
		n.bumpMapUv ? "#define BUMPMAP_UV " + n.bumpMapUv : "",
		n.normalMapUv ? "#define NORMALMAP_UV " + n.normalMapUv : "",
		n.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + n.displacementMapUv : "",
		n.metalnessMapUv ? "#define METALNESSMAP_UV " + n.metalnessMapUv : "",
		n.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + n.roughnessMapUv : "",
		n.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + n.anisotropyMapUv : "",
		n.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + n.clearcoatMapUv : "",
		n.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + n.clearcoatNormalMapUv : "",
		n.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + n.clearcoatRoughnessMapUv : "",
		n.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + n.iridescenceMapUv : "",
		n.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + n.iridescenceThicknessMapUv : "",
		n.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + n.sheenColorMapUv : "",
		n.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + n.sheenRoughnessMapUv : "",
		n.specularMapUv ? "#define SPECULARMAP_UV " + n.specularMapUv : "",
		n.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + n.specularColorMapUv : "",
		n.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + n.specularIntensityMapUv : "",
		n.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + n.transmissionMapUv : "",
		n.thicknessMapUv ? "#define THICKNESSMAP_UV " + n.thicknessMapUv : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexNormals ? "#define HAS_NORMAL" : "",
		n.vertexColors ? "#define USE_COLOR" : "",
		n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.skinning ? "#define USE_SKINNING" : "",
		n.morphTargets ? "#define USE_MORPHTARGETS" : "",
		n.morphNormals && n.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
		n.morphColors ? "#define USE_MORPHCOLORS" : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + n.morphTextureStride : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + n.morphTargetsCount : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 modelMatrix;",
		"uniform mat4 modelViewMatrix;",
		"uniform mat4 projectionMatrix;",
		"uniform mat4 viewMatrix;",
		"uniform mat3 normalMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		"#ifdef USE_INSTANCING",
		"	attribute mat4 instanceMatrix;",
		"#endif",
		"#ifdef USE_INSTANCING_COLOR",
		"	attribute vec3 instanceColor;",
		"#endif",
		"#ifdef USE_INSTANCING_MORPH",
		"	uniform sampler2D morphTexture;",
		"#endif",
		"attribute vec3 position;",
		"attribute vec3 normal;",
		"attribute vec2 uv;",
		"#ifdef USE_UV1",
		"	attribute vec2 uv1;",
		"#endif",
		"#ifdef USE_UV2",
		"	attribute vec2 uv2;",
		"#endif",
		"#ifdef USE_UV3",
		"	attribute vec2 uv3;",
		"#endif",
		"#ifdef USE_TANGENT",
		"	attribute vec4 tangent;",
		"#endif",
		"#if defined( USE_COLOR_ALPHA )",
		"	attribute vec4 color;",
		"#elif defined( USE_COLOR )",
		"	attribute vec3 color;",
		"#endif",
		"#ifdef USE_SKINNING",
		"	attribute vec4 skinIndex;",
		"	attribute vec4 skinWeight;",
		"#endif",
		"\n"
	].filter(cr).join("\n"), _ = [
		vr(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m,
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
		n.map ? "#define USE_MAP" : "",
		n.matcap ? "#define USE_MATCAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + l : "",
		n.envMap ? "#define " + u : "",
		n.envMap ? "#define " + d : "",
		f ? "#define CUBEUV_TEXEL_WIDTH " + f.texelWidth : "",
		f ? "#define CUBEUV_TEXEL_HEIGHT " + f.texelHeight : "",
		f ? "#define CUBEUV_MAX_MIP " + f.maxMip + ".0" : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoat ? "#define USE_CLEARCOAT" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.dispersion ? "#define USE_DISPERSION" : "",
		n.retroreflection ? "#define USE_RETROREFLECTION" : "",
		n.iridescence ? "#define USE_IRIDESCENCE" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaTest ? "#define USE_ALPHATEST" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.sheen ? "#define USE_SHEEN" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexColors || n.instancingColor ? "#define USE_COLOR" : "",
		n.vertexAlphas || n.batchingColor ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.gradientMap ? "#define USE_GRADIENTMAP" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
		n.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
		n.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 viewMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		n.toneMapping === 0 ? "" : "#define TONE_MAPPING",
		n.toneMapping === 0 ? "" : Z.tonemapping_pars_fragment,
		n.toneMapping === 0 ? "" : nr("toneMapping", n.toneMapping),
		n.dithering ? "#define DITHERING" : "",
		n.opaque ? "#define OPAQUE" : "",
		Z.colorspace_pars_fragment,
		er("linearToOutputTexel", n.outputColorSpace),
		ir(),
		n.useDepthPacking ? "#define DEPTH_PACKING " + n.depthPacking : "",
		"\n"
	].filter(cr).join("\n")), o = fr(o), o = lr(o, n), o = ur(o, n), s = fr(s), s = lr(s, n), s = ur(s, n), o = gr(o), s = gr(s), n.isRawShaderMaterial !== !0 && (v = "#version 300 es\n", g = [
		p,
		"#define attribute in",
		"#define varying out",
		"#define texture2D texture"
	].join("\n") + "\n" + g, _ = [
		"#define varying in",
		n.glslVersion === "300 es" ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
		n.glslVersion === "300 es" ? "" : "#define gl_FragColor pc_fragColor",
		"#define gl_FragDepthEXT gl_FragDepth",
		"#define texture2D texture",
		"#define textureCube texture",
		"#define texture2DProj textureProj",
		"#define texture2DLodEXT textureLod",
		"#define texture2DProjLodEXT textureProjLod",
		"#define textureCubeLodEXT textureLod",
		"#define texture2DGradEXT textureGrad",
		"#define texture2DProjGradEXT textureProjGrad",
		"#define textureCubeGradEXT textureGrad"
	].join("\n") + "\n" + _);
	let y = v + g + o, b = v + _ + s, S = qn(i, i.VERTEX_SHADER, y), C = qn(i, i.FRAGMENT_SHADER, b);
	i.attachShader(h, S), i.attachShader(h, C), n.index0AttributeName === void 0 ? n.hasPositionAttribute === !0 && i.bindAttribLocation(h, 0, "position") : i.bindAttribLocation(h, 0, n.index0AttributeName), i.linkProgram(h);
	function w(t) {
		if (e.debug.checkShaderErrors) {
			let n = i.getProgramInfoLog(h) || "", r = i.getShaderInfoLog(S) || "", a = i.getShaderInfoLog(C) || "", o = n.trim(), s = r.trim(), c = a.trim(), l = !0, u = !0;
			if (i.getProgramParameter(h, i.LINK_STATUS) === !1) {
				if (l = !1, typeof e.debug.onShaderError == "function") e.debug.onShaderError(i, h, S, C);
				else {
					let e = $n(i, S, "vertex"), n = $n(i, C, "fragment");
					x("WebGLProgram: Shader Error " + i.getError() + " - VALIDATE_STATUS " + i.getProgramParameter(h, i.VALIDATE_STATUS) + "\n\nMaterial Name: " + t.name + "\nMaterial Type: " + t.type + "\n\nProgram Info Log: " + o + "\n" + e + "\n" + n);
				}
			} else o === "" ? (s === "" || c === "") && (u = !1) : F("WebGLProgram: Program Info Log:", o);
			u && (t.diagnostics = {
				runnable: l,
				programLog: o,
				vertexShader: {
					log: s,
					prefix: g
				},
				fragmentShader: {
					log: c,
					prefix: _
				}
			});
		}
		i.deleteShader(S), i.deleteShader(C), T = new Kn(i, h), E = sr(i, h);
	}
	let T;
	this.getUniforms = function() {
		return T === void 0 && w(this), T;
	};
	let E;
	this.getAttributes = function() {
		return E === void 0 && w(this), E;
	};
	let D = n.rendererExtensionParallelShaderCompile === !1;
	return this.isReady = function() {
		return D === !1 && (D = i.getProgramParameter(h, Jn)), D;
	}, this.destroy = function() {
		r.releaseStatesOfProgram(this), i.deleteProgram(h), this.program = void 0;
	}, this.type = n.shaderType, this.name = n.shaderName, this.id = Yn++, this.cacheKey = t, this.usedTimes = 1, this.program = h, this.vertexShader = S, this.fragmentShader = C, this;
}
var kr = 0, Ar = class {
	constructor() {
		this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
	}
	update(e, t, n) {
		let r = this._getShaderCacheForMaterial(e);
		return r.has(t) === !1 && (r.add(t), t.usedTimes++), r.has(n) === !1 && (r.add(n), n.usedTimes++), this;
	}
	remove(e) {
		let t = this.materialCache.get(e);
		for (let e of t) e.usedTimes--, e.usedTimes === 0 && this.shaderCache.delete(e.code);
		return this.materialCache.delete(e), this;
	}
	getVertexShaderStage(e) {
		return this._getShaderStage(e.vertexShader);
	}
	getFragmentShaderStage(e) {
		return this._getShaderStage(e.fragmentShader);
	}
	dispose() {
		this.shaderCache.clear(), this.materialCache.clear();
	}
	_getShaderCacheForMaterial(e) {
		let t = this.materialCache, n = t.get(e);
		return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
	}
	_getShaderStage(e) {
		let t = this.shaderCache, n = t.get(e);
		return n === void 0 && (n = new jr(e), t.set(e, n)), n;
	}
}, jr = class {
	constructor(e) {
		this.id = kr++, this.code = e, this.usedTimes = 0;
	}
};
function Mr(e) {
	return e === 1030 || e === 37490 || e === 36285;
}
function Nr(e, t, n, r, i, a) {
	let s = new p(), c = new Ar(), l = /* @__PURE__ */ new Set(), u = [], d = /* @__PURE__ */ new Map(), f = r.logarithmicDepthBuffer, m = r.precision, h = {
		MeshDepthMaterial: "depth",
		MeshDistanceMaterial: "distance",
		MeshNormalMaterial: "normal",
		MeshBasicMaterial: "basic",
		MeshLambertMaterial: "lambert",
		MeshPhongMaterial: "phong",
		MeshToonMaterial: "toon",
		MeshStandardMaterial: "physical",
		MeshPhysicalMaterial: "physical",
		MeshMatcapMaterial: "matcap",
		LineBasicMaterial: "basic",
		LineDashedMaterial: "dashed",
		PointsMaterial: "points",
		ShadowMaterial: "shadow",
		SpriteMaterial: "sprite"
	};
	function g(e) {
		return l.add(e), e === 0 ? "uv" : `uv${e}`;
	}
	function _(i, s, u, d, p, _) {
		let v = d.fog, y = p.geometry, b = i.isMeshStandardMaterial || i.isMeshLambertMaterial || i.isMeshPhongMaterial ? d.environment : null, x = i.isMeshStandardMaterial || i.isMeshLambertMaterial && !i.envMap || i.isMeshPhongMaterial && !i.envMap, S = t.get(i.envMap || b, x), C = S && S.mapping === 306 ? S.image.height : null, w = h[i.type];
		i.precision !== null && (m = r.getMaxPrecision(i.precision), m !== i.precision && F("WebGLProgram.getParameters:", i.precision, "not supported, using", m, "instead."));
		let T = y.morphAttributes.position || y.morphAttributes.normal || y.morphAttributes.color, E = T === void 0 ? 0 : T.length, D = 0;
		y.morphAttributes.position !== void 0 && (D = 1), y.morphAttributes.normal !== void 0 && (D = 2), y.morphAttributes.color !== void 0 && (D = 3);
		let O, k, A, ee;
		if (w) {
			let e = et[w];
			O = e.vertexShader, k = e.fragmentShader;
		} else {
			O = i.vertexShader, k = i.fragmentShader;
			let e = c.getVertexShaderStage(i), t = c.getFragmentShaderStage(i);
			c.update(i, e, t), A = e.id, ee = t.id;
		}
		let j = e.getRenderTarget(), M = e.state.buffers.depth.getReversed(), N = p.isInstancedMesh === !0, te = p.isBatchedMesh === !0, P = !!i.map, ne = !!i.matcap, re = !!S, I = !!i.aoMap, L = !!i.lightMap, ie = !!i.bumpMap && i.wireframe === !1, R = !!i.normalMap, ae = !!i.displacementMap, z = !!i.emissiveMap, oe = !!i.metalnessMap, B = !!i.roughnessMap, se = i.anisotropy > 0, ce = i.clearcoat > 0, le = i.dispersion > 0, ue = i.retroreflectivity > 0, V = i.iridescence > 0, de = i.sheen > 0, fe = i.transmission > 0, pe = se && !!i.anisotropyMap, me = ce && !!i.clearcoatMap, he = ce && !!i.clearcoatNormalMap, H = ce && !!i.clearcoatRoughnessMap, U = V && !!i.iridescenceMap, ge = V && !!i.iridescenceThicknessMap, W = de && !!i.sheenColorMap, _e = de && !!i.sheenRoughnessMap, ve = !!i.specularMap, ye = !!i.specularColorMap, be = !!i.specularIntensityMap, xe = fe && !!i.transmissionMap, Se = fe && !!i.thicknessMap, Ce = !!i.gradientMap, we = !!i.alphaMap, Te = i.alphaTest > 0, Ee = !!i.alphaHash, G = !!i.extensions, De = 0;
		i.toneMapped && (j === null || j.isXRRenderTarget === !0) && (De = e.toneMapping);
		let Oe = {
			shaderID: w,
			shaderType: i.type,
			shaderName: i.name,
			vertexShader: O,
			fragmentShader: k,
			defines: i.defines,
			customVertexShaderID: A,
			customFragmentShaderID: ee,
			isRawShaderMaterial: i.isRawShaderMaterial === !0,
			glslVersion: i.glslVersion,
			precision: m,
			batching: te,
			batchingColor: te && p._colorsTexture !== null,
			instancing: N,
			instancingColor: N && p.instanceColor !== null,
			instancingMorph: N && p.morphTexture !== null,
			outputColorSpace: j === null ? e.outputColorSpace : j.isXRRenderTarget === !0 ? j.texture.colorSpace : o.workingColorSpace,
			alphaToCoverage: !!i.alphaToCoverage,
			map: P,
			matcap: ne,
			envMap: re,
			envMapMode: re && S.mapping,
			envMapCubeUVHeight: C,
			aoMap: I,
			lightMap: L,
			bumpMap: ie,
			normalMap: R,
			displacementMap: ae,
			emissiveMap: z,
			normalMapObjectSpace: R && i.normalMapType === 1,
			normalMapTangentSpace: R && i.normalMapType === 0,
			packedNormalMap: R && i.normalMapType === 0 && Mr(i.normalMap.format),
			metalnessMap: oe,
			roughnessMap: B,
			anisotropy: se,
			anisotropyMap: pe,
			clearcoat: ce,
			clearcoatMap: me,
			clearcoatNormalMap: he,
			clearcoatRoughnessMap: H,
			dispersion: le,
			retroreflection: ue,
			iridescence: V,
			iridescenceMap: U,
			iridescenceThicknessMap: ge,
			sheen: de,
			sheenColorMap: W,
			sheenRoughnessMap: _e,
			specularMap: ve,
			specularColorMap: ye,
			specularIntensityMap: be,
			transmission: fe,
			transmissionMap: xe,
			thicknessMap: Se,
			gradientMap: Ce,
			opaque: i.transparent === !1 && i.blending === 1 && i.alphaToCoverage === !1,
			alphaMap: we,
			alphaTest: Te,
			alphaHash: Ee,
			combine: i.combine,
			mapUv: P && g(i.map.channel),
			aoMapUv: I && g(i.aoMap.channel),
			lightMapUv: L && g(i.lightMap.channel),
			bumpMapUv: ie && g(i.bumpMap.channel),
			normalMapUv: R && g(i.normalMap.channel),
			displacementMapUv: ae && g(i.displacementMap.channel),
			emissiveMapUv: z && g(i.emissiveMap.channel),
			metalnessMapUv: oe && g(i.metalnessMap.channel),
			roughnessMapUv: B && g(i.roughnessMap.channel),
			anisotropyMapUv: pe && g(i.anisotropyMap.channel),
			clearcoatMapUv: me && g(i.clearcoatMap.channel),
			clearcoatNormalMapUv: he && g(i.clearcoatNormalMap.channel),
			clearcoatRoughnessMapUv: H && g(i.clearcoatRoughnessMap.channel),
			iridescenceMapUv: U && g(i.iridescenceMap.channel),
			iridescenceThicknessMapUv: ge && g(i.iridescenceThicknessMap.channel),
			sheenColorMapUv: W && g(i.sheenColorMap.channel),
			sheenRoughnessMapUv: _e && g(i.sheenRoughnessMap.channel),
			specularMapUv: ve && g(i.specularMap.channel),
			specularColorMapUv: ye && g(i.specularColorMap.channel),
			specularIntensityMapUv: be && g(i.specularIntensityMap.channel),
			transmissionMapUv: xe && g(i.transmissionMap.channel),
			thicknessMapUv: Se && g(i.thicknessMap.channel),
			alphaMapUv: we && g(i.alphaMap.channel),
			vertexTangents: !!y.attributes.tangent && (R || se),
			vertexNormals: !!y.attributes.normal,
			vertexColors: i.vertexColors,
			vertexAlphas: i.vertexColors === !0 && !!y.attributes.color && y.attributes.color.itemSize === 4,
			pointsUvs: p.isPoints === !0 && !!y.attributes.uv && (P || we),
			fog: !!v,
			useFog: i.fog === !0,
			fogExp2: !!v && v.isFogExp2,
			flatShading: i.wireframe === !1 && (i.flatShading === !0 || y.attributes.normal === void 0 && R === !1 && (i.isMeshLambertMaterial || i.isMeshPhongMaterial || i.isMeshStandardMaterial || i.isMeshPhysicalMaterial)),
			sizeAttenuation: i.sizeAttenuation === !0,
			logarithmicDepthBuffer: f,
			reversedDepthBuffer: M,
			skinning: p.isSkinnedMesh === !0,
			hasPositionAttribute: y.attributes.position !== void 0,
			morphTargets: y.morphAttributes.position !== void 0,
			morphNormals: y.morphAttributes.normal !== void 0,
			morphColors: y.morphAttributes.color !== void 0,
			morphTargetsCount: E,
			morphTextureStride: D,
			numSunLights: s.sun.length,
			numDirLights: s.directional.length,
			numPointLights: s.point.length,
			numSpotLights: s.spot.length,
			numSpotLightMaps: s.spotLightMap.length,
			numRectAreaLights: s.rectArea.length,
			numHemiLights: s.hemi.length,
			numSunLightShadows: s.sunShadowMap.length,
			numDirLightShadows: s.directionalShadowMap.length,
			numPointLightShadows: s.pointShadowMap.length,
			numSpotLightShadows: s.spotShadowMap.length,
			numSpotLightShadowsWithMaps: s.numSpotLightShadowsWithMaps,
			numLightProbes: s.numLightProbes,
			numLightProbeGrids: _.length,
			numClippingPlanes: a.numPlanes,
			numClipIntersection: a.numIntersection,
			dithering: i.dithering,
			shadowMapEnabled: e.shadowMap.enabled && u.length > 0,
			shadowMapType: e.shadowMap.type,
			toneMapping: De,
			decodeVideoTexture: P && i.map.isVideoTexture === !0 && o.getTransfer(i.map.colorSpace) === "srgb",
			decodeVideoTextureEmissive: z && i.emissiveMap.isVideoTexture === !0 && o.getTransfer(i.emissiveMap.colorSpace) === "srgb",
			premultipliedAlpha: i.premultipliedAlpha,
			doubleSided: i.side === 2,
			flipSided: i.side === 1,
			useDepthPacking: i.depthPacking >= 0,
			depthPacking: i.depthPacking || 0,
			index0AttributeName: i.index0AttributeName,
			extensionClipCullDistance: G && i.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
			extensionMultiDraw: (G && i.extensions.multiDraw === !0 || te) && n.has("WEBGL_multi_draw"),
			rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
			customProgramCacheKey: i.customProgramCacheKey()
		};
		return Oe.vertexUv1s = l.has(1), Oe.vertexUv2s = l.has(2), Oe.vertexUv3s = l.has(3), l.clear(), Oe;
	}
	function v(t) {
		let n = [];
		if (t.shaderID ? n.push(t.shaderID) : (n.push(t.customVertexShaderID), n.push(t.customFragmentShaderID)), t.defines !== void 0) for (let e in t.defines) n.push(e), n.push(t.defines[e]);
		return t.isRawShaderMaterial === !1 && (y(n, t), b(n, t), n.push(e.outputColorSpace)), n.push(t.customProgramCacheKey), n.join();
	}
	function y(e, t) {
		e.push(t.precision), e.push(t.outputColorSpace), e.push(t.envMapMode), e.push(t.envMapCubeUVHeight), e.push(t.mapUv), e.push(t.alphaMapUv), e.push(t.lightMapUv), e.push(t.aoMapUv), e.push(t.bumpMapUv), e.push(t.normalMapUv), e.push(t.displacementMapUv), e.push(t.emissiveMapUv), e.push(t.metalnessMapUv), e.push(t.roughnessMapUv), e.push(t.anisotropyMapUv), e.push(t.clearcoatMapUv), e.push(t.clearcoatNormalMapUv), e.push(t.clearcoatRoughnessMapUv), e.push(t.iridescenceMapUv), e.push(t.iridescenceThicknessMapUv), e.push(t.sheenColorMapUv), e.push(t.sheenRoughnessMapUv), e.push(t.specularMapUv), e.push(t.specularColorMapUv), e.push(t.specularIntensityMapUv), e.push(t.transmissionMapUv), e.push(t.thicknessMapUv), e.push(t.combine), e.push(t.fogExp2), e.push(t.sizeAttenuation), e.push(t.morphTargetsCount), e.push(t.morphAttributeCount), e.push(t.numSunLights), e.push(t.numDirLights), e.push(t.numPointLights), e.push(t.numSpotLights), e.push(t.numSpotLightMaps), e.push(t.numHemiLights), e.push(t.numRectAreaLights), e.push(t.numSunLightShadows), e.push(t.numDirLightShadows), e.push(t.numPointLightShadows), e.push(t.numSpotLightShadows), e.push(t.numSpotLightShadowsWithMaps), e.push(t.numLightProbes), e.push(t.shadowMapType), e.push(t.toneMapping), e.push(t.numClippingPlanes), e.push(t.numClipIntersection), e.push(t.depthPacking);
	}
	function b(e, t) {
		s.disableAll(), t.instancing && s.enable(0), t.instancingColor && s.enable(1), t.instancingMorph && s.enable(2), t.matcap && s.enable(3), t.envMap && s.enable(4), t.normalMapObjectSpace && s.enable(5), t.normalMapTangentSpace && s.enable(6), t.clearcoat && s.enable(7), t.iridescence && s.enable(8), t.alphaTest && s.enable(9), t.vertexColors && s.enable(10), t.vertexAlphas && s.enable(11), t.vertexUv1s && s.enable(12), t.vertexUv2s && s.enable(13), t.vertexUv3s && s.enable(14), t.vertexTangents && s.enable(15), t.anisotropy && s.enable(16), t.alphaHash && s.enable(17), t.batching && s.enable(18), t.dispersion && s.enable(19), t.retroreflection && s.enable(24), t.batchingColor && s.enable(20), t.gradientMap && s.enable(21), t.packedNormalMap && s.enable(22), t.vertexNormals && s.enable(23), e.push(s.mask), s.disableAll(), t.fog && s.enable(0), t.useFog && s.enable(1), t.flatShading && s.enable(2), t.logarithmicDepthBuffer && s.enable(3), t.reversedDepthBuffer && s.enable(4), t.skinning && s.enable(5), t.morphTargets && s.enable(6), t.morphNormals && s.enable(7), t.morphColors && s.enable(8), t.premultipliedAlpha && s.enable(9), t.shadowMapEnabled && s.enable(10), t.doubleSided && s.enable(11), t.flipSided && s.enable(12), t.useDepthPacking && s.enable(13), t.dithering && s.enable(14), t.transmission && s.enable(15), t.sheen && s.enable(16), t.opaque && s.enable(17), t.pointsUvs && s.enable(18), t.decodeVideoTexture && s.enable(19), t.decodeVideoTextureEmissive && s.enable(20), t.alphaToCoverage && s.enable(21), t.numLightProbeGrids > 0 && s.enable(22), t.hasPositionAttribute && s.enable(23), e.push(s.mask);
	}
	function x(e) {
		let t = h[e.type], n;
		if (t) {
			let e = et[t];
			n = Xe.clone(e.uniforms);
		} else n = e.uniforms;
		return n;
	}
	function S(t, n) {
		let r = d.get(n);
		return r === void 0 ? (r = new Or(e, n, t, i), u.push(r), d.set(n, r)) : ++r.usedTimes, r;
	}
	function C(e) {
		if (--e.usedTimes === 0) {
			let t = u.indexOf(e);
			u[t] = u[u.length - 1], u.pop(), d.delete(e.cacheKey), e.destroy();
		}
	}
	function w(e) {
		c.remove(e);
	}
	function T() {
		c.dispose();
	}
	return {
		getParameters: _,
		getProgramCacheKey: v,
		getUniforms: x,
		acquireProgram: S,
		releaseProgram: C,
		releaseShaderCache: w,
		programs: u,
		dispose: T
	};
}
function Pr() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t) {
		return e.has(t);
	}
	function n(t) {
		let n = e.get(t);
		return n === void 0 && (n = {}, e.set(t, n)), n;
	}
	function r(t) {
		e.delete(t);
	}
	function i(t, n, r) {
		e.get(t)[n] = r;
	}
	function a() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		has: t,
		get: n,
		remove: r,
		update: i,
		dispose: a
	};
}
function Fr(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.material.id === t.material.id ? e.materialVariant === t.materialVariant ? e.z === t.z ? e.id - t.id : e.z - t.z : e.materialVariant - t.materialVariant : e.material.id - t.material.id : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function Ir(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.z === t.z ? e.id - t.id : t.z - e.z : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function Lr() {
	let e = [], t = 0, n = [], r = [], i = [];
	function a() {
		t = 0, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		let t = 0;
		return e.isInstancedMesh && (t += 2), e.isSkinnedMesh && (t += 1), t;
	}
	function s(n, r, i, a, s, c) {
		let l = e[t];
		return l === void 0 ? (l = {
			id: n.id,
			object: n,
			geometry: r,
			material: i,
			materialVariant: o(n),
			groupOrder: a,
			renderOrder: n.renderOrder,
			z: s,
			group: c
		}, e[t] = l) : (l.id = n.id, l.object = n, l.geometry = r, l.material = i, l.materialVariant = o(n), l.groupOrder = a, l.renderOrder = n.renderOrder, l.z = s, l.group = c), t++, l;
	}
	function c(e, t, a, o, c, l, u) {
		u.reversedDepth === !0 && (c = -c);
		let d = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.push(d) : a.transparent === !0 ? i.push(d) : n.push(d);
	}
	function l(e, t, a, o, c, l) {
		let u = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.unshift(u) : a.transparent === !0 ? i.unshift(u) : n.unshift(u);
	}
	function u(e, t) {
		n.length > 1 && n.sort(e || Fr), r.length > 1 && r.sort(t || Ir), i.length > 1 && i.sort(t || Ir);
	}
	function d() {
		for (let n = t, r = e.length; n < r; n++) {
			let t = e[n];
			if (t.id === null) break;
			t.id = null, t.object = null, t.geometry = null, t.material = null, t.group = null;
		}
	}
	return {
		opaque: n,
		transmissive: r,
		transparent: i,
		init: a,
		push: c,
		unshift: l,
		finish: d,
		sort: u
	};
}
function Rr() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t, n) {
		let r = e.get(t), i;
		return r === void 0 ? (i = new Lr(), e.set(t, [i])) : n >= r.length ? (i = new Lr(), r.push(i)) : i = r[n], i;
	}
	function n() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: t,
		dispose: n
	};
}
function zr() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "SunLight":
			case "DirectionalLight":
				n = {
					direction: new G(),
					color: new N()
				};
				break;
			case "SpotLight":
				n = {
					position: new G(),
					direction: new G(),
					color: new N(),
					distance: 0,
					coneCos: 0,
					penumbraCos: 0,
					decay: 0
				};
				break;
			case "PointLight":
				n = {
					position: new G(),
					color: new N(),
					distance: 0,
					decay: 0
				};
				break;
			case "HemisphereLight":
				n = {
					direction: new G(),
					skyColor: new N(),
					groundColor: new N()
				};
				break;
			case "RectAreaLight": n = {
				color: new N(),
				position: new G(),
				halfWidth: new G(),
				halfHeight: new G()
			};
		}
		return e[t.id] = n, n;
	} };
}
function Br() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "SunLight":
			case "DirectionalLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new D()
				};
				break;
			case "SpotLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new D()
				};
				break;
			case "PointLight": n = {
				shadowIntensity: 1,
				shadowBias: 0,
				shadowNormalBias: 0,
				shadowRadius: 1,
				shadowMapSize: new D(),
				shadowCameraNear: 1,
				shadowCameraFar: 1e3
			};
		}
		return e[t.id] = n, n;
	} };
}
var Vr = 0;
function Hr(e, t) {
	return (t.castShadow ? 2 : 0) - (e.castShadow ? 2 : 0) + +!!t.map - !!e.map;
}
function Ur(t) {
	let n = new zr(), r = Br(), i = {
		version: 0,
		hash: {
			sunLength: -1,
			directionalLength: -1,
			pointLength: -1,
			spotLength: -1,
			rectAreaLength: -1,
			hemiLength: -1,
			numSunShadows: -1,
			numDirectionalShadows: -1,
			numPointShadows: -1,
			numSpotShadows: -1,
			numSpotMaps: -1,
			numLightProbes: -1
		},
		ambient: [
			0,
			0,
			0
		],
		probe: [],
		sun: [],
		sunShadow: [],
		sunShadowMap: [],
		sunShadowMatrix: [],
		sunShadowCascade: [],
		directional: [],
		directionalShadow: [],
		directionalShadowMap: [],
		directionalShadowMatrix: [],
		spot: [],
		spotLightMap: [],
		spotShadow: [],
		spotShadowMap: [],
		spotLightMatrix: [],
		rectArea: [],
		rectAreaLTC1: null,
		rectAreaLTC2: null,
		point: [],
		pointShadow: [],
		pointShadowMap: [],
		pointShadowMatrix: [],
		hemi: [],
		numSpotLightShadowsWithMaps: 0,
		numLightProbes: 0
	};
	for (let e = 0; e < 9; e++) i.probe.push(new G());
	let a = new G(), o = new e(), s = new e();
	function c(e) {
		let a = 0, o = 0, s = 0;
		for (let e = 0; e < 9; e++) i.probe[e].set(0, 0, 0);
		let c = 0, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0, y = 0, b = 0, x = 0;
		e.sort(Hr);
		for (let t = 0, S = e.length; t < S; t++) {
			let S = e[t], C = S.color, w = S.intensity, T = S.distance, E = null;
			if (S.shadow && S.shadow.map && (E = S.shadow.map.texture.format === 1030 ? S.shadow.map.texture : S.shadow.map.depthTexture || S.shadow.map.texture), S.isAmbientLight) a += C.r * w, o += C.g * w, s += C.b * w;
			else if (S.isLightProbe) {
				for (let e = 0; e < 9; e++) i.probe[e].addScaledVector(S.sh.coefficients[e], w);
				x++;
			} else if (S.isSunLight) {
				let e = n.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), S.castShadow) {
					let e = S.shadow, t = r.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()), i.sunShadow[l] = t, i.sunShadowMap[l] = E;
					let n = e.getViewportCount();
					for (let t = 0; t < n; t++) i.sunShadowMatrix[u + t] = e.getMatrix(t), i.sunShadowCascade[u + t] = e._cascadeData[t];
					u += n, l++;
				}
				i.sun[c] = e, c++;
			} else if (S.isDirectionalLight) {
				let e = n.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), S.castShadow) {
					let e = S.shadow, t = r.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, i.directionalShadow[d] = t, i.directionalShadowMap[d] = E, i.directionalShadowMatrix[d] = S.shadow.matrix, g++;
				}
				i.directional[d] = e, d++;
			} else if (S.isSpotLight) {
				let e = n.get(S);
				e.position.setFromMatrixPosition(S.matrixWorld), e.color.copy(C).multiplyScalar(w), e.distance = T, e.coneCos = Math.cos(S.angle), e.penumbraCos = Math.cos(S.angle * (1 - S.penumbra)), e.decay = S.decay, i.spot[p] = e;
				let t = S.shadow;
				if (S.map && (i.spotLightMap[y] = S.map, y++, t.updateMatrices(S), S.castShadow && b++), i.spotLightMatrix[p] = t.matrix, S.castShadow) {
					let e = r.get(S);
					e.shadowIntensity = t.intensity, e.shadowBias = t.bias, e.shadowNormalBias = t.normalBias, e.shadowRadius = t.radius, e.shadowMapSize = t.mapSize, i.spotShadow[p] = e, i.spotShadowMap[p] = E, v++;
				}
				p++;
			} else if (S.isRectAreaLight) {
				let e = n.get(S);
				e.color.copy(C).multiplyScalar(w), e.halfWidth.set(S.width * .5, 0, 0), e.halfHeight.set(0, S.height * .5, 0), i.rectArea[m] = e, m++;
			} else if (S.isPointLight) {
				let e = n.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), e.distance = S.distance, e.decay = S.decay, S.castShadow) {
					let e = S.shadow, t = r.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, t.shadowCameraNear = e.camera.near, t.shadowCameraFar = e.camera.far, i.pointShadow[f] = t, i.pointShadowMap[f] = E, i.pointShadowMatrix[f] = S.shadow.matrix, _++;
				}
				i.point[f] = e, f++;
			} else if (S.isHemisphereLight) {
				let e = n.get(S);
				e.skyColor.copy(S.color).multiplyScalar(w), e.groundColor.copy(S.groundColor).multiplyScalar(w), i.hemi[h] = e, h++;
			}
		}
		m > 0 && (t.has("OES_texture_float_linear") === !0 ? (i.rectAreaLTC1 = Q.LTC_FLOAT_1, i.rectAreaLTC2 = Q.LTC_FLOAT_2) : (i.rectAreaLTC1 = Q.LTC_HALF_1, i.rectAreaLTC2 = Q.LTC_HALF_2)), i.ambient[0] = a, i.ambient[1] = o, i.ambient[2] = s;
		let S = i.hash;
		(S.sunLength !== c || S.directionalLength !== d || S.pointLength !== f || S.spotLength !== p || S.rectAreaLength !== m || S.hemiLength !== h || S.numSunShadows !== l || S.numDirectionalShadows !== g || S.numPointShadows !== _ || S.numSpotShadows !== v || S.numSpotMaps !== y || S.numLightProbes !== x) && (i.sun.length = c, i.directional.length = d, i.spot.length = p, i.rectArea.length = m, i.point.length = f, i.hemi.length = h, i.sunShadow.length = l, i.sunShadowMap.length = l, i.sunShadowMatrix.length = u, i.sunShadowCascade.length = u, i.directionalShadow.length = g, i.directionalShadowMap.length = g, i.directionalShadowMatrix.length = g, i.pointShadow.length = _, i.pointShadowMap.length = _, i.pointShadowMatrix.length = _, i.spotShadow.length = v, i.spotShadowMap.length = v, i.spotLightMatrix.length = v + y - b, i.spotLightMap.length = y, i.numSpotLightShadowsWithMaps = b, i.numLightProbes = x, S.sunLength = c, S.directionalLength = d, S.pointLength = f, S.spotLength = p, S.rectAreaLength = m, S.hemiLength = h, S.numSunShadows = l, S.numDirectionalShadows = g, S.numPointShadows = _, S.numSpotShadows = v, S.numSpotMaps = y, S.numLightProbes = x, i.version = Vr++);
	}
	function l(e, t) {
		let n = 0, r = 0, c = 0, l = 0, u = 0, d = 0, f = t.matrixWorldInverse;
		for (let t = 0, p = e.length; t < p; t++) {
			let p = e[t];
			if (p.isSunLight) {
				let e = i.sun[n];
				e.direction.setFromMatrixPosition(p.matrixWorld), e.direction.transformDirection(f), n++;
			} else if (p.isDirectionalLight) {
				let e = i.directional[r];
				e.direction.setFromMatrixPosition(p.matrixWorld), a.setFromMatrixPosition(p.target.matrixWorld), e.direction.sub(a), e.direction.transformDirection(f), r++;
			} else if (p.isSpotLight) {
				let e = i.spot[l];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), e.direction.setFromMatrixPosition(p.matrixWorld), a.setFromMatrixPosition(p.target.matrixWorld), e.direction.sub(a), e.direction.transformDirection(f), l++;
			} else if (p.isRectAreaLight) {
				let e = i.rectArea[u];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), s.identity(), o.copy(p.matrixWorld), o.premultiply(f), s.extractRotation(o), e.halfWidth.set(p.width * .5, 0, 0), e.halfHeight.set(0, p.height * .5, 0), e.halfWidth.applyMatrix4(s), e.halfHeight.applyMatrix4(s), u++;
			} else if (p.isPointLight) {
				let e = i.point[c];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), c++;
			} else if (p.isHemisphereLight) {
				let e = i.hemi[d];
				e.direction.setFromMatrixPosition(p.matrixWorld), e.direction.transformDirection(f), d++;
			}
		}
	}
	return {
		setup: c,
		setupView: l,
		state: i
	};
}
function Wr(e) {
	let t = new Ur(e), n = [], r = [], i = [];
	function a(e) {
		d.camera = e, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		n.push(e);
	}
	function s(e) {
		r.push(e);
	}
	function c(e) {
		i.push(e);
	}
	function l() {
		t.setup(n);
	}
	function u(e) {
		t.setupView(n, e);
	}
	let d = {
		lightsArray: n,
		shadowsArray: r,
		lightProbeGridArray: i,
		camera: null,
		lights: t,
		transmissionRenderTarget: {},
		textureUnits: 0
	};
	return {
		init: a,
		state: d,
		setupLights: l,
		setupLightsView: u,
		pushLight: o,
		pushShadow: s,
		pushLightProbeGrid: c
	};
}
function Gr(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(n, r = 0) {
		let i = t.get(n), a;
		return i === void 0 ? (a = new Wr(e), t.set(n, [a])) : r >= i.length ? (a = new Wr(e), i.push(a)) : a = i[r], a;
	}
	function r() {
		t = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: n,
		dispose: r
	};
}
var Kr = "void main() {\n	gl_Position = vec4( position, 1.0 );\n}", qr = "uniform sampler2D shadow_pass;\nuniform vec2 resolution;\nuniform float radius;\nvoid main() {\n	const float samples = float( VSM_SAMPLES );\n	float mean = 0.0;\n	float squared_mean = 0.0;\n	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );\n	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;\n	for ( float i = 0.0; i < samples; i ++ ) {\n		float uvOffset = uvStart + i * uvStride;\n		#ifdef HORIZONTAL_PASS\n			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;\n			mean += distribution.x;\n			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n		#else\n			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;\n			mean += depth;\n			squared_mean += depth * depth;\n		#endif\n	}\n	mean = mean / samples;\n	squared_mean = squared_mean / samples;\n	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );\n	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );\n}", Jr = [
	/*@__PURE__*/ new G(1, 0, 0),
	/*@__PURE__*/ new G(-1, 0, 0),
	/*@__PURE__*/ new G(0, 1, 0),
	/*@__PURE__*/ new G(0, -1, 0),
	/*@__PURE__*/ new G(0, 0, 1),
	/*@__PURE__*/ new G(0, 0, -1)
], Yr = [
	/*@__PURE__*/ new G(0, -1, 0),
	/*@__PURE__*/ new G(0, -1, 0),
	/*@__PURE__*/ new G(0, 0, 1),
	/*@__PURE__*/ new G(0, 0, -1),
	/*@__PURE__*/ new G(0, -1, 0),
	/*@__PURE__*/ new G(0, -1, 0)
], Xr = /*@__PURE__*/ new e(), Zr = /*@__PURE__*/ new G(), Qr = /*@__PURE__*/ new G();
function $r(e, t, i) {
	let a = new j(), o = new D(), s = new D(), c = new r(), l = new Pe(), u = new Y(), d = {}, f = i.maxTextureSize, p = {
		0: 1,
		1: 0,
		2: 2
	}, m = new U({
		defines: { VSM_SAMPLES: 8 },
		uniforms: {
			shadow_pass: { value: null },
			resolution: { value: new D() },
			radius: { value: 4 }
		},
		vertexShader: Kr,
		fragmentShader: qr
	}), h = m.clone();
	h.defines.HORIZONTAL_PASS = 1;
	let g = new B();
	g.setAttribute("position", new W(new Float32Array([
		-1,
		-1,
		.5,
		3,
		-1,
		.5,
		-1,
		3,
		.5
	]), 3));
	let _ = new H(g, m), v = this;
	this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = 1;
	let y = this.type;
	this.render = function(t, r, i) {
		if (v.enabled === !1 || v.autoUpdate === !1 && v.needsUpdate === !1 || t.length === 0) return;
		this.type === 2 && (F("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."), this.type = 1);
		let l = e.getRenderTarget(), u = e.getActiveCubeFace(), d = e.getActiveMipmapLevel(), p = e.state;
		p.setBlending(0), p.buffers.depth.getReversed() === !0 ? p.buffers.color.setClear(0, 0, 0, 0) : p.buffers.color.setClear(1, 1, 1, 1), p.buffers.depth.setTest(!0), p.setScissorTest(!1);
		let m = y !== this.type;
		m && r.traverse(function(e) {
			e.material && (Array.isArray(e.material) ? e.material.forEach((e) => e.needsUpdate = !0) : e.material.needsUpdate = !0);
		});
		for (let l = 0, u = t.length; l < u; l++) {
			let u = t[l], d = u.shadow;
			if (d === void 0) {
				F("WebGLShadowMap:", u, "has no shadow.");
				continue;
			}
			if (d.autoUpdate === !1 && d.needsUpdate === !1) continue;
			o.copy(d.mapSize);
			let h = d.getFrameExtents();
			o.multiply(h), s.copy(d.mapSize), (o.x > f || o.y > f) && (o.x > f && (s.x = Math.floor(f / h.x), o.x = s.x * h.x, d.mapSize.x = s.x), o.y > f && (s.y = Math.floor(f / h.y), o.y = s.y * h.y, d.mapSize.y = s.y));
			let g = e.state.buffers.depth.getReversed();
			if (d.camera._reversedDepth = g, d.map === null || m === !0) {
				if (d.map !== null && (d.map.depthTexture !== null && (d.map.depthTexture.dispose(), d.map.depthTexture = null), d.map.dispose()), this.type === 3) {
					if (u.isPointLight) {
						F("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");
						continue;
					}
					d.map = new C(o.x, o.y, {
						format: oe,
						type: I,
						minFilter: q,
						magFilter: q,
						generateMipmaps: !1
					}), d.map.texture.name = u.name + ".shadowMap", d.map.depthTexture = new S(o.x, o.y, b), d.map.depthTexture.name = u.name + ".shadowMapDepth", d.map.depthTexture.format = n, d.map.depthTexture.compareFunction = null, d.map.depthTexture.minFilter = le, d.map.depthTexture.magFilter = le;
				} else u.isPointLight ? (d.map = new kt(o.x), d.map.depthTexture = new P(o.x, Ke)) : (d.map = new C(o.x, o.y), d.map.depthTexture = new S(o.x, o.y, Ke)), d.map.depthTexture.name = u.name + ".shadowMap", d.map.depthTexture.format = n, this.type === 1 ? (d.map.depthTexture.compareFunction = g ? 518 : 515, d.map.depthTexture.minFilter = q, d.map.depthTexture.magFilter = q) : (d.map.depthTexture.compareFunction = null, d.map.depthTexture.minFilter = le, d.map.depthTexture.magFilter = le);
				d.camera.updateProjectionMatrix();
			}
			d.map.isWebGLCubeRenderTarget !== !0 && (d.map.width !== o.x || d.map.height !== o.y) && d.map.setSize(o.x, o.y);
			let _ = d.map.isWebGLCubeRenderTarget ? 6 : d.getViewportCount();
			u.isPointLight !== !0 && d.updateMatrices(u, i);
			for (let t = 0; t < _; t++) {
				let n = d.getCamera(t);
				if (u.isPointLight) {
					let e = d.camera, n = d.matrix, r = u.distance || e.far;
					r !== e.far && (e.far = r, e.updateProjectionMatrix()), Zr.setFromMatrixPosition(u.matrixWorld), e.position.copy(Zr), Qr.copy(e.position), Qr.add(Jr[t]), e.up.copy(Yr[t]), e.lookAt(Qr), e.updateMatrixWorld(), n.makeTranslation(-Zr.x, -Zr.y, -Zr.z), Xr.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), d._frustum.setFromProjectionMatrix(Xr, e.coordinateSystem, e.reversedDepth);
				}
				if (d.map.isWebGLCubeRenderTarget) e.setRenderTarget(d.map, t), e.clear();
				else {
					t === 0 && (e.setRenderTarget(d.map), e.clear());
					let n = d.getViewport(t);
					c.set(s.x * n.x, s.y * n.y, s.x * n.z, s.y * n.w), p.viewport(c);
				}
				a = d.getFrustum(t), T(r, i, n, u, this.type);
			}
			d.isPointLightShadow !== !0 && this.type === 3 && x(d, i), d.needsUpdate = !1;
		}
		y = this.type, v.needsUpdate = !1, e.setRenderTarget(l, u, d);
	};
	function x(n, r) {
		let i = t.update(_);
		m.defines.VSM_SAMPLES !== n.blurSamples && (m.defines.VSM_SAMPLES = n.blurSamples, h.defines.VSM_SAMPLES = n.blurSamples, m.needsUpdate = !0, h.needsUpdate = !0), n.mapPass === null ? n.mapPass = new C(o.x, o.y, {
			format: oe,
			type: I
		}) : (n.mapPass.width !== n.map.width || n.mapPass.height !== n.map.height) && n.mapPass.setSize(n.map.width, n.map.height), m.uniforms.shadow_pass.value = n.map.depthTexture, m.uniforms.resolution.value.set(n.map.width, n.map.height), m.uniforms.radius.value = n.radius, e.setRenderTarget(n.mapPass), e.clear(), e.renderBufferDirect(r, null, i, m, _, null), h.uniforms.shadow_pass.value = n.mapPass.texture, h.uniforms.resolution.value.set(n.map.width, n.map.height), h.uniforms.radius.value = n.radius, e.setRenderTarget(n.map), e.clear(), e.renderBufferDirect(r, null, i, h, _, null);
	}
	function w(t, n, r, i) {
		let a = null, o = r.isPointLight === !0 ? t.customDistanceMaterial : t.customDepthMaterial;
		if (o !== void 0) a = o;
		else if (a = r.isPointLight === !0 ? u : l, e.localClippingEnabled && n.clipShadows === !0 && Array.isArray(n.clippingPlanes) && n.clippingPlanes.length !== 0 || n.displacementMap && n.displacementScale !== 0 || n.alphaMap && n.alphaTest > 0 || n.map && n.alphaTest > 0 || n.alphaToCoverage === !0) {
			let e = a.uuid, t = n.uuid, r = d[e];
			r === void 0 && (r = {}, d[e] = r);
			let i = r[t];
			i === void 0 && (i = a.clone(), r[t] = i, n.addEventListener("dispose", E)), a = i;
		}
		if (a.visible = n.visible, a.wireframe = n.wireframe, i === 3 ? a.side = n.shadowSide === null ? n.side : n.shadowSide : a.side = n.shadowSide === null ? p[n.side] : n.shadowSide, a.alphaMap = n.alphaMap, a.alphaTest = n.alphaToCoverage === !0 ? .5 : n.alphaTest, a.map = n.map, a.clipShadows = n.clipShadows, a.clippingPlanes = n.clippingPlanes, a.clipIntersection = n.clipIntersection, a.displacementMap = n.displacementMap, a.displacementScale = n.displacementScale, a.displacementBias = n.displacementBias, a.wireframeLinewidth = n.wireframeLinewidth, a.linewidth = n.linewidth, r.isPointLight === !0 && a.isMeshDistanceMaterial === !0) {
			let t = e.properties.get(a);
			t.light = r;
		}
		return a;
	}
	function T(n, r, i, o, s) {
		if (n.visible === !1) return;
		if (n.layers.test(r.layers) && (n.isMesh || n.isLine || n.isPoints) && (n.castShadow || n.receiveShadow && s === 3) && (!n.frustumCulled || n.intersectsFrustum(a))) {
			n.modelViewMatrix.multiplyMatrices(i.matrixWorldInverse, n.matrixWorld);
			let a = t.update(n), c = n.material;
			if (Array.isArray(c)) {
				let t = a.groups;
				for (let l = 0, u = t.length; l < u; l++) {
					let u = t[l], d = c[u.materialIndex];
					if (d && d.visible) {
						let t = w(n, d, o, s);
						n.onBeforeShadow(e, n, r, i, a, t, u), e.renderBufferDirect(i, null, a, t, n, u), n.onAfterShadow(e, n, r, i, a, t, u);
					}
				}
			} else if (c.visible) {
				let t = w(n, c, o, s);
				n.onBeforeShadow(e, n, r, i, a, t, null), e.renderBufferDirect(i, null, a, t, n, null), n.onAfterShadow(e, n, r, i, a, t, null);
			}
		}
		let c = n.children;
		for (let e = 0, t = c.length; e < t; e++) T(c[e], r, i, o, s);
	}
	function E(e) {
		e.target.removeEventListener("dispose", E);
		for (let t in d) {
			let n = d[t], r = e.target.uuid;
			r in n && (n[r].dispose(), delete n[r]);
		}
	}
}
function ei(e, t) {
	function n() {
		let t = !1, n = new r(), i = null, a = new r(0, 0, 0, 0);
		return {
			setMask: function(n) {
				i !== n && !t && (e.colorMask(n, n, n, n), i = n);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t, r, i, o, s) {
				s === !0 && (t *= o, r *= o, i *= o), n.set(t, r, i, o), a.equals(n) === !1 && (e.clearColor(t, r, i, o), a.copy(n));
			},
			reset: function() {
				t = !1, i = null, a.set(-1, 0, 0, 0);
			}
		};
	}
	function i() {
		let n = !1, r = !1, i = null, a = null, o = null;
		return {
			setReversed: function(e) {
				if (r !== e) {
					let n = t.get("EXT_clip_control");
					e ? n.clipControlEXT(n.LOWER_LEFT_EXT, n.ZERO_TO_ONE_EXT) : n.clipControlEXT(n.LOWER_LEFT_EXT, n.NEGATIVE_ONE_TO_ONE_EXT), r = e;
					let i = o;
					o = null, this.setClear(i);
				}
			},
			getReversed: function() {
				return r;
			},
			setTest: function(t) {
				t ? B(e.DEPTH_TEST) : se(e.DEPTH_TEST);
			},
			setMask: function(t) {
				i !== t && !n && (e.depthMask(t), i = t);
			},
			setFunc: function(t) {
				if (r && (t = Se[t]), a !== t) {
					switch (t) {
						case 0:
							e.depthFunc(e.NEVER);
							break;
						case 1:
							e.depthFunc(e.ALWAYS);
							break;
						case 2:
							e.depthFunc(e.LESS);
							break;
						case 3:
							e.depthFunc(e.LEQUAL);
							break;
						case 4:
							e.depthFunc(e.EQUAL);
							break;
						case 5:
							e.depthFunc(e.GEQUAL);
							break;
						case 6:
							e.depthFunc(e.GREATER);
							break;
						case 7:
							e.depthFunc(e.NOTEQUAL);
							break;
						default: e.depthFunc(e.LEQUAL);
					}
					a = t;
				}
			},
			setLocked: function(e) {
				n = e;
			},
			setClear: function(t) {
				o !== t && (o = t, r && (t = 1 - t), e.clearDepth(t));
			},
			reset: function() {
				n = !1, i = null, a = null, o = null, r = !1;
			}
		};
	}
	function a() {
		let t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
		return {
			setTest: function(n) {
				t || (n ? B(e.STENCIL_TEST) : se(e.STENCIL_TEST));
			},
			setMask: function(r) {
				n !== r && !t && (e.stencilMask(r), n = r);
			},
			setFunc: function(t, n, o) {
				(r !== t || i !== n || a !== o) && (e.stencilFunc(t, n, o), r = t, i = n, a = o);
			},
			setOp: function(t, n, r) {
				(o !== t || s !== n || c !== r) && (e.stencilOp(t, n, r), o = t, s = n, c = r);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t) {
				l !== t && (e.clearStencil(t), l = t);
			},
			reset: function() {
				t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
			}
		};
	}
	let o = new n(), s = new i(), c = new a(), l = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), d = {}, f = {}, p = {}, m = /* @__PURE__ */ new WeakMap(), h = [], g = null, _ = !1, v = null, y = null, b = null, S = null, C = null, w = null, T = null, E = new N(0, 0, 0), D = 0, O = !1, k = null, A = null, ee = null, j = null, M = null, te = e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS), P = !1, ne = 0, re = e.getParameter(e.VERSION);
	re.indexOf("WebGL") === -1 ? re.indexOf("OpenGL ES") !== -1 && (ne = parseFloat(/^OpenGL ES (\d)/.exec(re)[1]), P = ne >= 2) : (ne = parseFloat(/^WebGL (\d)/.exec(re)[1]), P = ne >= 1);
	let F = null, I = {}, L = e.getParameter(e.SCISSOR_BOX), ie = e.getParameter(e.VIEWPORT), R = new r().fromArray(L), ae = new r().fromArray(ie);
	function z(t, n, r, i) {
		let a = /* @__PURE__ */ new Uint8Array(4), o = e.createTexture();
		e.bindTexture(t, o), e.texParameteri(t, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(t, e.TEXTURE_MAG_FILTER, e.NEAREST);
		for (let o = 0; o < r; o++) t === e.TEXTURE_3D || t === e.TEXTURE_2D_ARRAY ? e.texImage3D(n, 0, e.RGBA, 1, 1, i, 0, e.RGBA, e.UNSIGNED_BYTE, a) : e.texImage2D(n + o, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, a);
		return o;
	}
	let oe = {};
	oe[e.TEXTURE_2D] = z(e.TEXTURE_2D, e.TEXTURE_2D, 1), oe[e.TEXTURE_CUBE_MAP] = z(e.TEXTURE_CUBE_MAP, e.TEXTURE_CUBE_MAP_POSITIVE_X, 6), oe[e.TEXTURE_2D_ARRAY] = z(e.TEXTURE_2D_ARRAY, e.TEXTURE_2D_ARRAY, 1, 1), oe[e.TEXTURE_3D] = z(e.TEXTURE_3D, e.TEXTURE_3D, 1, 1), o.setClear(0, 0, 0, 1), s.setClear(1), c.setClear(0), B(e.DEPTH_TEST), s.setFunc(3), me(!1), he(1), B(e.CULL_FACE), fe(0);
	function B(t) {
		d[t] !== !0 && (e.enable(t), d[t] = !0);
	}
	function se(t) {
		d[t] !== !1 && (e.disable(t), d[t] = !1);
	}
	function ce(t, n) {
		return p[t] !== n && (e.bindFramebuffer(t, n), p[t] = n, t === e.DRAW_FRAMEBUFFER && (p[e.FRAMEBUFFER] = n), t === e.FRAMEBUFFER && (p[e.DRAW_FRAMEBUFFER] = n), !0);
	}
	function le(t, n) {
		let r = h, i = !1;
		if (t) {
			r = m.get(n), r === void 0 && (r = [], m.set(n, r));
			let a = t.textures;
			if (r.length !== a.length || r[0] !== e.COLOR_ATTACHMENT0) {
				for (let t = 0, n = a.length; t < n; t++) r[t] = e.COLOR_ATTACHMENT0 + t;
				r.length = a.length, i = !0;
			}
		} else r[0] !== e.BACK && (r[0] = e.BACK, i = !0);
		i && e.drawBuffers(r);
	}
	function ue(t) {
		return g !== t && (e.useProgram(t), g = t, !0);
	}
	let V = {
		100: e.FUNC_ADD,
		101: e.FUNC_SUBTRACT,
		102: e.FUNC_REVERSE_SUBTRACT
	};
	V[103] = e.MIN, V[104] = e.MAX;
	let de = {
		200: e.ZERO,
		201: e.ONE,
		202: e.SRC_COLOR,
		204: e.SRC_ALPHA,
		210: e.SRC_ALPHA_SATURATE,
		208: e.DST_COLOR,
		206: e.DST_ALPHA,
		203: e.ONE_MINUS_SRC_COLOR,
		205: e.ONE_MINUS_SRC_ALPHA,
		209: e.ONE_MINUS_DST_COLOR,
		207: e.ONE_MINUS_DST_ALPHA,
		211: e.CONSTANT_COLOR,
		212: e.ONE_MINUS_CONSTANT_COLOR,
		213: e.CONSTANT_ALPHA,
		214: e.ONE_MINUS_CONSTANT_ALPHA
	};
	function fe(t, n, r, i, a, o, s, c, l, u) {
		if (t === 0) _ === !0 && (se(e.BLEND), _ = !1);
		else if (_ === !1 && (B(e.BLEND), _ = !0), t !== 5) {
			if (t !== v || u !== O) {
				if ((y !== 100 || C !== 100) && (e.blendEquation(e.FUNC_ADD), y = 100, C = 100), u) switch (t) {
					case 1:
						e.blendFuncSeparate(e.ONE, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFunc(e.ONE, e.ONE);
						break;
					case 3:
						e.blendFuncSeparate(e.ZERO, e.ONE_MINUS_SRC_COLOR, e.ZERO, e.ONE);
						break;
					case 4:
						e.blendFuncSeparate(e.DST_COLOR, e.ONE_MINUS_SRC_ALPHA, e.ZERO, e.ONE);
						break;
					default: x("WebGLState: Invalid blending: ", t);
				}
				else switch (t) {
					case 1:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE, e.ONE, e.ONE);
						break;
					case 3:
						x("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
						break;
					case 4:
						x("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
						break;
					default: x("WebGLState: Invalid blending: ", t);
				}
				b = null, S = null, w = null, T = null, E.set(0, 0, 0), D = 0, v = t, O = u;
			}
		} else a ||= n, o ||= r, s ||= i, (n !== y || a !== C) && (e.blendEquationSeparate(V[n], V[a]), y = n, C = a), (r !== b || i !== S || o !== w || s !== T) && (e.blendFuncSeparate(de[r], de[i], de[o], de[s]), b = r, S = i, w = o, T = s), (c.equals(E) === !1 || l !== D) && (e.blendColor(c.r, c.g, c.b, l), E.copy(c), D = l), v = t, O = !1;
	}
	function pe(t, n) {
		t.side === 2 ? se(e.CULL_FACE) : B(e.CULL_FACE);
		let r = t.side === 1;
		n && (r = !r), me(r), t.blending === 1 && t.transparent === !1 ? fe(0) : fe(t.blending, t.blendEquation, t.blendSrc, t.blendDst, t.blendEquationAlpha, t.blendSrcAlpha, t.blendDstAlpha, t.blendColor, t.blendAlpha, t.premultipliedAlpha), s.setFunc(t.depthFunc), s.setTest(t.depthTest), s.setMask(t.depthWrite), o.setMask(t.colorWrite);
		let i = t.stencilWrite;
		c.setTest(i), i && (c.setMask(t.stencilWriteMask), c.setFunc(t.stencilFunc, t.stencilRef, t.stencilFuncMask), c.setOp(t.stencilFail, t.stencilZFail, t.stencilZPass)), U(t.polygonOffset, t.polygonOffsetFactor, t.polygonOffsetUnits), t.alphaToCoverage === !0 ? B(e.SAMPLE_ALPHA_TO_COVERAGE) : se(e.SAMPLE_ALPHA_TO_COVERAGE);
	}
	function me(t) {
		k !== t && (t ? e.frontFace(e.CW) : e.frontFace(e.CCW), k = t);
	}
	function he(t) {
		t === 0 ? se(e.CULL_FACE) : (B(e.CULL_FACE), t !== A && (t === 1 ? e.cullFace(e.BACK) : t === 2 ? e.cullFace(e.FRONT) : e.cullFace(e.FRONT_AND_BACK))), A = t;
	}
	function H(t) {
		t !== ee && (P && e.lineWidth(t), ee = t);
	}
	function U(t, n, r) {
		t ? (B(e.POLYGON_OFFSET_FILL), (j !== n || M !== r) && (j = n, M = r, s.getReversed() && (n = -n), e.polygonOffset(n, r))) : se(e.POLYGON_OFFSET_FILL);
	}
	function ge(t) {
		t ? B(e.SCISSOR_TEST) : se(e.SCISSOR_TEST);
	}
	function W(t) {
		t === void 0 && (t = e.TEXTURE0 + te - 1), F !== t && (e.activeTexture(t), F = t);
	}
	function _e(t, n, r) {
		r === void 0 && (r = F === null ? e.TEXTURE0 + te - 1 : F);
		let i = I[r];
		i === void 0 && (i = {
			type: void 0,
			texture: void 0
		}, I[r] = i), (i.type !== t || i.texture !== n) && (F !== r && (e.activeTexture(r), F = r), e.bindTexture(t, n || oe[t]), i.type = t, i.texture = n);
	}
	function ve() {
		let t = I[F];
		t !== void 0 && t.type !== void 0 && (e.bindTexture(t.type, null), t.type = void 0, t.texture = void 0);
	}
	function ye() {
		try {
			e.compressedTexImage2D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function be() {
		try {
			e.compressedTexImage3D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function xe() {
		try {
			e.texSubImage2D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function Ce() {
		try {
			e.texSubImage3D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function we() {
		try {
			e.compressedTexSubImage2D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function Te() {
		try {
			e.compressedTexSubImage3D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function Ee() {
		try {
			e.texStorage2D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function G() {
		try {
			e.texStorage3D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function De() {
		try {
			e.texImage2D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function Oe() {
		try {
			e.texImage3D(...arguments);
		} catch (e) {
			x("WebGLState:", e);
		}
	}
	function ke(t) {
		return f[t] === void 0 ? e.getParameter(t) : f[t];
	}
	function Ae(t, n) {
		f[t] !== n && (e.pixelStorei(t, n), f[t] = n);
	}
	function je(t) {
		R.equals(t) === !1 && (e.scissor(t.x, t.y, t.z, t.w), R.copy(t));
	}
	function Me(t) {
		ae.equals(t) === !1 && (e.viewport(t.x, t.y, t.z, t.w), ae.copy(t));
	}
	function Ne(t, n) {
		let r = u.get(n);
		r === void 0 && (r = /* @__PURE__ */ new WeakMap(), u.set(n, r));
		let i = r.get(t);
		i === void 0 && (i = e.getUniformBlockIndex(n, t.name), r.set(t, i));
	}
	function Pe(t, n) {
		let r = u.get(n).get(t);
		l.get(n) !== r && (e.uniformBlockBinding(n, r, t.__bindingPointIndex), l.set(n, r));
	}
	function K() {
		e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.POLYGON_OFFSET_FILL), e.disable(e.SCISSOR_TEST), e.disable(e.STENCIL_TEST), e.disable(e.SAMPLE_ALPHA_TO_COVERAGE), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ONE, e.ZERO), e.blendFuncSeparate(e.ONE, e.ZERO, e.ONE, e.ZERO), e.blendColor(0, 0, 0, 0), e.colorMask(!0, !0, !0, !0), e.clearColor(0, 0, 0, 0), e.depthMask(!0), e.depthFunc(e.LESS), s.setReversed(!1), e.clearDepth(1), e.stencilMask(4294967295), e.stencilFunc(e.ALWAYS, 0, 4294967295), e.stencilOp(e.KEEP, e.KEEP, e.KEEP), e.clearStencil(0), e.cullFace(e.BACK), e.frontFace(e.CCW), e.polygonOffset(0, 0), e.activeTexture(e.TEXTURE0), e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), e.bindFramebuffer(e.READ_FRAMEBUFFER, null), e.useProgram(null), e.lineWidth(1), e.scissor(0, 0, e.canvas.width, e.canvas.height), e.viewport(0, 0, e.canvas.width, e.canvas.height), e.pixelStorei(e.PACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.pixelStorei(e.PACK_ROW_LENGTH, 0), e.pixelStorei(e.PACK_SKIP_PIXELS, 0), e.pixelStorei(e.PACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_ROW_LENGTH, 0), e.pixelStorei(e.UNPACK_IMAGE_HEIGHT, 0), e.pixelStorei(e.UNPACK_SKIP_PIXELS, 0), e.pixelStorei(e.UNPACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_SKIP_IMAGES, 0), d = {}, f = {}, F = null, I = {}, p = {}, m = /* @__PURE__ */ new WeakMap(), h = [], g = null, _ = !1, v = null, y = null, b = null, S = null, C = null, w = null, T = null, E = new N(0, 0, 0), D = 0, O = !1, k = null, A = null, ee = null, j = null, M = null, R.set(0, 0, e.canvas.width, e.canvas.height), ae.set(0, 0, e.canvas.width, e.canvas.height), o.reset(), s.reset(), c.reset();
	}
	return {
		buffers: {
			color: o,
			depth: s,
			stencil: c
		},
		enable: B,
		disable: se,
		bindFramebuffer: ce,
		drawBuffers: le,
		useProgram: ue,
		setBlending: fe,
		setMaterial: pe,
		setFlipSided: me,
		setCullFace: he,
		setLineWidth: H,
		setPolygonOffset: U,
		setScissorTest: ge,
		activeTexture: W,
		bindTexture: _e,
		unbindTexture: ve,
		compressedTexImage2D: ye,
		compressedTexImage3D: be,
		texImage2D: De,
		texImage3D: Oe,
		pixelStorei: Ae,
		getParameter: ke,
		updateUBOMapping: Ne,
		uniformBlockBinding: Pe,
		texStorage2D: Ee,
		texStorage3D: G,
		texSubImage2D: xe,
		texSubImage3D: Ce,
		compressedTexSubImage2D: we,
		compressedTexSubImage3D: Te,
		scissor: je,
		viewport: Me,
		reset: K
	};
}
function ti(e, t, n, r, i, a, s) {
	let c = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), u = new D(), d = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new Set(), p, m = /* @__PURE__ */ new WeakMap(), h = !1;
	try {
		h = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
	} catch {}
	function g(e, t) {
		return h ? new OffscreenCanvas(e, t) : _("canvas");
	}
	function y(e, t, n) {
		let r = 1, i = De(e);
		if ((i.width > n || i.height > n) && (r = n / Math.max(i.width, i.height)), r < 1) {
			if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof VideoFrame < "u" && e instanceof VideoFrame) {
				let n = Math.floor(r * i.width), a = Math.floor(r * i.height);
				p === void 0 && (p = g(n, a));
				let o = t ? g(n, a) : p;
				return o.width = n, o.height = a, o.getContext("2d").drawImage(e, 0, 0, n, a), F("WebGLRenderer: Texture has been resized from (" + i.width + "x" + i.height + ") to (" + n + "x" + a + ")."), o;
			}
			return "data" in e && F("WebGLRenderer: Image in DataTexture is too big (" + i.width + "x" + i.height + ")."), e;
		}
		return e;
	}
	function b(e) {
		return e.generateMipmaps;
	}
	function S(t) {
		e.generateMipmap(t);
	}
	function C(t) {
		return t.isWebGLCubeRenderTarget ? e.TEXTURE_CUBE_MAP : t.isWebGL3DRenderTarget ? e.TEXTURE_3D : t.isWebGLArrayRenderTarget || t.isCompressedArrayTexture ? e.TEXTURE_2D_ARRAY : e.TEXTURE_2D;
	}
	function w(n, r, i, a, s, c = !1) {
		if (n !== null) {
			if (e[n] !== void 0) return e[n];
			F("WebGLRenderer: Attempt to use non-existing WebGL internal format '" + n + "'");
		}
		let l;
		a && (l = t.get("EXT_texture_norm16"), l || F("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));
		let u = r;
		if (r === e.RED && (i === e.FLOAT && (u = e.R32F), i === e.HALF_FLOAT && (u = e.R16F), i === e.UNSIGNED_BYTE && (u = e.R8), i === e.UNSIGNED_SHORT && l && (u = l.R16_EXT), i === e.SHORT && l && (u = l.R16_SNORM_EXT)), r === e.RED_INTEGER && (i === e.UNSIGNED_BYTE && (u = e.R8UI), i === e.UNSIGNED_SHORT && (u = e.R16UI), i === e.UNSIGNED_INT && (u = e.R32UI), i === e.BYTE && (u = e.R8I), i === e.SHORT && (u = e.R16I), i === e.INT && (u = e.R32I)), r === e.RG && (i === e.FLOAT && (u = e.RG32F), i === e.HALF_FLOAT && (u = e.RG16F), i === e.UNSIGNED_BYTE && (u = e.RG8), i === e.UNSIGNED_SHORT && l && (u = l.RG16_EXT), i === e.SHORT && l && (u = l.RG16_SNORM_EXT)), r === e.RG_INTEGER && (i === e.UNSIGNED_BYTE && (u = e.RG8UI), i === e.UNSIGNED_SHORT && (u = e.RG16UI), i === e.UNSIGNED_INT && (u = e.RG32UI), i === e.BYTE && (u = e.RG8I), i === e.SHORT && (u = e.RG16I), i === e.INT && (u = e.RG32I)), r === e.RGB_INTEGER && (i === e.UNSIGNED_BYTE && (u = e.RGB8UI), i === e.UNSIGNED_SHORT && (u = e.RGB16UI), i === e.UNSIGNED_INT && (u = e.RGB32UI), i === e.BYTE && (u = e.RGB8I), i === e.SHORT && (u = e.RGB16I), i === e.INT && (u = e.RGB32I)), r === e.RGBA_INTEGER && (i === e.UNSIGNED_BYTE && (u = e.RGBA8UI), i === e.UNSIGNED_SHORT && (u = e.RGBA16UI), i === e.UNSIGNED_INT && (u = e.RGBA32UI), i === e.BYTE && (u = e.RGBA8I), i === e.SHORT && (u = e.RGBA16I), i === e.INT && (u = e.RGBA32I)), r === e.RGB && (i === e.UNSIGNED_SHORT && l && (u = l.RGB16_EXT), i === e.SHORT && l && (u = l.RGB16_SNORM_EXT), i === e.UNSIGNED_INT_5_9_9_9_REV && (u = e.RGB9_E5), i === e.UNSIGNED_INT_10F_11F_11F_REV && (u = e.R11F_G11F_B10F)), r === e.RGBA) {
			let t = c ? z : o.getTransfer(s);
			i === e.FLOAT && (u = e.RGBA32F), i === e.HALF_FLOAT && (u = e.RGBA16F), i === e.UNSIGNED_BYTE && (u = t === "srgb" ? e.SRGB8_ALPHA8 : e.RGBA8), i === e.UNSIGNED_SHORT && l && (u = l.RGBA16_EXT), i === e.SHORT && l && (u = l.RGBA16_SNORM_EXT), i === e.UNSIGNED_SHORT_4_4_4_4 && (u = e.RGBA4), i === e.UNSIGNED_SHORT_5_5_5_1 && (u = e.RGB5_A1);
		}
		return (u === e.R16F || u === e.R32F || u === e.RG16F || u === e.RG32F || u === e.RGBA16F || u === e.RGBA32F) && t.get("EXT_color_buffer_float"), u;
	}
	function T(t, n) {
		let r;
		return t ? n === null || n === 1014 || n === 1020 ? r = e.DEPTH24_STENCIL8 : n === 1015 ? r = e.DEPTH32F_STENCIL8 : n === 1012 && (r = e.DEPTH24_STENCIL8, F("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : n === null || n === 1014 || n === 1020 ? r = e.DEPTH_COMPONENT24 : n === 1015 ? r = e.DEPTH_COMPONENT32F : n === 1012 && (r = e.DEPTH_COMPONENT16), r;
	}
	function E(e, t) {
		return b(e) === !0 || e.isFramebufferTexture && e.minFilter !== 1003 && e.minFilter !== 1006 ? Math.log2(Math.max(t.width, t.height)) + 1 : e.mipmaps !== void 0 && e.mipmaps.length > 0 ? e.mipmaps.length : e.isCompressedTexture && Array.isArray(e.image) ? t.mipmaps.length : 1;
	}
	function O(e) {
		let t = e.target;
		t.removeEventListener("dispose", O), A(t), t.isVideoTexture && d.delete(t), t.isHTMLTexture && f.delete(t);
	}
	function k(e) {
		let t = e.target;
		t.removeEventListener("dispose", k), j(t);
	}
	function A(e) {
		let t = r.get(e);
		if (t.__webglInit === void 0) return;
		let n = e.source, i = m.get(n);
		if (i) {
			let r = i[t.__cacheKey];
			r.usedTimes--, r.usedTimes === 0 && ee(e), Object.keys(i).length === 0 && m.delete(n);
		}
		r.remove(e);
	}
	function ee(t) {
		let n = r.get(t);
		e.deleteTexture(n.__webglTexture);
		let i = t.source, a = m.get(i);
		delete a[n.__cacheKey], s.memory.textures--;
	}
	function j(t) {
		let n = r.get(t);
		if (t.depthTexture && (t.depthTexture.dispose(), r.remove(t.depthTexture)), t.isWebGLCubeRenderTarget) for (let t = 0; t < 6; t++) {
			if (Array.isArray(n.__webglFramebuffer[t])) for (let r = 0; r < n.__webglFramebuffer[t].length; r++) e.deleteFramebuffer(n.__webglFramebuffer[t][r]);
			else e.deleteFramebuffer(n.__webglFramebuffer[t]);
			n.__webglDepthbuffer && e.deleteRenderbuffer(n.__webglDepthbuffer[t]);
		}
		else {
			if (Array.isArray(n.__webglFramebuffer)) for (let t = 0; t < n.__webglFramebuffer.length; t++) e.deleteFramebuffer(n.__webglFramebuffer[t]);
			else e.deleteFramebuffer(n.__webglFramebuffer);
			if (n.__webglDepthbuffer && e.deleteRenderbuffer(n.__webglDepthbuffer), n.__webglMultisampledFramebuffer && e.deleteFramebuffer(n.__webglMultisampledFramebuffer), n.__webglColorRenderbuffer) for (let t = 0; t < n.__webglColorRenderbuffer.length; t++) n.__webglColorRenderbuffer[t] && e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);
			n.__webglDepthRenderbuffer && e.deleteRenderbuffer(n.__webglDepthRenderbuffer);
		}
		let i = t.textures;
		for (let t = 0, n = i.length; t < n; t++) {
			let n = r.get(i[t]);
			n.__webglTexture && (e.deleteTexture(n.__webglTexture), s.memory.textures--), r.remove(i[t]);
		}
		r.remove(t);
	}
	let N = 0;
	function te() {
		N = 0;
	}
	function P() {
		return N;
	}
	function ne(e) {
		N = e;
	}
	function re() {
		let e = N;
		return e >= i.maxTextures && F("WebGLTextures: Trying to use " + (e + 1) + " texture units while this GPU supports only " + i.maxTextures), N += 1, e;
	}
	function I(e) {
		let t = [];
		return t.push(e.wrapS), t.push(e.wrapT), t.push(e.wrapR || 0), t.push(e.magFilter), t.push(e.minFilter), t.push(e.anisotropy), t.push(e.internalFormat), t.push(e.format), t.push(e.type), t.push(e.generateMipmaps), t.push(e.premultiplyAlpha), t.push(e.flipY), t.push(e.unpackAlignment), t.push(e.colorSpace), t.join();
	}
	function L(t, i) {
		let a = r.get(t);
		if (t.isVideoTexture && Ee(t), t.isRenderTargetTexture === !1 && t.isExternalTexture !== !0 && t.version > 0 && a.__version !== t.version) {
			let e = t.image;
			if (e === null) F("WebGLRenderer: Texture marked for update but no image data found.");
			else if (e.complete === !1) F("WebGLRenderer: Texture marked for update but image is incomplete");
			else {
				pe(a, t, i);
				return;
			}
		} else t.isExternalTexture && (a.__webglTexture = t.sourceTexture ? t.sourceTexture : null);
		n.bindTexture(e.TEXTURE_2D, a.__webglTexture, e.TEXTURE0 + i);
	}
	function ie(t, i) {
		let a = r.get(t);
		t.isRenderTargetTexture === !1 && t.version > 0 && a.__version !== t.version ? pe(a, t, i) : (t.isExternalTexture && (a.__webglTexture = t.sourceTexture ? t.sourceTexture : null), n.bindTexture(e.TEXTURE_2D_ARRAY, a.__webglTexture, e.TEXTURE0 + i));
	}
	function R(t, i) {
		let a = r.get(t);
		t.isRenderTargetTexture === !1 && t.version > 0 && a.__version !== t.version ? pe(a, t, i) : n.bindTexture(e.TEXTURE_3D, a.__webglTexture, e.TEXTURE0 + i);
	}
	function oe(t, i) {
		let a = r.get(t);
		t.isCubeDepthTexture !== !0 && t.version > 0 && a.__version !== t.version ? me(a, t, i) : n.bindTexture(e.TEXTURE_CUBE_MAP, a.__webglTexture, e.TEXTURE0 + i);
	}
	let B = {
		[Le]: e.REPEAT,
		[qe]: e.CLAMP_TO_EDGE,
		[Ce]: e.MIRRORED_REPEAT
	}, se = {
		[le]: e.NEAREST,
		[Re]: e.NEAREST_MIPMAP_NEAREST,
		[Fe]: e.NEAREST_MIPMAP_LINEAR,
		[q]: e.LINEAR,
		[ae]: e.LINEAR_MIPMAP_NEAREST,
		[v]: e.LINEAR_MIPMAP_LINEAR
	}, ce = {
		512: e.NEVER,
		519: e.ALWAYS,
		513: e.LESS,
		515: e.LEQUAL,
		514: e.EQUAL,
		518: e.GEQUAL,
		516: e.GREATER,
		517: e.NOTEQUAL
	};
	function ue(n, a) {
		if (a.type === 1015 && t.has("OES_texture_float_linear") === !1 && (a.magFilter === 1006 || a.magFilter === 1007 || a.magFilter === 1005 || a.magFilter === 1008 || a.minFilter === 1006 || a.minFilter === 1007 || a.minFilter === 1005 || a.minFilter === 1008) && F("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), e.texParameteri(n, e.TEXTURE_WRAP_S, B[a.wrapS]), e.texParameteri(n, e.TEXTURE_WRAP_T, B[a.wrapT]), (n === e.TEXTURE_3D || n === e.TEXTURE_2D_ARRAY) && e.texParameteri(n, e.TEXTURE_WRAP_R, B[a.wrapR]), e.texParameteri(n, e.TEXTURE_MAG_FILTER, se[a.magFilter]), e.texParameteri(n, e.TEXTURE_MIN_FILTER, se[a.minFilter]), a.compareFunction && (e.texParameteri(n, e.TEXTURE_COMPARE_MODE, e.COMPARE_REF_TO_TEXTURE), e.texParameteri(n, e.TEXTURE_COMPARE_FUNC, ce[a.compareFunction])), t.has("EXT_texture_filter_anisotropic") === !0) {
			if (a.magFilter === 1003 || a.minFilter !== 1005 && a.minFilter !== 1008 || a.type === 1015 && t.has("OES_texture_float_linear") === !1) return;
			if (a.anisotropy > 1 || r.get(a).__currentAnisotropy) {
				let o = t.get("EXT_texture_filter_anisotropic");
				e.texParameterf(n, o.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(a.anisotropy, i.getMaxAnisotropy())), r.get(a).__currentAnisotropy = a.anisotropy;
			}
		}
	}
	function V(t, n) {
		let r = !1;
		t.__webglInit === void 0 && (t.__webglInit = !0, n.addEventListener("dispose", O));
		let i = n.source, a = m.get(i);
		a === void 0 && (a = {}, m.set(i, a));
		let o = I(n);
		if (o !== t.__cacheKey) {
			a[o] === void 0 && (a[o] = {
				texture: e.createTexture(),
				usedTimes: 0
			}, s.memory.textures++, r = !0), a[o].usedTimes++;
			let i = a[t.__cacheKey];
			i !== void 0 && (a[t.__cacheKey].usedTimes--, i.usedTimes === 0 && ee(n)), t.__cacheKey = o, t.__webglTexture = a[o].texture;
		}
		return r;
	}
	function de(e, t, n) {
		return Math.floor(Math.floor(e / n) / t);
	}
	function fe(t, r, i, a) {
		let o = t.updateRanges;
		if (o.length === 0) n.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, r.width, r.height, i, a, r.data);
		else {
			o.sort((e, t) => e.start - t.start);
			let s = 0;
			for (let e = 1; e < o.length; e++) {
				let t = o[s], n = o[e], i = t.start + t.count, a = de(n.start, r.width, 4), c = de(t.start, r.width, 4);
				n.start <= i + 1 && a === c && de(n.start + n.count - 1, r.width, 4) === a ? t.count = Math.max(t.count, n.start + n.count - t.start) : (++s, o[s] = n);
			}
			o.length = s + 1;
			let c = n.getParameter(e.UNPACK_ROW_LENGTH), l = n.getParameter(e.UNPACK_SKIP_PIXELS), u = n.getParameter(e.UNPACK_SKIP_ROWS);
			n.pixelStorei(e.UNPACK_ROW_LENGTH, r.width);
			for (let t = 0, s = o.length; t < s; t++) {
				let s = o[t], c = Math.floor(s.start / 4), l = Math.ceil(s.count / 4), u = c % r.width, d = Math.floor(c / r.width), f = l;
				n.pixelStorei(e.UNPACK_SKIP_PIXELS, u), n.pixelStorei(e.UNPACK_SKIP_ROWS, d), n.texSubImage2D(e.TEXTURE_2D, 0, u, d, f, 1, i, a, r.data);
			}
			t.clearUpdateRanges(), n.pixelStorei(e.UNPACK_ROW_LENGTH, c), n.pixelStorei(e.UNPACK_SKIP_PIXELS, l), n.pixelStorei(e.UNPACK_SKIP_ROWS, u);
		}
	}
	function pe(t, s, c) {
		let l = e.TEXTURE_2D;
		(s.isDataArrayTexture || s.isCompressedArrayTexture) && (l = e.TEXTURE_2D_ARRAY), s.isData3DTexture && (l = e.TEXTURE_3D);
		let u = V(t, s), d = s.source;
		n.bindTexture(l, t.__webglTexture, e.TEXTURE0 + c);
		let p = r.get(d);
		if (d.version !== p.__version || u === !0) {
			if (n.activeTexture(e.TEXTURE0 + c), !(typeof ImageBitmap < "u" && s.image instanceof ImageBitmap)) {
				let t = o.getPrimaries(o.workingColorSpace), r = s.colorSpace === "" ? null : o.getPrimaries(s.colorSpace), i = s.colorSpace === "" || t === r ? e.NONE : e.BROWSER_DEFAULT_WEBGL;
				n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, s.flipY), n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, s.premultiplyAlpha), n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, i);
			}
			n.pixelStorei(e.UNPACK_ALIGNMENT, s.unpackAlignment);
			let t = y(s.image, !1, i.maxTextureSize);
			t = G(s, t);
			let r = a.convert(s.format, s.colorSpace), m = a.convert(s.type), h = w(s.internalFormat, r, m, s.normalized, s.colorSpace, s.isVideoTexture);
			ue(l, s);
			let g, _ = s.mipmaps, v = s.isVideoTexture !== !0, x = p.__version === void 0 || u === !0, C = d.dataReady, D = E(s, t);
			if (s.isDepthTexture) h = T(s.format === we, s.type), x && (v ? n.texStorage2D(e.TEXTURE_2D, 1, h, t.width, t.height) : n.texImage2D(e.TEXTURE_2D, 0, h, t.width, t.height, 0, r, m, null));
			else if (s.isDataTexture) {
				if (_.length > 0) {
					v && x && n.texStorage2D(e.TEXTURE_2D, D, h, _[0].width, _[0].height);
					for (let t = 0, i = _.length; t < i; t++) g = _[t], v ? C && n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, g.width, g.height, r, m, g.data) : n.texImage2D(e.TEXTURE_2D, t, h, g.width, g.height, 0, r, m, g.data);
					s.generateMipmaps = !1;
				} else v ? (x && n.texStorage2D(e.TEXTURE_2D, D, h, t.width, t.height), C && fe(s, t, r, m)) : n.texImage2D(e.TEXTURE_2D, 0, h, t.width, t.height, 0, r, m, t.data);
			} else if (s.isCompressedTexture) {
				if (s.isCompressedArrayTexture) {
					v && x && n.texStorage3D(e.TEXTURE_2D_ARRAY, D, h, _[0].width, _[0].height, t.depth);
					for (let i = 0, a = _.length; i < a; i++) if (g = _[i], s.format !== 1023) {
						if (r !== null) {
							if (v) {
								if (C) {
									if (s.layerUpdates.size > 0) {
										let t = M(g.width, g.height, s.format, s.type);
										for (let a of s.layerUpdates) {
											let o = g.data.subarray(a * t / g.data.BYTES_PER_ELEMENT, (a + 1) * t / g.data.BYTES_PER_ELEMENT);
											n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY, i, 0, 0, a, g.width, g.height, 1, r, o);
										}
									} else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY, i, 0, 0, 0, g.width, g.height, t.depth, r, g.data);
								}
							} else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY, i, h, g.width, g.height, t.depth, 0, g.data, 0, 0);
						} else F("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
					} else v ? C && n.texSubImage3D(e.TEXTURE_2D_ARRAY, i, 0, 0, 0, g.width, g.height, t.depth, r, m, g.data) : n.texImage3D(e.TEXTURE_2D_ARRAY, i, h, g.width, g.height, t.depth, 0, r, m, g.data);
					s.layerUpdates.size > 0 && s.clearLayerUpdates();
				} else {
					v && x && n.texStorage2D(e.TEXTURE_2D, D, h, _[0].width, _[0].height);
					for (let t = 0, i = _.length; t < i; t++) g = _[t], s.format === 1023 ? v ? C && n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, g.width, g.height, r, m, g.data) : n.texImage2D(e.TEXTURE_2D, t, h, g.width, g.height, 0, r, m, g.data) : r === null ? F("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : v ? C && n.compressedTexSubImage2D(e.TEXTURE_2D, t, 0, 0, g.width, g.height, r, g.data) : n.compressedTexImage2D(e.TEXTURE_2D, t, h, g.width, g.height, 0, g.data);
				}
			} else if (s.isDataArrayTexture) {
				if (v) {
					if (x && n.texStorage3D(e.TEXTURE_2D_ARRAY, D, h, t.width, t.height, t.depth), C) {
						if (s.layerUpdates.size > 0) {
							let i = M(t.width, t.height, s.format, s.type);
							for (let a of s.layerUpdates) {
								let o = t.data.subarray(a * i / t.data.BYTES_PER_ELEMENT, (a + 1) * i / t.data.BYTES_PER_ELEMENT);
								n.texSubImage3D(e.TEXTURE_2D_ARRAY, 0, 0, 0, a, t.width, t.height, 1, r, m, o);
							}
							s.clearLayerUpdates();
						} else n.texSubImage3D(e.TEXTURE_2D_ARRAY, 0, 0, 0, 0, t.width, t.height, t.depth, r, m, t.data);
					}
				} else n.texImage3D(e.TEXTURE_2D_ARRAY, 0, h, t.width, t.height, t.depth, 0, r, m, t.data);
			} else if (s.isData3DTexture) v ? (x && n.texStorage3D(e.TEXTURE_3D, D, h, t.width, t.height, t.depth), C && n.texSubImage3D(e.TEXTURE_3D, 0, 0, 0, 0, t.width, t.height, t.depth, r, m, t.data)) : n.texImage3D(e.TEXTURE_3D, 0, h, t.width, t.height, t.depth, 0, r, m, t.data);
			else if (s.isFramebufferTexture) {
				if (x) {
					if (v) n.texStorage2D(e.TEXTURE_2D, D, h, t.width, t.height);
					else {
						let i = t.width, a = t.height;
						for (let t = 0; t < D; t++) n.texImage2D(e.TEXTURE_2D, t, h, i, a, 0, r, m, null), i >>= 1, a >>= 1;
					}
				}
			} else if (s.isHTMLTexture) {
				if ("texElementImage2D" in e) {
					let n = e.canvas;
					if (n.hasAttribute("layoutsubtree") || n.setAttribute("layoutsubtree", "true"), t.parentNode !== n) {
						n.appendChild(t), f.add(s), n.onpaint = (e) => {
							let t = e.changedElements;
							for (let e of f) t.includes(e.image) && (e.needsUpdate = !0);
						}, n.requestPaint();
						return;
					}
					if (e.texElementImage2D.length === 3) e.texElementImage2D(e.TEXTURE_2D, e.RGBA8, t);
					else {
						let n = e.RGBA, r = e.RGBA, i = e.UNSIGNED_BYTE;
						e.texElementImage2D(e.TEXTURE_2D, 0, n, r, i, t);
					}
					e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE);
				}
			} else if (_.length > 0) {
				if (v && x) {
					let t = De(_[0]);
					n.texStorage2D(e.TEXTURE_2D, D, h, t.width, t.height);
				}
				for (let t = 0, i = _.length; t < i; t++) g = _[t], v ? C && n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, r, m, g) : n.texImage2D(e.TEXTURE_2D, t, h, r, m, g);
				s.generateMipmaps = !1;
			} else if (v) {
				if (x) {
					let r = De(t);
					n.texStorage2D(e.TEXTURE_2D, D, h, r.width, r.height);
				}
				C && n.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, r, m, t);
			} else n.texImage2D(e.TEXTURE_2D, 0, h, r, m, t);
			b(s) && S(l), p.__version = d.version, s.onUpdate && s.onUpdate(s);
		}
		t.__version = s.version;
	}
	function me(t, s, c) {
		if (s.image.length !== 6) return;
		let l = V(t, s), u = s.source;
		n.bindTexture(e.TEXTURE_CUBE_MAP, t.__webglTexture, e.TEXTURE0 + c);
		let d = r.get(u);
		if (u.version !== d.__version || l === !0) {
			n.activeTexture(e.TEXTURE0 + c);
			let t = o.getPrimaries(o.workingColorSpace), r = s.colorSpace === "" ? null : o.getPrimaries(s.colorSpace), f = s.colorSpace === "" || t === r ? e.NONE : e.BROWSER_DEFAULT_WEBGL;
			n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, s.flipY), n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, s.premultiplyAlpha), n.pixelStorei(e.UNPACK_ALIGNMENT, s.unpackAlignment), n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, f);
			let p = s.isCompressedTexture || s.image[0].isCompressedTexture, m = s.image[0] && s.image[0].isDataTexture, h = [];
			for (let e = 0; e < 6; e++) !p && !m ? h[e] = y(s.image[e], !0, i.maxCubemapSize) : h[e] = m ? s.image[e].image : s.image[e], h[e] = G(s, h[e]);
			let g = h[0], _ = a.convert(s.format, s.colorSpace), v = a.convert(s.type), x = w(s.internalFormat, _, v, s.normalized, s.colorSpace), C = s.isVideoTexture !== !0, T = d.__version === void 0 || l === !0, D = u.dataReady, O = E(s, g);
			ue(e.TEXTURE_CUBE_MAP, s);
			let k;
			if (p) {
				C && T && n.texStorage2D(e.TEXTURE_CUBE_MAP, O, x, g.width, g.height);
				for (let t = 0; t < 6; t++) {
					k = h[t].mipmaps;
					for (let r = 0; r < k.length; r++) {
						let i = k[r];
						s.format === 1023 ? C ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r, 0, 0, i.width, i.height, _, v, i.data) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r, x, i.width, i.height, 0, _, v, i.data) : _ === null ? F("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : C ? D && n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r, 0, 0, i.width, i.height, _, i.data) : n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r, x, i.width, i.height, 0, i.data);
					}
				}
			} else {
				if (k = s.mipmaps, C && T) {
					k.length > 0 && O++;
					let t = De(h[0]);
					n.texStorage2D(e.TEXTURE_CUBE_MAP, O, x, t.width, t.height);
				}
				for (let t = 0; t < 6; t++) if (m) {
					C ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, 0, 0, h[t].width, h[t].height, _, v, h[t].data) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, x, h[t].width, h[t].height, 0, _, v, h[t].data);
					for (let r = 0; r < k.length; r++) {
						let i = k[r].image[t].image;
						C ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, 0, 0, i.width, i.height, _, v, i.data) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, x, i.width, i.height, 0, _, v, i.data);
					}
				} else {
					C ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, 0, 0, _, v, h[t]) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, x, _, v, h[t]);
					for (let r = 0; r < k.length; r++) {
						let i = k[r];
						C ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, 0, 0, _, v, i.image[t]) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, x, _, v, i.image[t]);
					}
				}
			}
			b(s) && S(e.TEXTURE_CUBE_MAP), d.__version = u.version, s.onUpdate && s.onUpdate(s);
		}
		t.__version = s.version;
	}
	function he(t, i, o, s, l, u) {
		let d = a.convert(o.format, o.colorSpace), f = a.convert(o.type), p = w(o.internalFormat, d, f, o.normalized, o.colorSpace), m = r.get(i), h = r.get(o);
		if (h.__renderTarget = i, !m.__hasExternalTextures) {
			let t = Math.max(1, i.width >> u), r = Math.max(1, i.height >> u);
			l === e.TEXTURE_3D || l === e.TEXTURE_2D_ARRAY ? n.texImage3D(l, u, p, t, r, i.depth, 0, d, f, null) : n.texImage2D(l, u, p, t, r, 0, d, f, null);
		}
		n.bindFramebuffer(e.FRAMEBUFFER, t), Te(i) ? c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, s, l, h.__webglTexture, 0, Se(i)) : (l === e.TEXTURE_2D || l >= e.TEXTURE_CUBE_MAP_POSITIVE_X && l <= e.TEXTURE_CUBE_MAP_NEGATIVE_Z) && e.framebufferTexture2D(e.FRAMEBUFFER, s, l, h.__webglTexture, u), n.bindFramebuffer(e.FRAMEBUFFER, null);
	}
	function H(t, n, r) {
		if (e.bindRenderbuffer(e.RENDERBUFFER, t), n.depthBuffer) {
			let i = n.depthTexture, a = i && i.isDepthTexture ? i.type : null, o = T(n.stencilBuffer, a), s = n.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
			Te(n) ? c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER, Se(n), o, n.width, n.height) : r ? e.renderbufferStorageMultisample(e.RENDERBUFFER, Se(n), o, n.width, n.height) : e.renderbufferStorage(e.RENDERBUFFER, o, n.width, n.height), e.framebufferRenderbuffer(e.FRAMEBUFFER, s, e.RENDERBUFFER, t);
		} else {
			let t = n.textures;
			for (let i = 0; i < t.length; i++) {
				let o = t[i], s = a.convert(o.format, o.colorSpace), l = a.convert(o.type), u = w(o.internalFormat, s, l, o.normalized, o.colorSpace);
				Te(n) ? c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER, Se(n), u, n.width, n.height) : r ? e.renderbufferStorageMultisample(e.RENDERBUFFER, Se(n), u, n.width, n.height) : e.renderbufferStorage(e.RENDERBUFFER, u, n.width, n.height);
			}
		}
		e.bindRenderbuffer(e.RENDERBUFFER, null);
	}
	function U(t, i, o) {
		let s = i.isWebGLCubeRenderTarget === !0;
		if (n.bindFramebuffer(e.FRAMEBUFFER, t), !(i.depthTexture && i.depthTexture.isDepthTexture)) throw Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");
		let l = r.get(i.depthTexture);
		if (l.__renderTarget = i, l.__webglTexture && i.depthTexture.image.width === i.width && i.depthTexture.image.height === i.height || (i.depthTexture.image.width = i.width, i.depthTexture.image.height = i.height, i.depthTexture.needsUpdate = !0), s) {
			if (l.__webglInit === void 0 && (l.__webglInit = !0, i.depthTexture.addEventListener("dispose", O)), l.__webglTexture === void 0) {
				l.__webglTexture = e.createTexture(), n.bindTexture(e.TEXTURE_CUBE_MAP, l.__webglTexture), ue(e.TEXTURE_CUBE_MAP, i.depthTexture);
				let t = a.convert(i.depthTexture.format), r = a.convert(i.depthTexture.type), o;
				i.depthTexture.format === 1026 ? o = e.DEPTH_COMPONENT24 : i.depthTexture.format === 1027 && (o = e.DEPTH24_STENCIL8);
				for (let n = 0; n < 6; n++) e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + n, 0, o, i.width, i.height, 0, t, r, null);
			}
		} else L(i.depthTexture, 0);
		let u = l.__webglTexture, d = Se(i), f = s ? e.TEXTURE_CUBE_MAP_POSITIVE_X + o : e.TEXTURE_2D, p = i.depthTexture.format === 1027 ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
		if (i.depthTexture.format === 1026) Te(i) ? c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, p, f, u, 0, d) : e.framebufferTexture2D(e.FRAMEBUFFER, p, f, u, 0);
		else if (i.depthTexture.format === 1027) Te(i) ? c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, p, f, u, 0, d) : e.framebufferTexture2D(e.FRAMEBUFFER, p, f, u, 0);
		else throw Error("THREE.WebGLTextures: Unknown depthTexture format.");
	}
	function ge(t) {
		let i = r.get(t), a = t.isWebGLCubeRenderTarget === !0;
		if (i.__boundDepthTexture !== t.depthTexture) {
			let e = t.depthTexture;
			if (i.__depthDisposeCallback && i.__depthDisposeCallback(), e) {
				let t = () => {
					delete i.__boundDepthTexture, delete i.__depthDisposeCallback, e.removeEventListener("dispose", t);
				};
				e.addEventListener("dispose", t), i.__depthDisposeCallback = t;
			}
			i.__boundDepthTexture = e;
		}
		if (t.depthTexture && !i.__autoAllocateDepthBuffer) {
			if (a) for (let e = 0; e < 6; e++) U(i.__webglFramebuffer[e], t, e);
			else {
				let e = t.texture.mipmaps;
				e && e.length > 0 ? U(i.__webglFramebuffer[0], t, 0) : U(i.__webglFramebuffer, t, 0);
			}
		} else if (a) {
			i.__webglDepthbuffer = [];
			for (let r = 0; r < 6; r++) if (n.bindFramebuffer(e.FRAMEBUFFER, i.__webglFramebuffer[r]), i.__webglDepthbuffer[r] === void 0) i.__webglDepthbuffer[r] = e.createRenderbuffer(), H(i.__webglDepthbuffer[r], t, !1);
			else {
				let n = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, a = i.__webglDepthbuffer[r];
				e.bindRenderbuffer(e.RENDERBUFFER, a), e.framebufferRenderbuffer(e.FRAMEBUFFER, n, e.RENDERBUFFER, a);
			}
		} else {
			let r = t.texture.mipmaps;
			if (r && r.length > 0 ? n.bindFramebuffer(e.FRAMEBUFFER, i.__webglFramebuffer[0]) : n.bindFramebuffer(e.FRAMEBUFFER, i.__webglFramebuffer), i.__webglDepthbuffer === void 0) i.__webglDepthbuffer = e.createRenderbuffer(), H(i.__webglDepthbuffer, t, !1);
			else {
				let n = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, r = i.__webglDepthbuffer;
				e.bindRenderbuffer(e.RENDERBUFFER, r), e.framebufferRenderbuffer(e.FRAMEBUFFER, n, e.RENDERBUFFER, r);
			}
		}
		n.bindFramebuffer(e.FRAMEBUFFER, null);
	}
	function W(t, n, i) {
		let a = r.get(t);
		n !== void 0 && he(a.__webglFramebuffer, t, t.texture, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, 0), i !== void 0 && ge(t);
	}
	function _e(t) {
		let i = t.texture, o = r.get(t), c = r.get(i);
		t.addEventListener("dispose", k);
		let l = t.textures, u = t.isWebGLCubeRenderTarget === !0, d = l.length > 1;
		if (d || (c.__webglTexture === void 0 && (c.__webglTexture = e.createTexture()), c.__version = i.version, s.memory.textures++), u) {
			o.__webglFramebuffer = [];
			for (let t = 0; t < 6; t++) if (i.mipmaps && i.mipmaps.length > 0) {
				o.__webglFramebuffer[t] = [];
				for (let n = 0; n < i.mipmaps.length; n++) o.__webglFramebuffer[t][n] = e.createFramebuffer();
			} else o.__webglFramebuffer[t] = e.createFramebuffer();
		} else {
			if (i.mipmaps && i.mipmaps.length > 0) {
				o.__webglFramebuffer = [];
				for (let t = 0; t < i.mipmaps.length; t++) o.__webglFramebuffer[t] = e.createFramebuffer();
			} else o.__webglFramebuffer = e.createFramebuffer();
			if (d) for (let t = 0, n = l.length; t < n; t++) {
				let n = r.get(l[t]);
				n.__webglTexture === void 0 && (n.__webglTexture = e.createTexture(), s.memory.textures++);
			}
			if (t.samples > 0 && Te(t) === !1) {
				o.__webglMultisampledFramebuffer = e.createFramebuffer(), o.__webglColorRenderbuffer = [], n.bindFramebuffer(e.FRAMEBUFFER, o.__webglMultisampledFramebuffer);
				for (let n = 0; n < l.length; n++) {
					let r = l[n];
					o.__webglColorRenderbuffer[n] = e.createRenderbuffer(), e.bindRenderbuffer(e.RENDERBUFFER, o.__webglColorRenderbuffer[n]);
					let i = a.convert(r.format, r.colorSpace), s = a.convert(r.type), c = w(r.internalFormat, i, s, r.normalized, r.colorSpace, t.isXRRenderTarget === !0), u = Se(t);
					e.renderbufferStorageMultisample(e.RENDERBUFFER, u, c, t.width, t.height), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + n, e.RENDERBUFFER, o.__webglColorRenderbuffer[n]);
				}
				e.bindRenderbuffer(e.RENDERBUFFER, null), t.depthBuffer && (o.__webglDepthRenderbuffer = e.createRenderbuffer(), H(o.__webglDepthRenderbuffer, t, !0)), n.bindFramebuffer(e.FRAMEBUFFER, null);
			}
		}
		if (u) {
			n.bindTexture(e.TEXTURE_CUBE_MAP, c.__webglTexture), ue(e.TEXTURE_CUBE_MAP, i);
			for (let n = 0; n < 6; n++) if (i.mipmaps && i.mipmaps.length > 0) for (let r = 0; r < i.mipmaps.length; r++) he(o.__webglFramebuffer[n][r], t, i, e.COLOR_ATTACHMENT0, e.TEXTURE_CUBE_MAP_POSITIVE_X + n, r);
			else he(o.__webglFramebuffer[n], t, i, e.COLOR_ATTACHMENT0, e.TEXTURE_CUBE_MAP_POSITIVE_X + n, 0);
			b(i) && S(e.TEXTURE_CUBE_MAP), n.unbindTexture();
		} else if (d) {
			for (let i = 0, a = l.length; i < a; i++) {
				let a = l[i], s = r.get(a), c = e.TEXTURE_2D;
				(t.isWebGL3DRenderTarget || t.isWebGLArrayRenderTarget) && (c = t.isWebGL3DRenderTarget ? e.TEXTURE_3D : e.TEXTURE_2D_ARRAY), n.bindTexture(c, s.__webglTexture), ue(c, a), he(o.__webglFramebuffer, t, a, e.COLOR_ATTACHMENT0 + i, c, 0), b(a) && S(c);
			}
			n.unbindTexture();
		} else {
			let r = e.TEXTURE_2D;
			if ((t.isWebGL3DRenderTarget || t.isWebGLArrayRenderTarget) && (r = t.isWebGL3DRenderTarget ? e.TEXTURE_3D : e.TEXTURE_2D_ARRAY), n.bindTexture(r, c.__webglTexture), ue(r, i), i.mipmaps && i.mipmaps.length > 0) for (let n = 0; n < i.mipmaps.length; n++) he(o.__webglFramebuffer[n], t, i, e.COLOR_ATTACHMENT0, r, n);
			else he(o.__webglFramebuffer, t, i, e.COLOR_ATTACHMENT0, r, 0);
			b(i) && S(r), n.unbindTexture();
		}
		t.depthBuffer && ge(t);
	}
	function ve(e) {
		let t = e.textures;
		for (let i = 0, a = t.length; i < a; i++) {
			let a = t[i];
			if (b(a)) {
				let t = C(e), i = r.get(a).__webglTexture;
				n.bindTexture(t, i), S(t), n.unbindTexture();
			}
		}
	}
	let ye = [], be = [];
	function xe(t) {
		if (t.samples > 0) {
			if (Te(t) === !1) {
				let i = t.textures, a = t.width, o = t.height, s = e.COLOR_BUFFER_BIT, c = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, u = r.get(t), d = i.length > 1;
				if (d) for (let t = 0; t < i.length; t++) n.bindFramebuffer(e.FRAMEBUFFER, u.__webglMultisampledFramebuffer), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.RENDERBUFFER, null), n.bindFramebuffer(e.FRAMEBUFFER, u.__webglFramebuffer), e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.TEXTURE_2D, null, 0);
				n.bindFramebuffer(e.READ_FRAMEBUFFER, u.__webglMultisampledFramebuffer);
				let f = t.texture.mipmaps;
				f && f.length > 0 ? n.bindFramebuffer(e.DRAW_FRAMEBUFFER, u.__webglFramebuffer[0]) : n.bindFramebuffer(e.DRAW_FRAMEBUFFER, u.__webglFramebuffer);
				for (let n = 0; n < i.length; n++) {
					if (t.resolveDepthBuffer && (t.depthBuffer && (s |= e.DEPTH_BUFFER_BIT), t.stencilBuffer && t.resolveStencilBuffer && (s |= e.STENCIL_BUFFER_BIT)), d) {
						e.framebufferRenderbuffer(e.READ_FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.RENDERBUFFER, u.__webglColorRenderbuffer[n]);
						let t = r.get(i[n]).__webglTexture;
						e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, t, 0);
					}
					e.blitFramebuffer(0, 0, a, o, 0, 0, a, o, s, e.NEAREST), l === !0 && (ye.length = 0, be.length = 0, ye.push(e.COLOR_ATTACHMENT0 + n), t.depthBuffer && t.storeMultisampledDepthBuffer === !1 && (ye.push(c), be.push(c), e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER, be)), e.invalidateFramebuffer(e.READ_FRAMEBUFFER, ye));
				}
				if (n.bindFramebuffer(e.READ_FRAMEBUFFER, null), n.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), d) for (let t = 0; t < i.length; t++) {
					n.bindFramebuffer(e.FRAMEBUFFER, u.__webglMultisampledFramebuffer), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.RENDERBUFFER, u.__webglColorRenderbuffer[t]);
					let a = r.get(i[t]).__webglTexture;
					n.bindFramebuffer(e.FRAMEBUFFER, u.__webglFramebuffer), e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.TEXTURE_2D, a, 0);
				}
				n.bindFramebuffer(e.DRAW_FRAMEBUFFER, u.__webglMultisampledFramebuffer);
			} else if (t.depthBuffer && t.storeMultisampledDepthBuffer === !1 && l) {
				let n = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
				e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER, [n]);
			}
		}
	}
	function Se(e) {
		return Math.min(i.maxSamples, e.samples);
	}
	function Te(e) {
		let n = r.get(e);
		return e.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === !0 && n.__useRenderToTexture !== !1;
	}
	function Ee(e) {
		let t = s.render.frame;
		d.get(e) !== t && (d.set(e, t), e.update());
	}
	function G(e, t) {
		let n = e.colorSpace, r = e.format, i = e.type;
		return e.isCompressedTexture === !0 || e.isVideoTexture === !0 || n !== "srgb-linear" && n !== "" && (o.getTransfer(n) === "srgb" ? (r !== 1023 || i !== 1009) && F("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : x("WebGLTextures: Unsupported texture color space:", n)), t;
	}
	function De(e) {
		return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement ? (u.width = e.naturalWidth || e.width, u.height = e.naturalHeight || e.height) : typeof VideoFrame < "u" && e instanceof VideoFrame ? (u.width = e.displayWidth, u.height = e.displayHeight) : (u.width = e.width, u.height = e.height), u;
	}
	this.allocateTextureUnit = re, this.resetTextureUnits = te, this.getTextureUnits = P, this.setTextureUnits = ne, this.setTexture2D = L, this.setTexture2DArray = ie, this.setTexture3D = R, this.setTextureCube = oe, this.rebindTextures = W, this.setupRenderTarget = _e, this.updateRenderTargetMipmap = ve, this.updateMultisampleRenderTarget = xe, this.setupDepthRenderbuffer = ge, this.setupFrameBufferTexture = he, this.useMultisampledRTT = Te, this.isReversedDepthBuffer = function() {
		return n.buffers.depth.getReversed();
	};
}
function ni(e, t) {
	function n(n, r = "") {
		let i, a = o.getTransfer(r);
		if (n === 1009) return e.UNSIGNED_BYTE;
		if (n === 1017) return e.UNSIGNED_SHORT_4_4_4_4;
		if (n === 1018) return e.UNSIGNED_SHORT_5_5_5_1;
		if (n === 35902) return e.UNSIGNED_INT_5_9_9_9_REV;
		if (n === 35899) return e.UNSIGNED_INT_10F_11F_11F_REV;
		if (n === 1010) return e.BYTE;
		if (n === 1011) return e.SHORT;
		if (n === 1012) return e.UNSIGNED_SHORT;
		if (n === 1013) return e.INT;
		if (n === 1014) return e.UNSIGNED_INT;
		if (n === 1015) return e.FLOAT;
		if (n === 1016) return e.HALF_FLOAT;
		if (n === 1021) return e.ALPHA;
		if (n === 1022) return e.RGB;
		if (n === 1023) return e.RGBA;
		if (n === 1026) return e.DEPTH_COMPONENT;
		if (n === 1027) return e.DEPTH_STENCIL;
		if (n === 1028) return e.RED;
		if (n === 1029) return e.RED_INTEGER;
		if (n === 1030) return e.RG;
		if (n === 1031) return e.RG_INTEGER;
		if (n === 1033) return e.RGBA_INTEGER;
		if (n === 33776 || n === 33777 || n === 33778 || n === 33779) {
			if (a === "srgb") {
				if (i = t.get("WEBGL_compressed_texture_s3tc_srgb"), i !== null) {
					if (n === 33776) return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;
					if (n === 33777) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
					if (n === 33778) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
					if (n === 33779) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
				} else return null;
			} else if (i = t.get("WEBGL_compressed_texture_s3tc"), i !== null) {
				if (n === 33776) return i.COMPRESSED_RGB_S3TC_DXT1_EXT;
				if (n === 33777) return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;
				if (n === 33778) return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;
				if (n === 33779) return i.COMPRESSED_RGBA_S3TC_DXT5_EXT;
			} else return null;
		}
		if (n === 35840 || n === 35841 || n === 35842 || n === 35843) {
			if (i = t.get("WEBGL_compressed_texture_pvrtc"), i !== null) {
				if (n === 35840) return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
				if (n === 35841) return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
				if (n === 35842) return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
				if (n === 35843) return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
			} else return null;
		}
		if (n === 36196 || n === 37492 || n === 37496 || n === 37488 || n === 37489 || n === 37490 || n === 37491) {
			if (i = t.get("WEBGL_compressed_texture_etc"), i !== null) {
				if (n === 36196 || n === 37492) return a === "srgb" ? i.COMPRESSED_SRGB8_ETC2 : i.COMPRESSED_RGB8_ETC2;
				if (n === 37496) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : i.COMPRESSED_RGBA8_ETC2_EAC;
				if (n === 37488) return i.COMPRESSED_R11_EAC;
				if (n === 37489) return i.COMPRESSED_SIGNED_R11_EAC;
				if (n === 37490) return i.COMPRESSED_RG11_EAC;
				if (n === 37491) return i.COMPRESSED_SIGNED_RG11_EAC;
			} else return null;
		}
		if (n === 37808 || n === 37809 || n === 37810 || n === 37811 || n === 37812 || n === 37813 || n === 37814 || n === 37815 || n === 37816 || n === 37817 || n === 37818 || n === 37819 || n === 37820 || n === 37821) {
			if (i = t.get("WEBGL_compressed_texture_astc"), i !== null) {
				if (n === 37808) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : i.COMPRESSED_RGBA_ASTC_4x4_KHR;
				if (n === 37809) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : i.COMPRESSED_RGBA_ASTC_5x4_KHR;
				if (n === 37810) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : i.COMPRESSED_RGBA_ASTC_5x5_KHR;
				if (n === 37811) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : i.COMPRESSED_RGBA_ASTC_6x5_KHR;
				if (n === 37812) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : i.COMPRESSED_RGBA_ASTC_6x6_KHR;
				if (n === 37813) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : i.COMPRESSED_RGBA_ASTC_8x5_KHR;
				if (n === 37814) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : i.COMPRESSED_RGBA_ASTC_8x6_KHR;
				if (n === 37815) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : i.COMPRESSED_RGBA_ASTC_8x8_KHR;
				if (n === 37816) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : i.COMPRESSED_RGBA_ASTC_10x5_KHR;
				if (n === 37817) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : i.COMPRESSED_RGBA_ASTC_10x6_KHR;
				if (n === 37818) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : i.COMPRESSED_RGBA_ASTC_10x8_KHR;
				if (n === 37819) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : i.COMPRESSED_RGBA_ASTC_10x10_KHR;
				if (n === 37820) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : i.COMPRESSED_RGBA_ASTC_12x10_KHR;
				if (n === 37821) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : i.COMPRESSED_RGBA_ASTC_12x12_KHR;
			} else return null;
		}
		if (n === 36492 || n === 36494 || n === 36495) {
			if (i = t.get("EXT_texture_compression_bptc"), i !== null) {
				if (n === 36492) return a === "srgb" ? i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : i.COMPRESSED_RGBA_BPTC_UNORM_EXT;
				if (n === 36494) return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
				if (n === 36495) return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
			} else return null;
		}
		if (n === 36283 || n === 36284 || n === 36285 || n === 36286) {
			if (i = t.get("EXT_texture_compression_rgtc"), i !== null) {
				if (n === 36283) return i.COMPRESSED_RED_RGTC1_EXT;
				if (n === 36284) return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;
				if (n === 36285) return i.COMPRESSED_RED_GREEN_RGTC2_EXT;
				if (n === 36286) return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
			} else return null;
		}
		return n === 1020 ? e.UNSIGNED_INT_24_8 : e[n] === void 0 ? null : e[n];
	}
	return { convert: n };
}
var ri = "\nvoid main() {\n\n	gl_Position = vec4( position, 1.0 );\n\n}", ii = "\nuniform sampler2DArray depthColor;\nuniform float depthWidth;\nuniform float depthHeight;\n\nvoid main() {\n\n	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );\n\n	if ( coord.x >= 1.0 ) {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;\n\n	} else {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;\n\n	}\n\n}", ai = class {
	constructor() {
		this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
	}
	init(e, t) {
		if (this.texture === null) {
			let n = new d(e.texture);
			(e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = n;
		}
	}
	getMesh(e) {
		if (this.texture !== null && this.mesh === null) {
			let t = e.cameras[0].viewport, n = new U({
				vertexShader: ri,
				fragmentShader: ii,
				uniforms: {
					depthColor: { value: this.texture },
					depthWidth: { value: t.z },
					depthHeight: { value: t.w }
				}
			});
			this.mesh = new H(new me(20, 20), n);
		}
		return this.mesh;
	}
	reset() {
		this.texture = null, this.mesh = null;
	}
	getDepthTexture() {
		return this.texture;
	}
}, oi = class extends O {
	constructor(e, t) {
		super();
		let i = this, a = null, o = 1, s = null, c = "local-floor", l = 1, u = null, f = null, p = null, m = null, h = null, g = null, _ = typeof XRWebGLBinding < "u", v = new ai(), y = {}, b = t.getContextAttributes(), x = null, w = null, E = [], O = [], k = new D(), A = null, ee = null, j = new ke();
		j.viewport = new r();
		let M = new ke();
		M.viewport = new r();
		let N = [j, M], P = new Ae(), ne = null, re = null;
		this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(e) {
			let t = E[e];
			return t === void 0 && (t = new T(), E[e] = t), t.getTargetRaySpace();
		}, this.getControllerGrip = function(e) {
			let t = E[e];
			return t === void 0 && (t = new T(), E[e] = t), t.getGripSpace();
		}, this.getHand = function(e) {
			let t = E[e];
			return t === void 0 && (t = new T(), E[e] = t), t.getHandSpace();
		};
		function I(e) {
			let t = O.indexOf(e.inputSource);
			if (t === -1) return;
			let n = E[t];
			n !== void 0 && (n.update(e.inputSource, e.frame, u || s), n.dispatchEvent({
				type: e.type,
				data: e.inputSource
			}));
		}
		function L() {
			a.removeEventListener("select", I), a.removeEventListener("selectstart", I), a.removeEventListener("selectend", I), a.removeEventListener("squeeze", I), a.removeEventListener("squeezestart", I), a.removeEventListener("squeezeend", I), a.removeEventListener("end", L), a.removeEventListener("inputsourceschange", ie);
			for (let e = 0; e < E.length; e++) {
				let t = O[e];
				t !== null && (O[e] = null, E[e].disconnect(t));
			}
			ne = null, re = null, v.reset();
			for (let e in y) delete y[e];
			if (e.setRenderTarget(x), h = null, m = null, p = null, a = null, w = null, le.stop(), i.isPresenting = !1, e.setPixelRatio(A), e.setSize(k.width, k.height, !1), ee !== null) {
				let e = ee.camera;
				e.fov = ee.fov, e.zoom = ee.zoom, e.updateProjectionMatrix(), ee = null;
			}
			i.dispatchEvent({ type: "sessionend" });
		}
		this.setFramebufferScaleFactor = function(e) {
			o = e, i.isPresenting === !0 && F("WebXRManager: Cannot change framebuffer scale while presenting.");
		}, this.setReferenceSpaceType = function(e) {
			c = e, i.isPresenting === !0 && F("WebXRManager: Cannot change reference space type while presenting.");
		}, this.getReferenceSpace = function() {
			return u || s;
		}, this.setReferenceSpace = function(e) {
			u = e;
		}, this.getBaseLayer = function() {
			return m === null ? h : m;
		}, this.getBinding = function() {
			return p === null && _ && (p = new XRWebGLBinding(a, t)), p;
		}, this.getFrame = function() {
			return g;
		}, this.getSession = function() {
			return a;
		}, this.setSession = async function(r) {
			if (a = r, a !== null) {
				if (x = e.getRenderTarget(), a.addEventListener("select", I), a.addEventListener("selectstart", I), a.addEventListener("selectend", I), a.addEventListener("squeeze", I), a.addEventListener("squeezestart", I), a.addEventListener("squeezeend", I), a.addEventListener("end", L), a.addEventListener("inputsourceschange", ie), b.xrCompatible !== !0 && await t.makeXRCompatible(), A = e.getPixelRatio(), e.getSize(k), _ && "createProjectionLayer" in XRWebGLBinding.prototype) {
					let r = null, i = null, s = null;
					b.depth && (s = b.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, r = b.stencil ? we : n, i = b.stencil ? te : Ke);
					let c = {
						colorFormat: t.RGBA8,
						depthFormat: s,
						scaleFactor: o
					};
					p = this.getBinding(), m = p.createProjectionLayer(c), a.updateRenderState({ layers: [m] }), e.setPixelRatio(1), e.setSize(m.textureWidth, m.textureHeight, !1), w = new C(m.textureWidth, m.textureHeight, {
						format: V,
						type: ue,
						depthTexture: new S(m.textureWidth, m.textureHeight, i, void 0, void 0, void 0, void 0, void 0, void 0, r),
						stencilBuffer: b.stencil,
						colorSpace: e.outputColorSpace,
						samples: b.antialias ? 4 : 0,
						resolveDepthBuffer: m.ignoreDepthValues === !1,
						resolveStencilBuffer: m.ignoreDepthValues === !1,
						storeMultisampledDepthBuffer: m.ignoreDepthValues === !1,
						storeMultisampledStencilBuffer: m.ignoreDepthValues === !1
					});
				} else {
					let n = {
						antialias: b.antialias,
						alpha: !0,
						depth: b.depth,
						stencil: b.stencil,
						framebufferScaleFactor: o
					};
					h = new XRWebGLLayer(a, t, n), a.updateRenderState({ baseLayer: h }), e.setPixelRatio(1), e.setSize(h.framebufferWidth, h.framebufferHeight, !1), w = new C(h.framebufferWidth, h.framebufferHeight, {
						format: V,
						type: ue,
						colorSpace: e.outputColorSpace,
						stencilBuffer: b.stencil,
						resolveDepthBuffer: h.ignoreDepthValues === !1,
						resolveStencilBuffer: h.ignoreDepthValues === !1,
						storeMultisampledDepthBuffer: h.ignoreDepthValues === !1,
						storeMultisampledStencilBuffer: h.ignoreDepthValues === !1
					});
				}
				w.isXRRenderTarget = !0, this.setFoveation(l), u = null, s = await a.requestReferenceSpace(c), le.setContext(a), le.start(), i.isPresenting = !0, i.dispatchEvent({ type: "sessionstart" });
			}
		}, this.getEnvironmentBlendMode = function() {
			if (a !== null) return a.environmentBlendMode;
		}, this.getDepthTexture = function() {
			return v.getDepthTexture();
		};
		function ie(e) {
			for (let t = 0; t < e.removed.length; t++) {
				let n = e.removed[t], r = O.indexOf(n);
				r >= 0 && (O[r] = null, E[r].disconnect(n));
			}
			for (let t = 0; t < e.added.length; t++) {
				let n = e.added[t], r = O.indexOf(n);
				if (r === -1) {
					for (let e = 0; e < E.length; e++) if (e >= O.length) {
						O.push(n), r = e;
						break;
					} else if (O[e] === null) {
						O[e] = n, r = e;
						break;
					}
					if (r === -1) break;
				}
				let i = E[r];
				i && i.connect(n);
			}
		}
		let R = new G(), ae = new G();
		function z(e, t, n) {
			R.setFromMatrixPosition(t.matrixWorld), ae.setFromMatrixPosition(n.matrixWorld);
			let r = R.distanceTo(ae), i = t.projectionMatrix.elements, a = n.projectionMatrix.elements, o = i[14] / (i[10] - 1), s = i[14] / (i[10] + 1), c = (i[9] + 1) / i[5], l = (i[9] - 1) / i[5], u = (i[8] - 1) / i[0], d = (a[8] + 1) / a[0], f = o * u, p = o * d, m = r / (-u + d), h = m * -u;
			if (t.matrixWorld.decompose(e.position, e.quaternion, e.scale), e.translateX(h), e.translateZ(m), e.matrixWorld.compose(e.position, e.quaternion, e.scale), e.matrixWorldInverse.copy(e.matrixWorld).invert(), i[10] === -1) e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse);
			else {
				let t = o + m, n = s + m, i = f - h, a = p + (r - h), u = c * s / n * t, d = l * s / n * t;
				e.projectionMatrix.makePerspective(i, a, u, d, t, n), e.projectionMatrixInverse.copy(e.projectionMatrix).invert();
			}
		}
		function oe(e, t) {
			t === null ? e.matrixWorld.copy(e.matrix) : e.matrixWorld.multiplyMatrices(t.matrixWorld, e.matrix), e.matrixWorldInverse.copy(e.matrixWorld).invert();
		}
		this.updateCamera = function(e) {
			if (a === null) return;
			let t = e.near, n = e.far;
			v.texture !== null && (v.depthNear > 0 && (t = v.depthNear), v.depthFar > 0 && (n = v.depthFar)), P.near = M.near = j.near = t, P.far = M.far = j.far = n, (ne !== P.near || re !== P.far) && (a.updateRenderState({
				depthNear: P.near,
				depthFar: P.far
			}), ne = P.near, re = P.far), P.layers.mask = e.layers.mask | 6, j.layers.mask = P.layers.mask & -5, M.layers.mask = P.layers.mask & -3;
			let r = e.parent, i = P.cameras;
			oe(P, r);
			for (let e = 0; e < i.length; e++) oe(i[e], r);
			i.length === 2 ? z(P, j, M) : P.projectionMatrix.copy(j.projectionMatrix), ee === null && e.isPerspectiveCamera && (ee = {
				camera: e,
				fov: e.fov,
				zoom: e.zoom
			}), B(e, P, r);
		};
		function B(e, t, n) {
			n === null ? e.matrix.copy(t.matrixWorld) : (e.matrix.copy(n.matrixWorld), e.matrix.invert(), e.matrix.multiply(t.matrixWorld)), e.matrix.decompose(e.position, e.quaternion, e.scale), e.updateMatrixWorld(!0), e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse), e.isPerspectiveCamera && (e.fov = ve * 2 * Math.atan(1 / e.projectionMatrix.elements[5]), e.zoom = 1);
		}
		this.getCamera = function() {
			return P;
		}, this.getFoveation = function() {
			if (m !== null || h !== null) return l;
		}, this.setFoveation = function(e) {
			l = e, m !== null && (m.fixedFoveation = e), h !== null && h.fixedFoveation !== void 0 && (h.fixedFoveation = e);
		}, this.hasDepthSensing = function() {
			return v.texture !== null;
		}, this.getDepthSensingMesh = function() {
			return v.getMesh(P);
		}, this.getCameraTexture = function(e) {
			return y[e];
		};
		let se = null;
		function ce(t, n) {
			if (f = n.getViewerPose(u || s), g = n, f !== null) {
				let t = f.views;
				h !== null && (e.setRenderTargetFramebuffer(w, h.framebuffer), e.setRenderTarget(w));
				let n = !1;
				t.length !== P.cameras.length && (P.cameras.length = 0, n = !0);
				for (let i = 0; i < t.length; i++) {
					let a = t[i], o = null;
					if (h !== null) o = h.getViewport(a);
					else {
						let t = p.getViewSubImage(m, a);
						o = t.viewport, i === 0 && (e.setRenderTargetTextures(w, t.colorTexture, t.depthStencilTexture), e.setRenderTarget(w));
					}
					let s = N[i];
					s === void 0 && (s = new ke(), s.layers.enable(i), s.viewport = new r(), N[i] = s), s.matrix.fromArray(a.transform.matrix), s.matrix.decompose(s.position, s.quaternion, s.scale), s.projectionMatrix.fromArray(a.projectionMatrix), s.projectionMatrixInverse.copy(s.projectionMatrix).invert(), s.viewport.set(o.x, o.y, o.width, o.height), i === 0 && (P.matrix.copy(s.matrix), P.matrix.decompose(P.position, P.quaternion, P.scale)), n === !0 && P.cameras.push(s);
				}
				let o = a.enabledFeatures;
				if (o && o.includes("depth-sensing") && a.depthUsage == "gpu-optimized" && _) {
					p = i.getBinding();
					let e = p.getDepthInformation(t[0]);
					e && e.isValid && e.texture && v.init(e, a.renderState);
				}
				if (o && o.includes("camera-access") && _) {
					e.state.unbindTexture(), p = i.getBinding();
					for (let e = 0; e < t.length; e++) {
						let n = t[e].camera;
						if (n) {
							let e = y[n];
							e || (e = new d(), y[n] = e);
							let t = p.getCameraImage(n);
							e.sourceTexture = t;
						}
					}
				}
			}
			for (let e = 0; e < E.length; e++) {
				let t = O[e], r = E[e];
				t !== null && r !== void 0 && r.update(t, n, u || s);
			}
			se && se(t, n), n.detectedPlanes && i.dispatchEvent({
				type: "planesdetected",
				data: n
			}), g = null;
		}
		let le = new Qe();
		le.setAnimationLoop(ce), this.setAnimationLoop = function(e) {
			se = e;
		}, this.dispose = function() {};
	}
}, si = /*@__PURE__*/ new e(), ci = /*@__PURE__*/ new A();
ci.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function li(e, t) {
	function n(e, t) {
		e.matrixAutoUpdate === !0 && e.updateMatrix(), t.value.copy(e.matrix);
	}
	function r(t, n) {
		n.color.getRGB(t.fogColor.value, Ze(e)), n.isFog ? (t.fogNear.value = n.near, t.fogFar.value = n.far) : n.isFogExp2 && (t.fogDensity.value = n.density);
	}
	function i(e, t, n, r, i) {
		t.isNodeMaterial ? t.uniformsNeedUpdate = !1 : t.isMeshBasicMaterial ? a(e, t) : t.isMeshLambertMaterial ? (a(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshToonMaterial ? (a(e, t), d(e, t)) : t.isMeshPhongMaterial ? (a(e, t), u(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshStandardMaterial ? (a(e, t), f(e, t), t.isMeshPhysicalMaterial && p(e, t, i)) : t.isMeshMatcapMaterial ? (a(e, t), m(e, t)) : t.isMeshDepthMaterial ? a(e, t) : t.isMeshDistanceMaterial ? (a(e, t), h(e, t)) : t.isMeshNormalMaterial ? a(e, t) : t.isLineBasicMaterial ? (o(e, t), t.isLineDashedMaterial && s(e, t)) : t.isPointsMaterial ? c(e, t, n, r) : t.isSpriteMaterial ? l(e, t) : t.isShadowMaterial ? (e.color.value.copy(t.color), e.opacity.value = t.opacity) : t.isShaderMaterial && (t.uniformsNeedUpdate = !1);
	}
	function a(e, r) {
		e.opacity.value = r.opacity, r.color && e.diffuse.value.copy(r.color), r.emissive && e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity), r.map && (e.map.value = r.map, n(r.map, e.mapTransform)), r.alphaMap && (e.alphaMap.value = r.alphaMap, n(r.alphaMap, e.alphaMapTransform)), r.bumpMap && (e.bumpMap.value = r.bumpMap, n(r.bumpMap, e.bumpMapTransform), e.bumpScale.value = r.bumpScale, r.side === 1 && (e.bumpScale.value *= -1)), r.normalMap && (e.normalMap.value = r.normalMap, n(r.normalMap, e.normalMapTransform), e.normalScale.value.copy(r.normalScale), r.side === 1 && e.normalScale.value.negate()), r.displacementMap && (e.displacementMap.value = r.displacementMap, n(r.displacementMap, e.displacementMapTransform), e.displacementScale.value = r.displacementScale, e.displacementBias.value = r.displacementBias), r.emissiveMap && (e.emissiveMap.value = r.emissiveMap, n(r.emissiveMap, e.emissiveMapTransform)), r.specularMap && (e.specularMap.value = r.specularMap, n(r.specularMap, e.specularMapTransform)), r.alphaTest > 0 && (e.alphaTest.value = r.alphaTest);
		let i = t.get(r), a = i.envMap, o = i.envMapRotation;
		a && (e.envMap.value = a, e.envMapRotation.value.setFromMatrix4(si.makeRotationFromEuler(o)).transpose(), a.isCubeTexture && a.isRenderTargetTexture === !1 && e.envMapRotation.value.premultiply(ci), e.reflectivity.value = r.reflectivity, e.ior.value = r.ior, e.refractionRatio.value = r.refractionRatio), r.lightMap && (e.lightMap.value = r.lightMap, e.lightMapIntensity.value = r.lightMapIntensity, n(r.lightMap, e.lightMapTransform)), r.aoMap && (e.aoMap.value = r.aoMap, e.aoMapIntensity.value = r.aoMapIntensity, n(r.aoMap, e.aoMapTransform));
	}
	function o(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, t.map && (e.map.value = t.map, n(t.map, e.mapTransform));
	}
	function s(e, t) {
		e.dashSize.value = t.dashSize, e.totalSize.value = t.dashSize + t.gapSize, e.scale.value = t.scale;
	}
	function c(e, t, r, i) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.size.value = t.size * r, e.scale.value = i * .5, t.map && (e.map.value = t.map, n(t.map, e.uvTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function l(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.rotation.value = t.rotation, t.map && (e.map.value = t.map, n(t.map, e.mapTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function u(e, t) {
		e.specular.value.copy(t.specular), e.shininess.value = Math.max(t.shininess, 1e-4);
	}
	function d(e, t) {
		t.gradientMap && (e.gradientMap.value = t.gradientMap);
	}
	function f(e, t) {
		e.metalness.value = t.metalness, t.metalnessMap && (e.metalnessMap.value = t.metalnessMap, n(t.metalnessMap, e.metalnessMapTransform)), e.roughness.value = t.roughness, t.roughnessMap && (e.roughnessMap.value = t.roughnessMap, n(t.roughnessMap, e.roughnessMapTransform)), t.envMap && (e.envMapIntensity.value = t.envMapIntensity);
	}
	function p(e, t, r) {
		e.ior.value = t.ior, t.sheen > 0 && (e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen), e.sheenRoughness.value = t.sheenRoughness, t.sheenColorMap && (e.sheenColorMap.value = t.sheenColorMap, n(t.sheenColorMap, e.sheenColorMapTransform)), t.sheenRoughnessMap && (e.sheenRoughnessMap.value = t.sheenRoughnessMap, n(t.sheenRoughnessMap, e.sheenRoughnessMapTransform))), t.clearcoat > 0 && (e.clearcoat.value = t.clearcoat, e.clearcoatRoughness.value = t.clearcoatRoughness, t.clearcoatMap && (e.clearcoatMap.value = t.clearcoatMap, n(t.clearcoatMap, e.clearcoatMapTransform)), t.clearcoatRoughnessMap && (e.clearcoatRoughnessMap.value = t.clearcoatRoughnessMap, n(t.clearcoatRoughnessMap, e.clearcoatRoughnessMapTransform)), t.clearcoatNormalMap && (e.clearcoatNormalMap.value = t.clearcoatNormalMap, n(t.clearcoatNormalMap, e.clearcoatNormalMapTransform), e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale), t.side === 1 && e.clearcoatNormalScale.value.negate())), t.dispersion > 0 && (e.dispersion.value = t.dispersion), t.retroreflectivity > 0 && (e.retroreflectivity.value = t.retroreflectivity), t.iridescence > 0 && (e.iridescence.value = t.iridescence, e.iridescenceIOR.value = t.iridescenceIOR, e.iridescenceThicknessMinimum.value = t.iridescenceThicknessRange[0], e.iridescenceThicknessMaximum.value = t.iridescenceThicknessRange[1], t.iridescenceMap && (e.iridescenceMap.value = t.iridescenceMap, n(t.iridescenceMap, e.iridescenceMapTransform)), t.iridescenceThicknessMap && (e.iridescenceThicknessMap.value = t.iridescenceThicknessMap, n(t.iridescenceThicknessMap, e.iridescenceThicknessMapTransform))), t.transmission > 0 && (e.transmission.value = t.transmission, e.transmissionSamplerMap.value = r.texture, e.transmissionSamplerSize.value.set(r.width, r.height), t.transmissionMap && (e.transmissionMap.value = t.transmissionMap, n(t.transmissionMap, e.transmissionMapTransform)), e.thickness.value = t.thickness, t.thicknessMap && (e.thicknessMap.value = t.thicknessMap, n(t.thicknessMap, e.thicknessMapTransform)), e.attenuationDistance.value = t.attenuationDistance, e.attenuationColor.value.copy(t.attenuationColor)), t.anisotropy > 0 && (e.anisotropyVector.value.set(t.anisotropy * Math.cos(t.anisotropyRotation), t.anisotropy * Math.sin(t.anisotropyRotation)), t.anisotropyMap && (e.anisotropyMap.value = t.anisotropyMap, n(t.anisotropyMap, e.anisotropyMapTransform))), e.specularIntensity.value = t.specularIntensity, e.specularColor.value.copy(t.specularColor), t.specularColorMap && (e.specularColorMap.value = t.specularColorMap, n(t.specularColorMap, e.specularColorMapTransform)), t.specularIntensityMap && (e.specularIntensityMap.value = t.specularIntensityMap, n(t.specularIntensityMap, e.specularIntensityMapTransform));
	}
	function m(e, t) {
		t.matcap && (e.matcap.value = t.matcap);
	}
	function h(e, n) {
		let r = t.get(n).light;
		e.referencePosition.value.setFromMatrixPosition(r.matrixWorld), e.nearDistance.value = r.shadow.camera.near, e.farDistance.value = r.shadow.camera.far;
	}
	return {
		refreshFogUniforms: r,
		refreshMaterialUniforms: i
	};
}
function ui(e, t, n, r) {
	let i = {}, a = {}, o = [], s = e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);
	function c(e, t) {
		let n = t.program;
		r.uniformBlockBinding(e, n);
	}
	function l(e, n) {
		let o = i[e.id];
		o === void 0 && (g(e), o = u(e), i[e.id] = o, e.addEventListener("dispose", v));
		let s = n.program;
		r.updateUBOMapping(e, s);
		let c = t.render.frame;
		a[e.id] !== c && (f(e), a[e.id] = c);
	}
	function u(t) {
		let n = d();
		t.__bindingPointIndex = n;
		let r = e.createBuffer(), i = t.__size, a = t.usage;
		return e.bindBuffer(e.UNIFORM_BUFFER, r), e.bufferData(e.UNIFORM_BUFFER, i, a), e.bindBuffer(e.UNIFORM_BUFFER, null), e.bindBufferBase(e.UNIFORM_BUFFER, n, r), r;
	}
	function d() {
		for (let e = 0; e < s; e++) if (o.indexOf(e) === -1) return o.push(e), e;
		return x("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
	}
	function f(t) {
		let n = i[t.id], r = t.uniforms, a = t.__cache;
		e.bindBuffer(e.UNIFORM_BUFFER, n);
		for (let e = 0, t = r.length; e < t; e++) {
			let t = r[e];
			if (Array.isArray(t)) for (let n = 0, r = t.length; n < r; n++) p(t[n], e, n, a);
			else p(t, e, 0, a);
		}
		e.bindBuffer(e.UNIFORM_BUFFER, null);
	}
	function p(t, n, r, i) {
		if (h(t, n, r, i) === !0) {
			let n = t.__offset, r = t.value;
			if (Array.isArray(r)) {
				let e = 0;
				for (let n = 0; n < r.length; n++) {
					let i = r[n], a = _(i);
					m(i, t.__data, e), typeof i != "number" && typeof i != "boolean" && !i.isMatrix3 && !ArrayBuffer.isView(i) && (e += a.storage / Float32Array.BYTES_PER_ELEMENT);
				}
			} else m(r, t.__data, 0);
			e.bufferSubData(e.UNIFORM_BUFFER, n, t.__data);
		}
	}
	function m(e, t, n) {
		typeof e == "number" || typeof e == "boolean" ? t[0] = e : e.isMatrix3 ? (t[0] = e.elements[0], t[1] = e.elements[1], t[2] = e.elements[2], t[3] = 0, t[4] = e.elements[3], t[5] = e.elements[4], t[6] = e.elements[5], t[7] = 0, t[8] = e.elements[6], t[9] = e.elements[7], t[10] = e.elements[8], t[11] = 0) : ArrayBuffer.isView(e) ? t.set(new e.constructor(e.buffer, e.byteOffset, t.length)) : e.toArray(t, n);
	}
	function h(e, t, n, r) {
		let i = e.value, a = t + "_" + n;
		if (r[a] === void 0) return r[a] = typeof i == "number" || typeof i == "boolean" ? i : ArrayBuffer.isView(i) ? i.slice() : i.clone(), !0;
		{
			let e = r[a];
			if (typeof i == "number" || typeof i == "boolean") {
				if (e !== i) return r[a] = i, !0;
			} else if (ArrayBuffer.isView(i)) return !0;
			else if (e.equals(i) === !1) return e.copy(i), !0;
		}
		return !1;
	}
	function g(e) {
		let t = e.uniforms, n = 0;
		for (let e = 0, r = t.length; e < r; e++) {
			let r = Array.isArray(t[e]) ? t[e] : [t[e]];
			for (let e = 0, t = r.length; e < t; e++) {
				let t = r[e], i = Array.isArray(t.value) ? t.value : [t.value];
				for (let e = 0, r = i.length; e < r; e++) {
					let r = i[e], a = _(r), o = n % 16, s = o % a.boundary, c = o + s;
					n += s, c !== 0 && 16 - c < a.storage && (n += 16 - c), t.__data = new Float32Array(a.storage / Float32Array.BYTES_PER_ELEMENT), t.__offset = n, n += a.storage;
				}
			}
		}
		let r = n % 16;
		return r > 0 && (n += 16 - r), e.__size = n, e.__cache = {}, this;
	}
	function _(e) {
		let t = {
			boundary: 0,
			storage: 0
		};
		return typeof e == "number" || typeof e == "boolean" ? (t.boundary = 4, t.storage = 4) : e.isVector2 ? (t.boundary = 8, t.storage = 8) : e.isVector3 || e.isColor ? (t.boundary = 16, t.storage = 12) : e.isVector4 ? (t.boundary = 16, t.storage = 16) : e.isMatrix3 ? (t.boundary = 48, t.storage = 48) : e.isMatrix4 ? (t.boundary = 64, t.storage = 64) : e.isTexture ? F("WebGLRenderer: Texture samplers can not be part of an uniforms group.") : ArrayBuffer.isView(e) ? (t.boundary = 16, t.storage = e.byteLength) : F("WebGLRenderer: Unsupported uniform value type.", e), t;
	}
	function v(t) {
		let n = t.target;
		n.removeEventListener("dispose", v);
		let r = o.indexOf(n.__bindingPointIndex);
		o.splice(r, 1), e.deleteBuffer(i[n.id]), delete i[n.id], delete a[n.id];
	}
	function y() {
		for (let t in i) e.deleteBuffer(i[t]);
		o = [], i = {}, a = {};
	}
	return {
		bind: c,
		update: l,
		dispose: y
	};
}
var di = new Uint16Array([
	12469,
	15057,
	12620,
	14925,
	13266,
	14620,
	13807,
	14376,
	14323,
	13990,
	14545,
	13625,
	14713,
	13328,
	14840,
	12882,
	14931,
	12528,
	14996,
	12233,
	15039,
	11829,
	15066,
	11525,
	15080,
	11295,
	15085,
	10976,
	15082,
	10705,
	15073,
	10495,
	13880,
	14564,
	13898,
	14542,
	13977,
	14430,
	14158,
	14124,
	14393,
	13732,
	14556,
	13410,
	14702,
	12996,
	14814,
	12596,
	14891,
	12291,
	14937,
	11834,
	14957,
	11489,
	14958,
	11194,
	14943,
	10803,
	14921,
	10506,
	14893,
	10278,
	14858,
	9960,
	14484,
	14039,
	14487,
	14025,
	14499,
	13941,
	14524,
	13740,
	14574,
	13468,
	14654,
	13106,
	14743,
	12678,
	14818,
	12344,
	14867,
	11893,
	14889,
	11509,
	14893,
	11180,
	14881,
	10751,
	14852,
	10428,
	14812,
	10128,
	14765,
	9754,
	14712,
	9466,
	14764,
	13480,
	14764,
	13475,
	14766,
	13440,
	14766,
	13347,
	14769,
	13070,
	14786,
	12713,
	14816,
	12387,
	14844,
	11957,
	14860,
	11549,
	14868,
	11215,
	14855,
	10751,
	14825,
	10403,
	14782,
	10044,
	14729,
	9651,
	14666,
	9352,
	14599,
	9029,
	14967,
	12835,
	14966,
	12831,
	14963,
	12804,
	14954,
	12723,
	14936,
	12564,
	14917,
	12347,
	14900,
	11958,
	14886,
	11569,
	14878,
	11247,
	14859,
	10765,
	14828,
	10401,
	14784,
	10011,
	14727,
	9600,
	14660,
	9289,
	14586,
	8893,
	14508,
	8533,
	15111,
	12234,
	15110,
	12234,
	15104,
	12216,
	15092,
	12156,
	15067,
	12010,
	15028,
	11776,
	14981,
	11500,
	14942,
	11205,
	14902,
	10752,
	14861,
	10393,
	14812,
	9991,
	14752,
	9570,
	14682,
	9252,
	14603,
	8808,
	14519,
	8445,
	14431,
	8145,
	15209,
	11449,
	15208,
	11451,
	15202,
	11451,
	15190,
	11438,
	15163,
	11384,
	15117,
	11274,
	15055,
	10979,
	14994,
	10648,
	14932,
	10343,
	14871,
	9936,
	14803,
	9532,
	14729,
	9218,
	14645,
	8742,
	14556,
	8381,
	14461,
	8020,
	14365,
	7603,
	15273,
	10603,
	15272,
	10607,
	15267,
	10619,
	15256,
	10631,
	15231,
	10614,
	15182,
	10535,
	15118,
	10389,
	15042,
	10167,
	14963,
	9787,
	14883,
	9447,
	14800,
	9115,
	14710,
	8665,
	14615,
	8318,
	14514,
	7911,
	14411,
	7507,
	14279,
	7198,
	15314,
	9675,
	15313,
	9683,
	15309,
	9712,
	15298,
	9759,
	15277,
	9797,
	15229,
	9773,
	15166,
	9668,
	15084,
	9487,
	14995,
	9274,
	14898,
	8910,
	14800,
	8539,
	14697,
	8234,
	14590,
	7790,
	14479,
	7409,
	14367,
	7067,
	14178,
	6621,
	15337,
	8619,
	15337,
	8631,
	15333,
	8677,
	15325,
	8769,
	15305,
	8871,
	15264,
	8940,
	15202,
	8909,
	15119,
	8775,
	15022,
	8565,
	14916,
	8328,
	14804,
	8009,
	14688,
	7614,
	14569,
	7287,
	14448,
	6888,
	14321,
	6483,
	14088,
	6171,
	15350,
	7402,
	15350,
	7419,
	15347,
	7480,
	15340,
	7613,
	15322,
	7804,
	15287,
	7973,
	15229,
	8057,
	15148,
	8012,
	15046,
	7846,
	14933,
	7611,
	14810,
	7357,
	14682,
	7069,
	14552,
	6656,
	14421,
	6316,
	14251,
	5948,
	14007,
	5528,
	15356,
	5942,
	15356,
	5977,
	15353,
	6119,
	15348,
	6294,
	15332,
	6551,
	15302,
	6824,
	15249,
	7044,
	15171,
	7122,
	15070,
	7050,
	14949,
	6861,
	14818,
	6611,
	14679,
	6349,
	14538,
	6067,
	14398,
	5651,
	14189,
	5311,
	13935,
	4958,
	15359,
	4123,
	15359,
	4153,
	15356,
	4296,
	15353,
	4646,
	15338,
	5160,
	15311,
	5508,
	15263,
	5829,
	15188,
	6042,
	15088,
	6094,
	14966,
	6001,
	14826,
	5796,
	14678,
	5543,
	14527,
	5287,
	14377,
	4985,
	14133,
	4586,
	13869,
	4257,
	15360,
	1563,
	15360,
	1642,
	15358,
	2076,
	15354,
	2636,
	15341,
	3350,
	15317,
	4019,
	15273,
	4429,
	15203,
	4732,
	15105,
	4911,
	14981,
	4932,
	14836,
	4818,
	14679,
	4621,
	14517,
	4386,
	14359,
	4156,
	14083,
	3795,
	13808,
	3437,
	15360,
	122,
	15360,
	137,
	15358,
	285,
	15355,
	636,
	15344,
	1274,
	15322,
	2177,
	15281,
	2765,
	15215,
	3223,
	15120,
	3451,
	14995,
	3569,
	14846,
	3567,
	14681,
	3466,
	14511,
	3305,
	14344,
	3121,
	14037,
	2800,
	13753,
	2467,
	15360,
	0,
	15360,
	1,
	15359,
	21,
	15355,
	89,
	15346,
	253,
	15325,
	479,
	15287,
	796,
	15225,
	1148,
	15133,
	1492,
	15008,
	1749,
	14856,
	1882,
	14685,
	1886,
	14506,
	1783,
	14324,
	1608,
	13996,
	1398,
	13702,
	1183
]), fi = null;
function pi() {
	return fi === null && (fi = new Ee(di, 16, 16, oe, I), fi.name = "DFG_LUT", fi.minFilter = q, fi.magFilter = q, fi.wrapS = qe, fi.wrapT = qe, fi.generateMipmaps = !1, fi.needsUpdate = !0), fi;
}
var mi = class {
	constructor(t = {}) {
		let { canvas: n = f(), context: i = null, depth: s = !0, stencil: l = !1, alpha: d = !1, antialias: p = !1, premultipliedAlpha: m = !0, preserveDrawingBuffer: g = !1, powerPreference: _ = "default", failIfMajorPerformanceCaveat: y = !1, reversedDepthBuffer: b = !1, outputBufferType: S = ue } = t;
		this.isWebGLRenderer = !0;
		let w;
		if (i !== null) {
			if (typeof WebGLRenderingContext < "u" && i instanceof WebGLRenderingContext) throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
			w = i.getContextAttributes().alpha;
		} else w = d;
		let T = S, E = /* @__PURE__ */ new Set([
			Je,
			ee,
			Ne
		]), D = /* @__PURE__ */ new Set([
			ue,
			Ke,
			c,
			te,
			ne,
			u
		]), O = /* @__PURE__ */ new Uint32Array(4), k = /* @__PURE__ */ new Int32Array(4), A = new G(), M = null, P = null, re = [], L = [], ie = null;
		this.domElement = n, this.debug = {
			checkShaderErrors: !0,
			diagnostics: { keywords: !1 },
			onShaderError: null
		}, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.toneMapping = 0, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
		let R = this, ae = !1, z = null, oe = null, B = null, se = null;
		this._outputColorSpace = Oe;
		let ce = 0, le = 0, V = null, de = -1, fe = null, pe = new r(), me = new r(), he = null, H = new N(0), U = 0, ge = n.width, W = n.height, _e = 1, ve = null, ye = null, be = new r(0, 0, ge, W), xe = new r(0, 0, ge, W), Se = !1, Ce = new j(), we = !1, Ee = !1, De = new e(), ke = new G(), Ae = new r(), je = {
			background: null,
			fog: null,
			environment: null,
			overrideMaterial: null,
			isScene: !0
		}, Me = !1;
		function Pe() {
			return V === null ? _e : 1;
		}
		let K = i;
		function Fe(e, t) {
			return n.getContext(e, t);
		}
		let Ie, q, J, Le, Y, X, Re, ze, Be, Ve, He, Ue, We, Ge, qe, Ye, Xe, Ze, Z, Q, et, tt, nt;
		try {
			let e = {
				alpha: !0,
				depth: s,
				stencil: l,
				antialias: p,
				premultipliedAlpha: m,
				preserveDrawingBuffer: g,
				powerPreference: _,
				failIfMajorPerformanceCaveat: y
			};
			if ("setAttribute" in n && n.setAttribute("data-engine", "three.js r186"), n.addEventListener("webglcontextlost", lt, !1), n.addEventListener("webglcontextrestored", ut, !1), n.addEventListener("webglcontextcreationerror", dt, !1), K === null) {
				let t = "webgl2";
				if (K = Fe(t, e), K === null) throw Fe(t) ? Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.") : Error("THREE.WebGLRenderer: Error creating WebGL context.");
			}
			rt();
		} catch (e) {
			throw n.removeEventListener("webglcontextlost", lt, !1), n.removeEventListener("webglcontextrestored", ut, !1), n.removeEventListener("webglcontextcreationerror", dt, !1), x("WebGLRenderer: " + e.message), e;
		}
		function rt() {
			Ie = new jt(K), Ie.init(), et = new ni(K, Ie), q = new st(K, Ie, t, et), J = new ei(K, Ie), q.reversedDepthBuffer && b && J.buffers.depth.setReversed(!0), oe = K.createFramebuffer(), B = K.createFramebuffer(), se = K.createFramebuffer(), Le = new Pt(K), Y = new Pr(), X = new ti(K, Ie, J, Y, q, et, Le), Re = new At(R), ze = new $e(K), tt = new at(K, ze), Be = new Mt(K, ze, Le, tt), Ve = new It(K, Be, ze, tt, Le), Ze = new Ft(K, q, X), qe = new ct(Y), He = new Nr(R, Re, Ie, q, tt, qe), Ue = new li(R, Y), We = new Rr(), Ge = new Gr(Ie), Xe = new it(R, Re, J, Ve, w, m), Ye = new $r(R, Ve, q), nt = new ui(K, Le, q, J), Z = new ot(K, Ie, Le), Q = new Nt(K, Ie, Le), Le.programs = He.programs, R.capabilities = q, R.extensions = Ie, R.properties = Y, R.renderLists = We, R.shadowMap = Ye, R.state = J, R.info = Le;
		}
		T !== 1009 && (ie = new Rt(T, n.width, n.height, p, s, l));
		let $ = new oi(R, K);
		this.xr = $, this.getContext = function() {
			return K;
		}, this.getContextAttributes = function() {
			return K.getContextAttributes();
		}, this.forceContextLoss = function() {
			let e = Ie.get("WEBGL_lose_context");
			e && e.loseContext();
		}, this.forceContextRestore = function() {
			let e = Ie.get("WEBGL_lose_context");
			e && e.restoreContext();
		}, this.getPixelRatio = function() {
			return _e;
		}, this.setPixelRatio = function(e) {
			e !== void 0 && (_e = e, this.setSize(ge, W, !1));
		}, this.getSize = function(e) {
			return e.set(ge, W);
		}, this.setSize = function(e, t, r = !0) {
			$.isPresenting ? F("WebGLRenderer: Can't change size while VR device is presenting.") : (ge = e, W = t, n.width = Math.floor(e * _e), n.height = Math.floor(t * _e), r === !0 && (n.style.width = e + "px", n.style.height = t + "px"), ie !== null && ie.setSize(n.width, n.height), this.setViewport(0, 0, e, t));
		}, this.getDrawingBufferSize = function(e) {
			return e.set(ge * _e, W * _e).floor();
		}, this.setDrawingBufferSize = function(e, t, r) {
			ge = e, W = t, _e = r, n.width = Math.floor(e * r), n.height = Math.floor(t * r), this.setViewport(0, 0, e, t);
		}, this.setEffects = function(e) {
			if (T === 1009) x("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");
			else {
				if (e) {
					for (let t = 0; t < e.length; t++) if (e[t].isOutputPass === !0) {
						F("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");
						break;
					}
				}
				ie.setEffects(e || []);
			}
		}, this.getCurrentViewport = function(e) {
			return e.copy(pe);
		}, this.getViewport = function(e) {
			return e.copy(be);
		}, this.setViewport = function(e, t, n, r) {
			e.isVector4 ? be.set(e.x, e.y, e.z, e.w) : be.set(e, t, n, r), J.viewport(pe.copy(be).multiplyScalar(_e).round());
		}, this.getScissor = function(e) {
			return e.copy(xe);
		}, this.setScissor = function(e, t, n, r) {
			e.isVector4 ? xe.set(e.x, e.y, e.z, e.w) : xe.set(e, t, n, r), J.scissor(me.copy(xe).multiplyScalar(_e).round());
		}, this.getScissorTest = function() {
			return Se;
		}, this.setScissorTest = function(e) {
			J.setScissorTest(Se = e);
		}, this.setOpaqueSort = function(e) {
			ve = e;
		}, this.setTransparentSort = function(e) {
			ye = e;
		}, this.getClearColor = function(e) {
			return e.copy(Xe.getClearColor());
		}, this.setClearColor = function() {
			Xe.setClearColor(...arguments);
		}, this.getClearAlpha = function() {
			return Xe.getClearAlpha();
		}, this.setClearAlpha = function() {
			Xe.setClearAlpha(...arguments);
		}, this.clear = function(e = !0, t = !0, n = !0) {
			let r = 0;
			if (e) {
				let e = !1;
				if (V !== null) {
					let t = V.texture.format;
					e = E.has(t);
				}
				if (e) {
					let e = V.texture.type, t = D.has(e), n = Xe.getClearColor(), r = Xe.getClearAlpha(), i = n.r, a = n.g, o = n.b;
					t ? (O[0] = i, O[1] = a, O[2] = o, O[3] = r, K.clearBufferuiv(K.COLOR, 0, O)) : (k[0] = i, k[1] = a, k[2] = o, k[3] = r, K.clearBufferiv(K.COLOR, 0, k));
				} else r |= K.COLOR_BUFFER_BIT;
			}
			t && (r |= K.DEPTH_BUFFER_BIT, this.state.buffers.depth.setMask(!0)), n && (r |= K.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), r !== 0 && K.clear(r);
		}, this.clearColor = function() {
			this.clear(!0, !1, !1);
		}, this.clearDepth = function() {
			this.clear(!1, !0, !1);
		}, this.clearStencil = function() {
			this.clear(!1, !1, !0);
		}, this.setNodesHandler = function(e) {
			e.setRenderer(this), z = e;
		}, this.dispose = function() {
			n.removeEventListener("webglcontextlost", lt, !1), n.removeEventListener("webglcontextrestored", ut, !1), n.removeEventListener("webglcontextcreationerror", dt, !1), Xe.dispose(), We.dispose(), Ge.dispose(), Y.dispose(), Re.dispose(), Ve.dispose(), tt.dispose(), nt.dispose(), He.dispose(), $.dispose(), $.removeEventListener("sessionstart", vt), $.removeEventListener("sessionend", yt), bt.stop();
		};
		function lt(e) {
			e.preventDefault(), a("WebGLRenderer: Context Lost."), ae = !0;
		}
		function ut() {
			a("WebGLRenderer: Context Restored."), ae = !1;
			let e = Le.autoReset, t = Ye.enabled, n = Ye.autoUpdate, r = Ye.needsUpdate, i = Ye.type;
			rt(), Le.autoReset = e, Ye.enabled = t, Ye.autoUpdate = n, Ye.needsUpdate = r, Ye.type = i;
		}
		function dt(e) {
			x("WebGLRenderer: A WebGL context could not be created. Reason: ", e.statusMessage);
		}
		function ft(e) {
			let t = e.target;
			t.removeEventListener("dispose", ft), pt(t);
		}
		function pt(e) {
			mt(e), Y.remove(e);
		}
		function mt(e) {
			let t = Y.get(e).programs;
			t !== void 0 && (t.forEach(function(e) {
				He.releaseProgram(e);
			}), e.isShaderMaterial && He.releaseShaderCache(e));
		}
		this.renderBufferDirect = function(e, t, n, r, i, a) {
			t === null && (t = je);
			let o = i.isMesh && i.matrixWorld.determinantAffine() < 0, s = Lt(e, t, n, r, i);
			J.setMaterial(r, o);
			let c = n.index, l = 1;
			if (r.wireframe === !0) {
				if (c = Be.getWireframeAttribute(n), c === void 0) return;
				l = 2;
			}
			let u = n.drawRange, d = n.attributes.position, f = u.start * l, p = (u.start + u.count) * l;
			a !== null && (f = Math.max(f, a.start * l), p = Math.min(p, (a.start + a.count) * l)), c === null ? d != null && (f = Math.max(f, 0), p = Math.min(p, d.count)) : (f = Math.max(f, 0), p = Math.min(p, c.count));
			let m = p - f;
			if (m < 0 || m === Infinity) return;
			tt.setup(i, r, s, n, c);
			let h, g = Z;
			if (c !== null && (h = ze.get(c), g = Q, g.setIndex(h)), i.isMesh) r.wireframe === !0 ? (J.setLineWidth(r.wireframeLinewidth * Pe()), g.setMode(K.LINES)) : g.setMode(K.TRIANGLES);
			else if (i.isLine) {
				let e = r.linewidth;
				e === void 0 && (e = 1), J.setLineWidth(e * Pe()), i.isLineSegments ? g.setMode(K.LINES) : i.isLineLoop ? g.setMode(K.LINE_LOOP) : g.setMode(K.LINE_STRIP);
			} else i.isPoints ? g.setMode(K.POINTS) : i.isSprite && g.setMode(K.TRIANGLES);
			if (i.isBatchedMesh) {
				if (Ie.get("WEBGL_multi_draw")) g.renderMultiDraw(i._multiDrawStarts, i._multiDrawCounts, i._multiDrawCount);
				else {
					let e = i._multiDrawStarts, t = i._multiDrawCounts, n = i._multiDrawCount, a = c ? ze.get(c).bytesPerElement : 1, o = Y.get(r).currentProgram.getUniforms();
					for (let r = 0; r < n; r++) o.setValue(K, "_gl_DrawID", r), g.render(e[r] / a, t[r]);
				}
			} else if (i.isInstancedMesh) g.renderInstances(f, m, i.count);
			else if (n.isInstancedBufferGeometry) {
				let e = n._maxInstanceCount === void 0 ? Infinity : n._maxInstanceCount, t = Math.min(n.instanceCount, e);
				g.renderInstances(f, m, t);
			} else g.render(f, m);
		};
		function ht(e, t, n, r) {
			z !== null && e.isNodeMaterial && z.setObject(r, e), we === !0 && qe.setState(e, n, !1), e.transparent === !0 && e.side === 2 && e.forceSinglePass === !1 ? (e.side = 1, e.needsUpdate = !0, Et(e, t, r), e.side = 0, e.needsUpdate = !0, Et(e, t, r), e.side = 2) : Et(e, t, r);
		}
		this.compile = function(e, t, n = null) {
			n === null && (n = e), z !== null && z.renderStart(e, t, n), P = Ge.get(n), P.init(t), L.push(P), n.traverseVisible(function(e) {
				e.isLight && e.layers.test(t.layers) && (P.pushLight(e), e.castShadow && P.pushShadow(e));
			}), e !== n && e.traverseVisible(function(e) {
				e.isLight && e.layers.test(t.layers) && (P.pushLight(e), e.castShadow && P.pushShadow(e));
			}), P.setupLights(), z !== null && z.updateLights(P.state.lightsArray), Ee = this.localClippingEnabled, we = qe.init(this.clippingPlanes, Ee), we === !0 && qe.setGlobalState(this.clippingPlanes, t), z !== null && Ye.render(P.state.shadowsArray, n, t);
			let r = /* @__PURE__ */ new Set();
			return e.traverse(function(e) {
				if (!(e.isMesh || e.isPoints || e.isLine || e.isSprite)) return;
				let i = e.material;
				if (i) {
					if (Array.isArray(i)) for (let a = 0; a < i.length; a++) {
						let o = i[a];
						ht(o, n, t, e), r.add(o);
					}
					else ht(i, n, t, e), r.add(i);
				}
			}), P = L.pop(), z !== null && z.renderEnd(), r;
		}, this.compileAsync = function(e, t, n = null) {
			let r = this.compile(e, t, n);
			return new Promise((t) => {
				function n() {
					r.forEach(function(e) {
						let t = Y.get(e).currentProgram;
						(t === void 0 || t.isReady()) && r.delete(e);
					}), r.size === 0 ? t(e) : setTimeout(n, 10);
				}
				Ie.get("KHR_parallel_shader_compile") === null ? setTimeout(n, 10) : n();
			});
		};
		let gt = null;
		function _t(e) {
			gt && gt(e);
		}
		function vt() {
			bt.stop();
		}
		function yt() {
			bt.start();
		}
		let bt = new Qe();
		bt.setAnimationLoop(_t), typeof self < "u" && bt.setContext(self), this.setAnimationLoop = function(e) {
			gt = e, $.setAnimationLoop(e), e === null ? bt.stop() : bt.start();
		}, $.addEventListener("sessionstart", vt), $.addEventListener("sessionend", yt), this.render = function(e, t) {
			if (t !== void 0 && t.isCamera !== !0) {
				x("WebGLRenderer.render: camera is not an instance of THREE.Camera.");
				return;
			}
			if (ae === !0) return;
			z !== null && z.renderStart(e, t);
			let n = $.enabled === !0 && $.isPresenting === !0, r = ie !== null && (V === null || n) && ie.begin(R, V);
			if (e.matrixWorldAutoUpdate === !0 && e.updateMatrixWorld(), t.parent === null && t.matrixWorldAutoUpdate === !0 && t.updateMatrixWorld(), $.enabled === !0 && $.isPresenting === !0 && (ie === null || ie.isCompositing() === !1) && ($.cameraAutoUpdate === !0 && $.updateCamera(t), t = $.getCamera()), e.isScene === !0 && e.onBeforeRender(R, e, t, V), P = Ge.get(e, L.length), P.init(t), P.state.textureUnits = X.getTextureUnits(), L.push(P), De.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), Ce.setFromProjectionMatrix(De, Te, t.reversedDepth), Ee = this.localClippingEnabled, we = qe.init(this.clippingPlanes, Ee), M = We.get(e, re.length), M.init(), re.push(M), $.enabled === !0 && $.isPresenting === !0) {
				let e = R.xr.getDepthSensingMesh();
				e !== null && xt(e, t, -Infinity, R.sortObjects);
			}
			xt(e, t, 0, R.sortObjects), M.finish(), z !== null && z.updateLights(P.state.lightsArray), R.sortObjects === !0 && M.sort(ve, ye), Me = $.enabled === !1 || $.isPresenting === !1 || $.hasDepthSensing() === !1, Me && Xe.addToRenderList(M, e), this.info.render.frame++, this.info.autoReset === !0 && this.info.reset(), we === !0 && qe.beginShadows();
			let i = P.state.shadowsArray;
			if (Ye.render(i, e, t), we === !0 && qe.endShadows(), (r && ie.hasRenderPass()) === !1) {
				let n = M.opaque, r = M.transmissive;
				if (P.setupLights(), t.isArrayCamera) {
					let i = t.cameras;
					if (r.length > 0) for (let t = 0, a = i.length; t < a; t++) {
						let a = i[t];
						Ct(n, r, e, a);
					}
					Me && Xe.render(e);
					for (let t = 0, n = i.length; t < n; t++) {
						let n = i[t];
						St(M, e, n, n.viewport);
					}
				} else r.length > 0 && Ct(n, r, e, t), Me && Xe.render(e), St(M, e, t);
			}
			V !== null && le === 0 && (X.updateMultisampleRenderTarget(V), X.updateRenderTargetMipmap(V)), r && ie.end(R), e.isScene === !0 && e.onAfterRender(R, e, t), tt.resetDefaultState(), de = -1, fe = null, L.pop(), L.length > 0 ? (P = L[L.length - 1], X.setTextureUnits(P.state.textureUnits), we === !0 && qe.setGlobalState(R.clippingPlanes, P.state.camera)) : P = null, re.pop(), M = re.length > 0 ? re[re.length - 1] : null, z !== null && z.renderEnd();
		};
		function xt(e, t, n, r) {
			if (e.visible === !1) return;
			if (e.layers.test(t.layers)) {
				if (e.isGroup) n = e.renderOrder;
				else if (e.isLOD) e.autoUpdate === !0 && e.update(t);
				else if (e.isLightProbeGrid) P.pushLightProbeGrid(e);
				else if (e.isLight) P.pushLight(e), e.castShadow && P.pushShadow(e);
				else if (e.isSprite) {
					if (!e.frustumCulled || e.intersectsFrustum(Ce)) {
						r && Ae.setFromMatrixPosition(e.matrixWorld).applyMatrix4(De);
						let i = Ve.update(e), a = e.material;
						a.visible && M.push(e, i, a, n, Ae.z, null, t);
					}
				} else if ((e.isMesh || e.isLine || e.isPoints) && (!e.frustumCulled || e.intersectsFrustum(Ce))) {
					let i = Ve.update(e), a = e.material;
					if (r && (e.boundingSphere === void 0 ? (i.boundingSphere === null && i.computeBoundingSphere(), Ae.copy(i.boundingSphere.center)) : (e.boundingSphere === null && e.computeBoundingSphere(), Ae.copy(e.boundingSphere.center)), Ae.applyMatrix4(e.matrixWorld).applyMatrix4(De)), Array.isArray(a)) {
						let r = i.groups;
						for (let o = 0, s = r.length; o < s; o++) {
							let s = r[o], c = a[s.materialIndex];
							c && c.visible && M.push(e, i, c, n, Ae.z, s, t);
						}
					} else a.visible && M.push(e, i, a, n, Ae.z, null, t);
				}
			}
			let i = e.children;
			for (let e = 0, a = i.length; e < a; e++) xt(i[e], t, n, r);
		}
		function St(e, t, n, r) {
			let { opaque: i, transmissive: a, transparent: o } = e;
			P.setupLightsView(n), we === !0 && qe.setGlobalState(R.clippingPlanes, n), r && J.viewport(pe.copy(r)), i.length > 0 && wt(i, t, n), a.length > 0 && wt(a, t, n), o.length > 0 && wt(o, t, n), J.buffers.depth.setTest(!0), J.buffers.depth.setMask(!0), J.buffers.color.setMask(!0), J.setPolygonOffset(!1);
		}
		function Ct(e, t, n, r) {
			if ((n.isScene === !0 ? n.overrideMaterial : null) !== null) return;
			if (P.state.transmissionRenderTarget[r.id] === void 0) {
				let e = Ie.has("EXT_color_buffer_half_float") || Ie.has("EXT_color_buffer_float");
				P.state.transmissionRenderTarget[r.id] = new C(1, 1, {
					generateMipmaps: !0,
					type: e ? I : ue,
					minFilter: v,
					samples: Math.max(4, q.samples),
					stencilBuffer: l,
					resolveDepthBuffer: !1,
					resolveStencilBuffer: !1,
					storeMultisampledDepthBuffer: !1,
					storeMultisampledStencilBuffer: !1,
					colorSpace: o.workingColorSpace
				});
			}
			let i = P.state.transmissionRenderTarget[r.id], a = r.viewport || pe;
			i.setSize(a.z * R.transmissionResolutionScale, a.w * R.transmissionResolutionScale);
			let s = R.getRenderTarget(), c = R.getActiveCubeFace(), u = R.getActiveMipmapLevel();
			R.setRenderTarget(i), R.getClearColor(H), U = R.getClearAlpha(), U < 1 && R.setClearColor(16777215, .5), R.clear(), Me && Xe.render(n);
			let d = R.toneMapping;
			R.toneMapping = 0;
			let f = r.viewport;
			if (r.viewport !== void 0 && (r.viewport = void 0), P.setupLightsView(r), we === !0 && qe.setGlobalState(R.clippingPlanes, r), wt(e, n, r), X.updateMultisampleRenderTarget(i), X.updateRenderTargetMipmap(i), Ie.has("WEBGL_multisampled_render_to_texture") === !1) {
				let e = !1;
				for (let i = 0, a = t.length; i < a; i++) {
					let { object: a, geometry: o, material: s, group: c } = t[i];
					if (s.side === 2 && a.layers.test(r.layers)) {
						let t = s.side;
						s.side = 1, s.needsUpdate = !0, Tt(a, n, r, o, s, c), s.side = t, s.needsUpdate = !0, e = !0;
					}
				}
				e === !0 && (X.updateMultisampleRenderTarget(i), X.updateRenderTargetMipmap(i));
			}
			R.setRenderTarget(s, c, u), R.setClearColor(H, U), f !== void 0 && (r.viewport = f), R.toneMapping = d;
		}
		function wt(e, t, n) {
			let r = t.isScene === !0 ? t.overrideMaterial : null;
			for (let i = 0, a = e.length; i < a; i++) {
				let a = e[i], { object: o, geometry: s, group: c } = a, l = a.material;
				l.allowOverride === !0 && r !== null && (l = r), o.layers.test(n.layers) && Tt(o, t, n, s, l, c);
			}
		}
		function Tt(e, t, n, r, i, a) {
			z !== null && i.isNodeMaterial && z.setObject(e, i), e.onBeforeRender(R, t, n, r, i, a), e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse, e.matrixWorld), e.normalMatrix.getNormalMatrix(e.modelViewMatrix), i.onBeforeRender(R, t, n, r, e, a), i.transparent === !0 && i.side === 2 && i.forceSinglePass === !1 ? (i.side = 1, i.needsUpdate = !0, R.renderBufferDirect(n, t, r, i, e, a), i.side = 0, i.needsUpdate = !0, R.renderBufferDirect(n, t, r, i, e, a), i.side = 2) : R.renderBufferDirect(n, t, r, i, e, a), e.onAfterRender(R, t, n, r, i, a);
		}
		function Et(e, t, n) {
			t.isScene !== !0 && (t = je);
			let r = Y.get(e), i = P.state.lights, a = P.state.shadowsArray, o = i.state.version, s = He.getParameters(e, i.state, a, t, n, P.state.lightProbeGridArray), c = He.getProgramCacheKey(s), l = r.programs;
			r.environment = e.isMeshStandardMaterial || e.isMeshLambertMaterial || e.isMeshPhongMaterial ? t.environment : null, r.fog = t.fog;
			let u = e.isMeshStandardMaterial || e.isMeshLambertMaterial && !e.envMap || e.isMeshPhongMaterial && !e.envMap;
			r.envMap = Re.get(e.envMap || r.environment, u), r.envMapRotation = r.environment !== null && e.envMap === null ? t.environmentRotation : e.envMapRotation, l === void 0 && (e.addEventListener("dispose", ft), l = /* @__PURE__ */ new Map(), r.programs = l);
			let d = l.get(c);
			if (d !== void 0) {
				if (r.currentProgram === d && r.lightsStateVersion === o) return Ot(e, s), d;
			} else s.uniforms = He.getUniforms(e), z !== null && e.isNodeMaterial && z.build(e, n, s), e.onBeforeCompile(s, R), d = He.acquireProgram(s, c), l.set(c, d), r.uniforms = s.uniforms;
			let f = r.uniforms;
			return (!e.isShaderMaterial && !e.isRawShaderMaterial || e.clipping === !0) && (f.clippingPlanes = qe.uniform), Ot(e, s), r.needsLights = Bt(e), r.lightsStateVersion = o, r.needsLights && (f.ambientLightColor.value = i.state.ambient, f.lightProbe.value = i.state.probe, f.sunLights.value = i.state.sun, f.sunLightShadows.value = i.state.sunShadow, f.directionalLights.value = i.state.directional, f.directionalLightShadows.value = i.state.directionalShadow, f.spotLights.value = i.state.spot, f.spotLightShadows.value = i.state.spotShadow, f.rectAreaLights.value = i.state.rectArea, f.ltc_1.value = i.state.rectAreaLTC1, f.ltc_2.value = i.state.rectAreaLTC2, f.pointLights.value = i.state.point, f.pointLightShadows.value = i.state.pointShadow, f.hemisphereLights.value = i.state.hemi, f.sunShadowMatrix.value = i.state.sunShadowMatrix, f.sunShadowCascade.value = i.state.sunShadowCascade, f.directionalShadowMatrix.value = i.state.directionalShadowMatrix, f.spotLightMatrix.value = i.state.spotLightMatrix, f.spotLightMap.value = i.state.spotLightMap, f.pointShadowMatrix.value = i.state.pointShadowMatrix), r.lightProbeGrid = P.state.lightProbeGridArray.length > 0, r.currentProgram = d, r.uniformsList = null, d;
		}
		function Dt(e) {
			if (e.uniformsList === null) {
				let t = e.currentProgram.getUniforms();
				e.uniformsList = Kn.seqWithValue(t.seq, e.uniforms);
			}
			return e.uniformsList;
		}
		function Ot(e, t) {
			let n = Y.get(e);
			n.outputColorSpace = t.outputColorSpace, n.batching = t.batching, n.batchingColor = t.batchingColor, n.instancing = t.instancing, n.instancingColor = t.instancingColor, n.instancingMorph = t.instancingMorph, n.skinning = t.skinning, n.morphTargets = t.morphTargets, n.morphNormals = t.morphNormals, n.morphColors = t.morphColors, n.morphTargetsCount = t.morphTargetsCount, n.numClippingPlanes = t.numClippingPlanes, n.numIntersection = t.numClipIntersection, n.vertexAlphas = t.vertexAlphas, n.vertexTangents = t.vertexTangents, n.toneMapping = t.toneMapping;
		}
		function kt(e, t) {
			if (e.length === 0) return null;
			if (e.length === 1) return e[0].texture === null ? null : e[0];
			A.setFromMatrixPosition(t.matrixWorld);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n.texture !== null && n.boundingBox.containsPoint(A)) return n;
			}
			return null;
		}
		function Lt(e, t, n, r, i) {
			t.isScene !== !0 && (t = je), X.resetTextureUnits();
			let a = t.fog, s = r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial ? t.environment : null, c = V === null ? R.outputColorSpace : V.isXRRenderTarget === !0 ? V.texture.colorSpace : o.workingColorSpace, l = r.isMeshStandardMaterial || r.isMeshLambertMaterial && !r.envMap || r.isMeshPhongMaterial && !r.envMap, u = Re.get(r.envMap || s, l), d = r.vertexColors === !0 && !!n.attributes.color && n.attributes.color.itemSize === 4, f = !!n.attributes.tangent && (!!r.normalMap || r.anisotropy > 0), p = !!n.morphAttributes.position, m = !!n.morphAttributes.normal, h = !!n.morphAttributes.color, g = 0;
			r.toneMapped && (V === null || V.isXRRenderTarget === !0) && (g = R.toneMapping);
			let _ = n.morphAttributes.position || n.morphAttributes.normal || n.morphAttributes.color, v = _ === void 0 ? 0 : _.length, y = Y.get(r), b = P.state.lights;
			if (we === !0 && (Ee === !0 || e !== fe)) {
				let t = e === fe && r.id === de;
				qe.setState(r, e, t);
			}
			let x = !1;
			r.version === y.__version ? y.needsLights && y.lightsStateVersion !== b.state.version ? x = !0 : y.outputColorSpace === c ? i.isBatchedMesh && y.batching === !1 || !i.isBatchedMesh && y.batching === !0 || i.isBatchedMesh && y.batchingColor === !0 && i._colorsTexture === null || i.isBatchedMesh && y.batchingColor === !1 && i._colorsTexture !== null || i.isInstancedMesh && y.instancing === !1 || !i.isInstancedMesh && y.instancing === !0 || i.isSkinnedMesh && y.skinning === !1 || !i.isSkinnedMesh && y.skinning === !0 || i.isInstancedMesh && y.instancingColor === !0 && i.instanceColor === null || i.isInstancedMesh && y.instancingColor === !1 && i.instanceColor !== null || i.isInstancedMesh && y.instancingMorph === !0 && i.morphTexture === null || i.isInstancedMesh && y.instancingMorph === !1 && i.morphTexture !== null ? x = !0 : y.envMap === u ? r.fog === !0 && y.fog !== a || y.numClippingPlanes !== void 0 && (y.numClippingPlanes !== qe.numPlanes || y.numIntersection !== qe.numIntersection) ? x = !0 : y.vertexAlphas === d && y.vertexTangents === f && y.morphTargets === p && y.morphNormals === m && y.morphColors === h && y.toneMapping === g && y.morphTargetsCount === v ? !!y.lightProbeGrid != P.state.lightProbeGridArray.length > 0 && (x = !0) : x = !0 : x = !0 : x = !0 : (x = !0, y.__version = r.version);
			let S = y.currentProgram;
			x === !0 && (S = Et(r, t, i), z && r.isNodeMaterial && z.onUpdateProgram(r, S, y));
			let C = !1, w = !1, T = !1, E = S.getUniforms(), D = y.uniforms;
			if (J.useProgram(S.program) && (C = !0, w = !0, T = !0), r.id !== de && (de = r.id, w = !0), y.needsLights) {
				let e = kt(P.state.lightProbeGridArray, i);
				y.lightProbeGrid !== e && (y.lightProbeGrid = e, w = !0);
			}
			if (C || fe !== e) {
				J.buffers.depth.getReversed() && e.reversedDepth !== !0 && (e._reversedDepth = !0, e.updateProjectionMatrix()), E.setValue(K, "projectionMatrix", e.projectionMatrix), E.setValue(K, "viewMatrix", e.matrixWorldInverse);
				let t = E.map.cameraPosition;
				t !== void 0 && t.setValue(K, ke.setFromMatrixPosition(e.matrixWorld)), q.logarithmicDepthBuffer && E.setValue(K, "logDepthBufFC", 2 / (Math.log(e.far + 1) / Math.LN2)), (r.isMeshPhongMaterial || r.isMeshToonMaterial || r.isMeshLambertMaterial || r.isMeshBasicMaterial || r.isMeshStandardMaterial || r.isShaderMaterial) && E.setValue(K, "isOrthographic", e.isOrthographicCamera === !0), fe !== e && (fe = e, w = !0, T = !0);
			}
			if (y.needsLights && (b.state.sunShadowMap.length > 0 && E.setValue(K, "sunShadowMap", b.state.sunShadowMap, X), b.state.directionalShadowMap.length > 0 && E.setValue(K, "directionalShadowMap", b.state.directionalShadowMap, X), b.state.spotShadowMap.length > 0 && E.setValue(K, "spotShadowMap", b.state.spotShadowMap, X), b.state.pointShadowMap.length > 0 && E.setValue(K, "pointShadowMap", b.state.pointShadowMap, X)), i.isSkinnedMesh) {
				E.setOptional(K, i, "bindMatrix"), E.setOptional(K, i, "bindMatrixInverse");
				let e = i.skeleton;
				e && (e.boneTexture === null && e.computeBoneTexture(), E.setValue(K, "boneTexture", e.boneTexture, X));
			}
			i.isBatchedMesh && (E.setOptional(K, i, "batchingTexture"), E.setValue(K, "batchingTexture", i._matricesTexture, X), E.setOptional(K, i, "batchingIdTexture"), E.setValue(K, "batchingIdTexture", i._indirectTexture, X), E.setOptional(K, i, "batchingColorTexture"), i._colorsTexture !== null && E.setValue(K, "batchingColorTexture", i._colorsTexture, X));
			let O = n.morphAttributes;
			if ((O.position !== void 0 || O.normal !== void 0 || O.color !== void 0) && Ze.update(i, n, S), (w || y.receiveShadow !== i.receiveShadow) && (y.receiveShadow = i.receiveShadow, E.setValue(K, "receiveShadow", i.receiveShadow)), (r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial) && r.envMap === null && t.environment !== null && (D.envMapIntensity.value = t.environmentIntensity), D.dfgLUT !== void 0 && (D.dfgLUT.value = pi()), w) {
				if (E.setValue(K, "toneMappingExposure", R.toneMappingExposure), y.needsLights && zt(D, T), a && r.fog === !0 && Ue.refreshFogUniforms(D, a), Ue.refreshMaterialUniforms(D, r, _e, W, P.state.transmissionRenderTarget[e.id]), y.needsLights && y.lightProbeGrid) {
					let e = y.lightProbeGrid;
					D.probesSH.value = e.texture, D.probesMin.value.copy(e.boundingBox.min), D.probesMax.value.copy(e.boundingBox.max), D.probesResolution.value.copy(e.resolution);
				}
				Kn.upload(K, Dt(y), D, X);
			}
			if (r.isShaderMaterial && r.uniformsNeedUpdate === !0 && (Kn.upload(K, Dt(y), D, X), r.uniformsNeedUpdate = !1), r.isSpriteMaterial && E.setValue(K, "center", i.center), E.setValue(K, "modelViewMatrix", i.modelViewMatrix), E.setValue(K, "normalMatrix", i.normalMatrix), E.setValue(K, "modelMatrix", i.matrixWorld), r.uniformsGroups !== void 0) {
				let e = r.uniformsGroups;
				for (let t = 0, n = e.length; t < n; t++) {
					let n = e[t];
					nt.update(n, S), nt.bind(n, S);
				}
			}
			return S;
		}
		function zt(e, t) {
			e.ambientLightColor.needsUpdate = t, e.lightProbe.needsUpdate = t, e.sunLights.needsUpdate = t, e.sunLightShadows.needsUpdate = t, e.directionalLights.needsUpdate = t, e.directionalLightShadows.needsUpdate = t, e.pointLights.needsUpdate = t, e.pointLightShadows.needsUpdate = t, e.spotLights.needsUpdate = t, e.spotLightShadows.needsUpdate = t, e.rectAreaLights.needsUpdate = t, e.hemisphereLights.needsUpdate = t;
		}
		function Bt(e) {
			return e.isMeshLambertMaterial || e.isMeshToonMaterial || e.isMeshPhongMaterial || e.isMeshStandardMaterial || e.isShadowMaterial || e.isShaderMaterial && e.lights === !0;
		}
		this.getActiveCubeFace = function() {
			return ce;
		}, this.getActiveMipmapLevel = function() {
			return le;
		}, this.getRenderTarget = function() {
			return V;
		}, this.setRenderTargetTextures = function(e, t, n) {
			let r = Y.get(e);
			r.__autoAllocateDepthBuffer = e.resolveDepthBuffer === !1, r.__autoAllocateDepthBuffer === !1 && (r.__useRenderToTexture = !1), Y.get(e.texture).__webglTexture = t, Y.get(e.depthTexture).__webglTexture = r.__autoAllocateDepthBuffer ? void 0 : n, r.__hasExternalTextures = !0;
		}, this.setRenderTargetFramebuffer = function(e, t) {
			let n = Y.get(e);
			n.__webglFramebuffer = t, n.__useDefaultFramebuffer = t === void 0;
		}, this.setRenderTarget = function(e, t = 0, n = 0) {
			V = e, ce = t, le = n;
			let r = null, i = !1, a = !1;
			if (e) {
				let o = Y.get(e);
				if (o.__useDefaultFramebuffer !== void 0) {
					J.bindFramebuffer(K.FRAMEBUFFER, o.__webglFramebuffer), pe.copy(e.viewport), me.copy(e.scissor), he = e.scissorTest, J.viewport(pe), J.scissor(me), J.setScissorTest(he), de = -1;
					return;
				}
				if (o.__webglFramebuffer === void 0) X.setupRenderTarget(e);
				else if (o.__hasExternalTextures) X.rebindTextures(e, Y.get(e.texture).__webglTexture, Y.get(e.depthTexture).__webglTexture);
				else if (e.depthBuffer) {
					let t = e.depthTexture;
					if (o.__boundDepthTexture !== t) {
						if (t !== null && Y.has(t) && (e.width !== t.image.width || e.height !== t.image.height)) throw Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");
						X.setupDepthRenderbuffer(e);
					}
				}
				let s = e.texture;
				(s.isData3DTexture || s.isDataArrayTexture || s.isCompressedArrayTexture) && (a = !0);
				let c = Y.get(e).__webglFramebuffer;
				e.isWebGLCubeRenderTarget ? (r = Array.isArray(c[t]) ? c[t][n] : c[t], i = !0) : r = e.samples > 0 && X.useMultisampledRTT(e) === !1 ? Y.get(e).__webglMultisampledFramebuffer : Array.isArray(c) ? c[n] : c, pe.copy(e.viewport), me.copy(e.scissor), he = e.scissorTest;
			} else pe.copy(be).multiplyScalar(_e).floor(), me.copy(xe).multiplyScalar(_e).floor(), he = Se;
			if (n !== 0 && (r = oe), J.bindFramebuffer(K.FRAMEBUFFER, r) && J.drawBuffers(e, r), J.viewport(pe), J.scissor(me), J.setScissorTest(he), i) {
				let r = Y.get(e.texture);
				K.framebufferTexture2D(K.FRAMEBUFFER, K.COLOR_ATTACHMENT0, K.TEXTURE_CUBE_MAP_POSITIVE_X + t, r.__webglTexture, n);
			} else if (a) {
				let r = t;
				for (let t = 0; t < e.textures.length; t++) {
					let i = Y.get(e.textures[t]);
					K.framebufferTextureLayer(K.FRAMEBUFFER, K.COLOR_ATTACHMENT0 + t, i.__webglTexture, n, r);
				}
			} else if (e !== null && n !== 0) {
				let t = Y.get(e.texture);
				K.framebufferTexture2D(K.FRAMEBUFFER, K.COLOR_ATTACHMENT0, K.TEXTURE_2D, t.__webglTexture, n);
			}
			de = -1;
		};
		function Vt(e) {
			let t = Y.get(e);
			return (t.__readFormat !== e.format || t.__readType !== e.type) && (t.__readFormat = e.format, t.__readType = e.type, t.__formatReadable = q.textureFormatReadable(e.format), t.__typeReadable = q.textureTypeReadable(e.type)), t;
		}
		this.readRenderTargetPixels = function(e, t, n, r, i, a, o, s = 0) {
			if (!(e && e.isWebGLRenderTarget)) {
				x("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
				return;
			}
			let c = Y.get(e).__webglFramebuffer;
			if (e.isWebGLCubeRenderTarget && o !== void 0 && (c = c[o]), c) {
				J.bindFramebuffer(K.FRAMEBUFFER, c);
				try {
					let o = e.textures[s], c = o.format, l = o.type;
					e.textures.length > 1 && K.readBuffer(K.COLOR_ATTACHMENT0 + s);
					let u = Vt(o);
					if (u.__formatReadable === !1) {
						x("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
						return;
					}
					if (u.__typeReadable === !1) {
						x("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
						return;
					}
					t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i && K.readPixels(t, n, r, i, et.convert(c), et.convert(l), a);
				} finally {
					let e = V === null ? null : Y.get(V).__webglFramebuffer;
					J.bindFramebuffer(K.FRAMEBUFFER, e);
				}
			}
		}, this.readRenderTargetPixelsAsync = async function(e, t, n, r, i, a, o, s = 0) {
			if (!(e && e.isWebGLRenderTarget)) throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
			let c = Y.get(e).__webglFramebuffer;
			if (e.isWebGLCubeRenderTarget && o !== void 0 && (c = c[o]), c) {
				if (t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i) {
					J.bindFramebuffer(K.FRAMEBUFFER, c);
					let o = e.textures[s], l = o.format, u = o.type;
					e.textures.length > 1 && K.readBuffer(K.COLOR_ATTACHMENT0 + s);
					let d = Vt(o);
					if (d.__formatReadable === !1) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
					if (d.__typeReadable === !1) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
					let f = K.createBuffer();
					K.bindBuffer(K.PIXEL_PACK_BUFFER, f), K.bufferData(K.PIXEL_PACK_BUFFER, a.byteLength, K.STREAM_READ), K.readPixels(t, n, r, i, et.convert(l), et.convert(u), 0), K.bindBuffer(K.PIXEL_PACK_BUFFER, null);
					let p = V === null ? null : Y.get(V).__webglFramebuffer;
					J.bindFramebuffer(K.FRAMEBUFFER, p);
					let m = K.fenceSync(K.SYNC_GPU_COMMANDS_COMPLETE, 0);
					return K.flush(), await h(K, m, 4), K.bindBuffer(K.PIXEL_PACK_BUFFER, f), K.getBufferSubData(K.PIXEL_PACK_BUFFER, 0, a), K.bindBuffer(K.PIXEL_PACK_BUFFER, null), K.deleteBuffer(f), K.deleteSync(m), a;
				}
				throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
			}
		}, this.copyFramebufferToTexture = function(e, t = null, n = 0) {
			let r = 2 ** -n, i = Math.floor(e.image.width * r), a = Math.floor(e.image.height * r), o = t === null ? 0 : t.x, s = t === null ? 0 : t.y;
			X.setTexture2D(e, 0), K.copyTexSubImage2D(K.TEXTURE_2D, n, 0, 0, o, s, i, a), J.unbindTexture();
		}, this.copyTextureToTexture = function(e, t, n = null, r = null, i = 0, a = 0) {
			let o, s, c, l, u, d, f, p, m, h = e.isCompressedTexture ? e.mipmaps[a] : e.image;
			if (n !== null) o = n.max.x - n.min.x, s = n.max.y - n.min.y, c = n.isBox3 ? n.max.z - n.min.z : 1, l = n.min.x, u = n.min.y, d = n.isBox3 ? n.min.z : 0;
			else {
				let t = 2 ** -i;
				o = Math.floor(h.width * t), s = Math.floor(h.height * t), c = e.isDataArrayTexture ? h.depth : e.isData3DTexture ? Math.floor(h.depth * t) : 1, l = 0, u = 0, d = 0;
			}
			r === null ? (f = 0, p = 0, m = 0) : (f = r.x, p = r.y, m = r.z);
			let g = et.convert(t.format), _ = et.convert(t.type), v;
			t.isData3DTexture ? (X.setTexture3D(t, 0), v = K.TEXTURE_3D) : t.isDataArrayTexture || t.isCompressedArrayTexture ? (X.setTexture2DArray(t, 0), v = K.TEXTURE_2D_ARRAY) : (X.setTexture2D(t, 0), v = K.TEXTURE_2D), J.activeTexture(K.TEXTURE0), J.pixelStorei(K.UNPACK_FLIP_Y_WEBGL, t.flipY), J.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t.premultiplyAlpha), J.pixelStorei(K.UNPACK_ALIGNMENT, t.unpackAlignment);
			let y = J.getParameter(K.UNPACK_ROW_LENGTH), b = J.getParameter(K.UNPACK_IMAGE_HEIGHT), x = J.getParameter(K.UNPACK_SKIP_PIXELS), S = J.getParameter(K.UNPACK_SKIP_ROWS), C = J.getParameter(K.UNPACK_SKIP_IMAGES);
			J.pixelStorei(K.UNPACK_ROW_LENGTH, h.width), J.pixelStorei(K.UNPACK_IMAGE_HEIGHT, h.height), J.pixelStorei(K.UNPACK_SKIP_PIXELS, l), J.pixelStorei(K.UNPACK_SKIP_ROWS, u), J.pixelStorei(K.UNPACK_SKIP_IMAGES, d);
			let w = e.isDataArrayTexture || e.isData3DTexture, T = t.isDataArrayTexture || t.isData3DTexture;
			if (e.isDepthTexture) {
				let n = Y.get(e), r = Y.get(t), h = Y.get(n.__renderTarget), g = Y.get(r.__renderTarget);
				J.bindFramebuffer(K.READ_FRAMEBUFFER, h.__webglFramebuffer), J.bindFramebuffer(K.DRAW_FRAMEBUFFER, g.__webglFramebuffer);
				for (let n = 0; n < c; n++) w && (K.framebufferTextureLayer(K.READ_FRAMEBUFFER, K.COLOR_ATTACHMENT0, Y.get(e).__webglTexture, i, d + n), K.framebufferTextureLayer(K.DRAW_FRAMEBUFFER, K.COLOR_ATTACHMENT0, Y.get(t).__webglTexture, a, m + n)), K.blitFramebuffer(l, u, o, s, f, p, o, s, K.DEPTH_BUFFER_BIT, K.NEAREST);
				J.bindFramebuffer(K.READ_FRAMEBUFFER, null), J.bindFramebuffer(K.DRAW_FRAMEBUFFER, null);
			} else if (i !== 0 || e.isRenderTargetTexture || Y.has(e)) {
				let n = Y.get(e), r = Y.get(t);
				J.bindFramebuffer(K.READ_FRAMEBUFFER, B), J.bindFramebuffer(K.DRAW_FRAMEBUFFER, se);
				for (let e = 0; e < c; e++) w ? K.framebufferTextureLayer(K.READ_FRAMEBUFFER, K.COLOR_ATTACHMENT0, n.__webglTexture, i, d + e) : K.framebufferTexture2D(K.READ_FRAMEBUFFER, K.COLOR_ATTACHMENT0, K.TEXTURE_2D, n.__webglTexture, i), T ? K.framebufferTextureLayer(K.DRAW_FRAMEBUFFER, K.COLOR_ATTACHMENT0, r.__webglTexture, a, m + e) : K.framebufferTexture2D(K.DRAW_FRAMEBUFFER, K.COLOR_ATTACHMENT0, K.TEXTURE_2D, r.__webglTexture, a), i === 0 ? T ? K.copyTexSubImage3D(v, a, f, p, m + e, l, u, o, s) : K.copyTexSubImage2D(v, a, f, p, l, u, o, s) : K.blitFramebuffer(l, u, o, s, f, p, o, s, K.COLOR_BUFFER_BIT, K.NEAREST);
				J.bindFramebuffer(K.READ_FRAMEBUFFER, null), J.bindFramebuffer(K.DRAW_FRAMEBUFFER, null);
			} else T ? e.isDataTexture || e.isData3DTexture ? K.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h.data) : t.isCompressedArrayTexture ? K.compressedTexSubImage3D(v, a, f, p, m, o, s, c, g, h.data) : K.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h) : e.isDataTexture ? K.texSubImage2D(K.TEXTURE_2D, a, f, p, o, s, g, _, h.data) : e.isCompressedTexture ? K.compressedTexSubImage2D(K.TEXTURE_2D, a, f, p, h.width, h.height, g, h.data) : K.texSubImage2D(K.TEXTURE_2D, a, f, p, o, s, g, _, h);
			J.pixelStorei(K.UNPACK_ROW_LENGTH, y), J.pixelStorei(K.UNPACK_IMAGE_HEIGHT, b), J.pixelStorei(K.UNPACK_SKIP_PIXELS, x), J.pixelStorei(K.UNPACK_SKIP_ROWS, S), J.pixelStorei(K.UNPACK_SKIP_IMAGES, C), a === 0 && t.generateMipmaps && K.generateMipmap(v), J.unbindTexture();
		}, this.initRenderTarget = function(e) {
			Y.get(e).__webglFramebuffer === void 0 && X.setupRenderTarget(e);
		}, this.initTexture = function(e) {
			e.isCubeTexture ? X.setTextureCube(e, 0) : e.isData3DTexture ? X.setTexture3D(e, 0) : e.isDataArrayTexture || e.isCompressedArrayTexture ? X.setTexture2DArray(e, 0) : X.setTexture2D(e, 0), J.unbindTexture();
		}, this.resetState = function() {
			ce = 0, le = 0, V = null, J.reset(), tt.reset();
		}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
	}
	get coordinateSystem() {
		return Te;
	}
	get outputColorSpace() {
		return this._outputColorSpace;
	}
	set outputColorSpace(e) {
		this._outputColorSpace = e;
		let t = this.getContext();
		t.drawingBufferColorSpace = o._getDrawingBufferColorSpace(e), t.unpackColorSpace = o._getUnpackColorSpace();
	}
};
// src/lib/noise.ts
function hi(e) {
	let t = e >>> 0;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
// src/field/BrushField.ts
var gi = {
	frequency: 1.1,
	damping: .5,
	contactFrequency: 6,
	contactDamping: .8,
	radius: .27,
	part: .82,
	comb: .24,
	press: .55,
	maxBend: .94
}, _i = 1 / 120, vi = 1e-5, yi = class {
	width;
	height;
	disp;
	vel;
	pos;
	nrm;
	jitter;
	tuning;
	accumulator = 0;
	energy = 0;
	awake = !1;
	constructor(e, t, n, r, i = gi, a = 7) {
		if (n.length !== e * t * 3 || r.length !== e * t * 3) throw Error(`BrushField: expected ${e * t * 3} floats, got ${n.length}/${r.length}`);
		this.width = e, this.height = t, this.pos = n, this.nrm = r, this.disp = new Float32Array(e * t * 4), this.vel = new Float32Array(e * t * 4), this.jitter = new Float32Array(e * t);
		let o = hi(a);
		for (let e = 0; e < this.jitter.length; e++) this.jitter[e] = .84 + .32 * o();
		this.tuning = { ...i };
	}
	setTuning(e) {
		this.tuning = {
			...this.tuning,
			...e
		};
	}
	getTuning() {
		return { ...this.tuning };
	}
	isAwake() {
		return this.awake;
	}
	totalEnergy() {
		return this.energy;
	}
	step(e, t) {
		let n = t !== null && t.strength > .001;
		if (!n && !this.awake) return !1;
		this.accumulator = Math.min(this.accumulator + e, .1);
		let r = !1;
		for (; this.accumulator >= _i;) this.substep(_i, n ? t : null), this.accumulator -= _i, r = !0;
		return r;
	}
	substep(e, t) {
		let n = this.tuning, r = 2 * Math.PI * n.frequency, i = 2 * Math.PI * n.contactFrequency, a = i * i, o = 2 * n.contactDamping * i, s = n.radius * n.radius, { disp: c, vel: l, pos: u, nrm: d, jitter: f } = this, p = 0, m = this.width * this.height;
		for (let i = 0; i < m; i++) {
			let m = i * 3, h = i * 4, g = d[m], _ = d[m + 1], v = d[m + 2], y = 0, b = 0, x = 0, S = 0, C = 0;
			if (t) {
				let e = u[m] - t.x, r = u[m + 1] - t.y, i = u[m + 2] - t.z, a = e * e + r * r + i * i;
				if (a < s) {
					let o = e * g + r * _ + i * v, s = 1 - Math.min(1, Math.max(0, (o / n.radius - .2) / .25)), c = 1 - Math.sqrt(a) / n.radius;
					C = c * c * (3 - 2 * c) * t.strength * s;
					let l = e - g * o, u = r - _ * o, d = i - v * o, f = Math.sqrt(l * l + u * u + d * d);
					f > 1e-6 && (l /= f, u /= f, d /= f);
					let p = Math.min(1, f / (n.radius * .4)), m = n.part * p, h = t.vx * g + t.vy * _ + t.vz * v, w = (t.vx - g * h) * n.comb, T = (t.vy - _ * h) * n.comb, E = (t.vz - v * h) * n.comb;
					y = l * m + w, b = u * m + T, x = d * m + E, S = n.press * (.35 + .65 * (1 - p));
				}
			}
			if (C === 0 && Math.abs(c[h]) + Math.abs(c[h + 1]) + Math.abs(c[h + 2]) + Math.abs(c[h + 3]) + Math.abs(l[h]) + Math.abs(l[h + 1]) + Math.abs(l[h + 2]) + Math.abs(l[h + 3]) === 0) continue;
			let w = r * f[i], T = w * w, E = 2 * n.damping * w, D = a * C, O = o * C, k = l[h] + (-T * c[h] + D * (y - c[h]) - (E + O) * l[h]) * e, A = l[h + 1] + (-T * c[h + 1] + D * (b - c[h + 1]) - (E + O) * l[h + 1]) * e, ee = l[h + 2] + (-T * c[h + 2] + D * (x - c[h + 2]) - (E + O) * l[h + 2]) * e, j = l[h + 3] + (-T * 1.3 * c[h + 3] + D * (S - c[h + 3]) - (E * 1.25 + O) * l[h + 3]) * e, M = c[h] + k * e, N = c[h + 1] + A * e, te = c[h + 2] + ee * e, P = M * g + N * _ + te * v;
			M -= g * P, N -= _ * P, te -= v * P;
			let ne = Math.sqrt(M * M + N * N + te * te);
			if (ne > n.maxBend) {
				let e = n.maxBend / ne;
				M *= e, N *= e, te *= e;
				let t = (k * M + A * N + ee * te) / n.maxBend;
				t > 0 && (k -= M / n.maxBend * t, A -= N / n.maxBend * t, ee -= te / n.maxBend * t);
			}
			let re = Math.min(.75, Math.max(-.25, c[h + 3] + j * e));
			c[h] = M, c[h + 1] = N, c[h + 2] = te, c[h + 3] = re, l[h] = k, l[h + 1] = A, l[h + 2] = ee, l[h + 3] = j, p += M * M + N * N + te * te + re * re + (k * k + A * A + ee * ee + j * j) * .01;
		}
		this.energy = p, this.awake = t !== null || p > vi, this.awake || (c.fill(0), l.fill(0), this.energy = 0);
	}
	bendAt(e, t) {
		let n = (t * this.width + e) * 4;
		return Math.hypot(this.disp[n], this.disp[n + 1], this.disp[n + 2]);
	}
	flattenAt(e, t) {
		return this.disp[(t * this.width + e) * 4 + 3];
	}
}, bi = "\nvarying vec2 vUv;\nvoid main() {\n  vUv = position.xy * 0.5 + 0.5;\n  gl_Position = vec4(position.xy, 0.0, 1.0);\n}\n", xi = "\nuniform sampler2D uScene;\nuniform vec2 uRes;           // device px\nuniform float uDpr;\nuniform vec4 uPanel;         // centre x, y (device px, y up), half w, half h\nuniform float uRadius;       // device px\nuniform float uGlass;        // 0..1 formation of the glass during the load-in\nuniform vec2 uLight;         // pointer-tilted light direction in the panel plane\nuniform float uExposure;\nuniform float uTime;\nuniform vec2 uGlassMat;      // milk, frost scale\nvarying vec2 vUv;\n\nvec3 tonemap(vec3 x) {\n  // gentle filmic shoulder: near-identity through the mids, soft roll into white\n  // identity through the paper's values, then an exponential shoulder into white\n  x *= uExposure;\n  vec3 k = vec3(0.86);\n  vec3 over = max(x - k, 0.0);\n  return min(x, k) + (1.0 - k) * (1.0 - exp(-over / (1.0 - k)));\n}\nvec3 toSrgb(vec3 c) {\n  c = clamp(c, 0.0, 1.0);\n  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));\n}\nfloat hash(vec2 p) {\n  vec3 p3 = fract(vec3(p.xyx) * 0.1031);\n  p3 += dot(p3, p3.yzx + 33.33);\n  return fract((p3.x + p3.y) * p3.z);\n}\nvec3 scene(vec2 px) {\n  return tonemap(texture2D(uScene, clamp(px / uRes, vec2(0.0), vec2(1.0))).rgb);\n}\nvec3 frost(vec2 px, float r) {\n  vec3 acc = scene(px) * 0.16;\n  float w = 0.16;\n  for (int k = 0; k < 14; k++) {\n    float fk = float(k);\n    float a = fk * 2.39996 + 0.7;\n    vec2 o = vec2(cos(a), sin(a)) * r * sqrt((fk + 0.5) / 14.0);\n    acc += scene(px + o);\n    w += 1.0;\n  }\n  return acc / w;\n}\nfloat gauss(float z) { return exp(-z * z); }\nvec3 screenB(vec3 a, vec3 b) { return 1.0 - (1.0 - a) * (1.0 - b); }\n\nfloat sdRR(vec2 p, vec2 h, float r) {\n  vec2 q = abs(p) - (h - r);\n  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;\n}\nvec2 outwardRR(vec2 p, vec2 h, float r) {\n  vec2 q = abs(p) - (h - r);\n  vec2 n = (q.x > 0.0 && q.y > 0.0) ? normalize(q) : (q.x > q.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0));\n  return n * sign(p + 1e-6);\n}\n\nvoid main() {\n  vec2 px = gl_FragCoord.xy;\n  vec3 base = scene(px);\n  vec3 col = base;\n\n  if (uGlass > 0.001) {\n    float form = uGlass;\n    // the slab settles from slightly smaller as it forms\n    vec2 h = uPanel.zw * (0.965 + 0.035 * form);\n    vec2 lp = px - uPanel.xy;\n    float r = min(uRadius, min(h.x, h.y));\n    float sd = sdRR(lp, h, r);\n    float aa = 0.75;\n    float inside = 1.0 - smoothstep(-aa, aa, sd);\n    vec2 outward = outwardRR(lp, h, r);\n\n    // soft shadow onto the paper, offset away from the light\n    if (sd > -2.0) {\n      vec2 so = lp + vec2(-uLight.x, -uLight.y) * 10.0 * uDpr + vec2(0.0, 14.0 * uDpr);\n      float ssd = sdRR(so, h, r);\n      float sh = exp(-max(ssd, 0.0) / (26.0 * uDpr)) * 0.07 + exp(-max(sd, 0.0) / (2.5 * uDpr)) * 0.04;\n      col *= 1.0 - sh * form * (1.0 - inside);\n      // light focused through the slab lands as a soft bright line just inside its shadow\n      float caus = gauss((ssd + 7.0 * uDpr) / (5.0 * uDpr)) * smoothstep(0.0, 12.0 * uDpr, sd);\n      col += vec3(1.0, 0.97, 0.88) * caus * 0.035 * form;\n    }\n\n    if (inside > 0.0) {\n      float bevel = 15.0 * uDpr;\n      float thick = 16.0 * uDpr * form;\n      float depth = max(-sd, 0.0);\n      float t = clamp(depth / bevel, 0.0, 1.0);\n      float om = 1.0 - t;\n      float om4 = om * om * om * om;\n      float hgt = pow(max(1.0 - om4, 0.0), 0.25);\n      float slope = min(om * om * om * pow(max(1.0 - om4, 1e-4), -0.75), 6.0);\n      vec3 n3 = normalize(vec3(outward * slope * thick / bevel, 1.0));\n      vec3 rr = refract(vec3(0.0, 0.0, -1.0), n3, 1.0 / 1.5);\n      vec2 disp = rr.xy / max(-rr.z, 0.25) * thick * (0.35 + 0.65 * hgt);\n      float frostR = (3.0 + 6.0 * om) * uDpr * form * uGlassMat.y;\n      vec3 refr;\n      refr.r = frost(px + disp * 0.86, frostR).r;\n      refr.g = frost(px + disp, frostR).g;\n      refr.b = frost(px + disp * 1.16, frostR).b;\n\n      // reflected surroundings in the thick wall\n      vec3 refl = scene(px - outward * bevel * (0.4 + 1.6 * om));\n      float fres = pow(max(1.0 - n3.z, 0.0), 1.6);\n      refr = mix(refr, screenB(refr, refl * 0.5), clamp(fres * 1.1, 0.0, 0.7));\n\n      // body: clear, a breath brighter than the paper (it gathers light)\n      refr = mix(refr, vec3(0.99, 0.985, 0.97), uGlassMat.x);\n      // the thick edge of real glass is faintly celadon: light travels further through it\n      vec3 celadon = vec3(0.80, 0.90, 0.84);\n      refr *= mix(vec3(1.0), celadon, om * om * 0.38);\n\n      vec2 L = normalize(uLight);\n      float facing = dot(outward, L);\n      // milky rim, brighter on the lit side\n      float band = 1.0 - smoothstep(0.0, 0.5, t);\n      float lit = 0.3 + 0.7 * pow(max(facing * 0.5 + 0.5, 0.0), 1.4);\n      refr = screenB(refr, vec3(1.0, 0.995, 0.985) * band * band * lit * 0.12);\n      // narrow studio-light streak along the lit upper wall\n      float topness = smoothstep(0.05, 0.85, outward.y * 0.8 + facing * 0.4);\n      float streak = gauss((t - 0.2) / 0.07) * topness;\n      // lit-corner glint and a lower secondary reflection\n      float glint = gauss((t - 0.11) / 0.05) * pow(max(dot(outward, L), 0.0), 24.0);\n      float lowG = gauss((t - 0.24) / 0.12) * smoothstep(0.2, 0.9, -outward.y) * 0.22;\n      // light focused through the slab pools on the far rim\n      vec3 caustic = vec3(1.0, 0.97, 0.86) * fres * max(-facing, 0.0) * 0.16;\n      // a faint internal sweep that drifts with the light\n      float sweep = gauss((dot(lp / h, vec2(0.6, 0.8)) - 0.35 - uLight.x * 0.25) / 0.16) * hgt * 0.035;\n      refr += vec3(streak * 0.42 + glint * 0.6 + lowG * 0.6 + sweep) + caustic;\n      // shaded side of the wall darkens slightly so the slab has volume\n      refr *= 1.0 - fres * max(-facing, 0.0) * 0.05;\n      // the crisp manufactured hairline\n      float line = gauss((sd + 0.6 * uDpr) / (0.8 * uDpr));\n      refr += vec3(line * (0.10 + 0.5 * max(facing, 0.0)));\n      // the shaded lower wall reads as a fine darker line, giving the slab its thickness\n      refr *= 1.0 - gauss((t - 0.05) / 0.06) * max(-facing, 0.0) * 0.07;\n\n      col = mix(col, refr, inside * smoothstep(0.0, 0.6, form));\n    }\n  }\n\n  // paper grain + dither (display space)\n  vec3 outc = toSrgb(col);\n  float g = hash(px + fract(uTime * 7.0) * 113.0) - 0.5;\n  outc += g * (1.6 / 255.0) + (hash(px * 0.5) - 0.5) * (2.2 / 255.0);\n  gl_FragColor = vec4(outc, 1.0);\n}\n", Si = 1 / 240;
function Ci(e = 0) {
	return {
		value: e,
		velocity: 0,
		target: e
	};
}
function wi(e, t, n) {
	let r = 2 * Math.PI * t.frequency, i = r * r, a = 2 * t.damping * r, { value: o, velocity: s } = e, c = Math.max(0, Math.min(n, .1));
	for (; c > 1e-9;) {
		let t = Math.min(Si, c);
		s += (-i * (o - e.target) - a * s) * t, o += s * t, c -= t;
	}
	return {
		value: o,
		velocity: s,
		target: e.target
	};
}
function Ti(e, t, n, r) {
	return t + (e - t) * n ** +r;
}
// src/world/CameraRig.ts
var Ei = .945 ** 60, Di = class {
	camera;
	pivot = new i();
	inner = new i();
	scene;
	smooth = {
		x: 0,
		y: 0
	};
	fit = 1;
	target = new G();
	base = new G();
	constructor(e) {
		this.scene = e;
		let t = e.camera;
		this.camera = new ke(t.fov, 1, .05, 80), this.target.set(...t.target), this.base.set(...t.position), this.pivot.position.copy(this.target), this.inner.position.copy(this.target).multiplyScalar(-1), this.pivot.add(this.inner);
	}
	update(e, t, n, r, i, a) {
		let o = this.scene.camera, s = a ? 0 : n.x, c = a ? 0 : n.y;
		this.smooth.x = Ti(this.smooth.x, s, Ei, e), this.smooth.y = Ti(this.smooth.y, c, Ei, e);
		let l = this.smooth.x, u = this.smooth.y, d = this.fit = i < 1 ? 1 + (1 - i) * o.portrait.pullBack : i < 1.4 ? 1 + (1.4 - i) * .25 : 1, f = this.base.clone().sub(this.target).multiplyScalar(d);
		f.setLength(f.length() + r);
		let p = this.camera;
		p.aspect = i, p.position.copy(this.target).add(f);
		let m = -l * .137 * (o.orbit[0] / .05), h = u * .084 * (o.orbit[1] / .03);
		p.position.x += m, p.position.y += h, p.lookAt(this.target.x + m * .42, this.target.y + h * .42, this.target.z), this.pivot.rotation.y = a ? 0 : l * o.orbit[0] * 1.1, this.pivot.rotation.x = a ? 0 : u * o.orbit[1] * .87, this.pivot.rotation.z = a ? 0 : Math.sin(t * .22) * .0022, p.updateProjectionMatrix();
		let g = i > 1.05 ? o.shiftX * Math.min(1, (i - 1.05) / .5) : 0, _ = i < 1 ? o.portrait.lift * Math.min(1, (1 - i) / .45) : 0;
		p.projectionMatrix.elements[8] = -g, p.projectionMatrix.elements[9] = -_, p.projectionMatrixInverse.copy(p.projectionMatrix).invert(), p.updateMatrixWorld();
	}
	pixelWorld(e) {
		let t = this.camera.position.distanceTo(this.target);
		return 2 * Math.tan(this.camera.fov * Math.PI / 360) * t / Math.max(1, e);
	}
}, Oi = 5.4, ki = [
	1.6,
	2.9,
	1.7
], Ai = (e) => e < 0 ? 0 : e > 1 ? 1 : e, ji = (e, t, n) => {
	let r = Ai((n - e) / (t - e));
	return r * r * (3 - 2 * r);
}, Mi = (e, t, n) => Ai((e - t) / (n - t)), Ni = (e) => 1 - (1 - e) ** 3, Pi = (e) => (1 - Math.cos(Math.PI * e)) / 2;
function Fi(e, t, n = !1) {
	if (n) return {
		scanOn: !1,
		scanR: 0,
		wire: 0,
		ambient: 0,
		insect: !1,
		glass: Pi(Mi(e, 0, .6)),
		dolly: 0,
		done: e >= .6
	};
	let r = t + ki[1] + ki[2] + .6, i = Ai(e / Oi), a = (1 - (1 - i) ** 1.35) * r, o = Math.min(1, i / .06) * (1 - ji(.7, 1, i));
	return {
		scanOn: i < 1,
		scanR: a,
		wire: o,
		ambient: Pi(Mi(e, 3.2, 6)),
		insect: e >= 4.4,
		glass: Ni(Mi(e, 4, 5.2)),
		dolly: .22 * (1 - Ni(Mi(e, 0, 6.2))),
		done: e >= Math.max(Oi, 6.2)
	};
}
// src/world/shaders/worldGlsl.ts
var Ii = (e) => `vec3(${e.map((e) => e.toFixed(4)).join(", ")})`, Li = `
const vec3 KEY_DIR = ${Ii(Ve)};
const vec3 KEY_COL = ${Ii(De)};
const vec3 FILL_DIR = ${Ii(X)};
const vec3 FILL_COL = ${Ii(K)};
const vec3 AMB_COL = ${Ii(ce)};
const vec3 HAZE_COL = ${Ii(de)};
uniform float uHaze;
uniform float uHazeFit; // the rig's portrait pull-back: haze is measured at the unpulled distance
// Sylva's litSurface: key + fill from the lit floor + sky ambient
vec3 litSurface(vec3 N, vec3 albedo, float ao, float sun) {
  float k = max(dot(N, KEY_DIR), 0.0);
  float f = max(dot(N, FILL_DIR), 0.0);
  float sky = 0.5 + 0.5 * N.y;
  return albedo * (KEY_COL * (0.06 + 1.02 * k) * sun + FILL_COL * (0.04 + 0.34 * f) * ao + AMB_COL * (0.38 + 0.62 * sky) * ao);
}
// aerial perspective toward lit air, by distance from the lens; darks lift least (after Sylva)
vec3 aerial(vec3 c, vec3 w) {
  float d = distance(w, cameraPosition) / max(uHazeFit, 1.0);
  float amt = uHaze * smoothstep(6.0, 15.0, d);
  float gain = smoothstep(0.003, 0.075, dot(c, vec3(0.30, 0.59, 0.11)));
  return mix(c, HAZE_COL, amt * mix(0.35, 1.0, gain));
}
`, Ri = "\nvec2 hash22(vec2 p){\n  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));\n  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);\n}\n// gradient noise: value noise puts its extrema on the lattice, which on a tube shows as rows of blobs\nfloat gnoise(vec2 p){\n  vec2 i = floor(p), f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(mix(dot(hash22(i + vec2(0,0)), f - vec2(0,0)), dot(hash22(i + vec2(1,0)), f - vec2(1,0)), u.x),\n             mix(dot(hash22(i + vec2(0,1)), f - vec2(0,1)), dot(hash22(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);\n}\nconst mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);\nfloat gfbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * gnoise(p); p = ROT * p * 2.03; a *= 0.5; } return s; }\nfloat ridged(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * (1.0 - abs(gnoise(p) * 2.0)); p = ROT * p * 2.11; a *= 0.5; } return s; }\n", zi = "\nuniform float uTime;\nuniform float uWind;\nvec3 windOffset(vec3 p){\n  float ph = p.x * 0.42 + p.y * 0.30 + p.z * 0.70;\n  float a = 0.030 * uWind;\n  return vec3((sin(uTime * 0.58 + ph) + 0.45 * sin(uTime * 1.37 + ph * 2.3)) * a,\n              sin(uTime * 0.79 + ph * 1.7) * a * 0.42,\n              sin(uTime * 0.51 + ph * 0.9) * a * 0.55);\n}\n", Bi = "\nuniform vec3 uScanO;\nuniform float uScanR, uScanOn;\nuniform vec3 uLag; // how far behind the wire front: stone, moss, growth band\nfloat scanWob(vec3 w){ return sin(w.y * 2.1 + w.x * 1.33) * 0.19 + sin(w.z * 4.0 + w.y * 2.5) * 0.09; }\nbool unscanned(vec3 w, float lag){\n  if (uScanOn < 0.5) return false;\n  return distance(w, uScanO) > uScanR - lag + scanWob(w);\n}\n// 0 → 1 as the growth band passes this point\nfloat grown(vec3 w, float lag, float band){\n  if (uScanOn < 0.5) return 1.0;\n  return clamp((uScanR - lag + scanWob(w) - distance(w, uScanO)) / band, 0.0, 1.0);\n}\n", Vi = "\nuniform vec2 uRes;\nfloat bhash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }\nfloat bnoise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(mix(bhash(i), bhash(i + vec2(1, 0)), u.x), mix(bhash(i + vec2(0, 1)), bhash(i + vec2(1, 1)), u.x), u.y); }\nfloat bfbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * bnoise(p); p = p * 2.07 + 13.1; a *= 0.5; } return v; }\n// warm-ivory paper in soft daylight, with leaf light drifting across it (linear)\nvec3 paper(vec2 frag, float t) {\n  vec2 uv = frag / uRes;\n  vec2 p = vec2((uv.x - 0.5) * uRes.x / uRes.y, uv.y - 0.5);\n  vec3 col = mix(vec3(0.80, 0.776, 0.712), vec3(0.866, 0.846, 0.792), smoothstep(-0.55, 0.6, p.y));\n  float pool = exp(-dot(p - vec2(0.28, 0.06), p - vec2(0.28, 0.06)) * 1.4);\n  col += vec3(0.07, 0.068, 0.055) * pool;\n  float vig = smoothstep(0.55, 1.35, length(p * vec2(0.85, 1.1)));\n  col *= 1.0 - 0.1 * vig;\n  col.b *= 1.0 - 0.04 * vig;\n  vec2 q = p * 2.1 + vec2(1.7, 0.4);\n  float tt = t * 0.045;\n  vec2 w = vec2(bfbm(q * 0.9 + vec2(tt, -tt * 0.6)), bfbm(q * 0.9 + vec2(5.2 - tt * 0.7, 1.3 + tt))) - 0.5;\n  float d = smoothstep(0.38, 0.66, bfbm(q * 1.55 + w * 1.6 + vec2(tt * 0.8, 0.0)));\n  return col * (0.968 + 0.045 * d);\n}\n", Hi = "void main() { gl_Position = vec4(position.xy, 0.9999, 1.0); }", Ui = `
uniform float uTime;
${Vi}
void main() { gl_FragColor = vec4(paper(gl_FragCoord.xy, uTime), 1.0); }
`, Wi = `
${zi}
${Bi}
attribute vec4 aShade;   // cover, ao, sun
attribute vec2 aUv;
attribute float aSwell;
attribute vec3 aRawN;
varying vec3 vN; varying vec3 vW; varying vec4 vShade; varying vec2 vUv; varying float vGrow;
void main(){
  vec3 base = position - aRawN * aSwell;
  float g = grown(base, uLag.y, uLag.z);
  vGrow = g;
  // the cushion swells in with the moss; before it arrives the stone is smooth
  vec3 p = base + aRawN * aSwell * g;
  p += windOffset(p) * (0.35 + 0.65 * aShade.x) * 0.5;
  vN = normalize(mix(aRawN, normal, g));
  vShade = aShade; vUv = aUv;
  vW = p;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`, Gi = `
${Ri}
${Li}
${Bi}
varying vec3 vN; varying vec3 vW; varying vec4 vShade; varying vec2 vUv; varying float vGrow;
// stone grain: the bark domain squashed less — limestone is nearly isotropic
vec2 stoneDomain(vec2 uv){ return vec2(uv.x * 3.2, uv.y * 0.9); }
float stoneHeight(vec2 uv){
  vec2 q = stoneDomain(uv);
  vec2 w = vec2(gfbm(q * 0.5), gfbm(q * 0.5 + 9.1));
  vec2 p = q + w * 0.5;
  float ridge = ridged(p);
  float pit = smoothstep(0.62, 0.9, ridged(p * 3.7 + 4.0));
  float fine = gfbm(p * 6.5) * 0.5 + 0.5;
  return (ridge - 0.5) * 0.7 - pit * 0.35 + fine * 0.18;
}
// Relief as a smooth world-space normal perturbation. (Sylva bump-maps from
// screen-space derivatives; on pale stone in daylight the 2×2 derivative
// quads show as blocks, so the relief is evaluated directly instead.)
vec3 relief(vec3 N, vec3 p, float k){
  vec3 g = vec3(gnoise(p.yz * 3.1 + 1.7), gnoise(p.zx * 3.1 - 4.2), gnoise(p.xy * 3.1 + 8.3))
         + 0.45 * vec3(gnoise(p.yz * 9.0), gnoise(p.zx * 9.0 + 2.0), gnoise(p.xy * 9.0 - 3.0));
  return normalize(N + (g - N * dot(g, N)) * k);
}
void main(){
  if (unscanned(vW, uLag.x)) discard;
  float cap = vShade.x * vGrow;
  float ao = vShade.y, sun = vShade.z;
  float m = smoothstep(0.05, 0.42, cap);
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  float h = stoneHeight(vUv);
  N = relief(N, vW, mix(0.28, 0.08, m));
  vec2 q = stoneDomain(vUv);
  float grain = gfbm(q * 1.25) * 0.5 + 0.5;
  float mottle = gfbm(q * 0.28 + 21.0) * 0.5 + 0.5;
  // pale warm limestone, bone in the light and a cooler grey in its pits
  vec3 bone = mix(vec3(0.50, 0.465, 0.40), vec3(0.66, 0.625, 0.55), grain);
  vec3 grey = mix(vec3(0.44, 0.43, 0.40), vec3(0.58, 0.56, 0.52), grain);
  vec3 stone = mix(bone, grey, mottle * 0.45);
  stone *= 0.86 + 0.18 * smoothstep(-0.4, 0.5, h);
  // the moss bed under the blades: the deep layer of the pile
  float mo = gfbm(vec2(vW.x * 2.6, vW.z * 2.6 + vW.y * 1.9)) * 0.5 + 0.5;
  vec3 bed = mix(vec3(0.030, 0.045, 0.012), vec3(0.085, 0.125, 0.030), mo);
  vec3 col = mix(stone, bed, m);
  // green staining creeps out from the moss line; a pale lichen crust on exposed upper stone
  float stain = smoothstep(0.0, 0.18, cap) * (1.0 - smoothstep(0.18, 0.55, cap));
  col = mix(col, vec3(0.26, 0.29, 0.15), stain * 0.5);
  float lich = smoothstep(0.58, 0.86, gfbm(q * 0.62 + 31.0) * 0.5 + 0.5) * (1.0 - m) * smoothstep(0.0, 0.7, N.y);
  col = mix(col, vec3(0.56, 0.58, 0.47), lich * 0.5);
  // contact shadow along the moss line: the cushion overhangs the stone it sits on
  col *= 1.0 - 0.32 * smoothstep(0.0, 0.16, cap) * (1.0 - smoothstep(0.16, 0.6, cap));
  vec3 lit = litSurface(N, col, ao, sun);
  vec3 V = normalize(cameraPosition - vW);
  // a soft sheen on the bare stone, like honed limestone
  lit += KEY_COL * pow(max(dot(reflect(-KEY_DIR, N), V), 0.0), 18.0) * 0.035 * (1.0 - m) * sun;
  lit += col * AMB_COL * pow(1.0 - max(dot(N, V), 0.0), 4.0) * 0.35;
  gl_FragColor = vec4(aerial(lit, vW), 1.0);
}
`, Ki = `
${zi}
${Bi}
attribute vec3 offset;
attribute vec3 nrm;
attribute vec4 rnd;     // yaw, length, lean, tone
attribute vec4 aAux;    // clump, ao, sun, cover
attribute vec2 aFuv;
uniform sampler2D uField;
uniform float uPx;
varying float vT; varying float vShade; varying float vDark; varying float vTone;
varying vec3 vN; varying vec3 vW; varying vec2 vLight; varying float vGrow; varying float vCover;
void main(){
  // shoots on the far side of the form are hidden by the stone: collapse them before any work
  vec3 toCam = cameraPosition - offset;
  if (dot(nrm, toCam) < -0.25 * length(toCam)) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float g = grown(offset, uLag.y, uLag.z);
  vGrow = g;
  if (g <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float t = uv.y; vT = t;
  // a little overshoot as the shoot unfurls
  float len = rnd.y * g * (1.0 + 0.12 * sin(g * 3.14159));

  // a local basis around the surface normal, rolled by the blade's yaw (Sylva)
  vec3 ref = abs(nrm.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 T0 = normalize(cross(nrm, ref));
  vec3 B0 = cross(nrm, T0);
  float ca = cos(rnd.x), sa = sin(rnd.x);
  vec3 widthDir = T0 * ca + B0 * sa;
  vec3 leanDir  = T0 * -sa + B0 * ca;

  float bend = t * t;
  float gust = (sin(uTime * 1.75 + offset.x * 1.6 + rnd.x) * 0.12 + sin(uTime * 0.85 + offset.x * 0.55) * 0.07) * uWind;
  float w = max(len * 0.62, uPx * 1.1);
  vec3 world = offset + windOffset(offset)
             + nrm * (t * len)
             + widthDir * (position.x * w)
             + leanDir * (rnd.z * 0.42 * len) * bend
             + (T0 * gust + B0 * gust * 0.6) * bend * len * 1.6;

  // the brush parts and presses the fur (Sylva's push/press), but the amount and
  // direction come from a spring field that remembers the hand and recovers
  vec4 f = texture2D(uField, aFuv);
  vec3 push = f.xyz - nrm * dot(f.xyz, nrm);
  float infl = clamp(length(push), 0.0, 1.0);
  float press = clamp(f.w, 0.0, 0.8);
  world += push * bend * len * 2.2;
  world -= nrm * max(infl * 0.6, press) * bend * len * 1.0;
  vDark = max(infl * 0.7, press);

  vShade = (0.66 + 0.34 * rnd.w) * (0.82 + 0.18 * sin(rnd.x * 2.0));
  vShade *= 0.46 + 0.54 * clamp(nrm.y * 0.5 + 0.62, 0.0, 1.0);
  vTone = smoothstep(0.16, 0.86, aAux.x);
  vN = normalize(mix(nrm, normalize(leanDir * rnd.z + nrm), 0.35));
  vLight = aAux.yz;
  vCover = aAux.w;
  vW = world;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`, qi = `
${Li}
uniform int uDebug;
varying float vT; varying float vShade; varying float vDark; varying float vTone;
varying vec3 vN; varying vec3 vW; varying vec2 vLight; varying float vGrow; varying float vCover;
void main(){
  // MSAA evaluates varyings at the pixel centre, which can lie outside a thin blade
  float t = clamp(vT, 0.0, 1.0);
  // Sylva's ramp (deep → mid → tip, plus a crown highlight added after lighting),
  // re-solved toward fresh daylight moss: olive in the pile, sage and yellow-green crowns
  vec3 deep  = vec3(0.024, 0.036, 0.009);
  vec3 mid   = vec3(0.078, 0.118, 0.026);
  vec3 tip   = vec3(0.190, 0.262, 0.055);
  vec3 tipHi = vec3(0.330, 0.400, 0.090);
  vec3 col = mix(deep, mid, smoothstep(0.0, 0.62, t));
  col = mix(col, tip, smoothstep(0.38, 1.0, t) * (0.35 + 0.65 * vTone));
  // at the moss line the shoots are few and young: lighter bases over pale stone, never black pepper
  float edge = 1.0 - smoothstep(0.35, 0.7, vCover);
  col = mix(col, vec3(0.13, 0.15, 0.06), edge * (1.0 - t) * 0.75);
  // slow drifts of colour so the pile never reads as flat velvet
  col *= 0.7 + 0.6 * vTone;
  col *= vShade;
  col *= 1.0 - vDark * 0.45;
  vec3 N = normalize(vN);
  float ao = vLight.x, sun = vLight.y;
  // self-shadowing inside the pile: the deeper down a blade you look, the less sky reaches it
  float pile = mix(0.42, 1.08, smoothstep(0.0, 0.88, t)) * (0.72 + 0.4 * vTone);
  vec3 lit = litSurface(N, col, ao * pile, sun * mix(0.45, 1.0, t));
  // the sunlit crown, added after the pile shading (Sylva)
  lit += tipHi * smoothstep(0.68, 1.0, t) * vTone * (0.3 + 0.7 * max(dot(N, KEY_DIR), 0.0)) * 0.6 * sun;
  // sun burning through the blade
  vec3 V = normalize(cameraPosition - vW);
  lit += col * KEY_COL * pow(max(dot(V, -KEY_DIR), 0.0), 2.2) * 0.55 * t * sun;
  // soft back-lit fibres on the silhouette
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  lit += tip * KEY_COL * rim * 0.18 * t * sun;
  // just-grown shoots are paler for a moment
  lit = mix(lit, lit * vec3(1.25, 1.2, 0.95), (1.0 - vGrow) * 0.5);
  gl_FragColor = vec4(aerial(lit, vW), 1.0);
  if (uDebug == 1) gl_FragColor = vec4(vec3(sun), 1.0);
  if (uDebug == 2) gl_FragColor = vec4(vec3(ao), 1.0);
  if (uDebug == 3) gl_FragColor = vec4(vec3(vDark), 1.0);
}
`, Ji = `
${zi}
${Bi}
attribute vec3 iPos;
attribute vec4 iQuat;
attribute vec2 iRnd;
varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying float vTint; varying float vGrow;
vec3 qrot(vec4 q, vec3 v){ return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
void main(){
  vUv = uv; vTint = iRnd.y;
  float g = smoothstep(0.0, 1.0, grown(iPos, uLag.y + 0.9, 1.0));
  vGrow = g;
  // fronds unroll as the moss reaches them
  vec3 local = qrot(iQuat, position * iRnd.x * (0.2 + 0.8 * g));
  vN = normalize(qrot(iQuat, normal));
  // the frond bows from its stipe, so the sway climbs with height up the rachis
  float sway = sin(uTime * 1.15 + iRnd.y * 6.28) * 0.055 * uWind;
  local += vec3(sway, 0.0, sway * 0.45) * clamp(position.y, 0.0, 1.2) * iRnd.x;
  vec3 p = iPos + windOffset(iPos) + local;
  vW = p;
  gl_Position = g <= 0.0 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`, Yi = `
${Li}
varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying float vTint; varying float vGrow;
void main(){
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  vec3 base = mix(vec3(0.060, 0.100, 0.022), vec3(0.150, 0.230, 0.050), vTint);
  base *= 0.80 + 0.30 * smoothstep(0.0, 0.8, vUv.x);
  vec3 lit = litSurface(N, base, 0.9, 0.9);
  // fronds are thin — light comes through them
  lit += base * KEY_COL * pow(max(dot(V, -KEY_DIR), 0.0), 2.0) * 1.05;
  gl_FragColor = vec4(aerial(lit, vW), 1.0);
}
`, Xi = `
${zi}
${Bi}
attribute vec3 iPos;
attribute vec4 iQuat;
attribute vec2 iRnd;
varying vec2 vUv; varying vec3 vW; varying vec3 vN; varying float vGrow;
vec3 qrot(vec4 q, vec3 v){ return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
void main(){
  vUv = uv;
  float g = smoothstep(0.0, 1.0, grown(iPos, uLag.y + 1.4, 0.8));
  vGrow = g;
  // a spray seated on its own patch of moss, nodding on its stem
  float nod = sin(uTime * 1.5 + iRnd.y * 6.28) * 0.08 * uWind;
  vec3 q = vec3(position.xy * iRnd.x * g, 0.0);
  q.z += (q.x * q.x + q.y * q.y) * 1.6; // the spray cups slightly
  vec3 local = qrot(iQuat, q);
  vec3 p = iPos + windOffset(iPos) * 1.6 + local + vec3(nod, 0.0, nod * 0.5) * iRnd.x;
  vN = qrot(iQuat, vec3(0.0, 0.0, 1.0));
  vW = p;
  gl_Position = g <= 0.0 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`, Zi = `
${Li}
uniform sampler2D uMap;
varying vec2 vUv; varying vec3 vW; varying vec3 vN; varying float vGrow;
void main(){
  vec4 t = texture2D(uMap, vUv);
  if (t.a < 0.3) discard;
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 albedo = t.rgb * t.rgb * 0.8;
  vec3 lit = litSurface(N, albedo, 0.95, 1.0);
  // petals are thin: they glow when the sun is behind them
  vec3 V = normalize(cameraPosition - vW);
  lit += albedo * KEY_COL * pow(max(dot(V, -KEY_DIR), 0.0), 2.0) * 0.6;
  gl_FragColor = vec4(aerial(lit, vW), 1.0);
}
`, Qi = "\nvarying vec3 vW;\nvoid main(){ vW = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }\n", $i = "\nuniform vec3 uScanO;\nuniform float uScanR, uWire, uTime;\nvarying vec3 vW;\nvoid main(){\n  float d = distance(vW, uScanO);\n  // a fine ring exactly on the wavefront over a faint cage that lingers behind it (Sylva)\n  float z = (d - uScanR) / 0.55;\n  float rim = exp(-z * z);\n  float trail = d < uScanR ? 1.0 : 0.0;\n  float a = (rim * 1.0 + trail * 0.42) * uWire;\n  if (a < 0.004) discard;\n  // survey ticks running out along the beam\n  a *= 0.72 + 0.28 * sin(d * 8.5 - uTime * 7.0);\n  // on paper the cage is drawn in a fine olive ink; the front itself is a lit sage line\n  vec3 col = mix(vec3(0.09, 0.13, 0.08), vec3(0.3, 0.44, 0.24), rim);\n  gl_FragColor = vec4(col, clamp(a, 0.0, 0.9));\n}\n", ea = Math.PI * 2;
function ta() {
	let e = [], t = [], n = [], r = (e, t) => t.set(0, e * (1.06 - .44 * e * e), .36 * e * e), i = new G(), a = new G();
	for (let o = 1; o <= 13; o++) {
		let s = o / 13.6;
		r(s, i);
		let c = .36 * Math.sin(Math.PI * s ** .62) ** .75 * (1 - .18 * s);
		for (let i = -1; i <= 1; i += 2) {
			let o = e.length / 3;
			for (let n = 0; n <= 3; n++) {
				let o = n / 3, l = .088 * c * Math.sin(Math.PI * Math.min(o * 1.25, 1)) ** .7 * (1 - .35 * o);
				r(s + o * c * .34, a);
				let u = i * o * c, d = a.y - .22 * c * o * o, f = a.z + .06 * c * o;
				e.push(u, d - l, f, u, d + l, f), t.push(o, 0, o, 1);
			}
			for (let e = 0; e < 3; e++) {
				let t = o + e * 2;
				n.push(t, t + 1, t + 2, t + 1, t + 3, t + 2);
			}
		}
	}
	let o = e.length / 3;
	for (let n = 0; n <= 8; n++) {
		let a = n / 8;
		r(a, i), e.push(-.011 * (1 - .6 * a), i.y, i.z, .011 * (1 - .6 * a), i.y, i.z), t.push(.5, 0, .5, 1);
	}
	for (let e = 0; e < 8; e++) {
		let t = o + e * 2;
		n.push(t, t + 1, t + 2, t + 1, t + 3, t + 2);
	}
	let s = new re();
	s.setAttribute("position", new g(e, 3)), s.setAttribute("uv", new g(t, 2)), s.setIndex(n);
	let c = new B();
	return c.setAttribute("position", s.getAttribute("position")), c.setIndex(n), c.computeVertexNormals(), s.setAttribute("normal", c.getAttribute("normal")), s;
}
function na() {
	let e = document.createElement("canvas");
	e.width = e.height = 128;
	let t = e.getContext("2d");
	if (!t) throw Error("2D canvas unavailable for the flower texture");
	t.scale(2, 2), [
		[
			32,
			22,
			7.4
		],
		[
			22,
			33,
			6
		],
		[
			42,
			33,
			6.2
		],
		[
			27,
			44,
			5
		],
		[
			39,
			45,
			5.4
		],
		[
			32,
			33,
			4.4
		],
		[
			46,
			22,
			4.2
		],
		[
			18,
			22,
			4
		]
	].forEach(([e, n, r], i) => {
		t.save(), t.translate(e, n), t.rotate(i * 1.31);
		for (let e = 0; e < 5; e++) t.save(), t.rotate(e / 5 * ea), t.fillStyle = i % 3 == 1 ? `rgba(250,244,206,${.78 + r / 7.4 * .22})` : `rgba(255,252,240,${.78 + r / 7.4 * .22})`, t.beginPath(), t.ellipse(0, -r * .55, r * .34, r * .55, 0, 0, ea), t.fill(), t.restore();
		t.fillStyle = "#e8d98a", t.beginPath(), t.arc(0, 0, r * .24, 0, ea), t.fill(), t.restore();
	});
	let n = new Ye(e);
	return n.colorSpace = Oe, n.minFilter = v, n.generateMipmaps = !0, n;
}
var ra = class {
	group = new i();
	disposables = [];
	constructor(e, t) {
		if (e.ferns.pos.length) {
			let n = ta();
			n.setAttribute("iPos", new m(e.ferns.pos, 3)), n.setAttribute("iQuat", new m(e.ferns.quat, 4)), n.setAttribute("iRnd", new m(e.ferns.rnd, 2)), n.instanceCount = e.ferns.pos.length / 3;
			let r = new U({
				vertexShader: Ji,
				fragmentShader: Yi,
				uniforms: t,
				side: 2
			}), i = new H(n, r);
			i.frustumCulled = !1, this.group.add(i), this.disposables.push(n, r);
		}
		if (e.flowers.pos.length) {
			let n = new re();
			n.setAttribute("position", new g([
				-.5,
				-.5,
				0,
				.5,
				-.5,
				0,
				.5,
				.5,
				0,
				-.5,
				.5,
				0
			], 3)), n.setAttribute("uv", new g([
				0,
				0,
				1,
				0,
				1,
				1,
				0,
				1
			], 2)), n.setIndex([
				0,
				1,
				2,
				0,
				2,
				3
			]), n.setAttribute("iPos", new m(e.flowers.pos, 3)), n.setAttribute("iQuat", new m(e.flowers.quat, 4)), n.setAttribute("iRnd", new m(e.flowers.rnd, 2)), n.instanceCount = e.flowers.pos.length / 3;
			let r = na(), i = new U({
				vertexShader: Xi,
				fragmentShader: Zi,
				uniforms: {
					...t,
					uMap: { value: r }
				},
				side: 2
			}), a = new H(n, i);
			a.frustumCulled = !1, this.group.add(a), this.disposables.push(n, i, r);
		}
	}
	dispose() {
		for (let e of this.disposables) e.dispose();
	}
}, ia = Math.PI * 2, aa = new G(0, 1, 0);
function oa(e) {
	let t = [], n = [], r = [];
	for (let r = 0; r < 30; r++) {
		let i = r / 29, a, o, s;
		e ? (s = .78, a = -.06 - .26 * i, o = (.54 + .48 * i) * Math.max(0, 1 - i ** 2.2) ** .55, o *= 1 + .035 * Math.cos(i * 22)) : (s = .95, a = .1 + .32 * i - .14 * i * i, o = (.56 + .46 * i) * Math.max(0, 1 - i ** 2.6) ** .55), o *= .26 + .74 * J(0, .32, i), o = Math.max(o, .014);
		for (let e = 0; e < 10; e++) {
			let r = e / 9, c = .03 * Math.sin(Math.PI * r) * (1 - .35 * i);
			t.push(.018 + i * s, c, a - o * r), n.push(i, r);
		}
	}
	for (let e = 0; e < 29; e++) for (let t = 0; t < 9; t++) {
		let n = e * 10 + t, i = n + 10;
		r.push(n, i, n + 1, i, i + 1, n + 1);
	}
	let i = new B();
	return i.setAttribute("position", new g(t, 3)), i.setAttribute("uv", new g(n, 2)), i.setIndex(r), i.computeVertexNormals(), i;
}
function sa() {
	let e = /* @__PURE__ */ new Uint8Array(262144), t = (e, t) => {
		let n = Math.sin(e * 127.1 + t * 311.7) * 43758.5453123, r = Math.sin(e * 269.5 + t * 183.3) * 43758.5453123;
		return [(n - Math.floor(n)) * 2 - 1, (r - Math.floor(r)) * 2 - 1];
	}, n = (e, n) => {
		let r = Math.floor(e), i = Math.floor(n), a = e - r, o = n - i, s = a * a * (3 - 2 * a), c = o * o * (3 - 2 * o), l = t(r, i), u = t(r + 1, i), d = t(r, i + 1), f = t(r + 1, i + 1), p = l[0] * a + l[1] * o, m = u[0] * (a - 1) + u[1] * o, h = d[0] * a + d[1] * (o - 1), g = f[0] * (a - 1) + f[1] * (o - 1), _ = p + (m - p) * s;
		return _ + (h + (g - h) * s - _) * c;
	}, r = (e, t, r) => {
		let i = 0, a = .5;
		for (let o = 0; o < r; o++) {
			i += a * n(e, t);
			let r = .8 * e + .6 * t, o = -.6 * e + .8 * t;
			e = r * 2.03, t = o * 2.03, a *= .5;
		}
		return i;
	}, i = (e) => Math.max(0, Math.min(255, Math.round((e * .5 + .5) * 255)));
	for (let t = 0; t < 256; t++) {
		let a = t / 255;
		for (let o = 0; o < 256; o++) {
			let s = o / 255, c = (t * 256 + o) * 4;
			e[c] = i(r(a * 70, s * 16, 4)), e[c + 1] = i(n(a * 165, s * 52)), e[c + 2] = i(r(s * 4.5, a * 3, 3)), e[c + 3] = i(r(s * 6.5 + 4, a * 4.5, 3));
		}
	}
	let a = new Ee(e, 256, 256, V);
	return a.magFilter = q, a.minFilter = q, a.needsUpdate = !0, a;
}
var ca = (e) => `vec3(${e.map((e) => e.toFixed(4)).join(", ")})`, la = `const vec3 KEY_DIR = ${ca(Ve)}; const vec3 KEY_COL = ${ca(De)}; const vec3 AMB_COL = ${ca(ce)};`;
function ua(e, t, n, r) {
	return new U({
		uniforms: {
			uBend: t,
			uHind: { value: +!!e },
			uTex: { value: n },
			uAlpha: r
		},
		side: 2,
		transparent: !0,
		vertexShader: "\n      uniform float uBend;\n      varying vec2 vUv; varying vec3 vN; varying vec3 vW;\n      void main(){\n        vUv = uv;\n        // the tip lags the stroke — a rigid flapping plate reads as paper\n        vec3 p = position;\n        float s = uv.x;\n        p.y += uBend * s * s;\n        p.z += uBend * s * s * (uv.y - 0.45) * 0.35;\n        vN = normalize(mat3(modelMatrix) * normal);\n        vec4 wp = modelMatrix * vec4(p, 1.0);\n        vW = wp.xyz;\n        gl_Position = projectionMatrix * viewMatrix * wp;\n      }",
		fragmentShader: `
      ${la}
      uniform float uHind, uAlpha;
      uniform sampler2D uTex;
      varying vec2 vUv; varying vec3 vN; varying vec3 vW;
      void main(){
        float s = vUv.x, u = vUv.y;
        vec3 N = normalize(vN);
        if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(cameraPosition - vW);
        float facing = abs(dot(N, V));
        // a brimstone: pale lemon face, warmer at the base, ivory toward the edge
        vec3 face = vec3(0.62, 0.58, 0.24);
        vec3 edge = vec3(0.40, 0.42, 0.20);
        vec3 wing = mix(edge, face, pow(facing, 0.65));
        wing *= 0.78 + 0.34 * smoothstep(0.02, 0.46, s) * (1.0 - 0.2 * smoothstep(0.45, 1.0, u));
        vec4 tx = texture2D(uTex, vUv);
        float rows = tx.r, grain = tx.g, mottle = tx.b, shim = tx.a;
        wing *= 0.86 + 0.28 * mottle;
        wing = mix(wing, wing * vec3(1.06, 1.04, 0.86), shim);
        vec3 ivory = vec3(0.72, 0.70, 0.58);
        // a soft ivory margin instead of Sylva's sooty border
        float border = max(smoothstep(0.66, 0.86, s), smoothstep(0.82, 0.97, u));
        vec3 c = mix(wing, ivory, border * 0.7);
        // veins: fine sage lines running out from the base
        float vp = pow(u, 0.72) * 5.2 + s * 0.55 + (mottle - 0.5) * 0.22;
        float vk = abs(fract(vp) - 0.5) * 2.0;
        float aa = fwidth(vp) * 2.0 + 0.045;
        float vw = 0.045 * (1.0 - 0.42 * s);
        float vein = 1.0 - smoothstep(vw, vw + aa, vk);
        c = mix(c, vec3(0.30, 0.34, 0.20), vein * 0.32 * (1.0 - border * 0.6));
        // the small orange-brown discal spot of a brimstone, one per wing
        float dz = (s - 0.52) / 0.05, du = (u - 0.42) / 0.06;
        float spot = exp(-(dz * dz + du * du));
        c = mix(c, vec3(0.46, 0.26, 0.08), spot * 0.55);
        c *= 0.92 + 0.14 * rows;
        c *= 0.95 + 0.1 * grain;
        float wrap = dot(N, KEY_DIR) * 0.5 + 0.5;
        vec3 lit = c * (KEY_COL * (0.34 + 0.9 * wrap) * 0.55 + AMB_COL * (0.5 + 0.5 * N.y) * 0.9);
        // light burning through the membrane from behind
        float back = pow(max(dot(V, -KEY_DIR), 0.0), 2.4);
        lit += vec3(0.86, 0.80, 0.36) * back * 0.5;
        float sheen = pow(max(dot(reflect(-KEY_DIR, N), V), 0.0), 26.0);
        lit += vec3(0.9, 0.92, 0.7) * sheen * 0.2;
        gl_FragColor = vec4(lit, uAlpha);
      }`
	});
}
function da(e) {
	return new U({
		uniforms: { uAlpha: e },
		transparent: !0,
		vertexShader: "\n      varying vec3 vN; varying vec3 vW; varying vec3 vP;\n      void main(){ vN = normalize(mat3(modelMatrix) * normal); vP = position; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",
		fragmentShader: `
      ${la}
      uniform float uAlpha;
      varying vec3 vN; varying vec3 vW; varying vec3 vP;
      void main(){
        vec3 N = normalize(vN);
        // the thorax is furred, the abdomen banded; a pale green-cream body
        float band = 0.5 + 0.5 * sin(vP.z * 150.0);
        float furry = smoothstep(-0.02, 0.10, vP.z);
        vec3 base = mix(vec3(0.16, 0.17, 0.10), vec3(0.36, 0.36, 0.22), band * (1.0 - furry * 0.5));
        float d = max(dot(N, KEY_DIR), 0.0);
        vec3 col = base * (KEY_COL * (0.24 + 0.9 * d) * 0.6 + AMB_COL * (0.5 + 0.5 * N.y));
        gl_FragColor = vec4(col, uAlpha);
      }`
	});
}
var fa = class {
	group = new i();
	alpha = { value: 0 };
	wR1;
	wL1;
	wR2;
	wL2;
	bend = {
		fore: { value: 0 },
		hind: { value: 0 }
	};
	world;
	rng = xe(20903);
	st = {
		pos: new G(),
		vel: new G(.5, 0, 0),
		acc: new G(),
		tgt: new G(),
		mode: "enter",
		timer: 0,
		settle: 0,
		bank: 0,
		flap: 0,
		perch: 0,
		thread: 0,
		threadStep: 0
	};
	spook = 0;
	cycle = 0;
	landQ = new Me();
	tmp = new G();
	prevVel = new G();
	away = new G();
	vRight = new G();
	vUp = new G();
	vFwd = new G();
	basis = new e();
	flightQ = new Me();
	qTmp = new Me();
	ndc = new G();
	active = !1;
	disposables = [];
	constructor(e) {
		this.world = e;
		let t = sa(), n = oa(!1), r = oa(!0), i = ua(!1, this.bend.fore, t, this.alpha), a = ua(!0, this.bend.hind, t, this.alpha);
		this.wR1 = new H(n, i), this.wL1 = new H(n, i), this.wR2 = new H(r, a), this.wL2 = new H(r, a), this.wL1.scale.x = -1, this.wL2.scale.x = -1, this.wR1.position.set(.012, .012, 0), this.wL1.position.copy(this.wR1.position), this.wR2.position.set(.01, 0, 0), this.wL2.position.copy(this.wR2.position), this.group.add(this.wR1, this.wL1, this.wR2, this.wL2);
		let o = da(this.alpha), s = [], c = [];
		for (let e = 0; e <= 30; e++) {
			let t = e / 30, n = .014 + .026 * Math.sin(Math.PI * t ** .8);
			n += .02 * Math.exp(-(((t - .7) / .14) ** 2)), n += .013 * Math.exp(-(((t - .97) / .05) ** 2));
			let r = -.55 + t * .72;
			for (let e = 0; e <= 9; e++) {
				let t = e / 9 * ia;
				s.push(Math.cos(t) * n, Math.sin(t) * n * .9, r);
			}
		}
		for (let e = 0; e < 30; e++) for (let t = 0; t < 9; t++) {
			let n = e * 10 + t, r = n + 9 + 1;
			c.push(n, r, n + 1, r, r + 1, n + 1);
		}
		let l = new B();
		l.setAttribute("position", new g(s, 3)), l.setIndex(c), l.computeVertexNormals(), this.group.add(new H(l, o));
		let u = new Be({
			color: 3815970,
			transparent: !0
		});
		for (let e of [1, -1]) {
			let t = new Ie(new G(.01 * e, .02, .15), new G(.062 * e, .075, .3), new G(.105 * e, .11, .43)), n = new _e(t, 12, .0042, 5, !1);
			this.group.add(new H(n, u));
			let r = new H(new je(.013, 8, 6), u);
			r.position.copy(t.getPointAt(1)), r.scale.z = 1.9, this.group.add(r), this.disposables.push(n);
		}
		this.disposables.push(n, r, i, a, o, l, t, u), this.group.scale.setScalar(.27), this.group.renderOrder = 5, this.group.traverse((e) => {
			e.frustumCulled = !1;
		}), this.group.visible = !1;
	}
	rand(e, t) {
		return e + (t - e) * this.rng();
	}
	perchPoint(e, t) {
		let n = this.world.perches;
		return t.set(n[e * 6], n[e * 6 + 1], n[e * 6 + 2]);
	}
	pickTarget() {
		let { min: e, max: t } = this.world.bounds;
		this.st.tgt.set(this.rand(e[0] + .8, t[0] - .2), this.rand(e[1] + .6, t[1] - .3), this.rand(e[2] * .4, t[2] * .7 + .4));
	}
	enter() {
		if (this.active) return;
		this.active = !0, this.group.visible = !0;
		let { max: e } = this.world.bounds;
		this.st.pos.set(e[0] + 2.2, e[1] * .6, 1.2), this.st.vel.set(-.8, 0, 0), this.st.mode = "enter", this.st.timer = 3.5, this.pickTarget();
	}
	update(e, t, n, r) {
		if (!this.active) return;
		let i = this.st;
		this.alpha.value = Math.min(1, this.alpha.value + e * .8);
		let a = 0;
		n && (a = ze(1 - n.distanceTo(i.pos) / .75), a *= a), this.spook += (a - this.spook) * (1 - (a > this.spook ? 1e-7 : .22) ** e), i.timer -= e;
		let o = this.world.perches.length / 6;
		switch (i.mode) {
			case "enter":
				i.timer <= 0 && (i.mode = "cruise", i.timer = this.rand(4, 7), this.pickTarget());
				break;
			case "cruise":
				i.pos.distanceTo(i.tgt) < .4 && this.pickTarget(), i.timer <= 0 && (this.cycle++, this.world.openings.length && this.cycle % 2 == 1 ? (i.mode = "thread", i.thread = Math.floor(this.rng() * this.world.openings.length), i.threadStep = 0, i.timer = 9) : o ? (i.mode = "approach", i.perch = (i.perch + 1 + Math.floor(this.rng() * (o - 1))) % o, i.timer = 12) : i.timer = 5);
				break;
			case "thread": {
				let e = this.world.openings[i.thread], t = this.tmp.set(e.axis[0], e.axis[1], e.axis[2]).normalize(), n = i.thread % 2 == 0 ? 1 : -1, r = [
					1.4,
					0,
					-1.4
				][i.threadStep] * n;
				i.tgt.set(e.centre[0] + t.x * r, e.centre[1] + t.y * r, e.centre[2] + t.z * r), i.pos.distanceTo(i.tgt) < .22 && i.threadStep++, (i.threadStep > 2 || i.timer <= 0) && (i.mode = "cruise", i.timer = this.rand(5, 9), this.pickTarget());
				break;
			}
			case "approach": {
				let e = this.perchPoint(i.perch, this.tmp);
				(i.pos.distanceTo(e) < .12 || i.timer <= 0) && (i.mode = "landed", i.timer = this.rand(6, 10), this.computeLandQ(r));
				break;
			}
			case "landed":
				(i.timer <= 0 || this.spook > .3) && (i.mode = "takeoff", i.timer = 2, i.tgt.copy(i.pos).add(new G(this.rand(-.6, .6), .9, .6)));
				break;
			case "takeoff": i.timer <= 0 && (i.mode = "cruise", i.timer = this.rand(5, 8.5), this.pickTarget());
		}
		let s = i.mode === "landed";
		i.settle += (+!!s - i.settle) * Math.min(1, e * (s ? 3.4 : 4.5)), i.settle = Math.min(i.settle, 1 - this.spook);
		let c = 8.6 + Math.sin(t * .7) * .9, l = c + (.34 - c) * i.settle;
		l *= 1 + this.spook * 1.15, i.flap += e * l * ia;
		let u = Math.sin(i.flap), d = (u < 0 ? -1 : 1) * Math.abs(u) ** .72, f = 20 + 48 * d, p = (f + (15 + 7 * d + this.spook * 30 - f) * i.settle) * Math.PI / 180, m = Math.cos(i.flap) * l;
		this.wR1.rotation.z = p, this.wL1.rotation.z = -p, this.wR2.rotation.z = p * .95 - .03, this.wL2.rotation.z = -(p * .95 - .03), this.bend.fore.value = -m * .01, this.bend.hind.value = -m * .013;
		let h = i.mode === "approach" ? this.perchPoint(i.perch, new G()) : i.tgt, g = this.tmp.copy(h).sub(i.pos), _ = g.length(), v = Math.min(i.mode === "thread" ? 1.1 : 1.4, .22 + _ * 1.1), y = g.normalize().multiplyScalar(v), b = i.mode === "approach" || i.mode === "thread" ? Math.min(1, _ * .6) : 1;
		if (y.x += (Math.sin(t * 3.1) + .6 * Math.sin(t * 7.7 + 1.1)) * .2 * b, y.y += (Math.sin(t * 1.9 + 1.7) + .55 * Math.sin(t * 4.6)) * .4 * b, y.z += Math.sin(t * 2.7 + 3.4) * .24 * b, i.mode === "takeoff" && (y.y += .7, y.z += .35), this.spook > .002 && n && (this.away.copy(i.pos).sub(n), this.away.lengthSq() > 1e-6 && y.addScaledVector(this.away.normalize(), this.spook * 2.3)), i.mode !== "landed" && !(i.mode === "approach" && _ < .35)) {
			let e = this.world.spheres;
			for (let t = 0; t < e.length; t += 4) {
				let n = i.pos.x - e[t], r = i.pos.y - e[t + 1], a = i.pos.z - e[t + 2], o = Math.sqrt(n * n + r * r + a * a), s = e[t + 3] + .32;
				if (o < s && o > 1e-4) {
					let e = (s - o) / s * 4;
					y.x += n / o * e, y.y += r / o * e, y.z += a / o * e;
				}
			}
		}
		if (this.ndc.copy(i.pos).project(r), this.ndc.x < this.world.keepOutX + .12 && (y.x += (this.world.keepOutX + .12 - this.ndc.x) * 6), this.ndc.y > .78 && (y.y -= (this.ndc.y - .78) * 9), this.ndc.y < -.85 && (y.y += 1.5), this.ndc.x > .95 && (y.x -= 1.5), this.prevVel.copy(i.vel), i.vel.lerp(y, 1 - .03 ** e), i.acc.copy(i.vel).sub(this.prevVel).divideScalar(Math.max(e, 1e-4)), i.pos.addScaledVector(i.vel, e), i.settle > .001 && i.mode === "landed") {
			let t = this.perchPoint(i.perch, new G());
			i.pos.lerp(t, Math.min(1, e * 6 * i.settle)), i.vel.multiplyScalar(1 - Math.min(1, e * 6 * i.settle));
		}
		this.vFwd.copy(i.vel), this.vFwd.lengthSq() < 1e-6 && this.vFwd.set(0, 0, 1), this.vFwd.normalize(), this.vRight.crossVectors(this.vFwd, aa), this.vRight.lengthSq() < 1e-6 && this.vRight.set(1, 0, 0), this.vRight.normalize(), this.vUp.crossVectors(this.vRight, this.vFwd).normalize();
		let x = this.vRight.dot(i.acc);
		i.bank += (Math.max(-1.15, Math.min(1.15, -x * .4)) - i.bank) * Math.min(1, e * 5), this.basis.makeBasis(this.vRight, this.vUp, this.vFwd), this.flightQ.setFromRotationMatrix(this.basis), this.qTmp.setFromAxisAngle(new G(0, 0, 1), i.bank + Math.sin(t * .83) * .3 + Math.sin(i.flap) * .05 + Math.sin(t * 21) * this.spook * .16), this.flightQ.multiply(this.qTmp), this.qTmp.setFromAxisAngle(new G(1, 0, 0), Math.sin(i.flap) * .1 - .06), this.flightQ.multiply(this.qTmp), this.group.quaternion.copy(this.flightQ).slerp(this.landQ, i.settle), this.group.position.copy(i.pos), this.group.position.y += Math.sin(i.flap - .9) * .022 * (1 - i.settle);
	}
	computeLandQ(t) {
		let n = this.perchPoint(this.st.perch, new G()), r = t.position.clone().sub(n).normalize(), i = new G(0, 1, 0).addScaledVector(r, -r.y).normalize(), a = new G().crossVectors(r, i).normalize();
		this.landQ.setFromRotationMatrix(new e().makeBasis(a, r, i)), this.landQ.multiply(new Me().setFromAxisAngle(new G(1, 0, 0), -.1)), this.landQ.multiply(new Me().setFromAxisAngle(new G(0, 1, 0), .14));
	}
	get position() {
		return this.st.pos;
	}
	get mode() {
		return this.st.mode;
	}
	dispose() {
		for (let e of this.disposables) e.dispose();
	}
}, pa = (e) => `vec3(${e.map((e) => e.toFixed(4)).join(", ")})`, ma = "\nuniform float uTime; uniform float uWind;\nvec3 windOffset(vec3 p){\n  float ph = p.x * 0.42 + p.y * 0.30 + p.z * 0.70;\n  float a = 0.030 * uWind;\n  return vec3((sin(uTime * 0.58 + ph) + 0.45 * sin(uTime * 1.37 + ph * 2.3)) * a, sin(uTime * 0.79 + ph * 1.7) * a * 0.42, sin(uTime * 0.51 + ph * 0.9) * a * 0.55);\n}", ha = "\nvarying float vA; varying vec3 vCol; varying float vCore;\nvoid main(){\n  vec2 q = gl_PointCoord * 2.0 - 1.0;\n  float r2 = dot(q, q);\n  if (r2 > 1.0) discard;\n  float core = exp(-r2 * 7.0), halo = exp(-r2 * 2.2) * 0.45;\n  // premultiplied: the halo only tints what is behind it, the core adds light where it glows\n  gl_FragColor = vec4(vCol * (core * (0.6 + vCore) + halo * 0.7) * vA, (core + halo) * vA * 0.55);\n}", ga = `
${ma}
attribute vec4 seed;   // phase, speed, sway, size
uniform float uScale, uSize, uAmbient;
varying float vA; varying vec3 vCol; varying float vCore;
const vec3 KEY = ${pa(Ve)};
void main(){
  float ph = seed.x, sp = seed.y, am = seed.z;
  vec3 p = position;
  p.x += sin(uTime * sp * 0.35 + ph) * 0.18 * am;
  // one long rise, wrapped — the band fade hides the wrap
  float climb = mod(uTime * 0.058 * sp + ph * 0.32, 7.9) - 3.95;
  p.y += climb;
  p.z += cos(uTime * sp * 0.28 + ph) * 0.13 * am;
  p += windOffset(p) * 3.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * seed.w * (uScale / max(-mv.z, 0.5));
  float edge = 1.0 - abs(climb) / 3.95;
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.7 + sp * 1.6) + ph * 3.1);
  // a shaft of sun across the frame from the upper left: grains inside it catch the light
  vec3 shaftN = normalize(cross(KEY, vec3(0.0, 0.0, 1.0)));
  float shaft = exp(-pow(dot(p - vec3(-0.5, 0.6, 0.0), shaftN) / 1.6, 2.0));
  float caught = mix(0.18, 1.0, shaft) * twinkle;
  vA = clamp(edge * 3.0, 0.0, 1.0) * caught * uAmbient;
  // pale ivory, muted yellow-green and soft gold
  float hue = fract(ph * 0.159);
  vCol = hue < 0.5 ? vec3(1.0, 0.97, 0.86) : (hue < 0.8 ? vec3(0.86, 0.92, 0.6) : vec3(1.0, 0.84, 0.5));
  vCore = shaft * twinkle * step(0.7, fract(ph * 3.7));
  gl_Position = projectionMatrix * mv;
}`, _a = `
${ma}
attribute vec3 aVel; attribute float aBirth; attribute vec2 aRnd;
uniform float uScale, uSize, uLife;
varying float vA; varying vec3 vCol; varying float vCore;
void main(){
  float age = uTime - aBirth;
  if (age < 0.0 || age > uLife * (0.75 + 0.5 * aRnd.y)) { vA = 0.0; gl_PointSize = 0.0; gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float life = uLife * (0.75 + 0.5 * aRnd.y);
  float u = age / life;
  // drag on the launch velocity (closed form), a slow lift, a little wander, and the moss's wind
  float k = 2.4;
  vec3 p = position + aVel * (1.0 - exp(-k * age)) / k
         + vec3(sin(aRnd.y * 6.28 + age * 2.6) * 0.11 * u, 0.2 * age, cos(aRnd.y * 4.1 + age * 1.9) * 0.06 * u);
  p += windOffset(p) * (1.0 + 4.0 * u);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * aRnd.x * (uScale / max(-mv.z, 0.5)) * (0.45 + 0.55 * (1.0 - u));
  vA = smoothstep(0.0, 0.09, u) * (1.0 - smoothstep(0.4, 1.0, u)) * 0.95;
  vCol = mix(vec3(1.0, 0.86, 0.5), vec3(0.92, 0.95, 0.62), aRnd.y * 0.6);
  vCore = 0.9 * (1.0 - u);
  gl_Position = projectionMatrix * mv;
}`, va = class {
	ambient;
	spray;
	material;
	sprayMaterial;
	N;
	pos;
	vel;
	birth;
	rnd;
	head = 0;
	dirty = !1;
	rng = xe(31249);
	last = new G(9999, 0, 0);
	idle = 0;
	step = new G();
	constructor(e, t) {
		let n = Math.random, r = t.ambient, i = new Float32Array(r * 3), a = new Float32Array(r * 4);
		for (let e = 0; e < r; e++) i[e * 3] = (n() - .5) * 17, i[e * 3 + 1] = (n() - .5) * 7.9, i[e * 3 + 2] = -3.5 + n() * 7.5, a[e * 4] = n() * 6.283, a[e * 4 + 1] = .25 + n() * .9, a[e * 4 + 2] = .4 + n() * 1.4, a[e * 4 + 3] = .7 + 1.05 * n() ** 2.2;
		let o = new B();
		o.setAttribute("position", new W(i, 3)), o.setAttribute("seed", new W(a, 4));
		let s = {
			transparent: !0,
			depthWrite: !1,
			depthTest: !0,
			blending: 5,
			blendSrc: 201,
			blendDst: 205
		};
		this.material = new U({
			vertexShader: ga,
			fragmentShader: ha,
			...s,
			uniforms: {
				uTime: e.uTime,
				uWind: e.uWind,
				uScale: { value: 400 },
				uSize: { value: .022 },
				uAmbient: { value: 0 }
			}
		}), this.ambient = new ge(o, this.material), this.ambient.frustumCulled = !1, this.ambient.renderOrder = 6, this.N = t.reduced ? 1 : t.spray, this.pos = new Float32Array(this.N * 3), this.vel = new Float32Array(this.N * 3), this.birth = new Float32Array(this.N).fill(-999), this.rnd = new Float32Array(this.N * 2);
		let c = new B();
		c.setAttribute("position", new W(this.pos, 3).setUsage(w)), c.setAttribute("aVel", new W(this.vel, 3).setUsage(w)), c.setAttribute("aBirth", new W(this.birth, 1).setUsage(w)), c.setAttribute("aRnd", new W(this.rnd, 2).setUsage(w)), this.sprayMaterial = new U({
			vertexShader: _a,
			fragmentShader: ha,
			...s,
			depthTest: !1,
			uniforms: {
				uTime: e.uTime,
				uWind: e.uWind,
				uScale: { value: 400 },
				uSize: { value: .03 },
				uLife: { value: 1.9 }
			}
		}), this.spray = new ge(c, this.sprayMaterial), this.spray.frustumCulled = !1, this.spray.renderOrder = 7, this.spray.visible = !t.reduced;
	}
	setScale(e, t) {
		let n = e / (2 * Math.tan(t * Math.PI / 360));
		this.material.uniforms.uScale.value = n, this.sprayMaterial.uniforms.uScale.value = n;
	}
	spawn(e, t, n, r, i) {
		let a = this.rng, o = r, s = this.head;
		this.head = (this.head + 1) % this.N;
		let c = s * 3, l = () => (a() - .5) * 2;
		this.pos[c] = e.x + l() * .06 * o + t.x * .04, this.pos[c + 1] = e.y + l() * .06 * o + t.y * .04, this.pos[c + 2] = e.z + l() * .06 * o + t.z * .04;
		let u = .05 + .3 * a() ** 1.4;
		this.vel[c] = t.x * u + n.x * .1 + l() * .18 * o, this.vel[c + 1] = t.y * u + n.y * .1 + (.02 + .3 * a()) * o, this.vel[c + 2] = t.z * u + n.z * .1 + l() * .13 * o, this.birth[s] = i, this.rnd[s * 2] = .45 + .75 * a() ** 1.6, this.rnd[s * 2 + 1] = a(), this.dirty = !0;
	}
	emit(e, t, n, r, i, a) {
		if (this.N <= 1) return;
		if (!n || !a) {
			this.last.set(9999, 0, 0);
			return;
		}
		if (this.last.x > 9e3) {
			this.last.copy(n);
			return;
		}
		let o = n.distanceTo(this.last), s = Math.min(6, Math.floor(o / .06));
		for (let e = 1; e <= s; e++) this.rng() < .3 || (this.step.lerpVectors(this.last, n, e / s), this.spawn(this.step, r, i, 1, t));
		s > 0 ? (this.last.copy(n), this.idle = 0) : (this.idle += e, this.idle > .38 && (this.spawn(n, r, i, .8, t), this.idle = 0));
	}
	burst(e, t, n) {
		if (!(this.N <= 1)) for (let r = 0; r < 12; r++) this.spawn(e, t, new G(), 1.8, n);
	}
	flush() {
		if (!this.dirty) return;
		let e = this.spray.geometry;
		for (let t of [
			"position",
			"aVel",
			"aBirth",
			"aRnd"
		]) e.getAttribute(t).needsUpdate = !0;
		this.dirty = !1;
	}
	alive(e) {
		let t = 0, n = this.sprayMaterial.uniforms.uLife.value;
		for (let r = 0; r < this.N; r++) {
			let i = e - this.birth[r];
			i >= 0 && i <= n * 1.25 && t++;
		}
		return t;
	}
	dispose() {
		this.ambient.geometry.dispose(), this.spray.geometry.dispose(), this.material.dispose(), this.sprayMaterial.dispose();
	}
}, ya = [
	1.5,
	1.25,
	1
], ba = class {
	startDpr;
	samples = [];
	step = 0;
	cooldown = 0;
	budget;
	constructor(e, t = 19) {
		this.startDpr = e, this.budget = t, this.step = Math.max(0, ya.findIndex((t) => t <= e + 1e-6));
	}
	get dpr() {
		return Math.min(this.startDpr, ya[this.step]);
	}
	sample(e, t) {
		if (!t || e > 250) return null;
		if (this.cooldown > 0) return this.cooldown--, null;
		if (this.samples.push(e), this.samples.length < 90) return null;
		let n = this.samples.slice().sort((e, t) => e - t), r = n[n.length >> 1];
		return this.samples = [], r > this.budget && this.step < ya.length - 1 ? (this.step++, this.cooldown = 60, this.dpr) : null;
	}
}, xa = {
	frequency: .8,
	damping: .85
}, Sa = (e) => `vec3(${e.map((e) => e.toFixed(4)).join(", ")})`, Ca = "varying vec3 vW; void main() { vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0); }", wa = `
uniform float uReveal;
#define NS 48
uniform vec4 uSpheres[NS];
uniform int uCount;
uniform mat4 uInner;
uniform vec4 uBox; // xz bounds of where the form can shade the floor
const vec3 KEY = ${Sa(Ve)};
varying vec3 vW;
void main() {
  if (vW.x < uBox.x || vW.x > uBox.y || vW.z < uBox.z || vW.z > uBox.w) { gl_FragColor = vec4(1.0); return; }
  float occ = 0.0, vis = 1.0;
  for (int i = 0; i < NS; i++) {
    if (i >= uCount) break;
    vec4 s = uSpheres[i];
    vec3 c = (uInner * vec4(s.xyz, 1.0)).xyz - vW;
    float d = length(c);
    occ += max(c.y / d, 0.0) * (s.w * s.w) / (d * d);
    float t = dot(c, KEY);
    if (t > 0.0) { float dr = sqrt(max(dot(c, c) - t * t, 0.0)); float w = 0.05 + 0.16 * t; vis *= 1.0 - (1.0 - smoothstep(s.w - w, s.w + w, dr)) * 0.5; }
  }
  float shade = mix(1.0, clamp(1.0 - occ * 0.5, 0.0, 1.0), 0.75) * mix(1.0, vis, 0.42);
  // daylight shadow is cool and a little green
  vec3 tint = mix(vec3(0.86, 0.9, 0.84), vec3(1.0), shade);
  vec3 k = mix(shade, 1.0, 0.08) * mix(tint, vec3(1.0), 0.4);
  float fade = exp(-length(vW.xz - vec2(1.0, -0.5)) * 0.14) * uReveal;
  gl_FragColor = vec4(mix(vec3(1.0), k, fade), 1.0);
}`, Ta = class {
	renderer;
	scene3 = new pe();
	rig;
	limbs = [];
	pollen;
	insect;
	flora;
	opts;
	shared;
	rt;
	composite = new pe();
	compositeCam = new fe(-1, 1, 1, -1, 0, 1);
	cmat;
	wire;
	floorMat = null;
	raycaster = new he();
	reach;
	time = 0;
	introTime = 0;
	last = 0;
	running = !1;
	raf = 0;
	intro;
	pointer = {
		x: 0,
		y: 0
	};
	pointerNdc = new D(9, 9);
	pointerInside = !1;
	lightX = Ci(-.55);
	lightY = Ci(.83);
	contact = {
		x: 0,
		y: 0,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		strength: 0
	};
	contactLimb = -1;
	hasHit = !1;
	hitW = new G();
	hitNW = new G();
	hitL = new G();
	lastL = new G();
	velL = new G();
	velW = new G();
	pressBoost = 0;
	pressed = !1;
	panelRect = new r();
	frameListeners = [];
	dirty = !0;
	quality;
	maxDpr;
	frames = 0;
	lastFrameMs = 0;
	stats = {
		brush: 0,
		render: 0
	};
	constructor(t) {
		this.opts = t;
		let { scene: n, world: i } = t;
		this.renderer = new mi({
			canvas: t.canvas,
			antialias: !1,
			alpha: !1,
			powerPreference: "high-performance",
			preserveDrawingBuffer: t.manual
		}), this.renderer.outputColorSpace = R, this.renderer.toneMapping = 0;
		let a = this.renderer.extensions;
		if (!a.has("EXT_color_buffer_float") && !a.has("EXT_color_buffer_half_float")) throw Error("Half-float render targets are not supported");
		let o = a.has("OES_texture_float_linear");
		this.rig = new Di(n), this.scene3.add(this.rig.pivot);
		let s = this.rig.inner;
		this.shared = {
			uTime: { value: 0 },
			uWind: { value: +!t.reducedMotion },
			uHaze: { value: .22 },
			uHazeFit: { value: 1 },
			uRes: { value: new D(1, 1) },
			uScanO: { value: new G(...n.scanOrigin) },
			uScanR: { value: 0 },
			uScanOn: { value: +!t.reducedMotion },
			uLag: { value: new G(...ki) },
			uWire: { value: 0 },
			uReveal: { value: +!!t.reducedMotion },
			uDebug: { value: Number(new URLSearchParams(location.search).get("debug")) || 0 }
		};
		let c = new H(new me(2, 2), new U({
			vertexShader: Hi,
			fragmentShader: Ui,
			uniforms: this.shared,
			depthWrite: !1,
			depthTest: !1
		}));
		if (c.frustumCulled = !1, c.renderOrder = -10, this.scene3.add(c), n.floorY !== null) {
			let t = i.spheres, a = Array.from({ length: t.length / 4 }, (e, t) => t).sort((e, n) => t[e * 4 + 1] - t[n * 4 + 1]).slice(0, 48), o = a.map((e) => new r(t[e * 4], t[e * 4 + 1], t[e * 4 + 2], t[e * 4 + 3]));
			for (; o.length < 48;) o.push(new r(0, -100, 0, 0));
			let { min: s, max: c } = i.bounds;
			this.floorMat = new U({
				vertexShader: Ca,
				fragmentShader: wa,
				depthWrite: !1,
				blending: 5,
				blendSrc: 208,
				blendDst: 200,
				uniforms: {
					...this.shared,
					uSpheres: { value: o },
					uCount: { value: Math.min(48, a.length) },
					uInner: { value: new e() },
					uBox: { value: new r(s[0] - 3, c[0] + 5, s[2] - 4, c[2] + 3) }
				}
			});
			let l = new H(new me(40, 40), this.floorMat);
			l.rotation.x = -Math.PI / 2, l.position.y = n.floorY, l.renderOrder = -5, this.scene3.add(l);
		}
		let l = [];
		for (let e of i.limbs) {
			let n = new B();
			n.setAttribute("position", new W(e.pos, 3)), n.setAttribute("normal", new W(e.nrm, 3)), n.setAttribute("aRawN", new W(e.rawNrm, 3)), n.setAttribute("aSwell", new W(e.swell, 1)), n.setAttribute("aShade", new W(e.shade, 4)), n.setAttribute("aUv", new W(e.uv, 2)), n.setIndex(new W(e.index, 1));
			let r = new H(n, new U({
				vertexShader: Wi,
				fragmentShader: Gi,
				uniforms: this.shared,
				side: 2
			}));
			r.frustumCulled = !1, r.renderOrder = 2, s.add(r);
			let i = new yi(e.fieldW, e.fieldH, e.fieldPos, e.fieldNrm, void 0, 7 + this.limbs.length);
			t.reducedMotion && i.setTuning({
				damping: 1,
				frequency: 1.6
			});
			let a = new Ee(i.disp, e.fieldW, e.fieldH, V, b);
			a.wrapS = Le, a.wrapT = e.closed ? Le : qe, a.magFilter = a.minFilter = o ? q : le, a.needsUpdate = !0;
			let c = new re(), u = [], d = [], f = [];
			for (let e = 0; e <= 3; e++) {
				let t = e / 3, n = .5 * (1 - t * t);
				u.push(-n, t, 0, n, t, 0), d.push(0, t, 1, t);
			}
			u[u.length - 6] = 0, u[u.length - 3] = 0;
			for (let e = 0; e < 3; e++) {
				let t = e * 2;
				f.push(t, t + 1, t + 2, t + 1, t + 3, t + 2);
			}
			c.setAttribute("position", new g(u, 3)), c.setAttribute("uv", new g(d, 2)), c.setIndex(f), c.setAttribute("offset", new m(e.bOffset, 3)), c.setAttribute("nrm", new m(e.bNrm, 3)), c.setAttribute("rnd", new m(e.bRnd, 4)), c.setAttribute("aAux", new m(e.bAux, 4)), c.setAttribute("aFuv", new m(e.bFuv, 2)), c.instanceCount = e.blades;
			let p = new H(c, new U({
				vertexShader: Ki,
				fragmentShader: qi,
				side: 2,
				uniforms: {
					...this.shared,
					uField: { value: a },
					uPx: { value: .004 }
				}
			}));
			p.frustumCulled = !1, p.renderOrder = 1, s.add(p);
			let h = new B();
			h.setAttribute("position", new W(e.proxyPos, 3)), h.setAttribute("normal", new W(e.proxyNrm, 3)), h.setIndex(new W(e.proxyIndex, 1)), h.computeBoundingSphere(), h.computeBoundingBox();
			let _ = new H(h, new Be({ side: 2 }));
			_.visible = !1, _.userData.limb = this.limbs.length, s.add(_), this.limbs.push({
				built: e,
				field: i,
				tex: a,
				proxy: _
			}), l.push(e.wire), p.material.userData.isMoss = !0;
		}
		this.flora = new ra(i, this.shared), s.add(this.flora.group);
		let { min: u, max: d } = i.bounds;
		this.insect = t.reducedMotion ? null : new fa({
			perches: i.perches,
			openings: n.openings,
			spheres: i.spheres,
			bounds: {
				min: [
					Math.max(u[0], -.6),
					Math.max(u[1], -1.9),
					Math.max(u[2], -2.2)
				],
				max: [
					Math.min(d[0], 4),
					Math.min(d[1], 1.9),
					Math.min(d[2], 2.4)
				]
			},
			keepOutX: n.keepOutX
		}), this.insect && s.add(this.insect.group), this.pollen = new va({
			uTime: this.shared.uTime,
			uWind: this.shared.uWind
		}, {
			ambient: 3200,
			spray: 520,
			reduced: t.reducedMotion
		}), this.scene3.add(this.pollen.ambient, this.pollen.spray);
		let f = l.reduce((e, t) => e + t.length, 0), p = new Float32Array(f), h = 0;
		for (let e of l) p.set(e, h), h += e.length;
		let _ = new B();
		_.setAttribute("position", new W(p, 3)), this.wire = new y(_, new U({
			vertexShader: Qi,
			fragmentShader: $i,
			uniforms: this.shared,
			transparent: !0,
			depthWrite: !1,
			depthTest: !1
		})), this.wire.frustumCulled = !1, this.wire.renderOrder = 8, this.wire.visible = !t.reducedMotion, s.add(this.wire);
		let v = new G(...n.scanOrigin), x = 0;
		for (let e of [u[0], d[0]]) for (let t of [u[1], d[1]]) for (let n of [u[2], d[2]]) x = Math.max(x, v.distanceTo(new G(e, t, n)));
		this.reach = x, this.rt = this.makeTarget(2, 2), this.cmat = new U({
			vertexShader: bi,
			fragmentShader: xi,
			depthTest: !1,
			depthWrite: !1,
			uniforms: {
				uScene: { value: this.rt.texture },
				uRes: { value: new D(1, 1) },
				uDpr: { value: 1 },
				uPanel: { value: this.panelRect },
				uRadius: { value: 26 },
				uGlass: { value: 0 },
				uLight: { value: new D(-.55, .83) },
				uExposure: { value: 1 },
				uTime: { value: 0 },
				uGlassMat: { value: new D(.12, 1.2) }
			}
		});
		let S = new H(new me(2, 2), this.cmat);
		S.frustumCulled = !1, this.composite.add(S), this.maxDpr = t.maxDpr, this.quality = new ba(t.maxDpr), this.intro = Fi(0, this.reach, t.reducedMotion), this.resize(), this.bindPointer();
	}
	makeTarget(e, t) {
		return new C(e, t, {
			type: I,
			samples: 4,
			depthBuffer: !0,
			minFilter: q,
			magFilter: q
		});
	}
	resize() {
		let e = this.opts.canvas, t = Math.max(1, e.clientWidth || window.innerWidth), n = Math.max(1, e.clientHeight || window.innerHeight), r = Math.min(window.devicePixelRatio || 1, this.maxDpr, t * n / 1e6 > 2.2 ? 1.5 : 2);
		this.renderer.setPixelRatio(r), this.renderer.setSize(t, n, !1);
		let i = Math.round(t * r), a = Math.round(n * r);
		this.dirty = !0, this.rig.camera.aspect = t / n, (i !== this.rt.width || a !== this.rt.height) && (this.rt.dispose(), this.rt = this.makeTarget(i, a), this.cmat.uniforms.uScene.value = this.rt.texture), this.shared.uRes.value.set(i, a), this.cmat.uniforms.uRes.value.set(i, a), this.cmat.uniforms.uDpr.value = r, this.pollen.setScale(a, this.rig.camera.fov), this.measurePanel();
	}
	measurePanel() {
		this.dirty = !0;
		let e = this.opts.panel, t = this.renderer.getPixelRatio();
		if (!e) {
			this.panelRect.set(-1e4, -1e4, 0, 0);
			return;
		}
		let n = e.getBoundingClientRect(), r = this.opts.canvas.getBoundingClientRect(), i = this.shared.uRes.value.y;
		this.panelRect.set((n.left - r.left + n.width / 2) * t, i - (n.top - r.top + n.height / 2) * t, n.width / 2 * t, n.height / 2 * t), this.cmat.uniforms.uRadius.value = (parseFloat(getComputedStyle(e).borderTopLeftRadius) || 26) * t;
	}
	bindPointer() {
		window.addEventListener("pointermove", (e) => this.setPointer(e.clientX, e.clientY, e.pointerType), { passive: !0 }), window.addEventListener("pointerdown", (e) => {
			this.setPointer(e.clientX, e.clientY, e.pointerType), this.pressBoost = 1, this.pressed = !0;
		}, { passive: !0 }), window.addEventListener("pointerup", (e) => {
			this.pressed = !1, e.pointerType !== "mouse" && this.clearPointer();
		}, { passive: !0 }), window.addEventListener("pointerout", (e) => {
			e.relatedTarget || this.clearPointer();
		}, { passive: !0 }), document.addEventListener("pointerleave", () => this.clearPointer()), window.addEventListener("blur", () => this.clearPointer());
	}
	setPointer(e, t, n = "mouse") {
		this.dirty = !0;
		let r = this.opts.canvas.getBoundingClientRect();
		this.pointerNdc.set((e - r.left) / r.width * 2 - 1, -((t - r.top) / r.height) * 2 + 1), n !== "touch" && (this.pointer = {
			x: e / window.innerWidth * 2 - 1,
			y: t / window.innerHeight * 2 - 1
		}), this.pointerInside = !0;
	}
	clearPointer() {
		this.pointerInside = !1, this.pointer = {
			x: 0,
			y: 0
		}, this.pointerNdc.set(9, 9), this.pressed = !1;
	}
	start() {
		if (this.running || (this.running = !0, this.last = performance.now(), this.opts.manual)) return;
		let e = (t) => {
			if (!this.running) return;
			this.raf = requestAnimationFrame(e);
			let n = t - this.last, r = Math.min(n / 1e3, 1 / 20);
			this.last = t, this.frame(r);
			let i = this.quality.sample(n, this.intro.done);
			i !== null && (this.maxDpr = i, this.resize());
		};
		this.raf = requestAnimationFrame(e);
	}
	stop() {
		this.running = !1, cancelAnimationFrame(this.raf);
	}
	advance(e, t = 60) {
		let n = Math.max(1, Math.round(e * t));
		for (let e = 0; e < n; e++) this.frame(1 / t, e === n - 1);
	}
	onceAfterFrame(e) {
		this.frameListeners.push(e);
	}
	getIntro() {
		return this.intro;
	}
	frame(e, t = !0) {
		let n = performance.now(), r = this.opts.reducedMotion;
		this.time += r ? 0 : e, this.introTime += e;
		let i = this.intro = Fi(this.introTime, this.reach, r);
		this.opts.onIntro?.(i);
		let a = this.shared;
		a.uTime.value = this.time, a.uScanOn.value = +!!i.scanOn, a.uScanR.value = i.scanR, a.uWire.value = i.wire, a.uReveal.value = r ? Math.min(1, this.introTime / .6) : Math.min(1, this.introTime / 2), this.wire.visible = i.wire > .002, this.cmat.uniforms.uGlass.value = i.glass, this.cmat.uniforms.uTime.value = this.time, this.pollen.material.uniforms.uAmbient.value = i.ambient;
		let o = this.rig.camera.aspect;
		this.rig.update(e, this.time, this.pointer, i.dolly, o, r || !!this.opts.still), this.shared.uHazeFit.value = this.rig.fit;
		let s = r ? 0 : this.pointer.x, c = r ? 0 : this.pointer.y;
		this.lightX = wi({
			...this.lightX,
			target: -.55 + s * .35
		}, xa, e), this.lightY = wi({
			...this.lightY,
			target: .83 + c * .2
		}, xa, e), this.cmat.uniforms.uLight.value.set(this.lightX.value, this.lightY.value);
		let l = this.rig.pixelWorld(a.uRes.value.y);
		this.rig.inner.traverse((e) => {
			let t = e.material;
			t?.userData?.isMoss && (t.uniforms.uPx.value = l);
		}), this.floorMat && this.floorMat.uniforms.uInner.value.copy(this.rig.inner.matrixWorld);
		let u = performance.now();
		this.updateBrush(e, i), this.stats.brush = performance.now() - u, this.insect && (i.insect && this.insect.enter(), this.insect.update(e, this.time, this.hasHit ? this.hitL : null, this.rig.camera)), this.pollen.flush();
		let d = r && i.done && this.limbs.every((e) => !e.field.isAwake()) && this.contact.strength < .002 && !this.dirty && this.frames > 0;
		if (t && !d) {
			this.dirty = !1;
			let e = performance.now();
			this.renderer.setRenderTarget(this.rt), this.renderer.render(this.scene3, this.rig.camera), this.renderer.setRenderTarget(null), this.renderer.render(this.composite, this.compositeCam), this.stats.render = performance.now() - e, this.frames++;
			let t = this.frameListeners;
			this.frameListeners = [];
			for (let e of t) e();
		}
		this.lastFrameMs = performance.now() - n;
	}
	updateBrush(e, t) {
		let n = t.done || t.scanR > this.reach * .6 ? 1 : 0, r = !1, i = -1;
		if (this.pointerInside && n > 0) {
			this.raycaster.setFromCamera(this.pointerNdc, this.rig.camera);
			let e = this.raycaster.intersectObjects(this.limbs.map((e) => e.proxy), !1);
			e.length && e[0].face && (this.hitW.copy(e[0].point), this.hitNW.copy(e[0].face.normal).transformDirection(e[0].object.matrixWorld), i = e[0].object.userData.limb, r = !0);
		}
		if (r) {
			this.hitL.copy(this.hitW), this.rig.inner.worldToLocal(this.hitL), this.hasHit && i === this.contactLimb || (this.lastL.copy(this.hitL), this.velL.set(0, 0, 0));
			let t = this.hitL.clone().sub(this.lastL).divideScalar(Math.max(e, .001));
			t.length() > 14 && t.setLength(0), this.velL.set(Ti(this.velL.x, t.x, 8e-4, e), Ti(this.velL.y, t.y, 8e-4, e), Ti(this.velL.z, t.z, 8e-4, e)), this.contact = {
				...this.contact,
				x: this.hitL.x,
				y: this.hitL.y,
				z: this.hitL.z,
				vx: this.velL.x,
				vy: this.velL.y,
				vz: this.velL.z
			}, this.contactLimb = i;
		}
		this.pressBoost = Ti(this.pressBoost, this.pressed ? .6 : 0, .02, e);
		let a = r ? 1 + this.pressBoost * .6 : 0;
		this.contact = {
			...this.contact,
			strength: Ti(this.contact.strength, a, r ? 1e-9 : 5e-4, e)
		}, this.limbs.forEach((t, n) => {
			let r = n === this.contactLimb && this.contact.strength > .002 ? this.contact : null;
			t.field.step(e, r) && (t.tex.needsUpdate = !0);
		}), this.velW.copy(this.velL).applyQuaternion(this.rig.pivot.quaternion), this.pollen.emit(e, this.time, r && !this.opts.reducedMotion ? this.hitW : null, this.hitNW, this.velW, n > 0), r && this.pressBoost > .98 && (this.pollen.burst(this.hitW, this.hitNW, this.time), this.pressBoost = .97), this.hasHit = r, r && this.lastL.copy(this.hitL);
	}
	fieldEnergy() {
		return this.limbs.reduce((e, t) => e + t.field.totalEnergy(), 0);
	}
	aliveMotes() {
		return this.pollen.alive(this.time);
	}
	get moss() {
		return {
			fiberCount: this.limbs.reduce((e, t) => e + t.built.blades, 0),
			grid: this.limbs[0].built
		};
	}
	project(e, t, n) {
		let r = new G(e, t, n);
		this.rig.inner.localToWorld(r), r.project(this.rig.camera);
		let i = this.opts.canvas.getBoundingClientRect();
		return [i.left + (r.x + 1) / 2 * i.width, i.top + (1 - r.y) / 2 * i.height];
	}
	surfacePoint(e, t, n) {
		let r = this.limbs[e].built, i = (Math.round(n * r.S) * (r.R + 1) + Math.round(t * r.R)) * 3;
		return this.project(r.pos[i], r.pos[i + 1], r.pos[i + 2]);
	}
	dispose() {
		this.stop(), this.pollen.dispose(), this.flora.dispose(), this.insect?.dispose();
		for (let e of this.limbs) e.tex.dispose();
		this.scene3.traverse((e) => {
			let t = e;
			t.geometry?.dispose(), t.material?.dispose?.();
		}), this.rt.dispose(), this.renderer.dispose();
	}
};
export { Ta as WorldApp };
