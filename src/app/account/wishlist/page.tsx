"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, RefreshCw, ShoppingBag, Trash2, Check, AlertCircle } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { items: cartItems, addItem, openCart } = useCartStore();
  const { products, loading } = useProducts();

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const [notification, setNotification] = useState<{ id: string; message: string; type: "success" | "info" } | null>(null);

  const handleMoveToCart = async (product: Product) => {
    const defaultColor = product.colors?.[0] || { name: "Ivory", hex: "#FAF8F5" };
    const defaultSize = product.sizes?.[0] || "M";

    // Check if duplicate item exists in cart
    const isAlreadyInCart = cartItems.some(
      (item) => item.product.id === product.id && item.selectedSize === defaultSize
    );

    if (isAlreadyInCart) {
      setNotification({
        id: product.id,
        message: `${product.name} (Size ${defaultSize}) is already in your Shopping Bag!`,
        type: "info",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Add to cart & remove from wishlist
    await addItem(product, defaultColor, defaultSize, 1);
    await toggleWishlist(product.id);

    setNotification({
      id: product.id,
      message: `Moved ${product.name} to Shopping Bag!`,
      type: "success",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <Link
          href="/account"
          className="inline-flex items-center text-xs font-label uppercase tracking-widest text-neutral-500 hover:text-black font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Account
        </Link>
        <Link
          href="/shop"
          className="text-xs font-label uppercase tracking-widest text-[#C8A46B] hover:text-black font-semibold transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block font-label">
          CURATED ATELIER PIECES
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-light uppercase tracking-wider text-neutral-900">
          SAVED WISHLIST ({wishlistProducts.length})
        </h1>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-label uppercase tracking-wider flex items-center justify-between transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
            <span>{notification.message}</span>
          </div>
          {notification.type === "success" && (
            <button
              onClick={openCart}
              className="underline font-bold text-emerald-900 hover:text-black uppercase ml-4 shrink-0"
            >
              VIEW BAG
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
          <p className="text-[10px] font-label uppercase tracking-widest text-[#706C66]">
            Updating wishlist silhouettes...
          </p>
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="py-20 text-center space-y-6 bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-luxury-xs max-w-xl mx-auto">
          <Heart className="w-14 h-14 text-neutral-300 mx-auto stroke-[1]" />
          <h2 className="text-lg font-serif uppercase tracking-widest text-neutral-800">
            YOUR WISHLIST IS CURRENTLY EMPTY
          </h2>
          <p className="text-xs text-neutral-500 font-sans">
            Explore our Runway Drops, liquid satins, and tailored outerwear to save your favorite silhouettes.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white text-xs font-label uppercase tracking-[0.2em] px-8 py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors shadow-lg"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-luxury-xs hover:shadow-luxury-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-[3/4] bg-neutral-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-red-50 text-red-600 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[9px] font-label uppercase tracking-[0.25em] text-[#C8A46B] font-semibold block">
                    {product.categoryName}
                  </span>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 hover:text-[#C8A46B] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-bold font-label text-neutral-900">
                    ₹{(product.salePrice || product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full bg-black text-white text-xs font-label uppercase tracking-widest py-3 px-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                  <span>MOVE TO BAG</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
