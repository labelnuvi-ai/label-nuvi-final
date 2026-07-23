"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
const LOCAL_ADDRESSES = [
  {
    id: "addr-1",
    label: "Primary Residence",
    fullName: "Victoria Sterling",
    addressLine1: "740 Park Avenue",
    addressLine2: "Apartment 14B",
    city: "New York",
    state: "NY",
    postalCode: "10021",
    country: "United States",
    phone: "+1 (212) 555-0198",
    isDefault: true,
  }
];

export default function AccountAddressesPage() {
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
            ATELIER DELIVERY
          </span>
          <h1 className="text-3xl font-serif-luxury font-light uppercase tracking-wider text-[#1a1a1a]">
            SAVED ADDRESSES
          </h1>
        </div>

        <button className="bg-[#1A1A1A] text-white text-[10px] font-label uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center space-x-1.5 hover:bg-[#C8A46B] transition-colors shadow-sm">
          <Plus className="w-4 h-4 stroke-[1.2]" />
          <span>ADD ADDRESS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {LOCAL_ADDRESSES.map((addr) => (
          <div
            key={addr.id}
            className="bg-white p-6 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-xs font-label font-bold uppercase text-[#1a1a1a]">
                {addr.label}
              </span>
              {addr.isDefault && (
                <span className="text-[8px] font-label font-bold bg-[#C8A46B] text-white px-2 py-0.5 rounded-full">
                  DEFAULT
                </span>
              )}
            </div>

            <div className="text-xs text-[#706C66] space-y-1 font-sans">
              <p className="font-semibold text-black">{addr.fullName}</p>
              <p>{addr.addressLine1}</p>
              {addr.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>
                {addr.city}, {addr.state} {addr.postalCode}
              </p>
              <p>{addr.country}</p>
              <p className="pt-2 text-neutral-400">Phone: {addr.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
