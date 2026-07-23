"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { PRODUCTS } from "@/lib/data/mockData";

export function SearchModal() {
  const { isSearchOpen, closeSearch, query, setQuery } = useSearchStore();

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q)
    );
  }, [query]);

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
                <Search className="w-6 h-6 text-neutral-400 mr-3 stroke-[1.5]" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to search gowns, suiting, outerwears..."
                  className="bg-transparent text-lg md:text-2xl font-serif text-neutral-900 w-full focus:outline-none placeholder:text-neutral-400 placeholder:font-sans"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-xs uppercase tracking-widest text-neutral-400 hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Trending suggestions when query empty */}
              {!query && (
                <div className="space-y-3">
                  <h4 className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold">
                    TRENDING SEARCHES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {trendingQueries.map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="text-xs bg-neutral-200/60 hover:bg-neutral-900 hover:text-white px-3 py-1.5 rounded-full transition-colors uppercase tracking-wider text-neutral-700"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {query && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pt-2">
                  <h4 className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold">
                    SEARCH RESULTS ({filteredProducts.length})
                  </h4>

                  {filteredProducts.length === 0 ? (
                    <div className="py-8 text-center text-sm text-neutral-500 uppercase tracking-widest">
                      No couture pieces match your query "{query}"
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={closeSearch}
                          className="group flex space-x-3 p-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-neutral-200"
                        >
                          <div className="relative w-16 h-20 bg-neutral-100 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <h5 className="text-xs font-semibold text-neutral-900 group-hover:text-black line-clamp-1">
                              {product.name}
                            </h5>
                            <p className="text-[11px] text-neutral-500 uppercase tracking-wider">
                              {product.categoryName}
                            </p>
                            <p className="text-xs font-bold text-neutral-900 mt-1">
                              ${(product.salePrice || product.price).toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
