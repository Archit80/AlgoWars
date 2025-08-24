"use client";
import Header from "./landing-components/Header";
import HeroSection from "./landing-components/HeroSection";
import FeaturesSection from "./landing-components/FeaturesSection";
import Quiz from "./landing-components/Quiz";
import HowItWorksSection from "./landing-components/HowItWorksSection";
import LeaderboardSection from "./landing-components/LeaderboardSection";
import Footer from "./landing-components/Footer";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
import { Loader2, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createOptimizedQueryClient } from "@/lib/optimizedQueryClient";

export default function AlgoWarsLanding() {
  const queryClient = createOptimizedQueryClient(); // Use optimized client
  const [isLoading, setIsLoading] = useState(true);

  // Reduce artificial loading delay further
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 150); // Reduced from 300ms
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-lime-400 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Code2 className="h-8 w-8 text-black" />
          </div>
          <div className="flex items-center gap-2 text-lime-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className={`text-lg ${spaceGrotesk.className}`}>
              Loading AlgoWars...
            </span>
          </div>
        </div>
      </div>
    );
  }

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
