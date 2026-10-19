// Parsing and pseudocode tokenizing for question text. Pure functions (no React) so they're
// easy to test. Question text is plain prose with ```fenced``` code blocks and `inline code`;
// the code is language-agnostic pseudocode, so it gets a purpose-built highlighter.

export type Block =
  | { kind: "text"; text: string }
  | { kind: "code"; code: string; lang: string | null };

export type InlinePart =
  | { kind: "text"; text: string }
  | { kind: "code"; text: string }
  | { kind: "blank"; text: string };

export type TokenKind =
  | "keyword"
  | "literal"
  | "function"
  | "constant"
  | "number"
  | "string"
  | "comment"
  | "blank"
  | "operator"
  | "plain";

export interface Token {
  kind: TokenKind;
  text: string;
}

// Only these count as a language tag after ```; anything else is code that starts on the
// fence line (e.g. ```arr = [3,1,2] ... ```), which is common in the question bank.
const KNOWN_LANGS = new Set([
  "pseudocode", "pseudo", "text", "plaintext", "python", "py", "javascript", "js",
  "typescript", "ts", "java", "c", "cpp", "c++", "go", "rust", "sql",
]);

const FENCE_RE = /```([\s\S]*?)(?:```|$)/g;

export function parseQuestion(text: string): Block[] {
  const blocks: Block[] = [];
  let last = 0;
  for (const match of text.matchAll(FENCE_RE)) {
    const start = match.index ?? 0;
    if (start > last) blocks.push({ kind: "text", text: text.slice(last, start) });
    blocks.push(parseFence(match[1]));
    last = start + match[0].length;
  }
  if (last < text.length) blocks.push({ kind: "text", text: text.slice(last) });
  return blocks.filter((b) => (b.kind === "code" ? b.code.trim() : b.text.trim()));
}

function parseFence(body: string): Block {
  const firstLine = body.match(/^([A-Za-z+#]+)[ \t]*\n/);
  const lang = firstLine && KNOWN_LANGS.has(firstLine[1].toLowerCase()) ? firstLine[1].toLowerCase() : null;
  const code = lang ? body.slice(firstLine![0].length) : body;
  return { kind: "code", code: dedent(code.replace(/^\n+|\s+$/g, "")), lang };
}

function dedent(code: string): string {
  const lines = code.split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)![0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return min ? lines.map((l) => l.slice(min)).join("\n") : code;
}

// Inline `code` and fill-in blanks (____) inside prose or answer options
const INLINE_RE = /`([^`\n]+)`|(_{3,})/g;

export function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ kind: "text", text: text.slice(last, start) });
    parts.push(match[1] !== undefined ? { kind: "code", text: match[1] } : { kind: "blank", text: match[2] });
    last = start + match[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", text: text.slice(last) });
  return parts;
}

const KEYWORDS = new Set([
  "if", "else", "elif", "elseif", "then", "end", "endif", "endwhile", "endfor", "for", "foreach",
  "each", "while", "do", "repeat", "until", "to", "downto", "step", "from", "in", "of", "and", "or",
  "not", "return", "function", "procedure", "def", "func", "break", "continue", "let", "var",
  "const", "set", "class", "new", "is", "begin", "case", "switch", "default", "lambda", "yield",
]);
const LITERALS = new Set(["true", "false", "null", "none", "nil", "self", "this", "undefined"]);

// One alternative per token kind; order matters (comments and strings before operators)
const TOKEN_RE =
  /(\/\/.*|#.*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(_{3,})|(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_])/g;

// Tokenize one line of pseudocode (comments and strings never span lines here).
export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  for (const m of line.matchAll(TOKEN_RE)) {
    const [text, comment, string, blank, number, word] = m;
    let kind: TokenKind = "plain";
    if (comment !== undefined) kind = "comment";
    else if (string !== undefined) kind = "string";
    else if (blank !== undefined) kind = "blank";
    else if (number !== undefined) kind = "number";
    else if (word !== undefined) {
      const lower = word.toLowerCase();
      const rest = line.slice((m.index ?? 0) + word.length);
      if (KEYWORDS.has(lower)) kind = "keyword";
      else if (LITERALS.has(lower)) kind = "literal";
      else if (/^\s*\(/.test(rest)) kind = "function";
      else if (word.length > 1 && word === word.toUpperCase() && /[A-Z]/.test(word)) kind = "constant";
    } else if (m[7] !== undefined) kind = "operator";

    // Merge adjacent plain/whitespace runs to keep the DOM small
    const prev = tokens[tokens.length - 1];
    if (kind === "plain" && prev?.kind === "plain") prev.text += text;
    else tokens.push({ kind, text });
  }
  return tokens;
}
