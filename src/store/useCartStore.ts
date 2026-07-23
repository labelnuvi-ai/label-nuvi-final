import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, ProductColor, ProductSize, Coupon } from "@/types";
import { MOCK_COUPONS } from "@/lib/data/mockData";

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, color: ProductColor, size: ProductSize, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "cart-item-1",
          product: {
            id: "prod-1",
            name: "Soren Cowl Satin Midi Dress",
            slug: "soren-cowl-satin-midi-dress",
            subtitle: "Liquid Silk Draped Floor-Length Gown",
            description: "",
            details: [],
            fabricCare: [],
            price: 490,
            salePrice: 420,
            images: ["/images/product-dress-front.jpg"],
            colors: [{ name: "Champagne Satin", hex: "#E6D5C3" }],
            sizes: ["S"],
            categoryId: "cat-1",
            categoryName: "Couture Dresses",
            rating: 4.9,
            reviewsCount: 38,
            createdAt: "",
          },
          selectedColor: { name: "Champagne Satin", hex: "#E6D5C3" },
          selectedSize: "S",
          quantity: 1,
        },
      ],
      appliedCoupon: null,
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, color, size, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedColor.name === color.name &&
            item.selectedSize === size
        );

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems, isOpen: true });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${color.name}-${size}-${Date.now()}`,
            product,
            selectedColor: color,
            selectedSize: size,
            quantity,
          };
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        });
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const found = MOCK_COUPONS.find((c) => c.code === cleanCode);
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

      clearCart: () => set({ items: [], appliedCoupon: null }),

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
