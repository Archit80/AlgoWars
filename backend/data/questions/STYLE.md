# Question bank style guide

The files in this folder are the source of truth for the question bank: one JSON array per
topic (`<Topic>.json`). Validate with `npm run questions:validate`, then load into the database
with `npm run questions:seed` (dry-run by default).

## Entry shape

```json
{
  "type": "PREDICT_OUTPUT",
  "difficulty": "MEDIUM",
  "categories": ["Graphs"],
  "text": "Pseudocode:\n```\n...\n```\nWhat does this print?",
  "options": ["...", "...", "...", "..."],
  "answer": "...",
  "verify": "python code (see below)"
}
```

- `type`: `MCQ` | `PREDICT_OUTPUT` | `FILL_BLANK`
- `difficulty`: `EASY` | `MEDIUM` | `HARD`
- `categories`: the file's topic first. Only topics the app offers (see `TOPICS` in the validator).
- `options`: exactly 4, distinct. `answer` must equal one of them exactly.
- Spread correct answers evenly across positions A-D within a file.

## Writing

- Python-flavoured pseudocode, 0-indexed: `def`, `if/elif/else`, `while`, `for x in ...`,
  `range`, `len`, lists, dicts, `//` for integer division. It should read as pseudocode and
  run as Python.
- Code goes in a ``` fence on its own lines, never flattened onto one line.
- Use `` `inline code` `` for identifiers and values in prose.
- Keep code short (about 3-15 lines). The question must be answerable in under a minute.
- Distractors are real mistakes: off-by-one, wrong traversal order, visiting a node twice,
  confusing BFS with DFS, forgetting a base case. Never joke options.
- Difficulty: EASY = one concept, small input. MEDIUM = trace a full algorithm or combine two
  ideas. HARD = subtle edge case, complexity reasoning, or a longer trace.
- Mix per difficulty: about 40% MCQ, 40% PREDICT_OUTPUT, 20% FILL_BLANK.

## `verify` (checked by the validator, never stored in the database)

- `PREDICT_OUTPUT` (required): Python that prints the output. Its stdout, trimmed, must equal
  `answer`, and no other option.
- `FILL_BLANK` (required): Python containing the token `__BLANK__` where the blank is. Each
  option is substituted in turn and the program run; it must print `OK` for the answer and
  must NOT print `OK` for any other option (exactly one option works).
- `MCQ` (optional): like `PREDICT_OUTPUT`; when present, its output must equal `answer`.
