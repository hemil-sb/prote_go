import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageSquareQuote, ShieldCheck } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import { Glyph, IconBadge, personIcon, pointIcon, surfaceIcon, zoneIcon } from "@/components/site/icons";
import IndustryCard from "@/components/site/IndustryCard";
import CtaBand from "@/components/site/CtaBand";
import Faq from "@/components/sections/Faq";
import { ProgrammeCard } from "@/components/sections/Services";
import { Item, Reveal, Stagger } from "@/components/Motion";
import { INDUSTRIES, industryBySlug } from "@/content/industries";
import { INDUSTRY_FAQS } from "@/content/faqs";

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(props: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const ind = industryBySlug((await props.params).slug);
  if (!ind) return {};
  return { title: `${ind.name}: ${ind.covers}`, description: ind.lede };
}

export default async function IndustryPage(props: PageProps<"/industries/[slug]">) {
  const ind = industryBySlug((await props.params).slug);
  if (!ind) notFound();
  const related = ind.related.map(industryBySlug).filter((r) => r !== undefined);
  const contactHref = `/contact?sector=${encodeURIComponent(ind.contactSector)}`;

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/industries", label: "Industries" },
          { href: `/industries/${ind.slug}`, label: ind.name },
        ]}
        title={ind.headline}
        lede={ind.lede}
        actions={[
          { href: contactHref, label: "Book a free assessment" },
          { href: "/how-it-works", label: "How it works" },
        ]}
        highlights={ind.zones.slice(0, 3).map((z) => ({ icon: zoneIcon(z.area), value: z.area }))}
        image={ind.image}
        imageBrief={ind.image ? undefined : `Photo: ${ind.covers.toLowerCase()}`}
        card={
          ind.proof
            ? { icon: MessageSquareQuote, title: `“${ind.proof.quote}”`, text: ind.proof.source }
            : { icon: ShieldCheck, title: "Protected Space™", text: "A certificate and decal your visitors can scan to verify." }
        }
      />

      {/* the challenge */}
      <section aria-labelledby="challenge-title" className="plus-field bg-spring" data-fade="tl">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro id="challenge-title" eyebrow="The challenge" title={ind.challenge.title} lede={ind.challenge.intro} />
          <Stagger as="ul" gap={0.08} className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {ind.challenge.points.map((p) => (
              <Item as="li" key={p.title} className="rounded-[2rem] bg-white p-7">
                <IconBadge icon={pointIcon(p.title, p.body)} />
                <p className="mt-6 text-lg font-semibold leading-snug text-sherpa-deep">{p.title}</p>
                <p className="mt-3 text-ink/70">{p.body}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* where we protect */}
      <section aria-labelledby="zones-title" className="bg-white">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro
            id="zones-title"
            eyebrow="Where we protect"
            title="The surfaces that matter most."
            lede="Hard, non-food-contact, high-touch surfaces, mapped during your site assessment."
          />
          <Stagger as="ul" gap={0.06} className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {ind.zones.map((z) => (
              <Item as="li" key={z.area} className="rounded-[1.75rem] bg-turquoise-tint p-6">
                <p className="flex items-center gap-3 font-semibold text-sherpa-deep">
                  <IconBadge icon={zoneIcon(z.area)} size="sm" />
                  {z.area}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {z.surfaces.map((s) => (
                    <li key={s} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm text-sherpa-deep">
                      <Glyph icon={surfaceIcon(s)} className="size-3.5 text-orient" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* how we help: the one generic process, plus what is specific to this sector */}
      <section aria-labelledby="approach-title" className="plus-field bg-spring" data-fade="tr">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro id="approach-title" eyebrow="How we help" title={ind.line} />
          <ProgrammeCard className="mt-10 sm:mt-14" />
          {ind.approach.length > 0 && (
            <Stagger as="ul" gap={0.1} className={`mt-6 grid gap-4 lg:gap-6 ${ind.approach.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {ind.approach.map((a) => (
                <Item as="li" key={a.title} className="flex items-start gap-5 rounded-[2rem] bg-white p-7">
                  <IconBadge icon={pointIcon(a.title, a.body)} />
                  <div>
                    <p className="text-sm font-semibold text-orient">For {ind.name.toLowerCase()}</p>
                    <p className="mt-2 text-title font-semibold text-sherpa-deep">{a.title}</p>
                    <p className="mt-2 text-ink/70">{a.body}</p>
                  </div>
                </Item>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* benefits + proof */}
      <section aria-labelledby="benefits-title" className="on-dark plus-field bg-sherpa text-white" data-tone="dark" data-fade="bl">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro id="benefits-title" dark eyebrow="What it means" title="For everyone who shares the space." />
          <Stagger as="ul" gap={0.08} className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3 lg:gap-6">
            {ind.benefits.map((b) => (
              <Item as="li" key={b.who} className="rounded-[2rem] bg-white/[0.06] p-7 ring-1 ring-white/10">
                <IconBadge icon={personIcon(b.who)} tone="turquoise" />
                <p className="mt-6 text-sm font-semibold text-turquoise">{b.who}</p>
                <p className="mt-3 text-white/85">{b.body}</p>
              </Item>
            ))}
          </Stagger>

          {ind.proof && (
            <Reveal as="figure" className="m-0 mt-6 rounded-[2rem] bg-sherpa-deep p-8 text-center sm:p-12 lg:text-left">
              <blockquote>
                <p className="mx-auto max-w-[36ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-light leading-[1.25] tracking-[-0.02em] lg:mx-0">
                  &ldquo;{ind.proof.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-6 font-semibold text-turquoise">{ind.proof.source}</figcaption>
            </Reveal>
          )}
        </div>
      </section>

      <Faq items={[...ind.faqs, ...INDUSTRY_FAQS]} id="industry-faq" tone="white" />

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-spring">
          <div className="wrap pt-16 sm:pt-20">
            <h2 id="related-title" className="text-center text-headline font-normal text-sherpa-deep lg:text-left">
              Related industries.
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((r) => (
                <li key={r.slug}>
                  <IndustryCard industry={r} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand
        title="Start with a pilot."
        body="One area. One application. See the ATP readings, then decide."
        primary={{ href: contactHref, label: "Plan a pilot" }}
        secondary={{ href: "/services", label: "See plans" }}
      />
    </>
  );
}
