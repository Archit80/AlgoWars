"use client";
import React from "react";
import { Handshake, Loader2, CheckCircle2, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import MatchService from "@/services/matchService";
import { getSocket, joinMatchRoom, leaveMatchRoom } from "@/lib/socket";
import { useMatchStore } from "@/stores/matchStore";
import { useUser } from "@/contexts/userContext";
import { useParams, useRouter } from "next/navigation";
import AnswerOptions from "@/components/quiz/AnswerOptions";
import QuestionText from "@/components/quiz/QuestionText";

const QUESTION_SECONDS = 60;

// Sent once per question by the server; the countdown is derived locally from endsAt
interface QuestionClock {
  matchId: string;
  index: number;
  startsAt: number;
  endsAt: number;
  serverNow: number;
}

//TODO: opponent name -> {matchData?.user2Id} kinda like Archit vs Bob
export default function BattlePlayPage() {
  const { supabaseUser } = useUser();
  const myUserId = (supabaseUser as { id?: string } | null)?.id;

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [opponentAnswered, setOpponentAnswered] = useState(false);
  const [clock, setClock] = useState<{ index: number; startsAt: number; endsAt: number; offset: number } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [waitingForOpponentJoin, setWaitingForOpponentJoin] = useState(false);
  const clockIndexRef = React.useRef<number | null>(null);

  // Re-render a few times a second while a question is live
  useEffect(() => {
    if (!clock) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [clock]);

  const applyQuestion = React.useCallback((q: QuestionClock) => {
    // Reset the answer UI only when the question actually changes (not on reconnect re-sync)
    if (clockIndexRef.current !== q.index) {
      clockIndexRef.current = q.index;
      setSelectedAnswer(null);
      setHasSubmitted(false);
      setIsWaitingForOpponent(false);
      setSubmitError(null);
      setOpponentAnswered(false);
    }
    setWaitingForOpponentJoin(false);
    // offset corrects for client/server clock skew
    setClock({ index: q.index, startsAt: q.startsAt, endsAt: q.endsAt, offset: q.serverNow - Date.now() });
    setCurrentIndex(q.index);
  }, []);

  // Use match store instead of local state
  const { currentMatch, setMatchData, updateMatchData, clearMatch } =
    useMatchStore();
  const matchData = currentMatch;

  // Debug: Log current match data
  React.useEffect(() => {
    console.log("Current match from store:", currentMatch);
  }, [currentMatch]);

  const serverNow = now + (clock?.offset ?? 0);
  const startsIn = clock ? Math.max(0, Math.ceil((clock.startsAt - serverNow) / 1000)) : 0;
  const displayTimeLeft = clock
    ? Math.max(0, Math.ceil((clock.endsAt - Math.max(serverNow, clock.startsAt)) / 1000))
    : QUESTION_SECONDS;
  // const [reveal, setReveal] = React.useState<{questionId: string} | null>(null); // future use for showing correct answer
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
          if (state.clock) applyQuestion(state.clock);
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
  }, [matchId, setMatchData, updateMatchData, applyQuestion]);

  // Socket handlers in separate useEffect
  React.useEffect(() => {
    if (!matchId) return;

    // Join socket room
    joinMatchRoom(matchId);
    const s = getSocket();

    s.on("match:question", applyQuestion);
    s.on("match:waiting", () => setWaitingForOpponentJoin(true));
    // Opponent progress for the live question (correctness is never revealed during play)
    s.on("match:answer", (d: { userId: string; index: number }) => {
      if (d.userId !== myUserId && d.index === clockIndexRef.current) setOpponentAnswered(true);
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
      s.off("match:question", applyQuestion);
      s.off("match:waiting");
      s.off("match:answer");
      s.off("match:completed");
    };
  }, [matchId, router, clearMatch, applyQuestion, myUserId]);

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
    // Last question: after a beat (so the locked-in state is visible), show the waiting screen
    if (currentIndex === questions.length - 1) {
      setTimeout(() => setIsQuizComplete(true), 900);
    }
  }, [currentIndex, questions.length]);

  // Timer logic
  // Client no longer owns timer; server authoritative. (Optional local fallback removed)

  const handleSubmit = async () => {
    if (!selectedAnswer || hasSubmitted || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const q = questions[currentIndex];
      await MatchService.submitAnswer(matchId, {
        questionId: q.id,
        answer: selectedAnswer,
      });
      setHasSubmitted(true);
      setIsWaitingForOpponent(true);
      handleLocalAdvance();
    } catch (e) {
      const message = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      if (message === "Already answered") {
        // A retry after a lost response: the server has it, so treat it as locked in
        setHasSubmitted(true);
        setIsWaitingForOpponent(true);
      } else {
        setSubmitError(message || "Couldn't submit your answer. Try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return <div className="text-slate-600 p-8">Loading questions...</div>;
  }

  if (isQuizComplete || currentIndex >= questions.length) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh] bg-white text-slate-900">
        <div className="max-w-lg w-full mx-auto bg-white border border-slate-200 shadow-sm rounded-lg p-8">
          <div className="flex items-center gap-6">
            <div className="aspect-square w-16 shrink-0 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Handshake className="w-6 h-6 text-blue-700" />
            </div>
            <div className="text-left">
              <div className="section-label mb-1">Awaiting Peer</div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Peer still in progress
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                They&apos;re working through their final questions.
                You&apos;ll be taken to the results as soon as they finish.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Show nothing while redirecting to login
  if (!supabaseUser) {
    return null;
  }

  if (!clock || startsIn > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <div className="text-center">
          <p className="text-slate-600 mb-2">
            {waitingForOpponentJoin
              ? "Waiting for your peer to join..."
              : !clock
                ? "Connecting to match..."
                : "Get ready"}
          </p>
          {clock && <p className="text-6xl font-bold text-blue-700">{startsIn}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-white text-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="section-label mb-1">{currentQuestion.categories?.join(", ") || "Challenge"}</div>
            <h1 className="text-2xl font-bold text-slate-900">
              Question {currentIndex + 1} of {questions.length}
            </h1>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-700 tabular-nums">
                  {displayTimeLeft}s
                </span>
              </div>
              <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    displayTimeLeft < 10 ? "bg-red-600" : "bg-blue-700"
                  }`}
                  style={{ width: `${(displayTimeLeft / 60) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-2">
              {(() => {
                let player1 = "Player 1";
                let player2 = "Peer";

                if (matchData) {
                  player1 = matchData.user1Username || "Player 1";
                  player2 = matchData.user2Username || "Player 2";
                }

                return (
                  <p className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-900">{player1}</span>
                    <span className="text-slate-400"> and </span>
                    <span className="font-semibold text-slate-900">{player2}</span>
                  </p>
                );
              })()}
            </div>
          </div>
        </div>
        {/* Question Card */}
        <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-lg mb-8">
          {currentQuestion.text && <QuestionText text={currentQuestion.text} className="mb-6" />}
          <AnswerOptions
            options={currentQuestion.options ?? []}
            selected={selectedAnswer}
            onSelect={(option) => {
              setSelectedAnswer(option);
              setSubmitError(null);
            }}
            locked={hasSubmitted}
            disabled={isSubmitting || displayTimeLeft === 0}
          />
        </div>

        {/* Submit + live status */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || hasSubmitted || isSubmitting}
            className={`min-w-52 px-8 py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${
              hasSubmitted
                ? "bg-emerald-50 text-emerald-600 border border-emerald-600 cursor-default"
                : selectedAnswer !== null && !isSubmitting
                  ? "bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Locking in...
              </>
            ) : hasSubmitted ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Answer locked in
              </>
            ) : (
              "Submit Answer"
            )}
          </button>

          <div className="min-h-6 text-sm font-medium" aria-live="polite">
            {submitError ? (
              <p className="text-red-600">{submitError}</p>
            ) : isWaitingForOpponent ? (
              opponentAnswered ? (
                <p className="text-emerald-600">Both answered. Next question incoming...</p>
              ) : (
                <p className="text-amber-600">Waiting for your peer...</p>
              )
            ) : opponentAnswered ? (
              <p className="flex items-center gap-1 text-amber-600">
                <Zap className="w-4 h-4" /> Your peer has answered
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
