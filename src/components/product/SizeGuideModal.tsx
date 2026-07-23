"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import { useQuickViewStore } from "@/store/useQuickViewStore";

export function SizeGuideModal() {
  const { isSizeGuideOpen, closeSizeGuide } = useQuickViewStore();
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  const measurements = [
    { size: "XXS", bust: unit === "cm" ? "76-80" : "30-31.5", waist: unit === "cm" ? "58-62" : "23-24.5", hips: unit === "cm" ? "84-88" : "33-34.5" },
    { size: "XS", bust: unit === "cm" ? "81-85" : "32-33.5", waist: unit === "cm" ? "63-67" : "25-26.5", hips: unit === "cm" ? "89-93" : "35-36.5" },
    { size: "S", bust: unit === "cm" ? "86-90" : "34-35.5", waist: unit === "cm" ? "68-72" : "27-28.5", hips: unit === "cm" ? "94-98" : "37-38.5" },
    { size: "M", bust: unit === "cm" ? "91-95" : "36-37.5", waist: unit === "cm" ? "73-77" : "29-30.5", hips: unit === "cm" ? "99-103" : "39-40.5" },
    { size: "L", bust: unit === "cm" ? "96-101" : "38-40", waist: unit === "cm" ? "78-83" : "31-32.5", hips: unit === "cm" ? "104-109" : "41-43" },
    { size: "XL", bust: unit === "cm" ? "102-107" : "40.5-42", waist: unit === "cm" ? "84-89" : "33-35", hips: unit === "cm" ? "110-115" : "43.5-45" },
  ];

  return (
    <AnimatePresence>
      {isSizeGuideOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSizeGuide}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-black stroke-[1.5]" />
                <h3 className="text-sm font-serif tracking-[0.2em] font-bold uppercase text-neutral-900">
                  LABEL NUVI ATELIER SIZE GUIDE
                </h3>
              </div>
              <button onClick={closeSizeGuide} className="text-neutral-500 hover:text-black">
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500">All garments are true to couture sizing.</span>
              <div className="flex bg-neutral-100 p-1 rounded-lg">
                <button
                  onClick={() => setUnit("cm")}
                  className={`px-3 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                    unit === "cm" ? "bg-black text-white" : "text-neutral-600"
                  }`}
                >
                  CM
                </button>
                <button
                  onClick={() => setUnit("in")}
                  className={`px-3 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                    unit === "in" ? "bg-black text-white" : "text-neutral-600"
                  }`}
                >
                  INCHES
                </button>
              </div>
            </div>

            {/* Measurements Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-neutral-800">
                <thead className="bg-neutral-100 uppercase tracking-wider text-[10px] text-neutral-600">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Bust ({unit})</th>
                    <th className="py-2.5 px-3">Waist ({unit})</th>
                    <th className="py-2.5 px-3">Hips ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {measurements.map((m) => (
                    <tr key={m.size} className="hover:bg-neutral-50">
                      <td className="py-2.5 px-3 font-bold">{m.size}</td>
                      <td className="py-2.5 px-3">{m.bust}</td>
                      <td className="py-2.5 px-3">{m.waist}</td>
                      <td className="py-2.5 px-3">{m.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-neutral-500 italic">
              * Need personal styling sizing assistance? Email our atelier concierge at concierge@uni.com
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
