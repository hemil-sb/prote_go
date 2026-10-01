import type { MetadataRoute } from "next";
import { INDUSTRIES } from "@/content/industries";
import { PRODUCTS } from "@/content/products";

const BASE = "https://protegohygiene.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/how-it-works", "/products", "/services", "/hospital-to-home", "/industries", "/about", "/contact", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${BASE}/products/${p.slug}`, priority: 0.7 })),
    ...INDUSTRIES.map((i) => ({ url: `${BASE}/industries/${i.slug}`, priority: 0.7 })),
  ];
}
