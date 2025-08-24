"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { Swords, UserPlus, ArrowLeft, CheckCircle, Layers, Zap, Hash, Share2, KeyRound, ChevronsRightLeft, ArrowLeftRight, Crosshair, ListOrdered, RefreshCw, TreePine, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { useMatchStore } from "@/stores/matchStore";
import MatchService from "@/services/matchService";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

const dataStructureTopics = [
  { id: "Arrays", name: "Arrays", icon: Hash, bgColor: "bg-blue-500" },
  { id: "Strings", name: "Strings", icon: Share2, bgColor: "bg-orange-500" },
  { id: "Trees", name: "Trees", icon: TreePine, bgColor: "bg-lime-500" },
  { id: "Graphs", name: "Graphs", icon: KeyRound, bgColor: "bg-fuchsia-400" },
  { id: "StacksQueues", name: "Stacks & Queues", icon: Layers, bgColor: "bg-rose-500" },
  { id: "HashMaps", name: "Hash Maps", icon: ChevronsRightLeft, bgColor: "bg-cyan-500" },
];
const algorithmTopics = [
  { id: "SlidingWindow", name: "Sliding Window", icon: ChevronsRightLeft, bgColor: "bg-red-500" },
  { id: "TwoPointers", name: "Two Pointers", icon: ArrowLeftRight, bgColor: "bg-indigo-500" },
  { id: "BinarySearch", name: "Binary Search", icon: Crosshair, bgColor: "bg-yellow-500" },
  { id: "Sorting", name: "Sorting", icon: ListOrdered, bgColor: "bg-emerald-500" },
  { id: "Recursion", name: "Recursion", icon: RefreshCw, bgColor: "bg-pink-400" },
  { id: "DynamicProgramming", name: "Dynamic Programming", icon: Grid3X3, bgColor: "bg-green-500" },
];

const difficulties = [
  { id: "EASY", name: "Easy", color: "bg-green-500" },
  { id: "MEDIUM", name: "Medium", color: "bg-yellow-500" },
  { id: "HARD", name: "Hard", color: "bg-red-500" },
];

export default function BattleSetup() {
  const { supabaseUser } = useUser();
  const router = useRouter();
  const { userStats } = useUserStore();
  const { setMatchData } = useMatchStore();
  const [mode, setMode] = useState<"friend" | "random" | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("MEDIUM");
  const [loading, setLoading] = useState(false);

  // Route protection
  useEffect(() => {
    if (!supabaseUser) {
      router.push("/login");
    }
  }, [supabaseUser, router]);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topicId)) return prev.filter((id) => id !== topicId);
      if (prev.length >= 3) return prev;
      return [...prev, topicId];
    });
  };

  const startBattle = async () => {
    if (!mode || selectedTopics.length === 0) return;
    setLoading(true);
    try {
      const userId = (supabaseUser as { id: string } | null)?.id || "guest"; // Adjust if auth is required
      if (mode === "friend") {
        const res = await MatchService.createFriendMatch({ userId, topics: selectedTopics, difficulty });
        const id = res.matchId || res.match?.id;
        
        // Store match data just like in random match
        if (res.match) {
          setMatchData({
            matchId: id,
            user1Id: res.match.user1Id,
            user2Id: res.match.user2Id,
            user1Username: res.match.user1Username || res.match.user1?.username,
            user2Username: res.match.user2Username || res.match.user2?.username,
            user1Score: res.match.user1Score || 0,
            user2Score: res.match.user2Score || 0,
            currentIndex: res.match.currentIndex || 0,
            status: res.match.status,
            roomCode: res.roomCode,
          });
        }
        
        router.push(`/battle/waiting/${id}`);
      } else {
        // Random match logic
        const res = await MatchService.createOrJoinRandomMatch({ 
          userId, 
          topics: selectedTopics, 
          difficulty,
          xp: userStats?.xp || 0 
        });
        
        if (res.success) {
          if (res.status === "matched") {
            // Match found immediately, store match data and go to play page
            if (res.match) {
              setMatchData({
                matchId: res.matchId || res.match.id,
                user1Id: res.match.user1Id,
                user2Id: res.match.user2Id,
                user1Username: res.match.user1Username || res.match.user1?.username,
                user2Username: res.match.user2Username || res.match.user2?.username,
                user1Score: res.match.user1Score || 0,
                user2Score: res.match.user2Score || 0,
                currentIndex: res.match.currentIndex || 0,
                status: res.match.status || 'ONGOING'
              });
            }
            router.push(`/battle/play/${res.matchId}`);
          } else if (res.status === "waiting") {
            // Still waiting, show waiting page
            router.push(`/battle/waiting/random`);
          }
        }
      }
    } catch (e) {
      console.error(e);
      alert("Failed to start battle");
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-[#0E0E0E] text-white">
      <div className="max-w-6xl mx-auto ">
        <motion.div className="flex items-center gap-4 mb-8" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/dashboard" className="p-3 bg-lime-600 rounded-xl hover:bg-lime-500 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className={`${spaceGrotesk.className} text-4xl font-bold text-lime-500`}>1v1 Battle</h1>
            <p className="text-neutral-200 font-mono">{"> Pick mode, topics (up to 3), and difficulty"}</p>
          </div>
        </motion.div>

        {/* Mode selection */}
        <motion.div className="bg-neutral-900/90 border border-neutral-800 p-6 rounded-2xl mb-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className={`${spaceGrotesk.className} text-2xl font-bold text-lime-500 mb-4 `}>Choose Match Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Friend Card */}
            <button
              onClick={() => setMode("friend")}
              aria-pressed={mode === "friend"}
              className={`relative overflow-hidden p-6 rounded-2xl text-left transition-all border-2 hover:cursor-pointer
                ${mode === "friend"
                  ? "border-lime-400 bg-gradient-to-br from-lime-500/15 to-lime-600/5 shadow-[0_0_0_2px_rgba(132,204,22,0.2)]"
                  : "border-neutral-700 hover:border-lime-500/60 bg-neutral-900/50"}
              `}
            >
              <div className="flex items-center gap-6 mb-2">
                <div className="w-10 h-10 rounded-xl bg-lime-600/15 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white flex items-center gap-2">
                    Play with Friend
                  </div>
                  <p className="text-sm text-neutral-400">Create a private room and invite your friend</p>
                </div>
              </div>
            </button>

            {/* Random Card */}
            <button
              onClick={() => setMode("random")}
              aria-pressed={mode === "random"}
              className={`relative overflow-hidden p-6 rounded-2xl text-left transition-all border-2 hover:cursor-pointer 
                ${mode === "random"
                  ? "border-lime-400 bg-gradient-to-br from-lime-500/15 to-lime-600/5 shadow-[0_0_0_2px_rgba(132,204,22,0.2)]"
                  : "border-neutral-700 hover:border-lime-400/60 bg-neutral-900/50"}
              `}
            >
              <div className="flex items-center gap-6 mb-2">
                <div className="w-10 h-10 rounded-xl bg-lime-600/15 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white flex items-center gap-2">
                    Random Match
                  </div>
                  <p className="text-sm text-neutral-400">Get matched with a random player</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Topic selection */}
        <motion.div className="bg-neutral-900/90 border border-neutral-800 p-6 rounded-2xl mb-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className={`${spaceGrotesk.className} text-2xl font-bold text-lime-500 mb-2`}>Choose Topics</h2>
          <p className="text-xs text-neutral-400 mb-4">Select up to 3</p>
          <div className="mb-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><Layers className="w-4 h-4 text-lime-500" /> Data Structures</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {dataStructureTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                const isDisabled = !isSelected && selectedTopics.length >= 5;
                return (
                  <button key={topic.id} onClick={() => toggleTopic(topic.id)} disabled={isDisabled} className={`relative p-4 rounded-xl border-2 transition-all ${isSelected ? "border-lime-500 bg-lime-500/20" : isDisabled ? "border-neutral-700 bg-neutral-800/50 opacity-50 cursor-not-allowed" : "border-neutral-600 hover:border-lime-400/60"}`}>
                    {isSelected && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-lime-400" />}
                    <div className={`w-8 h-8 ${topic.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <topic.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-white text-sm font-medium text-center">{topic.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-lime-500" /> Algorithms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {algorithmTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                const isDisabled = !isSelected && selectedTopics.length >= 5;
                return (
                  <button key={topic.id} onClick={() => toggleTopic(topic.id)} disabled={isDisabled} className={`relative p-4 rounded-xl border-2 transition-all ${isSelected ? "border-lime-500 bg-lime-500/20" : isDisabled ? "border-neutral-700 bg-neutral-800/50 opacity-50 cursor-not-allowed" : "border-neutral-600 hover:border-lime-400/60"}`}>
                    {isSelected && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-lime-400" />}
                    <div className={`w-8 h-8 ${topic.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <topic.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-white text-sm font-medium text-center">{topic.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Difficulty */}
        <motion.div className="bg-neutral-900/90 border border-neutral-800 p-6 rounded-2xl mb-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className={`${spaceGrotesk.className} text-2xl font-bold text-lime-500 mb-4`}>Difficulty</h2>
          <div className="flex gap-2 flex-wrap">
            {difficulties.map((d) => (
              <button key={d.id} onClick={() => setDifficulty(d.id)} className={`px-6 py-3 rounded-lg border transition-all ${difficulty === d.id ? "border-lime-500 bg-lime-500/20" : "border-neutral-600 hover:border-lime-400/60"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${d.color} rounded-full`}></div>
                  <span className={difficulty === d.id ? "text-lime-400" : "text-white"}>{d.name}</span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-2">Default MEDIUM. Fixed question count and time.</p>
        </motion.div>

        <div className="flex justify-center">
          <Button onClick={startBattle} disabled={!mode || selectedTopics.length === 0 || loading} className={`inline-flex items-center gap-2 px-16 py-6 rounded-lg font-bold text-lg transition-all ${!mode || selectedTopics.length === 0 ? "bg-gray-600 text-gray-400" : "bg-lime-500 hover:bg-lime-400 text-black"}`}>
            <Swords className="w-6 h-6" />
            {mode === "friend" ? "Create Private Room" : mode === "random" ? "Find Match" : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
}
