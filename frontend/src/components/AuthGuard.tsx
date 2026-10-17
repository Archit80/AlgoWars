"use client";
import Loader from "@/components/ui/Loader";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";

const publicPaths = ["/", "/login", "/auth/callback"];
const isPublicPath = (path: string) => publicPaths.includes(path) || path.startsWith("/profile/");

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { supabaseUser, isOnboarded, userDataFetched, loading } = useUserStore();
  const isPublic = isPublicPath(pathname);

  useEffect(() => {
    // Wait for the (local) session check
    if (loading) return;

    if (!supabaseUser) {
      if (!isPublic) router.replace("/login");
      return;
    }

    // Onboarding status comes from the backend profile
    if (!userDataFetched) return;
    if (!isOnboarded && pathname !== "/onboarding") {
      router.replace("/onboarding");
    } else if (isOnboarded && (pathname === "/login" || pathname === "/onboarding")) {
      router.replace("/dashboard");
    }
  }, [supabaseUser, isOnboarded, userDataFetched, loading, pathname, isPublic, router]);

  // Public pages render immediately. Protected pages wait for the local session check and,
  // on a first sign-in only, for the profile (it decides whether onboarding is needed).
  const waiting = !isPublic && (loading || !supabaseUser || !userDataFetched);
  if (waiting) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">
          <Loader />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
