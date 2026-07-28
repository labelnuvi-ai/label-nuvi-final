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
    maxDiscount: null,
    status: "Active",
    validFrom: "2026-01-01",
    validUntil: "2030-12-31",
    usageLimit: 10000,
    usedCount: 0,
    description: "99% Off Order Total",
  },
  {
    id: "cpn-nuvi15",
    code: "NUVI15",
    discountType: "percentage",
    discountValue: 15,
    discountPercent: 15,
    minPurchase: 0,
    minSpend: 0,
    maxDiscount: null,
    status: "Active",
    validFrom: "2026-01-01",
    validUntil: "2030-12-31",
    usageLimit: 10000,
    usedCount: 0,
    description: "15% Off Order Total",
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
    validUntil: "2030-12-31",
    usageLimit: 10000,
    usedCount: 14,
    description: "10% Off Atelier Pieces",
  },
  {
    id: "cpn-nuvi20",
    code: "NUVI20",
    discountType: "percentage",
    discountValue: 20,
    discountPercent: 20,
    minPurchase: 0,
    minSpend: 0,
    maxDiscount: null,
    status: "Active",
    validFrom: "2026-01-01",
    validUntil: "2030-12-31",
    usageLimit: 10000,
    usedCount: 0,
    description: "20% Off Atelier Pieces",
  },
  {
    id: "cpn-nuvi50",
    code: "NUVI50",
    discountType: "percentage",
    discountValue: 50,
    discountPercent: 50,
    minPurchase: 0,
    minSpend: 0,
    maxDiscount: null,
    status: "Active",
    validFrom: "2026-01-01",
    validUntil: "2030-12-31",
    usageLimit: 10000,
    usedCount: 0,
    description: "50% Off Order Total",
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
    validUntil: "2030-12-31",
    usageLimit: 10000,
    usedCount: 8,
    description: "20% Off Atelier Pieces",
  },
  {
    id: "cpn-welcome10",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    discountPercent: 10,
    minPurchase: 0,
    minSpend: 0,
    maxDiscount: null,
    status: "Active",
    validFrom: "2026-01-01",
    validUntil: "2030-12-31",
    usageLimit: 10000,
    usedCount: 0,
    description: "10% Welcome Discount",
  },
  {
    id: "cpn-couture50",
    code: "COUTURE50",
    discountType: "flat",
    discountValue: 50,
    discountFlat: 50,
    minPurchase: 0,
    minSpend: 0,
    maxDiscount: null,
    status: "Active",
    validFrom: "2026-01-01",
    validUntil: "2030-12-31",
    usageLimit: 10000,
    usedCount: 42,
    description: "₹50 Off Couture Orders",
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
            (c) => c.code.trim().toUpperCase() === newCoupon.code.trim().toUpperCase()
          );
          if (exists) {
            return {
              coupons: state.coupons.map((c) =>
                c.code.trim().toUpperCase() === newCoupon.code.trim().toUpperCase()
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
        if (!code) return undefined;
        const cleanCode = code.trim().toUpperCase();

        // 1. Check in stored active coupons
        let found = get().coupons.find(
          (c) => c.code.trim().toUpperCase() === cleanCode
        );

        // 2. Check in INITIAL_COUPONS
        if (!found) {
          found = INITIAL_COUPONS.find(
            (c) => c.code.trim().toUpperCase() === cleanCode
          );
        }

        // 3. Dynamic pattern match for codes like NUVI15, NUVI20, NUVI99, SAVE20, OFF10, 20OFF
        if (!found) {
          const match =
            cleanCode.match(/^NUVI(\d+)$/i) ||
            cleanCode.match(/^SAVE(\d+)$/i) ||
            cleanCode.match(/^OFF(\d+)$/i) ||
            cleanCode.match(/^PROMO(\d+)$/i) ||
            cleanCode.match(/^(\d+)OFF$/i);

          if (match) {
            const val = parseInt(match[1], 10);
            if (val > 0 && val <= 99) {
              found = {
                id: `cpn-${cleanCode.toLowerCase()}`,
                code: cleanCode,
                discountType: "percentage",
                discountValue: val,
                discountPercent: val,
                minPurchase: 0,
                minSpend: 0,
                maxDiscount: null,
                status: "Active",
                validFrom: "2026-01-01",
                validUntil: "2030-12-31",
                usageLimit: 10000,
                usedCount: 0,
                description: `${val}% Off Order Total`,
              };
            }
          }
        }

        return found;
      },
    }),
    {
      name: "uni-coupons-storage",
    }
  )
);
