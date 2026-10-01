"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, type Product } from "@/content/products";

/*
  Placeholder cart. It lives only in this browser (localStorage) and checkout sends an
  order request by email: there is no online payment yet. Swap for the real shop later.
*/
type Line = { slug: string; qty: number };
export type CartLine = Line & { product: Product };

type Cart = {
  lines: CartLine[];
  count: number;
  /** total of priced lines only; unpriced packs are confirmed by the team */
  subtotal: number;
  hasUnpriced: boolean;
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const KEY = "protego-cart";
const MAX_QTY = 99;
const CartContext = createContext<Cart | null>(null);

function read(): Line[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw)
      ? raw.filter((l): l is Line => PRODUCTS.some((p) => p.slug === l?.slug) && Number.isInteger(l?.qty) && l.qty > 0)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load the saved cart once, after hydration
    setItems(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === KEY && setItems(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // storage blocked: the cart still works for this visit
    }
  }, [items, ready]);

  const setQty = useCallback((slug: string, qty: number) => {
    const q = Math.max(0, Math.min(MAX_QTY, Math.round(qty)));
    setItems((prev) => {
      const rest = prev.filter((l) => l.slug !== slug);
      if (q === 0) return rest;
      return prev.some((l) => l.slug === slug) ? prev.map((l) => (l.slug === slug ? { ...l, qty: q } : l)) : [...rest, { slug, qty: q }];
    });
  }, []);

  const add = useCallback(
    (slug: string, qty = 1) =>
      setItems((prev) => {
        const cur = prev.find((l) => l.slug === slug)?.qty ?? 0;
        const q = Math.min(MAX_QTY, cur + qty);
        return cur ? prev.map((l) => (l.slug === slug ? { ...l, qty: q } : l)) : [...prev, { slug, qty: q }];
      }),
    [],
  );

  const value = useMemo<Cart>(() => {
    const lines = items.flatMap((l) => {
      const product = PRODUCTS.find((p) => p.slug === l.slug);
      return product ? [{ ...l, product }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + (l.product.price ?? 0) * l.qty, 0),
      hasUnpriced: lines.some((l) => l.product.price === null),
      ready,
      add,
      setQty,
      remove: (slug) => setQty(slug, 0),
      clear: () => setItems([]),
    };
  }, [items, ready, add, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}
