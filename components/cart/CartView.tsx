"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/content/products";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./AddToCart";

export function OrderSummary({ cta }: { cta?: React.ReactNode }) {
  const { lines, subtotal, hasUnpriced } = useCart();
  return (
    <div className="rounded-[2rem] bg-white p-6 ring-1 ring-spring-deep sm:p-8">
      <h2 className="text-title font-semibold text-sherpa-deep">Order summary</h2>
      <ul className="mt-5 space-y-3 text-sm">
        {lines.map((l) => (
          <li key={l.slug} className="flex justify-between gap-4">
            <span className="text-ink/70">
              {l.product.size} {l.product.price ? "DIY kit" : "pack"} × {l.qty}
            </span>
            <span className="font-semibold text-sherpa-deep">{l.product.price ? formatPrice(l.product.price * l.qty) : "On request"}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex justify-between border-t border-spring-deep pt-5">
        <span className="font-semibold text-sherpa-deep">{hasUnpriced ? "Subtotal (priced items)" : "Subtotal"}</span>
        <span className="text-title font-semibold text-sherpa-deep">{formatPrice(subtotal)}</span>
      </div>
      <p className="mt-2 text-xs text-ink/55">
        MRP, inclusive of taxes. Delivery confirmed with your order.
        {hasUnpriced && " Items marked “on request” are priced by our team."}
      </p>
      {cta}
    </div>
  );
}

export default function CartView() {
  const { lines, ready, setQty, remove } = useCart();

  if (!ready) return <div className="h-64" aria-busy="true" />;

  if (!lines.length)
    return (
      <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-spring-deep sm:p-16">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-turquoise-tint text-sherpa">
          <ShoppingBag aria-hidden className="size-7" strokeWidth={1.5} />
        </span>
        <p className="mt-6 text-title font-semibold text-sherpa-deep">Your cart is empty.</p>
        <p className="mt-2 text-ink/65">The DIY Protection Kit covers about 750 sq ft for up to 30 days.</p>
        <Link
          href="/products"
          className="btn mt-8 inline-block rounded-full bg-orient px-6 py-3.5 font-semibold text-white hover:bg-sherpa"
        >
          Browse products
        </Link>
      </div>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <ul className="space-y-3 lg:col-span-8">
        {lines.map((l) => (
          <li
            key={l.slug}
            className="flex flex-wrap items-center gap-4 rounded-[1.75rem] bg-white p-4 ring-1 ring-spring-deep sm:flex-nowrap sm:gap-6 sm:pr-6"
          >
            <Link href={`/products/${l.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-spring">
              <Image src={l.product.image.src} alt="" fill sizes="96px" className="object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${l.slug}`} className="font-semibold text-sherpa-deep hover:text-orient">
                {l.product.name}, {l.product.size}
              </Link>
              <p className="mt-1 text-sm text-ink/60">
                {l.product.coverage} · {l.product.price ? `${formatPrice(l.product.price)} each` : "Price on request"}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
              <QtyStepper value={l.qty} onChange={(n) => setQty(l.slug, Math.max(1, n))} label={`Quantity of ${l.product.size}`} />
              <button
                type="button"
                onClick={() => remove(l.slug)}
                aria-label={`Remove ${l.product.size} from cart`}
                className="grid size-10 place-items-center rounded-full text-ink/50 transition-colors hover:bg-spring hover:text-sherpa-deep"
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="lg:col-span-4">
        <OrderSummary
          cta={
            <Link
              href="/checkout"
              className="btn mt-6 block rounded-full bg-orient px-6 py-4 text-center font-semibold text-white hover:bg-sherpa"
            >
              Continue to checkout
            </Link>
          }
        />
        <Link href="/products" className="mt-4 block text-center text-sm font-semibold text-orient hover:text-sherpa-deep">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
