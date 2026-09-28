import Image from "next/image";
import { PACKS } from "@/content/products";
import { Item, Reveal, Stagger } from "@/components/Motion";

export default function ProductsB() {
  return (
    <section id="products" aria-labelledby="products-b-title" className="bg-spring py-16 sm:py-24 lg:py-28">
      <div className="wrap grid gap-4 xl:grid-cols-12">
        <Reveal className="on-dark flex flex-col justify-between gap-10 rounded-[2rem] bg-sherpa-deep p-7 text-center text-white sm:p-10 lg:flex-row lg:items-end lg:text-left xl:col-span-5 xl:flex-col xl:items-stretch">
          <div>
            <p className="text-sm font-semibold tabular-nums text-turquoise">Product</p>
            <h2 id="products-b-title" className="mt-3 text-headline font-normal">
              ProteGo Surface Protectant.
            </h2>
            <p className="mx-auto mt-4 max-w-[26rem] text-white/80 lg:mx-0">Ready to use. No dilution. Up to 30 days per application.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/70">Up to</p>
            <p className="text-[clamp(4.5rem,3rem+6vw,8rem)] font-extralight leading-none tracking-[-0.05em] text-turquoise">30</p>
            <p className="text-sm font-semibold text-white/70">days of protection per application</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a href="#contact" className="btn rounded-full bg-turquoise px-6 py-3.5 font-semibold text-sherpa-deep hover:bg-white">
                Order the DIY kit
              </a>
              <a
                href="#contact"
                className="btn rounded-full border border-white/30 px-6 py-3.5 font-semibold text-white hover:border-white"
              >
                Bulk and trade enquiries
              </a>
            </div>
          </div>
        </Reveal>

        <Stagger gap={0.1} className="grid gap-4 sm:grid-cols-3 xl:col-span-7 xl:grid-rows-[1fr_auto]">
          {PACKS.map((p) => (
            <Item key={p.size} className="group flex flex-col overflow-hidden rounded-[2rem] bg-white">
              <div className="relative aspect-[306/255] overflow-hidden xl:aspect-auto xl:min-h-[14rem] xl:flex-1">
                <Image
                  src={p.img}
                  alt={`ProteGo Surface Protectant, ${p.size}`}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 90vw"
                  className="object-cover transition-[scale] duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col p-6 text-center sm:text-left">
                <p className="text-title font-semibold text-sherpa-deep">{p.size}</p>
                <p className="mt-1 text-sm font-semibold text-orient">{p.line}</p>
                <p className="mt-0.5 text-sm text-ink/55">{p.note}</p>
              </div>
            </Item>
          ))}
          <Item className="flex items-center justify-center rounded-full border border-dashed border-sherpa/25 px-6 py-3 text-center text-sm font-semibold text-sherpa sm:col-span-3">
            Also available in 5 L.
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
