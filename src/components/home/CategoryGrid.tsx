"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data/mockData";

export function CategoryGrid() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200/60 pb-6">
        <div>
          <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#706C66] font-semibold block">
            ATELIER CATEGORIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#1A1A1A] mt-1">
            SHOP BY SILHOUETTE
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-label uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C8A46B] font-semibold flex items-center space-x-1 mt-4 md:mt-0 transition-colors"
        >
          <span>EXPLORE ALL CATEGORIES ({CATEGORIES.length})</span>
          <ArrowUpRight className="w-4 h-4 stroke-[1.2]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/categories/${cat.slug}`}
              className="group relative block aspect-[3/4] rounded-[20px] overflow-hidden shadow-luxury-xs bg-[#FAF8F5]"
            >
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-[#FAF8F5] space-y-2">
                <span className="text-[9px] font-label uppercase tracking-[0.3em] text-[#C8A46B] font-semibold">
                  {cat.itemCount} PIECES
                </span>
                <h3 className="text-xl font-serif-luxury font-light uppercase tracking-wider group-hover:text-[#C8A46B] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-sans text-neutral-300 line-clamp-2 font-light">
                  {cat.description}
                </p>

                <div className="pt-2 flex items-center space-x-1 text-[10px] font-label uppercase tracking-[0.2em] text-[#FAF8F5] font-semibold group-hover:translate-x-1 transition-transform">
                  <span>DISCOVER</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.2]" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
