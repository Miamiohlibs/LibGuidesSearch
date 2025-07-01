#!/usr/bin/env bash

/usr/bin/env node ./stage1-fetchData.js
/usr/bin/env node ./stage2-collateData.js
./stage3-summarizeData.sh
./stage4-LONG-fetchGuideContents.sh