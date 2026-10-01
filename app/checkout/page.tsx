import type { Metadata } from "next";
import CheckoutForm from "@/components/cart/CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <section aria-labelledby="checkout-title" className="bg-spring">
      <div className="wrap pb-20 pt-28 sm:pt-36">
        <h1 id="checkout-title" className="text-center text-headline font-normal text-sherpa-deep lg:text-left">
          Checkout.
        </h1>
        <div className="mt-8 sm:mt-10">
          <CheckoutForm />
        </div>
      </div>
    </section>
  );
}
