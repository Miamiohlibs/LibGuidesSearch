import { readFile } from 'fs/promises';

export default async function json2obj(filePathString) {
  const filePath = new URL(filePathString, import.meta.url);
  try {
    const fileContent = await readFile(filePath, { encoding: 'utf8' });
    const jsonObject = JSON.parse(fileContent);
    return jsonObject;
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
  }
}
