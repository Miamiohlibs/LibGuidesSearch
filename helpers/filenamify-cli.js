const filenamify = require('filenamify').default;

//get the filename from a command-line argument
let input = process.argv[2];
if (!input) {
  console.error('Please provide a string to filenamify.');
  process.exit(1);
}

// Remove http:// or https://
const httpRegex = /^https?:\/\//i;
input = input.replace(httpRegex, '');

// Convert the input string to a valid filename
const output = filenamify(input);

// Output the result
console.log(output);
