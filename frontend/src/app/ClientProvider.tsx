"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      // If using PKCE OAuth:
      // supabase.auth.exchangeCodeForSession();

      // For magic link login (email OTP):
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.error("Error retrieving session:", error);
        } else {
          console.log("Session retrieved:", data.session);
          router.push("/dashboard");
        }
      });
    }
  }, [router]);
  return <>{children}</>;
}
