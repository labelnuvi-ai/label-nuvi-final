import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Globe } from "lucide-react";

export const metadata = {
  title: "Terms of Service | LABEL NUVI",
  description: "Terms of Service and legal guidelines for LABEL NUVI luxury e-commerce platform.",
};

export default function TermsOfServicePage() {
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
          TERMS OF SERVICE
        </h1>
        <p className="text-xs font-label uppercase tracking-widest text-[#706C66]">
          Effective Date: July 24, 2026
        </p>
      </div>

      {/* Intro */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-4 text-xs text-[#706C66] leading-relaxed">
        <p className="text-sm font-medium text-[#1A1A1A]">
          Welcome to <span className="font-serif-luxury font-semibold uppercase">Label Nuvi</span>. By using our website or placing an order, you agree to the following Terms of Service.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8">
        {/* Section 1 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">01</span>
            <span>Orders</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            All orders are subject to availability and confirmation. We reserve the right to cancel or refuse any order if necessary.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">02</span>
            <span>Pricing</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            All prices are listed in Indian Rupees (INR) and are subject to change without prior notice.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">03</span>
            <span>Payments</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            We accept secure online payments through our approved payment partners. Orders are processed only after successful payment.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">04</span>
            <span>Shipping</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            Estimated delivery times are provided for reference only and may vary due to courier delays or unforeseen circumstances.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">05</span>
            <span>Returns &amp; Exchanges</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            Returns and exchanges are subject to our Return Policy. Products must be unused, unwashed, and returned with original tags and packaging.
          </p>
        </div>

        {/* Section 6 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">06</span>
            <span>Product Information</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            We make every effort to display product colors and descriptions accurately. However, slight variations may occur due to screen settings and lighting.
          </p>
        </div>

        {/* Section 7 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">07</span>
            <span>Intellectual Property</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            All content on this website, including images, logos, text, and designs, is the property of Label Nuvi and may not be copied or used without written permission.
          </p>
        </div>

        {/* Section 8 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">08</span>
            <span>User Conduct</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            Users agree not to misuse the website, interfere with its operation, or engage in fraudulent activities.
          </p>
        </div>

        {/* Section 9 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">09</span>
            <span>Limitation of Liability</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            Label Nuvi is not liable for indirect or consequential damages arising from the use of this website or purchased products.
          </p>
        </div>

        {/* Section 10 */}
        <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/60 shadow-luxury-xs space-y-3">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">10</span>
            <span>Changes to Terms</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            We may update these Terms of Service at any time. Continued use of the website indicates acceptance of the updated terms.
          </p>
        </div>

        {/* Section 11: Contact Us */}
        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-[24px] border border-[#C8A46B]/40 shadow-luxury-xs space-y-4">
          <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-3">
            <span className="text-[11px] font-label text-[#C8A46B]">11</span>
            <span>Contact Us</span>
          </h2>
          <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
            For any questions regarding these Terms of Service, please contact us at:
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
