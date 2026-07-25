const fs = require('fs');
const lines = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8').split('\n');
console.log(lines.slice(1990, 2010).map((l, i) => `${i + 1991}: ${l}`).join('\n'));
