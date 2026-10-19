// Validates data/questions/*.json: shape, option rules, uniqueness, answer-position balance,
// and executes each `verify` program with Python to prove the answer key.
//
//   node scripts/questions/validate.js            # all topics
//   node scripts/questions/validate.js Graphs     # one topic
//
// Exit code 1 if anything fails.
import { spawnSync } from "child_process";
import { QuestionSchema, TOPICS, loadBank, normalizeText } from "./bank.js";

const PYTHON = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const TIMEOUT_MS = 5000;

function runPython(code) {
  const r = spawnSync(PYTHON, ["-I", "-c", code], { encoding: "utf8", timeout: TIMEOUT_MS });
  // A wrong FILL_BLANK option may loop forever: that just means the option fails
  if (r.error?.code === "ETIMEDOUT") return { ok: false, out: "", err: "timed out" };
  if (r.error) throw r.error;
  return { ok: r.status === 0, out: (r.stdout ?? "").trim(), err: (r.stderr ?? "").trim().split("\n").pop() };
}

function checkEntry(entry, topic) {
  const errors = [];
  const parsed = QuestionSchema.safeParse(entry);
  if (!parsed.success) {
    return parsed.error.issues.map((i) => `${i.path.join(".") || "entry"}: ${i.message}`);
  }
  const q = parsed.data;

  if (q.categories[0] !== topic) errors.push(`first category must be the file topic "${topic}"`);
  if (new Set(q.options).size !== 4) errors.push("options must be distinct");
  if (!q.options.includes(q.answer)) errors.push("answer must be one of the options");
  if (q.text.includes("```") && (q.text.match(/```/g).length % 2 !== 0)) errors.push("unclosed ``` fence");
  for (const block of q.text.matchAll(/```([\s\S]*?)```/g)) {
    const code = block[1].trim();
    if (code.length > 70 && !code.includes("\n")) errors.push("code block is flattened onto one line");
  }
  if (q.type === "FILL_BLANK" && !/_{3,}/.test(q.text)) errors.push("FILL_BLANK text needs a ____ blank");

  const needsVerify = q.type === "PREDICT_OUTPUT" || q.type === "FILL_BLANK";
  if (needsVerify && !q.verify) errors.push(`${q.type} requires a verify program`);
  if (!q.verify || errors.length) return errors;

  if (q.type === "FILL_BLANK") {
    if (!q.verify.includes("__BLANK__")) return [...errors, "FILL_BLANK verify must contain __BLANK__"];
    const passing = q.options.filter((opt) => runPython(q.verify.replaceAll("__BLANK__", opt)).out === "OK");
    if (!passing.includes(q.answer)) errors.push(`verify: the answer does not print OK`);
    const wrong = passing.filter((o) => o !== q.answer);
    if (wrong.length) errors.push(`verify: distractor(s) also print OK: ${JSON.stringify(wrong)}`);
  } else {
    const r = runPython(q.verify);
    if (!r.ok) errors.push(`verify crashed: ${r.err}`);
    else if (r.out !== q.answer) errors.push(`verify printed ${JSON.stringify(r.out)}, answer is ${JSON.stringify(q.answer)}`);
  }
  return errors;
}

const only = process.argv.slice(2);
let failures = 0;
const seen = new Map(); // normalized text -> location

for (const { file, topic, entries } of loadBank({ only: only.length ? only : undefined })) {
  if (!TOPICS.includes(topic)) {
    console.log(`✖ ${file}: "${topic}" is not an offered topic`);
    failures++;
    continue;
  }
  const positions = [0, 0, 0, 0];
  const mix = {};
  entries.forEach((entry, i) => {
    const where = `${file}#${i + 1}`;
    const errors = checkEntry(entry, topic);
    const key = normalizeText(entry.text ?? "");
    if (seen.has(key)) errors.push(`duplicate of ${seen.get(key)}`);
    else seen.set(key, where);
    if (errors.length) {
      failures += errors.length;
      for (const e of errors) console.log(`✖ ${where}: ${e}`);
    } else {
      positions[entry.options.indexOf(entry.answer)]++;
      const k = `${entry.difficulty}/${entry.type}`;
      mix[k] = (mix[k] ?? 0) + 1;
    }
  });

  // Correct answers should be spread across A-D
  const n = entries.length;
  const maxShare = Math.max(...positions) / Math.max(1, n);
  if (n >= 20 && maxShare > 0.35) {
    console.log(`✖ ${file}: answer positions unbalanced (A-D = ${positions.join("/")})`);
    failures++;
  }
  console.log(`• ${file}: ${n} questions, answers A-D ${positions.join("/")}`);
  console.log(`  ${Object.entries(mix).sort().map(([k, v]) => `${k}:${v}`).join("  ")}`);
}

if (failures) {
  console.log(`\n${failures} problem(s) found`);
  process.exit(1);
}
console.log("\nAll questions valid");
