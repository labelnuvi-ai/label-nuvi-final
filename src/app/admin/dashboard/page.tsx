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
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useProducts } from "@/hooks/useProducts";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { products, loading: productsLoading } = useProducts();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbProfilesCount, setDbProfilesCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      try {
        // Fetch Orders
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        if (orders) {
          setDbOrders(orders);
        }

        // Fetch Profiles Count
        const { count } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        setDbProfilesCount(count || 0);

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute metrics
  const totalRevenue = dbOrders.reduce((acc, order) => acc + Number(order.total), 0);
  const ordersCount = dbOrders.length;
  const productsCount = products.length;

  if (loading || productsLoading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center text-xs font-label uppercase tracking-widest text-[#706C66]">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
        <span>Authenticating Admin Credentials...</span>
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
          <p className="text-3xl font-serif font-bold text-neutral-900">${totalRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-green-700 font-medium">+18.4% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Orders Received</span>
            <ShoppingBag className="w-4 h-4 text-black" />
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900">{ordersCount}</p>
          <p className="text-[11px] text-neutral-500 font-medium">98.2% fulfillment rate</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Active Products</span>
            <Package className="w-4 h-4 text-black" />
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900">{productsCount}</p>
          <p className="text-[11px] text-neutral-500 font-medium">Couture catalog drop</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Registered VIP Clients</span>
            <Users className="w-4 h-4 text-black" />
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900">{dbProfilesCount}</p>
          <p className="text-[11px] text-green-700 font-medium">Registered members</p>
        </div>
      </div>

      {/* Orders & Products Management Table Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-neutral-200/80 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <h3 className="text-sm font-serif font-bold uppercase tracking-wider">RECENT CLIENT ORDERS</h3>
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Live Feed
            </span>
          </div>

          <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto no-scrollbar">
            {dbOrders.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6">No client orders recorded yet.</p>
            ) : (
              dbOrders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-4 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-neutral-900">{ord.order_number}</p>
                    <p className="text-neutral-400">{ord.date} &bull; {ord.payment_method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900">${Number(ord.total).toFixed(2)}</p>
                    <p className="text-green-700 font-semibold">{ord.status}</p>
                  </div>
                </div>
              ))
            )}
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

          <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto no-scrollbar">
            {products.slice(0, 5).map((p) => (
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
