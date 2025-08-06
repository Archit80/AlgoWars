import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current questions file
const questionsPath = path.join(__dirname, 'leetcode_mcq_questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Additional questions to reach 200+ total
const additionalQuestions = [
  {
    "text": "Given this sliding window maximum:\n\n```\nARRAY = [1, 3, -1, -3, 5, 3, 6, 7]\nWINDOW_SIZE = 3\nresult = []\ndeque = empty deque\n\nfor i = 0 to length(ARRAY) - 1:\n    // Remove elements outside window\n    while not deque.isEmpty() and deque.front() <= i - WINDOW_SIZE:\n        deque.removeFront()\n    \n    // Remove smaller elements\n    while not deque.isEmpty() and ARRAY[deque.back()] <= ARRAY[i]:\n        deque.removeBack()\n    \n    deque.addBack(i)\n    \n    if i >= WINDOW_SIZE - 1:\n        result.append(ARRAY[deque.front()])\n```\n\nWhat is the maximum in the first window [1, 3, -1]?",
    "type": "PREDICT_OUTPUT",
    "categories": ["SlidingWindow", "Deque"],
    "options": ["1", "3", "-1", "2"],
    "answer": "3",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this graph DFS traversal:\n\n```\nGRAPH = {0: [1, 2], 1: [0, 3], 2: [0, 4], 3: [1], 4: [2]}\nvisited = empty set\nresult = []\n\nfunction dfs(node):\n    if node in visited:\n        return\n    \n    _______________\n    result.append(node)\n    \n    for neighbor in GRAPH[node]:\n        dfs(neighbor)\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs", "DFS"],
    "options": ["visited.add(node)", "visited.remove(node)", "result.append(node)", "GRAPH[node].visited = true"],
    "answer": "visited.add(node)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this BFS level order traversal:\n\n```\ntree = [3, 9, 20, null, null, 15, 7]\nQUEUE = [root]\nresult = []\n\nwhile not QUEUE.isEmpty():\n    level_size = QUEUE.size()\n    current_level = []\n    \n    for i = 0 to level_size - 1:\n        node = QUEUE.dequeue()\n        current_level.append(node.val)\n        \n        if node.left:\n            QUEUE.enqueue(node.left)\n        if node.right:\n            QUEUE.enqueue(node.right)\n    \n    result.append(current_level)\n```\n\nWhat is the second level in the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees", "BFS"],
    "options": ["[9, 20]", "[15, 7]", "[3]", "[9, 20, 15, 7]"],
    "answer": "[9, 20]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "In a Trie data structure, what is the primary advantage?",
    "type": "MCQ",
    "categories": ["Trie"],
    "options": ["O(1) search time", "O(m) search time where m is key length", "Uses less memory than hash table", "Supports only string keys"],
    "answer": "O(m) search time where m is key length",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this Union-Find implementation:\n\n```\nclass UnionFind:\n    def __init__(size):\n        self.parent = [i for i in range(size)]\n        self.rank = [0] * size\n    \n    def find(x):\n        if self.parent[x] != x:\n            _______________\n        return self.parent[x]\n    \n    def union(x, y):\n        px, py = self.find(x), self.find(y)\n        if px == py:\n            return\n        if self.rank[px] < self.rank[py]:\n            self.parent[px] = py\n        elif self.rank[px] > self.rank[py]:\n            self.parent[py] = px\n        else:\n            self.parent[py] = px\n            self.rank[px] += 1\n```",
    "type": "FILL_BLANK",
    "categories": ["UnionFind"],
    "options": ["self.parent[x] = self.find(self.parent[x])", "self.parent[x] = x", "return self.parent[x]", "self.rank[x] += 1"],
    "answer": "self.parent[x] = self.find(self.parent[x])",
    "difficulty": "HARD"
  },
  {
    "text": "Given this Dijkstra's algorithm:\n\n```\nGRAPH = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}\nSTART = 0\ndistances = [infinity] * 4\ndistances[START] = 0\npq = [(0, START)]\n\nwhile pq:\n    current_dist, u = pq.extractMin()\n    \n    if current_dist > distances[u]:\n        continue\n    \n    for v, weight in GRAPH[u]:\n        distance = current_dist + weight\n        if distance < distances[v]:\n            distances[v] = distance\n            pq.insert((distance, v))\n```\n\nWhat is the shortest distance from 0 to 3?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs", "Dijkstra"],
    "options": ["5", "3", "6", "4"],
    "answer": "5",
    "difficulty": "HARD"
  },
  {
    "text": "In topological sorting, what condition must the graph satisfy?",
    "type": "MCQ",
    "categories": ["Graphs", "TopologicalSort"],
    "options": ["Must be connected", "Must be acyclic", "Must be weighted", "Must be undirected"],
    "answer": "Must be acyclic",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this knapsack DP:\n\n```\nWEIGHTS = [1, 3, 4, 5]\nVALUES = [1, 4, 5, 7]\nCAPACITY = 7\nn = length(WEIGHTS)\ndp = 2D array of size (n+1) x (CAPACITY+1), all zeros\n\nfor i = 1 to n:\n    for w = 1 to CAPACITY:\n        if WEIGHTS[i-1] <= w:\n            dp[i][w] = max(VALUES[i-1] + dp[i-1][w-WEIGHTS[i-1]], dp[i-1][w])\n        else:\n            dp[i][w] = dp[i-1][w]\n```\n\nWhat is dp[2][4] (considering first 2 items with capacity 4)?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["4", "5", "1", "0"],
    "answer": "5",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this LRU Cache implementation:\n\n```\nclass LRUCache:\n    def __init__(capacity):\n        self.capacity = capacity\n        self.cache = {}\n        self.order = DoublyLinkedList()\n    \n    def get(key):\n        if key not in self.cache:\n            return -1\n        \n        node = self.cache[key]\n        _______________\n        self.order.moveToFront(node)\n        return node.value\n```",
    "type": "FILL_BLANK",
    "categories": ["Design", "LinkedLists"],
    "options": ["self.order.remove(node)", "value = node.value", "self.cache[key] = node", "node.visited = true"],
    "answer": "value = node.value",
    "difficulty": "HARD"
  },
  {
    "text": "In a min heap, what is the relationship between parent and children?",
    "type": "MCQ",
    "categories": ["Heaps"],
    "options": ["Parent ≥ Children", "Parent ≤ Children", "Parent = Children", "No relationship"],
    "answer": "Parent ≤ Children",
    "difficulty": "EASY"
  },
  {
    "text": "Given this heap sort algorithm:\n\n```\nARRAY = [4, 10, 3, 5, 1]\n\nfunction heapify(arr, n, i):\n    largest = i\n    left = 2 * i + 1\n    right = 2 * i + 2\n    \n    if left < n and arr[left] > arr[largest]:\n        largest = left\n    if right < n and arr[right] > arr[largest]:\n        largest = right\n    \n    if largest != i:\n        swap(arr[i], arr[largest])\n        heapify(arr, n, largest)\n\nfunction heapSort(arr):\n    n = length(arr)\n    \n    // Build max heap\n    for i = n//2 - 1 down to 0:\n        heapify(arr, n, i)\n    \n    // Extract elements\n    for i = n-1 down to 1:\n        swap(arr[0], arr[i])\n        heapify(arr, i, 0)\n```\n\nAfter building the max heap, what is arr[0]?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Heaps", "Sorting"],
    "options": ["10", "4", "5", "1"],
    "answer": "10",
    "difficulty": "MEDIUM"
  },
  {
    "text": "What is the time complexity of building a heap from an unsorted array?",
    "type": "MCQ",
    "categories": ["Heaps"],
    "options": ["O(n log n)", "O(n)", "O(log n)", "O(n²)"],
    "answer": "O(n)",
    "difficulty": "HARD"
  },
  {
    "text": "Given this quicksort partition:\n\n```\nARRAY = [3, 6, 8, 10, 1, 2, 1]\nPIVOT = ARRAY[length(ARRAY) - 1]  // Last element\ni = -1\n\nfor j = 0 to length(ARRAY) - 2:\n    if ARRAY[j] <= PIVOT:\n        i = i + 1\n        swap(ARRAY[i], ARRAY[j])\n\nswap(ARRAY[i + 1], ARRAY[length(ARRAY) - 1])\nreturn i + 1\n```\n\nWhat is the final position of the pivot?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Sorting", "DivideConquer"],
    "options": ["3", "2", "4", "1"],
    "answer": "3",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this merge sort implementation:\n\n```\nfunction mergeSort(arr, left, right):\n    if left < right:\n        mid = (left + right) // 2\n        _______________\n        mergeSort(arr, mid + 1, right)\n        merge(arr, left, mid, right)\n```",
    "type": "FILL_BLANK",
    "categories": ["Sorting", "DivideConquer"],
    "options": ["mergeSort(arr, left, mid)", "mergeSort(arr, left, right)", "merge(arr, left, mid)", "sort(arr, left, mid)"],
    "answer": "mergeSort(arr, left, mid)",
    "difficulty": "EASY"
  },
  {
    "text": "What is the space complexity of merge sort?",
    "type": "MCQ",
    "categories": ["Sorting"],
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "answer": "O(n)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this backtracking N-Queens solution:\n\n```\nN = 4\nboard = N x N matrix, all zeros\nsolutions = []\n\nfunction isValid(board, row, col):\n    // Check column\n    for i = 0 to row - 1:\n        if board[i][col] == 1:\n            return false\n    \n    // Check diagonals\n    for i = row - 1, j = col - 1; i >= 0 and j >= 0; i--, j--:\n        if board[i][j] == 1:\n            return false\n    \n    for i = row - 1, j = col + 1; i >= 0 and j < N; i--, j++:\n        if board[i][j] == 1:\n            return false\n    \n    return true\n\nfunction solve(board, row):\n    if row == N:\n        solutions.append(copy(board))\n        return\n    \n    for col = 0 to N - 1:\n        if isValid(board, row, col):\n            board[row][col] = 1\n            solve(board, row + 1)\n            board[row][col] = 0\n```\n\nHow many solutions exist for N = 4?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Backtracking"],
    "options": ["2", "1", "4", "0"],
    "answer": "2",
    "difficulty": "HARD"
  },
  {
    "text": "In backtracking, what does the 'pruning' step accomplish?",
    "type": "MCQ",
    "categories": ["Backtracking"],
    "options": ["Removes invalid branches early", "Sorts the solution space", "Finds optimal solution", "Reduces memory usage"],
    "answer": "Removes invalid branches early",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this interval merging:\n\n```\nINTERVALS = [[1,3], [2,6], [8,10], [15,18]]\nsort(INTERVALS by start time)\nmerged = []\n\nfor interval in INTERVALS:\n    if merged is empty or merged[-1][1] < interval[0]:\n        merged.append(interval)\n    else:\n        merged[-1][1] = max(merged[-1][1], interval[1])\n```\n\nWhat is the final merged result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays", "Intervals"],
    "options": ["[[1,6], [8,10], [15,18]]", "[[1,3], [2,6], [8,10], [15,18]]", "[[1,18]]", "[[1,6], [8,18]]"],
    "answer": "[[1,6], [8,10], [15,18]]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this segment tree query:\n\n```\nclass SegmentTree:\n    def __init__(arr):\n        self.n = length(arr)\n        self.tree = [0] * (4 * self.n)\n        self.build(arr, 0, 0, self.n - 1)\n    \n    def query(node, start, end, l, r):\n        if r < start or end < l:\n            return 0\n        if l <= start and end <= r:\n            return self.tree[node]\n        \n        mid = (start + end) // 2\n        left_sum = self.query(2*node+1, start, mid, l, r)\n        right_sum = _______________\n        return left_sum + right_sum\n```",
    "type": "FILL_BLANK",
    "categories": ["SegmentTree"],
    "options": ["self.query(2*node+2, mid+1, end, l, r)", "self.query(2*node+1, mid+1, end, l, r)", "self.query(node+1, mid+1, end, l, r)", "self.query(2*node, mid+1, end, l, r)"],
    "answer": "self.query(2*node+2, mid+1, end, l, r)",
    "difficulty": "HARD"
  },
  {
    "text": "What is the primary use case for a segment tree?",
    "type": "MCQ",
    "categories": ["SegmentTree"],
    "options": ["Fast insertion and deletion", "Range queries and updates", "Finding shortest paths", "Storing key-value pairs"],
    "answer": "Range queries and updates",
    "difficulty": "MEDIUM"
  }
];

// Combine existing and new questions
const allQuestions = [...existingQuestions, ...additionalQuestions];

// Write back to file
fs.writeFileSync(questionsPath, JSON.stringify(allQuestions, null, 2));

console.log(`Total questions now: ${allQuestions.length}`);

// Check distribution
const typeDistribution = allQuestions.reduce((acc, q) => {
  acc[q.type] = (acc[q.type] || 0) + 1;
  return acc;
}, {});

const difficultyDistribution = allQuestions.reduce((acc, q) => {
  acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
  return acc;
}, {});

console.log('Final Type Distribution:', typeDistribution);
console.log('Final Difficulty Distribution:', difficultyDistribution);
