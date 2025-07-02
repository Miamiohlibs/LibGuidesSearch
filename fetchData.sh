#!/usr/bin/env bash

echo "Stage 1: Fetching data from the source URLs..."
/usr/bin/env node ./stage1-fetchData.js || { echo "Stage 1 failed. Aborting."; exit 1; }
echo

echo "Stage 2: Collating data from the fetched files..."
/usr/bin/env node ./stage2-collateData.js || { echo "Stage 2 failed. Aborting."; exit 1; }
echo

echo "Stage 3: Summarizing the collated data..."
./stage3-summarizeData.sh || { echo "Stage 3 failed. Aborting."; exit 1; }
echo

echo "Stage 4: Fetching guide contents..."
./stage4-SLOW-fetchGuideContents.sh || { echo "Stage 4 failed. Aborting."; exit 1; }
echo

echo "Generating the final report..."
/usr/bin/env node ./generateReport.js || { echo "Final report generation failed. Aborting."; exit 1; }
echo
