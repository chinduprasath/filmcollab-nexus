const fs = require('fs');
let content = fs.readFileSync('src/pages/StudiosDirectory.tsx', 'utf8');
const lines = content.split('\n');

const newCard = `                    {sortedCompanies.map(company => (
                      <Card key={company.id} className="border border-gray-200 hover:border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col bg-white">
                        {/* Card Cover Header */}
                        <div className="h-36 relative bg-gray-100 overflow-hidden">
                          <img src={company.coverImage} alt={company.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <Badge className="absolute top-3 right-3 bg-white/95 text-gray-900 border-none font-semibold text-[10px] hover:bg-white shadow-sm">
                            {company.category}
                          </Badge>
                          
                          {/* Floating Badges */}
                          <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5 w-full pr-4">
                            {company.verified && (
                              <Badge className="bg-green-500 text-white border-none py-0.5 px-1.5 text-[9px] flex items-center gap-0.5">
                                <ShieldCheck className="h-2.5 w-2.5" />
                                <span>Verified</span>
                              </Badge>
                            )}
                            {(company.hiringNow || company.jobs.length > 0) && (
                              <Badge className="bg-emerald-600 text-white border-none py-0.5 px-1.5 text-[9px]">
                                Hiring Now
                              </Badge>
                            )}
                            {(company.openAuditions || company.auditions.length > 0) && (
                              <Badge className="bg-orange-500 text-white border-none py-0.5 px-1.5 text-[9px]">
                                Auditions
                              </Badge>
                            )}
                            {(company.internshipsAvailable || company.internships.length > 0) && (
                              <Badge className="bg-purple-500 text-white border-none py-0.5 px-1.5 text-[9px]">
                                Internships
                              </Badge>
                            )}
                            {company.acceptingFreshers && (
                              <Badge className="bg-blue-500 text-white border-none py-0.5 px-1.5 text-[9px]">
                                Freshers
                              </Badge>
                            )}
                            {company.openForCollaboration && (
                              <Badge className="bg-pink-500 text-white border-none py-0.5 px-1.5 text-[9px]">
                                Collab
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Body details */}
                        <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              {/* Logo */}
                              <div className="h-10 w-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center font-bold text-gray-400 overflow-hidden border border-gray-100 text-sm">
                                {company.logo ? (company.logo.length <= 4 ? company.logo : <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />) : <Building2 className="h-5 w-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="font-extrabold text-gray-900 text-base hover:text-gray-600 cursor-pointer transition truncate" onClick={() => setViewingCompany(company)}>
                                    {company.name}
                                  </h3>
                                  <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 shrink-0">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{company.rating}</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{company.city}, {company.state}</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mt-3">{company.description}</p>
                          </div>

                          <div className="space-y-3 pt-2">
                            {/* Service Tags list */}
                            <div className="flex flex-wrap gap-1">
                              {company.services.slice(0, 3).map(service => (
                                <Badge key={service} variant="outline" className="text-[10px] text-gray-600 border-gray-200 bg-gray-50/50 py-0 px-1.5 h-5">
                                  {service}
                                </Badge>
                              ))}
                              {company.services.length > 3 && (
                                <Badge variant="outline" className="text-[10px] text-gray-400 border-gray-100 py-0 px-1.5 h-5">
                                  +{company.services.length - 3}
                                </Badge>
                              )}
                            </div>

                            {/* Languages */}
                            <div className="flex flex-wrap gap-1">
                               {company.languages.slice(0, 3).map(lang => (
                                 <span key={lang} className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{lang}</span>
                               ))}
                            </div>

                            {/* Mini properties row */}
                            <div className="flex justify-between items-center text-[10px] text-gray-500 border-t pt-3 border-gray-100">
                              <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {company.projectsCompleted} Projects</span>
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {company.employeeCount} Team</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date().getFullYear() - company.establishedYear} Yrs</span>
                            </div>
                          </div>
                        </CardContent>

                        {/* Actions */}
                        <CardFooter className="p-4 pt-0 gap-2 flex-wrap sm:flex-nowrap">
                          <Button
                            variant="default"
                            className="flex-1 text-xs h-9 bg-gray-900 text-white hover:bg-gray-800"
                            onClick={() => setViewingCompany(company)}
                          >
                            View Profile
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 text-xs h-9 border-gray-200"
                            onClick={() => {
                              setContactCompany(company);
                              setIsContactOpen(true);
                            }}
                          >
                            Contact
                          </Button>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 shrink-0 flex-1 sm:flex-none border-gray-200"
                              onClick={() => handleSave(company.id)}
                            >
                              <Bookmark className={\`h-4 w-4 \${savedIds.includes(company.id) ? "fill-current text-gray-900" : "text-gray-500"}\`} />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 shrink-0 flex-1 sm:flex-none border-gray-200"
                              onClick={() => handleShare(company)}
                            >
                              <Share2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
`.split('\n');

lines.splice(1832, 63, ...newCard);
fs.writeFileSync('src/pages/StudiosDirectory.tsx', lines.join('\n'), 'utf8');
