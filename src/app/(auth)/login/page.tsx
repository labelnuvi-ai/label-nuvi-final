"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { LUXURY_EASE } from "@/lib/utils/motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setOtpSent(true);
      }, 800);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/account");
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] grid grid-cols-1 lg:grid-cols-12 max-w-6xl mx-auto my-12 px-6 gap-12 font-sans">
      {/* Left Lookbook Image (6 cols) */}
      <div className="hidden lg:block lg:col-span-6 relative rounded-[24px] overflow-hidden bg-neutral-900 min-h-[500px] shadow-luxury-lg">
        <Image
          src="/images/hero-portrait.jpg"
          alt="UNI Atelier Paris"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-10 text-white space-y-2">
          <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#C8A46B] font-semibold">
            UNI ATELIER
          </span>
          <h2 className="text-3xl font-serif-luxury font-light uppercase tracking-wider leading-none">
            CLIENT CONCIERGE
          </h2>
        </div>
      </div>

      {/* Right Login Form (6 cols) */}
      <div className="lg:col-span-6 flex flex-col justify-center bg-white p-8 sm:p-12 rounded-[24px] border border-neutral-200/50 shadow-luxury-xs space-y-8">
        <div className="space-y-2">
          <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#706C66] font-semibold block">
            ATELIER ACCESS
          </span>
          <h1 className="text-3xl font-serif-luxury font-light uppercase tracking-wider text-[#1a1a1a]">
            MEMBER LOGIN
          </h1>
        </div>

        {/* Google OAuth trigger */}
        <button
          onClick={() => {
            setIsSubmitting(true);
            setTimeout(() => router.push("/account"), 1000);
          }}
          className="w-full bg-[#FAF8F5] text-[#1a1a1a] border border-neutral-200 py-3.5 px-6 rounded-full text-xs font-label uppercase tracking-wider font-semibold flex items-center justify-center space-x-3 hover:border-black transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>CONTINUE WITH GOOGLE</span>
        </button>

        <div className="relative text-center border-b border-neutral-200/60 py-2">
          <span className="bg-white px-4 text-[9px] font-label uppercase tracking-widest text-[#706C66] font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            OR WITH EMAIL OTP
          </span>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="text-[10px] font-label uppercase tracking-wider text-[#706C66] block mb-2">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 stroke-[1.2]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="bg-[#FAF8F5] text-xs font-label pl-12 pr-4 py-4 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a1a1a] text-white text-xs font-label uppercase tracking-[0.2em] py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors flex items-center justify-center space-x-2 shadow-luxury-md"
            >
              <span>SEND PASSCODE</span>
              <ArrowRight className="w-4 h-4 stroke-[1.2]" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="p-3.5 bg-green-50 text-green-800 text-[11px] rounded-xl font-medium uppercase tracking-wider">
              We sent a 6-digit passcode to <strong>{email}</strong>
            </div>

            <div>
              <label className="text-[10px] font-label uppercase tracking-wider text-[#706C66] block mb-2">
                Enter 6-Digit Passcode
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="bg-[#FAF8F5] text-center text-lg font-label tracking-[0.3em] font-bold py-3.5 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a1a1a] text-[#FAF8F5] text-xs font-label uppercase tracking-[0.2em] py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors flex items-center justify-center space-x-2"
            >
              <span>VERIFY CODE & LOG IN</span>
            </button>
          </form>
        )}

        <div className="text-center text-xs text-neutral-500 pt-2 font-label">
          New to UNI?{" "}
          <Link href="/login" className="text-black font-bold underline uppercase tracking-wider">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
