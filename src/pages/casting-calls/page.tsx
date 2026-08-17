import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCastingCalls } from "@/hooks/use-casting-calls";
import { CastingCallCard } from "./components/CastingCallCard";
import { Filter, Search, Plus, MapPin, Briefcase, IndianRupee } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryDropdown } from "@/components/ui/category-dropdown";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export default function CastingCallsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { castingCalls } = useCastingCalls();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Basic Filter States
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [selectedCompensation, setSelectedCompensation] = useState<string>("all");
  const [ageRange, setAgeRange] = useState<number[]>([18, 60]);

  // Filter Logic
  const filteredCalls = castingCalls.filter(call => {
    if (showSavedOnly && user && !call.savedBy?.includes(user.id)) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!call.title.toLowerCase().includes(q) && 
          !call.projectName.toLowerCase().includes(q) &&
          !call.productionHouse.toLowerCase().includes(q) &&
          !call.castingDirector.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedCategory !== "all" && call.category !== selectedCategory) return false;
    if (selectedGender !== "all" && call.gender !== selectedGender && call.gender !== "Any") return false;
    if (selectedExperience !== "all" && call.experience !== selectedExperience && call.experience !== "Any") return false;
    if (selectedCompensation !== "all" && call.compensation !== selectedCompensation) return false;
    
    // Simplistic age range check
    if (call.ageRange[0] > ageRange[1] || call.ageRange[1] < ageRange[0]) return false;

    return true;
  });

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedGender("all");
    setSelectedExperience("all");
    setSelectedCompensation("all");
    setAgeRange([18, 60]);
    setSearchQuery("");
  };

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedGender, selectedExperience, selectedCompensation, ageRange, showSavedOnly]);

  const currentItems = filteredCalls.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <AppLayout pageTitle="Casting Calls">
      <div className="bg-gray-50/50 min-h-full">
        <div className="max-w-7xl mx-auto px-0 py-2 md:p-8">
          
          {/* Header Section */}
          <div className="flex flex-col mb-8 gap-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Casting Calls</h1>
                <p className="text-gray-500 mt-2 max-w-2xl text-sm leading-relaxed">
                  Discover the latest auditions and casting opportunities from filmmakers, production houses, agencies, and casting directors.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search casting calls..." 
                    className="pl-9 bg-white shadow-sm border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="bg-white shadow-sm gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Filter Casting Calls</SheetTitle>
                    </SheetHeader>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Category</Label>
                        <CategoryDropdown
                          value={selectedCategory === "all" ? "" : selectedCategory}
                          onChange={(val) => setSelectedCategory(val || "all")}
                          placeholder="All Categories"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Gender</Label>
                        <Select value={selectedGender} onValueChange={setSelectedGender}>
                          <SelectTrigger><SelectValue placeholder="All Genders" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Genders</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Transgender">Transgender</SelectItem>
                            <SelectItem value="Any">Any</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label>Age Range</Label>
                          <span className="text-xs text-muted-foreground">{ageRange[0]} - {ageRange[1] === 60 ? '60+' : ageRange[1]} yrs</span>
                        </div>
                        <Slider 
                          defaultValue={[18, 60]} 
                          max={60} 
                          min={0} 
                          step={1}
                          value={ageRange}
                          onValueChange={setAgeRange}
                          className="my-4"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Experience</Label>
                        <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                          <SelectTrigger><SelectValue placeholder="All Experience" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Experience</SelectItem>
                            <SelectItem value="Fresher">Fresher</SelectItem>
                            <SelectItem value="Experienced">Experienced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>Compensation</Label>
                        <Select value={selectedCompensation} onValueChange={setSelectedCompensation}>
                          <SelectTrigger><SelectValue placeholder="All Compensation Types" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Compensation</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Unpaid">Unpaid</SelectItem>
                            <SelectItem value="Revenue Share">Revenue Share</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <SheetFooter className="mt-8 flex gap-3 sm:justify-between">
                      <Button variant="outline" onClick={resetFilters} className="w-full">Reset</Button>
                      <SheetClose asChild>
                        <Button className="w-full">Apply Filters</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <Link to="/casting-calls/new">
                  <Button className="gap-2 shadow-sm whitespace-nowrap">
                    <Plus className="h-4 w-4" />
                    Post Casting Call
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Tabs in Next Line */}
            {user && (
              <div className="flex items-center bg-gray-100 rounded-lg p-1 w-fit mt-2">
                <button 
                  onClick={() => setShowSavedOnly(false)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${!showSavedOnly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  All Listings
                </button>
                <button 
                  onClick={() => setShowSavedOnly(true)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${showSavedOnly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Saved Casting Calls
                </button>
              </div>
            )}
          </div>
          <div className="space-y-8">
            {/* Listings */}
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {currentItems.map(call => (
                  <CastingCallCard key={call.id} call={call} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No casting calls found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  We couldn't find any casting calls matching your current filters. Try adjusting your search criteria.
                </p>
                <Button variant="outline" className="mt-6" onClick={resetFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 pt-8 pb-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
