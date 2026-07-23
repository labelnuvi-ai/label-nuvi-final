"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { useProducts } from "@/hooks/useProducts";

export function SearchModal() {
  const { isSearchOpen, closeSearch, query, setQuery } = useSearchStore();
  const { products } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q)
    );
  }, [products, query]);

  const trendingQueries = ["Satin Gown", "Linen Blazer", "Corset Bodysuit", "Cashmere Trench"];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: "-20px" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-20px" }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6] border-b border-neutral-300 shadow-2xl p-6 md:p-10"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif tracking-[0.3em] font-bold uppercase text-neutral-900">
                  SEARCH LABEL NUVI ATELIER
                </span>
                <button
                  onClick={closeSearch}
                  className="p-1 text-neutral-500 hover:text-black transition-colors"
                >
                  <X className="w-6 h-6 stroke-[1.5]" />
                </button>
              </div>

              {/* Input Bar */}
              <div className="relative border-b-2 border-neutral-900 pb-2 flex items-center">
                <Search className="w-5 h-5 text-neutral-400 mr-3 stroke-[1.5]" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SEARCH FOR SILHOUETTES, SATINS, BLAZERS..."
                  className="bg-transparent text-sm md:text-base font-label text-neutral-900 uppercase tracking-widest placeholder-neutral-400 outline-none w-full"
                />
              </div>

              {/* Result List or Trending Search recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                {/* Left: Search Results */}
                <div className="md:col-span-8 space-y-4 max-h-[350px] overflow-y-auto pr-4 no-scrollbar">
                  {query.trim() !== "" && filteredProducts.length === 0 && (
                    <div className="text-xs font-label uppercase tracking-wider text-neutral-400 py-4">
                      No silhouettes found matching your search.
                    </div>
                  )}

                  {filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      onClick={closeSearch}
                      className="flex items-center space-x-4 p-2 rounded-2xl hover:bg-neutral-100/60 transition-all border border-transparent hover:border-neutral-200/50"
                    >
                      <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/20 shrink-0">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 text-xs">
                        <h4 className="font-bold text-neutral-950 uppercase">{p.name}</h4>
                        <p className="text-neutral-400 text-[10px] uppercase">{p.categoryName}</p>
                      </div>
                      <span className="font-bold text-neutral-900 text-xs">${(p.salePrice || p.price).toFixed(2)}</span>
                      <ArrowRight className="w-4 h-4 text-neutral-400 stroke-[1.2]" />
                    </Link>
                  ))}
                </div>

                {/* Right: Trending Searches suggestions */}
                <div className="md:col-span-4 space-y-3.5 border-l border-neutral-200/60 pl-0 md:pl-8">
                  <h5 className="text-[10px] font-label uppercase tracking-widest text-neutral-400 font-bold">
                    TRENDING SEARCHES
                  </h5>
                  <div className="flex flex-col space-y-2.5 text-xs text-neutral-800 font-semibold font-label">
                    {trendingQueries.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="text-left hover:text-[#C8A46B] transition-colors uppercase tracking-wider"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
