import { Fragment, type ElementType } from "react";

/*
  A heading whose words sit in their own clipping masks, so GSAP can raise them
  into view (see `reveal` in ./gsap). Without JavaScript it is a plain heading.
*/
export default function Split({
  text,
  as: Tag = "h2",
  className,
  id,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const words = text.split(" ");
  return (
    <Tag id={id} className={className} data-split="">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-word="" className="inline-block">
              {w}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
