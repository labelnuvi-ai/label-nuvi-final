import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface CMSData {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroCtaText: string;
  heroCtaLink: string;
  announcementBar: string;
}

export const DEFAULT_CMS: CMSData = {
  heroTitle: "ATELIER DROP '26",
  heroSubtitle: "Runway drops engineered for raw confidence.",
  heroBadge: "ATELIER COUTURE • SPRING/SUMMER",
  heroCtaText: "DISCOVER CATALOGUE",
  heroCtaLink: "/shop",
  announcementBar: "COMPLIMENTARY EXPRESS SHIPPING ON ORDERS ABOVE ₹300",
};

export function useCMS() {
  const [cms, setCms] = useState<CMSData>(DEFAULT_CMS);
  const [loading, setLoading] = useState(true);

  const loadCMS = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .eq("id", "homepage")
        .single();

      if (data && !error) {
        setCms({
          heroTitle: data.hero_title || DEFAULT_CMS.heroTitle,
          heroSubtitle: data.hero_subtitle || DEFAULT_CMS.heroSubtitle,
          heroBadge: data.hero_badge || DEFAULT_CMS.heroBadge,
          heroCtaText: data.hero_cta_text || DEFAULT_CMS.heroCtaText,
          heroCtaLink: data.hero_cta_link || DEFAULT_CMS.heroCtaLink,
          announcementBar: data.announcement_bar || DEFAULT_CMS.announcementBar,
        });
      }
    } catch (err) {
      console.warn("CMS fetch warning, using default fallback:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCMS = async (newCms: Partial<CMSData>) => {
    const supabase = createClient();
    const now = new Date().toISOString();

    const merged = { ...cms, ...newCms };

    const dbRow = {
      id: "homepage",
      hero_title: merged.heroTitle,
      hero_subtitle: merged.heroSubtitle,
      hero_badge: merged.heroBadge,
      hero_cta_text: merged.heroCtaText,
      hero_cta_link: merged.heroCtaLink,
      announcement_bar: merged.announcementBar,
      updated_at: now,
    };

    const { error } = await supabase
      .from("cms_content")
      .upsert(dbRow, { onConflict: "id" });

    if (error) {
      console.error("Error saving CMS to Supabase:", error);
      throw error;
    }

    setCms(merged);
    await loadCMS();
  };

  useEffect(() => {
    loadCMS();
  }, [loadCMS]);

  return { cms, loading, saveCMS, refresh: loadCMS };
}
