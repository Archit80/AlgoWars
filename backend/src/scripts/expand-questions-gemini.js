// expand-questions-gemini.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Algorithm topics to generate questions for
const algorithmTopics = [
  // Sorting Algorithms
  {
    name: "Bubble Sort",
    category: "Sorting",
    difficulty: "EASY",
    description: "Bubble sort algorithm with adjacent element swapping"
  },
  {
    name: "Merge Sort",
    category: "Sorting", 
    difficulty: "MEDIUM",
    description: "Divide and conquer sorting algorithm"
  },
  {
    name: "Quick Sort",
    category: "Sorting",
    difficulty: "MEDIUM", 
    description: "Partition-based sorting algorithm"
  },
  {
    name: "Heap Sort",
    category: "Sorting",
    difficulty: "HARD",
    description: "Heap-based sorting algorithm"
  },
  
  // Array Algorithms
  {
    name: "Binary Search",
    category: "Arrays",
    difficulty: "EASY",
    description: "Search algorithm for sorted arrays"
  },
  {
    name: "Two Pointers",
    category: "Arrays", 
    difficulty: "MEDIUM",
    description: "Two pointer technique for array problems"
  },
  {
    name: "Sliding Window",
    category: "Arrays",
    difficulty: "MEDIUM",
    description: "Sliding window technique for subarray problems"
  },
  {
    name: "Kadane's Algorithm",
    category: "Arrays",
    difficulty: "MEDIUM",
    description: "Maximum subarray sum algorithm"
  },
  {
    name: "Palindrome Check",
    category: "Strings",
    difficulty: "EASY",
    description: "Algorithm to check if string is palindrome"
  },
  
  // Tree Algorithms
  {
    name: "Binary Tree Traversal",
    category: "Trees",
    difficulty: "EASY",
    description: "Inorder, preorder, postorder traversals"
  },
  {
    name: "Binary Search Tree Operations",
    category: "Trees",
    difficulty: "MEDIUM",
    description: "Insert, delete, search in BST"
  },
  {
    name: "AVL Tree Rotations",
    category: "Trees",
    difficulty: "HARD",
    description: "Self-balancing tree rotations"
  },
  {
    name: "Trie Operations",
    category: "Trees",
    difficulty: "MEDIUM",
    description: "Prefix tree insertion and search"
  },
  
  // Graph Algorithms
  {
    name: "DFS Traversal",
    category: "Graphs",
    difficulty: "MEDIUM",
    description: "Depth-first search algorithm"
  },
  {
    name: "BFS Traversal", 
    category: "Graphs",
    difficulty: "MEDIUM",
    description: "Breadth-first search algorithm"
  },
  {
    name: "Dijkstra's Algorithm",
    category: "Graphs",
    difficulty: "HARD",
    description: "Shortest path algorithm"
  },
  {
    name: "Floyd-Warshall",
    category: "Graphs",
    difficulty: "HARD",
    description: "All pairs shortest path algorithm"
  },
  
  // Dynamic Programming
  {
    name: "Fibonacci DP",
    category: "DynamicProgramming",
    difficulty: "EASY",
    description: "Dynamic programming for Fibonacci sequence"
  },
  {
    name: "Longest Common Subsequence",
    category: "DynamicProgramming",
    difficulty: "MEDIUM",
    description: "LCS using dynamic programming"
  },
  {
    name: "0/1 Knapsack",
    category: "DynamicProgramming",
    difficulty: "MEDIUM",
    description: "Knapsack problem using DP"
  },
  {
    name: "Edit Distance",
    category: "DynamicProgramming",
    difficulty: "HARD",
    description: "Minimum edit distance algorithm"
  },
  
  // Hash Maps
  {
    name: "Hash Table Operations",
    category: "HashMaps",
    difficulty: "EASY",
    description: "Basic hash table insert, search, delete"
  },
  {
    name: "Collision Resolution",
    category: "HashMaps",
    difficulty: "MEDIUM",
    description: "Chaining and open addressing"
  },
  
  // Linked Lists
  {
    name: "Linked List Reversal",
    category: "LinkedLists",
    difficulty: "MEDIUM",
    description: "Algorithm to reverse a linked list"
  },
  {
    name: "Cycle Detection",
    category: "LinkedLists",
    difficulty: "MEDIUM",
    description: "Floyd's cycle detection algorithm"
  },
  {
    name: "Merge Two Sorted Lists",
    category: "LinkedLists",
    difficulty: "EASY",
    description: "Algorithm to merge two sorted linked lists"
  },
  {
    name: "Remove Nth Node",
    category: "LinkedLists",
    difficulty: "MEDIUM",
    description: "Remove nth node from end of linked list"
  },
  
  // Stack and Queue Algorithms
  {
    name: "Stack Operations",
    category: "Stacks",
    difficulty: "EASY",
    description: "Basic stack push, pop, peek operations"
  },
  {
    name: "Valid Parentheses",
    category: "Stacks",
    difficulty: "EASY",
    description: "Check balanced parentheses using stack"
  },
  {
    name: "Evaluate Postfix Expression",
    category: "Stacks",
    difficulty: "MEDIUM",
    description: "Evaluate postfix notation using stack"
  },
  {
    name: "Queue using Stacks",
    category: "Queues",
    difficulty: "MEDIUM",
    description: "Implement queue using two stacks"
  },
  {
    name: "Circular Queue",
    category: "Queues",
    difficulty: "MEDIUM",
    description: "Circular queue implementation and operations"
  },
  
  // String Processing
  {
    name: "String Reversal",
    category: "Strings",
    difficulty: "EASY",
    description: "Algorithm to reverse a string"
  },
  {
    name: "Anagram Detection",
    category: "Strings",
    difficulty: "EASY",
    description: "Check if two strings are anagrams"
  },
  {
    name: "Longest Palindromic Substring",
    category: "Strings",
    difficulty: "MEDIUM",
    description: "Find longest palindromic substring"
  },
  {
    name: "String Compression",
    category: "Strings",
    difficulty: "MEDIUM",
    description: "Compress string by counting characters"
  },
  
  // Stack and Queue Algorithms
  {
    name: "Stack Operations",
    category: "Stacks",
    difficulty: "EASY",
    description: "Basic stack push, pop, peek operations"
  },
  {
    name: "Valid Parentheses",
    category: "Stacks",
    difficulty: "EASY",
    description: "Check balanced parentheses using stack"
  },
  {
    name: "Evaluate Postfix Expression",
    category: "Stacks",
    difficulty: "MEDIUM",
    description: "Evaluate postfix notation using stack"
  },
  {
    name: "Queue using Stacks",
    category: "Queues",
    difficulty: "MEDIUM",
    description: "Implement queue using two stacks"
  },
  {
    name: "Circular Queue",
    category: "Queues",
    difficulty: "MEDIUM",
    description: "Circular queue implementation and operations"
  },
  
  // Advanced Graph Algorithms
  {
    name: "Topological Sort",
    category: "Graphs",
    difficulty: "MEDIUM",
    description: "Topological ordering of directed acyclic graph"
  },
  {
    name: "Bellman-Ford Algorithm",
    category: "Graphs",
    difficulty: "HARD",
    description: "Single source shortest path with negative weights"
  },
  {
    name: "Kruskal's MST",
    category: "Graphs",
    difficulty: "HARD",
    description: "Minimum spanning tree using union-find"
  },
  {
    name: "Tarjan's SCC",
    category: "Graphs",
    difficulty: "HARD",
    description: "Strongly connected components algorithm"
  },
  {
    name: "Graph Coloring",
    category: "Graphs",
    difficulty: "HARD",
    description: "Color graph vertices with minimum colors"
  },
  
  // Advanced Dynamic Programming
  {
    name: "Coin Change Problem",
    category: "DynamicProgramming",
    difficulty: "MEDIUM",
    description: "Minimum coins to make amount using DP"
  },
  {
    name: "House Robber",
    category: "DynamicProgramming",
    difficulty: "MEDIUM",
    description: "Maximum money robbed without adjacent houses"
  },
  {
    name: "Longest Increasing Subsequence",
    category: "DynamicProgramming",
    difficulty: "MEDIUM",
    description: "Find longest increasing subsequence"
  },
  {
    name: "Matrix Chain Multiplication",
    category: "DynamicProgramming",
    difficulty: "HARD",
    description: "Optimal matrix multiplication order"
  },
  {
    name: "Palindromic Subsequences",
    category: "DynamicProgramming",
    difficulty: "HARD",
    description: "Count palindromic subsequences using DP"
  },
  
  // Two Pointer Techniques
  {
    name: "Two Sum Sorted Array",
    category: "TwoPointers",
    difficulty: "EASY",
    description: "Find two numbers that sum to target in sorted array"
  },
  {
    name: "Three Sum Problem",
    category: "TwoPointers",
    difficulty: "MEDIUM",
    description: "Find three numbers that sum to zero"
  },
  {
    name: "Remove Duplicates from Sorted Array",
    category: "TwoPointers",
    difficulty: "EASY",
    description: "Remove duplicates from sorted array in-place"
  },
  {
    name: "Container With Most Water",
    category: "TwoPointers",
    difficulty: "MEDIUM",
    description: "Find container with most water using two pointers"
  },
  {
    name: "Trapping Rain Water",
    category: "TwoPointers",
    difficulty: "HARD",
    description: "Calculate trapped rainwater using two pointers"
  },

  // Recursion
  {
    name: "Factorial Calculation",
    category: "Recursion",
    difficulty: "EASY",
    description: "Calculate factorial using recursion"
  },
  {
    name: "Tower of Hanoi",
    category: "Recursion",
    difficulty: "MEDIUM",
    description: "Solve Tower of Hanoi puzzle using recursion"
  },
  {
    name: "Generate all Subsets",
    category: "Recursion",
    difficulty: "MEDIUM",
    description: "Generate all subsets of a set using recursion"
  },
  {
    name: "Recursive String Reversal",
    category: "Recursion",
    difficulty: "EASY",
    description: "Reverse a string using a recursive function"
  },
  {
    name: "Recursive Palindrome Check",
    category: "Recursion",
    difficulty: "EASY",
    description: "Check if a string is a palindrome using recursion"
  }
];

// Output array for all generated questions
const allQuestions = [];

async function generateQuestionsForTopic(topic, questionCount = 3) {
  const prompt = `
You are an AI tutor creating quiz questions for CodeClash, a competitive programming platform.

Create exactly ${questionCount} quiz questions about: **${topic.name}**

**Topic Details:**
- Algorithm: ${topic.name}
- Category: ${topic.category}
- Difficulty: ${topic.difficulty}
- Description: ${topic.description}

**CRITICAL REQUIREMENTS:**

1. **Use PSEUDO-ALGORITHM LANGUAGE ONLY** - No specific programming languages (Java, Python, C++, etc.)
   - Use: ARRAY, LENGTH, WHILE, FOR, IF, FUNCTION, etc.
   - Use: i = 0 to n-1, not for(int i=0; i<n; i++)
   - Use: SWAP(a, b), not temp=a; a=b; b=temp;

2. **Question Types Distribution:**
   - 1 MCQ (Multiple Choice Question)
   - 1 PREDICT_OUTPUT (trace algorithm execution)
   - 1 FILL_BLANK (complete missing code/logic)

3. **Return ONLY valid JSON array, no extra text:**

[
  {
    "text": "Question with algorithm in pseudo-code using \\n\\n\`\`\`\\n...code...\\n\`\`\`",
    "type": "MCQ",
    "categories": ["${topic.category}"],
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Exact match of one option above",
    "difficulty": "${topic.difficulty}"
  },
  {
    "text": "Trace execution question with specific input/array",
    "type": "PREDICT_OUTPUT",
    "categories": ["${topic.category}"],
    "options": ["Result A", "Result B", "Result C", "Result D"],
    "answer": "Exact match of one option above", 
    "difficulty": "${topic.difficulty}"
  },
  {
    "text": "Complete missing logic using _______________ for blanks",
    "type": "FILL_BLANK",
    "categories": ["${topic.category}"],
    "options": ["Code A", "Code B", "Code C", "Code D"],
    "answer": "Exact match of one option above",
    "difficulty": "${topic.difficulty}"
  }
]

**Content Guidelines:**
- Use concrete examples with small arrays/data
- Focus on algorithm understanding, not language syntax
- Make execution traces step-by-step
- Use exactly "_______________" for fill-in-the-blank spaces
- Keep questions educational and test algorithmic thinking
- Answer must exactly match one of the 4 options

**Example Format:**
\`\`\`
ARRAY = [5, 2, 4, 6, 1, 3]

for i = 1 to LENGTH(ARRAY) - 1:
    key = ARRAY[i]
    j = i - 1
    
    while j ≥ 0 and ARRAY[j] > key:
        ARRAY[j + 1] = ARRAY[j]
        j = j - 1
    
    ARRAY[j + 1] = key
\`\`\`

RETURN ONLY THE JSON ARRAY - NO EXPLANATIONS OR EXTRA TEXT.
`;

  let attempt = 0;
  let maxAttempts = 7;
  let backoff = 2000;
  let lastError = null;
  let text;
  while (attempt < maxAttempts) {
    try {
      console.log(`🔄 Generating questions for: ${topic.name} (${topic.category}) [Attempt ${attempt + 1}]`);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      const result = await model.generateContent(prompt);
      text = result.response.text().trim();

      // Clean the response
      let cleanText = text;
      cleanText = cleanText.replace(/```json\s*/gi, '');
      cleanText = cleanText.replace(/```\s*/g, '');
      const startIndex = cleanText.indexOf('[');
      const lastIndex = cleanText.lastIndexOf(']');
      console.log("text", text);
      
      if (startIndex === -1 || lastIndex === -1 || startIndex >= lastIndex) {
        throw new Error('No valid JSON array found in response');
      }
      cleanText = cleanText.substring(startIndex, lastIndex + 1);
      cleanText = cleanText.replace(/,(\s*[\]}])/g, '$1');
      let parsed;
      try {
        parsed = JSON.parse(cleanText);
      } catch (parseError) {
        console.error('JSON Parse Error for:', topic.name);
        console.error('Clean text excerpt:', cleanText.substring(0, 300) + '...');
        throw new Error(`JSON parsing failed: ${parseError.message}`);
      }
      if (!Array.isArray(parsed) || parsed.length !== questionCount) {
        throw new Error(`Expected array of ${questionCount} questions, got ${parsed.length}`);
      }
      for (const q of parsed) {
        if (!q.type || !q.text || !q.options || !q.answer || !q.categories || !q.difficulty) {
          throw new Error(`Invalid question structure: ${JSON.stringify(q)}`);
        }
        if (!['MCQ', 'PREDICT_OUTPUT', 'FILL_BLANK'].includes(q.type)) {
          q.type = 'MCQ';
        }
        if (!['EASY', 'MEDIUM', 'HARD'].includes(q.difficulty)) {
          q.difficulty = topic.difficulty;
        }
        if (!Array.isArray(q.categories)) {
          q.categories = [topic.category];
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          console.warn(`Invalid options for question: ${q.text.substring(0, 50)}...`);
          continue;
        }
      }
      allQuestions.push(...parsed);
      console.log(`✅ Generated ${parsed.length} questions for ${topic.name}`);
      return;
    } catch (err) {
      lastError = err;
      // Check for Gemini API rate limit or quota errors
      let isRateLimit = false;
      let isQuotaExhausted = false;
      let retryDelay = backoff;
      if (err && err.message && err.message.includes('429')) {
        isRateLimit = true;
      }
      // Check for quota exhaustion in error message or Gemini API response
      if (typeof text === 'string' && text.includes('quota') && text.includes('exceeded')) {
        isQuotaExhausted = true;
      }
      if (err && err.message && err.message.includes('quota') && err.message.includes('exceeded')) {
        isQuotaExhausted = true;
      }
      if (isQuotaExhausted) {
        console.error(`🚫 Gemini API daily quota exhausted. Stopping further requests.`);
        throw new Error('Gemini API daily quota exhausted.');
      }
      if (isRateLimit) {
        // Exponential backoff
        retryDelay = Math.min(backoff * Math.pow(2, attempt), 60000);
        console.warn(`⏳ Gemini API rate limit hit. Retrying in ${Math.round(retryDelay / 1000)}s...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        attempt++;
        continue;
      }
      // Other errors: log and break
      console.log("text", text);
      console.error(`❌ Failed to generate questions for ${topic.name}:`, err.message);
      if (typeof text !== 'undefined') {
        console.error('Raw response excerpt:', text.substring(0, 500) + '...');
      }
      break;
    }
  }
  // If we reach here, all attempts failed
  console.error(`❌ All attempts failed for ${topic.name}. Last error:`, lastError ? lastError.message : 'Unknown error');
}

async function main() {
  console.log('🚀 Starting Gemini question expansion for leetcode_mcq_questions.json...\n');
  console.log("gemini api key:", process.env.GEMINI_API_KEY);
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('💡 Add your Gemini API key to .env file:');
    console.log('   GEMINI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  // Load existing questions
  const questionsFilePath = path.join(__dirname, '../db/leetcode_mcq_questions.json');
  let existingQuestions = [];
  
  try {
    if (fs.existsSync(questionsFilePath)) {
      const fileContent = fs.readFileSync(questionsFilePath, 'utf8');
      existingQuestions = JSON.parse(fileContent);
      console.log(`📊 Found ${existingQuestions.length} existing questions in leetcode_mcq_questions.json`);
    } else {
      console.log('📝 Creating new leetcode_mcq_questions.json file');
    }
  } catch (error) {
    console.error('❌ Error reading existing questions file:', error.message);
    process.exit(1);
  }

  console.log(`🎯 Generating questions for ${algorithmTopics.length} algorithm topics\n`);

  // Generate questions for each topic with rate limiting
  for (let i = 0; i < algorithmTopics.length; i++) {
    const topic = algorithmTopics[i];
    
    await generateQuestionsForTopic(topic, 3);
    
    // Rate limiting for Gemini API
    if (i < algorithmTopics.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Progress update every 5 topics
    if ((i + 1) % 5 === 0) {
      console.log(`📈 Progress: ${i + 1}/${algorithmTopics.length} topics processed`);
    }
  }

  if (allQuestions.length === 0) {
    console.log('❌ No questions were generated successfully');
    process.exit(1);
  }

  // Combine existing and new questions
  const combinedQuestions = [...existingQuestions, ...allQuestions];
  
  // Save back to leetcode_mcq_questions.json
  try {
    fs.writeFileSync(questionsFilePath, JSON.stringify(combinedQuestions, null, 2));
    console.log(`\n🎉 Success! Updated leetcode_mcq_questions.json`);
    console.log(`📊 Total questions: ${combinedQuestions.length} (${allQuestions.length} new)`);
  } catch (error) {
    console.error('❌ Error writing to leetcode_mcq_questions.json:', error.message);
    
    // Fallback: save new questions to separate file
    const backupPath = path.join(__dirname, '../db/new-questions-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(allQuestions, null, 2));
    console.log(`💾 New questions saved to backup file: ${backupPath}`);
    process.exit(1);
  }
  
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
  
  console.log('\n📈 NEW QUESTIONS STATISTICS:');
  console.log('Question Types:', typeDistribution);
  console.log('Difficulty Distribution:', difficultyDistribution);
  console.log('Categories:', Object.entries(categoryDistribution)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => `${cat}(${count})`)
    .join(', '));
    
  // Show sample questions
  console.log('\n🔍 SAMPLE NEW QUESTIONS:');
  const sampleQuestions = allQuestions.slice(0, 3);
  
  sampleQuestions.forEach((q, index) => {
    console.log(`\n${index + 1}. ${q.type} - ${q.difficulty} - ${q.categories.join(', ')}`);
    console.log(`   Text: ${q.text.substring(0, 80)}...`);
    console.log(`   Answer: ${q.answer}`);
  });

  console.log('\n✅ Question expansion completed successfully!');
  console.log('🚀 Your leetcode_mcq_questions.json now has enhanced algorithmic questions!');
}

// Run the expansion
main().catch((error) => {
  console.error('\n💥 Question expansion failed:', error);
  process.exit(1);
});
