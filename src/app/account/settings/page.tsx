"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, LogOut, Shield } from "lucide-react";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Victoria Sterling");
  const [phone, setPhone] = useState("+1 (212) 555-0198");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleLogout = () => {
    // Perform log out action
    router.push("/login");
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-6 lg:px-12 space-y-8 font-sans">
      <Link
        href="/account"
        className="inline-flex items-center text-xs font-label uppercase tracking-widest text-[#706C66] hover:text-black font-semibold"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Account
      </Link>

      <div className="flex justify-between items-center border-b border-neutral-200/60 pb-5">
        <div>
          <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#706C66] font-semibold block">
            ATELIER SECURITY
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

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile details */}
        <div className="md:col-span-8 bg-white p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-5">
          <h3 className="text-xs font-label uppercase tracking-[0.2em] text-[#1a1a1a] font-bold pb-2 border-b border-neutral-100">
            PERSONAL PROFILE
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-label uppercase tracking-wider text-[#706C66] block mb-2">
                Full Profile Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-[#FAF8F5] text-xs font-label px-5 py-3.5 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>

            <div>
              <label className="text-[10px] font-label uppercase tracking-wider text-[#706C66] block mb-2">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-[#FAF8F5] text-xs font-label px-5 py-3.5 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#1A1A1A] text-white text-[10px] font-label uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#C8A46B] transition-colors"
            >
              {saved ? "SAVED CHANGES" : "SAVE DETAILS"}
            </button>
          </div>
        </div>

        {/* Security / password card */}
        <div className="md:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#C8A46B]">
            <Shield className="w-5 h-5 stroke-[1.2]" />
            <h4 className="text-xs font-label uppercase tracking-[0.2em] font-semibold text-[#1a1a1a]">
              SECURITY
            </h4>
          </div>
          <p className="text-[11px] text-[#706C66] leading-relaxed">
            Your login authentication is verified through secure Email One-Time Passcodes (OTP). Password management is not required.
          </p>
        </div>
      </form>
    </div>
  );
}
