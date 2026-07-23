"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RefreshCw } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        console.log("User ID:", user.id);
        console.log("Profile:", profile);
        console.log("Role:", profile?.role);
        if (error) {
          console.error("Profile fetch error:", error);
        }

        if (profile?.role === "admin") {
          setAuthorized(true);
        } else {
          router.push("/account");
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        router.push("/account");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF8F5] text-xs font-label uppercase tracking-widest text-[#706C66]">
        <RefreshCw className="w-6 h-6 animate-spin text-neutral-400 mb-2" />
        <span>Verifying Admin Credentials...</span>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
