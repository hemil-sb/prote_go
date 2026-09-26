import InView from "@/components/InView";

/*
  30-day protection calendar.
  One cell per day; the filled part of a cell is time the surface is protected.
  Traditional disinfectant protects only for a few hours after each daily clean.
  ProteGo protects every day, for up to 30 days per application.
  Illustrative, not measured data.
*/

const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

function Row({
  name,
  note,
  fill,
  brand = false,
}: {
  name: string;
  note: string;
  fill: number; // fraction of each day that is protected
  brand?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className={`font-semibold ${brand ? "text-sherpa" : "text-sherpa-deep"}`}>{name}</p>
        <p className={`text-sm font-semibold ${brand ? "text-orient" : "text-ink/55"}`}>{note}</p>
      </div>
      <ol className="mt-3 grid grid-cols-[repeat(30,minmax(0,1fr))] gap-[3px] sm:gap-1" aria-hidden>
        {DAYS.map((d) => (
          <li key={d} className="relative h-10 overflow-hidden rounded-[4px] bg-spring-deep/70 sm:h-14 sm:rounded-md">
            <span
              className="cal-fill absolute inset-y-0 left-0 bg-turquoise"
              style={{ width: `${fill * 100}%`, transitionDelay: `${d * 35}ms` }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function GapChart() {
  return (
    <InView className="gap-chart">
      <figure className="m-0">
        <figcaption className="sr-only">
          Over 30 days, a surface cleaned daily with a traditional disinfectant is protected for only
          a few hours after each clean. A surface treated once with ProteGo is protected on all 30 days.
        </figcaption>

        <div className="space-y-8">
          <Row name="Traditional disinfectant, cleaned daily" note="A few hours after each clean" fill={0.2} />
          <Row name="ProteGo, applied once" note="All 30 days" fill={1} brand />
        </div>

        <div className="mt-3 grid grid-cols-[repeat(30,minmax(0,1fr))] gap-[3px] text-xs font-medium text-ink/50 sm:gap-1" aria-hidden>
          {DAYS.map((d) => (
            <span
              key={d}
              className={`flex whitespace-nowrap ${d === 1 ? "justify-start" : d === 30 ? "justify-end" : "justify-center"}`}
            >
              {d === 1 || d % 10 === 0 ? `Day ${d}` : ""}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-spring-deep pt-5 text-sm font-semibold text-sherpa-deep">
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-4 rounded bg-turquoise" /> Protected
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-4 rounded bg-spring-deep/70" /> Exposed to germs
          </span>
          <span className="font-normal text-ink/45">Illustration</span>
        </div>
      </figure>
    </InView>
  );
}
