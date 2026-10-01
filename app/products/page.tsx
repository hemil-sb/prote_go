import type { Metadata } from "next";
import { Droplets, ShieldCheck, ShoppingBag, SprayCan, Timer } from "lucide-react";
import { FACT_ICONS, Glyph, IconBadge, stepIcon } from "@/components/site/icons";
import PageHero from "@/components/site/PageHero";
import ProductCard from "@/components/site/ProductCard";
import SectionIntro from "@/components/site/SectionIntro";
import CtaBand from "@/components/site/CtaBand";
import { Item, Reveal, Stagger } from "@/components/Motion";
import { ALSO_AVAILABLE, HOW_TO_USE, PRODUCTS, PRODUCT_FACTS } from "@/content/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "ProteGo Surface Protectant in 100 ml, 500 ml (DIY Protection Kit) and 20 L packs. Ready to use, about 98% water, up to 30 days of protection per application.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
        ]}
        title="Protect once. Clean as usual."
        lede="One protectant in three packs: for your pocket, your home or business, and your whole facility."
        actions={[
          { href: "/products/diy-protection-kit-500ml", label: "Order the DIY kit" },
          { href: "/contact", label: "Bulk and trade enquiries" },
        ]}
        highlights={[
          { icon: SprayCan, value: "Ready to use", label: "no dilution" },
          { icon: Droplets, value: "About 98% water", label: "non-flammable" },
          { icon: Timer, value: "About an hour", label: "to dry" },
        ]}
        image={{
          src: "/images/bottle-shield-hand.jpg",
          alt: "A hand holding a bottle of ProteGo Surface Protectant inside the ProteGo shield",
        }}
        card={{ icon: ShoppingBag, title: "DIY Protection Kit, ₹1,049", text: "500 ml covers about 750 sq ft. Order online." }}
      />

      {/* the packs */}
      <section aria-labelledby="packs-title" className="plus-field bg-white" data-fade="tr">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro id="packs-title" title="Choose your pack." lede={ALSO_AVAILABLE} />
          <Stagger as="ul" gap={0.1} className="mx-auto mt-10 grid max-w-[30rem] gap-6 sm:mt-14 md:max-w-none md:grid-cols-3">
            {PRODUCTS.map((p) => (
              <Item as="li" key={p.slug}>
                <ProductCard product={p} />
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* how to use + facts */}
      <section aria-labelledby="use-title" className="on-dark plus-field bg-sherpa text-white" data-tone="dark" data-fade="bl">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro
            id="use-title"
            dark
            title="Simple to use."
            lede="No special equipment for the 100 ml and 500 ml packs. Just clean, spray and let it dry."
          />
          <Stagger as="ol" gap={0.1} className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-6 lg:grid-cols-4">
            {HOW_TO_USE.map((s, i) => (
              <Item as="li" key={s.title} className="rounded-[1.75rem] bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8">
                <div className="flex items-center justify-between">
                  <IconBadge icon={stepIcon(s.title)} tone="turquoise" size="sm" />
                  <span className="text-sm font-semibold tabular-nums text-white/50">Step {i + 1}</span>
                </div>
                <p className="mt-5 text-title font-semibold">{s.title}</p>
                <p className="mt-2 text-sm text-white/75 sm:text-base">{s.body}</p>
              </Item>
            ))}
          </Stagger>
          <Reveal className="mt-6 overflow-hidden rounded-[2rem] bg-white/[0.06] ring-1 ring-white/10">
            <dl className="grid sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCT_FACTS.map((f) => (
                <div key={f.label} className="border-b border-white/10 p-6">
                  <dt className="flex items-center gap-2 text-sm font-semibold text-turquoise">
                    <Glyph icon={FACT_ICONS[f.label] ?? ShieldCheck} className="size-4" />
                    {f.label}
                  </dt>
                  <dd className="mt-1 font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Need more than a bottle?"
        body="For large or busy spaces, our team applies, verifies and renews protection for you every 30 days."
        primary={{ href: "/services", label: "See the managed programme" }}
        secondary={{ href: "/contact", label: "Bulk and trade enquiries" }}
      />
    </>
  );
}
