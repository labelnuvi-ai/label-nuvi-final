"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Sliders,
  Package,
  ShoppingBag,
  ArrowLeft,
  Calendar,
  Percent,
  Check,
  PercentSquare,
} from "lucide-react";
import { useCouponStore } from "@/store/useCouponStore";
import { Coupon } from "@/types";

export default function AdminCouponsPage() {
  const { coupons, addCoupon, deleteCoupon, toggleStatus } = useCouponStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "NUVI99",
    discountType: "percentage" as "percentage" | "flat",
    discountValue: "99",
    minPurchase: "0",
    maxDiscount: "",
    status: "Active" as "Active" | "Inactive",
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: "2026-12-31",
    usageLimit: "100",
    description: "99% Off Atelier Order Total",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCoupon: Coupon = {
      id: `cpn-${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue) || 0,
      discountPercent: formData.discountType === "percentage" ? parseFloat(formData.discountValue) || 0 : undefined,
      discountFlat: formData.discountType === "flat" ? parseFloat(formData.discountValue) || 0 : undefined,
      minPurchase: parseFloat(formData.minPurchase) || 0,
      minSpend: parseFloat(formData.minPurchase) || 0,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      status: formData.status,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      usageLimit: parseInt(formData.usageLimit) || 100,
      usedCount: 0,
      description: formData.description || `${formData.discountValue}% Off Order Total`,
    };

    addCoupon(newCoupon);
    setSuccessMessage(`Coupon ${newCoupon.code} created successfully!`);
    setIsModalOpen(false);

    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 gap-4">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center space-x-1 text-xs text-[#706C66] hover:text-black uppercase tracking-wider mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block">
              ATELIER PROMOTIONS & DISCOUNTS
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-wider text-neutral-900 mt-1">
            COUPON MANAGER
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white text-xs uppercase tracking-widest px-5 py-3 font-semibold rounded-2xl flex items-center space-x-2 shadow-md hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE COUPON</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center space-x-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Coupons List Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-200/80 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 flex items-center space-x-2">
            <Tag className="w-4 h-4 text-[#C8A46B]" />
            <span>Active Promotional Coupons ({coupons.length})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[10px] font-label uppercase tracking-widest text-[#706C66] border-b border-neutral-200/80">
                <th className="py-4 px-6 font-semibold">Coupon Code</th>
                <th className="py-4 px-6 font-semibold">Discount</th>
                <th className="py-4 px-6 font-semibold">Min Purchase</th>
                <th className="py-4 px-6 font-semibold">Max Discount</th>
                <th className="py-4 px-6 font-semibold">Validity</th>
                <th className="py-4 px-6 font-semibold">Usage Limit</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 text-xs font-sans">
              {coupons.map((c) => {
                const isNUVI99 = c.code === "NUVI99";
                return (
                  <tr
                    key={c.id || c.code}
                    className={`hover:bg-neutral-50/80 transition-colors ${
                      isNUVI99 ? "bg-amber-50/40 font-medium" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-neutral-900 text-sm tracking-wider bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200">
                          {c.code}
                        </span>
                        {isNUVI99 && (
                          <span className="bg-[#C8A46B] text-white text-[9px] font-label font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            99% OFF SPECIAL
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">{c.description}</p>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-neutral-900">
                        {c.discountType === "percentage" || c.discountPercent !== undefined
                          ? `${c.discountValue ?? c.discountPercent}% OFF`
                          : `₹${c.discountValue ?? c.discountFlat} FLAT`}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-neutral-600">
                      ₹{c.minPurchase ?? c.minSpend ?? 0}
                    </td>

                    <td className="py-4 px-6 text-neutral-600">
                      {c.maxDiscount ? `₹${c.maxDiscount}` : "Unlimited"}
                    </td>

                    <td className="py-4 px-6 text-neutral-500 text-[11px]">
                      <div>From: {c.validFrom || "Today"}</div>
                      <div>Until: {c.validUntil}</div>
                    </td>

                    <td className="py-4 px-6 text-neutral-600 font-mono">
                      {c.usedCount || 0} / {c.usageLimit}
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleStatus(c.id || c.code)}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-label uppercase font-bold tracking-wider transition-colors ${
                          c.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-300 hover:bg-neutral-200"
                        }`}
                      >
                        {c.status === "Active" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-neutral-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => deleteCoupon(c.id || c.code)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
              <div>
                <span className="text-[10px] font-label uppercase tracking-widest text-[#C8A46B] font-semibold">
                  PROMOTIONAL CAMPAIGN
                </span>
                <h3 className="text-xl font-serif font-bold text-neutral-900">
                  CREATE NEW COUPON
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-black p-2 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. NUVI99"
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 font-mono font-bold uppercase focus:ring-1 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-black outline-none bg-white font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Discount Value ({formData.discountType === "percentage" ? "%" : "₹"})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formData.discountType === "percentage" ? "100" : "100000"}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 font-semibold focus:ring-1 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Minimum Purchase (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Max Discount (Leave empty for Unlimited)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Unlimited"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Valid From
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 99% Off Order Total"
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-black outline-none bg-white font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 border border-neutral-300 rounded-2xl font-semibold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-black text-white rounded-2xl font-semibold uppercase tracking-wider hover:bg-neutral-800 shadow-md"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
