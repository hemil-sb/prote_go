"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { Fingerprint, SprayCan } from "lucide-react";
import { gsap } from "./gsap";
import type { Side, TouchInfo, TouchScene } from "./touchScene";
import { signal, when } from "./intro";

type Mode = "loading" | "ready" | "fallback";

const FIRST_HINT = "Touch the surface. Either side.";

/*
  Design C hero: the full-screen touch test. The Three.js scene is loaded after
  hydration, then a short demo plays until the visitor taps or clicks the surface.

  The overlays (corner counters, intro card, actions) are small solid panels that
  block touches, so germs only land on open surface and never behind text. Over the
  surface the mouse becomes a dot in a ring that tracks it directly; the demo uses a
  separate fingertip mark and stops when the visitor first touches the surface.
  Keyboard users get a "touch this surface" button on each side card, and a live
  region reads out the counts.
*/
export default function TouchLab() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const finger = useRef<HTMLDivElement>(null);
  const pointer = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const ordinaryCount = useRef<HTMLSpanElement>(null);
  const protegoCount = useRef<HTMLSpanElement>(null);
  const actions = useRef({ clean: () => {}, touch: (side: Side) => void side });
  const [mode, setMode] = useState<Mode>("loading");
  const [hint, setHint] = useState<string | null>(FIRST_HINT);
  const [announce, setAnnounce] = useState("");
  const [cleaning, setCleaning] = useState(false);

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    const tip = finger.current;
    const cursor = pointer.current;
    if (!el || !cv || !tip || !cursor) return;

    let scene: TouchScene | null = null;
    let disposed = false;
    let demo: gsap.core.Timeline | null = null;
    let offIntro = () => {};
    let ro: ResizeObserver | undefined;
    let io: IntersectionObserver | undefined;
    const calls: gsap.core.Tween[] = [];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tally = { ordinary: 0, protego: 0, ordinaryTouches: 0, protegoTouches: 0 };
    const shown = { ordinary: 0, protego: 0 };

    gsap.set([tip, cursor], { xPercent: -50, yPercent: -50 });
    // the cursor tracks the mouse directly, with no easing, so it never lags behind the hand
    const cursorX = gsap.quickSetter(cursor, "x", "px");
    const cursorY = gsap.quickSetter(cursor, "y", "px");
    let cursorOn = false;
    const showCursor = (on: boolean) => {
      if (on === cursorOn) return;
      cursorOn = on;
      gsap.set(cursor, { autoAlpha: on ? 1 : 0 });
    };

    // The open surface between the counters and the intro card, in canvas pixels
    function openBand() {
      const top = el!.getBoundingClientRect().top;
      const a = (cards.current?.getBoundingClientRect().bottom ?? top) - top + 40;
      const b = (intro.current?.getBoundingClientRect().top ?? top + el!.clientHeight) - top - 40;
      return b - a > 40 ? [a, b] : [el!.clientHeight * 0.35, el!.clientHeight * 0.55];
    }

    // Count up (or down) to a value, then give the number a small nudge
    function show(key: "ordinary" | "protego", value: number, delay = 0) {
      const target = key === "ordinary" ? ordinaryCount.current : protegoCount.current;
      if (!target) return;
      gsap.to(shown, {
        [key]: value,
        duration: 0.7,
        delay,
        ease: "power2.out",
        overwrite: "auto",
        onStart: () => void gsap.fromTo(target, { scale: 1.12 }, { scale: 1, duration: 0.45, ease: "power2.out" }),
        onUpdate: () => void (target.textContent = String(Math.round(shown[key]))),
      });
    }

    function record(info: TouchInfo | null, announceIt: boolean) {
      if (!info) return;
      if (info.side === "ordinary") {
        tally.ordinaryTouches++;
        tally.ordinary += info.germs;
        show("ordinary", tally.ordinary);
        if (announceIt)
          setAnnounce(
            `Ordinary surface: ${tally.ordinary} germs left behind after ${tally.ordinaryTouches} ${tally.ordinaryTouches === 1 ? "touch" : "touches"}.`,
          );
      } else {
        tally.protegoTouches++;
        tally.protego += info.germs;
        show("protego", tally.protego, info.settle * 0.5);
        if (announceIt)
          setAnnounce(
            `ProteGo surface: ${tally.protego} germs disrupted on contact after ${tally.protegoTouches} ${tally.protegoTouches === 1 ? "touch" : "touches"}.`,
          );
      }
    }

    function stopDemo() {
      if (!demo) return;
      demo.kill();
      demo = null;
      gsap.to(tip, { autoAlpha: 0, scale: 1, duration: 0.2 });
    }

    // A fingertip shows the idea: three touches on each side, spread over the open surface
    function startDemo(s: TouchScene) {
      const [yMin, yMax] = openBand();
      const tl = gsap.timeline({ delay: 0.5 });
      // top, bottom and middle of each side, so the demo covers the whole surface
      const rows = [0.12, 0.3, 0.88, 0.7, 0.5, 0.45];
      (["ordinary", "protego", "ordinary", "protego", "ordinary", "protego"] as Side[]).forEach((side, i) => {
        const y = yMin + (rows[i] + (Math.random() - 0.5) * 0.08) * (yMax - yMin);
        const pt = s.randomScreenPoint(side, y, y);
        tl.to(tip, { x: pt.x, y: pt.y, autoAlpha: 1, duration: i === 0 ? 0.01 : 0.7, ease: "power2.inOut" })
          .to(tip, { scale: 0.75, duration: 0.12, ease: "power2.in" })
          .call(() => record(s.touchAtScreen(pt.x, pt.y), false))
          .to(tip, { scale: 1, duration: 0.3, ease: "power2.out" })
          .to({}, { duration: 0.45 });
      });
      tl.to(tip, { autoAlpha: 0, duration: 0.3 });
      demo = tl;
    }

    const local = (e: MouseEvent | PointerEvent) => {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    // clicks on the cards, the dock or any control never touch the surface
    const onOverlay = (e: Event) => !!(e.target as Element).closest("a, button, [data-panel]");

    function onClick(e: MouseEvent) {
      if (!scene || onOverlay(e)) return;
      stopDemo();
      const { x, y } = local(e);
      record(scene.touchAtScreen(x, y), true);
      gsap.fromTo(cursor, { scale: 0.7 }, { scale: 1, duration: 0.35, ease: "power2.out" });
      setHint(null);
    }

    // The cursor is always the visitor's own; the demo plays on with its separate
    // fingertip until they touch the surface themselves
    function onMove(e: PointerEvent) {
      if (!scene || e.pointerType !== "mouse") return;
      const { x, y } = local(e);
      scene.setPointer(x, y, true);
      cursorX(x);
      cursorY(y);
      // over the panels and buttons the normal cursor comes back
      showCursor(!onOverlay(e));
    }
    function onLeave(e: PointerEvent) {
      if (!scene || e.pointerType !== "mouse") return;
      scene.setPointer(0, 0, false);
      showCursor(false);
    }

    actions.current.clean = () => {
      if (!scene) return;
      stopDemo();
      const d = scene.clean();
      setCleaning(true);
      setHint(null);
      calls.push(
        gsap.delayedCall(d * 0.5, () => {
          tally.ordinary = 0;
          tally.ordinaryTouches = 0;
          show("ordinary", 0);
        }),
        gsap.delayedCall(d, () => {
          setCleaning(false);
          setHint("Both cleaned. Now touch the ordinary side again.");
          setAnnounce("Both surfaces wiped clean. The ordinary surface has no protection left for the next touch.");
        }),
        gsap.delayedCall(d + 5, () => setHint(null)),
      );
    };

    actions.current.touch = (side) => {
      if (!scene) return;
      stopDemo();
      const [yMin, yMax] = openBand();
      const pt = scene.randomScreenPoint(side, yMin, yMax);
      record(scene.touchAtScreen(pt.x, pt.y), true);
      setHint(null);
    };

    import("./touchScene").then(({ createTouchScene }) => {
      if (disposed) return;
      scene = createTouchScene(cv, { reducedMotion: reduce, lite: el.clientWidth < 768 });
      if (!scene) {
        setMode("fallback");
        setHint(null);
        signal("scene");
        return;
      }
      const s = scene;
      s.resize(el.clientWidth, el.clientHeight);
      ro = new ResizeObserver(() => s.resize(el.clientWidth, el.clientHeight));
      ro.observe(el);
      // render only while the hero is on screen, and not until the loading screen has gone
      // (resize has already drawn one still frame, compiling the shaders, for it to open onto)
      let visible = true;
      let introDone = false;
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        s.setRunning(visible && introDone);
      });
      io.observe(el);
      el.addEventListener("click", onClick);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      setMode("ready");
      signal("scene");
      // once the loading screen has gone: start rendering, then the demo
      offIntro = when("intro", () => {
        introDone = true;
        s.setRunning(visible);
        if (!reduce) startDemo(s);
      });
    });

    return () => {
      disposed = true;
      offIntro();
      demo?.kill();
      calls.forEach((c) => c.kill());
      gsap.killTweensOf([shown, tip, cursor]);
      ro?.disconnect();
      io?.disconnect();
      el.removeEventListener("click", onClick);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      scene?.dispose();
    };
  }, []);

  const ready = mode === "ready";

  return (
    <section
      ref={root}
      aria-labelledby="c-hero-title"
      data-ready={ready || undefined}
      className="relative isolate h-[100svh] min-h-[600px] touch-manipulation select-none overflow-hidden bg-spring [-webkit-tap-highlight-color:transparent] data-[ready]:[@media(hover:hover)_and_(pointer:fine)]:cursor-none"
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      {mode === "fallback" && <FallbackArt />}

      {/* the demo's fingertip; a separate mark, never the visitor's cursor */}
      <div
        ref={finger}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 z-10 size-12 rounded-full bg-orient/25 ring-2 ring-orient/60"
      />

      {/* the visitor's cursor over the surface: a dot in a ring */}
      <div
        ref={pointer}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 z-30 grid size-11 place-items-center rounded-full border-2 border-sherpa-deep/70"
      >
        <span className="size-1.5 rounded-full bg-sherpa-deep" />
      </div>

      <div className="pointer-events-none relative z-20 flex h-full flex-col pt-[4.75rem] lg:pt-24">
        {/* live counters, one slim pill in each top corner */}
        <div ref={cards} className="wrap grid w-full grid-cols-2 items-start gap-3 sm:gap-[10vw]">
          <SideCard side="ordinary" countRef={ordinaryCount} onTouch={() => actions.current.touch("ordinary")} disabled={!ready} />
          <SideCard side="protego" countRef={protegoCount} onTouch={() => actions.current.touch("protego")} disabled={!ready} />
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          {hint && ready && (
            <p
              key={hint}
              className="ind-fade flex items-center gap-2 rounded-full bg-white/85 px-4 py-2.5 text-sm font-semibold text-sherpa-deep shadow-[0_10px_30px_-12px_rgb(13_44_51/0.35)] ring-1 ring-spring-deep backdrop-blur-md"
            >
              <Fingerprint aria-hidden className="size-4 shrink-0 text-orient" strokeWidth={2} />
              {hint}
            </p>
          )}
        </div>

        {/* compact intro in the bottom-left corner, actions in the bottom-right */}
        <div className="wrap flex w-full items-end justify-between gap-6 pb-24 lg:pb-8">
          <div
            ref={intro}
            data-panel
            className="pointer-events-auto w-full cursor-auto rounded-3xl bg-spring/90 p-4 shadow-[0_16px_40px_-24px_rgb(13_44_51/0.4)] ring-1 ring-spring-deep backdrop-blur-md sm:max-w-[26rem] sm:p-6"
          >
            <p className="text-xs font-semibold text-orient sm:text-sm">The ProteGo touch test</p>
            <h1
              id="c-hero-title"
              className="mt-1 text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] font-normal leading-[1.05] tracking-[-0.03em] text-sherpa-deep"
            >
              Touch both sides.
            </h1>
            <p className="mt-2 hidden text-ink/75 sm:block">
              Ordinary disinfectants stop working once they dry. ProteGo keeps working between cleans, for up to 30 days.
            </p>
            <p className="mt-2 text-xs text-ink/55">Illustration, not lab data. Germs shown far larger than life.</p>
            <div className="mt-4 lg:hidden">
              <Actions ready={ready} cleaning={cleaning} onClean={() => actions.current.clean()} />
            </div>
          </div>
          <div data-panel className="pointer-events-auto hidden shrink-0 cursor-auto lg:block">
            <Actions ready={ready} cleaning={cleaning} onClean={() => actions.current.clean()} />
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </section>
  );
}

function SideCard({
  side,
  countRef,
  onTouch,
  disabled,
}: {
  side: Side;
  countRef: Ref<HTMLSpanElement>;
  onTouch: () => void;
  disabled: boolean;
}) {
  const pro = side === "protego";
  return (
    <div
      data-panel
      className={`pointer-events-auto cursor-auto rounded-2xl px-3 py-2 shadow-[0_12px_30px_-20px_rgb(13_44_51/0.5)] sm:w-fit sm:rounded-full sm:px-5 sm:py-2.5 ${
        pro ? "on-dark bg-sherpa-deep text-white" : "bg-white/90 text-sherpa-deep ring-1 ring-spring-deep backdrop-blur-md"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <p className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
          <span aria-hidden className={`size-2 shrink-0 rounded-full ${pro ? "bg-turquoise" : "bg-sherpa-deep/35"}`} />
          {pro ? "ProteGo surface" : "Ordinary surface"}
        </p>
        <span aria-hidden className={`hidden h-6 w-px sm:block ${pro ? "bg-white/20" : "bg-spring-deep"}`} />
        <p className="flex flex-wrap items-baseline gap-x-1.5">
          <span
            ref={countRef}
            className={`inline-block text-xl font-light tabular-nums tracking-tight sm:text-2xl ${pro ? "text-turquoise" : ""}`}
          >
            0
          </span>
          <span className={`text-xs sm:text-sm ${pro ? "text-white/75" : "text-ink/65"}`}>
            {pro ? (
              <>
                <span className="hidden sm:inline">germs </span>disrupted on contact
              </>
            ) : (
              "germs left behind"
            )}
          </span>
        </p>
      </div>
      <button
        type="button"
        onClick={onTouch}
        disabled={disabled}
        className={`sr-only cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold focus:not-sr-only focus:mt-2 focus:inline-block ${
          pro ? "bg-turquoise text-sherpa-deep" : "bg-sherpa text-white"
        }`}
      >
        Touch this surface
      </button>
    </div>
  );
}

function Actions({ ready, cleaning, onClean }: { ready: boolean; cleaning: boolean; onClean: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
      <a href="#contact" className="btn rounded-full bg-sherpa px-5 py-3.5 font-semibold text-white hover:bg-sherpa-deep">
        Book a free assessment
      </a>
      <button
        type="button"
        onClick={onClean}
        disabled={!ready || cleaning}
        aria-label="Clean both surfaces"
        className="btn inline-flex size-[3.25rem] cursor-pointer items-center justify-center gap-2 rounded-full border border-sherpa/25 bg-white font-semibold text-sherpa-deep hover:border-sherpa disabled:cursor-default disabled:opacity-50 sm:size-auto sm:px-5 sm:py-3.5"
      >
        <SprayCan aria-hidden className="size-5 sm:size-4" strokeWidth={2} />
        <span className="hidden sm:inline">Clean both surfaces</span>
      </button>
    </div>
  );
}

/* Shown when WebGL isn't available: the same idea, drawn flat. */
function FallbackArt() {
  const dots = [
    [22, 44],
    [26, 50],
    [19, 53],
    [30, 46],
    [24, 57],
    [33, 54],
    [15, 47],
    [28, 40],
  ];
  return (
    <div aria-hidden className="absolute inset-0 grid grid-cols-2">
      <div className="relative bg-panel">
        <div className="absolute left-[16%] top-[38%] h-[20%] w-[22%] rounded-[50%] border-[6px] border-dotted border-sherpa-deep/15" />
        {dots.map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            className="absolute size-3 rounded-full bg-sherpa-deep"
            style={{ left: `${x * 2}%`, top: `${y}%` }}
          />
        ))}
      </div>
      <div className="plus-field relative border-l-2 border-orient/60 bg-turquoise-tint" data-fade="tl">
        <span className="absolute left-[40%] top-[46%] size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-turquoise-deep/60" />
        <span className="absolute left-[40%] top-[46%] size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-turquoise-deep/30" />
      </div>
    </div>
  );
}
