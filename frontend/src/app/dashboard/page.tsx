"use client";
import "./home.css";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/contexts/userContext";
import { Button } from "@/components/ui/button";
// import { Leaderboard } from "@/components/HOME/Leaderboard";
import Header from "@/components/HOME/Header";
import { Trophy, Zap, Target, Users, Handshake } from "lucide-react";
import Link from "next/link";
import { XPProgress } from "@/components/HOME/XPProgress";
import UserService, { UserData } from "@/services/userService";

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
      <div className="min-h-screen bg-slate-50 text-slate-600 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
    { icon: Users, label: "Challenges Played", value: userStats.totalBattles },
  ];

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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
      <div className="container mx-auto px-4 py-10">
        {/* Welcome */}
        <section className="max-w-6xl mx-auto mb-10">
          <p className="section-label mb-2">Student Dashboard</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 rule-title mb-4">
            Welcome back{userData?.username ? `, ${userData.username}` : ""}
          </h2>
          <p className="text-base text-slate-600 mb-6 max-w-3xl">
            Practice solo or take part in peer coding challenges against other
            learners. Build your skills, earn XP, and track your progress.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/battle">
              <Button
                size="lg"
                className="hover:cursor-pointer bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8"
              >
                <Handshake className="mr-2 h-5 w-5" />
                Peer Challenge
              </Button>
            </Link>
            <Link href="/practice-mode-setup">
              <Button
                size="lg"
                variant="outline"
                className="hover:cursor-pointer border border-blue-700 text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-800 px-8"
              >
                <Target className="mr-2 h-5 w-5" />
                Practice Solo
              </Button>
            </Link>
          </div>
        </section>

        {/* Progress */}
        <section className="max-w-6xl mx-auto mb-10 bg-white border border-slate-200 rounded-md shadow-sm p-6">
          <p className="section-label mb-3">Progress Overview</p>
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
            className="w-full"
          />
        </section>

        {/* Stats Cards */}
        <section className="max-w-6xl mx-auto mb-4">
          <p className="section-label mb-3">Performance Summary</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 shadow-sm rounded-md p-5"
              >
                <stat.icon className="w-10 h-10 rounded-md text-blue-700 bg-blue-50 p-2 mb-3" />
                <div className="text-2xl font-semibold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Figure 1. Summary of your recorded activity.</p>
        </section>

        {/* View All Stats Button */}
        <div className="max-w-6xl mx-auto flex mb-12">
          <Link href={`/profile/${userData?.username || userId}`}>
            <Button
              variant="outline"
              className="border-blue-700 hover:cursor-pointer text-blue-700 hover:bg-blue-50 hover:text-blue-800 bg-white font-semibold"
            >
              View All Stats
            </Button>
          </Link>
        </div>

        {/* Leaderboard (disabled)
        <div>
          <Leaderboard />
        </div> */}
      </div>
    </div>
  );
}
