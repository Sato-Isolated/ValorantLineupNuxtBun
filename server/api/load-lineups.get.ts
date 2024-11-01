// load-lineups.get.ts
import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const agent = Array.isArray(query.agent) ? query.agent[0] : query.agent;
  const map = Array.isArray(query.map) ? query.map[0] : query.map;
  const type = Array.isArray(query.type) ? query.type[0] : query.type;

  if (!agent || typeof agent !== 'string' || !map || typeof map !== 'string' || !type || typeof type !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
    });
  }

  const filePath = path.join(process.cwd(), 'assets', 'lineup', map, `${agent}.json`);

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data); // Ensure the data is parsed as JSON
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error loading lineups',
    });
  }
});