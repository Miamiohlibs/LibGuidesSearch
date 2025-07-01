const config = require('config');
const libGuidesConfig = config.get('libGuides');
const LibGuidesAuth = require('./models/LibGuidesAuth');
const libGuidesAuth = new LibGuidesAuth(libGuidesConfig);
const LibGuidesSearch = require('./models/LibGuidesSearch');
const fs = require('fs');
const path = require('path');

// get wordlist from file specified in config
const wordlistFile = config.get('wordListConfig');
const wordlistPath = path.resolve(__dirname, 'config', wordlistFile);
if (!fs.existsSync(wordlistPath)) {
  console.error(`Wordlist file not found: ${wordlistPath}`);
  process.exit(1);
}
// wordlistFile is a javascript array of terms
const terms = require(wordlistPath);

// retrieve results from libGuides and output to file
(async () => {
  try {
    const token = await libGuidesAuth.getAuthToken();
    // console.log('LibGuides Auth Token:', token.access_token);
    for (const term of terms) {
      // console.log(`Searching LibGuides for term: ${term}`);
      const libGuidesSearch = new LibGuidesSearch(token.access_token);
      const searchResults = await libGuidesSearch.searchGuides(term, token);
      // output to file
      const resultsFile = `./results/${term}_results.json`;
      fs.writeFileSync(resultsFile, JSON.stringify(searchResults, null, 2));
      console.log(`Results for term "${term}" saved to ${resultsFile}`);
    }
  } catch (error) {
    console.error('Error in script:', error.message);
  }
})();
