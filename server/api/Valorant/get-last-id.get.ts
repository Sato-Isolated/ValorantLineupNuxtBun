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

  const filePath = path.join(process.cwd(), 'assets', 'lineup', map, `${agent}.json`);

  try {
    // Lire le fichier JSON pour obtenir le dernier ID
    const data = await fs.readFile(filePath, 'utf-8');
    const lineups = JSON.parse(data);

    const lastId = lineups.reduce((maxId: number, lineup: { id: number }) => Math.max(maxId, lineup.id), 0);

    return { lastId };
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier JSON:', error);
    return { lastId: 0 };
  }
});
