// insert-gemini-questions.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../db/prismaClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function insertGeminiQuestions() {
  try {
    console.log('🚀 Starting database insertion of Gemini-generated questions...\n');

    // Load the generated questions
    const questionsPath = path.join(__dirname, '../db/codeclash-questions-gemini.json');
    
    if (!fs.existsSync(questionsPath)) {
      console.error('❌ codeclash-questions-gemini.json not found!');
      console.log('💡 Run the question generation script first:');
      console.log('   node src/scripts/generate-questions-gemini.js');
      process.exit(1);
    }

    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    console.log(`📊 Found ${questionsData.length} questions to insert`);

    // Check existing questions count
    const existingCount = await prisma.question.count();
    console.log(`🗄️ Database currently has ${existingCount} questions`);

    // Validate questions before insertion
    console.log('🔍 Validating question structure...');
    
    const validQuestions = [];
    const validTypes = ['MCQ', 'FILL_BLANK', 'PREDICT_OUTPUT'];
    const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
    
    for (let i = 0; i < questionsData.length; i++) {
      const question = questionsData[i];
      
      // Validate required fields
      if (!question.text || !question.type || !question.categories || 
          !question.options || !question.answer || !question.difficulty) {
        console.warn(`⚠️ Skipping invalid question ${i + 1}: Missing required fields`);
        continue;
      }
      
      // Validate type
      if (!validTypes.includes(question.type)) {
        console.warn(`⚠️ Skipping question ${i + 1}: Invalid type '${question.type}'`);
        continue;
      }
      
      // Validate difficulty
      if (!validDifficulties.includes(question.difficulty)) {
        console.warn(`⚠️ Skipping question ${i + 1}: Invalid difficulty '${question.difficulty}'`);
        continue;
      }
      
      // Validate options array
      if (!Array.isArray(question.options) || question.options.length < 2) {
        console.warn(`⚠️ Skipping question ${i + 1}: Invalid options array`);
        continue;
      }
      
      // Validate categories array
      if (!Array.isArray(question.categories) || question.categories.length === 0) {
        console.warn(`⚠️ Skipping question ${i + 1}: Invalid categories array`);
        continue;
      }
      
      validQuestions.push(question);
    }
    
    console.log(`✅ ${validQuestions.length} questions passed validation`);
    
    if (validQuestions.length === 0) {
      console.log('❌ No valid questions to insert');
      process.exit(1);
    }

    // Insert questions in batches
    const batchSize = 25;
    const batches = [];
    
    for (let i = 0; i < validQuestions.length; i += batchSize) {
      batches.push(validQuestions.slice(i, i + batchSize));
    }

    console.log(`📦 Processing ${batches.length} batches of ${batchSize} questions each\n`);

    let insertedCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📝 Processing batch ${i + 1}/${batches.length}...`);

      try {
        const insertPromises = batch.map(question => {
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
        console.log(`✅ Batch ${i + 1} completed. ${batch.length} questions inserted.`);

      } catch (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error.message);
        
        // Try inserting individually to identify problematic questions
        console.log('🔄 Trying individual insertion for this batch...');
        for (const question of batch) {
          try {
            await prisma.question.create({
              data: {
                text: question.text,
                type: question.type,
                categories: question.categories,
                options: question.options,
                answer: question.answer,
                difficulty: question.difficulty
              }
            });
            insertedCount++;
          } catch (individualError) {
            console.error(`❌ Failed to insert question: ${question.text.substring(0, 50)}...`);
          }
        }
      }
    }

    console.log(`\n🎉 Database insertion completed!`);
    console.log(`📊 Successfully inserted ${insertedCount} questions`);

    // Verify the insertion
    const finalCount = await prisma.question.count();
    console.log(`🗄️ Database now contains ${finalCount} questions total`);

    // Show updated statistics
    const typeStats = await prisma.question.groupBy({
      by: ['type'],
      _count: { type: true }
    });

    const difficultyStats = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: { difficulty: true }
    });

    console.log('\n📊 UPDATED DATABASE STATISTICS:');
    console.log('Question Types:');
    typeStats.forEach(stat => {
      console.log(`  ${stat.type}: ${stat._count.type} questions`);
    });

    console.log('Difficulty Distribution:');
    difficultyStats.forEach(stat => {
      console.log(`  ${stat.difficulty}: ${stat._count.difficulty} questions`);
    });

    // Sample a few new questions
    console.log('\n🔍 SAMPLE NEW QUESTIONS:');
    const sampleQuestions = await prisma.question.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
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
      console.log(`   Text: ${q.text.substring(0, 80)}...`);
    });

    console.log('\n✅ Questions successfully integrated into CodeClash database!');
    console.log('🚀 Your platform now has enhanced question variety powered by Gemini AI!');

  } catch (error) {
    console.error('💥 Database insertion failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the insertion
insertGeminiQuestions()
  .then(() => {
    console.log('\n🎯 Database operation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database operation failed:', error);
    process.exit(1);
  });
