import * as THREE from "three";
import gsap from "gsap";

/*
  Design C, "The touch test": a tabletop split in two, rendered with Three.js.

  Left of x = 0 is an ordinary surface: it was cleaned, the disinfectant dried, and
  every touch now leaves a fingerprint and germs that stay. Right of x = 0 is a
  ProteGo-treated surface: the bonded film sends out a ripple and the germs that
  land break apart into small "+" sparks.

  All animation runs on the GPU from birth and death times written into instanced
  attributes, so a touch is a handful of array writes and nothing is tweened per germ.
  An illustration, not lab data: germs are drawn thousands of times larger than life.
*/

export type Side = "ordinary" | "protego";
export type TouchInfo = {
  side: Side;
  germs: number;
  /** seconds until the last germ on the ProteGo side has been disrupted */
  settle: number;
};

const MAX_RIPPLES = 10;
const RIPPLE_SPEED = 2.4; // world units a second
const FOV = 34;
const TILT = THREE.MathUtils.degToRad(26);
const PRINT = 0.62; // fingertip height in world units

function hex(h: string) {
  const n = parseInt(h.slice(1), 16);
  const c = (v: number) => (v / 255).toFixed(4);
  return `vec3(${c((n >> 16) & 255)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}

// Brand palette only. Written straight into GLSL as sRGB, so no colour management is involved.
const COMMON = /* glsl */ `
#define MAX_RIPPLES ${MAX_RIPPLES}
const float RIPPLE_SPEED = ${RIPPLE_SPEED.toFixed(2)};
const float AMP = 0.05;

const vec3 SPRING = ${hex("#F8F8F9")};
const vec3 PANEL = ${hex("#F2F2F2")};
const vec3 TQ = ${hex("#6AE6DC")};
const vec3 TQ_DEEP = ${hex("#2CC2B6")};
const vec3 TQ_TINT = ${hex("#E9FFFD")};
const vec3 ORIENT = ${hex("#00627B")};
const vec3 ORIENT_DEEP = ${hex("#0E4A59")};
const vec3 ORIENT_TINT = ${hex("#CFF1F9")};
const vec3 SHERPA_DEEP = ${hex("#0D2C33")};
const vec3 SHERPA_TINT = ${hex("#BDDFE7")};

uniform float uTime;
uniform vec4 uRipples[MAX_RIPPLES]; // xy centre, z start time, w strength

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float plusSdf(vec2 p, float len, float th) {
  vec2 a = abs(p);
  return min(max(a.x - len, a.y - th), max(a.x - th, a.y - len));
}

// 0 on the ordinary half, 1 on the treated half; ripples stop at the seam
float protegoMask(float x) { return smoothstep(0.02, 0.14, x); }

float rippleHeight(vec2 p) {
  float h = 0.0;
  for (int i = 0; i < MAX_RIPPLES; i++) {
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (age < 0.0 || age > 3.0) continue;
    float x = distance(p, r.xy) - age * RIPPLE_SPEED;
    h += sin(x * 12.0) * exp(-x * x * 4.0) * exp(-age * 1.3) * r.w;
  }
  return h * protegoMask(p.x);
}

float rippleRing(vec2 p) {
  float g = 0.0;
  for (int i = 0; i < MAX_RIPPLES; i++) {
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (age < 0.0 || age > 3.0) continue;
    float x = distance(p, r.xy) - age * RIPPLE_SPEED;
    g += exp(-x * x * 60.0) * exp(-age * 1.1) * r.w;
  }
  return g * protegoMask(p.x);
}

// Germ life: x = scale, y = disrupted flash, z = sideways drift when wiped away
vec3 germState(vec2 time, float kind) {
  float age = uTime - time.x;
  if (age < 0.0) return vec3(0.0);
  float t1 = clamp(age / 0.38, 0.0, 1.0) - 1.0;
  float s = 1.0 + 2.4 * t1 * t1 * t1 + 1.4 * t1 * t1; // lands with a small overshoot
  float flash = 0.0;
  float drift = 0.0;
  float dAge = uTime - time.y;
  if (dAge > 0.0) {
    if (kind > 0.5) {
      float k = clamp(dAge / 0.3, 0.0, 1.0);
      s *= (1.0 + 0.45 * sin(k * 1.5708)) * (1.0 - smoothstep(0.45, 1.0, k));
      flash = smoothstep(0.0, 0.25, k);
    } else {
      float k = clamp(dAge / 0.35, 0.0, 1.0);
      s *= 1.0 - k;
      drift = k * 0.35;
    }
  }
  return vec3(s, flash, drift);
}
`;

const SURFACE_VERT = /* glsl */ `
${COMMON}
varying vec2 vP;
varying vec3 vN;
varying vec3 vWorld;
void main() {
  vec3 pos = position;
  float e = 0.04;
  float h = rippleHeight(pos.xy);
  float hx = rippleHeight(pos.xy + vec2(e, 0.0));
  float hy = rippleHeight(pos.xy + vec2(0.0, e));
  pos.z += h * AMP;
  vN = normalize(vec3(-(hx - h) * AMP / e, -(hy - h) * AMP / e, 1.0));
  vP = pos.xy;
  vec4 wp = modelMatrix * vec4(pos, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const SURFACE_FRAG = /* glsl */ `
${COMMON}
uniform vec2 uPointer;
uniform vec2 uWipe; // x position of the cloth, active flag
uniform vec2 uRes;
varying vec2 vP;
varying vec3 vN;
varying vec3 vWorld;
void main() {
  vec2 p = vP;
  float pro = protegoMask(p.x);

  // a calm, pale countertop; the treated half carries a faint turquoise film
  float grain = noise(p * 40.0) * 0.55 + noise(p * 6.0) * 0.45;
  vec3 ordinary = mix(PANEL, SPRING, grain);
  vec3 film = mix(TQ_TINT, ORIENT_TINT, noise(p * 0.9 + 3.0) * 0.55);
  vec3 col = mix(ordinary, film, pro);

  float ring = rippleRing(p);

  // the charged "+" tips of the bonded layer, lighting up as the wave passes
  float cell = 0.34;
  vec2 id = floor(p / cell);
  vec2 q = (fract(p / cell) - 0.5) * cell;
  float d = plusSdf(q, 0.042, 0.008);
  float aa = fwidth(d);
  float plus = 1.0 - smoothstep(-aa, aa, d);
  float twinkle = 0.5 + 0.5 * sin(uTime * 1.6 + hash(id) * 6.2831);
  col = mix(col, ORIENT, plus * pro * (0.08 + 0.06 * twinkle));
  col = mix(col, TQ_DEEP, plus * pro * clamp(ring * 3.0, 0.0, 1.0));

  // the ripple: a turquoise front, and light and shade on the moving slopes
  col = mix(col, TQ_DEEP, clamp(ring, 0.0, 1.0) * 0.45);
  col += dot(vN.xy, normalize(vec2(-0.5, 0.8))) * 0.35 * pro;

  vec3 L = normalize(vec3(-0.4, 0.5, 1.0));
  vec3 V = normalize(cameraPosition - vWorld);
  float spec = pow(max(dot(reflect(-L, vN), V), 0.0), 48.0);
  col += spec * (0.05 + 0.25 * pro);

  // the seam between the two halves
  col = mix(col, ORIENT, exp(-p.x * p.x * 4000.0) * 0.6);
  col = mix(col, TQ_DEEP, exp(-max(p.x, 0.0) * 9.0) * step(0.0, p.x) * 0.12);

  // cleaning cloth: a teal leading edge with a wet sheen trailing behind it
  float behind = uWipe.x - p.x;
  float band = exp(-pow(behind * 2.4, 2.0)) * uWipe.y;
  float wet = smoothstep(0.0, 0.3, behind) * (1.0 - smoothstep(0.3, 2.2, behind)) * uWipe.y;
  float streak = 0.6 + 0.4 * sin(p.y * 55.0 + noise(p * 3.0) * 4.0);
  col = mix(col, ORIENT_TINT, band * streak * 0.8);
  col = mix(col, SHERPA_TINT, exp(-pow(behind * 9.0, 2.0)) * uWipe.y * 0.7);
  col += wet * streak * 0.06;

  // a soft pool of light that follows the pointer, and a gentle vignette
  vec2 lp = p - uPointer;
  col *= 0.965 + 0.05 * exp(-dot(lp, lp) * 0.25);
  vec2 s = gl_FragCoord.xy / uRes;
  float vig = smoothstep(1.05, 0.35, length((s - 0.5) * vec2(1.0, 1.2)));
  col = mix(col * 0.93, col, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

const PRINT_VERT = /* glsl */ `
${COMMON}
attribute vec3 aPos;   // x, y, side (0 ordinary, 1 ProteGo)
attribute vec3 aShape; // rotation, size, seed
attribute vec2 aTime;  // birth, wiped
varying vec2 vUv;
varying vec3 vInfo;
varying float vFade;
void main() {
  vec2 q = position.xy * vec2(0.78, 1.0) * aShape.y;
  float c = cos(aShape.x), s = sin(aShape.x);
  q = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
  vec2 p = aPos.xy + q;
  vUv = position.xy;
  vInfo = vec3(aShape.z, uTime - aTime.x, aPos.z);
  vFade = step(aTime.x, uTime) * (1.0 - smoothstep(aTime.y, aTime.y + 0.35, uTime));
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 0.003 + rippleHeight(p) * AMP, 1.0);
}
`;

const PRINT_FRAG = /* glsl */ `
${COMMON}
varying vec2 vUv;
varying vec3 vInfo;
varying float vFade;
void main() {
  if (vFade <= 0.0) discard;
  vec2 uv = vUv;
  float seed = vInfo.x;
  float age = vInfo.y;
  float side = vInfo.z;

  // fingertip outline: rounder at the tip, a little fuller at the base
  vec2 o = uv * 2.0;
  o.y *= o.y > 0.0 ? 0.94 : 1.12;
  float r = length(o) + (noise(uv * 7.0 + seed * 11.0) - 0.5) * 0.16;
  float grow = clamp(age / 0.16, 0.0, 1.0) * 1.1;
  float mask = smoothstep(1.0, 0.78, r) * (1.0 - smoothstep(grow - 0.15, grow, r));
  float pressure = mix(0.5, 1.0, smoothstep(1.0, 0.1, r));

  // ridges: a whorl around a core, flattening into arches towards the crease
  vec2 core = vec2(sin(seed * 12.0) * 0.06, 0.02 + cos(seed * 7.0) * 0.06);
  vec2 d = uv - core;
  float whorl = length(d * vec2(1.0, 0.82)) + 0.03 * sin(atan(d.y, d.x) * 2.0 + seed * 9.0);
  float arch = -uv.y * 0.9 + uv.x * uv.x * 1.4 + 0.12;
  float field = mix(whorl, arch, smoothstep(-0.05, -0.32, uv.y));
  field += (noise(uv * 4.0 + seed * 3.0) - 0.5) * 0.05;
  float f = field * 26.0;
  float ridge = smoothstep(0.35, 0.75, 0.5 + 0.5 * cos(f * 6.2831853));
  ridge = mix(ridge, 0.5, clamp(fwidth(f) * 1.5, 0.0, 1.0)); // fade to a smudge when too small to resolve
  float pores = smoothstep(0.12, 0.42, noise(uv * 34.0 + seed * 17.0));
  float a = mask * pressure * ridge * mix(0.55, 1.0, pores);

  // Ordinary: the print stays. ProteGo: the layer is antimicrobial, not anti-smudge,
  // so a faint print remains; only the germs on it are disrupted.
  float opacity = side < 0.5 ? 0.42 : mix(0.42, 0.12, smoothstep(0.35, 1.4, age));
  vec3 col = side < 0.5 ? SHERPA_DEEP : mix(SHERPA_DEEP, ORIENT, 0.5);
  float glow = side > 0.5 ? smoothstep(0.2, 0.35, age) * (1.0 - smoothstep(0.5, 1.2, age)) : 0.0;
  col = mix(col, TQ_DEEP, glow);
  gl_FragColor = vec4(col, a * opacity * vFade);
}
`;

const GERM_VERT = /* glsl */ `
${COMMON}
attribute vec3 aPos;  // x, y, size
attribute vec2 aTime; // birth, death
attribute float aSeed;
attribute float aKind; // 0 lingers until wiped, 1 disrupted on contact
varying vec3 vWorld;
varying float vFlash;
varying float vTone;
void main() {
  vec3 st = germState(aTime, aKind);
  float size = aPos.z * st.x;
  vec3 n = position; // unit sphere
  float sp = sin(n.x * 7.0 + aSeed * 40.0) * sin(n.y * 7.0 + aSeed * 23.0) * sin(n.z * 7.0 + aSeed * 31.0);
  float bump = pow(max(sp, 0.0), 1.5) * 0.9 + 0.06 * sin(uTime * 2.2 + aSeed * 50.0 + n.y * 5.0) * (1.0 - aKind);
  bump *= 1.0 + st.y * 1.2;
  vec3 local = n * (1.0 + bump);
  float ang = aSeed * 6.2831 + uTime * 0.25 * (1.0 - aKind);
  float c = cos(ang), s = sin(ang);
  local.xy = mat2(c, s, -s, c) * local.xy;
  local.z *= 0.8;
  float age = uTime - aTime.x;
  float fall = 1.0 - clamp(age / 0.38, 0.0, 1.0);
  vec3 wp = vec3(aPos.xy + vec2(st.z, 0.0), 0.0) + local * size;
  wp.z += size * 0.75 + fall * fall * 0.5 * step(0.0, age) + rippleHeight(aPos.xy) * AMP;
  vWorld = wp;
  vFlash = st.y;
  vTone = fract(aSeed * 7.13);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`;

const GERM_FRAG = /* glsl */ `
${COMMON}
varying vec3 vWorld;
varying float vFlash;
varying float vTone;
void main() {
  // faceted normals show off the knobbly shape
  vec3 N = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  vec3 V = normalize(cameraPosition - vWorld);
  if (dot(N, V) < 0.0) N = -N;
  vec3 L = normalize(vec3(-0.45, 0.35, 1.0));
  float diff = max(dot(N, L), 0.0);
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.5);
  vec3 body = mix(SHERPA_DEEP, ORIENT_DEEP, vTone);
  vec3 col = body * (0.6 + 0.7 * diff) + SHERPA_TINT * rim * 0.35;
  col = mix(col, mix(TQ_DEEP, TQ, 0.5), vFlash);
  gl_FragColor = vec4(col, 1.0);
}
`;

const SHADOW_VERT = /* glsl */ `
${COMMON}
attribute vec3 aPos;
attribute vec2 aTime;
attribute float aKind;
varying vec2 vUv;
varying float vA;
void main() {
  vec3 st = germState(aTime, aKind);
  vec2 p = aPos.xy + vec2(st.z, 0.0) + vec2(0.35, -0.25) * aPos.z + position.xy * aPos.z * st.x * 3.2;
  vUv = position.xy;
  vA = clamp(st.x, 0.0, 1.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 0.002 + rippleHeight(p) * AMP, 1.0);
}
`;

const SHADOW_FRAG = /* glsl */ `
${COMMON}
varying vec2 vUv;
varying float vA;
void main() {
  float a = smoothstep(1.0, 0.0, length(vUv) * 2.0);
  gl_FragColor = vec4(SHERPA_DEEP, a * a * 0.28 * vA);
}
`;

const SPARK_VERT = /* glsl */ `
${COMMON}
uniform float uPx;
attribute vec3 aVel;
attribute vec2 aTime; // birth, seed
varying float vA;
varying float vRot;
void main() {
  float t = uTime - aTime.x;
  float k = clamp(t / 0.8, 0.0, 1.0);
  float alive = step(0.0, t) * step(t, 0.8);
  float e = 1.0 - pow(1.0 - k, 3.0);
  vec3 pos = position + aVel * e;
  pos.z += rippleHeight(position.xy) * AMP;
  vec4 mv = viewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = alive * uPx * 0.075 * (1.0 - k * 0.5) / -mv.z;
  vA = alive * (1.0 - k * k);
  vRot = aTime.y * 6.2831 + k * 2.0;
}
`;

const SPARK_FRAG = /* glsl */ `
${COMMON}
varying float vA;
varying float vRot;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float c = cos(vRot), s = sin(vRot);
  q = mat2(c, s, -s, c) * q;
  float a = (1.0 - smoothstep(0.0, 0.05, plusSdf(q, 0.42, 0.12))) * vA;
  if (a < 0.01) discard;
  gl_FragColor = vec4(mix(TQ_DEEP, ORIENT, 0.25), a);
}
`;

function attr(count: number, size: number, fill = 0) {
  const a = new THREE.InstancedBufferAttribute(new Float32Array(count * size).fill(fill), size);
  a.setUsage(THREE.DynamicDrawUsage);
  return a;
}

type Options = { reducedMotion: boolean; lite: boolean };

export class TouchScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  private raycaster = new THREE.Raycaster();
  private ground = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private t0 = performance.now();
  private reduced: boolean;

  private shared = {
    uTime: { value: 0 },
    uRipples: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, -100, 0)) },
  };
  private surfaceUniforms = {
    uPointer: { value: new THREE.Vector2(0, 0) },
    uWipe: { value: new THREE.Vector2(-100, 0) },
    uRes: { value: new THREE.Vector2(1, 1) },
  };
  private uPx = { value: 1 };

  private surface: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private rippleCursor = 0;

  private germCount: number;
  private germ: { pos: THREE.InstancedBufferAttribute; time: THREE.InstancedBufferAttribute; seed: THREE.InstancedBufferAttribute; kind: THREE.InstancedBufferAttribute; cursor: number };
  private printCount = 48;
  private print: { pos: THREE.InstancedBufferAttribute; shape: THREE.InstancedBufferAttribute; time: THREE.InstancedBufferAttribute; cursor: number };
  private sparkCount: number;
  private spark: { pos: THREE.BufferAttribute; vel: THREE.BufferAttribute; time: THREE.BufferAttribute; cursor: number };

  private disposables: { dispose(): void }[] = [];
  private w = 1;
  private h = 1;
  private dist = 10;
  private bounds = { minX: -5, maxX: 5, minY: -5, maxY: 5 };
  private pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
  private running = false;

  constructor(canvas: HTMLCanvasElement, opts: Options) {
    this.reduced = opts.reducedMotion;
    this.germCount = opts.lite ? 360 : 520;
    this.sparkCount = this.germCount * 3;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0xf8f8f9, 1);

    const track = <T extends { dispose(): void }>(x: T) => {
      this.disposables.push(x);
      return x;
    };

    // Surface
    const surfaceMat = track(
      new THREE.ShaderMaterial({
        vertexShader: SURFACE_VERT,
        fragmentShader: SURFACE_FRAG,
        uniforms: { ...this.shared, ...this.surfaceUniforms },
      }),
    );
    this.surface = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), surfaceMat);
    this.scene.add(this.surface);

    // Germs, and the soft contact shadows under them (sharing the same instance data)
    this.germ = {
      pos: attr(this.germCount, 3),
      time: attr(this.germCount, 2, -100),
      seed: attr(this.germCount, 1),
      kind: attr(this.germCount, 1),
      cursor: 0,
    };
    for (let i = 0; i < this.germCount; i++) this.germ.time.setY(i, 1e6);

    const shadowGeo = track(new THREE.InstancedBufferGeometry());
    const quad = track(new THREE.PlaneGeometry(1, 1));
    shadowGeo.index = quad.index;
    shadowGeo.setAttribute("position", quad.getAttribute("position"));
    shadowGeo.setAttribute("aPos", this.germ.pos);
    shadowGeo.setAttribute("aTime", this.germ.time);
    shadowGeo.setAttribute("aKind", this.germ.kind);
    shadowGeo.instanceCount = this.germCount;
    const shadows = new THREE.Mesh(
      shadowGeo,
      track(
        new THREE.ShaderMaterial({
          vertexShader: SHADOW_VERT,
          fragmentShader: SHADOW_FRAG,
          uniforms: { ...this.shared },
          transparent: true,
          depthTest: false,
          depthWrite: false,
        }),
      ),
    );
    shadows.frustumCulled = false;
    shadows.renderOrder = 1;
    this.scene.add(shadows);

    // Fingerprints
    this.print = {
      pos: attr(this.printCount, 3),
      shape: attr(this.printCount, 3),
      time: attr(this.printCount, 2, -100),
      cursor: 0,
    };
    const printGeo = track(new THREE.InstancedBufferGeometry());
    const printQuad = track(new THREE.PlaneGeometry(1, 1, 6, 6));
    printGeo.index = printQuad.index;
    printGeo.setAttribute("position", printQuad.getAttribute("position"));
    printGeo.setAttribute("aPos", this.print.pos);
    printGeo.setAttribute("aShape", this.print.shape);
    printGeo.setAttribute("aTime", this.print.time);
    printGeo.instanceCount = this.printCount;
    const prints = new THREE.Mesh(
      printGeo,
      track(
        new THREE.ShaderMaterial({
          vertexShader: PRINT_VERT,
          fragmentShader: PRINT_FRAG,
          uniforms: { ...this.shared },
          transparent: true,
          depthTest: false,
          depthWrite: false,
        }),
      ),
    );
    prints.frustumCulled = false;
    prints.renderOrder = 2;
    this.scene.add(prints);

    const germGeo = track(new THREE.InstancedBufferGeometry());
    const ball = track(new THREE.IcosahedronGeometry(1, opts.lite ? 1 : 2));
    germGeo.setAttribute("position", ball.getAttribute("position"));
    germGeo.setAttribute("aPos", this.germ.pos);
    germGeo.setAttribute("aTime", this.germ.time);
    germGeo.setAttribute("aSeed", this.germ.seed);
    germGeo.setAttribute("aKind", this.germ.kind);
    germGeo.instanceCount = this.germCount;
    const germs = new THREE.Mesh(
      germGeo,
      track(
        new THREE.ShaderMaterial({
          vertexShader: GERM_VERT,
          fragmentShader: GERM_FRAG,
          uniforms: { ...this.shared },
          // kept in the transparent pass so it draws after the prints and shadows
          transparent: true,
        }),
      ),
    );
    germs.frustumCulled = false;
    germs.renderOrder = 3;
    this.scene.add(germs);

    // "+" sparks from disrupted germs
    const sparkGeo = track(new THREE.BufferGeometry());
    this.spark = {
      pos: new THREE.BufferAttribute(new Float32Array(this.sparkCount * 3), 3),
      vel: new THREE.BufferAttribute(new Float32Array(this.sparkCount * 3), 3),
      time: new THREE.BufferAttribute(new Float32Array(this.sparkCount * 2).fill(-100), 2),
      cursor: 0,
    };
    for (const a of [this.spark.pos, this.spark.vel, this.spark.time]) a.setUsage(THREE.DynamicDrawUsage);
    sparkGeo.setAttribute("position", this.spark.pos);
    sparkGeo.setAttribute("aVel", this.spark.vel);
    sparkGeo.setAttribute("aTime", this.spark.time);
    const sparks = new THREE.Points(
      sparkGeo,
      track(
        new THREE.ShaderMaterial({
          vertexShader: SPARK_VERT,
          fragmentShader: SPARK_FRAG,
          uniforms: { ...this.shared, uPx: this.uPx },
          transparent: true,
          depthWrite: false,
        }),
      ),
    );
    sparks.frustumCulled = false;
    sparks.renderOrder = 4;
    this.scene.add(sparks);
  }

  private now() {
    return (performance.now() - this.t0) / 1000;
  }

  private frame = () => {
    const t = this.now();
    this.shared.uTime.value = t;
    // a slow drift when idle, and a small parallax towards the pointer
    const p = this.pointer;
    const tx = this.reduced ? 0 : p.active ? p.tx : Math.sin(t * 0.23) * 0.35;
    const ty = this.reduced ? 0 : p.active ? p.ty : 0;
    p.x += (tx - p.x) * 0.04;
    p.y += (ty - p.y) * 0.04;
    this.placeCamera(p.x, p.y);
    this.renderer.render(this.scene, this.camera);
  };

  setRunning(on: boolean) {
    if (on === this.running) return;
    this.running = on;
    this.renderer.setAnimationLoop(on ? this.frame : null);
  }

  private placeCamera(nx: number, ny: number) {
    const yaw = nx * 0.045;
    const pitch = TILT + ny * 0.03;
    const d = this.dist;
    this.camera.position.set(d * Math.sin(pitch) * Math.sin(yaw), -d * Math.sin(pitch) * Math.cos(yaw), d * Math.cos(pitch));
    this.camera.lookAt(0, 0, 0);
  }

  resize(w: number, h: number) {
    this.w = Math.max(1, w);
    this.h = Math.max(1, h);
    const dpr = Math.min(window.devicePixelRatio || 1, this.w < 768 ? 1.75 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(this.w, this.h, false);

    // Keep a fingertip about finger-sized on screen: roughly 55 px on a phone, 105 px on a laptop
    const pxPerUnit = THREE.MathUtils.clamp(Math.min(this.w, this.h * 1.1) / 4.6, 82, 168);
    const halfFov = THREE.MathUtils.degToRad(FOV / 2);
    this.dist = this.h / pxPerUnit / (2 * Math.tan(halfFov));
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    this.placeCamera(0, 0);
    this.camera.updateMatrixWorld();

    this.surfaceUniforms.uRes.value.set(this.w * dpr, this.h * dpr);
    this.uPx.value = (this.h * dpr) / (2 * Math.tan(halfFov));
    this.buildSurface();
    if (!this.running) this.renderer.render(this.scene, this.camera);
  }

  /** Fit a finely divided plane to what the camera sees (with room for the parallax). */
  private buildSurface() {
    const hit = new THREE.Vector3();
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const [nx, ny] of [
      [-1.2, -1.2],
      [1.2, -1.2],
      [-1.2, 1.2],
      [1.2, 1.2],
    ]) {
      this.raycaster.setFromCamera(new THREE.Vector2(nx, ny), this.camera);
      if (!this.raycaster.ray.intersectPlane(this.ground, hit)) continue;
      minX = Math.min(minX, hit.x);
      maxX = Math.max(maxX, hit.x);
      minY = Math.min(minY, hit.y);
      maxY = Math.max(maxY, hit.y);
    }
    if (!Number.isFinite(minX)) return;
    this.bounds = { minX, maxX, minY, maxY };
    const width = maxX - minX;
    const height = maxY - minY;
    const geo = new THREE.PlaneGeometry(
      width,
      height,
      Math.min(240, Math.ceil(width / 0.07)),
      Math.min(240, Math.ceil(height / 0.07)),
    );
    geo.translate((minX + maxX) / 2, (minY + maxY) / 2, 0);
    this.surface.geometry.dispose();
    this.surface.geometry = geo;
  }

  private screenToWorld(px: number, py: number) {
    this.raycaster.setFromCamera(new THREE.Vector2((px / this.w) * 2 - 1, -(py / this.h) * 2 + 1), this.camera);
    const hit = new THREE.Vector3();
    return this.raycaster.ray.intersectPlane(this.ground, hit) ? hit : null;
  }

  setPointer(px: number, py: number, active: boolean) {
    this.pointer.active = active;
    this.pointer.tx = (px / this.w) * 2 - 1;
    this.pointer.ty = (py / this.h) * 2 - 1;
    const hit = this.screenToWorld(px, py);
    if (hit) this.surfaceUniforms.uPointer.value.set(hit.x, hit.y);
  }

  /** A comfortable spot on one side, in canvas pixels, between yMin and yMax (the open surface). */
  randomScreenPoint(side: Side, yMin = this.h * 0.3, yMax = this.h * 0.6) {
    const r = Math.random;
    const x = side === "ordinary" ? this.w * (0.12 + r() * 0.26) : this.w * (0.62 + r() * 0.26);
    return { x, y: yMin + r() * Math.max(0, yMax - yMin) };
  }

  touchAtScreen(px: number, py: number): TouchInfo | null {
    const hit = this.screenToWorld(px, py);
    return hit ? this.touch(hit.x, hit.y) : null;
  }

  private touch(x: number, y: number): TouchInfo {
    const t = this.now();
    const side: Side = x < 0 ? "ordinary" : "protego";
    // keep each print wholly on the side that was touched
    x = side === "ordinary" ? Math.min(x, -PRINT * 0.5) : Math.max(x, PRINT * 0.5);

    this.addPrint(x, y, side, (Math.random() - 0.5) * 0.9 + (side === "ordinary" ? 0.15 : -0.15), t);

    const n = 9 + Math.floor(Math.random() * 5);
    const rippleAt = t + 0.26; // the film answers as the finger lifts
    let last = t;
    for (let i = 0; i < n; i++) {
      const splatter = i >= n - 2;
      const a = Math.random() * Math.PI * 2;
      const r = splatter ? PRINT * (0.55 + Math.random() * 0.35) : Math.sqrt(Math.random()) * PRINT * 0.42;
      let gx = x + Math.cos(a) * r * 0.8;
      const gy = y + Math.sin(a) * r;
      gx = side === "ordinary" ? Math.min(gx, -0.06) : Math.max(gx, 0.06);
      const size = PRINT * (0.07 + Math.random() * 0.05);
      const birth = t + 0.04 + Math.random() * 0.14;
      if (side === "protego") {
        const death = rippleAt + Math.hypot(gx - x, gy - y) / RIPPLE_SPEED + 0.04 + Math.random() * 0.05;
        last = Math.max(last, death);
        this.addGerm(gx, gy, size, birth, death, 1);
        this.addSparks(gx, gy, death + 0.1);
      } else {
        this.addGerm(gx, gy, size, birth, 1e6, 0);
      }
    }
    if (side === "protego") this.addRipple(x, y, rippleAt);
    return { side, germs: n, settle: Math.max(0, last - t) + 0.3 };
  }

  private addPrint(x: number, y: number, side: Side, rot: number, t: number) {
    const i = this.print.cursor++ % this.printCount;
    this.print.pos.setXYZ(i, x, y, side === "protego" ? 1 : 0);
    this.print.shape.setXYZ(i, rot, PRINT * (0.94 + Math.random() * 0.12), Math.random() * 10);
    this.print.time.setXY(i, t, 1e6);
    for (const a of [this.print.pos, this.print.shape, this.print.time]) a.needsUpdate = true;
  }

  private addGerm(x: number, y: number, size: number, birth: number, death: number, kind: number) {
    const g = this.germ;
    const i = g.cursor++ % this.germCount;
    g.pos.setXYZ(i, x, y, size);
    g.time.setXY(i, birth, death);
    g.seed.setX(i, Math.random());
    g.kind.setX(i, kind);
    for (const a of [g.pos, g.time, g.seed, g.kind]) a.needsUpdate = true;
  }

  private addSparks(x: number, y: number, birth: number) {
    const s = this.spark;
    for (let k = 0; k < 3; k++) {
      const i = s.cursor++ % this.sparkCount;
      const a = Math.random() * Math.PI * 2;
      const v = 0.1 + Math.random() * 0.16;
      s.pos.setXYZ(i, x, y, 0.04);
      s.vel.setXYZ(i, Math.cos(a) * v, Math.sin(a) * v, 0.12 + Math.random() * 0.2);
      s.time.setXY(i, birth + Math.random() * 0.06, Math.random());
    }
    for (const a of [s.pos, s.vel, s.time]) a.needsUpdate = true;
  }

  private addRipple(x: number, y: number, at: number) {
    this.shared.uRipples.value[this.rippleCursor++ % MAX_RIPPLES].set(x, y, at, 1);
  }

  /** Wipe both halves with a cloth: prints and lingering germs go as it passes. Returns the duration. */
  clean(duration = 1.1) {
    const t = this.now();
    const x0 = this.bounds.minX - 0.6;
    const x1 = this.bounds.maxX + 0.6;
    const at = (x: number) => t + duration * THREE.MathUtils.clamp((x - x0) / (x1 - x0), 0, 1);

    const g = this.germ;
    for (let i = 0; i < this.germCount; i++) {
      if (g.pos.getZ(i) <= 0 || g.time.getY(i) <= t) continue;
      g.time.setY(i, Math.min(g.time.getY(i), at(g.pos.getX(i))));
    }
    g.time.needsUpdate = true;

    const p = this.print;
    for (let i = 0; i < this.printCount; i++) {
      if (p.time.getY(i) <= t) continue;
      p.time.setY(i, at(p.pos.getX(i)));
    }
    p.time.needsUpdate = true;

    const wipe = this.surfaceUniforms.uWipe.value;
    gsap.killTweensOf(wipe);
    wipe.set(x0, 1);
    gsap.to(wipe, { x: x1, duration, ease: "none", onComplete: () => void (wipe.y = 0) });
    return duration;
  }

  dispose() {
    this.setRunning(false);
    gsap.killTweensOf(this.surfaceUniforms.uWipe.value);
    this.surface.geometry.dispose();
    for (const d of this.disposables) d.dispose();
    this.renderer.dispose();
  }
}

export function createTouchScene(canvas: HTMLCanvasElement, opts: Options) {
  try {
    return new TouchScene(canvas, opts);
  } catch {
    return null; // no WebGL: the caller shows the static illustration
  }
}
