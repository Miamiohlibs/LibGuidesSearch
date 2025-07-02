const ReportController = require('./controllers/ReportController');
const json2csv = require('json2csv').parse;
let report = ReportController();
const fs = require('fs');
const path = require('path');
const outputPath = path.join(__dirname, 'output', 'libGuidesSearchReport.csv');
fs.writeFileSync(outputPath, json2csv(report.items), 'utf8');
console.log(`Report generated and saved to ${outputPath}`);
