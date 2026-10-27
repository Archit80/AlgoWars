"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { useUser } from '@/contexts/userContext';
import { useEffect } from 'react';
import MatchService from '@/services/matchService';
import SavedQuestionsService from '@/services/savedQuestionsService';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';
import QuestionText, { InlineText } from "@/components/quiz/QuestionText";

interface QuestionResult {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
  userCorrect: boolean;
  opponentAnswer: string | null;
  opponentCorrect: boolean;
}

interface MatchResult {
  match: {
    id: string;
    categories: string[];
    difficulty: string;
    totalQuestions: number;
  };
  winner: { id: string; username: string } | null;
  userScore: number;
  opponentScore: number;
  xpEarned: number;
  questionResults: QuestionResult[];
  user1: { id: string; username: string };
  user2: { id: string; username: string };
}

export default function BattleResultPage() {
  const { supabaseUser } = useUser();
  const router = useRouter();
  const params = useParams();
  const matchId = params?.id as string;
  const userId = useUserStore((state) => state.supabaseUser?.id);
  
  const [result, setResult] = React.useState<MatchResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [savedQuestions, setSavedQuestions] = React.useState<Record<string, boolean>>({});
  const [saving, setSaving] = React.useState<Record<string, boolean>>({});

  // Route protection
  useEffect(() => {
    if (!supabaseUser) {
      router.push("/login");
    }
  }, [supabaseUser, router]);

  React.useEffect(() => {
    async function fetchResult() {
      if (!matchId || !userId) return;
      try {
        const data = await MatchService.getResult(matchId);
        setResult(data);
        // Check which questions are already saved
        if (data?.questionResults?.length) {
          const ids = data.questionResults.map(q => q.id);
          const res = await SavedQuestionsService.checkMultipleSaved(userId, ids);
          setSavedQuestions(res.savedMap || {});
        }
      } catch (error) {
        console.error('Failed to fetch result:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [matchId, userId]);
  const handleToggleSave = async (questionId: string, q: QuestionResult) => {
    if (!userId) return;
    setSaving(prev => ({ ...prev, [questionId]: true }));
    try {
      const payload = {
        userId,
        questionId,
        savedFrom: 'BATTLE_RESULT',
        userAnswer: q.userAnswer,
        wasCorrect: q.userCorrect,
      } as const;
      const res = await SavedQuestionsService.toggleSave(payload);
      setSavedQuestions(prev => ({ ...prev, [questionId]: res.isSaved }));
    } finally {
      setSaving(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  if (loading) {
    return <div className="text-slate-600 p-8 text-center">Loading results...</div>;
  }

  if (!result) {
    return <div className="text-slate-600 p-8 text-center">Failed to load results</div>;
  }

  const { winner, userScore, opponentScore, xpEarned, questionResults, user1, user2 } = result;
  const opponent = userId === user1.id ? user2 : user1;
  const isWinner = winner?.id === userId;
  const isTie = !winner;

  return (
    <div className="min-h-screen p-6 bg-white text-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="section-label mb-1">Match Report</div>
          <h1 className="rule-title text-3xl font-bold mb-4">
            {isTie ? (
              <span className="text-amber-600">It&apos;s a Tie</span>
            ) : isWinner ? (
              <span className="text-emerald-600">Challenge Won</span>
            ) : (
              <span className="text-red-600">Challenge Lost</span>
            )}
          </h1>

          {winner && (
            <p className="text-base text-slate-600 mb-4">
              Winner: <span className="text-slate-900 font-semibold">{winner?.username}</span>
            </p>
          )}

          {/* Score Summary */}
          <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg mb-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-700 mb-2">{userScore}/5</div>
                <div className="text-sm text-slate-500">Your Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{opponentScore}/5</div>
                <div className="text-sm text-slate-500">{opponent.username}&apos;s Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">+{xpEarned}</div>
                <div className="text-sm text-slate-500">XP Earned</div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-4 text-center">Table 1. Match score summary</div>
          </div>
        </div>

        {/* Question Results */}
        <div className="space-y-6">
          <div>
            <div className="section-label mb-1">Review</div>
            <h2 className="rule-title text-xl font-bold text-slate-900 mb-4">Question Review</h2>
          </div>
          
          {questionResults.map((q, index) => (
            <div key={q.id} className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                <button
                  className="ml-2 p-2 rounded-lg  transition-all group hover:cursor-pointer hover:bg-blue-50"
                  onClick={() => handleToggleSave(q.id, q)}
                  disabled={saving[q.id]}
                  aria-label={savedQuestions[q.id] ? 'Unsave' : 'Save'}
                >
                  <Bookmark className={`w-5 h-5 transition-all duration-200 ${savedQuestions[q.id] ? 'text-blue-700 fill-blue-700' : 'text-slate-500 group-hover:text-blue-700'}`} />
                </button>
              </div>
              <QuestionText text={q.text} className="mb-4 text-slate-600" />
              <div className="space-y-3">
                {q.options.map((option, idx) => {
                  const isCorrect = option === q.correctAnswer;
                  const isUserChoice = option === q.userAnswer;
                  const isOpponentChoice = option === q.opponentAnswer;
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
                            <span className="text-blue-700 text-sm">You</span>
                          )}
                          {isOpponentChoice && (
                            <span className="text-slate-600 text-sm">{opponent.username}</span>
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

        {/* Actions */}
        <div className="flex gap-4 justify-center mt-8">
          <Link 
            href="/battle"
            className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md transition-colors"
          >
            Play Again
          </Link>
          <Link 
            href="/dashboard"
            className="px-8 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold rounded-md transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}