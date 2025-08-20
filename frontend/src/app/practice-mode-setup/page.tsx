"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Clock,
  Target,
  Hash,
  Layers,
  Zap,
  X,
  CheckCircle,
  Quote,
  Share2,
  KeyRound,
  ChevronsRightLeft,
  ArrowLeftRight,
  Crosshair,
  ListOrdered,
  RefreshCw,
  TreePine,
  Grid3X3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionsService from "@/services/questionsService";
import usePracticeStore from "@/stores/practiceStore";
import { PracticeStore } from "@/stores/practiceStore";
import { useUserStore } from "@/stores/userStore";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const dataStructureTopics = [
  { id: "Arrays", name: "Arrays", icon: Hash, bgColor: "bg-blue-500" },
  { id: "Strings", name: "Strings", icon: Quote, bgColor: "bg-orange-500" },
  { id: "Trees", name: "Trees", icon: TreePine, bgColor: "bg-lime-500" },
  { id: "Graphs", name: "Graphs", icon: Share2, bgColor: "bg-fuchsia-400" },
  { id: "StacksQueues", name: "Stacks & Queues", icon: Layers, bgColor: "bg-rose-500" },
  { id: "HashMaps", name: "Hash Maps", icon: KeyRound, bgColor: "bg-cyan-500" }
];

const algorithmTopics = [
  { id: "SlidingWindow", name: "Sliding Window", icon: ChevronsRightLeft, bgColor: "bg-red-500" },
  { id: "DynamicProgramming", name: "Dynamic Programming", icon: Grid3X3, bgColor: "bg-green-500" },
  { id: "TwoPointers", name: "Two Pointers", icon: ArrowLeftRight, bgColor: "bg-indigo-500" },
  { id: "BinarySearch", name: "Binary Search", icon: Crosshair, bgColor: "bg-yellow-500" },
  { id: "Sorting", name: "Sorting", icon: ListOrdered, bgColor: "bg-emerald-500" },
  { id: "Recursion", name: "Recursion", icon: RefreshCw, bgColor: "bg-pink-400" }
];

const difficulties = [
  { id: "easy", name: "Easy", color: "bg-green-500", textColor: "text-green-400" },
  { id: "medium", name: "Medium", color: "bg-yellow-500", textColor: "text-yellow-400" },
  { id: "hard", name: "Hard", color: "bg-red-500", textColor: "text-red-400" }
];

const questionCounts = [5, 10, 15, 20];

const modes = [
  {
    id: "timed",
    name: "Sprint",
    icon: Clock,
    description: "60s per question",
    bonus: "+20% XP gains",
    time: "60s per question",
  },
  {
    id: "accuracy", 
    name: "Zen Mode",
    icon: Target,
    description: "No time limit",
    bonus: "Focus & accuracy",
    time: "No time limit",
  },
];

const PracticeModeSetup: React.FC = () => {
  const router = useRouter();
  const setQuestions = usePracticeStore((state: PracticeStore) => state.setQuestions);
  const setMode = usePracticeStore((s: PracticeStore) => s.setMode);
  const setCategory = usePracticeStore((s: PracticeStore) => s.setCategory);

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);
  const [selectedMode, setSelectedMode] = useState<string>("");
  const supabaseUser = useUserStore((state) => state.supabaseUser);

  // Route protection
  useEffect(() => {
    if (!supabaseUser) {
      router.push("/login");
    }
  }, [supabaseUser, router]);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else if (prev.length < 5) {
        return [...prev, topicId];
      }
      return prev;
    });
  };

  const startPractice = async () => {
    if (selectedTopics.length === 0 || !selectedMode || !selectedDifficulty) return;

    try {
      console.log("[Practice Setup] Starting practice with:", {
        topics: selectedTopics,
        difficulty: selectedDifficulty,
        questionCount: selectedQuestionCount,
        mode: selectedMode
      });

      // Use all selected topics as categories
      const response = await QuestionsService.getQuestionsByCategory(
        selectedTopics,
        selectedMode,
        supabaseUser?.id || "",
        selectedDifficulty,
        selectedQuestionCount
      );
      
      console.log("[Practice Setup] Fetched questions:", response);
      setQuestions(response.questions, response.soloSessionId);
      setMode(selectedMode);
      setCategory(selectedTopics.join(", "));

      if (!response.success)
        throw new Error(response.error || "Failed to load questions");

      router.push(`/solo-practice`);
    } catch (err: unknown) {
      console.error("[Practice Setup] Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      alert("Something went wrong: " + errorMessage);
    }
  };

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-[#0E0E0E]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/dashboard"
            className="p-3 bg-lime-600 rounded-xl hover:bg-lime-500 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className={`${spaceGrotesk.className} text-4xl font-bold text-lime-500`}>
              Choose Your Challenge
            </h1>
            <p className="text-neutral-200 font-mono">
              {"> Select up to 5 topics to practice"}
            </p>
          <div className="mt-2 text-xs text-gray-400 font-mono">
            <span className="font-semibold text-lime-400">XP Calculation:</span> XP is based on your correct answers, difficulty, and mode.<br />
            <span className="text-green-400">Easy</span>: ×1.0 &nbsp; <span className="text-yellow-400">Medium</span>: ×1.5 &nbsp; <span className="text-red-400">Hard</span>: ×2.0<br />
            <span className="text-amber-400">Sprint Mode</span>: +50% XP bonus
          </div>
          </div>
        </motion.div>

        {/* Topic Selection */}
        <motion.div
          className="bg-neutral-900/90 border border-neutral-800 p-8 rounded-2xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`${spaceGrotesk.className} text-2xl font-bold text-lime-500`}>
              Choose Topics  
            </h2>
            {selectedTopics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map(topicId => {
                  const topic = [...dataStructureTopics, ...algorithmTopics].find(t => t.id === topicId);
                  return (
                    <div key={topicId} className="flex items-center gap-1 bg-lime-500/20 border border-lime-500/50 rounded-lg px-3 py-1">
                      <span className="text-lime-400 text-sm">{topic?.name}</span>
                      <button onClick={() => toggleTopic(topicId)} className="text-lime-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Data Structures Row */}
          <div className="mb-6">
            <h3 className="text-lime-500 font-semibold mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5" />
             <span className="text-white">
               Data Structures
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {dataStructureTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                const isDisabled = !isSelected && selectedTopics.length >= 5;
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    disabled={isDisabled}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-lime-500 bg-lime-500/20 scale-95"
                        : isDisabled
                        ? "border-neutral-700 bg-neutral-800/50 opacity-50 cursor-not-allowed"
                        : "border-neutral-600 hover:border-lime-400/60 hover:bg-lime-500/10"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-lime-400" />
                    )}
                    <div className={`w-8 h-8 ${topic.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <topic.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-white text-sm font-medium text-center">
                      {topic.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Algorithms Row */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-lime-500" />
              Algorithms
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {algorithmTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                const isDisabled = !isSelected && selectedTopics.length >= 5;
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    disabled={isDisabled}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-lime-500 bg-lime-500/20 scale-95"
                        : isDisabled
                        ? "border-neutral-700 bg-neutral-800/50 opacity-50 cursor-not-allowed"
                        : "border-neutral-600 hover:border-lime-400/60 hover:bg-lime-500/10"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-lime-400" />
                    )}
                    <div className={`w-8 h-8 ${topic.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <topic.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-white text-sm font-medium text-center">
                      {topic.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Practice Configuration - Horizontal Layout */}
        {selectedTopics.length > 0 && (
          <motion.div
            className="bg-neutral-900/90 border border-neutral-800 p-8 rounded-2xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className={`${spaceGrotesk.className} text-2xl font-bold text-lime-500 mb-6`}>
              ⚙️ Practice Configuration
            </h2>
            
            <div className="flex flex-wrap gap-8 justify-center">
              {/* Difficulty */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-white font-semibold mb-4 text-center">Difficulty</h3>
                <div className="flex gap-2 justify-center">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.id}
                      onClick={() => setSelectedDifficulty(difficulty.id)}
                      className={`px-6 py-3 rounded-lg border transition-all ${
                        selectedDifficulty === difficulty.id
                          ? "border-lime-500 bg-lime-500/20"
                          : "border-neutral-600 hover:border-lime-400/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${difficulty.color} rounded-full`}></div>
                        <span className={selectedDifficulty === difficulty.id ? "text-lime-400" : "text-white"}>
                          {difficulty.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-white font-semibold mb-4 text-center">Questions</h3>
                <div className="flex gap-2 justify-center">
                  {questionCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setSelectedQuestionCount(count)}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        selectedQuestionCount === count
                          ? "border-lime-500 bg-lime-500/20"
                          : "border-neutral-600 hover:border-lime-400/60"
                      }`}
                    >
                      <span className={selectedQuestionCount === count ? "text-lime-400" : "text-white"}>
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div className="flex-1 min-w-[200px] md:-mt-8">
                <h3 className="text-white font-semibold mb-4 text-center">Mode</h3>
                <div className="flex gap-2 justify-center">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`px-6 py-3 w-1/2 rounded-lg border transition-all ${
                        selectedMode === mode.id
                          ? "border-lime-500 bg-lime-500/20"
                          : "border-neutral-600 hover:border-lime-400/60"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <mode.icon className={`w-4 h-4 ${selectedMode === mode.id ? "text-lime-400" : "text-gray-400"}`} />
                          <span className={selectedMode === mode.id ? "text-lime-400" : "text-white"}>
                            {mode.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">{mode.description}</div>
                        <div className={`text-xs ${mode.id === "timed" ? "text-amber-400" : "text-cyan-400"}`}>
                          {mode.bonus}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Start Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            onClick={startPractice}
            disabled={selectedTopics.length === 0 || !selectedMode || !selectedDifficulty}
            className={`inline-flex items-center gap-2 px-16 py-6 rounded-lg font-bold text-lg transition-all ${
              selectedTopics.length > 0 && selectedMode && selectedDifficulty
                ? "bg-lime-500 hover:bg-lime-400 text-black hover:scale-105"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Play className="w-6 h-6" />
            Start Practice Session
          </Button>
          {selectedTopics.length > 0 && selectedMode && selectedDifficulty && (
            <p className="text-sm text-gray-400 mt-3 font-mono">
              {`> ${selectedQuestionCount} questions • ${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''} • ${selectedDifficulty} difficulty • ${selectedMode} mode`}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PracticeModeSetup;
