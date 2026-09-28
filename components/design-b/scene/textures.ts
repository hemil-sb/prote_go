import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

/** a stylised fingerprint: concentric broken ovals */
export function fingerprintTexture(size = 128): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const rand = seeded(7);
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineCap = "round";
  for (let r = 6; r < size * 0.42; r += 7) {
    ctx.lineWidth = 2.2;
    const gap = rand() * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(size / 2, size / 2, r * 0.78, r, 0, gap, gap + Math.PI * (1.55 + rand() * 0.35));
    ctx.stroke();
  }
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
export function germTexture(kind: "rod" | "round", size = 160): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  const ink = COLORS.sherpaDeep;
  const cx = size / 2;
  const cy = size / 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = ink;

  if (kind === "rod") {
    const rx = size * 0.3;
    const ry = size * 0.15;
    // short hairs (pili) all around the edge
    ctx.lineWidth = size * 0.018;
    for (let i = 0; i < 26; i++) {
      const t = (i / 26) * Math.PI * 2;
      const x = cx + Math.cos(t) * rx;
      const y = cy + Math.sin(t) * ry;
      const nx = Math.cos(t) * ry;
      const ny = Math.sin(t) * rx;
      const n = Math.hypot(nx, ny);
      const len = size * (0.05 + (i % 3) * 0.012);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (nx / n) * len, y + (ny / n) * len);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.roundRect(cx - rx, cy - ry, rx * 2, ry * 2, ry);
  } else {
    const r = size * 0.21;
    // spikes with round tips
    ctx.lineWidth = size * 0.022;
    ctx.fillStyle = ink;
    for (let i = 0; i < 12; i++) {
      const t = (i / 12) * Math.PI * 2 + 0.2;
      const x0 = cx + Math.cos(t) * r;
      const y0 = cy + Math.sin(t) * r;
      const x1 = cx + Math.cos(t) * (r + size * 0.085);
      const y1 = cy + Math.sin(t) * (r + size * 0.085);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x1, y1, size * 0.022, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
  // body
  ctx.fillStyle = COLORS.turquoiseTint;
  ctx.fill();
  ctx.lineWidth = size * 0.035;
  ctx.stroke();
  // inner spots
  ctx.fillStyle = "rgba(0, 98, 123, 0.55)";
  const spots: [number, number, number][] =
    kind === "rod"
      ? [
          [-0.12, -0.03, 0.03],
          [0.06, 0.04, 0.024],
          [0.16, -0.04, 0.018],
        ]
      : [
          [-0.06, -0.05, 0.03],
          [0.07, 0.02, 0.025],
          [-0.02, 0.08, 0.02],
        ];
  for (const [dx, dy, r] of spots) {
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
export function plasterTexture(size = 512): THREE.CanvasTexture {
  const [c, ctx] = canvas(size);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  const rand = seeded(3);
  for (let i = 0; i < 1400; i++) {
    const r = 4 + rand() * 22;
    ctx.fillStyle = `rgba(0,0,0,${0.008 + rand() * 0.014})`;
    ctx.beginPath();
    ctx.arc(rand() * size, rand() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = finish(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
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
