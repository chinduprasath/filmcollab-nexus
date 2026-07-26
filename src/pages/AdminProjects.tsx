import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  MoreVertical,
  Bell,
  Ban
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [editingTags, setEditingTags] = useState<{ id: string; tags: string[] } | null>(null);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Notification states
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [notifyUser, setNotifyUser] = useState<any | null>(null);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsRes, profilesRes] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, username, full_name, avatar_url")
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (profilesRes.error) throw profilesRes.error;

      setProjects(projectsRes.data || []);
      setProfiles(profilesRes.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error fetching data",
        description: "Failed to load projects from the database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
    switch (status?.toLowerCase()) {
      case "active":
      case "open":
        return Play;
      case "pending":
        return Clock;
      case "blocked":
      case "rejected":
        return Ban;
      default:
        return Clock;
    }
  };


  const handleUpdateStatus = async (projectId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", projectId);
      
      if (error) throw error;
      
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
      toast({
        title: "Status Updated",
        description: `Project status changed to ${newStatus}.`
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: "Could not update project status.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);
      
      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Project Deleted",
        description: "The project has been successfully removed."
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the project.",
        variant: "destructive"
      });
    }
  };

  const handleEditTags = (projectId: string, currentTags: string[]) => {
    setEditingTags({ id: projectId, tags: currentTags || [] });
  };

  const handleSaveProjectTags = async (projectId: string) => {
    if (!editingTags) return;
    try {
      const { error } = await supabase
        .from("projects")
        .update({ tags: editingTags.tags })
        .eq("id", projectId);
      
      if (error) throw error;
      
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, tags: editingTags.tags } : p));
      setEditingTags(null);
      toast({
        title: "Tags Updated",
        description: "Project tags have been successfully saved."
      });
    } catch (error) {
      console.error("Error updating tags:", error);
      toast({
        title: "Update Failed",
        description: "Could not save project tags.",
        variant: "destructive"
      });
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

  const handleOpenNotify = (project: any, creator: any) => {
    if (!creator) {
      toast({
        title: "Creator Not Found",
        description: "Cannot send notification. Creator profile is missing.",
        variant: "destructive"
      });
      return;
    }
    setNotifyUser(creator);
    setNotificationTitle(`Regarding your project: ${project.title}`);
    setNotificationMessage("");
    setIsNotifyDialogOpen(true);
  };

  const handleSendNotification = async () => {
    if (!notifyUser || !notificationTitle.trim() || !notificationMessage.trim()) return;
    try {
      setIsSendingNotification(true);
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: notifyUser.id,
          title: notificationTitle.trim(),
          description: notificationMessage.trim(),
          type: "system",
          priority: "high",
          status: "unread"
        });
        
      if (error) throw error;
      
      toast({
        title: "Notification Sent",
        description: `Successfully sent notification to ${notifyUser.username || notifyUser.full_name || 'the user'}.`
      });
      setIsNotifyDialogOpen(false);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Failed to send notification",
        description: "Could not write notification entry to database.",
        variant: "destructive"
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const creator = profiles.find(p => p.id === project.created_by) || {};
    const matchesSearch = 
      (project.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (creator.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (creator.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const projectType = project.project_type || project.category || "";
    const matchesCategory = categoryFilter === "all" || projectType.toLowerCase() === categoryFilter.toLowerCase();
    
    const status = project.status || "open";
    const matchesStatus = statusFilter === "all" || status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout pageTitle="Projects Management" pageName="Projects">
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
                      <SelectItem value="active">Active/Open</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading projects...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No projects found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : filteredProjects.map((project) => {
                    const status = project.status || "open";
                    const StatusIcon = getStatusIcon(status);
                    const creator = profiles.find(p => p.id === project.created_by) || {
                      full_name: "Unknown User",
                      username: "unknown",
                      avatar_url: ""
                    };
                    const projectTags = Array.isArray(project.tags) ? project.tags : [];
                    
                    return (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium text-xs font-mono">
                          {project.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{project.title}</span>
                            <span className="text-sm text-muted-foreground truncate max-w-[200px]">{project.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 whitespace-nowrap">
                            {project.project_type || project.category || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={creator.avatar_url} />
                              <AvatarFallback className="bg-yellow-100 text-yellow-600 text-xs">
                                {(creator.full_name || "U")[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate w-[100px]">{creator.full_name || "Unknown"}</span>
                              <span className="text-xs text-muted-foreground truncate w-[100px]">@{creator.username || "unknown"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(project.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(status)} className="flex items-center gap-1 w-fit capitalize">
                            <StatusIcon className="h-3 w-3" />
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {projectTags.slice(0, 2).map((tag: string, index: number) => (
                                <Badge 
                                  key={index}
                                  variant="secondary" 
                                  className={cn("text-[10px] px-1.5 py-0", getTagBadgeStyle(tag))}
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {projectTags.length > 2 && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-600">
                                  +{projectTags.length - 2}
                                </Badge>
                              )}
                            </div>
                            <Popover 
                              open={editingTags?.id === project.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  handleEditTags(project.id, projectTags);
                                } else {
                                  setEditingTags(null);
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-yellow-50"
                                >
                                  <Tags className="h-3.5 w-3.5 text-yellow-600" />
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">

                              <DropdownMenuItem onClick={() => handleOpenNotify(project, creator)}>
                                <Bell className="mr-2 h-4 w-4 text-blue-500" />
                                Notify Creator
                              </DropdownMenuItem>
                              
                              {status !== 'blocked' ? (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'blocked')}>
                                  <Ban className="mr-2 h-4 w-4 text-orange-500" />
                                  Block Project
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'open')}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Unblock Project
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600 focus:text-red-700"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
        
        {/* Notify Dialog */}
        <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
              <DialogDescription>
                Send a direct notification to {notifyUser?.full_name || notifyUser?.username || 'the creator'}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Notification title..."
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNotifyDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600" 
                onClick={handleSendNotification}
                disabled={isSendingNotification || !notificationTitle.trim() || !notificationMessage.trim()}
              >
                {isSendingNotification ? "Sending..." : "Send Notification"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
}
