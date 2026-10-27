"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { Handshake, UserPlus, ArrowLeft, CheckCircle, Layers, Zap, Hash, Share2, KeyRound, ChevronsRightLeft, ArrowLeftRight, Crosshair, ListOrdered, RefreshCw, TreePine, Grid3X3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMatchStore } from "@/stores/matchStore";
import MatchService from "@/services/matchService";


const dataStructureTopics = [
  { id: "Arrays", name: "Arrays", icon: Hash, bgColor: "bg-blue-50" },
  { id: "Strings", name: "Strings", icon: Share2, bgColor: "bg-blue-50" },
  { id: "Trees", name: "Trees", icon: TreePine, bgColor: "bg-blue-50" },
  { id: "Graphs", name: "Graphs", icon: KeyRound, bgColor: "bg-blue-50" },
  { id: "StacksQueues", name: "Stacks & Queues", icon: Layers, bgColor: "bg-blue-50" },
  { id: "HashMaps", name: "Hash Maps", icon: ChevronsRightLeft, bgColor: "bg-blue-50" },
];
const algorithmTopics = [
  { id: "SlidingWindow", name: "Sliding Window", icon: ChevronsRightLeft, bgColor: "bg-blue-50" },
  { id: "TwoPointers", name: "Two Pointers", icon: ArrowLeftRight, bgColor: "bg-blue-50" },
  { id: "BinarySearch", name: "Binary Search", icon: Crosshair, bgColor: "bg-blue-50" },
  { id: "Sorting", name: "Sorting", icon: ListOrdered, bgColor: "bg-blue-50" },
  { id: "Recursion", name: "Recursion", icon: RefreshCw, bgColor: "bg-blue-50" },
  { id: "DynamicProgramming", name: "Dynamic Programming", icon: Grid3X3, bgColor: "bg-blue-50" },
];

const difficulties = [
  { id: "EASY", name: "Easy", color: "bg-emerald-600" },
  { id: "MEDIUM", name: "Medium", color: "bg-amber-600" },
  { id: "HARD", name: "Hard", color: "bg-red-600" },
];

export default function BattleSetup() {
  const { supabaseUser } = useUser();
  const router = useRouter();
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
      if (mode === "friend") {
        const res = await MatchService.createFriendMatch({ topics: selectedTopics, difficulty });
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
          topics: selectedTopics,
          difficulty,
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
      alert("Failed to start challenge");
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  const renderTopic = (topic: { id: string; name: string; icon: React.ElementType; bgColor: string }) => {
    const isSelected = selectedTopics.includes(topic.id);
    const isDisabled = !isSelected && selectedTopics.length >= 5;
    return (
      <button key={topic.id} onClick={() => toggleTopic(topic.id)} disabled={isDisabled} className={`relative p-4 rounded-md border transition-colors ${isSelected ? "border-blue-700 bg-blue-50" : isDisabled ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50"}`}>
        {isSelected && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-700" />}
        <div className={`w-8 h-8 ${topic.bgColor} border border-blue-100 rounded-md flex items-center justify-center mx-auto mb-2`}>
          <topic.icon className="w-4 h-4 text-blue-700" />
        </div>
        <div className="text-slate-900 text-sm font-medium text-center">{topic.name}</div>
      </button>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto ">
        <motion.div className="flex items-center gap-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/dashboard" className="p-3 bg-white border border-slate-200 text-slate-600 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="section-label mb-1">Head-to-Head Assessment</div>
            <h1 className="text-3xl font-bold text-slate-900">Peer Challenge</h1>
            <p className="text-slate-600 text-sm">Select a match type, topics (up to 3) and a difficulty level.</p>
          </div>
        </motion.div>

        {/* Mode selection */}
        <motion.div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="section-label mb-1">Step 1</div>
          <h2 className="rule-title text-xl font-bold text-slate-900 mb-4">Choose Match Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Friend Card */}
            <button
              onClick={() => setMode("friend")}
              aria-pressed={mode === "friend"}
              className={`relative overflow-hidden p-6 rounded-md text-left transition-colors border hover:cursor-pointer
                ${mode === "friend"
                  ? "border-blue-700 bg-blue-50"
                  : "border-slate-300 hover:border-blue-400 hover:bg-blue-50 bg-white"}
              `}
            >
              <div className="flex items-center gap-6 mb-2">
                <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    Play with Friend
                  </div>
                  <p className="text-sm text-slate-600">Create a private room and invite your friend</p>
                </div>
              </div>
            </button>

            {/* Random Card */}
            <button
              onClick={() => setMode("random")}
              aria-pressed={mode === "random"}
              className={`relative overflow-hidden p-6 rounded-md text-left transition-colors border hover:cursor-pointer 
                ${mode === "random"
                  ? "border-blue-700 bg-blue-50"
                  : "border-slate-300 hover:border-blue-400 hover:bg-blue-50 bg-white"}
              `}
            >
              <div className="flex items-center gap-6 mb-2">
                <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    Random Match
                  </div>
                  <p className="text-sm text-slate-600">Get matched with a random player</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Topic selection */}
        <motion.div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="section-label mb-1">Step 2</div>
          <h2 className="rule-title text-xl font-bold text-slate-900 mb-2">Choose Topics</h2>
          <p className="text-xs text-slate-500 mb-4">Select up to 3</p>
          <div className="mb-4">
            <h3 className="text-slate-900 font-semibold mb-2 flex items-center gap-2"><Layers className="w-4 h-4 text-blue-700" /> Data Structures</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {dataStructureTopics.map(renderTopic)}
            </div>
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-blue-700" /> Algorithms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {algorithmTopics.map(renderTopic)}
            </div>
          </div>
        </motion.div>

        {/* Difficulty */}
        <motion.div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="section-label mb-1">Step 3</div>
          <h2 className="rule-title text-xl font-bold text-slate-900 mb-4">Difficulty</h2>
          <div className="flex gap-2 flex-wrap">
            {difficulties.map((d) => (
              <button key={d.id} onClick={() => setDifficulty(d.id)} className={`px-6 py-3 rounded-md border transition-colors ${difficulty === d.id ? "border-blue-700 bg-blue-50" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${d.color} rounded-full`}></div>
                  <span className={difficulty === d.id ? "text-blue-700 font-medium" : "text-slate-900"}>{d.name}</span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Default MEDIUM. Fixed question count and time.</p>
        </motion.div>

        <div className="flex justify-center">
          <Button onClick={startBattle} disabled={!mode || selectedTopics.length === 0 || loading} className={`inline-flex items-center gap-2 px-16 py-6 rounded-md font-semibold hover:cursor-pointer text-lg transition-colors ${!mode || selectedTopics.length === 0 || loading ? "bg-slate-200 text-slate-500" : "bg-blue-700 hover:bg-blue-800 text-white"}`}>
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Setting up...</>
            ) : (
              <><Handshake className="w-6 h-6" />
              {mode === "friend" ? "Create Private Room" : mode === "random" ? "Find Match" : "Start"}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
