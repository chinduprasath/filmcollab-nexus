const fs = require('fs');
let content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');

content = content.replace(
  `                  </>
                )}
            )}
          </div>

        {/* DIALOGS & OVERLAY MODALS */}`,
  `                  </>
                )}
              </div>
            )}

        {/* DIALOGS & OVERLAY MODALS */}`
);

fs.writeFileSync('src/pages/StudiosDirectory.tsx', content, 'utf8');
