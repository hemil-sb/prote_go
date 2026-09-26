"use client";

import { useEffect, useState } from "react";

/*
  Position dots for a `.rail` (the swipeable card row used below desktop).
  Follows the rail's scroll position; tapping a dot brings that card into view.
  Hidden from lg up, where the rail is a plain grid.
*/
export default function RailDots({ railId, labels, tone = "light" }: { railId: string; labels: string[]; tone?: "light" | "dark" }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const onScroll = () => {
      const cards = [...rail.children] as HTMLElement[];
      if (rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4) return setActive(cards.length - 1);
      const start = rail.scrollLeft + parseFloat(getComputedStyle(rail).paddingLeft);
      let best = 0;
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - start) < Math.abs(cards[best].offsetLeft - start)) best = i;
      });
      setActive(best);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, [railId]);

  function go(i: number) {
    const rail = document.getElementById(railId);
    const card = rail?.children[i] as HTMLElement | undefined;
    if (!rail || !card) return;
    rail.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(rail).paddingLeft), behavior: "smooth" });
  }

  const on = tone === "dark" ? "bg-turquoise" : "bg-orient";
  const off = tone === "dark" ? "bg-white/30" : "bg-sherpa-deep/20";

  return (
    <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => go(i)}
          aria-label={`Show ${label}`}
          aria-current={i === active ? "true" : undefined}
          className="grid h-6 place-items-center px-0.5"
        >
          <span className={`block h-2 rounded-full transition-all duration-300 ${i === active ? `w-6 ${on}` : `w-2 ${off}`}`} />
        </button>
      ))}
    </div>
  );
}
