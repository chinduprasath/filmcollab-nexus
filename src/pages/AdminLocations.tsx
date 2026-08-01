import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Search,
  MoreVertical,
  Trash2,
  Bell,
  Ban,
  Plus,
  Tag,
  Tags,
  Check,
  Edit2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const getTagBadgeStyle = (tag: string) => {
  switch (tag) {
    case "Verified": return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
    case "Popular": return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
    case "Featured": return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
    case "Trending": return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
    case "Expert": return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100";
    case "Mentor": return "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100";
    default: return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
  }
};

export default function AdminLocations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  const [isPropertyTypeDialogOpen, setIsPropertyTypeDialogOpen] = useState(false);
  const [newPropertyType, setNewPropertyType] = useState("");
  const [existingPropertyTypes, setExistingPropertyTypes] = useState<any[]>([]);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [notifyLocation, setNotifyLocation] = useState<any>(null);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");

  const [editingTags, setEditingTags] = useState<{ id: string, tags: string[] } | null>(null);

  const [globalTags, setGlobalTags] = useState<{label: string, color: string}[]>([]);

  const fetchGlobalTags = async () => {
    try {
      const { data, error } = await supabase.from("global_tags").select("name").order("name");
      if (error && error.code !== '42P01') throw error;
      if (data) {
        setGlobalTags(data.map(t => ({ label: t.name, color: "bg-gray-100 text-gray-800" })));
      }
    } catch (error) {
      console.error("Error fetching global tags:", error);
    }
  };

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("shooting_locations")
        .select(`
          id,
          name,
          type,
          city,
          state,
          price,
          owner_name,
          created_by,
          tags,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast({ title: "Failed to fetch locations", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchGlobalTags();
  }, []);

  const handleDeleteLocation = async () => {
    if (!locationToDelete) return;
    try {
      const { error } = await supabase.from("shooting_locations").delete().eq("id", locationToDelete);
      if (error) throw error;
      setLocations(prev => prev.filter(l => l.id !== locationToDelete));
      toast({ title: "Location deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete location", variant: "destructive" });
    } finally {
      setLocationToDelete(null);
    }
  };

  const handleBlock = (id: string) => {
    toast({ title: "Location blocked", description: "This is a mock action for now." });
  };

  const handleOpenNotify = (loc: any) => {
    setNotifyLocation(loc);
    setNotifyTitle(`Regarding your location: ${loc.name}`);
    setNotifyMessage("");
    setIsNotifyDialogOpen(true);
  };

  const handleSendNotification = async () => {
    if (!notifyLocation || !notifyTitle.trim() || !notifyMessage.trim()) return;
    
    const targetUserId = notifyLocation.created_by;
    if (!targetUserId) {
      toast({ title: "Cannot send notification", description: "This location has no associated user.", variant: "destructive" });
      return;
    }

    try {
      const fullDescription = `${notifyMessage.trim()}\n\nLocation Details:\nName: ${notifyLocation.name}\nCity: ${notifyLocation.city}, ${notifyLocation.state}\nType: ${notifyLocation.type}`;

      const { error } = await supabase.from("notifications").insert({
        user_id: targetUserId,
        title: notifyTitle.trim(),
        description: fullDescription,
        type: 'project',
        priority: 'high',
        status: 'unread',
        action_url: `/locations/${notifyLocation.id}`
      });

      if (error) throw error;
      toast({ title: "Notification sent successfully!" });
      setIsNotifyDialogOpen(false);
    } catch (error) {
      toast({ title: "Failed to send notification", variant: "destructive" });
    }
  };

  const handleEditTags = (id: string, currentTags: string[]) => {
    setEditingTags({ id, tags: currentTags });
  };

  const handleTagToggle = (tagLabel: string) => {
    if (!editingTags) return;
    setEditingTags(prev => {
      if (!prev) return prev;
      const newTags = prev.tags.includes(tagLabel)
        ? prev.tags.filter(t => t !== tagLabel)
        : [...prev.tags, tagLabel];
      return { ...prev, tags: newTags };
    });
  };

  const handleSaveLocationTags = async (locationId: string) => {
    if (!editingTags) return;
    try {
      const { error } = await supabase
        .from('shooting_locations')
        .update({ tags: editingTags.tags })
        .eq('id', locationId);
        
      if (error) throw error;
      
      setLocations(prev => 
        prev.map(loc => 
          loc.id === locationId ? { ...loc, tags: editingTags.tags } : loc
        )
      );
      
      toast({ title: "Tags updated successfully!" });
      setEditingTags(null);
    } catch (error) {
      console.error("Error updating tags:", error);
      toast({ title: "Failed to update tags", variant: "destructive" });
    }
  };

  const filteredLocations = locations.filter(loc => {
    return loc.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           loc.city?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayout pageTitle="Shooting Locations" pageName="Locations">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shooting Locations</h1>
            <p className="text-muted-foreground mt-1">Manage listed properties</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => navigate("/locations/new")}>
              <Plus className="h-4 w-4 mr-2" />
              List Property
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl">All Locations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by property name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">Loading locations...</TableCell>
                    </TableRow>
                  ) : filteredLocations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">No locations found.</TableCell>
                    </TableRow>
                  ) : filteredLocations.map((loc) => (
                    <TableRow 
                      key={loc.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/admin-dashboard/locations/${loc.id}`)}
                    >
                      <TableCell className="font-medium">{loc.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{loc.type}</Badge>
                      </TableCell>
                      <TableCell>{loc.city}, {loc.state}</TableCell>
                      <TableCell>{loc.owner_name || "Unknown"}</TableCell>
                      <TableCell>₹{loc.price}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-wrap gap-1.5 flex-1 max-w-[280px]">
                            {!loc.tags || loc.tags.length === 0 ? (
                              <span className="text-xs text-muted-foreground italic">No tags</span>
                            ) : (
                              loc.tags.map((tag: string, index: number) => (
                                <Badge 
                                  key={index}
                                  variant="secondary" 
                                  className={cn("text-[10px] px-2 py-0.5 font-semibold", getTagBadgeStyle(tag) || "")}
                                >
                                  {tag}
                                </Badge>
                              ))
                            )}
                          </div>
                          <Popover 
                            open={editingTags?.id === loc.id}
                            onOpenChange={(open) => {
                              if (open) {
                                handleEditTags(loc.id, loc.tags || []);
                              } else {
                                setEditingTags(null);
                              }
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-yellow-50 shrink-0"
                                title="Edit Tags"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Tags className="h-3.5 w-3.5 text-yellow-600" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end" onClick={(e) => e.stopPropagation()}>
                              <Command>
                                <CommandInput placeholder="Search tags..." className="focus:ring-yellow-500" />
                                <CommandEmpty>No tags found.</CommandEmpty>
                                <CommandGroup className="max-h-[220px] overflow-y-auto">
                                  {globalTags.map((tag) => {
                                    const isSelected = editingTags?.tags.includes(tag.label);
                                    return (
                                      <CommandItem
                                        key={tag.label}
                                        onSelect={() => handleTagToggle(tag.label)}
                                        className="flex items-center gap-2 cursor-pointer py-2 hover:bg-yellow-50"
                                      >
                                        <div className={cn(
                                          "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                                          isSelected ? "bg-yellow-500 border-yellow-500" : "border-gray-200"
                                        )}>
                                          {isSelected && <Check className="h-3 w-3 text-white" />}
                                        </div>
                                        <Badge 
                                          variant="secondary"
                                          className={cn("text-xs font-semibold", getTagBadgeStyle(tag.label) || "")}
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
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
                                    onClick={() => handleSaveLocationTags(loc.id)}
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{new Date(loc.created_at).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleBlock(loc.id); }}>
                              <Ban className="mr-2 h-4 w-4" />
                              Block
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenNotify(loc); }}>
                              <Bell className="mr-2 h-4 w-4" />
                              Notify
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={(e) => { e.stopPropagation(); setLocationToDelete(loc.id); }}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={!!locationToDelete} onOpenChange={(open) => !open && setLocationToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the property listing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteLocation} className="bg-red-600 hover:bg-red-700 text-white">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-500" /> 
                Send Direct Notification
              </DialogTitle>
              <DialogDescription>
                Compose a direct system notification to <strong>{notifyLocation?.owner_name || 'Admin'}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Title</label>
                <Input 
                  placeholder="e.g. Action Required" 
                  value={notifyTitle}
                  onChange={(e) => setNotifyTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Message</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Type your message here..."
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNotifyDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSendNotification} className="bg-yellow-500 hover:bg-yellow-600 text-white">Send Notification</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
