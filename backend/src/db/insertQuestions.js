import prisma from './prismaClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function insertQuestionsToDatabase() {
  try {
    console.log('🚀 Starting database insertion process...\n');

    // Read the questions from JSON file
    const questionsPath = path.join(__dirname, 'leetcode_mcq_questions.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

    console.log(`📊 Found ${questionsData.length} questions to insert`);

    // Check if questions already exist to avoid duplicates
    const existingQuestions = await prisma.question.count();
    console.log(`🗄️ Database currently has ${existingQuestions} questions`);

    if (existingQuestions > 0) {
      console.log('⚠️ Database already contains questions. Do you want to:');
      console.log('1. Clear existing questions and insert new ones');
      console.log('2. Add new questions alongside existing ones');
      console.log('3. Cancel operation');
      
      // For now, let's clear and insert fresh (you can modify this behavior)
      console.log('🔄 Clearing existing questions and inserting fresh data...');
      
      await prisma.question.deleteMany({});
      console.log('✅ Cleared existing questions');
    }

    // Insert questions in batches to avoid overwhelming the database
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < questionsData.length; i += batchSize) {
      batches.push(questionsData.slice(i, i + batchSize));
    }

    console.log(`📦 Processing ${batches.length} batches of ${batchSize} questions each`);

    let insertedCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📝 Processing batch ${i + 1}/${batches.length}...`);

      try {
        const insertPromises = batch.map(question => {
          // Validate question data before insertion
          if (!question.text || !question.type || !question.categories || 
              !question.options || !question.answer || !question.difficulty) {
            throw new Error(`Invalid question data: ${JSON.stringify(question, null, 2)}`);
          }

          // Ensure type and difficulty match enum values
          const validTypes = ['MCQ', 'FILL_BLANK', 'PREDICT_OUTPUT'];
          const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];

          if (!validTypes.includes(question.type)) {
            throw new Error(`Invalid question type: ${question.type}. Must be one of: ${validTypes.join(', ')}`);
          }

          if (!validDifficulties.includes(question.difficulty)) {
            throw new Error(`Invalid difficulty: ${question.difficulty}. Must be one of: ${validDifficulties.join(', ')}`);
          }

          return prisma.question.create({
            data: {
              text: question.text,
              type: question.type,
              categories: question.categories,
              options: question.options,
              answer: question.answer,
              difficulty: question.difficulty
            }
          });
        });

        await Promise.all(insertPromises);
        insertedCount += batch.length;
        console.log(`✅ Batch ${i + 1} completed. Total inserted: ${insertedCount}`);

      } catch (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error.message);
        // Continue with next batch instead of stopping completely
        continue;
      }
    }

    console.log(`\n🎉 Database insertion completed!`);
    console.log(`📊 Successfully inserted ${insertedCount} questions`);

    // Verify the insertion
    const finalCount = await prisma.question.count();
    console.log(`🗄️ Database now contains ${finalCount} questions total`);

    // Show some statistics
    const typeStats = await prisma.question.groupBy({
      by: ['type'],
      _count: { type: true }
    });

    const difficultyStats = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: { difficulty: true }
    });

    console.log('\n📊 DATABASE STATISTICS:');
    console.log('Question Types:');
    typeStats.forEach(stat => {
      console.log(`  ${stat.type}: ${stat._count.type} questions`);
    });

    console.log('Difficulty Distribution:');
    difficultyStats.forEach(stat => {
      console.log(`  ${stat.difficulty}: ${stat._count.difficulty} questions`);
    });

    // Sample a few questions to verify data integrity
    console.log('\n🔍 SAMPLE QUESTIONS:');
    const sampleQuestions = await prisma.question.findMany({
      take: 3,
      select: {
        id: true,
        text: true,
        type: true,
        difficulty: true,
        categories: true
      }
    });

    sampleQuestions.forEach((q, index) => {
      console.log(`\n${index + 1}. ${q.type} - ${q.difficulty}`);
      console.log(`   Categories: ${q.categories.join(', ')}`);
      console.log(`   Text: ${q.text.substring(0, 100)}...`);
    });

    console.log('\n✅ Questions successfully pushed to database!');
  console.log('🚀 Your AlgoWars platform is ready with comprehensive DSA questions!');

  } catch (error) {
    console.error('💥 Database insertion failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the insertion
insertQuestionsToDatabase()
  .then(() => {
    console.log('\n🎯 Database operation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database operation failed:', error);
    process.exit(1);
  });
