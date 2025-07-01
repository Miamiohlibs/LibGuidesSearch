const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const filenamify = require('./helpers/filenamify-url');
const Kwic = require('./models/KeywordContext');
const kwic = new Kwic();

// basic express server setup
// app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const summary = require('./output/summary.json');

  res.render('index', {
    title: 'LibGuides Search Results',
    summary: summary,
    message: 'Check the console for detailed output.',
  });
});

app.get('/inspect/:id', async (req, res) => {
  const id = req.params.id;
  const summary = require('./output/summary.json');

  const item = summary.find((item) => parseInt(item.id) === parseInt(id));
  if (!item) {
    console.log(summary);
    return res.status(404).send('Item not found');
  }
  const filenames = item.page_urls.map((url) => {
    const filename = filenamify(url);
    console.log(`URL: ${url}`);
    console.log(`Filename: ${filename}`);
    return {
      url: url,
      filename: filename,
    };
  });
  filenames.map((file) => {
    const filePath = path.join(__dirname, 'cache', file.filename);
    file.kwic = [];
    if (fs.existsSync(filePath)) {
      //   console.log(`File: ${file.filename} exists.`);
      content = fs.readFileSync(filePath, 'utf8'); // Store the content for further processing
      item.terms.forEach((term) => {
        console.log(`Searching for term: ${term}`);
        let results = kwic.find(content, term); // Find the keyword context
        if (results.length > 0) {
          file.kwic.push(results); // Get KWIC context
        }
      });
      //   file.content = content; // Store the content in the file object
    }
  });
  //   res.send({ item, results: filenames });
  res.render('inspect', { item, results: filenames });
  //   console.log(fileContents);
});

// Uncomment the following lines to run the server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Go to http://localhost:${PORT}/`);
});
