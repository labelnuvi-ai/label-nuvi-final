"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, Package, ArrowRight, Truck } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = use(searchParams);
  const orderRef = orderNumber || "UNI-98241";

  useEffect(() => {
    // Fire festive luxury confetti on launch
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E6D5C3", "#111111", "#FAF9F6"],
    });
  }, []);

  return (
    <div className="py-20 max-w-2xl mx-auto px-4 text-center space-y-8">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-200">
        <CheckCircle2 className="w-10 h-10 text-green-700 stroke-[1.5]" />
      </div>

      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-semibold block">
          PURCHASE CONFIRMED
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-wider text-neutral-900">
          THANK YOU FOR YOUR ORDER
        </h1>
        <p className="text-xs text-neutral-600 font-sans max-w-md mx-auto leading-relaxed">
          Your order <strong>{orderRef}</strong> has been received by our Paris Atelier. A confirmation email with receipt and tracking number has been sent.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 text-left space-y-4 shadow-xs">
        <div className="flex items-center space-x-3 text-xs text-neutral-800">
          <Truck className="w-5 h-5 text-black stroke-[1.5]" />
          <div>
            <span className="font-bold uppercase block tracking-wider">Estimated Dispatch</span>
            <span className="text-neutral-500">Ships within 24 hours via Express Air Delivery</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/account/orders"
          className="w-full sm:w-auto bg-[#111111] text-white text-xs uppercase tracking-[0.25em] px-8 py-4 font-semibold rounded-2xl hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 shadow-lg"
        >
          <Package className="w-4 h-4" />
          <span>VIEW MY ORDERS</span>
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto bg-white border border-neutral-300 text-black text-xs uppercase tracking-[0.25em] px-8 py-4 font-semibold rounded-2xl hover:border-black transition-colors flex items-center justify-center space-x-1"
        >
          <span>CONTINUE SHOPPING</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
