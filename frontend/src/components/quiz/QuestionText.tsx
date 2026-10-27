import { memo, useMemo } from "react";
import { parseInline, parseQuestion, tokenizeLine, type TokenKind } from "@/lib/questionFormat";
import { cn } from "@/lib/utils";

// Renders question text: prose paragraphs, `inline code`, ____ blanks, and ```code blocks```
// with in-house pseudocode highlighting. No highlighting library, no DOM mutation.

const TOKEN_CLASS: Record<TokenKind, string> = {
  keyword: "text-blue-700 font-semibold",
  literal: "text-amber-700",
  function: "text-violet-700",
  constant: "text-sky-700",
  number: "text-amber-700",
  string: "text-emerald-700",
  comment: "text-slate-500 italic",
  blank: "",
  operator: "text-slate-600",
  plain: "text-slate-900",
};

function Blank({ text }: { text: string }) {
  return (
    <span
      aria-label="blank"
      className="inline-block align-baseline mx-0.5 px-2 rounded border border-dashed border-blue-400 bg-blue-50 text-blue-700 font-mono"
    >
      {" ".repeat(Math.min(4, Math.max(2, Math.ceil(text.length / 2))))}
    </span>
  );
}

// Inline text with `code` chips and ____ blanks. Also used for answer options.
export const InlineText = memo(function InlineText({ text }: { text: string }) {
  const parts = useMemo(() => parseInline(text), [text]);
  return (
    <>
      {parts.map((part, i) =>
        part.kind === "code" ? (
          <code key={i} className="mx-0.5 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900 font-mono text-[0.9em]">
            {part.text}
          </code>
        ) : part.kind === "blank" ? (
          <Blank key={i} text={part.text} />
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
});

function CodeBlock({ code, lang }: { code: string; lang: string | null }) {
  const lines = useMemo(() => code.split("\n").map(tokenizeLine), [code]);
  const numbered = lines.length > 1;

  return (
    <figure className="my-4 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
      <figcaption className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">{lang ?? "pseudocode"}</span>
      </figcaption>
      {/* Wrap long lines instead of scrolling: nobody should scroll sideways mid-question */}
      <pre className="py-3 font-mono text-[13px] leading-6 sm:text-sm">
        <code>
          {lines.map((tokens, i) => (
            <div key={i} className="flex hover:bg-slate-100/60">
              {numbered && (
                <span aria-hidden className="w-10 shrink-0 select-none pr-3 text-right text-slate-400">
                  {i + 1}
                </span>
              )}
              <span className={`min-w-0 flex-1 whitespace-pre-wrap break-words pr-4 ${numbered ? "" : "pl-4"}`}>
                {tokens.length === 0
                  ? "\n"
                  : tokens.map((t, j) =>
                      t.kind === "blank" ? (
                        <Blank key={j} text={t.text} />
                      ) : (
                        <span key={j} className={TOKEN_CLASS[t.kind]}>
                          {t.text}
                        </span>
                      )
                    )}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </figure>
  );
}

interface QuestionTextProps {
  text: string;
  className?: string;
}

function QuestionText({ text, className = "" }: QuestionTextProps) {
  const blocks = useMemo(() => parseQuestion(text ?? ""), [text]);
  return (
    <div className={cn("space-y-3 text-slate-900 leading-relaxed", className)}>
      {blocks.map((block, i) =>
        block.kind === "code" ? (
          <CodeBlock key={i} code={block.code} lang={block.lang} />
        ) : (
          <p key={i} className="whitespace-pre-wrap">
            <InlineText text={block.text.trim()} />
          </p>
        )
      )}
    </div>
  );
}

export default memo(QuestionText);
