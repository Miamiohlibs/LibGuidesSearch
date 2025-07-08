// This script fetches the guide contents from the URLs listed in output/page_urls.txt
// Usage: node ./stage4-SLOW-fetchGuideContents.js
// reads input from output/page_urls.txt
// writes output to cache/libGuidesPages

const fs = require('fs/promises');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const filenamify = require('./helpers/filenamify-url');

const inputPath = 'output/page_urls.txt';
const cacheDir = 'cache/libGuidesPages';

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Request failed with status ${res.statusCode}`));
          res.resume(); // consume response data to free up memory
          return;
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

async function processUrls() {
  if (!(await fileExists(inputPath))) {
    console.error(`Input file ${inputPath} does not exist.`);
    process.exit(1);
  }

  ensureDir('cache');
  ensureDir(cacheDir);

  const content = await fs.readFile(inputPath, 'utf-8');
  const urls = content.split('\n').filter(Boolean);

  for (const url of urls) {
    let filename;
    try {
      filename = await filenamify(url);
    } catch (err) {
      console.error(`Failed to generate filename for ${url}: ${err.message}`);
      continue;
    }

    const filePath = path.join(cacheDir, filename);
    if (existsSync(filePath)) {
      console.log(`Content for ${url} already cached as ${filePath}`);
      continue;
    }

    try {
      const html = await fetch(url);
      await fs.writeFile(filePath, html);
      console.log(`Fetched content from ${url} and saved to ${filePath}`);
      await delay(500); // short delay
    } catch (err) {
      console.warn(`Failed to fetch content from ${url}: ${err.message}`);
      await delay(500);
      try {
        const html = await fetch(url);
        await fs.writeFile(filePath, html);
        console.log(
          `Fetched content from ${url} on second attempt and saved to ${filePath}`
        );
        await delay(500);
      } catch (err) {
        console.error(`Failed to fetch content from ${url} again. Skipping.`);
      }
    }
  }
}

processUrls();
