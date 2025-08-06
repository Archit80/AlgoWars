"use client";
import "./home.css"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/components/HOME/Leaderboard";
import Header from "@/components/HOME/Header";
import { Trophy, Zap, Target, Users, Swords } from "lucide-react";
import Link from "next/link";
import { XPProgress } from "@/components/HOME/XPProgress"
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import UserService, { UserData } from "@/services/userService";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        setUser(supabaseUser);
        
        if (supabaseUser?.id) {
          // Use the UserService to fetch user data
          const data = await UserService.getUserData(supabaseUser.id);
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] text-white flex items-center justify-center">
        <div className="text-lime-400 text-xl">Loading...</div>
      </div>
    );
  }

  const userId = user?.id || "default-user-id"; // Fallback for demo purposes
  
  // Use real data if available, fallback to demo data
  const userStats = userData ? {
    xp: userData.xp,
    level: userData.level,
    xpToNext: userData.xpToNext,
    streak: userData.streak,
    battlesWon: userData.battlesWon,
    accuracy: userData.accuracy,
    currentXP: userData.currentXP,
    totalXP: userData.totalXP,
  } : {
    xp: 2450,
    level: 12,
    xpToNext: 550,
    streak: 69,
    battlesWon: 23,
    accuracy: 87,
    currentXP: 2450, // Added for XPProgress
    totalXP: 3000,   // Example value, adjust as needed
  };
  
  const stats = [
    { icon: Trophy, label: 'Total Wins', value: userStats.battlesWon },
    { icon: Target, label: 'Accuracy', value: `${userStats.accuracy}%` },
    { icon: Zap, label: 'Longest Streak', value: userStats.streak },
    { icon: Users, label: 'Battles Played', value: userStats.battlesWon + 10 }
  ];

   
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      {/* Header */}
      <Header streak={userStats.streak} player={{ name: user?.user_metadata?.name, avatar: user?.user_metadata?.avatar, id: user?.id }} />

      {/* Main Content */}

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className={`text-5xl font-bold mb-2 py-2 bg-gradient-to-r from-lime-400/90 to-lime-500 bg-clip-text text-transparent ${spaceGrotesk.className}`}>
            Clash with Code. Rise through the ranks.
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
            Practice solo or compete in epic 1v1 coding battles against players worldwide.
            <br />
          Level up your skills, earn XP, and dominate the leaderboard.

          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/battle">
              <Button
                size="lg"
                className="glow-button hover:cursor-pointer bg-lime-500 hover:bg-lime-500/90 text-black font-semibold px-8 py-4 text-lg"
              >
                <Swords className="mr-2 h-5 w-5" />
                1v1 Match
              </Button>
            </Link>
            <Link href="/practice-mode-setup">
              <Button
                size="lg"
                variant="outline"
                className="hover:cursor-pointer border-2 border-lime-600 text-lime-500 bg-transparent  hover:bg-lime-500/50 hover:text-white px-8 py-4 text-lg "
              >
                <Target className="mr-2 h-5 w-5" />
                Practice Solo
              </Button>
            </Link>
          </div>
        </div>

        {/* XP Bar */}
          <XPProgress 
          currentXP={userStats.currentXP}
          totalXP={userStats.totalXP}
          level={userStats.level}
          className="max-w-2xl mx-auto mb-10 "
        />
            {/* <h2 className={`text-5xl font-bold mb-2 py-2 bg-gradient-to-r from-lime-400/90 to-lime-500 bg-clip-text text-transparent ${spaceGrotesk.className}`}> */}
        {/* Stats Cards */}
      <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 w-full text-center max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="border group border-zinc-900 hover:border-lime-500 transition-all duration-300 shadow-md shadow-zinc-950 bg-neutral-900 p-6 rounded-xl text-center">
              <stat.icon className="w-12 h-12 rounded-lg text-lime-400 bg-lime-600/10 p-2 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1 group-hover:text-lime-500">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}

        </motion.div>

        {/* View All Stats Button */}
        <div className="flex justify-center mb-16 ">
          <Link href={`/profile/${userId}`}>
            <Button
              variant="outline"
              className="border-lime-600 hover:cursor-pointer text-lime-500 hover:bg-lime-600 hover:text-white bg-transparent px-8 py-3 text-base font-semibold"
            >
              View All Stats
            </Button>
          </Link>
        </div>

        {/* Leaderboard Preview */}
        <Leaderboard />

        {/* Footer */}
      </div>
    </div>
  );
}
