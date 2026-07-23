"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, ShoppingBag } from "lucide-react";

export function InstagramStyleGallery() {
  const posts = [
    { id: "ig-1", img: "/images/hero-portrait.jpg", tag: "@victoria_sterling", item: "Soren Cowl Gown" },
    { id: "ig-2", img: "/images/category-dresses.jpg", tag: "@camilla_hautecouture", item: "Aura Suiting Set" },
    { id: "ig-3", img: "/images/product-dress-front.jpg", tag: "@elena_vogue", item: "Valeria Sculpt Bodysuit" },
    { id: "ig-4", img: "/images/editorial-banner.jpg", tag: "@parisfashionweek", item: "Celine Cashmere Trench" },
    { id: "ig-5", img: "/images/product-suit-front.jpg", tag: "@fashionblog_la", item: "Aura Sand Blazer" },
  ];

  return (
    <section className="py-24 bg-[#1A1A1A] text-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-[#C8A46B]">
            <Camera className="w-4 h-4 stroke-[1.2]" />
            <span className="text-[10px] font-label uppercase tracking-[0.3em] font-medium">@UNI.HAUTECOUTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#FAF8F5]">
            AS SEEN ON FASHION ICONS
          </h2>
          <p className="text-xs text-neutral-400 font-label tracking-[0.25em] uppercase font-light">
            TAG #UNIATELIER TO BE FEATURED ON OUR GLOBAL EDITORIAL GRID
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-[3/4] rounded-[18px] overflow-hidden bg-neutral-900 shadow-luxury-md"
            >
              <Image
                src={post.img}
                alt={post.tag}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-[#1A1A1A]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-5 text-xs">
                <span className="font-label text-[#C8A46B] text-[11px] font-medium">{post.tag}</span>
                <Link
                  href="/shop"
                  className="bg-[#FAF8F5] text-[#1A1A1A] text-[10px] font-label uppercase tracking-[0.2em] py-2.5 px-3 rounded-full font-semibold flex items-center justify-center space-x-1.5 hover:bg-[#C8A46B] hover:text-white transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-3 h-3 stroke-[1.2]" />
                  <span>SHOP LOOK</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
