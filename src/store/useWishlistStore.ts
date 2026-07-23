import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchWishlist, addToWishlistDb, removeFromWishlistDb } from "@/lib/supabase/db";

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  syncWishlist: (userId: string) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: async (productId) => {
        const current = get().wishlistIds;
        const exists = current.includes(productId);

        // Update local state instantly for optimal UX response
        if (exists) {
          set({ wishlistIds: current.filter((id) => id !== productId) });
        } else {
          set({ wishlistIds: [...current, productId] });
        }

        // Fetch active session dynamically inside store
        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            if (exists) {
              await removeFromWishlistDb(user.id, productId);
            } else {
              await addToWishlistDb(user.id, productId);
            }
          }
        } catch (err) {
          console.error("Failed to sync wishlist change with Supabase database:", err);
        }
      },
      isInWishlist: (productId) => get().wishlistIds.includes(productId),
      syncWishlist: async (userId) => {
        try {
          const dbIds = await fetchWishlist(userId);
          set({ wishlistIds: dbIds });
        } catch (err) {
          console.error("Failed to fetch wishlist from database:", err);
        }
      },
      clearWishlist: () => set({ wishlistIds: [] }),
    }),
    {
      name: "uni-wishlist-storage",
    }
  )
);
