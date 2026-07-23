"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center space-y-4">
        <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block">
          PARIS & NEW YORK ATELIER
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold uppercase tracking-wider text-neutral-900">
          THE LABEL NUVI PHILOSOPHY
        </h1>
        <p className="text-sm text-neutral-500 font-sans max-w-xl mx-auto leading-relaxed">
          Architectural precision meets sensual silk satins. LABEL NUVI was founded to redefine high-end women's fashion through modern, uncompromising luxury craftsmanship.
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl">
        <Image src="/images/editorial-banner.jpg" alt="LABEL NUVI Atelier Paris Runway" fill className="object-cover" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-xs text-neutral-600 leading-relaxed font-sans">
        <div className="space-y-4">
          <h3 className="text-base font-serif font-bold text-neutral-900 uppercase tracking-wider">
            Couture Craftsmanship
          </h3>
          <p>
            Every silhouette in our collection is hand-draped on custom forms in our Paris atelier. We source exclusively 30mm heavy Mulberry silk satins, Italian washed flax linen, and double-faced virgin cashmere.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-base font-serif font-bold text-neutral-900 uppercase tracking-wider">
            Uncompromising Excellence
          </h3>
          <p>
            LABEL NUVI bridges the space between high fashion week runway design and wearable power silhouettes. Designed to empower confidence, elegance, and sensual luxury for women across the globe.
          </p>
        </div>
      </div>
    </div>
  );
}
