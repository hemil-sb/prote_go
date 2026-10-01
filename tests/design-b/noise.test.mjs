import { test } from "node:test";
import assert from "node:assert/strict";
import { tileableNoise, heightToNormalRGBA } from "../../components/design-b/scene/noise.ts";

test("tileableNoise fills 0..1 and is deterministic for a seed", () => {
  const a = tileableNoise(64, 3, 7);
  const b = tileableNoise(64, 3, 7);
  assert.equal(a.length, 64 * 64);
  assert.deepEqual(Array.from(a.slice(0, 16)), Array.from(b.slice(0, 16)));
  let min = 1, max = 0;
  for (const v of a) { min = Math.min(min, v); max = Math.max(max, v); }
  assert.ok(min >= 0 && max <= 1, `range ${min}..${max}`);
  assert.ok(max - min > 0.3, "has contrast");
});

test("tileableNoise wraps: the row after the last equals the first", () => {
  const n = 32;
  const a = tileableNoise(n, 2, 3);
  // sampling continuity: lattice cells divide the size, so the last column leads into the first
  const left = a[5 * n + 0];
  const right = a[5 * n + (n - 1)];
  assert.ok(Math.abs(left - right) < 0.2, `edge continuity ${left} vs ${right}`);
});

test("heightToNormalRGBA: flat field gives straight-up normals", () => {
  const h = new Float32Array(16 * 16).fill(0.5);
  const rgba = heightToNormalRGBA(h, 16, 2);
  assert.equal(rgba.length, 16 * 16 * 4);
  assert.deepEqual(Array.from(rgba.slice(0, 4)), [128, 128, 255, 255]);
});

test("heightToNormalRGBA: a ramp rising to the right tilts normals toward -x", () => {
  const n = 16;
  const h = new Float32Array(n * n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) h[y * n + x] = x / n;
  const rgba = heightToNormalRGBA(h, n, 4);
  const i = (8 * n + 8) * 4;
  assert.ok(rgba[i] < 128, `red (x) should be below 128, got ${rgba[i]}`);
  assert.equal(rgba[i + 1], 128);
  assert.ok(rgba[i + 2] > 128);
});
