import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay environment credentials missing" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const amountNum = body.amount || body.total;

    if (!amountNum || typeof amountNum !== "number" || amountNum <= 0) {
      return NextResponse.json(
        { error: "Invalid or missing amount" },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(amountNum * 100);
    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise (1 INR)" },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${crypto.randomUUID().slice(0, 8)}`,
    });

    return NextResponse.json({
      id: order.id,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    const statusCode = error?.statusCode || error?.status || 500;
    return NextResponse.json(
      { error: error?.message || "Failed to create Razorpay order" },
      { status: statusCode }
    );
  }
}