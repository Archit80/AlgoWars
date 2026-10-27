"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Handshake, Target, Clock, Zap, TrendingUp, Award, Bookmark } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useUser } from '@/contexts/userContext';
import SavedQuestionsService from '@/services/savedQuestionsService';
import QuestionText, { InlineText } from "@/components/quiz/QuestionText";
interface QuestionResult {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
  userCorrect: boolean;
}

type ResultProps = {
  correctAnswers?: number;
  totalQuestions?: number;
  duration?: number;
  xpEarned?: number;
  endedAt?: string;
  mistakes?: Array<{ question: string; concept: string; topic: string }>;
  streak?: number;
  questionResults?: QuestionResult[];
  // fallback props for legacy usage
  score?: number;
  total?: number;
};

const Result: React.FC<ResultProps> = (props) => {
  const { supabaseUser } = useUser();
  const router = useRouter();
  const updateXP = useUserStore((state) => state.updateXP);
  const userId = useUserStore((state) => state.supabaseUser?.id);
  
  // State for saved questions
  const [savedQuestions, setSavedQuestions] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Prefer backend stats, fallback to mock/legacy
  const correctAnswers = props.correctAnswers ?? props.score ?? 0;
  const totalQuestions = props.totalQuestions ?? props.total ?? 0;
  const duration = props.duration ?? 0;
  const xpEarned = props.xpEarned ?? 0;
  // const streak = props.streak ?? 0;
  const mistakes = props.mistakes ?? [];
  const questionResults = useMemo(() => props.questionResults ?? [], [props.questionResults]);
  // Calculate accuracy
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  // Use duration as totalTime (seconds)
  const totalTime = duration;

  const sessionData = {
    questionsAnswered: totalQuestions,
    correctAnswers,
    totalTime,
    xpEarned,
    accuracy,
    mistakes,
    // streak,
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle saving/unsaving questions
  const handleToggleSave = async (questionId: string, q: QuestionResult) => {
    if (!userId) return;
    setSaving(prev => ({ ...prev, [questionId]: true }));
    try {
      const payload = {
        userId,
        questionId,
        savedFrom: 'SOLO_RESULT',
        userAnswer: q.userAnswer,
        wasCorrect: q.userCorrect,
      } as const;
      const res = await SavedQuestionsService.toggleSave(payload);
      setSavedQuestions(prev => ({ ...prev, [questionId]: res.isSaved }));
    } catch (error) {
      console.error('Error saving question:', error);
    } finally {
      setSaving(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Route protection
  useEffect(() => {
    if (!supabaseUser) {
      router.push("/login");
    }
  }, [supabaseUser, router]);

  React.useEffect(() => {
    if (xpEarned > 0) updateXP(xpEarned);
  }, [xpEarned, updateXP]);

  // Check which questions are already saved
  useEffect(() => {
    async function checkSavedQuestions() {
      if (!userId || !questionResults.length) return;
      try {
        const ids = questionResults.map(q => q.id);
        const res = await SavedQuestionsService.checkMultipleSaved(userId, ids);
        setSavedQuestions(res.savedMap || {});
      } catch (error) {
        console.error('Failed to check saved questions:', error);
      }
    }
    checkSavedQuestions();
  }, [userId, questionResults, setSavedQuestions]);

  React.useEffect(() => {
    updateXP(sessionData.xpEarned);
  }, [sessionData.xpEarned, updateXP]);

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-white text-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="section-label mb-1">Session Report</div>
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-7 h-7 text-blue-700" />
            <h1 className="text-3xl font-bold text-slate-900">Session Complete</h1>
          </div>
          <div className="border-b-2 border-blue-700 w-full mb-3" />
          <p className="text-slate-600 text-sm">Practice session completed successfully.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3   gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg text-center">
            <Target className="w-8 h-8 text-blue-700 mx-auto mb-3" />
            <div className="text-2xl font-bold text-slate-900">{sessionData.accuracy}%</div>
            <div className="text-sm text-slate-500">Accuracy</div>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg text-center">
            <Clock className="w-8 h-8 text-blue-700 mx-auto mb-3" />
            <div className="text-2xl font-bold text-slate-900">{formatTime(sessionData.totalTime)}</div>
            <div className="text-sm text-slate-500">Time Spent</div>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg text-center">
            <Zap className="w-8 h-8 text-blue-700 mx-auto mb-3" />
            <div className="text-2xl font-bold text-slate-900">+{sessionData.xpEarned}</div>
            <div className="text-sm text-slate-500">XP Earned</div>
          </div>
          {/* <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-blue-700 mx-auto mb-3" />
            <div className="text-2xl font-bold text-slate-900">{sessionData.streak}</div>
            <div className="text-sm text-slate-500">Streak</div>
          </div> */}
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div
          className="bg-white border border-slate-200 shadow-sm p-8 rounded-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="rule-title text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-700" />
            Performance Breakdown
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{sessionData.correctAnswers}</div>
              <div className="text-sm text-slate-500">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{sessionData.questionsAnswered - sessionData.correctAnswers}</div>
              <div className="text-sm text-slate-500">Incorrect Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">{sessionData.questionsAnswered}</div>
              <div className="text-sm text-slate-500">Total Questions</div>
            </div>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-700 h-3 rounded-full"
              style={{ width: `${sessionData.accuracy}%` }}
            />
          </div>
          <div className="text-center text-sm text-slate-500">
            Accuracy: {sessionData.accuracy}%
          </div>
        </motion.div>

        {/* Mistakes Review */}
        {sessionData.mistakes.length > 0 && (
          <motion.div
            className="bg-white border border-slate-200 shadow-sm p-8 rounded-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="rule-title text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Areas for Improvement
            </h2>
            <div className="space-y-4">
              {sessionData.mistakes.map((mistake, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-600 rounded-md">
                  <div className="font-semibold text-red-600 mb-2">{mistake.question}</div>
                  <div className="text-sm text-slate-600 mb-1">Concept: {mistake.concept}</div>
                  <div className="text-xs text-slate-500">Topic: {mistake.topic}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Question Review */}
        {questionResults.length > 0 && (
          <motion.div
            className="bg-white border border-slate-200 shadow-sm p-8 rounded-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="rule-title text-xl font-bold text-slate-900 mb-6">Question Review</h2>
            <div className="space-y-6">
              {questionResults.map((q, index) => (
                <div key={q.id} className="bg-white border border-slate-200 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      Question {index + 1}
                    </h3>
                    <button
                      className="ml-2 p-2 rounded-lg transition-all group hover:cursor-pointer hover:bg-blue-50"
                      onClick={() => handleToggleSave(q.id, q)}
                      disabled={saving[q.id]}
                      aria-label={savedQuestions[q.id] ? 'Unsave' : 'Save'}
                    >
                      <Bookmark className={`w-5 h-5 transition-all duration-200 ${
                        savedQuestions[q.id] 
                          ? 'text-blue-700 fill-blue-700' 
                          : 'text-slate-500 group-hover:text-blue-700'
                      }`} />
                    </button>
                  </div>
                  <QuestionText text={q.text} className="mb-4 text-slate-600" />
                  <div className="space-y-3 mb-4">
                    {q.options.map((option, idx) => {
                      const isCorrect = option === q.correctAnswer;
                      const isUserChoice = option === q.userAnswer;
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-md border ${
                            isCorrect
                              ? 'border-emerald-600 bg-emerald-50'
                              : isUserChoice && !isCorrect
                              ? 'border-red-600 bg-red-50'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="font-mono min-w-0 break-words"><InlineText text={option} /></span>
                            </div>
                            <div className="flex gap-2">
                              {isCorrect && (
                                <span className="text-emerald-600 text-sm">✓ Correct</span>
                              )}
                              {isUserChoice && (
                                <span className="text-blue-700 text-sm">Your Answer</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/battle"
            className="flex items-center justify-center gap-3 px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-semibold transition-colors"
          >
            <Handshake className="w-6 h-6" />
            Challenge a Friend
          </Link>
          {/* <Link
            href="/practice"
            className="flex items-center justify-center gap-3 px-8 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-md font-semibold transition-colors"
          >
            <Target className="w-6 h-6" />
            Practice Again
          </Link> */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 px-8 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-md font-semibold transition-colors"
          >
            <Home className="w-6 h-6" />
            Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Result;