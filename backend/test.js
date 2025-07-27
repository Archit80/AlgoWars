import { PrismaClient, QuestionType } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const password1 = await bcrypt.hash('password123', 10);
  const password2 = await bcrypt.hash('password456', 10);

  // Add dummy users (upsert by email)
  const user1 = await prisma.user.upsert({
    where: { email: 'archit1@codeclash.dev' },
    update: {},
    create: {
      email: 'archit1@codeclash.dev',
      username: 'architone',
      password: password1,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'archit2@codeclash.dev' },
    update: {},
    create: {
      email: 'archit2@codeclash.dev',
      username: 'archittwo',
      password: password2,
    },
  });

  // MCQ Questions (50)
  const question1 = await prisma.question.create({
    data: {
      text: 'Which data structure follows the First-In-First-Out (FIFO) principle?',
      type: QuestionType.MCQ,
      category: 'Data Structures',
      options: ['Stack', 'Queue', 'Tree', 'Graph'],
      answer: 'Queue',
    },
  });
  const question2 = await prisma.question.create({
    data: {
      text: 'Which of the following is not a linear data structure?',
      type: QuestionType.MCQ,
      category: 'Data Structures',
      options: ['Linked List', 'Array', 'Stack', 'Graph'],
      answer: 'Graph',
    },
  });
  const question3 = await prisma.question.create({
    data: {
      text: 'Which tree traversal order gives the nodes in ascending order for a binary search tree?',
      type: QuestionType.MCQ,
      category: 'Data Structures',
      options: ['In-order', 'Pre-order', 'Post-order', 'Level-order'],
      answer: 'In-order',
    },
  });
  const question4 = await prisma.question.create({
    data: {
      text: 'What is the time complexity to search for an element in a balanced binary search tree (on average)?',
      type: QuestionType.MCQ,
      category: 'Data Structures',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      answer: 'O(log n)',
    },
  });
  const question5 = await prisma.question.create({
    data: {
      text: 'Which data structure is typically used to implement recursion?',
      type: QuestionType.MCQ,
      category: 'Data Structures',
      options: ['Queue', 'Stack', 'Heap', 'Array'],
      answer: 'Stack',
    },
  });
  const question6 = await prisma.question.create({
    data: {
      text: 'Which of the following operations is typically not O(n) for a singly linked list?',
      type: QuestionType.MCQ,
      category: 'Data Structures',
      options: ['Insert at head', 'Delete at head', 'Search for element', 'Access middle element by index'],
      answer: 'Access middle element by index',
    },
  });
  const question7 = await prisma.question.create({
    data: {
      text: "Which data structure is commonly used to implement the 'undo' operation in text editors?",
      type: QuestionType.MCQ,
      category: 'Data Structures',
      options: ['Stack', 'Queue', 'Set', 'Tree'],
      answer: 'Stack',
    },
  });
  const question8 = await prisma.question.create({
    data: {
      text: 'Which graph algorithm is commonly used to find the shortest path from a single source to all other vertices in a weighted graph without negative weights?',
      type: QuestionType.MCQ,
      category: 'Algorithms',
      options: ['Depth-First Search', 'Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm', 'Breadth-First Search'],
      answer: 'Dijkstra\'s Algorithm',
    },
  });
  const question9 = await prisma.question.create({
    data: {
      text: 'Which of the following is not a divide and conquer algorithm?',
      type: QuestionType.MCQ,
      category: 'Algorithms',
      options: ['Merge Sort', 'Quick Sort', 'Binary Search', 'Dynamic Programming'],
      answer: 'Dynamic Programming',
    },
  });
  const question10 = await prisma.question.create({
    data: {
      text: 'Which algorithm is used to find the minimum spanning tree of a graph?',
      type: QuestionType.MCQ,
      category: 'Algorithms',
      options: ['Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm', 'Bellman-Ford Algorithm', 'Depth-First Search'],
      answer: 'Kruskal\'s Algorithm',
    },
  });
  const question11 = await prisma.question.create({
    data: {
      text: 'What is the best-case time complexity of Quick Sort?',
      type: QuestionType.MCQ,
      category: 'Algorithms',
      options: ['O(n^2)', 'O(n log n)', 'O(n)', 'O(log n)'],
      answer: 'O(n log n)',
    },
  });
  const question12 = await prisma.question.create({
    data: {
      text: 'Which algorithmic paradigm is often used to break a problem into overlapping subproblems and reuse results?',
      type: QuestionType.MCQ,
      category: 'Algorithms',
      options: ['Greedy', 'Divide and Conquer', 'Dynamic Programming', 'Brute Force'],
      answer: 'Dynamic Programming',
    },
  });
  const question13 = await prisma.question.create({
    data: {
      text: 'Which sorting algorithm is not stable?',
      type: QuestionType.MCQ,
      category: 'Algorithms',
      options: ['Merge Sort', 'Bubble Sort', 'Selection Sort', 'Insertion Sort'],
      answer: 'Selection Sort',
    },
  });
  const question14 = await prisma.question.create({
    data: {
      text: 'Which of the following describes an algorithm that always tries to solve the problem by choosing the best immediate option?',
      type: QuestionType.MCQ,
      category: 'Algorithms',
      options: ['Backtracking', 'Greedy Algorithm', 'Divide and Conquer', 'Dynamic Programming'],
      answer: 'Greedy Algorithm',
    },
  });
  const question15 = await prisma.question.create({
    data: {
      text: 'Which of the following is not a primitive data type in JavaScript?',
      type: QuestionType.MCQ,
      category: 'JavaScript',
      options: ['String', 'Number', 'Object', 'Boolean'],
      answer: 'Object',
    },
  });
  const question16 = await prisma.question.create({
    data: {
      text: 'What will be the output of `console.log(typeof NaN);` in JavaScript?',
      type: QuestionType.MCQ,
      category: 'JavaScript',
      options: ['"number"', '"NaN"', '"object"', '"undefined"'],
      answer: '"number"',
    },
  });
  const question17 = await prisma.question.create({
    data: {
      text: 'Which keyword is used to declare a variable with block scope in JavaScript?',
      type: QuestionType.MCQ,
      category: 'JavaScript',
      options: ['var', 'let', 'const', 'static'],
      answer: 'let',
    },
  });
  const question18 = await prisma.question.create({
    data: {
      text: 'What is the output of `\"5\" - 3` in JavaScript?',
      type: QuestionType.MCQ,
      category: 'JavaScript',
      options: ['2', '53', 'undefined', 'NaN'],
      answer: '2',
    },
  });
  const question19 = await prisma.question.create({
    data: {
      text: 'Which array method creates a new array with all elements that pass a test implemented by the provided function?',
      type: QuestionType.MCQ,
      category: 'JavaScript',
      options: ['filter()', 'map()', 'forEach()', 'reduce()'],
      answer: 'filter()',
    },
  });
  const question20 = await prisma.question.create({
    data: {
      text: 'Which HTML tag is used to create a hyperlink?',
      type: QuestionType.MCQ,
      category: 'Frontend',
      options: ['<link>', '<a>', '<href>', '<hyper>'],
      answer: '<a>',
    },
  });
  const question21 = await prisma.question.create({
    data: {
      text: 'What does the CSS property `display: none;` do?',
      type: QuestionType.MCQ,
      category: 'Frontend',
      options: ['Hides the element', 'Removes the element and leaves space', 'Makes the element invisible but retains layout space', 'Shows the element as a block'],
      answer: 'Hides the element',
    },
  });
  const question22 = await prisma.question.create({
    data: {
      text: 'Which HTML5 element is used to embed a JavaScript code in HTML?',
      type: QuestionType.MCQ,
      category: 'Frontend',
      options: ['<script>', '<javascript>', '<code>', '<js>'],
      answer: '<script>',
    },
  });
  const question23 = await prisma.question.create({
    data: {
      text: 'In CSS Flexbox, which property defines the alignment along the main axis?',
      type: QuestionType.MCQ,
      category: 'Frontend',
      options: ['align-items', 'justify-content', 'flex-direction', 'align-content'],
      answer: 'justify-content',
    },
  });
  const question24 = await prisma.question.create({
    data: {
      text: 'Which attribute is used to uniquely identify an element in HTML?',
      type: QuestionType.MCQ,
      category: 'Frontend',
      options: ['class', 'id', 'name', 'type'],
      answer: 'id',
    },
  });
  const question25 = await prisma.question.create({
    data: {
      text: 'Which CSS unit is relative to the font-size of the root element?',
      type: QuestionType.MCQ,
      category: 'Frontend',
      options: ['em', 'rem', '%', 'px'],
      answer: 'rem',
    },
  });
  const question26 = await prisma.question.create({
    data: {
      text: 'Which collection in Java is thread-safe by default?',
      type: QuestionType.MCQ,
      category: 'Java',
      options: ['ArrayList', 'HashSet', 'HashMap', 'Vector'],
      answer: 'Vector',
    },
  });
  const question27 = await prisma.question.create({
    data: {
      text: 'What keyword declares a constant in Java?',
      type: QuestionType.MCQ,
      category: 'Java',
      options: ['var', 'val', 'final', 'const'],
      answer: 'final',
    },
  });
  const question28 = await prisma.question.create({
    data: {
      text: 'Which module is used to create a basic HTTP server in Node.js?',
      type: QuestionType.MCQ,
      category: 'Backend',
      options: ['express', 'fs', 'http', 'net'],
      answer: 'http',
    },
  });
  const question29 = await prisma.question.create({
    data: {
      text: 'What command is used to initialize a new Node.js project (creating a package.json)?',
      type: QuestionType.MCQ,
      category: 'Backend',
      options: ['npm install', 'npm init', 'node init', 'init npm'],
      answer: 'npm init',
    },
  });
  const question30 = await prisma.question.create({
    data: {
      text: 'In REST, which HTTP status code is conventionally returned for a successful POST that created a resource?',
      type: QuestionType.MCQ,
      category: 'Backend',
      options: ['200 OK', '201 Created', '400 Bad Request', '404 Not Found'],
      answer: '201 Created',
    },
  });
  const question31 = await prisma.question.create({
    data: {
      text: 'Which SQL clause is used to combine results from multiple SELECT queries?',
      type: QuestionType.MCQ,
      category: 'SQL',
      options: ['UNION', 'JOIN', 'MERGE', 'COMBINE'],
      answer: 'UNION',
    },
  });
  const question32 = await prisma.question.create({
    data: {
      text: 'Which SQL aggregate function returns the largest value?',
      type: QuestionType.MCQ,
      category: 'SQL',
      options: ['MIN()', 'MAX()', 'AVG()', 'SUM()'],
      answer: 'MAX()',
    },
  });
  const question33 = await prisma.question.create({
    data: {
      text: 'In SQL, what keyword is used to remove all records from a table without deleting the table itself?',
      type: QuestionType.MCQ,
      category: 'SQL',
      options: ['REMOVE', 'DROP', 'DELETE', 'TRUNCATE'],
      answer: 'TRUNCATE',
    },
  });
  const question34 = await prisma.question.create({
    data: {
      text: 'Which keyword is used to iterate over each element of an array or iterable in Python?',
      type: QuestionType.MCQ,
      category: 'Python',
      options: ['for', 'while', 'foreach', 'iterate'],
      answer: 'for',
    },
  });
  const question35 = await prisma.question.create({
    data: {
      text: 'Which keyword is used to handle exceptions in Python?',
      type: QuestionType.MCQ,
      category: 'Python',
      options: ['try/except', 'try/catch', 'try/finally', 'catch/throw'],
      answer: 'try/except',
    },
  });
  const question36 = await prisma.question.create({
    data: {
      text: 'Which built-in data type is ordered, changeable, and allows duplicate members?',
      type: QuestionType.MCQ,
      category: 'Python',
      options: ['Tuple', 'List', 'Set', 'Dictionary'],
      answer: 'List',
    },
  });
  const question37 = await prisma.question.create({
    data: {
      text: 'Which built-in function can be used to get an object\'s memory address in Python (useful for checking identity)?',
      type: QuestionType.MCQ,
      category: 'Python',
      options: ['id()', 'ptr()', 'mem()', 'addr()'],
      answer: 'id()',
    },
  });
  const question38 = await prisma.question.create({
    data: {
      text: 'Which Python statement starts a block of code to be executed only if an exception occurs?',
      type: QuestionType.MCQ,
      category: 'Python',
      options: ['if-exception', 'catch', 'except', 'error'],
      answer: 'except',
    },
  });
  const question39 = await prisma.question.create({
    data: {
      text: 'Which Java feature allows multiple methods to have the same name but different parameters?',
      type: QuestionType.MCQ,
      category: 'Java',
      options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Overloading'],
      answer: 'Overloading',
    },
  });
  // PredictOutput Questions (50)
  const question40 = await prisma.question.create({
    data: {
      text: 'What is the output of 1 + "1" in JavaScript?',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['11', '2', 'NaN', 'Error'],
      answer: '11',
    },
  });
  const question41 = await prisma.question.create({
    data: {
      text: 'Which keyword declares a constant in JavaScript?',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['let', 'var', 'const', 'static'],
      answer: 'const',
    },
  });
  const question42 = await prisma.question.create({
    data: {
      text: 'What is logged by this JavaScript code?\n```\nconsole.log([1, 2, 3].map(x => x * 2));\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['"[2, 4, 6]"', '"2,4,6"', '"[2,4,6]"', '"3,6"'],
      answer: '"[2, 4, 6]"',
    },
  });
  const question43 = await prisma.question.create({
    data: {
      text: 'Predict the output of this code:\n```\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['0 1 2', '3 3 3', '0 1 2 3', 'undefined'],
      answer: '3 3 3',
    },
  });
  const question44 = await prisma.question.create({
    data: {
      text: 'What does this code print?\n```\nconsole.log(typeof null);\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['"object"', '"null"', '"undefined"', '"number"'],
      answer: '"object"',
    },
  });
  const question45 = await prisma.question.create({
    data: {
      text: 'Predict the output:\n```\nlet a = 1;\nlet b = a++;\nconsole.log(a, b);\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['2 1', '1 1', '2 2', '1 2'],
      answer: '2 1',
    },
  });
  const question46 = await prisma.question.create({
    data: {
      text: 'What is logged by this code?\n```\nfunction greet(name = \'World\') {\n  console.log(\'Hello \' + name);\n}\ngreet();\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['Hello World', 'Hello undefined', 'Hello name', 'World'],
      answer: 'Hello World',
    },
  });
  const question47 = await prisma.question.create({
    data: {
      text: 'What is the output of this JavaScript code?\n```\nconsole.log("5" - "2");\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['3', '"3"', 'NaN', '"NaN"'],
      answer: '3',
    },
  });
  const question48 = await prisma.question.create({
    data: {
      text: 'What is the output of this JavaScript code?\n```\nconsole.log(!!"Hello");\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['true', 'false', '"Hello"', '"!!Hello"'],
      answer: 'true',
    },
  });
  const question49 = await prisma.question.create({
    data: {
      text: 'What is printed by this JavaScript code?\n```\nconsole.log([1,2] + [3,4]);\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['"1,23,4"', '"[1,2][3,4]"', '"1,23,4,"', '"[1,2,3,4]"'],
      answer: '"1,23,4"',
    },
  });
  const question50 = await prisma.question.create({
    data: {
      text: 'What is printed by this JavaScript code?\n```\nconsole.log(NaN === NaN);\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['true', 'false', 'NaN', 'TypeError'],
      answer: 'false',
    },
  });
  const question51 = await prisma.question.create({
    data: {
      text: 'Predict the output:\n```\nconsole.log([].toString());\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['""', '0', 'undefined', 'Array'],
      answer: '""',
    },
  });
  const question52 = await prisma.question.create({
    data: {
      text: 'Predict the output:\n```\nconsole.log([] + []);\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['""', '0', 'undefined', '"[]"'],
      answer: '""',
    },
  });
  const question53 = await prisma.question.create({
    data: {
      text: 'Predict the output:\n```\nconsole.log(typeof (function() {}));\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'JavaScript',
      options: ['"function"', '"object"', '"undefined"', '"lambda"'],
      answer: '"function"',
    },
  });
  const question54 = await prisma.question.create({
    data: {
      text: 'What is the output of this Node.js code?\n```\nconst nums = [1, 2, 3];\nnums.forEach(num => console.log(num * 2));\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'Backend',
      options: ['2 4 6', '1 2 3', '2,4,6', '[2,4,6]'],
      answer: '2 4 6',
    },
  });
  const question55 = await prisma.question.create({
    data: {
      text: 'Predict the output:\n```\nconsole.log(2 + 3 * 4);\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'Backend',
      options: ['14', '20', '18', '11'],
      answer: '14',
    },
  });
  const question56 = await prisma.question.create({
    data: {
      text: 'What is the result of this SQL query?\n```\nSELECT 2 + 3 * 4;\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'SQL',
      options: ['14', '20', '11', '24'],
      answer: '14',
    },
  });
  const question57 = await prisma.question.create({
    data: {
      text: 'Predict the output of the following SQL statement:\n```\nSELECT \'Hello \' || \'World\' AS greeting;\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'SQL',
      options: ['Hello World', 'Hello', 'World', 'greeting'],
      answer: 'Hello World',
    },
  });
  const question58 = await prisma.question.create({
    data: {
      text: 'What does this SQL statement return?\n```\nSELECT LENGTH(\'OpenAI\');\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'SQL',
      options: ['6', '7', '0', 'OPENAI'],
      answer: '6',
    },
  });
  const question59 = await prisma.question.create({
    data: {
      text: 'What is printed by this Python code?\n```\nprint(2 ** 3)\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'Python',
      options: ['6', '8', '9', 'Error'],
      answer: '8',
    },
  });
  const question60 = await prisma.question.create({
    data: {
      text: 'Predict the output:\n```\na = [1, 2]\na.append([3, 4])\nprint(a)\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'Python',
      options: ['[1, 2, 3, 4]', '[1, 2, [3, 4]]', '[[1, 2], 3, 4]', 'Error'],
      answer: '[1, 2, [3, 4]]',
    },
  });
  const question61 = await prisma.question.create({
    data: {
      text: 'What does the following print?\n```\nprint(\'Hello\' + \' \' + \'Python\')\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'Python',
      options: ['Hello Python', 'HelloPython', 'Hello', 'Python'],
      answer: 'Hello Python',
    },
  });
  const question62 = await prisma.question.create({
    data: {
      text: 'What is printed by this code?\n```\nfor i in range(3):\n    print(i, end=\'\')\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'Python',
      options: ['0 1 2', '012', '0,1,2', 'None'],
      answer: '012',
    },
  });
  const question63 = await prisma.question.create({
    data: {
      text: 'What is printed by this code?\n```\nfor i in range(3):\n    print(i, end=\'\')\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'Python',
      options: ['0 1 2', '012', '0,1,2', 'None'],
      answer: '012',
    },
  });
  const question64 = await prisma.question.create({
    data: {
      text: 'What is printed by this code?\n```\nfor i in range(3):\n    print(i, end=\'\')\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'Python',
      options: ['0 1 2', '012', '0,1,2', 'None'],
      answer: '012',
    },
  });
  const question65 = await prisma.question.create({
    data: {
      text: 'What is the output of the following SQL query?\n```\nSELECT CONCAT(\'A\', \'B\');\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'SQL',
      options: ['AB', 'A B', 'Error', 'A,B'],
      answer: 'AB',
    },
  });
  const question66 = await prisma.question.create({
    data: {
      text: 'Predict the output:\n```\nSELECT SUBSTR(\'Hello\', 2, 3);\n```',
      type: QuestionType.PREDICT_OUTPUT,
      category: 'SQL',
      options: ['Hel', 'ell', 'llo', 'Error'],
      answer: 'ell',
    },
  });
  // Fill in the Blank Questions (50)
  const question67 = await prisma.question.create({
    data: {
      text: 'The Last-In-First-Out (LIFO) principle is used by a ___ data structure.',
      type: QuestionType.FILL_BLANK,
      category: 'Data Structures',
      options: [],
      answer: 'Stack',
    },
  });
  const question68 = await prisma.question.create({
    data: {
      text: 'Hash collisions can be resolved by chaining or ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Data Structures',
      options: [],
      answer: 'open addressing',
    },
  });
  const question69 = await prisma.question.create({
    data: {
      text: 'In a min-heap, the smallest element is always at the ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Data Structures',
      options: [],
      answer: 'root',
    },
  });
  const question70 = await prisma.question.create({
    data: {
      text: 'A complete binary tree of height h has a maximum of ___ nodes.',
      type: QuestionType.FILL_BLANK,
      category: 'Data Structures',
      options: [],
      answer: '2^(h+1)-1',
    },
  });
  const question71 = await prisma.question.create({
    data: {
      text: 'The data structure commonly used for level-order traversal of a binary tree is ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Data Structures',
      options: [],
      answer: 'Queue',
    },
  });
  const question72 = await prisma.question.create({
    data: {
      text: 'In a queue, the operation of removing the front element is called ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Data Structures',
      options: [],
      answer: 'dequeue',
    },
  });
  const question73 = await prisma.question.create({
    data: {
      text: 'Time complexity of binary search on a sorted array is ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Data Structures',
      options: [],
      answer: 'O(log n)',
    },
  });
  const question74 = await prisma.question.create({
    data: {
      text: 'In a stack implemented with a fixed-size array, pushing an element when full results in ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Data Structures',
      options: [],
      answer: 'overflow',
    },
  });
  const question75 = await prisma.question.create({
    data: {
      text: 'The term that describes an unbalanced binary search tree with all nodes on one side is ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Data Structures',
      options: [],
      answer: 'degenerate tree',
    },
  });
  const question76 = await prisma.question.create({
    data: {
      text: 'Divide and Conquer algorithms often solve problems by ___ them into smaller subproblems.',
      type: QuestionType.FILL_BLANK,
      category: 'Algorithms',
      options: [],
      answer: 'dividing',
    },
  });
  const question77 = await prisma.question.create({
    data: {
      text: 'The time complexity of binary search is ___ in the worst case.',
      type: QuestionType.FILL_BLANK,
      category: 'Algorithms',
      options: [],
      answer: 'O(log n)',
    },
  });
  const question78 = await prisma.question.create({
    data: {
      text: 'Dynamic programming reduces overlapping subproblems by storing results in a ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Algorithms',
      options: [],
      answer: 'table',
    },
  });
  const question79 = await prisma.question.create({
    data: {
      text: 'In algorithm analysis, Θ (theta) notation provides both an upper and ___ bound on growth.',
      type: QuestionType.FILL_BLANK,
      category: 'Algorithms',
      options: [],
      answer: 'lower',
    },
  });
  const question80 = await prisma.question.create({
    data: {
      text: 'The process of breaking recursion into non-recursive solutions in dynamic programming is called ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Algorithms',
      options: [],
      answer: 'memoization',
    },
  });
  const question81 = await prisma.question.create({
    data: {
      text: 'A greedy algorithm makes the ___ choice at each step, hoping for a global optimum.',
      type: QuestionType.FILL_BLANK,
      category: 'Algorithms',
      options: [],
      answer: 'locally optimal',
    },
  });
  const question82 = await prisma.question.create({
    data: {
      text: 'Floyd-Warshall algorithm finds shortest paths in a graph between all pairs of vertices, and it uses ___ programming.',
      type: QuestionType.FILL_BLANK,
      category: 'Algorithms',
      options: [],
      answer: 'dynamic',
    },
  });
  const question83 = await prisma.question.create({
    data: {
      text: 'The time complexity of linear search in an unsorted array is ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Algorithms',
      options: [],
      answer: 'O(n)',
    },
  });
  const question84 = await prisma.question.create({
    data: {
      text: 'In Python, the loop that guarantees at least one execution is the ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'while',
    },
  });
  const question85 = await prisma.question.create({
    data: {
      text: 'The built-in type of `()` in Python is ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'tuple',
    },
  });
  const question86 = await prisma.question.create({
    data: {
      text: 'The function to get the length of a list or string in Python is ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'len',
    },
  });
  const question87 = await prisma.question.create({
    data: {
      text: 'A function without a return statement returns ___ in Python.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'None',
    },
  });
  const question88 = await prisma.question.create({
    data: {
      text: 'The `for` and `while` constructs in Python define code ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'blocks',
    },
  });
  const question89 = await prisma.question.create({
    data: {
      text: 'PEP stands for Python Enhancement ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'Proposal',
    },
  });
  const question90 = await prisma.question.create({
    data: {
      text: 'A list comprehension returns a new ___ built from an existing iterable.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'list',
    },
  });
  const question91 = await prisma.question.create({
    data: {
      text: 'The `pass` statement in Python is a ___ that does nothing when executed.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'placeholder',
    },
  });
  const question92 = await prisma.question.create({
    data: {
      text: 'The data type of `[]` in Python is ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'list',
    },
  });
  const question93 = await prisma.question.create({
    data: {
      text: 'In Python, immutable objects cannot be ___.',
      type: QuestionType.FILL_BLANK,
      category: 'Python',
      options: [],
      answer: 'changed',
    },
  });
  const question94 = await prisma.question.create({
    data: {
      text: 'Express.js is a framework for building web applications on top of Node.js using ___ programming style.',
      type: QuestionType.FILL_BLANK,
      category: 'Backend',
      options: [],
      answer: 'middleware',
    },
  });
  const question95 = await prisma.question.create({
    data: {
      text: 'To handle JSON request bodies in Express, you often use `app.use(express.___());`.',
      type: QuestionType.FILL_BLANK,
      category: 'Backend',
      options: [],
      answer: 'json',
    },
  });
  const question96 = await prisma.question.create({
    data: {
      text: 'REST stands for Representational ___ State Transfer.',
      type: QuestionType.FILL_BLANK,
      category: 'Backend',
      options: [],
      answer: 'State',
    },
  });
  const question97 = await prisma.question.create({
    data: {
      text: 'In Express, the `res.status(404).send(\'Not Found\')` method sets the HTTP status code and sends the ___ back to the client.',
      type: QuestionType.FILL_BLANK,
      category: 'Backend',
      options: [],
      answer: 'response',
    },
  });
  const question98 = await prisma.question.create({
    data: {
      text: 'To parse URL-encoded data (like form submissions) in Express, you can use `express.___()` middleware.',
      type: QuestionType.FILL_BLANK,
      category: 'Backend',
      options: [],
      answer: 'urlencoded',
    },
  });
  const question99 = await prisma.question.create({
    data: {
      text: 'SQL stands for Structured ___ Language.',
      type: QuestionType.FILL_BLANK,
      category: 'SQL',
      options: [],
      answer: 'Query',
    },
  });
  const question100 = await prisma.question.create({
    data: {
      text: 'The wildcard character \'%\' in SQL\'s LIKE clause matches ___ characters.',
      type: QuestionType.FILL_BLANK,
      category: 'SQL',
      options: [],
      answer: 'zero or more',
    },
  });
  const question101 = await prisma.question.create({
    data: {
      text: 'To select unique values from a column, SQL uses the keyword ___.',
      type: QuestionType.FILL_BLANK,
      category: 'SQL',
      options: [],
      answer: 'DISTINCT',
    },
  });
  const question102 = await prisma.question.create({
    data: {
      text: 'A SQL LEFT OUTER join returns all records from the left table and the matched records from the right table.',
      type: QuestionType.FILL_BLANK,
      category: 'SQL',
      options: [],
      answer: 'LEFT OUTER',
    },
  });
  const question103 = await prisma.question.create({
    data: {
      text: 'A SQL DELETE statement without a WHERE clause removes ___ from the table.',
      type: QuestionType.FILL_BLANK,
      category: 'SQL',
      options: [],
      answer: 'all rows',
    },
  });
  const question104 = await prisma.question.create({
    data: {
      text: 'SQL full-text search is often implemented using an ___ index.',
      type: QuestionType.FILL_BLANK,
      category: 'SQL',
      options: [],
      answer: 'inverted',
    },
  });
  const question105 = await prisma.question.create({
    data: {
      text: 'The SQL function used to calculate the remainder of a division is ___.',
      type: QuestionType.FILL_BLANK,
      category: 'SQL',
      options: [],
      answer: 'MOD',
    },
  });

  console.log('🌱 Seeded successfully:');
  console.log({ user1, user2, question1, /* ... all questions up to question105 */ });
}

main()
  .catch((e) => {
    if (e.code === 'P2002') {
      console.error('Unique constraint failed:', e.meta);
    } else {
      console.error(e);
    }
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
