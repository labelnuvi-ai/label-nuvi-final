"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useQuickViewStore } from "@/store/useQuickViewStore";
import { useProducts } from "@/hooks/useProducts";

export default function HomePage() {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const openQuickView = useQuickViewStore((s) => s.openQuickView);
  const { products } = useProducts();

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

  const sliderVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Campaign Banner */}
      <section className="relative w-full h-[85vh] min-h-[500px] bg-neutral-900 overflow-hidden">
        <Image
          src="/images/hero-portrait.jpg"
          alt="LABEL NUVI Couple Campaign"
          fill
          priority
          className="object-cover object-center brightness-90"
        />
        <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />

        {/* Floating Campaign Headline & CTA */}
        <div className="absolute bottom-16 left-6 sm:left-12 text-white space-y-4">
          <h1 className="text-3xl sm:text-5xl font-serif-luxury tracking-wider uppercase">
            ATELIER DROP &apos;26
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#E6D5C3]">
            Runway drops engineered for raw confidence.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-black text-xs font-label uppercase tracking-widest px-8 py-4 font-semibold hover:bg-[#C8A46B] hover:text-white transition-all shadow-lg rounded-full"
          >
            DISCOVER CATALOGUE
          </Link>
        </div>
      </section>

      {/* 2. Latest Drop Section */}
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
          {products.slice(0, 4).map((product) => {
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
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => openQuickView(product)}
                      className="p-3 bg-white rounded-full text-black hover:bg-neutral-100 shadow-lg"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => addItem(product, product.colors[0], "S", 1)}
                      className="p-3 bg-white rounded-full text-black hover:bg-neutral-100 shadow-lg"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3.5 bg-white space-y-1">
                  <span className="text-[9px] text-[#C8A46B] uppercase font-semibold">{product.categoryName}</span>
                  <Link href={`/product/${product.slug}`} className="block text-xs font-bold uppercase truncate tracking-wide text-neutral-800 hover:text-black">
                    {product.name}
                  </Link>
                  <div className="text-xs font-semibold text-neutral-900">₹{(product.salePrice || product.price).toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Infinite Joggers Campaign Slider */}
      <section className="bg-[#1A1A1A] py-20 text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-label text-[#C8A46B] uppercase tracking-[0.25em] font-semibold block">
              COUTURE COMFORT &bull; RESORT 26
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif-luxury font-light uppercase tracking-wider leading-none">
              THE SILK JOGGER
            </h2>
            <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed max-w-sm">
              Tailored comfort. Fluid mulberry silk satins drape into structured ribbed cuffs, bridging raw activewear elements with high luxury craftsmanship.
            </p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handlePrevJogger}
                className="w-10 h-10 border border-neutral-600 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextJogger}
                className="w-10 h-10 border border-neutral-600 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 relative aspect-[16/10] bg-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={joggerSlide}
                custom={direction}
                variants={sliderVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 } as const, opacity: { duration: 0.2 } }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={joggersImages[joggerSlide]}
                  alt="Silk Joggers Lookbook Campaign"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. Secondary Feature Story Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        {products.slice(2, 4).map((product) => {
          const isLiked = isInWishlist(product.id);
          return (
            <div key={product.id} className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200/50">
              <div className="relative aspect-[16/10] bg-[#FAF8F5] overflow-hidden">
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-black"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-black" : ""}`} />
                </button>
              </div>
              <div className="p-6 bg-white space-y-2">
                <span className="text-[9px] text-[#C8A46B] uppercase font-semibold">{product.categoryName}</span>
                <Link href={`/product/${product.slug}`} className="block text-lg font-serif-luxury font-medium uppercase truncate tracking-wide text-neutral-800 hover:text-black">
                  {product.name}
                </Link>
                <p className="text-xs text-neutral-500 line-clamp-2">{product.subtitle}</p>
                <div className="text-sm font-bold text-neutral-900 pt-2">₹{(product.salePrice || product.price).toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
