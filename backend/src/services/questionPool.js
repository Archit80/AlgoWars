import prisma from '../db/prismaClient.js';

// Random sample of question ids at a difficulty, optionally within one category.
async function sampleIds({ difficulty, category }, limit, excludeIds) {
  const take = limit + excludeIds.length;
  const rows = category
    ? await prisma.$queryRaw`
        SELECT id FROM "Question"
        WHERE difficulty::text = ${difficulty} AND ${category} = ANY(categories)
        ORDER BY random() LIMIT ${take};`
    : await prisma.$queryRaw`
        SELECT id FROM "Question"
        WHERE difficulty::text = ${difficulty}
        ORDER BY random() LIMIT ${take};`;
  return rows.map((r) => r.id).filter((id) => !excludeIds.includes(id)).slice(0, limit);
}

// Spread `count` random questions across `categories`. When a category runs short, top up from
// the other chosen categories; with `fillFromAnyCategory`, finally from the whole difficulty pool.
export async function pickQuestionIds({ categories, difficulty, count, fillFromAnyCategory = false }) {
  const picked = [];
  const perCategory = Math.max(1, Math.ceil(count / Math.max(1, categories.length)));

  for (const pass of [perCategory, count]) {
    for (const category of categories) {
      if (picked.length >= count) break;
      const limit = Math.min(pass, count - picked.length);
      picked.push(...(await sampleIds({ difficulty, category }, limit, picked)));
    }
  }
  if (fillFromAnyCategory && picked.length < count) {
    picked.push(...(await sampleIds({ difficulty, category: null }, count - picked.length, picked)));
  }
  return picked;
}
