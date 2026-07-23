"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { LUXURY_EASE } from "@/lib/utils/motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isLiked = isInWishlist(product.id);
  const mainImage = product.images[0] || "/images/product-dress-front.jpg";
  const secondaryImage = product.images[1] || mainImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.colors[0], product.sizes[0] || "S", 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, ease: LUXURY_EASE }}
      className="group relative flex flex-col bg-white rounded-[20px] overflow-hidden border border-neutral-200/40 shadow-luxury-xs hover:shadow-luxury-md transition-all duration-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 4/5 Aspect Ratio Editorial Photography Frame */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] w-full bg-[#FAF8F5] overflow-hidden block">
        <motion.div
          animate={{ scale: isHovered ? 1.025 : 1 }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
          className="relative w-full h-full"
        >
          <Image
            src={isHovered ? secondaryImage : mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-[#1A1A1A] hover:bg-white transition-all duration-300"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 stroke-[1.2] transition-colors ${isLiked ? "fill-[#1A1A1A] text-[#1A1A1A]" : "text-[#1A1A1A]"}`}
          />
        </button>
      </Link>

      {/* Meta Info */}
      <div className="p-4 bg-white flex items-center justify-between">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-serif-luxury font-medium text-[#1A1A1A] group-hover:text-[#C8A46B] transition-colors truncate tracking-wide">
              {product.name}
            </h3>
          </Link>
          <div className="text-[11px] font-label font-semibold text-[#1A1A1A] mt-0.5">
            ${(product.salePrice || product.price).toFixed(2)}
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          className="w-7 h-7 rounded-full bg-[#FAF8F5] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF8F5] transition-colors flex items-center justify-center shrink-0"
          aria-label="Quick add"
        >
          {addedSuccess ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Plus className="w-3.5 h-3.5 stroke-[1.5]" />}
        </button>
      </div>
    </motion.div>
  );
}
