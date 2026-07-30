"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProductSize, ProductColor } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useQuickViewStore } from "@/store/useQuickViewStore";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { products, loading } = useProducts();

  const product = products.find((p) => p.slug === slug);

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("fabric");
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const openSizeGuide = useQuickViewStore((s) => s.openSizeGuide);

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center text-xs font-label uppercase tracking-widest text-[#706C66]">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
        <span>Loading Haute Couture Silhouette...</span>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const isLiked = isInWishlist(product.id);
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    if (selectedColor) {
      setSizeError(false);
      addItem(product, selectedColor, selectedSize, 1);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const currentSelectionColor = selectedColor || product.colors[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Product JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: [product.imageUrl, ...(product.images || [])],
            description: product.description,
            sku: product.id,
            brand: {
              "@type": "Brand",
              name: "LABEL NUVI",
            },
            offers: {
              "@type": "Offer",
              url: `https://labelnuvi.com/product/${product.slug}`,
              priceCurrency: "INR",
              price: product.salePrice || product.price,
              availability: product.isSoldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            },
          }),
        }}
      />
      {/* 2-Column Luxury Lookbook Split View */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Vertical Image Gallery Lookbook Stack (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center space-x-2 text-[10px] font-label text-neutral-400 uppercase tracking-widest pb-2">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-black">Shop</Link>
            <span>/</span>
            <span className="text-black font-semibold truncate max-w-[200px]">{product.name}</span>
          </div>

          {(() => {
            const galleryImages = (product.images && product.images.length > 0) ? product.images : [product.imageUrl];
            return (
              <div className="space-y-4">
                {/* Main Hero Viewport with Animated Transitions & Chevron Controls */}
                <div className="relative aspect-[4/5] w-full rounded-[24px] overflow-hidden bg-neutral-100 shadow-luxury-xs border border-neutral-200/20 group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImageIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={galleryImages[activeImageIndex] || galleryImages[0]}
                        alt={`${product.name} detail view ${activeImageIndex + 1}`}
                        fill
                        priority
                        className="object-cover object-center"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black shadow-md hover:bg-white transition-all z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
                      </button>
                      <button
                        onClick={() => setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black shadow-md hover:bg-white transition-all z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 stroke-[1.5]" />
                      </button>

                      {/* Pagination Indicator Pill */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-label text-white tracking-widest z-10">
                        {activeImageIndex + 1} / {galleryImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Side-by-Side Thumbnail Bar for Swiping / Clicking */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
                    {galleryImages.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-24 h-28 rounded-2xl overflow-hidden border-2 shrink-0 transition-all duration-300 ${
                          activeImageIndex === idx
                            ? "border-[#1A1A1A] scale-105 shadow-luxury-xs"
                            : "border-neutral-200/80 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          fill
                          className="object-cover object-center"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Right Column: Sticky Purchase Controls Panel (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-[120px] space-y-8 bg-white p-8 md:p-10 rounded-[32px] border border-neutral-200/80 shadow-luxury-md">
          {/* Header information */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block">
                  {product.categoryName}
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-luxury font-light uppercase tracking-wider text-[#1A1A1A] leading-tight mt-1">
                  {product.name}
                </h1>
              </div>
              
              {/* Star Rating Badge */}
              <div className="flex items-center space-x-1 bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-neutral-200/60 shrink-0 text-xs">
                <Star className="w-3 h-3 text-[#C8A46B] fill-[#C8A46B]" />
                <span className="font-semibold text-neutral-800">{product.rating}</span>
              </div>
            </div>

            <p className="text-xs text-[#706C66] tracking-wider uppercase font-medium">{product.subtitle}</p>

            <div className="flex items-baseline space-x-3 pt-2">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-label font-bold text-neutral-900">
                    ₹{product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-label text-neutral-400 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-label font-bold text-neutral-900">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed font-sans font-light">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="space-y-3 border-t border-neutral-100 pt-6">
            <div className="flex justify-between items-center text-[10px] font-label uppercase tracking-widest">
              <span className="text-[#706C66] font-semibold">
                Color &bull; <strong className="text-black">{currentSelectionColor?.name}</strong>
              </span>
              {currentSelectionColor?.stock !== undefined && (
                <span className="text-neutral-400 font-mono text-[9px]">
                  Stock: {currentSelectionColor.stock}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color);
                    if (color.image) {
                      const idx = (product.images || []).indexOf(color.image);
                      if (idx !== -1) setActiveImageIndex(idx);
                    }
                  }}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    currentSelectionColor?.name === color.name
                      ? "border-black scale-110 shadow-xs"
                      : "border-transparent hover:scale-105"
                  }`}
                  title={`${color.name}${color.isDefault ? " (Default)" : ""}`}
                >
                  <span
                    className="w-6 h-6 rounded-full block border border-neutral-200/60 shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector with Dynamic Stock Indicators */}
          <div className="space-y-3 border-t border-neutral-100 pt-6">
            <div className="flex justify-between items-center text-[10px] font-label uppercase tracking-widest font-semibold">
              <span className={sizeError ? "text-red-600 font-bold" : "text-[#706C66]"}>
                {sizeError ? "⚠️ Please select a silhouette size" : "Select Silhouette Size"}
              </span>
              <button
                onClick={openSizeGuide}
                className="text-black underline flex items-center hover:text-[#C8A46B] transition-colors"
              >
                <Ruler className="w-3.5 h-3.5 mr-1" /> Size Guide
              </button>
            </div>

            <div className={`flex flex-wrap gap-2.5 p-1 rounded-2xl transition-all ${sizeError ? "ring-2 ring-red-500/50 bg-red-50/30" : ""}`}>
              {(product.sizeVariants && product.sizeVariants.length > 0
                ? product.sizeVariants.map((sv) => sv.size)
                : product.sizes || ["S", "M", "L"]
              ).map((sz) => {
                const svItem = product.sizeVariants?.find((sv) => sv.size === sz);
                const stockVal = svItem ? svItem.stock : 10;

                return (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      setSizeError(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-xs font-bold font-label uppercase tracking-wider border flex flex-col items-center justify-center transition-all duration-300 ${
                      selectedSize === sz
                        ? "bg-black text-white border-black shadow-md scale-105"
                        : "bg-[#FAF8F5] text-neutral-800 border-neutral-200 hover:border-black"
                    }`}
                  >
                    <span>{sz}</span>
                    <span className={`text-[8px] font-mono font-normal mt-0.5 ${selectedSize === sz ? "text-neutral-300" : "text-neutral-400"}`}>
                      {stockVal > 0 ? `Stock: ${stockVal}` : "Sold Out"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white text-xs font-label uppercase tracking-[0.25em] py-4 px-6 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors flex items-center justify-center space-x-2 shadow-luxury-xs"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.2]" />
              <span>{addedSuccess ? "ADDED TO BAG" : "ADD TO SHOPPING BAG"}</span>
            </button>
            
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-4 border rounded-full transition-all duration-300 ${
                isLiked
                  ? "bg-neutral-900 border-neutral-900 text-white"
                  : "bg-white border-neutral-200 hover:border-black text-[#1A1A1A]"
              }`}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-4 h-4 stroke-[1.2] ${isLiked ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Showcase Videos (Catwalk, Showcase & Product Videos) */}
          {product.videos && (product.videos.productVideo || product.videos.catwalkVideo || product.videos.showcaseVideo) && (
            <div className="border-t border-neutral-100 pt-6 space-y-3 font-label">
              <span className="text-[10px] text-[#C8A46B] uppercase tracking-widest font-semibold block">
                SHOWCASE RUNWAY VIDEOS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {product.videos.productVideo && (
                  <a
                    href={product.videos.productVideo}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200 text-center hover:border-black transition-colors block"
                  >
                    <span className="text-[10px] uppercase font-bold block text-neutral-900">Product Video</span>
                    <span className="text-[9px] text-neutral-400 font-mono">Watch HD ▶</span>
                  </a>
                )}
                {product.videos.catwalkVideo && (
                  <a
                    href={product.videos.catwalkVideo}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200 text-center hover:border-black transition-colors block"
                  >
                    <span className="text-[10px] uppercase font-bold block text-neutral-900">Catwalk Runway</span>
                    <span className="text-[9px] text-neutral-400 font-mono">Watch HD ▶</span>
                  </a>
                )}
                {product.videos.showcaseVideo && (
                  <a
                    href={product.videos.showcaseVideo}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200 text-center hover:border-black transition-colors block"
                  >
                    <span className="text-[10px] uppercase font-bold block text-neutral-900">360° Showcase</span>
                    <span className="text-[9px] text-neutral-400 font-mono">Watch HD ▶</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Custom Attributes Grid */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="border-t border-neutral-100 pt-6 space-y-3 font-label">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                SILHOUETTE SPECIFICATIONS
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.attributes.map((attr, aIdx) => (
                  <div key={aIdx} className="bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200/60">
                    <span className="text-[9px] text-neutral-400 uppercase block font-bold">{attr.key}</span>
                    <span className="font-bold text-neutral-900">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editorial Trust Accordions */}
          <div className="border-t border-neutral-100 pt-6 space-y-4 text-xs font-label">
            {/* Fabrication */}
            <div className="border-b border-neutral-100 pb-4">
              <button
                onClick={() => setActiveAccordion(activeAccordion === "fabric" ? null : "fabric")}
                className="w-full flex justify-between items-center text-left font-bold uppercase tracking-wider text-neutral-900"
              >
                <span>Fabrication & Detailed Finish</span>
                <span>{activeAccordion === "fabric" ? "—" : "+"}</span>
              </button>
              {activeAccordion === "fabric" && (
                <div className="mt-3 text-neutral-600 space-y-2 font-sans font-light leading-relaxed">
                  {product.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center space-x-2">
                      <span className="text-[#C8A46B] font-bold">✓</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className="border-b border-neutral-100 pb-4">
              <button
                onClick={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
                className="w-full flex justify-between items-center text-left font-bold uppercase tracking-wider text-neutral-900"
              >
                <span>Atelier Shipping & Exchanges</span>
                <span>{activeAccordion === "shipping" ? "—" : "+"}</span>
              </button>
              {activeAccordion === "shipping" && (
                <div className="mt-3 text-neutral-600 space-y-3 font-sans font-light leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <Truck className="w-4 h-4 text-neutral-400 mt-0.5" />
                    <p>Complimentary global express shipping on all couture orders above ₹300.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RotateCcw className="w-4 h-4 text-neutral-400 mt-0.5" />
                    <p>14-day premium return portal with pre-paid pick up service from your residence.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Drop */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-24 pt-16 border-t border-neutral-200/60 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[9px] font-label uppercase tracking-[0.3em] text-[#706C66] font-semibold block">
            ATELIER EDIT
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-light uppercase tracking-wider text-[#1A1A1A]">
            YOU MAY ALSO ADORE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
