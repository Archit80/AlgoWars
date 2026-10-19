// Backs up the current question bank (and the rows that reference it) to data/backup/.
// Read-only against the database. Run before any wipe.
//
//   node scripts/questions/export.js
import "dotenv/config";
import fs from "fs";
import path from "path";
import prisma from "../../src/db/prismaClient.js";
import { BACKUP_DIR } from "./bank.js";

const [questions, matchAnswers, savedQuestions, matchLinks] = await Promise.all([
  prisma.question.findMany({ orderBy: { createdAt: "asc" } }),
  prisma.matchAnswer.findMany(),
  prisma.savedQuestion.findMany(),
  prisma.$queryRaw`SELECT "A" AS "matchId", "B" AS "questionId" FROM "_MatchQuestions"`,
]);

fs.mkdirSync(BACKUP_DIR, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const file = path.join(BACKUP_DIR, `questions-${stamp}.json`);
fs.writeFileSync(file, JSON.stringify({ exportedAt: new Date(), questions, matchAnswers, savedQuestions, matchLinks }, null, 2));

console.log(`Backed up ${questions.length} questions, ${matchAnswers.length} match answers, ` +
  `${savedQuestions.length} saved questions, ${matchLinks.length} match links`);
console.log(`→ ${file}`);
await prisma.$disconnect();
