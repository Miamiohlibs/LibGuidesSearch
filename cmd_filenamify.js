const { execFile } = require('child_process');
const path = require('path');
const cliPath = path.resolve('/opt/homebrew/bin/filenamify');

function filenamify(input) {
  return new Promise((resolve, reject) => {
    execFile(cliPath, [input], (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve(stdout.trim());
    });
  });
}

module.exports = filenamify;
