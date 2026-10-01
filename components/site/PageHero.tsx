import Image from "next/image";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";
import Placeholder from "@/components/Placeholder";
import ExploreLink from "@/components/site/ExploreLink";
import { IconBadge } from "@/components/site/icons";

type Crumb = { href: string; label: string };
export type HeroAction = { href: string; label: string };
export type HeroHighlight = { icon: LucideIcon; value: string; label?: string };
export type HeroCard = { icon: LucideIcon; title: string; text: string };

/*
  Dark opening band for every inner page (data-hero tells the header to stay transparent
  over it). Headline in Turquoise on Sherpa deep, per the brand guide's dark-section rule.

  Structure: breadcrumb → headline → lede → up to two actions → up to three highlights.
  The right-hand side is a photo (with an optional floating card) or, without a photo, the
  large faded ProteGo mark. Every hero has the same height (min-h, content centred). Below xl
  (1280px) the photo becomes a darkened background behind the text instead of stacking below it.
*/
export default function PageHero({
  crumbs,
  title,
  lede,
  actions = [],
  highlights = [],
  image,
  imageBrief,
  card,
}: {
  crumbs: Crumb[];
  title: string;
  lede?: string;
  /** first is the primary (turquoise) button, second the outline one */
  actions?: HeroAction[];
  highlights?: HeroHighlight[];
  image?: { src: string; alt: string };
  /** shown as a content placeholder when there is no image yet */
  imageBrief?: string;
  /** a small card floating over the photo's corner (desktop) */
  card?: HeroCard;
}) {
  const side = image || imageBrief;
  return (
    <section data-hero className="on-dark plus-field overflow-hidden bg-sherpa-deep text-white" data-tone="dark" data-fade="tr">
      {/* heroes without a photo get the ProteGo mark (icon only), large and faded, on the right */}
      {!side && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[4%] top-1/2 hidden w-[min(40vw,38rem)] -translate-y-[42%] lg:block"
        >
          <Reveal onMount effect="zoom" duration={1.6}>
            <Image
              src="/brand/icon-turquoise.svg"
              alt=""
              width={205}
              height={226}
              loading="eager"
              className="h-auto w-full opacity-[0.13]"
            />
          </Reveal>
        </div>
      )}
      <div
        className={`wrap relative grid min-h-[45rem] content-center sm:min-h-[46rem] gap-10 pb-14 pt-28 sm:pb-20 sm:pt-32 lg:min-h-[53.5rem] lg:pb-20 ${side ? "xl:grid-cols-12 xl:items-center xl:gap-12" : ""}`}
      >
        <div className={`relative z-10 text-center lg:text-left ${side ? "xl:col-span-6" : "lg:max-w-[46rem]"}`}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-white/60 lg:justify-start">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight aria-hidden className="size-3.5 text-white/35" />}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.href} className="transition-colors hover:text-turquoise">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white/85">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <Words
            as="h1"
            onMount
            text={title}
            className="mx-auto mt-6 max-w-[18ch] text-[clamp(2.5rem,1.4rem+3.3vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.035em] text-turquoise lg:mx-0"
          />
          {lede && (
            <Reveal as="p" onMount delay={0.3} className="mx-auto mt-5 max-w-[34rem] text-lede text-white/80 lg:mx-0">
              {lede}
            </Reveal>
          )}
          {actions.length > 0 && (
            <Reveal onMount delay={0.45} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {actions.map((a, i) => (
                <ExploreLink key={a.href + a.label} href={a.href} tone={i === 0 ? "bright" : "ghost"}>
                  {a.label}
                </ExploreLink>
              ))}
            </Reveal>
          )}
          {highlights.length > 0 && (
            <Stagger
              as="ul"
              onMount
              delay={0.6}
              gap={0.08}
              className="mx-auto mt-9 hidden max-w-[36rem] grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:grid lg:mx-0"
            >
              {highlights.map((h) => (
                <Item
                  as="li"
                  key={h.value}
                  className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left"
                >
                  <IconBadge icon={h.icon} tone="glass" size="sm" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug text-white">{h.value}</span>
                    {h.label && <span className="mt-0.5 block text-xs leading-snug text-white/60">{h.label}</span>}
                  </span>
                </Item>
              ))}
            </Stagger>
          )}
        </div>

        {side && (
          // below xl: a full-bleed background layer behind the text; xl: the right-hand column
          <div className="absolute inset-0 xl:relative xl:inset-auto xl:col-span-6">
            <Reveal onMount effect="zoom" delay={0.2} className="h-full xl:h-auto">
              {image ? (
                <div className="relative h-full overflow-hidden xl:aspect-[4/3] xl:h-auto xl:rounded-[2rem]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-b from-sherpa-deep/90 via-sherpa-deep/80 to-sherpa-deep/95 xl:hidden"
                  />
                </div>
              ) : (
                <Placeholder
                  tone="dark"
                  label={imageBrief!}
                  hint="4:3, at least 1600 × 1200, natural light"
                  className="hidden aspect-[4/3] xl:flex"
                />
              )}
            </Reveal>
            {card && image && (
              <Reveal
                onMount
                delay={0.7}
                className="absolute -bottom-6 -left-6 hidden max-w-[19rem] items-start gap-3.5 rounded-[1.5rem] bg-white p-5 text-sherpa-deep shadow-[0_24px_48px_-20px_rgb(0_0_0/0.5)] xl:flex"
              >
                <IconBadge icon={card.icon} size="sm" />
                <span>
                  <span className="block font-semibold leading-snug">{card.title}</span>
                  <span className="mt-1 block text-sm leading-snug text-ink/65">{card.text}</span>
                </span>
              </Reveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
