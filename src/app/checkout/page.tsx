"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, CreditCard, Sparkles, ArrowRight, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDiscountAmount, getShippingFee, getTotal, clearCart } =
    useCartStore();

  const [email, setEmail] = useState("victoria.sterling@vogue.com");
  const [fullName, setFullName] = useState("Victoria Sterling");
  const [address, setAddress] = useState("740 Park Avenue, Apt 14B");
  const [city, setCity] = useState("New York");
  const [postalCode, setPostalCode] = useState("10021");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "razorpay" | "cod">("stripe");
  const [giftNote, setGiftNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      clearCart();
      router.push("/checkout/success?orderNumber=NUVI-" + Math.floor(10000 + Math.random() * 90000));
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <h1 className="text-3xl font-serif-luxury uppercase tracking-wider font-light">BAG IS EMPTY</h1>
        <p className="text-xs text-[#706C66] font-sans">Please add items to your shopping bag before checking out.</p>
        <button
          onClick={() => router.push("/shop")}
          className="bg-[#1A1A1A] text-[#FAF8F5] text-xs font-label uppercase tracking-[0.25em] px-8 py-4 font-medium rounded-full hover:bg-[#C8A46B] transition-colors"
        >
          Return to Atelier Store
        </button>
      </div>
    );
  }

  return (
    <div className="py-20 max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-label uppercase tracking-[0.25em] text-[#C8A46B] font-medium">
          <Lock className="w-3.5 h-3.5 stroke-[1.2]" />
          <span>256-BIT ENCRYPTED LUXURY CHECKOUT</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#1A1A1A]">
          SECURE CHECKOUT
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Contact */}
          <div className="bg-white p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-5">
            <h2 className="text-sm font-serif-luxury uppercase tracking-[0.2em] font-medium text-[#1A1A1A] pb-3 border-b border-neutral-200">
              1. CLIENT CONTACT INFORMATION
            </h2>
            <div>
              <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2">
                Email Address for Order Confirmation
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Step 2: Shipping */}
          <div className="bg-white p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-5">
            <h2 className="text-sm font-serif-luxury uppercase tracking-[0.2em] font-medium text-[#1A1A1A] pb-3 border-b border-neutral-200">
              2. SHIPPING DESTINATION
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2">
                  Full Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2">
                  Street Address & Apartment
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Options */}
          <div className="bg-white p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-5">
            <h2 className="text-sm font-serif-luxury uppercase tracking-[0.2em] font-medium text-[#1A1A1A] pb-3 border-b border-neutral-200">
              3. SELECT PAYMENT GATEWAY
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod("stripe")}
                className={`flex items-center justify-between p-5 rounded-[18px] border cursor-pointer transition-colors ${
                  paymentMethod === "stripe" ? "border-[#1A1A1A] bg-[#FAF8F5]" : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <CreditCard className="w-5 h-5 text-[#1A1A1A] stroke-[1.2]" />
                  <div>
                    <span className="text-xs font-label font-bold uppercase tracking-wider block text-[#1A1A1A]">
                      Stripe Gateway (Global Credit / Debit Card)
                    </span>
                    <span className="text-[11px] font-sans text-neutral-500">
                      Visa, Mastercard, Amex, Discover
                    </span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "stripe" ? "border-[#1A1A1A] bg-[#1A1A1A]" : "border-neutral-300"}`}>
                  {paymentMethod === "stripe" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod("razorpay")}
                className={`flex items-center justify-between p-5 rounded-[18px] border cursor-pointer transition-colors ${
                  paymentMethod === "razorpay" ? "border-[#1A1A1A] bg-[#FAF8F5]" : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Sparkles className="w-5 h-5 text-[#C8A46B] stroke-[1.2]" />
                  <div>
                    <span className="text-xs font-label font-bold uppercase tracking-wider block text-[#1A1A1A]">
                      Razorpay Gateway (Global & Instant NetBanking)
                    </span>
                    <span className="text-[11px] font-sans text-neutral-500">
                      UPI, Instant NetBanking, Wallet & Global Cards
                    </span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "razorpay" ? "border-[#1A1A1A] bg-[#1A1A1A]" : "border-neutral-300"}`}>
                  {paymentMethod === "razorpay" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center justify-between p-5 rounded-[18px] border cursor-pointer transition-colors ${
                  paymentMethod === "cod" ? "border-[#1A1A1A] bg-[#FAF8F5]" : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Truck className="w-5 h-5 text-[#1A1A1A] stroke-[1.2]" />
                  <div>
                    <span className="text-xs font-label font-bold uppercase tracking-wider block text-[#1A1A1A]">
                      Cash On Delivery (COD)
                    </span>
                    <span className="text-[11px] font-sans text-neutral-500">
                      Pay with cash upon package arrival
                    </span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-[#1A1A1A] bg-[#1A1A1A]" : "border-neutral-300"}`}>
                  {paymentMethod === "cod" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[24px] p-8 border border-neutral-200/60 shadow-luxury-lg space-y-6 sticky top-28">
            <h2 className="text-base font-serif-luxury uppercase tracking-[0.2em] font-light text-[#1A1A1A] pb-4 border-b border-neutral-200">
              BAG ITEMS ({items.length})
            </h2>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex space-x-4 items-center">
                  <div className="relative w-14 h-18 bg-[#FAF8F5] rounded-[12px] overflow-hidden shrink-0 border border-neutral-200/50">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-xs font-serif-luxury">
                    <h4 className="font-medium text-[#1A1A1A] uppercase line-clamp-1">{item.product.name}</h4>
                    <p className="text-[#706C66] text-[10px] font-label uppercase">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-label font-bold">${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs font-label text-[#706C66] tracking-wider border-t border-neutral-200 pt-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-neutral-200 text-lg font-serif-luxury font-light text-[#1A1A1A]">
                <span>Total Payment</span>
                <span className="font-bold font-label">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1A1A1A] text-[#FAF8F5] text-xs font-label uppercase tracking-[0.25em] py-4.5 font-medium rounded-full hover:bg-[#C8A46B] transition-all duration-500 flex items-center justify-center space-x-2 shadow-luxury-md transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>PROCESSING ATELIER ORDER...</span>
              ) : (
                <>
                  <span>PLACE ORDER (${total.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4 stroke-[1.2]" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
