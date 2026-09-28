"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import Split from "./Split";
import { gsap, MOTION, reveal, useGsap } from "./gsap";

const STEPS = [
  { title: "Clean.", body: "Both surfaces are cleaned and disinfected. For now, they are the same." },
  {
    title: "Dry.",
    body: "Once it dries, an ordinary disinfectant stops working. The ProteGo layer has bonded to the surface, and stays.",
  },
  {
    title: "Touch.",
    body: "Every touch after that can bring germs straight back. On ProteGo, the charged layer disrupts microbes on contact.",
  },
  {
    title: "Day 30.",
    body: "Protection lasts up to 30 days on treated surfaces under normal conditions. Then we renew it, and test again.",
  },
];

const DOTS = 24;
const HALF = DOTS / 2;

/*
  The cleaning gap, told as a pinned scroll story. The markup is the finished
  state (every step listed, day 30), which is what reduced-motion visitors and
  no-JS readers get; with motion allowed, GSAP pins the section and scrubs from
  "Clean" to "Day 30".
*/
export default function GapStory() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (mm, el) => {
    mm.add(MOTION, () => {
      reveal(el);
      el.dataset.stack = "";
      const q = gsap.utils.selector(el);
      const steps = q("[data-step]");
      const bars = q("[data-bar]");
      const germsA = q("[data-germ-a]");
      const germsB = q("[data-germ-b]");
      const plusB = q("[data-plus-b]");
      const [dryA, activeA] = [q("[data-status='a-dry']"), q("[data-status='a-active']")];
      const [appliedB, bondedB, lastingB] = [q("[data-status='b-applied']"), q("[data-status='b-bonded']"), q("[data-status='b-lasting']")];
      const dayEl = q("[data-day]")[0];
      const day = { n: 1 };

      gsap.set(steps.slice(1), { autoAlpha: 0, y: 24 });
      gsap.set(bars, { scaleX: 0 });
      gsap.set(bars[0], { scaleX: 1 });
      gsap.set(q("[data-meter-a]"), { scaleX: 1 });
      gsap.set([...germsA, ...germsB, ...plusB], { scale: 0, autoAlpha: 0 });
      gsap.set([dryA, bondedB, lastingB], { autoAlpha: 0 });
      gsap.set([activeA, appliedB], { autoAlpha: 1 });
      dayEl.textContent = "1";

      const swap = (tl: gsap.core.Timeline, from: number, to: number, at: number) =>
        tl
          .to(steps[from], { autoAlpha: 0, y: -24, duration: 0.3 }, at)
          .to(steps[to], { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.25)
          .to(bars[to], { scaleX: 1, duration: 0.3 }, at + 0.25);

      // germs land on both lanes; on ProteGo each one turns into a "+" soon after
      const land = (tl: gsap.core.Timeline, from: number, to: number, at: number) => {
        tl.to(germsA.slice(from, to), { scale: 1, autoAlpha: 1, duration: 0.15, stagger: 0.07 }, at)
          .to(germsB.slice(from, to), { scale: 1, autoAlpha: 1, duration: 0.15, stagger: 0.07 }, at)
          .to(germsB.slice(from, to), { scale: 0, autoAlpha: 0, duration: 0.12, stagger: 0.07 }, at + 0.22)
          .to(plusB.slice(from, to), { scale: 1, autoAlpha: 1, duration: 0.15, stagger: 0.07 }, at + 0.26);
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: "+=320%", pin: true, scrub: 0.6 },
      });
      tl.to({}, { duration: 0.8 }); // a beat on "Clean"

      swap(tl, 0, 1, 0.8);
      tl.to(q("[data-meter-a]"), { scaleX: 0, duration: 0.8, ease: "power1.in" }, 1.1)
        .to(activeA, { autoAlpha: 0, duration: 0.2 }, 1.6)
        .to(dryA, { autoAlpha: 1, duration: 0.2 }, 1.7)
        .to(appliedB, { autoAlpha: 0, duration: 0.2 }, 1.1)
        .to(bondedB, { autoAlpha: 1, duration: 0.2 }, 1.2);

      swap(tl, 1, 2, 2.3);
      land(tl, 0, HALF, 2.6);

      swap(tl, 2, 3, 3.8);
      land(tl, HALF, DOTS, 4.1);
      tl.to(day, { n: 30, duration: 1, onUpdate: () => void (dayEl.textContent = String(Math.round(day.n))) }, 4.1)
        .to(bondedB, { autoAlpha: 0, duration: 0.2 }, 4.9)
        .to(lastingB, { autoAlpha: 1, duration: 0.2 }, 5)
        .to({}, { duration: 0.5 });

      return () => {
        delete el.dataset.stack;
        dayEl.textContent = "30";
      };
    });
  });

  return (
    <section id="gap" ref={root} aria-labelledby="gap-title" className="on-dark bg-sherpa-deep text-white">
      <div data-pin className="wrap flex min-h-[100svh] flex-col justify-center gap-6 pb-6 pt-20 sm:gap-8 sm:py-20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-24">
        <div className="lg:col-span-5">
          <p className="text-sm font-semibold text-turquoise">Why it happens</p>
          <Split id="gap-title" text="The cleaning gap." className="mt-3 text-headline font-normal text-turquoise" />

          <ol className="mt-4 grid gap-6 sm:mt-10 [[data-stack]_&]:gap-0 [[data-stack]_&>li]:[grid-area:1_/_1]">
            {STEPS.map((s) => (
              <li key={s.title} data-step>
                <p className="text-title font-semibold text-white">{s.title}</p>
                <p className="mt-1.5 max-w-[30rem] text-white/75 sm:mt-2 sm:text-lg">{s.body}</p>
              </li>
            ))}
          </ol>

          <div aria-hidden className="mt-8 hidden gap-1.5 [[data-stack]_&]:sm:flex">
            {STEPS.map((s) => (
              <span key={s.title} className="h-1 w-10 overflow-hidden rounded-full bg-white/15">
                <span data-bar className="block h-full origin-left bg-turquoise" />
              </span>
            ))}
          </div>
        </div>

        <figure className="m-0 rounded-[1.75rem] bg-sherpa p-5 sm:rounded-[2rem] sm:p-8 lg:col-span-7 lg:col-start-6 lg:p-10">
          <div className="flex items-end justify-between gap-4 border-b border-white/15 pb-3 sm:pb-6">
            <p className="text-xs text-white/70 sm:text-sm">
              Two surfaces,
              <br />
              cleaned on day 1
            </p>
            <p className="text-right">
              <span className="block text-xs font-semibold text-white/60">Day</span>
              <span data-day className="block text-[clamp(2.25rem,1.6rem+3vw,4.5rem)] font-light leading-none tabular-nums text-turquoise">
                30
              </span>
            </p>
          </div>

          <Lane
            name="Ordinary disinfectant"
            statuses={[
              { key: "a-active", text: "Active", final: false },
              { key: "a-dry", text: "Dried. Stopped working.", final: true },
            ]}
            meter={<span data-meter-a className="block h-full origin-left rounded-full bg-sherpa-tint" style={{ transform: "scaleX(0)" }} />}
            germs={Array.from({ length: DOTS }, (_, i) => (
              <span key={i} data-germ-a className="size-2.5 rounded-full bg-sherpa-tint ring-2 ring-white/10 sm:size-3" />
            ))}
          />
          <Lane
            name="ProteGo layer"
            accent
            statuses={[
              { key: "b-applied", text: "Applied", final: false },
              { key: "b-bonded", text: "Bonded. Still working.", final: false },
              { key: "b-lasting", text: "Still working. Renew on day 30.", final: true },
            ]}
            meter={<span className="block h-full rounded-full bg-turquoise" />}
            germs={Array.from({ length: DOTS }, (_, i) => (
              <span key={i} className="relative grid size-2.5 place-items-center sm:size-3">
                <span data-germ-b className="absolute inset-0 rounded-full bg-sherpa-tint" style={{ transform: "scale(0)", opacity: 0 }} />
                <span data-plus-b className="absolute inset-0 grid place-items-center">
                  <Plus className="size-3.5 text-turquoise sm:size-4" strokeWidth={3} />
                </span>
              </span>
            ))}
          />
          <figcaption className="mt-4 text-xs text-white/55 sm:mt-8">
            Illustration. Each dot stands for germs brought by a touch. ProteGo complements routine cleaning; it does not replace it.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Lane({
  name,
  accent = false,
  statuses,
  meter,
  germs,
}: {
  name: string;
  accent?: boolean;
  statuses: { key: string; text: string; final: boolean }[];
  meter: React.ReactNode;
  germs: React.ReactNode;
}) {
  return (
    <div className="mt-4 sm:mt-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p className={`font-semibold ${accent ? "text-turquoise" : "text-white"}`}>{name}</p>
        <p className="ml-auto grid text-right text-xs text-white/70 sm:text-sm">
          {statuses.map((s) => (
            <span key={s.key} data-status={s.key} className={`[grid-area:1_/_1] ${s.final ? "" : "opacity-0"}`}>
              {s.text}
            </span>
          ))}
        </p>
      </div>
      <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/10 sm:mt-3">{meter}</div>
      <div aria-hidden className="mt-3 grid grid-cols-12 place-items-center gap-y-2 sm:mt-4 sm:gap-y-2.5">
        {germs}
      </div>
    </div>
  );
}
