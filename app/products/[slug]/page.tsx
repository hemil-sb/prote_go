import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Maximize2, Users } from "lucide-react";
import { FACT_ICONS, Glyph, IconBadge, stepIcon } from "@/components/site/icons";
import AddToCart from "@/components/cart/AddToCart";
import CtaBand from "@/components/site/CtaBand";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";
import { HOW_TO_USE, PRODUCTS, PRODUCT_FACTS, formatPrice, productBySlug } from "@/content/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const p = productBySlug((await props.params).slug);
  if (!p) return {};
  return { title: `${p.name}, ${p.size}`, description: p.summary };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const p = productBySlug((await props.params).slug);
  if (!p) notFound();
  const others = PRODUCTS.filter((o) => o.slug !== p.slug);

  return (
    <>
      {/* product hero: light, so the packshot sits on white (the header shows its light bar) */}
      <section aria-labelledby="product-title" className="plus-field bg-white" data-fade="tr">
        <div className="wrap grid gap-10 pb-16 pt-28 sm:pb-24 sm:pt-32 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink/55">
                <li>
                  <Link href="/" className="hover:text-orient">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-3.5 text-ink/30" />
                </li>
                <li>
                  <Link href="/products" className="hover:text-orient">
                    Products
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-3.5 text-ink/30" />
                </li>
                <li aria-current="page" className="text-ink/80">
                  {p.size}
                </li>
              </ol>
            </nav>
            <Reveal onMount effect="zoom" className="relative mt-6 aspect-[306/255] overflow-hidden rounded-[2rem] bg-spring">
              <Image
                src={p.image.src}
                alt={p.image.alt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </Reveal>
          </div>

          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="font-semibold text-orient">{p.name}</p>
            <Words as="h1" id="product-title" onMount text={p.size} className="mt-2 text-display font-normal text-sherpa-deep" />
            <Reveal onMount delay={0.2}>
              <p className="mt-5 max-w-[34rem] text-lede text-ink/75">{p.summary}</p>
              <p className="mt-6 text-headline font-normal text-sherpa-deep">{p.price ? formatPrice(p.price) : "Price on request"}</p>
              <p className="mt-1 text-sm text-ink/55">
                {p.price ? "MRP, inclusive of all taxes." : "Add it to your cart and we'll confirm the price with your order."}
              </p>
              <div className="mt-7">
                <AddToCart slug={p.slug} name={`${p.name}, ${p.size}`} />
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-spring-deep pt-6 text-sm">
                <div>
                  <dt className="flex items-center gap-1.5 text-ink/55">
                    <Glyph icon={Maximize2} className="size-3.5 text-orient" />
                    Covers
                  </dt>
                  <dd className="font-semibold text-sherpa-deep">{p.coverage}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-ink/55">
                    <Glyph icon={Users} className="size-3.5 text-orient" />
                    Best for
                  </dt>
                  <dd className="font-semibold text-sherpa-deep">{p.bestFor}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* details */}
      <section aria-label="Product details" className="bg-spring">
        <div className="wrap grid gap-6 py-16 sm:py-20 lg:grid-cols-12">
          <Reveal className="rounded-[2rem] bg-white p-7 sm:p-9 lg:col-span-5">
            <h2 className="text-title font-semibold text-sherpa-deep">Ideal for</h2>
            <ul className="mt-5 space-y-3">
              {p.idealFor.map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-ink/75">
                  <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-orient" strokeWidth={2.2} />
                  {x}
                </li>
              ))}
            </ul>
            <h2 className="mt-9 text-title font-semibold text-sherpa-deep">In the box</h2>
            <ul className="mt-5 space-y-3">
              {p.inTheBox.map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-ink/75">
                  <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-orient" strokeWidth={2.2} />
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="overflow-hidden rounded-[2rem] bg-white lg:col-span-7">
            <h2 className="px-7 pt-7 text-title font-semibold text-sherpa-deep sm:px-9 sm:pt-9">Specifications</h2>
            <dl className="mt-4">
              {PRODUCT_FACTS.map((f) => (
                <div
                  key={f.label}
                  className="grid grid-cols-[8rem_1fr] gap-4 border-t border-spring-deep px-7 py-4 sm:grid-cols-[11rem_1fr] sm:px-9"
                >
                  <dt className="flex items-center gap-2 text-sm font-semibold text-orient">
                    <Glyph icon={FACT_ICONS[f.label] ?? Check} className="size-4" />
                    {f.label}
                  </dt>
                  <dd className="text-sherpa-deep">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="lg:col-span-12">
            <h2 className="mt-8 text-center text-title font-semibold text-sherpa-deep lg:text-left">How to use</h2>
            <Stagger as="ol" gap={0.08} className="mt-5 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {HOW_TO_USE.map((s, i) => (
                <Item as="li" key={s.title} className="rounded-[1.75rem] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <IconBadge icon={stepIcon(s.title)} size="sm" />
                    <span className="text-sm font-semibold tabular-nums text-ink/40">Step {i + 1}</span>
                  </div>
                  <p className="mt-4 font-semibold text-sherpa-deep">{s.title}</p>
                  <p className="mt-1 text-sm text-ink/70">{s.body}</p>
                </Item>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* other packs */}
      <section aria-labelledby="others-title" className="bg-white">
        <div className="wrap py-16 sm:py-20">
          <h2 id="others-title" className="text-center text-headline font-normal text-sherpa-deep lg:text-left">
            Other packs.
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/products/${o.slug}`} className="group flex items-center gap-5 rounded-[1.75rem] bg-spring p-4 pr-6">
                  <span className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-white">
                    <Image src={o.image.src} alt="" fill sizes="96px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-title font-semibold text-sherpa-deep group-hover:text-orient">{o.size}</span>
                    <span className="block text-sm text-ink/60">
                      {o.coverage} · {o.price ? formatPrice(o.price) : "Price on request"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Prefer we apply it for you?"
        body="Our team applies, ATP verifies and renews protection every 30 days, with a digital report after every visit."
        primary={{ href: "/services", label: "See the managed programme" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
    </>
  );
}
