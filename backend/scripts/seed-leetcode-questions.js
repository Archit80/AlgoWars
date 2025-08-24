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
  for (const q of questions) {
    if (q.id) {
      await prisma.question.upsert({
        where: { id: q.id },
        update: q,
        create: q,
      });
      console.log(`Upserted question: ${q.id}`);
    } else {
      await prisma.question.create({ data: q });
      console.log(`Created question (no id): ${q.difficulty}`);
    }
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
