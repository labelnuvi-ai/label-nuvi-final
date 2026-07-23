import type { Metadata } from "next";
import { Syncopate, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { CartDrawer } from "@/components/common/CartDrawer";
import { SearchModal } from "@/components/common/SearchModal";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-syncopate",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LABEL NUVI | Haute Couture & High Fashion Atelier",
  description:
    "Explore LABEL NUVI Atelier Paris & New York. Refined haute couture evening gowns, tailored power suiting, sculpt bodysuits, and cashmere outerwear engineered for modern luxury icons.",
  keywords: [
    "LABEL NUVI",
    "LABEL NUVI Fashion",
    "Haute Couture",
    "Luxury Women's Atelier",
    "Syncopate Luxury",
    "Paris Fashion Week",
    "Minimalist Luxury",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syncopate.variable} ${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-[#FAF8F5] text-[#1A1A1A] font-sans antialiased selection:bg-[#1A1A1A] selection:text-[#FAF8F5] min-h-screen flex flex-col justify-between overflow-x-hidden">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <SearchModal />
        <QuickViewModal />
        <SizeGuideModal />
      </body>
    </html>
  );
}
