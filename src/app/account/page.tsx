"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Heart, MapPin, Settings, LogOut, User } from "lucide-react";
import { MOCK_ORDERS } from "@/lib/data/mockData";
import { useWishlistStore } from "@/store/useWishlistStore";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center text-xs font-label uppercase tracking-widest text-[#706C66]">
        Authenticating Atelier Session...
      </div>
    );
  }

  if (!user) return null;

  const userInitials = user.email ? user.email.slice(0, 2).toUpperCase() : "NU";

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6 flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-neutral-900 text-[#E6D5C3] font-serif text-2xl font-bold flex items-center justify-center">
            {userInitials}
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block">
              LABEL NUVI ATELIER MEMBER
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wider text-neutral-900">
              CLIENT MEMBER
            </h1>
            <p className="text-xs text-neutral-500 font-sans">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-white border border-neutral-200 text-[#1a1a1a] hover:bg-red-50 hover:text-red-600 text-[10px] font-label uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center space-x-1.5 transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4 stroke-[1.2]" />
          <span>LOG OUT</span>
        </button>
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">MY WISHLIST</h3>
            <p className="text-xs text-neutral-500">{wishlistIds.length} saved silhouettes</p>
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">DELIVERY ADDRESSES</h3>
            <p className="text-xs text-neutral-500">Manage billing & shipping</p>
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">ACCOUNT SETTINGS</h3>
            <p className="text-xs text-neutral-500">Security & profile details</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
