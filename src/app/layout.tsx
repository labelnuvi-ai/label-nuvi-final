import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cinzel, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { CartDrawer } from "@/components/common/CartDrawer";
import { SearchModal } from "@/components/common/SearchModal";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-luxury",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://labelnuvi.com";

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LABEL NUVI | Haute Couture & High Fashion Atelier",
    template: "%s | LABEL NUVI Atelier",
  },
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
  authors: [{ name: "LABEL NUVI Atelier" }],
  creator: "LABEL NUVI",
  publisher: "LABEL NUVI Haute Couture",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "LABEL NUVI | Haute Couture & High Fashion Atelier",
    description:
      "Refined haute couture evening gowns, tailored power suiting, sculpt bodysuits, and cashmere outerwear engineered for modern luxury icons.",
    url: siteUrl,
    siteName: "LABEL NUVI",
    images: [
      {
        url: "/images/hero-portrait.jpg",
        width: 1200,
        height: 630,
        alt: "LABEL NUVI Haute Couture Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LABEL NUVI | Haute Couture & High Fashion Atelier",
    description:
      "Refined haute couture evening gowns, tailored power suiting, sculpt bodysuits, and cashmere outerwear.",
    images: ["/images/hero-portrait.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LABEL NUVI",
    url: siteUrl,
    logo: `${siteUrl}/images/hero-portrait.jpg`,
    sameAs: [
      "https://instagram.com/labelnuvi",
      "https://pinterest.com/labelnuvi",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-212-555-0198",
      contactType: "customer service",
      email: "concierge@labelnuvi.com",
    },
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LABEL NUVI",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cinzel.variable} ${outfit.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="bg-[#FAF8F5] text-[#1A1A1A] font-sans antialiased selection:bg-[#1A1A1A] selection:text-[#FAF8F5] min-h-screen flex flex-col justify-between overflow-x-hidden">
        <Header />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <SearchModal />
        <QuickViewModal />
        <SizeGuideModal />
      </body>
    </html>
  );
}
