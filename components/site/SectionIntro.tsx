import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, Words } from "@/components/Motion";

/* Section heading row: headline on the left, lede (and an optional link) on the right from lg. */
export default function SectionIntro({
  id,
  eyebrow,
  title,
  lede,
  link,
  dark = false,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  link?: { href: string; label: string };
  dark?: boolean;
}) {
  return (
    <div className="grid gap-5 text-center lg:grid-cols-12 lg:items-end lg:text-left">
      <div className="lg:col-span-7">
        {eyebrow && <p className={`mb-3 text-sm font-semibold ${dark ? "text-white/70" : "text-orient"}`}>{eyebrow}</p>}
        <Words id={id} text={title} className={`text-headline font-normal ${dark ? "text-turquoise" : "text-sherpa-deep"}`} />
      </div>
      {(lede || link) && (
        <Reveal delay={0.2} className="mx-auto max-w-[28rem] lg:col-span-5 lg:mx-0">
          {lede && <p className={`text-lede ${dark ? "text-white/80" : "text-ink/75"}`}>{lede}</p>}
          {link && (
            <Link
              href={link.href}
              className={`group mt-4 inline-flex items-center gap-2 font-semibold ${dark ? "text-turquoise hover:text-white" : "text-orient hover:text-sherpa-deep"}`}
            >
              {link.label}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </Reveal>
      )}
    </div>
  );
}
