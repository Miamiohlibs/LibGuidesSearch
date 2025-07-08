// summarize.js
const fs = require('fs/promises');
const path = require('path');

async function summarize() {
  const inputPath = 'output/results.json';
  const summaryPath = 'output/summary.json';
  const pageUrlsPath = 'output/page_urls.txt';

  // 1. Check if input file exists
  try {
    await fs.access(inputPath);
  } catch {
    console.error(`Input file ${inputPath} does not exist.`);
    process.exit(1);
  }

  // 2. Read and parse input JSON
  let data;
  try {
    const raw = await fs.readFile(inputPath, 'utf-8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read or parse ${inputPath}:`, err.message);
    process.exit(1);
  }

  // 3. Transform data like your jq expression
  const summary = data.map((item) => ({
    id: item.id,
    name: item.name,
    type_label: item.type_label,
    status_label: item.status_label,
    url: item.url,
    updated: item.updated,
    owner_name: `${item.owner?.first_name ?? ''} ${
      item.owner?.last_name ?? ''
    }`.trim(),
    owner_email: item.owner?.email ?? '',
    page_urls: (item.pages || []).map((p) => p.url),
    terms: item.terms,
  }));

  // 4. Write summary.json
  try {
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
  } catch (err) {
    console.error(`Failed to write ${summaryPath}:`, err.message);
    process.exit(1);
  }

  // 5. Extract and flatten page URLs
  const pageUrls = summary.flatMap((item) => item.page_urls || []);

  try {
    await fs.writeFile(pageUrlsPath, pageUrls.join('\n') + '\n');
  } catch (err) {
    console.error(`Failed to write ${pageUrlsPath}:`, err.message);
    process.exit(1);
  }

  console.log(
    `Data summarized successfully to ${summaryPath} and page URLs to ${pageUrlsPath}.`
  );
}

summarize();
