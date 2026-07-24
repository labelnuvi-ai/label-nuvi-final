import Link from "next/link";
import { ArrowLeft, Mail, Globe, RotateCcw } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy | LABEL NUVI",
  description: "Returns and refund guidelines for LABEL NUVI luxury e-commerce platform.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-6 font-sans space-y-12">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center text-xs font-label uppercase tracking-widest text-[#706C66] hover:text-black font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Atelier
      </Link>

      {/* Header */}
      <div className="border-b border-neutral-200/80 pb-6 space-y-3">
        <span className="text-[10px] font-label uppercase tracking-[0.35em] text-[#C8A46B] font-semibold block">
          ATELIER CLIENT CARE
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-luxury font-light uppercase tracking-wider text-[#1A1A1A]">
          RETURN &amp; REFUND POLICY
        </h1>
        <p className="text-xs font-label uppercase tracking-widest text-[#706C66]">
          Effective Date: July 24, 2026
        </p>
      </div>

      {/* Policy Details */}
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-[#C8A46B]" />
            <span>14-Day Return Window</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            Products must be unused, unwashed, and returned with original tags and packaging within 14 days of delivery.
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-[24px] border border-[#C8A46B]/40 shadow-luxury-xs space-y-4">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A]">
            Request a Return
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed">
            To initiate a return or exchange, please reach out to our concierge team:
          </p>
          <div className="pt-2 space-y-2 text-xs font-label text-[#1A1A1A]">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#C8A46B]" />
              <span>Email: <a href="mailto:support@labelnuvi.in" className="underline font-semibold hover:text-[#C8A46B]">support@labelnuvi.in</a></span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#C8A46B]" />
              <span>Website: <a href="https://www.labelnuvi.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-[#C8A46B]">www.labelnuvi.in</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
