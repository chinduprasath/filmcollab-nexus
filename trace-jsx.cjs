const fs = require('fs');
const content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
let stack = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Simplistic brace stack tracing
  for (let col = 0; col < line.length; col++) {
    const char = line[col];
    if (char === '{') {
      balance++;
      stack.push({ line: i + 1, col: col + 1, type: '{', text: line.trim().substring(0, 40) });
    } else if (char === '}') {
      balance--;
      const opened = stack.pop();
      if (balance < 0) {
        console.log(`Extra } found at line ${i + 1}:${col + 1}`);
      }
    }
  }
}

console.log("Current balance:", balance);
if (stack.length > 0) {
  console.log("Unclosed braces:");
  stack.forEach(s => {
    console.log(`Line ${s.line}: opened '${s.type}' at ${s.text}`);
  });
}
