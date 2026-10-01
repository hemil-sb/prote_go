"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowDown, Clock, Fingerprint, ShieldCheck } from "lucide-react";
import { gsap } from "./gsap";
import {
  CHAPTERS,
  TOUCHES_TOTAL,
  chapterIndexAt,
  chapterOpacity,
  clockAt,
  dayAt,
  local,
  mid,
  smooth,
  touchesAt,
  type ChapterId,
} from "./scene/timeline";
import type { AnchorName, AnchorPoints, ShieldScene } from "./scene/createShieldScene";
import Link from "next/link";
import StoryStill from "./StoryStill";

/*
  Design B's centrepiece: "The Invisible Shield".
  - Default: the stage is pinned with GSAP ScrollTrigger; scroll progress drives the
    Three.js scene and the chapter text directly (refs, no React re-render per frame).
  - Reduced motion: no pin; the chapters stack, each with a still rendered from the scene.
  - No WebGL: the same stacked chapters, with the exported poster.
*/

// still frames exported from the scene, for the no-WebGL fallback
const OPENING_POSTER = "/design-b/opening-poster.jpg";
const SHIELD_POSTER = "/design-b/shield-poster.jpg";

// ── environment (useSyncExternalStore: SSR-safe, no setState in effects) ──
function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const m = window.matchMedia(query);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  };
}
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = subscribeMedia(REDUCE);

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport === null) {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      webglSupport = Boolean(gl);
      (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noop = () => () => {};

const isWide = () => window.matchMedia("(min-width: 1024px)").matches;

// ── chapter copy ──
type Final = boolean; // stacked mode shows the counters' end values

const btn = "btn inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold";

function chapterContent(i: number, final: Final): ReactNode {
  switch (CHAPTERS[i].id) {
    case "open":
      return (
        <>
          <p className="text-sm font-semibold tracking-wide text-turquoise">ProteGo Surface Protectant</p>
          <h1 id="story-title" className="mt-3 text-display font-normal text-white">
            Protection that doesn&rsquo;t sleep.
          </h1>
          <p className="mx-auto mt-5 max-w-[30rem] text-lede text-white/80 lg:mx-0">
            Disinfectants stop working once they dry. ProteGo keeps surfaces protected for up to 30 days, touch after touch.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link href="/contact" className={`${btn} bg-turquoise text-sherpa-deep hover:bg-white`}>
              Book a free assessment
            </Link>
            {!final && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/70">
                <ArrowDown aria-hidden className="size-4 motion-safe:animate-bounce" />
                Scroll to see how
              </span>
            )}
          </div>
        </>
      );
    case "pullout":
      return (
        <>
          <h2 className="text-headline font-normal text-white">Every surface gets touched.</h2>
          <p className="mx-auto mt-5 max-w-[28rem] text-lede text-white/80 lg:mx-0">
            Hundreds of times a day. Lift buttons, handles, handrails, desks.
          </p>
        </>
      );
    case "ordinary":
      return (
        <>
          <h2 className="text-headline font-normal text-white">Ordinary disinfectants stop working once they dry.</h2>
          <p className="mx-auto mt-5 max-w-[28rem] text-lede text-white/80 lg:mx-0">The next touch can bring germs straight back.</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            <Clock aria-hidden className="size-4 text-sherpa-tint" />
            Cleaned at 9:00 am · now <span data-counter="clock">{final ? "1:00 pm" : "9:00 am"}</span>
          </p>
        </>
      );
    case "apply":
      return (
        <>
          <h2 className="text-headline font-normal text-white">One application. A fine mist.</h2>
          <p className="mx-auto mt-5 max-w-[28rem] text-lede text-white/80 lg:mx-0">
            Professional ULV application reaches every high-touch surface.
          </p>
        </>
      );
    case "bond":
      return (
        <>
          <h2 className="text-headline font-normal text-white">An invisible layer bonds to the surface.</h2>
          <p className="mx-auto mt-5 max-w-[28rem] text-lede text-white/80 lg:mx-0">
            Si-QAC nanotechnology. About 98% water. Dries in about an hour.
          </p>
        </>
      );
    case "protect":
      return (
        <>
          <h2 className="text-headline font-normal text-white">Touch after touch. Day after day.</h2>
          <p className="mx-auto mt-5 max-w-[28rem] text-lede text-white/80 lg:mx-0">Up to 30 days of protection on treated surfaces.</p>
          <dl className="mx-auto mt-6 grid max-w-[22rem] grid-cols-2 gap-3 lg:mx-0">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-left">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-sherpa-tint">
                <ShieldCheck aria-hidden className="size-3.5 text-turquoise" /> Protected
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-turquoise">
                Day <span data-counter="day">{final ? 30 : 1}</span>
              </dd>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-left">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-sherpa-tint">
                <Fingerprint aria-hidden className="size-3.5 text-turquoise" /> Touches
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
                <span data-counter="touches">{final ? TOUCHES_TOTAL.toLocaleString("en-IN") : 0}</span>
              </dd>
            </div>
          </dl>
        </>
      );
    case "verify":
      return (
        <>
          <h2 className="text-headline font-normal text-white">Proof after every visit.</h2>
          <div className="mx-auto mt-6 max-w-[22rem] rounded-2xl bg-white/10 p-4 text-left lg:mx-0">
            <div className="flex items-center justify-between text-xs font-semibold text-sherpa-tint">
              <span>ATP reading (RLU)</span>
              <span>Sample</span>
            </div>
            <div className="mt-3 space-y-2 text-sm font-semibold">
              <div className="flex items-center gap-3">
                <span className="w-12 text-white/70">Before</span>
                <span className="h-2.5 flex-1 rounded-full bg-white/15">
                  <span className="block h-full w-full rounded-full bg-sherpa-tint/70" />
                </span>
                <span className="w-9 text-right tabular-nums">356</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-white/70">After</span>
                <span className="h-2.5 flex-1 rounded-full bg-white/15">
                  <span className="block h-full w-[5%] rounded-full bg-turquoise" />
                </span>
                <span className="w-9 text-right tabular-nums text-turquoise">18</span>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-[26rem] text-xs text-white/55 lg:mx-0">
            Illustration. ProteGo complements routine cleaning. Protection lasts up to 30 days on treated surfaces under normal conditions.
          </p>
        </>
      );
  }
}

const STILL_ALT = [
  "Glowing turquoise plus marks floating in the dark.",
  "The lift doors and call buttons, surfaces people touch all day.",
  "Fingerprints and germs back on the lift buttons a few hours after cleaning.",
  "A fine mist sweeping across the lift panel.",
  "A turquoise protective layer bonded across the panel, with charged tips rising from it.",
  "Germs breaking apart on contact with the protected panel.",
  "The protected lift panel, verified.",
];

// labels pinned to points on the 3D panel, so a newcomer knows what they're looking at
const CALLOUTS: { chapter: ChapterId; from: number; to: number; anchor: AnchorName; side: "left" | "right"; lead: number; text: string }[] =
  [
    { chapter: "ordinary", from: 0.5, to: 1, anchor: "up", side: "right", lead: 110, text: "Germs are back" },
    { chapter: "apply", from: 0.12, to: 0.9, anchor: "panelRight", side: "right", lead: 36, text: "Fine ULV mist" },
    { chapter: "bond", from: 0.35, to: 1, anchor: "panelTop", side: "right", lead: 56, text: "Bonded protective layer" },
    { chapter: "protect", from: 0.06, to: 0.94, anchor: "down", side: "right", lead: 110, text: "Germs break apart on contact" },
  ];
const CHAPTER_INDEX = Object.fromEntries(CHAPTERS.map((c, i) => [c.id, i])) as Record<ChapterId, number>;

// where the reader is in the process
const STEPS: { label: string; chapter: ChapterId }[] = [
  { label: "Clean", chapter: "ordinary" },
  { label: "Apply", chapter: "apply" },
  { label: "Bond", chapter: "bond" },
  { label: "Protect", chapter: "protect" },
  { label: "Verify", chapter: "verify" },
];
const FIRST_STEP = CHAPTER_INDEX.ordinary;

// ── pinned, scroll-driven story ──
function PinnedStory() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    let scene: ShieldScene | null = null;
    let disposed = false;
    let onScreen = true;
    const state = { p: 0 };
    const layout = () => (isWide() ? "side" : "top");

    const chapterEls = Array.from(stage.querySelectorAll<HTMLElement>("[data-chapter]"));
    const counter = (name: string) => stage.querySelector<HTMLElement>(`[data-counter="${name}"]`);
    const c = { clock: counter("clock"), day: counter("day"), touches: counter("touches") };
    const calloutEls = Array.from(stage.querySelectorAll<HTMLElement>("[data-callout]"));
    const calloutVis = new Float32Array(CALLOUTS.length);
    const tracker = stage.querySelector<HTMLElement>("[data-tracker]");
    const stepEls = Array.from(stage.querySelectorAll<HTMLElement>("[data-step]"));

    // follow the anchors every rendered frame
    const onFrame = (anchors: AnchorPoints) => {
      const w = stage.clientWidth;
      calloutEls.forEach((el, i) => {
        if (calloutVis[i] < 0.01) return;
        const a = anchors[CALLOUTS[i].anchor];
        if (!a) return;
        el.style.transform = `translate(${a.x}px, ${a.y}px)`;
        // prefer the configured side, flip if it doesn't fit, and always keep the label on screen
        const co = CALLOUTS[i];
        const pill = el.querySelector<HTMLElement>("[data-pill]");
        const line = el.querySelector<HTMLElement>("[data-line]");
        if (!pill || !line) return;
        const pw = pill.offsetWidth;
        const fitsRight = a.x + co.lead + pw + 12 <= w;
        const fitsLeft = a.x - co.lead - pw - 12 >= 0;
        const side = co.side === "right" ? (fitsRight || !fitsLeft ? "right" : "left") : fitsLeft || !fitsRight ? "left" : "right";
        const want = side === "right" ? a.x + co.lead : a.x - co.lead - pw;
        const left = Math.min(Math.max(want, 12), w - pw - 12); // page x of the pill's left edge
        pill.style.left = `${left - a.x}px`;
        pill.style.right = "";
        // leader line from the dot to the nearer edge of the pill
        const gap = side === "right" ? left - a.x - 8 : a.x - (left + pw) - 8;
        line.style.width = `${Math.max(0, gap)}px`;
        line.style.left = side === "right" ? "8px" : "";
        line.style.right = side === "left" ? "8px" : "";
      });
    };

    const apply = (p: number) => {
      scene?.setProgress(p);
      chapterEls.forEach((el, i) => {
        const o = chapterOpacity(p, i);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 14}px)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        el.setAttribute("aria-hidden", o < 0.01 ? "true" : "false");
      });
      if (c.clock) c.clock.textContent = clockAt(p);
      if (c.day) c.day.textContent = String(dayAt(p));
      if (c.touches) c.touches.textContent = touchesAt(p).toLocaleString("en-IN");

      CALLOUTS.forEach((co, i) => {
        const l = local(p, co.chapter);
        const v = chapterOpacity(p, CHAPTER_INDEX[co.chapter]) * smooth((l - co.from) / 0.1) * (1 - smooth((l - co.to) / 0.08));
        calloutVis[i] = v;
        if (calloutEls[i]) calloutEls[i].style.opacity = String(v);
      });

      if (tracker) tracker.style.opacity = String(smooth((p - CHAPTERS[FIRST_STEP].start + 0.02) / 0.04));
      const active = chapterIndexAt(p) - FIRST_STEP;
      stepEls.forEach((el, j) => {
        el.dataset.state = j < active ? "done" : j === active ? "active" : "todo";
      });
    };

    const gctx = gsap.context(() => {
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => apply(state.p),
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => "+=" + window.innerHeight * (isWide() ? 6 : 5),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, stage);
    apply(0);

    const syncActive = () => scene?.setActive(onScreen && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      syncActive();
    });
    io.observe(stage);
    document.addEventListener("visibilitychange", syncActive);
    const onResize = () => {
      scene?.setLayout(layout());
      scene?.resize();
    };
    window.addEventListener("resize", onResize);
    // the stage's real size, whatever changed it (first layout, zoom, pin, address bar)
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onPointer = (e: PointerEvent) =>
      scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    if (fine) window.addEventListener("pointermove", onPointer, { passive: true });

    import("./scene/createShieldScene")
      .then(({ createShieldScene }) => {
        if (disposed) return;
        scene = createShieldScene(canvas, { quality: fine && isWide() ? "high" : "low", layout: layout(), onFrame });
        scene.setProgress(state.p);
        requestAnimationFrame(onResize);
        syncActive();
        canvas.style.opacity = "1";
      })
      .catch(() => {
        // the gradient and the chapter text still tell the story
      });

    return () => {
      disposed = true;
      gctx.revert();
      io.disconnect();
      document.removeEventListener("visibilitychange", syncActive);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      scene?.dispose();
      scene = null;
    };
  }, []);

  return (
    <section id="story" data-hero aria-labelledby="story-title" className="relative bg-black">
      <div
        ref={stageRef}
        className="relative h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_at_50%_50%,#061a1e_0%,#020809_40%,#000000_75%)] text-white"
      >
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full opacity-0 transition-opacity duration-700" />
        {/* keep text legible over the scene */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#020809] via-[#020809]/85 to-transparent lg:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] bg-gradient-to-r from-[#020809]/85 via-[#020809]/40 to-transparent lg:block"
        />

        {/* labels that follow the 3D */}
        {CALLOUTS.map((co, i) => (
          <div
            key={co.text}
            data-callout={i}
            aria-hidden
            style={{ opacity: 0, transform: "translate(-9999px, 0)" }}
            className="pointer-events-none absolute left-0 top-0 z-10"
          >
            <span className="absolute -left-2 -top-2 size-4 rounded-full bg-turquoise ring-[6px] ring-turquoise/25" />
            <span data-line className="absolute top-0 h-px bg-white/70" style={{ width: co.lead - 8, left: 8 }} />
            <span
              data-pill
              className="absolute top-0 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-sherpa-deep shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] sm:text-sm"
              style={{ left: co.lead }}
            >
              {co.text}
            </span>
          </div>
        ))}

        {/* step tracker */}
        <ol
          data-tracker
          aria-hidden
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-x-0 top-[calc(50%-2.5rem)] z-10 flex justify-center gap-1.5 lg:inset-x-auto lg:bottom-10 lg:left-[var(--gutter)] lg:top-auto lg:justify-start"
        >
          {STEPS.map((st, j) => (
            <li
              key={st.label}
              data-step={j}
              data-state="todo"
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-white/45 ring-1 ring-white/15 transition-colors duration-300 data-[state=active]:bg-turquoise data-[state=active]:text-sherpa-deep data-[state=active]:ring-turquoise data-[state=done]:text-white/85 data-[state=done]:ring-white/30 sm:px-3 sm:text-xs"
            >
              <span className="tabular-nums opacity-70">{j + 1}</span>
              {st.label}
            </li>
          ))}
        </ol>

        <div className="wrap absolute inset-x-0 bottom-0 top-[50%] lg:right-auto lg:top-0 lg:w-[52%]">
          <div className="relative h-full">
            {CHAPTERS.map((c, i) => (
              <div
                key={c.id}
                data-chapter={i}
                aria-hidden={i === 0 ? "false" : "true"}
                style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" }}
                className="absolute inset-0 flex flex-col justify-start pt-4 text-center will-change-[opacity,transform] sm:pt-8 lg:justify-center lg:pt-0 lg:text-left"
              >
                {chapterContent(i, false)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── stacked story: reduced motion or no WebGL ──
function StackedStory({ webgl }: { webgl: boolean }) {
  const [stills, setStills] = useState<string[]>([]);

  useEffect(() => {
    if (!webgl) return;
    let cancelled = false;
    import("./scene/createShieldScene")
      .then(({ createShieldScene }) => {
        if (cancelled) return;
        const canvas = document.createElement("canvas");
        const scene = createShieldScene(canvas, { quality: "low", layout: "center", size: { width: 960, height: 720 } });
        const frames = CHAPTERS.map((c) => scene.renderStill(mid(c.id)));
        scene.dispose();
        if (!cancelled) setStills(frames);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [webgl]);

  return (
    <section id="story" data-hero aria-labelledby="story-title" className="bg-sherpa-deep pt-20 text-white">
      {CHAPTERS.map((c, i) => (
        <div key={c.id} className="wrap grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
          <StoryStill
            src={webgl ? stills[i] : c.id === "open" ? OPENING_POSTER : c.id === "protect" ? SHIELD_POSTER : undefined}
            alt={STILL_ALT[i]}
          />
          <div className="text-center lg:text-left">{chapterContent(i, true)}</div>
        </div>
      ))}
    </section>
  );
}

export default function ShieldStory() {
  const reduce = useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
  const webgl = useSyncExternalStore(noop, hasWebGL, () => true);
  if (reduce || !webgl) return <StackedStory webgl={webgl} />;
  return <PinnedStory />;
}
