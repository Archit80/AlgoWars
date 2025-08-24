// generate-questions-gemini.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from '../db/prismaClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Enhanced LeetCode tag to CodeClash category mapping
const tagMapping = {
  // Arrays & Data Structures
  "array": "Arrays",
  "two-pointers": "Arrays", 
  "sliding-window": "Arrays",
  "prefix-sum": "Arrays",
  "matrix": "Arrays",
  
  // Strings
  "string": "Strings",
  "string-matching": "Strings",
  "palindrome": "Strings",
  
  // Hash Tables
  "hash-table": "HashMaps",
  "hash-map": "HashMaps",
  "counting": "HashMaps",
  
  // Trees & Graphs
  "tree": "Trees",
  "binary-tree": "Trees",
  "binary-search-tree": "Trees",
  "graph": "Graphs",
  "depth-first-search": "Graphs",
  "breadth-first-search": "Graphs",
  "topological-sort": "Graphs",
  "union-find": "Graphs",
  
  // Dynamic Programming
  "dynamic-programming": "DynamicProgramming",
  "memoization": "DynamicProgramming",
  
  // Other algorithms
  "sorting": "Sorting",
  "searching": "Searching",
  "binary-search": "Searching",

  "recursion": "Recursion",
  
  // Data Structures
  "linked-list": "LinkedLists",
  "stack": "Stacks", 
  "queue": "Queues",
  "trie": "Trees",
  
  
};

// Map LeetCode tags to CodeClash categories
function mapTagsToCategories(leetcodeTags) {
  const categories = new Set();
  
  for (const tag of leetcodeTags) {
    const normalizedTag = tag.toLowerCase().replace(/[^a-z-]/g, '');
    const mappedCategory = tagMapping[normalizedTag];
    
    if (mappedCategory) {
      categories.add(mappedCategory);
    }
  }
  
  // Default fallback if no mapping found
  if (categories.size === 0) {
    categories.add("General");
  }
  
  return Array.from(categories);
}

// Load your LeetCode dataset - assuming it's in a similar format to your existing data
async function loadLeetCodeData() {
  try {
    // Check if leetcode.txt exists and has structured data
    const leetcodePath = path.join(__dirname, '../db/leetcode.txt');
    
    if (fs.existsSync(leetcodePath)) {
      console.log('📄 Found leetcode.txt file');
      const content = fs.readFileSync(leetcodePath, 'utf8');
      
      // Try to parse as JSON first
      try {
        return JSON.parse(content);
      } catch {
        // If not JSON, we'll need to parse the text format
        console.log('📝 Parsing leetcode.txt as text format...');
        return parseTextFormat(content);
      }
    } else {
      console.log('❌ leetcode.txt not found. Please provide LeetCode problems data.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error loading LeetCode data:', error);
    process.exit(1);
  }
}

// Parse text format if the file isn't JSON
function parseTextFormat(content) {
  // This is a placeholder - you'll need to adjust based on your actual file format
  const lines = content.split('\n').filter(line => line.trim());
  const problems = [];
  
  // Basic parsing logic - adjust according to your file structure
  for (let i = 0; i < lines.length; i += 4) { // Assuming 4 lines per problem
    if (i + 3 < lines.length) {
      problems.push({
        title: lines[i]?.replace(/^\d+\.\s*/, '') || `Problem ${i/4 + 1}`,
        difficulty: lines[i + 1] || 'Medium',
        tags: (lines[i + 2] || 'array').split(',').map(tag => tag.trim()),
        description: lines[i + 3] || 'Problem description'
      });
    }
  }
  
  return problems;
}

// Output array for all generated questions
const allQuestions = [];

async function processProblem(problem, index) {
  const categories = mapTagsToCategories(problem.tags || []);
  
  const prompt = `
You are an AI tutor creating quiz questions for CodeClash, a competitive programming platform.

Transform this LeetCode problem into exactly 3 quiz questions:

**Problem Details:**
Title: ${problem.title}
Difficulty: ${problem.difficulty}
Tags: ${problem.tags?.join(", ") || "programming"}
Description: ${problem.description || problem.title}

**Requirements:**
1. Generate exactly 3 questions with these types:
   - 1 MCQ (Multiple Choice Question)
   - 1 PREDICT_OUTPUT (code execution prediction)  
   - 1 FILL_BLANK (complete the code/concept)

2. **CRITICAL: Return ONLY valid JSON array, no extra text before or after:**

[
  {
    "text": "Question text with code blocks using \\n\\n\`\`\`\\n...code...\\n\`\`\`",
    "type": "MCQ",
    "categories": ${JSON.stringify(categories)},
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Exact match of one option above",
    "difficulty": "${problem.difficulty?.toUpperCase() || 'MEDIUM'}"
  },
  {
    "text": "Code execution question with example input/output",
    "type": "PREDICT_OUTPUT", 
    "categories": ${JSON.stringify(categories)},
    "options": ["Result A", "Result B", "Result C", "Result D"],
    "answer": "Exact match of one option above",
    "difficulty": "${problem.difficulty?.toUpperCase() || 'MEDIUM'}"
  },
  {
    "text": "Complete the missing code using ___ for blanks",
    "type": "FILL_BLANK",
    "categories": ${JSON.stringify(categories)},
    "options": ["Code A", "Code B", "Code C", "Code D"], 
    "answer": "Exact match of one option above",
    "difficulty": "${problem.difficulty?.toUpperCase() || 'MEDIUM'}"
  }
]

3. **Content Rules:**
   - Use \\n for newlines in code blocks
   - For FILL_BLANK, use exactly "_______________" for missing parts
   - Make questions educational and test understanding
   - Keep options concise and clearly different
   - Answer must exactly match one of the 4 options

RETURN ONLY THE JSON ARRAY - NO EXTRA TEXT OR EXPLANATIONS.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // More aggressive cleaning for Gemini responses
    let cleanText = text;
    
    // Remove markdown code blocks
    cleanText = cleanText.replace(/```json\s*/gi, '');
    cleanText = cleanText.replace(/```\s*/g, '');
    
    // Find the JSON array bounds more precisely
    const startIndex = cleanText.indexOf('[');
    const lastIndex = cleanText.lastIndexOf(']');
    
    if (startIndex === -1 || lastIndex === -1 || startIndex >= lastIndex) {
      throw new Error('No valid JSON array found in response');
    }
    
    cleanText = cleanText.substring(startIndex, lastIndex + 1);
    
    // Remove any trailing commas before closing brackets
    cleanText = cleanText.replace(/,(\s*[\]}])/g, '$1');
    
    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON Parse Error for:', problem.title);
      console.error('Clean text:', cleanText.substring(0, 200) + '...');
      throw new Error(`JSON parsing failed: ${parseError.message}`);
    }
    
    // Validate the structure
    if (!Array.isArray(parsed) || parsed.length !== 3) {
      throw new Error(`Expected array of 3 questions, got ${parsed.length}`);
    }
    
    // Validate each question
    for (const q of parsed) {
      if (!q.type || !q.text || !q.options || !q.answer || !q.categories || !q.difficulty) {
        throw new Error(`Invalid question structure: ${JSON.stringify(q)}`);
      }
      
      // Ensure valid types and difficulty
      if (!['MCQ', 'PREDICT_OUTPUT', 'FILL_BLANK'].includes(q.type)) {
        q.type = 'MCQ'; // Default fallback
      }
      
      if (!['EASY', 'MEDIUM', 'HARD'].includes(q.difficulty)) {
        q.difficulty = 'MEDIUM'; // Default fallback
      }
    }

    allQuestions.push(...parsed);
    console.log(`✅ Processed #${index + 1}: ${problem.title} -> ${parsed.length} questions`);
    
  } catch (err) {
    console.error(`❌ Failed at #${index + 1}: ${problem.title}`, err.message);
    if (typeof text !== 'undefined') {
      console.error('Raw response excerpt:', text.substring(0, 200) + '...');
    }
  }
}

async function main() {
  console.log('🚀 Starting Gemini question generation...\n');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('💡 Add your Gemini API key to .env file:');
    console.log('   GEMINI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  const leetcodeData = await loadLeetCodeData();
  console.log(`📊 Loaded ${leetcodeData.length} LeetCode problems\n`);

  // Process problems with rate limiting
  for (let i = 0; i < leetcodeData.length; i++) {
    await processProblem(leetcodeData[i], i);
    
    // Rate limiting for Gemini API (adjust as needed)
    if (i < leetcodeData.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Progress update every 10 problems
    if ((i + 1) % 10 === 0) {
      console.log(`🔄 Progress: ${i + 1}/${leetcodeData.length} problems processed`);
    }
  }

  // Save generated questions
  const outputPath = path.join(__dirname, '../db/codeclash-questions-gemini.json');
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));
  
  console.log(`\n🎉 Generation Complete!`);
  console.log(`📊 Generated ${allQuestions.length} total questions`);
  console.log(`💾 Saved to: ${outputPath}`);
  
  // Show statistics
  const typeDistribution = {};
  const difficultyDistribution = {};
  const categoryDistribution = {};
  
  allQuestions.forEach(q => {
    typeDistribution[q.type] = (typeDistribution[q.type] || 0) + 1;
    difficultyDistribution[q.difficulty] = (difficultyDistribution[q.difficulty] || 0) + 1;
    q.categories.forEach(cat => {
      categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
    });
  });
  
  console.log('\n📈 Distribution:');
  console.log('Types:', typeDistribution);
  console.log('Difficulty:', difficultyDistribution);
  console.log('Top Categories:', Object.entries(categoryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat, count]) => `${cat}(${count})`)
    .join(', '));
    
  // Optionally insert into database
  console.log('\n🤔 Do you want to insert these questions into the database?');
  console.log('Run: node src/scripts/insert-gemini-questions.js');
}

main().catch(console.error);
