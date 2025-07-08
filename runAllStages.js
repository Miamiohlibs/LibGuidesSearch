// runAllStages.js
const { spawn } = require('child_process');

const stages = [
  {
    label: 'Stage 1: Fetching data from the source URLs',
    command: 'node',
    args: ['./stage1-fetchData.js'],
  },
  {
    label: 'Stage 2: Collating data from the fetched files',
    command: 'node',
    args: ['./stage2-collateData.js'],
  },
  {
    label: 'Stage 3: Summarizing the collated data',
    command: 'node',
    args: ['./stage3-summarizeData.js'],
  },
  {
    label: 'Stage 4: Fetching guide contents',
    command: 'node',
    args: ['./stage4-SLOW-fetchGuideContents.js'],
  },
  {
    label: 'Generating the final report',
    command: 'node',
    args: ['./stage5-generateReport.js'],
  },
];

function parseArgs() {
  const args = process.argv.slice(2);
  let startFrom = 1;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--start-from') {
      const val = parseInt(args[i + 1], 10);
      if (!isNaN(val) && val >= 1 && val <= stages.length) {
        startFrom = val;
        i++; // Skip next value since we already parsed it
      } else {
        console.error(`Invalid value for --start-from: ${args[i + 1]}`);
        process.exit(1);
      }
    }
  }

  return { startFrom };
}

function runStage(label, command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`\n${label}...`);
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`${label} failed with exit code ${code}. Aborting.`);
        reject(new Error(`${label} failed`));
      } else {
        resolve();
      }
    });
  });
}

(async () => {
  const { startFrom } = parseArgs();

  try {
    for (let i = startFrom - 1; i < stages.length; i++) {
      const { label, command, args } = stages[i];
      await runStage(label, command, args);
    }
    console.log('\n✅ All selected stages completed successfully.');
  } catch (err) {
    process.exit(1);
  }
})();
