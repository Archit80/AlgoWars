"use client";
import Header from "./landing-components/Header";
import HeroSection from "./landing-components/HeroSection";
import FeaturesSection from "./landing-components/FeaturesSection";
import dynamic from "next/dynamic";
import HowItWorksSection from "./landing-components/HowItWorksSection";
import LeaderboardSection from "./landing-components/LeaderboardSection";
import Footer from "./landing-components/Footer";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createOptimizedQueryClient } from "@/lib/optimizedQueryClient";

// Below the fold and heavy (syntax highlighter + Lottie player): load it after first paint
const Quiz = dynamic(() => import("./landing-components/Quiz"), {
  loading: () => <div className="min-h-[600px]" />,
});

export default function AlgoWarsLanding() {
  // One client for the page's lifetime (creating it per render discarded the cache every time)
  const [queryClient] = useState(createOptimizedQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="h-screen">
          <HeroSection />
        </div>
        <FeaturesSection />
        <Quiz />
        <HowItWorksSection />
        <LeaderboardSection />
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
