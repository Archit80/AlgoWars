"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Swords, ArrowRight, Brain } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import FaultyTerminal from "@/components/FaultyTerminal/FaultyTerminal";
import { useUser } from "@/contexts/userContext";
// import { useEffect } from "react";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const HeroSection = () => {
  const router = useRouter();
  const { supabaseUser } = useUser();

  const handleLogin = () => {
    router.push("/login");
    if (supabaseUser) {
      router.push("/dashboard");
      return null; // Prevent rendering while redirecting
    }
  };

  return (
    <section className="relative px-4 pb-16 pt-48 h-full  text-center">
      <div
        className="absolute inset-0 h-full blur-[2px] bg-black/10 hidden md:block"
        style={{ position: "absolute", inset: 0 }}
      >
        <FaultyTerminal
          scale={0.8}
          digitSize={1}
          timeScale={0.6}
          scanlineIntensity={0.5}
          brightness={0.6}
          curvature={0.1}
          mouseReact={false}
          pageLoadAnimation={true}
          noiseAmp={0.7}
          tint="#CEFA05"
          // chromaticAberration={0.5}
        />
        {/* Feathered bottom border overlay */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "256px",
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, transparent 0%, #000000 100%)",
          }}
        />
      </div>
      {/* <div className="absolute inset-0 bg-gradient-to-b from-lime-500/10 via-transparent to-transparent" /> */}
      {/* <div className="absolute top-20 left-1/4 w-72 h-72 bg-lime-400/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000" /> */}
      <div className="relative z-10 mt-10 max-w-4xl mx-auto">
        <h1
          className={`text-5xl lg:text-7xl font-black mt-12 mb-2 leading-tight ${spaceGrotesk.className}`}
        >
          <span className="text-white">Code. Compete. Conquer.</span>
        </h1>
        <p className="text-xl lg:text-2xl font-medium text-white mb-8 max-w-2xl mx-auto">
          Welcome to the ultimate battleground of algorithms.
          <br /> 
          Hone your strategies, climb the ranks, and forge your legacy as an Algo Wars champion.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <Button
            size="lg"
            onClick={handleLogin}
            className="bg-lime-600 hover:bg-lime-700 text-white font-bold px-8 py-6 text-lg group transition-all duration-300 hover:cursor-pointer active:scale-95"
          >
            <Swords className="w-5 h-5 transition-transform" />
            Enter the Arena
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleLogin}
            className="border-lime-400 active:scale-95   text-white hover:text-white hover:cursor-pointer hover:bg-lime-400/20 px-8 py-6 text-lg bg-transparent"
          >
            <Brain className="w-5 h-5 mr-2" />
            Solo Grind
          </Button>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
