/*
  Design B story timeline. Pure functions of scroll progress p ∈ [0, 1], shared by
  the 3D scene and the chapter text so the two can never drift apart.
  No imports: this file also runs under `node --test`.
*/

export type ChapterId = "open" | "pullout" | "ordinary" | "apply" | "bond" | "protect" | "verify";

export interface Chapter {
  id: ChapterId;
  start: number;
  end: number;
}

export const CHAPTERS: readonly Chapter[] = [
  { id: "open", start: 0, end: 0.12 },
  { id: "pullout", start: 0.12, end: 0.26 },
  { id: "ordinary", start: 0.26, end: 0.42 },
  { id: "apply", start: 0.42, end: 0.54 },
  { id: "bond", start: 0.54, end: 0.66 },
  { id: "protect", start: 0.66, end: 0.88 },
  { id: "verify", start: 0.88, end: 1 },
];

export const TOUCHES_TOTAL = 1200;

/** share of each chapter's range spent fading its text in (and out) */
const FADE = 0.15;

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** smoothstep */
export const smooth = (t: number): number => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

export const easeOut = (t: number): number => 1 - Math.pow(1 - clamp01(t), 3);

function chapter(id: ChapterId): Chapter {
  const c = CHAPTERS.find((ch) => ch.id === id);
  if (!c) throw new Error(`Unknown chapter ${id}`);
  return c;
}

/** index of the chapter p falls in (clamped to the first/last chapter) */
export function chapterIndexAt(p: number): number {
  const last = CHAPTERS.length - 1;
  if (p >= 1) return last;
  for (let i = last; i >= 0; i--) if (p >= CHAPTERS[i].start) return i;
  return 0;
}

/** 0..1 progress within one chapter */
export function local(p: number, id: ChapterId): number {
  const c = chapter(id);
  return clamp01((p - c.start) / (c.end - c.start));
}

/** the middle of a chapter, in global progress */
export function mid(id: ChapterId): number {
  const c = chapter(id);
  return (c.start + c.end) / 2;
}

/** how visible a chapter's text is at p: fades in and out at its edges */
export function chapterOpacity(p: number, index: number): number {
  const c = CHAPTERS[index];
  const w = (c.end - c.start) * FADE;
  const first = index === 0;
  const last = index === CHAPTERS.length - 1;
  if (p < c.start - (first ? Infinity : 0) || p > c.end + (last ? Infinity : 0)) return 0;
  const fadeIn = first ? 1 : clamp01((p - c.start) / w);
  const fadeOut = last ? 1 : clamp01((c.end - p) / w);
  return Math.min(fadeIn, fadeOut);
}

/** protection day shown during "protect": 1 → 30 */
export function dayAt(p: number): number {
  return 1 + Math.round(29 * local(p, "protect"));
}

/** touches counted during "protect": 0 → TOUCHES_TOTAL */
export function touchesAt(p: number): number {
  return Math.round(TOUCHES_TOTAL * local(p, "protect"));
}

/** wall clock during "ordinary": 9:00 am → 1:00 pm, in 15-minute steps */
export function clockAt(p: number): string {
  const minutes = 540 + Math.round((240 * local(p, "ordinary")) / 15) * 15;
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "am" : "pm"}`;
}

/*
  Touches: when fingers press the lift buttons. Shared by the fingerprints and the
  buttons' light-up rings, so a print always lands with its button glowing.
  `at` is a share of its chapter.
*/

export interface Touch {
  button: number;
  at: number;
  dx: number;
  dy: number;
}

/** chapter "ordinary": touches after cleaning; the prints stay behind */
export const ORDINARY_TOUCHES: readonly Touch[] = [
  { button: 1, at: 0.3, dx: 0.04, dy: -0.03 },
  { button: 0, at: 0.42, dx: -0.05, dy: 0.02 },
  { button: 1, at: 0.54, dx: -0.03, dy: 0.05 },
  { button: 0, at: 0.66, dx: 0.03, dy: -0.04 },
];

/** chapter "protect": touch after touch; each print fades on the protected surface */
export const PROTECT_TOUCHES: readonly Touch[] = Array.from({ length: 10 }, (_, j) => ({
  button: j % 2,
  at: 0.03 + j * 0.092,
  dx: ((j * 37) % 11) / 110 - 0.05,
  dy: ((j * 53) % 13) / 130 - 0.05,
}));

/** how long a button stays lit after a touch, as a share of its chapter */
export const PRESS_LIFE = 0.08;

/** 0..1: how brightly a button is lit at p (1 at the moment of touch, fading after) */
export function pressLevel(p: number, button: number): number {
  let level = 0;
  const o = local(p, "ordinary");
  const inOrdinary = p > 0 && o < 1;
  if (inOrdinary) {
    for (const t of ORDINARY_TOUCHES) {
      if (t.button !== button) continue;
      const v = (o - t.at) / PRESS_LIFE;
      if (v >= 0 && v < 1) level = Math.max(level, 1 - v);
    }
  }
  const pl = local(p, "protect");
  if (pl > 0 && pl < 1) {
    for (const t of PROTECT_TOUCHES) {
      if (t.button !== button) continue;
      const v = (pl - t.at) / PRESS_LIFE;
      if (v >= 0 && v < 1) level = Math.max(level, 1 - v);
    }
  }
  return level;
}
