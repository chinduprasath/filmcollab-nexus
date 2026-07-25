const fs = require('fs');
let content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');

content = content.replace(
  `                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`,
  `                ) : (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`
);

content = content.replace(
  `                    Register Your Company
                  </Button>
                </div>
                  </div>
                )}`,
  `                    Register Your Company
                  </Button>
                </div>
                  </>
                )}`
);

fs.writeFileSync('src/pages/StudiosDirectory.tsx', content, 'utf8');
