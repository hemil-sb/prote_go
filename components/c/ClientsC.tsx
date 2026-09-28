import Image from "next/image";

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

/* One continuous logo marquee (the shared .marquee CSS) and the DAIS testimonial. */
export default function ClientsC() {
  const items = (copy: number) =>
    CLIENTS.map((c) => (
      <li
        key={`${copy}-${c.file}`}
        aria-hidden={copy ? true : undefined}
        className={`mr-3 flex h-20 w-40 shrink-0 items-center justify-center rounded-2xl bg-white px-5 sm:mr-4 sm:h-24 sm:w-48 ${copy ? "marquee-dup" : ""}`}
      >
        <Image
          src={`/clients/${c.file}.png`}
          alt={copy ? "" : c.name}
          width={220}
          height={110}
          className="h-auto max-h-11 w-auto max-w-full object-contain opacity-80 sm:max-h-12"
        />
      </li>
    ));

  return (
    <section id="clients" aria-labelledby="clients-title" className="bg-panel py-16 sm:py-24">
      <div className="wrap">
        <h2 id="clients-title" className="text-sm font-semibold text-orient">
          Brands we work with
        </h2>
      </div>
      <div className="marquee mt-6 sm:mt-8">
        <ul className="marquee-track" style={{ "--marquee-duration": "70s" } as React.CSSProperties}>
          {items(0)}
          {items(1)}
        </ul>
      </div>
      <figure className="wrap mt-12 sm:mt-16">
        <blockquote>
          <p className="max-w-[34ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-light leading-[1.25] tracking-[-0.02em] text-sherpa-deep">
            &ldquo;Remarkable and measurable improvements&hellip; sustained for a period exceeding one month.&rdquo;
          </p>
        </blockquote>
        <figcaption className="mt-6 text-ink/70">
          <span className="font-semibold text-sherpa-deep">Head of Facilities</span>, Dhirubhai Ambani International School, Mumbai
        </figcaption>
      </figure>
    </section>
  );
}
