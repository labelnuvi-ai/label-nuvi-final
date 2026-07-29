import { Order } from "@/types";

const BRAND_GOLD = "#C8A46B";
const BRAND_BLACK = "#1A1A1A";
const BRAND_BG = "#FAF8F5";

/**
 * Base Luxury HTML Wrapper
 */
function wrapInLuxuryTemplate(contentHtml: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${BRAND_BG}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden; }
    .header { background-color: ${BRAND_BLACK}; padding: 32px 20px; text-align: center; }
    .logo-text { color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 0.4em; text-transform: uppercase; margin: 0; }
    .sub-logo { color: ${BRAND_GOLD}; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 6px; }
    .content { padding: 40px 32px; color: #1a1a1a; }
    .title { font-size: 20px; font-weight: 300; text-transform: uppercase; letter-spacing: 0.15em; color: ${BRAND_BLACK}; margin-top: 0; margin-bottom: 12px; }
    .badge { display: inline-block; background-color: #f4efea; color: ${BRAND_GOLD}; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.25em; padding: 6px 14px; border-radius: 20px; margin-bottom: 24px; }
    .text { font-size: 13px; line-height: 1.6; color: #555555; margin-bottom: 24px; }
    .card { background-color: ${BRAND_BG}; border: 1px solid #eae5df; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: ${BRAND_BLACK}; color: #ffffff !important; text-decoration: none; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; padding: 14px 28px; border-radius: 30px; margin-top: 12px; }
    .footer { background-color: #faf9f6; padding: 28px 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 11px; color: #888888; }
    .footer-links a { color: ${BRAND_BLACK}; text-decoration: none; margin: 0 10px; font-weight: 600; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND_BG}; padding: 30px 10px;">
    <tr>
      <td align="center">
        <div class="container">
          <div class="header">
            <h1 class="logo-text">LABEL NUVI</h1>
            <div class="sub-logo">PARIS ATELIER &bull; HAUTE COUTURE</div>
          </div>
          <div class="content">
            ${contentHtml}
          </div>
          <div class="footer">
            <p class="footer-links">
              <a href="https://labelnuvi.com/shop">COLLECTION</a> &bull;
              <a href="https://labelnuvi.com/account/orders">MY ORDERS</a> &bull;
              <a href="https://labelnuvi.com/privacy">PRIVACY</a>
            </p>
            <p style="margin-top: 16px; font-size: 10px; color: #aaaaaa;">
              &copy; ${new Date().getFullYear()} LABEL NUVI Atelier. All Rights Reserved.<br>
              Paris &bull; Milan &bull; New York &bull; Mumbai
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. Order Confirmation Template
 */
export function orderConfirmationTemplate(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
          <strong style="text-transform: uppercase; font-size: 12px; color: #1a1a1a;">${item.productName}</strong><br>
          <span style="font-size: 11px; color: #777777;">Size: ${item.size} | Qty: ${item.quantity}</span>
        </td>
        <td align="right" style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 12px; font-weight: bold; color: #1a1a1a;">
          ₹${(item.unitPrice * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  const body = `
    <span class="badge">ORDER CONFIRMED</span>
    <h2 class="title">HAUTE COUTURE SELECTION ${order.orderNumber}</h2>
    <p class="text">Dear Valued Client,<br><br>Thank you for your order with LABEL NUVI. Your bespoke selection has been logged into our Paris Atelier database and is preparing for artisan inspection.</p>

    <div class="card">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size: 11px; color: #888888; text-transform: uppercase; font-weight: bold;">Order Reference</td>
          <td align="right" style="font-size: 12px; font-weight: bold; color: #1a1a1a;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="font-size: 11px; color: #888888; text-transform: uppercase; font-weight: bold; padding-top: 6px;">Payment Method</td>
          <td align="right" style="font-size: 11px; color: #1a1a1a; padding-top: 6px;">${order.paymentMethod}</td>
        </tr>
      </table>
    </div>

    <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #1a1a1a; margin-top: 24px; margin-bottom: 12px;">ITEMIZED SILHOUETTES</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      ${itemsHtml}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px; color: #1a1a1a; border-top: 2px solid #1a1a1a; padding-top: 12px;">
      <tr>
        <td>Subtotal</td>
        <td align="right">₹${order.subtotal.toFixed(2)}</td>
      </tr>
      ${order.discount > 0 ? `<tr><td style="color: #047857;">Discount</td><td align="right" style="color: #047857;">-₹${order.discount.toFixed(2)}</td></tr>` : ""}
      <tr>
        <td>Shipping & GST Tax</td>
        <td align="right">₹${(order.shipping + (order.tax || 0)).toFixed(2)}</td>
      </tr>
      <tr style="font-size: 15px; font-weight: bold;">
        <td style="padding-top: 10px;">Total Paid</td>
        <td align="right" style="padding-top: 10px;">₹${order.total.toFixed(2)}</td>
      </tr>
    </table>

    <div style="margin-top: 24px; font-size: 12px; color: #555555; background-color: #faf9f6; padding: 16px; border-radius: 8px;">
      <strong style="text-transform: uppercase; color: #1a1a1a;">Shipping Destination:</strong><br>
      ${order.shippingAddress.fullName}<br>
      ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ", " + order.shippingAddress.addressLine2 : ""}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
      ${order.shippingAddress.country}
    </div>

    <div style="text-align: center; margin-top: 32px;">
      <a href="https://labelnuvi.com/account/orders" class="btn">VIEW ORDER IN ACCOUNT</a>
    </div>
  `;

  return wrapInLuxuryTemplate(body, `Order Confirmation ${order.orderNumber}`);
}

/**
 * 2. Payment Success Template
 */
export function paymentSuccessTemplate(order: Order): string {
  const body = `
    <span class="badge" style="background-color: #ecfdf5; color: #047857;">PAYMENT SUCCESSFUL</span>
    <h2 class="title">PAYMENT AUTHORIZED & RECEIPT GENERATED</h2>
    <p class="text">Your transaction of <strong>₹${order.total.toFixed(2)}</strong> for Order <strong>${order.orderNumber}</strong> has been successfully authorized via Razorpay Checkout.</p>
    
    <div class="card">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px;">
        <tr><td><strong>Razorpay Payment ID:</strong></td><td align="right" style="font-family: monospace;">${order.paymentId || order.razorpayPaymentId || "rzp_live_confirmed"}</td></tr>
        <tr><td><strong>Transaction Date:</strong></td><td align="right">${order.date}</td></tr>
        <tr><td><strong>Amount Paid:</strong></td><td align="right"><strong>₹${order.total.toFixed(2)}</strong></td></tr>
      </table>
    </div>

    <div style="text-align: center; margin-top: 28px;">
      <a href="https://labelnuvi.com/account/orders" class="btn">TRACK SHIPMENT</a>
    </div>
  `;
  return wrapInLuxuryTemplate(body, `Payment Success ${order.orderNumber}`);
}

/**
 * 3. Order Status Update Template (Processing, Shipped, Delivered, Cancelled)
 */
export function orderStatusUpdateTemplate(order: Order, newStatus: string): string {
  const statusBadges: Record<string, string> = {
    Processing: '<span class="badge" style="background-color: #eff6ff; color: #1d4ed8;">ORDER IN PROCESSING</span>',
    Packed: '<span class="badge" style="background-color: #fef3c7; color: #b45309;">ORDER PACKED & SEALED</span>',
    Shipped: '<span class="badge" style="background-color: #ecfdf5; color: #047857;">COURIER DISPATCHED</span>',
    Delivered: '<span class="badge" style="background-color: #ecfdf5; color: #047857;">PACKAGE DELIVERED</span>',
    Cancelled: '<span class="badge" style="background-color: #fef2f2; color: #b91c1c;">ORDER CANCELLED</span>',
  };

  const badgeHtml = statusBadges[newStatus] || `<span class="badge">${newStatus.toUpperCase()}</span>`;

  const body = `
    ${badgeHtml}
    <h2 class="title">UPDATE FOR ORDER ${order.orderNumber}</h2>
    <p class="text">Your order status has been updated to: <strong style="text-transform: uppercase;">${newStatus}</strong>.</p>
    
    <div class="card">
      <p style="margin: 0; font-size: 12px; color: #1a1a1a;">
        <strong>Recipient:</strong> ${order.shippingAddress.fullName}<br>
        <strong>Courier Tracking:</strong> ${order.trackingNumber || "Express Air Cargo Assigned"}<br>
        <strong>Destination:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.country}
      </p>
    </div>

    <div style="text-align: center; margin-top: 28px;">
      <a href="https://labelnuvi.com/account/orders" class="btn">VIEW LIVE WORKFLOW</a>
    </div>
  `;

  return wrapInLuxuryTemplate(body, `Order Update ${order.orderNumber} - ${newStatus}`);
}

/**
 * 4. Password Reset Template
 */
export function passwordResetTemplate(email: string, resetUrl: string): string {
  const body = `
    <span class="badge">SECURITY VERIFICATION</span>
    <h2 class="title">RESET ATELIER PASSCODE</h2>
    <p class="text">We received a request to access your LABEL NUVI account (${email}). Click the authorization button below to authenticate into your account.</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="btn">AUTHENTICATE ACCOUNT</a>
    </div>

    <p class="text" style="font-size: 11px; color: #888888;">If you did not initiate this request, please disregard this email.</p>
  `;
  return wrapInLuxuryTemplate(body, "LABEL NUVI Security Authorization");
}

/**
 * 5. Welcome Email Template
 */
export function welcomeTemplate(userEmail: string, userName?: string): string {
  const body = `
    <span class="badge">VIP CLIENT WELCOME</span>
    <h2 class="title">WELCOME TO LABEL NUVI</h2>
    <p class="text">Dear ${userName || "Valued Client"},<br><br>Welcome to the LABEL NUVI Haute Couture Atelier. Your account (${userEmail}) grants you exclusive privilege to our Paris Fashion Week drops, silk satin corsetry, and tailored outerwear.</p>

    <div class="card" style="text-align: center;">
      <p style="font-size: 12px; color: #1a1a1a; font-weight: bold; uppercase; margin-bottom: 8px;">COMPLIMENTARY WELCOME PRIVILEGE</p>
      <p style="font-size: 14px; font-family: monospace; font-weight: bold; color: ${BRAND_GOLD}; margin: 0;">PROMO CODE: NUVI99</p>
      <p style="font-size: 11px; color: #777777; margin-top: 6px;">Enjoy complimentary shipping on your initial couture acquisition.</p>
    </div>

    <div style="text-align: center; margin-top: 32px;">
      <a href="https://labelnuvi.com/shop" class="btn">DISCOVER THE COLLECTION</a>
    </div>
  `;
  return wrapInLuxuryTemplate(body, "Welcome to LABEL NUVI Atelier");
}

/**
 * 6. Admin New Order Received Template
 */
export function adminNewOrderTemplate(order: Order): string {
  const body = `
    <span class="badge" style="background-color: #1a1a1a; color: #ffffff;">ADMIN NOTIFICATION</span>
    <h2 class="title">NEW ORDER RECEIVED: ${order.orderNumber}</h2>
    <p class="text">A new client order of <strong>₹${order.total.toFixed(2)}</strong> has been authorized via ${order.paymentMethod}.</p>

    <div class="card">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px;">
        <tr><td><strong>Client Name:</strong></td><td align="right">${order.shippingAddress.fullName}</td></tr>
        <tr><td><strong>Client Email:</strong></td><td align="right">${order.shippingAddress.email || "N/A"}</td></tr>
        <tr><td><strong>Phone:</strong></td><td align="right">${order.shippingAddress.phone}</td></tr>
        <tr><td><strong>Total Paid:</strong></td><td align="right"><strong>₹${order.total.toFixed(2)}</strong></td></tr>
      </table>
    </div>

    <div style="text-align: center; margin-top: 28px;">
      <a href="https://labelnuvi.com/admin/dashboard" class="btn">OPEN ADMIN DASHBOARD</a>
    </div>
  `;
  return wrapInLuxuryTemplate(body, `Admin Alert: New Order ${order.orderNumber}`);
}

/**
 * 7. Admin Payment Failed Template
 */
export function adminPaymentFailedTemplate(orderNumber: string, amount: number, reason: string): string {
  const body = `
    <span class="badge" style="background-color: #fef2f2; color: #b91c1c;">PAYMENT FAILED</span>
    <h2 class="title">TRANSACTION DECLINED: ${orderNumber}</h2>
    <p class="text">A checkout attempt of ₹${amount.toFixed(2)} failed or was cancelled by the user.</p>

    <div class="card">
      <p style="margin: 0; font-size: 12px; color: #b91c1c;">
        <strong>Reason:</strong> ${reason}
      </p>
    </div>

    <div style="text-align: center; margin-top: 28px;">
      <a href="https://labelnuvi.com/admin/dashboard" class="btn">INSPECT DASHBOARD</a>
    </div>
  `;
  return wrapInLuxuryTemplate(body, `Admin Alert: Payment Failed ${orderNumber}`);
}
