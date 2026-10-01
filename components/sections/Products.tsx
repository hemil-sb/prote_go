import Image from "next/image";
import Link from "next/link";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";
import RailDots from "@/components/RailDots";
import ExploreLink from "@/components/site/ExploreLink";
import ProductCard from "@/components/site/ProductCard";
import { ALSO_AVAILABLE, PRODUCTS, formatPrice } from "@/content/products";

// on phones the pack you can order online leads the swipe row
const MOBILE_ORDER = [...PRODUCTS].sort((a, b) => Number(b.price !== null) - Number(a.price !== null));

export default function Products() {
  return (
    <section id="products" aria-labelledby="products-title" className="plus-field bg-white" data-fade="tr">
      <div className="wrap py-14 sm:py-20 lg:py-28">
        <Words id="products-title" text="Products." className="text-center text-headline font-normal text-sherpa-deep lg:text-left" />

        {/* phones and tablets: a swipe row of full product cards */}
        <div className="lg:hidden">
          <Reveal as="p" delay={0.1} className="mx-auto mt-3 max-w-[24rem] text-center text-ink/70">
            Ready to use. No dilution. Up to 30 days per application.
          </Reveal>
          <Stagger as="ul" id="products-rail" gap={0.1} className="rail mt-6 pb-6 pt-2">
            {MOBILE_ORDER.map((p) => (
              <Item as="li" key={p.slug}>
                <ProductCard product={p} summary={false} />
              </Item>
            ))}
          </Stagger>
          <RailDots railId="products-rail" labels={MOBILE_ORDER.map((p) => p.size)} />
          <p className="mt-6 text-center text-sm text-ink/55">{ALSO_AVAILABLE}</p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <ExploreLink href="/products">Explore all products</ExploreLink>
            <ExploreLink href="/contact" tone="outline">
              Bulk and trade enquiries
            </ExploreLink>
          </div>
        </div>

        {/* desktop: the hero photo beside the three packs */}
        <div className="mt-12 hidden gap-6 lg:grid lg:grid-cols-12">
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
              {PRODUCTS.map((p) => (
                <Item as="li" key={p.slug} className="group">
                  <Link href={`/products/${p.slug}`} className="block rounded-2xl focus-visible:outline-offset-4">
                    <div className="relative aspect-[306/255] overflow-hidden rounded-2xl bg-white">
                      <Image
                        src={p.image.src}
                        alt={p.image.alt}
                        fill
                        sizes="(min-width: 1024px) 18vw, 30vw"
                        className="object-cover transition-[scale] duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-sherpa-deep group-hover:text-orient sm:text-title">{p.size}</p>
                    <p className="mt-1 whitespace-nowrap text-xs font-semibold text-orient sm:text-sm">{p.coverage}</p>
                    <p className="mt-0.5 text-xs text-ink/55">{p.price ? `DIY kit · ${formatPrice(p.price)}` : p.bestFor}</p>
                  </Link>
                </Item>
              ))}
            </Stagger>
            <p className="mt-5 text-sm text-ink/55">{ALSO_AVAILABLE}</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 lg:justify-start">
              <ExploreLink href="/products">Explore all products</ExploreLink>
              <ExploreLink href="/contact" tone="outline">
                Bulk and trade enquiries
              </ExploreLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
