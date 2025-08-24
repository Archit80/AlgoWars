import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the questions file
const questionsFilePath = path.join(__dirname, '..', 'db', 'leetcode_mcq_questions.json');

async function filterQuestions() {
    try {
        console.log('🔍 Reading questions file...');
        
        // Read the current questions
        const questionsData = fs.readFileSync(questionsFilePath, 'utf8');
        const questions = JSON.parse(questionsData);
        
        console.log(`📊 Total questions before filtering: ${questions.length}`);
        
        // Filter out questions that have unwanted categories
        // Also rename 'Backtracking' to 'Recursion' in categories
        const filteredQuestions = questions
            .map(question => {
                // Rename 'Backtracking' to 'Recursion' in categories
                if (Array.isArray(question.categories)) {
                    question.categories = question.categories.map(category =>
                        category === 'Backtracking' ? 'Recursion' : category
                    );
                }
                return question;
            })
            .filter(question => {
                const categories = question.categories || [];
                // Check if any category contains the unwanted categories
                const hasDataStructures = categories.some(category => 
                    category === 'DataStructures' || category.toLowerCase().includes('datastructures')
                );
                const hasAlgorithms = categories.some(category => 
                    category === 'Algorithms' || category.toLowerCase().includes('algorithms')
                );
                const hasBitManipulation = categories.some(category => 
                    category === 'BitManipulation' || category.toLowerCase().includes('bitmanipulation')
                );
                const hasGreedy = categories.some(category => 
                    category === 'Greedy' || category.toLowerCase().includes('greedy')
                );
                const hasNumberTheory = categories.some(category => 
                    category === 'NumberTheory' || category.toLowerCase().includes('numbertheory')
                );
                const hasGeometry = categories.some(category => 
                    category === 'Geometry' || category.toLowerCase().includes('geometry')
                );
                const hasDistributedSystems = categories.some(category => 
                    category === 'DistributedSystems' || category.toLowerCase().includes('distributedsystems')
                );
                const hasConcurrency = categories.some(category => 
                    category === 'Concurrency' || category.toLowerCase().includes('concurrency')
                );
                // Return true to keep the question (i.e., if it doesn't have these categories)
                return !hasDataStructures && !hasAlgorithms && !hasBitManipulation && !hasGreedy && !hasNumberTheory && !hasGeometry && !hasDistributedSystems && !hasConcurrency;
            });
        
        console.log(`📊 Total questions after filtering: ${filteredQuestions.length}`);
        console.log(`🗑️ Questions removed: ${questions.length - filteredQuestions.length}`);
        
        // Count categories being removed for confirmation
        const removedQuestions = questions.filter(question => {
            const categories = question.categories || [];
            const hasDataStructures = categories.some(category => 
                category === 'DataStructures' || category.toLowerCase().includes('datastructures')
            );
            const hasAlgorithms = categories.some(category => 
                category === 'Algorithms' || category.toLowerCase().includes('algorithms')
            );
            return hasDataStructures || hasAlgorithms;
        });
        
        console.log('\n📋 Categories of removed questions:');
        const categoryCount = {};
        removedQuestions.forEach(question => {
            question.categories.forEach(category => {
                categoryCount[category] = (categoryCount[category] || 0) + 1;
            });
        });
        
        Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .forEach(([category, count]) => {
                console.log(`  ${category}: ${count}`);
            });
        
        // Create backup before overwriting
        const backupPath = questionsFilePath.replace('.json', '_backup.json');
        fs.writeFileSync(backupPath, questionsData);
        console.log(`\n💾 Backup created: ${backupPath}`);
        
        // Write filtered questions back to file
        fs.writeFileSync(questionsFilePath, JSON.stringify(filteredQuestions, null, 2));
        
        console.log('\n✅ Successfully filtered questions!');
        console.log(`📁 Updated file: ${questionsFilePath}`);
        
        // Show remaining categories
        console.log('\n📊 Remaining categories:');
        const remainingCategoryCount = {};
        filteredQuestions.forEach(question => {
            question.categories.forEach(category => {
                remainingCategoryCount[category] = (remainingCategoryCount[category] || 0) + 1;
            });
        });
        
        Object.entries(remainingCategoryCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30) // Show top 30 categories
            .forEach(([category, count]) => {
                console.log(`  ${category}: ${count}`);
            });
        
    } catch (error) {
        console.error('❌ Error filtering questions:', error);
    }
}

// Run the filtering
filterQuestions();
