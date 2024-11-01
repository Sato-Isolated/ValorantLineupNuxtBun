import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const map = Array.isArray(query.map) ? query.map[0] : query.map;
  const agent = Array.isArray(query.agent) ? query.agent[0] : query.agent;

  if (typeof map !== 'string' || typeof agent !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
    });
  }

  const dirPath = path.join(process.cwd(), 'assets', 'lineup', map, agent);
  const filePath = path.join(dirPath, `${agent}.json`);

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const lineups = JSON.parse(data);
    const lastId = lineups.length > 0 ? lineups[lineups.length - 1].id : 0;
    return { lastId };
  } catch (error) {
    return { lastId: 0 };
  }
});