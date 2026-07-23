"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from "lucide-react";
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

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block">
          YOUR SELECTIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-wider text-neutral-900">
          SHOPPING BAG
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center space-y-6 bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xs max-w-xl mx-auto">
          <ShoppingBag className="w-14 h-14 text-neutral-300 mx-auto stroke-[1]" />
          <h2 className="text-lg font-serif uppercase tracking-widest text-neutral-800">
            YOUR SHOPPING BAG IS CURRENTLY EMPTY
          </h2>
          <p className="text-xs text-neutral-500 font-sans">
            Discover our Paris Fashion Week Atelier Drop & liquid satins.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#111111] text-white text-xs uppercase tracking-[0.2em] px-8 py-4 font-semibold rounded-2xl hover:bg-neutral-800 transition-colors shadow-lg"
          >
            DISCOVER NEW ARRIVALS
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Items Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs divide-y divide-neutral-200/60">
              {items.map((item) => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex space-x-4 sm:space-x-6">
                  <div className="relative w-24 h-32 bg-neutral-100 rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link href={`/product/${item.product.slug}`}>
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 hover:text-black">
                            {item.product.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
                        Color: {item.selectedColor.name} | Size: {item.selectedSize}
                      </p>
                      <p className="text-xs font-bold text-neutral-900 mt-2">
                        ₹{(item.product.salePrice || item.product.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 pt-2">
                      <div className="flex items-center border border-neutral-300 bg-white rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-neutral-600 hover:text-black"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-neutral-600 hover:text-black"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-900">
                        Item Total: ₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Summary Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-6">
              <h2 className="text-sm font-serif uppercase tracking-[0.2em] font-bold text-neutral-900 pb-3 border-b border-neutral-200">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 text-xs text-neutral-600 tracking-wider">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-neutral-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount Promo</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-200 text-base font-bold text-neutral-900">
                  <span>Total Due</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-[#111111] text-white text-xs uppercase tracking-[0.25em] py-4 font-semibold rounded-2xl hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 shadow-xl"
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
