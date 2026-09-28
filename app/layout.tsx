import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CleanAnchors from "@/components/CleanAnchors";
import DesignSwitcher from "@/components/DesignSwitcher";

// Manrope, the brand typeface, from the brand asset pack (variable weight 200–800)
const manrope = localFont({
  src: "./fonts/Manrope-VariableFont_wght.ttf",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProteGo Hygiene | Surface protection that lasts up to 30 days",
  description:
    "Most disinfectants stop working once they dry. ProteGo Surface Protectant leaves an invisible antimicrobial layer that keeps protecting treated surfaces for up to 30 days, even as people touch them.",
  applicationName: "ProteGo Hygiene",
  openGraph: {
    title: "ProteGo Hygiene",
    description:
      "Disinfected is not the same as protected. Surface protection that keeps working for up to 30 days.",
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
        {children}
        <CleanAnchors />
        <DesignSwitcher />
      </body>
    </html>
  );
}
