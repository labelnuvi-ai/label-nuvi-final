"use client";

import { useState, use } from "react";
import { Truck, Search, PackageCheck, Clock, CheckCircle2 } from "lucide-react";

interface TrackPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default function TrackOrderPage({ searchParams }: TrackPageProps) {
  const { ref } = use(searchParams);
  const [orderId, setOrderId] = useState(ref || "");
  const [trackedOrder, setTrackedOrder] = useState<any>(ref ? {
    number: ref,
    status: "In Transit - Express Air",
    carrier: "DHL Express Air Worldwide",
    estDelivery: "Friday, July 24, 2026",
    origin: "Paris Atelier Logistics Hub",
    destination: "New York, NY",
    timeline: [
      { status: "Order Placed & Verified", time: "July 21, 09:30 AM", done: true },
      { status: "Tailored & Quality Inspected", time: "July 21, 02:15 PM", done: true },
      { status: "Handed to Express Air Courier", time: "July 21, 06:00 PM", done: true },
      { status: "In Transit - Transatlantic Air Freight", time: "July 22, 04:00 AM", done: false },
      { status: "Out for Final Delivery", time: "Pending", done: false },
    ]
  } : null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setTrackedOrder({
        number: orderId.toUpperCase(),
        status: "In Transit - Express Air",
        carrier: "DHL Express Air Worldwide",
        estDelivery: "Friday, July 24, 2026",
        origin: "Paris Atelier Logistics Hub",
        destination: "New York, NY",
        timeline: [
          { status: "Order Placed & Verified", time: "July 21, 09:30 AM", done: true },
          { status: "Tailored & Quality Inspected", time: "July 21, 02:15 PM", done: true },
          { status: "Handed to Express Air Courier", time: "July 21, 06:00 PM", done: true },
          { status: "In Transit - Transatlantic Air Freight", time: "July 22, 04:00 AM", done: false },
          { status: "Out for Final Delivery", time: "Pending", done: false },
        ]
      });
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block">
          REAL-TIME ATELIER LOGISTICS
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-wider text-neutral-900">
          TRACK YOUR SHIPMENT
        </h1>
      </div>

      {/* Lookup Bar */}
      <form onSubmit={handleLookup} className="bg-white p-4 rounded-3xl border border-neutral-200/80 shadow-xs flex space-x-3 max-w-xl mx-auto">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="ENTER ORDER NUMBER (e.g. UNI-98241)"
          className="bg-[#FAF9F6] text-xs px-4 py-3 w-full rounded-2xl border border-neutral-300 focus:outline-none focus:border-black font-semibold uppercase tracking-wider"
        />
        <button
          type="submit"
          className="bg-black text-white text-xs uppercase tracking-widest px-6 font-semibold rounded-2xl hover:bg-neutral-800 transition-colors flex items-center shrink-0"
        >
          <Search className="w-4 h-4 mr-1.5" />
          <span>TRACK</span>
        </button>
      </form>

      {trackedOrder && (
        <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                {trackedOrder.status}
              </span>
              <h2 className="text-xl font-serif font-bold text-neutral-900 mt-2">{trackedOrder.number}</h2>
              <p className="text-xs text-neutral-500">{trackedOrder.carrier}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-neutral-400 uppercase tracking-wider block">Estimated Delivery</span>
              <span className="text-sm font-bold text-neutral-900">{trackedOrder.estDelivery}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 max-w-md mx-auto pt-2">
            {trackedOrder.timeline.map((step: any, idx: number) => (
              <div key={idx} className="flex items-start space-x-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-black text-white" : "bg-neutral-100 text-neutral-400"}`}>
                  {step.done ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="pt-1">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${step.done ? "text-neutral-900" : "text-neutral-400"}`}>{step.status}</h4>
                  <p className="text-[11px] text-neutral-500">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
