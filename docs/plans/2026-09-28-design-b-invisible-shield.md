# Design B, "The Invisible Shield": Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:executing-plans (the user asked to start immediately; executed natively in-session). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace the `/b` placeholder with a scroll-driven Three.js + GSAP story ("Invisible Shield" with a nano "+" opening), followed by compact, redesigned essentials.

**Architecture:**
- A pure `timeline.ts` maps scroll progress `p ∈ [0,1]` to chapters and counters.
- A framework-free Three.js scene (`createShieldScene`) derives every object's state from `p`.
- `ShieldStory` pins the section with GSAP ScrollTrigger and pushes `p` into the scene and the chapter text through refs (no React re-render per frame).
- The post-story sections are ordinary server components that read shared data from `content/`.

**Tech stack:** Next.js 16.3.6 (App Router), React 19.2, Tailwind v4, three ^0.186 (already installed), gsap ^3.15 (already installed; ScrollTrigger included), Node 24 built-in test runner.

**Spec:** `docs/specs/2026-09-28-design-b-invisible-shield.md`

## Global constraints

- Only the brand palette tokens in `app/globals.css` (`sherpa`, `sherpa-deep`, `orient`, `turquoise`, `spring`… and their tints and shades). Manrope only. Logo top-left, never centred.
- Claims only from the safe set (`CLAUDE.md` §5):
  - "up to 30 days"
  - "complements routine cleaning"
  - "tested by an NABL-accredited laboratory"
  - no kill-rate %, no "non-toxic", no competitor named
  - illustrations labelled "Illustration"; sample ATP values labelled "Sample"
- Headlines end with a full stop. UK spelling.
- **Parallel work:** a separate session is building design C (`app/c`, `components/c/*`). Do not touch those files, `package.json`, `tsconfig.json`, `eslint.config.mjs` or design A's files. (The spec's "A imports `content/`" refactor is deferred until C is settled.)
- Never start the dev server. Verify with lint, `tsc`, `node --test`, `npm run build`, and read-only Playwright against the user's server when it's running.
- No commits unless the user asks.

## Review focus (failure modes no unit test covers; each gets a check in Task 7)

1. **Scrolling backwards** through the pinned story must restore identical frames and text (state is a pure function of `p`).
2. **Leaving `/b` via the design switcher mid-story** must not leave a pin spacer, ScrollTrigger or WebGL context behind. Check by returning to `/`: no extra height, and `/` lands at the top.
3. **Phones:**
   - the object stays in the top ~55% and the chapter text is never covered or clipped
   - no horizontal overflow at 390 px
   - the address-bar resize doesn't jump the pin
4. **Reduced motion:** there's no scroll-jacked pin at all. The chapters read as normal stacked blocks with a still frame each, and the counters show final values.
5. **No WebGL:** the poster shows, all text is readable, and there are no console errors.

---

## File structure

```
app/b/page.tsx                                   (modify: compose design B)
content/                                         (new, shared data)
  products.ts plans.ts industries.ts clients.ts faqs.ts contact.ts
components/design-b/
  gsap.ts                                        (register ScrollTrigger once)
  HeaderB.tsx                                    (floating header + menu sheet)
  ShieldStory.tsx                                (pin, chapter text, counters, loads scene)
  StoryStill.tsx                                 (reduced-motion / no-WebGL frame)
  scene/timeline.ts                              (pure)
  scene/createShieldScene.ts                     (renderer, camera, lights, loop)
  scene/textures.ts                              (canvas-generated textures)
  scene/objects/{PlusField,LiftPanel,Mist,Film,Germs,Fingerprints}.ts
  sections/{ProductsB,ServiceB,IndustriesB,ClientsB,AboutH2HB,FaqB,ContactB,FooterB}.tsx
public/design-b/shield-poster.jpg                (exported from the running scene, Task 7)
tests/design-b/timeline.test.mjs                 (node --test)
```

---

### Task 1: Timeline (pure) + tests

**Files:** create `components/design-b/scene/timeline.ts` and `tests/design-b/timeline.test.mjs`.

**Produces:**
- `CHAPTERS: readonly Chapter[]` with `{ id, start, end }`
- `ChapterId`
- `clamp01(v)`
- `chapterIndexAt(p)`
- `local(p, id)`
- `mid(id)`
- `chapterOpacity(p, index)`
- `dayAt(p)` → 1..30
- `touchesAt(p)` → 0..`TOUCHES_TOTAL` (1200)
- `clockAt(p)` → "9:00 am".."1:00 pm"
- `smooth(t)`, `easeOut(t)`

**Steps**
- [ ] **Step 1: Write the failing test:**

```js
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
  for (let p = 0; p <= 1.0001; p += 0.01) { const t = T.touchesAt(p); assert.ok(t >= prev); prev = t; }
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
```

- [ ] **Step 2:** Run `node --test tests/design-b/` and confirm it FAILS (module not found).
- [ ] **Step 3:** Implement `timeline.ts`:
  - Ranges exactly as the spec's §3 table.
  - Fade width 15% of each chapter's range.
  - The first chapter never fades in; the last never fades out.
  - Day = `1 + round(29 · local(p,"protect"))`; touches = `round(1200 · local(p,"protect"))`.
  - Clock minutes = `540 + round(240 · local(p,"ordinary") / 15) · 15`, formatted "h:mm am/pm".
- [ ] **Step 4:** Run `node --test tests/design-b/` and confirm it PASSES. Then `npx tsc --noEmit`.

### Task 2: Shared content

**Files:** create `content/products.ts`, `plans.ts`, `industries.ts`, `clients.ts`, `faqs.ts` and `contact.ts`. Values are copied **verbatim** from design A's section files (Products, Services, IndustryExplorer, Clients, Faq, Contact). A's files are not edited.

**Produces:**

| Export | Shape |
|---|---|
| `PACKS` | `{ size, img, line, note }[]` |
| `PLANS` | `{ name, price, unit, points, featured? }[]` |
| `INCLUDED` | `string[]` |
| `CYCLE` | `{ label, body }[]` (assess, protect, verify, report, renew) |
| `INDUSTRIES` | `{ icon, name, covers, hotspots, line }[]` |
| `CLIENTS` | `{ file, name }[]` |
| `FAQS` | `{ q, a }[]` |
| `CONTACT` | `{ email, phoneDisplay, phoneHref, address, sectors }` |

**Check:** `npx tsc --noEmit` passes, and a diff of the values against A's files by eye shows no drift.

### Task 3: Scene core + nano field + lift panel

**Files:** create `scene/createShieldScene.ts`, `scene/textures.ts`, `scene/objects/PlusField.ts` and `scene/objects/LiftPanel.ts`.

**Consumes:** `timeline.ts`.

**Produces:**

```ts
type Quality = "high" | "low";
interface ShieldScene {
  setProgress(p: number): void;
  setPointer(x: number, y: number): void; // -1..1
  resize(): void;
  setActive(on: boolean): void;           // pause when off-screen or tab hidden
  renderStill(p: number): string;         // PNG data URL, for reduced motion
  dispose(): void;
}
function createShieldScene(canvas: HTMLCanvasElement, opts: { quality: Quality; layout: "side" | "top" }): ShieldScene;
```

**Object contract:** each object file exports `create…(ctx)` returning `{ group: THREE.Object3D, update(p: number, time: number): void, dispose(): void }`.

**Rendering**
- `WebGLRenderer({ canvas, alpha: true, antialias: quality === "high" })`.
- DPR capped at 1.5 (high) / 1.25 (low). sRGB output, ACES tone mapping.
- The CSS gradient sits behind the transparent canvas.

**Camera and layout**
- Perspective camera, fov 35.
- Camera z: 2.2 (nano) → 8.5 (pulled out) across "pullout", then eased to 7.6 during "verify".
- `layout="side"` uses `setViewOffset` to frame the panel in the right half; `"top"` frames it in the top ~55%.

**Lights:** hemisphere (`#cff1f9` / `#0d2c33`), a white key light, and a turquoise rim point light.

**PlusField (nano)**
- One `InstancedMesh` of merged-box "+" geometry: 2,500 (high) or 800 (low) instances in a box volume.
- Plus a `Points` halo layer (additive radial sprite).
- Scale 1 → 0.03 and opacity 1 → 0 across "pullout", with a slow time-based drift.

**LiftPanel**
- `RoundedBoxGeometry` slab 2.4 × 3.2 × 0.18, `MeshPhysicalMaterial` (orient-deep, clearcoat).
- 4 round buttons in a 2 × 2 grid, and a small display strip.
- A soft shadow sprite behind it.
- A pointer tilt of ±3° on high quality only.

**Loop:** rAF runs only while active; `setProgress` stores `p` and the loop renders.

**Check:** type-check passes; a manual render later happens in Task 5 via ShieldStory.

### Task 4: Story effects

**Files:** create `scene/objects/Mist.ts`, `Film.ts`, `Germs.ts` and `Fingerprints.ts`, and wire them into `createShieldScene`.

**Ordinary**
- A sheen plane sweeps across the panel (local 0–0.3).
- Fingerprints (ring sprites, spring-white, opacity ≤ 0.4) appear at button positions (local 0.35–0.9).
- 6 germs (capsules, `#bddfe7`) scale in, staggered.

**Apply**
- `Points` mist (1,500 high / 600 low) sweeps left → right, peaking mid-chapter.
- The ordinary fingerprints and germs fade out (local 0.3–0.8).

**Bond**
- A turquoise film plane wipes on from the left (scale.x 0 → 1, opacity 0 → 0.22).
- Tip crosses on a grid (14 × 18 high / 10 × 13 low) rise in a centre-out wave.

**Protect**
- 8 germs approach along deterministic paths keyed by `local(p,"protect")`. Each bursts at contact (scale → 0) into 12 turquoise sparks (a pooled `Points` layer).
- Fingerprints land and fade with a turquoise ring pulse.

**Verify:** the scene holds and the camera eases in.

Every `update` is a pure function of `(p, time)`; `time` only adds idle wobble, never story state.

**Check:** type-check passes; visual check in Task 7.

### Task 5: ShieldStory + fallbacks

**Files:** create `components/design-b/gsap.ts`, `ShieldStory.tsx` and `StoryStill.tsx`.

**Consumes:** `timeline.ts` and `createShieldScene`.

**Chapter copy (exact)**

| # | Headline | Extra |
|---|---|---|
| 0 | H1 "Protection that doesn't sleep." | Lede "Disinfectants stop working once they dry. ProteGo keeps surfaces protected for up to 30 days, touch after touch."; CTA "Book a free assessment" → `#contact`; "Scroll" cue |
| 1 | "Every surface gets touched." | "Hundreds of times a day. Lift buttons, handles, handrails, desks." |
| 2 | "Ordinary disinfectants stop working once they dry." | "The next touch can bring germs straight back." + clock `clockAt(p)` |
| 3 | "One application. A fine mist." | "Professional ULV application reaches every high-touch surface." |
| 4 | "An invisible layer bonds to the surface." | "Si-QAC nanotechnology. About 98% water. Dries in about an hour." |
| 5 | "Touch after touch. Day after day." | "Up to 30 days of protection on treated surfaces." + counters Day `dayAt(p)` / Touches `touchesAt(p)` |
| 6 | "Proof after every visit." | ATP card: Before 356 · After 18 RLU · "Sample"; small print "Illustration. ProteGo complements routine cleaning. Protection lasts up to 30 days on treated surfaces under normal conditions." |

**Motion mode (default)**
- A `section` containing a `100svh` stage, pinned by ScrollTrigger:
  - `end: "+=" + innerHeight * (layout === "side" ? 6 : 5)`, `scrub: 0.6`.
  - `onUpdate` → `scene.setProgress(self.progress)`.
  - Chapter opacity/translate, day, touches and clock are written directly to refs.
- The canvas fades in after the first frame.
- `setActive` is driven by an IntersectionObserver plus `visibilitychange`; the pointer drives `setPointer` (desktop).
- `gsap.context(...).revert()` and `scene.dispose()` on unmount.
- `ScrollTrigger.config({ ignoreMobileResize: true })`.

**Environment detection:** `useSyncExternalStore` for `prefers-reduced-motion` and WebGL support, so there's no set-state-in-effect and SSR is safe. The server snapshot is motion mode with chapter 0 visible.

**Reduced motion**
- No pin. Chapters render stacked, each with a `StoryStill` image.
- One offscreen scene calls `renderStill(mid(chapter))` for each chapter, then is disposed.
- Counters show final values.

**No WebGL:** `StoryStill` uses `/design-b/shield-poster.jpg` for every chapter.

**Accessibility:** the canvas is `aria-hidden`. Real headings: H1 for chapter 0, then H2.

**Check:** type-check and lint pass.

### Task 6: HeaderB, post-story sections, page

**Files:** create `HeaderB.tsx` and `sections/*B.tsx`; modify `app/b/page.tsx`.

**Visual language:** "bento" cards (rounded-[2rem]), large numerals, dark `sherpa-deep` cards with turquoise accents, alternating with `spring`/white cards. Mobile-first: centred intros on phones, left from `lg`.

**HeaderB**
- Fixed pill bar (`top-3`, gutter insets): white logo on a `sherpa-deep/70` blur, a turquoise "Book a free assessment" pill (hidden below `sm`), and a menu button.
- The menu sheet is full-screen `sherpa-deep` with links to `#products #service #industries #clients #about #faq #contact`.
- Escape and link-click close it; focus moves to the first link on open and returns to the button on close; body scroll is locked while open.

**Sections**

| Section | Content |
|---|---|
| ProductsB | Bento: a dark lead card (name, "Ready to use. No dilution. Up to 30 days per application.", "Order the DIY kit" / "Bulk and trade enquiries") and 3 pack cards (image, size, coverage, note), "Also available in 5 L." |
| ServiceB | The 5-step cycle as numbered cards (01–05), `INCLUDED` chips, 3 plan cards (`.rail` on phones, "Recommended" on 12-Month), "Indicative pricing, confirmed after your site assessment.", pilot CTA |
| IndustriesB | 6 tiles: icon, name, covers; the first 3 hotspots as chips |
| ClientsB | A two-row marquee using the existing `.marquee` / `.marquee-track` CSS and `CLIENTS`, plus the DAIS quote |
| AboutH2HB | Two cards: "Raising the bar on hygiene." with "protego · Latin, to protect" and a 2018 → 2024 line; Hospital to Home™ "Recovery deserves a safer home." with the 6 touchpoints and CTA |
| FaqB | `FAQS` in `<details class="faq">` |
| ContactB | A dark CTA card and a `mailto:` form (same fields and behaviour as A) using `CONTACT` |
| FooterB | Logo, links, contact, claims footnote |

**Check:** lint, `tsc` and `npm run build` pass (routes `/`, `/b`, `/c` all build).

### Task 7: Poster, verification, polish

- [ ] **Unit tests:** `node --test tests/design-b/` passes.
- [ ] **Static checks:** `npm run lint`, `npx tsc --noEmit` and `npm run build` pass.
- [ ] **Screenshots and poster:** if the user's dev server is running (never start one), take read-only Playwright screenshots of chapters 0–6 at 1440 and 390 px. Export `public/design-b/shield-poster.jpg` from the canvas at `mid("protect")`.
- [ ] **Review focus checks:**
  1. **Backwards scrub:** screenshot at p = 0.7 going forward, scroll to 0.95, back to 0.7, screenshot again; the frames match.
  2. **Leaving mid-story:** switcher from `/b` (mid-story) to `/` → `scrollY === 0`, `/`'s height equals its baseline, and no ScrollTrigger remains (`window.ScrollTrigger` absent or empty).
  3. **Phones:** at 390 px every step has `scrollWidth === innerWidth`, and the text box stays inside the viewport.
  4. **Reduced motion:** no pin spacer, 7 stills rendered, counters show "Day 30" and "1,200".
  5. **No WebGL** (`--disable-webgl --disable-webgl2`): the poster is visible, with no console errors.
- [ ] **Design A:** `/` still matches `regress/before_*.png` (no A files edited).
- [ ] **Tune:** chapter framing, text contrast and timing by eye; re-run the checks.
