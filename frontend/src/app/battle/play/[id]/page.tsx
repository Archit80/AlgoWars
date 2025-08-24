"use client";
import React from "react";
import { Swords } from "lucide-react";
import { useState, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-dark.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-clike";
import MatchService from "@/services/matchService";
import { getSocket, joinMatchRoom, leaveMatchRoom } from "@/lib/socket";
import { useUserStore } from "@/stores/userStore";
import { useMatchStore } from "@/stores/matchStore";
import { useUser } from "@/contexts/userContext";
import { useParams, useRouter } from "next/navigation";

//TODO: opponent name -> {matchData?.user2Id} kinda like Archit vs Bob
export default function BattlePlayPage() {
  const { supabaseUser } = useUser();

  // Prism syntax highlighter for code blocks
  const spaceGrotesk = { className: "" };

  // Enhanced function to detect and format code blocks with syntax highlighting
  const formatQuestionText = (text: string) => {
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
        return (
          part && (
            <div
              key={index}
              className="text-white leading-relaxed whitespace-pre-wrap"
            >
              {part.trim()}
            </div>
          )
        );
      }
    });
  };

  // Custom syntax highlighter component
  const SyntaxHighlighter = ({ code }: { code: string }) => {
    const codeRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
      if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
      }
    }, [code]);

    return (
      <pre className={`text-sm overflow-x-auto`}>
        <code ref={codeRef} className="language-javascript">
          {code}
        </code>
      </pre>
    );
  };
  const params = useParams();
  const matchId = params?.id as string;
  // Local state
  interface MatchQuestion {
    id: string;
    text: string;
    options: string[];
    categories: string[];
    difficulty: string;
    type: string;
    answer?: string;
  }
  const [questions, setQuestions] = useState<MatchQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  // Score state removed as requested
  // No reveal during play; only show summary at end
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false);
  const [serverTimeLeft, setServerTimeLeft] = useState<number | null>(null);

  // Use match store instead of local state
  const { currentMatch, setMatchData, updateMatchData, clearMatch } =
    useMatchStore();
  const matchData = currentMatch;

  // Debug: Log current match data
  React.useEffect(() => {
    console.log("Current match from store:", currentMatch);
  }, [currentMatch]);

  // Use server time if available, otherwise fallback to local timer
  const displayTimeLeft = serverTimeLeft !== null ? serverTimeLeft : 60;
  // const [reveal, setReveal] = React.useState<{questionId: string} | null>(null); // future use for showing correct answer
  const userId = useUserStore((state) => state.supabaseUser?.id);
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (!supabaseUser) {
      router.push("/login");
    }
  }, [supabaseUser, router]);

  // Socket.IO setup (pseudo-code, replace with actual socket import)
  // const socket = useSocket();

  // Fetch questions for the match
  React.useEffect(() => {
    async function init() {
      if (!matchId) return;

  // Normalize state from server responses

      try {
        const response = await MatchService.getQuestions(matchId);
        if (response.success && Array.isArray(response.questions)) {
          setQuestions(response.questions);
          if (typeof response.currentIndex === "number")
            setCurrentIndex(response.currentIndex);
        }
        // If response includes complete match data, normalize to server canonical mapping
        if (response.match) {
          const matchDataToSet = {
            matchId,
            ...response.match,
            user1Username:
              response.match.user1Username || response.match.user1?.username,
            user2Username:
              response.match.user2Username || response.match.user2?.username,
          };
          console.log(
            "Setting match data from getQuestions (canonical):",
            matchDataToSet
          );
          setMatchData(matchDataToSet);
        }
      } catch (err) {
        console.error("Failed to fetch match questions:", err);
      }
      // Fetch state (reconnect support)
      try {
        const state = await MatchService.getState(matchId);
        if (state.success) {
          setCurrentIndex(state.currentIndex);
          // Use updateMatchData to preserve existing usernames
          const matchInfo = state.match || state;
          updateMatchData({
            currentIndex: matchInfo.currentIndex,
            user1Score: matchInfo.user1Score,
            user2Score: matchInfo.user2Score,
            status: matchInfo.status,
            // IDs from server to align canonical order
            user1Id: matchInfo.user1Id,
            user2Id: matchInfo.user2Id,
            // Only set usernames if they're actually present (not undefined)
            ...(matchInfo.user1Username && {
              user1Username: matchInfo.user1Username,
            }),
            ...(matchInfo.user2Username && {
              user2Username: matchInfo.user2Username,
            }),
            ...(matchInfo.user1?.username && {
              user1Username: matchInfo.user1.username,
            }),
            ...(matchInfo.user2?.username && {
              user2Username: matchInfo.user2.username,
            }),
          });
        }
      } catch {}
    }
    init();
  }, [matchId, setMatchData, updateMatchData]);

  // Socket handlers in separate useEffect
  React.useEffect(() => {
    if (!matchId) return;

    // Join socket room
    joinMatchRoom(matchId);
    const s = getSocket();

    s.on(
      "match:state",
      (d: {
        currentIndex?: number;
        user1Score?: number;
        user2Score?: number;
        status?: string;
      }) => {
        if (d.currentIndex != null) {
          setSelectedAnswer(null);
          setHasSubmitted(false);
          setIsWaitingForOpponent(false);
          setCurrentIndex(d.currentIndex);
          setServerTimeLeft(60);
        }
        // Update match data while preserving usernames
        updateMatchData({
          currentIndex: d.currentIndex,
          user1Score: d.user1Score,
          user2Score: d.user2Score,
          status: d.status,
        });
      }
    );

    s.on("match:timer", (d: { timeLeft?: number }) => {
      if (d.timeLeft != null) {
        setServerTimeLeft(d.timeLeft);
      }
    });

    s.on("match:completed", () => {
      setIsQuizComplete(true);
      // Redirect to results page after a short delay
      setTimeout(() => {
        clearMatch(); // Clear match data before leaving
        router.push(`/battle/result/${matchId}`);
      }, 2000);
    });

    return () => {
      if (matchId) leaveMatchRoom(matchId);
      s.off("match:state");
      s.off("match:timer");
      s.off("match:answer");
      s.off("match:reveal");
      s.off("match:completed");
    };
  }, [matchId, router, updateMatchData, clearMatch]);

  // Backfill usernames if missing by calling the lightweight endpoint once
  React.useEffect(() => {
    const run = async () => {
      if (!matchId) return;
      const cm = useMatchStore.getState().currentMatch;
      if (!cm || (cm.user1Username && cm.user2Username)) return;
      try {
        const u = await MatchService.getUsernames(matchId);
        if (u?.success) {
          updateMatchData({
            user1Id: u.user1Id,
            user2Id: u.user2Id,
            user1Username: u.user1Username,
            user2Username: u.user2Username,
          });
        }
      } catch (e) {
        console.warn('Failed to backfill usernames:', e);
      }
    };
    run();
  }, [matchId, updateMatchData]);

  // Socket.IO: listen for opponent progress and timer sync
  // React.useEffect(() => {
  //   socket.on('battle:opponentProgress', (data) => setOpponentProgress(data.index));
  //   socket.on('battle:timerSync', (data) => setTimeLeft(data.timeLeft));
  //   return () => {
  //     socket.off('battle:opponentProgress');
  //     socket.off('battle:timerSync');
  //   };
  // }, [socket]);

  const handleLocalAdvance = React.useCallback(() => {
    // Wait for server; local optimistic fallback
    if (currentIndex === questions.length - 1) {
      setIsQuizComplete(true);
    }
  }, [currentIndex, questions.length]);

  // Timer logic
  // Client no longer owns timer; server authoritative. (Optional local fallback removed)

  const handleSubmit = async () => {
    if (!selectedAnswer || hasSubmitted) return;

    setHasSubmitted(true);
    setIsWaitingForOpponent(true);

    try {
      const q = questions[currentIndex];
      await MatchService.submitAnswer(matchId, {
        userId,
        questionId: q.id,
        answer: selectedAnswer,
      });
      // Server will emit advance / reveal; optimistic safeguard
      handleLocalAdvance();
    } catch (e) {
      console.error(e);
      // Reset states on error
      setHasSubmitted(false);
      setIsWaitingForOpponent(false);
    }
  };

  if (questions.length === 0) {
    return <div className="text-white p-8">Loading questions...</div>;
  }

  if (isQuizComplete || currentIndex >= questions.length) {
    return (
      <div className="text-white p-8 flex items-center justify-center min-h-[60vh] ">
        <div className="max-w-lg w-full mx-auto bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-lime-500/30 shadow-xl rounded-3xl p-8 animate-pulse-glow">
          <div className="flex items-center gap-6 mb-6">
            <div
              className="aspect-square w-24 rounded-full bg-lime-500 flex items-center justify-center shadow-lg"
              style={{ boxShadow: "0 0 16px 4px #a3e635, 0 0 0 8px #84cc16" }}
            >
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-extrabold text-lime-400 drop-shadow mb-2">
                Opponent still in the Arena...
              </h2>
              <p className="text-base text-neutral-300 font-medium leading-relaxed">
                They&apos;re solving their final puzzles — stay locked in.
                You&apos;ll jump straight into the results when they finish.
              </p>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 10px rgba(132,204,22,0.2); }
            50% { box-shadow: 0 0 30px rgba(132,204,22,0.5); }
          }
          .animate-pulse-glow {
            animation: pulse-glow 4s infinite;
          }
        `}</style>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-[#0E0E0E] text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-lime-500">
              Question {currentIndex + 1} of {questions.length}
            </h1>
            <p className="text-neutral-400">{`> ${
              currentQuestion.categories?.join(", ") || "Battle"
            }`}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-lime-400">
                  {displayTimeLeft}s
                </span>
              </div>
              <div className="w-20 h-2 bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    displayTimeLeft < 10 ? "bg-red-500" : "bg-lime-500"
                  }`}
                  style={{ width: `${(displayTimeLeft / 60) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-2">
              {(() => {
                let player1 = "Player 1";
                let player2 = "Opponent";

                if (matchData) {
                  player1 = matchData.user1Username || "Player 1";
                  player2 = matchData.user2Username || "Player 2";
                }

                return (
                  <p className="text-sm text-neutral-400">
                    <span className="font-bold text-white">{player1}</span>
                    <span className="text-neutral-600"> vs </span>
                    <span className="font-bold text-white">{player2}</span>
                  </p>
                );
              })()}
            </div>
          </div>
        </div>
        {/* Question Card */}
        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl mb-8">
          {currentQuestion.text && (
            <div className="mb-6 ">
              {formatQuestionText(currentQuestion.text)}
            </div>
          )}
          <div className="space-y-4">
            {currentQuestion.options?.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => !hasSubmitted && setSelectedAnswer(option)}
                disabled={hasSubmitted}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:caret-fuchsia-800 hover:cursor-pointer ${
                  hasSubmitted
                    ? "cursor-not-allowed opacity-60"
                    : "hover:cursor-pointer"
                } ${
                  selectedAnswer === option
                    ? "border-lime-500 bg-lime-500/20"
                    : "border-neutral-600 hover:border-lime-500/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option
                        ? "border-lime-500 bg-lime-500"
                        : "border-neutral-600"
                    }`}
                  >
                    <span className="text-white font-bold text-sm">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </div>
                  <span className="text-white">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {isWaitingForOpponent && (
            <div className="px-8 py-3 text-center">
              <p className="text-yellow-400 font-semibold">
                Waiting for opponent...
              </p>
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || hasSubmitted}
            className={`px-8 py-3 rounded-xl font-semibold transition-all hover:cursor-pointer ${
              selectedAnswer !== null && !hasSubmitted
                ? "bg-lime-500 hover:bg-lime-400 text-black"
                : "bg-neutral-600 text-neutral-400 cursor-not-allowed"
            }`}
          >
            {hasSubmitted ? "Submitted" : "Submit Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
