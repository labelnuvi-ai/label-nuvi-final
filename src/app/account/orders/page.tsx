"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Truck, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fetchOrdersDb } from "@/lib/supabase/db";
import { Order } from "@/types";

export default function MyOrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const userOrders = await fetchOrdersDb(user.id);
      setOrders(userOrders);
      setLoading(false);
    };
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center text-xs font-label uppercase tracking-widest text-[#706C66]">
        Fetching purchase history...
      </div>
    );
  }

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link href="/account" className="inline-flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-semibold">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Account
      </Link>

      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block">
          PURCHASE HISTORY
        </span>
        <h1 className="text-3xl font-serif font-bold uppercase tracking-wider text-neutral-900">
          MY ORDERS ({orders.length})
        </h1>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-neutral-200/80 text-center space-y-4 shadow-xs">
            <Package className="w-8 h-8 mx-auto text-neutral-400 stroke-[1.2]" />
            <p className="text-xs font-label uppercase tracking-[0.2em] text-[#706C66]">
              No purchase orders found in your client profile.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#1A1A1A] text-white text-[10px] font-label uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#C8A46B] transition-colors"
            >
              SHOP CATALOGUE
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-2">
                <div>
                  <span className="text-xs font-bold text-neutral-900 uppercase">{order.orderNumber}</span>
                  <span className="text-xs text-neutral-500 ml-2">Placed on {order.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                    {order.status}
                  </span>
                  <span className="text-xs font-bold text-neutral-900">${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex space-x-4 items-center">
                    <div className="relative w-16 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs">
                      <h4 className="font-bold text-neutral-900 uppercase">{item.productName}</h4>
                      <p className="text-neutral-500 uppercase text-[10px]">
                        Color: {item.color} | Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-neutral-900 mt-1">${item.unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs flex-wrap gap-2">
                <span className="text-neutral-500">Tracking: {order.trackingNumber || "PENDING DISPATCH"}</span>
                <Link href={`/track-order?ref=${order.orderNumber}`} className="bg-black text-white px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider">
                  Live Courier Status
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
