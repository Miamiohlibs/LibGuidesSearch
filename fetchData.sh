#!/usr/bin/env bash

echo "Stage 1: Fetching data from the source URLs..."
/usr/bin/env node ./stage1-fetchData.js
echo
echo "Stage 2: Collating data from the fetched files..."
/usr/bin/env node ./stage2-collateData.js
echo
echo "Stage 3: Summarizing the collated data..."
./stage3-summarizeData.sh
echo
echo "Stage 4: Fetching guide contents..."
./stage4-LONG-fetchGuideContents.sh