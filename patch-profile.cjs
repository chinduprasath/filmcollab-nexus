const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const oldStats = `              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="text-sm text-gray-600 dark:text-zinc-400">
                  No. of connections: <span className="font-semibold text-gray-900 dark:text-zinc-100">{connectionsCount.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">
                  Projects created+joined: <span className="font-semibold text-gray-900 dark:text-zinc-100">{projectsCount.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">
                  No. of jobs joined: <span className="font-semibold text-gray-900 dark:text-zinc-100">{jobsJoinedCount.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">
                  Total profile likes: <span className="font-semibold text-gray-900 dark:text-zinc-100">{profileLikesCount.toLocaleString()}</span>
                </div>
              </div>`;

const newStats = `              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-zinc-400" title="Connections">
                  <Users className="w-4 h-4 text-gray-500 dark:text-zinc-500" />
                  <span className="font-semibold text-gray-900 dark:text-zinc-100">{connectionsCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-zinc-400" title="Projects created & joined">
                  <Briefcase className="w-4 h-4 text-gray-500 dark:text-zinc-500" />
                  <span className="font-semibold text-gray-900 dark:text-zinc-100">{projectsCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-zinc-400" title="Jobs joined">
                  <Building2 className="w-4 h-4 text-gray-500 dark:text-zinc-500" />
                  <span className="font-semibold text-gray-900 dark:text-zinc-100">{jobsJoinedCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-zinc-400" title="Total profile likes">
                  <Heart className="w-4 h-4 text-red-500 dark:text-red-400" />
                  <span className="font-semibold text-gray-900 dark:text-zinc-100">{profileLikesCount.toLocaleString()}</span>
                </div>
              </div>`;

content = content.replace(oldStats, newStats);
fs.writeFileSync('src/pages/Profile.tsx', content, 'utf8');
console.log('Profile updated successfully');
