"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  Search, Filter, MapPin, Calendar, Clock, Users, Heart, Share2, Plus, Eye, UserPlus, 
  ExternalLink, ChevronDown, ChevronUp, X, Film, Video, Music, Camera, Mic, Palette, 
  Scissors, Building2, Star, TrendingUp, CheckCircle, Play, Pause, Award, Target, Zap, Bookmark, Edit
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  industry: string;
  type: string;
  status: "Ongoing" | "Completed" | "Planning" | "Post-Production";
  location: string;
  createdDate: string;
  description: string;
  tagline: string;
  teamMembers: { id: number; name: string; role: string; avatar: string; }[];
  rolesRequired: { role: string; description: string; isOpen: boolean; }[];
  budget: string;
  duration: string;
  genre: string;
  featured: boolean;
  popular: boolean;
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [savedProjects, setSavedProjects] = useState<number[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<number[]>([1]); // Sample joined project
  const [createdProjects, setCreatedProjects] = useState<number[]>([2]); // Sample created project
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const allProjects: Project[] = [
    {
      id: 1,
      title: "The Silent Echo",
      industry: "Film",
      type: "Feature Film",
      status: "Ongoing",
      location: "Los Angeles, CA",
      createdDate: "2024-12-10",
      description: "A psychological thriller about a detective who discovers that the victims of a serial killer are all connected to a mysterious radio frequency that only he can hear.",
      tagline: "Some voices should never be heard",
      teamMembers: [
        { id: 1, name: "Sarah Johnson", role: "Director", avatar: "SJ" },
        { id: 2, name: "Michael Chen", role: "Cinematographer", avatar: "MC" }
      ],
      rolesRequired: [
        { role: "Lead Actor", description: "Male, 35-45, intense dramatic presence", isOpen: true },
        { role: "Sound Designer", description: "Experience with psychological thrillers", isOpen: true }
      ],
      budget: "₹2.5Cr - ₹3.5Cr",
      duration: "120 minutes",
      genre: "Thriller",
      featured: true,
      popular: true
    },
    {
      id: 2,
      title: "Urban Dreams",
      industry: "Television",
      type: "Web Series",
      status: "Planning",
      location: "New York, NY",
      createdDate: "2024-12-08",
      description: "A coming-of-age story following four friends navigating life, love, and career aspirations in the bustling city of New York.",
      tagline: "Dreams don't sleep in the city that never sleeps",
      teamMembers: [
        { id: 4, name: "David Kim", role: "Showrunner", avatar: "DK" }
      ],
      rolesRequired: [
        { role: "Casting Director", description: "Experience with young adult casting", isOpen: true }
      ],
      budget: "₹1.8Cr - ₹2.5Cr",
      duration: "8 episodes",
      genre: "Drama",
      featured: false,
      popular: true
    }
  ];

  const industries = ["all", "Film", "Television", "Music", "Documentary", "Animation", "Theater"];
  const projectTypes = ["all", "Feature Film", "Short Film", "Web Series", "Music Video", "Documentary"];
  const statuses = ["all", "Planning", "Ongoing", "Post-Production", "Completed"];
  const locations = ["all", "Los Angeles, CA", "New York, NY", "Miami, FL", "San Francisco, CA"];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "featured", label: "Featured" }
  ];

  const getProjectsByTab = () => {
    switch (activeTab) {
      case "joined":
        return allProjects.filter(project => joinedProjects.includes(project.id));
      case "created":
        return allProjects.filter(project => createdProjects.includes(project.id));
      default:
        return allProjects;
    }
  };

  const filteredProjects = getProjectsByTab().filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "all" || project.industry === selectedIndustry;
    const matchesType = selectedType === "all" || project.type === selectedType;
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    const matchesLocation = selectedLocation === "all" || project.location === selectedLocation;
    
    return matchesSearch && matchesIndustry && matchesType && matchesStatus && matchesLocation;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest": return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case "oldest": return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      case "popular": return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      case "featured": return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default: return 0;
    }
  });

  const toggleSavedProject = (projectId: number) => {
    setSavedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getDaysAgo = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing": return "bg-blue-500";
      case "Completed": return "bg-green-500";
      case "Planning": return "bg-yellow-500";
      case "Post-Production": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const clearFilters = () => {
    setSelectedIndustry("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedLocation("all");
    setSortBy("newest");
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  return (
    <AppLayout>
      <div className="space-y-4 bg-gray-50 min-h-screen p-4 -m-4">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Projects</h1>
              <p className="text-gray-600 text-sm">
                Discover and collaborate on film and entertainment projects
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateProject(true)}
                className="h-9 px-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Project
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects, titles, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 text-sm"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 h-9 px-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-lg text-xs bg-white focus:border-purple-500 focus:ring-purple-500 h-8"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-gray-200 px-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-3 border-b-2 font-medium transition-colors flex items-center text-sm ${
                activeTab === "all"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              All Projects
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                {allProjects.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("joined")}
              className={`px-4 py-3 border-b-2 font-medium transition-colors flex items-center text-sm ${
                activeTab === "joined"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Joined
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                {joinedProjects.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("created")}
              className={`px-4 py-3 border-b-2 font-medium transition-colors flex items-center text-sm ${
                activeTab === "created"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Created
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                {createdProjects.length}
              </span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-xs text-gray-600">
            Showing {filteredProjects.length} of {getProjectsByTab().length} projects
          </p>
        </div>

        <div className="flex gap-4">
          {/* Projects Grid */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className={`hover:shadow-lg transition-shadow border-gray-200 rounded-lg ${project.featured ? 'ring-2 ring-purple-200' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-base font-semibold text-gray-900 hover:text-purple-600 cursor-pointer line-clamp-1">
                            {project.title}
                          </CardTitle>
                          {project.featured && (
                            <Badge variant="default" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {project.popular && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Film className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">{project.industry}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{project.type}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                          <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                            {project.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{project.location}</span>
                          </div>
                        </div>

                        <CardDescription className="text-xs text-gray-600 line-clamp-2">
                          {project.tagline}
                        </CardDescription>
                      </div>

                      <div className="flex flex-col gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSavedProject(project.id)}
                          className={`h-7 w-7 p-0 ${savedProjects.includes(project.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          <Heart className={`w-3 h-3 ${savedProjects.includes(project.id) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{project.teamMembers.length} team members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{getDaysAgo(project.createdDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Budget: {project.budget}</span>
                        <span>{project.duration}</span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs h-8" 
                          onClick={() => openProjectDetails(project)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        {activeTab === "all" && !joinedProjects.includes(project.id) && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => setJoinedProjects(prev => [...prev, project.id])}
                          >
                            <UserPlus className="w-3 h-3" />
                          </Button>
                        )}
                        {activeTab === "joined" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => setJoinedProjects(prev => prev.filter(id => id !== project.id))}
                          >
                            Leave Project
                          </Button>
                        )}
                        {activeTab === "created" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>

              {/* No Results */}
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">No projects found</h3>
                  <p className="text-gray-600 mb-4">
                    Start by creating or joining one
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      setSearchQuery("");
                      clearFilters();
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Filter Panel */}
          {showFilters && (
            <div className="w-80 bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Industry</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-purple-500 focus:ring-purple-500"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry === "all" ? "All Industries" : industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Project Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-purple-500 focus:ring-purple-500"
                  >
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-purple-500 focus:ring-purple-500"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "all" ? "All Statuses" : status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-purple-500 focus:ring-purple-500"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location === "all" ? "All Locations" : location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Details Popup */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">{selectedProject.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowProjectDetails(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedProject.industry}</Badge>
                      <Badge variant="outline">{selectedProject.type}</Badge>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedProject.status)}`}></div>
                      <Badge variant="outline">{selectedProject.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedProject.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Budget: {selectedProject.budget}</span>
                      <span>Duration: {selectedProject.duration}</span>
                      <span>Genre: {selectedProject.genre}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tagline</h3>
                  <p className="text-lg italic text-muted-foreground">"{selectedProject.tagline}"</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedProject.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Team Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Roles Required</h3>
                  <div className="space-y-3">
                    {selectedProject.rolesRequired.map((role, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${role.isOpen ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-950/20'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{role.role}</h4>
                          <Badge variant={role.isOpen ? "default" : "secondary"}>
                            {role.isOpen ? "Open" : "Filled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                        {role.isOpen && (
                          <Button size="sm" className="mt-2">
                            <UserPlus className="w-3 h-3 mr-1" />
                            Apply for Role
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Project
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Popup */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Create New Project</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateProject(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Project Title *</label>
                    <Input placeholder="e.g., The Silent Echo" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Industry *</label>
                    <select className="w-full px-2 py-1 border border-border rounded-md text-xs bg-background h-8">
                      <option>Select Industry</option>
                      {industries.slice(1).map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Project Type *</label>
                    <select className="w-full px-2 py-1 border border-border rounded-md text-xs bg-background h-8">
                      <option>Select Project Type</option>
                      {projectTypes.slice(1).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Status *</label>
                    <select className="w-full px-2 py-1 border border-border rounded-md text-xs bg-background h-8">
                      <option>Select Status</option>
                      {statuses.slice(1).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Location *</label>
                    <Input placeholder="e.g., Los Angeles, CA" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Budget Range</label>
                    <Input placeholder="e.g., ₹2.5Cr - ₹3.5Cr" className="h-8 text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Tagline *</label>
                  <Input placeholder="A compelling one-line description" className="h-8 text-sm" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Project Description *</label>
                  <textarea 
                    className="w-full px-2 py-1 border border-border rounded-md text-xs bg-background min-h-[80px]"
                    placeholder="Describe your project, its vision, and what you're looking for..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 h-8 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Create Project
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateProject(false)} className="h-8 text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
