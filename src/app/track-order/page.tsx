"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, Search, PackageCheck, Clock, CheckCircle2, ExternalLink, ShieldCheck, RefreshCw } from "lucide-react";
import { trackOrderLive } from "@/lib/shipping/shippingEngine";

interface TrackPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default function TrackOrderPage({ searchParams }: TrackPageProps) {
  const { ref } = use(searchParams);
  const [orderInput, setOrderInput] = useState(ref || "");
  const [loading, setLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const performLookup = async (queryRef: string) => {
    if (!queryRef.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await trackOrderLive(queryRef);
      if (data) {
        setTrackedOrder(data);
      } else {
        setErrorMsg(`No active shipment found matching reference '${queryRef}'.`);
        setTrackedOrder(null);
      }
    } catch (err) {
      console.error("Tracking error:", err);
      setErrorMsg("Failed to query logistics database. Please check reference and retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ref) {
      performLookup(ref);
    }
  }, [ref]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(orderInput);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 font-sans">
      <div className="text-center space-y-2 font-label">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block">
          HAUTE COUTURE SHIPMENT LOGISTICS
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-light uppercase tracking-wider text-neutral-900">
          TRACK YOUR COURIER
        </h1>
      </div>

      {/* Lookup Bar */}
      <form onSubmit={handleLookup} className="bg-white p-4 rounded-3xl border border-neutral-200/80 shadow-luxury-xs flex space-x-3 max-w-xl mx-auto font-label">
        <input
          type="text"
          value={orderInput}
          onChange={(e) => setOrderInput(e.target.value)}
          placeholder="ENTER ORDER # (e.g. NUVI-98241)"
          className="bg-[#FAF9F6] text-xs px-4 py-3 w-full rounded-2xl border border-neutral-300 focus:outline-none focus:border-black font-mono font-bold uppercase tracking-wider"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white text-xs uppercase tracking-widest px-6 py-3 font-semibold rounded-2xl hover:bg-[#C8A46B] transition-colors flex items-center shrink-0 disabled:bg-neutral-300"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-1.5" /> : <Search className="w-4 h-4 mr-1.5" />}
          <span>{loading ? "SEARCHING..." : "TRACK"}</span>
        </button>
      </form>

      {errorMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-center text-xs font-label uppercase tracking-wider font-semibold max-w-xl mx-auto">
          {errorMsg}
        </div>
      )}

      {trackedOrder && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-luxury-xs space-y-8 font-label">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4 text-xs">
            <div>
              <span
                className={`inline-block text-[10px] uppercase font-bold px-3 py-1 rounded-full ${
                  trackedOrder.status === "Cancelled"
                    ? "bg-red-100 text-red-900"
                    : trackedOrder.status === "Delivered"
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {trackedOrder.status}
              </span>
              <h2 className="text-2xl font-serif-luxury uppercase tracking-wider font-light text-neutral-900 mt-2">
                {trackedOrder.orderNumber}
              </h2>
              <p className="text-neutral-500">{trackedOrder.carrier} &bull; AWB: <strong className="font-mono">{trackedOrder.trackingNumber}</strong></p>
            </div>

            <div className="sm:text-right space-y-2">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">Estimated Delivery</span>
                <span className="text-sm font-bold text-neutral-900">{trackedOrder.estDelivery}</span>
              </div>
              <a
                href={trackedOrder.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 bg-black text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-[#C8A46B] transition-colors"
              >
                <span>OPEN COURIER PORTAL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 max-w-md mx-auto pt-2">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold text-center">
              SHIPMENT PROGRESS TIMELINE
            </span>

            {trackedOrder.timeline.map((step: any, idx: number) => (
              <div key={idx} className="flex items-start space-x-4 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    step.done ? "bg-black text-white shadow-md" : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {step.done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="pt-0.5">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${step.done ? "text-neutral-900" : "text-neutral-400"}`}>
                    {step.status}
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-sans mt-0.5">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
