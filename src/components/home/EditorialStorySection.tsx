"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LUXURY_EASE } from "@/lib/utils/motion";

export function EditorialStorySection() {
  return (
    <section className="py-32 bg-[#FAF8F5] overflow-hidden border-t border-b border-neutral-200/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Quote */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: LUXURY_EASE }}
          className="lg:col-span-6 space-y-8"
        >
          <span className="text-[10px] font-label uppercase tracking-[0.4em] text-[#C8A46B] font-semibold block">
            ATELIER CAMPAIGN
          </span>

          <h2 className="text-4xl sm:text-6xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#1A1A1A] leading-[1.02]">
            "ARCHITECTURE IN SILK & CASHMERE."
          </h2>

          <p className="text-xs sm:text-sm text-[#706C66] font-sans leading-relaxed font-light tracking-wide max-w-md">
            Heavy 30mm Mulberry silk satin and double-faced virgin wool. Engineered in Paris to bridge runway drama with everyday authority.
          </p>

          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center space-x-3 bg-[#1A1A1A] text-[#FAF8F5] text-[11px] font-label uppercase tracking-[0.25em] px-8 py-4 font-medium hover:bg-[#C8A46B] transition-all duration-700 rounded-full shadow-luxury-md transform hover:-translate-y-0.5"
            >
              <span>DISCOVER THE ATELIER</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.2]" />
            </Link>
          </div>
        </motion.div>

        {/* Right Large Photography Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: LUXURY_EASE }}
          className="lg:col-span-6 relative aspect-[4/5] w-full rounded-[24px] overflow-hidden shadow-luxury-lg bg-neutral-900"
        >
          <Image
            src="/images/hero-portrait.jpg"
            alt="LABEL NUVI Atelier Couture Craftsmanship"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
