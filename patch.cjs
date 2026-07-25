const fs = require('fs');
const content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');
const lines = content.split('\n');

const newFilters = `
                        {/* Company Size */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-600">Company Size (Crew count)</label>
                          <Select value={companySize} onValueChange={setCompanySize}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Any Size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Any Size</SelectItem>
                              <SelectItem value="small">Boutique / Small (Under 20 crew)</SelectItem>
                              <SelectItem value="medium">Mid-Size Studio (20 - 100 crew)</SelectItem>
                              <SelectItem value="large">Large Enterprise (100+ crew)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Years in Industry */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-600">Years in Industry</label>
                          <Select value={yearsInIndustry} onValueChange={setYearsInIndustry}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Any Years" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Any</SelectItem>
                              <SelectItem value="0-5">0 - 5 Years</SelectItem>
                              <SelectItem value="5-10">5 - 10 Years</SelectItem>
                              <SelectItem value="10+">10+ Years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Switch options */}
                        <div className="space-y-3.5 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600">Verified Companies Only</label>
                            <Switch checked={filterVerified} onCheckedChange={setFilterVerified} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600">Hiring Now</label>
                            <Switch checked={filterHiring} onCheckedChange={setFilterHiring} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600">Open Auditions</label>
                            <Switch checked={filterAuditions} onCheckedChange={setFilterAuditions} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600">Internships Available</label>
                            <Switch checked={filterInternships} onCheckedChange={setFilterInternships} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600">Accepting Freshers</label>
                            <Switch checked={filterFreshers} onCheckedChange={setFilterFreshers} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600">Open for Collaboration</label>
                            <Switch checked={filterCollab} onCheckedChange={setFilterCollab} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600">Recently Joined</label>
                            <Switch checked={filterRecentlyJoined} onCheckedChange={setFilterRecentlyJoined} />
                          </div>
                        </div>`.split('\n').slice(1);

lines.splice(1728, 38, ...newFilters);

fs.writeFileSync('src/pages/StudiosDirectory.tsx', lines.join('\n'), 'utf8');
