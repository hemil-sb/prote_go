import Image from "next/image";
import Link from "next/link";
import { ArrowRight, IndianRupee, Maximize2 } from "lucide-react";
import AddToCart from "@/components/cart/AddToCart";
import { Glyph } from "@/components/site/icons";
import { formatPrice, type Product } from "@/content/products";

/*
  Product card for the home preview (a swipe rail on phones) and /products. The packshot sits
  in its own white frame so it stands out; the pack that can be ordered online (the only one
  with a price) is the dark, featured card with a direct "Add to cart".
*/
export default function ProductCard({
  product: p,
  summary = true,
  sizes = "(min-width: 768px) 30vw, 84vw",
}: {
  product: Product;
  summary?: boolean;
  sizes?: string;
}) {
  const featured = p.price !== null;
  const href = `/products/${p.slug}`;
  const muted = featured ? "text-white/60" : "text-ink/55";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[2rem] shadow-[0_28px_56px_-32px_rgb(13_44_51/0.55)] ${
        featured ? "on-dark bg-sherpa-deep text-white" : "bg-white ring-1 ring-spring-deep"
      }`}
    >
      <Link href={href} className="group relative m-2.5 mb-0 block aspect-[6/5] overflow-hidden rounded-[1.6rem] bg-white">
        <Image
          src={p.image.src}
          alt={p.image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-[scale] duration-500 ease-out group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            featured ? "bg-turquoise text-sherpa-deep" : "bg-sherpa-deep text-white"
          }`}
        >
          {p.tag}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className={`text-sm font-semibold ${featured ? "text-turquoise" : "text-orient"}`}>{p.name}</p>
        <h3 className="mt-1 text-headline font-normal">
          <Link href={href} className={featured ? "hover:text-turquoise" : "text-sherpa-deep hover:text-orient"}>
            {p.size}
          </Link>
        </h3>
        {summary && <p className={`mt-3 ${featured ? "text-white/75" : "text-ink/70"}`}>{p.summary}</p>}

        <dl className={`mt-5 grid grid-cols-2 gap-4 border-t pt-4 text-sm ${featured ? "border-white/15" : "border-spring-deep"}`}>
          <div>
            <dt className={`flex items-center gap-1.5 ${muted}`}>
              <Glyph icon={Maximize2} className={`size-3.5 ${featured ? "text-turquoise" : "text-orient"}`} />
              Covers
            </dt>
            <dd className="mt-0.5 font-semibold">{p.coverage}</dd>
          </div>
          <div>
            <dt className={`flex items-center gap-1.5 ${muted}`}>
              <Glyph icon={IndianRupee} className={`size-3.5 ${featured ? "text-turquoise" : "text-orient"}`} />
              Price
            </dt>
            <dd className={featured ? "mt-0.5 text-title font-semibold text-turquoise" : "mt-0.5 font-semibold"}>
              {p.price ? formatPrice(p.price) : "On request"}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6">
          {featured && <AddToCart slug={p.slug} name={`${p.name}, ${p.size}`} compact tone="dark" />}
          <Link
            href={href}
            className={
              featured
                ? "group inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-turquoise"
                : "btn inline-flex items-center gap-2 rounded-full bg-sherpa-deep px-6 py-3.5 font-semibold text-white hover:bg-sherpa"
            }
          >
            {featured ? "Details" : "View details"}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
