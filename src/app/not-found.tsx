"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 max-w-xl mx-auto px-4 text-center space-y-6">
      <Compass className="w-16 h-16 text-neutral-300 mx-auto stroke-[1]" />
      <span className="text-[11px] uppercase tracking-[0.4em] text-neutral-400 font-semibold block">
        ERROR 404
      </span>
      <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-wider text-neutral-900">
        PAGE NOT FOUND
      </h1>
      <p className="text-xs text-neutral-500 font-sans max-w-md mx-auto leading-relaxed">
        The couture piece or page you are searching for may have been moved or is currently exclusive to our Paris runway drop.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center space-x-2 bg-[#111111] text-white text-xs uppercase tracking-[0.25em] px-8 py-4 font-semibold rounded-2xl hover:bg-neutral-800 transition-colors shadow-lg"
      >
        <span>RETURN TO STORE</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
