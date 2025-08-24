import fs from 'fs';

// Read existing questions
const existingQuestions = JSON.parse(fs.readFileSync('src/db/leetcode_mcq_questions.json', 'utf8'));

// New detailed pseudocode algorithm questions
const newPseudocodeQuestions = [
  // Sorting Algorithms
  {
    text: `Complete this heap sort heapify operation:

\`\`\`
ARRAY = [4, 10, 3, 5, 1]
n = 5
i = 1  // Index to heapify from

function HEAPIFY(ARRAY, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and ARRAY[left] > ARRAY[largest]:
        largest = left
    
    if right < n and ARRAY[right] > ARRAY[largest]:
        largest = right
    
    if largest ≠ i:
        _______________
        HEAPIFY(ARRAY, n, largest)
\`\`\``,
    type: "FILL_BLANK",
    categories: ["Sorting", "Trees"],
    options: [
      "SWAP(ARRAY[i], ARRAY[largest])",
      "ARRAY[i] = ARRAY[largest]",
      "largest = i",
      "return ARRAY"
    ],
    answer: "SWAP(ARRAY[i], ARRAY[largest])",
    difficulty: "MEDIUM"
  },
  {
    text: `Complete this quicksort partition operation:

\`\`\`
ARRAY = [3, 6, 8, 10, 1, 2, 1]
low = 0, high = 6

function PARTITION(ARRAY, low, high):
    pivot = ARRAY[high]
    i = low - 1
    
    for j = low to high - 1:
        if ARRAY[j] <= pivot:
            i = i + 1
            _______________
    
    SWAP(ARRAY[i + 1], ARRAY[high])
    return i + 1
\`\`\``,
    type: "FILL_BLANK",
    categories: ["Sorting", "Arrays"],
    options: [
      "SWAP(ARRAY[i], ARRAY[j])",
      "ARRAY[i] = ARRAY[j]",
      "i = j",
      "pivot = ARRAY[j]"
    ],
    answer: "SWAP(ARRAY[i], ARRAY[j])",
    difficulty: "MEDIUM"
  },
  {
    text: `Analyze this merge sort merge operation:

\`\`\`
LEFT = [3, 5, 8]
RIGHT = [2, 4, 7, 9]
RESULT = []
i = 0, j = 0

while i < LENGTH(LEFT) and j < LENGTH(RIGHT):
    if LEFT[i] <= RIGHT[j]:
        RESULT.add(LEFT[i])
        i = i + 1
    else:
        RESULT.add(RIGHT[j])
        j = j + 1

// Add remaining elements
while i < LENGTH(LEFT):
    RESULT.add(LEFT[i])
    i = i + 1
\`\`\`

What is the final RESULT array?`,
    type: "PREDICT_OUTPUT",
    categories: ["Sorting", "Arrays"],
    options: [
      "[2, 3, 4, 5, 7, 8, 9]",
      "[3, 2, 5, 4, 8, 7, 9]",
      "[2, 3, 4, 5, 8, 7, 9]",
      "[3, 5, 8, 2, 4, 7, 9]"
    ],
    answer: "[2, 3, 4, 5, 7, 8, 9]",
    difficulty: "MEDIUM"
  },

  // Graph Algorithms
  {
    text: `Complete this BFS algorithm:

\`\`\`
GRAPH = {A: [B, C], B: [D], C: [E], D: [], E: []}
QUEUE = [A]
VISITED = {A}
RESULT = []

while QUEUE is not empty:
    node = QUEUE.dequeue()
    RESULT.add(node)
    for neighbor in GRAPH[node]:
        if neighbor not in VISITED:
            _______________
            QUEUE.enqueue(neighbor)
\`\`\``,
    type: "FILL_BLANK",
    categories: ["Graphs", "StacksQueues"],
    options: [
      "VISITED.add(neighbor)",
      "RESULT.add(neighbor)",
      "neighbor = VISITED",
      "QUEUE.add(VISITED)"
    ],
    answer: "VISITED.add(neighbor)",
    difficulty: "MEDIUM"
  },
  {
    text: `Complete this DFS recursive implementation:

\`\`\`
GRAPH = {A: [B, C], B: [D], C: [E], D: [], E: []}
VISITED = set()
RESULT = []

function DFS(node):
    if node in VISITED:
        return
    
    _______________
    RESULT.add(node)
    
    for neighbor in GRAPH[node]:
        DFS(neighbor)
\`\`\``,
    type: "FILL_BLANK",
    categories: ["Graphs", "Recursion"],
    options: [
      "VISITED.add(node)",
      "RESULT.add(node)",
      "node = VISITED",
      "GRAPH[node] = VISITED"
    ],
    answer: "VISITED.add(node)",
    difficulty: "MEDIUM"
  },
  {
    text: `Analyze this Dijkstra's algorithm step:

\`\`\`
GRAPH = {
    A: {B: 4, C: 2},
    B: {C: 1, D: 5},
    C: {D: 8, E: 10},
    D: {E: 2},
    E: {}
}

DISTANCES = {A: 0, B: ∞, C: ∞, D: ∞, E: ∞}
VISITED = {}
CURRENT = A

// First iteration - visiting A
for neighbor in GRAPH[A]:
    new_distance = DISTANCES[A] + GRAPH[A][neighbor]
    if new_distance < DISTANCES[neighbor]:
        DISTANCES[neighbor] = new_distance
\`\`\`

After processing node A, what are the distances?`,
    type: "PREDICT_OUTPUT",
    categories: ["Graphs"],
    options: [
      "{A: 0, B: 4, C: 2, D: ∞, E: ∞}",
      "{A: 0, B: ∞, C: ∞, D: ∞, E: ∞}",
      "{A: 0, B: 4, C: 2, D: 5, E: 10}",
      "{A: 0, B: 2, C: 4, D: ∞, E: ∞}"
    ],
    answer: "{A: 0, B: 4, C: 2, D: ∞, E: ∞}",
    difficulty: "HARD"
  },

  // Tree Algorithms
  {
    text: `Complete this binary tree inorder traversal:

\`\`\`
TREE:
      4
     / \\
    2   6
   / \\ / \\
  1  3 5  7

function INORDER_TRAVERSAL(node):
    if node == NULL:
        return
    
    _______________
    PRINT(node.value)
    INORDER_TRAVERSAL(node.right)
\`\`\``,
    type: "FILL_BLANK",
    categories: ["Trees", "Recursion"],
    options: [
      "INORDER_TRAVERSAL(node.left)",
      "INORDER_TRAVERSAL(node.right)",
      "PRINT(node.value)",
      "return node"
    ],
    answer: "INORDER_TRAVERSAL(node.left)",
    difficulty: "EASY"
  },
  {
    text: `Analyze this AVL tree rotation:

\`\`\`
// Left-Left case rotation
function RIGHT_ROTATE(y):
    x = y.left
    T2 = x.right
    
    // Perform rotation
    x.right = y
    y.left = T2
    
    // Update heights
    y.height = MAX(HEIGHT(y.left), HEIGHT(y.right)) + 1
    x.height = MAX(HEIGHT(x.left), HEIGHT(x.right)) + 1
    
    return x

Before rotation:
    y
   /
  x
 /
T1

After rotation: ?
\`\`\``,
    type: "PREDICT_OUTPUT",
    categories: ["Trees"],
    options: [
      "x becomes root with y as right child",
      "y remains root with x as left child", 
      "T1 becomes root",
      "Structure remains unchanged"
    ],
    answer: "x becomes root with y as right child",
    difficulty: "HARD"
  },
  {
    text: `Complete this binary search tree insertion:

\`\`\`
BST:
      8
     / \\
    3   10
   / \\    \\
  1   6    14
     / \\   /
    4   7 13

function BST_INSERT(root, key):
    if root == NULL:
        return CREATE_NODE(key)
    
    if key < root.value:
        root.left = BST_INSERT(root.left, key)
    else if key > root.value:
        _______________
    
    return root

// Insert key = 5
\`\`\``,
    type: "FILL_BLANK",
    categories: ["Trees"],
    options: [
      "root.right = BST_INSERT(root.right, key)",
      "root.left = BST_INSERT(root.left, key)",
      "root.value = key",
      "return CREATE_NODE(key)"
    ],
    answer: "root.right = BST_INSERT(root.right, key)",
    difficulty: "MEDIUM"
  },

  // Dynamic Programming
  {
    text: `Complete this Fibonacci with memoization:

\`\`\`
MEMO = {}

function FIB_MEMO(n):
    if n in MEMO:
        return MEMO[n]
    
    if n <= 1:
        return n
    
    _______________
    return MEMO[n]
\`\`\``,
    type: "FILL_BLANK",
    categories: ["DynamicProgramming", "Recursion"],
    options: [
      "MEMO[n] = FIB_MEMO(n-1) + FIB_MEMO(n-2)",
      "MEMO[n] = n",
      "return FIB_MEMO(n-1) + FIB_MEMO(n-2)",
      "MEMO[n] = MEMO[n-1] + MEMO[n-2]"
    ],
    answer: "MEMO[n] = FIB_MEMO(n-1) + FIB_MEMO(n-2)",
    difficulty: "MEDIUM"
  },
  {
    text: `Analyze this 0/1 Knapsack DP solution:

\`\`\`
WEIGHTS = [1, 3, 4, 5]
VALUES = [1, 4, 5, 7]
CAPACITY = 7
n = 4

DP table after computation:
    W:  0  1  2  3  4  5  6  7
i=0:    0  1  1  1  1  1  1  1
i=1:    0  1  1  4  5  5  5  5
i=2:    0  1  1  4  5  6  6  9
i=3:    0  1  1  4  5  7  8  9

function KNAPSACK(i, w):
    if i == 0 or w == 0:
        return 0
    
    if WEIGHTS[i-1] <= w:
        return MAX(
            VALUES[i-1] + KNAPSACK(i-1, w-WEIGHTS[i-1]),
            KNAPSACK(i-1, w)
        )
    else:
        return KNAPSACK(i-1, w)
\`\`\`

What is the maximum value for capacity 7?`,
    type: "PREDICT_OUTPUT",
    categories: ["DynamicProgramming"],
    options: ["9", "8", "7", "10"],
    answer: "9",
    difficulty: "HARD"
  },
  {
    text: `Complete this Longest Common Subsequence DP:

\`\`\`
STRING1 = "AGGTAB"
STRING2 = "GXTXAYB"
m = 6, n = 7

function LCS(i, j):
    if i == 0 or j == 0:
        return 0
    
    if STRING1[i-1] == STRING2[j-1]:
        return 1 + LCS(i-1, j-1)
    else:
        _______________
\`\`\``,
    type: "FILL_BLANK",
    categories: ["DynamicProgramming", "Strings"],
    options: [
      "return MAX(LCS(i-1, j), LCS(i, j-1))",
      "return LCS(i-1, j-1)",
      "return MIN(LCS(i-1, j), LCS(i, j-1))",
      "return 0"
    ],
    answer: "return MAX(LCS(i-1, j), LCS(i, j-1))",
    difficulty: "MEDIUM"
  },

  // Hash Maps and Data Structures
  {
    text: `Complete this hash table with linear probing:

\`\`\`
TABLE_SIZE = 7
TABLE = [NULL, NULL, NULL, NULL, NULL, NULL, NULL]

function HASH_FUNCTION(key):
    return key % TABLE_SIZE

function INSERT(key, value):
    index = HASH_FUNCTION(key)
    
    while TABLE[index] != NULL:
        _______________
    
    TABLE[index] = (key, value)

// Insert keys: 10, 22, 31, 4, 15
\`\`\``,
    type: "FILL_BLANK",
    categories: ["HashMaps"],
    options: [
      "index = (index + 1) % TABLE_SIZE",
      "index = index + 1",
      "index = HASH_FUNCTION(index)",
      "TABLE[index] = NULL"
    ],
    answer: "index = (index + 1) % TABLE_SIZE",
    difficulty: "MEDIUM"
  },
  {
    text: `Analyze this LRU Cache implementation:

\`\`\`
CAPACITY = 3
CACHE = {}  // key -> node
HEAD = DummyNode()
TAIL = DummyNode()
HEAD.next = TAIL
TAIL.prev = HEAD

function GET(key):
    if key in CACHE:
        node = CACHE[key]
        // Move to head (most recently used)
        REMOVE_NODE(node)
        ADD_TO_HEAD(node)
        return node.value
    return -1

function PUT(key, value):
    if key in CACHE:
        node = CACHE[key]
        node.value = value
        REMOVE_NODE(node)
        ADD_TO_HEAD(node)
    else:
        if LENGTH(CACHE) >= CAPACITY:
            // Remove least recently used
            tail_node = TAIL.prev
            REMOVE_NODE(tail_node)
            del CACHE[tail_node.key]
        
        new_node = Node(key, value)
        ADD_TO_HEAD(new_node)
        CACHE[key] = new_node

// Operations: PUT(1,1), PUT(2,2), PUT(3,3), PUT(4,4), GET(1)
\`\`\`

What does GET(1) return after these operations?`,
    type: "PREDICT_OUTPUT",
    categories: ["HashMaps", "LinkedLists"],
    options: ["-1", "1", "4", "Error"],
    answer: "-1",
    difficulty: "HARD"
  },

  // Two Pointers and Sliding Window
  {
    text: `Complete this two pointers approach for 3Sum:

\`\`\`
ARRAY = [-1, 0, 1, 2, -1, -4]
SORTED_ARRAY = [-4, -1, -1, 0, 1, 2]
RESULT = []

for i = 0 to LENGTH(ARRAY) - 3:
    if i > 0 and SORTED_ARRAY[i] == SORTED_ARRAY[i-1]:
        continue  // Skip duplicates
    
    left = i + 1
    right = LENGTH(ARRAY) - 1
    
    while left < right:
        sum = SORTED_ARRAY[i] + SORTED_ARRAY[left] + SORTED_ARRAY[right]
        
        if sum == 0:
            RESULT.add([SORTED_ARRAY[i], SORTED_ARRAY[left], SORTED_ARRAY[right]])
            left = left + 1
            right = right - 1
            
            // Skip duplicates
            while left < right and SORTED_ARRAY[left] == SORTED_ARRAY[left-1]:
                left = left + 1
        elif sum < 0:
            _______________
        else:
            right = right - 1
\`\`\``,
    type: "FILL_BLANK",
    categories: ["TwoPointers", "Arrays"],
    options: [
      "left = left + 1",
      "right = right - 1", 
      "sum = sum + 1",
      "break"
    ],
    answer: "left = left + 1",
    difficulty: "MEDIUM"
  },
  {
    text: `Analyze this sliding window maximum:

\`\`\`
ARRAY = [1, 3, -1, -3, 5, 3, 6, 7]
WINDOW_SIZE = 3
DEQUE = []  // Stores indices
RESULT = []

for i = 0 to LENGTH(ARRAY) - 1:
    // Remove elements outside window
    while DEQUE and DEQUE[0] <= i - WINDOW_SIZE:
        DEQUE.pop_front()
    
    // Remove smaller elements from rear
    while DEQUE and ARRAY[DEQUE[-1]] <= ARRAY[i]:
        DEQUE.pop_back()
    
    DEQUE.push_back(i)
    
    // Add to result if window is complete
    if i >= WINDOW_SIZE - 1:
        RESULT.add(ARRAY[DEQUE[0]])
\`\`\`

What is the final RESULT array?`,
    type: "PREDICT_OUTPUT",
    categories: ["SlidingWindow", "StacksQueues"],
    options: [
      "[3, 3, 5, 5, 6, 7]",
      "[1, 3, -1, -3, 5, 3]",
      "[3, -1, 5, 6, 7]",
      "[1, 3, 5, 6, 7, 7]"
    ],
    answer: "[3, 3, 5, 5, 6, 7]",
    difficulty: "HARD"
  },

  // Binary Search Variations
  {
    text: `Complete this binary search for first occurrence:

\`\`\`
ARRAY = [1, 2, 2, 2, 3, 4, 5]
TARGET = 2

function FIRST_OCCURRENCE(array, target):
    left = 0
    right = LENGTH(array) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) / 2
        
        if array[mid] == target:
            result = mid
            _______________  // Continue searching left
        elif array[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
\`\`\``,
    type: "FILL_BLANK",
    categories: ["BinarySearch"],
    options: [
      "right = mid - 1",
      "left = mid + 1",
      "return mid",
      "result = -1"
    ],
    answer: "right = mid - 1",
    difficulty: "MEDIUM"
  },
  {
    text: `Analyze this binary search in rotated sorted array:

\`\`\`
ARRAY = [4, 5, 6, 7, 0, 1, 2]
TARGET = 0

function SEARCH_ROTATED(array, target):
    left = 0
    right = LENGTH(array) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if array[mid] == target:
            return mid
        
        // Check which half is sorted
        if array[left] <= array[mid]:  // Left half is sorted
            if target >= array[left] and target < array[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  // Right half is sorted
            if target > array[mid] and target <= array[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
\`\`\`

What index does this return for TARGET = 0?`,
    type: "PREDICT_OUTPUT",
    categories: ["BinarySearch", "Arrays"],
    options: ["4", "0", "-1", "6"],
    answer: "4",
    difficulty: "HARD"
  }
];

console.log(`Adding ${newPseudocodeQuestions.length} detailed pseudocode algorithm questions...`);

// Combine existing and new questions
const allQuestions = [...existingQuestions, ...newPseudocodeQuestions];

console.log(`Total questions: ${existingQuestions.length} + ${newPseudocodeQuestions.length} = ${allQuestions.length}`);

// Write back to file
fs.writeFileSync('src/db/leetcode_mcq_questions.json', JSON.stringify(allQuestions, null, 2));

console.log('Successfully added detailed pseudocode algorithm questions!');

// Show category distribution
const categoryCount = {};
allQuestions.forEach(q => {
  q.categories.forEach(cat => {
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
});

console.log('\nUpdated category distribution:');
Object.entries(categoryCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`${cat}: ${count} questions`);
  });
