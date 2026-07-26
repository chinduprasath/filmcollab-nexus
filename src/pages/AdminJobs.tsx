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
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTags, setEditingTags] = useState<{ id: string; tags: string[] } | null>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          creator:profiles(id, full_name, username, avatar_url, role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs from database.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleViewJob = (jobId: string) => {
    window.open(`/jobs/${jobId}`, '_blank');
  };

  const handleApproveJob = async (jobId: string) => {
    try {
      await supabase.from("jobs").update({ status: "Active" }).eq("id", jobId);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "Active" } : j));
      toast({ title: "Job approved" });
    } catch (e) {}
  };

  const handleRejectJob = async (jobId: string) => {
    try {
      await supabase.from("jobs").update({ status: "Rejected" }).eq("id", jobId);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "Rejected" } : j));
      toast({ title: "Job rejected" });
    } catch (e) {}
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await supabase.from("jobs").delete().eq("id", jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast({ title: "Job deleted" });
    } catch (e) {}
  };

  const handleEditTags = (jobId: string, currentTags: string[]) => {
    setEditingTags({ id: jobId, tags: currentTags || [] });
  };

  const handleSaveJobTags = async (jobId: string) => {
    try {
      if (!editingTags) return;
      const { error } = await supabase.from('jobs').update({ skills_required: editingTags.tags }).eq('id', jobId);
      if (error) throw error;
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, skills_required: editingTags.tags } : j));
      setEditingTags(null);
      toast({ title: "Tags updated" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
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
    const title = job.job_title || "";
    const desc = job.job_description || "";
    const comp = job.company_name || "";
    const loc = job.location || "";
    
    const matchesSearch = 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || (job.industry || "").toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || (job.status || "Active").toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout pageTitle="Jobs Management" pageName="Jobs">
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
                  {isLoading ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-8">Loading jobs...</TableCell></TableRow>
                  ) : filteredJobs.map((job) => {
                    const StatusIcon = getStatusIcon(job.status || "Active");
                    const jobTags = Array.isArray(job.skills_required) ? job.skills_required : [];
                    const creatorName = job.creator?.full_name || job.company_name || "Unknown";
                    const creatorUsername = job.creator?.username || "";
                    
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          <span className="truncate w-16 block" title={job.id}>{job.id.substring(0, 8)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{job.job_title}</span>
                            <span className="text-sm text-muted-foreground truncate max-w-xs">{job.job_description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                            {job.industry || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{creatorName}</span>
                              {creatorUsername && <span className="text-xs text-muted-foreground">@{creatorUsername}</span>}
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
                          <Badge variant={getStatusBadgeVariant(job.status || "Active")} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {job.status || "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-2 flex-1">
                              {jobTags.map((tag: string, index: number) => (
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
                                  handleEditTags(job.id, jobTags);
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
                            
                            {(!job.status || job.status === "Pending") && (
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
