import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import Results from './models/Results.js';
import { exit } from 'process';
import terms from './helpers/getWordlist.js';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outputFile = path.resolve(__dirname, 'output', 'results.json');

  // read from file and compile results
  // const Results = require('./models/Results');
  const results = new Results();

  terms.forEach((term) => {
    const resultsFile = `./cache/apiSearchResults/${term}_results.json`;
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

  //console.log(JSON.stringify(results.getResults(), null, 2));
  // write results to output file
  if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  }
  fs.writeFileSync(outputFile, JSON.stringify(results.getResults(), null, 2));
  console.log(`Results written to ${outputFile}`);
} catch (error) {
  console.error('Error during collating data:', error);
  exit(1);
}
