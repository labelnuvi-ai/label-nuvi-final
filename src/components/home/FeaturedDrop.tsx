"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/lib/data/mockData";

interface FeaturedDropProps {
  title: string;
  subtitle?: string;
  categoryFilter?: string;
  viewAllLink?: string;
}

export function FeaturedDrop({
  title = "NEW DROPS",
  subtitle = "AUTUMN / WINTER '26 ATELIER",
  categoryFilter,
  viewAllLink = "/shop",
}: FeaturedDropProps) {
  const filtered = categoryFilter
    ? PRODUCTS.filter((p) => p.categoryId === categoryFilter)
    : PRODUCTS;

  return (
    <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
      <div className="flex items-end justify-between border-b border-neutral-200/60 pb-5">
        <div>
          {subtitle && (
            <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#706C66] font-semibold block">
              {subtitle}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#1A1A1A] mt-0.5">
            {title}
          </h2>
        </div>
        <Link
          href={viewAllLink}
          className="text-xs font-label uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C8A46B] font-semibold flex items-center space-x-1 transition-colors"
        >
          <span>VIEW COLLECTION</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.2]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
