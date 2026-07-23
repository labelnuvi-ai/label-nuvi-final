"use client";

import { useState, use, useEffect } from "react";
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
  RefreshCw,
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
  const [selectedSize, setSelectedSize] = useState<ProductSize>("S");
  const [activeAccordion, setActiveAccordion] = useState<string | null>("fabric");
  const [addedSuccess, setAddedSuccess] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const openSizeGuide = useQuickViewStore((s) => s.openSizeGuide);

  useEffect(() => {
    if (product && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
        <p className="text-[10px] font-label uppercase tracking-widest text-[#706C66]">
          Loading Lookbook details...
        </p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const isLiked = isInWishlist(product.id);
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (selectedColor) {
      addItem(product, selectedColor, selectedSize, 1);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const currentSelectionColor = selectedColor || product.colors[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
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

          <div className="flex flex-col gap-6">
            {product.images.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/5] w-full rounded-[24px] overflow-hidden bg-neutral-100 shadow-luxury-xs border border-neutral-200/20"
              >
                <Image
                  src={image}
                  alt={`${product.name} lookbook detail ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center"
                />
              </motion.div>
            ))}
          </div>
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
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-label text-neutral-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-label font-bold text-neutral-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed font-sans font-light">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="space-y-3 border-t border-neutral-100 pt-6">
            <span className="text-[10px] font-label uppercase tracking-widest text-[#706C66] font-semibold block">
              Color &bull; {currentSelectionColor?.name}
            </span>
            <div className="flex items-center space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                    currentSelectionColor?.name === color.name
                      ? "border-black scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  title={color.name}
                >
                  <span
                    className="w-5 h-5 rounded-full block border border-neutral-200/40"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-3 border-t border-neutral-100 pt-6">
            <div className="flex justify-between items-center text-[10px] font-label uppercase tracking-widest font-semibold">
              <span className="text-[#706C66]">Select Silhouette Size</span>
              <button
                onClick={openSizeGuide}
                className="text-black underline flex items-center hover:text-[#C8A46B] transition-colors"
              >
                <Ruler className="w-3.5 h-3.5 mr-1" /> Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-12 h-12 rounded-xl text-xs font-bold font-label uppercase tracking-wider border flex items-center justify-center transition-all duration-300 ${
                    selectedSize === sz
                      ? "bg-black text-white border-black"
                      : "bg-[#FAF8F5] text-neutral-800 border-neutral-200 hover:border-black"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white text-xs font-label uppercase tracking-[0.25em] py-4 px-6 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors flex items-center justify-center space-x-2"
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

          {/* Editorial Trust accordions */}
          <div className="border-t border-neutral-100 pt-6 space-y-4 text-xs">
            {/* Fabrication */}
            <div className="border-b border-neutral-100 pb-4">
              <button
                onClick={() => setActiveAccordion(activeAccordion === "fabric" ? null : "fabric")}
                className="w-full flex justify-between items-center text-left font-bold uppercase tracking-wider text-neutral-900"
              >
                <span>Fabrication & Details</span>
                <span>{activeAccordion === "fabric" ? "—" : "+"}</span>
              </button>
              {activeAccordion === "fabric" && (
                <div className="mt-3 text-neutral-600 space-y-2 pl-2 list-disc font-sans font-light leading-relaxed">
                  {product.details.map((detail, dIdx) => (
                    <p key={dIdx}>&bull; {detail}</p>
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
                    <p>Complimentary global express shipping on all couture orders above $300.</p>
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
