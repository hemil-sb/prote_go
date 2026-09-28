import Image from "next/image";
import { CLIENTS, DAIS_QUOTE } from "@/content/clients";
import { Reveal, Words } from "@/components/Motion";

type Client = (typeof CLIENTS)[number];

/* Infinite marquee: the list is rendered twice and the track slides by half its width (CSS in globals). */
function Row({ clients, duration, reverse = false }: { clients: Client[]; duration: number; reverse?: boolean }) {
  const items = (copy: number) =>
    clients.map((c) => (
      <li
        key={`${copy}-${c.file}`}
        aria-hidden={copy ? true : undefined}
        className={`mr-3 flex h-20 w-40 shrink-0 items-center justify-center rounded-2xl bg-spring px-5 sm:h-24 sm:w-48 ${copy ? "marquee-dup" : ""}`}
      >
        <Image
          src={`/clients/${c.file}.png`}
          alt={copy ? "" : c.name}
          width={220}
          height={110}
          className="h-auto max-h-11 w-auto max-w-full object-contain opacity-80"
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

export default function ClientsB() {
  const half = Math.ceil(CLIENTS.length / 2);
  return (
    <section id="clients" aria-labelledby="clients-b-title" className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="wrap text-center lg:text-left">
        <p className="text-sm font-semibold tabular-nums text-orient">Clients</p>
        <Words id="clients-b-title" text="Brands we work with." className="mt-3 text-headline font-normal text-sherpa-deep" />
      </div>
      <div className="mt-10 space-y-3 sm:mt-14">
        <Row clients={CLIENTS.slice(0, half)} duration={48} />
        <Row clients={CLIENTS.slice(half)} duration={44} reverse />
      </div>
      <div className="wrap mt-10 sm:mt-14">
        <Reveal as="figure" className="m-0 rounded-[2rem] bg-turquoise-tint p-8 text-center sm:p-12 lg:text-left">
          <blockquote>
            <p className="mx-auto max-w-[34ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-light leading-[1.25] tracking-[-0.02em] text-sherpa-deep lg:mx-0">
              &ldquo;{DAIS_QUOTE.quote}&rdquo;
            </p>
          </blockquote>
          <figcaption className="mt-6 text-ink/70">
            <span className="font-semibold text-sherpa-deep">{DAIS_QUOTE.role}</span>, {DAIS_QUOTE.org}
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
