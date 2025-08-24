"use client";
import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Target,
  Swords,
  Code,
  Award,
  LogOut,
  Trash2,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import UserService, {
  UserData,
  UserStats,
} from "../../../services/userService";
import QuestionPreviewModal from "@/components/QuestionPreviewModal";
import { Space_Grotesk } from "next/font/google";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import ProfileSkeleton from "./ProfileSkeleton";
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});
const ProfilePage: React.FC = () => {
  const { username: usernameParam } = useParams();
  const router = useRouter();
  console.log("Profile Username:", usernameParam);

  const { supabaseUser } = useUserStore();

  // const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"practice" | "battles" | "saved">(
    "battles"
  );

  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  console.log("supabaseUser:", supabaseUser);
  // Saved question preview modal state (moved here so hooks are declared before any early returns)
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<any | null>(null);

  const openPreview = (q: any) => {
    console.log("Opening preview for question:", q);
    setPreviewQuestion(q);
    setPreviewModalOpen(true);
    console.log("Modal state should be open now:", true);
  };
  const closePreview = () => {
    setPreviewModalOpen(false);
    setPreviewQuestion(null);
  };

  // Fetch user data and saved questions on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!usernameParam) return;

      try {
        setLoading(true);
        setError(null);
        const username = Array.isArray(usernameParam)
          ? usernameParam[0]
          : usernameParam;

        // Fetch both user data and stats using username
        const [data, stats] = await Promise.all([
          UserService.getUserDataByUsername(username),
          UserService.getUserStatsByUsername(username),
        ]);
        console.log("Fetched user data by username:", data);

        // Check if this is the current user's profile using the actual user ID
        const isCurrentUserProfile = data.id === supabaseUser?.id;
        setIsOwnProfile(isCurrentUserProfile);

        let savedQuestions: any[] = [];
        if (isCurrentUserProfile) {
          try {
            const res = await import("@/services/savedQuestionsService");
            const savedRes = await res.default.getSavedQuestions(data.id); // Use the actual user ID
            savedQuestions = (savedRes.savedQuestions || []).map((sq: any) => ({
              id: sq.question.id,
              title:
                sq.question.text.substring(0, 60) +
                (sq.question.text.length > 60 ? "..." : ""),
              fullText: sq.question.text,
              options: sq.question.options || [],
              correctAnswer:
                sq.correctAnswer ?? sq.question.correctAnswer ?? null,
              userAnswer: sq.userAnswer ?? null,
              difficulty: sq.question.difficulty,
              category: sq.question.categories.join(", "),
              saved: sq.createdAt
                ? new Date(sq.createdAt).toLocaleDateString()
                : "",
            }));
            console.log("Saved Questions:", savedQuestions);
          } catch (err) {
            console.log("Error fetching saved questions:", err);
          }
        }
        setUserData({ ...data, savedQuestions });
        setUserStats(stats);
      } catch (err) {
        console.error("Failed to fetch user data by username:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [supabaseUser?.id, usernameParam]);

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const formatFriendlyDate = (date?: string | Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <ProfileSkeleton />
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

  // Calculate derived stats from userData and userStats
  const totalCorrectAnswers = (userData.soloSessions ?? []).reduce(
    (sum, session) => sum + session.correctAnswers,
    0
  );
  const totalQuestions = (userData.soloSessions ?? []).reduce(
    (sum, session) => sum + session.totalQuestions,
    0
  );

  // Use fast database stats when available, fallback to calculated stats
  const accuracy =
    userStats && userStats.totalAnswers > 0
      ? Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100)
      : totalQuestions > 0
      ? Math.round((totalCorrectAnswers / totalQuestions) * 100)
      : 0;

  // Use the new level system data from backend
  const userCreatedAt: string | undefined = (
    userData as unknown as { createdAt?: string }
  )?.createdAt;

  const profileData = {
    username: userData.username || "Anonymous User",
    profilePic: userData.profilePic || "/default-avatar.png",
    xp: userData.currentXP, // Total XP
    streak: userData.streak,
    level: userData.level, // Use backend's exponential level calculation
    // Enhanced level system data
    tierName: userData.tierName,
    tierColor: userData.tierColor,
    tierEmoji: userData.tierEmoji,
    isAtMilestone: userData.isAtMilestone,
    totalBattles: userStats?.totalMatches || 0,
    wins: userStats?.matchesWon || 0,
    winRate:
      userStats && userStats.totalMatches > 0
        ? Math.round((userStats.matchesWon / userStats.totalMatches) * 100)
        : 0,
    accuracy: accuracy,
    joinDate: userCreatedAt
      ? `${formatFriendlyDate(userCreatedAt)}`
      : supabaseUser?.created_at
      ? `${formatFriendlyDate(supabaseUser.created_at)}`
      : "",
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
    // Map recent battles from backend
    recentBattles: (userData.recentBattles ?? []).map((battle) => {
      // Determine if user won, lost, or drew
      let result = "draw";
      if (battle.winnerId === userData.id) result = "win";
      else if (battle.winnerId && battle.winnerId !== userData.id)
        result = "loss";

      // Find opponent username
      let opponent =
        battle.user1Id === userData.id
          ? battle.user2?.username
          : battle.user1?.username;
      if (!opponent) opponent = "Unknown";

      // Calculate score
      const score =
        battle.user1Id === userData.id ? battle.user1Score : battle.user2Score;
      const xp =
        battle.user1Id === userData.id
          ? battle.user1Score * 27 + 50 + (result === "win" ? 100 : 0)
          : battle.user2Score * 27 + 50 + (result === "win" ? 100 : 0);

      return {
        opponent,
        result,
        date: new Date(battle.createdAt).toLocaleDateString(),
        xp,
        score,
      };
    }),
    savedQuestions: userData.savedQuestions ?? [],
  };

  const copyProfileLink = () => {
    const profileUrl = `https://algo-wars.vercel.app/profile/${profileData.username}`;
    navigator.clipboard.writeText(profileUrl);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const handleLogout = () => {
    import("@/lib/supabaseClient").then(({ supabase }) => {
      supabase.auth.signOut().then(() => {
        router.push("/");
      });
    });
  };

  return (
    <div className="min-h-screen p-6 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-8"
          // initial={{ opacity: 0, y: -30 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6 }}
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
            <button
              onClick={copyProfileLink}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:cursor-pointer hover:bg-gray-500 rounded-lg font-semibold transition-all text-white"
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6 sticky top-8 h-fit z-5">
            {/* Profile Card */}
            <div
              className="p-10 rounded-2xl text-center bg-neutral-900/50 shadow-sm shadow-black"
              // initial={{ opacity: 0, x: -30 }}
              // animate={{ opacity: 1, x: 0 }}
              // transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-24 h-24 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4 p-0.5">
                <Avatar className="w-full h-full">
                  <Image
                    src={profileData?.profilePic}
                    alt={`${profileData.username}'s avatar`}
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                  />
                </Avatar>
              </div>
              <h2
                className={`text-2xl font-bold mb-2 text-white ${spaceGrotesk.className}`}
              >
                @{profileData.username}
              </h2>

              {/* Tier Badge */}
              {profileData.tierName && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4"
                  style={{
                    backgroundColor: `${profileData.tierColor}20`,
                    border: `1px solid ${profileData.tierColor}50`,
                    color: profileData.tierColor,
                  }}
                >
                  <span>{profileData.tierEmoji}</span>
                  <span>{profileData.tierName}</span>
                  {profileData.isAtMilestone && (
                    <span className="text-yellow-400">👑</span>
                  )}
                </div>
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
            </div>

            {/* Quick Stats */}
            <div className="px-6 py-8 rounded-2xl  bg-neutral-900/50 shadow-sm shadow-black">
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
            </div>
          </div>

          {/* Right Column - Detailed Stats */}
          <div className="lg:col-span-2 space-y-6 bg-neutral-950 z-20">
            {/* Badges */}
            <div
              className="p-8 rounded-2xl  bg-neutral-900/50 shadow-sm shadow-black"
              // initial={{ opacity: 0, y: 30 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.6, delay: 0.2 }}
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
                          : "bg-neutral-800/50 border-neutral-700 opacity-70 hover:opacity-90"
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
            </div>

            {/* Activity History with Tabs */}
            <div
              className=" p-8 rounded-2xl  bg-neutral-900/50 shadow-sm shadow-black"
              // initial={{ opacity: 0, y: 30 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.6, delay: 0.4 }}
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
                    {profileData.recentBattles.length ? (
                      profileData.recentBattles.map((battle, index) => {
                        const accuracy = Math.round((battle.score / 5) * 100);
                        return (
                          <div
                            key={index}
                            className="p-4 bg-black/30 rounded-lg"
                          >
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
                              <span className="text-gray-300">
                                Score: {battle.score}/5
                              </span>
                              <span className="text-gray-300">
                                Accuracy: {accuracy}%
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
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
                        onClick={() => openPreview(question)}
                        className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl mb-6 relative transition-all duration-200 hover:border-lime-600 hover:bg-lime-500/10 hover:cursor-pointer"
                      >
                        <button
                          className="absolute top-4 right-4 p-2 rounded-lg text-red-400 hover:bg-red-500/40 transition-all"
                          title="Unsave"
                          onClick={async (e) => {
                            e.stopPropagation();
                            // Call unsave API
                            const res = await import(
                              "@/services/savedQuestionsService"
                            );
                            await res.default.toggleSave({
                              userId: supabaseUser?.id,
                              questionId: question.id,
                            });
                            // Remove from UI
                            setUserData(
                              (prev) =>
                                prev && {
                                  ...prev,
                                  savedQuestions: prev.savedQuestions?.filter(
                                    (q) => q.id !== question.id
                                  ),
                                }
                            );
                          }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="mb-2 text-gray-300 font-semibold">
                          {question.title?.split("\n")[0]}
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Difficulty:{" "}
                          <span
                            className={`font-semibold ${
                              question.difficulty === "Easy"
                                ? "text-green-400"
                                : question.difficulty === "Medium"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {question.difficulty}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Category: {question.category}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button (bottom of page, only for own profile) */}
        {isOwnProfile && (
          <div
            className="mt-8 pt-8 border-t border-gray-800 text-center"
            // initial={{ opacity: 0, scale: 0.8 }}
            // animate={{ opacity: 1, scale: 1 }}
            // transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white hover:cursor-pointer rounded-lg text-sm font-medium transition-all mx-auto"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Question Preview Modal */}
      <QuestionPreviewModal
        isOpen={previewModalOpen}
        question={previewQuestion}
        onClose={closePreview}
      />
    </div>
  );
};

export default ProfilePage;
