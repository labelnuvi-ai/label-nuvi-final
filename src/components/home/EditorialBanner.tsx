"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function EditorialBanner() {
  return (
    <section className="my-24 max-w-7xl mx-auto px-6 lg:px-12">
      <div className="relative rounded-[28px] overflow-hidden bg-[#1A1A1A] min-h-[480px] flex items-center justify-between shadow-luxury-lg">
        <Image
          src="/images/editorial-banner.jpg"
          alt="Paris Fashion Week Editorial"
          fill
          className="object-cover object-center brightness-70 opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/50 to-transparent" />

        <div className="relative z-10 p-10 sm:p-16 max-w-xl text-[#FAF8F5] space-y-6">
          <div className="inline-flex items-center space-x-2 bg-[#C8A46B]/20 border border-[#C8A46B]/40 text-[#C8A46B] text-[10px] font-label uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3 text-[#C8A46B]" />
            <span>FASHION WEEK SPOTLIGHT</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-serif-luxury font-light tracking-[0.08em] uppercase leading-none">
            THE OBSIDIAN ARCHITECTURE
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans font-light tracking-wide">
            Crafted for the modern icon. Hand-turned seams, 30mm Italian heavy silk satins, and sculpted waist silhouettes engineered in our Paris atelier.
          </p>

          <Link
            href="/collections/atelier-drop-26"
            className="inline-flex items-center space-x-3 bg-[#FAF8F5] text-[#1A1A1A] text-xs font-label uppercase tracking-[0.25em] px-8 py-4 font-medium hover:bg-[#C8A46B] hover:text-white transition-all duration-500 rounded-full shadow-luxury-md transform hover:-translate-y-0.5"
          >
            <span>SHOP THE EDITORIAL</span>
            <ArrowRight className="w-4 h-4 stroke-[1.2]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
