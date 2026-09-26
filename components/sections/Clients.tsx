import Image from "next/image";
import Placeholder from "@/components/Placeholder";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";

const CLIENTS = [
  { file: "bagmane", name: "Bagmane" },
  { file: "four-seasons", name: "Four Seasons" },
  { file: "haldia-petrochemicals", name: "Haldia Petrochemicals" },
  { file: "all-is-well-hospital", name: "All Is Well Multi Speciality Hospital" },
  { file: "nucleus-office-parks", name: "Nucleus Office Parks" },
  { file: "mukta-a2-cinemas", name: "Mukta A2 Cinemas" },
  { file: "woloo", name: "Woloo" },
  { file: "jbcn", name: "JBCN International School" },
  { file: "forum", name: "Forum, a Prestige Group enterprise" },
  { file: "techfit", name: "TechFit" },
  { file: "meraki", name: "Meraki" },
  { file: "karnataka-golf-association", name: "Karnataka Golf Association" },
  { file: "prodigy-montessori", name: "Prodigy Montessori India" },
  { file: "skf", name: "Salman Khan Films" },
  { file: "chatterjee-group", name: "Chatterjee Group" },
  { file: "uru-brewpark", name: "URU Brewpark" },
  { file: "olive", name: "Olive" },
  { file: "ivory-tower", name: "Ivory Tower" },
  { file: "4s-technologies", name: "4S Technologies" },
  { file: "tcg-services", name: "TCG Services" },
  { file: "procam", name: "Procam" },
];

const ROW_A = CLIENTS.slice(0, 11);
const ROW_B = CLIENTS.slice(11);

type Client = (typeof CLIENTS)[number];

/* Infinite marquee: the list is rendered twice and the track slides by half its width. */
function LogoRow({ clients, duration, reverse = false }: { clients: Client[]; duration: number; reverse?: boolean }) {
  const items = (copy: number) =>
    clients.map((c) => (
      <li
        key={`${copy}-${c.file}`}
        className={`mr-4 flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl bg-white px-6 sm:h-28 sm:w-52 ${copy ? "marquee-dup" : ""}`}
        aria-hidden={copy ? true : undefined}
      >
        <Image
          src={`/clients/${c.file}.png`}
          alt={copy ? "" : c.name}
          width={220}
          height={110}
          className="h-auto max-h-12 w-auto max-w-full object-contain opacity-80 sm:max-h-14"
        />
      </li>
    ));
  return (
    <div className="marquee" data-reverse={reverse || undefined}>
      <ul className="marquee-track" style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        {items(0)}
        {items(1)}
      </ul>
    </div>
  );
}

export default function Clients() {
  return (
    <section id="clients" aria-labelledby="clients-title" className="plus-field bg-panel" data-fade="tr">
      <div className="wrap pb-8 pt-14 sm:pb-12 sm:pt-20 lg:pt-28">
        <div className="grid gap-6 text-center lg:grid-cols-12 lg:gap-10 lg:text-left">
          <Words id="clients-title" text="Brands we work with." className="text-headline font-normal text-sherpa-deep lg:col-span-5" />
          <Reveal as="p" delay={0.2} className="mx-auto max-w-[34rem] self-end text-lede text-ink/75 lg:col-span-6 lg:col-start-7 lg:mx-0">
            Trusted by industry leaders and future-focused institutions.
          </Reveal>
        </div>
      </div>

      <Stagger gap={0.15} className="space-y-4">
        <Item effect="left">
          <LogoRow clients={ROW_A} duration={50} />
        </Item>
        <Item effect="right">
          <LogoRow clients={ROW_B} duration={46} reverse />
        </Item>
      </Stagger>

      <div className="wrap pb-14 sm:pb-20 lg:pb-28">
        <Stagger
          as="figure"
          gap={0.15}
          amount={0.3}
          className="mt-12 grid items-center gap-8 text-center sm:mt-16 lg:grid-cols-12 lg:text-left"
        >
          <Item effect="pop" className="flex justify-center lg:col-span-1 lg:block">
            <Image src="/brand/icon-teal.svg" alt="" width={56} height={62} aria-hidden />
          </Item>
          <Item className="lg:col-span-6">
            <blockquote>
              <p className="mx-auto max-w-[32ch] lg:mx-0 text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-light leading-[1.25] tracking-[-0.02em] text-sherpa-deep">
                &ldquo;Remarkable and measurable improvements&hellip; sustained for a period exceeding one month.&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-6 text-ink/70 sm:mt-8">
              <span className="font-semibold text-sherpa-deep">Head of Facilities</span>, Dhirubhai Ambani International School, Mumbai
            </figcaption>
          </Item>
          <Item effect="right" className="lg:col-span-5">
            <Placeholder
              label="Photo: DAIS campus, or ProteGo treating a classroom there"
              hint="Landscape, 1600 × 1200 px."
              className="aspect-[4/3]"
            />
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
