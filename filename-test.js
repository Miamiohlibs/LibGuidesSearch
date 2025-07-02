const filenamify = require('filenamify').default;

let input = 'https://example.com/some/path?query=string&another=value';
let output = filenamify(input);
console.log(output); // Outputs: example.com-some-path-query-string-another-value
