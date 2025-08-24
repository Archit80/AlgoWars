import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsFilePath = path.join(__dirname, '..', 'db', 'leetcode_mcq_questions.json');

const categories = [
  "Queues", "BinarySearch", "SlidingWindow", "LinkedLists", "HashMaps", "TwoPointers", "Stacks", "Recursion"
];
const difficulties = ["EASY", "MEDIUM", "HARD"];
const types = ["MCQ", "PREDICT_OUTPUT", "FILL_BLANK"];

function generateQuestion(cat, idx) {
  const diff = difficulties[idx % difficulties.length];
  const type = types[idx % types.length];
  let text = "";
  let options = [];
  let answer = "";
  switch (cat) {
    case "Queues":
      if (type === "MCQ") {
        text = `What is the time complexity of enqueue in a queue?`;
        options = ["O(1)", "O(n)", "O(log n)", "O(n log n)"];
        answer = "O(1)";
      } else if (type === "PREDICT_OUTPUT") {
        text = `Queue: [1,2,3,4], after dequeue twice?`;
        options = ["[3,4]", "[1,2]", "[2,3,4]", "[4]"];
        answer = "[3,4]";
      } else {
        text = `Complete: queue.enqueue(x); queue.________();`;
        options = ["dequeue", "push", "pop", "peek"];
        answer = "dequeue";
      }
      break;
    case "BinarySearch":
      if (type === "MCQ") {
        text = `Binary search time complexity?`;
        options = ["O(log n)", "O(n)", "O(1)", "O(n log n)"];
        answer = "O(log n)";
      } else if (type === "PREDICT_OUTPUT") {
        text = `Binary search for 5 in [1,3,5,7,9]?`;
        options = ["2", "3", "4", "Not found"];
        answer = "2";
      } else {
        text = `Complete: if arr[mid] == target return _______;`;
        options = ["mid", "left", "right", "-1"];
        answer = "mid";
      }
      break;
    case "SlidingWindow":
      if (type === "MCQ") {
        text = `Sliding window best for?`;
        options = ["Subarray problems", "Sorting", "Recursion", "Graph traversal"];
        answer = "Subarray problems";
      } else if (type === "PREDICT_OUTPUT") {
        text = `Max sum of subarray length 3 in [1,2,3,4,5]?`;
        options = ["12", "9", "6", "15"];
        answer = "12";
      } else {
        text = `Complete: windowSum += arr[i] - arr[i-k]; _________;`;
        options = ["i++", "windowSum", "arr[i]", "k--"];
        answer = "i++";
      }
      break;
    case "LinkedLists":
      if (type === "MCQ") {
        text = `Reverse singly linked list time complexity?`;
        options = ["O(n)", "O(1)", "O(log n)", "O(n^2)"];
        answer = "O(n)";
      } else if (type === "PREDICT_OUTPUT") {
        text = `Delete head of [1,2,3]?`;
        options = ["[2,3]", "[1,3]", "[3]", "[1,2,3]"];
        answer = "[2,3]";
      } else {
        text = `Complete: node.next = _______;`;
        options = ["prev", "head", "tail", "null"];
        answer = "prev";
      }
      break;
    case "HashMaps":
      if (type === "MCQ") {
        text = `Hash map lookup average-case complexity?`;
        options = ["O(1)", "O(n)", "O(log n)", "O(n log n)"];
        answer = "O(1)";
      } else if (type === "PREDICT_OUTPUT") {
        text = `Delete 'a' from {a:1, b:2, c:3}?`;
        options = ["{b:2, c:3}", "{a:1, b:2}", "{a:1, c:3}", "{}"];
        answer = "{b:2, c:3}";
      } else {
        text = `Complete: map[key] = _______;`;
        options = ["value", "key", "null", "undefined"];
        answer = "value";
      }
      break;
    case "TwoPointers":
      if (type === "MCQ") {
        text = `Two pointers technique use?`;
        options = ["Find pairs in sorted array", "Sort array", "Reverse array", "Find duplicates"];
        answer = "Find pairs in sorted array";
      } else if (type === "PREDICT_OUTPUT") {
        text = `Sum 7 in [1,2,3,4,5] using two pointers?`;
        options = ["[2,5]", "[3,4]", "[1,6]", "[4,3]"];
        answer = "[2,5]";
      } else {
        text = `Complete: left++; right--; _______;`;
        options = ["while left < right", "for i in arr", "return", "break"];
        answer = "while left < right";
      }
      break;
    case "Stacks":
      if (type === "MCQ") {
        text = `Stack push/pop complexity?`;
        options = ["O(1)", "O(n)", "O(log n)", "O(n log n)"];
        answer = "O(1)";
      } else if (type === "PREDICT_OUTPUT") {
        text = `Pop two from [1,2,3]?`;
        options = ["[1]", "[2,3]", "[3]", "[]"];
        answer = "[1]";
      } else {
        text = `Complete: stack.push(x); stack.________();`;
        options = ["pop", "peek", "push", "shift"];
        answer = "pop";
      }
      break;
    case "Recursion":
      if (type === "MCQ") {
        text = `Base case in recursive factorial?`;
        options = ["n == 0", "n == 1", "n < 0", "n > 1"];
        answer = "n == 0";
      } else if (type === "PREDICT_OUTPUT") {
        text = `Recursive sum([1,2,3])?`;
        options = ["6", "3", "1", "0"];
        answer = "6";
      } else {
        text = `Complete: if n == 0 return _______;`;
        options = ["1", "0", "n", "null"];
        answer = "1";
      }
      break;
    default:
      text = `General question for ${cat}`;
      options = ["A", "B", "C", "D"];
      answer = "A";
  }
  return {
    text,
    type,
    categories: [cat],
    options,
    answer,
    difficulty: diff
  };
}

const newQuestions = [];
for (let i = 0; i < 500; i++) {
  const cat = categories[i % categories.length];
  newQuestions.push(generateQuestion(cat, i));
}

function addQuestions() {
  const questionsData = fs.readFileSync(questionsFilePath, 'utf8');
  const questions = JSON.parse(questionsData);
  const updatedQuestions = [...questions, ...newQuestions];
  fs.writeFileSync(questionsFilePath, JSON.stringify(updatedQuestions, null, 2));
  console.log(`✅ Added ${newQuestions.length} new questions to ${questionsFilePath}`);
}

addQuestions();
