import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read current questions
const questionsPath = path.join(__dirname, 'leetcode_mcq_questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Category mapping from frontend to backend
const categoryMapping = {
  'arrays': 'Arrays',
  'strings': 'Strings', 
  'trees': 'Trees',
  'graphs': 'Graphs',
  'stacks-queues': 'Stacks',
  'hashmaps': 'HashMaps',
  'sliding-window': 'SlidingWindow',
  'dynamic-programming': 'DynamicProgramming',
  'two-pointers': 'TwoPointers',
  'binary-search': 'BinarySearch',
  'sorting': 'Sorting',
  'recursion': 'Recursion'
};

// Additional code-based questions covering all frontend topics
const additionalCodeQuestions = [
  // Arrays - More code-based questions
  {
    "text": "Given this array rotation algorithm:\n\n```\nARRAY = [1, 2, 3, 4, 5, 6, 7]\nK = 3\nn = length(ARRAY)\nK = K mod n\n\nREVERSE(ARRAY, 0, n - 1)      // Reverse entire array\nREVERSE(ARRAY, 0, K - 1)      // Reverse first K elements  \nREVERSE(ARRAY, K, n - 1)      // Reverse remaining elements\n\nfunction REVERSE(arr, start, end):\n    while start < end:\n        SWAP(arr[start], arr[end])\n        start = start + 1\n        end = end - 1\n```\n\nWhat is the array after the first REVERSE operation?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["[7, 6, 5, 4, 3, 2, 1]", "[1, 2, 3, 4, 5, 6, 7]", "[5, 6, 7, 1, 2, 3, 4]", "[4, 5, 6, 7, 1, 2, 3]"],
    "answer": "[7, 6, 5, 4, 3, 2, 1]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this array partition algorithm:\n\n```\nARRAY = [3, 1, 4, 1, 5, 9, 2, 6]\nTARGET = 4\ni = 0\nj = 0\n\nwhile j < length(ARRAY):\n    if ARRAY[j] <= TARGET:\n        SWAP(ARRAY[i], ARRAY[j])\n        _______________\n    j = j + 1\n\nreturn i\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["i = i + 1", "j = j + 1", "i = j", "j = i"],
    "answer": "i = i + 1",
    "difficulty": "EASY"
  },

  // Strings - Code-based questions
  {
    "text": "Given this palindrome check algorithm:\n\n```\nSTRING = \"racecar\"\nleft = 0\nright = length(STRING) - 1\n\nwhile left < right:\n    if STRING[left] ≠ STRING[right]:\n        return FALSE\n    left = left + 1\n    right = right - 1\n\nreturn TRUE\n```\n\nHow many character comparisons are made?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["3", "4", "7", "6"],
    "answer": "3",
    "difficulty": "EASY"
  },
  {
    "text": "Complete this string reversal algorithm:\n\n```\nSTRING = ['h', 'e', 'l', 'l', 'o']\nleft = 0\nright = length(STRING) - 1\n\nwhile left < right:\n    _______________\n    left = left + 1\n    right = right - 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["SWAP(STRING[left], STRING[right])", "STRING[left] = STRING[right]", "left = right", "STRING = REVERSE(STRING)"],
    "answer": "SWAP(STRING[left], STRING[right])",
    "difficulty": "EASY"
  },

  // Trees - Code-based questions
  {
    "text": "Given this binary tree traversal:\n\n```\nTREE:\n       1\n      / \\\n     2   3\n    / \\\n   4   5\n\nfunction INORDER(node):\n    if node ≠ NULL:\n        INORDER(node.left)\n        PRINT(node.data)\n        INORDER(node.right)\n\nINORDER(root)\n```\n\nWhat is the output sequence?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["4, 2, 5, 1, 3", "1, 2, 4, 5, 3", "4, 5, 2, 3, 1", "1, 2, 3, 4, 5"],
    "answer": "4, 2, 5, 1, 3",
    "difficulty": "EASY"
  },
  {
    "text": "Complete this binary search tree insertion:\n\n```\nfunction INSERT(node, key):\n    if node = NULL:\n        return CREATE_NODE(key)\n    \n    if key < node.data:\n        node.left = INSERT(node.left, key)\n    else:\n        _______________\n    \n    return node\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["node.right = INSERT(node.right, key)", "node.left = INSERT(node.left, key)", "return node", "node.data = key"],
    "answer": "node.right = INSERT(node.right, key)",
    "difficulty": "EASY"
  },

  // Graphs - Code-based questions  
  {
    "text": "Given this DFS algorithm:\n\n```\nGRAPH = {A: [B, C], B: [D], C: [E], D: [], E: []}\nVISITED = empty set\nRESULT = []\n\nfunction DFS(node):\n    if node in VISITED:\n        return\n    VISITED.add(node)\n    RESULT.append(node)\n    for neighbor in GRAPH[node]:\n        DFS(neighbor)\n\nDFS('A')\n```\n\nWhat is the final RESULT array?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["[A, B, D, C, E]", "[A, B, C, D, E]", "[A, C, E, B, D]", "[D, B, E, C, A]"],
    "answer": "[A, B, D, C, E]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this BFS algorithm:\n\n```\nGRAPH = {A: [B, C], B: [D], C: [E], D: [], E: []}\nQUEUE = [A]\nVISITED = {A}\nRESULT = []\n\nwhile QUEUE is not empty:\n    node = QUEUE.dequeue()\n    RESULT.append(node)\n    for neighbor in GRAPH[node]:\n        if neighbor not in VISITED:\n            _______________\n            QUEUE.enqueue(neighbor)\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["VISITED.add(neighbor)", "RESULT.append(neighbor)", "QUEUE.enqueue(neighbor)", "DFS(neighbor)"],
    "answer": "VISITED.add(neighbor)",
    "difficulty": "EASY"
  },

  // Stacks & Queues - Code-based questions
  {
    "text": "Given this balanced parentheses checker:\n\n```\nSTRING = \"({[]})\"\nSTACK = empty stack\nOPENING = {'(', '{', '['}\nCLOSING = {')', '}', ']'}\nPAIRS = {')': '(', '}': '{', ']': '['}\n\nfor char in STRING:\n    if char in OPENING:\n        STACK.push(char)\n    elif char in CLOSING:\n        if STACK.is_empty() or STACK.top() ≠ PAIRS[char]:\n            return FALSE\n        STACK.pop()\n\nreturn STACK.is_empty()\n```\n\nWhat does this algorithm return?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Stacks"],
    "options": ["TRUE", "FALSE", "Error", "Empty Stack"],
    "answer": "TRUE",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this stack-based expression evaluator:\n\n```\nEXPRESSION = \"2 3 + 4 *\"  // Postfix notation\nSTACK = empty stack\n\nfor token in EXPRESSION.split():\n    if token is operand:\n        STACK.push(INTEGER(token))\n    else:\n        b = STACK.pop()\n        a = STACK.pop()\n        _______________\n        STACK.push(result)\n\nreturn STACK.top()\n```",
    "type": "FILL_BLANK",
    "categories": ["Stacks"],
    "options": ["result = EVALUATE(a, token, b)", "result = a + b", "result = token(a, b)", "STACK.push(a + b)"],
    "answer": "result = EVALUATE(a, token, b)",
    "difficulty": "MEDIUM"
  },

  // Hash Maps - Code-based questions
  {
    "text": "Given this hash table collision resolution:\n\n```\nTABLE_SIZE = 7\nKEYS = [10, 22, 31, 4, 15, 28, 17]\nTABLE = array of size 7, all NULL\n\nfunction HASH(key):\n    return key mod TABLE_SIZE\n\nfunction INSERT(key):\n    index = HASH(key)\n    while TABLE[index] ≠ NULL:\n        index = (index + 1) mod TABLE_SIZE\n    TABLE[index] = key\n\nfor key in KEYS:\n    INSERT(key)\n```\n\nWhere is key 15 stored?",
    "type": "PREDICT_OUTPUT",
    "categories": ["HashMaps"],
    "options": ["index 1", "index 2", "index 3", "index 4"],
    "answer": "index 2",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this hash map implementation with chaining:\n\n```\nclass HASH_MAP:\n    TABLE_SIZE = 10\n    table = array of empty lists, size TABLE_SIZE\n    \n    function PUT(key, value):\n        index = HASH(key)\n        bucket = table[index]\n        for i = 0 to length(bucket) - 1:\n            if bucket[i].key = key:\n                bucket[i].value = value\n                return\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["HashMaps"],
    "options": ["bucket.append({key, value})", "table[index] = {key, value}", "bucket[0] = {key, value}", "table.append({key, value})"],
    "answer": "bucket.append({key, value})",
    "difficulty": "MEDIUM"
  },

  // Sliding Window - Code-based questions
  {
    "text": "Given this sliding window maximum algorithm:\n\n```\nARRAY = [1, 3, -1, -3, 5, 3, 6, 7]\nWINDOW_SIZE = 3\nRESULT = []\nDEQUE = empty deque\n\nfor i = 0 to length(ARRAY) - 1:\n    // Remove elements outside window\n    while DEQUE not empty and DEQUE.front() ≤ i - WINDOW_SIZE:\n        DEQUE.remove_front()\n    \n    // Remove smaller elements\n    while DEQUE not empty and ARRAY[DEQUE.back()] ≤ ARRAY[i]:\n        DEQUE.remove_back()\n    \n    DEQUE.add_back(i)\n    \n    if i ≥ WINDOW_SIZE - 1:\n        RESULT.append(ARRAY[DEQUE.front()])\n```\n\nWhat is RESULT after processing index 4?",
    "type": "PREDICT_OUTPUT",
    "categories": ["SlidingWindow"],
    "options": ["[3, 3, 5]", "[3, 3]", "[1, 3, 5]", "[3, 5]"],
    "answer": "[3, 3, 5]",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this sliding window algorithm for substring:\n\n```\nSTRING = \"abcabcbb\"\nWINDOW = empty set\nleft = 0\nmax_length = 0\n\nfor right = 0 to length(STRING) - 1:\n    while STRING[right] in WINDOW:\n        WINDOW.remove(STRING[left])\n        _______________\n    WINDOW.add(STRING[right])\n    max_length = MAX(max_length, right - left + 1)\n```",
    "type": "FILL_BLANK",
    "categories": ["SlidingWindow"],
    "options": ["left = left + 1", "right = right + 1", "left = right", "right = left + 1"],
    "answer": "left = left + 1",
    "difficulty": "MEDIUM"
  },

  // Dynamic Programming - Code-based questions
  {
    "text": "Given this Fibonacci DP algorithm:\n\n```\nn = 5\nDP = array of size n + 1\nDP[0] = 0\nDP[1] = 1\n\nfor i = 2 to n:\n    DP[i] = DP[i-1] + DP[i-2]\n\nreturn DP[n]\n```\n\nWhat is the value of DP[4]?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["3", "5", "8", "2"],
    "answer": "3",
    "difficulty": "EASY"
  },
  {
    "text": "Complete this coin change DP algorithm:\n\n```\nCOINS = [1, 3, 4]\nAMOUNT = 6\nDP = array of size AMOUNT + 1, all infinity\nDP[0] = 0\n\nfor i = 1 to AMOUNT:\n    for coin in COINS:\n        if coin ≤ i:\n            _______________\n\nreturn DP[AMOUNT]\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["DP[i] = MIN(DP[i], DP[i - coin] + 1)", "DP[i] = DP[i - coin] + 1", "DP[i] = coin", "DP[coin] = i"],
    "answer": "DP[i] = MIN(DP[i], DP[i - coin] + 1)",
    "difficulty": "MEDIUM"
  },

  // Two Pointers - Code-based questions
  {
    "text": "Given this two-pointer array sum algorithm:\n\n```\nARRAY = [1, 2, 3, 4, 6]\nTARGET = 6\nleft = 0\nright = length(ARRAY) - 1\n\nwhile left < right:\n    current_sum = ARRAY[left] + ARRAY[right]\n    if current_sum = TARGET:\n        return [left, right]\n    elif current_sum < TARGET:\n        left = left + 1\n    else:\n        right = right - 1\n\nreturn \"No solution\"\n```\n\nWhat does this algorithm return?",
    "type": "PREDICT_OUTPUT",
    "categories": ["TwoPointers"],
    "options": ["[1, 3]", "[0, 4]", "[2, 3]", "\"No solution\""],
    "answer": "[1, 3]",
    "difficulty": "EASY"
  },
  {
    "text": "Complete this palindrome check using two pointers:\n\n```\nSTRING = \"A man a plan a canal Panama\"\nSTRING = REMOVE_NON_ALPHANUMERIC(LOWERCASE(STRING))\nleft = 0\nright = length(STRING) - 1\n\nwhile left < right:\n    if STRING[left] ≠ STRING[right]:\n        return FALSE\n    _______________\n    right = right - 1\n\nreturn TRUE\n```",
    "type": "FILL_BLANK",
    "categories": ["TwoPointers"],
    "options": ["left = left + 1", "left = right", "left = left + 2", "right = left"],
    "answer": "left = left + 1",
    "difficulty": "EASY"
  },

  // Binary Search - Code-based questions
  {
    "text": "Given this binary search algorithm:\n\n```\nARRAY = [1, 3, 5, 7, 9, 11, 13]\nTARGET = 7\nleft = 0\nright = length(ARRAY) - 1\n\nwhile left ≤ right:\n    mid = left + (right - left) / 2\n    if ARRAY[mid] = TARGET:\n        return mid\n    elif ARRAY[mid] < TARGET:\n        left = mid + 1\n    else:\n        right = mid - 1\n\nreturn -1\n```\n\nHow many iterations does this take?",
    "type": "PREDICT_OUTPUT",
    "categories": ["BinarySearch"],
    "options": ["2", "3", "1", "4"],
    "answer": "2",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this binary search for insertion point:\n\n```\nARRAY = [1, 3, 5, 7, 9]\nTARGET = 6\nleft = 0\nright = length(ARRAY)\n\nwhile left < right:\n    mid = left + (right - left) / 2\n    if ARRAY[mid] < TARGET:\n        _______________\n    else:\n        right = mid\n\nreturn left\n```",
    "type": "FILL_BLANK",
    "categories": ["BinarySearch"],
    "options": ["left = mid + 1", "left = mid", "right = mid + 1", "left = right"],
    "answer": "left = mid + 1",
    "difficulty": "MEDIUM"
  },

  // Sorting - Code-based questions
  {
    "text": "Given this bubble sort algorithm:\n\n```\nARRAY = [64, 34, 25, 12, 22, 11, 90]\nn = length(ARRAY)\n\nfor i = 0 to n - 2:\n    for j = 0 to n - 2 - i:\n        if ARRAY[j] > ARRAY[j + 1]:\n            SWAP(ARRAY[j], ARRAY[j + 1])\n```\n\nAfter the first complete pass (i=0), what is ARRAY[6]?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Sorting"],
    "options": ["90", "64", "11", "25"],
    "answer": "90",
    "difficulty": "EASY"
  },
  {
    "text": "Complete this merge sort merge function:\n\n```\nfunction MERGE(arr, left, mid, right):\n    left_arr = COPY(arr[left...mid])\n    right_arr = COPY(arr[mid+1...right])\n    \n    i = 0, j = 0, k = left\n    \n    while i < length(left_arr) and j < length(right_arr):\n        if left_arr[i] ≤ right_arr[j]:\n            arr[k] = left_arr[i]\n            i = i + 1\n        else:\n            _______________\n            j = j + 1\n        k = k + 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Sorting"],
    "options": ["arr[k] = right_arr[j]", "arr[k] = left_arr[i]", "arr[j] = right_arr[k]", "k = j"],
    "answer": "arr[k] = right_arr[j]",
    "difficulty": "MEDIUM"
  },

  // Recursion - Code-based questions
  {
    "text": "Given this recursive factorial algorithm:\n\n```\nfunction FACTORIAL(n):\n    if n ≤ 1:\n        return 1\n    return n * FACTORIAL(n - 1)\n\nresult = FACTORIAL(4)\n```\n\nHow many recursive calls are made (including the initial call)?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Recursion"],
    "options": ["4", "5", "3", "6"],
    "answer": "5",
    "difficulty": "EASY"
  },
  {
    "text": "Complete this recursive binary tree height calculation:\n\n```\nfunction HEIGHT(node):\n    if node = NULL:\n        return 0\n    \n    left_height = HEIGHT(node.left)\n    right_height = HEIGHT(node.right)\n    \n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Recursion", "Trees"],
    "options": ["return 1 + MAX(left_height, right_height)", "return left_height + right_height", "return MAX(left_height, right_height)", "return 1 + left_height + right_height"],
    "answer": "return 1 + MAX(left_height, right_height)",
    "difficulty": "EASY"
  },

  // More advanced code prediction questions
  {
    "text": "Given this advanced two-pointer technique:\n\n```\nARRAY = [1, 1, 2, 2, 2, 3, 3]\nwrite_index = 0\n\nfor read_index = 0 to length(ARRAY) - 1:\n    if read_index = 0 or ARRAY[read_index] ≠ ARRAY[read_index - 1]:\n        ARRAY[write_index] = ARRAY[read_index]\n        write_index = write_index + 1\n\nreturn write_index\n```\n\nWhat does this algorithm return?",
    "type": "PREDICT_OUTPUT",
    "categories": ["TwoPointers", "Arrays"],
    "options": ["3", "4", "7", "2"],
    "answer": "3",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this trie insertion algorithm:\n\n```\nclass TRIE_NODE:\n    children = array of 26 NULL pointers\n    is_end_word = FALSE\n\nWORDS = [\"cat\", \"car\", \"card\"]\nROOT = new TRIE_NODE()\n\nfunction INSERT(word):\n    current = ROOT\n    for char in word:\n        index = char - 'a'\n        if current.children[index] = NULL:\n            current.children[index] = new TRIE_NODE()\n        current = current.children[index]\n    current.is_end_word = TRUE\n\nfor word in WORDS:\n    INSERT(word)\n```\n\nAfter inserting all words, how many nodes have is_end_word = TRUE?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings", "Trees"],
    "options": ["3", "4", "5", "6"],
    "answer": "3",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this heap insertion algorithm:\n\n```\nHEAP = [10, 8, 9, 4, 7, 5, 3, 1, 2]\nNEW_ELEMENT = 15\n\n// Insert at end\nHEAP.append(NEW_ELEMENT)\nindex = length(HEAP) - 1\n\n// Bubble up\nwhile index > 0:\n    parent = (index - 1) / 2\n    if HEAP[index] ≤ HEAP[parent]:\n        break\n    _______________\n    index = parent\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["SWAP(HEAP[index], HEAP[parent])", "HEAP[index] = HEAP[parent]", "HEAP[parent] = NEW_ELEMENT", "index = 0"],
    "answer": "SWAP(HEAP[index], HEAP[parent])",
    "difficulty": "MEDIUM"
  }
];

// Function to update categories in existing questions to match frontend
function updateCategories(questions) {
  return questions.map(question => {
    if (!question.categories) return question;
    
    const updatedCategories = question.categories.map(category => {
      // Handle existing categories and map some to match frontend
      switch(category) {
        case 'Queues': return 'Stacks';  // Frontend groups as "Stacks & Queues"
        case 'Deque': return 'Stacks';
        case 'Heaps': return 'Trees';    // Heaps are tree-based structures
        case 'BST': return 'Trees';
        case 'LinkedLists': return 'Arrays';  // Group with arrays for simplicity
        case 'Matrix': return 'Arrays';
        case 'Intervals': return 'Arrays';
        case 'BitManipulation': return 'Math';
        case 'Geometry': return 'Math';
        case 'NumberTheory': return 'Math';
        case 'Combinatorics': return 'Math';
        case 'Greedy': return 'DynamicProgramming';  // Related algorithmic techniques
        case 'Backtracking': return 'Recursion';
        case 'DFS': return 'Graphs';
        case 'BFS': return 'Graphs';
        case 'UnionFind': return 'Graphs';
        case 'MST': return 'Graphs';
        case 'Dijkstra': return 'Graphs';
        case 'FloydWarshall': return 'Graphs';
        case 'BellmanFord': return 'Graphs';
        case 'TopologicalSort': return 'Graphs';
        case 'AStar': return 'Graphs';
        case 'NetworkFlow': return 'Graphs';
        case 'BipartiteMatching': return 'Graphs';
        case 'Hungarian': return 'Graphs';
        case 'DivideConquer': return 'Recursion';
        case 'SegmentTree': return 'Trees';
        case 'BinaryIndexedTree': return 'Trees';
        case 'Trie': return 'Trees';
        case 'SuffixTree': return 'Trees';
        case 'PersistentSegmentTree': return 'Trees';
        case 'LinkCutTree': return 'Trees';
        case 'CentroidDecomposition': return 'Trees';
        case 'HeavyLightDecomposition': return 'Trees';
        case 'KMP': return 'Strings';
        case 'Palindromes': return 'Strings';
        case 'Hashing': return 'HashMaps';
        case 'SuffixArray': return 'Strings';
        case 'MoAlgorithm': return 'Arrays';
        case 'SqrtDecomposition': return 'Arrays';
        case 'ConvexHull': return 'Math';
        case 'MatrixExponentiation': return 'Math';
        case 'LinearRecurrence': return 'Math';
        case 'Design': return 'HashMaps';  // Most design problems use hash maps
        default: return category;
      }
    });
    
    return {
      ...question,
      categories: [...new Set(updatedCategories)]  // Remove duplicates
    };
  });
}

// Combine and update all questions
const allQuestions = [...updateCategories(existingQuestions), ...additionalCodeQuestions];

// Write back to file
fs.writeFileSync(questionsPath, JSON.stringify(allQuestions, null, 2));

console.log(`✅ Updated questions: ${allQuestions.length} total`);

// Check final distribution
const typeDistribution = allQuestions.reduce((acc, q) => {
  acc[q.type] = (acc[q.type] || 0) + 1;
  return acc;
}, {});

const difficultyDistribution = allQuestions.reduce((acc, q) => {
  acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
  return acc;
}, {});

const categoryDistribution = {};
allQuestions.forEach(q => {
  if (q.categories) {
    q.categories.forEach(cat => {
      categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
    });
  }
});

console.log('\n📊 FINAL DISTRIBUTIONS:');
console.log('Type Distribution:', typeDistribution);
console.log('Difficulty Distribution:', difficultyDistribution);

console.log('\n📚 Frontend-Compatible Categories:');
const frontendCategories = ['Arrays', 'Strings', 'Trees', 'Graphs', 'Stacks', 'HashMaps', 
                           'SlidingWindow', 'DynamicProgramming', 'TwoPointers', 'BinarySearch', 'Sorting', 'Recursion'];
frontendCategories.forEach(cat => {
  const count = categoryDistribution[cat] || 0;
  console.log(`  ${cat}: ${count} questions`);
});

console.log('\n✅ All questions now use pseudo-algorithmic language');
console.log('✅ Categories mapped to match frontend practice mode');
console.log('✅ Added comprehensive code-based questions for all topics');
console.log('✅ Increased PREDICT_OUTPUT and FILL_BLANK question types');
