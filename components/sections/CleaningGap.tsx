import { Check, Droplets, Gauge, Hourglass, Users, X } from "lucide-react";
import GapChart from "@/components/GapChart";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";

// Wording from the brand's own comparison (Education deck v2.2, "Operational Excellence")
const ROWS = [
  { icon: Hourglass, label: "Protection life", them: "Minutes to hours", us: "Up to 30 days" },
  { icon: Users, label: "Labour", them: "Daily", us: "Monthly" },
  { icon: Droplets, label: "Formula", them: "Harsh chemicals", us: "~98% water" },
  { icon: Gauge, label: "Proof", them: "None", us: "ATP report" },
];

export default function CleaningGap() {
  return (
    <section id="cleaning-gap" aria-labelledby="gap-title" className="plus-field bg-white" data-fade="tl">
      <div className="wrap py-14 sm:py-20 lg:py-28">
        <div className="grid gap-6 text-center lg:grid-cols-12 lg:items-end lg:text-left">
          <Words id="gap-title" text="The cleaning gap." className="text-headline font-normal text-sherpa-deep lg:col-span-5" />
          <Reveal as="p" delay={0.2} className="mx-auto max-w-[30rem] text-lede text-ink/75 lg:col-span-6 lg:col-start-7 lg:mx-0">
            Traditional disinfectants wear off within hours. ProteGo stays active for up to 30 days.
          </Reveal>
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="rounded-[2rem] bg-spring p-5 sm:p-8 lg:col-span-7">
            <GapChart />
          </Reveal>

          <Reveal delay={0.12} className="overflow-hidden rounded-[2rem] border border-spring-deep lg:col-span-5">
            <table className="h-full w-full border-collapse text-left text-sm">
              <caption className="sr-only">Traditional disinfectants compared with ProteGo</caption>
              <thead>
                <tr>
                  <th scope="col" className="px-4 py-4 sm:px-6">
                    <span className="sr-only">Compared on</span>
                  </th>
                  <th scope="col" className="px-3 py-4 font-semibold text-ink/55 sm:px-4">
                    Traditional
                  </th>
                  <th scope="col" className="bg-sherpa px-3 py-4 font-semibold text-turquoise sm:px-4">
                    ProteGo
                  </th>
                </tr>
              </thead>
              <Stagger as="tbody" delay={0.35} gap={0.1}>
                {ROWS.map(({ icon: Icon, label, them, us }) => (
                  <Item as="tr" key={label} effect="fade" className="border-t border-spring-deep">
                    <th scope="row" className="px-4 py-5 font-semibold text-sherpa-deep sm:px-6">
                      <span className="flex items-center gap-2.5">
                        <Icon aria-hidden className="hidden size-5 shrink-0 text-orient sm:block" strokeWidth={1.6} />
                        {label}
                      </span>
                    </th>
                    <td className="px-3 py-5 text-ink/60 sm:px-4">
                      <span className="flex items-start gap-1.5">
                        <X aria-hidden className="mt-0.5 size-4 shrink-0 text-ink/40" strokeWidth={2} />
                        {them}
                      </span>
                    </td>
                    <td className="bg-sherpa px-3 py-5 font-semibold text-white sm:px-4">
                      <Item as="span" effect="left" className="flex items-start gap-1.5">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-turquoise" strokeWidth={2.4} />
                        {us}
                      </Item>
                    </td>
                  </Item>
                ))}
              </Stagger>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
