import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Eye, 
  Trash2,
  CheckCircle,
  X,
  Clock,
  Play,
  Search,
  Tags,
  User,
  Check
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminProjects() {
  // Available tags for projects
  const availableTags = [
    { value: "featured", label: "Featured", color: "purple" },
    { value: "trending", label: "Trending", color: "orange" },
    { value: "hiring", label: "Hiring", color: "green" },
    { value: "urgent", label: "Urgent", color: "red" },
    { value: "sponsored", label: "Sponsored", color: "yellow" },
    { value: "collab", label: "Collab", color: "blue" }
  ];

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTags, setEditingTags] = useState<{ id: number; tags: string[] } | null>(null);

  // Mock projects data
  const projects = [
    {
      id: 1,
      title: "Indie Film Production",
      description: "Looking for crew members",
      category: "Feature Film",
      date: "2024-03-10",
      status: "Active",
      creator: {
        id: 1,
        name: "Michael Chen",
        username: "michael",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
        category: "Direction & Production"
      },
      tags: ["Featured", "Hiring", "Urgent"]
    },
    {
      id: 2,
      title: "Documentary Series",
      description: "Environmental awareness project",
      category: "Documentary",
      date: "2024-03-08",
      status: "Pending",
      creator: {
        id: 2,
        name: "Leo Martinez",
        username: "leo",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=leo",
        category: "Cinematography & Camera"
      },
      tags: ["Trending", "Collab"]
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "secondary";
      case "Pending":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return Play;
      case "Pending":
        return Clock;
      case "Rejected":
        return X;
      default:
        return Clock;
    }
  };

  const handleViewProject = (projectId: number) => {
    console.log("View project:", projectId);
    // Implement view project functionality
  };

  const handleApproveProject = (projectId: number) => {
    console.log("Approve project:", projectId);
    // Implement approve project functionality
  };

  const handleRejectProject = (projectId: number) => {
    console.log("Reject project:", projectId);
    // Implement reject project functionality
  };

  const handleDeleteProject = (projectId: number) => {
    console.log("Delete project:", projectId);
    // Implement delete project functionality
  };

  const handleEditTags = (projectId: number, currentTags: string[]) => {
    setEditingTags({ id: projectId, tags: currentTags });
  };

  const handleSaveProjectTags = (projectId: number) => {
    // Here you would typically make an API call to update the project's tags
    const projectToUpdate = projects.find(p => p.id === projectId);
    if (projectToUpdate && editingTags) {
      projectToUpdate.tags = editingTags.tags;
      setEditingTags(null);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (!editingTags) return;

    setEditingTags(current => {
      if (!current) return null;

      const newTags = current.tags.includes(tag)
        ? current.tags.filter(t => t !== tag)
        : [...current.tags, tag];

      return { ...current, tags: newTags };
    });
  };

  const getTagBadgeStyle = (tag: string): string => {
    const tagConfig = availableTags.find(t => t.label === tag);
    if (!tagConfig) return "bg-gray-50 text-gray-700 hover:bg-gray-100";

    const styles = {
      purple: "bg-purple-50 text-purple-700 hover:bg-purple-100",
      orange: "bg-orange-50 text-orange-700 hover:bg-orange-100",
      green: "bg-green-50 text-green-700 hover:bg-green-100",
      red: "bg-red-50 text-red-700 hover:bg-red-100",
      yellow: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
      blue: "bg-blue-50 text-blue-700 hover:bg-blue-100"
    };

    return styles[tagConfig.color] || "bg-gray-50 text-gray-700 hover:bg-gray-100";
  };

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.creator.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || project.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout pageTitle="Projects Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects Management</h1>
          <p className="text-muted-foreground mt-1">Approve or reject project listings</p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Projects</CardTitle>
            <p className="text-muted-foreground">Review submitted project listings</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by title, description or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Category:</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="feature film">Feature Film</SelectItem>
                      <SelectItem value="short film">Short Film</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                      <SelectItem value="web series">Web Series</SelectItem>
                      <SelectItem value="music video">Music Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Status:</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Projects Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const StatusIcon = getStatusIcon(project.status);
                    return (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">#{project.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{project.title}</span>
                            <span className="text-sm text-muted-foreground truncate max-w-xs">{project.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                            {project.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{project.creator.name}</span>
                              <span className="text-xs text-muted-foreground">@{project.creator.username}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{project.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(project.status)} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-2 flex-1">
                              {project.tags.map((tag, index) => (
                                <Badge 
                                  key={index}
                                  variant="secondary" 
                                  className={getTagBadgeStyle(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Popover 
                              open={editingTags?.id === project.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  handleEditTags(project.id, project.tags);
                                } else {
                                  setEditingTags(null);
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-yellow-50"
                                >
                                  <Tags className="h-4 w-4 text-yellow-600" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-0" align="end">
                                <Command>
                                  <CommandInput placeholder="Search tags..." />
                                  <CommandEmpty>No tags found.</CommandEmpty>
                                  <CommandGroup>
                                    {availableTags.map((tag) => {
                                      const isSelected = editingTags?.tags.includes(tag.label);
                                      return (
                                        <CommandItem
                                          key={tag.value}
                                          onSelect={() => handleTagToggle(tag.label)}
                                          className="flex items-center gap-2"
                                        >
                                          <div className={cn(
                                            "flex h-4 w-4 items-center justify-center rounded border",
                                            isSelected ? "bg-yellow-500 border-yellow-500" : "border-gray-200"
                                          )}>
                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                          </div>
                                          <Badge 
                                            variant="secondary"
                                            className={getTagBadgeStyle(tag.label)}
                                          >
                                            {tag.label}
                                          </Badge>
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                  <div className="border-t p-2">
                                    <Button
                                      size="sm"
                                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                      onClick={() => handleSaveProjectTags(project.id)}
                                    >
                                      Save Changes
                                    </Button>
                                  </div>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewProject(project.id)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {project.status === "Pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleApproveProject(project.id)}
                                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRejectProject(project.id)}
                                  className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProject(project.id)}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <span>Showing {projects.length} projects</span>
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select className="w-16 h-8 px-2 border rounded text-sm">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
