import ReportController from './controllers/ReportController.js';
import { parse } from 'json2csv';

import fs from 'fs';
let report = ReportController();
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(
  __dirname,
  'public',
  'docs',
  'libGuidesSearchReport.csv'
);
fs.writeFileSync(outputPath, parse(report.items), 'utf8');
console.log(`Report generated and saved to ${outputPath}`);
