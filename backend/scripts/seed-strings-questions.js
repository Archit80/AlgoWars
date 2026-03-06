import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const questionsPath = path.join(__dirname, "../src/db/DP.json");

function loadQuestions() {
  if (!fs.existsSync(questionsPath)) {
    console.error("Strings.json not found at:", questionsPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(questionsPath, "utf8");
  if (!raw.trim()) {
    console.log("Strings.json is empty. Nothing to append.");
    return [];
  }
  let data = null;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse Strings.json:", e.message);
    process.exit(1);
  }
  if (!Array.isArray(data)) {
    console.error("Strings.json must be a JSON array");
    process.exit(1);
  }
  return data;
}

async function main() {
  const questions = loadQuestions();
  if (questions.length === 0) {
    console.log("No questions to insert.");
    return;
  }

  // Do NOT delete existing data. Append only.
  const batchSize = 100;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    await prisma.question.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(
      `Appended batch ${Math.floor(i / batchSize) + 1} - questions ${i + 1} to ${Math.min(
        i + batchSize,
        questions.length
      )}`
    );
  }

  console.log("Appending Strings questions complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


