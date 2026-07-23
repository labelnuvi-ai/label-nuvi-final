"use client";

import { useState, useMemo } from "react";
import { Grid3X3, Grid2X2, ChevronDown, RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORIES } from "@/lib/data/mockData";
import { useProducts } from "@/hooks/useProducts";

export default function ShopPage() {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [gridCols, setGridCols] = useState<number>(4);
  const [maxPrice, setMaxPrice] = useState<number>(1500);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    result = result.filter((p) => (p.salePrice || p.price) <= maxPrice);

    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, sortBy, maxPrice]);

  return (
    <div className="py-20 max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
      {/* Page Title & Editorial Header */}
      <div className="text-center space-y-4">
        <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#706C66] font-semibold block">
          THE COMPLETE ATELIER CATALOG
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#1A1A1A]">
          SHOP ALL SILHOUETTES
        </h1>
        <p className="text-xs text-[#706C66] font-sans font-light max-w-lg mx-auto leading-relaxed">
          Liquid Mulberry silk satins, double-breasted flax suiting, second-skin sculpt bodysuits, and virgin cashmere outerwear.
        </p>
      </div>

      {/* Filter & Toolbar */}
      <div className="sticky top-[75px] z-20 bg-[#FAF8F5]/90 backdrop-blur-xl py-5 border-y border-neutral-200/60 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-label uppercase tracking-[0.2em] font-medium transition-all duration-300 shrink-0 ${
              selectedCategory === "all"
                ? "bg-[#1A1A1A] text-[#FAF8F5] shadow-luxury-xs"
                : "bg-white text-[#706C66] hover:bg-[#1A1A1A] hover:text-white border border-neutral-200/60"
            }`}
          >
            All ({products.length})
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-label uppercase tracking-[0.2em] font-medium transition-all duration-300 shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-[#1A1A1A] text-[#FAF8F5] shadow-luxury-xs"
                  : "bg-white text-[#706C66] hover:bg-[#1A1A1A] hover:text-white border border-neutral-200/60"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sorting, Grid controls, Price filter */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-label">
          {/* Price Range Filter Slider */}
          <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-full border border-neutral-200/60">
            <span className="text-[#706C66] text-[10px] tracking-wider uppercase font-semibold">Max: ${maxPrice}</span>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-black w-24 h-1 rounded-lg bg-neutral-200 appearance-none cursor-pointer"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-[#1A1A1A] border border-neutral-200/60 px-5 py-2.5 rounded-full uppercase tracking-wider text-[10px] font-semibold appearance-none cursor-pointer pr-10 focus:outline-none focus:border-black"
            >
              <option value="featured">Featured Drop</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Grid Layout Toggles */}
          <div className="hidden sm:flex bg-white border border-neutral-200/60 rounded-full p-1 items-center">
            <button
              onClick={() => setGridCols(2)}
              className={`p-1.5 rounded-full transition-colors ${
                gridCols === 2 ? "bg-[#1A1A1A] text-white" : "text-[#706C66] hover:text-black"
              }`}
              aria-label="Grid 2x2"
            >
              <Grid2X2 className="w-4 h-4 stroke-[1.2]" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1.5 rounded-full transition-colors ${
                gridCols === 4 ? "bg-[#1A1A1A] text-white" : "text-[#706C66] hover:text-black"
              }`}
              aria-label="Grid 4x4"
            >
              <Grid3X3 className="w-4 h-4 stroke-[1.2]" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
          <p className="text-[10px] font-label uppercase tracking-widest text-[#706C66]">
            Updating Collection Drop...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-xs font-label uppercase tracking-[0.2em] text-[#706C66]">
            No pieces match the active layout filter criteria.
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-x-8 gap-y-12 transition-all duration-500 ${
            gridCols === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
