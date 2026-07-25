const fs = require('fs');
let content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');

// Fix the sort logic
content = content.replace(
  `    if (sortBy === ecommended) return b.rating - a.rating; // Placeholder for recommended
    if (sortBy === popular) return b.reviewsCount - a.reviewsCount;
    if (sortBy === highest_rated) return b.rating - a.rating;
    if (sortBy === ecently_added) return b.establishedYear - a.establishedYear;
    if (sortBy === most_projects) return b.projectsCompleted - a.projectsCompleted;
    if (sortBy === most_followers) return b.followersCount - a.followersCount;
    if (sortBy === alphabetical) return a.name.localeCompare(b.name);`,
  `    if (sortBy === "recommended") return b.rating - a.rating; // Placeholder for recommended
    if (sortBy === "popular") return b.reviewsCount - a.reviewsCount;
    if (sortBy === "highest_rated") return b.rating - a.rating;
    if (sortBy === "recently_added") return b.establishedYear - a.establishedYear;
    if (sortBy === "most_projects") return b.projectsCompleted - a.projectsCompleted;
    if (sortBy === "most_followers") return b.followersCount - a.followersCount;
    if (sortBy === "alphabetical") return a.name.localeCompare(b.name);`
);

// Fix the rogue )}
content = content.replace(
  `              </div>
            )}
          </div>
        )}

        {/* DIALOGS & OVERLAY MODALS */}`,
  `              </div>
            )}
          </div>

        {/* DIALOGS & OVERLAY MODALS */}`
);

fs.writeFileSync('src/pages/StudiosDirectory.tsx', content, 'utf8');
