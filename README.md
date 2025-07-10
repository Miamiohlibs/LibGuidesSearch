# LibGuidesSearch

LibGuidesSearch is a not-real-time search engine for LibGuides. It allows you to search across all guides (or maybe all published guides?) for many search terms at once.

If you just want to search for one or two terms, you can use LibGuides' own search functionality. This is for when you want to search for many terms at once. Inconveniently, part of the setup process involves downloading all the guide pages matching any of the search terms, so it is not a quick process to set up. I suggest running the setup overnight or during a time when you don't need to use the search engine.

## Requirements

To run this project on your own device, you will need the following:

- git [Installation instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- npm & Node.js (v20 or later) [Installation instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Mac, Windows, or Linux

Note: If you use Setup Option 1 below, you will not need to install anything on your own computer, as it will run in a GitHub Codespace (in the cloud).

## Setup

### Option 1: Use on GitHub Codespaces

1. Go to the [LibGuidesSearch repository](https://github.com/Miamiohlibs/LibGuidesSearch)
2. Click on the "Code" button and select "Open with Codespaces"
3. Follow the prompts to create a new Codespace
4. Follow steps 3-10 below to set up the configuration and run the search preparations
5. Once you run the `node ./app.js` command, the web app will be available at the URL provided in the terminal (usually something like `https://<your-codespace-name>-3000.preview.app.github.dev`)

### Option 2: Setup on your own computer

1. Clone the repository: `git clone https://github.com/Miamiohlibs/LibGuidesSearch.git`
2. Change into the directory: `cd LibGuidesSearch`
3. Install the dependencies: `npm install`
4. Create a `config/default.json` file with the following content:
   `cp config/default.json.example config/default.json`
5. Create API authentication credentials in LibGuides admin:
   - Go to Tools > API > Api Authentication
   - Click "Create New Application"
   - Give it the permissions for "Get list of Guides"
6. Edit the `config/default.json` file to set your LibGuides API clientId and clientSecret and any other configuration options you need.
7. Copy the `config/sample-wordlist.js` to another file, e.g. `config/wordlist.js`, and edit it to include the search terms you want to use. The sample file includes a few example terms, but you can add as many as you like. Each term should be a string in the array. Update the `config/default.json` file's `wordListConfig` value to point to your wordlist file if you named it something other than `sample-wordlist.js`.
8. On the Linux/Mac command line run: `node runAllStages.js` to fetch and process the data. This will take a long time (maybe 15 minutes), as it runs a succession of scripts to fetch and process the data.
9. At this point, you should have a `public/docs/libGuidesSearchReport.csv` file that contains a report of the search results.
10. You can now run the web app with `node ./app.js` to start the search engine. By default it will run on port 3000 on your own machine; you can change the port in the `config/default.json` file.

## Usage

On the Linux command line, run: `node runAllStages.js` -- Note: this will take a long time. It runs a succession of four Node and Bash scripts, which you can run individually if needed:

- `node ./stage1-fetchData.js`
- `node ./stage2-collateData.js`
- `node ./stage3-summarizeData.js`
- `node ./stage4-SLOW-fetchGuideContents.js`
- `node ./stage5-generateReport.js`

Stage 1 runs a LibGuides API search query for each search term, and saves the each result to a JSON file in `cache/apiSearchResults`. Stage 2 collates the results from all the search queries into a single file: `output/results.json`. Stage 3 summarizes the data in `output/summary.json` -- it includes the guide metadata, a list of terms found, and a list of all the page urls. Stage 4 fetches the full contents of each found guide and saves them in `cache/libGuidesPages`; this can take a long time depending on the number of guides. Stage 5 generates a report in CSV format from the summary data and saves it in `public/docs/libGuidesSearchReport.csv`.

Note: for Stage 4, the script only fetches the contents if the cached file does not already exist. If you want to re-fetch the contents, you can delete the `cache/libGuidesPages` directory and run the script again. This saves time if you are running the script multiple times, as it will not re-fetch the contents of guides that have already been fetched. To delete the cache, you can run `node ./deleteCache.js` to remove the cache directory and start fresh.

You can skip one or more stages by running `node ./runAllStages.js --start-from 3` to start from stage 3, for example. This is useful if you have already run the previous stages and just want to re-run from a specific stage. You can also run the stages individually, for example `node ./stage1-fetchData.js` to just run the first stage.

Once the data have been harvested and process, run the web app with `node ./app.js`. This will start a web server on port 3000 (or another port specified in the `config/default.json` file).

## Credits

- Developed at [Miami University Libraries](https://www.lib.miamioh.edu/) by Ken Irwin
