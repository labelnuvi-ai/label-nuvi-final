"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { CMS_HERO_DATA } from "@/lib/data/mockData";

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
          src={CMS_HERO_DATA.backgroundImage}
          alt="LABEL NUVI Atelier Couture Hero"
          fill
          priority
          className="object-cover object-center brightness-75"
        />
      </motion.div>

      {/* Subtle Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-[#1A1A1A]/30" />

      {/* Hero Content Box - Single High-Impact Focal Point */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-[#FAF8F5] space-y-6">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-label uppercase tracking-[0.4em] text-[#C8A46B] font-medium block"
        >
          {CMS_HERO_DATA.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-serif-luxury font-light tracking-[0.1em] uppercase text-[#FAF8F5] leading-none"
        >
          {CMS_HERO_DATA.title}
        </motion.h1>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pt-6"
        >
          <Link
            href={CMS_HERO_DATA.ctaLink}
            className="inline-block bg-[#FAF8F5] text-[#1A1A1A] text-[11px] font-label uppercase tracking-[0.3em] px-10 py-4 font-medium hover:bg-[#C8A46B] hover:text-white transition-all duration-700 rounded-full shadow-luxury-md transform hover:-translate-y-0.5"
          >
            {CMS_HERO_DATA.ctaText}
          </Link>
        </motion.div>
      </div>

      {/* Down Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-[#FAF8F5]/50 hover:text-[#FAF8F5] cursor-pointer"
      >
        <ArrowDown className="w-4 h-4 stroke-[1]" />
      </motion.div>
    </section>
  );
}
