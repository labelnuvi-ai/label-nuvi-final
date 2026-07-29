"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Truck, ArrowLeft, Eye, X, CheckCircle2, Clock, ShieldCheck, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fetchOrdersDb } from "@/lib/supabase/db";
import { Order } from "@/types";

const WORKFLOW_STEPS = ["Pending", "Paid", "Processing", "Packed", "Shipped", "Delivered"];

export default function MyOrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const userOrders = await fetchOrdersDb(user.id);
    setOrders(userOrders);

    // Synchronize open order receipt modal with latest orders.status
    setSelectedOrder((prevSelected) => {
      if (!prevSelected) return null;
      const updated = userOrders.find((o) => o.id === prevSelected.id);
      return updated || prevSelected;
    });

    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    const handleFocus = () => {
      loadOrders();
    };
    window.addEventListener("focus", handleFocus);

    // Real-time Postgres changes subscription & polling revalidation
    const channel = supabase
      .channel("customer-orders-realtime-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Realtime order update received:", payload);
          loadOrders();
        }
      )
      .subscribe();

    const interval = setInterval(loadOrders, 5000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center text-xs font-label uppercase tracking-widest text-[#706C66]">
        Fetching client purchase history from Atelier database...
      </div>
    );
  }

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      <Link
        href="/account"
        className="inline-flex items-center text-xs font-label uppercase tracking-widest text-neutral-500 hover:text-black font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Account
      </Link>

      <div className="space-y-2 font-label">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block">
          HAUTE COUTURE ARCHIVES
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-light uppercase tracking-wider text-neutral-900">
          MY ORDERS ({orders.length})
        </h1>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-neutral-200/80 text-center space-y-4 shadow-luxury-xs max-w-xl mx-auto font-label">
            <Package className="w-10 h-10 mx-auto text-neutral-300 stroke-[1.2]" />
            <p className="text-xs uppercase tracking-[0.2em] text-[#706C66]">
              No purchase orders found in your client profile.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white text-[11px] uppercase tracking-widest px-8 py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors shadow-md"
            >
              EXPLORE CATALOGUE
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-luxury-xs space-y-6 font-label"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-2 text-xs">
                <div>
                  <span className="font-mono font-bold text-neutral-900 uppercase">{order.orderNumber}</span>
                  <span className="text-neutral-500 ml-3">Placed on {order.date}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${
                      order.status === "Cancelled"
                        ? "bg-red-100 text-red-900"
                        : order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-bold text-neutral-900">₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex space-x-4 items-center">
                    <div className="relative w-16 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200/50">
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs">
                      <h4 className="font-bold text-neutral-900 uppercase">{item.productName}</h4>
                      <p className="text-neutral-500 uppercase text-[10px]">
                        Color: {item.color} | Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-neutral-900 mt-1">₹{item.unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs gap-3">
                <span className="text-neutral-500 text-[11px]">
                  Payment: <strong className="text-neutral-900 font-bold uppercase">{(order as any).paymentStatus || "Paid"}</strong> ({order.paymentMethod})
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                  <Link
                    href={`/track-order?ref=${order.orderNumber}`}
                    className="bg-black text-white hover:bg-[#C8A46B] px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-colors"
                  >
                    Track Shipment
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl font-sans relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-neutral-200 pb-4 font-label space-y-1">
              <span className="text-[10px] text-[#C8A46B] uppercase tracking-[0.25em] font-semibold block">
                LABEL NUVI ATELIER ORDER RECEIPT
              </span>
              <h2 className="text-2xl font-serif-luxury uppercase tracking-wider font-light text-neutral-900">
                ORDER #{selectedOrder.orderNumber}
              </h2>
              <p className="text-xs text-neutral-500">Placed on {selectedOrder.date}</p>
            </div>

            {/* Workflow Progress Bar */}
            <div className="space-y-2 font-label">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-semibold">
                FULFILLMENT PROGRESS
              </span>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase gap-1 bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200/60 overflow-x-auto">
                {WORKFLOW_STEPS.map((step) => {
                  const stepIndex = WORKFLOW_STEPS.indexOf(step);
                  const currentIndex = WORKFLOW_STEPS.indexOf(selectedOrder.status);
                  const isFinished = stepIndex <= currentIndex && selectedOrder.status !== "Cancelled";
                  return (
                    <div key={step} className="flex items-center space-x-1 shrink-0">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedOrder.status === "Cancelled"
                            ? "bg-red-500"
                            : isFinished
                            ? "bg-black"
                            : "bg-neutral-300"
                        }`}
                      />
                      <span className={isFinished ? "text-neutral-900 font-bold" : "text-neutral-400"}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-neutral-200/60 font-label text-xs space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase block font-bold">Delivery Destination</span>
              <p className="font-bold text-neutral-900">{selectedOrder.shippingAddress.fullName}</p>
              <p className="text-neutral-600">
                {selectedOrder.shippingAddress.addressLine1}
                {selectedOrder.shippingAddress.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ""}
              </p>
              <p className="text-neutral-600">
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-3 font-label">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
                ITEMS PURCHASED ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-neutral-100">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center space-x-4">
                    <div className="relative w-12 h-16 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-neutral-900 uppercase">{item.productName}</p>
                      <p className="text-neutral-500">Color: {item.color} | Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-xs font-label">
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs font-label">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount Promo:</span>
                  <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-neutral-100 pt-2 font-serif-luxury">
                <span>Grand Total Paid:</span>
                <span>₹{selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
