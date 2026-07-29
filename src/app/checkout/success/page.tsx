"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import { CheckCircle2, Package, ArrowRight, Truck, ShieldCheck, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SuccessPageProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = use(searchParams);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#C8A46B", "#1A1A1A", "#FAF8F5"],
    });

    if (orderNumber) {
      const fetchOrder = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("order_number", orderNumber)
          .maybeSingle();

        if (data) {
          setOrderDetails(data);
        }
      };
      fetchOrder();
    }
  }, [orderNumber]);

  return (
    <div className="py-20 max-w-3xl mx-auto px-6 text-center space-y-8 font-sans">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-luxury-xs">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 stroke-[1.5]" />
      </div>

      <div className="space-y-3">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block font-label">
          PURCHASE AUTHORIZED & CONFIRMED
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-light uppercase tracking-wider text-neutral-900">
          THANK YOU FOR YOUR ORDER
        </h1>
        <p className="text-xs text-neutral-600 font-sans max-w-lg mx-auto leading-relaxed">
          Order <strong>{orderNumber || "NUVI-ORDER"}</strong> has been logged in our Paris Atelier system. A digital receipt has been generated.
        </p>
      </div>

      {orderDetails && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 text-left space-y-6 shadow-luxury-xs font-label">
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-neutral-100 text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase">Order Reference</span>
              <span className="font-bold text-neutral-900">{orderDetails.order_number}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase">Payment Status</span>
              <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md font-bold uppercase text-[10px]">
                {orderDetails.payment_status || "PAID"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase">Total Paid</span>
              <span className="font-bold text-neutral-900">₹{Number(orderDetails.total || 0).toFixed(2)}</span>
            </div>
          </div>

          {orderDetails.shipping_address_line1 && (
            <div className="flex items-start space-x-3 text-xs text-neutral-600 border-b border-neutral-100 pb-4">
              <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase text-neutral-900 block">Shipping Destination</span>
                <span>
                  {orderDetails.shipping_name} &bull; {orderDetails.shipping_address_line1}, {orderDetails.shipping_city}, {orderDetails.shipping_state} {orderDetails.shipping_postal_code}
                </span>
              </div>
            </div>
          )}

          {orderDetails.order_items && orderDetails.order_items.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">
                ORDER SILHOUETTES
              </span>
              <div className="space-y-2">
                {orderDetails.order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-neutral-900 font-medium uppercase">
                      {item.product_name} ({item.size}) &times; {item.quantity}
                    </span>
                    <span className="font-bold text-neutral-900">₹{Number(item.price || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 text-left space-y-4 shadow-luxury-xs">
        <div className="flex items-center space-x-3 text-xs text-neutral-800 font-label">
          <Truck className="w-5 h-5 text-black stroke-[1.5] shrink-0" />
          <div>
            <span className="font-bold uppercase block tracking-wider">Estimated Dispatch</span>
            <span className="text-neutral-500 font-sans">Ships within 24 hours via Air Express Courier</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-label">
        <Link
          href="/account/orders"
          className="w-full sm:w-auto bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.25em] px-8 py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors flex items-center justify-center space-x-2 shadow-lg"
        >
          <Package className="w-4 h-4 stroke-[1.5]" />
          <span>VIEW MY ORDERS</span>
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto bg-white border border-neutral-300 text-black text-xs uppercase tracking-[0.25em] px-8 py-4 font-semibold rounded-full hover:border-black transition-colors flex items-center justify-center space-x-1"
        >
          <span>CONTINUE SHOPPING</span>
          <ArrowRight className="w-4 h-4 stroke-[1.5]" />
        </Link>
      </div>
    </div>
  );
}
