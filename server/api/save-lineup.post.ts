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
      // Fichier n'existe pas encore, continuer
    }
    lineups.push(data);
    await fs.writeFile(filePath, JSON.stringify(lineups, null, 2));
    return { message: 'File saved successfully' };
  } catch (error) {
    return { message: 'Error saving file', error };
  }
});