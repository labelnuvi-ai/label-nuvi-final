import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Coupon } from "@/types";

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "cpn-nuvi99",
    code: "NUVI99",
    discountType: "percentage",
    discountValue: 99,
    discountPercent: 99,
    minPurchase: 0,
    minSpend: 0,
    maxDiscount: null, // Unlimited
    status: "Active",
    validFrom: "2026-07-25",
    validUntil: "2026-12-31",
    usageLimit: 100,
    usedCount: 0,
    description: "99% Off Order Total",
  },
  {
    id: "cpn-nuvi10",
    code: "NUVI10",
    discountType: "percentage",
    discountValue: 10,
    discountPercent: 10,
    minPurchase: 0,
    minSpend: 0,
    maxDiscount: null,
    status: "Active",
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    usageLimit: 500,
    usedCount: 14,
    description: "10% Off Atelier Pieces",
  },
  {
    id: "cpn-atelier20",
    code: "ATELIER20",
    discountType: "percentage",
    discountValue: 20,
    discountPercent: 20,
    minPurchase: 0,
    minSpend: 0,
    maxDiscount: null,
    status: "Active",
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    usageLimit: 250,
    usedCount: 8,
    description: "20% Off Atelier Pieces",
  },
  {
    id: "cpn-couture50",
    code: "COUTURE50",
    discountType: "flat",
    discountValue: 50,
    discountFlat: 50,
    minPurchase: 300,
    minSpend: 300,
    maxDiscount: null,
    status: "Active",
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    usageLimit: 1000,
    usedCount: 42,
    description: "₹50 Off Couture Orders above ₹300",
  },
];

interface CouponState {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updated: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleStatus: (id: string) => void;
  getCouponByCode: (code: string) => Coupon | undefined;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: INITIAL_COUPONS,

      addCoupon: (newCoupon) => {
        set((state) => {
          const exists = state.coupons.some(
            (c) => c.code.toUpperCase() === newCoupon.code.toUpperCase()
          );
          if (exists) {
            return {
              coupons: state.coupons.map((c) =>
                c.code.toUpperCase() === newCoupon.code.toUpperCase()
                  ? { ...c, ...newCoupon }
                  : c
              ),
            };
          }
          return { coupons: [newCoupon, ...state.coupons] };
        });
      },

      updateCoupon: (id, updated) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id || c.code === id ? { ...c, ...updated } : c)),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id && c.code !== id),
        }));
      },

      toggleStatus: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id || c.code === id
              ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
              : c
          ),
        }));
      },

      getCouponByCode: (code) => {
        const cleanCode = code.trim().toUpperCase();
        return get().coupons.find((c) => c.code.toUpperCase() === cleanCode);
      },
    }),
    {
      name: "uni-coupons-storage",
    }
  )
);
