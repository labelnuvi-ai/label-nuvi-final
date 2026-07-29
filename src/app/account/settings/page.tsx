"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, LogOut, Shield, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fetchProfile, updateProfile } from "@/lib/supabase/db";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function AccountSettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const clearCart = useCartStore((s) => s.clearCart);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      setEmail(user.email || "");

      try {
        const profile = await fetchProfile(user.id);
        if (profile) {
          setFullName(profile.full_name || user.user_metadata?.full_name || "");
          setPhone(profile.phone || "");
        } else {
          setFullName(user.user_metadata?.full_name || "");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    try {
      await updateProfile(userId, { full_name: fullName, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await clearCart();
    clearWishlist();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center text-xs font-label uppercase tracking-widest text-[#706C66]">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
        <span>Loading Account Profile...</span>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-6 lg:px-12 space-y-8 font-sans">
      <Link
        href="/account"
        className="inline-flex items-center text-xs font-label uppercase tracking-widest text-[#706C66] hover:text-black font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Account
      </Link>

      <div className="flex justify-between items-center border-b border-neutral-200/60 pb-5">
        <div>
          <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block">
            CLIENT SECURITY & PROFILE
          </span>
          <h1 className="text-3xl font-serif-luxury font-light uppercase tracking-wider text-[#1a1a1a]">
            ACCOUNT SETTINGS
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#1A1A1A] text-white text-[10px] font-label uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center space-x-1.5 hover:bg-red-600 transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4 stroke-[1.2]" />
          <span>LOG OUT</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-8 font-label">
        {/* Profile details */}
        <div className="md:col-span-8 bg-white p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-5">
          <h3 className="text-xs font-label uppercase tracking-[0.2em] text-[#1a1a1a] font-bold pb-2 border-b border-neutral-100">
            PERSONAL PROFILE DETAILS
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                Account Email Address (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="bg-neutral-100 text-neutral-500 text-xs font-label px-5 py-3.5 w-full rounded-full border border-neutral-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[10px] font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                Full Client Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-[#FAF8F5] text-xs font-label px-5 py-3.5 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>

            <div>
              <label className="text-[10px] font-label uppercase tracking-wider text-[#706C66] block mb-2 font-semibold">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="bg-[#FAF8F5] text-xs font-label px-5 py-3.5 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#1A1A1A] text-white text-[10px] font-label uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#C8A46B] transition-colors disabled:bg-neutral-300"
            >
              {isSaving ? "SAVING TO SUPABASE..." : saved ? "SAVED CHANGES ✓" : "SAVE PROFILE DETAILS"}
            </button>
          </div>
        </div>

        {/* Security Info Card */}
        <div className="md:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-4 font-label">
          <div className="flex items-center space-x-2 text-[#C8A46B]">
            <Shield className="w-5 h-5 stroke-[1.2]" />
            <h4 className="text-xs font-label uppercase tracking-[0.2em] font-semibold text-[#1a1a1a]">
              ENCRYPTED AUTH
            </h4>
          </div>
          <p className="text-[11px] text-[#706C66] leading-relaxed font-sans">
            Your login authentication is protected via Supabase Auth magic links and encrypted session tokens. Profile updates sync instantly across your client account.
          </p>
        </div>
      </form>
    </div>
  );
}
