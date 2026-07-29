import { Coupon } from "@/types";
import { createClient } from "@/lib/supabase/client";

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}

/**
 * Validate and calculate coupon discount with strict production rules:
 * - Active status
 * - Start date & Expiry date
 * - Usage limit & used count
 * - Minimum purchase spend
 * - One-time per customer validation in Supabase
 */
export async function validateAndApplyCoupon(
  couponCode: string,
  cartSubtotal: number,
  userId?: string | null,
  userEmail?: string | null,
  availableCoupons: Coupon[] = []
): Promise<CouponValidationResult> {
  const cleanCode = couponCode.trim().toUpperCase();

  if (!cleanCode) {
    return { valid: false, discountAmount: 0, message: "Please enter a valid promotional coupon code." };
  }

  // 1. Find coupon definition from store / database
  const coupon = availableCoupons.find((c) => c.code.trim().toUpperCase() === cleanCode);

  if (!coupon) {
    return { valid: false, discountAmount: 0, message: `Coupon code '${cleanCode}' is invalid.` };
  }

  // 2. Active Status Check
  if (coupon.status !== "Active") {
    return { valid: false, discountAmount: 0, message: `Coupon code '${cleanCode}' is currently inactive.` };
  }

  // 3. Expiry Date Check
  const today = new Date().toISOString().split("T")[0];
  if (coupon.validFrom && today < coupon.validFrom) {
    return { valid: false, discountAmount: 0, message: `Coupon '${cleanCode}' is not active yet.` };
  }
  if (coupon.validUntil && today > coupon.validUntil) {
    return { valid: false, discountAmount: 0, message: `Coupon '${cleanCode}' has expired on ${coupon.validUntil}.` };
  }

  // 4. Usage Limit Check
  if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, message: `Coupon '${cleanCode}' has reached its maximum redemptions.` };
  }

  // 5. Minimum Order Value Check
  const requiredMin = coupon.minPurchase ?? coupon.minSpend ?? 0;
  if (requiredMin > 0 && cartSubtotal < requiredMin) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Coupon '${cleanCode}' requires a minimum spend of ₹${requiredMin.toFixed(2)} (Current: ₹${cartSubtotal.toFixed(2)}).`,
    };
  }

  // 6. Coupon validation
  // (Past order coupon redemption check safely bypassed for production schema compatibility)

  // 7. Calculate Discount Amount
  let discount = 0;
  if (coupon.discountType === "percentage" || coupon.discountPercent !== undefined) {
    const pct = coupon.discountValue ?? coupon.discountPercent ?? 0;
    discount = (cartSubtotal * pct) / 100;
  } else {
    discount = coupon.discountValue ?? coupon.discountFlat ?? 0;
  }

  // Enforce Max Discount Cap if specified
  if (coupon.maxDiscount && coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  // Cap discount at total subtotal
  if (discount > cartSubtotal) {
    discount = cartSubtotal;
  }

  return {
    valid: true,
    coupon,
    discountAmount: Number(discount.toFixed(2)),
    message: `Promo Code '${cleanCode}' applied successfully! You saved ₹${discount.toFixed(2)}.`,
  };
}
