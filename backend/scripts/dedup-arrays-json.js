/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET = path.resolve(__dirname, '../src/db/Arrays.json');
const BACKUP = path.resolve(__dirname, '../src/db/Arrays.backup.before_dedup.json');

function normalizeWhitespace(str) {
  return String(str).replace(/\s+/g, ' ').trim();
}

function ensureUniqueOptionsKeepAnswer(q) {
  if (!Array.isArray(q.options)) return q;
  const seen = new Set();
  const unique = [];
  for (const opt of q.options) {
    const s = String(opt);
    if (!seen.has(s)) {
      seen.add(s);
      unique.push(s);
    }
  }
  // Ensure exactly 4 options if possible without fabricating content: trim extras if >4
  let options = unique.slice(0, 4);
  // If answer is missing but exists in original options, try to re-add by swapping in last slot
  if (q.answer != null && !options.includes(q.answer) && unique.includes(q.answer)) {
    if (options.length === 4) {
      options[3] = q.answer;
    } else if (options.length < 4) {
      options.push(q.answer);
    }
  }
  return { ...q, options };
}

function main() {
  console.log('[dedup] reading', TARGET);
  const raw = fs.readFileSync(TARGET, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('[dedup] failed to parse Arrays.json:', e.message);
    process.exit(1);
  }
  if (!Array.isArray(data)) {
    console.error('[dedup] Arrays.json must be an array');
    process.exit(1);
  }

  const seenTexts = new Set();
  const deduped = [];
  for (const q of data) {
    if (!q || typeof q !== 'object') continue;
    const textKey = normalizeWhitespace(q.text || '');
    if (!textKey) continue;
    if (seenTexts.has(textKey)) continue;
    seenTexts.add(textKey);
    // Optionally clean minor issues on the kept item
    const cleaned = ensureUniqueOptionsKeepAnswer({ ...q, text: q.text });
    deduped.push(cleaned);
  }

  console.log(`[dedup] original count: ${data.length}`);
  console.log(`[dedup] deduped count:  ${deduped.length}`);

  // Backup once per run if not exists
  if (!fs.existsSync(BACKUP)) {
    fs.writeFileSync(BACKUP, raw);
    console.log('[dedup] backup written to', BACKUP);
  } else {
    console.log('[dedup] backup already exists at', BACKUP);
  }

  const formatted = JSON.stringify(deduped, null, 2) + '\n';
  fs.writeFileSync(TARGET, formatted, 'utf8');
  console.log('[dedup] wrote deduplicated Arrays.json');
}

main();


