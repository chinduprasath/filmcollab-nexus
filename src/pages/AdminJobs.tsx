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
  Check,
  Building2,
  MapPin
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminJobs() {
  // Available tags for jobs
  const availableTags = [
    { value: "featured", label: "Featured", color: "purple" },
    { value: "urgent", label: "Urgent", color: "red" },
    { value: "remote", label: "Remote", color: "blue" },
    { value: "full-time", label: "Full Time", color: "green" },
    { value: "part-time", label: "Part Time", color: "orange" },
    { value: "sponsored", label: "Sponsored", color: "yellow" }
  ];

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTags, setEditingTags] = useState<{ id: number; tags: string[] } | null>(null);

  // Mock jobs data
  const jobs = [
    {
      id: 1,
      title: "Cinematographer",
      description: "Experienced cinematographer needed for feature film",
      category: "Cinematography & Camera",
      location: "Los Angeles",
      date: "2024-03-12",
      status: "Active",
      creator: {
        id: 1,
        name: "Film Studio A",
        username: "filmstudioa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=filmstudioa",
        category: "Production Company"
      },
      tags: ["Featured", "Full Time", "Urgent"]
    },
    {
      id: 2,
      title: "Sound Engineer",
      description: "Sound engineer needed for post-production",
      category: "Music & Sound",
      location: "New York",
      date: "2024-03-11",
      status: "Pending",
      creator: {
        id: 2,
        name: "Production Co",
        username: "productionco",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=productionco",
        category: "Production House"
      },
      tags: ["Remote", "Part Time"]
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
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

  const handleViewJob = (jobId: number) => {
    console.log("View job:", jobId);
    // Implement view job functionality
  };

  const handleApproveJob = (jobId: number) => {
    console.log("Approve job:", jobId);
    // Implement approve job functionality
  };

  const handleRejectJob = (jobId: number) => {
    console.log("Reject job:", jobId);
    // Implement reject job functionality
  };

  const handleDeleteJob = (jobId: number) => {
    console.log("Delete job:", jobId);
    // Implement delete job functionality
  };

  const handleEditTags = (jobId: number, currentTags: string[]) => {
    setEditingTags({ id: jobId, tags: currentTags });
  };

  const handleSaveJobTags = (jobId: number) => {
    // Here you would typically make an API call to update the job's tags
    const jobToUpdate = jobs.find(j => j.id === jobId);
    if (jobToUpdate && editingTags) {
      jobToUpdate.tags = editingTags.tags;
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
    if (!tagConfig) return "";

    return ({
      purple: "bg-purple-50 text-purple-700 hover:bg-purple-100",
      red: "bg-red-50 text-red-700 hover:bg-red-100",
      blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      green: "bg-green-50 text-green-700 hover:bg-green-100",
      orange: "bg-orange-50 text-orange-700 hover:bg-orange-100",
      yellow: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
    }[tagConfig.color] || "");
  };

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || job.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout pageTitle="Jobs Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs Management</h1>
          <p className="text-muted-foreground mt-1">Approve or reject job listings</p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Jobs</CardTitle>
            <p className="text-muted-foreground">Review submitted job listings</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by title, description, company or location..."
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
                      <SelectItem value="cinematography">Cinematography & Camera</SelectItem>
                      <SelectItem value="music">Music & Sound</SelectItem>
                      <SelectItem value="editing">Editing & Post Production</SelectItem>
                      <SelectItem value="art">Art & Design</SelectItem>
                      <SelectItem value="production">Direction & Production</SelectItem>
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

            {/* Jobs Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Posted By</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => {
                    const StatusIcon = getStatusIcon(job.status);
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">#{job.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{job.title}</span>
                            <span className="text-sm text-muted-foreground truncate max-w-xs">{job.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                            {job.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{job.creator.name}</span>
                              <span className="text-xs text-muted-foreground">@{job.creator.username}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(job.status)} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-2 flex-1">
                              {job.tags.map((tag, index) => (
                                <Badge 
                                  key={index}
                                  variant="secondary" 
                                  className={getTagBadgeStyle(tag) || ""}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Popover 
                              open={editingTags?.id === job.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  handleEditTags(job.id, job.tags);
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
                                            className={getTagBadgeStyle(tag.label) || ""}
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
                                      onClick={() => handleSaveJobTags(job.id)}
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
                              onClick={() => handleViewJob(job.id)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {job.status === "Pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleApproveJob(job.id)}
                                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRejectJob(job.id)}
                                  className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteJob(job.id)}
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
              <span>Showing {jobs.length} jobs</span>
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
