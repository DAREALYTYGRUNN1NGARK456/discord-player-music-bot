const str = '\u00bd + \u00bc = \u00be';
const byteLength = Buffer.byteLength(str, 'utf8');
console.log(`${str}: ${str.length} characters, ${byteLength} bytes`);