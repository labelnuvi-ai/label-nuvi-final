"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-white text-black border-t border-neutral-200/80 pt-12 pb-10 font-sans">
      <div className="max-w-md mx-auto px-6 space-y-8">
        
        {/* Accordion 1: Quick Links */}
        <div className="border-b border-neutral-200 pb-3">
          <button
            onClick={() => setLinksOpen(!linksOpen)}
            className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-black focus:outline-none"
          >
            <span>Quick Links</span>
            {linksOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          
          {linksOpen && (
            <ul className="mt-3 space-y-2.5 text-xs text-neutral-600 uppercase tracking-widest pl-1">
              <li><Link href="/" className="hover:text-black">Home</Link></li>
              <li><Link href="/shop" className="hover:text-black">Collection</Link></li>
              <li><Link href="/about" className="hover:text-black">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-black">Contact</Link></li>
            </ul>
          )}
        </div>

        {/* Accordion 2: Policies */}
        <div className="border-b border-neutral-200 pb-3">
          <button
            onClick={() => setPoliciesOpen(!policiesOpen)}
            className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-black focus:outline-none"
          >
            <span>Policies</span>
            {policiesOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>

          {policiesOpen && (
            <ul className="mt-3 space-y-2.5 text-xs text-neutral-600 uppercase tracking-widest pl-1">
              <li><Link href="/privacy" className="hover:text-black">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-black">Terms of Service</Link></li>
              <li><Link href="/return-policy" className="hover:text-black">Refund Policy</Link></li>
              <li><Link href="/track-order" className="hover:text-black">Shipping Policy</Link></li>
            </ul>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-black">
            Subscribe to our newsletter
          </h4>
          {subscribed ? (
            <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">
              Thank you for subscribing.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border border-black overflow-hidden">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail address*"
                required
                className="w-full bg-[#FAF8F5] text-xs px-4 py-3 outline-none"
              />
              <button
                type="submit"
                className="bg-black text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 transition-colors shrink-0"
              >
                Send
              </button>
            </form>
          )}
          <p className="text-[10px] text-neutral-500 font-sans tracking-wide">
            By subscribing, you understand and agree to our Privacy Policy.
          </p>
        </div>

        {/* Contact info */}
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-black">
            Contact
          </h4>
          <p className="text-xs text-neutral-600 font-sans">
            Contact information goes here for follow-up if necessary. <Link href="/contact" className="underline font-bold text-black">Get in touch</Link>
          </p>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-neutral-400 font-label tracking-widest text-center pt-4 border-t border-neutral-100 uppercase">
          &copy; {new Date().getFullYear()} UNI ATELIER.
        </div>
      </div>
    </footer>
  );
}
