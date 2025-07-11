/*
 * This script fetches data from LibGuides using the LibGuides API.
 * It retrieves search results for a list of terms defined in a configuration file.
 * Results are saved to individual JSON files for each term in the 'results' directory.
 */

// const config = require('config');
import config from 'config';
const libGuidesConfig = config.get('libGuides');
import LibGuidesAuth from './models/LibGuidesAuth.js';
const libGuidesAuth = new LibGuidesAuth(libGuidesConfig);
import LibGuidesSearch from './models/LibGuidesSearch.js';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the filename from config
const wordlistFile = config.get('wordListConfig'); // e.g., 'example.txt'

// Build full path to the file inside the config directory
const wordlistPath = path.join(__dirname, 'config', wordlistFile);

// Convert to file URL (required for dynamic import)
const wordlistUrl = pathToFileURL(wordlistPath);

// Dynamically import the module
const module = await import(wordlistUrl.href);

// Get the array (assuming it’s a default export)
const terms = module.default;

// retrieve results from libGuides and output to file

try {
  const token = await libGuidesAuth.getAuthToken();
  // console.log('LibGuides Auth Token:', token.access_token);
  for (const term of terms) {
    // console.log(`Searching LibGuides for term: ${term}`);
    const libGuidesSearch = new LibGuidesSearch(token.access_token);
    const searchResults = await libGuidesSearch.searchGuides(term, token);
    // output to file
    const resultsFile = `./cache/apiSearchResults/${term}_results.json`;
    fs.writeFileSync(resultsFile, JSON.stringify(searchResults, null, 2));
    console.log(`Results for term "${term}" saved to ${resultsFile}`);
  }
} catch (error) {
  console.error('Error in script:', error.message);
}
