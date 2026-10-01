"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CONTACT } from "@/content/contact";
import { formatPrice } from "@/content/products";
import { useCart } from "./CartProvider";
import { OrderSummary } from "./CartView";

/*
  Placeholder checkout: no payment is taken. Placing the order opens the visitor's email app
  with the order and delivery details filled in, like the contact form. Replace with the
  real payment flow when the shop goes live.
*/
export default function CheckoutForm() {
  const { lines, ready, subtotal, clear } = useCart();
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const items = lines.map(
      (l) =>
        `- ${l.product.name}, ${l.product.size} × ${l.qty}${l.product.price ? ` (${formatPrice(l.product.price * l.qty)})` : " (price on request)"}`,
    );
    const body = [
      "Order request",
      ...items,
      `Subtotal (priced items): ${formatPrice(subtotal)}`,
      "",
      `Name: ${d.get("name")}`,
      `Phone: ${d.get("phone")}`,
      `Email: ${d.get("email")}`,
      `Company: ${d.get("company") || "-"}`,
      `GSTIN: ${d.get("gstin") || "-"}`,
      `Delivery address: ${d.get("address")}, ${d.get("city")} ${d.get("pincode")}`,
      `Notes: ${d.get("notes") || "-"}`,
    ].join("\n");
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Order request: ${d.get("name")}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    clear();
  }

  if (!ready) return <div className="h-64" aria-busy="true" />;

  if (sent)
    return (
      <div role="status" className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-spring-deep sm:p-16">
        <CheckCircle2 aria-hidden className="mx-auto size-12 text-orient" strokeWidth={1.5} />
        <p className="mt-6 text-title font-semibold text-sherpa-deep">Your email app is open with your order.</p>
        <p className="mx-auto mt-2 max-w-[30rem] text-ink/65">
          Send it and we&rsquo;ll confirm availability, delivery and payment by phone or email.
        </p>
        <Link href="/" className="btn mt-8 inline-block rounded-full bg-orient px-6 py-3.5 font-semibold text-white hover:bg-sherpa">
          Back to home
        </Link>
      </div>
    );

  if (!lines.length)
    return (
      <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-spring-deep">
        <p className="text-title font-semibold text-sherpa-deep">Your cart is empty.</p>
        <Link
          href="/products"
          className="btn mt-6 inline-block rounded-full bg-orient px-6 py-3.5 font-semibold text-white hover:bg-sherpa"
        >
          Browse products
        </Link>
      </div>
    );

  const field =
    "mt-2 w-full rounded-xl border border-spring-deep bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-orient focus:outline-none";
  const label = "block text-sm font-medium text-sherpa-deep";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <fieldset className="rounded-[2rem] bg-white p-6 ring-1 ring-spring-deep sm:p-8">
          <legend className="sr-only">Your details</legend>
          <p className="text-title font-semibold text-sherpa-deep">Your details</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={label}>
              Full name
              <input name="name" required autoComplete="name" className={field} />
            </label>
            <label className={label}>
              Phone
              <input name="phone" type="tel" required autoComplete="tel" className={field} />
            </label>
            <label className={label}>
              Email
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className={label}>
              Company <span className="text-ink/45">(optional)</span>
              <input name="company" autoComplete="organization" className={field} />
            </label>
            <label className={`${label} sm:col-span-2`}>
              GSTIN <span className="text-ink/45">(optional, for a GST invoice)</span>
              <input name="gstin" className={field} />
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-[2rem] bg-white p-6 ring-1 ring-spring-deep sm:p-8">
          <legend className="sr-only">Delivery address</legend>
          <p className="text-title font-semibold text-sherpa-deep">Delivery address</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={`${label} sm:col-span-2`}>
              Address
              <input name="address" required autoComplete="street-address" className={field} />
            </label>
            <label className={label}>
              City
              <input name="city" required autoComplete="address-level2" className={field} />
            </label>
            <label className={label}>
              PIN code
              <input name="pincode" required inputMode="numeric" pattern="[0-9]{6}" autoComplete="postal-code" className={field} />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Notes <span className="text-ink/45">(optional)</span>
              <textarea name="notes" rows={3} className={field} />
            </label>
          </div>
        </fieldset>
      </div>

      <div className="lg:col-span-4">
        <OrderSummary
          cta={
            <>
              <button type="submit" className="btn mt-6 w-full rounded-full bg-orient px-6 py-4 font-semibold text-white hover:bg-sherpa">
                Place order request
              </button>
              <p className="mt-3 text-xs text-ink/55">
                Online payment is coming soon. This opens your email app with your order; we confirm availability, delivery and payment with
                you directly.
              </p>
            </>
          }
        />
      </div>
    </form>
  );
}
