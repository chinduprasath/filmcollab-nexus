const fs = require('fs');
let content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');

content = content.replace(
  `                        </div>
                      <div className="flex gap-2.5 pt-4 border-t">`,
  `                        </div>
                      </div>
                      <div className="flex gap-2.5 pt-4 border-t">`
);

fs.writeFileSync('src/pages/StudiosDirectory.tsx', content, 'utf8');
