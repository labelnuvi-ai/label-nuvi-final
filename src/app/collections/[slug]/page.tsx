"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { RefreshCw } from "lucide-react";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = use(params);
  const { products, collections, loading } = useProducts();

  const collection = useMemo(() => {
    return collections.find((c) => c.slug === slug);
  }, [collections, slug]);

  const collectionProducts = useMemo(() => {
    if (!collection) return [];
    return products.filter((p) => p.collectionId === collection.id);
  }, [products, collection]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
        <p className="text-[10px] font-label uppercase tracking-widest text-[#706C66]">
          Loading lookbook collection...
        </p>
      </div>
    );
  }

  if (!collection) {
    notFound();
  }

  return (
    <div className="py-20 max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
      {/* Editorial Collection Header */}
      <div className="text-center space-y-4">
        <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#706C66] font-semibold block">
          RUNWAY EDITORIAL
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#1A1A1A]">
          {collection.title}
        </h1>
        <p className="text-xs text-[#706C66] font-sans font-light max-w-lg mx-auto leading-relaxed uppercase tracking-wider">
          {collection.description}
        </p>
      </div>

      <div className="border-t border-neutral-200/60 pt-10">
        {collectionProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-xs font-label uppercase tracking-[0.2em] text-[#706C66]">
              No pieces are currently active in this collection drop.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
