"use client";

import { useRef } from "react";
import { ApplyArt, BondArt, ProtectArt, VerifyArt } from "@/components/StepArt";
import RailDots from "@/components/RailDots";
import Split from "./Split";
import { gsap, MOTION, reveal, useGsap } from "./gsap";

const STEPS = [
  { art: ApplyArt, title: "Apply", body: "A fine ULV mist coats every high-touch surface." },
  { art: BondArt, title: "Bond", body: "It dries in about an hour into an invisible, bonded layer." },
  { art: ProtectArt, title: "Protect", body: "Charged tips disrupt microbes on contact, for up to 30 days." },
  { art: VerifyArt, title: "Verify", body: "We ATP test before and after, and send you a digital report." },
];

/*
  How it works. On desktop the section pins and the steps slide past sideways as
  you scroll; below lg they are a swipeable rail. With reduced motion, desktop
  shows a plain five-column grid.
*/
export default function HowSteps() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (mm, el) => {
    mm.add(MOTION, () => reveal(el));

    mm.add(`${MOTION} and (min-width: 1024px)`, () => {
      el.dataset.hscroll = "";
      const q = gsap.utils.selector(el);
      const track = q("[data-track]")[0];
      const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q("[data-pin]")[0],
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      tl.to(track, { x: () => -distance() }, 0).fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1 }, 0);
      return () => void delete el.dataset.hscroll;
    });
  });

  return (
    <section id="how" ref={root} aria-labelledby="how-title" className="plus-field bg-spring" data-fade="tr">
      <div data-pin className="flex flex-col justify-center py-16 sm:py-24 lg:min-h-[100svh] lg:overflow-hidden lg:py-24">
        <div className="wrap w-full lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-orient">How it works</p>
            <Split
              id="how-title"
              text="Protect once. Clean as usual. Measurable every time."
              className="mt-3 text-headline font-normal text-sherpa-deep"
            />
          </div>
          <p data-reveal="0.15" className="mt-5 max-w-[28rem] text-lede text-ink/70 lg:col-span-4 lg:col-start-9 lg:mt-0">
            Si-QAC nanotechnology bonds to the surface, so protection stays put instead of drying away.
          </p>
        </div>

        <div className="wrap mt-10 w-full sm:mt-14">
          <ol
            id="how-steps"
            data-track
            className="rail lg:grid lg:grid-cols-5 lg:gap-4 [[data-hscroll]_&]:lg:flex [[data-hscroll]_&]:lg:gap-6"
          >
            {STEPS.map(({ art: Art, title, body }, i) => (
              <li
                key={title}
                className="flex flex-col rounded-[1.75rem] bg-white p-5 sm:p-7 [[data-hscroll]_&]:lg:w-[min(30rem,34vw)] [[data-hscroll]_&]:lg:shrink-0 [[data-hscroll]_&]:lg:p-9"
              >
                <div className="rounded-2xl bg-turquoise-tint px-3 py-4 sm:px-5 sm:py-6">
                  <Art />
                </div>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-sm font-semibold tabular-nums text-orient">0{i + 1}</span>
                  <h3 className="text-title font-semibold text-sherpa-deep">{title}</h3>
                </div>
                <p className="mt-2 text-ink/70">{body}</p>
              </li>
            ))}
            <li className="on-dark flex flex-col justify-between rounded-[1.75rem] bg-sherpa p-6 text-white sm:p-8 [[data-hscroll]_&]:lg:w-[min(30rem,34vw)] [[data-hscroll]_&]:lg:shrink-0 [[data-hscroll]_&]:lg:p-10">
              <div>
                <span className="text-sm font-semibold text-turquoise">Then</span>
                <h3 className="mt-3 text-title font-semibold">Clean as usual.</h3>
                <p className="mt-3 text-white/80">
                  Keep your routine. ProteGo complements cleaning; it does not replace it. The layer keeps working in between, and we
                  renew it every 30 days.
                </p>
              </div>
              <a
                href="#proof"
                className="btn mt-8 inline-flex w-fit rounded-full bg-turquoise px-5 py-3 text-sm font-semibold text-sherpa-deep hover:bg-white"
              >
                See the proof
              </a>
            </li>
          </ol>
          <RailDots railId="how-steps" labels={[...STEPS.map((s) => s.title), "Clean as usual"]} />

          <div aria-hidden className="mt-10 hidden h-px bg-sherpa/15 [[data-hscroll]_&]:lg:block">
            <div data-progress className="h-full origin-left bg-orient" />
          </div>
        </div>
      </div>
    </section>
  );
}
