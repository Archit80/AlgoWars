"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { useUserStore } from "@/stores/userStore";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const { isOnboarded, userDataFetched, refreshUser } = useUserStore();

  // Refresh user data immediately
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Redirect as soon as onboarding status is available
  useEffect(() => {
    if (userDataFetched) {
      router.replace(isOnboarded ? "/dashboard" : "/onboarding");
    }
  }, [userDataFetched, isOnboarded, router]);

  // Listen for sign-in event for delayed sign-ins
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        refreshUser(); // Ensure user data is fetched after sign-in
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader />
    </div>
  );
}
