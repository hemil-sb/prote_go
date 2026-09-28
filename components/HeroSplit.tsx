import Image from "next/image";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import { Item, Stagger } from "@/components/Motion";

/*
  Hero visual, direction 2: "one surface, two moments".
  The same lift panel, split down the middle between its two button columns:
  left, an ordinary disinfectant a few hours after cleaning; right, ProteGo on day 30.
  Photo: Arisa Chattasa on Unsplash (Unsplash License), cropped and toned to the brand duotone.
  Positions below are % of the 4:5 frame and line up with the buttons in that photo.
*/

// germs settling on the left column, one touch after another
const GERMS = [
  { x: 31, y: 27, r: -20, s: 1 },
  { x: 45, y: 36, r: 25, s: 0.8 },
  { x: 29, y: 45, r: 10, s: 0.9 },
  { x: 46, y: 55, r: -35, s: 1.1 },
  { x: 31, y: 63, r: 40, s: 0.8 },
  { x: 45, y: 74, r: -10, s: 1 },
  { x: 30, y: 83, r: 20, s: 0.9 },
];
// fingerprint smudges on the left buttons
const SMUDGES = [
  { x: 36, y: 34 },
  { x: 40, y: 52 },
  { x: 37, y: 71 },
  { x: 39, y: 89 },
];
// the right column's buttons (5, 3, M)
const PROTECTED = [51, 69.7, 88.7];

function Germ() {
  return (
    <svg viewBox="0 0 40 24" className="w-full" aria-hidden>
      <path d="M8 12c-6-4-9 0-8 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="8" y="3" width="30" height="18" rx="9" fill="rgb(255 255 255 / 0.14)" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="11" r="2" fill="currentColor" />
      <circle cx="27" cy="14" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function HeroSplit() {
  return (
    <figure className="m-0">
      <div
        className="relative isolate aspect-[4/5] overflow-hidden rounded-[2rem] bg-sherpa-deep shadow-[0_40px_80px_-40px_rgb(13_44_51/0.6)]"
        role="img"
        aria-label="The same lift panel, split in two: an ordinary disinfectant on the left, ProteGo on the right."
      >
        <Image
          src="/images/hero-lift-panel.jpg"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1280px) 40vw, (min-width: 1024px) 48vw, 92vw"
          className="object-cover"
        />

        {/* ── Left: ordinary disinfectant ── */}
        <div aria-hidden className="absolute inset-y-0 left-0 w-1/2 bg-black/25" />
        {SMUDGES.map((m, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute size-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.22),transparent_65%)]"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          />
        ))}
        <Stagger onMount delay={1.1} gap={0.28} aria-hidden className="absolute inset-y-0 left-0 w-1/2">
          {GERMS.map((g, i) => (
            <Item
              key={i}
              as="span"
              effect="pop"
              className="absolute w-[12%] -translate-x-1/2 -translate-y-1/2 text-white/70"
              style={{ left: `${g.x * 2}%`, top: `${g.y}%` }}
            >
              <span className="art-bob block" style={{ rotate: `${g.r}deg`, scale: `${g.s}`, animationDelay: `${i * 0.37}s` }}>
                <Germ />
              </span>
            </Item>
          ))}
        </Stagger>

        {/* ── Right: ProteGo ── */}
        <div aria-hidden className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgb(106_230_220/0.22),rgb(106_230_220/0.04)_55%,rgb(106_230_220/0.16))]" />
          <div className="absolute inset-0 bg-[url('/patterns/plus-dark.svg')] bg-[length:132px_132px] opacity-35 [mask-image:radial-gradient(ellipse_90%_70%_at_60%_55%,#000,transparent_75%)]" />
          <div className="hero-sweep absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(100deg,transparent,rgb(106_230_220/0.28),transparent)]" />
        </div>
        {PROTECTED.map((y, i) => (
          <span
            key={y}
            aria-hidden
            className="hero-guard absolute aspect-square w-[17.5%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-turquoise/80 shadow-[0_0_24px_4px_rgb(106_230_220/0.35)]"
            style={{ left: "61.7%", top: `${y}%`, animationDelay: `${i * 0.6}s` }}
          />
        ))}

        {/* divider */}
        <div aria-hidden className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/85 shadow-[0_0_12px_rgb(0_0_0/0.4)]" />

        {/* labels */}
        <div aria-hidden className="absolute inset-x-0 top-0 grid grid-cols-2 gap-4 p-3 sm:p-5">
          <span className="justify-self-start rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm sm:text-xs">
            Ordinary disinfectant
          </span>
          <span className="justify-self-start rounded-full bg-turquoise px-3 py-1.5 text-[11px] font-semibold text-sherpa-deep sm:text-xs">
            ProteGo
          </span>
        </div>
      </div>

      {/* captions sit under the photo, one per half, so the panel stays clean */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-6">
        <div className="pl-1">
          <p className="text-xs text-ink/55">Cleaned at 9 am</p>
          <p className="mt-1 flex items-start gap-1.5 text-sm font-semibold leading-snug text-sherpa-deep sm:text-base">
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-ink/45" strokeWidth={2} />
            Germs back by the next touch
          </p>
        </div>
        <div className="pl-1">
          <p className="text-xs text-ink/55">Treated once with ProteGo</p>
          <p className="mt-1 flex items-start gap-1.5 text-sm font-semibold leading-snug text-orient sm:text-base">
            <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
            Still protected on day 30
          </p>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-[11px] text-ink/45 lg:text-left">
        Illustration. Protection lasts up to 30 days on treated surfaces under normal conditions.
      </figcaption>
    </figure>
  );
}
