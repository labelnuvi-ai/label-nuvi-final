export type ProductSize = "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: ProductSize;
  color: ProductColor;
  sku: string;
  stock: number;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  details: string[];
  fabricCare: string[];
  price: number;
  salePrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isSoldOut?: boolean;
  isActive?: boolean;
  imageUrl: string;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  categoryId: string;
  categoryName: string;
  collectionId?: string;
  collectionName?: string;
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount: number;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  isFeatured: boolean;
  productsCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
}

export interface Coupon {
  id?: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountPercent?: number;
  discountFlat?: number;
  minPurchase?: number;
  minSpend?: number;
  maxDiscount?: number | null;
  status: "Active" | "Inactive";
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount?: number;
  description: string;
}

export interface UserAddress {
  id: string;
  label: string;
  fullName: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  color: string;
  size: ProductSize;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "Pending" | "Paid" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax?: number;
  total: number;
  shippingAddress: UserAddress;
  paymentMethod: string;
  paymentStatus?: "Pending" | "Paid" | "Failed" | "Cancelled";
  paymentId?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  trackingNumber?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: "admin" | "customer";
}

export interface CMSHeroSection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  backgroundImage: string;
  badge: string;
}

export interface CMSAnnouncement {
  id: string;
  text: string;
  linkText?: string;
  linkUrl?: string;
  isActive: boolean;
}
