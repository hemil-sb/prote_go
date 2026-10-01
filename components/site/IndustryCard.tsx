import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Industry } from "@/content/industries";

/* Card for the industries index and "related industries" rows. */
export default function IndustryCard({
  industry: ind,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw",
  showGroup = false,
}: {
  industry: Industry;
  sizes?: string;
  showGroup?: boolean;
}) {
  return (
    <Link
      href={`/industries/${ind.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white ring-1 ring-spring-deep transition-shadow duration-300 hover:shadow-[0_24px_48px_-24px_rgb(13_44_51/0.35)]"
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-sherpa-deep">
        {ind.image ? (
          <Image
            src={ind.image.src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <span aria-hidden className="plus-field absolute inset-0 block" data-tone="dark" data-fade="br" />
        )}
        {showGroup && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-sherpa-deep">{ind.group}</span>
        )}
      </span>
      <span className="flex flex-1 flex-col p-6">
        <span className="flex items-start justify-between gap-3">
          <span className="text-title font-semibold text-sherpa-deep group-hover:text-orient">{ind.name}</span>
          <ArrowUpRight
            aria-hidden
            className="mt-1 size-5 shrink-0 text-orient transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
        <span className="mt-1 block text-sm font-semibold text-orient">{ind.covers}</span>
        <span className="mt-3 block text-sm text-ink/70">{ind.summary}</span>
      </span>
    </Link>
  );
}
