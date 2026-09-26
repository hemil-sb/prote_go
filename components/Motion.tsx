"use client";

/*
  Shared entrance animations for the landing page.

  Everything animates `opacity` + a `transform` string, so Motion hands it to
  WAAPI (compositor, no JS per frame). One calm ease-out, no overshoot: it suits
  a hygiene brand that sells trust.

  Reduced motion: the hidden/visible styles stay identical (so SSR and hydration
  match), but the transform jumps instantly and only the fade remains.
*/

import { Fragment } from "react";
import { motion, stagger, useReducedMotion, type HTMLMotionProps, type Variants } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.8;

const TAGS = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
  figure: motion.figure,
  article: motion.article,
  form: motion.form,
  label: motion.label,
  dl: motion.dl,
  nav: motion.nav,
  tbody: motion.tbody,
  tr: motion.tr,
};
type Tag = keyof typeof TAGS;

/** from → to transforms for each effect (matching functions, so they interpolate cleanly) */
const EFFECTS = {
  rise: ["translateY(28px)", "translateY(0px)"],
  drop: ["translateY(-16px)", "translateY(0px)"],
  left: ["translateX(-32px)", "translateX(0px)"],
  right: ["translateX(32px)", "translateX(0px)"],
  zoom: ["scale(1.08)", "scale(1)"],
  pop: ["scale(0.6)", "scale(1)"],
  growY: ["scaleY(0)", "scaleY(1)"],
  growX: ["scaleX(0)", "scaleX(1)"],
  fade: ["translateY(0px)", "translateY(0px)"],
  mask: ["translateY(110%)", "translateY(0%)"],
} as const;
export type Effect = keyof typeof EFFECTS;

function variants(effect: Effect, reduce: boolean | null, delay = 0, duration = DURATION): Variants {
  const [from, to] = EFFECTS[effect];
  const grow = effect === "growX" || effect === "growY";
  return {
    hidden: { opacity: grow ? 1 : 0, transform: from },
    show: {
      opacity: 1,
      transform: to,
      transition: {
        duration,
        ease: EASE,
        delay,
        // reduced motion: no travel, just the fade
        ...(reduce ? { transform: { duration: 0 } } : {}),
      },
    },
  };
}

type Common = {
  as?: Tag;
  /** play on mount instead of when scrolled into view (above-the-fold content) */
  onMount?: boolean;
  /** fraction of the element that must be visible before it plays */
  amount?: number;
} & Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "whileInView" | "viewport">;

function trigger(onMount: boolean | undefined, amount: number) {
  return onMount ? { initial: "hidden", animate: "show" } : { initial: "hidden", whileInView: "show", viewport: { once: true, amount } };
}

/** A single element that animates in by itself. */
export function Reveal({
  as = "div",
  effect = "rise",
  delay = 0,
  duration,
  onMount,
  amount = 0.25,
  ...rest
}: Common & { effect?: Effect; delay?: number; duration?: number }) {
  const reduce = useReducedMotion();
  const Comp = TAGS[as] as typeof motion.div;
  return <Comp variants={variants(effect, reduce, delay, duration)} {...trigger(onMount, amount)} {...rest} />;
}

/** A group whose <Item> descendants animate in one after another. */
export function Stagger({ as = "div", gap = 0.08, delay = 0, onMount, amount = 0.15, ...rest }: Common & { gap?: number; delay?: number }) {
  const Comp = TAGS[as] as typeof motion.div;
  const group: Variants = {
    hidden: {},
    show: { transition: { delayChildren: stagger(gap, { startDelay: delay }) } },
  };
  return <Comp variants={group} {...trigger(onMount, amount)} {...rest} />;
}

/** A child of <Stagger>; plays when its turn comes. */
export function Item({
  as = "div",
  effect = "rise",
  duration,
  ...rest
}: Omit<HTMLMotionProps<"div">, "variants"> & { as?: Tag; effect?: Effect; duration?: number }) {
  const reduce = useReducedMotion();
  const Comp = TAGS[as] as typeof motion.div;
  return <Comp variants={variants(effect, reduce, 0, duration)} {...rest} />;
}

/** A headline whose words slide up out of a mask, one after another. */
export function Words({
  text,
  as = "h2",
  gap = 0.06,
  delay = 0,
  onMount,
  ...rest
}: Omit<Common, "children"> & { text: string; gap?: number; delay?: number }) {
  const words = text.split(" ");
  return (
    <Stagger as={as} gap={gap} delay={delay} onMount={onMount} amount={0.5} {...rest}>
      {words.map((w, i) => (
        <Fragment key={i}>
          {/* padding keeps descenders inside the mask */}
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
            <Item as="span" effect="mask" className="inline-block">
              {w}
            </Item>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Stagger>
  );
}
