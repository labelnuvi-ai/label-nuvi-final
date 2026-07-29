import { Resend } from "resend";
import { createClient } from "@/lib/supabase/client";

const resendApiKey = process.env.RESEND_API_KEY || "re_dummy_key";
const resend = new Resend(resendApiKey);

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  emailType: string;
  metadata?: Record<string, any>;
}

/**
 * Log email dispatch result into Supabase email_logs table
 */
async function logEmailToDb(
  toEmail: string,
  subject: string,
  emailType: string,
  status: "sent" | "failed",
  errorMessage?: string,
  metadata?: Record<string, any>
) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("email_logs").insert({
      to_email: toEmail,
      subject,
      email_type: emailType,
      status,
      error_message: errorMessage || null,
      metadata: metadata || {},
      sent_at: new Date().toISOString(),
    });

    if (error && error.code !== "PGRST205") {
      console.error("Error logging email in Supabase email_logs table:", error);
    }
  } catch (err) {
    console.error("Email logging exception:", err);
  }
}

/**
 * Send Transactional Email with Retry mechanism & Supabase audit logging
 */
export async function sendEmail(payload: SendEmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  const { to, subject, html, emailType, metadata } = payload;

  const fromAddress = "LABEL NUVI Atelier <onboarding@resend.dev>";
  const maxRetries = 2;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[EMAIL DISPATCH] Sending ${emailType} to ${to} (Attempt ${attempt}/${maxRetries})...`);

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        html,
      });

      if (error) {
        lastError = error;
        console.warn(`[EMAIL DISPATCH ATTEMPT ${attempt} FAILED]:`, error);
      } else {
        console.log(`[EMAIL SENT SUCCESS] Type: ${emailType}, ID: ${data?.id}, To: ${to}`);
        await logEmailToDb(to, subject, emailType, "sent", undefined, metadata);
        return { success: true, id: data?.id };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[EMAIL DISPATCH EXCEPTION ${attempt}]:`, err.message);
    }

    if (attempt < maxRetries) {
      // Brief delay before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  const errorMsg = lastError?.message || lastError?.name || "Failed after maximum retries";
  await logEmailToDb(to, subject, emailType, "failed", errorMsg, metadata);
  return { success: false, error: errorMsg };
}
