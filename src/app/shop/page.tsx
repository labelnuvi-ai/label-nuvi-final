"use client";

import { useState, useMemo } from "react";
import { Grid3X3, Grid2X2, ChevronDown, RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/data/mockData";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [gridCols, setGridCols] = useState<number>(4);
  const [maxPrice, setMaxPrice] = useState<number>(1500);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

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
  }, [selectedCategory, sortBy, maxPrice]);

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
            All ({PRODUCTS.length})
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

        {/* Right Sort Controls & Grid Toggle */}
        <div className="flex items-center justify-between md:justify-end space-x-5">
          {/* Price Range Slider */}
          <div className="hidden lg:flex items-center space-x-3 text-xs font-label text-[#706C66]">
            <span>Max: ${maxPrice}</span>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-28 accent-[#1A1A1A] cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white text-xs font-label uppercase tracking-[0.2em] text-[#1A1A1A] px-5 py-2.5 pr-9 rounded-full border border-neutral-200/80 font-medium focus:outline-none focus:border-black cursor-pointer shadow-luxury-xs"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.2]" />
          </div>

          {/* Grid Layout Toggle */}
          <div className="hidden sm:flex items-center space-x-1 bg-white border border-neutral-200/80 rounded-full p-1 shadow-luxury-xs">
            <button
              onClick={() => setGridCols(2)}
              className={`p-2 rounded-full transition-colors ${gridCols === 2 ? "bg-[#1A1A1A] text-[#FAF8F5]" : "text-neutral-400"}`}
              title="2 Columns"
            >
              <Grid2X2 className="w-4 h-4 stroke-[1.2]" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-2 rounded-full transition-colors ${gridCols === 4 ? "bg-[#1A1A1A] text-[#FAF8F5]" : "text-neutral-400"}`}
              title="4 Columns"
            >
              <Grid3X3 className="w-4 h-4 stroke-[1.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <p className="text-xs font-label uppercase tracking-[0.2em] text-[#706C66]">
            No products match your criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setMaxPrice(1500);
              setSortBy("featured");
            }}
            className="inline-flex items-center space-x-2 bg-[#1A1A1A] text-[#FAF8F5] text-xs font-label uppercase tracking-[0.2em] px-7 py-3.5 font-medium rounded-full shadow-luxury-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-8 ${
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
