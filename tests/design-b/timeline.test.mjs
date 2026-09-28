import { test } from "node:test";
import assert from "node:assert/strict";
import * as T from "../../components/design-b/scene/timeline.ts";

test("chapters are contiguous and cover [0,1]", () => {
  assert.equal(T.CHAPTERS[0].start, 0);
  assert.equal(T.CHAPTERS.at(-1).end, 1);
  for (let i = 1; i < T.CHAPTERS.length; i++) assert.equal(T.CHAPTERS[i].start, T.CHAPTERS[i - 1].end);
});

test("chapterIndexAt handles boundaries and out-of-range", () => {
  assert.equal(T.chapterIndexAt(-1), 0);
  assert.equal(T.chapterIndexAt(0), 0);
  assert.equal(T.chapterIndexAt(0.12), 1);
  assert.equal(T.chapterIndexAt(1), T.CHAPTERS.length - 1);
  assert.equal(T.chapterIndexAt(2), T.CHAPTERS.length - 1);
});

test("local clamps", () => {
  assert.equal(T.local(0, "protect"), 0);
  assert.equal(T.local(1, "protect"), 1);
  assert.ok(Math.abs(T.local(T.mid("protect"), "protect") - 0.5) < 1e-9);
});

test("day counter runs 1 → 30 across 'protect'", () => {
  assert.equal(T.dayAt(0), 1);
  assert.equal(T.dayAt(0.66), 1);
  assert.equal(T.dayAt(0.88), 30);
  assert.equal(T.dayAt(1), 30);
});

test("touches are monotonic and bounded", () => {
  let prev = -1;
  for (let p = 0; p <= 1.0001; p += 0.01) {
    const t = T.touchesAt(p);
    assert.ok(t >= prev);
    prev = t;
  }
  assert.equal(T.touchesAt(1), T.TOUCHES_TOTAL);
});

test("clock runs 9:00 am → 1:00 pm across 'ordinary'", () => {
  assert.equal(T.clockAt(0), "9:00 am");
  assert.equal(T.clockAt(0.42), "1:00 pm");
});

test("chapter text: first visible at 0, last visible at 1, one dominant chapter mid-range", () => {
  assert.equal(T.chapterOpacity(0, 0), 1);
  assert.equal(T.chapterOpacity(1, T.CHAPTERS.length - 1), 1);
  for (let i = 0; i < T.CHAPTERS.length; i++) {
    const m = T.mid(T.CHAPTERS[i].id);
    assert.equal(T.chapterOpacity(m, i), 1);
    for (let j = 0; j < T.CHAPTERS.length; j++) if (j !== i) assert.equal(T.chapterOpacity(m, j), 0);
  }
});
