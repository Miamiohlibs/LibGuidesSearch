// runAllStages.js
const { spawn } = require('child_process');

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
  try {
    await runStage('Stage 1: Fetching data from the source URLs', 'node', [
      './stage1-fetchData.js',
    ]);
    await runStage('Stage 2: Collating data from the fetched files', 'node', [
      './stage2-collateData.js',
    ]);
    await runStage('Stage 3: Summarizing the collated data', 'node', [
      './stage3-summarizeData.js',
    ]);
    await runStage('Stage 4: Fetching guide contents', 'node', [
      './stage4-SLOW-fetchGuideContents.js',
    ]);
    await runStage('Generating the final report', 'node', [
      './generateReport.js',
    ]);
    console.log('\n✅ All stages completed successfully.');
  } catch (err) {
    process.exit(1);
  }
})();
