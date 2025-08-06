import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function insertQuestions() {
  try {
    console.log('Loading questions from JSON file...');
    
    // Read the questions from the JSON file
    const questionsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src', 'db', 'leetcode_mcq_questions.json'), 'utf8')
    );
    
    console.log(`Found ${questionsData.length} questions to insert.`);
    
    // Validate data structure
    if (!Array.isArray(questionsData)) {
      throw new Error('Questions data should be an array');
    }
    
    // Process questions in batches to avoid overwhelming the database
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < questionsData.length; i += batchSize) {
      const batch = questionsData.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questionsData.length / batchSize)}...`);
      
      try {
        const result = await prisma.question.createMany({
          data: batch.map(q => ({
            text: q.text,
            type: q.type,
            categories: q.categories,
            options: q.options,
            answer: q.answer,
            difficulty: q.difficulty
          })),
          skipDuplicates: true // Skip if duplicate entries exist
        });
        
        inserted += result.count;
        console.log(`Batch completed. ${result.count} questions inserted.`);
        
      } catch (batchError) {
        console.error(`Error in batch ${Math.floor(i / batchSize) + 1}:`, batchError.message);
        // Continue with next batch
      }
    }
    
    console.log(`\n✅ Insertion completed! Total questions inserted: ${inserted}`);
    
    // Verify insertion
    const totalQuestions = await prisma.question.count();
    console.log(`📊 Total questions in database: ${totalQuestions}`);
    
    // Show distribution by difficulty
    const difficultyStats = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: {
        difficulty: true
      }
    });
    
    console.log('\n📈 Questions by difficulty:');
    difficultyStats.forEach(stat => {
      console.log(`  ${stat.difficulty}: ${stat._count.difficulty}`);
    });
    
    // Show distribution by type
    const typeStats = await prisma.question.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });
    
    console.log('\n📊 Questions by type:');
    typeStats.forEach(stat => {
      console.log(`  ${stat.type}: ${stat._count.type}`);
    });
    
  } catch (error) {
    console.error('❌ Error inserting questions:', error);
    
    // Provide more detailed error information
    if (error.code === 'P2002') {
      console.error('Unique constraint violation - some questions may already exist');
    } else if (error.code === 'P2025') {
      console.error('Record not found');
    } else if (error.name === 'PrismaClientValidationError') {
      console.error('Validation error - check data format');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the insertion
insertQuestions();
