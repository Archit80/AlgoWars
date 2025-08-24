"use client";
import React, { useState } from "react";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, CheckCircle, Trophy, Badge, Swords } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Quiz = () => {
  const mcqQuestions = [
    {
      type: "arrays",
      title: "Array Magic",
      code: `int mystery() {
  int arr[] = {1, 5, 3, 9, 2};
  int result = arr[0];
  
  for (int i = 1; i < 5; i++) {
    if (arr[i] > result) {
      result = arr[i];
    }
  }
  return result;
}`,
      question: "What does mystery() return?",
      options: ["1", "5", "9", "2"],
      correct: 2,
      explanation:
        "The function finds the maximum element in the array. Starting with arr[0]=1, it compares with each element and updates result to the largest value found, which is 9.",
    },

    {
      type: "strings",
      title: "String Puzzle",
      code: `bool isPalindrome() {
  char str[] = "racecar";
  int len = 7;
  
  for (int i = 0; i < len/2; i++) {
    if (str[i] != str[len-1-i]) {
      return false;
    }
  }
  return true;
}`,
      question: "What does isPalindrome() return?",
      options: ["true", "false", "error", "undefined"],
      correct: 0,
      explanation:
        "The function checks if 'racecar' is a palindrome by comparing characters from both ends. Since 'racecar' reads the same forwards and backwards, it returns true.",
    },

    {
      type: "binary_search",
      title: "Search Detective",
      code: `int binarySearch() {
  int arr[] = {2, 4, 6, 8, 10, 12};
  int target = 8;
  int left = 0, right = 5;
  
  while (left <= right) {
    int mid = (left + right) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      question: "What does binarySearch() return?",
      options: ["2", "3", "8", "-1"],
      correct: 1,
      explanation:
        "Binary search finds target 8 at index 3. First iteration: mid=2, arr[2]=6 < 8, so left=3. Second iteration: mid=3, arr[3]=8 matches target, returns 3.",
    },
  ];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleAnswerClick = (answerIndex) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === mcqQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion === mcqQuestions.length - 1) {
      // All questions completed, show modal
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 2000);
    } else {
      setCurrentQuestion((prev) => (prev + 1) % mcqQuestions.length);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <section className="px-4 py-12 sm:py-16 bg-gradient-to-b from-gray-900/50 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2
            className={`text-4xl lg:text-5xl font-bold mb-2 ${spaceGrotesk.className}`}
          >
            <span className="bg-gradient-to-b from-lime-400 to-green-500 bg-clip-text text-transparent">
              Quick Fire Challenges
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Test your coding knowledge with lightning-fast MCQ battles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Quiz Stats & Info */}
          <div className="space-y-6">
            {/* Current Stats */}
            <Card className="bg-gray-900/80 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle
                    className={`text-lime-400 ${spaceGrotesk.className} flex items-center gap-2`}
                  >
                    <Brain className="w-5 h-5" />
                    {mcqQuestions[currentQuestion].title}
                  </CardTitle>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {mcqQuestions[currentQuestion].type}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Timer & Score */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gray-900/50 border-gray-800 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-400">Score</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {score}/{currentQuestion + 1}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((score / (currentQuestion + 1)) * 100)}% Accuracy
                </div>
              </Card>

              <div className="p-2 h-full w-full bg-transparent mt-8">
                <div className="flex items-center justify-center h-40 sm:h-108 w-full rounded-lg">
                  <DotLottieReact
                    src="https://lottie.host/2c0b3612-9c65-4a47-9ea1-cae313b51515/WHXB4fDe55.lottie"
                    loop
                    autoplay
                    className="h-80 sm:h-[32rem] w-[28rem]"
                  />
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            <div className="flex gap-2 flex-wrap">
              {mcqQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    currentQuestion === index
                      ? "bg-lime-400 text-black"
                      : index < currentQuestion
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Interface */}
          <div className="relative">
            <Card className="bg-gray-900/90 border-gray-800 overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-400 ml-2">
                      challenge.cpp
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                      Live Battle
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Code Block */}
                <div className="bg-gray-950 p-3 sm:p-4 border-b border-gray-800 overflow-auto max-h-60 sm:max-h-[500px]">
                  <SyntaxHighlighter
                    language="cpp"
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      padding: 0,
                      background: "transparent",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{
                      color: "#6b7280",
                      fontSize: "12px",
                      paddingRight: "1rem",
                    }}
                  >
                    {mcqQuestions[currentQuestion].code}
                  </SyntaxHighlighter>
                </div>

                {/* Question */}
                <div className="p-4 border-b border-gray-800">
                  <h3
                    className={`text-lg font-bold text-white mb-1 ${spaceGrotesk.className}`}
                  >
                    {mcqQuestions[currentQuestion].question}
                  </h3>
                </div>

                {/* Answer Options */}
                <div className="p-4 space-y-3">
                  {mcqQuestions[currentQuestion].options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        disabled={showResult}
                        className={`w-full text-left p-3 md:p-4 text-sm md:text-base hover:cursor-pointer rounded-lg border transition-all duration-200 transform hover:scale-102 ${
                          showResult
                            ? index === mcqQuestions[currentQuestion].correct
                              ? "bg-green-500/20 border-green-500 text-green-400"
                              : selectedAnswer === index
                              ? "bg-red-500/20 border-red-500 text-red-400"
                              : "bg-gray-800/50 border-gray-700 text-gray-400"
                            : selectedAnswer === index
                            ? "bg-lime-400/20 border-lime-400 text-lime-400"
                            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                              showResult &&
                              index === mcqQuestions[currentQuestion].correct
                                ? "border-green-500 bg-green-500 text-black"
                                : showResult &&
                                  selectedAnswer === index &&
                                  index !==
                                    mcqQuestions[currentQuestion].correct
                                ? "border-red-500 bg-red-500 text-white"
                                : selectedAnswer === index
                                ? "border-lime-400 bg-lime-400 text-black"
                                : "border-gray-600"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {showResult &&
                            index === mcqQuestions[currentQuestion].correct && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                        </div>
                      </button>
                    )
                  )}
                </div>

                {/* Explanation */}
                {showResult && (
                  <div className="p-4 bg-gray-800/50 border-t border-gray-700 animate-fade-in">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">💡</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-1">
                          Explanation
                        </h4>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {mcqQuestions[currentQuestion].explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Battle Status */}
            <div className="absolute -top-2 -right-2 bg-lime-400 text-black px-3 py-1 rounded-full text-xs font-bold transform rotate-12 shadow-lg">
              🔥 {score > currentQuestion / 2 ? "Winning!" : "Keep Going!"}
            </div>
          </div>
        </div>
      </div>
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-8 max-w-md w-full text-center transform animate-fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-8 w-8 text-black" />
            </div>

            <h3
              className={`text-2xl font-bold text-white mb-2 ${spaceGrotesk.className}`}
            >
              Login to Keep Playing
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed  ">
              Train your brain. Rise through ranks. Earn your glory.
            </p>

            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r py-6 text-lg from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-bold transform hover:scale-98 transition-all duration-200 hover:cursor-pointer">
                <Swords className="w-10 h-10 mr-2" />
                Enter the Arena
              </Button>

              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setCurrentQuestion(0);
                  setScore(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                }}
                className="w-full text-gray-400 hover:cursor-pointer hover:text-white transition-colors py-2"
              >
                Nah, I&apos;m scared
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Quiz;
