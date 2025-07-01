const path = require('path');
const express = require('express');
const app = express();
const config = require('config');
const InspectController = require('./controllers/InspectController');

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
  const controller = new InspectController();
  const results = controller.inspect(req, res);
  if (JSON.stringify(req.query).includes('json')) {
    return res.send(results); // JSON response for API requests
  }
  res.render('inspect', results); // HTML display
});

// Uncomment the following lines to run the server
const PORT = config.get('app.port') || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Go to http://localhost:${PORT}/`);
});
