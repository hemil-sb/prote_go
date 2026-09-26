import Image from "next/image";
import { Item, Stagger, Words } from "@/components/Motion";

const SHOTS = [
  {
    src: "/images/campaign-one-spray-30-days.jpg",
    alt: "A café worker sprays a table with ProteGo. One spray, 30 days of protection.",
    caption: "One spray. 30 days of protection.",
  },
  {
    src: "/images/campaign-no-daily-reapplication.jpg",
    alt: "A woman sprays her dining table with ProteGo at home. One spray, no daily reapplication.",
    caption: "One spray. No daily reapplication.",
  },
];

export default function Campaign() {
  return (
    <section aria-labelledby="campaign-title" className="plus-field" data-fade="bl">
      <div className="wrap pb-14 sm:pb-20 lg:pb-28">
        <Words
          id="campaign-title"
          text="Simple action. Powerful protection."
          className="text-center text-headline font-normal text-sherpa-deep lg:text-left"
        />
        <Stagger gap={0.15} className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-2">
          {SHOTS.map((s) => (
            <Item as="figure" key={s.src} className="m-0">
              <div className="relative aspect-[1366/768] overflow-hidden rounded-[2rem]">
                {/* the photo settles into its frame as the card rises */}
                <Item effect="zoom" duration={1.4} className="absolute inset-0">
                  <Image src={s.src} alt={s.alt} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
                </Item>
              </div>
              <figcaption className="mt-3 text-center font-semibold text-sherpa-deep sm:mt-4 md:text-left">{s.caption}</figcaption>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
