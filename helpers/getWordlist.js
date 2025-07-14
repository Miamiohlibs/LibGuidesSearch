import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import config from 'config';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the filename from config
const wordlistFile = config.get('wordListConfig'); // e.g., 'example.txt'

// Build full path to the file inside the config directory
const wordlistPath = path.join(__dirname, '..', 'config', wordlistFile);

// Convert to file URL (required for dynamic import)
const wordlistUrl = pathToFileURL(wordlistPath);

// Dynamically import the module
const module = await import(wordlistUrl.href);

// Get the array (assuming it’s a default export)
const terms = module.default;

export default terms;
