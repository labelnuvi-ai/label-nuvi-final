"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/lib/data/mockData";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useQuickViewStore } from "@/store/useQuickViewStore";

export default function HomePage() {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const openQuickView = useQuickViewStore((s) => s.openQuickView);

  // Active slide state for the Joggers Campaign Carousel
  const [[joggerSlide, direction], setJoggerSlide] = useState([0, 0]);

  const joggersImages = [
    "/images/editorial-banner.jpg",
    "/images/hero-portrait.jpg",
    "/images/category-dresses.jpg",
  ];

  const handleNextJogger = () => {
    setJoggerSlide(([prev]) => [(prev + 1) % joggersImages.length, 1]);
  };

  const handlePrevJogger = () => {
    setJoggerSlide(([prev]) => [(prev - 1 + joggersImages.length) % joggersImages.length, -1]);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Campaign Banner (Screenshot 5 Style) */}
      <section className="relative w-full h-[85vh] min-h-[500px] bg-neutral-900 overflow-hidden">
        <Image
          src="/images/hero-portrait.jpg"
          alt="UNI Couple Campaign"
          fill
          priority
          className="object-cover object-center brightness-90"
        />
        <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />

        {/* Floating Campaign Headline & CTA */}
        <div className="absolute bottom-16 left-6 sm:left-12 text-white space-y-4">
          <h1 className="text-3xl sm:text-5xl font-serif-luxury tracking-wider uppercase">
            THE ATELIER SUIT
          </h1>
          <Link
            href="/shop"
            className="inline-block bg-[#1A1A1A] hover:bg-[#C8A46B] text-white text-[11px] font-label uppercase tracking-widest px-8 py-3.5 transition-all duration-300 shadow-lg"
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* 2. Latest Drop Section (Screenshot 5 Style) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
        <div className="flex justify-between items-end border-b border-neutral-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-serif-luxury tracking-wide text-black uppercase font-medium">
            LATEST DROP
          </h2>
          <Link
            href="/shop"
            className="text-[10px] font-label uppercase tracking-wider text-black border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 transition-colors shrink-0"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PRODUCTS.slice(0, 4).map((product) => {
            const isLiked = isInWishlist(product.id);
            return (
              <div key={product.id} className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-neutral-200/40">
                <div className="relative aspect-[4/5] bg-[#FAF8F5] overflow-hidden">
                  <Link href={`/product/${product.slug}`}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-black"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-black" : ""}`} />
                  </button>
                </div>
                <div className="p-3 flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <Link href={`/product/${product.slug}`} className="block truncate text-xs font-bold uppercase text-black tracking-wide">
                      {product.name}
                    </Link>
                    <span className="text-[11px] font-label font-semibold text-neutral-800 block mt-0.5">
                      ${(product.salePrice || product.price).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => addItem(product, product.colors[0], "S", 1)}
                    className="p-1 text-neutral-700 hover:text-black"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Joggers Campaign Slider (Screenshot 3 Style) */}
      <section className="max-w-xl mx-auto px-6 space-y-6">
        <div className="flex justify-between items-end border-b border-neutral-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-serif-luxury tracking-wide text-black uppercase font-medium">
            ATELIER JOGGERS
          </h2>
        </div>

        <div className="relative aspect-[4/5] bg-neutral-100 rounded-lg overflow-hidden shadow-md">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={joggerSlide}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? "100%" : "-100%",
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (dir: number) => ({
                  x: dir < 0 ? "100%" : "-100%",
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={joggersImages[joggerSlide]}
                alt="Joggers Campaign"
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Controls */}
        <div className="flex items-center justify-center space-x-6 text-xs font-label">
          <button onClick={handlePrevJogger} className="p-1 hover:text-neutral-500">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span>
            {joggerSlide + 1} / {joggersImages.length}
          </span>
          <button onClick={handleNextJogger} className="p-1 hover:text-neutral-500">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/shop"
            className="inline-block bg-[#1A1A1A] hover:bg-neutral-800 text-white text-[11px] font-label uppercase tracking-widest px-10 py-3.5 rounded-none"
          >
            View all
          </Link>
        </div>
      </section>

      {/* 4. Video Reels Preview Grid (Screenshot 4 Style) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
        <div className="flex justify-between items-end border-b border-neutral-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-serif-luxury tracking-wide text-black uppercase font-medium">
            CAMPAIGN CONTEXT
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="relative aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden group">
            <Image
              src="/images/product-dress-front.jpg"
              alt="Runway Reel 1"
              fill
              className="object-cover brightness-95 group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-[10px] font-label uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded">
                COUTURE SHOTS
              </span>
            </div>
          </div>
          <div className="relative aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden group">
            <Image
              src="/images/product-suit-front.jpg"
              alt="Runway Reel 2"
              fill
              className="object-cover brightness-95 group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-[10px] font-label uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded">
                RUNWAY BACKSTAGE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Duo Drop / Ombres (Screenshot 4 Style - Product Card Add To Cart Bar) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
        <div className="flex justify-between items-end border-b border-neutral-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-serif-luxury tracking-wide text-black uppercase font-medium">
            OMBRES COLLECTION
          </h2>
          <Link
            href="/shop"
            className="text-[10px] font-label uppercase tracking-wider text-black border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 transition-colors shrink-0"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.slice(2, 4).map((product) => {
            const isLiked = isInWishlist(product.id);
            return (
              <div key={product.id} className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-neutral-200/40">
                <div className="relative aspect-[4/5] bg-[#FAF8F5] overflow-hidden">
                  <Link href={`/product/${product.slug}`}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-black"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-black" : ""}`} />
                  </button>
                </div>
                <div className="p-3 pb-0 space-y-1">
                  <Link href={`/product/${product.slug}`} className="block truncate text-xs font-bold uppercase text-black tracking-wide">
                    {product.name}
                  </Link>
                  <span className="text-[11px] font-label font-semibold text-neutral-800 block">
                    ${(product.salePrice || product.price).toFixed(2)}
                  </span>
                </div>
                {/* Athmania style bottom add to cart bar */}
                <div className="p-3 pt-2">
                  <button
                    onClick={() => addItem(product, product.colors[0], "S", 1)}
                    className="w-full bg-[#1A1A1A] hover:bg-[#C8A46B] text-white text-[9px] font-label uppercase tracking-widest py-2.5 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
