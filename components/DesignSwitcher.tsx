"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/*
  Review tool: a pill pinned to the bottom of the screen for flipping between
  landing-page designs. Each design is its own route. Remove it (from app/layout.tsx)
  once a design is chosen.
*/
const DESIGNS = [
  { href: "/", label: "A" },
  { href: "/b", label: "B" },
  { href: "/c", label: "C" },
];

export default function DesignSwitcher() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Design versions"
      className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[70] flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-sherpa-deep/90 p-1.5 pl-4 text-white shadow-[0_12px_32px_-12px_rgb(13_44_51/0.6)] backdrop-blur-md">
        <span className="mr-1.5 text-xs font-semibold text-white/70">Design</span>
        {DESIGNS.map((d) => {
          const on = pathname === d.href;
          return (
            <Link
              key={d.href}
              href={d.href}
              aria-current={on ? "page" : undefined}
              aria-label={`Design ${d.label}`}
              className={`grid size-9 place-items-center rounded-full text-sm font-bold transition-colors ${
                on ? "bg-turquoise text-sherpa-deep" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {d.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
