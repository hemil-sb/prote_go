import PageHero from "@/components/site/PageHero";

export default function NotFound() {
  return (
    <PageHero
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/404", label: "Page not found" },
      ]}
      title="This page isn't here."
      lede="It may have moved, or the link may be out of date. Let's get you back on track."
      actions={[
        { href: "/", label: "Back to home" },
        { href: "/contact", label: "Contact us" },
      ]}
    />
  );
}
