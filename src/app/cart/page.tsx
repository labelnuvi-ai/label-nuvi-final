"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, ArrowLeft, Check, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const {
    items,
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
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMessage({ success: res.success, text: res.message });
    if (res.success) {
      setCouponCode("");
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 font-sans">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block font-label">
          ATELIER SELECTIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-light uppercase tracking-wider text-neutral-900">
          SHOPPING BAG
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center space-y-6 bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-luxury-xs max-w-xl mx-auto">
          <ShoppingBag className="w-14 h-14 text-neutral-300 mx-auto stroke-[1]" />
          <h2 className="text-lg font-serif uppercase tracking-widest text-neutral-800">
            YOUR SHOPPING BAG IS CURRENTLY EMPTY
          </h2>
          <p className="text-xs text-neutral-500 font-sans">
            Discover our Haute Couture Atelier Collection & Runway Co-Ords.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white text-xs font-label uppercase tracking-[0.2em] px-8 py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors shadow-lg"
          >
            DISCOVER NEW ARRIVALS
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Items Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-luxury-xs divide-y divide-neutral-200/60">
              {items.map((item) => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex space-x-4 sm:space-x-6">
                  <div className="relative w-24 h-32 sm:w-28 sm:h-36 bg-neutral-100 rounded-2xl overflow-hidden shrink-0 border border-neutral-200/50">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link href={`/product/${item.product.slug}`}>
                          <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider text-neutral-900 hover:text-[#C8A46B] transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-neutral-500 uppercase tracking-wider mt-1.5 font-label">
                        <span className="bg-neutral-100 px-2.5 py-1 rounded-md text-neutral-800 font-semibold">
                          Size: {item.selectedSize}
                        </span>
                        {item.selectedColor?.name && (
                          <span className="bg-neutral-100 px-2.5 py-1 rounded-md text-neutral-800">
                            Color: {item.selectedColor.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold font-label text-neutral-900 mt-2">
                        ₹{(item.product.salePrice || item.product.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center border border-neutral-200 bg-[#FAF8F5] rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-neutral-600 hover:text-black transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3.5 text-xs font-bold font-label text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-neutral-600 hover:text-black transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-bold font-label text-neutral-900">
                        Item Subtotal: ₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Link */}
            <div className="flex justify-between items-center pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center text-xs font-label uppercase tracking-widest text-neutral-600 hover:text-black font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>CONTINUE SHOPPING</span>
              </Link>
            </div>
          </div>

          {/* Right Summary Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-luxury-xs space-y-6 font-label">
              <h2 className="text-sm font-serif uppercase tracking-[0.2em] font-bold text-neutral-900 pb-3 border-b border-neutral-200">
                ORDER SUMMARY
              </h2>

              {/* Promo Coupon Form */}
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block">
                  PROMO / ATELIER COUPON
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold text-emerald-900 uppercase">
                        {appliedCoupon.code} APPLIED
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[10px] font-semibold uppercase text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. NUVI99 or NUVI15"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-[#FAF8F5] text-xs px-3.5 py-3 flex-1 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-mono uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-black text-white text-[11px] uppercase tracking-widest px-4 py-3 font-semibold rounded-xl hover:bg-neutral-800 transition-colors shrink-0"
                    >
                      APPLY
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <p
                    className={`text-[10px] font-sans font-medium mt-1 ${
                      couponMessage.success ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 text-xs text-neutral-600 tracking-wider pt-2 border-t border-neutral-100">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-neutral-900">₹{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Atelier Shipping</span>
                  <span className="font-semibold text-neutral-900">
                    {shipping === 0 ? "COMPLIMENTARY" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-neutral-200 text-base font-bold text-neutral-900">
                  <span>Grand Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <Link
                href="/checkout"
                className="w-full bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.25em] py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
