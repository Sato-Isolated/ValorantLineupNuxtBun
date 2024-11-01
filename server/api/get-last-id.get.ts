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
    // Lire le fichier JSON à chaque appel pour obtenir le dernier ID
    const data = await fs.readFile(filePath, 'utf-8');
    console.log('Contenu brut du fichier JSON:', data);

    const lineups = JSON.parse(data);
    console.log('Tableau des lineups après parsing:', lineups);

    const ids = lineups.map((lineup: { id: any; }) => lineup.id);
    console.log('IDs présents dans le fichier JSON:', ids);

    // Parcourir le fichier pour obtenir le dernier ID
    const lastId = lineups.reduce((maxId: number, lineup: { id: number; }) => Math.max(maxId, lineup.id), 0);
    console.log('Dernier ID trouvé:', lastId);

    return { lastId };
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier:', error);
    return { lastId: 0 };
  }
});
