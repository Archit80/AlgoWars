// Loads data/questions/*.json into the database. Dry-run unless --apply is passed.
//
//   node scripts/questions/seed.js                    # dry run: report what would change
//   node scripts/questions/seed.js --apply            # insert new questions, update changed ones
//   node scripts/questions/seed.js --apply --replace  # also delete questions not in the bank
//
// --replace makes the database match the bank: questions whose text isn't in any bank file are
// deleted, plus the match answers and saved questions that reference them (database rules
// block deleting those questions otherwise). Questions that are in the bank keep their ids and
// history. It refuses to run unless a backup from the last 24h exists in data/backup/
// (scripts/questions/export.js).
// Run the validator first; this script only re-checks shape, not the verify programs.
import "dotenv/config";
import fs from "fs";
import prisma from "../../src/db/prismaClient.js";
import { BACKUP_DIR, QuestionSchema, loadBank, normalizeText, toRow } from "./bank.js";

const apply = process.argv.includes("--apply");
const replace = process.argv.includes("--replace");

const bank = loadBank().flatMap(({ file, entries }) =>
  entries.map((entry, i) => {
    const parsed = QuestionSchema.safeParse(entry);
    if (!parsed.success) throw new Error(`${file}#${i + 1} is invalid; run the validator first`);
    return toRow(parsed.data);
  })
);
const keys = new Set(bank.map((q) => normalizeText(q.text)));
if (keys.size !== bank.length) throw new Error("Duplicate questions in the bank; run the validator first");

function recentBackupExists() {
  if (!fs.existsSync(BACKUP_DIR)) return false;
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return fs.readdirSync(BACKUP_DIR).some((f) => f.startsWith("questions-") && fs.statSync(`${BACKUP_DIR}/${f}`).mtimeMs > dayAgo);
}

const existing = await prisma.question.findMany({
  select: { id: true, text: true, type: true, difficulty: true, categories: true, options: true, answer: true },
});
const existingByText = new Map(existing.map((q) => [q.text, q]));
const bankTexts = new Set(bank.map((q) => q.text));
const toCreate = bank.filter((q) => !existingByText.has(q.text));
const changed = (q, db) => ["type", "difficulty", "answer"].some((k) => q[k] !== db[k]) ||
  JSON.stringify(q.options) !== JSON.stringify(db.options) || JSON.stringify(q.categories) !== JSON.stringify(db.categories);
const toUpdate = bank.filter((q) => existingByText.has(q.text) && changed(q, existingByText.get(q.text)));
const toDelete = replace ? existing.filter((q) => !bankTexts.has(q.text)).map((q) => q.id) : [];

console.log(`Bank: ${bank.length} questions. Database: ${existing.length} questions.`);
if (replace) {
  const where = { questionId: { in: toDelete } };
  const [matchAnswers, savedQuestions] = await Promise.all([prisma.matchAnswer.count({ where }), prisma.savedQuestion.count({ where })]);
  console.log(`--replace: would delete ${toDelete.length} questions not in the bank, ${matchAnswers} match answers, ${savedQuestions} saved questions`);
}
console.log(`Would create ${toCreate.length}, update ${toUpdate.length}.`);

if (!apply) {
  console.log("\nDry run only. Re-run with --apply to write.");
  await prisma.$disconnect();
  process.exit(0);
}
if (replace && !recentBackupExists()) {
  console.error("Refusing to --replace: no backup from the last 24h in data/backup/. Run scripts/questions/export.js first.");
  await prisma.$disconnect();
  process.exit(1);
}

await prisma.$transaction(async (tx) => {
  if (toDelete.length) {
    await tx.matchAnswer.deleteMany({ where: { questionId: { in: toDelete } } });
    await tx.savedQuestion.deleteMany({ where: { questionId: { in: toDelete } } });
    await tx.question.deleteMany({ where: { id: { in: toDelete } } }); // match links cascade
  }
  for (let i = 0; i < toCreate.length; i += 100) {
    await tx.question.createMany({ data: toCreate.slice(i, i + 100) });
  }
  for (const q of toUpdate) {
    await tx.question.update({ where: { text: q.text }, data: q });
  }
}, { timeout: 120_000 });

console.log(`Done: created ${toCreate.length}, updated ${toUpdate.length}, deleted ${toDelete.length}.`);
await prisma.$disconnect();
