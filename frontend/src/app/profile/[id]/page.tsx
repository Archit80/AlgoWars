"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  Share2,
  Target,
  Swords,
  Code,
  Award,
  LogOut,
  User,
} from "lucide-react";
import { useUser } from "@/contexts/userContext";
import UserService, { UserData } from "../../../services/userService";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});
const ProfilePage: React.FC = () => {

  const { id: userId } = useParams();
  console.log("Profile ID:", userId);

  const { supabaseUser } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"practice" | "battles" | "saved">(
    "battles"
  );
  const [bio, setBio] = useState(
    "Passionate developer who loves solving complex algorithms and competing in coding battles. Always ready for a challenge! 🚀"
  );
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if this is the current user's profile
  const isOwnProfile = userId === supabaseUser?.id;

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const idStr = Array.isArray(userId) ? userId[0] : userId;
        const data = await UserService.getUserData(idStr);
        console.log("Fetched user data:", data);
        setUserData(data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabaseUser?.id, userId]);

  // Helper functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  // No data state
  if (!userData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white text-lg">No profile data found</div>
      </div>
    );
  }

  // Calculate derived stats from userData
  const totalCorrectAnswers = (userData.soloSessions ?? []).reduce(
    (sum, session) => sum + session.correctAnswers,
    0
  );
  const totalQuestions = (userData.soloSessions ?? []).reduce(
    (sum, session) => sum + session.totalQuestions,
    0
  );
  const accuracy =
    totalQuestions > 0
      ? Math.round((totalCorrectAnswers / totalQuestions) * 100)
      : 0;
  const level = Math.floor(userData.xp / 100) + 1; // Simple level calculation

  const profileData = {
    username: userData.username || "Anonymous User",
    // displayName: (userData.username || "Anonymous User"),
    xp: userData.totalXP,
    streak: userData.streak,
    level: level,
    totalBattles: 0, // Not implemented yet
    wins: 0, // Not implemented yet
    winRate: 0, // Not implemented yet
    accuracy: accuracy,
    joinDate: "2024-01-15", // Could add this to User schema later
    favoriteLanguage: "JavaScript", // Could calculate from session categories
    practiceHistory: (userData.soloSessions ?? []).map((session) => ({
      id: session.id,
      date: formatDate(session.startedAt),
      category: session.categories.join(", "),
      score: session.correctAnswers,
      total: session.totalQuestions,
      xp: session.xpEarned,
      time: session.duration || 0,
      mode: session.mode,
      difficulty: session.difficulty,
    })),
    badges: (userData.userAchievements ?? []).map((ua) => ({
      name: ua.achievement.name,
      icon: ua.achievement.emoji,
      description: ua.achievement.description,
      unlocked: ua.unlocked,
      progress: ua.progress,
      goal: ua.achievement.goal,
    })),
    // Placeholder data for features not yet implemented
    recentBattles: [],
    savedQuestions: [],
    // skillBreakdown: [
    //   { skill: "JavaScript", level: 85 },
    //   { skill: "Python", level: 78 },
    //   { skill: "Algorithms", level: 92 },
    //   { skill: "Debugging", level: 70 },
    //   { skill: "React", level: 88 },
    // ]
  };

  const copyProfileLink = () => {
    const profileUrl = `https://codeclash.com/profile/${profileData.username}`;
    navigator.clipboard.writeText(profileUrl);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const handleLogout = () => {
    // In real app, this would call auth logout
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen p-6 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 ">
            <Link
              href="/dashboard"
              className="p-3 rounded-xl group hover:bg-lime-500 border border-lime-500 transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-lime-500 group-hover:text-white" />
            </Link>
            <div>
              <h1
                className={`text-4xl font-bold text-lime-400 ${spaceGrotesk.className}`}
              >
                {isOwnProfile
                  ? "Your Profile"
                  : `${profileData.username}'s profile`}
              </h1>
              <p className="text-gray-400 code-font">
                {"> Player statistics and achievements"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  isEditing
                    ? "bg-lime-500 text-black"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? "Save" : "Edit"}
              </button>
            )}
            <button
              onClick={copyProfileLink}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-all text-white"
            >
              {showCopySuccess ? (
                <>
                  <span className="text-lime-400">✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share
                </>
              )}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              className="p-8 rounded-2xl text-center bg-neutral-900/50 shadow-sm shadow-black"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-24 h-24 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-black" />
              </div>
              <h2
                className={`text-2xl font-bold mb-2 text-white ${spaceGrotesk.className}`}
              >
                @{profileData.username}
              </h2>
              {/* <p className="text-gray-400 mb-4">@{profileData.username}</p> */}

              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-lime-500 focus:outline-none text-sm resize-none text-white"
                  rows={4}
                  placeholder="Tell others about yourself..."
                />
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed">{bio}</p>
              )}

              <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-neutral-700 ">
                <div className="text-center">
                  <div className="text-2xl font-bold text-lime-400">
                    {profileData.level}
                  </div>
                  <div className="text-xs text-gray-400">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-lime-400">
                    {profileData.xp}
                  </div>
                  <div className="text-xs text-gray-400">XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-lime-400">
                    {profileData.winRate}%
                  </div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="p-6 rounded-2xl  bg-neutral-900/50 shadow-sm shadow-black"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-bold mb-4 text-white">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Battles</span>
                  <span className="font-semibold text-white">
                    {profileData.totalBattles}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current Streak</span>
                  <span className="font-semibold text-lime-400">
                    {profileData.streak} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="font-semibold text-white">
                    {profileData.accuracy}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Member Since</span>
                  <span className="font-semibold text-white">
                    {profileData.joinDate}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Challenge Button (for visitors) */}
            {/* {!isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  href="/match"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-lime-500 hover:bg-lime-400 text-black rounded-xl font-bold transition-all lime-glow-strong"
                >
                  <Swords className="w-5 h-5" />
                  Challenge {profileData.displayName}
                </Link>
              </motion.div>
            )} */}
          </div>

          {/* Right Column - Detailed Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges */}
            <motion.div
              className="p-8 rounded-2xl  bg-neutral-900/50 shadow-sm shadow-black"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3
                className={`text-2xl font-bold mb-6 flex items-center gap-3 text-white ${spaceGrotesk.className}`}
              >
                <Award className="w-6 h-6 text-lime-400" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileData.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl text-center group transition-all duration-300 border
                      ${
                        badge.unlocked
                          ? "bg-gradient-to-br from-lime-500/30 to-lime-500/20 border-lime-500/50 shadow-lime-500/10 hover:border-lime-500 shadow-lg hover:shadow-lime-400/35"
                          : "bg-neutral-800/50 border-neutral-700 opacity-60 hover:opacity-80"
                      }
                    `}
                  >
                    <div
                      className={`text-3xl mb-2 transition-all ${
                        badge.unlocked ? "filter-none" : "grayscale"
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div
                      className={`font-semibold text-sm mb-1 ${
                        badge.unlocked ? "text-lime-100" : "text-gray-500"
                      }`}
                    >
                      {badge.name}
                    </div>
                    <div
                      className={`text-xs ${
                        badge.unlocked ? "text-lime-200/80" : "text-gray-600"
                      }`}
                    >
                      {badge.description}
                    </div>
                    {badge.unlocked ? (
                      <div className="mt-2 text-xs text-lime-400 font-semibold">
                        ✓ Unlocked
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-gray-500">
                        Progress: {badge.progress}/{badge.goal}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Activity History with Tabs */}
            <motion.div
              className=" p-8 rounded-2xl  bg-neutral-900/50 shadow-sm shadow-black"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3
                className={`text-2xl font-bold mb-6 text-white ${spaceGrotesk.className}`}
              >
                Activity History
              </h3>

              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("battles")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === "battles"
                      ? "bg-lime-500 text-black"
                      : "bg-neutral-700 hover:bg-neutral-600 hover:cursor-pointer"
                  }`}
                >
                  <Swords className="w-4 h-4" />
                  Battle History
                </button>
                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => setActiveTab("practice")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === "practice"
                          ? "bg-lime-500 text-black"
                          : "bg-neutral-700 hover:bg-neutral-600 hover:cursor-pointer"
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      Practice History
                    </button>
                    <button
                      onClick={() => setActiveTab("saved")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === "saved"
                          ? "bg-lime-500 text-black"
                          : "bg-neutral-700 hover:bg-neutral-600 hover:cursor-pointer"
                      }`}
                    >
                      <Code className="w-4 h-4" />
                      Saved Questions
                    </button>
                  </>
                )}
              </div>

              {/* Tab Content */}
              <div className="space-y-3">
                {activeTab === "battles" && (
                  <>
                    {profileData.recentBattles.length ?( profileData.recentBattles.map((battle, index) => (
                      <div key={index} className="p-4 bg-black/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                battle.result === "win"
                                  ? "bg-lime-400"
                                  : "bg-red-400"
                              }`}
                            ></div>
                            <span className="font-semibold text-white">
                              vs {battle.opponent}
                            </span>
                            <span className="text-sm text-gray-400">
                              {battle.date}
                            </span>
                          </div>
                          <span className="text-lime-400 font-semibold">
                            +{battle.xp} XP
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span
                            className={`font-semibold ${
                              battle.result === "win"
                                ? "text-lime-400"
                                : "text-red-400"
                            }`}
                          >
                            {battle.result.toUpperCase()}
                          </span>
                          <span>Score: {battle.score}</span>
                        </div>
                      </div>
                    ))): (
                      <div className="text-neutral-400 text-sm">
                        No battle history available.
                      </div>
                    )}
                  </>
                )}

                {activeTab === "practice" && isOwnProfile && (
                  <>
                    {profileData.practiceHistory.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 bg-black/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-lime-400 rounded-full"></div>
                            <span className="font-semibold text-white">
                              {session.category}
                            </span>
                            <span className="text-sm text-gray-400">
                              {session.date}
                            </span>
                          </div>
                          <span className="text-lime-400 font-semibold">
                            +{session.xp} XP
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span className="text-gray-300">
                            Score: {session.score}/{session.total}
                          </span>
                          <span className="text-gray-300">
                            Time: {formatTime(session.time)}
                          </span>
                          <span className="text-gray-300">
                            Accuracy:{" "}
                            {Math.round((session.score / session.total) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {activeTab === "saved" && isOwnProfile && (
                  <>
                    {profileData.savedQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="p-4 bg-black/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-lime-400 rounded-full"></div>
                            <span className="font-semibold text-white">
                              {question.title}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                question.difficulty === "Easy"
                                  ? "bg-green-500/20 text-green-400"
                                  : question.difficulty === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {question.difficulty}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {question.saved}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Category: {question.category}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Logout Button (bottom of page, only for own profile) */}
        {isOwnProfile && (
          <motion.div
            className="mt-8 pt-8 border-t border-gray-800 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-all mx-auto"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
