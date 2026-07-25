const fs = require('fs');
const content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1985, 2000).map((l, i) => `${i + 1986}: ${l}`).join('\n'));
