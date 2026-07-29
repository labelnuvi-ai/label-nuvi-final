import { createClient } from "./client";
import { CartItem, Order, Product } from "@/types";

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
  try {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("user_id", userId);

    if (error) {
      if (error.code !== "PGRST205") {
        console.error("Error fetching wishlist:", error);
      }
      return [];
    }
    return (data || []).map((item) => item.product_id);
  } catch (err) {
    console.error("Wishlist DB fetch exception:", err);
    return [];
  }
}

export async function addToWishlistDb(userId: string, productId: string) {
  try {
    const { error } = await supabase
      .from("wishlist_items")
      .upsert({ user_id: userId, product_id: productId });

    if (error && error.code !== "PGRST205") {
      console.error("Error adding to wishlist:", error);
    }
  } catch (err) {
    console.error("Wishlist DB add exception:", err);
  }
}

export async function removeFromWishlistDb(userId: string, productId: string) {
  try {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error && error.code !== "PGRST205") {
      console.error("Error removing from wishlist:", error);
    }
  } catch (err) {
    console.error("Wishlist DB remove exception:", err);
  }
}

// 3. Cart Operations
export async function fetchCartDb(userId: string): Promise<CartItem[]> {
  try {
    const { data: cartData, error: cartError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId);

    if (cartError) {
      if (cartError.code !== "PGRST205") {
        console.error("Error fetching cart items:", cartError);
      }
      return [];
    }

    if (!cartData || cartData.length === 0) return [];

    // Fetch Supabase products
    let dbProducts: Product[] = [];
    try {
      const { data: productsData } = await supabase.from("products").select(`
        *,
        categories (
          name
        ),
        collections (
          title
        )
      `);
      if (productsData) {
        dbProducts = productsData.map((row: any) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          subtitle: row.subtitle,
          description: row.description,
          price: Number(row.price),
          salePrice: row.sale_price ? Number(row.sale_price) : undefined,
          isNew: row.is_new,
          isBestseller: row.is_bestseller,
          isSoldOut: row.is_sold_out,
          imageUrl: row.image_url || "/images/product-dress-front.jpg",
          images: row.images && row.images.length > 0 ? row.images : [row.image_url || "/images/product-dress-front.jpg"],
          colors: row.colors || [{ name: "Ivory", hex: "#FAF8F5" }],
          sizes: row.sizes || ["S", "M", "L"],
          categoryId: row.category_id,
          categoryName: row.categories?.name || "Dresses",
          collectionId: row.collection_id || undefined,
          collectionName: row.collections?.title || undefined,
          rating: Number(row.rating || 5.0),
          reviewsCount: Number(row.reviews_count || 0),
          createdAt: row.created_at,
          details: row.details || ["Dry clean only"],
          fabricCare: row.fabric_care || ["Dry clean only"],
        }));
      }
    } catch (pErr) {
      console.error("Error fetching products during cart load:", pErr);
    }

    const cartItems: CartItem[] = [];
    cartData.forEach((dbItem: any) => {
      const product = dbProducts.find((p) => p.id === dbItem.product_id);
      if (product) {
        cartItems.push({
          id: dbItem.id || `${dbItem.product_id}-${dbItem.size}`,
          product,
          selectedColor: { name: dbItem.color_name || "Standard", hex: dbItem.color_hex || "#FAF8F5" },
          selectedSize: dbItem.size,
          quantity: dbItem.quantity,
        });
      }
    });

    return cartItems;
  } catch (err) {
    console.error("Cart DB fetch exception:", err);
    return [];
  }
}

export async function syncCartDb(userId: string, items: CartItem[]) {
  try {
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      if (deleteError.code !== "PGRST205") {
        console.error("Error cleaning cart items for sync:", deleteError);
      }
      return;
    }

    if (items.length === 0) return;

    const dbRows = items.map((item) => ({
      user_id: userId,
      product_id: item.product.id,
      color_name: item.selectedColor?.name || "Standard",
      color_hex: item.selectedColor?.hex || "#FAF8F5",
      size: item.selectedSize,
      quantity: item.quantity,
      updated_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase.from("cart_items").insert(dbRows);
    if (insertError) {
      if (insertError.code !== "PGRST205") {
        console.error("Error inserting cart items during sync:", insertError);
      }
    }
  } catch (err) {
    console.error("Cart DB sync exception:", err);
  }
}

// 4. Order Operations
export async function createOrderDb(userId: string | null, order: any) {
  const now = new Date().toISOString();

  const orderRow = {
    user_id: userId,
    order_number: order.orderNumber,
    date: order.date || now.split("T")[0],
    subtotal: Number(order.subtotal || 0),
    discount: Number(order.discount || 0),
    shipping: Number(order.shipping || 0),
    tax: Number(order.tax || 0),
    total: Number(order.total || 0),
    status: order.orderStatus || order.status || "Processing",
    order_status: order.orderStatus || order.status || "Processing",
    payment_status: order.paymentStatus || "Pending",
    payment_method: order.paymentMethod || "Razorpay / Online",
    payment_id: order.razorpayPaymentId || order.paymentId || null,
    razorpay_order_id: order.razorpayOrderId || null,
    razorpay_payment_id: order.razorpayPaymentId || order.paymentId || null,
    address_id: order.addressId || null,

    // Detailed address columns
    shipping_name: order.shippingAddress?.fullName || "",
    shipping_email: order.shippingAddress?.email || "",
    shipping_phone: order.shippingAddress?.phone || "",
    shipping_address_line1: order.shippingAddress?.addressLine1 || "",
    shipping_address_line2: order.shippingAddress?.addressLine2 || "",
    shipping_city: order.shippingAddress?.city || "",
    shipping_state: order.shippingAddress?.state || "",
    shipping_postal_code: order.shippingAddress?.postalCode || "",
    shipping_country: order.shippingAddress?.country || "",
    created_at: now,
  };

  const { data: insertedOrder, error: orderError } = await supabase
    .from("orders")
    .insert(orderRow)
    .select("*")
    .single();

  if (orderError) {
    console.error("Error creating order in Supabase:", orderError);
    throw orderError;
  }

  const orderId = insertedOrder.id;

  // Insert order_items
  if (order.items && order.items.length > 0) {
    const itemRows = order.items.map((item: any) => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      color: item.color || "Standard",
      size: item.size,
      price: Number(item.unitPrice || item.price || 0),
      unit_price: Number(item.unitPrice || item.price || 0),
      quantity: Number(item.quantity || 1),
      created_at: now,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
    if (itemsError) {
      console.error("Error inserting order_items in Supabase:", itemsError);
    }
  }

  return insertedOrder;
}

export async function fetchOrdersDb(userId?: string): Promise<Order[]> {
  try {
    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: ordersData, error: ordersError } = await query;

    if (ordersError) {
      if (ordersError.code !== "PGRST205") {
        console.error("Error fetching user orders:", ordersError);
      }
      return [];
    }

    // Map rows back to Order TypeScript interface
    return (ordersData || []).map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      date: row.date || row.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
      status: row.order_status || row.status || "Pending",
      subtotal: Number(row.subtotal || 0),
      discount: Number(row.discount || 0),
      shipping: Number(row.shipping || 0),
      tax: Number(row.tax || 0),
      total: Number(row.total || 0),
      trackingNumber: row.tracking_number || null,
      paymentMethod: row.payment_method || "Razorpay / Online",
      paymentStatus: row.payment_status || "Pending",
      paymentId: row.payment_id || row.razorpay_payment_id || null,
      razorpayOrderId: row.razorpay_order_id || null,
      razorpayPaymentId: row.razorpay_payment_id || row.payment_id || null,
      shippingAddress: {
        id: "addr-" + row.id,
        label: "Delivery Address",
        fullName: row.shipping_name || "Client",
        email: row.shipping_email || "",
        phone: row.shipping_phone || "",
        addressLine1: row.shipping_address_line1 || "",
        addressLine2: row.shipping_address_line2 || "",
        city: row.shipping_city || "",
        state: row.shipping_state || "",
        postalCode: row.shipping_postal_code || "",
        country: row.shipping_country || "",
        isDefault: true,
      },
      items: (row.order_items || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        productImage: item.product_image || "/images/product-dress-front.jpg",
        color: item.color || "Standard",
        size: item.size || "M",
        unitPrice: Number(item.price || item.unit_price || 0),
        quantity: Number(item.quantity || 1),
      })),
    }));
  } catch (err) {
    console.error("fetchOrdersDb exception:", err);
    return [];
  }
}

export async function updateOrderStatusDb(orderId: string, status: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: status,
      order_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status in Supabase:", error);
    throw error;
  }

  return data;
}

export async function cancelOrderDb(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "Cancelled",
      order_status: "Cancelled",
      payment_status: "Cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error cancelling order in Supabase:", error);
    throw error;
  }

  return data;
}
