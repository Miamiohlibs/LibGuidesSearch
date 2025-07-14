import json2obj from '../helpers/json2obj.js';
const summary = await json2obj('../output/summary.json');
import fs from 'fs';
import path from 'path';
import filenamify from 'filenamify-url';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Kwic from '../models/KeywordContext.js';
const kwic = new Kwic();

export default function InspectController(id, kwicChars = undefined) {
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
}
