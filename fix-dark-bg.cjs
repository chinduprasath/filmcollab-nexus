const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  content = content.replace(/dark:bg-gray-950/g, 'dark:bg-background');
  content = content.replace(/dark:bg-gray-900/g, 'dark:bg-background');
  content = content.replace(/dark:bg-gray-800/g, 'dark:bg-background');
  content = content.replace(/dark:bg-zinc-950/g, 'dark:bg-background');
  content = content.replace(/dark:bg-zinc-900/g, 'dark:bg-background');
  
  // also let's check dark:bg-slate-900 etc just in case
  content = content.replace(/dark:bg-slate-950/g, 'dark:bg-background');
  content = content.replace(/dark:bg-slate-900/g, 'dark:bg-background');
  content = content.replace(/dark:bg-slate-800/g, 'dark:bg-background');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Updated', file);
  }
});

console.log(`Updated ${changedFiles} files.`);
