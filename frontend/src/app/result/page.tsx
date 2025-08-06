import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Swords, Target, Clock, Zap, TrendingUp, Award } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { Space_Grotesk } from 'next/font/google';
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});
type ResultProps = {
  correctAnswers?: number;
  totalQuestions?: number;
  duration?: number;
  xpEarned?: number;
  endedAt?: string;
  mistakes?: Array<{ question: string; concept: string; topic: string }>;
  streak?: number;
  // fallback props for legacy usage
  score?: number;
  total?: number;
};

const Result: React.FC<ResultProps> = (props) => {
  const updateXP = useUserStore((state) => state.updateXP);

  // Prefer backend stats, fallback to mock/legacy
  const correctAnswers = props.correctAnswers ?? props.score ?? 0;
  const totalQuestions = props.totalQuestions ?? props.total ?? 0;
  const duration = props.duration ?? 0;
  const xpEarned = props.xpEarned ?? 0;
  // const streak = props.streak ?? 0;
  const mistakes = props.mistakes ?? [];
  // Calculate accuracy
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  // Use duration as totalTime (seconds)
  const totalTime = duration;

  React.useEffect(() => {
    if (xpEarned > 0) updateXP(xpEarned);
  }, [xpEarned, updateXP]);

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

  React.useEffect(() => {
    updateXP(sessionData.xpEarned);
  }, []);

  return (
    <div className="min-h-screen p-6 dark bg-[#0E0E0E] text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-lime-400" />
            <h1 className={`text-4xl font-bold text-white ${spaceGrotesk.className}`}>Session Complete!</h1>
          </div>
          <p className="text-gray-400 code-font">{'> Practice session terminated successfully'}</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-neutral-900/90 p-6 rounded-xl text-center">
            <Target className="w-8 h-8 text-lime-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-lime-400">{sessionData.accuracy}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="bg-neutral-900/90 p-6 rounded-xl text-center">
            <Clock className="w-8 h-8 text-lime-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-lime-400">{formatTime(sessionData.totalTime)}</div>
            <div className="text-sm text-gray-400">Time Spent</div>
          </div>
          <div className="bg-neutral-900/90 p-6 rounded-xl text-center">
            <Zap className="w-8 h-8 text-lime-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-lime-400">+{sessionData.xpEarned}</div>
            <div className="text-sm text-gray-400">XP Earned</div>
          </div>
          {/* <div className="bg-neutral-900/90 p-6 rounded-xl text-center">
            <TrendingUp className="w-8 h-8 text-lime-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-lime-400">{sessionData.streak}</div>
            <div className="text-sm text-gray-400">Streak</div>
          </div> */}
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div
          className="glass-panel p-8 rounded-2xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-lime-400" />
            Performance Breakdown
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-lime-400 mb-2">{sessionData.correctAnswers}</div>
              <div className="text-sm text-gray-400">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">{sessionData.questionsAnswered - sessionData.correctAnswers}</div>
              <div className="text-sm text-gray-400">Incorrect Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">{sessionData.questionsAnswered}</div>
              <div className="text-sm text-gray-400">Total Questions</div>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div 
              className="bg-lime-500 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${sessionData.accuracy}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-400">
            Accuracy: {sessionData.accuracy}%
          </div>
        </motion.div>

        {/* Mistakes Review */}
        {sessionData.mistakes.length > 0 && (
          <motion.div
            className="glass-panel p-8 rounded-2xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-red-400" />
              Areas for Improvement
            </h2>
            <div className="space-y-4">
              {sessionData.mistakes.map((mistake, index) => (
                <div key={index} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="font-semibold text-red-400 mb-2">{mistake.question}</div>
                  <div className="text-sm text-gray-300 mb-1">Concept: {mistake.concept}</div>
                  <div className="text-xs text-gray-400">Topic: {mistake.topic}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/match"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-lime-500 hover:bg-lime-400 text-black rounded-xl font-bold transition-all lime-glow-strong"
          >
            <Swords className="w-6 h-6" />
            Challenge a Friend
          </Link>
          {/* <Link
            href="/practice"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-600 hover:bg-gray-500 rounded-xl font-bold transition-all"
          >
            <Target className="w-6 h-6" />
            Practice Again
          </Link> */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-600 hover:bg-gray-500 rounded-xl font-bold transition-all"
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