import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <section aria-labelledby="cart-title" className="bg-spring">
      <div className="wrap pb-20 pt-28 sm:pt-36">
        <h1 id="cart-title" className="text-center text-headline font-normal text-sherpa-deep lg:text-left">
          Your cart.
        </h1>
        <div className="mt-8 sm:mt-10">
          <CartView />
        </div>
      </div>
    </section>
  );
}
