"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useSearchStore } from "@/store/useSearchStore";
import { springLuxury } from "@/lib/utils/motion";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const openSearch = useSearchStore((s) => s.openSearch);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  const collections = [
    { name: "New Arrivals", href: "/collections/atelier-drop-26" },
    { name: "Couture Gowns", href: "/categories/couture-dresses" },
    { name: "Tailored Suiting", href: "/categories/tailored-suiting" },
    { name: "Cashmere Outerwear", href: "/categories/atelier-outerwear" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-700 ${
          isScrolled
            ? "glass-header shadow-luxury-xs py-4"
            : "bg-[#FAF8F5]/90 backdrop-blur-md py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex items-center justify-between">
          {/* Left Navigation */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-1 text-[#1A1A1A] hover:text-[#C8A46B] transition-colors focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 stroke-[1]" />
            </button>

            <nav className="hidden lg:flex items-center space-x-12 text-[13px] font-label font-bold tracking-[0.22em] uppercase text-[#1A1A1A]">
              {collections.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`hover:text-[#C8A46B] transition-colors relative py-1 ${
                    pathname === link.href ? "text-[#1A1A1A] font-extrabold" : "text-[#1A1A1A]/70"
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1A1A1A]"
                    />
                  )}
                </Link>
              ))}
              <Link href="/shop" className="text-[#1A1A1A]/70 hover:text-[#C8A46B] transition-colors py-1">Catalog</Link>
            </nav>
          </div>

          {/* Center Brandmark */}
          <Link href="/" className="text-center group">
            <span className="text-5xl font-serif-luxury tracking-[0.5em] text-[#1A1A1A] font-medium uppercase transition-transform duration-700 group-hover:scale-[1.02] block pl-[0.5em]">
              UNI
            </span>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={openSearch}
              className="p-1 text-[#1A1A1A] hover:text-[#C8A46B] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[1.2]" />
            </button>

            <Link
              href="/account"
              className="hidden sm:block p-1 text-[#1A1A1A] hover:text-[#C8A46B] transition-colors"
              aria-label="Account"
            >
              <User className="w-4 h-4 stroke-[1.2]" />
            </Link>

            <Link
              href="/account/wishlist"
              className="p-1 text-[#1A1A1A] hover:text-[#C8A46B] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[1.2]" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#1A1A1A] text-[#FAF8F5] text-[7px] font-label font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className="p-1 text-[#1A1A1A] hover:text-[#C8A46B] transition-colors relative flex items-center"
              aria-label="Open Bag"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.2]" />
              <span className="ml-1.5 text-[10px] font-label font-medium text-[#1A1A1A]">
                ({itemCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Large Slide-Over Mobile Nav Menu (Clean Minimalist Style) */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm lg:hidden"
            />
            
            {/* Drawer Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={springLuxury}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-[#FAF8F5] p-8 flex flex-col justify-between lg:hidden overflow-y-auto no-scrollbar shadow-2xl font-sans"
            >
              {/* Drawer Content */}
              <div className="space-y-12">
                {/* Header */}
                <div className="flex items-center justify-between pb-2">
                  <span className="text-2xl font-bold uppercase tracking-wider text-black font-serif-luxury">
                    UNI
                  </span>
                  <button
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-1 text-[#1A1A1A]"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 stroke-[1]" />
                  </button>
                </div>

                {/* Navigation Links list */}
                <nav className="flex flex-col space-y-6 text-lg text-neutral-800 tracking-wide font-medium">
                  <Link href="/shop" onClick={() => setIsMobileNavOpen(false)} className="hover:text-black">
                    Shop All
                  </Link>
                  <Link href="/collections/atelier-drop-26" onClick={() => setIsMobileNavOpen(false)} className="hover:text-black">
                    New Arrivals
                  </Link>
                  <Link href="/categories/couture-dresses" onClick={() => setIsMobileNavOpen(false)} className="hover:text-black">
                    Dresses
                  </Link>
                  <Link href="/categories/sculpt-contour" onClick={() => setIsMobileNavOpen(false)} className="hover:text-black">
                    Tops
                  </Link>
                  <Link
                    href="/account/wishlist"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center space-x-2.5 hover:text-black"
                  >
                    <Heart className="w-4 h-4 stroke-[1.5]" />
                    <span>Wishlist</span>
                  </Link>
                </nav>
              </div>

              {/* Bottom Support Section & Account Section */}
              <div className="space-y-6 border-t border-neutral-200/80 pt-8 mt-12">
                <div className="space-y-1">
                  <span className="text-xs text-neutral-400 font-medium">Need help?</span>
                  <div className="flex flex-col space-y-3.5 text-sm text-neutral-800 font-medium">
                    <Link href="/about" onClick={() => setIsMobileNavOpen(false)} className="hover:text-black">
                      Customer Service
                    </Link>
                    <Link href="/track-order" onClick={() => setIsMobileNavOpen(false)} className="hover:text-black">
                      Returns & Exchanges
                    </Link>
                    <Link href="/account" onClick={() => setIsMobileNavOpen(false)} className="hover:text-black font-semibold text-black">
                      My Account
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
