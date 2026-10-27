"use client";
import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Target,
  Handshake,
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
import ProfileSkeleton from "./ProfileSkeleton";
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
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  // No data state
  if (!userData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-slate-600 text-lg">No profile data found</div>
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
          ? battle.user1Score * 25 + 50 + (result === "win" ? 100 : 0)
          : battle.user2Score * 25 + 50 + (result === "win" ? 100 : 0);

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

  const sectionTitle = (label: string, title: string, icon?: React.ReactNode) => (
    <div className="mb-5">
      <div className="section-label mb-1">{label}</div>
      <h3 className="text-xl font-semibold text-slate-900 rule-title flex items-center gap-2">
        {icon}
        {title}
      </h3>
    </div>
  );

  const tabClass = (active: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors border hover:cursor-pointer ${
      active
        ? "bg-blue-700 text-white border-blue-700"
        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
    }`;

  const thClass =
    "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500";
  const tdClass = "px-4 py-3 text-sm text-slate-600";

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4 ">
            <Link
              href="/dashboard"
              className="p-3 rounded-md group hover:bg-blue-700 border border-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-blue-700 group-hover:text-white" />
            </Link>
            <div>
              <div className="section-label mb-1">Student Profile</div>
              <h1 className="text-3xl font-semibold text-slate-900">
                {isOwnProfile
                  ? "Your Profile"
                  : `${profileData.username}'s profile`}
              </h1>
              <p className="text-slate-500 text-sm">
                Player statistics and achievements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyProfileLink}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:cursor-pointer hover:bg-slate-50 rounded-md text-sm font-semibold transition-colors text-slate-700"
            >
              {showCopySuccess ? (
                <>
                  <span className="text-emerald-600">✓</span>
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
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 h-fit">
            {/* Quick Stats */}
            <div className="px-6 py-6 rounded-lg bg-white border border-slate-200 shadow-sm">
              {sectionTitle("Table 1", "Quick Stats")}
              <dl>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <dt className="text-sm text-slate-500">Total Challenges</dt>
                  <dd className="font-semibold text-slate-900">{profileData.totalBattles}</dd>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <dt className="text-sm text-slate-500">Current Streak</dt>
                  <dd className="font-semibold text-blue-700">{profileData.streak} days</dd>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <dt className="text-sm text-slate-500">Accuracy</dt>
                  <dd className="font-semibold text-slate-900">{profileData.accuracy}%</dd>
                </div>
                <div className="flex items-center justify-between py-2">
                  <dt className="text-sm text-slate-500">Member Since</dt>
                  <dd className="font-semibold text-slate-900">{profileData.joinDate}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column - Detailed Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges */}
            <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-sm">
              {sectionTitle(
                "Achievements",
                "Achievements Record",
                <Award className="w-5 h-5 text-blue-700" />
              )}
              <div className="overflow-x-auto border border-slate-200 rounded-md">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className={thClass}>Achievement</th>
                      <th className={thClass}>Description</th>
                      <th className={thClass}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {profileData.badges.map((badge, index) => (
                      <tr key={index} className={badge.unlocked ? "" : "opacity-80"}>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                          <span className="inline-flex items-center gap-2">
                            <span
                              className={`w-8 h-8 rounded-md flex items-center justify-center text-lg ${
                                badge.unlocked ? "bg-blue-50" : "bg-slate-100 grayscale"
                              }`}
                            >
                              {badge.icon}
                            </span>
                            {badge.name}
                          </span>
                        </td>
                        <td className={tdClass}>{badge.description}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          {badge.unlocked ? (
                            <span className="text-emerald-600 font-semibold">
                              ✓ Unlocked
                            </span>
                          ) : (
                            <span className="text-slate-500">
                              Progress: {badge.progress}/{badge.goal}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-500">Table 2. Achievements and progress.</p>
            </div>

            {/* Activity History with Tabs */}
            <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-sm">
              {sectionTitle("Activity", "Activity History")}

              {/* Tabs */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setActiveTab("battles")}
                  className={tabClass(activeTab === "battles")}
                >
                  <Handshake className="w-4 h-4" />
                  Challenge History
                </button>
                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => setActiveTab("practice")}
                      className={tabClass(activeTab === "practice")}
                    >
                      <Target className="w-4 h-4" />
                      Practice History
                    </button>
                    <button
                      onClick={() => setActiveTab("saved")}
                      className={tabClass(activeTab === "saved")}
                    >
                      <Code className="w-4 h-4" />
                      Saved Questions
                    </button>
                  </>
                )}
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "battles" && (
                  <>
                    {profileData.recentBattles.length ? (
                      <div className="overflow-x-auto border border-slate-200 rounded-md">
                        <table className="w-full">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className={thClass}>Peer</th>
                              <th className={thClass}>Date</th>
                              <th className={thClass}>Result</th>
                              <th className={thClass}>Score</th>
                              <th className={thClass}>Accuracy</th>
                              <th className={thClass}>XP</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {profileData.recentBattles.map((battle, index) => {
                              const accuracy = Math.round((battle.score / 5) * 100);
                              return (
                                <tr key={index}>
                                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                                    Peer: {battle.opponent}
                                  </td>
                                  <td className={tdClass}>{battle.date}</td>
                                  <td
                                    className={`px-4 py-3 text-sm font-semibold ${
                                      battle.result === "win"
                                        ? "text-emerald-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {battle.result.toUpperCase()}
                                  </td>
                                  <td className={tdClass}>{battle.score}/5</td>
                                  <td className={tdClass}>{accuracy}%</td>
                                  <td className="px-4 py-3 text-sm font-semibold text-blue-700">
                                    +{battle.xp} XP
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">
                        No challenge history available.
                      </div>
                    )}
                  </>
                )}

                {activeTab === "practice" && isOwnProfile && (
                  <div className="overflow-x-auto border border-slate-200 rounded-md">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className={thClass}>Category</th>
                          <th className={thClass}>Date</th>
                          <th className={thClass}>Score</th>
                          <th className={thClass}>Accuracy</th>
                          <th className={thClass}>XP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {profileData.practiceHistory.map((session) => (
                          <tr key={session.id}>
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                              {session.category}
                            </td>
                            <td className={tdClass}>{session.date}</td>
                            <td className={tdClass}>
                              {session.score}/{session.total}
                            </td>
                            <td className={tdClass}>
                              {Math.round((session.score / session.total) * 100)}%
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-blue-700">
                              +{session.xp} XP
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "saved" && isOwnProfile && (
                  <div className="space-y-3">
                    {profileData.savedQuestions.map((question) => (
                      <div
                        key={question.id}
                        onClick={() => openPreview(question)}
                        className="bg-white border border-slate-200 p-5 rounded-md relative transition-colors hover:border-blue-700 hover:bg-blue-50 hover:cursor-pointer"
                      >
                        <button
                          className="absolute top-3 right-3 p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
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
                        <div className="mb-2 pr-10 text-slate-900 font-semibold">
                          {question.title?.split("\n")[0]}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Difficulty:{" "}
                          <span
                            className={`font-semibold ${
                              question.difficulty === "Easy"
                                ? "text-emerald-600"
                                : question.difficulty === "Medium"
                                ? "text-amber-600"
                                : "text-red-600"
                            }`}
                          >
                            {question.difficulty}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Category: {question.category}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button (bottom of page, only for own profile) */}
        {isOwnProfile && (
          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-red-600 hover:border-red-600 text-slate-600 hover:text-white hover:cursor-pointer rounded-md text-sm font-medium transition-colors mx-auto"
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
