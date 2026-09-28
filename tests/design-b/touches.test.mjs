import { test } from "node:test";
import assert from "node:assert/strict";
import * as T from "../../components/design-b/scene/timeline.ts";
const { ORDINARY_TOUCHES, PROTECT_TOUCHES, pressLevel } = T;

test("no button is lit before the story reaches a touch", () => {
  for (let b = 0; b < 4; b++) assert.equal(pressLevel(0, b), 0);
  for (let b = 0; b < 4; b++) assert.equal(pressLevel(T.mid("pullout"), b), 0);
});

test("a button lights at its touch and fades", () => {
  const t = PROTECT_TOUCHES[0];
  const c = T.CHAPTERS.find((ch) => ch.id === "protect");
  const at = c.start + (c.end - c.start) * (t.at + 0.001);
  assert.ok(pressLevel(at, t.button) > 0.9);
  const later = c.start + (c.end - c.start) * (t.at + T.PRESS_LIFE * 0.9);
  assert.ok(pressLevel(later, t.button) < 0.5);
});

test("every ordinary touch lands inside the 'ordinary' chapter and every protect touch inside 'protect'", () => {
  for (const t of ORDINARY_TOUCHES) assert.ok(t.at >= 0 && t.at < 1);
  for (const t of PROTECT_TOUCHES) assert.ok(t.at >= 0 && t.at < 1);
});

test("press level stays within 0..1", () => {
  for (let p = 0; p <= 1.0001; p += 0.005) for (let b = 0; b < 4; b++) {
    const v = pressLevel(p, b);
    assert.ok(v >= 0 && v <= 1);
  }
});

test("touches only use the two call buttons (0 = up, 1 = down)", () => {
  for (const t of [...ORDINARY_TOUCHES, ...PROTECT_TOUCHES]) assert.ok(t.button === 0 || t.button === 1);
});
