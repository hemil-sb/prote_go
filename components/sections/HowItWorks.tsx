import Placeholder from "@/components/Placeholder";
import { ApplyArt, BondArt, ProtectArt, VerifyArt } from "@/components/StepArt";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";

const STEPS = [
  { art: ApplyArt, title: "Apply", body: "A fine ULV mist coats every high-touch surface." },
  { art: BondArt, title: "Bond", body: "It dries in about an hour into an invisible, bonded layer." },
  { art: ProtectArt, title: "Protect", body: "Charged tips disrupt microbes on contact, for up to 30 days." },
  { art: VerifyArt, title: "Verify", body: "ATP tested before and after, with a report." },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="on-dark plus-field bg-sherpa text-white"
      data-tone="dark"
      data-fade="br"
    >
      <div className="wrap py-14 sm:py-20 lg:py-28">
        <div className="grid gap-6 text-center lg:grid-cols-12 lg:items-end lg:text-left">
          <Words
            id="how-title"
            text="Science that protects. Technology that lasts."
            className="text-headline font-normal text-turquoise lg:col-span-7"
          />
          <Reveal delay={0.2} className="mx-auto max-w-[28rem] lg:col-span-5 lg:mx-0">
            <p className="text-lede text-white/80">
              Si-QAC nanotechnology bonds to the surface, so protection stays put instead of drying away.
            </p>
          </Reveal>
        </div>

        <Stagger
          as="ol"
          gap={0.14}
          className="relative mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-14 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4"
        >
          {STEPS.map(({ art: Art, title, body }, i) => (
            <Item as="li" key={title} className="text-center lg:text-left">
              <div className="rounded-2xl bg-turquoise-tint px-2 py-3 sm:rounded-[1.5rem] sm:px-5 sm:py-7">
                <Art />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 sm:mt-6 sm:gap-3 lg:justify-start">
                <Item
                  as="span"
                  effect="pop"
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-turquoise text-xs font-bold text-sherpa-deep sm:size-9 sm:text-sm"
                >
                  {i + 1}
                </Item>
                <span className="text-lg font-semibold sm:text-title">{title}</span>
                {i < STEPS.length - 1 && (
                  // the connector draws towards the next step
                  <Item
                    as="span"
                    effect="growX"
                    duration={1.2}
                    aria-hidden
                    className="ml-2 hidden h-px flex-1 origin-left bg-white/25 lg:block"
                  />
                )}
              </div>
              <p className="mx-auto mt-2 max-w-[18rem] text-sm text-white/80 sm:mt-3 sm:text-base lg:mx-0">{body}</p>
            </Item>
          ))}
        </Stagger>

        <Reveal amount={0.2}>
          <Placeholder
            kind="video"
            tone="dark"
            label="Video: a 60-second on-site application, from ATP swab to reading"
            hint="16:9, 1920 × 1080, silent with captions. Filmed at a real client site."
            className="mt-10 aspect-video w-full sm:mt-16 lg:aspect-[21/9]"
          />
        </Reveal>
      </div>
    </section>
  );
}
