"use client";

import { Fingerprint, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/*
  "What happens when people touch it?"
  Two lift buttons, both cleaned this morning. Every touch leaves germs behind.
  The ordinary surface keeps them; the ProteGo surface neutralises them as they land.
  Loops on its own while on screen (touches up to 100, a pause on the takeaway, both cleaned again).
  Visitors can add touches at any time.
  An illustration, not lab data.
*/

const STEP = 10; // touches per press
const GOAL = 100; // touches at which the takeaway appears
const MAX_DOTS = 70;
const HOLD_MS = 3000;
const PRESS_MS = 550; // time between presses; a full loop is about 9 s // how long the takeaway stays before the loop restarts

function scatter(count: number, seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const angle = rand() * Math.PI * 2;
    const radius = 10 + Math.pow(rand(), 0.8) * 36;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius * 0.92,
      size: 5 + rand() * 6,
      shade: 0.45 + rand() * 0.45,
    };
  });
}

export default function TouchTest() {
  const [touches, setTouches] = useState(0);
  const [pressKey, setPressKey] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const dots = useMemo(() => scatter(MAX_DOTS, 7), []);
  const burst = useMemo(() => scatter(6, pressKey * 31 + 3), [pressKey]);

  const level = 1 - Math.exp(-touches / 40);
  const visibleDots = Math.round(level * MAX_DOTS);
  const done = touches >= GOAL;

  // Run only while the card is on screen. With reduced motion, show the end state instead.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setReduced(true);
          setTouches((n) => Math.max(n, GOAL));
          return;
        }
        setInView(entry.isIntersecting);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Continuous demo: a press every PRESS_MS up to the goal, hold on the takeaway, clean both, repeat
  const playing = inView && !reduced;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(
      () => {
        if (touches >= GOAL) {
          setTouches(0);
          setPressKey(0);
        } else {
          setTouches((n) => n + STEP);
          setPressKey((k) => k + 1);
        }
      },
      touches >= GOAL ? HOLD_MS : touches === 0 ? 900 : PRESS_MS,
    );
    return () => clearTimeout(t);
  }, [playing, touches]);

  function touch() {
    setTouches((n) => n + STEP);
    setPressKey((k) => k + 1);
  }

  function reset() {
    setTouches(0);
    setPressKey(0);
  }

  const leftStatus = touches === 0 ? "Just cleaned" : level < 0.45 ? "Germs coming back" : "Germs are back";

  return (
    <div ref={ref} className="on-dark relative overflow-hidden rounded-[2rem] bg-sherpa-deep p-5 text-white sm:p-8">
      <p className="text-title font-semibold">What happens when people touch it?</p>
      <p className="mt-1 text-sm text-sherpa-tint">Both lift buttons were cleaned this morning.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5">
        <Surface label="Ordinary disinfectant" pressKey={pressKey} onTouch={touch}>
          {dots.slice(0, visibleDots).map((d, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute rounded-full bg-sherpa-deep"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.size,
                height: d.size,
                opacity: d.shade,
                boxShadow: "0 0 0 2px rgb(13 44 51 / 0.12)",
                animation: "land 380ms ease-out both",
              }}
            />
          ))}
        </Surface>

        <Surface label="ProteGo" treated pressKey={pressKey} onTouch={touch}>
          {pressKey > 0 &&
            burst.map((d, i) => (
              <span key={`${pressKey}-${i}`} aria-hidden className="absolute" style={{ left: `${d.x}%`, top: `${d.y}%` }}>
                <span
                  className="block rounded-full bg-sherpa-deep"
                  style={{ width: d.size, height: d.size, animation: `neutralise 800ms ${i * 30}ms ease-out both` }}
                />
                <span
                  className="absolute inset-0 rounded-full border-2 border-turquoise-deep"
                  style={{ animation: `ring 650ms ${150 + i * 30}ms ease-out both` }}
                />
              </span>
            ))}
        </Surface>
      </div>

      {/* results */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5">
        <p className={`flex items-center gap-2 text-sm font-semibold ${touches === 0 ? "text-white/70" : "text-white"}`}>
          {touches > 0 && <TriangleAlert aria-hidden className="size-4 shrink-0 text-spring" strokeWidth={2} />}
          {leftStatus}
        </p>
        <p className="flex items-center gap-2 text-sm font-semibold text-turquoise">
          <ShieldCheck aria-hidden className="size-4 shrink-0" strokeWidth={2} />
          {touches === 0 ? "Protected" : "Still protected"}
        </p>
      </div>

      {/* controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
        <p className="tabular-nums">
          <span className="text-headline font-light text-turquoise">{touches}</span>
          <span className="ml-2 text-sm font-semibold text-white/80">touches</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={touch}
            className="flex items-center gap-2 rounded-full bg-turquoise px-5 py-3 text-sm font-semibold text-sherpa-deep btn hover:bg-white"
          >
            <Fingerprint aria-hidden className="size-4" strokeWidth={2} />
            Touch {STEP} more times
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Clean both again"
            className="grid size-11 place-items-center rounded-full border border-white/30 text-white btn hover:border-white"
          >
            <RotateCcw aria-hidden className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* takeaway */}
      <p
        aria-live="polite"
        className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
          done ? "bg-turquoise text-sherpa-deep" : "bg-white/[0.06] text-white/75"
        }`}
      >
        {done
          ? "The disinfectant stopped working when it dried. ProteGo keeps working, touch after touch."
          : touches === 0
            ? "Both buttons were just cleaned. Watch what happens as people touch them."
            : "Every touch leaves germs behind…"}
      </p>

      <p className="mt-4 text-xs text-sherpa-tint">Illustration only. Up to 30 days of protection under normal conditions.</p>
    </div>
  );
}

function Surface({
  label,
  treated = false,
  pressKey,
  onTouch,
  children,
}: {
  label: string;
  treated?: boolean;
  pressKey: number;
  onTouch: () => void;
  children: React.ReactNode;
}) {
  return (
    <figure className="m-0">
      <figcaption className="mb-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            treated ? "bg-turquoise text-sherpa-deep" : "bg-white/15 text-white"
          }`}
        >
          {label}
        </span>
      </figcaption>
      <button
        type="button"
        onClick={onTouch}
        aria-label={`Touch the ${label} lift button`}
        className="relative block aspect-square w-full cursor-pointer overflow-hidden rounded-[1.25rem]"
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, var(--color-spring) 45%, var(--color-spring-deep) 100%)",
        }}
      >
        {treated && (
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgb(106 230 220 / 0.32), rgb(106 230 220 / 0.1) 62%, transparent 76%)",
            }}
          />
        )}

        {/* lift call button */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 grid size-[38%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-spring-deep bg-panel shadow-[inset_0_2px_6px_rgb(13_44_51/0.18)]"
        >
          <svg viewBox="0 0 24 24" className="size-1/3 text-sherpa-deep/70" fill="currentColor">
            <path d="M12 5 5 14h14z" />
          </svg>
        </span>

        {children}

        {/* finger pressing the button */}
        {pressKey > 0 && (
          <span key={pressKey} aria-hidden className="absolute left-1/2 top-1/2">
            {/* ripple from the point of contact */}
            <span
              className="absolute left-0 top-0 block size-14 rounded-full border-2 border-sherpa-deep/35 sm:size-16"
              style={{ animation: "touch-ripple 520ms 120ms ease-out both" }}
            />
            {/* fingertip */}
            <span
              className="absolute left-0 top-0 grid size-14 place-items-center rounded-full bg-white/75 text-sherpa-deep shadow-[0_6px_16px_-4px_rgb(13_44_51/0.35)] ring-1 ring-sherpa-deep/15 backdrop-blur-[2px] sm:size-16"
              style={{ animation: "press 480ms ease-in-out both" }}
            >
              <Fingerprint className="size-7 sm:size-8" strokeWidth={1.4} />
            </span>
          </span>
        )}
      </button>
    </figure>
  );
}
