const terms = require('./config/bad-words-jun-2025');
const fs = require('fs');

// read from file and compile results
const Results = require('./models/Results');
const results = new Results();

terms.forEach((term) => {
  const resultsFile = `./results/${term}_results.json`;
  if (fs.existsSync(resultsFile)) {
    const searchResults = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
    searchResults.forEach((result) => {
      results.addResult(result, term);
    });
    // console.log(`Results for term "${term}" added to results object:`);
  } else {
    console.error(`Results file for term "${term}" does not exist.`);
  }
});

console.log(JSON.stringify(results.getResults(), null, 2));
