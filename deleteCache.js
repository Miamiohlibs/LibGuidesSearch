const fs = require('fs');
const path = require('path');
const cacheDir = 'cache/libGuidesPages';

fs.readdir(cacheDir, (err, files) => {
  if (err) {
    console.error(`Error reading cache directory: ${err.message}`);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(cacheDir, file);
    if (file == '.gitignore') {
      console.log(`Skipping .gitignore file: ${file}`);
      return;
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${file}: ${err.message}`);
      } else {
        console.log(`Deleted file: ${file}`);
      }
    });
  });
});
