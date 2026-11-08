import { FRAG, VERT } from './shader';
import type { Treatment } from './treatments';

/** Everything the shader needs for one frame, in CSS px. */
export interface GlassFrame {
  canvas: [number, number];
  origin: [number, number];
  panel: [number, number, number, number];
  viewport: [number, number];
  pad: number;
  p: number;
  veil: boolean;
  ptr: [number, number];
  hover: number;
  near: number;
  press: number;
  slosh: number;
}

/** Source of the sky behind the sheet: the live renderer's canvas or an image. */
export type SkySource = HTMLCanvasElement | HTMLImageElement;

/** Texture width (px) the sky is copied at; frost is blurred, refraction is soft. */
const COPY_SCALE = 0.5;

export class GlassLayer {
  readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly tex: WebGLTexture;
  private readonly uniforms = new Map<string, WebGLUniformLocation | null>();
  private readonly copy = document.createElement('canvas');
  private readonly copyCtx: CanvasRenderingContext2D | null;
  private texSize: [number, number] = [0, 0];
  /** uv mapping for the current source (viewport px → uv). */
  private src: [number, number, number, number] = [0, 0, 0, 0];
  private hasSky = false;
  /** Mip level of the texture relative to CSS px (copy at 0.5 → level 0 = 2 CSS px). */
  private skyLod = 1;

  constructor(readonly canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    if (!gl) throw new Error('WebGL 2 is not available.');
    this.gl = gl;
    this.program = link(gl, VERT, FRAG);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const loc = gl.getAttribLocation(this.program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.copyCtx = this.copy.getContext('2d', { alpha: false });
  }

  get ready(): boolean {
    return this.hasSky;
  }

  /**
   * Copies the live sky (a full-viewport canvas) into the texture at half CSS
   * resolution. Must run in the same task the renderer drew in (its buffer is not
   * preserved). Returns the time it took, for throttling.
   */
  uploadLive(sky: HTMLCanvasElement, viewport: [number, number]): number {
    const t0 = performance.now();
    const w = Math.max(2, Math.round(viewport[0] * COPY_SCALE));
    const h = Math.max(2, Math.round(viewport[1] * COPY_SCALE));
    if (!this.copyCtx) return 0;
    if (this.copy.width !== w || this.copy.height !== h) {
      this.copy.width = w;
      this.copy.height = h;
    }
    this.copyCtx.drawImage(sky, 0, 0, w, h);
    this.upload(this.copy, w, h);
    this.src = [1 / viewport[0], 1 / viewport[1], 0, 0];
    this.skyLod = Math.log2(1 / COPY_SCALE);
    return performance.now() - t0;
  }

  /** Uses an image laid out like `background-size: cover; background-position: px py`. */
  uploadImage(img: HTMLImageElement, viewport: [number, number], posX = 0.5, posY = 0.35) {
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih) return;
    this.upload(img, iw, ih);
    this.mapCover(iw, ih, viewport, posX, posY);
    this.imageInfo = { iw, ih, posX, posY };
  }

  private imageInfo: { iw: number; ih: number; posX: number; posY: number } | null = null;

  /** Re-fits an image source after a resize. */
  refit(viewport: [number, number]) {
    const i = this.imageInfo;
    if (i) this.mapCover(i.iw, i.ih, viewport, i.posX, i.posY);
  }

  private mapCover(iw: number, ih: number, viewport: [number, number], posX: number, posY: number) {
    const [vw, vh] = viewport;
    const s = Math.max(vw / iw, vh / ih);
    const dw = iw * s, dh = ih * s;
    const ox = (vw - dw) * posX, oy = (vh - dh) * posY;
    this.src = [1 / dw, 1 / dh, -ox / dw, -oy / dh];
    // texels per CSS px = 1/s, so CSS-px blur level → texture level is offset by log2(s)
    this.skyLod = Math.log2(s);
  }

  /** Back to the image after the live renderer stops for good (unsupported, lost). */
  liveEnded() {
    this.imageInfo = null;
  }

  private upload(source: TexImageSource, w: number, h: number) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    if (this.texSize[0] !== w || this.texSize[1] !== h) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      this.texSize = [w, h];
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
    }
    gl.generateMipmap(gl.TEXTURE_2D);
    this.hasSky = true;
  }

  resize(cssW: number, cssH: number, scale: number) {
    const w = Math.max(1, Math.round(cssW * scale));
    const h = Math.max(1, Math.round(cssH * scale));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  draw(f: GlassFrame, t: Treatment) {
    if (!this.hasSky) return;
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    const u = (name: string) => {
      if (!this.uniforms.has(name)) this.uniforms.set(name, gl.getUniformLocation(this.program, name));
      return this.uniforms.get(name)!;
    };
    gl.uniform1i(u('uSky'), 0);
    gl.uniform2f(u('uCanvas'), f.canvas[0], f.canvas[1]);
    gl.uniform1f(u('uScale'), this.canvas.width / Math.max(1, f.canvas[0]));
    gl.uniform2f(u('uOrigin'), f.origin[0], f.origin[1]);
    gl.uniform4f(u('uPanel'), ...f.panel);
    gl.uniform2f(u('uViewport'), f.viewport[0], f.viewport[1]);
    gl.uniform4f(u('uSrc'), ...this.src);
    gl.uniform1f(u('uP'), f.p);
    gl.uniform1f(u('uPad'), f.pad);
    gl.uniform1f(u('uSkyLod'), this.skyLod);
    gl.uniform1f(u('uVeilOn'), f.veil ? 1 : 0);
    gl.uniform1f(u('uRadius'), t.radius);
    gl.uniform1f(u('uBevel'), t.bevel);
    gl.uniform1f(u('uRefract'), t.refract);
    gl.uniform1f(u('uDispersion'), t.dispersion);
    gl.uniform1f(u('uFrostEdge'), t.frostEdge);
    gl.uniform1f(u('uFrostCore'), t.frostCore);
    gl.uniform1f(u('uFrostVar'), t.frostVar);
    gl.uniform1f(u('uRipple'), t.ripple);
    gl.uniform3f(u('uTint0'), ...t.tint0);
    gl.uniform3f(u('uTint1'), ...t.tint1);
    gl.uniform1f(u('uTintA0'), t.tintA0);
    gl.uniform1f(u('uTintA1'), t.tintA1);
    gl.uniform1f(u('uGain'), t.gain);
    gl.uniform1f(u('uLift'), t.lift);
    gl.uniform1f(u('uCoreShade'), t.coreShade);
    gl.uniform1f(u('uSat'), t.sat);
    gl.uniform1f(u('uSpec'), t.spec);
    gl.uniform1f(u('uInner'), t.inner);
    gl.uniform1f(u('uAbsorb'), t.absorb);
    gl.uniform1f(u('uGrain'), t.grain);
    gl.uniform1f(u('uInkLight'), t.ink === 'light' ? 1 : 0);
    gl.uniform1f(u('uContrastLum'), t.contrastLum);
    gl.uniform2f(u('uPtr'), f.ptr[0], f.ptr[1]);
    gl.uniform1f(u('uHover'), f.hover);
    gl.uniform1f(u('uNear'), f.near);
    gl.uniform1f(u('uPress'), f.press);
    gl.uniform1f(u('uSlosh'), f.slosh);
    gl.uniform1f(u('uJelly'), t.jelly);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose() {
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

function link(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`Glass shader: ${gl.getShaderInfoLog(s)}`);
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`Glass program: ${gl.getProgramInfoLog(p)}`);
  return p;
}
