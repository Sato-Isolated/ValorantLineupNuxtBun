import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { map, agent, data } = body;

  const dirPath = path.join(process.cwd(), 'assets', 'lineup', map);
  const filePath = path.join(dirPath, `${agent}.json`);

  try {
    await fs.mkdir(dirPath, { recursive: true });
    
    let lineups = [];
    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      lineups = JSON.parse(fileData);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Erreur lors de la lecture du fichier JSON:', error);
        return { message: 'Error reading file', error };
      }
    }

    lineups.push(data);
    await fs.writeFile(filePath, JSON.stringify(lineups, null, 2));
    return { message: 'File saved successfully' };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du fichier:', error instanceof Error ? error.message : error);
    return { message: 'Error saving file', error: error instanceof Error ? error.message : String(error) };
  }
});
