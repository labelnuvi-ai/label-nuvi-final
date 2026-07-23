"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { springLuxury } from "@/lib/utils/motion";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();
  const freeShippingThreshold = 300;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-[#1A1A1A]/50 backdrop-blur-xs"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={springLuxury}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-neutral-200/80 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#1A1A1A] stroke-[1.2]" />
                <h2 className="text-base font-serif-luxury tracking-[0.2em] font-light uppercase text-[#1A1A1A]">
                  SHOPPING BAG ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1 text-[#706C66] hover:text-black transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5 stroke-[1.2]" />
              </button>
            </div>

            {/* Free Shipping Progress Ticker */}
            <div className="bg-[#1A1A1A] text-[#FAF8F5] px-6 py-3.5 text-xs font-label tracking-wider">
              {remainingForFreeShipping > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#C8A46B]">
                    <span>ADD ₹{remainingForFreeShipping.toFixed(2)} FOR COMPLIMENTARY EXPRESS SHIPPING</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8A46B] transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-[#C8A46B] text-center justify-center font-medium uppercase tracking-[0.2em] text-[10px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>COMPLIMENTARY EXPRESS SHIPPING UNLOCKED</span>
                </div>
              )}
            </div>

            {/* Drawer Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-neutral-200/60">
              {items.length === 0 ? (
                <div className="py-20 text-center space-y-5">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto stroke-[1]" />
                  <p className="text-xs font-label uppercase tracking-[0.25em] text-[#706C66]">
                    Your shopping bag is empty
                  </p>
                  <button
                    onClick={closeCart}
                    className="inline-block bg-[#1A1A1A] text-[#FAF8F5] text-xs font-label uppercase tracking-[0.2em] px-8 py-3.5 font-medium rounded-full shadow-luxury-md hover:bg-[#C8A46B] transition-colors"
                  >
                    Explore New Drops
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="pt-6 first:pt-0 flex space-x-4">
                    <div className="relative w-20 h-28 bg-white rounded-[14px] overflow-hidden shrink-0 border border-neutral-200/60">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xs font-serif-luxury font-medium uppercase tracking-wider text-[#1A1A1A] line-clamp-1">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.2]" />
                          </button>
                        </div>
                        <p className="text-[10px] font-label text-[#706C66] uppercase tracking-wider">
                          Color: {item.selectedColor.name} | Size: {item.selectedSize}
                        </p>
                        <p className="text-xs font-label font-semibold text-[#1A1A1A]">
                          ₹{(item.product.salePrice || item.product.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 mt-3">
                        <div className="flex items-center border border-neutral-300 bg-white rounded-full px-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-neutral-600 hover:text-black"
                          >
                            <Minus className="w-3 h-3 stroke-[1.2]" />
                          </button>
                          <span className="px-3 text-xs font-label font-bold text-[#1A1A1A]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-neutral-600 hover:text-black"
                          >
                            <Plus className="w-3 h-3 stroke-[1.2]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary & Checkout Button */}
            {items.length > 0 && (
              <div className="p-6 bg-[#FFFFFF] border-t border-neutral-200 space-y-4 shadow-luxury-lg">
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#C8A46B]/50 rounded-xl text-xs text-[#1A1A1A]">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-3.5 h-3.5 text-[#C8A46B]" />
                        <span className="font-label font-semibold uppercase">{appliedCoupon.code} APPLIED</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[11px] font-label text-neutral-500 hover:text-black underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="PROMO CODE (e.g. NUVI15)"
                        className="bg-[#FAF8F5] text-xs font-label px-4 py-2.5 w-full rounded-l-full border border-neutral-300 focus:outline-none focus:border-black uppercase tracking-wider"
                      />
                      <button
                        type="submit"
                        className="bg-[#1A1A1A] text-white text-xs font-label uppercase tracking-widest px-5 font-semibold rounded-r-full hover:bg-[#C8A46B] transition-colors shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[10px] font-label text-red-600 mt-1">{couponError}</p>
                  )}
                </div>

                <div className="space-y-2 text-xs font-label text-[#706C66] tracking-wider">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1A1A1A]">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-neutral-200 text-sm font-bold text-[#1A1A1A]">
                    <span>Total Amount</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-[#1A1A1A] text-[#FAF8F5] text-xs font-label uppercase tracking-[0.25em] py-4 font-medium rounded-full hover:bg-[#C8A46B] transition-all duration-500 flex items-center justify-center space-x-2 shadow-luxury-md transform hover:-translate-y-0.5"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 stroke-[1.2]" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
