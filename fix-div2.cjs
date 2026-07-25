const fs = require('fs');
let content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');

content = content.replace(
  `                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600">Recently Joined</label>
                            <Switch checked={filterRecentlyJoined} onCheckedChange={setFilterRecentlyJoined} />
                          </div>
                        </div>
                      <div className="flex gap-2.5 pt-4 border-t">`,
  `                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600">Recently Joined</label>
                            <Switch checked={filterRecentlyJoined} onCheckedChange={setFilterRecentlyJoined} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2.5 pt-4 border-t">`
);

fs.writeFileSync('src/pages/StudiosDirectory.tsx', content, 'utf8');
