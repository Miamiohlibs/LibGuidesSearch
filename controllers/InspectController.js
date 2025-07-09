const summary = require('../output/summary.json');
const fs = require('fs');
const path = require('path');
const filenamify = require('../helpers/filenamify-url');
const Kwic = require('../models/KeywordContext');
const kwic = new Kwic();

module.exports = InspectController = function InspectController(
  id,
  kwicChars = undefined
) {
  // find the requested item in the summary by id
  const item = summary.find((item) => parseInt(item.id) === parseInt(id));
  if (!item) {
    // console.log(summary);
    return res.status(404).send('Item not found');
  }

  // map the page URLs to cached filenames
  const filenames = item.page_urls.map((url) => {
    const filename = filenamify(url);
    return {
      url: url,
      filename: filename,
    };
  });

  // for each file, find keywords in context (KWIC)
  // and store the results in the file object

  filenames.forEach((file) => {
    const filePath = path.join(
      __dirname,
      '..',
      'cache',
      'libGuidesPages',
      file.filename
    );
    file.kwic = [];
    if (fs.existsSync(filePath)) {
      if (kwicChars != undefined) {
        kwic.setChars(kwicChars);
      }
      const content = fs.readFileSync(filePath, 'utf8'); // Store the content for further processing
      item.terms.forEach((term) => {
        let results = kwic.find(content, term); // Find the keyword context
        if (results.length > 0) {
          file.kwic.push(results); // Get KWIC context
        }
      });
    }
  });

  return { item, kwicChars: kwic.chars, results: filenames };
};
