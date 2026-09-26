import Image from "next/image";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";

const PACKS = [
  { size: "100 ml", img: "/products/protego-100ml.jpg", line: "Small spaces", note: "Personal use" },
  { size: "500 ml", img: "/products/protego-500ml.jpg", line: "~750 sq ft", note: "DIY kit · ₹1,049" },
  { size: "20 L", img: "/products/protego-20l.jpg", line: "~30,000 sq ft", note: "Facilities and partners" },
];

export default function Products() {
  return (
    <section id="products" aria-labelledby="products-title" className="plus-field bg-white" data-fade="tr">
      <div className="wrap py-14 sm:py-20 lg:py-28">
        <Words id="products-title" text="Products." className="text-center text-headline font-normal text-sherpa-deep lg:text-left" />

        {/* Hero product */}
        <div className="mt-8 sm:mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal
            effect="left"
            className="relative aspect-[4/3] overflow-hidden rounded-[2rem] sm:aspect-[16/10] lg:col-span-4 lg:aspect-[413/620] lg:max-h-[640px]"
          >
            <Item effect="zoom" duration={1.6} className="absolute inset-0">
              <Image
                src="/images/bottle-shield-hand.jpg"
                alt="A hand holding a bottle of ProteGo Surface Protectant inside the ProteGo shield"
                fill
                sizes="(min-width: 1024px) 30vw, 90vw"
                className="object-cover"
              />
            </Item>
          </Reveal>

          <Reveal
            delay={0.1}
            className="flex flex-col justify-center rounded-[2rem] bg-panel p-5 text-center sm:p-10 lg:col-span-8 lg:text-left"
          >
            <p className="text-title font-semibold text-sherpa">ProteGo Surface Protectant</p>
            <p className="mx-auto mt-2 max-w-[24rem] text-ink/70 lg:mx-0">Ready to use. No dilution. Up to 30 days per application.</p>

            <Stagger as="ul" delay={0.25} gap={0.12} className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:gap-5">
              {PACKS.map((p) => (
                <Item as="li" key={p.size} className="group">
                  <div className="relative aspect-[306/255] overflow-hidden rounded-2xl bg-white">
                    <Image
                      src={p.img}
                      alt={`ProteGo Surface Protectant, ${p.size}`}
                      fill
                      sizes="(min-width: 1024px) 18vw, 30vw"
                      className="object-cover transition-[scale] duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-sherpa-deep sm:text-title">{p.size}</p>
                  <p className="mt-1 whitespace-nowrap text-xs font-semibold text-orient sm:text-sm">{p.line}</p>
                  <p className="mt-0.5 text-xs text-ink/55">{p.note}</p>
                </Item>
              ))}
            </Stagger>
            <p className="mt-5 text-sm text-ink/55">Also available in 5 L.</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 lg:justify-start">
              <a href="#contact" className="rounded-full bg-orient px-6 py-3.5 font-semibold text-white btn hover:bg-sherpa">
                Order the DIY kit
              </a>
              <a
                href="#contact"
                className="rounded-full border border-sherpa-deep/25 px-6 py-3.5 font-semibold text-sherpa-deep btn hover:border-sherpa-deep"
              >
                Bulk and trade enquiries
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
