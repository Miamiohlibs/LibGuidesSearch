# LibGuidesSearch

LibGuidesSearch is a not-real-time search engine for LibGuides. It allows you to search across all guides (or maybe all published guides?) for many search terms at once.

If you just want to search for one or two terms, you can use LibGuides' own search functionality. This is for when you want to search for many terms at once. Inconveniently, part of the setup process involves downloading all the guide pages matching any of the search terms, so it is not a quick process to set up. I suggest running the setup overnight or during a time when you don't need to use the search engine.

## Usage

On the Linux command line, run: `fetchData.sh` -- Note: this will take a long time. It runs a succession of four Node and Bash scripts, which you can run individually if needed:

- `node ./stage1-fetchData.js`
- `node ./stage2-collateData.js`
- `./stage3-summarizeData.sh`
- `./stage4-LONG-fetchGuideContents.sh`

Stage 1 runs a LibGuides API search query for each search term, and saves the each result to a JSON file in `cache/apiSearchResults`. Stage 2 collates the results from all the search queries into a single file: `output/results.json`. Stage 3 summarizes the data in `output/summary.json` -- it includes the guide metadata, a list of terms found, and a list of all the page urls. Stage 4 fetches the full contents of each found guide and saves them in `cache/libGuidesPages`; this can take a long time depending on the number of guides.

Once the data have been harvested and process, run the web app with `node ./app.js`. This will start a web server on port 3000 (or another port specified in the `config/default.json` file).
