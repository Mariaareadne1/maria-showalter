/** Damped springs for the panel's surface response. Semi-implicit Euler, fixed substeps. */

export class Spring {
  value: number;
  velocity = 0;
  target: number;
  constructor(
    initial: number,
    /** Angular frequency (rad/s). */
    public omega: number,
    /** Damping ratio: 1 = no overshoot; < 1 = a gentle spring-back. */
    public zeta: number,
  ) {
    this.value = this.target = initial;
  }

  step(dt: number) {
    const k = this.omega * this.omega;
    const c = 2 * this.zeta * this.omega;
    const n = Math.max(1, Math.ceil(dt / (1 / 240)));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      this.velocity += (-k * (this.value - this.target) - c * this.velocity) * h;
      this.value += this.velocity * h;
    }
  }

  snap(v = this.target) {
    this.value = this.target = v;
    this.velocity = 0;
  }

  get resting(): boolean {
    return Math.abs(this.value - this.target) < 1e-3 && Math.abs(this.velocity) < 1e-3;
  }
}

/** Pointer position, presence, edge proximity, press and scroll slosh. */
export class JellyState {
  readonly x = new Spring(0, 16, 0.9);
  readonly y = new Spring(0, 16, 0.9);
  readonly hover = new Spring(0, 9, 1);
  readonly near = new Spring(0, 9, 1);
  readonly press = new Spring(0, 22, 0.42);
  readonly slosh = new Spring(0, 11, 0.5);
  private placed = false;

  constructor(private readonly enabled: boolean) {}

  pointer(x: number, y: number, hover: number, near: number) {
    if (!this.enabled) return;
    if (!this.placed) {
      this.x.snap(x);
      this.y.snap(y);
      this.placed = true;
    }
    this.x.target = x;
    this.y.target = y;
    this.hover.target = hover;
    this.near.target = near;
  }

  leave() {
    this.hover.target = 0;
    this.near.target = 0;
    this.press.target = 0;
  }

  setPress(down: boolean) {
    if (this.enabled) this.press.target = down ? 1 : 0;
  }

  /** A scroll impulse: the surface lags behind the content, then settles. */
  scrolled(dy: number) {
    if (!this.enabled) return;
    const kick = Math.max(-1, Math.min(1, dy / 80));
    this.slosh.velocity += kick * 26;
  }

  step(dt: number) {
    for (const s of this.springs) s.step(dt);
    if (Math.abs(this.slosh.value) > 9) this.slosh.value = Math.sign(this.slosh.value) * 9;
  }

  get resting(): boolean {
    return this.springs.every((s) => s.resting);
  }

  private get springs() {
    return [this.x, this.y, this.hover, this.near, this.press, this.slosh];
  }
}
