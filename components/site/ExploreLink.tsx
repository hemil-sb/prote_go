import Link from "next/link";
import { ArrowRight } from "lucide-react";

/*
  The home page's "go deeper" button: a pill with an arrow disc that slides on hover.
  solid = on light backgrounds; bright = on dark backgrounds; outline = secondary on light; ghost = secondary on dark.
*/
const TONES = {
  solid: { pill: "bg-sherpa-deep text-white hover:bg-sherpa", disc: "bg-turquoise text-sherpa-deep" },
  bright: { pill: "bg-turquoise text-sherpa-deep hover:bg-white", disc: "bg-sherpa-deep text-turquoise" },
  outline: {
    pill: "bg-white text-sherpa-deep ring-1 ring-sherpa-deep/15 hover:ring-sherpa-deep/40",
    disc: "bg-sherpa-deep text-turquoise",
  },
  ghost: { pill: "text-white ring-1 ring-white/30 hover:bg-white/10", disc: "bg-white/10 text-turquoise" },
};

export default function ExploreLink({
  href,
  children,
  tone = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <Link
      href={href}
      className={`btn group inline-flex items-center gap-4 rounded-full py-2 pl-6 pr-2 font-semibold transition-colors ${t.pill} ${className}`}
    >
      {children}
      <span
        aria-hidden
        className={`grid size-10 shrink-0 place-items-center rounded-full transition-transform duration-300 ease-out group-hover:translate-x-1 ${t.disc}`}
      >
        <ArrowRight className="size-[18px]" strokeWidth={2.2} />
      </span>
    </Link>
  );
}
