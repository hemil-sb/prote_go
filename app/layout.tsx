import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CleanAnchors from "@/components/CleanAnchors";
import { CartProvider } from "@/components/cart/CartProvider";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

// Manrope, the brand typeface (variable weight 200–800). Subset to Latin plus the symbols the
// site uses (₹ ™ – × … → ▲) and packed as woff2: 24 KB instead of the 165 KB TTF in the brand pack.
// Rebuild from "ProteGo Brand Assets" with scripts/subset-font.py if the glyph set changes.
const manrope = localFont({
  src: "./fonts/Manrope-Latin-VariableFont_wght.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://protegohygiene.com"),
  title: {
    default: "ProteGo Hygiene | Surface protection that lasts up to 30 days",
    template: "%s | ProteGo Hygiene",
  },
  description:
    "Most disinfectants stop working once they dry. ProteGo Surface Protectant leaves an invisible antimicrobial layer that keeps protecting treated surfaces for up to 30 days, even as people touch them.",
  applicationName: "ProteGo Hygiene",
  openGraph: {
    title: "ProteGo Hygiene",
    description: "Disinfected is not the same as protected. Surface protection that keeps working for up to 30 days.",
    siteName: "ProteGo Hygiene",
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#004a5d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${manrope.variable} antialiased`}>
      <body className="min-h-dvh">
        <CartProvider>
          <a
            href="#main"
            className="sr-only z-[70] rounded-full bg-turquoise px-4 py-2 font-semibold text-sherpa-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="bg-spring">
            {children}
          </main>
          <SiteFooter />
        </CartProvider>
        <CleanAnchors />
      </body>
    </html>
  );
}
