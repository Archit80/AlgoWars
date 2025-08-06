import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read current questions
const questionsPath = path.join(__dirname, 'leetcode_mcq_questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Additional comprehensive code-based questions
const moreCodeQuestions = [
  // More Sliding Window questions
  {
    "text": "Given this sliding window algorithm for minimum window substring:\n\n```\nSTRING = \"ADOBECODEBANC\"\nTARGET = \"ABC\"\nWINDOW_COUNT = empty map\nTARGET_COUNT = {'A': 1, 'B': 1, 'C': 1}\nleft = 0\nmin_length = infinity\nformed = 0\nrequired = 3\n\nfor right = 0 to length(STRING) - 1:\n    char = STRING[right]\n    WINDOW_COUNT[char] = WINDOW_COUNT.get(char, 0) + 1\n    \n    if char in TARGET_COUNT and WINDOW_COUNT[char] = TARGET_COUNT[char]:\n        formed = formed + 1\n    \n    while left ≤ right and formed = required:\n        if right - left + 1 < min_length:\n            min_length = right - left + 1\n        \n        char = STRING[left]\n        WINDOW_COUNT[char] = WINDOW_COUNT[char] - 1\n        if char in TARGET_COUNT and WINDOW_COUNT[char] < TARGET_COUNT[char]:\n            formed = formed - 1\n        left = left + 1\n```\n\nWhat is the minimum window length found?",
    "type": "PREDICT_OUTPUT",
    "categories": ["SlidingWindow", "Strings"],
    "options": ["4", "5", "6", "3"],
    "answer": "4",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this sliding window for fixed-size maximum:\n\n```\nARRAY = [1, 12, -5, -6, 50, 3]\nWINDOW_SIZE = 4\nRESULT = []\n\nfor i = 0 to length(ARRAY) - WINDOW_SIZE:\n    window_max = -infinity\n    for j = i to i + WINDOW_SIZE - 1:\n        _______________\n    RESULT.append(window_max)\n```",
    "type": "FILL_BLANK",
    "categories": ["SlidingWindow", "Arrays"],
    "options": ["window_max = MAX(window_max, ARRAY[j])", "window_max = ARRAY[j]", "window_max = MIN(window_max, ARRAY[j])", "RESULT.append(ARRAY[j])"],
    "answer": "window_max = MAX(window_max, ARRAY[j])",
    "difficulty": "EASY"
  },

  // More Hash Maps questions
  {
    "text": "Given this hash map with quadratic probing:\n\n```\nTABLE_SIZE = 11\nKEYS = [23, 34, 15, 26]\nTABLE = array of size 11, all NULL\n\nfunction HASH(key):\n    return key mod TABLE_SIZE\n\nfunction INSERT(key):\n    index = HASH(key)\n    i = 0\n    while TABLE[index] ≠ NULL:\n        i = i + 1\n        index = (HASH(key) + i * i) mod TABLE_SIZE\n    TABLE[index] = key\n\nfor key in KEYS:\n    INSERT(key)\n```\n\nWhere is key 26 stored after all insertions?",
    "type": "PREDICT_OUTPUT",
    "categories": ["HashMaps"],
    "options": ["index 4", "index 5", "index 8", "index 3"],
    "answer": "index 5",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this hash map resizing algorithm:\n\n```\nclass HASH_MAP:\n    table = array of size 4\n    size = 0\n    capacity = 4\n    \n    function RESIZE():\n        old_table = table\n        capacity = capacity * 2\n        table = array of size capacity\n        size = 0\n        \n        for bucket in old_table:\n            for entry in bucket:\n                _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["HashMaps"],
    "options": ["PUT(entry.key, entry.value)", "table.append(entry)", "size = size + 1", "bucket.append(entry)"],
    "answer": "PUT(entry.key, entry.value)",
    "difficulty": "MEDIUM"
  },

  // More Stacks questions
  {
    "text": "Given this stack-based next greater element algorithm:\n\n```\nARRAY = [4, 5, 2, 25]\nSTACK = empty stack\nRESULT = array of size length(ARRAY), all -1\n\nfor i = length(ARRAY) - 1 down to 0:\n    while STACK not empty and STACK.top() ≤ ARRAY[i]:\n        STACK.pop()\n    \n    if STACK not empty:\n        RESULT[i] = STACK.top()\n    \n    STACK.push(ARRAY[i])\n```\n\nWhat is RESULT after processing all elements?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Stacks", "Arrays"],
    "options": ["[5, 25, 25, -1]", "[5, -1, 25, -1]", "[-1, 25, 25, -1]", "[4, 5, 2, -1]"],
    "answer": "[5, 25, 25, -1]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this monotonic stack for largest rectangle:\n\n```\nHEIGHTS = [2, 1, 5, 6, 2, 3]\nSTACK = empty stack\nmax_area = 0\n\nfor i = 0 to length(HEIGHTS):\n    while STACK not empty and (i = length(HEIGHTS) or HEIGHTS[STACK.top()] > HEIGHTS[i]):\n        height = HEIGHTS[STACK.pop()]\n        width = i if STACK.empty() else i - STACK.top() - 1\n        _______________\n    \n    if i < length(HEIGHTS):\n        STACK.push(i)\n```",
    "type": "FILL_BLANK",
    "categories": ["Stacks"],
    "options": ["max_area = MAX(max_area, height * width)", "max_area = height * width", "max_area = max_area + height * width", "width = height * max_area"],
    "answer": "max_area = MAX(max_area, height * width)",
    "difficulty": "HARD"
  },

  // More Binary Search questions
  {
    "text": "Given this binary search on rotated array:\n\n```\nARRAY = [4, 5, 6, 7, 0, 1, 2]\nTARGET = 0\nleft = 0\nright = length(ARRAY) - 1\n\nwhile left ≤ right:\n    mid = left + (right - left) / 2\n    \n    if ARRAY[mid] = TARGET:\n        return mid\n    \n    if ARRAY[left] ≤ ARRAY[mid]:  // Left half is sorted\n        if TARGET ≥ ARRAY[left] and TARGET < ARRAY[mid]:\n            right = mid - 1\n        else:\n            left = mid + 1\n    else:  // Right half is sorted\n        if TARGET > ARRAY[mid] and TARGET ≤ ARRAY[right]:\n            left = mid + 1\n        else:\n            right = mid - 1\n\nreturn -1\n```\n\nWhat index does this algorithm return?",
    "type": "PREDICT_OUTPUT",
    "categories": ["BinarySearch", "Arrays"],
    "options": ["4", "0", "-1", "5"],
    "answer": "4",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this binary search for peak element:\n\n```\nARRAY = [1, 2, 3, 1]\nleft = 0\nright = length(ARRAY) - 1\n\nwhile left < right:\n    mid = left + (right - left) / 2\n    \n    if ARRAY[mid] > ARRAY[mid + 1]:\n        _______________\n    else:\n        left = mid + 1\n\nreturn left\n```",
    "type": "FILL_BLANK",
    "categories": ["BinarySearch"],
    "options": ["right = mid", "right = mid - 1", "left = mid", "return mid"],
    "answer": "right = mid",
    "difficulty": "MEDIUM"
  },

  // More Sorting questions
  {
    "text": "Given this quick sort partition algorithm:\n\n```\nARRAY = [10, 80, 30, 90, 40, 50, 70]\nlow = 0\nhigh = 6\npivot = ARRAY[high]  // 70\ni = low - 1\n\nfor j = low to high - 1:\n    if ARRAY[j] ≤ pivot:\n        i = i + 1\n        SWAP(ARRAY[i], ARRAY[j])\n\nSWAP(ARRAY[i + 1], ARRAY[high])\nreturn i + 1\n```\n\nWhat is the final position of the pivot element?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Sorting"],
    "options": ["5", "4", "6", "3"],
    "answer": "5",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this heap sort heapify operation:\n\n```\nARRAY = [4, 10, 3, 5, 1]\nn = 5\ni = 1  // Index to heapify from\n\nfunction HEAPIFY(arr, n, i):\n    largest = i\n    left = 2 * i + 1\n    right = 2 * i + 2\n    \n    if left < n and arr[left] > arr[largest]:\n        largest = left\n    \n    if right < n and arr[right] > arr[largest]:\n        largest = right\n    \n    if largest ≠ i:\n        _______________\n        HEAPIFY(arr, n, largest)\n```",
    "type": "FILL_BLANK",
    "categories": ["Sorting", "Trees"],
    "options": ["SWAP(arr[i], arr[largest])", "arr[i] = arr[largest]", "largest = i", "return largest"],
    "answer": "SWAP(arr[i], arr[largest])",
    "difficulty": "MEDIUM"
  },

  // More Recursion questions
  {
    "text": "Given this recursive Tower of Hanoi algorithm:\n\n```\nfunction HANOI(n, source, destination, auxiliary):\n    if n = 1:\n        PRINT(\"Move disk 1 from \" + source + \" to \" + destination)\n        return\n    \n    HANOI(n - 1, source, auxiliary, destination)\n    PRINT(\"Move disk \" + n + \" from \" + source + \" to \" + destination)\n    HANOI(n - 1, auxiliary, destination, source)\n\nHANOI(3, \"A\", \"C\", \"B\")\n```\n\nHow many total moves are printed for n=3?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Recursion"],
    "options": ["7", "6", "8", "5"],
    "answer": "7",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this recursive permutation generator:\n\n```\nARRAY = [1, 2, 3]\nRESULT = []\n\nfunction PERMUTE(arr, start, end):\n    if start = end:\n        RESULT.append(COPY(arr))\n        return\n    \n    for i = start to end:\n        SWAP(arr[start], arr[i])\n        _______________\n        SWAP(arr[start], arr[i])  // Backtrack\n\nPERMUTE(ARRAY, 0, 2)\n```",
    "type": "FILL_BLANK",
    "categories": ["Recursion"],
    "options": ["PERMUTE(arr, start + 1, end)", "PERMUTE(arr, start, end - 1)", "PERMUTE(arr, i, end)", "RESULT.append(arr)"],
    "answer": "PERMUTE(arr, start + 1, end)",
    "difficulty": "MEDIUM"
  },

  // More Trees questions
  {
    "text": "Given this AVL tree rotation algorithm:\n\n```\nfunction RIGHT_ROTATE(y):\n    x = y.left\n    T2 = x.right\n    \n    // Perform rotation\n    x.right = y\n    y.left = T2\n    \n    // Update heights\n    y.height = MAX(HEIGHT(y.left), HEIGHT(y.right)) + 1\n    x.height = MAX(HEIGHT(x.left), HEIGHT(x.right)) + 1\n    \n    return x\n\nBefore rotation: y(height=3) with left child x(height=2)\nAfter RIGHT_ROTATE(y):\n```\n\nWhat is the new root of this subtree?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["x", "y", "T2", "NULL"],
    "answer": "x",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this binary tree level-order traversal:\n\n```\nfunction LEVEL_ORDER(root):\n    if root = NULL:\n        return []\n    \n    QUEUE = [root]\n    RESULT = []\n    \n    while QUEUE not empty:\n        level_size = length(QUEUE)\n        current_level = []\n        \n        for i = 0 to level_size - 1:\n            node = QUEUE.dequeue()\n            current_level.append(node.data)\n            \n            if node.left ≠ NULL:\n                _______________\n            if node.right ≠ NULL:\n                QUEUE.enqueue(node.right)\n        \n        RESULT.append(current_level)\n    \n    return RESULT\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["QUEUE.enqueue(node.left)", "current_level.append(node.left)", "RESULT.append(node.left)", "node.left = QUEUE.dequeue()"],
    "answer": "QUEUE.enqueue(node.left)",
    "difficulty": "EASY"
  },

  // More Graphs questions
  {
    "text": "Given this Dijkstra's shortest path algorithm:\n\n```\nGRAPH = {\n    0: [(1, 4), (2, 1)],\n    1: [(3, 1)],\n    2: [(1, 2), (3, 5)],\n    3: []\n}\nSOURCE = 0\nDISTANCE = [0, infinity, infinity, infinity]\nVISITED = [FALSE, FALSE, FALSE, FALSE]\nPRIORITY_QUEUE = [(0, 0)]  // (distance, vertex)\n\nwhile PRIORITY_QUEUE not empty:\n    current_dist, u = PRIORITY_QUEUE.extract_min()\n    \n    if VISITED[u]:\n        continue\n    VISITED[u] = TRUE\n    \n    for neighbor, weight in GRAPH[u]:\n        if DISTANCE[u] + weight < DISTANCE[neighbor]:\n            DISTANCE[neighbor] = DISTANCE[u] + weight\n            PRIORITY_QUEUE.insert((DISTANCE[neighbor], neighbor))\n```\n\nWhat is DISTANCE[3] after algorithm completion?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["3", "5", "6", "4"],
    "answer": "5",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this topological sort using DFS:\n\n```\nGRAPH = {0: [1, 2], 1: [3], 2: [3], 3: []}\nVISITED = [FALSE, FALSE, FALSE, FALSE]\nSTACK = empty stack\n\nfunction TOPOLOGICAL_SORT_DFS(node):\n    VISITED[node] = TRUE\n    \n    for neighbor in GRAPH[node]:\n        if not VISITED[neighbor]:\n            TOPOLOGICAL_SORT_DFS(neighbor)\n    \n    _______________\n\nfor vertex = 0 to 3:\n    if not VISITED[vertex]:\n        TOPOLOGICAL_SORT_DFS(vertex)\n\nwhile STACK not empty:\n    PRINT(STACK.pop())\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["STACK.push(node)", "STACK.push(neighbor)", "PRINT(node)", "VISITED[node] = FALSE"],
    "answer": "STACK.push(node)",
    "difficulty": "MEDIUM"
  },

  // More Dynamic Programming questions
  {
    "text": "Given this longest increasing subsequence DP:\n\n```\nARRAY = [10, 9, 2, 5, 3, 7, 101, 18]\nn = length(ARRAY)\nDP = array of size n, all 1\n\nfor i = 1 to n - 1:\n    for j = 0 to i - 1:\n        if ARRAY[j] < ARRAY[i]:\n            DP[i] = MAX(DP[i], DP[j] + 1)\n\nreturn MAX(DP)\n```\n\nWhat is the length of the longest increasing subsequence?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["4", "5", "3", "6"],
    "answer": "4",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this knapsack 0/1 DP algorithm:\n\n```\nWEIGHTS = [1, 3, 4, 5]\nVALUES = [1, 4, 5, 7]\nCAPACITY = 7\nn = length(WEIGHTS)\nDP = 2D array of size (n+1) x (CAPACITY+1), all 0\n\nfor i = 1 to n:\n    for w = 1 to CAPACITY:\n        if WEIGHTS[i-1] ≤ w:\n            _______________\n        else:\n            DP[i][w] = DP[i-1][w]\n\nreturn DP[n][CAPACITY]\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["DP[i][w] = MAX(VALUES[i-1] + DP[i-1][w-WEIGHTS[i-1]], DP[i-1][w])", "DP[i][w] = VALUES[i-1] + DP[i-1][w-WEIGHTS[i-1]]", "DP[i][w] = DP[i-1][w] + VALUES[i-1]", "DP[i][w] = MAX(DP[i-1][w], VALUES[i-1])"],
    "answer": "DP[i][w] = MAX(VALUES[i-1] + DP[i-1][w-WEIGHTS[i-1]], DP[i-1][w])",
    "difficulty": "MEDIUM"
  },

  // More Two Pointers questions
  {
    "text": "Given this three-sum algorithm:\n\n```\nARRAY = [-1, 0, 1, 2, -1, -4]\nSORT(ARRAY)  // [-4, -1, -1, 0, 1, 2]\nRESULT = []\n\nfor i = 0 to length(ARRAY) - 3:\n    if i > 0 and ARRAY[i] = ARRAY[i-1]:\n        continue\n    \n    left = i + 1\n    right = length(ARRAY) - 1\n    \n    while left < right:\n        sum = ARRAY[i] + ARRAY[left] + ARRAY[right]\n        if sum = 0:\n            RESULT.append([ARRAY[i], ARRAY[left], ARRAY[right]])\n            while left < right and ARRAY[left] = ARRAY[left + 1]:\n                left = left + 1\n            while left < right and ARRAY[right] = ARRAY[right - 1]:\n                right = right - 1\n            left = left + 1\n            right = right - 1\n        elif sum < 0:\n            left = left + 1\n        else:\n            right = right - 1\n```\n\nHow many unique triplets sum to zero?",
    "type": "PREDICT_OUTPUT",
    "categories": ["TwoPointers", "Arrays"],
    "options": ["2", "1", "3", "0"],
    "answer": "2",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this container with most water algorithm:\n\n```\nHEIGHT = [1, 8, 6, 2, 5, 4, 8, 3, 7]\nleft = 0\nright = length(HEIGHT) - 1\nmax_area = 0\n\nwhile left < right:\n    width = right - left\n    height = MIN(HEIGHT[left], HEIGHT[right])\n    max_area = MAX(max_area, width * height)\n    \n    if HEIGHT[left] < HEIGHT[right]:\n        _______________\n    else:\n        right = right - 1\n\nreturn max_area\n```",
    "type": "FILL_BLANK",
    "categories": ["TwoPointers"],
    "options": ["left = left + 1", "right = right - 1", "left = right", "max_area = width * height"],
    "answer": "left = left + 1",
    "difficulty": "MEDIUM"
  },

  // Complex algorithm prediction questions
  {
    "text": "Given this advanced tree serialization:\n\n```\nTREE:\n       1\n      / \\\n     2   3\n        / \\\n       4   5\n\nfunction SERIALIZE(node):\n    if node = NULL:\n        return \"#\"\n    \n    result = STRING(node.data)\n    result += \",\" + SERIALIZE(node.left)\n    result += \",\" + SERIALIZE(node.right)\n    return result\n\nresult = SERIALIZE(root)\n```\n\nWhat is the serialized string?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees", "Strings"],
    "options": ["\"1,2,#,#,3,4,#,#,5,#,#\"", "\"1,2,3,4,5\"", "\"2,#,#,1,4,#,#,3,5,#,#\"", "\"1,2,3,#,#,4,5,#,#\""],
    "answer": "\"1,2,#,#,3,4,#,#,5,#,#\"",
    "difficulty": "HARD"
  },
  {
    "text": "Given this union-find with path compression:\n\n```\nPARENT = [0, 1, 2, 3, 4]\nRANK = [0, 0, 0, 0, 0]\n\nfunction FIND(x):\n    if PARENT[x] ≠ x:\n        PARENT[x] = FIND(PARENT[x])  // Path compression\n    return PARENT[x]\n\nfunction UNION(x, y):\n    root_x = FIND(x)\n    root_y = FIND(y)\n    \n    if root_x ≠ root_y:\n        if RANK[root_x] < RANK[root_y]:\n            PARENT[root_x] = root_y\n        elif RANK[root_x] > RANK[root_y]:\n            PARENT[root_y] = root_x\n        else:\n            PARENT[root_y] = root_x\n            RANK[root_x] = RANK[root_x] + 1\n\nUNION(1, 3)\nUNION(2, 4)\nUNION(1, 2)\n```\n\nAfter these operations, what is PARENT[4] after calling FIND(4)?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["1", "2", "3", "4"],
    "answer": "1",
    "difficulty": "HARD"
  }
];

// Combine with existing questions
const allQuestions = [...existingQuestions, ...moreCodeQuestions];

// Write back to file
fs.writeFileSync(questionsPath, JSON.stringify(allQuestions, null, 2));

console.log(`✅ Added ${moreCodeQuestions.length} more code-based questions`);
console.log(`📊 Total questions: ${allQuestions.length}`);

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

console.log('\n📊 UPDATED DISTRIBUTIONS:');
console.log('Type Distribution:', typeDistribution);
console.log('Difficulty Distribution:', difficultyDistribution);

console.log('\n📚 Frontend-Compatible Categories:');
const frontendCategories = ['Arrays', 'Strings', 'Trees', 'Graphs', 'Stacks', 'HashMaps', 
                           'SlidingWindow', 'DynamicProgramming', 'TwoPointers', 'BinarySearch', 'Sorting', 'Recursion'];
frontendCategories.forEach(cat => {
  const count = categoryDistribution[cat] || 0;
  console.log(`  ${cat}: ${count} questions`);
});

console.log('\n🎯 Key Improvements:');
console.log('✅ More PREDICT_OUTPUT questions for code analysis');
console.log('✅ More FILL_BLANK questions for code completion');
console.log('✅ Better coverage of all frontend practice topics');
console.log('✅ Complex algorithms with step-by-step execution');
console.log('✅ All questions in pseudo-algorithmic language style');
