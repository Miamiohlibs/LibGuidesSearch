const filenamify = require('filenamify').default;

module.exports = function (input) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }
  const httpRegex = /^https?:\/\//i;
  input = input.replace(httpRegex, ''); // Remove http:// or https://
  return filenamify(input);
};
