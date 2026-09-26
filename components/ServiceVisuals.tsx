import Image from "next/image";
import { Item, Stagger } from "@/components/Motion";
import { ClipboardCheck, FileText, Gauge, RotateCw, ShieldCheck, SprayCan, type LucideIcon } from "lucide-react";

/* Decorative QR pattern (not a scannable code), generated once at module load. */
const QR_N = 21;
const QR_CELLS: [number, number][] = (() => {
  let s = 11;
  const rand = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const cells: [number, number][] = [];
  for (let y = 0; y < QR_N; y++)
    for (let x = 0; x < QR_N; x++) {
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (!finder && rand() > 0.52) cells.push([x, y]);
    }
  return cells;
})();

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="7" height="7" fill="currentColor" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="currentColor" />
    </g>
  );
}

function QrPattern({ size = 84 }: { size?: number }) {
  const n = QR_N;
  const cells = QR_CELLS;
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} aria-hidden className="text-sherpa-deep" shapeRendering="crispEdges">
      <rect width={n} height={n} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={14} y={0} />
      <Finder x={0} y={14} />
    </svg>
  );
}

export function CertificateMock() {
  return (
    <div className="relative mx-auto w-full max-w-[380px] rotate-[-2deg] rounded-[1.5rem] border-[10px] border-sherpa-deep bg-white p-7 shadow-[0_24px_60px_-20px_rgb(13_44_51/0.45)]">
      <Image src="/brand/logo-horizontal-dark.svg" alt="" width={120} height={43} aria-hidden className="h-9 w-auto" />
      <p className="mt-6 text-2xl font-semibold leading-tight text-sherpa-deep">
        Protected Space<span className="align-super text-xs">™</span>
      </p>
      <p className="mt-2 text-sm text-ink/65">Verified. Certified. Trusted.</p>
      <div className="mt-6 flex items-end justify-between gap-4 border-t border-spring-deep pt-5">
        <dl className="space-y-2 text-xs">
          <div>
            <dt className="text-ink/50">Treated</dt>
            <dd className="font-semibold text-sherpa-deep">12 Oct 2026</dd>
          </div>
          <div>
            <dt className="text-ink/50">Valid till</dt>
            <dd className="font-semibold text-sherpa-deep">11 Nov 2026</dd>
          </div>
        </dl>
        <div className="text-center">
          <QrPattern size={76} />
          <p className="mt-1 text-[10px] font-semibold text-sherpa">Scan to verify</p>
        </div>
      </div>
    </div>
  );
}

/* Illustrative digital report, built from what the brochures say a report includes:
   site summary, ATP readings and trend analysis, treatment details, recommendations,
   compliance-ready records (Food service and Municipal briefs). Values are samples. */
const TREND = [
  { visit: "Jul", rlu: 34 },
  { visit: "Aug", rlu: 27 },
  { visit: "Sep", rlu: 22 },
  { visit: "Oct", rlu: 18 },
];
const TREND_MAX = 40; // chart scale, RLU

export function DigitalReportMock() {
  return (
    <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_-20px_rgb(13_44_51/0.45)]">
      <div className="bg-sherpa px-5 pb-4 pt-5 text-white">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Hygiene report</span>
          <span className="rounded-full bg-turquoise px-2 py-0.5 text-[10px] font-semibold text-sherpa-deep">Oct 2026</span>
        </div>
        <p className="mt-1 text-[11px] text-white/70">Site summary · Lobby, lifts, washrooms</p>
      </div>

      <Stagger gap={0.16} delay={0.3} amount={0.5} className="space-y-2.5 p-4">
        <Item className="rounded-xl bg-spring px-3 pb-2.5 pt-3">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-sherpa-deep">ATP trend (RLU)</span>
            <span className="text-ink/45">Sample</span>
          </div>
          <Stagger gap={0.12} delay={0.5} amount={0.8} className="relative mt-3 flex h-16 items-end gap-3 border-b border-spring-deep px-1">
            {/* 30 RLU: the "excellent" threshold */}
            <div
              aria-hidden
              className="absolute inset-x-0 border-t border-dashed border-orient/60"
              style={{ bottom: `${(30 / TREND_MAX) * 100}%` }}
            />
            {TREND.map((t, i) => (
              <div key={t.visit} className="flex h-full flex-1 flex-col justify-end">
                <Item
                  as="span"
                  effect="growY"
                  className={`block w-full origin-bottom rounded-t-md ${i === TREND.length - 1 ? "bg-turquoise" : "bg-sherpa/70"}`}
                  style={{ height: `${(t.rlu / TREND_MAX) * 100}%` }}
                />
              </div>
            ))}
          </Stagger>
          <div className="mt-1 flex gap-3 px-1 text-center text-[10px] text-ink/55">
            {TREND.map((t) => (
              <span key={t.visit} className="flex-1">
                {t.visit}
              </span>
            ))}
          </div>
        </Item>
        {[
          { icon: SprayCan, label: "Treatment details", meta: "ULV · 12 Oct" },
          { icon: ClipboardCheck, label: "Recommendations", meta: "2 actions" },
        ].map(({ icon: Icon, label, meta }) => (
          <Item key={label} effect="left" className="flex items-center justify-between rounded-xl bg-spring px-3 py-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold text-sherpa-deep">
              <Icon aria-hidden className="size-4 text-orient" strokeWidth={2} />
              {label}
            </span>
            <span className="text-[11px] text-ink/55">{meta}</span>
          </Item>
        ))}
        <Item
          effect="pop"
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-orient/40 px-3 py-2.5 text-xs font-semibold text-orient"
        >
          <ShieldCheck aria-hidden className="size-4" strokeWidth={2} />
          Compliance-ready record
        </Item>
      </Stagger>
    </div>
  );
}

/* The brand's "Continuity Lifecycle" (Food service brief): a 30-day cycle. */
const CYCLE: { icon: LucideIcon; label: string; angle: number }[] = [
  { icon: ClipboardCheck, label: "Assess", angle: -90 },
  { icon: SprayCan, label: "Protect", angle: -18 },
  { icon: Gauge, label: "Verify", angle: 54 },
  { icon: FileText, label: "Report", angle: 126 },
  { icon: RotateCw, label: "Renew", angle: 198 },
];
const R = 38; // ring radius, % of the box

function arc(from: number, to: number) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const a = from + 17;
  const b = to - 17;
  const x1 = 50 + R * Math.cos(rad(a));
  const y1 = 50 + R * Math.sin(rad(a));
  const x2 = 50 + R * Math.cos(rad(b));
  const y2 = 50 + R * Math.sin(rad(b));
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export function LifecycleDiagram() {
  return (
    <Stagger
      gap={0.16}
      delay={0.2}
      amount={0.4}
      className="relative mx-auto aspect-square w-full max-w-[380px]"
      role="img"
      aria-label="A 30-day cycle: assess, protect, verify, report, renew."
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <marker id="cyc-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--color-turquoise)" />
          </marker>
        </defs>
        {CYCLE.map((c, i) => {
          const next = CYCLE[(i + 1) % CYCLE.length].angle + (i === CYCLE.length - 1 ? 360 : 0);
          return (
            <path
              key={c.label}
              d={arc(c.angle, next)}
              fill="none"
              stroke="var(--color-turquoise)"
              strokeWidth="0.8"
              strokeDasharray="2 1.6"
              markerEnd="url(#cyc-arrow)"
              className="flow"
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center" aria-hidden>
        <span className="breathe absolute size-32 rounded-full bg-turquoise/15 blur-xl" />
        <Item effect="pop" className="relative">
          <p className="text-5xl font-light text-turquoise">30</p>
          <p className="text-sm font-semibold text-white">day cycle</p>
        </Item>
      </div>

      {CYCLE.map(({ icon: Icon, label, angle }) => {
        const x = 50 + R * Math.cos((angle * Math.PI) / 180);
        const y = 50 + R * Math.sin((angle * Math.PI) / 180);
        return (
          <div
            key={label}
            aria-hidden
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <Item
              as="span"
              effect="pop"
              className="grid size-14 place-items-center rounded-full bg-turquoise text-sherpa-deep shadow-[0_0_0_6px_var(--color-sherpa-deep)]"
            >
              <Icon className="size-6" strokeWidth={1.7} />
            </Item>
            <Item as="span" effect="fade" className="mt-2 text-sm font-semibold text-white">
              {label}
            </Item>
          </div>
        );
      })}
    </Stagger>
  );
}

/* Sample before/after ATP reading (illustrative values from the CRE brief's sample report). */
export function AtpReadingMock() {
  return (
    <div className="mx-auto w-full max-w-[300px] rounded-[1.5rem] bg-white p-6 shadow-[0_24px_60px_-24px_rgb(13_44_51/0.35)]">
      <div className="flex items-center justify-between text-xs font-semibold text-ink/55">
        <span>ATP reading</span>
        <span>Sample</span>
      </div>
      <Stagger gap={0.5} delay={0.3} amount={0.6} className="relative mt-5 flex h-40 items-end gap-6 border-b border-spring-deep px-2">
        <div aria-hidden className="absolute inset-x-0 bottom-[11px] border-t border-dashed border-orient/60" />
        <div className="flex flex-1 flex-col items-center gap-2">
          <span className="text-sm font-semibold text-sherpa-deep">356</span>
          <Item as="span" effect="growY" duration={1.1} className="block h-32 w-full origin-bottom rounded-t-lg bg-sherpa-deep/80" />
        </div>
        <div className="flex flex-1 flex-col items-center gap-2">
          <span className="text-sm font-semibold text-orient">18</span>
          <Item as="span" effect="growY" duration={1.1} className="block h-[7px] w-full origin-bottom rounded-t-md bg-turquoise" />
        </div>
      </Stagger>
      <div className="mt-2 flex gap-6 px-2 text-center text-xs font-semibold text-sherpa-deep">
        <span className="flex-1">Before</span>
        <span className="flex-1">After</span>
      </div>
      <p className="mt-4 text-center text-xs text-ink/55">RLU. Dashed line: 30 RLU, the &ldquo;excellent&rdquo; threshold.</p>
    </div>
  );
}
