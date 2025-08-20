"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UserProvider } from "@/contexts/userContext";
import userService from "@/services/userService";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      supabase.auth.getSession().then(async ({ data, error }) => {
        if (error) {
          console.error("Error retrieving session:", error);
        } else {
          const userId = data.session?.user?.id;
          if (userId) {
            try {
              const userData = await userService.getUserData(userId);
              if (!userData.isOnboarded) {
                router.push("/onboarding");
              } else {
                router.push("/dashboard");
              }
            } catch (err) {
              console.error("Error fetching user data:", err);
              router.push("/dashboard");
            }
          } else {
            router.push("/dashboard");
          }
        }
      });
    }
  }, [router]);
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}
