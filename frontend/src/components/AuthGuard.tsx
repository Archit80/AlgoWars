"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import { useUserStore } from "@/stores/userStore";

const publicPaths = ["/", "/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { supabaseUser, initialized } = useUser();
  const { isOnboarded, userDataFetched, loading } = useUserStore();

  useEffect(() => {
    // Wait for auth initialization
    if (!initialized || loading) return;

    const currentPath = window.location.pathname;
    const isPublic = publicPaths.includes(currentPath) || currentPath.startsWith("/profile/");

    // Not authenticated and not on a public path
    if (!supabaseUser && !isPublic) {
      router.replace("/login");
      return;
    }

    // User exists and data fetched
    if (supabaseUser && userDataFetched) {
      // Not onboarded - send to onboarding (unless already there)
      if (!isOnboarded && currentPath !== "/onboarding") {
        router.replace("/onboarding");
      } 
      // Onboarded but on login/onboarding pages - send to dashboard
      else if (isOnboarded && (currentPath === "/login" || currentPath === "/onboarding")) {
        router.replace("/dashboard");
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
