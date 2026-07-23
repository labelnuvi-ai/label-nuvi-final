import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, ProductColor, ProductSize, Coupon } from "@/types";
import { fetchCartDb, syncCartDb } from "@/lib/supabase/db";

const COUPONS: Coupon[] = [
  { code: "NUVI10", discountPercent: 10, description: "10% Off Atelier Pieces" },
  { code: "ATELIER20", discountPercent: 20, description: "20% Off Atelier Pieces" },
  { code: "COUTURE50", discountFlat: 50, minSpend: 300, description: "₹50 Off Couture Orders above ₹300" }
];

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, color: ProductColor, size: ProductSize, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  syncCart: (userId: string) => Promise<void>;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => Promise<void>;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: async (product, color, size, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedColor.name === color.name &&
            item.selectedSize === size
        );

        let updatedItems = [...currentItems];

        if (existingIndex > -1) {
          updatedItems[existingIndex].quantity += quantity;
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${color.name}-${size}-${Date.now()}`,
            product,
            selectedColor: color,
            selectedSize: size,
            quantity,
          };
          updatedItems.push(newItem);
        }

        set({ items: updatedItems, isOpen: true });

        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await syncCartDb(user.id, updatedItems);
          }
        } catch (err) {
          console.error("Failed to sync cart item addition with Supabase database:", err);
        }
      },

      removeItem: async (itemId) => {
        const updatedItems = get().items.filter((i) => i.id !== itemId);
        set({ items: updatedItems });

        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await syncCartDb(user.id, updatedItems);
          }
        } catch (err) {
          console.error("Failed to sync cart item removal with Supabase database:", err);
        }
      },

      updateQuantity: async (itemId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(itemId);
          return;
        }

        const updatedItems = get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
        set({ items: updatedItems });

        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await syncCartDb(user.id, updatedItems);
          }
        } catch (err) {
          console.error("Failed to sync cart item quantity update with Supabase database:", err);
        }
      },

      syncCart: async (userId) => {
        try {
          const dbItems = await fetchCartDb(userId);
          set({ items: dbItems });
        } catch (err) {
          console.error("Failed to sync cart with Supabase database:", err);
        }
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const found = COUPONS.find((c) => c.code === cleanCode);
        if (!found) {
          return { success: false, message: "Invalid promo code" };
        }
        const subtotal = get().getSubtotal();
        if (found.minSpend && subtotal < found.minSpend) {
          return {
            success: false,
            message: `Minimum spend of $${found.minSpend} required for code ${found.code}`,
          };
        }
        set({ appliedCoupon: found });
        return { success: true, message: `Promo code ${found.code} applied!` };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      clearCart: async () => {
        set({ items: [], appliedCoupon: null });
        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await syncCartDb(user.id, []);
          }
        } catch (err) {
          console.error("Failed to clear cart database rows during checkout:", err);
        }
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const itemPrice = item.product.salePrice || item.product.price;
          return sum + itemPrice * item.quantity;
        }, 0);
      },

      getDiscountAmount: () => {
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();
        if (coupon.discountPercent) {
          return (subtotal * coupon.discountPercent) / 100;
        }
        if (coupon.discountFlat) {
          return Math.min(coupon.discountFlat, subtotal);
        }
        return 0;
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 300 || subtotal === 0 ? 0 : 25;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "uni-cart-storage",
      partialize: (state) => ({ items: state.items, appliedCoupon: state.appliedCoupon }),
    }
  )
);
