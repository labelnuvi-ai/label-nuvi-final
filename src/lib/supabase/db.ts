import { createClient } from "./client";
import { CartItem, Order, Product } from "@/types";
import { PRODUCTS } from "../data/mockData";

const supabase = createClient();

// 1. Profile Operations
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching profile:", error);
  }
  return data;
}

export async function updateProfile(userId: string, updates: { full_name?: string; phone?: string }) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
  return data;
}

// 2. Wishlist Operations
export async function fetchWishlist(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
  return data.map((item) => item.product_id);
}

export async function addToWishlistDb(userId: string, productId: string) {
  const { error } = await supabase
    .from("wishlist_items")
    .upsert({ user_id: userId, product_id: productId });

  if (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}

export async function removeFromWishlistDb(userId: string, productId: string) {
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}

// 3. Cart Operations
export async function fetchCartDb(userId: string): Promise<CartItem[]> {
  const { data: cartData, error: cartError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId);

  if (cartError) {
    console.error("Error fetching cart items:", cartError);
    return [];
  }

  const cartItems: CartItem[] = [];
  (cartData || []).forEach((dbItem) => {
    const product = PRODUCTS.find((p) => p.id === dbItem.product_id);
    if (product) {
      cartItems.push({
        id: dbItem.id,
        product,
        selectedColor: { name: dbItem.color_name, hex: dbItem.color_hex },
        selectedSize: dbItem.size_value,
        quantity: dbItem.quantity,
      });
    }
  });

  return cartItems;
}

export async function syncCartDb(userId: string, items: CartItem[]) {
  // Simple strategy: wipe current cart items and re-insert state to match client
  const { error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    console.error("Error cleaning cart items for sync:", deleteError);
    return;
  }

  if (items.length === 0) return;

  const dbRows = items.map((item) => ({
    user_id: userId,
    product_id: item.product.id,
    color_name: item.selectedColor.name,
    color_hex: item.selectedColor.hex,
    size_value: item.selectedSize,
    quantity: item.quantity,
  }));

  const { error: insertError } = await supabase.from("cart_items").insert(dbRows);
  if (insertError) {
    console.error("Error inserting cart items during sync:", insertError);
  }
}

// 4. Order Operations
export async function createOrderDb(userId: string | null, order: Order) {
  // First insert order details
  const orderRow = {
    user_id: userId,
    order_number: order.orderNumber,
    date: order.date,
    status: order.status,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    tracking_number: order.trackingNumber,
    payment_method: order.paymentMethod,
    shipping_name: order.shippingAddress.fullName,
    shipping_address_line1: order.shippingAddress.addressLine1,
    shipping_address_line2: order.shippingAddress.addressLine2 || "",
    shipping_city: order.shippingAddress.city,
    shipping_state: order.shippingAddress.state,
    shipping_postal_code: order.shippingAddress.postalCode,
    shipping_country: order.shippingAddress.country,
    shipping_phone: order.shippingAddress.phone || "",
  };

  const { data: insertedOrder, error: orderError } = await supabase
    .from("orders")
    .insert(orderRow)
    .select("id")
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw orderError;
  }

  // Insert items matching this order id
  const itemRows = order.items.map((item) => ({
    order_id: insertedOrder.id,
    product_id: item.productId,
    product_name: item.productName,
    product_image: item.productImage,
    color: item.color,
    size: item.size,
    unit_price: item.unitPrice,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
  if (itemsError) {
    console.error("Error inserting order items:", itemsError);
    throw itemsError;
  }

  return insertedOrder.id;
}

export async function fetchOrdersDb(userId: string): Promise<Order[]> {
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching user orders:", ordersError);
    return [];
  }

  // Map rows back to Order TypeScript interface
  return (ordersData || []).map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    date: row.date,
    status: row.status,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    trackingNumber: row.tracking_number,
    paymentMethod: row.payment_method,
    shippingAddress: {
      id: "addr-" + row.id,
      label: "Delivery Address",
      fullName: row.shipping_name,
      addressLine1: row.shipping_address_line1,
      addressLine2: row.shipping_address_line2,
      city: row.shipping_city,
      state: row.shipping_state,
      postalCode: row.shipping_postal_code,
      country: row.shipping_country,
      phone: row.shipping_phone,
      isDefault: true,
    },
    items: (row.order_items || []).map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productImage: item.product_image,
      color: item.color,
      size: item.size as any,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
    })),
  }));
}
