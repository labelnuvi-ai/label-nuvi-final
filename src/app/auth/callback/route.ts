import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user?.email) {
      // Trigger welcome email asynchronously
      try {
        const { sendEmail } = await import("@/lib/email/sender");
        const { welcomeTemplate } = await import("@/lib/email/templates");
        sendEmail({
          to: data.user.email,
          subject: "Welcome to LABEL NUVI Atelier",
          html: welcomeTemplate(data.user.email, data.user.user_metadata?.full_name),
          emailType: "welcome_email",
          metadata: { userId: data.user.id },
        });
      } catch (e) {
        console.error("Welcome email exception:", e);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Redirect to login if error occurred
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
