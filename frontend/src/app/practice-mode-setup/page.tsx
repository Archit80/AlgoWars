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
  Grid3X3,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionsService from "@/services/questionsService";
import usePracticeStore from "@/stores/practiceStore";
import { PracticeStore } from "@/stores/practiceStore";
import { useUserStore } from "@/stores/userStore";

const dataStructureTopics = [
  { id: "Arrays", name: "Arrays", icon: Hash, bgColor: "bg-blue-700" },
  { id: "Strings", name: "Strings", icon: Quote, bgColor: "bg-blue-700" },
  { id: "Trees", name: "Trees", icon: TreePine, bgColor: "bg-blue-700" },
  { id: "Graphs", name: "Graphs", icon: Share2, bgColor: "bg-blue-700" },
  { id: "StacksQueues", name: "Stacks & Queues", icon: Layers, bgColor: "bg-blue-700" },
  { id: "HashMaps", name: "Hash Maps", icon: KeyRound, bgColor: "bg-blue-700" }
];

const algorithmTopics = [
  { id: "SlidingWindow", name: "Sliding Window", icon: ChevronsRightLeft, bgColor: "bg-blue-700" },
  { id: "DynamicProgramming", name: "Dynamic Programming", icon: Grid3X3, bgColor: "bg-blue-700" },
  { id: "TwoPointers", name: "Two Pointers", icon: ArrowLeftRight, bgColor: "bg-blue-700" },
  { id: "BinarySearch", name: "Binary Search", icon: Crosshair, bgColor: "bg-blue-700" },
  { id: "Sorting", name: "Sorting", icon: ListOrdered, bgColor: "bg-blue-700" },
  { id: "Recursion", name: "Recursion", icon: RefreshCw, bgColor: "bg-blue-700" }
];

const difficulties = [
  { id: "easy", name: "Easy", color: "bg-emerald-600", textColor: "text-emerald-600" },
  { id: "medium", name: "Medium", color: "bg-amber-600", textColor: "text-amber-600" },
  { id: "hard", name: "Hard", color: "bg-red-600", textColor: "text-red-600" }
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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900">
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
            className="p-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className={`text-3xl font-semibold text-slate-900`}>
              Choose Your Challenge
            </h1>
            <p className="text-slate-600">
              {"Select up to 5 topics to practice"}
            </p>
          <div className="mt-2 text-xs text-slate-500">
            <span className="font-semibold text-blue-700">XP Calculation:</span> XP is based on your correct answers, difficulty, and mode.<br />
            <span className="text-emerald-600">Easy</span>: ×1.0 &nbsp; <span className="text-amber-600">Medium</span>: ×1.5 &nbsp; <span className="text-red-600">Hard</span>: ×2.0<br />
            <span className="text-amber-600">Sprint Mode</span>: +50% XP bonus
          </div>
          </div>
        </motion.div>

        {/* Topic Selection */}
        <motion.div
          className="bg-white border border-slate-200 shadow-sm p-8 rounded-md mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold text-slate-900`}>
              Choose Topics  
            </h2>
            {selectedTopics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map(topicId => {
                  const topic = [...dataStructureTopics, ...algorithmTopics].find(t => t.id === topicId);
                  return (
                    <div key={topicId} className="flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-md px-3 py-1">
                      <span className="text-blue-800 text-sm">{topic?.name}</span>
                      <button onClick={() => toggleTopic(topicId)} className="text-blue-700 hover:text-blue-900">
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
            <h3 className="text-blue-700 font-semibold mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5" />
             <span className="text-slate-900">
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
                    className={`relative p-4 rounded-md border transition-colors ${
                      isSelected
                        ? "border-blue-700 bg-blue-50"
                        : isDisabled
                        ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                        : "border-slate-200 bg-white hover:border-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-700" />
                    )}
                    <div className={`w-8 h-8 ${topic.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <topic.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-slate-900 text-sm font-medium text-center">
                      {topic.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Algorithms Row */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-700" />
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
                    className={`relative p-4 rounded-md border transition-colors ${
                      isSelected
                        ? "border-blue-700 bg-blue-50"
                        : isDisabled
                        ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                        : "border-slate-200 bg-white hover:border-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-700" />
                    )}
                    <div className={`w-8 h-8 ${topic.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <topic.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-slate-900 text-sm font-medium text-center">
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
            className="bg-white border border-slate-200 shadow-sm p-8 rounded-md mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className={`text-xl font-semibold text-slate-900 rule-title mb-6`}>
              Practice Configuration
            </h2>
            
            <div className="flex flex-wrap gap-8 justify-center">
              {/* Difficulty */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-slate-900 font-semibold mb-4 text-center">Difficulty</h3>
                <div className="flex gap-2 justify-center">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.id}
                      onClick={() => setSelectedDifficulty(difficulty.id)}
                      className={`px-6 py-3 rounded-md border transition-colors ${
                        selectedDifficulty === difficulty.id
                          ? "border-blue-700 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${difficulty.color} rounded-full`}></div>
                        <span className={selectedDifficulty === difficulty.id ? "text-blue-800" : "text-slate-700"}>
                          {difficulty.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-slate-900 font-semibold mb-4 text-center">Questions</h3>
                <div className="flex gap-2 justify-center">
                  {questionCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setSelectedQuestionCount(count)}
                      className={`px-4 py-3 rounded-md border transition-colors ${
                        selectedQuestionCount === count
                          ? "border-blue-700 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-700"
                      }`}
                    >
                      <span className={selectedQuestionCount === count ? "text-blue-800" : "text-slate-700"}>
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div className="flex-1 min-w-[200px] md:-mt-8">
                <h3 className="text-slate-900 font-semibold mb-4 text-center">Mode</h3>
                <div className="flex gap-2 justify-center">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`px-6 py-3 w-1/2 rounded-md border transition-colors ${
                        selectedMode === mode.id
                          ? "border-blue-700 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-700"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <mode.icon className={`w-4 h-4 ${selectedMode === mode.id ? "text-blue-700" : "text-slate-500"}`} />
                          <span className={selectedMode === mode.id ? "text-blue-800" : "text-slate-700"}>
                            {mode.name}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">{mode.description}</div>
                        <div className={`text-xs ${mode.id === "timed" ? "text-amber-600" : "text-blue-700"}`}>
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
            disabled={selectedTopics.length === 0 || !selectedMode || !selectedDifficulty || loading}
            className={`inline-flex items-center gap-2 px-16 py-6 rounded-lg font-bold text-lg transition-all ${
              selectedTopics.length > 0 && selectedMode && selectedDifficulty && !loading
                ? "bg-blue-700 hover:bg-blue-800 text-white"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Loading Questions...</>
            ) : (
              <><Play className="w-6 h-6" /> Start Practice Session</>
            )}
          </Button>
          {selectedTopics.length > 0 && selectedMode && selectedDifficulty && (
            <p className="text-sm text-slate-500 mt-3">
              {`${selectedQuestionCount} questions • ${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''} • ${selectedDifficulty} difficulty • ${selectedMode} mode`}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PracticeModeSetup;
