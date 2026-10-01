import type { Metadata } from "next";
import { Building2, Gauge, Hand } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import IndustryCard from "@/components/site/IndustryCard";
import CtaBand from "@/components/site/CtaBand";
import { Item, Stagger } from "@/components/Motion";
import { INDUSTRIES } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Surface protection for hospitals, schools, hotels, restaurants, offices, malls, cinemas, gyms, airports, railways, government buildings, factories and homes.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/industries", label: "Industries" },
        ]}
        title="Every surface. Every day."
        lede="Wherever many hands touch the same surfaces, ProteGo keeps them protected between cleans. Find your industry to see what we protect and how."
        actions={[
          { href: "/contact", label: "Book a free assessment" },
          { href: "/how-it-works", label: "How it works" },
        ]}
        highlights={[
          { icon: Building2, value: `${INDUSTRIES.length} industries`, label: "one standard" },
          { icon: Hand, value: "High-touch surfaces", label: "mapped for your site" },
          { icon: Gauge, value: "ATP verified", label: "every visit" },
        ]}
      />

      <section aria-label="All industries" className="plus-field bg-spring" data-fade="tl">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <Stagger as="ul" gap={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {INDUSTRIES.map((ind) => (
              <Item as="li" key={ind.slug}>
                <IndustryCard industry={ind} showGroup />
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand
        title="Don't see your space?"
        body="If many people touch the same surfaces every day, we can help. Tell us about your site."
        secondary={null}
        tone="white"
      />
    </>
  );
}
