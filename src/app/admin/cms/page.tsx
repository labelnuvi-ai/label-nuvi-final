"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Check, RefreshCw } from "lucide-react";
import { useCMS, DEFAULT_CMS } from "@/hooks/useCMS";

export default function CMSPage() {
  const { cms, loading: cmsLoading, saveCMS } = useCMS();

  const [heroTitle, setHeroTitle] = useState(DEFAULT_CMS.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(DEFAULT_CMS.heroSubtitle);
  const [heroBadge, setHeroBadge] = useState(DEFAULT_CMS.heroBadge);
  const [heroCtaText, setHeroCtaText] = useState(DEFAULT_CMS.heroCtaText);
  const [heroCtaLink, setHeroCtaLink] = useState(DEFAULT_CMS.heroCtaLink);
  const [announcementBar, setAnnouncementBar] = useState(DEFAULT_CMS.announcementBar);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (cms) {
      setHeroTitle(cms.heroTitle);
      setHeroSubtitle(cms.heroSubtitle);
      setHeroBadge(cms.heroBadge);
      setHeroCtaText(cms.heroCtaText);
      setHeroCtaLink(cms.heroCtaLink);
      setAnnouncementBar(cms.announcementBar);
    }
  }, [cms]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveCMS({
        heroTitle,
        heroSubtitle,
        heroBadge,
        heroCtaText,
        heroCtaLink,
        announcementBar,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Failed to save CMS settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      <Link href="/admin/dashboard" className="inline-flex items-center text-xs font-label uppercase tracking-widest text-neutral-500 hover:text-black font-semibold">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block">
            SUPABASE DATABASE CMS EDITOR
          </span>
          <h1 className="text-3xl font-serif-luxury font-light uppercase tracking-wider text-neutral-900">
            HOMEPAGE CMS MANAGER
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || cmsLoading}
          className="bg-black text-white text-xs font-label uppercase tracking-widest px-6 py-3.5 font-semibold rounded-full flex items-center space-x-1.5 shadow-md hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
          ) : saved ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? "SAVING..." : saved ? "SAVED TO SUPABASE" : "SAVE CMS CHANGES"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs font-label">
        {/* Section 1: Hero Banner Config */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200/80 shadow-luxury-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-900">
              1. HERO BANNER CONFIGURATION
            </h2>
            <span className="text-[10px] uppercase font-semibold text-[#C8A46B]">LIVE FRONTEND SPOTLIGHT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                Main Hero Title
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. ATELIER DROP '26"
                className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 font-semibold uppercase tracking-wider focus:outline-none focus:border-black font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                Subtitle Campaign Narrative
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="e.g. Runway drops engineered for raw confidence."
                className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 font-medium focus:outline-none focus:border-black font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                Top Badge Tagline
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="e.g. ATELIER COUTURE • SPRING/SUMMER"
                className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 font-semibold uppercase tracking-wider focus:outline-none focus:border-black font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={heroCtaText}
                onChange={(e) => setHeroCtaText(e.target.value)}
                placeholder="e.g. DISCOVER CATALOGUE"
                className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 font-semibold uppercase tracking-wider focus:outline-none focus:border-black font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                Primary CTA Destination Link
              </label>
              <input
                type="text"
                value={heroCtaLink}
                onChange={(e) => setHeroCtaLink(e.target.value)}
                placeholder="e.g. /shop or /collections/atelier-drop-26"
                className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 font-medium focus:outline-none focus:border-black font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Top Announcement Bar */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200/80 shadow-luxury-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-900">
              2. TOP ANNOUNCEMENT TICKER
            </h2>
            <span className="text-[10px] uppercase font-semibold text-[#C8A46B]">HEADER ANNOUNCEMENT</span>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
              Ticker Announcement Text
            </label>
            <input
              type="text"
              value={announcementBar}
              onChange={(e) => setAnnouncementBar(e.target.value)}
              placeholder="e.g. COMPLIMENTARY EXPRESS SHIPPING ON ORDERS ABOVE ₹300"
              className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 font-semibold uppercase tracking-wider focus:outline-none focus:border-black font-sans"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
