"use client";

import Link from "next/link";
import { Package, Heart, MapPin, Settings, LogOut, User } from "lucide-react";
import { MOCK_ORDERS, MOCK_ADDRESSES } from "@/lib/data/mockData";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function AccountPage() {
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="flex items-center space-x-4 border-b border-neutral-200 pb-6">
        <div className="w-16 h-16 rounded-full bg-neutral-900 text-[#E6D5C3] font-serif text-2xl font-bold flex items-center justify-center">
          VS
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block">
            LABEL NUVI ATELIER MEMBER
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wider text-neutral-900">
            VICTORIA STERLING
          </h1>
          <p className="text-xs text-neutral-500 font-sans">victoria.sterling@vogue.com</p>
        </div>
      </div>

      {/* Account Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/account/orders"
          className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all space-y-4 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
            <Package className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">MY ORDERS</h3>
            <p className="text-xs text-neutral-500">{MOCK_ORDERS.length} active atelier order</p>
          </div>
        </Link>

        <Link
          href="/account/wishlist"
          className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all space-y-4 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
            <Heart className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">SAVED WISHLIST</h3>
            <p className="text-xs text-neutral-500">{wishlistIds.length} saved couture pieces</p>
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all space-y-4 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
            <MapPin className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">ADDRESSES</h3>
            <p className="text-xs text-neutral-500">{MOCK_ADDRESSES.length} default delivery address</p>
          </div>
        </Link>

        <Link
          href="/account/settings"
          className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all space-y-4 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
            <Settings className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">SETTINGS</h3>
            <p className="text-xs text-neutral-500">Security & email preferences</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 space-y-6">
        <h2 className="text-sm font-serif uppercase tracking-[0.2em] font-bold text-neutral-900">
          RECENT ORDER ACTIVITY
        </h2>
        {MOCK_ORDERS.map((ord) => (
          <div key={ord.id} className="p-4 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md">
                {ord.status}
              </span>
              <h4 className="text-xs font-bold text-neutral-900 mt-2">{ord.orderNumber} • {ord.date}</h4>
              <p className="text-xs text-neutral-500">{ord.items.length} items • Total ${ord.total}</p>
            </div>
            <Link
              href={`/track-order?ref=${ord.orderNumber}`}
              className="bg-black text-white text-xs uppercase tracking-widest px-4 py-2 font-semibold rounded-xl text-center"
            >
              Track Courier Delivery
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
