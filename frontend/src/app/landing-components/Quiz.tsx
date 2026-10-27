"use client";
import React, { useState } from "react";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, CheckCircle, Trophy, Handshake } from "lucide-react";
// Light build + only the language used here (the full build bundles every language)
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

SyntaxHighlighter.registerLanguage("cpp", cpp);

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
    <section className="px-4 py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 max-w-2xl">
          <p className="section-label mb-2">02 &middot; Demonstration</p>
          <h2 className="rule-title text-3xl lg:text-4xl font-bold text-slate-900 mb-4 inline-block">
            Quick Challenges
          </h2>
          <p className="text-lg text-slate-600">
            Try a short multiple-choice exercise on code tracing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Quiz Stats & Info */}
          <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-slate-900 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-700" />
                    {mcqQuestions[currentQuestion].title}
                  </CardTitle>
                  <span className="rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-2 py-1">
                    {mcqQuestions[currentQuestion].type}
                  </span>
                </div>
              </CardHeader>
            </Card>

            {/* Score */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-blue-700" />
                  <span className="text-sm text-slate-500">Score</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {score}/{currentQuestion + 1}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {Math.round((score / (currentQuestion + 1)) * 100)}% Accuracy
                </div>
              </Card>

              <div className="p-2 h-full w-full bg-transparent mt-8">
                <div className="flex items-center justify-center h-40 sm:h-108 w-full rounded-md">
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                    currentQuestion === index
                      ? "bg-blue-700 text-white"
                      : index < currentQuestion
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Interface */}
          <div className="relative">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-600">
                    Fig. 4 &middot; challenge.cpp
                  </span>
                  <span className="text-xs text-slate-500">
                    {score > currentQuestion / 2 ? "On track" : "Keep going"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Code Block */}
                <div className="bg-slate-50 p-3 sm:p-4 border-b border-slate-200 overflow-auto max-h-60 sm:max-h-[500px]">
                  <SyntaxHighlighter
                    language="cpp"
                    style={prism}
                    customStyle={{
                      margin: 0,
                      padding: 0,
                      background: "transparent",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{
                      color: "#94a3b8",
                      fontSize: "12px",
                      paddingRight: "1rem",
                    }}
                  >
                    {mcqQuestions[currentQuestion].code}
                  </SyntaxHighlighter>
                </div>

                {/* Question */}
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
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
                        className={`w-full text-left p-3 md:p-4 text-sm md:text-base hover:cursor-pointer rounded-md border transition-colors duration-200 ${
                          showResult
                            ? index === mcqQuestions[currentQuestion].correct
                              ? "bg-emerald-50 border-emerald-600 text-emerald-600"
                              : selectedAnswer === index
                              ? "bg-red-50 border-red-600 text-red-600"
                              : "bg-white border-slate-200 text-slate-500"
                            : selectedAnswer === index
                            ? "bg-blue-50 border-blue-700 text-blue-700"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                              showResult &&
                              index === mcqQuestions[currentQuestion].correct
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : showResult &&
                                  selectedAnswer === index &&
                                  index !==
                                    mcqQuestions[currentQuestion].correct
                                ? "border-red-600 bg-red-600 text-white"
                                : selectedAnswer === index
                                ? "border-blue-700 bg-blue-700 text-white"
                                : "border-slate-300"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {showResult &&
                            index === mcqQuestions[currentQuestion].correct && (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            )}
                        </div>
                      </button>
                    )
                  )}
                </div>

                {/* Explanation */}
                {showResult && (
                  <div className="p-4 bg-blue-50 border-t border-blue-100 animate-fade-in">
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Explanation
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {mcqQuestions[currentQuestion].explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {showCompletionModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-center mx-auto mb-5">
              <Trophy className="h-7 w-7 text-blue-700" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Log in to Continue
            </h3>

            <p className="text-slate-600 mb-6 leading-relaxed">
              Create an account to access the full challenge bank and peer challenges.
            </p>

            <div className="space-y-3">
              <Button className="w-full bg-blue-700 hover:bg-blue-800 py-6 text-base text-white font-semibold hover:cursor-pointer">
                <Handshake className="w-5 h-5 mr-2" />
                Get Started
              </Button>

              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setCurrentQuestion(0);
                  setScore(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                }}
                className="w-full text-slate-500 hover:cursor-pointer hover:text-slate-900 transition-colors py-2"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Quiz;
