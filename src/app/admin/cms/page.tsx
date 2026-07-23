"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Check } from "lucide-react";
const LOCAL_CMS_HERO = {
  title: "ATELIER DROP '26",
  subtitle: "High Fashion Runway Silhouettes",
  badge: "ATELIER COUTURE • SPRING/SUMMER",
  ctaText: "DISCOVER CATALOGUE",
  ctaLink: "/shop",
};

export default function CMSPage() {
  const [heroData, setHeroData] = useState(LOCAL_CMS_HERO);
  const [announcementText, setAnnouncementText] = useState("COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹300");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link href="/admin/dashboard" className="inline-flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-semibold">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-amber-600 font-semibold block">LIVE FRONTEND EDITOR</span>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-wider text-neutral-900">HOMEPAGE CMS MANAGER</h1>
        </div>

        <button
          onClick={handleSave}
          className="bg-black text-white text-xs uppercase tracking-widest px-6 py-3 font-semibold rounded-2xl flex items-center space-x-1.5 shadow-md"
        >
          {saved ? <Check className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
          <span>{saved ? "SAVED TO LIVE SITE" : "SAVE CMS CHANGES"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Hero Banner Config */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-900 pb-2 border-b border-neutral-200">
            1. HERO BANNER CONFIGURATION
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-wider text-neutral-600 block mb-1">
                Main Hero Title
              </label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                className="bg-[#FAF9F6] text-xs px-4 py-3 w-full rounded-xl border border-neutral-300 font-semibold uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-600 block mb-1">
                Subtitle Campaign
              </label>
              <input
                type="text"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                className="bg-[#FAF9F6] text-xs px-4 py-3 w-full rounded-xl border border-neutral-300 font-semibold uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-600 block mb-1">
                Top Badge Text
              </label>
              <input
                type="text"
                value={heroData.badge}
                onChange={(e) => setHeroData({ ...heroData, badge: e.target.value })}
                className="bg-[#FAF9F6] text-xs px-4 py-3 w-full rounded-xl border border-neutral-300 font-semibold uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-600 block mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={heroData.ctaText}
                onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                className="bg-[#FAF9F6] text-xs px-4 py-3 w-full rounded-xl border border-neutral-300 font-semibold uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-600 block mb-1">
                Primary CTA Destination Link
              </label>
              <input
                type="text"
                value={heroData.ctaLink}
                onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                className="bg-[#FAF9F6] text-xs px-4 py-3 w-full rounded-xl border border-neutral-300 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Top Announcement Bar */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-900 pb-2 border-b border-neutral-200">
            2. TOP ANNOUNCEMENT TICKER
          </h2>
          <div>
            <label className="text-xs uppercase tracking-wider text-neutral-600 block mb-1">
              Ticker Announcement Text
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="bg-[#FAF9F6] text-xs px-4 py-3 w-full rounded-xl border border-neutral-300 font-semibold uppercase tracking-wider"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
