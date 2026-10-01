import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal, Words } from "@/components/Motion";
import Placeholder from "@/components/Placeholder";

type Crumb = { href: string; label: string };

/*
  Dark opening band for every inner page (data-hero tells the header to stay transparent
  over it). Headline in Turquoise on Sherpa deep, per the brand guide's dark-section rule.
*/
export default function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  image,
  imageBrief,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lede?: string;
  image?: { src: string; alt: string };
  /** shown as a content placeholder when there is no image yet */
  imageBrief?: string;
  children?: React.ReactNode;
}) {
  const side = image || imageBrief;
  return (
    <section data-hero className="on-dark plus-field bg-sherpa-deep text-white" data-tone="dark" data-fade="tr">
      <div className={`wrap grid gap-10 pb-14 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 ${side ? "lg:grid-cols-12 lg:items-center" : ""}`}>
        <div className={`text-center lg:text-left ${side ? "lg:col-span-6" : ""}`}>
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
          {eyebrow && <p className="mt-8 text-sm font-semibold text-white/70">{eyebrow}</p>}
          <Words
            as="h1"
            onMount
            text={title}
            className={`${eyebrow ? "mt-3" : "mt-8"} mx-auto max-w-[18ch] text-display font-normal text-turquoise lg:mx-0`}
          />
          {lede && (
            <Reveal as="p" onMount delay={0.3} className="mx-auto mt-6 max-w-[34rem] text-lede text-white/80 lg:mx-0">
              {lede}
            </Reveal>
          )}
          {children && (
            <Reveal onMount delay={0.45} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {children}
            </Reveal>
          )}
        </div>
        {side && (
          <Reveal onMount effect="zoom" delay={0.2} className="lg:col-span-6">
            {image ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image src={image.src} alt={image.alt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
              </div>
            ) : (
              <Placeholder tone="dark" label={imageBrief!} hint="4:3, at least 1600 × 1200, natural light" className="aspect-[4/3]" />
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
