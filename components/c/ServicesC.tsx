"use client";

import { useRef } from "react";
import { BadgeCheck, Check, ClipboardCheck, FileText, Gauge, GraduationCap, RotateCw, ScanSearch, ShieldCheck, SprayCan } from "lucide-react";
import RailDots from "@/components/RailDots";
import { AtpReadingMock, CertificateMock, DigitalReportMock } from "@/components/ServiceVisuals";
import Split from "./Split";
import { gsap, MOTION, reveal, useGsap } from "./gsap";

// The canonical service lifecycle (Food "Continuity Lifecycle"), with the ATP baseline made explicit
const STEPS = [
  { icon: ScanSearch, title: "Assess", body: "We walk your site and map the high-touch surfaces, footfall and risk areas." },
  { icon: Gauge, title: "Baseline", body: "ATP swabs record how clean those surfaces are before we start." },
  {
    icon: SprayCan,
    title: "Apply",
    body: "Trained technicians mist every mapped surface by ULV, usually when the space is empty. It is ready in about an hour.",
  },
  { icon: ShieldCheck, title: "Verify", body: "We swab again after application, so the change is measured, not assumed." },
  { icon: FileText, title: "Report", body: "A digital report with readings, trends, a treatment log and recommendations, ready for audits." },
  { icon: RotateCw, title: "Renew", body: "We return every 30 days, before protection runs out, and the cycle starts again." },
];

const INCLUDED = [
  "Site assessment and surface mapping",
  "Professional ULV application",
  "ATP testing before and after",
  "Digital hygiene report",
  "Protected Space™ certificate and decal",
  "Scheduled renewal every 30 days",
];

// Programme tiers as named in the Gyms and Retail briefs. The DIY kit is a product, so it lives in Products.
const PLANS = [
  {
    name: "Professional",
    price: "From ₹2.75",
    unit: "per sq ft a month + GST",
    points: ["Everything in the managed programme", "From 1,500 sq ft", "Minimum 6 months"],
  },
  {
    name: "12-Month",
    price: "Preferential",
    unit: "annual terms",
    points: ["Everything in Professional", "Annual plan and trend reports", "Dedicated account manager"],
    featured: true,
  },
  {
    name: "Long-Term Partnership",
    price: "Custom",
    unit: "proposal",
    points: ["Chains, campuses, developers", "One standard across every site", "Portfolio-wide reporting"],
  },
];

// The proof each visit produces
const PROOF = [
  { visual: AtpReadingMock, title: "ATP testing", body: "Swabs before and after every visit. Lower is cleaner." },
  { visual: CertificateMock, title: "Protected Space™", body: "A certificate and decal your visitors can scan." },
  { visual: DigitalReportMock, title: "Digital reports", body: "Readings, trends and recommendations, ready for audits." },
];

const EXTRAS = [
  { icon: ClipboardCheck, label: "Hygiene audits" },
  { icon: GraduationCap, label: "Staff training" },
  { icon: BadgeCheck, label: "Compliance support" },
];

const R = 42; // ring radius in the 100 × 100 viewBox
const C = 2 * Math.PI * R;
const node = (i: number) => {
  const a = ((-90 + i * (360 / STEPS.length)) * Math.PI) / 180;
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
};

const LABEL_SIDE = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  right: "left-full top-1/2 ml-3 -translate-y-1/2",
  left: "right-full top-1/2 mr-3 -translate-y-1/2",
};
const labelSide = (i: number): keyof typeof LABEL_SIDE => {
  const { x, y } = node(i);
  if (Math.abs(x - 50) < 5) return y < 50 ? "top" : "bottom";
  return x > 50 ? "right" : "left";
};

/*
  Services, proof and programmes in one section. First screen: the heading and
  the 30-day ring, which pins and fills as you scroll, lighting each step in turn
  (the markup is the finished state, for reduced motion and no-JS). Then one band
  for what's included and the proof you get, then the plans and the pilot offer.
*/
export default function ServicesC() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (mm, el) => {
    mm.add(MOTION, () => {
      reveal(el);
      el.dataset.stack = "";
      const q = gsap.utils.selector(el);
      const steps = q("[data-svc-step]");
      const nodes = q("[data-svc-node]");
      const labels = q("[data-svc-label]");
      const count = q("[data-svc-count]")[0];
      const n = STEPS.length;

      gsap.set(q("[data-svc-arc]"), { strokeDashoffset: C });
      gsap.set(steps.slice(1), { autoAlpha: 0, y: 20 });
      gsap.set(nodes, { backgroundColor: "#0e4a59", color: "#bddfe7", scale: 0.85 });
      gsap.set(labels, { opacity: 0.45 });
      count.textContent = "1";
      const lit = { backgroundColor: "#6ae6dc", color: "#0d2c33", scale: 1, duration: 0.2 };

      const tl: gsap.core.Timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: q("[data-svc-pin]")[0], start: "top top", end: "+=180%", pin: true, scrub: 0.6 },
        // the step number follows the playhead, forwards and backwards
        onUpdate: () => void (count.textContent = String(Math.min(n, Math.floor(tl.time() + 0.001) + 1))),
      });
      tl.to(q("[data-svc-arc]"), { strokeDashoffset: 0, duration: n }, 0);
      tl.to(nodes[0], lit, 0).to(labels[0], { opacity: 1, duration: 0.2 }, 0);
      for (let i = 1; i < n; i++) {
        tl.to(nodes[i], lit, i)
          .to(labels[i], { opacity: 1, duration: 0.2 }, i)
          .to(steps[i - 1], { autoAlpha: 0, y: -20, duration: 0.25 }, i - 0.1)
          .to(steps[i], { autoAlpha: 1, y: 0, duration: 0.25 }, i + 0.1);
      }
      tl.to({}, { duration: 0.6 });

      return () => {
        delete el.dataset.stack;
        count.textContent = String(n);
      };
    });
  });

  return (
    <section id="services" ref={root} aria-labelledby="services-title" className="on-dark bg-sherpa-deep text-white">
      {/* screen 1 (pinned): the heading and the 30-day ring */}
      <div data-svc-pin className="wrap flex min-h-[100svh] flex-col pb-8 pt-20 lg:pb-12 lg:pt-28">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-turquoise">Services</p>
            <Split id="services-title" text="We apply it. We prove it. We renew it." className="mt-2 text-headline font-normal text-turquoise lg:mt-3" />
          </div>
          <p className="mt-3 max-w-[28rem] text-white/75 sm:text-lg lg:col-span-5 lg:mt-0 [@media(max-height:720px)]:hidden">
            The Managed Protection Programme: our technicians and our testing, on a 30-day cycle.
          </p>
        </div>

        <div className="grid flex-1 items-center gap-6 pt-6 lg:grid-cols-12 lg:gap-10 lg:pt-8">
          {/* the 30-day ring */}
          <div className="relative mx-auto aspect-square w-[min(56vw,40svh,26rem)] lg:col-span-6 lg:w-[min(100%,52svh,28rem)]">
            <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full -rotate-90">
              <circle cx="50" cy="50" r={R} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="1.4" />
              <circle
                data-svc-arc
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke="var(--color-turquoise)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={0}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-xs font-semibold text-white/60 sm:text-sm">Step</p>
                <p className="text-[clamp(2.5rem,1.8rem+3.5vw,4.5rem)] font-light leading-none tabular-nums text-turquoise">
                  <span data-svc-count>{STEPS.length}</span>
                  <span className="text-white/30">/{STEPS.length}</span>
                </p>
                <p className="mt-2 text-xs font-semibold text-white/60 sm:text-sm">of a 30-day cycle</p>
              </div>
            </div>
            {STEPS.map(({ icon: Icon, title }, i) => {
              const { x, y } = node(i);
              return (
                <div
                  key={title}
                  aria-hidden
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span
                    data-svc-node
                    className="grid size-10 place-items-center rounded-full bg-turquoise text-sherpa-deep shadow-[0_0_0_5px_var(--color-sherpa-deep)] sm:size-12"
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  {/* labels sit outside the ring, facing away from the centre */}
                  <span
                    data-svc-label
                    className={`absolute whitespace-nowrap text-xs font-semibold text-white sm:text-sm ${LABEL_SIDE[labelSide(i)]}`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* the step being described */}
          <ol className="grid gap-6 lg:col-span-5 lg:col-start-8 [[data-stack]_&]:gap-0 [[data-stack]_&>li]:[grid-area:1_/_1]">
            {STEPS.map(({ title, body }, i) => (
              <li key={title} data-svc-step>
                <p className="text-sm font-semibold tabular-nums text-turquoise">0{i + 1}</p>
                <p className="mt-1 text-title font-semibold">{title}</p>
                <p className="mt-2 max-w-[28rem] text-white/75 sm:text-lg">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="wrap pb-16 sm:pb-24 lg:pb-28">
        {/* what's included, and the proof you get */}
        <p id="proof" data-reveal className="text-title font-semibold text-turquoise">
          What gets measured gets trusted.
        </p>
        <div className="mt-6 grid gap-5 lg:grid-cols-12 lg:gap-6">
          <div data-reveal className="rounded-[2rem] bg-sherpa p-6 sm:p-8 lg:col-span-4">
            <p className="font-semibold">Included in every programme</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/85">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-turquoise" strokeWidth={2.4} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs font-semibold text-sherpa-tint">Also available</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {EXTRAS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                  <Icon aria-hidden className="size-3.5 text-turquoise" strokeWidth={1.8} />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <ul id="proof-tiles" data-stagger className="rail grid gap-5 lg:col-span-8 lg:grid-cols-3 lg:gap-6">
            {PROOF.map(({ visual: Visual, title, body }) => (
              <li key={title} className="flex flex-col rounded-[2rem] bg-sherpa p-5 sm:p-6">
                <div className="flex h-[16rem] items-center justify-center overflow-hidden rounded-2xl bg-white/[0.04]">
                  {/* the shared mock-ups, drawn at a smaller size */}
                  <div className="w-[250px]" style={{ zoom: 0.64 }}>
                    <Visual />
                  </div>
                </div>
                <p className="mt-4 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-white/70">{body}</p>
              </li>
            ))}
          </ul>
        </div>
        <RailDots railId="proof-tiles" labels={PROOF.map((p) => p.title)} tone="dark" />
        <p className="mt-4 text-sm text-white/55">
          Efficacy tested by an NABL-accredited laboratory. ATP measures organic residue in Relative Light Units (RLU), not microbes.
        </p>

        {/* the plans */}
        <div id="plans" className="mt-14 sm:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2">
            <p data-reveal className="text-title font-semibold text-turquoise">
              Choose your programme.
            </p>
            <p className="text-sm text-white/60">Indicative pricing, confirmed after your site assessment.</p>
          </div>

          <ul id="plans-list" data-stagger className="rail mt-6 grid gap-5 lg:grid-cols-3 lg:gap-6">
            {PLANS.map((p) => (
              <li
                key={p.name}
                className={`flex flex-col rounded-[2rem] p-6 ${p.featured ? "bg-white text-sherpa-deep" : "bg-sherpa text-white ring-1 ring-white/10"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className={`font-semibold ${p.featured ? "text-orient" : "text-turquoise"}`}>{p.name}</p>
                  {p.featured && (
                    <span className="shrink-0 rounded-full bg-turquoise px-3 py-1 text-xs font-semibold text-sherpa-deep">Recommended</span>
                  )}
                </div>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[clamp(1.5rem,1.25rem+0.9vw,2rem)] font-normal tracking-[-0.02em]">{p.price}</span>
                  <span className={`text-sm ${p.featured ? "text-ink/60" : "text-white/65"}`}>{p.unit}</span>
                </p>
                <ul className={`mt-4 space-y-2 border-t pt-4 text-sm ${p.featured ? "border-spring-deep text-ink/75" : "border-white/15 text-white/85"}`}>
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <Check aria-hidden className={`mt-0.5 size-4 shrink-0 ${p.featured ? "text-orient" : "text-turquoise"}`} strokeWidth={2.4} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <RailDots railId="plans-list" labels={PLANS.map((p) => `${p.name} plan`)} tone="dark" />

          <div
            data-reveal
            className="mt-5 flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-turquoise px-6 py-5 text-sherpa-deep sm:flex-row sm:items-center"
          >
            <p>
              <span className="font-semibold">Not sure yet? Start with a pilot.</span>{" "}
              <span className="text-sherpa-deep/80">One area, one application. See the ATP readings, then decide.</span>
            </p>
            <a href="#contact" className="btn shrink-0 rounded-full bg-sherpa-deep px-5 py-3 text-sm font-semibold text-white hover:bg-sherpa">
              Start a pilot
            </a>
          </div>
          <p className="mt-3 text-sm text-white/55">Looking for the DIY kit? It is under Products.</p>
        </div>
      </div>
    </section>
  );
}
