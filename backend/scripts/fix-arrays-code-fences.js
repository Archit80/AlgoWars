/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET = path.resolve(__dirname, '../src/db/Arrays.json');

function replaceSingleBackticksWithTriple(content) {
  // Protect existing triple backtick blocks by temporary placeholders
  const blocks = [];
  const protectedText = content.replace(/```[\s\S]*?```/g, (m) => {
    blocks.push(m);
    return `__TRIPLE_BLOCK_${blocks.length - 1}__`;
  });

  // Replace single-backtick inline code spans with triple backticks (no extra newlines to keep it compact)
  // Use a conservative regex: a single backtick delimited segment that does not contain backticks inside
  let replaced = protectedText.replace(/(^|[^`])`([^`]+)`([^`]|$)/g, (match, p1, code, p3) => {
    return `${p1}\`\`\`${code}\`\`\`${p3}`;
  });

  // Restore triple backtick blocks
  replaced = replaced.replace(/__TRIPLE_BLOCK_(\d+)__/g, (_, idx) => blocks[Number(idx)]);
  return replaced;
}

function main() {
  const raw = fs.readFileSync(TARGET, 'utf8');
  let data = null;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse Arrays.json:', e.message);
    process.exit(1);
  }
  if (!Array.isArray(data)) {
    console.error('Arrays.json must be a JSON array');
    process.exit(1);
  }

  let changes = 0;
  for (const q of data) {
    if (q && typeof q.text === 'string' && q.text.includes('`')) {
      const updated = replaceSingleBackticksWithTriple(q.text);
      if (updated !== q.text) {
        q.text = updated;
        changes += 1;
      }
    }
  }

  fs.writeFileSync(TARGET, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${changes} questions with triple backtick code fences.`);
}

main();


