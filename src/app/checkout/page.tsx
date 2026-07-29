"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, CreditCard, Sparkles, ArrowRight, Truck, Tag, AlertCircle, Check, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    clearCart,
  } = useCartStore();

  // Shipping Address Form State
  const [fullName, setFullName] = useState("Victoria Sterling");
  const [email, setEmail] = useState("victoria.sterling@vogue.com");
  const [phone, setPhone] = useState("+91 9876543210");
  const [addressLine1, setAddressLine1] = useState("740 Park Avenue, Apt 14B");
  const [addressLine2, setAddressLine2] = useState("Manhattan East Side");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("400001");
  const [country, setCountry] = useState("India");

  // Billing Address Option State
  const [billingSame, setBillingSame] = useState(true);
  const [billingFullName, setBillingFullName] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPincode, setBillingPincode] = useState("");
  const [billingCountry, setBillingCountry] = useState("India");

  // Gateway & Form state
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [giftNote, setGiftNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutCouponInput, setCheckoutCouponInput] = useState("");
  const [checkoutCouponError, setCheckoutCouponError] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Financial Breakdown calculations
  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const tax = Math.round((subtotal - discount) * 0.05 * 100) / 100; // 5% GST calculation
  const grandTotal = Math.max(0, subtotal - discount + shipping + tax);

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const { createOrderDb } = await import("@/lib/supabase/db");
      
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Stock Validation Check before initializing payment
      const itemIds = items.map((i) => i.product.id);
      const { data: dbProducts } = await supabase
        .from("products")
        .select("id, name, is_sold_out")
        .in("id", itemIds);

      if (dbProducts && dbProducts.length > 0) {
        for (const item of items) {
          const match = dbProducts.find((p) => p.id === item.product.id);
          if (match && match.is_sold_out) {
            setCheckoutError(`Stock Validation Alert: "${match.name}" is currently sold out. Please remove it from your shopping bag to continue.`);
            setIsSubmitting(false);
            return;
          }
        }
      }

      const orderNumber = "NUVI-" + Math.floor(10000 + Math.random() * 90000);

      const placeOrderWithDetails = async (
        paymentId: string | null = null,
        rzpOrderId: string | null = null,
        paymentStatus: "Paid" | "Pending" | "Failed" = "Paid"
      ) => {
        const orderData = {
          orderNumber,
          date: new Date().toISOString().split("T")[0],
          subtotal,
          discount,
          shipping,
          tax: tax,
          total: grandTotal,
          couponCode: appliedCoupon?.code || null,
          paymentStatus: paymentStatus,
          orderStatus: paymentStatus === "Paid" ? "Processing" : "Pending",
          paymentMethod: paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery",
          razorpayPaymentId: paymentId,
          razorpayOrderId: rzpOrderId,
          shippingAddress: {
            fullName,
            email,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode: pincode,
            country,
          },
          billingAddressSame: billingSame,
          billingAddress: billingSame
            ? undefined
            : {
                fullName: billingFullName || fullName,
                phone: billingPhone || phone,
                addressLine1: billingAddressLine1 || addressLine1,
                addressLine2: billingAddressLine2 || addressLine2,
                city: billingCity || city,
                state: billingState || state,
                postalCode: billingPincode || pincode,
                country: billingCountry || country,
              },
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.imageUrl || "/images/product-dress-front.jpg",
            color: item.selectedColor?.name || "Standard",
            size: item.selectedSize,
            unitPrice: item.product.salePrice || item.product.price,
            quantity: item.quantity,
          })),
        };

        await createOrderDb(user ? user.id : null, orderData);
        await clearCart();
        router.push(`/checkout/success?orderNumber=${orderNumber}`);
      };

      if (paymentMethod === "razorpay") {
        const loaded = await loadRazorpay();
        if (!loaded) {
          throw new Error("Razorpay SDK failed to load. Please check your internet connection and retry.");
        }

        // Initialize Razorpay Order via Backend Route
        const orderRes = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: grandTotal }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.id) {
          throw new Error(orderData.error || "Failed to initialize payment gateway order.");
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TIx1NIiRSdXUN3",
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "LABEL NUVI",
          description: `Haute Couture Order ${orderNumber}`,
          order_id: orderData.id,
          image: "/images/hero-portrait.jpg",
          handler: async function (response: any) {
            try {
              setIsSubmitting(true);
              // Verify Payment Signature via Backend Route
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.success) {
                setCheckoutError("Payment Signature Verification Failed: " + (verifyData.error || "Invalid signature"));
                setIsSubmitting(false);
                return;
              }

              await placeOrderWithDetails(response.razorpay_payment_id, response.razorpay_order_id, "Paid");
            } catch (err: any) {
              setCheckoutError("Payment verification error: " + err.message);
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#1a1a1a",
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              setCheckoutError("Payment window closed. Your transaction was not completed.");
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", async function (resp: any) {
          console.error("Razorpay Payment Failed:", resp.error);
          const reason = resp.error.description || resp.error.reason || "Transaction declined by gateway";
          setCheckoutError(`Payment Failed: ${reason}`);
          setIsSubmitting(false);

          // Asynchronously notify admin of failed payment
          try {
            const { sendEmail } = await import("@/lib/email/sender");
            const { adminPaymentFailedTemplate } = await import("@/lib/email/templates");
            const adminEmail = process.env.ADMIN_EMAIL || "concierge@labelnuvi.com";
            sendEmail({
              to: adminEmail,
              subject: `[ADMIN ALERT] Payment Failed - Order ${orderNumber}`,
              html: adminPaymentFailedTemplate(orderNumber, grandTotal, reason),
              emailType: "admin_payment_failed",
              metadata: { orderNumber, amount: grandTotal, reason },
            });
          } catch (emailErr) {
            console.error("Non-blocking payment failed email trigger error:", emailErr);
          }
        });

        rzp.open();
      } else {
        // Cash on Delivery Placement
        await placeOrderWithDetails(null, null, "Pending");
      }
    } catch (err: any) {
      setCheckoutError(err.message || "Checkout placement failed. Please retry.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4 font-sans">
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
    <div className="py-20 max-w-7xl mx-auto px-6 lg:px-12 space-y-12 font-sans">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-label uppercase tracking-[0.25em] text-[#C8A46B] font-medium">
          <Lock className="w-3.5 h-3.5 stroke-[1.2]" />
          <span>256-BIT ENCRYPTED LUXURY CHECKOUT</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#1A1A1A]">
          SECURE CHECKOUT
        </h1>
      </div>

      {checkoutError && (
        <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-label uppercase tracking-wider flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{checkoutError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Contact */}
          <div className="bg-white p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-5">
            <h2 className="text-sm font-serif-luxury uppercase tracking-[0.2em] font-medium text-[#1A1A1A] pb-3 border-b border-neutral-200">
              1. CLIENT CONTACT INFORMATION
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Destination */}
          <div className="bg-white p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-5">
            <h2 className="text-sm font-serif-luxury uppercase tracking-[0.2em] font-medium text-[#1A1A1A] pb-3 border-b border-neutral-200">
              2. SHIPPING DESTINATION
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                  Full Recipient Name *
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
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="House number, street name, apartment..."
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Suite, landmark, building..."
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                  City *
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
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                  State / Region *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                  Pincode / ZIP *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Billing Address Option */}
          <div className="bg-white p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h2 className="text-sm font-serif-luxury uppercase tracking-[0.2em] font-medium text-[#1A1A1A]">
                3. BILLING ADDRESS
              </h2>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={billingSame}
                  onChange={(e) => setBillingSame(e.target.checked)}
                  className="rounded border-neutral-300 text-black focus:ring-black"
                />
                <span className="text-xs font-label uppercase text-[#706C66] font-semibold">
                  Same as shipping address
                </span>
              </label>
            </div>

            {!billingSame && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                    Billing Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={billingFullName}
                    onChange={(e) => setBillingFullName(e.target.value)}
                    className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                    Billing Address Line 1
                  </label>
                  <input
                    type="text"
                    required
                    value={billingAddressLine1}
                    onChange={(e) => setBillingAddressLine1(e.target.value)}
                    className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                    Billing City
                  </label>
                  <input
                    type="text"
                    required
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                    Billing Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={billingPincode}
                    onChange={(e) => setBillingPincode(e.target.value)}
                    className="bg-[#FAF8F5] text-xs font-label px-5 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Payment Gateway Options */}
          <div className="bg-white p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-5">
            <h2 className="text-sm font-serif-luxury uppercase tracking-[0.2em] font-medium text-[#1A1A1A] pb-3 border-b border-neutral-200">
              4. SELECT PAYMENT GATEWAY
            </h2>

            <div className="space-y-3">
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
                      Razorpay Gateway (UPI, Cards & NetBanking)
                    </span>
                    <span className="text-[11px] font-sans text-neutral-500">
                      GPay, PhonePe, Paytm, Cards & NetBanking
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
          <div className="bg-white rounded-[24px] p-8 border border-neutral-200/60 shadow-luxury-lg space-y-6 sticky top-28 font-label">
            <h2 className="text-base font-serif-luxury uppercase tracking-[0.2em] font-light text-[#1A1A1A] pb-4 border-b border-neutral-200">
              BAG ITEMS ({items.length})
            </h2>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex space-x-4 items-center">
                  <div className="relative w-14 h-18 bg-[#FAF8F5] rounded-[12px] overflow-hidden shrink-0 border border-neutral-200/50">
                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-xs font-serif-luxury">
                    <h4 className="font-medium text-[#1A1A1A] uppercase line-clamp-1">{item.product.name}</h4>
                    <p className="text-[#706C66] text-[10px] font-label uppercase">
                      Size: {item.selectedSize} | Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    ₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Gift note section */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <label className="text-[10px] font-label uppercase tracking-widest text-[#706C66] block">
                ATELIER GIFT NOTE (OPTIONAL)
              </label>
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Include a handwritten message on our signature cream cardstock..."
                rows={2}
                className="bg-[#FAF8F5] text-xs font-sans p-4 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black resize-none"
              />
            </div>

            {/* Promotional Coupon Section */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <label className="text-[10px] font-label uppercase tracking-widest text-[#706C66] block font-semibold">
                PROMOTIONAL CODE
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs font-semibold text-emerald-900">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} Applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCoupon()}
                    className="text-[11px] font-label text-neutral-500 hover:text-red-600 underline uppercase"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={checkoutCouponInput}
                    onChange={(e) => setCheckoutCouponInput(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE (e.g. NUVI99)"
                    className="bg-[#FAF8F5] text-xs font-mono font-bold p-3 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!checkoutCouponInput.trim()) return;
                      const res = applyCoupon(checkoutCouponInput);
                      if (!res.success) {
                        setCheckoutCouponError(res.message);
                      } else {
                        setCheckoutCouponError("");
                        setCheckoutCouponInput("");
                      }
                    }}
                    className="bg-black text-white text-xs font-label uppercase tracking-wider px-5 rounded-2xl hover:bg-neutral-800 transition-colors shrink-0 font-semibold"
                  >
                    Apply
                  </button>
                </div>
              )}
              {checkoutCouponError && (
                <p className="text-[10px] font-label text-red-600 mt-1">{checkoutCouponError}</p>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-3 border-t border-neutral-100 pt-4 text-xs font-label">
              <div className="flex justify-between text-[#706C66]">
                <span>SUBTOTAL</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>DISCOUNT APPLIED</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#706C66]">
                <span>EXPRESS SHIPPING</span>
                <span>{shipping === 0 ? "COMPLIMENTARY" : `₹${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between text-[#706C66]">
                <span>ESTIMATED TAX (5% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base text-black font-bold pt-3 border-t border-neutral-100 font-serif-luxury">
                <span>GRAND TOTAL</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1A1A1A] hover:bg-[#C8A46B] text-white text-xs uppercase tracking-[0.25em] py-4.5 font-semibold rounded-full transition-colors flex items-center justify-center space-x-2 disabled:bg-neutral-300 shadow-lg"
            >
              <span>{isSubmitting ? "PROCESSING TRANSACTION..." : "AUTHORIZE PAYMENT"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
