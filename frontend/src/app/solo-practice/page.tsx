"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import Result from "../result/page";
import QuestionsService from "@/services/questionsService";
import { motion } from "framer-motion";
import { usePracticeStore } from "@/stores/practiceStore";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { Space_Grotesk } from "next/font/google";

// Import Prism.js for syntax highlighting
import Prism from 'prismjs';
import 'prismjs/themes/prism-dark.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-clike';

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});
// import Link from "next/link"; // Use next/link for Next.js navigation

const SoloPractice = () => {
  const { supabaseUser } = useUser();
  const router = useRouter();
  const { questions, currentIndex, submitAnswer, nextQuestion, soloSessionId, mode, userAnswers } = usePracticeStore();
  
  // If questions are not loaded, redirect to setup page
  useEffect(() => {
    if (!questions || questions.length === 0) {
      console.warn("No questions found in store, redirecting to setup.");
      router.push('/practice-mode-setup');
    }
  }, [questions, router]);

  const currentQuestion = questions?.[currentIndex];
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // Route protection
  useEffect(() => {
    if (!supabaseUser) {
      router.push("/login");
    }
  }, [supabaseUser, router]);

  // If all questions are done, show result
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState<{
    score: number;
    total: number;
    duration?: number;
    xpEarned?: number;
    mode?: string;
    difficulty?: string;
  } | null>(null);

  const [sessionStartTime] = useState<number>(Date.now());

  // Enhanced function to detect and format code blocks with syntax highlighting
  const formatQuestionText = (text: string) => {
    // Split text by code blocks (content between ``` markers)
    const parts = text.split(/```/);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a code block
        return (
          <div key={index} className="my-4 overflow-hidden bg-[#1a1a1a]">
            <div className="bg-neutral-800 px-4 py-2 text-xs text-neutral-400 font-mono">
              <span>Algorithm</span>
            </div>
            <div className={`p-4 ${spaceGrotesk.className} `}>
              <SyntaxHighlighter code={part.trim()} />
            </div>
          </div>
        );
      } else {
        // This is regular text
        return part && (
          <div key={index} className="text-white leading-relaxed whitespace-pre-wrap">
            {part.trim()}
          </div>
        );
      }
    });
  };

  // Custom syntax highlighter component
  const SyntaxHighlighter = ({ code }: { code: string }) => {
    const codeRef = React.useRef<HTMLElement>(null);

    useEffect(() => {
      if (codeRef.current) {
        // Apply custom pseudo-code highlighting
        Prism.highlightElement(codeRef.current);
      }
    }, [code]);

    // Enhanced highlighting for pseudo-code
    const highlightPseudoCode = (code: string) => {
      // Escape HTML first to prevent conflicts
      const highlightedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Create a tokenization system to prevent overlapping replacements
      const tokens: Array<{start: number, end: number, type: string, content: string}> = [];
      
      // Find all patterns and their positions
      const patterns = [
        // Comments
        { regex: /(\/\/.*$)/gm, type: 'comment' },
        // Strings
        { regex: /"([^"]*)"/g, type: 'string' },
        // Function definitions
        { regex: /\b(function|FUNCTION)\s+([A-Z_][A-Z0-9_]*)/gi, type: 'function-def' },
        // Control structures
        { regex: /\b(if|else|while|for|return|break|continue|elif|end)\b/gi, type: 'keyword' },
        // Data structures and types
        { regex: /\b(ARRAY|STRING|MAP|SET|STACK|QUEUE|TREE|NODE|LIST|INT|FLOAT|BOOL)\b/g, type: 'class-name' },
        // Built-in functions
        { regex: /\b(length|LENGTH|size|SIZE|empty|EMPTY|push|POP|enqueue|dequeue|append|insert|remove|sort|reverse|MAX|MIN|ABS)\b/g, type: 'function' },
        // Numbers
        { regex: /\b\d+\.?\d*\b/g, type: 'number' },
        // Operators
        { regex: /[=<>!+\-*\/≤≥≠]+/g, type: 'operator' },
        // Variables (simple pattern)
        { regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, type: 'variable' }
      ];

      // Find all matches without overlapping
      patterns.forEach(pattern => {
        let match;
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        while ((match = regex.exec(highlightedCode)) !== null) {
          const start = match.index;
          const end = start + match[0].length;
          
          // Check if this position is already covered by a higher priority token
          const isOverlapping = tokens.some(token => 
            (start >= token.start && start < token.end) || 
            (end > token.start && end <= token.end) ||
            (start <= token.start && end >= token.end)
          );
          
          if (!isOverlapping) {
            tokens.push({
              start,
              end,
              type: pattern.type,
              content: match[0]
            });
          }
        }
      });

      // Sort tokens by position
      tokens.sort((a, b) => a.start - b.start);

      // Build the highlighted code
      let result = '';
      let lastIndex = 0;

      tokens.forEach(token => {
        // Add text before this token
        result += highlightedCode.slice(lastIndex, token.start);
        
        // Add the highlighted token
        if (token.type === 'function-def') {
          const parts = token.content.match(/\b(function|FUNCTION)\s+([A-Z_][A-Z0-9_]*)/i);
          if (parts) {
            result += `<span class="token keyword">${parts[1]}</span> <span class="token function">${parts[2]}</span>`;
          } else {
            result += `<span class="token ${token.type}">${token.content}</span>`;
          }
        } else {
          result += `<span class="token ${token.type}">${token.content}</span>`;
        }
        
        lastIndex = token.end;
      });

      // Add remaining text
      result += highlightedCode.slice(lastIndex);

      return result;
    };

    return (
      <pre className={`${spaceGrotesk.className} text-sm overflow-x-auto`}>
        <code 
          ref={codeRef}
          className="language-javascript"
          dangerouslySetInnerHTML={{ __html: highlightPseudoCode(code) }}
        />
      </pre>
    );
  };

  useEffect(() => {
    if (questions.length === 0) {
      // This is now handled by the redirect, but we can keep a log
      console.warn("No questions available for solo practice.");
    }
  }, [questions]);

  const handleNext = useCallback(async () => {
    if (currentIndex === questions.length - 1) {
      try {
        // Simple: Total time since session started
        const totalDurationInSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

        // Build question results for the result page
        const questionResults = questions.map(question => {
          const userAnswer = userAnswers.find(ua => ua.questionId === question.id);
          return {
            id: question.id,
            text: question.text,
            options: question.options,
            correctAnswer: question.answer,
            userAnswer: userAnswer?.selectedOption || null,
            userCorrect: userAnswer?.isCorrect || false
          };
        });

        const res = await QuestionsService.endSoloSession({
          soloSessionId,
          score,
          total: questions.length,
          duration: totalDurationInSeconds,
          questionResults
        } as any);
        
        // Add questionResults to the session stats for the result page
        setSessionStats({
          ...res,
          questionResults
        });
      } catch (err) {
        console.error("Failed to end solo session:", err);
      }
      setIsQuizComplete(true);
    } else {
      setSelectedAnswer(null);
      if (mode === "timed") {
        setTimeLeft(60);
      }
      nextQuestion();
    }
  }, [currentIndex, questions, sessionStartTime, soloSessionId, score, nextQuestion, mode, userAnswers]);

  useEffect(() => {
    if (mode === "timed" && timeLeft > 0) {
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
  }, [timeLeft, handleNext, mode]);

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
    return <Result {...(sessionStats ? sessionStats : { score, total: questions.length })} />;
  }

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    submitAnswer(currentQuestion.id, selectedAnswer);
    const correct = selectedAnswer === currentQuestion.answer;
    if (correct) setScore((prev) => prev + 1);
    console.log("score", score);
    handleNext();
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
          
          {currentQuestion.text && (
            <div className="mb-6 ">
              {formatQuestionText(currentQuestion.text)}
            </div>
          )}

          <div className="space-y-4">
              {currentQuestion.options.map((option: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:cursor-pointer ${
                    selectedAnswer === option
                      ? "border-lime-500 bg-lime-500/20"
                      : "border-neutral-600 hover:border-lime-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option ? "border-lime-500 bg-lime-500" : "border-neutral-600"
                      }`}
                    >
                      <span className="text-white font-bold text-sm">{String.fromCharCode(65 + idx)}</span>
                    </div>
                    <span className="font-mono text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          
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
                className="px-6 py-3 bg-neutral-600 hover:bg-neutral-500 rounded-xl font-semibold transition-all"
              >
                Skip Question
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  selectedAnswer !== null
                    ? "bg-lime-500 hover:bg-lime-400 text-black"
                    : "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                }`}
              >
                Submit Answer
              </button>
            </>
          
        </motion.div>
      </div>
    </div>
  );
};

export default SoloPractice;
