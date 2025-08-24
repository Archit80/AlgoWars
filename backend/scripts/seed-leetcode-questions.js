
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const questionsPath = path.join(__dirname, "../src/db/leetcode_mcq_questions.json");
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

async function main() {
  // Delete dependent records first
  await prisma.matchAnswer.deleteMany();
  await prisma.savedQuestion.deleteMany();
  // Add more dependent deletes if needed
  console.log("Deleted all dependent records (MatchAnswer, SavedQuestion, etc.)");

  // Delete all existing questions
  await prisma.question.deleteMany();
  console.log("Deleted all existing questions.");

  // Create all questions in batches
  const batchSize = 100;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    await prisma.question.createMany({
      data: batch,
      skipDuplicates: true
    });
    console.log(`Created batch ${Math.floor(i/batchSize) + 1} - questions ${i + 1} to ${Math.min(i + batchSize, questions.length)}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
