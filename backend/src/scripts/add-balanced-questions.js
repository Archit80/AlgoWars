import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsFilePath = path.join(__dirname, '..', 'db', 'leetcode_mcq_questions.json');

const newQuestions = [
  // Queues
  {
    text: "What is the time complexity of enqueue and dequeue operations in a standard queue implemented with a linked list?",
    type: "MCQ",
    categories: ["Queues"],
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    answer: "O(1)",
    difficulty: "EASY"
  },
  {
    text: "Which data structure is best for implementing a circular queue?",
    type: "MCQ",
    categories: ["Queues"],
    options: ["Array", "Stack", "Tree", "Graph"],
    answer: "Array",
    difficulty: "EASY"
  },
  {
    text: "Given a queue with elements [1,2,3,4], what is the result after two dequeue operations?",
    type: "PREDICT_OUTPUT",
    categories: ["Queues"],
    options: ["[3,4]", "[1,2]", "[2,3,4]", "[4]"],
    answer: "[3,4]",
    difficulty: "EASY"
  },
  // BinarySearch
  {
    text: "What is the worst-case time complexity of binary search on a sorted array?",
    type: "MCQ",
    categories: ["BinarySearch"],
    options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
    answer: "O(log n)",
    difficulty: "EASY"
  },
  {
    text: "Binary search can be applied to which of the following data structures?",
    type: "MCQ",
    categories: ["BinarySearch"],
    options: ["Sorted array", "Unsorted array", "Linked list", "Stack"],
    answer: "Sorted array",
    difficulty: "EASY"
  },
  {
    text: "What will binary search return for target 5 in array [1,3,5,7,9]?",
    type: "PREDICT_OUTPUT",
    categories: ["BinarySearch"],
    options: ["2", "3", "4", "Not found"],
    answer: "2",
    difficulty: "EASY"
  },
  // SlidingWindow
  {
    text: "What is the main advantage of the sliding window technique?",
    type: "MCQ",
    categories: ["SlidingWindow"],
    options: ["Efficiently process subarrays", "Sort arrays", "Reverse arrays", "Find duplicates"],
    answer: "Efficiently process subarrays",
    difficulty: "EASY"
  },
  {
    text: "Find the maximum sum of any subarray of length 3 in [1,2,3,4,5] using sliding window.",
    type: "PREDICT_OUTPUT",
    categories: ["SlidingWindow"],
    options: ["12", "9", "6", "15"],
    answer: "12",
    difficulty: "EASY"
  },
  {
    text: "Sliding window is most useful for which type of problems?",
    type: "MCQ",
    categories: ["SlidingWindow"],
    options: ["Fixed-size subarray", "Sorting", "Recursion", "Graph traversal"],
    answer: "Fixed-size subarray",
    difficulty: "EASY"
  },
  // LinkedLists
  {
    text: "What is the time complexity to reverse a singly linked list?",
    type: "MCQ",
    categories: ["LinkedLists"],
    options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
    answer: "O(n)",
    difficulty: "EASY"
  },
  {
    text: "How do you detect a cycle in a linked list?",
    type: "MCQ",
    categories: ["LinkedLists"],
    options: ["Floyd's Tortoise and Hare", "Binary search", "Stack", "Recursion"],
    answer: "Floyd's Tortoise and Hare",
    difficulty: "EASY"
  },
  {
    text: "What is the output after deleting the head of linked list [1,2,3]?",
    type: "PREDICT_OUTPUT",
    categories: ["LinkedLists"],
    options: ["[2,3]", "[1,3]", "[3]", "[1,2,3]"],
    answer: "[2,3]",
    difficulty: "EASY"
  },
  // HashMaps
  {
    text: "What is the average-case time complexity for lookup in a hash map?",
    type: "MCQ",
    categories: ["HashMaps"],
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    answer: "O(1)",
    difficulty: "EASY"
  },
  {
    text: "Which operation is fastest in a hash map?",
    type: "MCQ",
    categories: ["HashMaps"],
    options: ["Insert", "Delete", "Lookup", "All are O(1)"],
    answer: "All are O(1)",
    difficulty: "EASY"
  },
  {
    text: "What is the result of deleting key 'a' from hash map {a:1, b:2, c:3}?",
    type: "PREDICT_OUTPUT",
    categories: ["HashMaps"],
    options: ["{b:2, c:3}", "{a:1, b:2}", "{a:1, c:3}", "{}"],
    answer: "{b:2, c:3}",
    difficulty: "EASY"
  },
  // TwoPointers
  {
    text: "What is the main use of the two pointers technique?",
    type: "MCQ",
    categories: ["TwoPointers"],
    options: ["Find pairs in sorted array", "Sort array", "Reverse array", "Find duplicates"],
    answer: "Find pairs in sorted array",
    difficulty: "EASY"
  },
  {
    text: "How do you move two pointers to find a target sum in [1,2,3,4,5]?",
    type: "MCQ",
    categories: ["TwoPointers"],
    options: ["Start at both ends", "Start at middle", "Start at one end", "Start at random"],
    answer: "Start at both ends",
    difficulty: "EASY"
  },
  {
    text: "What is the output of two pointers finding sum 7 in [1,2,3,4,5]?",
    type: "PREDICT_OUTPUT",
    categories: ["TwoPointers"],
    options: ["[2,5]", "[3,4]", "[1,6]", "[4,3]"],
    answer: "[2,5]",
    difficulty: "EASY"
  },
  // Stacks
  {
    text: "What is the time complexity of push and pop operations in a stack?",
    type: "MCQ",
    categories: ["Stacks"],
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    answer: "O(1)",
    difficulty: "EASY"
  },
  {
    text: "Which data structure is used for function call management?",
    type: "MCQ",
    categories: ["Stacks"],
    options: ["Stack", "Queue", "Array", "Tree"],
    answer: "Stack",
    difficulty: "EASY"
  },
  {
    text: "What is the result after popping two elements from stack [1,2,3]?",
    type: "PREDICT_OUTPUT",
    categories: ["Stacks"],
    options: ["[1]", "[2,3]", "[3]", "[]"],
    answer: "[1]",
    difficulty: "EASY"
  },
  // Recursion
  {
    text: "What is the base case in a recursive factorial function?",
    type: "MCQ",
    categories: ["Recursion"],
    options: ["n == 0", "n == 1", "n < 0", "n > 1"],
    answer: "n == 0",
    difficulty: "EASY"
  },
  {
    text: "How does recursion help in solving the Tower of Hanoi problem?",
    type: "MCQ",
    categories: ["Recursion"],
    options: ["Breaks problem into smaller subproblems", "Sorts disks", "Uses stack", "Finds shortest path"],
    answer: "Breaks problem into smaller subproblems",
    difficulty: "EASY"
  },
  {
    text: "What is the output of recursive sum([1,2,3])?",
    type: "PREDICT_OUTPUT",
    categories: ["Recursion"],
    options: ["6", "3", "1", "0"],
    answer: "6",
    difficulty: "EASY"
  }
];

function addQuestions() {
  const questionsData = fs.readFileSync(questionsFilePath, 'utf8');
  const questions = JSON.parse(questionsData);
  const updatedQuestions = [...questions, ...newQuestions];
  fs.writeFileSync(questionsFilePath, JSON.stringify(updatedQuestions, null, 2));
  console.log(`✅ Added ${newQuestions.length} new questions to ${questionsFilePath}`);
}

addQuestions();
