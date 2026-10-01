"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { useCart } from "./CartProvider";

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const btn = "grid size-10 place-items-center rounded-full text-sherpa-deep transition-colors hover:bg-sherpa-deep/5 disabled:opacity-30";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full bg-white ring-1 ring-spring-deep">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus aria-hidden className="size-4" />
      </button>
      <output aria-live="polite" className="w-8 text-center font-semibold tabular-nums text-sherpa-deep">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= 99} aria-label="Increase quantity">
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}

export default function AddToCart({
  slug,
  name,
  compact = false,
  tone = "light",
}: {
  slug: string;
  name: string;
  compact?: boolean;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function onAdd() {
    add(slug, qty);
    setAdded(true);
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${compact ? "" : "sm:gap-4"}`}>
      {!compact && <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(99, n)))} label={`Quantity of ${name}`} />}
      <button
        type="button"
        onClick={onAdd}
        className={`btn rounded-full px-6 py-3.5 font-semibold ${dark ? "bg-turquoise text-sherpa-deep hover:bg-white" : "bg-orient text-white hover:bg-sherpa"}`}
      >
        Add to cart
      </button>
      <p aria-live="polite" className={`text-sm font-semibold ${dark ? "text-turquoise" : "text-orient"}`}>
        {added && (
          <span className="inline-flex items-center gap-1.5">
            <Check aria-hidden className="size-4" strokeWidth={2.4} />
            Added.{" "}
            <Link href="/cart" className={`underline underline-offset-4 ${dark ? "hover:text-white" : "hover:text-sherpa-deep"}`}>
              View cart
            </Link>
          </span>
        )}
      </p>
    </div>
  );
}
