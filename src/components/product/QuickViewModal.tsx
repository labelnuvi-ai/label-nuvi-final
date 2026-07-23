"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Star, Check, ArrowRight } from "lucide-react";
import { useQuickViewStore } from "@/store/useQuickViewStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ProductSize, ProductColor } from "@/types";

export function QuickViewModal() {
  const { selectedProduct, isQuickViewOpen, closeQuickView, openSizeGuide } =
    useQuickViewStore();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>("S");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!selectedProduct) return null;

  const colorToUse = selectedColor || selectedProduct.colors[0];
  const isLiked = isInWishlist(selectedProduct.id);

  const handleAddToCart = () => {
    addItem(selectedProduct, colorToUse, selectedSize, 1);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      closeQuickView();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:top-[10%] sm:left-[50%] sm:-translate-x-[50%] z-50 w-full sm:max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-neutral-600 hover:text-black shadow-sm"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Left: Gallery Column */}
            <div className="md:w-1/2 bg-neutral-100 relative min-h-[300px] md:min-h-full">
              <Image
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
              {/* Thumbnails */}
              <div className="absolute bottom-4 left-4 right-4 flex space-x-2 justify-center z-10">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-14 relative rounded-md overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? "border-black shadow-md scale-105" : "border-white/60 opacity-80"
                    }`}
                  >
                    <Image src={img} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info Column */}
            <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest">
                  <span>{selectedProduct.categoryName}</span>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none mr-1" />
                    <span className="font-semibold text-neutral-800">{selectedProduct.rating}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-serif font-bold text-neutral-900">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-xs text-neutral-500 font-sans mt-1">
                    {selectedProduct.subtitle}
                  </p>
                </div>

                <div className="text-lg font-bold text-neutral-900">
                  ₹{(selectedProduct.salePrice || selectedProduct.price).toFixed(2)}
                  {selectedProduct.salePrice && (
                    <span className="ml-2 text-sm text-neutral-400 line-through font-normal">
                      ₹{selectedProduct.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                  {selectedProduct.description}
                </p>

                {/* Color Swatches */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800 block">
                    COLOR: {colorToUse.name}
                  </label>
                  <div className="flex items-center space-x-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform ${
                          colorToUse.name === color.name ? "border-black scale-110" : "border-neutral-200"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {colorToUse.name === color.name && (
                          <span className={`w-1.5 h-1.5 rounded-full ${color.hex === "#FAF8F5" ? "bg-black" : "bg-white"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold uppercase tracking-wider text-neutral-800">
                      SELECT SIZE: {selectedSize}
                    </span>
                    <button
                      onClick={openSizeGuide}
                      className="text-neutral-500 hover:text-black underline uppercase tracking-wider text-[11px]"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                          selectedSize === size
                            ? "bg-black text-white border-black"
                            : "bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] py-3.5 font-semibold rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 shadow-md"
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>ADD TO BAG</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="w-12 h-12 rounded-xl border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-black hover:text-black transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-red-600 text-red-600" : ""}`} />
                  </button>
                </div>

                <Link
                  href={`/product/${selectedProduct.slug}`}
                  onClick={closeQuickView}
                  className="block text-center text-xs uppercase tracking-widest text-neutral-500 hover:text-black pt-1"
                >
                  View Full Product Details & Reviews &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
