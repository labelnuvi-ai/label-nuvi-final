"use client";

import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { PRODUCTS } from "@/lib/data/mockData";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link href="/account" className="inline-flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-semibold">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Account
      </Link>

      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block">
          CURATED SAVED ITEMS
        </span>
        <h1 className="text-3xl font-serif font-bold uppercase tracking-wider text-neutral-900">
          SAVED WISHLIST ({wishlistProducts.length})
        </h1>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl p-8 border border-neutral-200">
          <Heart className="w-12 h-12 text-neutral-300 mx-auto stroke-[1]" />
          <p className="text-xs uppercase tracking-widest text-neutral-500">Your wishlist is currently empty.</p>
          <Link href="/shop" className="inline-block bg-black text-white text-xs uppercase tracking-widest px-6 py-3 font-semibold rounded-xl">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
