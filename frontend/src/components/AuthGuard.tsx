"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import { useUserStore } from "@/stores/userStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { supabaseUser, initialized } = useUser();
  const { isOnboarded, userDataFetched, loading } = useUserStore();

  useEffect(() => {
    // Wait for auth initialization
    if (!initialized || loading) return;

    console.log("AuthGuard check:", { 
      supabaseUser: !!supabaseUser, 
      isOnboarded, 
      userDataFetched,
      currentPath: window.location.pathname 
    });

    const currentPath = window.location.pathname;

    // Not authenticated
    if (!supabaseUser) {
      if (currentPath !== "/login" && currentPath !== "/") {
        console.log("Redirecting to login - no user");
        router.replace("/login");
      }
      return;
    }

    // User exists but data not fetched yet
    if (!userDataFetched) {
      console.log("Waiting for user data to load...");
      return;
    }

    // User exists and data fetched
    if (supabaseUser && userDataFetched) {
      // Not onboarded - send to onboarding (unless already there)
      if (!isOnboarded && currentPath !== "/onboarding") {
        console.log("Redirecting to onboarding - not onboarded");
        router.replace("/onboarding");
        return;
      }

      // Onboarded but on login/onboarding pages - send to dashboard
      if (isOnboarded && (currentPath === "/login" || currentPath === "/onboarding")) {
        console.log("Redirecting to dashboard - already onboarded");
        router.replace("/dashboard");
        return;
      }
    }
  }, [supabaseUser, initialized, isOnboarded, userDataFetched, loading, router]);

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
