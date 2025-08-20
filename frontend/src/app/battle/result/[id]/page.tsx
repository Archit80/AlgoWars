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
import Confetti from 'react-confetti';

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
  const [showConfetti, setShowConfetti] = React.useState(false);
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
        const data = await MatchService.getResult(matchId, userId);
        setResult(data);
        // Show confetti pop if winner
        if (data?.winner?.id === userId) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
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
    return <div className="text-white p-8 text-center">Moment of Truth...</div>;
  }

  if (!result) {
    return <div className="text-white p-8 text-center">Failed to load results</div>;
  }

  const { winner, userScore, opponentScore, xpEarned, questionResults, user1, user2 } = result;
  const opponent = userId === user1.id ? user2 : user1;
  const isWinner = winner?.id === userId;
  const isTie = !winner;

  return (
    <div className="min-h-screen p-6 bg-[#0E0E0E] text-white">
      {showConfetti && <Confetti width={window.innerWidth-20} height={window.innerHeight/2} />}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {isTie ? (
              <span className="text-yellow-500">It&apos;s a Tie!</span>
            ) : isWinner ? (
              <span className="text-lime-500">Victory!</span>
            ) : (
              <span className="text-red-500">Defeat</span>
            )}
          </h1>
          
          {winner && (
            <p className="text-xl mb-4">
              Winner: <span className="text-lime-400 font-bold">{winner?.username}</span>
            </p>
          )}

          {/* Score Summary */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl mb-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-lime-400 mb-2">{userScore}/5</div>
                <div className="text-sm text-gray-400">Your Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">{opponentScore}/5</div>
                <div className="text-sm text-gray-400">{opponent.username}&apos;s Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">+{xpEarned}</div>
                <div className="text-sm text-gray-400">XP Earned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-lime-500 mb-4">Question Review</h2>
          
          {questionResults.map((q, index) => (
            <div key={q.id} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl ">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                <button
                  className="ml-2 p-2 rounded-lg  transition-all group hover:cursor-pointer hover:bg-lime-400/10"
                  onClick={() => handleToggleSave(q.id, q)}
                  disabled={saving[q.id]}
                  aria-label={savedQuestions[q.id] ? 'Unsave' : 'Save'}
                >
                  <Bookmark className={`w-5 h-5 transition-all duration-200 ${savedQuestions[q.id] ? 'text-lime-500 fill-lime-400' : 'text-white group-hover:text-lime-600'}`} />
                </button>
              </div>
              <div className="mb-4 text-gray-300">
                {q.text}
              </div>
              <div className="space-y-3">
                {q.options.map((option, idx) => {
                  const isCorrect = option === q.correctAnswer;
                  const isUserChoice = option === q.userAnswer;
                  const isOpponentChoice = option === q.opponentAnswer;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-2 ${
                        isCorrect
                          ? 'border-lime-500 bg-lime-500/20'
                          : isUserChoice && !isCorrect
                          ? 'border-red-500 bg-red-500/20'
                          : 'border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        <div className="flex gap-2">
                          {isCorrect && (
                            <span className="text-lime-400 text-sm">✓ Correct</span>
                          )}
                          {isUserChoice && (
                            <span className="text-blue-400 text-sm">You</span>
                          )}
                          {isOpponentChoice && (
                            <span className="text-purple-400 text-sm">{opponent.username}</span>
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
            className="px-8 py-3 bg-lime-500 hover:bg-lime-400 text-black font-semibold rounded-xl transition-all"
          >
            Play Again
          </Link>
          <Link 
            href="/dashboard"
            className="px-8 py-3 bg-neutral-600 hover:bg-neutral-500 text-white font-semibold rounded-xl transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}