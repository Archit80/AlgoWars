"use client";
import "./home.css";
import Prism from "@/components/Prism/Prism";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/contexts/userContext";
import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/components/HOME/Leaderboard";
import Header from "@/components/HOME/Header";
import { Trophy, Zap, Target, Users, Swords } from "lucide-react";
import Link from "next/link";
import { XPProgress } from "@/components/HOME/XPProgress";
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import UserService, { UserData } from "@/services/userService";
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export default function HomePage() {
  const { supabaseUser } = useUser();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser();
        setUser(supabaseUser);
        console.log("Supabase user:", supabaseUser);
        if (supabaseUser?.id) {
          // Use the UserService to fetch user data
          const data = await UserService.getUserData(supabaseUser.id);
          console.log("Fetched user data:", data);
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
  const userStats = {
    xp: userData?.xp || 0,
    level: userData?.level || 1,
    xpToNext: userData?.xpToNext || 100,
    streak: userData?.streak || 0,
    longestStreak: userData?.longestStreak || 0,
    battlesWon: userData?.matchesWon || userData?.battlesWon || 0,
    totalBattles: userData?.totalMatches || userData?.totalBattles || 0,
    accuracy:
      userData?.totalAnswers > 0
        ? Math.round((userData?.correctAnswers / userData?.totalAnswers) * 100)
        : userData?.accuracy || 0,
    // Enhanced level system data with fallbacks
    currentXP: userData?.currentXP || userData?.xp || 0,
    currentLevelXP: userData?.currentLevelXP || 0,
    xpRequiredForCurrentLevel: userData?.xpRequiredForCurrentLevel || 0,
    progress: userData?.progress || 0,
    tierName: userData?.tierName || "Bronze",
    tierColor: userData?.tierColor || "#CD7F32",
    tierEmoji: userData?.tierEmoji || "🥉",
    isAtMilestone: userData?.isAtMilestone || false,
    // Legacy compatibility
    totalXP: userData?.totalXP || userData?.currentXP || userData?.xp || 0,
  };

  const stats = [
    { icon: Trophy, label: "Total Wins", value: userStats.battlesWon },
    { icon: Target, label: "Accuracy", value: `${userStats.accuracy}%` },
    { icon: Zap, label: "Longest Streak", value: userStats.longestStreak },
    { icon: Users, label: "Battles Played", value: userStats.totalBattles },
  ];

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E]/80 text-white relative">
      <div
        className="inset-0 fixed h-screen w-screen z-1 opacity-25 pointer-events-none"
        aria-hidden
      >
        <div className="bg-black/50 z-3 w-full h-full hidden md:block">
          <Prism
            animationType="hover"
            timeScale={1.5}
            height={5}
            baseWidth={7.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0.6}
            glow={0.3}
          />
        </div>
      </div>
      {/* Header */}
      <Header
        streak={userStats.streak}
        player={{
          name: user?.user_metadata?.name,
          profilePic: userData?.profilePic,
          id: user?.id,
          username: userData?.username,
        }}
      />

      {/* Main Content */}

      <div className="container mx-auto px-4 py-8 z-30">
        {/* Hero Section */}
        <div className="text-center mb-12 z-20">
          <h2
            className={`text-5xl font-bold mb-2 py-2 bg-gradient-to-b from-lime-400 to-lime-500 bg-clip-text text-transparent ${spaceGrotesk.className}`}
          >
            Clash with Code. Rise through the ranks.
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
            Practice solo or compete in epic 1v1 coding battles against players
            worldwide.
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

        <div className="z-20">
          {/* Enhanced XP Bar */}
          <XPProgress
            level={userStats.level}
            currentXP={userStats.currentXP}
            currentLevelXP={userStats.currentLevelXP}
            xpToNext={userStats.xpToNext}
            xpRequiredForCurrentLevel={userStats.xpRequiredForCurrentLevel}
            progress={userStats.progress}
            tierName={userStats.tierName}
            tierColor={userStats.tierColor}
            tierEmoji={userStats.tierEmoji}
            isAtMilestone={userStats.isAtMilestone}
            totalXP={userStats.totalXP}
            className="max-w-2xl mx-auto mb-10"
          />
        </div>
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 w-full text-center max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="border group border-zinc-900 hover:border-lime-500 transition-all duration-300 shadow-md shadow-zinc-950 bg-neutral-900 p-6 rounded-xl text-center"
            >
              <stat.icon className="w-12 h-12 rounded-lg text-lime-400 bg-lime-600/10 p-2 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1 group-hover:text-lime-500">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* View All Stats Button */}
        <div className="flex justify-center mb-16 ">
          <Link href={`/profile/${userData?.username || userId}`}>
            <Button
              variant="outline"
              className="border-lime-600 hover:cursor-pointer text-lime-500 hover:bg-lime-600 hover:text-white bg-transparent px-8 py-3 text-base font-semibold"
            >
              View All Stats
            </Button>
          </Link>
        </div>

        {/* Leaderboard Preview */}
        <div className="z-30">
          <Leaderboard />
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}
