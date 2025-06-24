const config = require('config');
const libGuidesConfig = config.get('libGuides');
const LibGuidesAuth = require('./models/LibGuidesAuth');
const libGuidesAuth = new LibGuidesAuth(libGuidesConfig);
const terms = require('./config/bad-words-jun-2025');
const LibGuidesSearch = require('./models/LibGuidesSearch');
const fs = require('fs');

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
