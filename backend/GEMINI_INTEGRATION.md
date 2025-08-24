# 🤖 Gemini AI Question Generation for CodeClash

This integration uses Google's Gemini AI to automatically generate high-quality quiz questions from LeetCode problems, perfectly tailored for your CodeClash platform.

## 🎯 What It Does

- **Transforms LeetCode problems** into 3 types of quiz questions:
  - **MCQ**: Multiple choice conceptual questions
  - **PREDICT_OUTPUT**: Code execution prediction
  - **FILL_BLANK**: Complete the missing code/concept
  
- **Smart Category Mapping**: Automatically maps LeetCode tags to your CodeClash categories
- **Database Integration**: Questions are formatted to match your Prisma schema exactly
- **Quality Control**: Validates all generated questions before database insertion

## 📋 Prerequisites

1. **Gemini API Key**: Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **LeetCode Data**: Your `leetcode.txt` file with problem data
3. **Environment Setup**: Node.js with the installed dependencies

## 🚀 Quick Start

### Step 1: Setup API Key
```bash
# Add to your .env file
echo "GEMINI_API_KEY=your_actual_api_key_here" >> .env
```

### Step 2: Prepare Your Data
Ensure your `leetcode.txt` file is in the `backend/src/db/` directory with LeetCode problems data.

### Step 3: Generate Questions
```bash
cd backend
node src/scripts/generate-questions-gemini.js
```

### Step 4: Insert into Database
```bash
node src/scripts/insert-gemini-questions.js
```

## 📊 Expected Output

From **each LeetCode problem**, you'll get **3 quiz questions**:
- Total questions = 3 × number of LeetCode problems
- All questions will match your existing schema
- Categories automatically mapped to your system

## 🗺️ Category Mapping

The script intelligently maps LeetCode tags to CodeClash categories:

| LeetCode Tags | CodeClash Category |
|---|---|
| array, two-pointers | Arrays |
| string, palindrome | Strings |
| hash-table, counting | HashMaps |
| tree, binary-tree | Trees |
| graph, dfs, bfs | Graphs |
| dynamic-programming | DynamicProgramming |
| And many more... | |

## 📁 File Structure

```
backend/src/
├── scripts/
│   ├── generate-questions-gemini.js    # Main generation script
│   └── insert-gemini-questions.js      # Database insertion
├── db/
│   ├── leetcode.txt                     # Your input data
│   └── codeclash-questions-gemini.json # Generated output
└── .env                                 # API key configuration
```

## 🔧 Configuration

### Rate Limiting
The script includes built-in rate limiting (1.5s between requests) to respect Gemini API limits. Adjust in the code if needed:

```javascript
// In generate-questions-gemini.js, line ~200
await new Promise(resolve => setTimeout(resolve, 1500)); // Adjust timing
```

### Question Validation
All generated questions are validated for:
- ✅ Required fields (text, type, options, answer, etc.)
- ✅ Valid question types (MCQ, PREDICT_OUTPUT, FILL_BLANK)
- ✅ Valid difficulty levels (EASY, MEDIUM, HARD)
- ✅ Proper category mapping

## 📈 Monitoring & Statistics

After generation, you'll see:
- **Progress tracking**: Real-time updates during generation
- **Success/failure rates**: Which problems were processed successfully
- **Distribution stats**: Breakdown by type, difficulty, and category
- **Database verification**: Confirmation of successful insertion

## 🛠️ Troubleshooting

### Common Issues

**API Key Error**
```
❌ GEMINI_API_KEY not found in environment variables
```
→ Add your Gemini API key to `.env` file

**Data Format Error**
```
❌ leetcode.txt not found
```
→ Ensure your LeetCode data file exists in `backend/src/db/leetcode.txt`

**JSON Parse Error**
```
❌ Failed to parse Gemini response
```
→ Usually a temporary API issue, try running again

**Database Insert Error**
```
❌ Invalid question structure
```
→ Check that generated questions match your Prisma schema

### Advanced Debugging

Enable detailed logging by modifying the generation script:
```javascript
// Add this for more verbose output
console.log('Raw Gemini response:', text);
```

## 🎯 Pro Tips

1. **Batch Processing**: The script processes problems in batches with progress tracking
2. **Resume Capability**: If interrupted, manually adjust the loop start index
3. **Custom Categories**: Modify the `tagMapping` object to add your own category mappings
4. **Quality Control**: Review generated questions in the JSON file before database insertion

## 🚀 Integration with Your App

Once questions are in your database, they'll automatically work with your existing:
- ✅ Solo practice modes
- ✅ Battle system
- ✅ Question selection algorithms
- ✅ Difficulty filtering
- ✅ Category-based filtering

The new questions will seamlessly blend with your existing question pool!

## 📞 Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your API key is valid and has quota remaining
3. Ensure your input data format matches expectations
4. Review the generated JSON file for data quality

Happy question generating! 🎉
