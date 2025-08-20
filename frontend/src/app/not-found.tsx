
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Gamepad2 } from "lucide-react";
import Link from "next/link";

const NotFound: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      `404 Error: User attempted to access non-existent route: ${pathname}`
    );
  }, [pathname]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10"></div>
      
      {/* Glassmorphism Container */}
      <div className="relative z-10 w-full max-w-lg p-8 space-y-8 text-center bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-lg">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-4">
          <Gamepad2 className="text-yellow-400 w-20 h-20 mb-4 animate-pulse" />
          <h1 className="text-7xl font-bold text-white tracking-tighter glitch" data-text="404">
            404
          </h1>
          <p className="text-xl text-neutral-400 font-mono mt-2">
            [LEVEL_NOT_FOUND]
          </p>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white font-heading">
            Lost in the Void
          </h2>
          <p className="text-neutral-300 text-lg">
            You&apos;ve ventured into uncharted territory. This area is not yet unlocked.
          </p>
          {/* Route display removed as requested */}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center pt-4">
          <Link href="/dashboard" passHref>
            <Button 
              size="lg" 
              className="w-full sm:w-auto transition-transform transform hover:scale-105 bg-lime-500 text-black font-bold hover:cursor-pointer"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Lobby
            </Button>
          </Link>
        </div>

        {/* Footer Message */}
        <div className="text-sm text-neutral-500 font-mono pt-4">
          {/* <p>GAME_STATUS: <span className="text-green-400">RUNNING</span></p> */}
          <p>Ready to get back in the game?</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
