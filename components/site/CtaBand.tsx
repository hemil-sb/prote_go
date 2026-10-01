import Link from "next/link";
import { Reveal } from "@/components/Motion";

/* Closing call to action used at the end of inner pages. */
export default function CtaBand({
  title = "Book a free hygiene assessment.",
  body = "We visit, map your high-touch surfaces and take ATP readings. No obligation.",
  primary = { href: "/contact", label: "Book a free assessment" },
  secondary = { href: "/services", label: "Start a pilot" },
  tone = "spring",
}: {
  title?: string;
  body?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
  tone?: "spring" | "white";
}) {
  return (
    <section className={tone === "white" ? "bg-white" : "bg-spring"}>
      <div className="wrap py-14 sm:py-20">
        <Reveal
          className="on-dark plus-field flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[2rem] bg-sherpa p-8 text-center text-white sm:p-12 lg:flex-row lg:text-left"
          data-tone="dark"
          data-fade="br"
        >
          <div>
            <h2 className="text-headline font-normal text-turquoise">{title}</h2>
            <p className="mt-3 max-w-[34rem] text-lede text-white/80">{body}</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-3">
            <Link href={primary.href} className="btn rounded-full bg-turquoise px-7 py-4 font-semibold text-sherpa-deep hover:bg-white">
              {primary.label}
            </Link>
            {secondary && (
              <Link href={secondary.href} className="btn rounded-full px-7 py-4 font-semibold text-white ring-1 ring-white/35 hover:bg-white/10">
                {secondary.label}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
