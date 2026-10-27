"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Handshake, ArrowRight, BookOpen } from "lucide-react";
import { useUser } from "@/contexts/userContext";

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
    <section className="relative px-4 pt-32 pb-20 bg-white paper-grid border-b border-slate-200">
      <div className="max-w-4xl mx-auto text-center">
        <p className="section-label mb-4">Final Year Project &middot; Web Application</p>
        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
          A Competitive Platform for Learning Algorithms
        </h1>
        <div className="mx-auto mb-8 max-w-2xl bg-white border border-slate-200 rounded-md p-5 text-left shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Abstract</p>
          <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
            AlgoLearn is a web-based environment for practising data structures and algorithms.
            Learners solve programming challenges on their own or compete in real-time peer
            challenges, earn experience points, and track their progress over time.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            size="lg"
            onClick={handleLogin}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-6 text-base group hover:cursor-pointer"
          >
            <Handshake className="w-5 h-5" />
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleLogin}
            className="border-slate-300 text-blue-700 hover:text-blue-800 hover:bg-blue-50 hover:cursor-pointer px-8 py-6 text-base bg-white"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Practice Solo
          </Button>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
