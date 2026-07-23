"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Star,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { PRODUCTS } from "@/lib/data/mockData";
import { ProductSize, ProductColor } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useQuickViewStore } from "@/store/useQuickViewStore";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = use(params);

  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<ProductSize>("S");
  const [activeAccordion, setActiveAccordion] = useState<string | null>("fabric");
  const [addedSuccess, setAddedSuccess] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const openSizeGuide = useQuickViewStore((s) => s.openSizeGuide);

  const isLiked = isInWishlist(product.id);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedSize, 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion((prev) => (prev === section ? null : section));
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-6 lg:px-12 space-y-32">
      {/* 1. Breadcrumb navigation */}
      <nav className="text-[10px] font-label uppercase tracking-[0.3em] text-[#706C66] space-x-2">
        <Link href="/" className="hover:text-black transition-colors">Atelier</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-[#1a1a1a] font-semibold">{product.categoryName}</span>
      </nav>

      {/* 2. Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Giant Vertical Gallery (Campaign Lookbook Style) */}
        <div className="lg:col-span-7 space-y-8">
          {product.images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] w-full rounded-[28px] overflow-hidden bg-[#FAF8F5] shadow-luxury-xs group cursor-zoom-in"
            >
              <Image
                src={img}
                alt={`${product.name} editorial look ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
              />
            </motion.div>
          ))}
        </div>

        {/* Right Column: Sticky Purchase Panel */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
          
          {/* Header Info */}
          <div className="space-y-4">
            <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block">
              {product.categoryName}
            </span>
            
            <h1 className="text-4xl sm:text-5xl font-serif-luxury font-light uppercase tracking-wider text-[#1a1a1a] leading-none">
              {product.name}
            </h1>
            
            <p className="text-xs font-sans tracking-[0.2em] uppercase text-[#706C66] font-light">
              {product.subtitle}
            </p>

            <div className="text-2xl font-serif-luxury font-light text-[#1A1A1A] pt-2">
              ${(product.salePrice || product.price).toFixed(2)}
              {product.salePrice && (
                <span className="text-sm text-neutral-400 line-through font-sans ml-2">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light border-t border-neutral-200/50 pt-5">
            {product.description}
          </p>

          {/* Model Specification Banner */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-neutral-200/40 flex items-center space-x-3 text-[10px] font-label uppercase tracking-widest text-[#706C66]">
            <span className="w-2 h-2 rounded-full bg-[#C8A46B]" />
            <span>MODEL IS 5'10" / 178CM WEARING SIZE S</span>
          </div>

          {/* Color swatches */}
          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-[0.2em] text-[#1A1A1A] block">
              COLOR: <span className="font-bold">{selectedColor.name}</span>
            </label>
            <div className="flex items-center space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform ${
                    selectedColor.name === color.name
                      ? "border-[#1A1A1A] scale-105"
                      : "border-neutral-200 hover:border-black"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor.name === color.name && (
                    <span className={`w-1.5 h-1.5 rounded-full ${color.hex === "#FAF8F5" ? "bg-black" : "bg-white"}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector with Size Guide */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-label">
              <span className="uppercase tracking-[0.2em] text-[#1A1A1A]">
                SELECT SIZE: <span className="font-bold">{selectedSize}</span>
              </span>
              <button
                onClick={openSizeGuide}
                className="text-[#706C66] hover:text-black underline uppercase tracking-wider text-[10px] flex items-center space-x-1"
              >
                <Ruler className="w-3.5 h-3.5 stroke-[1.2]" />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3.5 text-xs font-label font-medium rounded-full border transition-all duration-300 ${
                    selectedSize === size
                      ? "bg-[#1A1A1A] text-[#FAF8F5] border-[#1A1A1A]"
                      : "bg-white text-black border-neutral-200 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Checkout CTAs */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#1A1A1A] text-[#FAF8F5] text-xs font-label uppercase tracking-[0.2em] py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-all duration-500 shadow-luxury-md transform hover:-translate-y-0.5"
            >
              {addedSuccess ? (
                <span className="flex items-center justify-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>ADDED TO BAG</span>
                </span>
              ) : (
                <span>ADD TO BAG</span>
              )}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-[#1A1A1A] hover:border-black transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-[#1A1A1A]" : ""}`} />
            </button>
          </div>

          {/* Accordion Panels for Fabric, Wash Care, Shipping & Returns */}
          <div className="border-t border-neutral-200/60 pt-4 space-y-3">
            
            {/* Fabric Composition */}
            <div className="border-b border-neutral-200/60 pb-3">
              <button
                onClick={() => toggleAccordion("fabric")}
                className="w-full flex justify-between items-center text-xs font-label uppercase tracking-widest text-[#1a1a1a] font-medium"
              >
                <span>Fabric & Composition</span>
                <span>{activeAccordion === "fabric" ? "-" : "+"}</span>
              </button>
              {activeAccordion === "fabric" && (
                <p className="mt-2 text-xs text-[#706C66] font-sans font-light leading-relaxed">
                  Mulberry silk, woven in Italy. Heavyweight 30mm double-faced weave guarantees opaque liquid draping with zero static.
                </p>
              )}
            </div>

            {/* Wash Care */}
            <div className="border-b border-neutral-200/60 pb-3">
              <button
                onClick={() => toggleAccordion("care")}
                className="w-full flex justify-between items-center text-xs font-label uppercase tracking-widest text-[#1a1a1a] font-medium"
              >
                <span>Wash & Care</span>
                <span>{activeAccordion === "care" ? "-" : "+"}</span>
              </button>
              {activeAccordion === "care" && (
                <ul className="mt-2 list-disc list-inside text-xs text-[#706C66] font-sans font-light space-y-1">
                  <li>Dry clean only</li>
                  <li>Cool iron on reverse side with barrier cloth</li>
                  <li>Do not tumble dry or wring</li>
                </ul>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="border-b border-neutral-200/60 pb-3">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full flex justify-between items-center text-xs font-label uppercase tracking-widest text-[#1a1a1a] font-medium"
              >
                <span>Shipping & Returns</span>
                <span>{activeAccordion === "shipping" ? "-" : "+"}</span>
              </button>
              {activeAccordion === "shipping" && (
                <p className="mt-2 text-xs text-[#706C66] font-sans font-light leading-relaxed">
                  Complimentary worldwide express shipping on orders over $300. Easy global return portal with 30-day coverage.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 3. Sticky Add to Cart Bottom Bar (Mobile View) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200 p-4 lg:hidden flex items-center justify-between shadow-2xl">
        <div>
          <h4 className="text-xs font-serif-luxury font-bold text-[#1A1A1A] line-clamp-1">{product.name}</h4>
          <span className="text-xs font-label font-bold text-[#1A1A1A]">
            ${(product.salePrice || product.price).toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-[#1A1A1A] text-white text-[10px] font-label uppercase tracking-widest px-6 py-3 font-semibold rounded-full flex items-center space-x-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5 stroke-[1.2]" />
          <span>ADD TO BAG</span>
        </button>
      </div>

      {/* 4. Complete the look recommendations */}
      <section className="pt-20 border-t border-neutral-200/60 space-y-8">
        <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#706C66] font-semibold block text-center">
          CURATED COMBINATIONS
        </span>
        <h3 className="text-3xl font-serif-luxury font-light uppercase tracking-wider text-center text-[#1A1A1A]">
          COMPLETE THE LOOK
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>

      {/* 5. Editorial Reviews */}
      <section className="pt-20 border-t border-neutral-200/60 space-y-12">
        <h3 className="text-3xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#1A1A1A]">
          CLIENT FEEDBACK ({product.reviewsCount})
        </h3>
        
        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-8 rounded-[20px] border border-neutral-200/60 shadow-luxury-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex text-[#C8A46B]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C8A46B] stroke-none" />
                    ))}
                  </div>
                  <span className="text-[10px] font-label text-neutral-400">{rev.date}</span>
                </div>
                <h4 className="text-xs font-label uppercase font-bold text-[#1A1A1A]">{rev.title}</h4>
                <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">"{rev.comment}"</p>
                <div className="text-[10px] font-label uppercase tracking-wider font-semibold text-neutral-400 pt-3 border-t border-neutral-100">
                  {rev.userName} • Verified Purchase
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#706C66]">No reviews submitted yet for this couture piece.</p>
        )}
      </section>
    </div>
  );
}
