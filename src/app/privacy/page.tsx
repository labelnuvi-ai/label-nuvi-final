import Link from "next/link";
import { ArrowLeft, Mail, Globe } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | LABEL NUVI",
  description: "Privacy Policy for LABEL NUVI luxury e-commerce platform.",
};

export default function PrivacyPolicyPage() {
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
          ATELIER LEGAL & GOVERNANCE
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-luxury font-light uppercase tracking-wider text-[#1A1A1A]">
          PRIVACY POLICY
        </h1>
        <p className="text-xs font-label uppercase tracking-widest text-[#706C66]">
          Effective Date: July 24, 2026
        </p>
      </div>

      {/* Intro */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-4 text-xs text-[#706C66] leading-relaxed">
        <p className="text-sm font-medium text-[#1A1A1A]">
          At <span className="font-serif-luxury font-semibold uppercase">Label Nuvi</span>, we respect your privacy and are committed to protecting the personal data you share with us.
        </p>
        <p>
          This Privacy Policy outlines how we collect, use, store, and safeguard your information when you interact with our website and couture services.
        </p>
      </div>

      {/* Policy Details */}
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A]">
            Information We Collect
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            We collect personal details such as your full name, email address, phone number, shipping address, and payment confirmation status required to fulfill your orders securely.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A]">
            How We Use Your Data
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            Your information is used strictly to process orders, facilitate courier deliveries, send transaction updates, and improve your overall luxury shopping experience.
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-[24px] border border-[#C8A46B]/40 shadow-luxury-xs space-y-4">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A]">
            Contact Privacy Support
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed">
            If you have questions or wish to exercise your data privacy rights, reach out to us at:
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
