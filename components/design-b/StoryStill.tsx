/* eslint-disable @next/next/no-img-element -- data-URL stills rendered on the client can't go through next/image */

/*
  One frame of the story for readers without the scroll animation: a still rendered
  from the 3D scene (reduced motion) or the exported poster (no WebGL). With neither,
  it falls back to the brand "+" pattern so the layout never has a hole.
*/
export default function StoryStill({ src, alt }: { src?: string; alt: string }) {
  return (
    <figure className="m-0 overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_45%,#0e4a59_0%,#004a5d_40%,#0d2c33_85%)]">
      {src ? (
        <img src={src} alt={alt} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div role="img" aria-label={alt} className="plus-field aspect-[4/3] w-full" data-tone="dark" data-fade="br" />
      )}
    </figure>
  );
}
