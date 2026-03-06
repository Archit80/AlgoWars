/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.resolve(__dirname, '../src/db/Arrays.json');

const TYPES = ['MCQ', 'PREDICT_OUTPUT', 'FILL_BLANK'];
const DIFFS = ['EASY', 'MEDIUM', 'HARD'];

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function makeOptionsUnique(options) {
  const seen = new Set();
  const out = [];
  for (const opt of options) {
    if (!seen.has(opt)) {
      seen.add(opt);
      out.push(opt);
    }
  }
  return out;
}

function mcqTemplates() {
  return [
    () => ({
      text: 'What is the time complexity of accessing an element at index i in a fixed-size array?',
      type: 'MCQ',
      categories: ['Arrays', 'Complexity'],
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      answer: 'O(1)',
      difficulty: 'EASY',
    }),
    () => ({
      text: 'Which operation shifts all elements one position to the right and inserts a new element at index 0?',
      type: 'MCQ',
      categories: ['Arrays', 'Algorithms'],
      options: ['Right rotation by 1', 'Left rotation by 1', 'Reversal', 'Partition'],
      answer: 'Right rotation by 1',
      difficulty: 'EASY',
    }),
    () => ({
      text: 'For a sorted array, which search yields the best average time complexity?',
      type: 'MCQ',
      categories: ['Arrays', 'Searching'],
      options: ['Binary search', 'Linear search', 'Interpolation search', 'Jump search'],
      answer: 'Binary search',
      difficulty: 'EASY',
    }),
    () => ({
      text: 'What is the worst-case time complexity of bubble sort on an array of size n?',
      type: 'MCQ',
      categories: ['Arrays', 'Sorting'],
      options: ['O(n^2)', 'O(n log n)', 'O(n)', 'O(1)'],
      answer: 'O(n^2)',
      difficulty: 'EASY',
    }),
    () => ({
      text: 'Which technique maintains two indices moving toward each other to solve array problems efficiently?',
      type: 'MCQ',
      categories: ['Arrays', 'TwoPointers'],
      options: ['Two-pointers', 'Divide-and-conquer', 'Backtracking', 'Greedy'],
      answer: 'Two-pointers',
      difficulty: 'MEDIUM',
    }),
    () => ({
      text: 'What does a sliding window of size k over an array represent?',
      type: 'MCQ',
      categories: ['Arrays', 'SlidingWindow'],
      options: ['A contiguous subarray of length k', 'Any k random elements', 'Every kth element', 'Elements at prime indices'],
      answer: 'A contiguous subarray of length k',
      difficulty: 'MEDIUM',
    }),
    () => ({
      text: 'Which space complexity best describes in-place array reversal using index swaps?',
      type: 'MCQ',
      categories: ['Arrays', 'Complexity'],
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      answer: 'O(1)',
      difficulty: 'EASY',
    }),
    () => ({
      text: 'When rotating an array right by r (0 <= r < n), what index receives the original element at index i?',
      type: 'MCQ',
      categories: ['Arrays', 'Algorithms'],
      options: ['(i + r) % n', '(i - r + n) % n', 'i * r % n', '(i + n - r) % n'],
      answer: '(i + r) % n',
      difficulty: 'MEDIUM',
    }),
    () => ({
      text: 'What is the time complexity of computing prefix sums for an array of size n?',
      type: 'MCQ',
      categories: ['Arrays', 'Algorithms'],
      options: ['O(n)', 'O(n log n)', 'O(1)', 'O(n^2)'],
      answer: 'O(n)',
      difficulty: 'EASY',
    }),
    () => ({
      text: 'For detecting duplicates by hashing while scanning an array, what is the expected time complexity?',
      type: 'MCQ',
      categories: ['Arrays', 'Algorithms'],
      options: ['O(n)', 'O(n log n)', 'O(1)', 'O(n^2)'],
      answer: 'O(n)',
      difficulty: 'MEDIUM',
    }),
  ];
}

function predictTemplates() {
  return [
    () => ({
      text: 'What is the output of this code?\n```\narr = [1, 3, 5, 7]\nsum_even_idx = 0\nfor i in range(0, len(arr), 2):\n    sum_even_idx += arr[i]\nprint(sum_even_idx)\n```',
      type: 'PREDICT_OUTPUT',
      categories: ['Arrays', 'Algorithms'],
      options: ['9', '8', '16', '4'],
      answer: '9',
      difficulty: 'EASY',
    }),
    () => ({
      text: 'What does this code print?\n```\narr = [4, 1, 3, 2]\nfor i in range(len(arr) - 1):\n    for j in range(len(arr) - 1 - i):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]\nprint(arr)\n```',
      type: 'PREDICT_OUTPUT',
      categories: ['Arrays', 'Sorting'],
      options: ['[1, 2, 3, 4]', '[4, 3, 2, 1]', '[2, 1, 3, 4]', '[1, 3, 2, 4]'],
      answer: '[1, 2, 3, 4]',
      difficulty: 'MEDIUM',
    }),
    () => ({
      text: 'Predict the output:\n```\narr = [2, 2, 1, 1, 3]\ncount = 0\nfor i in range(1, len(arr)):\n    if arr[i] == arr[i-1]:\n        count += 1\nprint(count)\n```',
      type: 'PREDICT_OUTPUT',
      categories: ['Arrays', 'Algorithms'],
      options: ['2', '1', '3', '0'],
      answer: '2',
      difficulty: 'EASY',
    }),
    () => ({
      text: 'What is printed?\n```\narr = [1, 2, 3, 4, 5]\nleft, right = 0, len(arr) - 1\nwhile left < right:\n    arr[left], arr[right] = arr[right], arr[left]\n    left += 1\n    right -= 1\nprint(arr)\n```',
      type: 'PREDICT_OUTPUT',
      categories: ['Arrays', 'Algorithms'],
      options: ['[5, 4, 3, 2, 1]', '[1, 2, 3, 4, 5]', '[1, 4, 3, 2, 5]', '[5, 2, 3, 4, 1]'],
      answer: '[5, 4, 3, 2, 1]',
      difficulty: 'MEDIUM',
    }),
  ];
}

function fillBlankTemplates() {
  return [
    () => ({
      text: 'Complete the code to find the maximum element in an array:\n```\ndef find_max(arr):\n    max_val = arr[0]\n    for i in range(1, len(arr)):\n        if arr[i] _____ max_val:\n            max_val = arr[i]\n    return max_val\n```',
      type: 'FILL_BLANK',
      categories: ['Arrays', 'Algorithms'],
      options: ['>', '<', '>=', '=='],
      answer: '>',
      difficulty: 'EASY',
    }),
    () => ({
      text: 'Fill in the blank to compute the prefix sums array:\n```\n# given arr of length n\nprefix = [0] * (len(arr) + 1)\nfor i in range(1, len(arr) + 1):\n    prefix[i] = prefix[i-1] + arr[_____]\n```',
      type: 'FILL_BLANK',
      categories: ['Arrays', 'Algorithms'],
      options: ['i-1', 'i', 'i+1', '0'],
      answer: 'i-1',
      difficulty: 'MEDIUM',
    }),
    () => ({
      text: 'Complete the condition for binary search loop on a sorted array:\n```\nwhile left _____ right:\n    mid = (left + right) // 2\n    # compare and move bounds\n```',
      type: 'FILL_BLANK',
      categories: ['Arrays', 'Searching'],
      options: ['<=', '<', '>=', '=='],
      answer: '<=',
      difficulty: 'MEDIUM',
    }),
  ];
}

function generateQuestions() {
  const mcqGens = mcqTemplates();
  const poGens = predictTemplates();
  const fbGens = fillBlankTemplates();

  const target = { MCQ: 120, PREDICT_OUTPUT: 50, FILL_BLANK: 30 };
  const out = [];

  function pushWithValidation(q) {
    // Ensure shape
    if (!q || typeof q !== 'object') return false;
    if (!q.text || !q.type || !q.categories || !q.options || !q.answer || !q.difficulty) return false;
    if (!Array.isArray(q.categories) || q.categories.length < 1 || q.categories[0] !== 'Arrays') return false;
    if (!Array.isArray(q.options) || q.options.length !== 4) return false;
    const uniqueOptions = makeOptionsUnique(q.options);
    if (uniqueOptions.length !== 4) return false;
    if (!uniqueOptions.includes(q.answer)) return false;
    if (!TYPES.includes(q.type)) return false;
    if (!DIFFS.includes(q.difficulty)) return false;
    // normalize
    q.options = uniqueOptions;
    out.push(q);
    return true;
  }

  // Simple round-robin until counts met, with small variations
  const counts = { MCQ: 0, PREDICT_OUTPUT: 0, FILL_BLANK: 0 };
  let safety = 20000;
  while ((counts.MCQ < target.MCQ || counts.PREDICT_OUTPUT < target.PREDICT_OUTPUT || counts.FILL_BLANK < target.FILL_BLANK) && safety > 0) {
    safety -= 1;
    const choice = counts.MCQ < target.MCQ ? 'MCQ' : (counts.PREDICT_OUTPUT < target.PREDICT_OUTPUT ? 'PREDICT_OUTPUT' : 'FILL_BLANK');
    let q = null;
    if (choice === 'MCQ') {
      const base = pick(mcqGens)();
      // Slight variations
      const variants = [
        'for an array of length n',
        'assuming 0-based indexing',
        'assuming the array is stored contiguously',
        'considering worst case',
        'considering average case',
      ];
      if (Math.random() < 0.35) base.text = `${base.text} (${pick(variants)})`;
      q = base;
    } else if (choice === 'PREDICT_OUTPUT') {
      q = pick(poGens)();
    } else {
      q = pick(fbGens)();
    }

    // Ensure Arrays primary category
    if (!q.categories.includes('Arrays')) q.categories.unshift('Arrays');
    // Optionally add second tag (cap at 2)
    if (q.categories.length > 2) q.categories = ['Arrays', q.categories[1]];

    if (pushWithValidation(q)) counts[q.type] += 1;
  }

  // If we still lack items due to validation strictness, repeat MCQs to hit 200 with minor text variations
  while (out.length < 200 && safety > 0) {
    safety -= 1;
    const base = pick(mcqGens)();
    base.text = `${base.text} [variant ${out.length + 1}]`;
    if (!base.categories.includes('Arrays')) base.categories.unshift('Arrays');
    if (base.categories.length > 2) base.categories = ['Arrays', base.categories[1]];
    if (pushWithValidation(base)) {
      // ok
    }
  }

  if (out.length !== 200) {
    console.error(`Failed to generate exactly 200 questions. Got ${out.length}`);
    process.exit(1);
  }
  return out;
}

function main() {
  const qs = generateQuestions();
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(qs, null, 2), 'utf-8');
  console.log('Generated Arrays questions at:', OUTPUT_PATH);
}

main();


