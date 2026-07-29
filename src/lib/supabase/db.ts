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
    status: order.orderStatus || order.status || "Processing",
    subtotal: Number(order.subtotal || 0),
    discount: Number(order.discount || 0),
    shipping: Number(order.shipping || 0),
    total: Number(order.total || 0),
    tracking_number: order.trackingNumber || null,
    payment_method: order.paymentMethod || "Razorpay / Online",
    payment_status: order.paymentStatus || "Pending",
    payment_id: order.razorpayPaymentId || order.paymentId || null,

    // Detailed address columns
    shipping_name: order.shippingAddress?.fullName || "",
    shipping_address_line1: order.shippingAddress?.addressLine1 || "",
    shipping_address_line2: order.shippingAddress?.addressLine2 || "",
    shipping_city: order.shippingAddress?.city || "",
    shipping_state: order.shippingAddress?.state || "",
    shipping_postal_code: order.shippingAddress?.postalCode || "",
    shipping_country: order.shippingAddress?.country || "",
    shipping_phone: order.shippingAddress?.phone || "",
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

  // Insert order_items for each purchased product
  if (order.items && order.items.length > 0) {
    const itemRows = order.items.map((item: any) => {
      const rawPid = item.productId || item.id || "";
      const isUuid = typeof rawPid === "string" && rawPid.includes("-") && rawPid.length === 36;
      return {
        order_id: orderId,
        product_id: isUuid ? rawPid : null,
        product_name: item.productName || "LABEL NUVI Silhouette",
        product_image: item.productImage || "/images/product-dress-front.jpg",
        color: item.color || "Standard",
        size: item.size || "M",
        unit_price: Number(item.unitPrice || item.price || 0),
        quantity: Number(item.quantity || 1),
        created_at: now,
      };
    });

    const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
    if (itemsError) {
      console.error("Error inserting order_items in Supabase:", itemsError);
    }
  }

  // Asynchronously trigger automated transactional emails
  try {
    const { sendEmail } = await import("@/lib/email/sender");
    const { orderConfirmationTemplate, paymentSuccessTemplate, adminNewOrderTemplate } = await import("@/lib/email/templates");

    const formattedOrder: Order = {
      id: orderId,
      orderNumber: order.orderNumber,
      date: orderRow.date,
      status: orderRow.status as any,
      items: (order.items || []).map((i: any, idx: number) => ({
        id: `oi-${idx}`,
        productId: i.productId,
        productName: i.productName,
        productImage: i.productImage || "/images/product-dress-front.jpg",
        color: i.color || "Standard",
        size: i.size,
        unitPrice: Number(i.unitPrice || i.price || 0),
        quantity: Number(i.quantity || 1),
      })),
      subtotal: orderRow.subtotal,
      discount: orderRow.discount,
      shipping: orderRow.shipping,
      tax: Number(order.tax || 0),
      total: orderRow.total,
      shippingAddress: {
        id: "addr-" + orderId,
        label: "Shipping Address",
        fullName: orderRow.shipping_name,
        email: order.shippingAddress?.email || "",
        phone: orderRow.shipping_phone,
        addressLine1: orderRow.shipping_address_line1,
        addressLine2: orderRow.shipping_address_line2,
        city: orderRow.shipping_city,
        state: orderRow.shipping_state,
        postalCode: orderRow.shipping_postal_code,
        country: orderRow.shipping_country,
        isDefault: true,
      },
      paymentMethod: orderRow.payment_method,
      paymentStatus: orderRow.payment_status as any,
      paymentId: orderRow.payment_id,
      razorpayOrderId: orderRow.payment_id,
      razorpayPaymentId: orderRow.payment_id,
    };

    const recipientEmail = order.shippingAddress?.email || "client@labelnuvi.com";

    // 1. Send Order Confirmation Email to Customer
    sendEmail({
      to: recipientEmail,
      subject: `Order Confirmation - ${order.orderNumber} | LABEL NUVI Atelier`,
      html: orderConfirmationTemplate(formattedOrder),
      emailType: "order_confirmation",
      metadata: { orderId, orderNumber: order.orderNumber },
    });

    // 2. Send Payment Success Email if Paid
    if (orderRow.payment_status === "Paid") {
      sendEmail({
        to: recipientEmail,
        subject: `Payment Successful - ${order.orderNumber} | LABEL NUVI`,
        html: paymentSuccessTemplate(formattedOrder),
        emailType: "payment_successful",
        metadata: { orderId, orderNumber: order.orderNumber },
      });
    }

    // 3. Send Admin Alert Email
    const adminEmail = process.env.ADMIN_EMAIL || "concierge@labelnuvi.com";
    sendEmail({
      to: adminEmail,
      subject: `[ADMIN ALERT] New Order ${order.orderNumber} Received`,
      html: adminNewOrderTemplate(formattedOrder),
      emailType: "admin_new_order",
      metadata: { orderId, orderNumber: order.orderNumber },
    });
  } catch (emailErr) {
    console.error("Non-blocking email trigger exception during order creation:", emailErr);
  }

  return insertedOrder;
}

export async function fetchOrdersDb(userId?: string): Promise<Order[]> {
  try {
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: ordersData, error: ordersError } = await query;

    if (ordersError) {
      console.error("Error fetching user orders from Supabase:", ordersError);
      return [];
    }

    if (!ordersData || ordersData.length === 0) {
      return [];
    }

    // Try fetching order_items safely if table exists
    const orderIds = ordersData.map((o: any) => o.id);
    let itemsByOrderId: Record<string, any[]> = {};

    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      if (!itemsError && itemsData) {
        itemsData.forEach((item: any) => {
          if (!itemsByOrderId[item.order_id]) {
            itemsByOrderId[item.order_id] = [];
          }
          itemsByOrderId[item.order_id].push(item);
        });
      }
    } catch (itemErr) {
      console.warn("order_items query skipped (table may not exist yet):", itemErr);
    }

    // Collect product_ids from orders or order_items to query products table
    const productIdsSet = new Set<string>();
    ordersData.forEach((o: any) => {
      if (o.product_id) productIdsSet.add(o.product_id);
    });
    Object.values(itemsByOrderId)
      .flat()
      .forEach((i: any) => {
        if (i.product_id) productIdsSet.add(i.product_id);
      });

    let productsMap: Record<string, any> = {};
    if (productIdsSet.size > 0) {
      try {
        const { data: prodsData } = await supabase
          .from("products")
          .select("id, name, image_url")
          .in("id", Array.from(productIdsSet));

        if (prodsData) {
          prodsData.forEach((p: any) => {
            productsMap[p.id] = p;
          });
        }
      } catch (prodErr) {
        console.warn("products table join lookup skipped:", prodErr);
      }
    }

    // Map rows back to Order TypeScript interface
    return ordersData.map((row: any) => {
      const rawItems = itemsByOrderId[row.id] || [];
      const rowProd = row.product_id ? productsMap[row.product_id] : null;

      const mappedItems =
        rawItems.length > 0
          ? rawItems.map((item: any) => {
              const matchedProd = item.product_id ? productsMap[item.product_id] : null;
              return {
                id: item.id,
                productId: item.product_id || "prod-default",
                productName: item.product_name || matchedProd?.name || "LABEL NUVI Silhouette",
                productImage: item.product_image || matchedProd?.image_url || rowProd?.image_url || "/images/product-dress-front.jpg",
                color: item.color || "Standard",
                size: item.size || "M",
                unitPrice: Number(item.unit_price || item.price || 0),
                quantity: Number(item.quantity || 1),
              };
            })
          : [
              {
                id: `oi-${row.id}`,
                productId: row.product_id || "prod-label-nuvi",
                productName: row.product_name || rowProd?.name || "LABEL NUVI Haute Couture Silhouette",
                productImage: row.product_image || row.image_url || rowProd?.image_url || "/images/product-dress-front.jpg",
                color: "Standard",
                size: "M",
                unitPrice: Number(row.subtotal || row.total || 0),
                quantity: 1,
              },
            ];

      return {
        id: row.id,
        orderNumber: row.order_number,
        date: row.date || (row.created_at ? row.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
        status: row.status || "Pending",
        subtotal: Number(row.subtotal || 0),
        discount: Number(row.discount || 0),
        shipping: Number(row.shipping || 0),
        tax: Number(row.tax || 0),
        total: Number(row.total || 0),
        trackingNumber: row.tracking_number || null,
        paymentMethod: row.payment_method || "Razorpay / Online",
        paymentStatus: row.payment_status || "Pending",
        paymentId: row.payment_id || null,
        razorpayOrderId: row.payment_id || null,
        razorpayPaymentId: row.payment_id || null,
        shippingAddress: {
          id: "addr-" + row.id,
          label: "Delivery Address",
          fullName: row.shipping_name || "Client",
          email: "",
          phone: row.shipping_phone || "",
          addressLine1: row.shipping_address_line1 || "",
          addressLine2: row.shipping_address_line2 || "",
          city: row.shipping_city || "",
          state: row.shipping_state || "",
          postalCode: row.shipping_postal_code || "",
          country: row.shipping_country || "",
          isDefault: true,
        },
        items: mappedItems,
      };
    });
  } catch (err) {
    console.error("fetchOrdersDb exception:", err);
    return [];
  }
}

export async function updateOrderStatusDb(orderId: string, status: string) {
  console.log(`Executing updateOrderStatusDb for order ${orderId} -> ${status}`);

  // Build match query targeting id or order_number
  let query = supabase.from("orders").update({ status: status });

  if (typeof orderId === "string" && orderId.includes("-") && orderId.length === 36) {
    query = query.eq("id", orderId);
  } else {
    query = query.or(`id.eq.${orderId},order_number.eq.${orderId}`);
  }

  const { data, error } = await query.select();

  console.log("Supabase Order Status UPDATE Raw Response:", {
    orderId,
    status,
    data,
    error,
    rowsUpdated: data ? data.length : 0,
  });

  if (error) {
    console.error("Supabase Order Status Update Error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      orderId,
      status,
    });
    throw new Error(`Supabase DB Update Error [${error.code}]: ${error.message}`);
  }

  if (!data || data.length === 0) {
    const errorMsg = `Database UPDATE failed for order '${orderId}': 0 rows affected. Please verify that an RLS policy permits UPDATE on the 'orders' table in Supabase.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const updatedRow = data[0];

  // Asynchronously trigger Order Status Update email
  try {
    const { sendEmail } = await import("@/lib/email/sender");
    const { orderStatusUpdateTemplate } = await import("@/lib/email/templates");

    const formattedOrder: Order = {
      id: updatedRow.id,
      orderNumber: updatedRow.order_number || `ORDER-${orderId.slice(0, 8)}`,
      date: updatedRow.date || updatedRow.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
      status: status as any,
      items: [
        {
          id: `oi-${updatedRow.id}`,
          productId: "prod-label-nuvi",
          productName: "LABEL NUVI Haute Couture Silhouette",
          productImage: "/images/product-dress-front.jpg",
          color: "Standard",
          size: "M",
          unitPrice: Number(updatedRow.subtotal || updatedRow.total || 0),
          quantity: 1,
        },
      ],
      subtotal: Number(updatedRow.subtotal || 0),
      discount: Number(updatedRow.discount || 0),
      shipping: Number(updatedRow.shipping || 0),
      tax: Number(updatedRow.tax || 0),
      total: Number(updatedRow.total || 0),
      shippingAddress: {
        id: "addr-" + updatedRow.id,
        label: "Shipping Address",
        fullName: updatedRow.shipping_name || "Client",
        email: "",
        phone: updatedRow.shipping_phone || "",
        addressLine1: updatedRow.shipping_address_line1 || "",
        addressLine2: updatedRow.shipping_address_line2 || "",
        city: updatedRow.shipping_city || "",
        state: updatedRow.shipping_state || "",
        postalCode: updatedRow.shipping_postal_code || "",
        country: updatedRow.shipping_country || "",
        isDefault: true,
      },
      paymentMethod: updatedRow.payment_method || "Online",
      trackingNumber: updatedRow.tracking_number,
    };

    const recipientEmail = "client@labelnuvi.com";

    sendEmail({
      to: recipientEmail,
      subject: `Order Update: ${formattedOrder.orderNumber} is ${status} | LABEL NUVI`,
      html: orderStatusUpdateTemplate(formattedOrder, status),
      emailType: `order_${status.toLowerCase()}`,
      metadata: { orderId, orderNumber: formattedOrder.orderNumber, status },
    });
  } catch (emailErr) {
    console.error("Non-blocking status update email trigger error:", emailErr);
  }

  return updatedRow;
}

export async function cancelOrderDb(orderId: string) {
  console.log(`Executing cancelOrderDb for order ${orderId}`);

  let query = supabase
    .from("orders")
    .update({
      status: "Cancelled",
      payment_status: "Cancelled",
    });

  if (typeof orderId === "string" && orderId.includes("-") && orderId.length === 36) {
    query = query.eq("id", orderId);
  } else {
    query = query.or(`id.eq.${orderId},order_number.eq.${orderId}`);
  }

  const { data, error } = await query.select();

  console.log("Supabase Order Cancellation Raw Response:", {
    orderId,
    data,
    error,
    rowsUpdated: data ? data.length : 0,
  });

  if (error) {
    console.error("Supabase Order Cancellation Error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      orderId,
    });
    throw new Error(`Supabase DB Cancellation Error [${error.code}]: ${error.message}`);
  }

  if (!data || data.length === 0) {
    const errorMsg = `Database Cancellation failed for order '${orderId}': 0 rows affected. Please verify that an RLS policy permits UPDATE on the 'orders' table in Supabase.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const updatedRow = data[0];

  // Asynchronously trigger Order Cancelled email
  try {
    const { sendEmail } = await import("@/lib/email/sender");
    const { orderStatusUpdateTemplate } = await import("@/lib/email/templates");

    const formattedOrder: Order = {
      id: updatedRow.id,
      orderNumber: updatedRow.order_number || `ORDER-${orderId.slice(0, 8)}`,
      date: updatedRow.date || updatedRow.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
      status: "Cancelled",
      items: [
        {
          id: `oi-${updatedRow.id}`,
          productId: "prod-label-nuvi",
          productName: "LABEL NUVI Haute Couture Silhouette",
          productImage: "/images/product-dress-front.jpg",
          color: "Standard",
          size: "M",
          unitPrice: Number(updatedRow.subtotal || updatedRow.total || 0),
          quantity: 1,
        },
      ],
      subtotal: Number(updatedRow.subtotal || 0),
      discount: Number(updatedRow.discount || 0),
      shipping: Number(updatedRow.shipping || 0),
      tax: Number(updatedRow.tax || 0),
      total: Number(updatedRow.total || 0),
      shippingAddress: {
        id: "addr-" + updatedRow.id,
        label: "Shipping Address",
        fullName: updatedRow.shipping_name || "Client",
        email: "",
        phone: updatedRow.shipping_phone || "",
        addressLine1: updatedRow.shipping_address_line1 || "",
        addressLine2: updatedRow.shipping_address_line2 || "",
        city: updatedRow.shipping_city || "",
        state: updatedRow.shipping_state || "",
        postalCode: updatedRow.shipping_postal_code || "",
        country: updatedRow.shipping_country || "",
        isDefault: true,
      },
      paymentMethod: updatedRow.payment_method || "Online",
    };

    const recipientEmail = "client@labelnuvi.com";

    sendEmail({
      to: recipientEmail,
      subject: `Order Cancelled - ${formattedOrder.orderNumber} | LABEL NUVI`,
      html: orderStatusUpdateTemplate(formattedOrder, "Cancelled"),
      emailType: "order_cancelled",
      metadata: { orderId, orderNumber: formattedOrder.orderNumber },
    });
  } catch (emailErr) {
    console.error("Non-blocking cancellation email trigger error:", emailErr);
  }

  return updatedRow;
}
