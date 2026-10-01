# Design B: "The Invisible Shield" (spec)

**Status:** draft for review · **Date:** 28 Sep 2026 · **Route:** `/b` · **Replaces:** the Design B placeholder

## 1. Intent

**Goal.** A drastically different landing page for ProteGo Hygiene, to compare against design A (`/`) with the design switcher. It should teach the brand's core idea by *showing* it:
- Ordinary disinfectants stop working once they dry, so the next touch recontaminates the surface.
- ProteGo leaves a bonded layer that keeps protecting, touch after touch, for up to 30 days.

**What carries over from design A:** the logo, the palette (Sherpa Blue, Orient, Turquoise, Spring and their tints and shades), Manrope, the claims rules (`CLAUDE.md` §5), and the content pool.

**What is new:** the whole UI and UX. A scroll-driven 3D story built with **Three.js + GSAP ScrollTrigger**, followed by compact, redesigned essentials.

**Agreed choices** (brainstorm, 28 Sep 2026):
- Direction "Invisible Shield", with a touch of "Powers of ten" (a nano "+" opening).
- Content: the story, then compact essentials, including short About and Hospital to Home™.
- 3D style A: stylised and clean.
- Build approach: plain Three.js + GSAP (no React Three Fiber, no pre-rendered frames).

**Success looks like:**
- A visitor who only scrolls understands the recontamination vs protection difference with no reading required.
- It feels premium and calm, not fear-based.
- It stays smooth on a mid-range phone.
- Nothing is lost with reduced motion or without WebGL.
- It passes lint, type checks and the build, with no horizontal overflow and no console errors.

## 2. Page structure

1. **HeaderB (floating):**
   - Logo top-left (brand rule; never centred), a "Book a free assessment" pill and a menu button.
   - No full nav bar.
   - The menu opens a sheet linking to the post-story sections.
2. **ShieldStory (pinned 3D story):** 7 chapters, §3.
3. **Post-story sections (compact, card-based, new visual language):**
   1. **Products:** Surface Protectant packs (100 ml, 500 ml DIY kit ₹1,049, 20 L), "Also available in 5 L".
   2. **The service:** the 30-day cycle (assess → protect → verify → report → renew), the three plans (Professional from ₹2.75/sq ft/month + GST, 12-Month "Recommended", Long-Term Partnership), and the pilot CTA. Prices labelled indicative.
   3. **Industries:** a quick-scan grid of the 6 industry groups used in design A.
   4. **Clients:** the logo marquee and the DAIS quote.
   5. **About + Hospital to Home™:** two short cards side by side (mission / "protego"; H2H promise and CTA).
   6. **FAQ:** the 4 questions from design A.
   7. **Final CTA + contact form:** same `mailto:` behaviour as design A, same contact details.
4. **Footer:** a compact version (logo, key links, contact, claims footnote).

The design switcher (root layout) stays visible.

## 3. The story (scroll chapters)

The whole story is one **ScrollTrigger-pinned** section. Scroll progress `p ∈ [0, 1]` drives both the 3D scene and the chapter text, and the chapter ranges live in `timeline.ts`. The ranges below are the starting values (tunable).

| # | Range | 3D | Text (left third on desktop, a card under the object on phones) |
|---|---|---|---|
| 0 | 0.00–0.12 | **Nano opening:** a slow-drifting field of glowing turquoise "+" charged tips, close to the camera, on a deep-teal gradient | H1 "Protection that doesn't sleep." · lede "Disinfectants stop working once they dry. ProteGo keeps surfaces protected for up to 30 days, touch after touch." · CTA "Book a free assessment" · scroll cue |
| 1 | 0.12–0.26 | **Pull out:** the camera backs away through the "+" field, which shrinks to the micro-texture of a surface; a stylised **lift-button panel** (4 round buttons) resolves | "Every surface gets touched. Hundreds of times a day." |
| 2 | 0.26–0.42 | **Ordinary clean:** the panel gleams (a clean sheen sweep), then fingerprints and small soft germ forms reappear as a small clock runs "9:00 → 1:00 pm" | "Ordinary disinfectants stop working once they dry." |
| 3 | 0.42–0.54 | **Apply:** a sheet of fine mist particles sweeps across the panel; the old fingerprints and germs clear | "One application. A fine mist." |
| 4 | 0.54–0.66 | **Bond:** a turquoise film spreads across the panel; "+" tips (callback to chapter 0) rise out of it | "An invisible layer bonds to the surface." |
| 5 | 0.66–0.88 | **Protect:** fingerprints land and fade; germs drift in and break apart into tiny turquoise sparks on contact; overlay counters: **Day 1 → 30** and **Touches 0 → 1,200+** | "Touch after touch. Day after day. Up to 30 days." |
| 6 | 0.88–1.00 | **Verify:** a simple HTML/CSS ATP meter overlay: before **356**, after **18 RLU**, labelled "Sample"; the camera settles, then the pin releases | "Proof after every visit." · small print: "Illustration. Complements routine cleaning. Protection lasts up to 30 days on treated surfaces under normal conditions." |

**Rules**
- Every 3D state is a **pure function of `p`**: scrolling backwards reverses exactly.
- Text chapters fade and rise in and out on their ranges.
- The counters are HTML, not 3D, so they stay crisp and screen readers can read them.
- Claims stay within the safe set:
  - "up to 30 days"
  - no kill-rate percentages
  - no "non-toxic"
  - germs never shown on a person
  - no competitor named

## 4. Art direction (style A: stylised and clean)

**Background and palette**
- Background: a full-viewport gradient from `#0D2C33` to `#004A5D` (with a soft vignette).
- Turquoise `#6AE6DC` is reserved for "protection": the mist, the film, the "+" tips and the sparks.

**The lift panel**
- Rounded-rectangle slab with 4 round buttons.
- `MeshPhysicalMaterial` in Orient/Sherpa tones, satin clearcoat, no photo textures.
- Soft key light, a hemisphere fill, and a baked contact-shadow sprite (no real-time shadow maps).

**Other elements**
- **Germs:** soft translucent capsule shapes in Spring / `#BDDFE7`. Never red or green.
- **Fingerprints:** a real print: a faint oily oval smudge with fine, broken ridge lines that catch the light (one runtime canvas texture, colours baked in).
- **"+" tips:** a single `InstancedMesh` of cross shapes. About 2,500 instances on desktop, about 800 on phones.
- **Glow:** emissive materials plus additive sprite halos. **No post-processing bloom pass.**

**Camera and type**
- Camera: scroll-driven dolly; on desktop, a gentle pointer tilt (±3°) and an idle drift.
- Type:
  - Manrope, left-aligned.
  - Chapter headlines at `text-headline` size in white, with turquoise used only for emphasis.
  - Headlines end with a full stop.

## 5. Phones, reduced motion and fallbacks

**Phones** (`< lg`, or `pointer: coarse`)
- The object is framed in the top ~45% of the viewport (camera view offset 15%, so the panel clears the header and sits close above the text), each chapter text is vertically centred in the lower half so short chapters do not leave the bottom empty, and the step tracker sits along the bottom edge (safe-area aware), as it does bottom-left on desktop. Callouts that anchor to the panel top on desktop use a lower anchor on phones (1 Oct 2026).
- ⅓ of the "+" instances, no pointer tilt.
- `devicePixelRatio` capped at 1.25 (desktop 1.5).
- Shorter pinned scroll length.

**Always**
- Render only while the canvas is on-screen (IntersectionObserver) and the tab is visible.
- `dispose()` geometries, materials and the renderer on unmount.
- Kill the ScrollTrigger on route change.

**Reduced motion** (`prefers-reduced-motion: reduce`)
- No scroll-scrubbed animation.
- The story becomes 7 stacked chapters. Each renders one still frame (the scene set to that chapter's mid-point `p`) beside its text, with simple fades.
- Counters show their final values.

**No WebGL**
- The stacked chapters show the two exported posters: `public/design-b/opening-poster.jpg` (the opening) and `shield-poster.jpg` (the "Protect" moment).
- Posters are exported from the live scene with `scripts/capture-posters.mjs` (see its header). Re-run it after any change to the scene's look.

**Loading (1 Oct 2026, built for slow networks)**
- The section is a tall block (`600svh`, `700svh` from `lg`) with a `sticky` stage: CSS does the pinning, so the scroll length is in the server HTML and nothing shifts when scripts arrive. ScrollTrigger only maps the section's scroll range to progress (`pin: false`, `scrub: 0.6`).
- First HTML: H1, lede, CTA and the opening poster (`next/image`, eager, `fetchPriority="high"`, preloaded). The poster is the hero until the scene renders, and the whole hero when the scene never loads.
- GSAP and ScrollTrigger load on demand (`import("./gsap")`), not in the initial bundle.
- `three` and the scene load only after the window `load` event and when the browser is idle (`requestIdleCallback`, 2.5 s timeout), so they never compete with the poster, font or logo.
- On 2G, slow-2G or `Save-Data` the 3D is never downloaded. On 3G, 4 or fewer cores, or 4 GB or less memory, the scene runs at `low` quality.
- The canvas fades in over the poster of its own first frame once the scene is ready.
- Measured (production build, Chrome, CPU x4): slow 3G, HTML 2.7 s, LCP (H1) 2.9 s, poster 3.2 s, scene 14 s; fast 3G, LCP 1.2 s, poster 1.4 s, scene 6 s. Initial JS for `/` 242 KB gzipped (was 286 KB); the scene is a 146 KB gzipped chunk on top.

**Accessibility**
- The canvas is `aria-hidden`; the chapter text carries the full message.
- Visible focus styles.
- The menu sheet is keyboard-operable and closes on Escape.
- WCAG AA contrast.
- Headings follow order: one H1, then H2 per chapter or section.

## 6. Code structure

```
website/
├── app/b/page.tsx                       ← composes design B (server component)
├── content/                             ← shared data used by designs A and B
│   ├── products.ts   plans.ts   industries.ts   clients.ts   faqs.ts   contact.ts
├── components/design-b/
│   ├── HeaderB.tsx                      ← floating header + menu sheet (client)
│   ├── ShieldStory.tsx                  ← pinned section, chapter text, ScrollTrigger, loads scene (client)
│   ├── StoryCounters.tsx                ← day / touch counters + ATP meter overlay
│   ├── ShieldPoster.tsx                 ← no-WebGL / reduced-motion frame
│   ├── sections/                        ← ProductsB, ServiceB, IndustriesB, ClientsB, AboutH2HB, FaqB, ContactB, FooterB
│   └── scene/
│       ├── timeline.ts                  ← chapter ranges + pure helpers (chapterAt, local progress, counters)
│       ├── createShieldScene.ts         ← renderer, camera, lights; returns { setProgress, setPointer, resize, dispose }
│       └── objects/                     ← PlusField.ts, LiftPanel.ts, Mist.ts, Film.ts, Germs.ts, Fingerprints.ts
└── tests/design-b/timeline.test.ts      ← Vitest
```

**Interfaces**
- `timeline.ts` (pure, no Three.js):
  - `CHAPTERS` (id, start, end)
  - `chapterAt(p)`
  - `local(p, chapterId) → 0..1`
  - `dayAt(p) → 1..30`
  - `touchesAt(p) → integer`
  - `ease` helpers
- `createShieldScene(canvas, { quality: "high" | "low" })`:
  - `setProgress(p)`: each object's `update(p)` derives its state from `timeline.ts`.
  - `setPointer(x, y)`
  - `resize(w, h)`
  - `dispose()`
- `ShieldStory`:
  - Registers ScrollTrigger (`pin: true, scrub: 0.6`).
  - `onUpdate` → `scene.setProgress(self.progress)` and updates the chapter text / counters state.
  - Uses GSAP's context for cleanup.

**Shared content refactor**
- Design A's data arrays (packs, plans, industries, clients, FAQs, contact details) move to `content/*`.
- Design A's section files import them. **Design A's rendered output must stay identical** (screenshot-compared before and after).

**Dependencies**
- `three`, `gsap` (ScrollTrigger is included in the free package).
- Development only: `@types/three`, `vitest`.
- No other additions.

## 7. Testing

1. **Unit (Vitest, written first):**
   - chapter ranges are contiguous and cover `[0, 1]`
   - `chapterAt` returns the right chapter at each boundary
   - `local` clamps to `[0, 1]`
   - `dayAt(0.66) = 1` and `dayAt(0.88) = 30`
   - `touchesAt` is monotonic
2. **Static checks:** `npm run lint`, `npx tsc --noEmit`, `npm run build`.
3. **Visual (read-only Playwright against the user's running dev server; never start one):**
   - each chapter at 1440 and 390 px
   - reduced-motion mode
   - WebGL disabled (`--disable-webgl`)
   - `scrollWidth === innerWidth` at 390 / 1024 / 1440 at every scroll step
   - no console errors or warnings
   - scrubbing backwards returns to identical frames
4. **Design A regression:** full-page screenshots of `/` before and after the content refactor; they must match.

## 8. Out of scope

- Design C.
- CRM or backend work.
- Real footage.
- E-commerce.
- Changes to design A beyond the data import refactor.
- Any claim not already in the safe set.

## 9. Open items (don't block the build)

- Chapter ranges and scroll length will be tuned by feel once it's running.
- The poster image is exported once from the running scene during development (§5) and committed as a static file.
- Client-side unknowns (prices, contacts, logo permissions) are the same as design A's; see `docs/knowledge-base/07-issues-and-open-questions.md`.

## 10. Revisions after first review (28 Sep 2026)

The user reviewed the first build and found that the panel read as a random slab, that there was too much empty space, that the "+" opening looked crude, and that the navbar was weak. Changes made:

**Real space instead of a void**
- The story is set in a **lift lobby at night**: teal micro-cement cladding in 600 x 1200 mm panels with shadow-gap joints (procedural colour and normal maps from scene/noise.ts, 256 px on low quality, 512 px on high, about 20 ms to generate, nothing downloaded), slatted panelling, brushed-steel lift doors with a floor indicator, a steel crash rail at 85 cm (hidden in the phone layout so it never sits behind the chapter text), a polished floor, and ceiling downlights washing the wall. Tiles are laid so no joint crosses the call panel; a vertical joint either side of it gives the close shots their perspective lines. (1 Oct 2026)
- **The opening is the lobby itself.** The brand "+" marks drift in the air as a faint shimmer, replacing the nano close-up (the "touch of Powers of ten" is kept as the motif).

**Camera path:** lobby hero → closer wide shot ("Every surface gets touched.") → push in to a three-quarter view of the panel → bond / protect variations → ease back out for "Verify".

**The panel:** brushed steel on a dark bezel, floor buttons 1–4 in Manrope, door buttons, and a "▲ 04" floor display. Buttons light up when touched.

**Comprehension aids**
- Germs are soft translucent gel microbes (capsule, coccus, two-cell cluster) on sprites, teal membrane, fine hairs, baked contact shadow, no outlines (1 Oct 2026; the earlier inked cartoon look was replaced).
- Labels are anchored to the 3D panel ("Germs are back", "Fine ULV mist", "Bonded protective layer", "Germs break apart on contact").
- A step tracker (Clean · Apply · Bond · Protect · Verify).
- The bonded layer is a clipping-plane wipe of the brand "+" pattern (no stretched mesh, no hard edge line).

**Header:** transparent over the story, a light bar after it, and a true full-screen menu. (The "+" pattern's `position: relative` had been overriding `fixed`.)

**Touch schedule:** moved into `timeline.ts` (`ORDINARY_TOUCHES`, `PROTECT_TOUCHES`, `pressLevel`), unit-tested.

**Deferred:** moving design A's section data to `content/*` (a parallel session is building design C, which imports A's `Faq` and `Contact`).
