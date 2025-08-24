"use client";
import React from "react";
import { X } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-dark.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-clike";

interface QuestionPreviewModalProps {
  isOpen: boolean;
  question: any | null;
  onClose: () => void;
}

const QuestionPreviewModal: React.FC<QuestionPreviewModalProps> = ({
  isOpen,
  question,
  onClose,
}) => {
  console.log("Modal component rendered with:", { isOpen, question: !!question });

  // Syntax highlighter component
  const SyntaxHighlighter = ({ code }: { code: string }) => {
    const codeRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
      if (codeRef.current) Prism.highlightElement(codeRef.current);
    }, [code]);

    return (
      <pre className="text-sm overflow-x-auto bg-transparent p-0 m-0">
        <code ref={codeRef} className="language-javascript">
          {code}
        </code>
      </pre>
    );
  };

  // Format question text with code highlighting
  const formatQuestionText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/```/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <div key={index} className="my-4 overflow-hidden bg-[#0f1720] rounded-md">
            <div className="bg-neutral-800 px-4 py-2 text-xs text-neutral-400 font-mono">
              Code
            </div>
            <div className="p-4">
              <SyntaxHighlighter code={part.trim()} />
            </div>
          </div>
        );
      }
      return (
        part && (
          <div key={index} className="text-white leading-relaxed whitespace-pre-wrap">
            {part.trim()}
          </div>
        )
      );
    });
  };

  // Build fallback options if none provided
  const buildPreviewOptions = (q: any) => {
    const text = q?.title || "(no question text)";
    const base = text.split("\n")[0];
    return [
      `${base} — Correct Answer`,
      `${base} — User Answer (example)`,
      `${base} — Distractor B`,
      `${base} — Distractor C`,
    ];
  };

  // Portal helper (removed unused ModalPortal)
  /*
  const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const hostRef = React.useRef<HTMLElement | null>(null);

    useEffect(() => {
      let host = document.getElementById("modal-root");
      if (!host) {
        host = document.createElement("div");
        host.id = "modal-root";
        document.body.appendChild(host);
      }
      hostRef.current = host;
      return () => {
        // leave host in DOM (shared)
      };
    }, []);

    if (!hostRef.current) return null;
    return createPortal(children, hostRef.current);
  };
  */

  if (!isOpen || !question) {
    console.log("Modal not rendering because:", { isOpen, hasQuestion: !!question });
    return null;
  }

  console.log("Modal SHOULD render now");

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center h-full"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-neutral-900 border-2 border-white/10 rounded-lg px-6 py-2 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
          <div className="relative mb-6">
            <button
              onClick={onClose}
              className="absolute top-2 right-0 text-gray-400 hover:text-white p-2 rounded-full hover:cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4 text-white">
            {formatQuestionText(question.fullText || question.title || "")}
          </div>
          <div className="space-y-3">
            {(question.options && question.options.length > 0
              ? question.options
              : buildPreviewOptions(question)
            ).map((opt: string, idx: number) => {
              // determine indexes from real data when available
              const correctIndex =
                question.options && question.correctAnswer
                  ? question.options.indexOf(question.correctAnswer)
                  : 0;
              const userIndex =
                question.options && question.userAnswer
                  ? question.options.indexOf(question.userAnswer)
                  : 1;
              const isCorrect = idx === correctIndex;
              const isUserWrong = idx === userIndex && userIndex !== correctIndex;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isCorrect
                      ? "border-lime-500 bg-lime-500/10 text-lime-300"
                      : isUserWrong
                      ? "border-red-500 bg-red-500/10 text-red-300"
                      : "border-neutral-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isCorrect
                          ? "border-lime-500 bg-lime-500"
                          : isUserWrong
                          ? "border-red-500 bg-red-500"
                          : "border-neutral-600"
                      }`}
                    >
                      <span className="text-white font-bold text-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </div>
                    <span className="text-white">{opt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default QuestionPreviewModal;
