/*
 * This script fetches data from LibGuides using the LibGuides API.
 * It retrieves search results for a list of terms defined in a configuration file.
 * Results are saved to individual JSON files for each term in the 'results' directory.
 */

import config from 'config';
const libGuidesConfig = config.get('libGuides');
import LibGuidesAuth from './models/LibGuidesAuth.js';
const libGuidesAuth = new LibGuidesAuth(libGuidesConfig);
import LibGuidesSearch from './models/LibGuidesSearch.js';
import terms from './helpers/getWordlist.js';
import fs from 'fs';

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
