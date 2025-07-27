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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function CodeClashLanding() {
  const queryClient = new QueryClient();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-lime-400 rounded-lg flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Code2 className="h-8 w-8 text-black" />
          </div>
          <div className="flex items-center gap-2 text-lime-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className={`text-lg ${spaceGrotesk.className}`}>
              Loading CodeClash...
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
