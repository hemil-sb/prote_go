/*
  Pure helpers for procedural materials (no DOM, so they are unit-tested):
  tileable value noise for wall grain, and a heightfield → tangent-space normal map.
*/

/** deterministic PRNG (mulberry32), same as textures.ts but kept here so this file has no DOM deps */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Tileable value noise, `size` × `size`, values 0..1. Octave k uses a lattice of
 * 8·2^k cells per axis that divides `size`, so the texture wraps seamlessly.
 */
export function tileableNoise(size: number, octaves = 4, seed = 1): Float32Array {
  const out = new Float32Array(size * size);
  let amp = 1;
  let total = 0;
  for (let o = 0; o < octaves; o++) {
    const cells = Math.min(size, 8 << o);
    const rand = prng(seed * 1000 + o);
    const lattice = new Float32Array(cells * cells);
    for (let i = 0; i < lattice.length; i++) lattice[i] = rand();
    const scale = cells / size;
    for (let y = 0; y < size; y++) {
      const fy = y * scale;
      const y0 = Math.floor(fy);
      const ty = smooth(fy - y0);
      const y1 = (y0 + 1) % cells;
      for (let x = 0; x < size; x++) {
        const fx = x * scale;
        const x0 = Math.floor(fx);
        const tx = smooth(fx - x0);
        const x1 = (x0 + 1) % cells;
        const a = lattice[y0 * cells + x0];
        const b = lattice[y0 * cells + x1];
        const c = lattice[y1 * cells + x0];
        const d = lattice[y1 * cells + x1];
        const v = (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
        out[y * size + x] += v * amp;
      }
    }
    total += amp;
    amp *= 0.5;
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

/**
 * Normals from a tileable heightfield (0..1), encoded as RGBA bytes for a canvas:
 * flat = (128, 128, 255). `strength` scales the slope; wraps at the edges.
 */
export function heightToNormalRGBA(height: Float32Array, size: number, strength = 2): Uint8ClampedArray {
  const out = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) {
    const yu = (y - 1 + size) % size;
    const yd = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xl = (x - 1 + size) % size;
      const xr = (x + 1) % size;
      const dx = (height[y * size + xr] - height[y * size + xl]) * strength;
      const dy = (height[yd * size + x] - height[yu * size + x]) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      out[i] = Math.round(128 + (-dx / len) * 127);
      out[i + 1] = Math.round(128 + (dy / len) * 127);
      out[i + 2] = Math.round(128 + (1 / len) * 127);
      out[i + 3] = 255;
    }
  }
  return out;
}
