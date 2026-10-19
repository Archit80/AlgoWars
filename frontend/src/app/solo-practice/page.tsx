"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import Result from "../result/page";
import QuestionsService from "@/services/questionsService";
import { motion } from "framer-motion";
import { usePracticeStore } from "@/stores/practiceStore";
import { ArrowLeft, Clock, Loader2, CheckCircle2 } from "lucide-react";
import AnswerOptions from "@/components/quiz/AnswerOptions";
import QuestionText from "@/components/quiz/QuestionText";
// import Link from "next/link"; // Use next/link for Next.js navigation

const SoloPractice = () => {
  const { supabaseUser } = useUser();
  const router = useRouter();
  const { questions, currentIndex, submitAnswer, nextQuestion, soloSessionId, mode } = usePracticeStore();
  
  // If questions are not loaded, redirect to setup page
  useEffect(() => {
    if (!questions || questions.length === 0) {
      console.warn("No questions found in store, redirecting to setup.");
      router.push('/practice-mode-setup');
    }
  }, [questions, router]);

  const currentQuestion = questions?.[currentIndex];
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);

  // Route protection
  useEffect(() => {
    if (!supabaseUser) {
      router.push("/login");
    }
  }, [supabaseUser, router]);

  // If all questions are done, show result
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Brief "answer saved" state between submitting and showing the next question
  const [lockedIn, setLockedIn] = useState(false);
  const lockTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
  }, []);
  const [sessionStats, setSessionStats] = useState<React.ComponentProps<typeof Result> | null>(null);


  useEffect(() => {
    if (questions.length === 0) {
      // This is now handled by the redirect, but we can keep a log
      console.warn("No questions available for solo practice.");
    }
  }, [questions]);

  const handleNext = useCallback(async () => {
    if (currentIndex === questions.length - 1) {
      setSubmitting(true);
      try {
        // Read from the store directly: the answer just submitted isn't in this render's closure
        const answers = usePracticeStore.getState().userAnswers.map((ua) => ({
          questionId: ua.questionId,
          answer: ua.selectedOption,
        }));
        const res = await QuestionsService.endSoloSession({ soloSessionId: soloSessionId!, answers });
        // Server response includes score, XP and per-question results for the result page
        setSessionStats(res);
      } catch (err) {
        console.error("Failed to end solo session:", err);
      } finally {
        setSubmitting(false);
      }
      setIsQuizComplete(true);
    } else {
      setSelectedAnswer(null);
      if (mode === "timed") {
        setTimeLeft(60);
      }
      nextQuestion();
    }
  }, [currentIndex, questions, soloSessionId, nextQuestion, mode]);

  useEffect(() => {
    // Paused while an answer is locking in, so the timeout can't also advance the question
    if (mode === "timed" && timeLeft > 0 && !lockedIn) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-submit when time runs out
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, handleNext, mode, lockedIn]);

  useEffect(() => {
    if (mode === "timed") {
      setTimeLeft(60);
    }
    setSelectedAnswer(null);
  }, [currentIndex, mode]);


  if (!questions || questions.length === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center gap-2 text-lime-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xl">Loading Practice Session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isQuizComplete || currentIndex >= questions.length) {
    // If sessionStats is available, pass them to Result, else fallback to score/total
    return <Result {...(sessionStats ? sessionStats : { score: 0, total: questions.length })} />;
  }

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = () => {
    if (!selectedAnswer || lockedIn) return;
    submitAnswer(currentQuestion.id, selectedAnswer);
    // Show the locked-in state for a beat, then move on (grading happens when the session ends)
    setLockedIn(true);
    lockTimerRef.current = setTimeout(() => {
      setLockedIn(false);
      handleNext();
    }, 600);
  };

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen p-6 bg-[#0E0E0E]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            {/* <Link href="/practice" className="p-3 rounded-xl border border-gray-700 bg-gray-900 hover:bg-lime-500/10 transition-all"> */}
            <button
              className="p-3 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-lime-500/10 transition-all"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-6 h-6 text-lime-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-lime-500">
                Question {currentIndex + 1} of {questions.length}
              </h1>
              <p className="text-neutral-400 font-mono">{`> ${currentQuestion.categories || "Practice"}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {mode === "timed" && (
              <>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-lime-400" />
                  <span className={`text-xl font-bold ${timeLeft < 10 ? "text-red-400" : "text-lime-400"}`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="w-20 h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      timeLeft < 10 ? "bg-red-500" : "bg-lime-500"
                    }`}
                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          
          {currentQuestion.text && <QuestionText text={currentQuestion.text} className="mb-6" />}

          <AnswerOptions
            options={currentQuestion.options}
            selected={selectedAnswer}
            onSelect={setSelectedAnswer}
            locked={lockedIn}
            disabled={submitting}
          />

        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
           
            <>
              <button
                onClick={handleSkip}
                disabled={submitting || lockedIn}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  submitting || lockedIn
                    ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                    : "bg-neutral-600 hover:bg-neutral-500 active:scale-95"
                }`}
              >
                Skip Question
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null || submitting || lockedIn}
                className={`min-w-48 px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  lockedIn
                    ? "bg-lime-500/15 text-lime-300 border border-lime-500/40 cursor-default"
                    : selectedAnswer !== null && !submitting
                      ? "bg-lime-500 hover:bg-lime-400 text-black active:scale-95"
                      : "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Finishing...
                  </>
                ) : lockedIn ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Answer saved
                  </>
                ) : (
                  "Submit Answer"
                )}
              </button>
            </>
          
        </motion.div>
      </div>
    </div>
  );
};

export default SoloPractice;
