import { PrismaClient } from "@prisma/client";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const questionsPath = path.join(__dirname, "../src/db/Arrays.json");

function loadQuestions() {
  const raw = fs.readFileSync(questionsPath, "utf8");
  let data = null;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse Arrays.json:", e.message);
    process.exit(1);
  }
  if (!Array.isArray(data)) {
    console.error("Arrays.json must be a JSON array");
    process.exit(1);
  }
  return data;
}

async function main() {
  const questions = loadQuestions();

  // Delete dependent records first
  await prisma.matchAnswer.deleteMany();
  await prisma.savedQuestion.deleteMany();
  console.log("Deleted dependent records (MatchAnswer, SavedQuestion)");

  // Delete all existing questions
  await prisma.question.deleteMany();
  console.log("Deleted all existing questions.");

  // Insert in batches
  const batchSize = 100;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    await prisma.question.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(
      `Created batch ${Math.floor(i / batchSize) + 1} - questions ${i + 1} to ${Math.min(
        i + batchSize,
        questions.length
      )}`
    );
  }

  console.log("Seeding Arrays questions complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


