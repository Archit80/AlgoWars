// Shared helpers for the question bank in data/questions/*.json.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const BANK_DIR = path.join(__dirname, "../../data/questions");
export const BACKUP_DIR = path.join(__dirname, "../../data/backup");

// Topics the app offers (frontend battle + practice setup). Questions may only use these.
export const TOPICS = [
  "Arrays", "Strings", "Trees", "Graphs", "StacksQueues", "HashMaps", "SlidingWindow",
  "TwoPointers", "BinarySearch", "Sorting", "Recursion", "DynamicProgramming",
];

export const QuestionSchema = z.object({
  type: z.enum(["MCQ", "PREDICT_OUTPUT", "FILL_BLANK"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  categories: z.array(z.enum(TOPICS)).min(1).max(3),
  text: z.string().min(20).max(1500),
  options: z.array(z.string().min(1).max(300)).length(4),
  answer: z.string().min(1),
  verify: z.string().optional(),
});

// Uniqueness key: same question modulo case, spacing and punctuation
export const normalizeText = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

export function loadBank({ only } = {}) {
  const files = fs.readdirSync(BANK_DIR).filter((f) => f.endsWith(".json")).sort();
  return files
    .filter((f) => !only || only.includes(path.basename(f, ".json")))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BANK_DIR, file), "utf8");
      let entries;
      try {
        entries = JSON.parse(raw);
      } catch (e) {
        throw new Error(`${file}: invalid JSON (${e.message})`);
      }
      if (!Array.isArray(entries)) throw new Error(`${file}: must be a JSON array`);
      return { file, topic: path.basename(file, ".json"), entries };
    });
}

// The DB row for an entry (verification-only fields stripped)
export function toRow({ type, difficulty, categories, text, options, answer }) {
  return { type, difficulty, categories, text, options, answer };
}
