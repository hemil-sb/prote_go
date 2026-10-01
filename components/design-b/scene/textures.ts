import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { heightToNormalRGBA, tileableNoise } from "./noise";

/*
  Small helpers shared by the scene objects: textures drawn on a canvas at runtime
  (no image files to load), the "+" geometry, a seeded random generator so the scene
  is identical on every visit, and the brand colours.
*/

export const COLORS = {
  sherpa: "#004a5d",
  sherpaDeep: "#0d2c33",
  sherpaTint: "#bddfe7",
  orient: "#00627b",
  orientDeep: "#0e4a59",
  orientTint: "#cff1f9",
  turquoise: "#6ae6dc",
  turquoiseDeep: "#2cc2b6",
  turquoiseTint: "#e9fffd",
  spring: "#f8f8f9",
  deepest: "#00252e",
} as const;

/** deterministic PRNG (mulberry32) */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return [c, ctx];
}

function finish(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** soft round dot, white centre fading to transparent: halos, mist, sparks */
export function radialTexture(size = 64, hardness = 0.15): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(hardness, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return finish(c);
}

/** dark soft blob used as a contact shadow behind the panel */
export function shadowTexture(size = 128): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(0,20,26,0.9)");
  g.addColorStop(1, "rgba(0,20,26,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return finish(c);
}

/**
 * A real fingerprint on steel: a faint oily oval smudge with fine, broken ridge lines that
 * catch the light. Colour is baked in (dark smudge, light ridges), so the material is untinted.
 */
export function fingerprintTexture(size = 192): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const rand = seeded(7);
  const cx = size / 2;
  const cy = size / 2;
  const rx = size * 0.33;
  const ry = size * 0.42;

  // the smudge
  const g = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, ry);
  g.addColorStop(0, "rgba(8,28,34,0.34)");
  g.addColorStop(0.75, "rgba(8,28,34,0.16)");
  g.addColorStop(1, "rgba(8,28,34,0)");
  ctx.save();
  ctx.scale(rx / ry, 1);
  ctx.translate((cx * ry) / rx - cx, 0);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, ry, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ridges: whorl arcs, each broken into a few segments
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 0.96, ry * 0.96, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "rgba(255,255,255,0.62)";
  ctx.lineCap = "round";
  ctx.lineWidth = size * 0.009;
  for (let r = size * 0.035; r < ry; r += size * 0.034) {
    const segs = 2 + Math.floor(rand() * 3);
    let a = rand() * Math.PI * 2;
    for (let k = 0; k < segs; k++) {
      const len = (Math.PI * 2 / segs) * (0.55 + rand() * 0.35);
      ctx.beginPath();
      ctx.ellipse(cx + (rand() - 0.5) * 3, cy + (rand() - 0.5) * 3, r * 0.78, r, 0.1, a, a + len);
      ctx.stroke();
      a += Math.PI * 2 / segs;
    }
  }
  ctx.restore();

  // patchy transfer: skin only touches in places
  const img = ctx.getImageData(0, 0, size, size);
  const n = tileableNoise(size, 3, 21);
  for (let i = 0; i < size * size; i++) img.data[i * 4 + 3] = Math.round(img.data[i * 4 + 3] * (0.45 + 0.55 * n[i]));
  ctx.putImageData(img, 0, 0);
  return finish(c);
}

/** a soft vertical light band, for the "freshly cleaned" sheen sweep */
export function sheenTexture(size = 128): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const g = ctx.createLinearGradient(0, 0, size, 0);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.5, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return finish(c);
}

/** the brand "+" as one merged box geometry, centred on the origin */
export function plusGeometry(arm = 1, thickness = 0.24, depth = 0.24): THREE.BufferGeometry {
  const a = new THREE.BoxGeometry(arm, thickness, depth);
  const b = new THREE.BoxGeometry(thickness, arm, depth);
  const merged = mergeGeometries([a, b]);
  a.dispose();
  b.dispose();
  if (!merged) throw new Error("Could not build + geometry");
  return merged;
}

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** the site's Manrope family (next/font generates the real name; read it from the CSS variable) */
function brandFont(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-manrope").trim();
  return v || "system-ui, sans-serif";
}

/** a crisp "+" with a soft glow, drawn flat: used as a sprite for the nano field */
export function plusSpriteTexture(size = 64): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const mid = size / 2;
  const arm = size * 0.3;
  const w = size * 0.085;
  const glow = ctx.createRadialGradient(mid, mid, 0, mid, mid, mid);
  glow.addColorStop(0, "rgba(255,255,255,0.35)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fillRect(mid - arm, mid - w / 2, arm * 2, w);
  ctx.fillRect(mid - w / 2, mid - arm, w, arm * 2);
  return finish(c);
}

/** the packshot "+" pattern as a tiling texture: small crosses and dots on a loose grid */
export function plusPatternTexture(size = 256): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const rand = seeded(19);
  const cell = size / 8;
  ctx.fillStyle = "rgba(255,255,255,1)";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cx = x * cell + cell / 2;
      const cy = y * cell + cell / 2;
      const r = rand();
      if (r < 0.62) {
        const arm = cell * (0.16 + rand() * 0.14);
        const w = Math.max(1.5, arm * 0.28);
        ctx.globalAlpha = 0.45 + rand() * 0.55;
        ctx.fillRect(cx - arm, cy - w / 2, arm * 2, w);
        ctx.fillRect(cx - w / 2, cy - arm, w, arm * 2);
      } else if (r < 0.85) {
        ctx.globalAlpha = 0.5;
        ctx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
      }
    }
  }
  const t = finish(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** a button label: a floor number (or arrow) in Manrope, white on transparent */
export function labelTexture(text: string, size = 128): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${size * 0.5}px ${brandFont()}`;
  ctx.fillText(text, size / 2, size / 2 + size * 0.03);
  return finish(c);
}

/**
 * A germ, drawn as a friendly textbook microbe (no tail): pale body, dark outline, short
 * hairs or spikes around the edge, a few inner spots. "rod" is a bacterium, "round" a coccus.
 */
/**
 * Soft translucent microbes, as the brand guide asks (Spring / Sherpa tint, never red or green):
 * a capsule, a coccus and a two-cell cluster. A gel-like body with a lit rim and a baked contact
 * shadow so they sit on the steel, fine semi-transparent hairs, and faint inner spots. No outlines.
 */
export function germTexture(kind: "rod" | "round" | "pair", size = 192): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const rand = seeded(kind === "rod" ? 31 : kind === "round" ? 32 : 33);
  const cx = size / 2;
  const cy = size / 2;

  const body = () => {
    ctx.beginPath();
    if (kind === "rod") {
      const rx = size * 0.28;
      const ry = size * 0.14;
      ctx.roundRect(cx - rx, cy - ry, rx * 2, ry * 2, ry);
    } else if (kind === "round") {
      ctx.arc(cx, cy, size * 0.2, 0, Math.PI * 2);
    } else {
      const r = size * 0.15;
      ctx.arc(cx - r * 0.78, cy, r, 0, Math.PI * 2);
      ctx.moveTo(cx + r * 0.78 + r, cy);
      ctx.arc(cx + r * 0.78, cy, r, 0, Math.PI * 2);
    }
  };
  // a point on the outline at angle t, and its outward normal
  const edge = (t: number): [number, number, number, number] => {
    if (kind === "rod") {
      const rx = size * 0.28;
      const ry = size * 0.14;
      const x = cx + Math.cos(t) * rx;
      const y = cy + Math.sin(t) * ry;
      const nx = Math.cos(t) * ry;
      const ny = Math.sin(t) * rx;
      const n = Math.hypot(nx, ny);
      return [x, y, nx / n, ny / n];
    }
    const r = kind === "round" ? size * 0.2 : size * 0.15;
    const ox = kind === "pair" ? (Math.cos(t) > 0 ? 1 : -1) * r * 0.78 : 0;
    return [cx + ox + Math.cos(t) * r, cy + Math.sin(t) * r, Math.cos(t), Math.sin(t)];
  };

  // hairs (pili), fine and translucent
  ctx.strokeStyle = "rgba(0,98,123,0.5)";
  ctx.lineCap = "round";
  ctx.lineWidth = size * 0.009;
  const hairs = kind === "rod" ? 30 : 18;
  for (let i = 0; i < hairs; i++) {
    const t = (i / hairs) * Math.PI * 2 + rand() * 0.15;
    const [x, y, nx, ny] = edge(t);
    const len = size * (0.045 + rand() * 0.035);
    const wig = (rand() - 0.5) * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + nx * len * 0.5 - ny * wig * len, y + ny * len * 0.5 + nx * wig * len, x + nx * len, y + ny * len);
    ctx.stroke();
  }

  // contact shadow, then the gel body
  ctx.save();
  ctx.shadowColor = "rgba(0,20,26,0.6)";
  ctx.shadowBlur = size * 0.06;
  ctx.shadowOffsetX = size * 0.025;
  ctx.shadowOffsetY = size * 0.035;
  const gel = ctx.createRadialGradient(cx - size * 0.06, cy - size * 0.06, 0, cx, cy, size * 0.3);
  gel.addColorStop(0, "rgba(232,252,251,0.92)");
  gel.addColorStop(0.55, "rgba(170,220,228,0.86)");
  gel.addColorStop(1, "rgba(70,150,168,0.9)");
  ctx.fillStyle = gel;
  body();
  ctx.fill();
  ctx.restore();

  // membrane: a soft darker edge and a lit rim on the upper left
  ctx.save();
  body();
  ctx.clip();
  ctx.lineWidth = size * 0.04;
  ctx.strokeStyle = "rgba(0,98,123,0.62)";
  body();
  ctx.stroke();
  ctx.lineWidth = size * 0.016;
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.setLineDash([size * 0.5, size * 1.2]);
  ctx.lineDashOffset = size * 0.35;
  body();
  ctx.stroke();
  ctx.restore();

  // faint inner spots
  const spots: [number, number, number][] =
    kind === "rod"
      ? [[-0.12, -0.02, 0.035], [0.05, 0.03, 0.028], [0.15, -0.03, 0.02]]
      : kind === "round"
        ? [[-0.05, -0.04, 0.035], [0.06, 0.02, 0.028], [-0.01, 0.07, 0.02]]
        : [[-0.14, -0.02, 0.03], [0.1, 0.03, 0.028], [-0.08, 0.05, 0.018]];
  for (const [dx, dy, r] of spots) {
    const sg = ctx.createRadialGradient(cx + dx * size, cy + dy * size, 0, cx + dx * size, cy + dy * size, r * size);
    sg.addColorStop(0, "rgba(0,74,93,0.5)");
    sg.addColorStop(1, "rgba(0,98,123,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(cx + dx * size, cy + dy * size, r * size, 0, Math.PI * 2);
    ctx.fill();
  }
  return finish(c);
}

/** a lift call-button arrow: a white rounded triangle, pointing up or down */
export function arrowTexture(dir: "up" | "down", size = 128): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const s = dir === "up" ? -1 : 1;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  ctx.lineJoin = "round";
  ctx.lineWidth = size * 0.06;
  ctx.beginPath();
  ctx.moveTo(size / 2, size / 2 + s * size * 0.2);
  ctx.lineTo(size / 2 - size * 0.22, size / 2 - s * size * 0.14);
  ctx.lineTo(size / 2 + size * 0.22, size / 2 - s * size * 0.14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  return finish(c);
}

/** soft plaster: gentle mottling, to be tinted by the material colour */
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Large-format micro-cement cladding for the lobby wall. One tile is one wall panel: a dark
 * shadow-gap joint and a soft bevel at the edges, fine two-scale grain on the face, and a
 * matching normal map so the downlights produce a real sheen. Drawn at runtime, nothing to
 * download; 256 px on low quality, 512 px on high.
 */
export function claddingTextures(size = 512): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const grain = tileableNoise(size, 5, 11); // fine render grain
  const wash = tileableNoise(size, 2, 4); // slow tonal drift across the panel
  const gap = Math.max(1, Math.round(size * 0.007));
  const bevel = Math.max(3, Math.round(size * 0.016));
  const height = new Float32Array(size * size);

  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const d = Math.min(x, y, size - 1 - x, size - 1 - y); // pixels to the tile edge
      const face = d < gap ? 0 : d < gap + bevel ? ease((d - gap) / bevel) : 1;
      height[i] = face * (0.75 + 0.25 * grain[i]);
      // near-grey luminance: the wall colour comes from the material, so it reads true
      const tone = (0.8 + 0.14 * grain[i] + 0.06 * wash[i]) * (0.42 + 0.58 * face);
      const v = Math.round(255 * Math.min(1, tone));
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const map = finish(c);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;

  const [nc, nctx] = canvas(size);
  const nimg = nctx.createImageData(size, size);
  nimg.data.set(heightToNormalRGBA(height, size, 4));
  nctx.putImageData(nimg, 0, 0);
  const normalMap = new THREE.CanvasTexture(nc);
  normalMap.colorSpace = THREE.NoColorSpace; // normal data is linear
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.anisotropy = 4;
  return { map, normalMap };
}

/** the dark of the opening: black, with the faintest teal glow in the middle */
export function voidTexture(size = 256): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.72);
  g.addColorStop(0, "#061a1e");
  g.addColorStop(0.5, "#020809");
  g.addColorStop(1, "#000000");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return finish(c);
}

/** the lift's floor display: "▲ 04" in turquoise on near-black glass */
export function displayTexture(width = 512, height = 128): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.fillStyle = "#031a1f";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = COLORS.turquoise;
  ctx.shadowColor = COLORS.turquoise;
  ctx.shadowBlur = 14;
  ctx.textBaseline = "middle";
  ctx.font = `600 ${height * 0.58}px ${brandFont()}`;
  ctx.textAlign = "right";
  ctx.fillText("04", width * 0.72, height / 2 + 4);
  // up arrow
  ctx.beginPath();
  ctx.moveTo(width * 0.2, height * 0.66);
  ctx.lineTo(width * 0.28, height * 0.34);
  ctx.lineTo(width * 0.36, height * 0.66);
  ctx.closePath();
  ctx.fill();
  return finish(c);
}
