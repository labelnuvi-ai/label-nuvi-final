"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Sliders,
  Sparkles,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { PRODUCTS, MOCK_ORDERS } from "@/lib/data/mockData";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    verifyAdmin();
  }, []);

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center text-xs font-label uppercase tracking-widest text-[#706C66]">
        Authenticating Admin Credentials...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block">
            ATELIER ADMIN PORTAL
          </span>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-wider text-neutral-900">
            EXECUTIVE DASHBOARD
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/cms"
            className="bg-[#111111] text-[#E6D5C3] text-xs uppercase tracking-widest px-4 py-3 font-semibold rounded-2xl flex items-center space-x-1.5 shadow-md"
          >
            <Sliders className="w-4 h-4" />
            <span>MANAGE HOMEPAGE CMS</span>
          </Link>
          <Link
            href="/admin/products"
            className="bg-black text-white text-xs uppercase tracking-widest px-4 py-3 font-semibold rounded-2xl flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Total Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900">$128,450.00</p>
          <p className="text-[11px] text-green-700 font-medium">+18.4% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Orders Delivered</span>
            <ShoppingBag className="w-4 h-4 text-black" />
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900">342</p>
          <p className="text-[11px] text-neutral-500 font-medium">98.2% fulfillment rate</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Active Products</span>
            <Package className="w-4 h-4 text-black" />
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900">{PRODUCTS.length}</p>
          <p className="text-[11px] text-neutral-500 font-medium">4 categories active</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Registered VIP Clients</span>
            <Users className="w-4 h-4 text-black" />
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900">1,280</p>
          <p className="text-[11px] text-green-700 font-medium">+42 new this week</p>
        </div>
      </div>

      {/* Orders & Products Management Table Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-neutral-200/80 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <h3 className="text-sm font-serif font-bold uppercase tracking-wider">RECENT CLIENT ORDERS</h3>
            <Link href="/admin/orders" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black">
              View All Orders &rarr;
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {MOCK_ORDERS.map((ord) => (
              <div key={ord.id} className="py-4 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-neutral-900">{ord.orderNumber}</p>
                  <p className="text-neutral-400">{ord.date} &bull; {ord.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-900">${ord.total}</p>
                  <p className="text-green-700 font-semibold">{ord.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-neutral-200/80 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <h3 className="text-sm font-serif font-bold uppercase tracking-wider">CATALOG OVERVIEW</h3>
            <Link href="/admin/products" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black">
              Manage Products &rarr;
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {PRODUCTS.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-neutral-900">{p.name}</p>
                  <p className="text-neutral-400">{p.categoryName}</p>
                </div>
                <p className="font-bold text-neutral-900">${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
