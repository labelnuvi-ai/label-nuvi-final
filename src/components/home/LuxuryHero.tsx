"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HERO_DATA = {
  title: "ATELIER DROP '26",
  badge: "ATELIER COUTURE • SPRING/SUMMER",
  backgroundImage: "/images/hero-portrait.jpg",
  ctaText: "DISCOVER COLLECTION",
  ctaLink: "/shop",
};

export function LuxuryHero() {
  return (
    <section className="relative w-full h-[92vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
      {/* Background Photography with Slow Motion Scale */}
      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1.01 }}
        transition={{ duration: 14, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={HERO_DATA.backgroundImage}
          alt="LABEL NUVI Atelier Couture Hero"
          fill
          priority
          className="object-cover object-center brightness-75"
        />
      </motion.div>

      {/* Subtle Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-[#1A1A1A]/30" />

      {/* Hero Content Box - Single High-Impact Focal Point */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-[#FAF8F5] space-y-4 sm:space-y-6">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[9px] sm:text-[10px] font-label uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#C8A46B] font-medium block"
        >
          {HERO_DATA.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-7xl lg:text-8xl font-serif-luxury font-light tracking-[0.06em] sm:tracking-[0.1em] uppercase text-[#FAF8F5] leading-tight sm:leading-none"
        >
          {HERO_DATA.title}
        </motion.h1>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4 sm:pt-6"
        >
          <Link
            href={HERO_DATA.ctaLink}
            className="inline-block bg-[#FAF8F5] text-[#1A1A1A] text-[10px] sm:text-[11px] font-label uppercase tracking-[0.2em] sm:tracking-[0.3em] px-6 sm:px-10 py-3 sm:py-4 font-medium hover:bg-[#C8A46B] hover:text-white transition-all duration-700 rounded-full shadow-luxury-md transform hover:-translate-y-0.5"
          >
            {HERO_DATA.ctaText}
          </Link>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-label uppercase tracking-[0.3em] text-[#FAF8F5]">SCROLL</span>
        <ArrowDown className="w-4 h-4 text-[#FAF8F5] animate-bounce stroke-[1.2]" />
      </div>
    </section>
  );
}
