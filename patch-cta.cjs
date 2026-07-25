const fs = require('fs');
let content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');
const lines = content.split('\n');

const ctaHtml = `
                {/* CTA Section */}
                <div className="mt-16 mb-8 bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center max-w-3xl mx-auto shadow-sm">
                  <Building2 className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Own a Film Industry Company?</h2>
                  <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                    Join FilmCollab's directory to get discovered by filmmakers, talent, and production houses looking for your services, equipment, or locations.
                  </p>
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white font-bold h-11 px-8" onClick={() => setIsRegisterOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Register Your Company
                  </Button>
                </div>`.split('\n').slice(1);

const endIdx = lines.findIndex((l, i) => i > 1950 && l.trim() === ')}' && lines[i-1].trim() === '</div>');

lines.splice(endIdx - 1, 0, ...ctaHtml);
fs.writeFileSync('src/pages/StudiosDirectory.tsx', lines.join('\n'), 'utf8');
