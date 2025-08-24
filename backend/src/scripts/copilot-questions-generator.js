// copilot-questions-generator.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All algorithm topics from your array
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

// Generated questions for all topics
const generatedQuestions = [
  // Bubble Sort
  {
    "text": "What is the time complexity of Bubble Sort in the worst case?\n\n```\nfor i = 0 to LENGTH(ARRAY) - 2:\n    for j = 0 to LENGTH(ARRAY) - i - 2:\n        if ARRAY[j] > ARRAY[j+1]:\n            SWAP(ARRAY[j], ARRAY[j+1])\n```",
    "type": "MCQ",
    "categories": ["Sorting"],
    "options": ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
    "answer": "O(n²)",
    "difficulty": "EASY"
  },
  {
    "text": "Trace Bubble Sort on ARRAY = [3, 1, 4]. What is the ARRAY after the first complete pass?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Sorting"],
    "options": ["[1, 3, 4]", "[3, 1, 4]", "[1, 4, 3]", "[4, 3, 1]"],
    "answer": "[1, 3, 4]",
    "difficulty": "EASY"
  },
  {
    "text": "Complete the Bubble Sort algorithm:\n\n```\nfor i = 0 to LENGTH(ARRAY) - 2:\n    for j = 0 to LENGTH(ARRAY) - i - 2:\n        if ARRAY[j] > ARRAY[j+1]:\n            _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Sorting"],
    "options": ["SWAP(ARRAY[j], ARRAY[j+1])", "ARRAY[j] = 0", "j = j + 1", "BREAK"],
    "answer": "SWAP(ARRAY[j], ARRAY[j+1])",
    "difficulty": "EASY"
  },

  // Merge Sort
  {
    "text": "What is the key principle behind Merge Sort?\n\n```\nFUNCTION MergeSort(ARRAY):\n    if LENGTH(ARRAY) <= 1: return ARRAY\n    mid = LENGTH(ARRAY) / 2\n    left = MergeSort(ARRAY[0:mid])\n    right = MergeSort(ARRAY[mid:LENGTH(ARRAY)])\n    return Merge(left, right)\n```",
    "type": "MCQ",
    "categories": ["Sorting"],
    "options": ["Divide and conquer", "Greedy approach", "Dynamic programming", "Brute force"],
    "answer": "Divide and conquer",
    "difficulty": "MEDIUM"
  },
  {
    "text": "What is the result of merging [1, 5] and [2, 3] in Merge Sort?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Sorting"],
    "options": ["[1, 2, 3, 5]", "[1, 5, 2, 3]", "[2, 1, 3, 5]", "[5, 3, 2, 1]"],
    "answer": "[1, 2, 3, 5]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete the merge function:\n\n```\nwhile i < LENGTH(left) AND j < LENGTH(right):\n    if left[i] <= right[j]:\n        result.APPEND(left[i])\n        i = i + 1\n    else:\n        _______________\n        j = j + 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Sorting"],
    "options": ["result.APPEND(right[j])", "result.APPEND(left[i])", "SWAP(left[i], right[j])", "BREAK"],
    "answer": "result.APPEND(right[j])",
    "difficulty": "MEDIUM"
  },

  // Quick Sort
  {
    "text": "In Quick Sort, what does the partition function do?\n\n```\nFUNCTION QuickSort(ARRAY, low, high):\n    if low < high:\n        pi = Partition(ARRAY, low, high)\n        QuickSort(ARRAY, low, pi-1)\n        QuickSort(ARRAY, pi+1, high)\n```",
    "type": "MCQ",
    "categories": ["Sorting"],
    "options": ["Sorts the entire array", "Divides array around pivot", "Finds minimum element", "Reverses the array"],
    "answer": "Divides array around pivot",
    "difficulty": "MEDIUM"
  },
  {
    "text": "After partitioning [5, 2, 8, 1] with pivot 5, what could be a valid result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Sorting"],
    "options": ["[2, 1, 5, 8]", "[5, 2, 8, 1]", "[8, 5, 2, 1]", "[1, 2, 8, 5]"],
    "answer": "[2, 1, 5, 8]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete the partition logic:\n\n```\nfor j = low to high - 1:\n    if ARRAY[j] < pivot:\n        SWAP(ARRAY[i], ARRAY[j])\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Sorting"],
    "options": ["i = i + 1", "j = j + 1", "pivot = ARRAY[j]", "BREAK"],
    "answer": "i = i + 1",
    "difficulty": "MEDIUM"
  },

  // Heap Sort
  {
    "text": "What data structure does Heap Sort use?\n\n```\nFUNCTION HeapSort(ARRAY):\n    BuildMaxHeap(ARRAY)\n    for i = LENGTH(ARRAY) - 1 down to 1:\n        SWAP(ARRAY[0], ARRAY[i])\n        MaxHeapify(ARRAY, 0, i)\n```",
    "type": "MCQ",
    "categories": ["Sorting"],
    "options": ["Binary heap", "Hash table", "Linked list", "Stack"],
    "answer": "Binary heap",
    "difficulty": "HARD"
  },
  {
    "text": "In a max heap [9, 7, 6, 2, 1], after removing the root, what is the first step?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Sorting"],
    "options": ["Move 1 to root", "Move 7 to root", "Move 6 to root", "Remove 7"],
    "answer": "Move 1 to root",
    "difficulty": "HARD"
  },
  {
    "text": "Complete the heapify process:\n\n```\nlargest = i\nif left < size AND ARRAY[left] > ARRAY[largest]:\n    largest = left\nif right < size AND ARRAY[right] > ARRAY[largest]:\n    largest = right\nif largest != i:\n    _______________\n    MaxHeapify(ARRAY, largest, size)\n```",
    "type": "FILL_BLANK",
    "categories": ["Sorting"],
    "options": ["SWAP(ARRAY[i], ARRAY[largest])", "ARRAY[i] = 0", "largest = i", "RETURN"],
    "answer": "SWAP(ARRAY[i], ARRAY[largest])",
    "difficulty": "HARD"
  },

  // Binary Search
  {
    "text": "What is the time complexity of Binary Search?\n\n```\nFUNCTION BinarySearch(ARRAY, target):\n    left = 0, right = LENGTH(ARRAY) - 1\n    while left <= right:\n        mid = (left + right) / 2\n        if ARRAY[mid] == target: return mid\n        else if ARRAY[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    "answer": "O(log n)",
    "difficulty": "EASY"
  },
  {
    "text": "Binary search for 7 in [1, 3, 5, 7, 9]. What is mid on the first iteration?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["2 (value 5)", "1 (value 3)", "3 (value 7)", "0 (value 1)"],
    "answer": "2 (value 5)",
    "difficulty": "EASY"
  },
  {
    "text": "Complete the binary search:\n\n```\nif ARRAY[mid] == target:\n    return mid\nelse if ARRAY[mid] < target:\n    _______________\nelse:\n    right = mid - 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["left = mid + 1", "right = mid + 1", "left = mid - 1", "mid = mid + 1"],
    "answer": "left = mid + 1",
    "difficulty": "EASY"
  },

  // Two Pointers
  {
    "text": "What is the main advantage of the Two Pointers technique?\n\n```\nleft = 0, right = LENGTH(ARRAY) - 1\nwhile left < right:\n    if ARRAY[left] + ARRAY[right] == target:\n        return [left, right]\n    else if ARRAY[left] + ARRAY[right] < target:\n        left = left + 1\n    else:\n        right = right - 1\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Reduces time complexity", "Uses less memory", "Easier to implement", "Works on unsorted arrays"],
    "answer": "Reduces time complexity",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Two pointers on [1, 2, 7, 11] looking for sum 9. After first iteration, what are the pointers?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["left=1, right=3", "left=0, right=2", "left=1, right=2", "left=0, right=3"],
    "answer": "left=1, right=3",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete the two pointers logic:\n\n```\nif ARRAY[left] + ARRAY[right] == target:\n    return [left, right]\nelse if ARRAY[left] + ARRAY[right] < target:\n    _______________\nelse:\n    right = right - 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["left = left + 1", "right = right + 1", "left = left - 1", "BREAK"],
    "answer": "left = left + 1",
    "difficulty": "MEDIUM"
  },

  // Continue with remaining topics...
  // For brevity, I'll add a few more key ones. You can extend this pattern.

  // DFS Traversal
  {
    "text": "What data structure does DFS typically use?\n\n```\nFUNCTION DFS(graph, start, visited):\n    visited[start] = true\n    PRINT(start)\n    for neighbor in graph[start]:\n        if NOT visited[neighbor]:\n            DFS(graph, neighbor, visited)\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Stack (recursion)", "Queue", "Heap", "Hash table"],
    "answer": "Stack (recursion)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "DFS on graph: A->[B,C], B->[D], C->[E]. Starting from A, what is a possible order?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["A, B, D, C, E", "A, C, E, B, D", "Both are possible", "A, B, C, D, E"],
    "answer": "Both are possible",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete the DFS:\n\n```\nvisited[start] = true\nPRINT(start)\nfor neighbor in graph[start]:\n    if NOT visited[neighbor]:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["DFS(graph, neighbor, visited)", "visited[neighbor] = true", "PRINT(neighbor)", "CONTINUE"],
    "answer": "DFS(graph, neighbor, visited)",
    "difficulty": "MEDIUM"
  },

  // Fibonacci DP
  {
    "text": "What is the time complexity of the DP solution for Fibonacci?\n\n```\nFUNCTION Fibonacci(n):\n    dp[0] = 0, dp[1] = 1\n    for i = 2 to n:\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["O(n)", "O(2^n)", "O(log n)", "O(n²)"],
    "answer": "O(n)",
    "difficulty": "EASY"
  },
  {
    "text": "Using DP, what is Fibonacci(5)? (F(0)=0, F(1)=1)",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["5", "8", "3", "13"],
    "answer": "5",
    "difficulty": "EASY"
  },
  {
    "text": "Complete the Fibonacci DP:\n\n```\ndp[0] = 0, dp[1] = 1\nfor i = 2 to n:\n    _______________\nreturn dp[n]\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i] = dp[i-1] + dp[i-2]", "dp[i] = dp[i-1] * dp[i-2]", "dp[i] = i", "dp[i] = dp[i-1]"],
    "answer": "dp[i] = dp[i-1] + dp[i-2]",
    "difficulty": "EASY"
  },

  // Sliding Window
  {
    "text": "What is the main characteristic of the Sliding Window technique?\n\n```\nFUNCTION MaxSubarraySum(ARRAY, k):\n    windowSum = 0\n    for i = 0 to k-1:\n        windowSum = windowSum + ARRAY[i]\n    maxSum = windowSum\n    for i = k to LENGTH(ARRAY)-1:\n        windowSum = windowSum - ARRAY[i-k] + ARRAY[i]\n        maxSum = MAX(maxSum, windowSum)\n    return maxSum\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Fixed window size moves through array", "Dynamic window size", "Requires sorted array", "Uses recursion"],
    "answer": "Fixed window size moves through array",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Sliding window of size 3 on [1, 4, 2, 1, 5]. What is the maximum sum?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["8", "7", "10", "6"],
    "answer": "8",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete the sliding window:\n\n```\nfor i = k to LENGTH(ARRAY)-1:\n    windowSum = windowSum - ARRAY[i-k] + ARRAY[i]\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["maxSum = MAX(maxSum, windowSum)", "windowSum = 0", "i = i + k", "BREAK"],
    "answer": "maxSum = MAX(maxSum, windowSum)",
    "difficulty": "MEDIUM"
  },

  // Kadane's Algorithm
  {
    "text": "What problem does Kadane's Algorithm solve?\n\n```\nFUNCTION MaxSubarraySum(ARRAY):\n    maxSoFar = ARRAY[0]\n    maxEndingHere = ARRAY[0]\n    for i = 1 to LENGTH(ARRAY)-1:\n        maxEndingHere = MAX(ARRAY[i], maxEndingHere + ARRAY[i])\n        maxSoFar = MAX(maxSoFar, maxEndingHere)\n    return maxSoFar\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Maximum subarray sum", "Minimum subarray sum", "Array sorting", "Element searching"],
    "answer": "Maximum subarray sum",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Kadane's algorithm on [-2, 1, -3, 4, -1, 2, 1, -5, 4]. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["6", "4", "7", "5"],
    "answer": "6",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Kadane's algorithm:\n\n```\nfor i = 1 to LENGTH(ARRAY)-1:\n    maxEndingHere = MAX(ARRAY[i], maxEndingHere + ARRAY[i])\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["maxSoFar = MAX(maxSoFar, maxEndingHere)", "maxEndingHere = 0", "maxSoFar = ARRAY[i]", "RETURN maxSoFar"],
    "answer": "maxSoFar = MAX(maxSoFar, maxEndingHere)",
    "difficulty": "MEDIUM"
  },

  // Binary Tree Traversal
  {
    "text": "What is the order of Inorder traversal?\n\n```\nFUNCTION Inorder(node):\n    if node != NULL:\n        Inorder(node.left)\n        PRINT(node.data)\n        Inorder(node.right)\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["Left, Root, Right", "Root, Left, Right", "Left, Right, Root", "Right, Root, Left"],
    "answer": "Left, Root, Right",
    "difficulty": "EASY"
  },
  {
    "text": "Inorder traversal of tree: Root=4, Left=2, Right=6. What is the output?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["2, 4, 6", "4, 2, 6", "2, 6, 4", "6, 4, 2"],
    "answer": "2, 4, 6",
    "difficulty": "EASY"
  },
  {
    "text": "Complete the Preorder traversal:\n\n```\nFUNCTION Preorder(node):\n    if node != NULL:\n        _______________\n        Preorder(node.left)\n        Preorder(node.right)\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["PRINT(node.data)", "node = node.left", "RETURN", "node.data = 0"],
    "answer": "PRINT(node.data)",
    "difficulty": "EASY"
  },

  // BST Operations
  {
    "text": "What is the average time complexity of search in BST?\n\n```\nFUNCTION Search(root, key):\n    if root == NULL OR root.data == key:\n        return root\n    if key < root.data:\n        return Search(root.left, key)\n    return Search(root.right, key)\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
    "answer": "O(log n)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Insert 5 into BST [3, 1, 7, 6, 9]. Where does 5 go?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["Left child of 6", "Right child of 3", "Left child of 7", "Right child of 1"],
    "answer": "Left child of 6",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete BST insertion:\n\n```\nif key < root.data:\n    if root.left == NULL:\n        root.left = NEW_NODE(key)\n    else:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["Insert(root.left, key)", "Insert(root.right, key)", "root.left = NULL", "RETURN"],
    "answer": "Insert(root.left, key)",
    "difficulty": "MEDIUM"
  },

  // BFS Traversal
  {
    "text": "What data structure does BFS use?\n\n```\nFUNCTION BFS(graph, start):\n    queue = EMPTY_QUEUE\n    visited = EMPTY_SET\n    queue.ENQUEUE(start)\n    visited.ADD(start)\n    while NOT queue.EMPTY():\n        node = queue.DEQUEUE()\n        PRINT(node)\n        for neighbor in graph[node]:\n            if neighbor NOT IN visited:\n                queue.ENQUEUE(neighbor)\n                visited.ADD(neighbor)\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Queue", "Stack", "Heap", "Hash table"],
    "answer": "Queue",
    "difficulty": "MEDIUM"
  },
  {
    "text": "BFS on graph: A->[B,C], B->[D], C->[E]. Starting from A, what is the order?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["A, B, C, D, E", "A, C, B, E, D", "Both possible", "A, D, E, B, C"],
    "answer": "Both possible",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete the BFS:\n\n```\nwhile NOT queue.EMPTY():\n    node = queue.DEQUEUE()\n    PRINT(node)\n    for neighbor in graph[node]:\n        if neighbor NOT IN visited:\n            _______________\n            visited.ADD(neighbor)\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["queue.ENQUEUE(neighbor)", "queue.DEQUEUE(neighbor)", "PRINT(neighbor)", "visited.REMOVE(neighbor)"],
    "answer": "queue.ENQUEUE(neighbor)",
    "difficulty": "MEDIUM"
  },

  // Longest Common Subsequence
  {
    "text": "What is the recurrence relation for LCS?\n\n```\nFUNCTION LCS(X, Y, m, n):\n    if m == 0 OR n == 0:\n        return 0\n    if X[m-1] == Y[n-1]:\n        return 1 + LCS(X, Y, m-1, n-1)\n    else:\n        return MAX(LCS(X, Y, m, n-1), LCS(X, Y, m-1, n))\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["LCS(m-1,n-1)+1 if match, else MAX(LCS(m,n-1), LCS(m-1,n))", "LCS(m-1,n-1) + LCS(m,n)", "LCS(m,n) = m + n", "LCS(m,n) = m * n"],
    "answer": "LCS(m-1,n-1)+1 if match, else MAX(LCS(m,n-1), LCS(m-1,n))",
    "difficulty": "MEDIUM"
  },
  {
    "text": "LCS of 'ABCD' and 'ACBF'. What is the length?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["2", "3", "1", "4"],
    "answer": "2",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete the LCS DP table fill:\n\n```\nif X[i-1] == Y[j-1]:\n    dp[i][j] = dp[i-1][j-1] + 1\nelse:\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i][j] = MAX(dp[i-1][j], dp[i][j-1])", "dp[i][j] = dp[i-1][j-1]", "dp[i][j] = 0", "dp[i][j] = i + j"],
    "answer": "dp[i][j] = MAX(dp[i-1][j], dp[i][j-1])",
    "difficulty": "MEDIUM"
  },

  // 0/1 Knapsack
  {
    "text": "What is the constraint in 0/1 Knapsack problem?\n\n```\nFUNCTION Knapsack(weights, values, n, capacity):\n    if n == 0 OR capacity == 0:\n        return 0\n    if weights[n-1] > capacity:\n        return Knapsack(weights, values, n-1, capacity)\n    else:\n        include = values[n-1] + Knapsack(weights, values, n-1, capacity-weights[n-1])\n        exclude = Knapsack(weights, values, n-1, capacity)\n        return MAX(include, exclude)\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["Each item can be taken 0 or 1 times", "Items can be divided", "Unlimited items available", "Items must be sorted"],
    "answer": "Each item can be taken 0 or 1 times",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Knapsack: weights=[1,3,4], values=[1,4,5], capacity=4. What is max value?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["5", "6", "9", "4"],
    "answer": "5",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete the knapsack recurrence:\n\n```\nif weights[n-1] <= capacity:\n    include = values[n-1] + Knapsack(weights, values, n-1, capacity-weights[n-1])\n    exclude = Knapsack(weights, values, n-1, capacity)\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["return MAX(include, exclude)", "return include + exclude", "return include", "return exclude"],
    "answer": "return MAX(include, exclude)",
    "difficulty": "MEDIUM"
  },

  // Edit Distance
  {
    "text": "What operations are allowed in Edit Distance?\n\n```\nFUNCTION EditDistance(str1, str2, m, n):\n    if m == 0: return n\n    if n == 0: return m\n    if str1[m-1] == str2[n-1]:\n        return EditDistance(str1, str2, m-1, n-1)\n    return 1 + MIN(EditDistance(str1, str2, m, n-1),\n                   EditDistance(str1, str2, m-1, n),\n                   EditDistance(str1, str2, m-1, n-1))\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["Insert, Delete, Replace", "Only Insert and Delete", "Only Replace", "Insert, Delete, Swap"],
    "answer": "Insert, Delete, Replace",
    "difficulty": "HARD"
  },
  {
    "text": "Edit distance between 'CAT' and 'DOG'. What is the minimum operations?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["3", "2", "4", "1"],
    "answer": "3",
    "difficulty": "HARD"
  },
  {
    "text": "Complete edit distance recurrence:\n\n```\nif str1[m-1] == str2[n-1]:\n    return EditDistance(str1, str2, m-1, n-1)\nelse:\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["return 1 + MIN(insert, delete, replace)", "return EditDistance(str1, str2, m-1, n-1)", "return 0", "return m + n"],
    "answer": "return 1 + MIN(insert, delete, replace)",
    "difficulty": "HARD"
  },

  // Hash Table Operations
  {
    "text": "What is the average time complexity of hash table operations?\n\n```\nFUNCTION Insert(hashTable, key, value):\n    index = Hash(key) % TABLE_SIZE\n    hashTable[index] = value\n\nFUNCTION Search(hashTable, key):\n    index = Hash(key) % TABLE_SIZE\n    return hashTable[index]\n```",
    "type": "MCQ",
    "categories": ["HashMaps"],
    "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    "answer": "O(1)",
    "difficulty": "EASY"
  },
  {
    "text": "Hash function h(k) = k % 7. Where does key 15 go?",
    "type": "PREDICT_OUTPUT",
    "categories": ["HashMaps"],
    "options": ["Index 1", "Index 2", "Index 0", "Index 3"],
    "answer": "Index 1",
    "difficulty": "EASY"
  },
  {
    "text": "Complete hash table insertion:\n\n```\nFUNCTION Insert(hashTable, key, value):\n    index = Hash(key) % TABLE_SIZE\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["HashMaps"],
    "options": ["hashTable[index] = value", "index = index + 1", "value = key", "RETURN index"],
    "answer": "hashTable[index] = value",
    "difficulty": "EASY"
  },

  // Collision Resolution
  {
    "text": "What is chaining in hash tables?\n\n```\nFUNCTION InsertChaining(hashTable, key, value):\n    index = Hash(key) % TABLE_SIZE\n    if hashTable[index] == NULL:\n        hashTable[index] = NEW_LIST()\n    hashTable[index].ADD(key, value)\n```",
    "type": "MCQ",
    "categories": ["HashMaps"],
    "options": ["Using linked lists at each index", "Moving to next empty slot", "Doubling table size", "Using different hash function"],
    "answer": "Using linked lists at each index",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Linear probing: table size 5, keys [10,22,31,4,15]. Where does 15 go if 22,31,4 collide?",
    "type": "PREDICT_OUTPUT",
    "categories": ["HashMaps"],
    "options": ["Index 1", "Index 3", "Index 4", "Index 0"],
    "answer": "Index 4",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete linear probing:\n\n```\nindex = Hash(key) % TABLE_SIZE\nwhile hashTable[index] != NULL:\n    _______________\nindex = index % TABLE_SIZE\n```",
    "type": "FILL_BLANK",
    "categories": ["HashMaps"],
    "options": ["index = index + 1", "index = index - 1", "index = Hash(key)", "BREAK"],
    "answer": "index = index + 1",
    "difficulty": "MEDIUM"
  },

  // Linked List Reversal
  {
    "text": "What is the approach to reverse a linked list iteratively?\n\n```\nFUNCTION Reverse(head):\n    prev = NULL\n    current = head\n    while current != NULL:\n        next = current.next\n        current.next = prev\n        prev = current\n        current = next\n    return prev\n```",
    "type": "MCQ",
    "categories": ["LinkedLists"],
    "options": ["Use three pointers: prev, current, next", "Create new list", "Use recursion only", "Use array storage"],
    "answer": "Use three pointers: prev, current, next",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Reverse list [1->2->3->NULL]. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["LinkedLists"],
    "options": ["[3->2->1->NULL]", "[1->2->3->NULL]", "[NULL->3->2->1]", "[3->NULL->2->1]"],
    "answer": "[3->2->1->NULL]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete list reversal:\n\n```\nwhile current != NULL:\n    next = current.next\n    current.next = prev\n    _______________\n    current = next\n```",
    "type": "FILL_BLANK",
    "categories": ["LinkedLists"],
    "options": ["prev = current", "prev = next", "current = prev", "next = prev"],
    "answer": "prev = current",
    "difficulty": "MEDIUM"
  },

  // Cycle Detection (Floyd's)
  {
    "text": "What is Floyd's cycle detection also known as?\n\n```\nFUNCTION HasCycle(head):\n    slow = head\n    fast = head\n    while fast != NULL AND fast.next != NULL:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return true\n    return false\n```",
    "type": "MCQ",
    "categories": ["LinkedLists"],
    "options": ["Tortoise and Hare algorithm", "Binary search method", "Hash table method", "Stack-based detection"],
    "answer": "Tortoise and Hare algorithm",
    "difficulty": "MEDIUM"
  },
  {
    "text": "In cycle detection, why does slow move 1 step and fast move 2 steps?",
    "type": "PREDICT_OUTPUT",
    "categories": ["LinkedLists"],
    "options": ["They will meet if cycle exists", "Faster detection", "Less memory usage", "Easier implementation"],
    "answer": "They will meet if cycle exists",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete cycle detection:\n\n```\nwhile fast != NULL AND fast.next != NULL:\n    slow = slow.next\n    _______________\n    if slow == fast:\n        return true\n```",
    "type": "FILL_BLANK",
    "categories": ["LinkedLists"],
    "options": ["fast = fast.next.next", "fast = fast.next", "fast = slow", "fast = NULL"],
    "answer": "fast = fast.next.next",
    "difficulty": "MEDIUM"
  },

  // Stack Operations
  {
    "text": "What is the LIFO principle in stacks?\n\n```\nFUNCTION Push(stack, item):\n    stack.top = stack.top + 1\n    stack.array[stack.top] = item\n\nFUNCTION Pop(stack):\n    if stack.top >= 0:\n        item = stack.array[stack.top]\n        stack.top = stack.top - 1\n        return item\n```",
    "type": "MCQ",
    "categories": ["Stacks"],
    "options": ["Last In, First Out", "First In, First Out", "Last In, Last Out", "First In, Last Out"],
    "answer": "Last In, First Out",
    "difficulty": "EASY"
  },
  {
    "text": "Stack operations: PUSH(1), PUSH(2), POP(), PUSH(3). What is top element?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Stacks"],
    "options": ["3", "1", "2", "Stack is empty"],
    "answer": "3",
    "difficulty": "EASY"
  },
  {
    "text": "Complete stack pop operation:\n\n```\nFUNCTION Pop(stack):\n    if stack.top >= 0:\n        item = stack.array[stack.top]\n        _______________\n        return item\n```",
    "type": "FILL_BLANK",
    "categories": ["Stacks"],
    "options": ["stack.top = stack.top - 1", "stack.top = stack.top + 1", "item = 0", "stack.array[stack.top] = NULL"],
    "answer": "stack.top = stack.top - 1",
    "difficulty": "EASY"
  },

  // Valid Parentheses
  {
    "text": "How does stack help in checking valid parentheses?\n\n```\nFUNCTION IsValid(s):\n    stack = EMPTY_STACK\n    for char in s:\n        if char IN ['(', '[', '{']:\n            stack.PUSH(char)\n        else:\n            if stack.EMPTY() OR NOT IsMatching(stack.POP(), char):\n                return false\n    return stack.EMPTY()\n```",
    "type": "MCQ",
    "categories": ["Stacks"],
    "options": ["Matches opening with closing brackets", "Counts total brackets", "Sorts brackets", "Removes brackets"],
    "answer": "Matches opening with closing brackets",
    "difficulty": "EASY"
  },
  {
    "text": "Is '([{}])' valid? Trace through the algorithm.",
    "type": "PREDICT_OUTPUT",
    "categories": ["Stacks"],
    "options": ["Valid", "Invalid", "Incomplete", "Error"],
    "answer": "Valid",
    "difficulty": "EASY"
  },
  {
    "text": "Complete parentheses validation:\n\n```\nfor char in s:\n    if char IN ['(', '[', '{']:\n        stack.PUSH(char)\n    else:\n        if stack.EMPTY() OR NOT IsMatching(stack.POP(), char):\n            _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Stacks"],
    "options": ["return false", "return true", "CONTINUE", "stack.PUSH(char)"],
    "answer": "return false",
    "difficulty": "EASY"
  },

  // String Algorithms
  {
    "text": "What is the time complexity of string reversal?\n\n```\nFUNCTION ReverseString(str):\n    left = 0\n    right = LENGTH(str) - 1\n    while left < right:\n        SWAP(str[left], str[right])\n        left = left + 1\n        right = right - 1\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    "answer": "O(n)",
    "difficulty": "EASY"
  },
  {
    "text": "Reverse string 'HELLO'. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["OLLEH", "HELLO", "HLLEO", "EOLLH"],
    "answer": "OLLEH",
    "difficulty": "EASY"
  },
  {
    "text": "Complete string reversal:\n\n```\nwhile left < right:\n    SWAP(str[left], str[right])\n    _______________\n    right = right - 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["left = left + 1", "left = left - 1", "left = right", "right = left"],
    "answer": "left = left + 1",
    "difficulty": "EASY"
  },

  // Anagram Detection
  {
    "text": "What is an anagram?\n\n```\nFUNCTION IsAnagram(str1, str2):\n    if LENGTH(str1) != LENGTH(str2):\n        return false\n    count = ARRAY[26] = {0}\n    for i = 0 to LENGTH(str1)-1:\n        count[str1[i] - 'a'] = count[str1[i] - 'a'] + 1\n        count[str2[i] - 'a'] = count[str2[i] - 'a'] - 1\n    for i = 0 to 25:\n        if count[i] != 0:\n            return false\n    return true\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Words with same letters in different order", "Words with same length", "Words that rhyme", "Words with same meaning"],
    "answer": "Words with same letters in different order",
    "difficulty": "EASY"
  },
  {
    "text": "Are 'listen' and 'silent' anagrams?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["Yes", "No", "Cannot determine", "Only if sorted"],
    "answer": "Yes",
    "difficulty": "EASY"
  },
  {
    "text": "Complete anagram check:\n\n```\nfor i = 0 to LENGTH(str1)-1:\n    count[str1[i] - 'a'] = count[str1[i] - 'a'] + 1\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["count[str2[i] - 'a'] = count[str2[i] - 'a'] - 1", "count[str2[i] - 'a'] = count[str2[i] - 'a'] + 1", "count[str1[i] - 'a'] = 0", "str2[i] = str1[i]"],
    "answer": "count[str2[i] - 'a'] = count[str2[i] - 'a'] - 1",
    "difficulty": "EASY"
  },

  // Recursion - Factorial
  {
    "text": "What is the base case in recursive factorial?\n\n```\nFUNCTION Factorial(n):\n    if n <= 1:\n        return 1\n    return n * Factorial(n - 1)\n```",
    "type": "MCQ",
    "categories": ["Recursion"],
    "options": ["n <= 1", "n == 0", "n < 0", "n >= 1"],
    "answer": "n <= 1",
    "difficulty": "EASY"
  },
  {
    "text": "What is Factorial(4)?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Recursion"],
    "options": ["24", "12", "16", "20"],
    "answer": "24",
    "difficulty": "EASY"
  },
  {
    "text": "Complete recursive factorial:\n\n```\nFUNCTION Factorial(n):\n    if n <= 1:\n        return 1\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Recursion"],
    "options": ["return n * Factorial(n - 1)", "return n + Factorial(n - 1)", "return Factorial(n - 1)", "return n"],
    "answer": "return n * Factorial(n - 1)",
    "difficulty": "EASY"
  },

  // Tower of Hanoi
  {
    "text": "What is the minimum number of moves for Tower of Hanoi with n disks?\n\n```\nFUNCTION TowerOfHanoi(n, source, destination, auxiliary):\n    if n == 1:\n        PRINT('Move disk 1 from', source, 'to', destination)\n        return\n    TowerOfHanoi(n-1, source, auxiliary, destination)\n    PRINT('Move disk', n, 'from', source, 'to', destination)\n    TowerOfHanoi(n-1, auxiliary, destination, source)\n```",
    "type": "MCQ",
    "categories": ["Recursion"],
    "options": ["2^n - 1", "2^n", "n^2", "n!"],
    "answer": "2^n - 1",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Tower of Hanoi with 3 disks. How many total moves?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Recursion"],
    "options": ["7", "8", "6", "9"],
    "answer": "7",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Tower of Hanoi:\n\n```\nTowerOfHanoi(n-1, source, auxiliary, destination)\nPRINT('Move disk', n, 'from', source, 'to', destination)\n_______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Recursion"],
    "options": ["TowerOfHanoi(n-1, auxiliary, destination, source)", "TowerOfHanoi(n, auxiliary, destination, source)", "TowerOfHanoi(n-1, source, destination, auxiliary)", "RETURN"],
    "answer": "TowerOfHanoi(n-1, auxiliary, destination, source)",
    "difficulty": "MEDIUM"
  },

  // Dijkstra's Algorithm
  {
    "text": "What type of graph does Dijkstra's algorithm work on?\n\n```\nFUNCTION Dijkstra(graph, source):\n    dist = ARRAY filled with INFINITY\n    dist[source] = 0\n    pq = PRIORITY_QUEUE\n    pq.INSERT(source, 0)\n    while NOT pq.EMPTY():\n        u = pq.EXTRACT_MIN()\n        for v in graph[u]:\n            if dist[u] + weight(u,v) < dist[v]:\n                dist[v] = dist[u] + weight(u,v)\n                pq.INSERT(v, dist[v])\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Non-negative weighted graphs", "Any weighted graphs", "Unweighted graphs only", "Negative weighted graphs"],
    "answer": "Non-negative weighted graphs",
    "difficulty": "HARD"
  },
  {
    "text": "Dijkstra from A: A->B(1), A->C(4), B->C(2). What is shortest path to C?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["3 (A->B->C)", "4 (A->C)", "Both equal", "No path"],
    "answer": "3 (A->B->C)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Dijkstra's relaxation:\n\n```\nfor v in graph[u]:\n    if dist[u] + weight(u,v) < dist[v]:\n        _______________\n        pq.INSERT(v, dist[v])\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["dist[v] = dist[u] + weight(u,v)", "dist[v] = weight(u,v)", "dist[u] = dist[v]", "dist[v] = INFINITY"],
    "answer": "dist[v] = dist[u] + weight(u,v)",
    "difficulty": "HARD"
  },

  // Topological Sort
  {
    "text": "When is topological sort possible?\n\n```\nFUNCTION TopologicalSort(graph):\n    indegree = ARRAY[V] = {0}\n    for u = 0 to V-1:\n        for v in graph[u]:\n            indegree[v] = indegree[v] + 1\n    queue = EMPTY_QUEUE\n    for i = 0 to V-1:\n        if indegree[i] == 0:\n            queue.ENQUEUE(i)\n    while NOT queue.EMPTY():\n        u = queue.DEQUEUE()\n        PRINT(u)\n        for v in graph[u]:\n            indegree[v] = indegree[v] - 1\n            if indegree[v] == 0:\n                queue.ENQUEUE(v)\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Only for DAGs (Directed Acyclic Graphs)", "For any directed graph", "Only for undirected graphs", "For weighted graphs only"],
    "answer": "Only for DAGs (Directed Acyclic Graphs)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Graph: A->B, B->C, A->C. What is a valid topological order?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["A, B, C", "B, A, C", "C, B, A", "B, C, A"],
    "answer": "A, B, C",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete topological sort:\n\n```\nfor v in graph[u]:\n    indegree[v] = indegree[v] - 1\n    if indegree[v] == 0:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["queue.ENQUEUE(v)", "queue.DEQUEUE(v)", "PRINT(v)", "indegree[v] = -1"],
    "answer": "queue.ENQUEUE(v)",
    "difficulty": "MEDIUM"
  },

  // More comprehensive coverage continues...
  // Adding Coin Change Problem
  {
    "text": "What is the optimal substructure in Coin Change?\n\n```\nFUNCTION CoinChange(coins, amount):\n    dp = ARRAY[amount + 1] filled with INFINITY\n    dp[0] = 0\n    for i = 1 to amount:\n        for coin in coins:\n            if coin <= i:\n                dp[i] = MIN(dp[i], dp[i - coin] + 1)\n    return dp[amount]\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["Minimum coins for amount = min coins for (amount - coin) + 1", "Sum of all coin values", "Maximum coins possible", "Average of coin values"],
    "answer": "Minimum coins for amount = min coins for (amount - coin) + 1",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Coin change for amount 6 with coins [1,3,4]. What is minimum coins?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["2", "3", "4", "6"],
    "answer": "2",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete coin change DP:\n\n```\nfor coin in coins:\n    if coin <= i:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i] = MIN(dp[i], dp[i - coin] + 1)", "dp[i] = dp[i - coin] + 1", "dp[i] = coin", "dp[i] = dp[i] + coin"],
    "answer": "dp[i] = MIN(dp[i], dp[i - coin] + 1)",
    "difficulty": "MEDIUM"
  },

  // Three Sum Problem
  {
    "text": "What is the approach for Three Sum problem?\n\n```\nFUNCTION ThreeSum(nums):\n    SORT(nums)\n    result = EMPTY_LIST\n    for i = 0 to LENGTH(nums) - 3:\n        if i > 0 AND nums[i] == nums[i-1]: CONTINUE\n        left = i + 1\n        right = LENGTH(nums) - 1\n        while left < right:\n            sum = nums[i] + nums[left] + nums[right]\n            if sum == 0:\n                result.ADD([nums[i], nums[left], nums[right]])\n                while left < right AND nums[left] == nums[left+1]: left++\n                while left < right AND nums[right] == nums[right-1]: right--\n                left++, right--\n            else if sum < 0: left++\n            else: right--\n    return result\n```",
    "type": "MCQ",
    "categories": ["TwoPointers"],
    "options": ["Sort array, then use two pointers for each element", "Use three nested loops", "Use hash map only", "Use binary search"],
    "answer": "Sort array, then use two pointers for each element",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Three sum in [-1,0,1,2,-1,-4]. How many unique triplets sum to 0?",
    "type": "PREDICT_OUTPUT",
    "categories": ["TwoPointers"],
    "options": ["2", "1", "3", "0"],
    "answer": "2",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete three sum logic:\n\n```\nif sum == 0:\n    result.ADD([nums[i], nums[left], nums[right]])\n    while left < right AND nums[left] == nums[left+1]: left++\n    while left < right AND nums[right] == nums[right-1]: right--\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["TwoPointers"],
    "options": ["left++, right--", "left--, right++", "left = right", "BREAK"],
    "answer": "left++, right--",
    "difficulty": "MEDIUM"
  },

  // Container With Most Water
  {
    "text": "What is the key insight in Container With Most Water problem?\n\n```\nFUNCTION MaxArea(height):\n    left = 0\n    right = LENGTH(height) - 1\n    maxArea = 0\n    while left < right:\n        area = MIN(height[left], height[right]) * (right - left)\n        maxArea = MAX(maxArea, area)\n        if height[left] < height[right]:\n            left = left + 1\n        else:\n            right = right - 1\n    return maxArea\n```",
    "type": "MCQ",
    "categories": ["TwoPointers"],
    "options": ["Move pointer with smaller height", "Always move left pointer", "Always move right pointer", "Move both pointers"],
    "answer": "Move pointer with smaller height",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Container with heights [1,8,6,2,5,4,8,3,7]. What is max area?",
    "type": "PREDICT_OUTPUT",
    "categories": ["TwoPointers"],
    "options": ["49", "56", "64", "42"],
    "answer": "49",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete container algorithm:\n\n```\narea = MIN(height[left], height[right]) * (right - left)\nmaxArea = MAX(maxArea, area)\nif height[left] < height[right]:\n    _______________\nelse:\n    right = right - 1\n```",
    "type": "FILL_BLANK",
    "categories": ["TwoPointers"],
    "options": ["left = left + 1", "left = left - 1", "right = right + 1", "left = right"],
    "answer": "left = left + 1",
    "difficulty": "MEDIUM"
  },

  // AVL Tree Rotations
  {
    "text": "When is a left rotation needed in AVL tree?\n\n```\nFUNCTION LeftRotate(x):\n    y = x.right\n    T2 = y.left\n    y.left = x\n    x.right = T2\n    x.height = MAX(Height(x.left), Height(x.right)) + 1\n    y.height = MAX(Height(y.left), Height(y.right)) + 1\n    return y\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["When right subtree is heavier", "When left subtree is heavier", "When tree is balanced", "When inserting root"],
    "answer": "When right subtree is heavier",
    "difficulty": "HARD"
  },
  {
    "text": "AVL tree becomes right-heavy. What rotation fixes it?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["Left rotation", "Right rotation", "Left-Right rotation", "Right-Left rotation"],
    "answer": "Left rotation",
    "difficulty": "HARD"
  },
  {
    "text": "Complete left rotation:\n\n```\ny = x.right\nT2 = y.left\n_______________\nx.right = T2\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["y.left = x", "y.right = x", "x.left = y", "T2 = x"],
    "answer": "y.left = x",
    "difficulty": "HARD"
  },

  // Trie Operations
  {
    "text": "What is the space complexity of a Trie?\n\n```\nSTRUCT TrieNode:\n    children = ARRAY[26]\n    isEndOfWord = false\n\nFUNCTION Insert(root, word):\n    current = root\n    for char in word:\n        index = char - 'a'\n        if current.children[index] == NULL:\n            current.children[index] = NEW TrieNode()\n        current = current.children[index]\n    current.isEndOfWord = true\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["O(ALPHABET_SIZE * N * M)", "O(N)", "O(M)", "O(1)"],
    "answer": "O(ALPHABET_SIZE * N * M)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Insert 'CAT' in empty Trie. How many nodes are created?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["4 (including root)", "3", "5", "2"],
    "answer": "4 (including root)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Trie insertion:\n\n```\nfor char in word:\n    index = char - 'a'\n    if current.children[index] == NULL:\n        current.children[index] = NEW TrieNode()\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["current = current.children[index]", "current = root", "index = index + 1", "current.isEndOfWord = true"],
    "answer": "current = current.children[index]",
    "difficulty": "MEDIUM"
  },

  // Floyd-Warshall Algorithm
  {
    "text": "What problem does Floyd-Warshall solve?\n\n```\nFUNCTION FloydWarshall(graph):\n    dist = COPY(graph)\n    for k = 0 to V-1:\n        for i = 0 to V-1:\n            for j = 0 to V-1:\n                if dist[i][k] + dist[k][j] < dist[i][j]:\n                    dist[i][j] = dist[i][k] + dist[k][j]\n    return dist\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["All pairs shortest paths", "Single source shortest path", "Minimum spanning tree", "Maximum flow"],
    "answer": "All pairs shortest paths",
    "difficulty": "HARD"
  },
  {
    "text": "Floyd-Warshall time complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["O(V³)", "O(V²)", "O(VE)", "O(V log V)"],
    "answer": "O(V³)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Floyd-Warshall update:\n\n```\nfor k = 0 to V-1:\n    for i = 0 to V-1:\n        for j = 0 to V-1:\n            if dist[i][k] + dist[k][j] < dist[i][j]:\n                _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["dist[i][j] = dist[i][k] + dist[k][j]", "dist[i][j] = MIN(dist[i][j], dist[k][j])", "dist[i][j] = 0", "dist[k][j] = dist[i][j]"],
    "answer": "dist[i][j] = dist[i][k] + dist[k][j]",
    "difficulty": "HARD"
  },

  // Postfix Expression Evaluation
  {
    "text": "How does stack help in postfix evaluation?\n\n```\nFUNCTION EvaluatePostfix(expression):\n    stack = EMPTY_STACK\n    for token in expression:\n        if IsOperand(token):\n            stack.PUSH(token)\n        else:\n            operand2 = stack.POP()\n            operand1 = stack.POP()\n            result = ApplyOperator(operand1, operand2, token)\n            stack.PUSH(result)\n    return stack.POP()\n```",
    "type": "MCQ",
    "categories": ["Stacks"],
    "options": ["Stores operands and intermediate results", "Converts to infix", "Sorts expressions", "Validates syntax"],
    "answer": "Stores operands and intermediate results",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Evaluate postfix '2 3 + 4 *'. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Stacks"],
    "options": ["20", "14", "11", "24"],
    "answer": "20",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete postfix evaluation:\n\n```\nelse:\n    operand2 = stack.POP()\n    operand1 = stack.POP()\n    result = ApplyOperator(operand1, operand2, token)\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Stacks"],
    "options": ["stack.PUSH(result)", "stack.POP()", "result = 0", "operand1 = result"],
    "answer": "stack.PUSH(result)",
    "difficulty": "MEDIUM"
  },

  // Queue using Stacks
  {
    "text": "How to implement queue using two stacks?\n\n```\nCLASS Queue:\n    stack1 = EMPTY_STACK  // for enqueue\n    stack2 = EMPTY_STACK  // for dequeue\n\n    FUNCTION Enqueue(item):\n        stack1.PUSH(item)\n\n    FUNCTION Dequeue():\n        if stack2.EMPTY():\n            while NOT stack1.EMPTY():\n                stack2.PUSH(stack1.POP())\n        return stack2.POP()\n```",
    "type": "MCQ",
    "categories": ["Queues"],
    "options": ["One for input, one for output", "Both for input", "Both for output", "One for backup"],
    "answer": "One for input, one for output",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Queue operations: Enqueue(1), Enqueue(2), Dequeue(), Enqueue(3). What is dequeued?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Queues"],
    "options": ["1", "2", "3", "Queue is empty"],
    "answer": "1",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete queue dequeue using stacks:\n\n```\nFUNCTION Dequeue():\n    if stack2.EMPTY():\n        while NOT stack1.EMPTY():\n            _______________\n    return stack2.POP()\n```",
    "type": "FILL_BLANK",
    "categories": ["Queues"],
    "options": ["stack2.PUSH(stack1.POP())", "stack1.PUSH(stack2.POP())", "stack1.POP()", "stack2.POP()"],
    "answer": "stack2.PUSH(stack1.POP())",
    "difficulty": "MEDIUM"
  },

  // Longest Palindromic Substring
  {
    "text": "What is the expand around center approach?\n\n```\nFUNCTION LongestPalindrome(s):\n    start = 0, maxLen = 0\n    for i = 0 to LENGTH(s)-1:\n        len1 = ExpandAroundCenter(s, i, i)      // odd length\n        len2 = ExpandAroundCenter(s, i, i+1)    // even length\n        currentLen = MAX(len1, len2)\n        if currentLen > maxLen:\n            maxLen = currentLen\n            start = i - (currentLen - 1) / 2\n    return s.SUBSTRING(start, start + maxLen)\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Expand from each possible center", "Use dynamic programming", "Sort all substrings", "Use two pointers from ends"],
    "answer": "Expand from each possible center",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Longest palindrome in 'babad'. What could be the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["'bab' or 'aba'", "'ba'", "'bad'", "'babad'"],
    "answer": "'bab' or 'aba'",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete expand around center:\n\n```\nFUNCTION ExpandAroundCenter(s, left, right):\n    while left >= 0 AND right < LENGTH(s) AND s[left] == s[right]:\n        left = left - 1\n        _______________\n    return right - left - 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["right = right + 1", "right = right - 1", "left = left + 1", "left = right"],
    "answer": "right = right + 1",
    "difficulty": "MEDIUM"
  },

  // Circular Queue
  {
    "text": "How to detect if circular queue is full?\n\n```\nCLASS CircularQueue:\n    array = ARRAY[capacity]\n    front = 0\n    rear = -1\n    size = 0\n\n    FUNCTION IsFull():\n        return size == capacity\n\n    FUNCTION Enqueue(item):\n        if IsFull(): return ERROR\n        rear = (rear + 1) % capacity\n        array[rear] = item\n        size = size + 1\n```",
    "type": "MCQ",
    "categories": ["Queues"],
    "options": ["Check if size equals capacity", "Check if rear equals front", "Check if rear + 1 equals front", "Check if array is NULL"],
    "answer": "Check if size equals capacity",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Circular queue size 3: Enqueue(1,2,3), Dequeue(), Enqueue(4). What is rear?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Queues"],
    "options": ["0", "1", "2", "3"],
    "answer": "0",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete circular queue enqueue:\n\n```\nFUNCTION Enqueue(item):\n    if IsFull(): return ERROR\n    _______________\n    array[rear] = item\n    size = size + 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Queues"],
    "options": ["rear = (rear + 1) % capacity", "rear = rear + 1", "rear = (rear - 1) % capacity", "rear = 0"],
    "answer": "rear = (rear + 1) % capacity",
    "difficulty": "MEDIUM"
  },

  // House Robber
  {
    "text": "What is the recurrence relation for House Robber?\n\n```\nFUNCTION Rob(houses):\n    if LENGTH(houses) == 0: return 0\n    if LENGTH(houses) == 1: return houses[0]\n    dp = ARRAY[LENGTH(houses)]\n    dp[0] = houses[0]\n    dp[1] = MAX(houses[0], houses[1])\n    for i = 2 to LENGTH(houses)-1:\n        dp[i] = MAX(dp[i-1], dp[i-2] + houses[i])\n    return dp[LENGTH(houses)-1]\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["MAX(rob previous, rob current + rob i-2)", "Sum of all houses", "Rob every alternate house", "Rob maximum value house"],
    "answer": "MAX(rob previous, rob current + rob i-2)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "House values [2,7,9,3,1]. What is maximum money that can be robbed?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["12", "11", "10", "9"],
    "answer": "12",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete house robber DP:\n\n```\nfor i = 2 to LENGTH(houses)-1:\n    _______________\nreturn dp[LENGTH(houses)-1]\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i] = MAX(dp[i-1], dp[i-2] + houses[i])", "dp[i] = dp[i-1] + houses[i]", "dp[i] = houses[i]", "dp[i] = dp[i-2] + houses[i]"],
    "answer": "dp[i] = MAX(dp[i-1], dp[i-2] + houses[i])",
    "difficulty": "MEDIUM"
  },

  // Longest Increasing Subsequence
  {
    "text": "What is the DP approach for LIS?\n\n```\nFUNCTION LIS(arr):\n    n = LENGTH(arr)\n    dp = ARRAY[n] filled with 1\n    for i = 1 to n-1:\n        for j = 0 to i-1:\n            if arr[j] < arr[i]:\n                dp[i] = MAX(dp[i], dp[j] + 1)\n    return MAX(dp)\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i] = length of LIS ending at i", "dp[i] = maximum element at i", "dp[i] = sum of subsequence at i", "dp[i] = index of next element"],
    "answer": "dp[i] = length of LIS ending at i",
    "difficulty": "MEDIUM"
  },
  {
    "text": "LIS of [10,9,2,5,3,7,101,18]. What is the length?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["4", "3", "5", "6"],
    "answer": "4",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete LIS DP:\n\n```\nfor j = 0 to i-1:\n    if arr[j] < arr[i]:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i] = MAX(dp[i], dp[j] + 1)", "dp[i] = dp[j] + 1", "dp[i] = dp[j]", "dp[i] = arr[i]"],
    "answer": "dp[i] = MAX(dp[i], dp[j] + 1)",
    "difficulty": "MEDIUM"
  },

  // Bellman-Ford Algorithm
  {
    "text": "What advantage does Bellman-Ford have over Dijkstra?\n\n```\nFUNCTION BellmanFord(graph, source):\n    dist = ARRAY[V] filled with INFINITY\n    dist[source] = 0\n    for i = 1 to V-1:\n        for each edge (u,v) with weight w:\n            if dist[u] != INFINITY AND dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    // Check for negative cycles\n    for each edge (u,v) with weight w:\n        if dist[u] != INFINITY AND dist[u] + w < dist[v]:\n            PRINT('Negative cycle detected')\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Handles negative edge weights", "Faster execution", "Uses less memory", "Works on undirected graphs only"],
    "answer": "Handles negative edge weights",
    "difficulty": "HARD"
  },
  {
    "text": "Bellman-Ford time complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["O(VE)", "O(V²)", "O(E log V)", "O(V³)"],
    "answer": "O(VE)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Bellman-Ford relaxation:\n\n```\nfor each edge (u,v) with weight w:\n    if dist[u] != INFINITY AND dist[u] + w < dist[v]:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["dist[v] = dist[u] + w", "dist[u] = dist[v] + w", "dist[v] = w", "dist[u] = INFINITY"],
    "answer": "dist[v] = dist[u] + w",
    "difficulty": "HARD"
  },

  // Merge Two Sorted Lists
  {
    "text": "What is the approach to merge two sorted linked lists?\n\n```\nFUNCTION MergeTwoLists(list1, list2):\n    dummy = NEW_NODE(0)\n    current = dummy\n    while list1 != NULL AND list2 != NULL:\n        if list1.val <= list2.val:\n            current.next = list1\n            list1 = list1.next\n        else:\n            current.next = list2\n            list2 = list2.next\n        current = current.next\n    current.next = list1 IF list1 != NULL ELSE list2\n    return dummy.next\n```",
    "type": "MCQ",
    "categories": ["LinkedLists"],
    "options": ["Compare values and link smaller node", "Copy all nodes to new list", "Sort after merging", "Use recursion only"],
    "answer": "Compare values and link smaller node",
    "difficulty": "EASY"
  },
  {
    "text": "Merge [1,2,4] and [1,3,4]. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["LinkedLists"],
    "options": ["[1,1,2,3,4,4]", "[1,2,3,4,4]", "[1,2,4,1,3,4]", "[2,3,4,4]"],
    "answer": "[1,1,2,3,4,4]",
    "difficulty": "EASY"
  },
  {
    "text": "Complete merge two lists:\n\n```\nwhile list1 != NULL AND list2 != NULL:\n    if list1.val <= list2.val:\n        current.next = list1\n        _______________\n    else:\n        current.next = list2\n        list2 = list2.next\n    current = current.next\n```",
    "type": "FILL_BLANK",
    "categories": ["LinkedLists"],
    "options": ["list1 = list1.next", "list1 = list2", "list1 = NULL", "list1 = current"],
    "answer": "list1 = list1.next",
    "difficulty": "EASY"
  },

  // Remove Nth Node from End
  {
    "text": "What is the two-pointer approach for removing nth node from end?\n\n```\nFUNCTION RemoveNthFromEnd(head, n):\n    dummy = NEW_NODE(0)\n    dummy.next = head\n    first = dummy\n    second = dummy\n    // Move first pointer n+1 steps ahead\n    for i = 0 to n:\n        first = first.next\n    // Move both until first reaches end\n    while first != NULL:\n        first = first.next\n        second = second.next\n    second.next = second.next.next\n    return dummy.next\n```",
    "type": "MCQ",
    "categories": ["LinkedLists"],
    "options": ["Maintain gap of n between two pointers", "Count total nodes first", "Use recursion", "Reverse the list first"],
    "answer": "Maintain gap of n between two pointers",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Remove 2nd node from end in [1,2,3,4,5]. What is removed?",
    "type": "PREDICT_OUTPUT",
    "categories": ["LinkedLists"],
    "options": ["4", "3", "2", "5"],
    "answer": "4",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete nth node removal:\n\n```\nwhile first != NULL:\n    first = first.next\n    _______________\nsecond.next = second.next.next\n```",
    "type": "FILL_BLANK",
    "categories": ["LinkedLists"],
    "options": ["second = second.next", "second = first", "second = dummy", "second = NULL"],
    "answer": "second = second.next",
    "difficulty": "MEDIUM"
  },

  // String Compression
  {
    "text": "What is the approach for string compression?\n\n```\nFUNCTION Compress(chars):\n    write = 0\n    i = 0\n    while i < LENGTH(chars):\n        char = chars[i]\n        count = 0\n        while i < LENGTH(chars) AND chars[i] == char:\n            count = count + 1\n            i = i + 1\n        chars[write] = char\n        write = write + 1\n        if count > 1:\n            for digit in STRING(count):\n                chars[write] = digit\n                write = write + 1\n    return write\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Count consecutive characters and write count", "Sort characters first", "Use hash map", "Reverse string"],
    "answer": "Count consecutive characters and write count",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Compress 'aabcccccaaa'. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["'a2bc5a3'", "'a2b1c5a3'", "'aabcccccaaa'", "'abc'"],
    "answer": "'a2bc5a3'",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete string compression:\n\n```\nchars[write] = char\nwrite = write + 1\nif count > 1:\n    for digit in STRING(count):\n        _______________\n        write = write + 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["chars[write] = digit", "chars[write] = count", "chars[write] = char", "write = write - 1"],
    "answer": "chars[write] = digit",
    "difficulty": "MEDIUM"
  },

  // Kruskal's MST
  {
    "text": "What data structure does Kruskal's algorithm use?\n\n```\nFUNCTION KruskalMST(graph):\n    edges = GET_ALL_EDGES(graph)\n    SORT(edges) // by weight\n    mst = EMPTY_LIST\n    uf = UNION_FIND(V)\n    for edge in edges:\n        u, v, weight = edge\n        if uf.FIND(u) != uf.FIND(v):\n            uf.UNION(u, v)\n            mst.ADD(edge)\n            if LENGTH(mst) == V - 1:\n                break\n    return mst\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Union-Find (Disjoint Set)", "Priority Queue", "Stack", "Hash Table"],
    "answer": "Union-Find (Disjoint Set)",
    "difficulty": "HARD"
  },
  {
    "text": "Kruskal's algorithm sorts edges by what criteria?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["Weight (ascending)", "Vertex number", "Edge length", "Random order"],
    "answer": "Weight (ascending)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Kruskal's algorithm:\n\n```\nfor edge in edges:\n    u, v, weight = edge\n    if uf.FIND(u) != uf.FIND(v):\n        _______________\n        mst.ADD(edge)\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["uf.UNION(u, v)", "uf.FIND(u, v)", "u = v", "weight = 0"],
    "answer": "uf.UNION(u, v)",
    "difficulty": "HARD"
  },

  // Trapping Rain Water
  {
    "text": "What is the two-pointer approach for trapping rain water?\n\n```\nFUNCTION Trap(height):\n    left = 0\n    right = LENGTH(height) - 1\n    leftMax = 0\n    rightMax = 0\n    water = 0\n    while left < right:\n        if height[left] < height[right]:\n            if height[left] >= leftMax:\n                leftMax = height[left]\n            else:\n                water = water + (leftMax - height[left])\n            left = left + 1\n        else:\n            if height[right] >= rightMax:\n                rightMax = height[right]\n            else:\n                water = water + (rightMax - height[right])\n            right = right - 1\n    return water\n```",
    "type": "MCQ",
    "categories": ["TwoPointers"],
    "options": ["Move pointer with smaller height, track max heights", "Calculate area under curve", "Use stack for computation", "Sort heights first"],
    "answer": "Move pointer with smaller height, track max heights",
    "difficulty": "HARD"
  },
  {
    "text": "Trap rain water for [0,1,0,2,1,0,1,3,2,1,2,1]. How much water?",
    "type": "PREDICT_OUTPUT",
    "categories": ["TwoPointers"],
    "options": ["6", "8", "4", "10"],
    "answer": "6",
    "difficulty": "HARD"
  },
  {
    "text": "Complete rain water trapping:\n\n```\nif height[left] < height[right]:\n    if height[left] >= leftMax:\n        leftMax = height[left]\n    else:\n        _______________\n    left = left + 1\n```",
    "type": "FILL_BLANK",
    "categories": ["TwoPointers"],
    "options": ["water = water + (leftMax - height[left])", "water = water + height[left]", "leftMax = 0", "left = right"],
    "answer": "water = water + (leftMax - height[left])",
    "difficulty": "HARD"
  },

  // Generate All Subsets (Power Set)
  {
    "text": "What is the recursive approach for generating subsets?\n\n```\nFUNCTION GenerateSubsets(nums, index, current, result):\n    if index == LENGTH(nums):\n        result.ADD(COPY(current))\n        return\n    // Include current element\n    current.ADD(nums[index])\n    GenerateSubsets(nums, index + 1, current, result)\n    current.REMOVE_LAST()\n    // Exclude current element\n    GenerateSubsets(nums, index + 1, current, result)\n```",
    "type": "MCQ",
    "categories": ["Recursion"],
    "options": ["Include or exclude each element", "Sort elements first", "Use nested loops", "Generate permutations"],
    "answer": "Include or exclude each element",
    "difficulty": "MEDIUM"
  },
  {
    "text": "How many subsets does [1,2,3] have?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Recursion"],
    "options": ["8", "6", "9", "7"],
    "answer": "8",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete subset generation:\n\n```\n// Include current element\ncurrent.ADD(nums[index])\nGenerateSubsets(nums, index + 1, current, result)\n_______________\n// Exclude current element\nGenerateSubsets(nums, index + 1, current, result)\n```",
    "type": "FILL_BLANK",
    "categories": ["Recursion"],
    "options": ["current.REMOVE_LAST()", "current.ADD(nums[index])", "index = index + 1", "result.ADD(current)"],
    "answer": "current.REMOVE_LAST()",
    "difficulty": "MEDIUM"
  },

  // Matrix Chain Multiplication
  {
    "text": "What is the optimal substructure in Matrix Chain Multiplication?\n\n```\nFUNCTION MatrixChainOrder(p):\n    n = LENGTH(p) - 1\n    dp = 2D_ARRAY[n][n] filled with 0\n    for length = 2 to n:\n        for i = 1 to n - length + 1:\n            j = i + length - 1\n            dp[i][j] = INFINITY\n            for k = i to j - 1:\n                cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j]\n                dp[i][j] = MIN(dp[i][j], cost)\n    return dp[1][n]\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["Optimal cost = min over all split points", "Multiply all matrices", "Sort by dimensions", "Use greedy approach"],
    "answer": "Optimal cost = min over all split points",
    "difficulty": "HARD"
  },
  {
    "text": "Matrix dimensions [1,2,3,4]. What is the optimal multiplication cost?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["18", "24", "12", "30"],
    "answer": "18",
    "difficulty": "HARD"
  },
  {
    "text": "Complete matrix chain DP:\n\n```\nfor k = i to j - 1:\n    cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j]\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i][j] = MIN(dp[i][j], cost)", "dp[i][j] = cost", "dp[i][j] = MAX(dp[i][j], cost)", "cost = 0"],
    "answer": "dp[i][j] = MIN(dp[i][j], cost)",
    "difficulty": "HARD"
  },

  // Recursive Palindrome Check
  {
    "text": "What is the base case for recursive palindrome check?\n\n```\nFUNCTION IsPalindrome(str, left, right):\n    if left >= right:\n        return true\n    if str[left] != str[right]:\n        return false\n    return IsPalindrome(str, left + 1, right - 1)\n```",
    "type": "MCQ",
    "categories": ["Recursion"],
    "options": ["left >= right", "str[left] == str[right]", "left == 0", "right == LENGTH(str)"],
    "answer": "left >= right",
    "difficulty": "EASY"
  },
  {
    "text": "Is 'racecar' a palindrome using recursive check?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Recursion"],
    "options": ["true", "false", "depends on implementation", "error"],
    "answer": "true",
    "difficulty": "EASY"
  },
  {
    "text": "Complete recursive palindrome:\n\n```\nif str[left] != str[right]:\n    return false\n_______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Recursion"],
    "options": ["return IsPalindrome(str, left + 1, right - 1)", "return true", "return false", "left = left + 1"],
    "answer": "return IsPalindrome(str, left + 1, right - 1)",
    "difficulty": "EASY"
  },

  // Advanced Array Algorithms
  {
    "text": "What is the principle behind Dutch National Flag algorithm?\n\n```\nFUNCTION DutchFlag(arr, pivot):\n    low = 0\n    mid = 0\n    high = LENGTH(arr) - 1\n    while mid <= high:\n        if arr[mid] < pivot:\n            SWAP(arr[low], arr[mid])\n            low++, mid++\n        else if arr[mid] > pivot:\n            SWAP(arr[mid], arr[high])\n            high--\n        else:\n            mid++\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Partition array into three parts", "Sort array in ascending order", "Find maximum element", "Remove duplicates"],
    "answer": "Partition array into three parts",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Dutch flag on [2,0,2,1,1,0] with pivot=1. What is the final arrangement?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["[0,0,1,1,2,2]", "[2,2,1,1,0,0]", "[0,1,0,1,2,2]", "Cannot determine"],
    "answer": "[0,0,1,1,2,2]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Dutch flag algorithm:\n\n```\nif arr[mid] < pivot:\n    SWAP(arr[low], arr[mid])\n    _______________\nelse if arr[mid] > pivot:\n    SWAP(arr[mid], arr[high])\n    high--\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["low++, mid++", "low--, mid--", "mid++", "high++"],
    "answer": "low++, mid++",
    "difficulty": "MEDIUM"
  },

  // Boyer-Moore Majority Vote
  {
    "text": "What is Boyer-Moore Majority Vote algorithm used for?\n\n```\nFUNCTION FindMajority(arr):\n    candidate = 0\n    count = 0\n    for num in arr:\n        if count == 0:\n            candidate = num\n        count = count + (1 if num == candidate else -1)\n    // Verify candidate\n    count = 0\n    for num in arr:\n        if num == candidate:\n            count++\n    return count > LENGTH(arr) / 2 ? candidate : -1\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Find element appearing more than n/2 times", "Find maximum element", "Sort array", "Count all elements"],
    "answer": "Find element appearing more than n/2 times",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Boyer-Moore on [3,2,3]. What is the majority element?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["3", "2", "No majority", "Both 2 and 3"],
    "answer": "3",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Boyer-Moore algorithm:\n\n```\nfor num in arr:\n    if count == 0:\n        candidate = num\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["count = count + (1 if num == candidate else -1)", "count = count + 1", "count = 0", "candidate = num"],
    "answer": "count = count + (1 if num == candidate else -1)",
    "difficulty": "MEDIUM"
  },

  // Fisher-Yates Shuffle
  {
    "text": "What is the Fisher-Yates shuffle algorithm?\n\n```\nFUNCTION Shuffle(arr):\n    for i = LENGTH(arr) - 1 down to 1:\n        j = RANDOM(0, i)  // random index from 0 to i\n        SWAP(arr[i], arr[j])\n    return arr\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Randomly permute array elements", "Sort array randomly", "Find random element", "Remove random elements"],
    "answer": "Randomly permute array elements",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Fisher-Yates ensures what property?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["Each permutation equally likely", "Array becomes sorted", "Duplicates removed", "Array reversed"],
    "answer": "Each permutation equally likely",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Fisher-Yates shuffle:\n\n```\nfor i = LENGTH(arr) - 1 down to 1:\n    j = RANDOM(0, i)\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["SWAP(arr[i], arr[j])", "arr[i] = j", "i = j", "j = i"],
    "answer": "SWAP(arr[i], arr[j])",
    "difficulty": "MEDIUM"
  },

  // Reservoir Sampling
  {
    "text": "What problem does Reservoir Sampling solve?\n\n```\nFUNCTION ReservoirSample(stream, k):\n    reservoir = ARRAY[k]\n    // Fill reservoir with first k elements\n    for i = 0 to k-1:\n        reservoir[i] = stream[i]\n    \n    for i = k to LENGTH(stream)-1:\n        j = RANDOM(0, i)\n        if j < k:\n            reservoir[j] = stream[i]\n    \n    return reservoir\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Sample k items from stream of unknown size", "Sort stream elements", "Find k largest elements", "Count stream elements"],
    "answer": "Sample k items from stream of unknown size",
    "difficulty": "HARD"
  },
  {
    "text": "Reservoir sampling with k=2 from stream [1,2,3,4]. What's the probability of selecting any element?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["1/2", "1/4", "2/4", "1/3"],
    "answer": "1/2",
    "difficulty": "HARD"
  },
  {
    "text": "Complete reservoir sampling:\n\n```\nfor i = k to LENGTH(stream)-1:\n    j = RANDOM(0, i)\n    if j < k:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["reservoir[j] = stream[i]", "reservoir[i] = stream[j]", "j = i", "k = j"],
    "answer": "reservoir[j] = stream[i]",
    "difficulty": "HARD"
  },

  // More String Algorithms
  {
    "text": "What is the KMP (Knuth-Morris-Pratt) algorithm used for?\n\n```\nFUNCTION KMPSearch(text, pattern):\n    lps = ComputeLPS(pattern)\n    i = 0  // index for text\n    j = 0  // index for pattern\n    while i < LENGTH(text):\n        if pattern[j] == text[i]:\n            i++, j++\n        if j == LENGTH(pattern):\n            PRINT('Found at index', i - j)\n            j = lps[j - 1]\n        else if i < LENGTH(text) AND pattern[j] != text[i]:\n            if j != 0:\n                j = lps[j - 1]\n            else:\n                i++\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Efficient string pattern matching", "String compression", "String reversal", "Anagram detection"],
    "answer": "Efficient string pattern matching",
    "difficulty": "HARD"
  },
  {
    "text": "KMP algorithm time complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["O(n + m)", "O(n * m)", "O(n²)", "O(m²)"],
    "answer": "O(n + m)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete KMP search:\n\n```\nif pattern[j] == text[i]:\n    i++, j++\nif j == LENGTH(pattern):\n    PRINT('Found at index', i - j)\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["j = lps[j - 1]", "j = 0", "i = 0", "j = LENGTH(pattern)"],
    "answer": "j = lps[j - 1]",
    "difficulty": "HARD"
  },

  // Rabin-Karp Algorithm
  {
    "text": "What technique does Rabin-Karp use for pattern matching?\n\n```\nFUNCTION RabinKarp(text, pattern):\n    patternHash = Hash(pattern)\n    textHash = Hash(text[0:LENGTH(pattern)])\n    \n    for i = 0 to LENGTH(text) - LENGTH(pattern):\n        if patternHash == textHash:\n            if text[i:i+LENGTH(pattern)] == pattern:\n                PRINT('Found at index', i)\n        \n        if i < LENGTH(text) - LENGTH(pattern):\n            textHash = RollingHash(textHash, text[i], text[i+LENGTH(pattern)])\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Rolling hash for pattern matching", "Suffix arrays", "Trie data structure", "Dynamic programming"],
    "answer": "Rolling hash for pattern matching",
    "difficulty": "HARD"
  },
  {
    "text": "Rabin-Karp average time complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["O(n + m)", "O(n * m)", "O(n)", "O(m)"],
    "answer": "O(n + m)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Rabin-Karp:\n\n```\nif patternHash == textHash:\n    if text[i:i+LENGTH(pattern)] == pattern:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["PRINT('Found at index', i)", "i = i + 1", "patternHash = 0", "textHash = 0"],
    "answer": "PRINT('Found at index', i)",
    "difficulty": "HARD"
  },

  // Manacher's Algorithm
  {
    "text": "What problem does Manacher's algorithm solve efficiently?\n\n```\nFUNCTION Manacher(s):\n    // Preprocess string\n    processedS = '#'.join('^{}$'.format(s))\n    n = LENGTH(processedS)\n    P = ARRAY[n] filled with 0\n    center = 0\n    right = 0\n    \n    for i = 1 to n-2:\n        mirror = 2 * center - i\n        if i < right:\n            P[i] = MIN(right - i, P[mirror])\n        \n        // Try to expand palindrome centered at i\n        while processedS[i + (1 + P[i])] == processedS[i - (1 + P[i])]:\n            P[i]++\n        \n        if i + P[i] > right:\n            center = i\n            right = i + P[i]\n    \n    return P\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Find all palindromes in linear time", "String matching", "String compression", "Anagram detection"],
    "answer": "Find all palindromes in linear time",
    "difficulty": "HARD"
  },
  {
    "text": "Manacher's algorithm time complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["O(n)", "O(n²)", "O(n log n)", "O(n³)"],
    "answer": "O(n)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Manacher's algorithm:\n\n```\nif i < right:\n    P[i] = MIN(right - i, P[mirror])\n\nwhile processedS[i + (1 + P[i])] == processedS[i - (1 + P[i])]:\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["P[i]++", "P[i]--", "i++", "right++"],
    "answer": "P[i]++",
    "difficulty": "HARD"
  },

  // Advanced Graph Algorithms
  {
    "text": "What is the purpose of Tarjan's algorithm for SCCs?\n\n```\nFUNCTION TarjanSCC(graph):\n    index = 0\n    stack = EMPTY_STACK\n    indices = ARRAY[V] filled with -1\n    lowlinks = ARRAY[V] filled with -1\n    onStack = ARRAY[V] filled with false\n    \n    for v = 0 to V-1:\n        if indices[v] == -1:\n            StrongConnect(v)\n    \nFUNCTION StrongConnect(v):\n    indices[v] = index\n    lowlinks[v] = index\n    index++\n    stack.PUSH(v)\n    onStack[v] = true\n    \n    for w in graph[v]:\n        if indices[w] == -1:\n            StrongConnect(w)\n            lowlinks[v] = MIN(lowlinks[v], lowlinks[w])\n        else if onStack[w]:\n            lowlinks[v] = MIN(lowlinks[v], indices[w])\n    \n    if lowlinks[v] == indices[v]:\n        // Start a new SCC\n        repeat:\n            w = stack.POP()\n            onStack[w] = false\n            PRINT(w, 'is in SCC')\n        until w == v\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Find strongly connected components", "Find shortest paths", "Find minimum spanning tree", "Detect cycles"],
    "answer": "Find strongly connected components",
    "difficulty": "HARD"
  },
  {
    "text": "Tarjan's SCC algorithm time complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["O(V + E)", "O(V²)", "O(V * E)", "O(V³)"],
    "answer": "O(V + E)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Tarjan's SCC:\n\n```\nif lowlinks[v] == indices[v]:\n    repeat:\n        w = stack.POP()\n        _______________\n        PRINT(w, 'is in SCC')\n    until w == v\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["onStack[w] = false", "onStack[w] = true", "indices[w] = -1", "lowlinks[w] = 0"],
    "answer": "onStack[w] = false",
    "difficulty": "HARD"
  },

  // A* Search Algorithm
  {
    "text": "What makes A* different from Dijkstra's algorithm?\n\n```\nFUNCTION AStar(start, goal, graph, heuristic):\n    openSet = PRIORITY_QUEUE\n    openSet.INSERT(start, 0)\n    gScore = MAP with gScore[start] = 0\n    fScore = MAP with fScore[start] = heuristic(start, goal)\n    \n    while NOT openSet.EMPTY():\n        current = openSet.EXTRACT_MIN()\n        \n        if current == goal:\n            return ReconstructPath(current)\n        \n        for neighbor in graph[current]:\n            tentativeG = gScore[current] + distance(current, neighbor)\n            \n            if tentativeG < gScore[neighbor]:\n                gScore[neighbor] = tentativeG\n                fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal)\n                if neighbor NOT IN openSet:\n                    openSet.INSERT(neighbor, fScore[neighbor])\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Uses heuristic function to guide search", "Only works on weighted graphs", "Finds all shortest paths", "Uses DFS instead of BFS"],
    "answer": "Uses heuristic function to guide search",
    "difficulty": "HARD"
  },
  {
    "text": "A* is optimal when the heuristic is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["Admissible (never overestimates)", "Always returns 0", "Random values", "Always maximum possible"],
    "answer": "Admissible (never overestimates)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete A* algorithm:\n\n```\nif tentativeG < gScore[neighbor]:\n    gScore[neighbor] = tentativeG\n    _______________\n    if neighbor NOT IN openSet:\n        openSet.INSERT(neighbor, fScore[neighbor])\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal)", "fScore[neighbor] = gScore[neighbor]", "fScore[neighbor] = heuristic(neighbor, goal)", "gScore[neighbor] = 0"],
    "answer": "fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal)",
    "difficulty": "HARD"
  },

  // Network Flow - Ford-Fulkerson
  {
    "text": "What is the Ford-Fulkerson method for?\n\n```\nFUNCTION FordFulkerson(graph, source, sink):\n    maxFlow = 0\n    \n    while EXISTS augmentingPath FROM source TO sink:\n        pathFlow = INFINITY\n        \n        // Find minimum capacity along the path\n        for edge in augmentingPath:\n            pathFlow = MIN(pathFlow, edge.capacity)\n        \n        // Update residual capacities\n        for edge in augmentingPath:\n            edge.capacity = edge.capacity - pathFlow\n            edge.reverse.capacity = edge.reverse.capacity + pathFlow\n        \n        maxFlow = maxFlow + pathFlow\n    \n    return maxFlow\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Maximum flow in flow network", "Shortest path", "Minimum cut", "Cycle detection"],
    "answer": "Maximum flow in flow network",
    "difficulty": "HARD"
  },
  {
    "text": "Ford-Fulkerson uses which concept repeatedly?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["Augmenting paths", "Spanning trees", "Topological sorting", "Strongly connected components"],
    "answer": "Augmenting paths",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Ford-Fulkerson:\n\n```\nfor edge in augmentingPath:\n    edge.capacity = edge.capacity - pathFlow\n    _______________\n\nmaxFlow = maxFlow + pathFlow\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["edge.reverse.capacity = edge.reverse.capacity + pathFlow", "edge.reverse.capacity = edge.capacity", "pathFlow = 0", "edge.capacity = 0"],
    "answer": "edge.reverse.capacity = edge.reverse.capacity + pathFlow",
    "difficulty": "HARD"
  },

  // Advanced DP - Palindromic Subsequences
  {
    "text": "What is the recurrence for counting palindromic subsequences?\n\n```\nFUNCTION CountPalindromicSubseq(s):\n    n = LENGTH(s)\n    dp = 2D_ARRAY[n][n] filled with 0\n    \n    // Every single character is a palindrome\n    for i = 0 to n-1:\n        dp[i][i] = 1\n    \n    for length = 2 to n:\n        for i = 0 to n - length:\n            j = i + length - 1\n            if s[i] == s[j]:\n                dp[i][j] = dp[i+1][j-1] * 2 + 1\n            else:\n                dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]\n    \n    return dp[0][n-1]\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["If ends match: 2*inner + 1, else: sum - intersection", "Always multiply by 2", "Add all possibilities", "Use recursion only"],
    "answer": "If ends match: 2*inner + 1, else: sum - intersection",
    "difficulty": "HARD"
  },
  {
    "text": "Count palindromic subsequences in 'bcc'. How many are there?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["6", "4", "5", "3"],
    "answer": "6",
    "difficulty": "HARD"
  },
  {
    "text": "Complete palindromic subsequences DP:\n\n```\nif s[i] == s[j]:\n    dp[i][j] = dp[i+1][j-1] * 2 + 1\nelse:\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]", "dp[i][j] = dp[i+1][j] + dp[i][j-1]", "dp[i][j] = dp[i+1][j-1]", "dp[i][j] = 0"],
    "answer": "dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]",
    "difficulty": "HARD"
  },

  // More Advanced Tree Algorithms
  {
    "text": "What is the purpose of Heavy-Light Decomposition?\n\n```\nFUNCTION HeavyLightDecomposition(tree):\n    // Preprocess to find heavy edges\n    for node in tree:\n        heavyChild = child with maximum subtree size\n        if heavyChild exists:\n            edge(node, heavyChild).type = HEAVY\n        \n    // Decompose into heavy paths\n    paths = EMPTY_LIST\n    for node in tree:\n        if node.parent == NULL OR edge(node.parent, node).type == LIGHT:\n            path = ExtractHeavyPath(node)\n            paths.ADD(path)\n    \n    return paths\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["Decompose tree into heavy paths for efficient queries", "Balance the tree", "Find tree diameter", "Compress tree nodes"],
    "answer": "Decompose tree into heavy paths for efficient queries",
    "difficulty": "HARD"
  },
  {
    "text": "Heavy-Light Decomposition allows queries in what time?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["O(log² n)", "O(log n)", "O(n)", "O(n log n)"],
    "answer": "O(log² n)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete heavy-light decomposition:\n\n```\nfor node in tree:\n    heavyChild = child with maximum subtree size\n    if heavyChild exists:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["edge(node, heavyChild).type = HEAVY", "edge(node, heavyChild).type = LIGHT", "heavyChild = NULL", "node = heavyChild"],
    "answer": "edge(node, heavyChild).type = HEAVY",
    "difficulty": "HARD"
  },

  // Advanced Greedy Algorithms
  {
    "text": "What is the greedy approach in Activity Selection?\n\n```\nFUNCTION ActivitySelection(activities):\n    SORT(activities) // by finish time\n    selected = EMPTY_LIST\n    lastFinishTime = 0\n    \n    for activity in activities:\n        if activity.start >= lastFinishTime:\n            selected.ADD(activity)\n            lastFinishTime = activity.finish\n    \n    return selected\n```",
    "type": "MCQ",
    "categories": ["Greedy"],
    "options": ["Always pick activity with earliest finish time", "Pick activity with longest duration", "Pick activity with latest start time", "Pick random activity"],
    "answer": "Always pick activity with earliest finish time",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Activities: [(1,3), (2,5), (4,6), (6,7)]. How many can be selected?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Greedy"],
    "options": ["3", "2", "4", "1"],
    "answer": "3",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete activity selection:\n\n```\nfor activity in activities:\n    if activity.start >= lastFinishTime:\n        selected.ADD(activity)\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Greedy"],
    "options": ["lastFinishTime = activity.finish", "lastFinishTime = activity.start", "activity.start = lastFinishTime", "selected.REMOVE(activity)"],
    "answer": "lastFinishTime = activity.finish",
    "difficulty": "MEDIUM"
  },

  // Huffman Coding
  {
    "text": "What principle does Huffman Coding use?\n\n```\nFUNCTION HuffmanCoding(frequencies):\n    heap = MIN_HEAP\n    \n    for char, freq in frequencies:\n        heap.INSERT(Node(char, freq))\n    \n    while heap.SIZE() > 1:\n        left = heap.EXTRACT_MIN()\n        right = heap.EXTRACT_MIN()\n        \n        merged = Node(NULL, left.freq + right.freq)\n        merged.left = left\n        merged.right = right\n        \n        heap.INSERT(merged)\n    \n    return heap.EXTRACT_MIN()  // root of Huffman tree\n```",
    "type": "MCQ",
    "categories": ["Greedy"],
    "options": ["Assign shorter codes to more frequent characters", "Sort characters alphabetically", "Use fixed-length codes", "Compress without encoding"],
    "answer": "Assign shorter codes to more frequent characters",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Huffman coding for frequencies: A(5), B(2), C(1). What is optimal?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Greedy"],
    "options": ["A gets shortest code", "All get same length codes", "C gets shortest code", "B gets shortest code"],
    "answer": "A gets shortest code",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Huffman coding:\n\n```\nwhile heap.SIZE() > 1:\n    left = heap.EXTRACT_MIN()\n    right = heap.EXTRACT_MIN()\n    \n    merged = Node(NULL, left.freq + right.freq)\n    merged.left = left\n    merged.right = right\n    \n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Greedy"],
    "options": ["heap.INSERT(merged)", "heap.EXTRACT_MIN()", "merged = NULL", "left = right"],
    "answer": "heap.INSERT(merged)",
    "difficulty": "MEDIUM"
  },

  // Segment Tree
  {
    "text": "What is the main advantage of Segment Trees?\n\n```\nSTRUCT SegmentTree:\n    tree = ARRAY[4 * n]\n    \nFUNCTION Build(arr, node, start, end):\n    if start == end:\n        tree[node] = arr[start]\n    else:\n        mid = (start + end) / 2\n        Build(arr, 2*node, start, mid)\n        Build(arr, 2*node+1, mid+1, end)\n        tree[node] = tree[2*node] + tree[2*node+1]\n\nFUNCTION Query(node, start, end, l, r):\n    if r < start OR end < l:\n        return 0\n    if l <= start AND end <= r:\n        return tree[node]\n    mid = (start + end) / 2\n    return Query(2*node, start, mid, l, r) + Query(2*node+1, mid+1, end, l, r)\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["Range queries in O(log n) time", "Sorting in O(n log n)", "Search in O(1) time", "Insert in O(1) time"],
    "answer": "Range queries in O(log n) time",
    "difficulty": "HARD"
  },
  {
    "text": "Segment tree for array [1,3,5,7,9,11]. What is sum query(1,3)?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["15", "12", "16", "18"],
    "answer": "15",
    "difficulty": "HARD"
  },
  {
    "text": "Complete segment tree build:\n\n```\nif start == end:\n    tree[node] = arr[start]\nelse:\n    mid = (start + end) / 2\n    Build(arr, 2*node, start, mid)\n    Build(arr, 2*node+1, mid+1, end)\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["tree[node] = tree[2*node] + tree[2*node+1]", "tree[node] = arr[start]", "tree[node] = mid", "node = 2*node"],
    "answer": "tree[node] = tree[2*node] + tree[2*node+1]",
    "difficulty": "HARD"
  },

  // Fenwick Tree (Binary Indexed Tree)
  {
    "text": "What is the key insight behind Fenwick Tree?\n\n```\nCLASS FenwickTree:\n    tree = ARRAY[n+1] filled with 0\n    \n    FUNCTION Update(index, delta):\n        while index <= n:\n            tree[index] = tree[index] + delta\n            index = index + (index & -index)\n    \n    FUNCTION Query(index):\n        sum = 0\n        while index > 0:\n            sum = sum + tree[index]\n            index = index - (index & -index)\n        return sum\n    \n    FUNCTION RangeQuery(left, right):\n        return Query(right) - Query(left - 1)\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["Use binary representation for efficient updates", "Use hash tables", "Use linked lists", "Use stack operations"],
    "answer": "Use binary representation for efficient updates",
    "difficulty": "HARD"
  },
  {
    "text": "Fenwick tree operation: index & -index for index=12. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["4", "8", "12", "2"],
    "answer": "4",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Fenwick tree update:\n\n```\nFUNCTION Update(index, delta):\n    while index <= n:\n        tree[index] = tree[index] + delta\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["index = index + (index & -index)", "index = index + 1", "index = index * 2", "index = index - 1"],
    "answer": "index = index + (index & -index)",
    "difficulty": "HARD"
  },

  // Z Algorithm
  {
    "text": "What does the Z Algorithm compute?\n\n```\nFUNCTION ZAlgorithm(s):\n    n = LENGTH(s)\n    Z = ARRAY[n] filled with 0\n    l = 0, r = 0\n    \n    for i = 1 to n-1:\n        if i <= r:\n            Z[i] = MIN(r - i + 1, Z[i - l])\n        \n        while i + Z[i] < n AND s[Z[i]] == s[i + Z[i]]:\n            Z[i]++\n        \n        if i + Z[i] - 1 > r:\n            l = i\n            r = i + Z[i] - 1\n    \n    return Z\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Length of longest substring starting from each position that matches prefix", "All palindromes in string", "Character frequencies", "Lexicographically smallest rotation"],
    "answer": "Length of longest substring starting from each position that matches prefix",
    "difficulty": "HARD"
  },
  {
    "text": "Z array for string 'aabaaba'. What is Z[3]?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["4", "3", "2", "1"],
    "answer": "4",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Z algorithm:\n\n```\nwhile i + Z[i] < n AND s[Z[i]] == s[i + Z[i]]:\n    Z[i]++\n\nif i + Z[i] - 1 > r:\n    _______________\n    r = i + Z[i] - 1\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["l = i", "l = r", "i = l", "r = l"],
    "answer": "l = i",
    "difficulty": "HARD"
  },

  // Suffix Array
  {
    "text": "What is a Suffix Array?\n\n```\nFUNCTION BuildSuffixArray(s):\n    n = LENGTH(s)\n    suffixes = EMPTY_LIST\n    \n    for i = 0 to n-1:\n        suffixes.ADD((s[i:n], i))  // (suffix, original_index)\n    \n    SORT(suffixes)  // lexicographically\n    \n    suffixArray = EMPTY_LIST\n    for suffix, index in suffixes:\n        suffixArray.ADD(index)\n    \n    return suffixArray\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Sorted array of all suffix starting positions", "Array of character frequencies", "Array of palindrome positions", "Array of pattern matches"],
    "answer": "Sorted array of all suffix starting positions",
    "difficulty": "HARD"
  },
  {
    "text": "Suffix array for 'banana'. What is the first element?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["5 (suffix 'a')", "0 (suffix 'banana')", "3 (suffix 'ana')", "1 (suffix 'anana')"],
    "answer": "5 (suffix 'a')",
    "difficulty": "HARD"
  },
  {
    "text": "Complete suffix array construction:\n\n```\nfor i = 0 to n-1:\n    suffixes.ADD((s[i:n], i))\n\nSORT(suffixes)\n\nsuffixArray = EMPTY_LIST\nfor suffix, index in suffixes:\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["suffixArray.ADD(index)", "suffixArray.ADD(suffix)", "index = suffix", "suffixArray.SORT()"],
    "answer": "suffixArray.ADD(index)",
    "difficulty": "HARD"
  },

  // Backtracking - N-Queens
  {
    "text": "What is the constraint in N-Queens problem?\n\n```\nFUNCTION SolveNQueens(n):\n    board = 2D_ARRAY[n][n] filled with false\n    result = EMPTY_LIST\n    PlaceQueens(board, 0, result)\n    return result\n\nFUNCTION PlaceQueens(board, row, result):\n    if row == n:\n        result.ADD(COPY(board))\n        return\n    \n    for col = 0 to n-1:\n        if IsSafe(board, row, col):\n            board[row][col] = true\n            PlaceQueens(board, row + 1, result)\n            board[row][col] = false  // backtrack\n\nFUNCTION IsSafe(board, row, col):\n    // Check column, diagonals for conflicts\n    for i = 0 to row-1:\n        if board[i][col] OR \n           board[i][col - (row - i)] OR \n           board[i][col + (row - i)]:\n            return false\n    return true\n```",
    "type": "MCQ",
    "categories": ["Backtracking"],
    "options": ["No two queens attack each other", "Queens must be adjacent", "All queens in same row", "Minimize queen count"],
    "answer": "No two queens attack each other",
    "difficulty": "HARD"
  },
  {
    "text": "How many solutions exist for 4-Queens problem?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Backtracking"],
    "options": ["2", "1", "4", "0"],
    "answer": "2",
    "difficulty": "HARD"
  },
  {
    "text": "Complete N-Queens backtracking:\n\n```\nfor col = 0 to n-1:\n    if IsSafe(board, row, col):\n        board[row][col] = true\n        PlaceQueens(board, row + 1, result)\n        _______________  // backtrack\n```",
    "type": "FILL_BLANK",
    "categories": ["Backtracking"],
    "options": ["board[row][col] = false", "board[row][col] = true", "row = row - 1", "col = col - 1"],
    "answer": "board[row][col] = false",
    "difficulty": "HARD"
  },

  // Sudoku Solver
  {
    "text": "What is the backtracking approach for Sudoku?\n\n```\nFUNCTION SolveSudoku(board):\n    for row = 0 to 8:\n        for col = 0 to 8:\n            if board[row][col] == 0:\n                for num = 1 to 9:\n                    if IsValid(board, row, col, num):\n                        board[row][col] = num\n                        if SolveSudoku(board):\n                            return true\n                        board[row][col] = 0  // backtrack\n                return false\n    return true  // all cells filled\n\nFUNCTION IsValid(board, row, col, num):\n    // Check row, column, and 3x3 box\n    for i = 0 to 8:\n        if board[row][i] == num OR board[i][col] == num:\n            return false\n    \n    startRow = (row / 3) * 3\n    startCol = (col / 3) * 3\n    for i = 0 to 2:\n        for j = 0 to 2:\n            if board[startRow + i][startCol + j] == num:\n                return false\n    return true\n```",
    "type": "MCQ",
    "categories": ["Backtracking"],
    "options": ["Try numbers 1-9, backtrack if invalid", "Fill randomly", "Use mathematical formula", "Sort numbers first"],
    "answer": "Try numbers 1-9, backtrack if invalid",
    "difficulty": "HARD"
  },
  {
    "text": "Sudoku validation checks which constraints?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Backtracking"],
    "options": ["Row, column, and 3x3 box", "Only row and column", "Only 3x3 box", "Diagonal constraints"],
    "answer": "Row, column, and 3x3 box",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Sudoku solver:\n\n```\nfor num = 1 to 9:\n    if IsValid(board, row, col, num):\n        board[row][col] = num\n        if SolveSudoku(board):\n            return true\n        _______________  // backtrack\n```",
    "type": "FILL_BLANK",
    "categories": ["Backtracking"],
    "options": ["board[row][col] = 0", "board[row][col] = num", "num = 0", "return false"],
    "answer": "board[row][col] = 0",
    "difficulty": "HARD"
  },

  // Graph Coloring
  {
    "text": "What is the goal of Graph Coloring problem?\n\n```\nFUNCTION GraphColoring(graph, m, colors, vertex):\n    if vertex == V:\n        return true  // all vertices colored\n    \n    for color = 1 to m:\n        if IsSafeColor(graph, vertex, color, colors):\n            colors[vertex] = color\n            if GraphColoring(graph, m, colors, vertex + 1):\n                return true\n            colors[vertex] = 0  // backtrack\n    \n    return false\n\nFUNCTION IsSafeColor(graph, vertex, color, colors):\n    for i = 0 to V-1:\n        if graph[vertex][i] AND colors[i] == color:\n            return false\n    return true\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Color vertices so no adjacent vertices have same color", "Color all vertices with same color", "Use maximum colors possible", "Color vertices randomly"],
    "answer": "Color vertices so no adjacent vertices have same color",
    "difficulty": "HARD"
  },
  {
    "text": "Minimum colors needed for a triangle graph (3 vertices, all connected)?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["3", "2", "1", "4"],
    "answer": "3",
    "difficulty": "HARD"
  },
  {
    "text": "Complete graph coloring:\n\n```\nfor color = 1 to m:\n    if IsSafeColor(graph, vertex, color, colors):\n        colors[vertex] = color\n        if GraphColoring(graph, m, colors, vertex + 1):\n            return true\n        _______________  // backtrack\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["colors[vertex] = 0", "colors[vertex] = color", "color = 0", "vertex = vertex - 1"],
    "answer": "colors[vertex] = 0",
    "difficulty": "HARD"
  },

  // Hamiltonian Path
  {
    "text": "What is a Hamiltonian Path?\n\n```\nFUNCTION FindHamiltonianPath(graph, path, pos):\n    if pos == V:\n        return true  // visited all vertices\n    \n    for v = 0 to V-1:\n        if IsSafeVertex(v, graph, path, pos):\n            path[pos] = v\n            if FindHamiltonianPath(graph, path, pos + 1):\n                return true\n            path[pos] = -1  // backtrack\n    \n    return false\n\nFUNCTION IsSafeVertex(v, graph, path, pos):\n    // Check if vertex v can be added to path\n    if graph[path[pos-1]][v] == 0:\n        return false  // no edge\n    \n    for i = 0 to pos-1:\n        if path[i] == v:\n            return false  // already visited\n    \n    return true\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Path visiting each vertex exactly once", "Path visiting each edge exactly once", "Shortest path between two vertices", "Path with maximum weight"],
    "answer": "Path visiting each vertex exactly once",
    "difficulty": "HARD"
  },
  {
    "text": "Does every connected graph have a Hamiltonian path?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["No", "Yes", "Only for complete graphs", "Only for trees"],
    "answer": "No",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Hamiltonian path finding:\n\n```\nfor v = 0 to V-1:\n    if IsSafeVertex(v, graph, path, pos):\n        path[pos] = v\n        if FindHamiltonianPath(graph, path, pos + 1):\n            return true\n        _______________  // backtrack\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["path[pos] = -1", "path[pos] = v", "pos = pos - 1", "v = -1"],
    "answer": "path[pos] = -1",
    "difficulty": "HARD"
  },

  // Advanced Bit Manipulation
  {
    "text": "What does the expression x & (x-1) do?\n\n```\nFUNCTION CountSetBits(n):\n    count = 0\n    while n:\n        count++\n        n = n & (n - 1)\n    return count\n\nFUNCTION IsPowerOfTwo(n):\n    return n > 0 AND (n & (n - 1)) == 0\n\nFUNCTION ClearRightmostSetBit(n):\n    return n & (n - 1)\n```",
    "type": "MCQ",
    "categories": ["BitManipulation"],
    "options": ["Clears the rightmost set bit", "Sets the rightmost bit", "Shifts bits right", "Counts total bits"],
    "answer": "Clears the rightmost set bit",
    "difficulty": "MEDIUM"
  },
  {
    "text": "What is 12 & (12-1)? (12 = 1100 in binary)",
    "type": "PREDICT_OUTPUT",
    "categories": ["BitManipulation"],
    "options": ["8 (1000)", "11 (1011)", "4 (0100)", "0 (0000)"],
    "answer": "8 (1000)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete bit manipulation for power of 2 check:\n\n```\nFUNCTION IsPowerOfTwo(n):\n    return n > 0 AND _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["BitManipulation"],
    "options": ["(n & (n - 1)) == 0", "(n | (n - 1)) == 0", "(n ^ (n - 1)) == 0", "(n + (n - 1)) == 0"],
    "answer": "(n & (n - 1)) == 0",
    "difficulty": "MEDIUM"
  },

  // XOR Properties
  {
    "text": "What is the XOR trick for finding single element?\n\n```\nFUNCTION FindSingle(arr):\n    result = 0\n    for num in arr:\n        result = result XOR num\n    return result\n\n// Find two single elements\nFUNCTION FindTwoSingles(arr):\n    xor_all = 0\n    for num in arr:\n        xor_all = xor_all XOR num\n    \n    rightmost_set_bit = xor_all & (-xor_all)\n    \n    num1 = 0, num2 = 0\n    for num in arr:\n        if num & rightmost_set_bit:\n            num1 = num1 XOR num\n        else:\n            num2 = num2 XOR num\n    \n    return [num1, num2]\n```",
    "type": "MCQ",
    "categories": ["BitManipulation"],
    "options": ["XOR of identical numbers is 0, XOR with 0 gives original", "XOR always gives 1", "XOR counts set bits", "XOR performs addition"],
    "answer": "XOR of identical numbers is 0, XOR with 0 gives original",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Array [2,3,2,4,4]. Using XOR trick, what is the single element?",
    "type": "PREDICT_OUTPUT",
    "categories": ["BitManipulation"],
    "options": ["3", "2", "4", "0"],
    "answer": "3",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete single element finder:\n\n```\nFUNCTION FindSingle(arr):\n    result = 0\n    for num in arr:\n        _______________\n    return result\n```",
    "type": "FILL_BLANK",
    "categories": ["BitManipulation"],
    "options": ["result = result XOR num", "result = result + num", "result = result * num", "result = result & num"],
    "answer": "result = result XOR num",
    "difficulty": "MEDIUM"
  },

  // Rolling Hash
  {
    "text": "What is the formula for Rolling Hash?\n\n```\nFUNCTION RollingHash(text, pattern_length):\n    base = 256\n    mod = 101\n    hash_value = 0\n    \n    // Calculate initial hash\n    for i = 0 to pattern_length - 1:\n        hash_value = (hash_value * base + text[i]) % mod\n    \n    // Rolling hash for remaining characters\n    for i = pattern_length to LENGTH(text) - 1:\n        // Remove leading character\n        hash_value = (hash_value - text[i - pattern_length] * POWER(base, pattern_length - 1)) % mod\n        // Add trailing character\n        hash_value = (hash_value * base + text[i]) % mod\n    \n    return hash_value\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Remove leading, shift, add trailing character", "Always recalculate from scratch", "Use only addition", "Use only multiplication"],
    "answer": "Remove leading, shift, add trailing character",
    "difficulty": "HARD"
  },
  {
    "text": "Rolling hash advantage over naive string matching?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["O(1) hash computation per position", "Always finds exact matches", "Uses less memory", "Works only on sorted strings"],
    "answer": "O(1) hash computation per position",
    "difficulty": "HARD"
  },
  {
    "text": "Complete rolling hash update:\n\n```\n// Remove leading character\nhash_value = (hash_value - text[i - pattern_length] * POWER(base, pattern_length - 1)) % mod\n// Add trailing character\n_______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["hash_value = (hash_value * base + text[i]) % mod", "hash_value = text[i]", "hash_value = hash_value + text[i]", "hash_value = hash_value * text[i]"],
    "answer": "hash_value = (hash_value * base + text[i]) % mod",
    "difficulty": "HARD"
  },

  // Morris Traversal
  {
    "text": "What is the key idea behind Morris Traversal?\n\n```\nFUNCTION MorrisInorder(root):\n    current = root\n    \n    while current != NULL:\n        if current.left == NULL:\n            PRINT(current.data)\n            current = current.right\n        else:\n            // Find inorder predecessor\n            predecessor = current.left\n            while predecessor.right != NULL AND predecessor.right != current:\n                predecessor = predecessor.right\n            \n            if predecessor.right == NULL:\n                predecessor.right = current  // create thread\n                current = current.left\n            else:\n                predecessor.right = NULL  // remove thread\n                PRINT(current.data)\n                current = current.right\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["Tree traversal without recursion or stack using threading", "Balanced tree construction", "Tree compression", "Parallel tree processing"],
    "answer": "Tree traversal without recursion or stack using threading",
    "difficulty": "HARD"
  },
  {
    "text": "Morris traversal space complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "answer": "O(1)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Morris traversal:\n\n```\nif predecessor.right == NULL:\n    predecessor.right = current  // create thread\n    current = current.left\nelse:\n    _______________  // remove thread\n    PRINT(current.data)\n    current = current.right\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["predecessor.right = NULL", "predecessor.right = current", "current = predecessor", "predecessor = NULL"],
    "answer": "predecessor.right = NULL",
    "difficulty": "HARD"
  },

  // Convex Hull - Graham Scan
  {
    "text": "What is the Graham Scan algorithm for?\n\n```\nFUNCTION GrahamScan(points):\n    // Find bottom-most point (or leftmost if tie)\n    start = FindBottomMost(points)\n    \n    // Sort points by polar angle with respect to start\n    SORT(points) // by polar angle\n    \n    stack = EMPTY_STACK\n    stack.PUSH(start)\n    stack.PUSH(points[0])\n    \n    for i = 1 to LENGTH(points) - 1:\n        while stack.SIZE() >= 2 AND CrossProduct(stack.SECOND_TOP(), stack.TOP(), points[i]) <= 0:\n            stack.POP()\n        stack.PUSH(points[i])\n    \n    return stack  // convex hull\n\nFUNCTION CrossProduct(O, A, B):\n    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x)\n```",
    "type": "MCQ",
    "categories": ["Geometry"],
    "options": ["Find convex hull of points", "Find area of polygon", "Find center of mass", "Sort points by distance"],
    "answer": "Find convex hull of points",
    "difficulty": "HARD"
  },
  {
    "text": "Graham scan time complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Geometry"],
    "options": ["O(n log n)", "O(n²)", "O(n)", "O(n³)"],
    "answer": "O(n log n)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Graham scan:\n\n```\nwhile stack.SIZE() >= 2 AND CrossProduct(stack.SECOND_TOP(), stack.TOP(), points[i]) <= 0:\n    _______________\nstack.PUSH(points[i])\n```",
    "type": "FILL_BLANK",
    "categories": ["Geometry"],
    "options": ["stack.POP()", "stack.PUSH(points[i])", "i = i + 1", "points[i] = NULL"],
    "answer": "stack.POP()",
    "difficulty": "HARD"
  },

  // Miller-Rabin Primality Test
  {
    "text": "What type of algorithm is Miller-Rabin?\n\n```\nFUNCTION MillerRabin(n, k):\n    if n <= 1: return false\n    if n <= 3: return true\n    if n % 2 == 0: return false\n    \n    // Write n-1 as d * 2^r\n    r = 0\n    d = n - 1\n    while d % 2 == 0:\n        d = d / 2\n        r = r + 1\n    \n    // Repeat k times\n    for i = 1 to k:\n        a = RANDOM(2, n - 2)\n        x = POWER(a, d) % n\n        \n        if x == 1 OR x == n - 1:\n            continue\n        \n        for j = 1 to r - 1:\n            x = (x * x) % n\n            if x == n - 1:\n                break\n        else:\n            return false  // composite\n    \n    return true  // probably prime\n```",
    "type": "MCQ",
    "categories": ["NumberTheory"],
    "options": ["Probabilistic primality testing", "Deterministic factorization", "Perfect primality proof", "Number sorting"],
    "answer": "Probabilistic primality testing",
    "difficulty": "HARD"
  },
  {
    "text": "Miller-Rabin with more rounds gives what?",
    "type": "PREDICT_OUTPUT",
    "categories": ["NumberTheory"],
    "options": ["Higher confidence in result", "Faster execution", "Exact factorization", "Smaller memory usage"],
    "answer": "Higher confidence in result",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Miller-Rabin test:\n\n```\nfor j = 1 to r - 1:\n    x = (x * x) % n\n    if x == n - 1:\n        break\nelse:\n    _______________  // composite\n```",
    "type": "FILL_BLANK",
    "categories": ["NumberTheory"],
    "options": ["return false", "return true", "continue", "x = 1"],
    "answer": "return false",
    "difficulty": "HARD"
  },

  // Euclidean Algorithm
  {
    "text": "What does the Euclidean algorithm compute?\n\n```\nFUNCTION GCD(a, b):\n    while b != 0:\n        temp = b\n        b = a % b\n        a = temp\n    return a\n\nFUNCTION ExtendedGCD(a, b):\n    if a == 0:\n        return b, 0, 1\n    \n    gcd, x1, y1 = ExtendedGCD(b % a, a)\n    x = y1 - (b / a) * x1\n    y = x1\n    \n    return gcd, x, y  // ax + by = gcd\n```",
    "type": "MCQ",
    "categories": ["NumberTheory"],
    "options": ["Greatest Common Divisor", "Least Common Multiple", "Prime factorization", "Modular inverse"],
    "answer": "Greatest Common Divisor",
    "difficulty": "MEDIUM"
  },
  {
    "text": "GCD(48, 18) using Euclidean algorithm. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["NumberTheory"],
    "options": ["6", "3", "9", "12"],
    "answer": "6",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Euclidean algorithm:\n\n```\nFUNCTION GCD(a, b):\n    while b != 0:\n        temp = b\n        _______________\n        a = temp\n    return a\n```",
    "type": "FILL_BLANK",
    "categories": ["NumberTheory"],
    "options": ["b = a % b", "b = a + b", "b = a - b", "b = a * b"],
    "answer": "b = a % b",
    "difficulty": "MEDIUM"
  },

  // Sieve of Eratosthenes
  {
    "text": "What is the Sieve of Eratosthenes used for?\n\n```\nFUNCTION SieveOfEratosthenes(n):\n    prime = ARRAY[n+1] filled with true\n    prime[0] = prime[1] = false\n    \n    for p = 2 to SQRT(n):\n        if prime[p]:\n            for i = p*p to n step p:\n                prime[i] = false\n    \n    primes = EMPTY_LIST\n    for i = 2 to n:\n        if prime[i]:\n            primes.ADD(i)\n    \n    return primes\n```",
    "type": "MCQ",
    "categories": ["NumberTheory"],
    "options": ["Find all prime numbers up to n", "Find prime factorization", "Check if single number is prime", "Generate random primes"],
    "answer": "Find all prime numbers up to n",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Sieve of Eratosthenes for n=10. How many primes found?",
    "type": "PREDICT_OUTPUT",
    "categories": ["NumberTheory"],
    "options": ["4", "5", "3", "6"],
    "answer": "4",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Sieve of Eratosthenes:\n\n```\nfor p = 2 to SQRT(n):\n    if prime[p]:\n        for i = p*p to n step p:\n            _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["NumberTheory"],
    "options": ["prime[i] = false", "prime[i] = true", "i = i + 1", "p = p + 1"],
    "answer": "prime[i] = false",
    "difficulty": "MEDIUM"
  },

  // Fast Exponentiation
  {
    "text": "What is the time complexity of fast exponentiation?\n\n```\nFUNCTION FastPower(base, exp, mod):\n    result = 1\n    base = base % mod\n    \n    while exp > 0:\n        if exp % 2 == 1:\n            result = (result * base) % mod\n        \n        exp = exp / 2\n        base = (base * base) % mod\n    \n    return result\n```",
    "type": "MCQ",
    "categories": ["NumberTheory"],
    "options": ["O(log n)", "O(n)", "O(n²)", "O(1)"],
    "answer": "O(log n)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Fast power: 2^10 mod 1000. What is 2^10?",
    "type": "PREDICT_OUTPUT",
    "categories": ["NumberTheory"],
    "options": ["1024", "1000", "24", "100"],
    "answer": "1024",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete fast exponentiation:\n\n```\nwhile exp > 0:\n    if exp % 2 == 1:\n        result = (result * base) % mod\n    \n    _______________\n    base = (base * base) % mod\n```",
    "type": "FILL_BLANK",
    "categories": ["NumberTheory"],
    "options": ["exp = exp / 2", "exp = exp - 1", "exp = exp + 1", "exp = exp * 2"],
    "answer": "exp = exp / 2",
    "difficulty": "MEDIUM"
  },

  // Catalan Numbers
  {
    "text": "What is the nth Catalan number formula?\n\n```\nFUNCTION CatalanNumber(n):\n    if n <= 1:\n        return 1\n    \n    catalan = ARRAY[n+1] filled with 0\n    catalan[0] = catalan[1] = 1\n    \n    for i = 2 to n:\n        for j = 0 to i-1:\n            catalan[i] = catalan[i] + catalan[j] * catalan[i-1-j]\n    \n    return catalan[n]\n\n// Alternative: C(n) = (2n)! / ((n+1)! * n!)\nFUNCTION CatalanDirect(n):\n    return Binomial(2*n, n) / (n + 1)\n```",
    "type": "MCQ",
    "categories": ["NumberTheory"],
    "options": ["C(n) = Σ C(i)*C(n-1-i) for i=0 to n-1", "C(n) = n!", "C(n) = 2^n", "C(n) = n²"],
    "answer": "C(n) = Σ C(i)*C(n-1-i) for i=0 to n-1",
    "difficulty": "HARD"
  },
  {
    "text": "4th Catalan number C(4) is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["NumberTheory"],
    "options": ["14", "5", "42", "8"],
    "answer": "14",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Catalan number computation:\n\n```\nfor i = 2 to n:\n    for j = 0 to i-1:\n        _______________\nreturn catalan[n]\n```",
    "type": "FILL_BLANK",
    "categories": ["NumberTheory"],
    "options": ["catalan[i] = catalan[i] + catalan[j] * catalan[i-1-j]", "catalan[i] = catalan[j]", "catalan[i] = i", "catalan[i] = catalan[i-1]"],
    "answer": "catalan[i] = catalan[i] + catalan[j] * catalan[i-1-j]",
    "difficulty": "HARD"
  },

  // Fibonacci Matrix Exponentiation
  {
    "text": "How can Fibonacci be computed in O(log n) time?\n\n```\nFUNCTION FibonacciMatrix(n):\n    if n == 0: return 0\n    if n == 1: return 1\n    \n    base_matrix = [[1, 1], [1, 0]]\n    result_matrix = MatrixPower(base_matrix, n-1)\n    \n    return result_matrix[0][0]\n\nFUNCTION MatrixPower(matrix, n):\n    if n == 1: return matrix\n    \n    if n % 2 == 0:\n        half = MatrixPower(matrix, n/2)\n        return MatrixMultiply(half, half)\n    else:\n        return MatrixMultiply(matrix, MatrixPower(matrix, n-1))\n\nFUNCTION MatrixMultiply(A, B):\n    return [[A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],\n            [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]]\n```",
    "type": "MCQ",
    "categories": ["NumberTheory"],
    "options": ["Matrix exponentiation using [[1,1],[1,0]]", "Simple recursion", "Iterative approach", "Lookup table"],
    "answer": "Matrix exponentiation using [[1,1],[1,0]]",
    "difficulty": "HARD"
  },
  {
    "text": "Matrix exponentiation for Fibonacci has time complexity?",
    "type": "PREDICT_OUTPUT",
    "categories": ["NumberTheory"],
    "options": ["O(log n)", "O(n)", "O(n²)", "O(1)"],
    "answer": "O(log n)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Fibonacci matrix method:\n\n```\nFUNCTION FibonacciMatrix(n):\n    if n == 0: return 0\n    if n == 1: return 1\n    \n    base_matrix = [[1, 1], [1, 0]]\n    result_matrix = MatrixPower(base_matrix, n-1)\n    \n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["NumberTheory"],
    "options": ["return result_matrix[0][0]", "return result_matrix[1][1]", "return result_matrix[0][1]", "return result_matrix[1][0]"],
    "answer": "return result_matrix[0][0]",
    "difficulty": "HARD"
  },

  // Union-Find with Path Compression
  {
    "text": "What optimizations does Union-Find use?\n\n```\nCLASS UnionFind:\n    parent = ARRAY[n]\n    rank = ARRAY[n] filled with 0\n    \n    FUNCTION Find(x):\n        if parent[x] != x:\n            parent[x] = Find(parent[x])  // path compression\n        return parent[x]\n    \n    FUNCTION Union(x, y):\n        rootX = Find(x)\n        rootY = Find(y)\n        \n        if rootX != rootY:\n            // Union by rank\n            if rank[rootX] < rank[rootY]:\n                parent[rootX] = rootY\n            else if rank[rootX] > rank[rootY]:\n                parent[rootY] = rootX\n            else:\n                parent[rootY] = rootX\n                rank[rootX]++\n    \n    FUNCTION Connected(x, y):\n        return Find(x) == Find(y)\n```",
    "type": "MCQ",
    "categories": ["DataStructures"],
    "options": ["Path compression and union by rank", "Only path compression", "Only union by rank", "No optimizations"],
    "answer": "Path compression and union by rank",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Optimized Union-Find operations have amortized complexity?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DataStructures"],
    "options": ["O(α(n)) - nearly constant", "O(log n)", "O(n)", "O(1)"],
    "answer": "O(α(n)) - nearly constant",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete Union-Find with path compression:\n\n```\nFUNCTION Find(x):\n    if parent[x] != x:\n        _______________  // path compression\n    return parent[x]\n```",
    "type": "FILL_BLANK",
    "categories": ["DataStructures"],
    "options": ["parent[x] = Find(parent[x])", "parent[x] = x", "x = parent[x]", "parent[x] = 0"],
    "answer": "parent[x] = Find(parent[x])",
    "difficulty": "MEDIUM"
  },

  // Monotonic Stack
  {
    "text": "What problems does Monotonic Stack solve?\n\n```\nFUNCTION NextGreaterElement(arr):\n    n = LENGTH(arr)\n    result = ARRAY[n] filled with -1\n    stack = EMPTY_STACK\n    \n    for i = 0 to n-1:\n        while NOT stack.EMPTY() AND arr[stack.TOP()] < arr[i]:\n            index = stack.POP()\n            result[index] = arr[i]\n        stack.PUSH(i)\n    \n    return result\n\nFUNCTION LargestRectangleArea(heights):\n    stack = EMPTY_STACK\n    maxArea = 0\n    \n    for i = 0 to LENGTH(heights):\n        height = heights[i] if i < LENGTH(heights) else 0\n        \n        while NOT stack.EMPTY() AND heights[stack.TOP()] > height:\n            h = heights[stack.POP()]\n            w = i if stack.EMPTY() else (i - stack.TOP() - 1)\n            maxArea = MAX(maxArea, h * w)\n        \n        stack.PUSH(i)\n    \n    return maxArea\n```",
    "type": "MCQ",
    "categories": ["Stacks"],
    "options": ["Next/previous greater/smaller element problems", "Sorting problems", "Tree traversal", "Graph algorithms"],
    "answer": "Next/previous greater/smaller element problems",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Next greater element for [1,3,2,4]. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Stacks"],
    "options": ["[3,4,4,-1]", "[3,4,-1,-1]", "[-1,4,4,-1]", "[3,-1,4,-1]"],
    "answer": "[3,4,4,-1]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete monotonic stack for next greater:\n\n```\nwhile NOT stack.EMPTY() AND arr[stack.TOP()] < arr[i]:\n    index = stack.POP()\n    _______________\nstack.PUSH(i)\n```",
    "type": "FILL_BLANK",
    "categories": ["Stacks"],
    "options": ["result[index] = arr[i]", "result[i] = arr[index]", "result[index] = i", "result[i] = index"],
    "answer": "result[index] = arr[i]",
    "difficulty": "MEDIUM"
  },

  // Sliding Window Maximum
  {
    "text": "How does deque help in sliding window maximum?\n\n```\nFUNCTION SlidingWindowMaximum(arr, k):\n    deque = EMPTY_DEQUE\n    result = EMPTY_LIST\n    \n    for i = 0 to LENGTH(arr) - 1:\n        // Remove elements outside window\n        while NOT deque.EMPTY() AND deque.FRONT() <= i - k:\n            deque.POP_FRONT()\n        \n        // Remove smaller elements from rear\n        while NOT deque.EMPTY() AND arr[deque.BACK()] <= arr[i]:\n            deque.POP_BACK()\n        \n        deque.PUSH_BACK(i)\n        \n        // Add to result if window is complete\n        if i >= k - 1:\n            result.ADD(arr[deque.FRONT()])\n    \n    return result\n```",
    "type": "MCQ",
    "categories": ["DataStructures"],
    "options": ["Maintains indices in decreasing order of values", "Stores all window elements", "Sorts window elements", "Uses heap for maximum"],
    "answer": "Maintains indices in decreasing order of values",
    "difficulty": "HARD"
  },
  {
    "text": "Sliding window max for [1,3,-1,-3,5,3,6,7], k=3. First maximum?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DataStructures"],
    "options": ["3", "1", "-1", "5"],
    "answer": "3",
    "difficulty": "HARD"
  },
  {
    "text": "Complete sliding window maximum:\n\n```\n// Remove smaller elements from rear\nwhile NOT deque.EMPTY() AND arr[deque.BACK()] <= arr[i]:\n    _______________\n\ndeque.PUSH_BACK(i)\n```",
    "type": "FILL_BLANK",
    "categories": ["DataStructures"],
    "options": ["deque.POP_BACK()", "deque.POP_FRONT()", "deque.PUSH_BACK(i)", "i = i + 1"],
    "answer": "deque.POP_BACK()",
    "difficulty": "HARD"
  },

  // LRU Cache
  {
    "text": "How does LRU Cache achieve O(1) operations?\n\n```\nCLASS LRUCache:\n    capacity = 0\n    cache = HASH_MAP  // key -> node\n    head = DUMMY_NODE\n    tail = DUMMY_NODE\n    \n    FUNCTION Get(key):\n        if key IN cache:\n            node = cache[key]\n            MoveToHead(node)\n            return node.value\n        return -1\n    \n    FUNCTION Put(key, value):\n        if key IN cache:\n            node = cache[key]\n            node.value = value\n            MoveToHead(node)\n        else:\n            newNode = NEW_NODE(key, value)\n            cache[key] = newNode\n            AddToHead(newNode)\n            \n            if LENGTH(cache) > capacity:\n                tail_node = RemoveTail()\n                DELETE cache[tail_node.key]\n    \n    FUNCTION MoveToHead(node):\n        RemoveNode(node)\n        AddToHead(node)\n```",
    "type": "MCQ",
    "categories": ["DataStructures"],
    "options": ["Hash map + doubly linked list", "Only hash map", "Only linked list", "Array with sorting"],
    "answer": "Hash map + doubly linked list",
    "difficulty": "HARD"
  },
  {
    "text": "LRU cache operations: PUT(1,1), PUT(2,2), GET(1), PUT(3,3). What gets evicted?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DataStructures"],
    "options": ["Key 2", "Key 1", "Key 3", "Nothing"],
    "answer": "Key 2",
    "difficulty": "HARD"
  },
  {
    "text": "Complete LRU cache put operation:\n\n```\nif LENGTH(cache) > capacity:\n    tail_node = RemoveTail()\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DataStructures"],
    "options": ["DELETE cache[tail_node.key]", "cache[tail_node.key] = tail_node", "tail_node = NULL", "capacity++"],
    "answer": "DELETE cache[tail_node.key]",
    "difficulty": "HARD"
  },

  // Median of Two Sorted Arrays
  {
    "text": "What is the approach for finding median of two sorted arrays?\n\n```\nFUNCTION FindMedianSortedArrays(nums1, nums2):\n    if LENGTH(nums1) > LENGTH(nums2):\n        return FindMedianSortedArrays(nums2, nums1)\n    \n    m = LENGTH(nums1)\n    n = LENGTH(nums2)\n    low = 0, high = m\n    \n    while low <= high:\n        partitionX = (low + high) / 2\n        partitionY = (m + n + 1) / 2 - partitionX\n        \n        maxLeftX = nums1[partitionX - 1] if partitionX != 0 else -INFINITY\n        minRightX = nums1[partitionX] if partitionX != m else INFINITY\n        \n        maxLeftY = nums2[partitionY - 1] if partitionY != 0 else -INFINITY\n        minRightY = nums2[partitionY] if partitionY != n else INFINITY\n        \n        if maxLeftX <= minRightY AND maxLeftY <= minRightX:\n            if (m + n) % 2 == 0:\n                return (MAX(maxLeftX, maxLeftY) + MIN(minRightX, minRightY)) / 2\n            else:\n                return MAX(maxLeftX, maxLeftY)\n        else if maxLeftX > minRightY:\n            high = partitionX - 1\n        else:\n            low = partitionX + 1\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Binary search for correct partition", "Merge and find middle", "Two pointers approach", "Sort combined array"],
    "answer": "Binary search for correct partition",
    "difficulty": "HARD"
  },
  {
    "text": "Median of [1,3] and [2]. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["2.0", "1.5", "2.5", "3.0"],
    "answer": "2.0",
    "difficulty": "HARD"
  },
  {
    "text": "Complete median finding condition:\n\n```\nif maxLeftX <= minRightY AND maxLeftY <= minRightX:\n    if (m + n) % 2 == 0:\n        return (MAX(maxLeftX, maxLeftY) + MIN(minRightX, minRightY)) / 2\n    else:\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["return MAX(maxLeftX, maxLeftY)", "return MIN(minRightX, minRightY)", "return (maxLeftX + maxLeftY) / 2", "return maxLeftX"],
    "answer": "return MAX(maxLeftX, maxLeftY)",
    "difficulty": "HARD"
  },

  // More Advanced Array Problems
  {
    "text": "What is the Dutch National Flag problem variation for 4 colors?\n\n```\nFUNCTION FourColorSort(arr):\n    // Sort array with 4 distinct values: 0, 1, 2, 3\n    count = ARRAY[4] filled with 0\n    \n    // Count occurrences\n    for num in arr:\n        count[num]++\n    \n    // Reconstruct array\n    index = 0\n    for color = 0 to 3:\n        for i = 0 to count[color] - 1:\n            arr[index++] = color\n    \n    return arr\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Count sort approach for k colors", "Multiple two-pointer technique", "Recursive partitioning", "Hash-based sorting"],
    "answer": "Count sort approach for k colors",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Four color sort [2,0,1,3,1,0,2]. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["[0,0,1,1,2,2,3]", "[2,0,1,3,1,0,2]", "[0,1,2,3,0,1,2]", "[3,2,1,0,1,2,0]"],
    "answer": "[0,0,1,1,2,2,3]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete four color sort:\n\n```\nfor color = 0 to 3:\n    for i = 0 to count[color] - 1:\n        _______________\nreturn arr\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["arr[index++] = color", "arr[i] = color", "count[color]++", "index = color"],
    "answer": "arr[index++] = color",
    "difficulty": "MEDIUM"
  },

  // Product of Array Except Self
  {
    "text": "How to compute product of array except self without division?\n\n```\nFUNCTION ProductExceptSelf(nums):\n    n = LENGTH(nums)\n    result = ARRAY[n]\n    \n    // Left products\n    result[0] = 1\n    for i = 1 to n-1:\n        result[i] = result[i-1] * nums[i-1]\n    \n    // Right products\n    right = 1\n    for i = n-1 down to 0:\n        result[i] = result[i] * right\n        right = right * nums[i]\n    \n    return result\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Compute left products, then multiply with right products", "Use division operation", "Nested loops for each element", "Sort and multiply"],
    "answer": "Compute left products, then multiply with right products",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Product except self for [1,2,3,4]. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["[24,12,8,6]", "[1,2,3,4]", "[2,3,4,1]", "[4,3,2,1]"],
    "answer": "[24,12,8,6]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete product except self:\n\n```\nfor i = n-1 down to 0:\n    result[i] = result[i] * right\n    _______________\nreturn result\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["right = right * nums[i]", "right = right + nums[i]", "nums[i] = right", "result[i] = right"],
    "answer": "right = right * nums[i]",
    "difficulty": "MEDIUM"
  },

  // Spiral Matrix
  {
    "text": "What is the approach for spiral matrix traversal?\n\n```\nFUNCTION SpiralOrder(matrix):\n    if EMPTY(matrix): return []\n    \n    top = 0\n    bottom = ROWS(matrix) - 1\n    left = 0\n    right = COLS(matrix) - 1\n    result = []\n    \n    while top <= bottom AND left <= right:\n        // Traverse right\n        for col = left to right:\n            result.ADD(matrix[top][col])\n        top++\n        \n        // Traverse down\n        for row = top to bottom:\n            result.ADD(matrix[row][right])\n        right--\n        \n        // Traverse left\n        if top <= bottom:\n            for col = right down to left:\n                result.ADD(matrix[bottom][col])\n            bottom--\n        \n        // Traverse up\n        if left <= right:\n            for row = bottom down to top:\n                result.ADD(matrix[row][left])\n            left++\n    \n    return result\n```",
    "type": "MCQ",
    "categories": ["Arrays"],
    "options": ["Four boundaries: top, bottom, left, right", "Recursive approach", "DFS traversal", "BFS traversal"],
    "answer": "Four boundaries: top, bottom, left, right",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Spiral order of [[1,2,3],[4,5,6],[7,8,9]]. What is the result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays"],
    "options": ["[1,2,3,6,9,8,7,4,5]", "[1,4,7,8,9,6,3,2,5]", "[1,2,3,4,5,6,7,8,9]", "[5,4,1,2,3,6,9,8,7]"],
    "answer": "[1,2,3,6,9,8,7,4,5]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete spiral matrix traversal:\n\n```\n// Traverse left\nif top <= bottom:\n    for col = right down to left:\n        result.ADD(matrix[bottom][col])\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Arrays"],
    "options": ["bottom--", "bottom++", "top++", "left++"],
    "answer": "bottom--",
    "difficulty": "MEDIUM"
  },

  // More String Problems
  {
    "text": "What is the approach for validating IP addresses?\n\n```\nFUNCTION IsValidIP(ip):\n    parts = SPLIT(ip, '.')\n    if LENGTH(parts) != 4:\n        return false\n    \n    for part in parts:\n        if NOT IsValidIPPart(part):\n            return false\n    \n    return true\n\nFUNCTION IsValidIPPart(part):\n    if EMPTY(part) OR LENGTH(part) > 3:\n        return false\n    \n    if part[0] == '0' AND LENGTH(part) > 1:\n        return false  // leading zeros\n    \n    for char in part:\n        if NOT IsDigit(char):\n            return false\n    \n    num = INTEGER(part)\n    return 0 <= num <= 255\n```",
    "type": "MCQ",
    "categories": ["Strings"],
    "options": ["Check 4 parts, each 0-255, no leading zeros", "Use regex only", "Check length only", "Sort parts first"],
    "answer": "Check 4 parts, each 0-255, no leading zeros",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Is '192.168.01.1' a valid IP address?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings"],
    "options": ["No (leading zero)", "Yes", "Invalid format", "Depends on context"],
    "answer": "No (leading zero)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete IP validation:\n\n```\nif part[0] == '0' AND LENGTH(part) > 1:\n    _______________  // leading zeros\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings"],
    "options": ["return false", "return true", "part = part[1:]", "continue"],
    "answer": "return false",
    "difficulty": "MEDIUM"
  },

  // Word Break Problem
  {
    "text": "What is the DP approach for Word Break?\n\n```\nFUNCTION WordBreak(s, wordDict):\n    n = LENGTH(s)\n    dp = ARRAY[n + 1] filled with false\n    dp[0] = true  // empty string\n    \n    for i = 1 to n:\n        for j = 0 to i-1:\n            if dp[j] AND s[j:i] IN wordDict:\n                dp[i] = true\n                break\n    \n    return dp[n]\n\nFUNCTION WordBreakAll(s, wordDict):\n    memo = HASH_MAP\n    return WordBreakHelper(s, wordDict, memo)\n\nFUNCTION WordBreakHelper(s, wordDict, memo):\n    if s IN memo:\n        return memo[s]\n    \n    if EMPTY(s):\n        return ['']\n    \n    result = []\n    for word in wordDict:\n        if s.STARTS_WITH(word):\n            suffix = s[LENGTH(word):]\n            suffixBreaks = WordBreakHelper(suffix, wordDict, memo)\n            for suffixBreak in suffixBreaks:\n                result.ADD(word + (' ' + suffixBreak if suffixBreak else ''))\n    \n    memo[s] = result\n    return result\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i] = true if any dp[j] && s[j:i] in dict", "Try all possible combinations", "Use backtracking only", "Sort dictionary first"],
    "answer": "dp[i] = true if any dp[j] && s[j:i] in dict",
    "difficulty": "HARD"
  },
  {
    "text": "Word break 'leetcode' with dict ['leet', 'code']. Can it be broken?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["Yes", "No", "Maybe", "Invalid input"],
    "answer": "Yes",
    "difficulty": "HARD"
  },
  {
    "text": "Complete word break DP:\n\n```\nfor j = 0 to i-1:\n    if dp[j] AND s[j:i] IN wordDict:\n        _______________\n        break\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i] = true", "dp[j] = false", "i = j", "j = i"],
    "answer": "dp[i] = true",
    "difficulty": "HARD"
  },

  // Wildcard Pattern Matching
  {
    "text": "How does wildcard pattern matching work?\n\n```\nFUNCTION IsMatch(s, p):\n    m = LENGTH(s)\n    n = LENGTH(p)\n    dp = 2D_ARRAY[m+1][n+1] filled with false\n    \n    dp[0][0] = true  // empty matches empty\n    \n    // Handle patterns like a* or *a* etc.\n    for j = 1 to n:\n        if p[j-1] == '*':\n            dp[0][j] = dp[0][j-1]\n    \n    for i = 1 to m+1:\n        for j = 1 to n+1:\n            if p[j-1] == '*':\n                dp[i][j] = dp[i-1][j] OR dp[i][j-1]\n            else if p[j-1] == '?' OR s[i-1] == p[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n    \n    return dp[m][n]\n```",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["DP with * matching any sequence, ? matching any char", "Recursive backtracking only", "String replacement", "Regular expression engine"],
    "answer": "DP with * matching any sequence, ? matching any char",
    "difficulty": "HARD"
  },
  {
    "text": "Does 'abc' match pattern 'a*c'?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["Yes", "No", "Depends on implementation", "Invalid pattern"],
    "answer": "Yes",
    "difficulty": "HARD"
  },
  {
    "text": "Complete wildcard matching:\n\n```\nif p[j-1] == '*':\n    dp[i][j] = dp[i-1][j] OR dp[i][j-1]\nelse if p[j-1] == '?' OR s[i-1] == p[j-1]:\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i][j] = dp[i-1][j-1]", "dp[i][j] = true", "dp[i][j] = false", "dp[i][j] = dp[i][j-1]"],
    "answer": "dp[i][j] = dp[i-1][j-1]",
    "difficulty": "HARD"
  },

  // More Tree Problems
  {
    "text": "What is the approach for Lowest Common Ancestor in Binary Tree?\n\n```\nFUNCTION LowestCommonAncestor(root, p, q):\n    if root == NULL OR root == p OR root == q:\n        return root\n    \n    left = LowestCommonAncestor(root.left, p, q)\n    right = LowestCommonAncestor(root.right, p, q)\n    \n    if left != NULL AND right != NULL:\n        return root  // p and q in different subtrees\n    \n    return left if left != NULL else right\n\n// For BST - more efficient\nFUNCTION LCAinBST(root, p, q):\n    while root != NULL:\n        if p.val < root.val AND q.val < root.val:\n            root = root.left\n        else if p.val > root.val AND q.val > root.val:\n            root = root.right\n        else:\n            return root  // split point or one of p,q\n    return NULL\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["Find first node where paths to p and q split", "Find parent of both nodes", "Use level-order traversal", "Sort nodes by value"],
    "answer": "Find first node where paths to p and q split",
    "difficulty": "MEDIUM"
  },
  {
    "text": "LCA of nodes 2 and 8 in BST with root 6. If both are in different subtrees of 6?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["Root 6 is LCA", "LCA is 2", "LCA is 8", "No LCA exists"],
    "answer": "Root 6 is LCA",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete LCA in binary tree:\n\n```\nif left != NULL AND right != NULL:\n    _______________  // p and q in different subtrees\n\nreturn left if left != NULL else right\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["return root", "return left", "return right", "return NULL"],
    "answer": "return root",
    "difficulty": "MEDIUM"
  },

  // Tree Serialization
  {
    "text": "How to serialize and deserialize a binary tree?\n\n```\nFUNCTION Serialize(root):\n    if root == NULL:\n        return 'null'\n    \n    return STRING(root.val) + ',' + Serialize(root.left) + ',' + Serialize(root.right)\n\nFUNCTION Deserialize(data):\n    values = SPLIT(data, ',')\n    index = [0]  // use array for reference\n    return DeserializeHelper(values, index)\n\nFUNCTION DeserializeHelper(values, index):\n    if index[0] >= LENGTH(values) OR values[index[0]] == 'null':\n        index[0]++\n        return NULL\n    \n    root = NEW_NODE(INTEGER(values[index[0]]))\n    index[0]++\n    \n    root.left = DeserializeHelper(values, index)\n    root.right = DeserializeHelper(values, index)\n    \n    return root\n```",
    "type": "MCQ",
    "categories": ["Trees"],
    "options": ["Preorder traversal with null markers", "Level-order with queue", "Inorder with special encoding", "Postorder with stack"],
    "answer": "Preorder traversal with null markers",
    "difficulty": "HARD"
  },
  {
    "text": "Serialize tree: root=1, left=2, right=3. What string is produced?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Trees"],
    "options": ["'1,2,null,null,3,null,null'", "'1,2,3'", "'2,1,3'", "'null,1,null'"],
    "answer": "'1,2,null,null,3,null,null'",
    "difficulty": "HARD"
  },
  {
    "text": "Complete tree deserialization:\n\n```\nroot = NEW_NODE(INTEGER(values[index[0]]))\nindex[0]++\n\nroot.left = DeserializeHelper(values, index)\n_______________\n\nreturn root\n```",
    "type": "FILL_BLANK",
    "categories": ["Trees"],
    "options": ["root.right = DeserializeHelper(values, index)", "root.right = NULL", "index[0]++", "root.left = NULL"],
    "answer": "root.right = DeserializeHelper(values, index)",
    "difficulty": "HARD"
  },

  // More Advanced Graph Algorithms
  {
    "text": "What is the Traveling Salesman Problem approach using DP?\n\n```\nFUNCTION TSP(graph, start):\n    n = NUMBER_OF_VERTICES\n    INFINITY = 1000000\n    \n    // dp[mask][i] = min cost to visit all cities in mask ending at city i\n    dp = 2D_ARRAY[(1 << n)][n] filled with INFINITY\n    \n    // Start from city 0\n    dp[1][0] = 0  // mask=1 means only city 0 visited\n    \n    for mask = 1 to (1 << n) - 1:\n        for u = 0 to n-1:\n            if NOT (mask & (1 << u)):  // u not in current mask\n                continue\n            \n            for v = 0 to n-1:\n                if mask & (1 << v):  // v already visited\n                    continue\n                \n                newMask = mask | (1 << v)\n                dp[newMask][v] = MIN(dp[newMask][v], dp[mask][u] + graph[u][v])\n    \n    // Find minimum cost to return to start\n    result = INFINITY\n    for i = 1 to n-1:\n        result = MIN(result, dp[(1 << n) - 1][i] + graph[i][0])\n    \n    return result\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["Dynamic programming with bitmask for visited cities", "Greedy nearest neighbor", "Recursive backtracking", "Minimum spanning tree"],
    "answer": "Dynamic programming with bitmask for visited cities",
    "difficulty": "HARD"
  },
  {
    "text": "TSP with 4 cities has how many possible states in DP?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["64 (2^4 * 4)", "16", "24", "4"],
    "answer": "64 (2^4 * 4)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete TSP DP:\n\n```\nnewMask = mask | (1 << v)\n_______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["dp[newMask][v] = MIN(dp[newMask][v], dp[mask][u] + graph[u][v])", "dp[mask][u] = graph[u][v]", "newMask = mask", "v = u"],
    "answer": "dp[newMask][v] = MIN(dp[newMask][v], dp[mask][u] + graph[u][v])",
    "difficulty": "HARD"
  },

  // Johnson's Algorithm
  {
    "text": "What is Johnson's algorithm for?\n\n```\nFUNCTION JohnsonAllPairs(graph):\n    // Add new vertex connected to all vertices with weight 0\n    newGraph = AddSourceVertex(graph)\n    \n    // Run Bellman-Ford from new source\n    h = BellmanFord(newGraph, newSource)\n    if h == NULL:  // negative cycle detected\n        return NULL\n    \n    // Reweight edges: w'(u,v) = w(u,v) + h[u] - h[v]\n    reweightedGraph = ReweightEdges(graph, h)\n    \n    // Run Dijkstra from each vertex\n    distances = 2D_ARRAY[V][V]\n    for u = 0 to V-1:\n        dist = Dijkstra(reweightedGraph, u)\n        for v = 0 to V-1:\n            // Convert back to original weights\n            distances[u][v] = dist[v] + h[v] - h[u]\n    \n    return distances\n```",
    "type": "MCQ",
    "categories": ["Graphs"],
    "options": ["All-pairs shortest paths with negative edges", "Single source shortest path", "Maximum flow", "Minimum cut"],
    "answer": "All-pairs shortest paths with negative edges",
    "difficulty": "HARD"
  },
  {
    "text": "Johnson's algorithm time complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs"],
    "options": ["O(V²log V + VE)", "O(V³)", "O(VE)", "O(E log V)"],
    "answer": "O(V²log V + VE)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Johnson's reweighting:\n\n```\n// Convert back to original weights\n_______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs"],
    "options": ["distances[u][v] = dist[v] + h[v] - h[u]", "distances[u][v] = dist[v]", "distances[u][v] = h[v] - h[u]", "distances[u][v] = dist[v] + h[u]"],
    "answer": "distances[u][v] = dist[v] + h[v] - h[u]",
    "difficulty": "HARD"
  },

  // More Bit Manipulation
  {
    "text": "How to find the missing number in array [0...n]?\n\n```\nFUNCTION FindMissing(nums):\n    n = LENGTH(nums)\n    missing = n  // start with the highest possible number\n    \n    for i = 0 to n-1:\n        missing = missing XOR i XOR nums[i]\n    \n    return missing\n\n// Alternative: Sum approach\nFUNCTION FindMissingSum(nums):\n    n = LENGTH(nums)\n    expectedSum = n * (n + 1) / 2\n    actualSum = SUM(nums)\n    return expectedSum - actualSum\n\n// Bit manipulation for two missing numbers\nFUNCTION FindTwoMissing(nums, n):\n    // Total XOR of 1 to n\n    xor_all = 0\n    for i = 1 to n:\n        xor_all = xor_all XOR i\n    \n    // XOR with array elements\n    for num in nums:\n        xor_all = xor_all XOR num\n    \n    // Now xor_all = missing1 XOR missing2\n    rightmost_set_bit = xor_all & (-xor_all)\n    \n    missing1 = 0, missing2 = 0\n    for i = 1 to n:\n        if i & rightmost_set_bit:\n            missing1 = missing1 XOR i\n        else:\n            missing2 = missing2 XOR i\n    \n    for num in nums:\n        if num & rightmost_set_bit:\n            missing1 = missing1 XOR num\n        else:\n            missing2 = missing2 XOR num\n    \n    return [missing1, missing2]\n```",
    "type": "MCQ",
    "categories": ["BitManipulation"],
    "options": ["XOR all numbers with array elements", "Sort and binary search", "Hash table lookup", "Mathematical formula only"],
    "answer": "XOR all numbers with array elements",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Missing number in [3,0,1]. Using XOR method, what is missing?",
    "type": "PREDICT_OUTPUT",
    "categories": ["BitManipulation"],
    "options": ["2", "4", "1", "0"],
    "answer": "2",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete missing number XOR:\n\n```\nfor i = 0 to n-1:\n    _______________\nreturn missing\n```",
    "type": "FILL_BLANK",
    "categories": ["BitManipulation"],
    "options": ["missing = missing XOR i XOR nums[i]", "missing = missing + i + nums[i]", "missing = i XOR nums[i]", "missing = nums[i]"],
    "answer": "missing = missing XOR i XOR nums[i]",
    "difficulty": "MEDIUM"
  },

  // Additional Complex Algorithms
  {
    "text": "What is the Mo's Algorithm used for?\n\n```\nSTRUCT Query:\n    left, right, index\n\nFUNCTION MosAlgorithm(arr, queries):\n    blockSize = SQRT(LENGTH(arr))\n    \n    // Sort queries by block of left endpoint, then by right endpoint\n    SORT(queries, lambda q: (q.left / blockSize, q.right))\n    \n    currentLeft = 0, currentRight = -1\n    currentAnswer = 0\n    answers = ARRAY[LENGTH(queries)]\n    \n    for query in queries:\n        // Extend or shrink the current range\n        while currentRight < query.right:\n            currentRight++\n            ADD(arr[currentRight])  // add to current answer\n        \n        while currentRight > query.right:\n            REMOVE(arr[currentRight])  // remove from current answer\n            currentRight--\n        \n        while currentLeft < query.left:\n            REMOVE(arr[currentLeft])  // remove from current answer\n            currentLeft++\n        \n        while currentLeft > query.left:\n            currentLeft--\n            ADD(arr[currentLeft])  // add to current answer\n        \n        answers[query.index] = currentAnswer\n    \n    return answers\n```",
    "type": "MCQ",
    "categories": ["Algorithms"],
    "options": ["Offline query processing by reordering queries", "Online query processing", "Parallel query execution", "Query optimization"],
    "answer": "Offline query processing by reordering queries",
    "difficulty": "HARD"
  },
  {
    "text": "Mo's algorithm time complexity for Q queries on array of size N?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Algorithms"],
    "options": ["O((N + Q) * sqrt(N))", "O(Q * N)", "O(N log N)", "O(Q log Q)"],
    "answer": "O((N + Q) * sqrt(N))",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Mo's algorithm query processing:\n\n```\nwhile currentRight < query.right:\n    currentRight++\n    _______________  // add to current answer\n```",
    "type": "FILL_BLANK",
    "categories": ["Algorithms"],
    "options": ["ADD(arr[currentRight])", "REMOVE(arr[currentRight])", "currentAnswer++", "currentRight--"],
    "answer": "ADD(arr[currentRight])",
    "difficulty": "HARD"
  },

  // Persistent Data Structures
  {
    "text": "What characterizes persistent data structures?\n\n```\nCLASS PersistentSegmentTree:\n    STRUCT Node:\n        value, left, right\n    \n    FUNCTION Update(node, start, end, index, newValue):\n        if start == end:\n            return NEW_NODE(newValue, NULL, NULL)\n        \n        mid = (start + end) / 2\n        newNode = NEW_NODE(0, node.left, node.right)\n        \n        if index <= mid:\n            newNode.left = Update(node.left, start, mid, index, newValue)\n        else:\n            newNode.right = Update(node.right, mid+1, end, index, newValue)\n        \n        newNode.value = newNode.left.value + newNode.right.value\n        return newNode\n    \n    FUNCTION Query(node, start, end, queryStart, queryEnd):\n        if queryStart > end OR queryEnd < start:\n            return 0\n        if queryStart <= start AND end <= queryEnd:\n            return node.value\n        \n        mid = (start + end) / 2\n        return Query(node.left, start, mid, queryStart, queryEnd) + \n               Query(node.right, mid+1, end, queryStart, queryEnd)\n```",
    "type": "MCQ",
    "categories": ["DataStructures"],
    "options": ["Preserve all previous versions after modifications", "Automatically backup data", "Use persistent storage", "Never change original data"],
    "answer": "Preserve all previous versions after modifications",
    "difficulty": "HARD"
  },
  {
    "text": "Persistent data structure space complexity per operation?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DataStructures"],
    "options": ["O(log n) new nodes", "O(n) complete copy", "O(1) constant space", "O(n log n) total space"],
    "answer": "O(log n) new nodes",
    "difficulty": "HARD"
  },
  {
    "text": "Complete persistent segment tree update:\n\n```\nnewNode.value = newNode.left.value + newNode.right.value\n_______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DataStructures"],
    "options": ["return newNode", "newNode = NULL", "node.value = newNode.value", "start = end"],
    "answer": "return newNode",
    "difficulty": "HARD"
  },

  // Computational Geometry
  {
    "text": "How to check if point is inside polygon?\n\n```\nFUNCTION PointInPolygon(point, polygon):\n    x, y = point.x, point.y\n    n = LENGTH(polygon)\n    inside = false\n    \n    j = n - 1\n    for i = 0 to n-1:\n        xi, yi = polygon[i].x, polygon[i].y\n        xj, yj = polygon[j].x, polygon[j].y\n        \n        if ((yi > y) != (yj > y)) AND \n           (x < (xj - xi) * (y - yi) / (yj - yi) + xi):\n            inside = NOT inside\n        \n        j = i\n    \n    return inside\n\n// Ray casting algorithm - count intersections\nFUNCTION RayCasting(point, polygon):\n    count = 0\n    for edge in polygon:\n        if RayIntersectsEdge(point, edge):\n            count++\n    return count % 2 == 1  // odd count means inside\n```",
    "type": "MCQ",
    "categories": ["Geometry"],
    "options": ["Ray casting - count edge intersections", "Distance from center", "Angle sum method", "Coordinate comparison"],
    "answer": "Ray casting - count edge intersections",
    "difficulty": "HARD"
  },
  {
    "text": "Point (2,2) in square [(0,0),(4,0),(4,4),(0,4)]. Is it inside?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Geometry"],
    "options": ["Yes", "No", "On boundary", "Cannot determine"],
    "answer": "Yes",
    "difficulty": "HARD"
  },
  {
    "text": "Complete point in polygon:\n\n```\nif ((yi > y) != (yj > y)) AND \n   (x < (xj - xi) * (y - yi) / (yj - yi) + xi):\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Geometry"],
    "options": ["inside = NOT inside", "inside = true", "inside = false", "count++"],
    "answer": "inside = NOT inside",
    "difficulty": "HARD"
  },

  // Advanced Probability & Randomization
  {
    "text": "How does Random Sampling with Replacement work?\n\n```\nFUNCTION WeightedRandomSample(items, weights):\n    totalWeight = SUM(weights)\n    randomValue = RANDOM(0, totalWeight)\n    \n    currentWeight = 0\n    for i = 0 to LENGTH(items) - 1:\n        currentWeight += weights[i]\n        if randomValue <= currentWeight:\n            return items[i]\n    \n    return items[LENGTH(items) - 1]  // fallback\n\nFUNCTION ReservoirSamplingWithWeights(stream, k, weights):\n    reservoir = ARRAY[k]\n    totalWeight = 0\n    \n    for i = 0 to LENGTH(stream) - 1:\n        totalWeight += weights[i]\n        \n        if i < k:\n            reservoir[i] = stream[i]\n        else:\n            randomWeight = RANDOM(0, totalWeight)\n            if randomWeight <= weights[i]:\n                // Replace random element in reservoir\n                randomIndex = RANDOM(0, k-1)\n                reservoir[randomIndex] = stream[i]\n    \n    return reservoir\n```",
    "type": "MCQ",
    "categories": ["Algorithms"],
    "options": ["Sample proportional to weights", "Sample uniformly", "Sample largest weights", "Sample deterministically"],
    "answer": "Sample proportional to weights",
    "difficulty": "HARD"
  },
  {
    "text": "Weighted sampling with weights [1,2,3]. What's probability of selecting item 2?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Algorithms"],
    "options": ["1/3", "2/6", "1/2", "2/3"],
    "answer": "2/6",
    "difficulty": "HARD"
  },
  {
    "text": "Complete weighted random sampling:\n\n```\ncurrentWeight += weights[i]\nif randomValue <= currentWeight:\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Algorithms"],
    "options": ["return items[i]", "currentWeight = 0", "randomValue = 0", "i++"],
    "answer": "return items[i]",
    "difficulty": "HARD"
  },

  // Final Advanced Topics
  {
    "text": "What is the principle behind Skip Lists?\n\n```\nCLASS SkipList:\n    maxLevel = 16\n    \n    STRUCT Node:\n        value\n        forward = ARRAY[maxLevel]  // forward pointers\n    \n    FUNCTION Search(target):\n        current = header\n        for level = currentLevel down to 0:\n            while current.forward[level] != NULL AND \n                  current.forward[level].value < target:\n                current = current.forward[level]\n        \n        current = current.forward[0]\n        return current != NULL AND current.value == target\n    \n    FUNCTION Insert(value):\n        level = RandomLevel()\n        newNode = NEW_NODE(value)\n        \n        current = header\n        for l = currentLevel down to 0:\n            while current.forward[l] != NULL AND \n                  current.forward[l].value < value:\n                current = current.forward[l]\n            \n            if l <= level:\n                newNode.forward[l] = current.forward[l]\n                current.forward[l] = newNode\n    \n    FUNCTION RandomLevel():\n        level = 0\n        while RANDOM() < 0.5 AND level < maxLevel - 1:\n            level++\n        return level\n```",
    "type": "MCQ",
    "categories": ["DataStructures"],
    "options": ["Probabilistic data structure with multiple levels", "Sorted linked list", "Binary search tree", "Hash table with chaining"],
    "answer": "Probabilistic data structure with multiple levels",
    "difficulty": "HARD"
  },
  {
    "text": "Skip list average search time complexity is?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DataStructures"],
    "options": ["O(log n)", "O(n)", "O(1)", "O(sqrt n)"],
    "answer": "O(log n)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete skip list insertion:\n\n```\nif l <= level:\n    newNode.forward[l] = current.forward[l]\n    _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["DataStructures"],
    "options": ["current.forward[l] = newNode", "current = newNode", "level = l", "newNode = current"],
    "answer": "current.forward[l] = newNode",
    "difficulty": "HARD"
  },

  // Bloom Filters
  {
    "text": "What is the key property of Bloom Filters?\n\n```\nCLASS BloomFilter:\n    bitArray = ARRAY[m] filled with 0\n    hashFunctions = [hash1, hash2, ..., hashK]\n    \n    FUNCTION Add(item):\n        for hashFunc in hashFunctions:\n            index = hashFunc(item) % m\n            bitArray[index] = 1\n    \n    FUNCTION Contains(item):\n        for hashFunc in hashFunctions:\n            index = hashFunc(item) % m\n            if bitArray[index] == 0:\n                return false  // definitely not present\n        return true  // possibly present\n    \n    FUNCTION FalsePositiveRate():\n        // Probability ≈ (1 - e^(-k*n/m))^k\n        // where k = hash functions, n = items, m = bits\n        return POWER((1 - EXP(-k * n / m)), k)\n```",
    "type": "MCQ",
    "categories": ["DataStructures"],
    "options": ["No false negatives, possible false positives", "No false positives, possible false negatives", "Perfect accuracy", "Random results"],
    "answer": "No false negatives, possible false positives",
    "difficulty": "HARD"
  },
  {
    "text": "Bloom filter says item exists. What can we conclude?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DataStructures"],
    "options": ["Item might exist", "Item definitely exists", "Item definitely doesn't exist", "Filter is corrupted"],
    "answer": "Item might exist",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Bloom filter contains check:\n\n```\nfor hashFunc in hashFunctions:\n    index = hashFunc(item) % m\n    if bitArray[index] == 0:\n        _______________  // definitely not present\nreturn true  // possibly present\n```",
    "type": "FILL_BLANK",
    "categories": ["DataStructures"],
    "options": ["return false", "return true", "continue", "bitArray[index] = 1"],
    "answer": "return false",
    "difficulty": "HARD"
  },

  // Count-Min Sketch
  {
    "text": "What does Count-Min Sketch estimate?\n\n```\nCLASS CountMinSketch:\n    table = 2D_ARRAY[d][w] filled with 0\n    hashFunctions = [hash1, hash2, ..., hashD]\n    \n    FUNCTION Update(item, count):\n        for i = 0 to d-1:\n            j = hashFunctions[i](item) % w\n            table[i][j] += count\n    \n    FUNCTION Query(item):\n        minCount = INFINITY\n        for i = 0 to d-1:\n            j = hashFunctions[i](item) % w\n            minCount = MIN(minCount, table[i][j])\n        return minCount\n    \n    FUNCTION EstimateError():\n        // Error bound: ε * ||f||₁ with probability 1-δ\n        // where ||f||₁ is sum of all frequencies\n        return epsilon * totalFrequency\n```",
    "type": "MCQ",
    "categories": ["DataStructures"],
    "options": ["Frequency of items in data stream", "Exact count of items", "Average of all items", "Maximum item value"],
    "answer": "Frequency of items in data stream",
    "difficulty": "HARD"
  },
  {
    "text": "Count-Min Sketch query returns overestimate or underestimate?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DataStructures"],
    "options": ["Overestimate (never underestimates)", "Underestimate", "Exact count", "Random estimate"],
    "answer": "Overestimate (never underestimates)",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Count-Min Sketch query:\n\n```\nfor i = 0 to d-1:\n    j = hashFunctions[i](item) % w\n    _______________\nreturn minCount\n```",
    "type": "FILL_BLANK",
    "categories": ["DataStructures"],
    "options": ["minCount = MIN(minCount, table[i][j])", "minCount = MAX(minCount, table[i][j])", "minCount += table[i][j]", "table[i][j] = minCount"],
    "answer": "minCount = MIN(minCount, table[i][j])",
    "difficulty": "HARD"
  },

  // Advanced Machine Learning & AI Algorithms
  {
    "text": "What is the Gradient Descent algorithm?\n\n```\nFUNCTION GradientDescent(X, y, learningRate, iterations):\n    m = LENGTH(y)  // number of samples\n    n = FEATURES(X)  // number of features\n    theta = ZEROS(n)  // initialize parameters\n    \n    for i = 0 to iterations:\n        // Forward pass: compute predictions\n        predictions = X * theta\n        \n        // Compute cost\n        cost = SUM((predictions - y)²) / (2 * m)\n        \n        // Compute gradients\n        gradients = X.T * (predictions - y) / m\n        \n        // Update parameters\n        theta = theta - learningRate * gradients\n        \n        if i % 100 == 0:\n            PRINT(\"Cost at iteration\", i, \":\", cost)\n    \n    return theta\n\nFUNCTION StochasticGradientDescent(X, y, learningRate, epochs):\n    theta = RANDOM_INIT(FEATURES(X))\n    \n    for epoch = 0 to epochs:\n        for i = 0 to LENGTH(y) - 1:\n            xi = X[i]\n            yi = y[i]\n            prediction = DOT(xi, theta)\n            error = prediction - yi\n            gradient = xi * error\n            theta = theta - learningRate * gradient\n    \n    return theta\n```",
    "type": "MCQ",
    "categories": ["Algorithms"],
    "options": ["Iterative optimization to minimize cost function", "Classification algorithm", "Clustering method", "Feature selection technique"],
    "answer": "Iterative optimization to minimize cost function",
    "difficulty": "HARD"
  },
  {
    "text": "Gradient descent learning rate too high causes?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Algorithms"],
    "options": ["Oscillation or divergence", "Slow convergence", "Perfect convergence", "No change in parameters"],
    "answer": "Oscillation or divergence",
    "difficulty": "HARD"
  },
  {
    "text": "Complete gradient descent parameter update:\n\n```\ngradients = X.T * (predictions - y) / m\n_______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Algorithms"],
    "options": ["theta = theta - learningRate * gradients", "theta = theta + learningRate * gradients", "gradients = theta", "theta = gradients"],
    "answer": "theta = theta - learningRate * gradients",
    "difficulty": "HARD"
  },

  // Neural Networks
  {
    "text": "How does Backpropagation work in Neural Networks?\n\n```\nCLASS NeuralNetwork:\n    FUNCTION Forward(X):\n        // Forward pass through layers\n        a1 = X\n        z2 = a1 * W1 + b1\n        a2 = SIGMOID(z2)\n        z3 = a2 * W2 + b2\n        a3 = SIGMOID(z3)  // output\n        \n        return a1, z2, a2, z3, a3\n    \n    FUNCTION Backward(X, y, a1, z2, a2, z3, a3):\n        m = LENGTH(y)\n        \n        // Output layer error\n        dz3 = a3 - y\n        dW2 = a2.T * dz3 / m\n        db2 = SUM(dz3, axis=0) / m\n        \n        // Hidden layer error\n        dz2 = (dz3 * W2.T) * SIGMOID_DERIVATIVE(z2)\n        dW1 = a1.T * dz2 / m\n        db1 = SUM(dz2, axis=0) / m\n        \n        return dW1, db1, dW2, db2\n    \n    FUNCTION UpdateWeights(dW1, db1, dW2, db2, learningRate):\n        W1 = W1 - learningRate * dW1\n        b1 = b1 - learningRate * db1\n        W2 = W2 - learningRate * dW2\n        b2 = b2 - learningRate * db2\n```",
    "type": "MCQ",
    "categories": ["Algorithms"],
    "options": ["Compute gradients by chain rule backwards", "Forward propagate activations", "Initialize random weights", "Normalize input data"],
    "answer": "Compute gradients by chain rule backwards",
    "difficulty": "HARD"
  },
  {
    "text": "Vanishing gradient problem occurs when?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Algorithms"],
    "options": ["Gradients become very small in deep networks", "Gradients become very large", "No gradients computed", "Perfect gradients"],
    "answer": "Gradients become very small in deep networks",
    "difficulty": "HARD"
  },
  {
    "text": "Complete backpropagation hidden layer error:\n\n```\ndz2 = (dz3 * W2.T) * _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Algorithms"],
    "options": ["SIGMOID_DERIVATIVE(z2)", "SIGMOID(z2)", "z2", "a2"],
    "answer": "SIGMOID_DERIVATIVE(z2)",
    "difficulty": "HARD"
  },

  // Advanced Concurrency
  {
    "text": "What is the Actor Model for concurrency?\n\n```\nCLASS Actor:\n    mailbox = QUEUE()\n    state = INITIAL_STATE\n    \n    FUNCTION Receive():\n        while true:\n            message = mailbox.DEQUEUE()\n            newState = ProcessMessage(message, state)\n            state = newState\n    \n    FUNCTION Send(actor, message):\n        actor.mailbox.ENQUEUE(message)\n    \n    FUNCTION ProcessMessage(message, currentState):\n        MATCH message.type:\n            CASE \"UPDATE\":\n                return currentState.Update(message.data)\n            CASE \"QUERY\":\n                sender = message.sender\n                Send(sender, CreateResponse(currentState))\n                return currentState\n            CASE \"SPAWN\":\n                newActor = NEW_ACTOR(message.actorType)\n                return currentState.AddChild(newActor)\n            DEFAULT:\n                return currentState\n\nFUNCTION ActorSystem():\n    actors = MAP()\n    scheduler = NEW_SCHEDULER()\n    \n    FUNCTION SpawnActor(actorType, name):\n        actor = NEW_ACTOR(actorType)\n        actors[name] = actor\n        scheduler.Schedule(actor.Receive)\n        return actor\n    \n    FUNCTION SendMessage(actorName, message):\n        actor = actors[actorName]\n        actor.Send(message)\n```",
    "type": "MCQ",
    "categories": ["Concurrency"],
    "options": ["Message-passing between isolated actors", "Shared memory threading", "Lock-based synchronization", "Database transactions"],
    "answer": "Message-passing between isolated actors",
    "difficulty": "HARD"
  },
  {
    "text": "Actor model avoids what concurrency problem?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Concurrency"],
    "options": ["Race conditions and shared state", "Message passing overhead", "Actor creation cost", "Network latency"],
    "answer": "Race conditions and shared state",
    "difficulty": "HARD"
  },
  {
    "text": "Complete actor message processing:\n\n```\nmessage = mailbox.DEQUEUE()\nnewState = ProcessMessage(message, state)\n_______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Concurrency"],
    "options": ["state = newState", "message = newState", "mailbox = newState", "return newState"],
    "answer": "state = newState",
    "difficulty": "HARD"
  },

  // Distributed Systems
  {
    "text": "What is the CAP Theorem?\n\n```\nTHEOREM CAP:\n    // In any distributed system, you can guarantee at most 2 of 3:\n    \n    CONSISTENCY:\n        // All nodes see the same data simultaneously\n        FUNCTION StrongConsistency():\n            for operation in writes:\n                WAIT_FOR_ALL_REPLICAS_ACK(operation)\n                APPLY_TO_ALL_NODES(operation)\n            \n            for read in reads:\n                return READ_FROM_QUORUM()\n    \n    AVAILABILITY:\n        // System remains operational\n        FUNCTION HighAvailability():\n            REPLICATE_DATA_ACROSS_NODES()\n            for request in all_requests:\n                if ANY_NODE_RESPONSIVE():\n                    SERVE_REQUEST()\n                else:\n                    GRACEFUL_DEGRADATION()\n    \n    PARTITION_TOLERANCE:\n        // System continues despite network failures\n        FUNCTION PartitionTolerance():\n            DETECT_NETWORK_PARTITION()\n            if PARTITION_DETECTED():\n                CHOOSE_CONSISTENCY_OR_AVAILABILITY()\n                CONTINUE_OPERATION_WITH_SUBSET()\n\n// Trade-offs:\n// CP: Consistent + Partition Tolerant (sacrifice Availability)\n// AP: Available + Partition Tolerant (sacrifice Consistency)\n// CA: Consistent + Available (sacrifice Partition Tolerance)\n```",
    "type": "MCQ",
    "categories": ["DistributedSystems"],
    "options": ["Can guarantee at most 2 of: Consistency, Availability, Partition tolerance", "All three properties always achievable", "Only consistency matters", "Availability is most important"],
    "answer": "Can guarantee at most 2 of: Consistency, Availability, Partition tolerance",
    "difficulty": "HARD"
  },
  {
    "text": "During network partition, AP system chooses?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DistributedSystems"],
    "options": ["Availability over consistency", "Consistency over availability", "Neither", "Both equally"],
    "answer": "Availability over consistency",
    "difficulty": "HARD"
  },
  {
    "text": "Complete strong consistency implementation:\n\n```\nfor operation in writes:\n    _______________\n    APPLY_TO_ALL_NODES(operation)\n```",
    "type": "FILL_BLANK",
    "categories": ["DistributedSystems"],
    "options": ["WAIT_FOR_ALL_REPLICAS_ACK(operation)", "APPLY_IMMEDIATELY(operation)", "IGNORE_REPLICAS(operation)", "CACHE_OPERATION(operation)"],
    "answer": "WAIT_FOR_ALL_REPLICAS_ACK(operation)",
    "difficulty": "HARD"
  },

  // Consensus Algorithms
  {
    "text": "How does the Raft Consensus Algorithm work?\n\n```\nCLASS RaftNode:\n    state = FOLLOWER  // FOLLOWER, CANDIDATE, LEADER\n    currentTerm = 0\n    votedFor = NULL\n    log = []\n    commitIndex = 0\n    \n    FUNCTION StartElection():\n        state = CANDIDATE\n        currentTerm++\n        votedFor = self\n        resetElectionTimeout()\n        \n        votes = 1  // vote for self\n        for node in otherNodes:\n            SendRequestVote(node)\n        \n        if votes > MAJORITY(clusterSize):\n            BecomeLeader()\n    \n    FUNCTION HandleRequestVote(request):\n        if request.term > currentTerm:\n            currentTerm = request.term\n            votedFor = NULL\n            state = FOLLOWER\n        \n        if (votedFor == NULL OR votedFor == request.candidateId) AND \n           request.lastLogIndex >= LENGTH(log):\n            votedFor = request.candidateId\n            return VOTE_GRANTED\n        \n        return VOTE_DENIED\n    \n    FUNCTION AppendEntries(entries):\n        if state == LEADER:\n            for entry in entries:\n                log.APPEND(entry)\n                ReplicateToFollowers(entry)\n        \n        WAIT_FOR_MAJORITY_ACK()\n        commitIndex = LENGTH(log) - 1\n```",
    "type": "MCQ",
    "categories": ["DistributedSystems"],
    "options": ["Leader election and log replication consensus", "Database replication", "Load balancing", "Cache invalidation"],
    "answer": "Leader election and log replication consensus",
    "difficulty": "HARD"
  },
  {
    "text": "Raft requires how many nodes for fault tolerance of F failures?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DistributedSystems"],
    "options": ["2F + 1 nodes", "F + 1 nodes", "F nodes", "3F nodes"],
    "answer": "2F + 1 nodes",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Raft election win condition:\n\n```\nif votes > _______________:\n    BecomeLeader()\n```",
    "type": "FILL_BLANK",
    "categories": ["DistributedSystems"],
    "options": ["MAJORITY(clusterSize)", "clusterSize", "clusterSize / 2", "1"],
    "answer": "MAJORITY(clusterSize)",
    "difficulty": "HARD"
  },

  // Final Advanced Algorithms
  {
    "text": "What is the Karger's Min-Cut Algorithm?\n\n```\nFUNCTION KargerMinCut(graph):\n    // Randomized algorithm to find minimum cut\n    while LENGTH(graph.vertices) > 2:\n        // Pick random edge\n        edge = RANDOM_EDGE(graph)\n        u, v = edge.vertices\n        \n        // Contract edge: merge vertices u and v\n        newVertex = MERGE(u, v)\n        \n        // Update all edges\n        for edge in graph.edges:\n            if edge.contains(u) OR edge.contains(v):\n                edge.replace(u, newVertex)\n                edge.replace(v, newVertex)\n        \n        // Remove self-loops\n        graph.edges = FILTER(graph.edges, lambda e: e.u != e.v)\n        \n        // Update vertex list\n        graph.vertices.REMOVE(u)\n        graph.vertices.REMOVE(v)\n        graph.vertices.ADD(newVertex)\n    \n    return LENGTH(graph.edges)  // min cut size\n\nFUNCTION RepeatedKarger(graph, iterations):\n    minCut = INFINITY\n    for i = 0 to iterations:\n        graphCopy = COPY(graph)\n        cut = KargerMinCut(graphCopy)\n        minCut = MIN(minCut, cut)\n    return minCut\n\n// Probability of success ≥ 1/C(n,2) = 2/(n(n-1))\n// Need O(n² ln n) iterations for high success probability\n```",
    "type": "MCQ",
    "categories": ["Algorithms"],
    "options": ["Randomized algorithm for minimum cut", "Deterministic shortest path", "Graph coloring", "Maximum flow"],
    "answer": "Randomized algorithm for minimum cut",
    "difficulty": "HARD"
  },
  {
    "text": "Karger's algorithm success probability for one run?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Algorithms"],
    "options": ["2/(n(n-1))", "1/n", "1/2", "n/(n-1)"],
    "answer": "2/(n(n-1))",
    "difficulty": "HARD"
  },
  {
    "text": "Complete Karger's edge contraction:\n\n```\nnewVertex = MERGE(u, v)\nfor edge in graph.edges:\n    if edge.contains(u) OR edge.contains(v):\n        _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Algorithms"],
    "answer": "edge.replace(u, newVertex); edge.replace(v, newVertex)",
    "difficulty": "HARD"
  }
];

// Run the script to generate and save questions
async function generateAndSaveQuestions() {
  try {
    // Read existing questions
    const existingQuestions = await readExistingQuestions();
    console.log(`Found ${existingQuestions.length} existing questions`);
    
    // Combine with new questions
    const allQuestions = [...existingQuestions, ...generatedQuestions];
    console.log(`Total questions after generation: ${allQuestions.length}`);
    
    // Save to file
    await saveQuestions(allQuestions);
    
    // Print statistics
    const stats = generateStats(allQuestions);
    console.log('\n📊 FINAL STATISTICS:');
    console.log(`Total Questions: ${stats.total}`);
    console.log(`New Questions Added: ${generatedQuestions.length}`);
    
    console.log('\n📋 Question Types:');
    Object.entries(stats.types).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    console.log('\n⚡ Difficulty Levels:');
    Object.entries(stats.difficulties).forEach(([diff, count]) => {
      console.log(`  ${diff}: ${count}`);
    });
    
    console.log('\n🏷️ Categories:');
    Object.entries(stats.categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error generating questions:', error);
  }
}

// Run the generation
generateAndSaveQuestions();

async function main() {
  console.log('🚀 Adding Copilot-generated questions to leetcode_mcq_questions.json...\n');
  
  // Load existing questions
  const questionsFilePath = path.join(__dirname, '../db/leetcode_mcq_questions.json');
  let existingQuestions = [];
  
  try {
    if (fs.existsSync(questionsFilePath)) {
      const fileContent = fs.readFileSync(questionsFilePath, 'utf8');
      existingQuestions = JSON.parse(fileContent);
      console.log(`📊 Found ${existingQuestions.length} existing questions`);
    } else {
      console.log('📝 Creating new leetcode_mcq_questions.json file');
    }
  } catch (error) {
    console.error('❌ Error reading existing questions file:', error.message);
    process.exit(1);
  }

  // Combine existing and new questions
  const combinedQuestions = [...existingQuestions, ...generatedQuestions];
  
  // Save back to leetcode_mcq_questions.json
  try {
    fs.writeFileSync(questionsFilePath, JSON.stringify(combinedQuestions, null, 2));
    console.log(`\n🎉 Success! Updated leetcode_mcq_questions.json`);
    console.log(`📊 Total questions: ${combinedQuestions.length} (${generatedQuestions.length} new)`);
  } catch (error) {
    console.error('❌ Error writing to leetcode_mcq_questions.json:', error.message);
    
    // Fallback: save new questions to separate file
    const backupPath = path.join(__dirname, '../db/copilot-questions-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(generatedQuestions, null, 2));
    console.log(`💾 New questions saved to backup file: ${backupPath}`);
    process.exit(1);
  }
  
  // Show statistics
  const typeDistribution = {};
  const difficultyDistribution = {};
  const categoryDistribution = {};
  
  generatedQuestions.forEach(q => {
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

  console.log('\n✅ Question addition completed successfully!');
  console.log('🚀 Your leetcode_mcq_questions.json now has enhanced algorithmic questions!');
}

// Run the script
main().catch((error) => {
  console.error('\n💥 Question addition failed:', error);
  process.exit(1);
});
