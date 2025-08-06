import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current questions file
const questionsPath = path.join(__dirname, 'leetcode_mcq_questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// More comprehensive questions covering advanced topics
const moreQuestions = [
  {
    "text": "Given this bit manipulation for finding single number:\n\n```\nNUMS = [2, 2, 1]\nresult = 0\n\nfor num in NUMS:\n    result = result XOR num\n```\n\nWhat is the final value of result?",
    "type": "PREDICT_OUTPUT",
    "categories": ["BitManipulation"],
    "options": ["1", "2", "0", "3"],
    "answer": "1",
    "difficulty": "EASY"
  },
  {
    "text": "Complete this bit manipulation to count set bits:\n\n```\nfunction countSetBits(n):\n    count = 0\n    while n:\n        count += 1\n        _______________\n    return count\n```",
    "type": "FILL_BLANK",
    "categories": ["BitManipulation"],
    "options": ["n = n & (n - 1)", "n = n >> 1", "n = n | (n + 1)", "n = n + 1"],
    "answer": "n = n & (n - 1)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "What does the expression `x & (-x)` return?",
    "type": "MCQ",
    "categories": ["BitManipulation"],
    "options": ["The rightmost set bit", "The leftmost set bit", "All set bits", "The complement of x"],
    "answer": "The rightmost set bit",
    "difficulty": "HARD"
  },
  {
    "text": "Given this matrix spiral traversal:\n\n```\nMATRIX = [[1,2,3],[4,5,6],[7,8,9]]\ntop, bottom = 0, 2\nleft, right = 0, 2\nresult = []\n\nwhile top <= bottom and left <= right:\n    // Right\n    for col in range(left, right + 1):\n        result.append(MATRIX[top][col])\n    top += 1\n    \n    // Down\n    for row in range(top, bottom + 1):\n        result.append(MATRIX[row][right])\n    right -= 1\n    \n    // Left\n    if top <= bottom:\n        for col in range(right, left - 1, -1):\n            result.append(MATRIX[bottom][col])\n        bottom -= 1\n    \n    // Up\n    if left <= right:\n        for row in range(bottom, top - 1, -1):\n            result.append(MATRIX[row][left])\n        left += 1\n```\n\nWhat is the complete spiral order?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Arrays", "Matrix"],
    "options": ["[1,2,3,6,9,8,7,4,5]", "[1,4,7,8,9,6,3,2,5]", "[1,2,3,4,5,6,7,8,9]", "[5,4,7,8,9,6,3,2,1]"],
    "answer": "[1,2,3,6,9,8,7,4,5]",
    "difficulty": "MEDIUM"
  },
  {
    "text": "In a suffix array, what does each element represent?",
    "type": "MCQ",
    "categories": ["Strings", "SuffixArray"],
    "options": ["Starting position of sorted suffixes", "Length of each suffix", "Lexicographic rank", "Hash value of suffix"],
    "answer": "Starting position of sorted suffixes",
    "difficulty": "HARD"
  },
  {
    "text": "Given this KMP pattern matching:\n\n```\nTEXT = \"ABABCABABA\"\nPATTERN = \"ABABA\"\nlps = [0, 0, 1, 2, 0]  // Longest proper prefix suffix\ni = 0  // Text pointer\nj = 0  // Pattern pointer\nmatches = []\n\nwhile i < length(TEXT):\n    if PATTERN[j] == TEXT[i]:\n        i += 1\n        j += 1\n    \n    if j == length(PATTERN):\n        matches.append(i - j)\n        j = lps[j - 1]\n    elif i < length(TEXT) and PATTERN[j] != TEXT[i]:\n        if j != 0:\n            j = lps[j - 1]\n        else:\n            i += 1\n```\n\nAt what position is the first match found?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Strings", "KMP"],
    "options": ["5", "0", "6", "No match"],
    "answer": "5",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this manacher's algorithm for palindromes:\n\n```\nfunction manacher(s):\n    // Transform string\n    T = '#'.join('^{}$'.format(s))\n    n = length(T)\n    P = [0] * n\n    center = right = 0\n    \n    for i in range(1, n - 1):\n        mirror = 2 * center - i\n        \n        if i < right:\n            _______________\n        \n        // Try to expand palindrome\n        while T[i + (1 + P[i])] == T[i - (1 + P[i])]:\n            P[i] += 1\n        \n        // Update center and right boundary\n        if i + P[i] > right:\n            center, right = i, i + P[i]\n    \n    return P\n```",
    "type": "FILL_BLANK",
    "categories": ["Strings", "Palindromes"],
    "options": ["P[i] = min(right - i, P[mirror])", "P[i] = P[mirror]", "P[i] = right - i", "P[i] = max(right - i, P[mirror])"],
    "answer": "P[i] = min(right - i, P[mirror])",
    "difficulty": "HARD"
  },
  {
    "text": "What is the time complexity of the Rabin-Karp string matching algorithm?",
    "type": "MCQ",
    "categories": ["Strings", "Hashing"],
    "options": ["O(nm) worst case, O(n+m) average", "O(n+m) always", "O(nm) always", "O(n log m)"],
    "answer": "O(nm) worst case, O(n+m) average",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this Floyd-Warshall algorithm:\n\n```\nGRAPH = [[0, 5, INF, 10],\n         [INF, 0, 3, INF],\n         [INF, INF, 0, 1],\n         [INF, INF, INF, 0]]\nn = 4\ndist = copy(GRAPH)\n\nfor k in range(n):\n    for i in range(n):\n        for j in range(n):\n            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\n```\n\nWhat is the shortest path from vertex 0 to vertex 3?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Graphs", "FloydWarshall"],
    "options": ["9", "10", "8", "INF"],
    "answer": "9",
    "difficulty": "HARD"
  },
  {
    "text": "In the Bellman-Ford algorithm, why do we run V-1 iterations?",
    "type": "MCQ",
    "categories": ["Graphs", "BellmanFord"],
    "options": ["To handle negative cycles", "Maximum path length is V-1 edges", "To optimize performance", "To ensure convergence"],
    "answer": "Maximum path length is V-1 edges",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this A* search implementation:\n\n```\nfunction aStar(start, goal, heuristic):\n    openSet = PriorityQueue()\n    openSet.put((0, start))\n    cameFrom = {}\n    gScore = {start: 0}\n    fScore = {start: heuristic(start, goal)}\n    \n    while not openSet.empty():\n        current = openSet.get()[1]\n        \n        if current == goal:\n            return reconstructPath(cameFrom, current)\n        \n        for neighbor in neighbors(current):\n            tentative_gScore = gScore[current] + distance(current, neighbor)\n            \n            if tentative_gScore < gScore.get(neighbor, infinity):\n                cameFrom[neighbor] = current\n                gScore[neighbor] = tentative_gScore\n                _______________\n                if neighbor not in openSet:\n                    openSet.put((fScore[neighbor], neighbor))\n```",
    "type": "FILL_BLANK",
    "categories": ["Graphs", "AStar"],
    "options": ["fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal)", "fScore[neighbor] = heuristic(neighbor, goal)", "fScore[neighbor] = gScore[neighbor]", "fScore[neighbor] = tentative_gScore"],
    "answer": "fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal)",
    "difficulty": "HARD"
  },
  {
    "text": "What must be true about the heuristic function in A* for it to find optimal paths?",
    "type": "MCQ",
    "categories": ["Graphs", "AStar"],
    "options": ["It must be admissible (never overestimate)", "It must be consistent", "Both admissible and consistent", "It must be exact"],
    "answer": "Both admissible and consistent",
    "difficulty": "HARD"
  },
  {
    "text": "Given this matrix chain multiplication DP:\n\n```\nDIMENSIONS = [1, 2, 3, 4, 5]  // Matrix sizes: 1x2, 2x3, 3x4, 4x5\nn = length(DIMENSIONS)\ndp = 2D array (n x n), all zeros\n\nfor length in range(2, n):\n    for i in range(1, n - length + 1):\n        j = i + length - 1\n        dp[i][j] = infinity\n        \n        for k in range(i, j):\n            cost = dp[i][k] + dp[k+1][j] + DIMENSIONS[i-1] * DIMENSIONS[k] * DIMENSIONS[j]\n            dp[i][j] = min(dp[i][j], cost)\n```\n\nWhat is dp[1][4] (minimum cost to multiply matrices 1 to 4)?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming"],
    "options": ["30", "54", "40", "48"],
    "answer": "30",
    "difficulty": "HARD"
  },
  {
    "text": "In the coin change problem, what does the recurrence relation represent?",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["dp[i] = min(dp[i], dp[i-coin] + 1) for each coin", "dp[i] = dp[i-1] + dp[i-2]", "dp[i] = max(dp[i-1], dp[i-2] + coins[i])", "dp[i] = dp[i-1] + coins[i]"],
    "answer": "dp[i] = min(dp[i], dp[i-coin] + 1) for each coin",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this edit distance (Levenshtein) DP:\n\n```\nfunction editDistance(str1, str2):\n    m, n = length(str1), length(str2)\n    dp = 2D array (m+1 x n+1)\n    \n    // Initialize base cases\n    for i in range(m + 1):\n        dp[i][0] = i\n    for j in range(n + 1):\n        dp[0][j] = j\n    \n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if str1[i-1] == str2[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                _______________\n    \n    return dp[m][n]\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming", "Strings"],
    "options": ["dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])", "dp[i][j] = 1 + dp[i-1][j-1]", "dp[i][j] = min(dp[i-1][j], dp[i][j-1])", "dp[i][j] = dp[i-1][j] + dp[i][j-1]"],
    "answer": "dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
    "difficulty": "MEDIUM"
  },
  {
    "text": "What is the optimal substructure property in dynamic programming?",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["Optimal solution contains optimal solutions to subproblems", "Problem can be divided into subproblems", "Subproblems overlap", "Solution uses memoization"],
    "answer": "Optimal solution contains optimal solutions to subproblems",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this Kadane's algorithm for maximum subarray:\n\n```\nARRAY = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nmax_ending_here = 0\nmax_so_far = -infinity\n\nfor i in range(length(ARRAY)):\n    max_ending_here = max_ending_here + ARRAY[i]\n    if max_so_far < max_ending_here:\n        max_so_far = max_ending_here\n    if max_ending_here < 0:\n        max_ending_here = 0\n```\n\nWhat is the maximum subarray sum?",
    "type": "PREDICT_OUTPUT",
    "categories": ["DynamicProgramming", "Arrays"],
    "options": ["6", "4", "7", "5"],
    "answer": "6",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this longest common subsequence DP:\n\n```\nfunction LCS(X, Y):\n    m, n = length(X), length(Y)\n    dp = 2D array (m+1 x n+1), all zeros\n    \n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if X[i-1] == Y[j-1]:\n                _______________\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    \n    return dp[m][n]\n```",
    "type": "FILL_BLANK",
    "categories": ["DynamicProgramming", "Strings"],
    "options": ["dp[i][j] = dp[i-1][j-1] + 1", "dp[i][j] = dp[i-1][j-1]", "dp[i][j] = 1", "dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + 1"],
    "answer": "dp[i][j] = dp[i-1][j-1] + 1",
    "difficulty": "EASY"
  },
  {
    "text": "In the rod cutting problem, what does dp[i] represent?",
    "type": "MCQ",
    "categories": ["DynamicProgramming"],
    "options": ["Maximum revenue from rod of length i", "Number of cuts for rod of length i", "Cost of cutting rod of length i", "Minimum pieces for rod of length i"],
    "answer": "Maximum revenue from rod of length i",
    "difficulty": "EASY"
  },
  {
    "text": "Given this binary indexed tree (Fenwick tree) update:\n\n```\nclass BIT:\n    def __init__(size):\n        self.size = size\n        self.tree = [0] * (size + 1)\n    \n    def update(i, delta):\n        while i <= self.size:\n            self.tree[i] += delta\n            i += i & (-i)\n    \n    def query(i):\n        sum = 0\n        while i > 0:\n            sum += self.tree[i]\n            _______________\n        return sum\n```",
    "type": "FILL_BLANK",
    "categories": ["BinaryIndexedTree"],
    "options": ["i -= i & (-i)", "i -= 1", "i >>= 1", "i &= (i - 1)"],
    "answer": "i -= i & (-i)",
    "difficulty": "HARD"
  },
  {
    "text": "What is the time complexity of range sum queries in a Binary Indexed Tree?",
    "type": "MCQ",
    "categories": ["BinaryIndexedTree"],
    "options": ["O(log n)", "O(n)", "O(1)", "O(sqrt(n))"],
    "answer": "O(log n)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this Mo's algorithm for range queries:\n\n```\nQUERIES = [(0, 2), (1, 3), (0, 3)]  // (left, right) pairs\nBLOCK_SIZE = sqrt(n)\n\n// Sort queries by (left // BLOCK_SIZE, right)\nsorted_queries = sorted(QUERIES, key=lambda q: (q[0] // BLOCK_SIZE, q[1]))\n\ncurrent_left = 0\ncurrent_right = -1\ncurrent_answer = 0\n\nfor left, right in sorted_queries:\n    while current_right < right:\n        current_right += 1\n        add(ARRAY[current_right])\n    \n    while current_right > right:\n        remove(ARRAY[current_right])\n        current_right -= 1\n    \n    while current_left < left:\n        remove(ARRAY[current_left])\n        current_left += 1\n    \n    while current_left > left:\n        current_left -= 1\n        add(ARRAY[current_left])\n    \n    answers[query_index] = current_answer\n```\n\nWhat is the time complexity of Mo's algorithm?",
    "type": "MCQ",
    "categories": ["MoAlgorithm"],
    "options": ["O(n * sqrt(n))", "O(n log n)", "O(n²)", "O(sqrt(n))"],
    "answer": "O(n * sqrt(n))",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this square root decomposition for range minimum query:\n\n```\nclass SqrtDecomposition:\n    def __init__(arr):\n        self.n = length(arr)\n        self.block_size = int(sqrt(self.n))\n        self.blocks = [infinity] * ((self.n + self.block_size - 1) // self.block_size)\n        \n        for i in range(self.n):\n            self.blocks[i // self.block_size] = min(self.blocks[i // self.block_size], arr[i])\n    \n    def query(left, right):\n        result = infinity\n        \n        while left <= right and left % self.block_size != 0:\n            result = min(result, self.arr[left])\n            left += 1\n        \n        while left + self.block_size - 1 <= right:\n            _______________\n            left += self.block_size\n        \n        while left <= right:\n            result = min(result, self.arr[left])\n            left += 1\n        \n        return result\n```",
    "type": "FILL_BLANK",
    "categories": ["SqrtDecomposition"],
    "options": ["result = min(result, self.blocks[left // self.block_size])", "result = min(result, self.arr[left])", "result = min(result, self.blocks[left])", "left = left + self.block_size"],
    "answer": "result = min(result, self.blocks[left // self.block_size])",
    "difficulty": "HARD"
  },
  {
    "text": "What is the main advantage of square root decomposition?",
    "type": "MCQ",
    "categories": ["SqrtDecomposition"],
    "options": ["Simple to implement", "O(1) query time", "O(log n) space", "Handles all types of queries"],
    "answer": "Simple to implement",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this heavy-light decomposition concept, what is the maximum number of heavy edges on any path?",
    "type": "MCQ",
    "categories": ["HeavyLightDecomposition"],
    "options": ["O(log n)", "O(n)", "O(sqrt(n))", "O(1)"],
    "answer": "O(log n)",
    "difficulty": "HARD"
  },
  {
    "text": "In a centroid decomposition, what property does the centroid have?",
    "type": "MCQ",
    "categories": ["CentroidDecomposition"],
    "options": ["Removing it creates subtrees of size ≤ n/2", "It's the root of the tree", "It has maximum degree", "It's at the geometric center"],
    "answer": "Removing it creates subtrees of size ≤ n/2",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this persistent segment tree update:\n\n```\nclass PersistentSegTree:\n    def update(node, start, end, idx, val, version):\n        if start == end:\n            new_node = Node(val)\n            return new_node\n        \n        mid = (start + end) // 2\n        new_node = Node()\n        \n        if idx <= mid:\n            new_node.left = self.update(node.left, start, mid, idx, val, version)\n            _______________\n        else:\n            new_node.left = node.left\n            new_node.right = self.update(node.right, mid+1, end, idx, val, version)\n        \n        new_node.val = new_node.left.val + new_node.right.val\n        return new_node\n```",
    "type": "FILL_BLANK",
    "categories": ["PersistentSegmentTree"],
    "options": ["new_node.right = node.right", "new_node.right = self.update(node.right, mid+1, end, idx, val, version)", "new_node.right = Node(val)", "new_node.right = None"],
    "answer": "new_node.right = node.right",
    "difficulty": "HARD"
  },
  {
    "text": "What is the space complexity of a persistent segment tree after m updates?",
    "type": "MCQ",
    "categories": ["PersistentSegmentTree"],
    "options": ["O(m log n)", "O(m * n)", "O(n log m)", "O(m + n)"],
    "answer": "O(m log n)",
    "difficulty": "HARD"
  },
  {
    "text": "Given this suffix tree construction concept, what is the time complexity of Ukkonen's algorithm?",
    "type": "MCQ",
    "categories": ["SuffixTree"],
    "options": ["O(n)", "O(n log n)", "O(n²)", "O(n log² n)"],
    "answer": "O(n)",
    "difficulty": "HARD"
  },
  {
    "text": "In a link-cut tree, what operation allows querying paths?",
    "type": "MCQ",
    "categories": ["LinkCutTree"],
    "options": ["link(u, v)", "cut(u, v)", "path(u, v)", "expose(v)"],
    "answer": "expose(v)",
    "difficulty": "HARD"
  },
  {
    "text": "What is the amortized time complexity of operations in a link-cut tree?",
    "type": "MCQ",
    "categories": ["LinkCutTree"],
    "options": ["O(log n)", "O(1)", "O(sqrt(n))", "O(n)"],
    "answer": "O(log n)",
    "difficulty": "HARD"
  },
  {
    "text": "Given this convex hull using Graham scan:\n\n```\nPOINTS = [(0,3), (1,1), (2,2), (4,4), (0,0), (1,2), (3,1), (3,3)]\n\n// Find bottom-most point (or leftmost if tie)\nstart = min(POINTS, key=lambda p: (p[1], p[0]))\n\n// Sort by polar angle with respect to start\nsorted_points = sorted(POINTS, key=lambda p: atan2(p[1] - start[1], p[0] - start[0]))\n\nstack = []\nfor point in sorted_points:\n    while len(stack) > 1 and cross_product(stack[-2], stack[-1], point) <= 0:\n        stack.pop()\n    stack.append(point)\n```\n\nWhat is the first point to be removed from the stack?",
    "type": "PREDICT_OUTPUT",
    "categories": ["Geometry", "ConvexHull"],
    "options": ["(1,1)", "(2,2)", "(1,2)", "No point removed"],
    "answer": "(1,1)",
    "difficulty": "HARD"
  },
  {
    "text": "What is the time complexity of Graham scan for convex hull?",
    "type": "MCQ",
    "categories": ["Geometry", "ConvexHull"],
    "options": ["O(n log n)", "O(n²)", "O(n)", "O(n log² n)"],
    "answer": "O(n log n)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Complete this line intersection check:\n\n```\nfunction lineIntersection(p1, q1, p2, q2):\n    def orientation(p, q, r):\n        val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])\n        if val == 0:\n            return 0  // collinear\n        return 1 if val > 0 else 2  // clockwise or counterclockwise\n    \n    o1 = orientation(p1, q1, p2)\n    o2 = orientation(p1, q1, q2)\n    o3 = orientation(p2, q2, p1)\n    o4 = orientation(p2, q2, q1)\n    \n    // General case\n    if o1 != o2 and o3 != o4:\n        return True\n    \n    // Special cases for collinear points\n    return _______________\n```",
    "type": "FILL_BLANK",
    "categories": ["Geometry"],
    "options": ["onSegment(p1, p2, q1) or onSegment(p1, q2, q1) or onSegment(p2, p1, q2) or onSegment(p2, q1, q2)", "False", "True", "o1 == 0 or o2 == 0 or o3 == 0 or o4 == 0"],
    "answer": "onSegment(p1, p2, q1) or onSegment(p1, q2, q1) or onSegment(p2, p1, q2) or onSegment(p2, q1, q2)",
    "difficulty": "HARD"
  },
  {
    "text": "In computational geometry, what does the cross product of two 2D vectors represent?",
    "type": "MCQ",
    "categories": ["Geometry"],
    "options": ["Signed area of parallelogram", "Distance between points", "Angle between vectors", "Dot product"],
    "answer": "Signed area of parallelogram",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this closest pair of points divide and conquer:\n\n```\nfunction closestPair(points):\n    if length(points) <= 3:\n        return bruteForce(points)\n    \n    mid = length(points) // 2\n    midpoint = points[mid]\n    \n    left_points = points[0:mid]\n    right_points = points[mid:]\n    \n    left_min = closestPair(left_points)\n    right_min = closestPair(right_points)\n    \n    min_dist = min(left_min, right_min)\n    \n    // Find points in strip\n    strip = []\n    for point in points:\n        if abs(point[0] - midpoint[0]) < min_dist:\n            strip.append(point)\n    \n    // Sort strip by y-coordinate\n    strip.sort(key=lambda p: p[1])\n    \n    // Check points in strip\n    for i in range(length(strip)):\n        j = i + 1\n        while j < length(strip) and (strip[j][1] - strip[i][1]) < min_dist:\n            min_dist = min(min_dist, distance(strip[i], strip[j]))\n            j += 1\n    \n    return min_dist\n```\n\nWhat is the time complexity of this algorithm?",
    "type": "MCQ",
    "categories": ["Geometry", "DivideConquer"],
    "options": ["O(n log n)", "O(n²)", "O(n log² n)", "O(n)"],
    "answer": "O(n log n)",
    "difficulty": "HARD"
  },
  {
    "text": "What geometric property is used to optimize the strip checking in closest pair algorithm?",
    "type": "MCQ",
    "categories": ["Geometry"],
    "options": ["At most 7 points need to be checked", "Points are sorted by y-coordinate", "Strip width is 2*min_dist", "All points are in the strip"],
    "answer": "At most 7 points need to be checked",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this network flow Ford-Fulkerson implementation:\n\n```\nfunction maxFlow(graph, source, sink):\n    max_flow_value = 0\n    \n    while True:\n        parent = bfs(graph, source, sink)\n        if parent[sink] == -1:\n            break\n        \n        // Find minimum capacity along the path\n        path_flow = infinity\n        s = sink\n        while s != source:\n            path_flow = min(path_flow, graph[parent[s]][s])\n            s = parent[s]\n        \n        // Add path flow to overall flow\n        max_flow_value += path_flow\n        \n        // Update residual capacities\n        v = sink\n        while v != source:\n            u = parent[v]\n            graph[u][v] -= path_flow\n            _______________\n            v = parent[v]\n    \n    return max_flow_value\n```",
    "type": "FILL_BLANK",
    "categories": ["NetworkFlow"],
    "options": ["graph[v][u] += path_flow", "graph[v][u] -= path_flow", "graph[u][v] += path_flow", "graph[v][u] = path_flow"],
    "answer": "graph[v][u] += path_flow",
    "difficulty": "HARD"
  },
  {
    "text": "What is the time complexity of Ford-Fulkerson algorithm with BFS (Edmonds-Karp)?",
    "type": "MCQ",
    "categories": ["NetworkFlow"],
    "options": ["O(VE²)", "O(V²E)", "O(VE)", "O(V³)"],
    "answer": "O(VE²)",
    "difficulty": "HARD"
  },
  {
    "text": "In the min-cost max-flow problem, what additional constraint is added?",
    "type": "MCQ",
    "categories": ["NetworkFlow"],
    "options": ["Minimize cost among all maximum flows", "Minimize flow value", "Maximize cost", "Find any feasible flow"],
    "answer": "Minimize cost among all maximum flows",
    "difficulty": "MEDIUM"
  },
  {
    "text": "What does the max-flow min-cut theorem state?",
    "type": "MCQ",
    "categories": ["NetworkFlow"],
    "options": ["Maximum flow value equals minimum cut capacity", "Maximum flow is always equal to number of edges", "Minimum cut always goes through source", "Maximum flow is exponential in network size"],
    "answer": "Maximum flow value equals minimum cut capacity",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this bipartite matching using network flow:\n\n```\nLEFT_SET = [0, 1, 2]  // Left vertices\nRIGHT_SET = [3, 4, 5]  // Right vertices\nEDGES = [(0,3), (0,4), (1,4), (1,5), (2,5)]  // Bipartite edges\n\n// Create flow network\n// Add source connected to all left vertices (capacity 1)\n// Add all right vertices connected to sink (capacity 1)\n// Add bipartite edges (capacity 1)\n\nmax_matching = maxFlow(flow_network, source, sink)\n```\n\nWhat is the maximum matching size?",
    "type": "PREDICT_OUTPUT",
    "categories": ["NetworkFlow", "BipartiteMatching"],
    "options": ["3", "2", "5", "1"],
    "answer": "3",
    "difficulty": "MEDIUM"
  },
  {
    "text": "In Hungarian algorithm for assignment problem, what does the alternating path do?",
    "type": "MCQ",
    "categories": ["BipartiteMatching", "Hungarian"],
    "options": ["Increases matching size by 1", "Decreases total cost", "Finds minimum weight matching", "Creates augmenting path"],
    "answer": "Increases matching size by 1",
    "difficulty": "HARD"
  },
  {
    "text": "Complete this matrix exponentiation for Fibonacci:\n\n```\nfunction matrixPower(matrix, n):\n    if n == 0:\n        return identity_matrix\n    if n == 1:\n        return matrix\n    \n    if n % 2 == 0:\n        half = matrixPower(matrix, n // 2)\n        return multiply(half, half)\n    else:\n        _______________\n\nfunction fibonacci(n):\n    if n <= 1:\n        return n\n    \n    base_matrix = [[1, 1], [1, 0]]\n    result_matrix = matrixPower(base_matrix, n - 1)\n    return result_matrix[0][0]\n```",
    "type": "FILL_BLANK",
    "categories": ["MatrixExponentiation"],
    "options": ["return multiply(matrix, matrixPower(matrix, n - 1))", "return matrixPower(matrix, n - 1)", "return multiply(matrix, matrix)", "return identity_matrix"],
    "answer": "return multiply(matrix, matrixPower(matrix, n - 1))",
    "difficulty": "MEDIUM"
  },
  {
    "text": "What is the time complexity of computing the nth Fibonacci number using matrix exponentiation?",
    "type": "MCQ",
    "categories": ["MatrixExponentiation"],
    "options": ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
    "answer": "O(log n)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "In fast matrix exponentiation, why do we use the binary representation of the exponent?",
    "type": "MCQ",
    "categories": ["MatrixExponentiation"],
    "options": ["To reduce multiplications from O(n) to O(log n)", "To save memory", "To handle negative exponents", "To avoid overflow"],
    "answer": "To reduce multiplications from O(n) to O(log n)",
    "difficulty": "MEDIUM"
  },
  {
    "text": "Given this linear recurrence solved by matrix exponentiation:\n\n```\nRECURRENCE: f(n) = 2*f(n-1) + 3*f(n-2)\nBASE: f(0) = 1, f(1) = 1\n\nTRANSITION_MATRIX = [[2, 3], [1, 0]]\nINITIAL_VECTOR = [f(1), f(0)] = [1, 1]\n\n// To find f(n):\n// [f(n), f(n-1)] = TRANSITION_MATRIX^(n-1) * INITIAL_VECTOR\n```\n\nWhat is f(3)?",
    "type": "PREDICT_OUTPUT",
    "categories": ["MatrixExponentiation", "LinearRecurrence"],
    "options": ["11", "8", "5", "7"],
    "answer": "11",
    "difficulty": "HARD"
  }
];

// Combine existing and new questions
const allQuestions = [...existingQuestions, ...moreQuestions];

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

// Show category distribution too
const categoryDistribution = {};
allQuestions.forEach(q => {
  q.categories.forEach(cat => {
    categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
  });
});

console.log('Category Distribution:');
Object.entries(categoryDistribution)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));
