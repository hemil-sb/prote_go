"use client";

import { useEffect, useRef, useState } from "react";

/* Marks its wrapper with data-inview="true" the first time it scrolls into view. */
export default function InView({
  children,
  className,
  threshold = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} data-inview={seen} className={className}>
      {children}
    </div>
  );
}
