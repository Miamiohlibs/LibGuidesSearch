const path = require('path');
const express = require('express');
const app = express();
const config = require('config');
const InspectController = require('./controllers/InspectController');
const querystring = require('querystring');
const { json } = require('stream/consumers');
const json2csv = require('json2csv').parse;
// basic express server setup
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const summary = require('./output/summary.json');

  res.render('index', {
    title: 'LibGuides Search Results',
    summary: summary,
    message: 'Check the console for detailed output.',
  });
});

app.get('/inspect', (req, res) => {
  res.redirect('/'); // Redirect to the main page if no ID is provided
});

app.get('/inspect/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const results = InspectController(id);
    // create url query string for the view
    const queryString = querystring.stringify(req.query);
    console.log(`Query String: ${queryString}`);
    if (JSON.stringify(req.query).includes('json')) {
      return res.send(results); // JSON response for API requests
    }
    results.queryString = queryString; // Add query string to results for the view
    res.render('inspect', results); // HTML display
  } catch (error) {
    console.error(`Error inspecting ID ${id}:`, error);
    return res.status(400).send('Entry not found or invalid ID');
  }
});

app.get('/report', (req, res) => {
  const summary = require('./output/summary.json');
  const ReportController = require('./controllers/ReportController');
  let report = ReportController();
  if (JSON.stringify(req.query).includes('json')) {
    return res.send(report); // JSON response for API requests
  }
  // default to CSV output
  const csv = json2csv(report.items);
  res.header('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=libGuidesSearchReport.csv'
  );
  res.send(csv); // Send CSV file as response
});

// Uncomment the following lines to run the server
const PORT = config.get('app.port') || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Go to http://localhost:${PORT}/`);
});
