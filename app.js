const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const filenamify = require('./cmd_filenamify');
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
  const filenames = item.page_urls.map(async (url) => {
    const filename = await filenamify(url);
    console.log(`URL: ${url}`);
    console.log(`Filename: ${filename}`);
    return {
      url: url,
      filename: filename,
    };
  });
  //   filenames.map((file) => {
  //     const filePath = path.join(__dirname, 'cache', file.filename);
  //     if (fs.existsSync(filePath)) {
  //       console.log(`File: ${file.filename} exists.`);
  //     }
  //     //   //   const content = fs.readFileSync(filePath, 'utf8');
  //   });
  res.send({ item, filenames });
  //   console.log(fileContents);
});

// Uncomment the following lines to run the server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Go to http://localhost:${PORT}/`);
});
