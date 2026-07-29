"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("LABEL NUVI Application Error Caught:", error);
  }, [error]);

  return (
    <div className="py-24 max-w-xl mx-auto px-6 text-center space-y-6 font-sans">
      <div className="bg-white rounded-3xl p-10 border border-neutral-200/80 shadow-luxury-xs space-y-6 font-label">
        <AlertCircle className="w-12 h-12 text-[#C8A46B] mx-auto stroke-[1.2]" />

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A46B] font-semibold block">
            ATELIER SYSTEM EXCEPTION
          </span>
          <h2 className="text-2xl font-serif-luxury uppercase tracking-wider text-neutral-900">
            SOMETHING UNEXPECTED OCCURRED
          </h2>
          <p className="text-xs text-neutral-500 font-sans leading-relaxed">
            Our digital concierge encountered a brief connectivity glitch while preparing your haute couture experience.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-black text-white text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded-full hover:bg-[#C8A46B] transition-colors inline-flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto bg-neutral-100 text-neutral-900 text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded-full hover:bg-neutral-200 transition-colors inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
