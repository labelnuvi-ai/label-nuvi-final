import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://labelnuvi.com";
  const now = new Date();

  // Primary Static Routes
  const routes = [
    "",
    "/shop",
    "/about",
    "/account",
    "/cart",
    "/checkout",
    "/privacy",
    "/terms",
    "/return-policy",
    "/track-order",
    "/login",
    "/account/orders",
    "/account/settings",
    "/account/wishlist",
    "/account/addresses",
    "/admin/dashboard",
    "/admin/products",
    "/admin/coupons",
    "/admin/cms",
  ];

  const staticSitemap: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : 0.6,
  }));

  // Featured Product Slugs
  const featuredProductSlugs = [
    "satin-corset-co-ord-set-blush-pink",
    "azure-eclipse-co-ord-set",
    "silk-satin-corset-gown",
    "sculptural-[#1A1A1A]-power-blazer",
  ];

  const productSitemap: MetadataRoute.Sitemap = featuredProductSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticSitemap, ...productSitemap];
}
